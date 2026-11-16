import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  Shield,
  UserCircle,
  Settings,
  LogOut,
  Mail,
  Bell,
  ChevronDown,
  Play,
  Menu,
  X,
  ClipboardList,
  UserCheck,
  TrendingUp,
  CreditCard,
  Megaphone,
} from 'lucide-react';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PortalLayoutProps {
  role: 'admin' | 'coach' | 'parent';
}

const portalConfig: Record<string, { label: string }> = {
  admin: { label: 'Admin Portal' },
  coach: { label: 'Coach Portal' },
  parent: { label: 'Parent Portal' },
};

const sidebarItems: Record<
  string,
  Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>
> = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Players', href: '/admin/players', icon: UserCircle },
    { label: 'Coaches', href: '/admin/coaches', icon: Users },
    { label: 'Teams', href: '/admin/teams', icon: Users },
    { label: 'Parents', href: '/admin/parents', icon: UserCircle },
    { label: 'Training', href: '/admin/training', icon: Calendar },
    { label: 'Attendance', href: '/admin/attendance', icon: UserCheck },
    { label: 'Matches', href: '/admin/matches', icon: Trophy },
    { label: 'Fees', href: '/admin/fees', icon: CreditCard },
    { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
  coach: [
    { label: 'Dashboard', href: '/coach', icon: LayoutDashboard },
    { label: 'My Teams', href: '/coach/teams', icon: Users },
    { label: 'Training', href: '/coach/training', icon: Calendar },
    { label: 'Session Plans', href: '/coach/session-plans', icon: ClipboardList },
    { label: 'Matches', href: '/coach/matches', icon: Trophy },
    { label: 'Attendance', href: '/coach/attendance', icon: UserCheck },
    { label: 'Player Development', href: '/coach/reports', icon: TrendingUp },
    { label: 'Settings', href: '/coach/settings', icon: Settings },
  ],
  parent: [
    { label: 'Dashboard', href: '/parent', icon: LayoutDashboard },
    { label: 'My Children', href: '/parent/children', icon: UserCircle },
    { label: 'Matches', href: '/parent/matches', icon: Calendar },
    { label: 'Training', href: '/parent/training', icon: Play },
    { label: 'Payments', href: '/parent/payments', icon: Shield },
    { label: 'Subscriptions', href: '/parent/subscriptions', icon: Mail },
    { label: 'Settings', href: '/parent/settings', icon: Settings },
  ],
};

export default function PortalLayout({ role }: PortalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const config = portalConfig[role];
  const items = sidebarItems[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-club-bg text-club-cream">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-club-border bg-club-bg/90 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to={`/${role}`} className="flex items-center gap-2">
              <ClubBadge size="sm" variant="dark" showText={false} />
              <span className="font-display font-bold text-lg tracking-tight text-white">
                VK {config.label}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-club-muted hover:text-club-red transition-colors"
            >
              View Public Site
            </Link>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-club-red rounded-full animate-pulse" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 px-2 sm:px-3 py-1.5 rounded-full border border-club-border bg-club-surface text-club-silver hover:text-white hover:border-club-red transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-club-red flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'VK'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-tight">{user?.fullName || 'Portal User'}</p>
                  <p className="text-xs text-club-muted leading-tight">{config.label}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-club-muted" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-club-surface border border-club-border rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-club-border">
                    <p className="text-sm font-medium text-white">{user?.fullName || 'Portal User'}</p>
                    <p className="text-xs text-club-muted">{user?.email || 'user@vkfootball.academy'}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-club-silver hover:bg-club-red hover:text-white rounded-lg transition-colors">
                      <Mail className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-club-silver hover:bg-club-red hover:text-white rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-club-border mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 bottom-0 left-0 z-30 w-64 border-r border-club-border bg-club-bg transition-transform duration-300',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== `/${role}` && location.pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-club-red text-white shadow-[0_0_15px_rgba(197,30,50,0.2)]'
                      : 'text-club-silver hover:text-white hover:bg-club-surface'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-club-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 z-20 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Page Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}