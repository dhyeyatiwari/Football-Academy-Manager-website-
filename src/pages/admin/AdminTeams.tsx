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
  MapPin,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Team } from '@/types/domain';

const AdminTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      // In a real app, this would call dataService.deleteTeam
      setTeams((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Teams"
        description="Manage all academy teams and their configurations."
        action={
          <button
            onClick={() => alert('Add team form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Teams" value={teams.length} icon={Users} />
        <StatCard label="Active Teams" value={teams.filter((t) => t.isActive).length} icon={UserPlus} />
        <StatCard label="Total Players" value={teams.reduce((acc, t) => acc + t.currentPlayers, 0)} icon={Users} />
        <StatCard label="Categories" value={[...new Set(teams.map((t) => t.category))].length} icon={Filter} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Academy">Academy</option>
              <option value="Development">Development</option>
              <option value="Elite">Elite</option>
              <option value="Pro Pathway">Pro Pathway</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No teams found"
              description="No teams match your current filters."
            />
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{team.name}</h3>
                  <p className="text-xs text-club-muted mt-1">{team.ageGroup} · {team.category}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  team.isActive ? 'bg-club-red/15 text-club-red' : 'bg-club-muted/15 text-club-muted'
                }`}>
                  {team.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Coach</span>
                  <span className="text-white font-medium">{team.coachName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Players</span>
                  <span className="text-white font-medium">{team.currentPlayers}/{team.maxPlayers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Training Days</span>
                  <span className="text-white font-medium">{team.trainingDays.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Season</span>
                  <span className="text-white font-medium">{team.season}</span>
                </div>
              </div>

              {/* Player capacity bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-club-muted mb-1">
                  <span>Capacity</span>
                  <span>{team.currentPlayers}/{team.maxPlayers}</span>
                </div>
                <div className="w-full bg-club-bg rounded-full h-2">
                  <div
                    className="bg-club-red h-2 rounded-full transition-all"
                    style={{ width: `${(team.currentPlayers / team.maxPlayers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`View team ${team.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => alert(`Edit team ${team.id}`)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete team"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTeams;