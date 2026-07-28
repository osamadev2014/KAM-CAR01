create table public.ad_placements (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  width integer,
  height integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.advertisers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  website_url text,
  contact_email text,
  contact_phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references public.advertisers(id) on delete cascade,
  name text not null,
  type text not null default 'banner' check (type in ('banner', 'featured_listing', 'sponsored')),
  placement_id uuid references public.ad_placements(id) on delete set null,
  budget numeric(12,2) not null default 0,
  spent numeric(12,2) not null default 0,
  start_date date not null,
  end_date date not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed', 'cancelled')),
  media_url text,
  target_url text,
  title text,
  description text,
  impressions_count integer default 0,
  clicks_count integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ad_impressions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_ad_placements_slug on public.ad_placements(slug);
create index idx_advertisers_slug on public.advertisers(slug);
create index idx_ad_campaigns_advertiser on public.ad_campaigns(advertiser_id);
create index idx_ad_campaigns_status_dates on public.ad_campaigns(status, start_date, end_date);
create index idx_ad_campaigns_placement on public.ad_campaigns(placement_id);
create index idx_ad_impressions_campaign on public.ad_impressions(campaign_id);
create index idx_ad_clicks_campaign on public.ad_clicks(campaign_id);

alter table public.ad_placements enable row level security;
alter table public.advertisers enable row level security;
alter table public.ad_campaigns enable row level security;
alter table public.ad_impressions enable row level security;
alter table public.ad_clicks enable row level security;

create policy "Public can view active placements"
  on public.ad_placements for select
  using (is_active = true);

create policy "Admin can manage placements"
  on public.ad_placements for all
  using (public.is_admin());

create policy "Public can view active advertisers"
  on public.advertisers for select
  using (is_active = true);

create policy "Admin can manage advertisers"
  on public.advertisers for all
  using (public.is_admin());

create policy "Admin can manage campaigns"
  on public.ad_campaigns for all
  using (public.is_admin());

create policy "Advertiser can view own campaigns"
  on public.ad_campaigns for select
  using (
    exists (
      select 1 from public.advertisers a
      where a.id = ad_campaigns.advertiser_id
    )
  );

create policy "Anyone can record impressions"
  on public.ad_impressions for insert
  with check (true);

create policy "Admin can view impressions"
  on public.ad_impressions for select
  using (public.is_admin());

create policy "Anyone can record clicks"
  on public.ad_clicks for insert
  with check (true);

create policy "Admin can view clicks"
  on public.ad_clicks for select
  using (public.is_admin());

create or replace function public.update_advertiser_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger advertisers_updated_at
  before update on public.advertisers
  for each row execute function public.update_advertiser_updated_at();

create trigger ad_campaigns_updated_at
  before update on public.ad_campaigns
  for each row execute function public.update_advertiser_updated_at();
