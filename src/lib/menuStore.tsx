import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menuItems as defaultMenu, type MenuItem } from "@/lib/data";

const STORAGE_KEY = "dhr_menu_v1";

interface MenuStore {
  items: MenuItem[];
  /** true jika menu sedang memakai data hasil edit owner (localStorage) */
  isCustomized: boolean;
  add: (item: MenuItem) => void;
  update: (originalName: string, item: MenuItem) => void;
  remove: (name: string) => void;
  move: (name: string, dir: -1 | 1) => void;
  reset: () => void;
  replaceAll: (items: MenuItem[]) => void;
}

const MenuContext = createContext<MenuStore | null>(null);

function load(): { items: MenuItem[]; customized: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MenuItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { items: parsed, customized: true };
      }
    }
  } catch {
    /* abaikan, pakai default */
  }
  return { items: defaultMenu, customized: false };
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(load, []);
  const [items, setItems] = useState<MenuItem[]>(initial.items);
  const [isCustomized, setCustomized] = useState(initial.customized);

  // Simpan setiap kali berubah (kecuali saat reset ke default)
  const persist = useCallback((next: MenuItem[]) => {
    setItems(next);
    setCustomized(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage penuh / diblokir */
    }
  }, []);

  const add = useCallback(
    (item: MenuItem) => persist([...items, item]),
    [items, persist],
  );

  const update = useCallback(
    (originalName: string, item: MenuItem) =>
      persist(items.map((i) => (i.name === originalName ? item : i))),
    [items, persist],
  );

  const remove = useCallback(
    (name: string) => persist(items.filter((i) => i.name !== name)),
    [items, persist],
  );

  const move = useCallback(
    (name: string, dir: -1 | 1) => {
      const idx = items.findIndex((i) => i.name === name);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= items.length) return;
      const next = [...items];
      [next[idx], next[target]] = [next[target], next[idx]];
      persist(next);
    },
    [items, persist],
  );

  const replaceAll = useCallback(
    (next: MenuItem[]) => persist(next),
    [persist],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setItems(defaultMenu);
    setCustomized(false);
  }, []);

  const value: MenuStore = {
    items,
    isCustomized,
    add,
    update,
    remove,
    move,
    reset,
    replaceAll,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu harus dipakai di dalam MenuProvider");
  return ctx;
}

// Helper: ubah file gambar menjadi data URL (agar bisa disimpan & ditampilkan)
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
