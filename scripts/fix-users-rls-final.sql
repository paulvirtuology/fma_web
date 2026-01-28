-- Script final pour corriger les politiques RLS de la table users
-- À exécuter dans Supabase SQL Editor

-- Supprimer les politiques INSERT existantes
DROP POLICY IF EXISTS "Allow trigger to insert users" ON users;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON users;

-- Politique pour permettre au trigger d'insérer (bypass RLS)
CREATE POLICY "Allow trigger to insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre aux utilisateurs authentifiés d'insérer leur propre profil
CREATE POLICY "Allow users to insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

