/**
 * VK Football Academy - Route Protection Components
 * 
 * Provides role-based access control for portal routes.
 * Hiding navigation is NOT sufficient - these components enforce
 * access at the route level.
 */

import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Lock, UserCircle, Shield, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, allowedRoles, fallback }: AuthGuardProps) {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-bg">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-club-red animate-spin" />
          <p className="text-club-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (!hasAnyRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-club-bg p-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-club-red/10">
            <Lock className="w-8 h-8 text-club-red" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-club-muted mb-6">
            You don't have permission to access this area. This section is restricted to:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {allowedRoles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full bg-club-surface border border-club-border text-sm font-medium text-club-silver"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            ))}
          </div>
          <p className="text-xs text-club-muted">
            Your current role: <span className="font-medium text-club-red capitalize">{user?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================
// ROLE-SPECIFIC GUARDS
// ============================================

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['admin']}>{children}</AuthGuard>;
}

export function CoachGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['coach', 'admin']}>{children}</AuthGuard>;
}

export function ParentGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['parent', 'admin']}>{children}</AuthGuard>;
}

export function CoachOrAdminGuard({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={['coach', 'admin']}>{children}</AuthGuard>;
}

// ============================================
// PUBLIC ROUTE GUARD (redirects authenticated users)
// ============================================

export function PublicGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-club-bg">
        <Loader2 className="w-10 h-10 text-club-red animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to appropriate portal based on role
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'coach') return <Navigate to="/coach" replace />;
    if (user?.role === 'parent') return <Navigate to="/parent" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ============================================
// LOGIN PAGE COMPONENT
// ============================================

interface LoginPageProps {
  onSuccess?: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'parent' as UserRole,
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData);
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-club-bg p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-xl bg-white ring-1 ring-club-gold/50 flex items-center justify-center overflow-hidden">
            <img src="/vk-crest.jpg" alt="VK Football Academy" className="h-full w-full object-contain" />
          </div>
        </div>

        <div className="rounded-2xl border border-club-border bg-club-surface p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-2 text-club-muted">
              {isLogin
                ? 'Sign in to access your portal'
                : 'Register for VK Football Academy'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-club-silver mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                  placeholder="John Smith"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-club-silver mb-2">
                  Register As
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                >
                  <option value="parent">Parent</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-club-silver mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-club-silver mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-club-silver mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-club-silver mb-2">
                  Phone (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent transition-all"
                  placeholder="+44 7700 900123"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-club-red text-white font-semibold rounded-lg hover:bg-club-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-club-muted text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-club-red hover:underline font-medium"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-lg border border-club-border bg-club-bg">
            <p className="text-xs font-medium text-club-silver mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-club-muted">
              <div className="flex justify-between">
                <span>Admin:</span>
                <code className="bg-club-surface px-2 py-1 rounded">admin@vkfootball.academy</code>
              </div>
              <div className="flex justify-between">
                <span>Coach:</span>
                <code className="bg-club-surface px-2 py-1 rounded">coach@vkfootball.academy</code>
              </div>
              <div className="flex justify-between">
                <span>Parent:</span>
                <code className="bg-club-surface px-2 py-1 rounded">parent@vkfootball.academy</code>
              </div>
              <p className="text-xs text-club-muted mt-2">Password: any value (demo mode)</p>
            </div>
          </div>
        </div>
              </div>
            </div>
          );
        }