-- Phase 1 (retry): Create gamification core without referencing new enum value in same txn
-- 0) Safely add 'alpha' enum value but DO NOT use it in this migration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'alpha'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'alpha';
  END IF;
END
$$;

-- 1) Obedience tiers
CREATE TABLE IF NOT EXISTS public.obedience_tiers (
  code text PRIMARY KEY,
  min_points integer NOT NULL,
  max_points integer,
  title text NOT NULL,
  unlocks jsonb NOT NULL DEFAULT '{}'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.obedience_tiers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='obedience_tiers' AND policyname='Obedience tiers are viewable by everyone'
  ) THEN
    CREATE POLICY "Obedience tiers are viewable by everyone"
    ON public.obedience_tiers
    FOR SELECT
    USING (true);
  END IF;
END $$;

INSERT INTO public.obedience_tiers (code, min_points, max_points, title, unlocks, order_index)
VALUES
  ('worm', 0, 199, 'Recruit #000', '{"unlocks":"Access to Daily Drills"}', 0),
  ('piglet', 200, 499, 'Sloppy Trainee', '{"unlocks":"Unlock photo task uploads"}', 1),
  ('cadet', 500, 999, 'Claimed Property', '{"unlocks":"Gain Punishment Log + Ranking display"}', 2),
  ('gagged', 1000, 1499, 'Muffled Filth', '{"unlocks":"Access to livestream rituals"}', 3),
  ('filth_sergeant', 1500, 2499, 'Ranked Sissy', '{"unlocks":"Start earning badge icons"}', 4),
  ('object', 2500, 4999, 'Class-D Beta', '{"unlocks":"Assigned personalized ritual routines"}', 5),
  ('shame_general', 5000, NULL, 'High Value Sub Asset', '{"unlocks":"Eligible for auction and public ownership bidding"}', 6)
ON CONFLICT (code) DO UPDATE
SET min_points = EXCLUDED.min_points,
    max_points = EXCLUDED.max_points,
    title = EXCLUDED.title,
    unlocks = EXCLUDED.unlocks,
    order_index = EXCLUDED.order_index;

-- 2) Ledger
CREATE TABLE IF NOT EXISTS public.obedience_points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  action_key text,
  points integer NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_op_ledger_user_created ON public.obedience_points_ledger (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_op_ledger_action_created ON public.obedience_points_ledger (action_type, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS obedience_points_ledger_unique_key
  ON public.obedience_points_ledger (user_id, action_type, action_key)
  WHERE action_key IS NOT NULL;

ALTER TABLE public.obedience_points_ledger ENABLE ROW LEVEL SECURITY;

-- Clean up any prior policy names (if partial runs happened)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='obedience_points_ledger' AND policyname='Admins and alphas can view OP ledger'
  ) THEN
    DROP POLICY "Admins and alphas can view OP ledger" ON public.obedience_points_ledger;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='obedience_points_ledger' AND policyname='Users can view their own OP ledger'
  ) THEN
    CREATE POLICY "Users can view their own OP ledger"
    ON public.obedience_points_ledger
    FOR SELECT
    USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='obedience_points_ledger' AND policyname='Admins can view OP ledger'
  ) THEN
    CREATE POLICY "Admins can view OP ledger"
    ON public.obedience_points_ledger
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- 3) Summary
CREATE TABLE IF NOT EXISTS public.user_obedience_summary (
  user_id uuid PRIMARY KEY,
  total_points integer NOT NULL DEFAULT 0,
  tier_code text REFERENCES public.obedience_tiers(code),
  alpha_approved boolean NOT NULL DEFAULT false,
  last_activity_at timestamptz,
  last_decay_run_at timestamptz,
  shame_mark boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_obedience_summary_points ON public.user_obedience_summary (total_points DESC);

ALTER TABLE public.user_obedience_summary ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_obedience_summary' AND policyname='Admins and alphas can view any OP summary'
  ) THEN
    DROP POLICY "Admins and alphas can view any OP summary" ON public.user_obedience_summary;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_obedience_summary' AND policyname='Users can view their own OP summary'
  ) THEN
    CREATE POLICY "Users can view their own OP summary"
    ON public.user_obedience_summary
    FOR SELECT
    USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_obedience_summary' AND policyname='Admins can view any OP summary'
  ) THEN
    CREATE POLICY "Admins can view any OP summary"
    ON public.user_obedience_summary
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_user_obedience_summary_updated_at ON public.user_obedience_summary;
CREATE TRIGGER update_user_obedience_summary_updated_at
BEFORE UPDATE ON public.user_obedience_summary
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Helper function for tier
CREATE OR REPLACE FUNCTION public.get_tier_for_points(_points integer)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT code
  FROM public.obedience_tiers
  WHERE min_points <= _points
    AND (max_points IS NULL OR _points <= max_points)
  ORDER BY min_points DESC
  LIMIT 1
$$;

