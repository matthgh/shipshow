import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client for Route Handlers.
 * Bypasses RLS — use only server-side, never expose to the client.
 * Ownership checks must be done in code (check user_id matches auth user).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Fall back to anon key if service role key is not set.
  // In that case RLS applies — make sure your policies allow the operation.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}
