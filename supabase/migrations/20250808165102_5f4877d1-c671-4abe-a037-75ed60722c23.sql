-- Harden RPCs: set immutable search_path for security definer functions
CREATE OR REPLACE FUNCTION public.get_profile_overview(
  _target_user_id uuid,
  _viewer_user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE(
  user_id uuid,
  display_name text,
  avatar_url text,
  cover_photo_url text,
  is_premium boolean,
  premium_color text,
  joined_at timestamp with time zone,
  posts_count bigint,
  likes_received_count bigint,
  comments_received_count bigint,
  lessons_completed_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  WITH perms AS (
    SELECT
      _viewer_user_id = _target_user_id OR public.has_role(_viewer_user_id,'admin') AS is_self_or_admin,
      public.are_users_connected(_target_user_id, _viewer_user_id) AS are_friends
  ), prof AS (
    SELECT p.user_id, p.display_name, p.avatar_url, p.cover_photo_url, p.is_premium, p.premium_color, p.created_at AS joined_at
    FROM public.profiles p
    WHERE p.user_id = _target_user_id
  ), visible_posts AS (
    SELECT po.*
    FROM public.posts po, perms
    WHERE po.user_id = _target_user_id
      AND (
        po.privacy_level = 'public'
        OR po.user_id = _viewer_user_id
        OR (po.privacy_level = 'friends' AND perms.are_friends)
      )
  ), counts AS (
    SELECT
      (SELECT COUNT(*) FROM visible_posts) AS posts_count,
      (SELECT COALESCE(SUM(likes_count),0) FROM public.posts po WHERE po.user_id = _target_user_id) AS likes_received_count,
      (SELECT COALESCE(SUM(comments_count),0) FROM public.posts po2 WHERE po2.user_id = _target_user_id) AS comments_received_count,
      (SELECT CASE WHEN (SELECT is_self_or_admin FROM perms) THEN COUNT(*) ELSE NULL END
         FROM public.user_lesson_progress ulp
         WHERE ulp.user_id = _target_user_id AND ulp.completed = true) AS lessons_completed_count
  )
  SELECT prof.user_id, prof.display_name, prof.avatar_url, prof.cover_photo_url, prof.is_premium, prof.premium_color, prof.joined_at,
         counts.posts_count, counts.likes_received_count, counts.comments_received_count, counts.lessons_completed_count
  FROM prof, counts;
$function$;

CREATE OR REPLACE FUNCTION public.get_recent_activity(
  _target_user_id uuid,
  _viewer_user_id uuid DEFAULT auth.uid(),
  _limit integer DEFAULT 10
)
RETURNS TABLE(
  activity_type text,
  id uuid,
  occurred_at timestamp with time zone,
  title text,
  description text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  WITH perms AS (
    SELECT
      _viewer_user_id = _target_user_id OR public.has_role(_viewer_user_id,'admin') AS is_self_or_admin,
      public.are_users_connected(_target_user_id, _viewer_user_id) AS are_friends
  ), visible_posts AS (
    SELECT 'post'::text AS activity_type, po.id, po.created_at AS occurred_at,
           COALESCE(NULLIF(po.content, ''), 'New post') AS title,
           COALESCE(po.link_title, po.post_type::text) AS description
    FROM public.posts po, perms
    WHERE po.user_id = _target_user_id
      AND (
        po.privacy_level = 'public'
        OR po.user_id = _viewer_user_id
        OR (po.privacy_level = 'friends' AND perms.are_friends)
      )
  ), lesson_completions AS (
    SELECT 'lesson'::text AS activity_type, ulp.id, COALESCE(ulp.completed_at, ulp.updated_at, ulp.created_at) AS occurred_at,
           'Lesson completed' AS title,
           ''::text AS description
    FROM public.user_lesson_progress ulp, perms
    WHERE ulp.user_id = _target_user_id AND ulp.completed = true AND (perms.is_self_or_admin)
  )
  SELECT * FROM (
    SELECT * FROM visible_posts
    UNION ALL
    SELECT * FROM lesson_completions
  ) u
  ORDER BY occurred_at DESC
  LIMIT _limit;
$function$;