create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  currency text not null default 'SAR',
  status text not null default 'pending' check (status in ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled')),
  type text not null check (type in ('subscription', 'listing_fee', 'auction_deposit', 'ad_payment', 'inspection_fee')),
  reference_id uuid,
  reference_type text,
  stripe_payment_id text,
  stripe_session_id text,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_name text not null,
  plan_price numeric(10,2) not null,
  billing_period text not null default 'monthly' check (billing_period in ('monthly', 'yearly')),
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_user on public.payments(user_id);
create index idx_payments_status on public.payments(status);
create index idx_payments_type on public.payments(type);
create index idx_payments_stripe on public.payments(stripe_payment_id);
create index idx_subscriptions_user on public.subscriptions(user_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_subscriptions_stripe on public.subscriptions(stripe_subscription_id);

alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;

create policy "User can view own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "User can create own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Admin can manage all payments"
  on public.payments for all
  using (public.is_admin());

create policy "User can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "User can create own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Admin can manage all subscriptions"
  on public.subscriptions for all
  using (public.is_admin());

create or replace function public.update_payment_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.update_payment_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_payment_updated_at();
