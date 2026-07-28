-- Drop old permissive policies on cars
drop policy if exists "admin read all cars" on public.cars;
drop policy if exists "admin insert cars" on public.cars;
drop policy if exists "admin update cars" on public.cars;
drop policy if exists "admin delete cars" on public.cars;

-- Drop old permissive policies on car_images
drop policy if exists "admin read all images" on public.car_images;
drop policy if exists "admin write images" on public.car_images;

-- Cars: admin full access
create policy "admin full access cars"
on public.cars for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Cars: dealer can insert
create policy "dealer insert cars"
on public.cars for insert
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'dealer'
  )
);

-- Cars: dealer can update own cars
create policy "dealer update cars"
on public.cars for update
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'dealer'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'dealer'
  )
);

-- Cars: dealer can delete own cars
create policy "dealer delete cars"
on public.cars for delete
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'dealer'
  )
);

-- Car images: admin full access
create policy "admin full access images"
on public.car_images for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- Car images: dealer can manage images for their cars
create policy "dealer manage own car images"
on public.car_images for all
using (
  exists (
    select 1 from public.profiles p
    join public.cars c on c.id = car_id
    where p.id = auth.uid() and p.role = 'dealer'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    join public.cars c on c.id = car_id
    where p.id = auth.uid() and p.role = 'dealer'
  )
);
