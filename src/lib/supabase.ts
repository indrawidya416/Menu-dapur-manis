import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true jika kredensial Supabase tersedia (build dikonfigurasi dengan benar). */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Klien Supabase. Bernilai null bila kredensial belum di-set —
 * situs tetap berjalan memakai data menu lokal (mode fallback).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      db: { schema: "public" },
    })
  : null;

// Nama tabel & bucket terpusat
export const MENU_TABLE = "menu_items";
export const IMAGE_BUCKET = "menu-images";

// Bentuk baris di database (snake_case)
export interface MenuRow {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  signature: boolean;
  sort_order: number;
}
