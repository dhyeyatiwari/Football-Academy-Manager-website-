/**
 * VK Football Academy - Authentication Context
 * 
 * Manages user authentication state, role-based access control,
 * and session persistence using localStorage.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/data/storage';
import type { UserProfile, UserRole } from '@/types/domain';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isCoach: () => boolean;
  isParent: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vk_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as UserProfile);
      } catch {
        localStorage.removeItem('vk_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = storage.getUsers();
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      throw new Error('No account found with this email address.');
    }

    // In a real Supabase implementation, this would verify the password
    // For now, we accept any password for demo purposes
    setUser(foundUser);
    localStorage.setItem('vk_current_user', JSON.stringify(foundUser));
  }, []);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) => {
    const users = storage.getUsers();
    if (users.find((u) => u.email === data.email)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveUser(newUser);
    setUser(newUser);
    localStorage.setItem('vk_current_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('vk_current_user');
  }, []);

  const hasRole = useCallback((role: UserRole) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isCoach = useCallback(() => user?.role === 'coach', [user]);
  const isParent = useCallback(() => user?.role === 'parent', [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      register,
      hasRole,
      hasAnyRole,
      isAdmin,
      isCoach,
      isParent,
    }}>
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