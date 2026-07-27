create policy "public read car images"
on storage.objects for select
using (bucket_id = 'car-images');

create policy "authenticated manage car images"
on storage.objects for all
to authenticated
using (bucket_id = 'car-images')
with check (bucket_id = 'car-images');
