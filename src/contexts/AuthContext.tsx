import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: 'student' | 'instructor') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('elimunova_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (name: string, email: string, password: string, role: 'student' | 'instructor') => {
    try {
      // Get existing users
      const usersData = localStorage.getItem('elimunova_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password, // In production, this would be hashed
        role
      };

      users.push(newUser);
      localStorage.setItem('elimunova_users', JSON.stringify(users));

      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('elimunova_user', JSON.stringify(userWithoutPassword));

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
      const usersData = localStorage.getItem('elimunova_users');
      const users = usersData ? JSON.parse(usersData) : [];

      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('elimunova_user', JSON.stringify(userWithoutPassword));

      // Redirect based on role
      setTimeout(() => {
        if (user.role === 'student') {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elimunova_user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
