import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "Jelajahi",
    links: [
      { label: "Beranda", href: "#beranda" },
      { label: "Cerita Kami", href: "#cerita" },
      { label: "Menu", href: "#menu" },
      { label: "Galeri", href: "#galeri" },
    ],
  },
  {
    title: "Kunjungi",
    links: [
      { label: "Reservasi", href: "#reservasi" },
      { label: "Testimoni", href: "#testimoni" },
      { label: "Kontak", href: "#kontak" },
      { label: "Lokasi", href: "#kontak" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-rindu-900/60 bg-coal-800/40">
      <div className="batik-divider absolute inset-x-0 top-0 h-5 opacity-30" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-rindu-100/65">
              Menyajikan rasa Nusantara yang autentik sejak 1998. Sebuah rumah bagi
              mereka yang merindukan kehangatan masakan keluarga.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-rindu-300">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-rindu-100/65 transition-colors hover:text-rindu-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-rindu-300">
              Buletin Rindu
            </h4>
            <p className="mt-4 text-sm text-rindu-100/65">
              Dapatkan kabar menu musiman dan promo spesial kami.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex gap-2"
            >
              <input
                type="email"
                required
                placeholder="Email Anda"
                aria-label="Alamat email"
                className="w-full rounded-full border border-rindu-900/70 bg-coal-900/60 px-4 py-2.5 text-sm text-rindu-50 placeholder:text-rindu-100/40 outline-none focus:border-rindu-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-rindu-500 px-4 py-2.5 text-sm font-semibold text-coal-900 transition-colors hover:bg-rindu-400"
                aria-label="Berlangganan"
              >
                →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-rindu-900/60 pt-7 text-xs text-rindu-100/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Dapur Harum Rindu. Seluruh hak cipta dilindungi.{" "}
            <a href="#admin" className="text-rindu-100/40 transition-colors hover:text-rindu-300">
              Admin
            </a>
          </p>
          <p>
            Dibuat dengan <span className="text-chili-500">♥</span> untuk pecinta kuliner Nusantara.
          </p>
        </div>
      </div>
    </footer>
  );
}
