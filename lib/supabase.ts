import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GESTIVA_SUPABASE_URL || '';
const supabaseAnonKey = process.env.GESTIVA_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Advertencia: Credenciales de Supabase no cargadas en el entorno.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let cachedCompanyId: string | null = null;

/**
 * Realiza el login automático del Administrador Enterprise y obtiene su company_id.
 * Almacena el ID en caché para evitar logins redundantes.
 */
export async function getEnterpriseCompanyId(): Promise<string | null> {
  if (cachedCompanyId) return cachedCompanyId;

  console.log('🔄 Conectando y autenticando con GestivaOne...');
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'randymendozasalas42@gmail.com',
      password: 'Admin123'
    });

    if (authError) {
      console.error('❌ Error de conexión al backend de Gestiva:', authError.message);
      return null;
    }

    if (!authData?.user) {
      console.error('❌ Error: No se retornó información de usuario.');
      return null;
    }

    // Obtener el perfil del usuario autenticado para extraer su company_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile?.company_id) {
      console.error('❌ Error al recuperar el ID de empresa de Gestiva:', profileError?.message);
      return null;
    }

    cachedCompanyId = profile.company_id;
    console.log('🎉 Vinculación exitosa con GestivaOne. ID de Empresa:', cachedCompanyId);
    return cachedCompanyId;
  } catch (error) {
    console.error('❌ Error inesperado durante la autovinculación:', error);
    return null;
  }
}
