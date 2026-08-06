/** URL + clé anon Supabase (peuvent être absentes tant qu'Eliott n'a pas
 *  fourni ses clés — cf. mémoire projet « .env.local est un PDF »). */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** true seulement si les deux valeurs sont présentes. Le site fonctionne
 *  sans Supabase (collection stockée en localStorage). */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
