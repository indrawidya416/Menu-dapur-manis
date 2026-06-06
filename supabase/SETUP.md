# Panduan Setup Backend Supabase — Dapur Harum Rindu

Dengan backend ini, perubahan menu oleh owner **tersimpan otomatis untuk semua
pengunjung** (tidak perlu export/deploy manual lagi). Login admin memakai
**email + password** (Supabase Auth), dan gambar diunggah ke **Supabase Storage**.

Jika kredensial Supabase tidak diisi, situs tetap berjalan normal dalam **mode
lokal** (perubahan hanya tersimpan di browser owner).

---

## Langkah 1 — Jalankan skema database

1. Buka **Supabase Dashboard** → project Anda → menu **SQL Editor**.
2. Klik **New query**, tempel seluruh isi file [`schema.sql`](./schema.sql), lalu **Run**.
   - Ini membuat tabel `menu_items`, aturan keamanan (RLS), dan bucket
     storage `menu-images`.
3. (Opsional) Untuk mengisi 10 menu awal, jalankan juga [`seed.sql`](./seed.sql).

## Langkah 2 — Buat akun owner (untuk login admin)

1. Di Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Isi **Email** dan **Password** owner.
3. **Centang "Auto Confirm User"** agar bisa langsung login.

> Tambahkan user lain dengan cara sama jika ada beberapa pengelola.

## Langkah 3 — Ambil kredensial API

1. Dashboard → **Project Settings** (ikon gerigi) → **API**.
2. Salin dua nilai:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key (di bagian *Project API keys*)

> `anon` key memang publik & aman dipakai di frontend — keamanan dijaga oleh RLS.
> **Jangan** pakai `service_role` key di frontend.

## Langkah 4 — Hubungkan ke aplikasi

Buat file `.env` di root proyek (salin dari `.env.example`):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi....
```

Lalu build ulang & deploy:

```bash
npm run build
# deploy isi dist/ ke GitHub Pages (branch gh-pages)
```

## Langkah 5 — Konfigurasi Auth redirect (penting untuk situs live)

Di Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `https://indrawidya416.github.io/Menu-dapur-manis/`
- Tambahkan juga ke **Redirect URLs** bila perlu.

## Langkah 6 — (Penting) Izinkan domain situs di CORS

Supabase secara default mengizinkan request dari mana saja untuk REST/Storage,
namun pastikan tidak ada pembatasan tambahan yang memblokir
`https://indrawidya416.github.io`.

---

## Cara pakai oleh owner

1. Buka situs → footer → **Admin** (atau `…/#admin`).
2. Login dengan **email + password** yang dibuat di Langkah 2.
3. Tambah / edit / hapus menu, upload gambar, atur urutan — **semua tersimpan
   otomatis** ke database dan langsung tampil untuk semua pengunjung.

## Catatan keamanan

- Penulisan menu & upload gambar **hanya bisa oleh user yang sudah login**
  (dijamin oleh RLS), sedangkan pembacaan menu terbuka untuk umum.
- Untuk mengganti/menonaktifkan pendaftaran mandiri, atur di
  **Authentication → Providers / Sign In**.
