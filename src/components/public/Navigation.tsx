import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  Users,
  Trophy,
  Calendar,
  Play,
  ArrowRight,
  Login,
  UserCircle,
} from 'lucide-react';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Play },
  { name: 'Academy', href: '/academy', icon: Shield },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Matches', href: '/matches', icon: Calendar },
  { name: 'Coaching', href: '/coaching', icon: Trophy },
];

const portalItems = [
  { name: 'Admin Portal', href: '/admin', icon: Shield },
  { name: 'Coach Portal', href: '/coach', icon: Users },
  { name: 'Parent Portal', href: '/parent', icon: UserCircle },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-club-border bg-club-surface text-club-silver hover:text-white hover:border-club-red transition-all">
                <UserCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Portal</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
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
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}