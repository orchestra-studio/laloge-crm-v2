import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client using service_role key — bypasses RLS
// ONLY use in server components (never expose to browser)
let adminClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createAdminClient() {
  if (adminClient) return adminClient;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    // Fallback to anon key if service role not available
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error("Missing Supabase configuration");
    }
    adminClient = createSupabaseClient(url, anonKey);
    return adminClient;
  }
  
  adminClient = createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  return adminClient;
}
