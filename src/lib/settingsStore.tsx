import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { defaultSettings, type SiteSettings } from "@/lib/data";
import {
  supabase,
  isSupabaseConfigured,
  IMAGE_BUCKET,
} from "@/lib/supabase";

const STORAGE_KEY = "dhr_settings_v1";
const SETTINGS_TABLE = "site_settings";
const SETTINGS_ID = 1; // baris tunggal

interface SettingsStore {
  settings: SiteSettings;
  loading: boolean;
  save: (next: SiteSettings) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsStore | null>(null);

function loadLocal(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* abaikan */
  }
  return defaultSettings;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadLocal);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .select("data")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (!error && data?.data) {
      setSettings({ ...defaultSettings, ...(data.data as Partial<SiteSettings>) });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) void refresh();
  }, [refresh]);

  const save = useCallback(async (next: SiteSettings) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(SETTINGS_TABLE)
        .upsert({ id: SETTINGS_ID, data: next });
      if (error) throw error;
      setSettings(next);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      setSettings(next);
    }
  }, []);

  const uploadLogo = useCallback(async (file: File): Promise<string> => {
    if (isSupabaseConfigured && supabase) {
      const ext = file.name.split(".").pop() || "png";
      const path = `logo-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      return data.publicUrl;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const value: SettingsStore = { settings, loading, save, uploadLogo, refresh };
  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings harus dipakai di dalam SettingsProvider");
  return ctx;
}
