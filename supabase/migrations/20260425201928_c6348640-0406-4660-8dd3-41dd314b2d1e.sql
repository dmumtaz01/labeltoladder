-- Roles enum
create type public.app_role as enum ('admin', 'employer', 'candidate');

-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- user_roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- has_role security definer
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- candidate_profiles
create table public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  onboarding jsonb,
  screener jsonb,
  test_results jsonb,
  level int,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.candidate_profiles enable row level security;

-- employer_tasks
create table public.employer_tasks (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references auth.users(id) on delete cascade,
  employer_name text not null,
  title text not null,
  category text not null check (category in ('annotation','rating','review','translation','training')),
  min_level int not null default 1,
  languages text[] not null default '{}',
  hourly text not null,
  hours_estimate int not null default 10,
  description text not null,
  created_at timestamptz not null default now()
);
alter table public.employer_tasks enable row level security;

-- applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.employer_tasks(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  applied_at timestamptz not null default now(),
  unique (task_id, candidate_id)
);
alter table public.applications enable row level security;

-- profiles RLS
create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "admins read all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
-- employers can read profiles of candidates who applied to their tasks
create policy "employers read applicant profiles" on public.profiles for select to authenticated using (
  exists (
    select 1 from public.applications a
    join public.employer_tasks t on t.id = a.task_id
    where a.candidate_id = profiles.id and t.employer_id = auth.uid()
  )
);

-- user_roles RLS
create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- candidate_profiles RLS
create policy "candidates read own" on public.candidate_profiles for select to authenticated using (auth.uid() = user_id);
create policy "candidates upsert own" on public.candidate_profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "candidates update own" on public.candidate_profiles for update to authenticated using (auth.uid() = user_id);
create policy "admins read all candidates" on public.candidate_profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "employers read applicant candidate" on public.candidate_profiles for select to authenticated using (
  exists (
    select 1 from public.applications a
    join public.employer_tasks t on t.id = a.task_id
    where a.candidate_id = candidate_profiles.user_id and t.employer_id = auth.uid()
  )
);

-- employer_tasks RLS
create policy "anyone signed in reads tasks" on public.employer_tasks for select to authenticated using (true);
create policy "employers insert own tasks" on public.employer_tasks for insert to authenticated with check (auth.uid() = employer_id);
create policy "employers update own tasks" on public.employer_tasks for update to authenticated using (auth.uid() = employer_id);
create policy "employers delete own tasks" on public.employer_tasks for delete to authenticated using (auth.uid() = employer_id);
create policy "admins manage tasks" on public.employer_tasks for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- applications RLS
create policy "candidates read own apps" on public.applications for select to authenticated using (auth.uid() = candidate_id);
create policy "candidates insert own apps" on public.applications for insert to authenticated with check (auth.uid() = candidate_id);
create policy "candidates delete own apps" on public.applications for delete to authenticated using (auth.uid() = candidate_id);
create policy "employers read apps for their tasks" on public.applications for select to authenticated using (
  exists (select 1 from public.employer_tasks t where t.id = applications.task_id and t.employer_id = auth.uid())
);
create policy "admins read all apps" on public.applications for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_candidate_profiles_updated before update on public.candidate_profiles for each row execute function public.set_updated_at();

-- Auto-create profile + candidate role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  insert into public.user_roles (user_id, role) values (new.id, 'candidate');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();