-- 5) Ledger→Summary trigger
CREATE OR REPLACE FUNCTION public.apply_ledger_to_summary()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_obedience_summary (user_id, total_points, tier_code, last_activity_at)
    VALUES (NEW.user_id, 0, public.get_tier_for_points(0), now())
    ON CONFLICT (user_id) DO NOTHING;

    UPDATE public.user_obedience_summary
    SET total_points = total_points + NEW.points,
        last_activity_at = now(),
        tier_code = public.get_tier_for_points(total_points + NEW.points),
        updated_at = now()
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_obedience_summary
    SET total_points = GREATEST(total_points - OLD.points, 0),
        tier_code = public.get_tier_for_points(GREATEST(total_points - OLD.points, 0)),
        updated_at = now()
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_ledger_to_summary_insert ON public.obedience_points_ledger;
CREATE TRIGGER trg_apply_ledger_to_summary_insert
AFTER INSERT ON public.obedience_points_ledger
FOR EACH ROW EXECUTE FUNCTION public.apply_ledger_to_summary();

DROP TRIGGER IF EXISTS trg_apply_ledger_to_summary_delete ON public.obedience_points_ledger;
CREATE TRIGGER trg_apply_ledger_to_summary_delete
AFTER DELETE ON public.obedience_points_ledger
FOR EACH ROW EXECUTE FUNCTION public.apply_ledger_to_summary();

-- 6) Award function
CREATE OR REPLACE FUNCTION public.award_op(
  _user_id uuid,
  _action_type text,
  _action_key text,
  _base_points integer,
  _limit_per_day integer DEFAULT NULL,
  _window_hours integer DEFAULT 24,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS integer
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  cnt integer := 0;
  awarded integer := 0;
  key_exists boolean := false;
BEGIN
  IF _base_points = 0 THEN
    RETURN 0;
  END IF;

  IF _action_key IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.obedience_points_ledger
      WHERE user_id = _user_id AND action_type = _action_type AND action_key = _action_key
    ) INTO key_exists;
    IF key_exists THEN
      RETURN 0;
    END IF;
  END IF;

  IF _limit_per_day IS NOT NULL THEN
    SELECT COUNT(*) INTO cnt
    FROM public.obedience_points_ledger
    WHERE user_id = _user_id
      AND action_type = _action_type
      AND created_at >= now() - make_interval(hours => _window_hours);
    IF cnt >= _limit_per_day THEN
      RETURN 0;
    END IF;
  END IF;

  INSERT INTO public.obedience_points_ledger (user_id, action_type, action_key, points, metadata)
  VALUES (_user_id, _action_type, _action_key, _base_points, _metadata);

  awarded := _base_points;
  RETURN awarded;
END;
$$;

-- 7) Awarding triggers on existing tables
-- Posts
CREATE OR REPLACE FUNCTION public.award_op_on_post()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM public.award_op(NEW.user_id, 'post', NEW.id::text, 15, 3, 24, jsonb_build_object('source','posts'));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_op_on_post ON public.posts;
CREATE TRIGGER trg_award_op_on_post
AFTER INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.award_op_on_post();

-- Post comments
CREATE OR REPLACE FUNCTION public.award_op_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  PERFORM public.award_op(NEW.user_id, 'comment', NEW.id::text, 5, 10, 24, jsonb_build_object('source','post_comments','post_id',NEW.post_id));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_op_on_comment ON public.post_comments;
CREATE TRIGGER trg_award_op_on_comment
AFTER INSERT ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.award_op_on_comment();

-- Lesson content read
CREATE OR REPLACE FUNCTION public.award_op_on_lesson_read()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.content_read = true AND COALESCE(OLD.content_read,false) <> NEW.content_read THEN
    PERFORM public.award_op(NEW.user_id, 'read_doc', NEW.lesson_id::text, 10, NULL, 24, jsonb_build_object('source','user_lesson_progress'));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_op_on_lesson_read ON public.user_lesson_progress;
CREATE TRIGGER trg_award_op_on_lesson_read
AFTER UPDATE ON public.user_lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.award_op_on_lesson_read();

-- Submissions
CREATE OR REPLACE FUNCTION public.award_op_on_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.task_id IS NOT NULL THEN
    PERFORM public.award_op(NEW.user_id, 'task_complete', NEW.id::text, 25, 3, 24, jsonb_build_object('source','submissions','task_id',NEW.task_id));
  END IF;
  IF NEW.assignment_id IS NOT NULL THEN
    PERFORM public.award_op(NEW.user_id, 'assignment_complete', NEW.id::text, 50, 1, 24, jsonb_build_object('source','submissions','assignment_id',NEW.assignment_id));
  END IF;
  IF NEW.media_url IS NOT NULL THEN
    PERFORM public.award_op(NEW.user_id, 'media_upload', NEW.id::text, 40, 2, 24, jsonb_build_object('source','submissions'));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_op_on_submission ON public.submissions;
CREATE TRIGGER trg_award_op_on_submission
AFTER INSERT ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.award_op_on_submission();

-- Tributes
CREATE OR REPLACE FUNCTION public.award_op_on_tribute()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  amt integer;
BEGIN
  IF NEW.status IN ('paid','completed') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    amt := COALESCE(NEW.amount, 0);
    IF amt > 0 THEN
      PERFORM public.award_op(NEW.user_id, 'tribute_paid', NEW.id::text, amt, NULL, 24, jsonb_build_object('source','tributes','currency',NEW.currency));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_op_on_tribute ON public.tributes;
CREATE TRIGGER trg_award_op_on_tribute
AFTER UPDATE ON public.tributes
FOR EACH ROW EXECUTE FUNCTION public.award_op_on_tribute();
