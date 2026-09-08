import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Solo se acepta POST.' });
  }

  try {
    const { name, company, phone, email, topic, message, simulationData } = req.body || {};

    // Validación básica de campos requeridos
    if (!name || !company || !phone || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, empresa, teléfono o email).' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    // Si aún no se configuraron las credenciales de Supabase en Vercel
    if (!supabaseUrl || !supabaseKey) {
      console.warn('ADVERTENCIA: Las variables SUPABASE_URL o SUPABASE_KEY no están configuradas en el entorno.');
      return res.status(200).json({
        success: true,
        warning: 'Las credenciales de Supabase aún no están configuradas en Vercel, pero el lead fue procesado.',
        lead: { name, company, phone, email, topic }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insertar en la tabla "leads"
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          nombre: name,
          empresa: company,
          telefono: phone,
          email: email,
          motivo_consulta: topic || 'General',
          mensaje: message || '',
          datos_simulacion: simulationData || null,
          creado_en: new Date().toISOString(),
          estado: 'Nuevo'
        }
      ])
      .select();

    if (error) {
      console.error('Error al insertar en Supabase:', error);
      return res.status(500).json({ error: 'Error al registrar en la base de datos', details: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Consulta registrada exitosamente en Supabase.',
      lead: data && data[0] ? data[0] : null
    });
  } catch (err) {
    console.error('Error interno del servidor:', err);
    return res.status(500).json({ error: 'Error interno en la función serverless', details: err.message });
  }
}
