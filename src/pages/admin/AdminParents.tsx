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
  Mail,
  Phone,
  MapPin,
  Baby,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Parent, Player } from '@/types/domain';

const AdminParents = () => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this parent?')) {
      // In a real app, this would call dataService.deleteParent
      setParents((prev) => prev.filter((p) => p.id !== id));
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
        description="Manage parent accounts and their children's enrollment."
        action={
          <button
            onClick={() => alert('Add parent form would go here')}
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
        <StatCard label="With Children" value={parents.filter((p) => p.childIds.length > 0).length} icon={Baby} />
        <StatCard label="Total Children" value={parents.reduce((acc, p) => acc + p.childIds.length, 0)} icon={UserPlus} />
        <StatCard label="Avg Children" value={parents.length > 0 ? (parents.reduce((acc, p) => acc + p.childIds.length, 0) / parents.length).toFixed(1) : '0'} icon={Users} />
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
            const children = players.filter((p) => parent.childIds.includes(p.id));
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
                  <div className="flex items-center gap-2 text-sm text-club-silver">
                    <Mail className="h-4 w-4" />
                    <span>{parent.email}</span>
                  </div>
                </div>

                {/* Children */}
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-club-muted mb-2">Children ({children.length})</p>
                  <div className="space-y-2">
                    {children.length > 0 ? (
                      children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2 p-2 rounded-lg bg-club-bg border border-club-border">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-club-red/15 text-club-red text-xs font-bold">
                            {child.firstName[0]}{child.lastName[0]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{child.firstName} {child.lastName}</p>
                            <p className="text-xs text-club-muted">{child.ageGroup} · {child.teamName || 'No team'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-club-muted">No children enrolled</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`View parent ${parent.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => alert(`Edit parent ${parent.id}`)}
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
    </div>
  );
};

export default AdminParents;