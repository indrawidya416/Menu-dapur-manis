import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Fallback untuk mode lokal (tanpa Supabase): password sederhana
export const LOCAL_ADMIN_PASSWORD = "dapurharum2024";
const LOCAL_AUTH_KEY = "dhr_admin_auth";

export interface SignInResult {
  ok: boolean;
  error?: string;
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }
  // Mode lokal: cocokkan password sederhana (kolom email diabaikan)
  if (password === LOCAL_ADMIN_PASSWORD) {
    sessionStorage.setItem(LOCAL_AUTH_KEY, "1");
    return { ok: true };
  }
  return { ok: false, error: "Kata sandi salah." };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  sessionStorage.removeItem(LOCAL_AUTH_KEY);
}

export async function getInitialSession(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }
  return sessionStorage.getItem(LOCAL_AUTH_KEY) === "1";
}

export function onAuthChange(cb: (authed: boolean) => void): () => void {
  if (isSupabaseConfigured && supabase) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      cb(!!session);
    });
    return () => data.subscription.unsubscribe();
  }
  return () => {};
}
