
-- Create solicitudes table with auto-incrementing request number
CREATE TABLE public.solicitudes (
  numero_solicitud BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Generales
  fecha_solicitud DATE,
  canal TEXT,
  localidad TEXT,
  codigo_localidad TEXT,
  director_comercial TEXT,
  nombre_intermediario TEXT,
  clave_intermediario TEXT,
  reasegurador TEXT,
  
  -- Tomador
  nombre_tomador TEXT,
  nit_tomador TEXT,
  ciiu TEXT,
  total_asegurados INTEGER,
  relacion_grupo TEXT,
  distribucion_grupo TEXT,
  tipo_seguro TEXT,
  tasa_actual TEXT,
  tiene_poliza BOOLEAN DEFAULT false,
  compania_actual TEXT,
  tipo_ajuste TEXT,
  forma_pago TEXT,
  valor_asegurado_expresion TEXT,
  condiciones_particulares TEXT,
  
  -- Coberturas (JSONB for flexibility)
  coberturas JSONB DEFAULT '[]'::jsonb,
  
  -- Clausulas (JSONB array of active clause names)
  clausulas JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert solicitudes
CREATE POLICY "Anyone can insert solicitudes"
  ON public.solicitudes FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read solicitudes
CREATE POLICY "Anyone can read solicitudes"
  ON public.solicitudes FOR SELECT
  USING (true);
