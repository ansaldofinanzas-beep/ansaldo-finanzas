-- ==============================================================================
-- Esquema de Base de Datos para Cristian Ansaldo (CFO Externo & Finanzas PyME)
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ==============================================================================

-- 1. Crear tabla de Leads / Consultas
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    empresa TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    motivo_consulta TEXT NOT NULL,
    mensaje TEXT,
    datos_simulacion JSONB,
    estado TEXT DEFAULT 'Nuevo' CHECK (estado IN ('Nuevo', 'Contactado', 'Reunion_Agendada', 'Propuesta_Enviada', 'Cerrado', 'Descartado')),
    notas_internas TEXT,
    creado_en TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Índices para optimizar búsquedas y orden por fecha
CREATE INDEX IF NOT EXISTS idx_leads_creado_en ON public.leads (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON public.leads (estado);

-- 3. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Política para permitir inserciones públicas (desde la web)
CREATE POLICY "Permitir insercion publica de consultas"
ON public.leads
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- 5. Política para permitir lectura y gestión administrativa
CREATE POLICY "Permitir lectura y modificacion completa para administradores"
ON public.leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Comentario informativo en la tabla
COMMENT ON TABLE public.leads IS 'Registro de consultas y leads capturados desde la web de Cristian Ansaldo';
