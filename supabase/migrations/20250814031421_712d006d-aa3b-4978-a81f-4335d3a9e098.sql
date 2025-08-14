-- Add foreign key relationships that were missing
ALTER TABLE public.peer_discussions 
ADD CONSTRAINT fk_peer_discussions_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.discussion_replies 
ADD CONSTRAINT fk_discussion_replies_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.discussion_replies 
ADD CONSTRAINT fk_discussion_replies_discussion_id 
FOREIGN KEY (discussion_id) REFERENCES public.peer_discussions(id) ON DELETE CASCADE;

ALTER TABLE public.study_groups 
ADD CONSTRAINT fk_study_groups_created_by 
FOREIGN KEY (created_by) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.study_group_members 
ADD CONSTRAINT fk_study_group_members_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.study_group_members 
ADD CONSTRAINT fk_study_group_members_study_group_id 
FOREIGN KEY (study_group_id) REFERENCES public.study_groups(id) ON DELETE CASCADE;