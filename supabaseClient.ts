import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase Check:', {
    urlFound: !!supabaseUrl,
    keyFound: !!supabaseAnonKey,
    urlStart: supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'none'
});

// Defensive check: only create client if variables are present
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERRO CRÍTICO: Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas!');
}
