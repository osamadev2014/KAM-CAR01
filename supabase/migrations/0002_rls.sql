alter table public.cars       enable row level security;
alter table public.car_images enable row level security;

create policy "public read published cars"
on public.cars for select
using (status = 'published');

create policy "admin read all cars"
on public.cars for select to authenticated using (true);

create policy "admin insert cars" on public.cars for insert to authenticated with check (true);
create policy "admin update cars" on public.cars for update to authenticated using (true) with check (true);
create policy "admin delete cars" on public.cars for delete to authenticated using (true);

create policy "public read images of published cars"
on public.car_images for select
using (exists (select 1 from public.cars c where c.id = car_id and c.status = 'published'));

create policy "admin read all images" on public.car_images for select to authenticated using (true);
create policy "admin write images"    on public.car_images for all    to authenticated using (true) with check (true);
