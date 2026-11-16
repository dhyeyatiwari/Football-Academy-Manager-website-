import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Subscription, Player } from '@/types/domain';

const ParentSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [children, setChildren] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const allPlayers = dataService.getPlayers();
    const myChildren = allPlayers.filter((p) => p.parentIds.includes('parent_1'));
    const myPlayerIds = myChildren.map((c) => c.id);
    const mySubscriptions = dataService.getSubscriptions().filter((s) => myPlayerIds.includes(s.playerId));
    setSubscriptions(mySubscriptions);
    setChildren(myChildren);
    setLoading(false);
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      // In a real app, this would call dataService.deleteSubscription
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  const totalAmount = subscriptions.reduce((acc, s) => acc + s.amount, 0);
  const activeCount = subscriptions.filter((s) => s.status === 'Active').length;

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="View and manage your children's academy subscriptions."
        action={
          <button
            onClick={() => alert('Subscribe form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Subscribe
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Subscriptions" value={subscriptions.length} icon={Shield} />
        <StatCard label="Active" value={activeCount} icon={CheckCircle2} />
        <StatCard label="Total Value" value={`€${totalAmount}`} icon={CreditCard} />
        <StatCard label="Pending" value={subscriptions.filter((s) => s.status === 'Pending').length} icon={Clock} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredSubscriptions.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No subscriptions found"
            description="No subscriptions match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Plan</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Amount</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Start Date</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">End Date</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((sub) => {
                  const statusColors: Record<string, string> = {
                    Active: 'bg-club-blue/15 text-club-blue',
                    Pending: 'bg-club-red/15 text-club-red',
                    Cancelled: 'bg-club-muted/15 text-club-muted',
                    Expired: 'bg-club-muted/15 text-club-muted',
                  };
                  return (
                    <tr key={sub.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-club-red text-white text-xs font-bold">
                            {sub.playerName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{sub.playerName}</p>
                            <p className="text-xs text-club-muted">{sub.parentName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{sub.planName}</td>
                      <td className="p-4 text-sm font-medium text-white">€{sub.amount}</td>
                      <td className="p-4 text-sm text-club-silver">{sub.startDate}</td>
                      <td className="p-4 text-sm text-club-silver">{sub.endDate}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status] || 'bg-club-surface text-club-muted'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View subscription ${sub.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit subscription ${sub.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentSubscriptions;