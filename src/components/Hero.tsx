import hero from "@/assets/hero.jpg";
import { stats } from "@/lib/data";

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={hero}
          alt="Sajian khas Nusantara Dapur Harum Rindu"
          className="h-full w-full object-cover"
          style={{ animation: "slow-zoom 18s ease-out alternate infinite" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-coal-900/85 via-coal-900/70 to-coal-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-coal-900/90 via-coal-900/30 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8">
        <span className="reveal inline-flex w-fit items-center gap-2 rounded-full border border-rindu-400/40 bg-coal-900/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-rindu-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-rindu-400" style={{ animation: "shimmer 2s infinite" }} />
          Masakan rumahan sejak 1998
        </span>

        <h1 className="reveal mt-6 max-w-3xl font-display text-4xl leading-[1.05] text-rindu-50 sm:text-6xl lg:text-7xl" data-delay="80">
          Rasa Nusantara,
          <span className="block text-rindu-300">Rindu yang Selalu Ada.</span>
        </h1>

        <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-rindu-100/80" data-delay="160">
          Setiap hidangan kami lahir dari resep warisan keluarga — dimasak perlahan
          dengan rempah pilihan, untuk menghadirkan kehangatan rumah di setiap suapan.
        </p>

        <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row" data-delay="240">
          <a
            href="#menu"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rindu-500 px-7 py-3.5 text-sm font-semibold text-coal-900 shadow-xl shadow-rindu-900/40 transition-all hover:-translate-y-0.5 hover:bg-rindu-400"
          >
            Lihat Menu Kami
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#reservasi"
            className="inline-flex items-center justify-center rounded-full border border-rindu-200/30 bg-coal-900/30 px-7 py-3.5 text-sm font-semibold text-rindu-50 backdrop-blur transition-all hover:border-rindu-300/60 hover:bg-coal-800/50"
          >
            Pesan Meja
          </a>
        </div>

        <dl className="reveal mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 border-t border-rindu-900/60 pt-8 sm:grid-cols-4" data-delay="320">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-display text-3xl text-rindu-300">{stat.value}</dt>
              <dd className="mt-1 text-xs uppercase tracking-wide text-rindu-100/60">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-rindu-300/70 lg:flex">
        <span className="text-[10px] uppercase tracking-[0.3em]">Gulir</span>
        <span className="h-10 w-px bg-gradient-to-b from-rindu-300/70 to-transparent" />
      </div>
    </section>
  );
}
