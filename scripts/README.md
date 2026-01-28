# Scripts d'administration

## Problème: "Database error creating new user"

Si la création d'utilisateur échoue (Dashboard ou script), c'est généralement le trigger `on_auth_user_created` sur `auth.users` qui plante.
Dans Supabase Cloud tu n'es souvent **pas owner** de `auth.users`, donc tu ne peux pas désactiver ce trigger.

✅ Solution: rendre la fonction du trigger tolérante aux erreurs (ne bloque jamais la création Auth).

1) Exécute `scripts/fix-auth-user-trigger.sql` dans Supabase SQL Editor
2) Puis crée ton admin avec le script Node ci-dessous

## Créer / mettre à jour le premier admin

Pré-requis: dans `.env.local`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Installer la dépendance:

```bash
npm install dotenv
```

Créer l'admin:

```bash
node scripts/create-admin-simple.js admin@example.com password123 "Nom Admin"
```

## (Optionnel) disable/enable trigger

`scripts/disable-auth-user-trigger.sql` et `scripts/enable-auth-user-trigger.sql` ne fonctionnent que si ton rôle est owner de `auth.users` (souvent non sur Supabase Cloud).
