-- Script pour corriger la politique RLS pour permettre au trigger d'insérer des utilisateurs
-- À exécuter dans Supabase SQL Editor si le trigger ne fonctionne pas

-- Supprimer la politique existante si elle existe
DROP POLICY IF EXISTS "Allow trigger to insert users" ON users;

-- Créer la politique pour permettre au trigger d'insérer des utilisateurs
CREATE POLICY "Allow trigger to insert users"
  ON users FOR INSERT
  WITH CHECK (true);

