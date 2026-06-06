import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/Section";
import { categories, menuItems, type MenuCategory } from "@/lib/data";
import { cn, formatIDR } from "@/lib/utils";
import { useCart } from "@/lib/cart";

type Filter = "Semua" | MenuCategory;
const filters: Filter[] = ["Semua", ...categories];

export function Menu() {
  const [active, setActive] = useState<Filter>("Semua");
  const { add } = useCart();

  const visible = useMemo(
    () =>
      active === "Semua"
        ? menuItems
        : menuItems.filter((item) => item.category === active),
    [active],
  );

  return (
    <section id="menu" className="relative py-24 sm:py-32">
      <div className="batik-divider absolute inset-x-0 top-0 h-5 opacity-40" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Menu Pilihan"
          title="Hidangan yang menghadirkan rindu"
          description="Dari rendang yang dimasak delapan jam hingga es cendol yang menyegarkan — setiap menu kami racik dengan cinta dan rempah terbaik."
        />

        <div className="reveal mt-12 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-all",
                active === filter
                  ? "border-rindu-400 bg-rindu-500 text-coal-900"
                  : "border-rindu-900/70 bg-coal-800/40 text-rindu-100/70 hover:border-rindu-700 hover:text-rindu-50",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <article
              key={item.name}
              className="reveal group flex flex-col overflow-hidden rounded-2xl border border-rindu-900/50 bg-coal-800/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-rindu-700/80 hover:shadow-2xl hover:shadow-coal-900/60"
              data-delay={`${(i % 3) * 90}`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-900/80 to-transparent" />
                {item.signature && (
                  <span className="absolute left-4 top-4 rounded-full bg-chili-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                    Signature
                  </span>
                )}
                <span className="absolute bottom-4 right-4 rounded-full bg-coal-900/80 px-3 py-1.5 font-display text-sm font-semibold text-rindu-300 backdrop-blur">
                  {formatIDR(item.price)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl text-rindu-50">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-rindu-100/70">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-leaf-500/40 bg-leaf-500/10 px-2.5 py-0.5 text-[11px] font-medium text-leaf-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => add(item)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-rindu-500/50 bg-rindu-500/10 px-5 py-2.5 text-sm font-semibold text-rindu-300 transition-all hover:bg-rindu-500 hover:text-coal-900"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6h15l-1.5 9h-12L6 6Zm0 0-.7-3H3m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  </svg>
                  Tambah Pesanan
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="reveal mt-12 text-center text-sm text-rindu-100/60">
          Ingin melihat menu lengkap kami?{" "}
          <a href="#kontak" className="font-semibold text-rindu-300 underline-offset-4 hover:underline">
            Hubungi kami
          </a>{" "}
          untuk daftar harga terbaru.
        </p>
      </div>
    </section>
  );
}
