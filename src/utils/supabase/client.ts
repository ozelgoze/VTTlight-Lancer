import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use non-crashing placeholders for build phase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Diagnostic helper to check if the uplink is correctly configured.
 */
export function isUplinkStable() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url.includes('supabase.co'))
}
