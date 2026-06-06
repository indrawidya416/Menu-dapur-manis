# Dapur Harum Rindu 🍲

Landing page restoran masakan Nusantara — _"Rasa Nusantara, Rindu yang Selalu Ada."_

Dibangun dengan **React 19 + Vite 7 + Tailwind CSS v4**, dan dibundel menjadi
**satu file HTML mandiri** (semua CSS, JS, dan gambar di-inline) lewat
`vite-plugin-singlefile`.

## Cuplikan Fitur

- **Navbar** lengket dengan latar blur saat di-scroll + menu mobile.
- **Hero** sinematik dengan gambar zoom perlahan dan statistik restoran.
- **Cerita Kami** — narasi brand + tiga nilai utama.
- **Menu** dengan filter kategori interaktif, badge _Signature_, dan harga IDR.
- **Galeri** bento grid dengan efek hover.
- **Testimoni** pelanggan berbintang.
- **Reservasi & Kontak** dengan form (validasi + state sukses) dan info lokasi.
- **Footer** dengan newsletter dan navigasi.
- Animasi _scroll reveal_ via `IntersectionObserver`.

## Menjalankan

```bash
npm install
npm run dev       # mode pengembangan
npm run build     # hasil: dist/index.html (satu file mandiri)
npm run preview   # pratinjau hasil build
```

## Struktur

```
src/
├── App.tsx              # menyusun semua section
├── main.tsx            # entry point
├── index.css           # tema Tailwind v4, font, animasi
├── assets/             # foto hidangan & suasana (di-inline saat build)
├── components/         # Navbar, Hero, About, Menu, Gallery,
│                       # Testimonials, Reservation, Footer, dll.
└── lib/
    ├── data.ts         # data menu, testimoni, statistik
    ├── utils.ts        # cn() + formatIDR()
    └── useReveal.ts    # hook animasi scroll
```

## Catatan

- Konten (nama hidangan, harga, alamat, kontak) adalah **placeholder realistis** —
  silakan sesuaikan di `src/lib/data.ts` dan `src/components/Reservation.tsx`.
- Font dimuat dari Google Fonts; jika offline, otomatis fallback ke serif/sans sistem.
- `dapur-harum-rindu-preview.html` di root adalah salinan hasil build untuk pratinjau cepat.
