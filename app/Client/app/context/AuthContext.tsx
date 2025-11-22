import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("vestimenta_token");
      if (token) {
        try {
          const userData = await api.auth.verify(token);
          setUser(userData);
        } catch (err) {
          console.error("Session expired", err);
          localStorage.removeItem("vestimenta_token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await api.auth.login(email, password);
      localStorage.setItem("vestimenta_token", token);

      const userData = await api.auth.verify(token);

      setUser(userData);

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
      await api.auth.register(name, email, password);

      return await login(email, password);
    } catch (err) {
      setError("Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await api.auth.updateUser(localStorage.getItem("vestimenta_token") || "", updates);
      const user = response;

      if (user) {
        setUser({ ...user, ...updates });
      }
      if (updates.email) {
        login(updates.email, updates.password || "");
      } else {
        login(user.email, updates.password || "");
      }
      return true;
    } catch (err: any) {
      setError(err.message || "Profile update failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vestimenta_token");
  };

  return <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
