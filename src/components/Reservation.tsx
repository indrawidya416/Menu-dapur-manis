import { useState, type FormEvent } from "react";
import { SectionHeading } from "@/components/Section";
import { useSettings } from "@/lib/settingsStore";

export function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();

  const info = [
    {
      label: "Alamat",
      value: settings.address,
      icon: <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
    },
    {
      label: "Telepon / WhatsApp",
      value: settings.whatsappDisplay,
      icon: <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    },
    {
      label: "Jam Buka",
      value: settings.hours,
      icon: <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    },
  ];

  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    settings.mapsQuery,
  )}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.mapsQuery,
  )}`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string) || "-";
    const phone = (data.get("phone") as string) || "-";
    const date = (data.get("date") as string) || "-";
    const guests = (data.get("guests") as string) || "-";
    const notes = (data.get("notes") as string) || "-";

    const message =
      `Halo Dapur Harum Rindu, saya ingin reservasi meja:\n\n` +
      `• Nama: ${name}\n` +
      `• Telepon: ${phone}\n` +
      `• Tanggal: ${date}\n` +
      `• Jumlah tamu: ${guests}\n` +
      `• Catatan: ${notes}\n\n` +
      `Terima kasih 🙏`;

    const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <section id="reservasi" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div id="kontak" className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Reservasi & Kontak"
              title="Pesan meja, atau sapa kami"
              description="Rencanakan momen istimewa Anda bersama kami. Isi formulir di samping dan reservasi Anda akan langsung terkirim ke WhatsApp kami untuk dikonfirmasi."
            />

            <div className="mt-10 space-y-5">
              {info.map((item) => (
                <div key={item.label} className="reveal flex items-start gap-4">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rindu-500/15 text-rindu-300">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-rindu-100/60">{item.label}</p>
                    <p className="mt-1 text-rindu-50">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Peta Google Maps */}
            <div className="reveal mt-8 overflow-hidden rounded-2xl border border-rindu-900/60 shadow-xl shadow-coal-900/40">
              <iframe
                title="Lokasi Dapur Harum Rindu"
                src={mapsEmbed}
                className="h-64 w-full grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rindu-300 underline-offset-4 hover:underline"
            >
              Buka di Google Maps
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>

            <div className="reveal mt-8 flex gap-3">
              {[
                { label: "Instagram", href: settings.instagram },
                { label: "Facebook", href: settings.facebook },
                { label: "TikTok", href: settings.tiktok },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-rindu-900/70 bg-coal-800/40 px-4 py-2 text-xs font-medium text-rindu-100/70 transition-colors hover:border-rindu-700 hover:text-rindu-50"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div className="reveal rounded-2xl border border-rindu-900/60 bg-coal-800/50 p-7 shadow-2xl shadow-coal-900/50 sm:p-9">
            {submitted ? (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/20 text-leaf-500">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-2xl text-rindu-50">Terima kasih!</h3>
                <p className="mt-2 max-w-xs text-sm text-rindu-100/70">
                  Permintaan reservasi Anda sedang dibuka di WhatsApp. Tekan kirim di
                  sana, dan tim kami akan segera mengonfirmasi.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-rindu-300 underline-offset-4 hover:underline"
                >
                  Kirim permintaan lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nama Lengkap" htmlFor="name">
                    <input id="name" name="name" required placeholder="Nama Anda" className={inputCls} />
                  </Field>
                  <Field label="Nomor Telepon" htmlFor="phone">
                    <input id="phone" name="phone" required type="tel" placeholder="08xx-xxxx-xxxx" className={inputCls} />
                  </Field>
                  <Field label="Tanggal" htmlFor="date">
                    <input id="date" name="date" required type="date" className={inputCls} />
                  </Field>
                  <Field label="Jumlah Tamu" htmlFor="guests">
                    <select id="guests" name="guests" className={inputCls} defaultValue="2">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} orang</option>
                      ))}
                      <option value="7+">7+ orang</option>
                    </select>
                  </Field>
                </div>
                <Field label="Catatan (opsional)" htmlFor="notes">
                  <textarea id="notes" name="notes" rows={3} placeholder="Permintaan khusus, alergi, atau perayaan..." className={inputCls} />
                </Field>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-rindu-500 px-6 py-3.5 text-sm font-semibold text-coal-900 shadow-lg shadow-rindu-900/40 transition-all hover:-translate-y-0.5 hover:bg-rindu-400"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.519z" />
                  </svg>
                  Kirim Reservasi via WhatsApp
                </button>
                <p className="text-center text-xs text-rindu-100/50">
                  Kami akan mengonfirmasi melalui WhatsApp dalam 1×24 jam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-lg border border-rindu-900/70 bg-coal-900/60 px-4 py-2.5 text-sm text-rindu-50 placeholder:text-rindu-100/40 outline-none transition-colors focus:border-rindu-400 focus:ring-2 focus:ring-rindu-500/30";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-rindu-100/60">
        {label}
      </span>
      {children}
    </label>
  );
}
