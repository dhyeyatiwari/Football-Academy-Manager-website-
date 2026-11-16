import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  Users,
  Trophy,
  Calendar,
  Play,
    ArrowRight,
    LogIn,
    UserCircle,
    LogOut,
  } from 'lucide-react';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Home', href: '/', icon: Play },
  { name: 'Academy', href: '/academy', icon: Shield },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Matches', href: '/matches', icon: Calendar },
  { name: 'Coaching', href: '/coaching', icon: Trophy },
];

const portalItems = [
  { name: 'Admin Portal', href: '/admin', icon: Shield, role: 'admin' as const },
  { name: 'Coach Portal', href: '/coach', icon: Users, role: 'coach' as const },
  { name: 'Parent Portal', href: '/parent', icon: UserCircle, role: 'parent' as const },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPortalHref = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'coach') return '/coach';
    if (user?.role === 'parent') return '/parent';
    return '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-club-border bg-club-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <ClubBadge size="sm" variant="default" showText={false} />
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-club-red transition-colors">
              VK Football Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-club-red text-white shadow-[0_0_15px_rgba(197,30,50,0.3)]'
                      : 'text-club-silver hover:text-white hover:bg-club-surface',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}

            {/* Portal Switcher */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={getPortalHref()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-club-border bg-club-surface text-club-silver hover:text-white hover:border-club-red transition-all"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">{user?.fullName?.split(' ')[0]}'s Portal</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-club-border bg-club-surface text-club-silver hover:text-white hover:border-club-red transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-club-border bg-club-surface text-club-silver hover:text-white hover:border-club-red transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium text-sm">Portal Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-club-border bg-club-bg">
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-club-border">
              <ClubBadge size="sm" variant="default" showText={false} />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                VK Football Academy
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-club-red text-white'
                      : 'text-club-silver hover:text-white hover:bg-club-surface',
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-6 border-t border-club-border">
              <div className="px-4 mb-4 text-xs font-medium text-club-muted uppercase tracking-wider">
                Portal Access
              </div>
              {portalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}