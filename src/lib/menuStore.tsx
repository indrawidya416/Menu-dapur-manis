import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menuItems as defaultMenu, type MenuItem } from "@/lib/data";
import {
  supabase,
  isSupabaseConfigured,
  MENU_TABLE,
  IMAGE_BUCKET,
  type MenuRow,
} from "@/lib/supabase";

const STORAGE_KEY = "dhr_menu_v1";

export type MenuMode = "supabase" | "local";

interface MenuStore {
  items: MenuItem[];
  loading: boolean;
  mode: MenuMode;
  /** true jika menu memakai data hasil edit (DB Supabase atau localStorage) */
  isCustomized: boolean;
  add: (item: MenuItem) => Promise<void>;
  update: (originalName: string, item: MenuItem) => Promise<void>;
  remove: (name: string) => Promise<void>;
  move: (name: string, dir: -1 | 1) => Promise<void>;
  reset: () => Promise<void>;
  replaceAll: (items: MenuItem[]) => Promise<void>;
  refresh: () => Promise<void>;
  /** Upload gambar; mengembalikan URL publik (Supabase) atau data URL (lokal). */
  uploadImage: (file: File) => Promise<string>;
}

const MenuContext = createContext<MenuStore | null>(null);

// Setiap item membawa id internal (untuk DB). Tidak ditampilkan di UI publik.
type ItemWithId = MenuItem & { _id?: string };

function rowToItem(row: MenuRow): ItemWithId {
  return {
    _id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    category: row.category as MenuItem["category"],
    tags: row.tags ?? [],
    signature: row.signature,
  };
}

// ---- Fallback lokal (localStorage) ----------------------------------
function loadLocal(): { items: MenuItem[]; customized: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MenuItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { items: parsed, customized: true };
      }
    }
  } catch {
    /* abaikan */
  }
  return { items: defaultMenu, customized: false };
}

