import { useEffect, useState, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { contact, ordering, payment } from "@/lib/data";
import { cn, formatIDR } from "@/lib/utils";

type Step = "cart" | "checkout" | "payment";

interface CheckoutData {
  name: string;
  phone: string;
  type: "Ambil di tempat" | "Pesan antar";
  address: string;
  pay: "Transfer Bank" | "QRIS";
  notes: string;
}

const emptyForm: CheckoutData = {
  name: "",
  phone: "",
  type: "Ambil di tempat",
  address: "",
  pay: "Transfer Bank",
  notes: "",
};

export function CartDrawer() {
  const { lines, isOpen, close, totalQty, totalPrice, increment, decrement, remove, clear } =
    useCart();
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState<CheckoutData>(emptyForm);
  const [sent, setSent] = useState(false);

  const isDelivery = form.type === "Pesan antar";
  const freeDelivery =
    ordering.freeDeliveryMin > 0 && totalPrice >= ordering.freeDeliveryMin;
  const deliveryFee = isDelivery && !freeDelivery ? ordering.deliveryFee : 0;
  const grandTotal = totalPrice + deliveryFee;
  // Kekurangan agar mencapai minimum order pesan antar
  const belowMin = isDelivery && totalPrice < ordering.minOrderDelivery;
  const minShortfall = ordering.minOrderDelivery - totalPrice;

  // Lock scroll saat terbuka + reset ke langkah awal saat ditutup
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("cart");
        setSent(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function buildMessage() {
    const itemsText = lines
      .map(
        (l, i) =>
          `${i + 1}. ${l.name} × ${l.qty} = ${formatIDR(l.price * l.qty)}`,
      )
      .join("\n");

    return (
      `*PESANAN BARU — Dapur Harum Rindu*\n\n` +
      `${itemsText}\n\n` +
      `Subtotal: ${formatIDR(totalPrice)}\n` +
      (isDelivery
        ? `Ongkir: ${deliveryFee === 0 ? "GRATIS" : formatIDR(deliveryFee)}\n`
        : ``) +
      `*Total: ${formatIDR(grandTotal)}*\n` +
      `———————————————\n` +
      `Nama: ${form.name}\n` +
      `Telepon: ${form.phone}\n` +
      `Metode: ${form.type}\n` +
      (isDelivery ? `Alamat: ${form.address}\n` : ``) +
      `Pembayaran: ${form.pay}\n` +
      (form.notes ? `Catatan: ${form.notes}\n` : ``) +
      `\nSaya akan mengirim bukti pembayaran. Terima kasih 🙏`
    );
  }

  function handleCheckoutSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (belowMin) return;
    setStep("payment");
  }

  function handleSendOrder() {
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    clear();
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 z-[60] bg-coal-900/70 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-rindu-900/60 bg-coal-800 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rindu-900/60 px-6 py-5">
          <div className="flex items-center gap-3">
            {step !== "cart" && !sent && (
              <button
                type="button"
                onClick={() => setStep(step === "payment" ? "checkout" : "cart")}
                aria-label="Kembali"
                className="text-rindu-300 hover:text-rindu-50"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            )}
            <h2 className="font-display text-xl text-rindu-50">
              {sent
                ? "Pesanan Terkirim"
                : step === "cart"
                  ? "Keranjang Anda"
                  : step === "checkout"
                    ? "Detail Pesanan"
                    : "Pembayaran"}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Tutup keranjang"
            className="flex h-9 w-9 items-center justify-center rounded-full text-rindu-100/70 transition-colors hover:bg-coal-700 hover:text-rindu-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        {!sent && (
          <div className="flex items-center gap-1.5 px-6 py-3 text-[11px] font-medium uppercase tracking-wide">
            {(["cart", "checkout", "payment"] as Step[]).map((s, i) => {
              const order = { cart: 0, checkout: 1, payment: 2 };
              const activeIdx = order[step];
              const done = order[s] <= activeIdx;
              const labels = { cart: "Keranjang", checkout: "Detail", payment: "Bayar" };
              return (
                <div key={s} className="flex flex-1 items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                      done ? "bg-rindu-500 text-coal-900" : "bg-coal-700 text-rindu-100/50",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={done ? "text-rindu-200" : "text-rindu-100/40"}>
                    {labels[s]}
                  </span>
                  {i < 2 && <span className="h-px flex-1 bg-rindu-900/70" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sent ? (
            <SuccessView />
          ) : step === "cart" ? (
            lines.length === 0 ? (
              <EmptyCart onClose={close} />
            ) : (
              <ul className="space-y-4">
                {lines.map((l) => (
                  <li key={l.name} className="flex gap-3 rounded-xl border border-rindu-900/50 bg-coal-900/40 p-3">
                    <img src={l.image} alt={l.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-rindu-50">{l.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(l.name)}
                          aria-label={`Hapus ${l.name}`}
                          className="text-rindu-100/40 hover:text-chili-500"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="m6 6 12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-rindu-300">{formatIDR(l.price)}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <QtyBtn onClick={() => decrement(l.name)} label="kurangi">−</QtyBtn>
                          <span className="w-6 text-center text-sm font-semibold text-rindu-50">{l.qty}</span>
                          <QtyBtn onClick={() => increment(l.name)} label="tambah">+</QtyBtn>
                        </div>
                        <p className="text-sm font-semibold text-rindu-50">
                          {formatIDR(l.price * l.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : step === "checkout" ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <Field label="Nama Lengkap">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" className={inputCls} />
              </Field>
              <Field label="Nomor WhatsApp">
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xx-xxxx-xxxx" className={inputCls} />
              </Field>
              <Field label="Metode Pengambilan">
                <div className="grid grid-cols-2 gap-2">
                  {(["Ambil di tempat", "Pesan antar"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, type: opt })}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                        form.type === opt
                          ? "border-rindu-400 bg-rindu-500/15 text-rindu-200"
                          : "border-rindu-900/70 bg-coal-900/40 text-rindu-100/60 hover:border-rindu-700",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>
              {form.type === "Pesan antar" && (
                <Field label="Alamat Pengantaran">
                  <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} placeholder="Alamat lengkap..." className={inputCls} />
                </Field>
              )}
              <Field label="Metode Pembayaran">
                <div className="grid grid-cols-2 gap-2">
                  {(["Transfer Bank", "QRIS"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, pay: opt })}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                        form.pay === opt
                          ? "border-rindu-400 bg-rindu-500/15 text-rindu-200"
                          : "border-rindu-900/70 bg-coal-900/40 text-rindu-100/60 hover:border-rindu-700",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Catatan (opsional)">
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Level pedas, tanpa bawang, dll." className={inputCls} />
              </Field>
            </form>
          ) : (
            <PaymentView
              form={form}
              totalPrice={totalPrice}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              isDelivery={isDelivery}
            />
          )}
        </div>

        {/* Footer / aksi */}
        {!sent && (
          <div className="border-t border-rindu-900/60 bg-coal-800 px-6 py-5">
            {/* Peringatan minimum order pesan antar */}
            {step === "checkout" && belowMin && (
              <div className="mb-3 rounded-lg border border-chili-500/40 bg-chili-500/10 px-3 py-2.5 text-xs text-rindu-100/85">
                Minimum order untuk pesan antar adalah{" "}
                <span className="font-semibold text-rindu-200">
                  {formatIDR(ordering.minOrderDelivery)}
                </span>
                . Tambah <span className="font-semibold text-rindu-200">{formatIDR(minShortfall)}</span> lagi,
                atau pilih "Ambil di tempat".
              </div>
            )}
            {/* Info menuju gratis ongkir */}
            {step === "checkout" &&
              isDelivery &&
              !belowMin &&
              !freeDelivery &&
              ordering.freeDeliveryMin > 0 && (
                <div className="mb-3 rounded-lg border border-rindu-500/30 bg-rindu-500/5 px-3 py-2.5 text-xs text-rindu-100/80">
                  Belanja <span className="font-semibold text-rindu-200">{formatIDR(ordering.freeDeliveryMin - totalPrice)}</span> lagi
                  untuk dapat <span className="font-semibold text-leaf-500">GRATIS ONGKIR</span>! 🚚
                </div>
              )}

            {step !== "cart" && (
              <div className="mb-2 space-y-1 text-sm">
                <div className="flex justify-between text-rindu-100/60">
                  <span>Subtotal</span>
                  <span>{formatIDR(totalPrice)}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between text-rindu-100/60">
                    <span>Ongkir</span>
                    <span>{deliveryFee === 0 ? <span className="text-leaf-500">GRATIS</span> : formatIDR(deliveryFee)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-rindu-100/70">
                Total {step === "cart" ? `(${totalQty} item)` : ""}
              </span>
              <span className="font-display text-xl text-rindu-300">{formatIDR(grandTotal)}</span>
            </div>

            {step === "cart" && (
              <button
                type="button"
                disabled={lines.length === 0}
                onClick={() => setStep("checkout")}
                className="w-full rounded-full bg-rindu-500 px-6 py-3.5 text-sm font-semibold text-coal-900 shadow-lg shadow-rindu-900/40 transition-all hover:-translate-y-0.5 hover:bg-rindu-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lanjut ke Checkout
              </button>
            )}
            {step === "checkout" && (
              <button
                type="submit"
                form="checkout-form"
                disabled={belowMin}
                className="w-full rounded-full bg-rindu-500 px-6 py-3.5 text-sm font-semibold text-coal-900 shadow-lg shadow-rindu-900/40 transition-all hover:-translate-y-0.5 hover:bg-rindu-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lanjut ke Pembayaran
              </button>
            )}
            {step === "payment" && (
              <button
                type="button"
                onClick={handleSendOrder}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.519z" />
                </svg>
                Konfirmasi & Kirim Pesanan
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function QtyBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-rindu-900/70 text-rindu-200 transition-colors hover:border-rindu-500 hover:bg-rindu-500/15"
    >
      {children}
    </button>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coal-700 text-rindu-300">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6h15l-1.5 9h-12L6 6Zm0 0-.7-3H3m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
      </span>
      <p className="mt-5 font-display text-lg text-rindu-50">Keranjang masih kosong</p>
      <p className="mt-2 max-w-xs text-sm text-rindu-100/60">
        Yuk pilih hidangan favorit Anda dari menu kami.
      </p>
      <a
        href="#menu"
        onClick={onClose}
        className="mt-6 rounded-full border border-rindu-500/50 bg-rindu-500/10 px-6 py-2.5 text-sm font-semibold text-rindu-300 transition-colors hover:bg-rindu-500 hover:text-coal-900"
      >
        Lihat Menu
      </a>
    </div>
  );
}

function PaymentView({
  form,
  totalPrice,
  deliveryFee,
  grandTotal,
  isDelivery,
}: {
  form: CheckoutData;
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
  isDelivery: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-rindu-900/50 bg-coal-900/40 p-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-rindu-100/70">
            <span>Subtotal</span>
            <span>{formatIDR(totalPrice)}</span>
          </div>
          {isDelivery && (
            <div className="flex justify-between text-rindu-100/70">
              <span>Ongkir</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="font-semibold text-leaf-500">GRATIS</span>
                ) : (
                  formatIDR(deliveryFee)
                )}
              </span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-rindu-900/60 pt-3">
          <span className="text-xs uppercase tracking-wide text-rindu-100/60">
            Total yang harus dibayar
          </span>
          <span className="font-display text-2xl text-rindu-300">{formatIDR(grandTotal)}</span>
        </div>
      </div>

      {form.pay === "Transfer Bank" ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-rindu-50">Transfer ke salah satu rekening:</p>
          {payment.banks.map((b) => (
            <div key={b.bank} className="flex items-center justify-between rounded-xl border border-rindu-900/50 bg-coal-900/40 p-4">
              <div>
                <p className="text-sm font-bold text-rindu-200">{b.bank}</p>
                <p className="font-mono text-lg tracking-wider text-rindu-50">{b.number}</p>
                <p className="text-xs text-rindu-100/60">a.n. {b.holder}</p>
              </div>
              <CopyButton text={b.number} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-xl border border-rindu-900/50 bg-coal-900/40 p-5 text-center">
          <p className="mb-3 text-sm font-semibold text-rindu-50">Scan QRIS berikut</p>
          <img src={payment.qrisImage} alt="Kode QRIS pembayaran" className="w-48 rounded-lg" />
          <p className="mt-3 text-xs text-rindu-100/60">{payment.qrisName}</p>
        </div>
      )}

      <div className="rounded-xl border border-rindu-500/30 bg-rindu-500/5 p-4 text-sm text-rindu-100/80">
        <p className="font-semibold text-rindu-200">Langkah terakhir</p>
        <p className="mt-1 leading-relaxed">
          Setelah membayar, tekan tombol di bawah untuk mengirim ringkasan pesanan ke
          WhatsApp kami beserta bukti pembayaran. Pesanan diproses setelah pembayaran
          dikonfirmasi.
        </p>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-lg border border-rindu-900/70 bg-coal-800 px-3 py-2 text-xs font-medium text-rindu-200 transition-colors hover:border-rindu-500"
    >
      {copied ? "Tersalin!" : "Salin"}
    </button>
  );
}

function SuccessView() {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/20 text-leaf-500">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
      <h3 className="mt-5 font-display text-2xl text-rindu-50">Pesanan terkirim!</h3>
      <p className="mt-2 max-w-xs text-sm text-rindu-100/70">
        Ringkasan pesanan Anda telah dibuka di WhatsApp. Tekan kirim di sana dan
        sertakan bukti pembayaran. Tim kami akan segera memproses pesanan Anda. 🙏
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-rindu-900/70 bg-coal-900/60 px-4 py-2.5 text-sm text-rindu-50 placeholder:text-rindu-100/40 outline-none transition-colors focus:border-rindu-400 focus:ring-2 focus:ring-rindu-500/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-rindu-100/60">
        {label}
      </span>
      {children}
    </label>
  );
}
