#!/usr/bin/env node

/**
 * Crée (ou met à jour) un utilisateur admin.
 * Nécessite SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage:
 *   node scripts/create-admin-simple.js <email> <password> [full_name]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local');
  process.exit(1);
}

const [,, email, password, fullNameRaw] = process.argv;
const fullName = fullNameRaw || 'Administrateur';

if (!email || !password) {
  console.error('Usage: node scripts/create-admin-simple.js <email> <password> [full_name]');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function ensureProfile(userId, userEmail, role, name) {
  const { error } = await supabase
    .from('users')
    .upsert({ id: userId, email: userEmail, role, full_name: name }, { onConflict: 'id' });

  if (error) throw error;
}

async function findAuthUserIdByEmail(targetEmail) {
  // supabase-js v2 n'a pas getUserByEmail -> on liste et on filtre
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;

  const found = data.users.find(u => (u.email || '').toLowerCase() === targetEmail.toLowerCase());
  return found?.id || null;
}

async function main() {
  console.log('🔄 Création / mise à jour admin...');

  // 1) Si l'utilisateur existe déjà côté Auth, on ne recrée pas
  let userId = await findAuthUserIdByEmail(email);

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      console.error('\n❌ createUser a échoué:', error);
      console.error('\n➡️  Cause la plus probable: trigger DB sur auth.users qui plante.');
      console.error('➡️  Solution: exécute `scripts/disable-auth-user-trigger.sql` dans Supabase SQL Editor, puis relance.');
      process.exit(1);
    }

    if (!data.user?.id) {
      console.error('❌ createUser: user manquant');
      process.exit(1);
    }

    userId = data.user.id;
  }

  // 2) Forcer le profil applicatif en admin
  await ensureProfile(userId, email, 'admin', fullName);

  console.log('✅ OK');
  console.log(`- email: ${email}`);
  console.log(`- id: ${userId}`);
  console.log('- role: admin');
}

main().catch((e) => {
  console.error('\n❌ Erreur:', e);
  process.exit(1);
});
