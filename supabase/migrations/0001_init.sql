create extension if not exists pgcrypto;

create type car_condition as enum ('new', 'used');
create type car_status    as enum ('draft', 'published', 'sold');

create table public.cars (
  id            uuid primary key default gen_random_uuid(),

  title         text not null,

  make          text not null,
  model         text not null,
  trim          text,
  year          int  not null check (year between 1990 and extract(year from now())::int + 1),

  condition     car_condition not null default 'new',
  status        car_status    not null default 'draft',

  price_cash               numeric(12,2) not null check (price_cash >= 0),
  price_installment_month  numeric(12,2) check (price_installment_month >= 0),

  exterior_color   text,
  interior_color   text,
  origin           text,
  fuel_type        text,
  transmission     text,
  gear_count       int,
  cylinders        int,
  engine_size      numeric(4,1),
  drivetrain       text,
  keys_count       int,
  seats_count      int,
  engine_type      text,
  fuel_tank_liters numeric(6,1),
  horsepower       int,
  fuel_consumption_km_l numeric(5,1),

  warranty     text,
  dealer       text,
  description  text,

  features     jsonb not null default '{}'::jsonb,

  ad_number    text unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index cars_status_idx      on public.cars (status);
create index cars_make_model_idx  on public.cars (make, model);
create index cars_created_at_idx  on public.cars (created_at desc);

create table public.car_images (
  id          uuid primary key default gen_random_uuid(),
  car_id      uuid not null references public.cars(id) on delete cascade,
  url         text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index car_images_car_id_idx on public.car_images (car_id, sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cars_set_updated_at
before update on public.cars
for each row execute function public.set_updated_at();
