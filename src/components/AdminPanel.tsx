import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/lib/menuStore";
import { useSettings } from "@/lib/settingsStore";
import { type SiteSettings } from "@/lib/data";
import {
  signIn,
  signOut,
  getInitialSession,
  onAuthChange,
} from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { categories, type MenuCategory, type MenuItem } from "@/lib/data";
import { cn, formatIDR } from "@/lib/utils";

const emptyItem: MenuItem = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category: "Hidangan Utama",
  tags: [],
  signature: false,
};

export function AdminPanel() {
  const [hashRoute, setHashRoute] = useState(
    typeof window !== "undefined" ? window.location.hash : "",
  );

  useEffect(() => {
    const onHash = () => setHashRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (hashRoute !== "#admin") return null;
  return <AdminApp />;
}

function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    getInitialSession().then((ok) => {
      if (mounted) {
        setAuthed(ok);
        setReady(true);
      }
    });
    const unsub = onAuthChange((ok) => mounted && setAuthed(ok));
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-coal-900 text-rindu-100/60">
        Memuat…
      </div>
    );
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn(email, pw);
    setBusy(false);
    if (res.ok) onSuccess();
    else setError(res.error || "Gagal masuk.");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-coal-900 px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-rindu-900/60 bg-coal-800 p-8 shadow-2xl"
      >
        <h1 className="font-display text-2xl text-rindu-50">Panel Admin</h1>
        <p className="mt-1 text-sm text-rindu-100/60">Dapur Harum Rindu</p>

        {isSupabaseConfigured && (
          <label className="mt-6 block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-rindu-100/60">
              Email
            </span>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="owner@email.com"
              className={inputCls}
            />
          </label>
        )}

        <label className={cn("block", isSupabaseConfigured ? "mt-4" : "mt-6")}>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-rindu-100/60">
            Kata Sandi
          </span>
          <input
            type="password"
            autoFocus={!isSupabaseConfigured}
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError("");
            }}
            placeholder="••••••••"
            className={inputCls}
          />
        </label>

        {error && <p className="mt-2 text-sm text-chili-500">{error}</p>}

        <button type="submit" disabled={busy} className={cn(btnPrimary, "mt-5 w-full disabled:opacity-50")}>
          {busy ? "Memproses…" : "Masuk"}
        </button>

        <p className="mt-4 text-center text-[11px] text-rindu-100/40">
          {isSupabaseConfigured
            ? "Mode: Supabase (data tersimpan untuk semua pengunjung)"
            : "Mode: Lokal (perubahan hanya di browser ini)"}
        </p>
        <a
          href="#beranda"
          className="mt-2 block text-center text-xs text-rindu-100/50 hover:text-rindu-300"
        >
          ← Kembali ke situs
        </a>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const {
    items,
    loading,
    mode,
    isCustomized,
    add,
    update,
    remove,
    move,
    reset,
    replaceAll,
  } = useMenu();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"menu" | "settings">("menu");
  const importRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  async function run(fn: () => Promise<void>, okMsg: string) {
    setBusy(true);
    try {
      await fn();
      showToast(okMsg);
    } catch (e) {
      showToast("Gagal: " + ((e as Error).message || "terjadi kesalahan") + " ✗");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(item: MenuItem, originalName?: string) {
    await run(
      () => (originalName ? update(originalName, item) : add(item)),
      originalName ? "Menu diperbarui ✓" : "Menu ditambahkan ✓",
    );
    setEditing(null);
    setCreating(false);
  }

  function handleExport() {
    const clean = items.map(({ ...rest }) => rest);
    const blob = new Blob([JSON.stringify(clean, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu-dapur-harum-rindu.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("File menu.json diunduh ✓");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as MenuItem[];
      if (!Array.isArray(parsed)) throw new Error("format salah");
      await run(() => replaceAll(parsed), "Menu diimpor ✓");
    } catch {
      showToast("Gagal impor: file tidak valid ✗");
    }
    e.target.value = "";
  }

  async function async_logout() {
    await signOut();
    onLogout();
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-coal-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-rindu-900/60 bg-coal-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="font-display text-xl text-rindu-50">Panel Admin Menu</h1>
            <p className="text-xs text-rindu-100/60">
              {items.length} item ·{" "}
              <span className={mode === "supabase" ? "text-leaf-500" : "text-rindu-300"}>
                {mode === "supabase" ? "Supabase (publik)" : "Lokal (browser ini)"}
              </span>
              {isCustomized ? " · data hasil edit" : " · data bawaan"}
              {loading && " · memuat…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href="#beranda" className={btnGhost}>
              Lihat Situs
            </a>
            <button onClick={async_logout} className={btnGhost}>
              Keluar
            </button>
          </div>
        </div>
        {/* Tab navigasi */}
        <div className="mx-auto flex max-w-5xl gap-1 px-5">
          {([
            { id: "menu", label: "Kelola Menu" },
            { id: "settings", label: "Pengaturan Situs" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-rindu-400 text-rindu-50"
                  : "border-transparent text-rindu-100/50 hover:text-rindu-100",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {tab === "settings" ? (
        <SettingsTab onToast={showToast} />
      ) : (
      <main className="mx-auto max-w-5xl px-5 py-6">
        {/* Aksi global */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setCreating(true)} disabled={busy} className={btnPrimary}>
            + Tambah Menu
          </button>
          <button onClick={handleExport} className={btnSecondary}>
            ⬇ Export JSON
          </button>
          <button onClick={() => importRef.current?.click()} disabled={busy} className={btnSecondary}>
            ⬆ Import JSON
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => {
              if (confirm("Kembalikan menu ke data bawaan? Semua perubahan hilang."))
                run(reset, "Direset ke bawaan ✓");
            }}
            disabled={busy}
            className={cn(btnGhost, "ml-auto")}
          >
            Reset ke bawaan
          </button>
        </div>

        {/* Petunjuk publikasi */}
        <div className="mt-4 rounded-xl border border-rindu-500/30 bg-rindu-500/5 p-4 text-sm text-rindu-100/80">
          <p className="font-semibold text-rindu-200">
            {mode === "supabase" ? "Tersimpan otomatis ✓" : "Cara menyimpan permanen"}
          </p>
          <p className="mt-1 leading-relaxed">
            {mode === "supabase"
              ? "Setiap perubahan langsung tersimpan ke database dan terlihat oleh semua pengunjung. Gambar diunggah ke Supabase Storage."
              : "Perubahan tersimpan di browser ini saja. Klik Export JSON lalu kirim ke pengembang untuk dipublikasikan ke semua pengunjung."}
          </p>
        </div>

        {/* Daftar menu */}
        <ul className="mt-6 space-y-3">
          {items.map((item, i) => (
            <li
              key={item.name + i}
              className="flex items-center gap-4 rounded-xl border border-rindu-900/50 bg-coal-800/40 p-3"
            >
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  onClick={() => run(() => move(item.name, -1), "Urutan diubah ✓")}
                  disabled={i === 0 || busy}
                  className="text-rindu-300 disabled:opacity-20"
                  aria-label="Naik"
                >
                  ▲
                </button>
                <button
                  onClick={() => run(() => move(item.name, 1), "Urutan diubah ✓")}
                  disabled={i === items.length - 1 || busy}
                  className="text-rindu-300 disabled:opacity-20"
                  aria-label="Turun"
                >
                  ▼
                </button>
              </div>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-coal-700 text-xs text-rindu-100/40">
                  no img
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-rindu-50">{item.name}</p>
                  {item.signature && (
                    <span className="rounded-full bg-chili-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                      Signature
                    </span>
                  )}
                </div>
                <p className="text-xs text-rindu-300">
                  {formatIDR(item.price)} · {item.category}
                </p>
                <p className="truncate text-xs text-rindu-100/50">{item.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing(item)} disabled={busy} className={btnSecondary}>
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus "${item.name}"?`))
                      run(() => remove(item.name), "Menu dihapus ✓");
                  }}
                  disabled={busy}
                  className={btnDanger}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="rounded-xl border border-dashed border-rindu-900/60 p-8 text-center text-sm text-rindu-100/50">
              Belum ada menu. Klik "Tambah Menu".
            </li>
          )}
        </ul>
      </main>
      )}

      {/* Modal form */}
      {tab === "menu" && (creating || editing) && (
        <ItemForm
          initial={editing ?? emptyItem}
          isEdit={!!editing}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-rindu-500 px-5 py-2.5 text-sm font-semibold text-coal-900 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function ItemForm({
  initial,
  isEdit,
  onCancel,
  onSave,
}: {
  initial: MenuItem;
  isEdit: boolean;
  onCancel: () => void;
  onSave: (item: MenuItem, originalName?: string) => void;
}) {
  const { uploadImage } = useMenu();
  const [form, setForm] = useState<MenuItem>({
    ...initial,
    tags: initial.tags ?? [],
  });
  const [tagsText, setTagsText] = useState((initial.tags ?? []).join(", "));
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [saving, setSaving] = useState(false);
  const originalName = initial.name;

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setUploadErr("Upload gagal: " + ((err as Error).message || ""));
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned: MenuItem = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (!cleaned.name) return;
    setSaving(true);
    await onSave(cleaned, isEdit ? originalName : undefined);
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-[105] flex items-start justify-center overflow-y-auto bg-coal-900/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="my-8 w-full max-w-lg rounded-2xl border border-rindu-900/60 bg-coal-800 p-6 shadow-2xl"
      >
        <h2 className="font-display text-xl text-rindu-50">
          {isEdit ? "Edit Menu" : "Tambah Menu"}
        </h2>

        {/* Gambar */}
        <div className="mt-5 flex items-center gap-4">
          {form.image ? (
            <img
              src={form.image}
              alt="pratinjau"
              className="h-24 w-24 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-coal-700 text-xs text-rindu-100/40">
              no img
            </div>
          )}
          <div className="flex-1">
            <label className={cn(btnSecondary, "inline-block cursor-pointer")}>
              {uploading ? "Mengunggah…" : "Pilih Gambar"}
              <input
                type="file"
                accept="image/*"
                onChange={onPickImage}
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-rindu-100/50">
              JPG/PNG. Disarankan rasio persegi, &lt; 1 MB.
            </p>
            {uploadErr && <p className="mt-1 text-xs text-chili-500">{uploadErr}</p>}
            {form.image && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, image: "" }))}
                className="mt-1 text-xs text-chili-500 hover:underline"
              >
                Hapus gambar
              </button>
            )}
          </div>
        </div>

        {/* Field */}
        <div className="mt-5 space-y-4">
          <Field label="Nama Menu">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth. Nasi Goreng Kampung"
              className={inputCls}
            />
          </Field>
          <Field label="Deskripsi">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Deskripsi singkat hidangan..."
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Harga (Rp)">
              <input
                type="number"
                min={0}
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                placeholder="38000"
                className={inputCls}
              />
            </Field>
            <Field label="Kategori">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as MenuCategory })
                }
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Tag (pisahkan dengan koma)">
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="Pedas, Favorit"
              className={inputCls}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-rindu-100/80">
            <input
              type="checkbox"
              checked={!!form.signature}
              onChange={(e) =>
                setForm({ ...form, signature: e.target.checked })
              }
              className="h-4 w-4 accent-rindu-500"
            />
            Tandai sebagai menu Signature
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className={cn(btnGhost, "flex-1")}>
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className={cn(btnPrimary, "flex-1 disabled:opacity-50")}
          >
            {saving ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsTab({ onToast }: { onToast: (m: string) => void }) {
  const { settings, save, uploadLogo } = useSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onPickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadLogo(file);
      set("logoUrl", url);
      onToast("Logo terunggah ✓");
    } catch (err) {
      onToast("Upload gagal: " + ((err as Error).message || "") + " ✗");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await save(form);
      onToast("Pengaturan tersimpan ✓");
    } catch (err) {
      onToast("Gagal simpan: " + ((err as Error).message || "") + " ✗");
    } finally {
      setSaving(false);
    }
  }

  const mapsPreview = `https://maps.google.com/maps?q=${encodeURIComponent(
    form.mapsQuery || "Jakarta",
  )}&output=embed`;

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      {/* Brand & Logo */}
      <section className="rounded-xl border border-rindu-900/50 bg-coal-800/40 p-5">
        <h3 className="font-display text-lg text-rindu-50">Logo & Nama Brand</h3>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rindu-400/50 bg-coal-900">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="logo" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[10px] text-rindu-100/40">SVG bawaan</span>
            )}
          </span>
          <div>
            <label className={cn(btnSecondary, "inline-block cursor-pointer")}>
              {uploading ? "Mengunggah…" : "Pilih Logo"}
              <input type="file" accept="image/*" onChange={onPickLogo} className="hidden" />
            </label>
            {form.logoUrl && (
              <button
                type="button"
                onClick={() => set("logoUrl", "")}
                className="ml-2 text-xs text-chili-500 hover:underline"
              >
                Hapus logo
              </button>
            )}
            <p className="mt-1 text-xs text-rindu-100/50">PNG/JPG, rasio persegi.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nama Brand">
            <input value={form.brandName} onChange={(e) => set("brandName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tagline">
            <input value={form.brandTagline} onChange={(e) => set("brandTagline", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Kontak */}
      <section className="mt-5 rounded-xl border border-rindu-900/50 bg-coal-800/40 p-5">
        <h3 className="font-display text-lg text-rindu-50">Kontak & WhatsApp</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Nomor WhatsApp (cth: 6281234567890)">
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="6281234567890" className={inputCls} />
          </Field>
          <Field label="WhatsApp (tampilan)">
            <input value={form.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} placeholder="+62 812-3456-7890" className={inputCls} />
          </Field>
          <Field label="Jam Buka">
            <input value={form.hours} onChange={(e) => set("hours", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pesan WhatsApp default">
            <input value={form.whatsappMessage} onChange={(e) => set("whatsappMessage", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Alamat Lengkap">
            <textarea value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} className={inputCls} />
          </Field>
        </div>
      </section>

      {/* Peta */}
      <section className="mt-5 rounded-xl border border-rindu-900/50 bg-coal-800/40 p-5">
        <h3 className="font-display text-lg text-rindu-50">Lokasi Peta (Google Maps)</h3>
        <Field label="Alamat / koordinat untuk peta">
          <input value={form.mapsQuery} onChange={(e) => set("mapsQuery", e.target.value)} placeholder="cth: -6.244, 106.800 atau nama tempat" className={inputCls} />
        </Field>
        <p className="mt-1 text-xs text-rindu-100/50">
          Tip: salin alamat dari Google Maps, atau koordinat (lat, long) agar pin tepat.
        </p>
        <div className="mt-3 overflow-hidden rounded-lg border border-rindu-900/60">
          <iframe title="pratinjau peta" src={mapsPreview} className="h-48 w-full" loading="lazy" />
        </div>
      </section>

      {/* Sosial Media */}
      <section className="mt-5 rounded-xl border border-rindu-900/50 bg-coal-800/40 p-5">
        <h3 className="font-display text-lg text-rindu-50">Media Sosial</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Instagram (URL)">
            <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/..." className={inputCls} />
          </Field>
          <Field label="Facebook (URL)">
            <input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/..." className={inputCls} />
          </Field>
          <Field label="TikTok (URL)">
            <input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@..." className={inputCls} />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-rindu-900/60 bg-coal-900/95 py-4 backdrop-blur">
        <button onClick={() => setForm(settings)} className={btnGhost}>
          Batalkan perubahan
        </button>
        <button onClick={handleSave} disabled={saving || uploading} className={cn(btnPrimary, "disabled:opacity-50")}>
          {saving ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-lg border border-rindu-900/70 bg-coal-900/60 px-4 py-2.5 text-sm text-rindu-50 placeholder:text-rindu-100/40 outline-none transition-colors focus:border-rindu-400 focus:ring-2 focus:ring-rindu-500/30";
const btnPrimary =
  "rounded-full bg-rindu-500 px-5 py-2.5 text-sm font-semibold text-coal-900 transition-all hover:-translate-y-0.5 hover:bg-rindu-400";
const btnSecondary =
  "rounded-full border border-rindu-500/50 bg-rindu-500/10 px-4 py-2 text-sm font-semibold text-rindu-300 transition-colors hover:bg-rindu-500 hover:text-coal-900";
const btnGhost =
  "rounded-full border border-rindu-900/70 bg-coal-800/40 px-4 py-2 text-sm font-medium text-rindu-100/70 transition-colors hover:border-rindu-700 hover:text-rindu-50";
const btnDanger =
  "rounded-full border border-chili-500/50 bg-chili-500/10 px-4 py-2 text-sm font-semibold text-chili-500 transition-colors hover:bg-chili-500 hover:text-white";

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
