-- Ejecutar en: https://supabase.com/dashboard/project/qgriwpjsslovkkmnlntg/sql/new

CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  country text NOT NULL,
  group_type text DEFAULT 'Single',
  date text NOT NULL,
  rating integer DEFAULT 5,
  review_text text NOT NULL,
  tour text NOT NULL
);

-- Habilitar seguridad por filas
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer las reseñas
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

-- Cualquiera puede escribir una reseña
CREATE POLICY "Anyone can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);
