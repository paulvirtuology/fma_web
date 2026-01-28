-- ⚠️ Ne fonctionne que si ton rôle est owner de auth.users (souvent non)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'auth'
      AND c.relname = 'users'
      AND t.tgname = 'on_auth_user_created'
  ) THEN
    ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;
  END IF;
END $$;
