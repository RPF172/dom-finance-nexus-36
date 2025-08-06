-- Create the new week-based content structure

-- Create weeks table
CREATE TABLE IF NOT EXISTS public.weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    objective TEXT,
    total_modules INTEGER DEFAULT 0,
    total_tasks INTEGER DEFAULT 0,
    total_assignments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create new modules table (different from existing one)
CREATE TABLE IF NOT EXISTS public.week_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing assignments table to reference weeks
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE;

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
    text_response TEXT,
    media_url TEXT,
    metadata JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review steps table
CREATE TABLE IF NOT EXISTS public.review_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES public.weeks(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create step progress table
CREATE TABLE IF NOT EXISTS public.step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    review_step_id UUID REFERENCES public.review_steps(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.week_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for weeks
CREATE POLICY "Weeks are viewable by everyone" ON public.weeks FOR SELECT USING (true);
CREATE POLICY "Admins can manage weeks" ON public.weeks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for week_modules
CREATE POLICY "Week modules are viewable by everyone" ON public.week_modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage week modules" ON public.week_modules FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for tasks
CREATE POLICY "Tasks are viewable by everyone" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Admins can manage tasks" ON public.tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for submissions
CREATE POLICY "Users can view their own submissions" ON public.submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own submissions" ON public.submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own submissions" ON public.submissions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all submissions" ON public.submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for review_steps
CREATE POLICY "Review steps are viewable by everyone" ON public.review_steps FOR SELECT USING (true);
CREATE POLICY "Admins can manage review steps" ON public.review_steps FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for step_progress
CREATE POLICY "Users can view their own step progress" ON public.step_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own step progress" ON public.step_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all step progress" ON public.step_progress FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_weeks_updated_at 
    BEFORE UPDATE ON public.weeks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_week_modules_updated_at 
    BEFORE UPDATE ON public.week_modules 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON public.tasks 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_steps_updated_at 
    BEFORE UPDATE ON public.review_steps 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();