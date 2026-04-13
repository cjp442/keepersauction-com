import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  role: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signup: (email: string, password: string, username: string, role?: string) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setRole(data.role);
          });
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { user: data.user, error };
  };

  const signup = async (email: string, password: string, username: string, role = 'user') => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data.user) {
      const { error: userError } = await supabase
        .from('users')
        .upsert({ id: data.user.id, email, username, role });
      if (userError) {
        console.error(userError.message);
      }
    }
    setLoading(false);
    return { user: data.user, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const value: AuthContextValue = { user, role, login, signup, logout, refreshUser, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};