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
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Player, Team } from '@/types/domain';

const AdminPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    setPlayers(dataService.getPlayers());
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.jerseyNumber && player.jerseyNumber.toString().includes(searchTerm));
    const matchesTeam = selectedTeam === 'all' || player.teamId === selectedTeam;
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' ? player.isActive : !player.isActive);
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      // In a real app, this would call dataService.deletePlayer
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Players"
        description="Manage all academy players and their profiles."
        action={
          <button
            onClick={() => alert('Add player form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Player
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Players" value={players.length} icon={Users} />
        <StatCard label="Active" value={players.filter((p) => p.isActive).length} icon={UserPlus} />
        <StatCard label="Inactive" value={players.filter((p) => !p.isActive).length} icon={Users} />
        <StatCard label="Teams" value={teams.length} icon={Users} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredPlayers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No players found"
            description="No players match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Team</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Age Group</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Position</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Jersey</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => {
                  const team = teams.find((t) => t.id === player.teamId);
                  return (
                    <tr key={player.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-club-red text-white font-bold">
                            {player.firstName[0]}{player.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{player.firstName} {player.lastName}</p>
                            <p className="text-xs text-club-muted">{player.dateOfBirth}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{team?.name || 'Unassigned'}</td>
                      <td className="p-4 text-sm text-club-silver">{player.ageGroup}</td>
                      <td className="p-4 text-sm text-club-silver">{player.position.join(', ')}</td>
                      <td className="p-4 text-sm text-club-silver">{player.jerseyNumber || '—'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          player.isActive
                            ? 'bg-club-red/15 text-club-red'
                            : 'bg-club-muted/15 text-club-muted'
                        }`}>
                          {player.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View player ${player.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit player ${player.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
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

export default AdminPlayers;