import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use non-crashing placeholders for build phase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://MISSING_CONFIG.supabase.co'
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    'MISSING_KEY'

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Diagnostic helper to check if the uplink is correctly configured.
 */
export function isUplinkStable() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  return !!(url && key && url !== 'https://MISSING_CONFIG.supabase.co')
}
