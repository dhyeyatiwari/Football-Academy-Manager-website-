import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Download,
  Calendar,
  UserCircle,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Parent, Player } from '@/types/domain';

const AdminParents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    childrenIds: [] as string[],
  });

  useEffect(() => {
    setParents(dataService.getParents());
    setPlayers(dataService.getPlayers());
    setLoading(false);
  }, []);

  const filteredParents = parents.filter((parent) => {
    const matchesSearch = parent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenDialog = (parent?: Parent) => {
    if (parent) {
      setEditingParent(parent);
      setFormData({
        fullName: parent.fullName,
        email: parent.email,
        phone: parent.phone || '',
        address: parent.address || '',
        childrenIds: parent.childrenIds,
      });
    } else {
      setEditingParent(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        childrenIds: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingParent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const parent: Parent = {
      id: editingParent?.id || `parent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: editingParent?.userId || `user_${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      childrenIds: formData.childrenIds,
      childrenNames: formData.childrenIds.map((id) => players.find((p) => p.id === id)?.firstName || ''),
      createdAt: editingParent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveParent(parent);

    if (editingParent) {
      setParents((prev) => prev.map((p) => (p.id === parent.id ? parent : p)));
      showSuccess('Parent updated successfully');
    } else {
      setParents((prev) => [...prev, parent]);
      showSuccess('Parent added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this parent?')) {
      dataService.deleteParent(id);
      setParents((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Parent deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading parents...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Parents"
        description="Manage parent accounts and link them to their children."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Parent
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Parents" value={parents.length} icon={Users} />
        <StatCard label="With Children" value={parents.filter((p) => p.childrenIds.length > 0).length} icon={UserPlus} />
        <StatCard label="Linked Players" value={[...new Set(parents.flatMap((p) => p.childrenIds))].length} icon={Users} />
        <StatCard label="Players Without Parent" value={players.filter((p) => !p.parentIds || p.parentIds.length === 0).length} icon={UserCircle} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
          <input
            type="text"
            placeholder="Search parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredParents.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No parents found"
              description="No parents match your current filters."
            />
          </div>
        ) : (
          filteredParents.map((parent) => {
            const parentPlayers = players.filter((p) => parent.childrenIds.includes(p.id));
            return (
              <div
                key={parent.id}
                className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-club-red text-white font-bold">
                      {parent.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{parent.fullName}</h3>
                      <p className="text-xs text-club-muted">{parent.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {parent.phone && (
                    <div className="flex items-center gap-2 text-sm text-club-silver">
                      <Phone className="h-4 w-4" />
                      <span>{parent.phone}</span>
                    </div>
                  )}
                  {parent.address && (
                    <div className="flex items-center gap-2 text-sm text-club-silver">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{parent.address}</span>
                    </div>
                  )}
                </div>

                {/* Children */}
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-club-muted mb-2">Children</p>
                  <div className="flex flex-wrap gap-2">
                    {parentPlayers.length > 0 ? (
                      parentPlayers.map((player) => (
                        <span key={player.id} className="px-2.5 py-1 rounded-lg bg-club-bg border border-club-border text-xs text-club-silver">
                          {player.firstName} {player.lastName}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-club-muted">No children linked</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDialog(parent)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenDialog(parent)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(parent.id)}
                    className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete parent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Parent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingParent ? 'Edit Parent' : 'Add Parent'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Parent full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="parent@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7700 900123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, city"
              />
            </div>

            <div className="space-y-2">
              <Label>Children</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <label key={player.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.childrenIds.includes(player.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, childrenIds: [...formData.childrenIds, player.id] });
                        } else {
                          setFormData({ ...formData, childrenIds: formData.childrenIds.filter((id) => id !== player.id) });
                        }
                      }}
                      className="rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                    />
                    <span className="text-sm text-club-silver">{player.firstName} {player.lastName}</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingParent ? 'Update Parent' : 'Add Parent'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminParents;