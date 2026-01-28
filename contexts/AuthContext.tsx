import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('[AuthContext] refreshUser error:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('[AuthContext] Initialisation auth en cours...');
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          console.log('[AuthContext] Auth initialisé:', currentUser ? `User ${currentUser.email} (${currentUser.role})` : 'Aucun utilisateur');
        }
      } catch (err) {
        console.error('[AuthContext] Erreur critique lors de l\'init auth:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[AuthContext] Chargement terminé.');
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('[AuthContext] Event Supabase Auth:', event);

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (currentSession?.user) {
          console.log('[AuthContext] User detected from session, fetching profile...');
          const profile = await authService.getProfile(currentSession.user);
          if (mounted) setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setUser(null);
      } else {
        // Pour les autres events, on rafraîchit classiquement si besoin
        console.log('[AuthContext] Refreshing user details for event:', event);
        const currentUser = await authService.getCurrentUser();
        if (mounted) setUser(currentUser);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

