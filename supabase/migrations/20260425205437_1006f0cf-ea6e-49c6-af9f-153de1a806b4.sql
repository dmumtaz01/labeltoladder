-- 1. CONSENTS ---------------------------------------------------------------
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  version text not null default 'v1',
  accepted_at timestamptz not null default now(),
  unique (user_id, version)
);
alter table public.consents enable row level security;

create policy "users read own consents" on public.consents
  for select to authenticated using (auth.uid() = user_id);
create policy "users insert own consents" on public.consents
  for insert to authenticated with check (auth.uid() = user_id);
create policy "admins read all consents" on public.consents
  for select to authenticated using (has_role(auth.uid(), 'admin'));

-- 2. ANNOTATION JOBS --------------------------------------------------------
create table public.annotation_jobs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.employer_tasks(id) on delete cascade,
  candidate_id uuid not null,
  status text not null default 'assigned', -- assigned | submitted | approved | rejected
  payload jsonb,                            -- the actual item to annotate
  submission jsonb,                         -- candidate's submitted answer
  payout_cents integer not null default 0,
  assigned_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.annotation_jobs enable row level security;
create trigger annotation_jobs_set_updated_at before update on public.annotation_jobs
  for each row execute function public.set_updated_at();

create policy "candidate reads own jobs" on public.annotation_jobs
  for select to authenticated using (auth.uid() = candidate_id);
create policy "candidate updates own jobs" on public.annotation_jobs
  for update to authenticated using (auth.uid() = candidate_id);
create policy "candidate inserts own jobs" on public.annotation_jobs
  for insert to authenticated with check (auth.uid() = candidate_id);
create policy "employer reads jobs on own tasks" on public.annotation_jobs
  for select to authenticated using (
    exists (select 1 from public.employer_tasks t
            where t.id = annotation_jobs.task_id and t.employer_id = auth.uid())
  );
create policy "employer updates jobs on own tasks" on public.annotation_jobs
  for update to authenticated using (
    exists (select 1 from public.employer_tasks t
            where t.id = annotation_jobs.task_id and t.employer_id = auth.uid())
  );
create policy "admins manage annotation jobs" on public.annotation_jobs
  for all to authenticated using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

-- 3. QUALITY REVIEWS --------------------------------------------------------
create table public.quality_reviews (
  id uuid primary key default gen_random_uuid(),
  annotation_job_id uuid not null references public.annotation_jobs(id) on delete cascade,
  reviewer text not null default 'ai',     -- ai | employer | admin
  score numeric(4,2) not null,             -- 0.00 - 1.00
  feedback text,
  created_at timestamptz not null default now()
);
alter table public.quality_reviews enable row level security;

create policy "candidate reads reviews of own work" on public.quality_reviews
  for select to authenticated using (
    exists (select 1 from public.annotation_jobs j
            where j.id = quality_reviews.annotation_job_id and j.candidate_id = auth.uid())
  );
create policy "employer reads reviews on own tasks" on public.quality_reviews
  for select to authenticated using (
    exists (select 1 from public.annotation_jobs j
            join public.employer_tasks t on t.id = j.task_id
            where j.id = quality_reviews.annotation_job_id and t.employer_id = auth.uid())
  );
create policy "anyone authenticated can insert ai review" on public.quality_reviews
  for insert to authenticated with check (true);
create policy "admins manage reviews" on public.quality_reviews
  for all to authenticated using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

-- 4. PAYMENTS ---------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  annotation_job_id uuid references public.annotation_jobs(id) on delete set null,
  amount_cents integer not null,
  currency text not null default 'USD',
  status text not null default 'pending', -- pending | paid | failed
  reference text,
  created_at timestamptz not null default now()
);
alter table public.payments enable row level security;

create policy "candidate reads own payments" on public.payments
  for select to authenticated using (auth.uid() = candidate_id);
create policy "admins manage payments" on public.payments
  for all to authenticated using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));

-- 5. LEADERBOARD VIEW -------------------------------------------------------
create or replace view public.leaderboard_stats
with (security_invoker = true) as
select
  cp.user_id,
  coalesce(p.full_name, 'Anonymous') as full_name,
  coalesce(cp.level, 0) as level,
  coalesce(round(((cp.test_results->>'rawScore')::numeric) * 1000)::int, 0) as points,
  (select count(*) from public.annotation_jobs j
     where j.candidate_id = cp.user_id and j.status = 'approved') as approved_jobs,
  (select coalesce(sum(amount_cents),0) from public.payments
     where candidate_id = cp.user_id and status = 'paid') as earned_cents
from public.candidate_profiles cp
left join public.profiles p on p.id = cp.user_id;