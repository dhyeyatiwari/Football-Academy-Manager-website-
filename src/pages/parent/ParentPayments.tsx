import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
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
import type { FeeRecord, Player } from '@/types/domain';

const ParentPayments = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const allPlayers = dataService.getPlayers();
    const myChildren = allPlayers.filter((p) => p.parentIds.includes('parent_1'));
    const myPlayerIds = myChildren.map((c) => c.id);
    const myFees = dataService.getFeeRecords().filter((f) => myPlayerIds.includes(f.playerId));
    setFees(myFees);
    setPlayers(myChildren);
    setLoading(false);
  }, []);

  const filteredFees = fees.filter((fee) => {
    const matchesSearch = fee.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || fee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee record?')) {
      // In a real app, this would call dataService.deleteFeeRecord
      setFees((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleMarkPaid = (id: string) => {
    setFees((prev) => prev.map((f) => f.id === id ? { ...f, status: 'Paid', paidDate: new Date().toISOString() } : f));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading payments...</p>
        </div>
      </div>
    );
  }

  const totalAmount = fees.reduce((acc, f) => acc + f.amount, 0);
  const pendingAmount = fees.filter((f) => f.status === 'Pending' || f.status === 'Overdue').reduce((acc, f) => acc + f.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="View and manage your children's fee payments and subscriptions."
        action={
          <button
            onClick={() => alert('Make payment form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Make Payment
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Amount" value={`€${totalAmount}`} icon={CreditCard} />
        <StatCard label="Pending Amount" value={`€${pendingAmount}`} icon={AlertCircle} />
        <StatCard label="Paid" value={fees.filter((f) => f.status === 'Paid').length} icon={CheckCircle2} />
        <StatCard label="Overdue" value={fees.filter((f) => f.status === 'Overdue').length} icon={Clock} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search payments..."
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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredFees.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="No payments match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Amount</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Due Date</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Method</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Description</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => {
                  const statusColors: Record<string, string> = {
                    Paid: 'bg-club-blue/15 text-club-blue',
                    Pending: 'bg-club-red/15 text-club-red',
                    Overdue: 'bg-club-muted/15 text-club-muted',
                    Refunded: 'bg-club-gold/15 text-club-gold',
                  };
                  return (
                    <tr key={fee.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-club-red text-white text-xs font-bold">
                            {fee.playerName.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{fee.playerName}</p>
                            <p className="text-xs text-club-muted">{fee.parentName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-white">€{fee.amount}</td>
                      <td className="p-4 text-sm text-club-silver">{fee.dueDate}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[fee.status] || 'bg-club-surface text-club-muted'}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{fee.method || '—'}</td>
                      <td className="p-4 text-sm text-club-silver line-clamp-1">{fee.description}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View fee ${fee.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {fee.status !== 'Paid' && (
                            <button
                              onClick={() => handleMarkPaid(fee.id)}
                              className="p-2 rounded-lg bg-club-red text-white hover:bg-club-red-hover transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(fee.id)}
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

export default ParentPayments;