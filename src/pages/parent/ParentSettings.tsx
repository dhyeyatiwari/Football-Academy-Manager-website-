import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  CreditCard,
  Calendar,
  Trophy,
  Settings,
  LogOut,
  ChevronRight,
  Edit3,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Megaphone,
  UserCheck,
  UserX,
  UserPlus,
  ClipboardList,
  TrendingUp,
  LayoutDashboard,
  Menu,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Player, Match, TrainingSession, FeeRecord, Subscription, Announcement } from '@/types/domain';

const ParentSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    address: '123 Main St, City, Country',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-club-border bg-club-surface p-4">
            <nav className="space-y-1">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'billing', label: 'Billing', icon: CreditCard },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-club-red text-white'
                      : 'text-club-silver hover:bg-club-bg hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-club-border bg-club-surface p-6">
              <h3 className="font-display text-lg font-bold text-white mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-club-silver mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-club-border bg-club-surface p-6">
              <h3 className="font-display text-lg font-bold text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-xl bg-club-bg cursor-pointer hover:bg-club-bg/80 transition-colors">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-club-muted">Receive push notifications for important updates</p>
                  </div>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-xl bg-club-bg cursor-pointer hover:bg-club-bg/80 transition-colors">
                  <div>
                    <p className="font-medium text-white">Email Alerts</p>
                    <p className="text-sm text-club-muted">Receive email notifications for matches and training</p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={formData.emailAlerts}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                  />
                </label>
                <label className="flex items-center justify-between p-4 rounded-xl bg-club-bg cursor-pointer hover:bg-club-bg/80 transition-colors">
                  <div>
                    <p className="font-medium text-white">SMS Alerts</p>
                    <p className="text-sm text-club-muted">Receive SMS notifications for urgent updates</p>
                  </div>
                  <input
                    type="checkbox"
                    name="smsAlerts"
                    checked={formData.smsAlerts}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-club-border bg-club-surface p-6">
              <h3 className="font-display text-lg font-bold text-white mb-6">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-club-silver mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'billing' && (
            <div className="rounded-2xl border border-club-border bg-club-surface p-6">
              <h3 className="font-display text-lg font-bold text-white mb-6">Billing Information</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-club-bg">
                  <p className="text-sm text-club-muted mb-2">Current Plan</p>
                  <p className="font-display text-xl font-bold text-white">Family Plan</p>
                  <p className="text-sm text-club-muted">€49.99/month</p>
                </div>
                <div className="p-4 rounded-xl bg-club-bg">
                  <p className="text-sm text-club-muted mb-2">Payment Method</p>
                  <p className="font-medium text-white">Visa ending in 4242</p>
                  <p className="text-sm text-club-muted">Expires 12/25</p>
                </div>
                <div className="p-4 rounded-xl bg-club-bg">
                  <p className="text-sm text-club-muted mb-2">Next Billing Date</p>
                  <p className="font-medium text-white">January 15, 2025</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-club-surface px-5 py-2.5 text-sm font-semibold text-club-silver hover:text-white transition-colors"
                >
                  Update Payment Method
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;