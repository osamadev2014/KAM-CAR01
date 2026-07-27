alter table public.cars drop constraint if exists cars_make_model_idx;
drop index if exists cars_make_model_idx;

alter table public.cars
  add column make_id  uuid references public.car_makes(id),
  add column model_id uuid references public.car_models(id);

alter table public.cars drop column make;
alter table public.cars drop column model;

alter table public.cars alter column make_id  set not null;
alter table public.cars alter column model_id set not null;

create index cars_make_model_idx on public.cars (make_id, model_id);
