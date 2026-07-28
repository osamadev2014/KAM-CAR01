create table public.auctions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  car_id uuid not null references public.cars(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  dealer_id uuid references public.dealers(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'active', 'ended', 'cancelled')),
  start_price numeric(12,2) not null,
  reserve_price numeric(12,2),
  buy_now_price numeric(12,2),
  bid_increment numeric(12,2) not null default 500,
  current_price numeric(12,2),
  winner_id uuid references auth.users(id),
  winning_bid numeric(12,2),
  start_time timestamptz,
  end_time timestamptz,
  bid_count integer default 0,
  viewer_count integer default 0,
  terms text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.auction_bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  is_winning boolean default false,
  created_at timestamptz not null default now()
);

create table public.auction_watchers (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(auction_id, user_id)
);

create index idx_auctions_slug on public.auctions(slug);
create index idx_auctions_status on public.auctions(status);
create index idx_auctions_end_time on public.auctions(end_time) where status = 'active';
create index idx_auctions_car on public.auctions(car_id);
create index idx_auctions_seller on public.auctions(seller_id);
create index idx_auction_bids_auction on public.auction_bids(auction_id);
create index idx_auction_bids_amount on public.auction_bids(auction_id, amount desc);
create index idx_auction_watchers_user on public.auction_watchers(user_id);

alter table public.auctions enable row level security;
alter table public.auction_bids enable row level security;
alter table public.auction_watchers enable row level security;

create policy "Public can view active auctions"
  on public.auctions for select
  using (status in ('active', 'ended'));

create policy "Seller can manage own auctions"
  on public.auctions for all
  using (auth.uid() = seller_id);

create policy "Admin can manage all auctions"
  on public.auctions for all
  using (public.is_admin());

create policy "Authenticated users can place bids"
  on public.auction_bids for insert
  with check (auth.uid() = bidder_id);

create policy "Public can view bids"
  on public.auction_bids for select
  using (true);

create policy "Authenticated users can manage own bids"
  on public.auction_bids for all
  using (auth.uid() = bidder_id);

create policy "Authenticated users can manage watchlist"
  on public.auction_watchers for all
  using (auth.uid() = user_id);

create or replace function public.update_auction_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger auctions_updated_at
  before update on public.auctions
  for each row execute function public.update_auction_updated_at();

create or replace function public.handle_new_bid()
returns trigger as $$
begin
  update public.auctions set
    current_price = new.amount,
    bid_count = bid_count + 1
  where id = new.auction_id;

  update public.auction_bids set is_winning = false
  where auction_id = new.auction_id and is_winning = true;

  update public.auction_bids set is_winning = true
  where id = new.id;

  return new;
end;
$$ language plpgsql;

create trigger on_new_bid
  after insert on public.auction_bids
  for each row execute function public.handle_new_bid();
