-- Fix: rendre le trigger handler tolérant aux erreurs
-- Objectif: ne plus bloquer la création d'utilisateurs Auth
-- À exécuter dans Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    -- Si pas d'email (ex: provider phone), on n'écrit pas dans public.users
    IF NEW.email IS NULL THEN
      RETURN NEW;
    END IF;

    INSERT INTO public.users (id, email, role, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      'editor',
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email,
          full_name = EXCLUDED.full_name;
  EXCEPTION WHEN others THEN
    -- IMPORTANT: ne jamais bloquer la création auth si le profil échoue
    NULL;
  END;

  RETURN NEW;
END;
$$;
