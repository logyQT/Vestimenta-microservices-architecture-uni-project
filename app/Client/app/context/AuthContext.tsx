import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('vestimenta_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!password) throw new Error("Password is required");
      const user = await api.auth.login(email);
      setUser(user);
      localStorage.setItem('vestimenta_user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError("Invalid credentials");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
        if(!password) throw new Error("Password required");
        const user = await api.auth.register(name, email);
        setUser(user);
        localStorage.setItem('vestimenta_user', JSON.stringify(user));
        return true;
    } catch (err) {
        setError("Registration failed");
        return false;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vestimenta_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, login, register, logout }}>
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