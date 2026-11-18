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
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FeeRecord, Player } from '@/types/domain';

const AdminFees = () => {
  const { user } = useAuth();
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [formData, setFormData] = useState({
    playerId: '',
    playerName: '',
    amount: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    paidDate: '',
    status: 'Pending' as FeeRecord['status'],
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    setFeeRecords(dataService.getFeeRecords());
    setPlayers(dataService.getPlayers());
    setLoading(false);
  }, []);

  const filteredFees = feeRecords.filter((fee) => {
    const matchesStatus = selectedStatus === 'all' || fee.status === selectedStatus;
    return matchesStatus;
  });

  const handleOpenDialog = (fee?: FeeRecord) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        playerId: fee.playerId,
        playerName: fee.playerName,
        amount: fee.amount.toString(),
        description: fee.description,
        dueDate: fee.dueDate,
        paidDate: fee.paidDate || '',
        status: fee.status,
        paymentMethod: fee.paymentMethod || '',
        notes: fee.notes || '',
      });
    } else {
      setEditingFee(null);
      setFormData({
        playerId: '',
        playerName: '',
        amount: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        paidDate: '',
        status: 'Pending',
        paymentMethod: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFee(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.playerId || !formData.amount.trim() || !formData.description.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const fee: FeeRecord = {
      id: editingFee?.id || `fee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: formData.playerId,
      playerName: formData.playerName,
      amount: parseFloat(formData.amount),
      description: formData.description,
      dueDate: formData.dueDate,
      paidDate: formData.paidDate || undefined,
      status: formData.status,
      paymentMethod: formData.paymentMethod || undefined,
      notes: formData.notes || undefined,
      createdAt: editingFee?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveFeeRecord(fee);

    if (editingFee) {
      setFeeRecords((prev) => prev.map((f) => (f.id === fee.id ? fee : f)));
      showSuccess('Fee record updated successfully');
    } else {
      setFeeRecords((prev) => [...prev, fee]);
      showSuccess('Fee record added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fee record?')) {
      dataService.deleteFeeRecord(id);
      setFeeRecords((prev) => prev.filter((f) => f.id !== id));
      showSuccess('Fee record deleted successfully');
    }
  };

  const getTotalOutstanding = () => {
    return feeRecords
      .filter((f) => f.status === 'Pending' || f.status === 'Overdue')
      .reduce((acc, f) => acc + f.amount, 0);
  };

  const getTotalCollected = () => {
    return feeRecords
      .filter((f) => f.status === 'Paid')
      .reduce((acc, f) => acc + f.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading fees...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Fees & Payments"
        description="Manage academy fees, payments, and outstanding balances."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Fee Record
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Records" value={feeRecords.length} icon={CreditCard} />
        <StatCard label="Collected" value={`€${getTotalCollected().toFixed(0)}`} icon={CheckCircle2} />
        <StatCard label="Outstanding" value={`€${getTotalOutstanding().toFixed(0)}`} icon={AlertCircle} />
        <StatCard label="Pending" value={feeRecords.filter((f) => f.status === 'Pending').length} icon={Clock} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search fees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredFees.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No fee records"
            description="No fee records match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Description</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Amount</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Due Date</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => {
                  const player = players.find((p) => p.id === fee.playerId);
                  const statusColors: Record<string, string> = {
                    Pending: 'bg-club-red/15 text-club-red',
                    Paid: 'bg-club-blue/15 text-club-blue',
                    Overdue: 'bg-club-gold/15 text-club-gold',
                    Cancelled: 'bg-club-muted/15 text-club-muted',
                  };
                  return (
                    <tr key={fee.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-club-red text-white font-bold">
                            {fee.playerName ? fee.playerName.split(' ').map((n) => n[0]).join('') : 'P'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{fee.playerName || 'Unknown'}</p>
                            <p className="text-xs text-club-muted">{player?.email || 'No contact'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{fee.description}</td>
                      <td className="p-4 text-sm text-club-silver">€{fee.amount.toFixed(2)}</td>
                      <td className="p-4 text-sm text-club-silver">{fee.dueDate}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[fee.status] || 'bg-club-surface text-club-muted'}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(fee)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDialog(fee)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
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

      {/* Create/Edit Fee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingFee ? 'Edit Fee Record' : 'Add Fee Record'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playerId">Player *</Label>
                <Select
                  value={formData.playerId}
                  onValueChange={(value) => {
                    const player = players.find((p) => p.id === value);
                    setFormData({ ...formData, playerId: value, playerName: player ? `${player.firstName} ${player.lastName}` : '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a player</SelectItem>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.firstName} {player.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Monthly tuition, Kit fee"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidDate">Paid Date</Label>
                <Input
                  id="paidDate"
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as FeeRecord['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as string })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this fee"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingFee ? 'Update Fee' : 'Add Fee Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFees;