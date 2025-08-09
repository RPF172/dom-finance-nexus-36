-- Create intake_forms table for ritual intake submissions
create table if not exists public.intake_forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Section 1: Identification & Branding
  first_name text not null,
  sissy_name text not null,
  recruit_number text not null,
  enlistment_at timestamptz not null default now(),

  -- Section 2: Filth Metrics
  kinks text[] not null default '{}',
  hard_limits text null,
  experience_level text not null,
  orgasm_frequency integer not null default 0,

  -- Section 3: Ritual Consent
  consent_forfeit boolean not null default false,
  consent_content boolean not null default false,
  consent_monitored boolean not null default false,
  signature text not null,
  consent_signed_at timestamptz not null default now()
);

-- Enable RLS
alter table public.intake_forms enable row level security;

-- Policies
create policy if not exists "Users can insert their own intake" on public.intake_forms
for insert with check (auth.uid() = user_id);

create policy if not exists "Users can view their own intake" on public.intake_forms
for select using (auth.uid() = user_id);

create policy if not exists "Admins can view all intake" on public.intake_forms
for select using (public.has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger for updated_at
create trigger set_intake_forms_updated_at
before update on public.intake_forms
for each row execute function public.update_updated_at_column();