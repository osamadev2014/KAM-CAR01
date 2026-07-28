-- Fix infinite recursion: the admin read policy queried profiles FROM profiles policy
-- Drop the recursive policy
drop policy if exists "admin read all profiles" on public.profiles;

-- Create a security definer function to check admin role (bypasses RLS)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

-- Admin can read all profiles (using the function, no recursion)
create policy "admin read all profiles"
on public.profiles for select
to authenticated
using (public.is_admin(auth.uid()));
