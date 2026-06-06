import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";

function CartButton({ className }: { className?: string }) {
  const { totalQty, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Buka keranjang"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-rindu-900/70 bg-coal-800/40 text-rindu-100 transition-colors hover:border-rindu-700 hover:text-rindu-50",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12L6 6Zm0 0-.7-3H3m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      {totalQty > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-chili-500 px-1 text-[11px] font-bold text-white">
          {totalQty}
        </span>
      )}
    </button>
  );
}

const links = [
  { label: "Beranda", href: "#beranda" },
  { label: "Cerita Kami", href: "#cerita" },
  { label: "Menu", href: "#menu" },
  { label: "Galeri", href: "#galeri" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Kontak", href: "#kontak" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-rindu-900/60 bg-coal-900/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#beranda" aria-label="Dapur Harum Rindu beranda">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm font-medium text-rindu-100/80 transition-colors hover:text-rindu-50"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-rindu-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <CartButton />
          <a
            href="#reservasi"
            className="rounded-full bg-rindu-500 px-5 py-2.5 text-sm font-semibold text-coal-900 shadow-lg shadow-rindu-900/40 transition-all hover:-translate-y-0.5 hover:bg-rindu-400"
          >
            Reservasi
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartButton />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rindu-900/70 text-rindu-100"
            aria-label="Buka menu navigasi"
            aria-expanded={open}
          >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "overflow-hidden border-t border-rindu-900/50 bg-coal-900/95 backdrop-blur-md transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <ul className="space-y-1 px-5 py-4">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-rindu-100/80 transition-colors hover:bg-coal-700 hover:text-rindu-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#reservasi"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-rindu-500 px-3 py-2.5 text-center text-sm font-semibold text-coal-900"
            >
              Reservasi
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
