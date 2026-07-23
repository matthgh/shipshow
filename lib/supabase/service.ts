import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client for Route Handlers.
 * Bypasses RLS — use only server-side, never expose to the client.
 * Ownership checks must be done in code (check user_id matches auth user).
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
