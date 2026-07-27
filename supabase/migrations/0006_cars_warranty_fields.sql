alter table public.cars
  add column warranty_years        int  check (warranty_years between 0 and 10),
  add column warranty_km           int  check (warranty_km >= 0),
  add column warranty_unlimited_km boolean not null default false;

alter table public.cars drop column if exists warranty;
