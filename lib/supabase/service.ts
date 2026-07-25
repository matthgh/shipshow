import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client for Route Handlers.
 * Bypasses RLS — use only server-side, never expose to the client.
 * Ownership checks must be done in code (check user_id matches auth user).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.'
    )
  }

  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}
