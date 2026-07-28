create table public.inspection_centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  phone text,
  email text,
  city text,
  address text,
  lat double precision,
  lng double precision,
  is_active boolean not null default true,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspection_services (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes integer not null default 60,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.inspection_appointments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  service_id uuid not null references public.inspection_services(id) on delete cascade,
  customer_id uuid not null references auth.users(id) on delete cascade,
  car_id uuid references public.cars(id) on delete set null,
  appointment_date timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  price numeric(10,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspection_reports (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.inspection_appointments(id) on delete cascade,
  center_id uuid not null references public.inspection_centers(id) on delete cascade,
  car_id uuid references public.cars(id) on delete set null,
  score integer default 0,
  max_score integer default 100,
  outcome text check (outcome in ('pass', 'conditional_pass', 'fail')),
  summary text,
  recommendation text,
  estimated_repair_cost numeric(10,2),
  is_public boolean default false,
  share_token text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspection_report_sections (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.inspection_reports(id) on delete cascade,
  name text not null,
  score integer default 0,
  max_score integer default 100,
  notes text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create table public.inspection_report_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.inspection_report_sections(id) on delete cascade,
  name text not null,
  status text check (status in ('good', 'fair', 'poor', 'critical')),
  score integer default 0,
  notes text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create index idx_inspection_centers_slug on public.inspection_centers(slug);
create index idx_inspection_centers_city on public.inspection_centers(city);
create index idx_inspection_services_center on public.inspection_services(center_id);
create index idx_inspection_appointments_customer on public.inspection_appointments(customer_id);
create index idx_inspection_appointments_center on public.inspection_appointments(center_id);
create index idx_inspection_appointments_date on public.inspection_appointments(appointment_date);
create index idx_inspection_reports_appointment on public.inspection_reports(appointment_id);
create index idx_inspection_reports_car on public.inspection_reports(car_id);
create index idx_inspection_reports_share on public.inspection_reports(share_token);
create index idx_inspection_report_sections_report on public.inspection_report_sections(report_id);
create index idx_inspection_report_items_section on public.inspection_report_items(section_id);

alter table public.inspection_centers enable row level security;
alter table public.inspection_services enable row level security;
alter table public.inspection_appointments enable row level security;
alter table public.inspection_reports enable row level security;
alter table public.inspection_report_sections enable row level security;
alter table public.inspection_report_items enable row level security;

create policy "Public can view active centers"
  on public.inspection_centers for select
  using (is_active = true);

create policy "Admin can manage centers"
  on public.inspection_centers for all
  using (public.is_admin());

create policy "Public can view active services"
  on public.inspection_services for select
  using (is_active = true);

create policy "Admin can manage services"
  on public.inspection_services for all
  using (public.is_admin());

create policy "Customer can view own appointments"
  on public.inspection_appointments for select
  using (auth.uid() = customer_id);

create policy "Customer can create appointments"
  on public.inspection_appointments for insert
  with check (auth.uid() = customer_id);

create policy "Admin can manage all appointments"
  on public.inspection_appointments for all
  using (public.is_admin());

create policy "Public can view public reports"
  on public.inspection_reports for select
  using (is_public = true);

create policy "Customer can view own reports"
  on public.inspection_reports for select
  using (
    exists (
      select 1 from public.inspection_appointments a
      where a.id = inspection_reports.appointment_id
      and a.customer_id = auth.uid()
    )
  );

create policy "Admin can manage all reports"
  on public.inspection_reports for all
  using (public.is_admin());

create policy "Admin can manage report sections"
  on public.inspection_report_sections for all
  using (public.is_admin());

create policy "Public can view public report sections"
  on public.inspection_report_sections for select
  using (
    exists (
      select 1 from public.inspection_reports r
      where r.id = inspection_report_sections.report_id
      and r.is_public = true
    )
  );

create policy "Admin can manage report items"
  on public.inspection_report_items for all
  using (public.is_admin());

create policy "Public can view public report items"
  on public.inspection_report_items for select
  using (
    exists (
      select 1 from public.inspection_report_sections s
      join public.inspection_reports r on r.id = s.report_id
      where s.id = inspection_report_items.section_id
      and r.is_public = true
    )
  );

create or replace function public.update_inspection_center_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger inspection_centers_updated_at
  before update on public.inspection_centers
  for each row execute function public.update_inspection_center_updated_at();

create trigger inspection_appointments_updated_at
  before update on public.inspection_appointments
  for each row execute function public.update_inspection_center_updated_at();

create trigger inspection_reports_updated_at
  before update on public.inspection_reports
  for each row execute function public.update_inspection_center_updated_at();
