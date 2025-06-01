'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Parse and set user data
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      const isDashboardPage = pathname.startsWith('/dashboard');

      // Only redirect if we're certain about the auth state
      if (isDashboardPage && !user) {
        router.replace('/login');
      } else if (isAuthPage && user) {
        router.replace('/dashboard');
      }
    }
  }, [loading, user, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      router.replace('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      router.replace('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 