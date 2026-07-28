create table public.finance_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  website_url text,
  phone text,
  email text,
  revenue_model text default 'per_lead' check (revenue_model in ('per_lead', 'percentage', 'per_approved')),
  revenue_per_lead numeric(10,2) default 0,
  revenue_percentage numeric(5,2) default 0,
  revenue_per_approved numeric(10,2) default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finance_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid not null references public.finance_partners(id) on delete cascade,
  car_id uuid references public.cars(id) on delete set null,
  vehicle_price numeric(12,2) not null,
  down_payment numeric(12,2) not null default 0,
  requested_amount numeric(12,2) not null,
  monthly_income numeric(12,2),
  employment_status text,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'rejected', 'expired')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.finance_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.finance_requests(id) on delete cascade,
  partner_id uuid not null references public.finance_partners(id) on delete cascade,
  monthly_payment numeric(10,2) not null,
  interest_rate numeric(5,2) not null,
  term_months integer not null,
  approved_amount numeric(12,2) not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'expired')),
  created_at timestamptz not null default now()
);

create index idx_finance_partners_slug on public.finance_partners(slug);
create index idx_finance_requests_customer on public.finance_requests(customer_id);
create index idx_finance_requests_partner on public.finance_requests(partner_id);
create index idx_finance_requests_status on public.finance_requests(status);
create index idx_finance_offers_request on public.finance_offers(request_id);

alter table public.finance_partners enable row level security;
alter table public.finance_requests enable row level security;
alter table public.finance_offers enable row level security;

create policy "Public can view active partners"
  on public.finance_partners for select
  using (is_active = true);

create policy "Admin can manage partners"
  on public.finance_partners for all
  using (public.is_admin());

create policy "Customer can view own requests"
  on public.finance_requests for select
  using (auth.uid() = customer_id);

create policy "Customer can create requests"
  on public.finance_requests for insert
  with check (auth.uid() = customer_id);

create policy "Admin can manage all requests"
  on public.finance_requests for all
  using (public.is_admin());

create policy "Customer can view own offers"
  on public.finance_offers for select
  using (
    exists (
      select 1 from public.finance_requests r
      where r.id = finance_offers.request_id
      and r.customer_id = auth.uid()
    )
  );

create policy "Admin can manage all offers"
  on public.finance_offers for all
  using (public.is_admin());

create or replace function public.update_finance_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger finance_partners_updated_at
  before update on public.finance_partners
  for each row execute function public.update_finance_updated_at();

create trigger finance_requests_updated_at
  before update on public.finance_requests
  for each row execute function public.update_finance_updated_at();
