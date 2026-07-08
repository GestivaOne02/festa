import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GESTIVA_SUPABASE_URL || '';
const supabaseAnonKey = process.env.GESTIVA_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Advertencia: Credenciales de Supabase no cargadas en el entorno.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let cachedCompanyId: string | null = null;

export async function getEnterpriseCompanyId(): Promise<string | null> {
  // Retornamos el ID de empresa estáticamente. No hacemos login en frontend.
  return '99f3eb1c-483b-4870-b640-00983e847a4a';
}
