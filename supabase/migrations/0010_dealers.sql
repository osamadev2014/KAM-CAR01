-- Fix: ensure is_admin() no-arg overload exists (original only had is_admin(uid uuid))
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

create table public.dealers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  cover_url text,
  phone text,
  email text,
  city text,
  is_active boolean not null default true,
  is_approved boolean not null default false,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dealer_branches (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  name text not null,
  city text,
  address text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table public.dealer_users (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'employee' check (role in ('employee', 'manager', 'admin')),
  permissions jsonb default '{}',
  created_at timestamptz not null default now(),
  unique(dealer_id, user_id)
);

create table public.dealer_stats (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  stat_date date not null default current_date,
  listings_count integer default 0,
  views_count integer default 0,
  inquiries_count integer default 0,
  sales_count integer default 0,
  revenue numeric(12,2) default 0,
  unique(dealer_id, stat_date)
);

alter table public.cars add column dealer_id uuid references public.dealers(id) on delete set null;

create index idx_dealers_owner on public.dealers(owner_id);
create index idx_dealers_slug on public.dealers(slug);
create index idx_dealers_approved on public.dealers(is_approved) where is_active = true;
create index idx_dealer_branches_dealer on public.dealer_branches(dealer_id);
create index idx_dealer_users_dealer on public.dealer_users(dealer_id);
create index idx_dealer_users_user on public.dealer_users(user_id);
create index idx_dealer_stats_dealer_date on public.dealer_stats(dealer_id, stat_date);
create index idx_cars_dealer on public.cars(dealer_id);

alter table public.dealers enable row level security;
alter table public.dealer_branches enable row level security;
alter table public.dealer_users enable row level security;
alter table public.dealer_stats enable row level security;

create policy "Public can view active approved dealers"
  on public.dealers for select
  using (is_active = true and is_approved = true);

create policy "Owner can manage own dealer"
  on public.dealers for all
  using (auth.uid() = owner_id);

create policy "Admin can manage all dealers"
  on public.dealers for all
  using (public.is_admin());

create policy "Public can view dealer branches"
  on public.dealer_branches for select
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_branches.dealer_id
      and d.is_active = true and d.is_approved = true
    )
  );

create policy "Dealer owner can manage branches"
  on public.dealer_branches for all
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_branches.dealer_id
      and d.owner_id = auth.uid()
    )
  );

create policy "Admin can manage all branches"
  on public.dealer_branches for all
  using (public.is_admin());

create policy "Dealer owner can manage users"
  on public.dealer_users for all
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_users.dealer_id
      and d.owner_id = auth.uid()
    )
  );

create policy "Admin can manage all dealer users"
  on public.dealer_users for all
  using (public.is_admin());

create policy "Dealer owner can view stats"
  on public.dealer_stats for select
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_stats.dealer_id
      and d.owner_id = auth.uid()
    )
  );

create policy "Admin can view all dealer stats"
  on public.dealer_stats for select
  using (public.is_admin());

create or replace function public.update_dealer_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger dealers_updated_at
  before update on public.dealers
  for each row execute function public.update_dealer_updated_at();

create or replace function public.update_dealer_rating()
returns trigger as $$
begin
  update public.dealers set
    rating = coalesce((select avg(rating) from public.dealer_reviews where dealer_id = new.dealer_id), 0),
    review_count = (select count(*) from public.dealer_reviews where dealer_id = new.dealer_id)
  where id = new.dealer_id;
  return new;
end;
$$ language plpgsql;
