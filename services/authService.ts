import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

export const authService = {
  async signIn(email: string, password: string) {
    console.log('[authService] signIn: démarrage pour', email);
    try {
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_AUTH')), 10000))
      ]);
      console.log('[authService] signIn: retour de signInWithPassword', { error: error?.message });
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('[authService] signIn exception:', err);
      if (err.message === 'TIMEOUT_AUTH') throw new Error('Le serveur d\'authentification Supabase ne répond pas (Timeout 10s).');
      throw err;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('[authService] getCurrentUser: récupération de la session...');
      // getSession est local et rapide
      const { data: { session } } = await supabase.auth.getSession();
      let authUser = session?.user;

      if (!authUser) {
        console.log('[authService] getCurrentUser: pas de session locale, tentative getUser avec timeout...');
        try {
          const { data, error } = await Promise.race([
            supabase.auth.getUser(),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_GETUSER')), 8000))
          ]);
          if (!error) {
            authUser = data?.user;
          }
        } catch (e) {
          console.warn('[authService] getUser a expiré ou échoué.');
        }
      }

      if (!authUser) {
        console.log('[authService] getCurrentUser: aucun utilisateur trouvé.');
        return null;
      }

      console.log('[authService] getCurrentUser: utilisateur identifié', authUser.id);

      // Récupération du profil avec timeout
      try {
        const { data: profile, error: profileError } = await Promise.race([
          supabase.from('users').select('*').eq('id', authUser.id).maybeSingle(),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_DB')), 8000))
        ]);

        if (profile) {
          console.log('[authService] getCurrentUser: profil trouvé', profile.role);
          return profile as User;
        }
      } catch (dbError) {
        console.error('[authService] Database timeout or error while fetching profile');
      }

      // Fallback ultime: on renvoie au moins l'info de base de auth si la DB est KO
      console.warn('[authService] Renvoi des infos de base (fallback) car la DB ne répond pas');
      return {
        id: authUser.id,
        email: authUser.email!,
        role: 'editor', // Par défaut
        full_name: (authUser.user_metadata as any)?.full_name ?? ''
      } as User;
    } catch (err) {
      console.error('[authService] getCurrentUser exception critique:', err);
      return null;
    }
  },

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  async createUser(email: string, password: string, role: UserRole, fullName?: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        email_redirect_to: window.location.origin,
      },
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    const { data, error } = await supabase
      .from('users')
      .update({ role, full_name: fullName })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateUser(userId: string, updates: { role?: UserRole; full_name?: string; email?: string }) {
    const { data, error } = await supabase
      .from('users')
      .update({
        role: updates.role,
        full_name: updates.full_name,
        email: updates.email,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  },

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as User[];
  },

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === 'admin';
  },
  async getProfile(authUser: any): Promise<User | null> {
    try {
      console.log('[authService] getProfile: fetching for', authUser.id);
      const { data: profile, error } = await Promise.race([
        supabase.from('users').select('*').eq('id', authUser.id).maybeSingle(),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_DB')), 8000))
      ]);

      if (profile) return profile as User;

      // Fallback
      return {
        id: authUser.id,
        email: authUser.email!,
        role: 'editor',
        full_name: (authUser.user_metadata as any)?.full_name ?? ''
      } as User;
    } catch (e) {
      console.error('[authService] getProfile error:', e);
      return null;
    }
  },
};

