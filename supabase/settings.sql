-- =====================================================================
-- Tabel pengaturan situs (logo, kontak, peta, sosial media)
-- Jalankan di SQL Editor SETELAH schema.sql
-- =====================================================================

create table if not exists public.site_settings (
  id integer primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Publik boleh membaca pengaturan
drop policy if exists "settings_select_public" on public.site_settings;
create policy "settings_select_public"
  on public.site_settings for select using (true);

-- Hanya user login (owner) yang boleh menulis
drop policy if exists "settings_write_authed" on public.site_settings;
create policy "settings_write_authed"
  on public.site_settings for all
  to authenticated using (true) with check (true);

-- =====================================================================
-- SELESAI.
-- =====================================================================
