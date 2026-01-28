-- Seed script for FMA Madagascar Landing Page Content Blocks
-- Use this in your Supabase SQL Editor

-- First, ensure the table exists (just in case)
-- CREATE TABLE IF NOT EXISTS content_blocks (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   key TEXT UNIQUE NOT NULL,
--   page TEXT NOT NULL,
--   section TEXT NOT NULL,
--   title TEXT,
--   content TEXT,
--   image TEXT,
--   metadata JSONB DEFAULT '{}'::jsonb,
--   order_index INTEGER DEFAULT 0,
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- Insert initial blocks for the Home page
-- Using ON CONFLICT to avoid errors if they already exist

INSERT INTO content_blocks (key, page, section, title, content, image, metadata, order_index)
VALUES 
(
  'hero', 
  'home', 
  'hero', 
  'Pour les jeunes, <br /><span class="text-blue-400 italic">avec Marie</span>.', 
  'Nous sommes une communauté religieuse dédiée à l''accompagnement et à l''éducation intégrale de la jeunesse malgache, inspirée par le charisme de Don Bosco.', 
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000', 
  '{
    "badge": "FMA Madagascar",
    "buttons": [
      {"text": "Découvrir nos missions", "icon": true, "primary": true},
      {"text": "Soutenir notre action", "icon": false, "primary": false}
    ]
  }'::jsonb,
  0
),
(
  'pillars', 
  'home', 
  'main', 
  'Nos Piliers Éducatifs', 
  'Le Système Préventif de Don Bosco repose sur trois piliers fondamentaux qui guident notre action quotidienne auprès des jeunes.', 
  null, 
  '{
    "items": [
      {"icon": "star", "title": "Raison", "desc": "Favoriser le dialogue et la compréhension mutuelle entre l''éducateur et le jeune."},
      {"icon": "users", "title": "Religion", "desc": "Proposer une spiritualité joyeuse et concrète, basée sur l''amour de Dieu et du prochain."},
      {"icon": "heart", "title": "Affection", "desc": "Créer un climat de confiance où le jeune se sent aimé et valorisé."}
    ]
  }'::jsonb,
  1
),
(
  'quote', 
  'home', 
  'quote', 
  null, 
  '"Fais en sorte que chaque jeune se sente aimé."', 
  null, 
  '{"author": "Saint Jean Bosco"}'::jsonb,
  2
),
(
  'news_section', 
  'home', 
  'main', 
  'Dernières Actualités', 
  'Restez informés des événements et projets de notre communauté à travers Madagascar.', 
  null, 
  '{"showViewAll": true}'::jsonb,
  3
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  image = EXCLUDED.image,
  metadata = EXCLUDED.metadata,
  order_index = EXCLUDED.order_index,
  updated_at = now();
