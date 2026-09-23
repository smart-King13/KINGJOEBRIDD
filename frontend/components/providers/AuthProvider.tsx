'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ApiError } from '@/types/api';
import { authApi } from '@/lib/api/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: any) => {
    const response = await authApi.login(credentials);
    const authData = await authApi.me();
    setUser(authData.data);
    if (authData.data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/account');
    }
  };

  const register = async (data: any) => {
    const response = await authApi.register(data);
    const authData = await authApi.me();
    setUser(authData.data);
    if (authData.data.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/account');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore errors on logout (e.g. 401 already expired)
    } finally {
      setUser(null);
      if (pathname.startsWith('/account')) {
        router.push('/login');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
