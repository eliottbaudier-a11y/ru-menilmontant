-- =========================================================================
-- Ru de Ménilmontant — schéma Supabase
-- À exécuter dans le SQL Editor du projet Supabase.
-- =========================================================================

-- Table des scans (progression utilisateur)
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plaque_slug text not null,
  scanned_at timestamptz not null default now(),
  unique (user_id, plaque_slug)
);

alter table public.scans enable row level security;

-- Politiques : chacun ne lit / n'écrit que ses propres scans
drop policy if exists "user reads own scans" on public.scans;
create policy "user reads own scans"
  on public.scans for select
  using (auth.uid() = user_id);

drop policy if exists "user inserts own scans" on public.scans;
create policy "user inserts own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);
