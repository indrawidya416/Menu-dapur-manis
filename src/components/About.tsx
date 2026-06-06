import about from "@/assets/about.jpg";
import { SectionHeading } from "@/components/Section";

const values = [
  {
    title: "Resep Warisan",
    desc: "Diturunkan tiga generasi, dijaga keasliannya hingga kini.",
    icon: (
      <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm10-15v5h5" />
    ),
  },
  {
    title: "Rempah Pilihan",
    desc: "Bumbu segar diulek setiap hari, tanpa penyedap buatan.",
    icon: <path d="M12 3v6m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6 14H6" />,
  },
  {
    title: "Dimasak Perlahan",
    desc: "Setiap hidangan dimasak dengan sabar agar rasa meresap sempurna.",
    icon: <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
];

export function About() {
  return (
    <section id="cerita" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div className="reveal relative">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-rindu-400/40" />
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-rindu-400/40" />
          <img
            src={about}
            alt="Memasak rendang dengan cara tradisional"
            className="h-[30rem] w-full rounded-2xl object-cover shadow-2xl shadow-coal-900/60"
          />
          <div className="absolute -bottom-8 left-8 rounded-2xl border border-rindu-900/70 bg-coal-800/95 px-6 py-5 shadow-xl backdrop-blur">
            <p className="font-display text-3xl text-rindu-300">28+</p>
            <p className="text-xs uppercase tracking-wide text-rindu-100/70">
              Tahun menjaga rasa
            </p>
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Cerita Kami"
            title={
              <>
                Dari dapur keluarga,
                <br />
                untuk meja Anda.
              </>
            }
            description="Dapur Harum Rindu berawal dari warung kecil milik Ibu Sari pada tahun 1998. Berbekal resep nenek dan kecintaan pada masakan Nusantara, kami tumbuh menjadi rumah makan yang dipercaya menyajikan rasa autentik — tanpa pernah kehilangan kehangatan masakan rumahan."
          />

          <div className="mt-10 space-y-5">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="reveal flex items-start gap-4 rounded-xl border border-rindu-900/50 bg-coal-800/40 p-5 transition-colors hover:border-rindu-700/70"
                data-delay={`${i * 100}`}
              >
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rindu-500/15 text-rindu-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {value.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-display text-lg text-rindu-50">{value.title}</h3>
                  <p className="mt-1 text-sm text-rindu-100/70">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