function saveLocal(items: MenuItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* noop */
  }
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const mode: MenuMode = isSupabaseConfigured ? "supabase" : "local";
  const localInit = useMemo(loadLocal, []);

  const [items, setItems] = useState<ItemWithId[]>(localInit.items);
  const [loading, setLoading] = useState(mode === "supabase");
  const [isCustomized, setCustomized] = useState(
    mode === "supabase" ? true : localInit.customized,
  );

  // ---- SUPABASE: ambil data --------------------------------------
  const refresh = useCallback(async () => {
    if (mode !== "supabase" || !supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(MENU_TABLE)
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) {
      const rows = data as MenuRow[];
      // Jika DB kosong, tampilkan data bawaan agar situs tidak kosong
      setItems(rows.length ? rows.map(rowToItem) : defaultMenu);
      setCustomized(rows.length > 0);
    } else if (error) {
      // Gagal konek → fallback ke data bawaan
      setItems(defaultMenu);
      setCustomized(false);
    }
    setLoading(false);
  }, [mode]);

  useEffect(() => {
    if (mode === "supabase") void refresh();
  }, [mode, refresh]);

  // ---- helper: simpan untuk mode lokal ---------------------------
  const persistLocal = useCallback((next: ItemWithId[]) => {
    setItems(next);
    setCustomized(true);
    saveLocal(next.map(({ _id, ...rest }) => rest));
  }, []);

  // ---- ADD --------------------------------------------------------
  const add = useCallback(
    async (item: MenuItem) => {
      if (mode === "supabase" && supabase) {
        const sort_order = items.length
          ? Math.max(...items.map((_, i) => i)) + 1
          : 1;
        const { error } = await supabase.from(MENU_TABLE).insert({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          tags: item.tags ?? [],
          signature: !!item.signature,
          sort_order: sort_order + 1000, // tambah di akhir
        });
        if (error) throw error;
        await refresh();
      } else {
        persistLocal([...items, item]);
      }
    },
    [mode, items, refresh, persistLocal],
  );

  // ---- UPDATE -----------------------------------------------------
  const update = useCallback(
    async (originalName: string, item: MenuItem) => {
      if (mode === "supabase" && supabase) {
        const target = items.find((i) => i.name === originalName);
        if (!target?._id) return;
        const { error } = await supabase
          .from(MENU_TABLE)
          .update({
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            tags: item.tags ?? [],
            signature: !!item.signature,
          })
          .eq("id", target._id);
        if (error) throw error;
        await refresh();
      } else {
        persistLocal(items.map((i) => (i.name === originalName ? item : i)));
      }
    },
    [mode, items, refresh, persistLocal],
  );

  // ---- REMOVE -----------------------------------------------------
  const remove = useCallback(
    async (name: string) => {
      if (mode === "supabase" && supabase) {
        const target = items.find((i) => i.name === name);
        if (!target?._id) return;
        const { error } = await supabase
          .from(MENU_TABLE)
          .delete()
          .eq("id", target._id);
        if (error) throw error;
        await refresh();
      } else {
        persistLocal(items.filter((i) => i.name !== name));
      }
    },
    [mode, items, refresh, persistLocal],
  );

  // ---- MOVE (ubah urutan) ----------------------------------------
  const move = useCallback(
    async (name: string, dir: -1 | 1) => {
      const idx = items.findIndex((i) => i.name === name);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= items.length) return;
      const next = [...items];
      [next[idx], next[target]] = [next[target], next[idx]];

      if (mode === "supabase" && supabase) {
        // Tulis ulang sort_order kedua baris yang bertukar
        const a = next[idx];
        const b = next[target];
        await Promise.all([
          a._id &&
            supabase.from(MENU_TABLE).update({ sort_order: idx }).eq("id", a._id),
          b._id &&
            supabase
              .from(MENU_TABLE)
              .update({ sort_order: target })
              .eq("id", b._id),
        ]);
        // Optimistik: tampilkan langsung, lalu sinkron
        setItems(next);
        await refresh();
      } else {
        persistLocal(next);
      }
    },
    [mode, items, refresh, persistLocal],
  );

  // ---- REPLACE ALL (import JSON) ---------------------------------
  const replaceAll = useCallback(
    async (next: MenuItem[]) => {
      if (mode === "supabase" && supabase) {
        // Hapus semua lalu masukkan ulang
        await supabase.from(MENU_TABLE).delete().neq("id", "");
        const rows = next.map((it, i) => ({
          name: it.name,
          description: it.description,
          price: it.price,
          image: it.image,
          category: it.category,
          tags: it.tags ?? [],
          signature: !!it.signature,
          sort_order: i,
        }));
        if (rows.length) {
          const { error } = await supabase.from(MENU_TABLE).insert(rows);
          if (error) throw error;
        }
        await refresh();
      } else {
        persistLocal(next);
      }
    },
    [mode, refresh, persistLocal],
  );

  // ---- RESET ------------------------------------------------------
  const reset = useCallback(async () => {
    if (mode === "supabase" && supabase) {
      await supabase.from(MENU_TABLE).delete().neq("id", "");
      const rows = defaultMenu.map((it, i) => ({
        name: it.name,
        description: it.description,
        price: it.price,
        image: it.image,
        category: it.category,
        tags: it.tags ?? [],
        signature: !!it.signature,
        sort_order: i,
      }));
      await supabase.from(MENU_TABLE).insert(rows);
      await refresh();
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
      setItems(defaultMenu);
      setCustomized(false);
    }
  }, [mode, refresh]);

  // ---- UPLOAD GAMBAR ---------------------------------------------
  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      if (mode === "supabase" && supabase) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from(IMAGE_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
        return data.publicUrl;
      }
      // Mode lokal: jadikan data URL
      return fileToDataUrl(file);
    },
    [mode],
  );

  const value: MenuStore = {
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
    refresh,
    uploadImage,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu harus dipakai di dalam MenuProvider");
  return ctx;
}

// Helper: ubah file gambar menjadi data URL (mode lokal / pratinjau)
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
