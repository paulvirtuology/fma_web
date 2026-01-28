-- Permettre aux utilisateurs authentifiés d'insérer leur propre profil
-- À exécuter dans Supabase SQL Editor

CREATE POLICY "Allow users to insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

