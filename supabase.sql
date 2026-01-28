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

-- Table des blocs de contenu éditables
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  page TEXT NOT NULL DEFAULT 'home',
  section TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image TEXT,
  metadata JSONB,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks(page);
CREATE INDEX IF NOT EXISTS idx_content_blocks_section ON content_blocks(section);
CREATE INDEX IF NOT EXISTS idx_content_blocks_key ON content_blocks(key);

CREATE TRIGGER update_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on content_blocks"
  ON content_blocks FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on content_blocks"
  ON content_blocks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on content_blocks"
  ON content_blocks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on content_blocks"
  ON content_blocks FOR DELETE
  USING (true);

-- Table des pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on pages"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Allow authenticated read all pages"
  ON pages FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on pages"
  ON pages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on pages"
  ON pages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on pages"
  ON pages FOR DELETE
  USING (true);

-- Table des paramètres du site
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on site_settings"
  ON site_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Table des utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour obtenir le rôle de l'utilisateur actuel
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER;

-- Trigger pour créer automatiquement un enregistrement dans users lors de la création d'un compte auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (NEW.id, NEW.email, 'editor', COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre au trigger d'insérer des utilisateurs (bypass RLS)
CREATE POLICY "Allow trigger to insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Politique pour permettre aux admins de voir tous les utilisateurs
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (is_admin());

-- Politique pour permettre aux admins de modifier tous les utilisateurs
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Mettre à jour les politiques RLS pour vérifier les rôles
DROP POLICY IF EXISTS "Allow authenticated insert on news";
DROP POLICY IF EXISTS "Allow authenticated update on news";
DROP POLICY IF EXISTS "Allow authenticated delete on news";

CREATE POLICY "Allow authenticated insert on news"
  ON news FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on news"
  ON news FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on news"
  ON news FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert on content_blocks";
DROP POLICY IF EXISTS "Allow authenticated update on content_blocks";
DROP POLICY IF EXISTS "Allow authenticated delete on content_blocks";

CREATE POLICY "Allow authenticated insert on content_blocks"
  ON content_blocks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on content_blocks"
  ON content_blocks FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on content_blocks"
  ON content_blocks FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert on pages";
DROP POLICY IF EXISTS "Allow authenticated update on pages";
DROP POLICY IF EXISTS "Allow authenticated delete on pages";

CREATE POLICY "Allow authenticated insert on pages"
  ON pages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on pages"
  ON pages FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on pages"
  ON pages FOR DELETE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated insert on site_settings";
DROP POLICY IF EXISTS "Allow authenticated update on site_settings";

CREATE POLICY "Allow authenticated insert on site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on site_settings"
  ON site_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
