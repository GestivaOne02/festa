import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GESTIVA_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.GESTIVA_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.GESTIVA_SUPABASE_URL || !process.env.GESTIVA_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Advertencia: Credenciales de Supabase no cargadas en el entorno. Usando placeholders para evitar error.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let cachedCompanyId: string | null = null;

export async function getEnterpriseCompanyId(): Promise<string | null> {
  // Retornamos el ID de tu empresa en GestivaOne donde acabas de crear los productos
  return process.env.NEXT_PUBLIC_GESTIVA_COMPANY_ID || '983b2767-e031-47a4-862d-a30336d5d81a';
}
