import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/config';

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase keys missing. Realtime features disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
