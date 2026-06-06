-- =====================================================================
-- Dapur Harum Rindu — Skema Database Supabase
-- Jalankan seluruh isi file ini di: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- 1) TABEL MENU --------------------------------------------------------
create table if not exists public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  price       integer not null default 0,
  image       text not null default '',
  category    text not null default 'Hidangan Utama',
  tags        text[] not null default '{}',
  signature   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index untuk pengurutan
create index if not exists menu_items_sort_idx on public.menu_items (sort_order);

-- Auto-update kolom updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_menu_updated_at on public.menu_items;
create trigger trg_menu_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- 2) ROW LEVEL SECURITY -----------------------------------------------
alter table public.menu_items enable row level security;

-- Semua orang (pengunjung) boleh MEMBACA menu
drop policy if exists "menu_select_public" on public.menu_items;
create policy "menu_select_public"
  on public.menu_items for select
  using (true);

-- Hanya user yang sudah login (owner) yang boleh menulis
drop policy if exists "menu_insert_authed" on public.menu_items;
create policy "menu_insert_authed"
  on public.menu_items for insert
  to authenticated with check (true);

drop policy if exists "menu_update_authed" on public.menu_items;
create policy "menu_update_authed"
  on public.menu_items for update
  to authenticated using (true) with check (true);

drop policy if exists "menu_delete_authed" on public.menu_items;
create policy "menu_delete_authed"
  on public.menu_items for delete
  to authenticated using (true);

-- 3) STORAGE BUCKET UNTUK GAMBAR --------------------------------------
-- Bucket publik agar gambar bisa ditampilkan ke pengunjung
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

-- Publik boleh melihat gambar
drop policy if exists "menu_images_read" on storage.objects;
create policy "menu_images_read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

-- Hanya user login yang boleh upload / ubah / hapus gambar
drop policy if exists "menu_images_insert" on storage.objects;
create policy "menu_images_insert"
  on storage.objects for insert
  to authenticated with check (bucket_id = 'menu-images');

drop policy if exists "menu_images_update" on storage.objects;
create policy "menu_images_update"
  on storage.objects for update
  to authenticated using (bucket_id = 'menu-images');

drop policy if exists "menu_images_delete" on storage.objects;
create policy "menu_images_delete"
  on storage.objects for delete
  to authenticated using (bucket_id = 'menu-images');

-- =====================================================================
-- SELESAI. Selanjutnya:
--   • Buat akun owner di: Authentication → Users → Add user
--     (Email + Password, centang "Auto Confirm User")
--   • (Opsional) Isi data awal lewat file: supabase/seed.sql
-- =====================================================================
