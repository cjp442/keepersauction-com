import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('user');

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user);

    const fetchUserRole = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (data) setRole(data.role);
      }
      setLoading(false);
    };

    fetchUserRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    setLoading(false);
    return { user, error };
  };

  const signup = async (email, password, username, role = 'user') => {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (user) {
      const { error: userError } = await supabase
        .from('users')
        .upsert({ id: user.id, email, username, role });
      if (userError) {
        console.error(userError.message);
      }
    }
    setLoading(false);
    return { user, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    const session = supabase.auth.session();
    setUser(session?.user);
    // Fetching role could be included again here if desired
  };

  const value = { user, role, login, signup, logout, refreshUser, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);