import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://your-project-ref.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_ItzjGRBkk2HuXwJqpPHQFA_6nPz7NeM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
