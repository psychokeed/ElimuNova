import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  role: 'student' | 'instructor';
  avatar_url?: string;
}

interface UserRole {
  role: 'student' | 'instructor';
}

interface User extends SupabaseUser {
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile and role from secure table
          setTimeout(async () => {
            const [profileResult, roleResult] = await Promise.all([
              supabase.from('profiles').select('*').eq('id', session.user.id).single(),
              supabase.from('user_roles').select('role').eq('user_id', session.user.id).single()
            ]);
            
            if (profileResult.data && roleResult.data) {
              setProfile({
                ...profileResult.data,
                role: roleResult.data.role
              } as Profile);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          const [profileResult, roleResult] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('user_roles').select('role').eq('user_id', session.user.id).single()
          ]);
          
          if (profileResult.data && roleResult.data) {
            setProfile({
              ...profileResult.data,
              role: roleResult.data.role
            } as Profile);
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (name: string, email: string, password: string, role: 'student' | 'instructor') => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Redirect based on role
      setTimeout(() => {
        if (role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/instructor-dashboard');
        }
      }, 100);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get user role from secure table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      // Redirect based on role
      setTimeout(() => {
        if (roleData?.role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/instructor-dashboard');
        }
      }, 100);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
