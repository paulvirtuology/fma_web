-- Table des articles de news
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT,
  category TEXT NOT NULL DEFAULT 'Événement',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access on news"
  ON news FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion (nécessite authentification)
CREATE POLICY "Allow authenticated insert on news"
  ON news FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la mise à jour (nécessite authentification)
CREATE POLICY "Allow authenticated update on news"
  ON news FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Politique pour permettre la suppression (nécessite authentification)
CREATE POLICY "Allow authenticated delete on news"
  ON news FOR DELETE
  USING (true);

-- Création du bucket de storage pour les images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload public (à ajuster selon vos besoins de sécurité)
CREATE POLICY "Allow public upload to images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read from images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Politique pour permettre la suppression
CREATE POLICY "Allow public delete from images bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

