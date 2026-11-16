import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Match, Team } from '@/types/domain';

const AdminMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    setMatches(dataService.getMatches());
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.homeTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || match.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      // In a real app, this would call dataService.deleteMatch
      setMatches((prev) => prev.filter((m) => m.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Matches"
        description="Manage all matches and fixtures across the academy."
        action={
          <button
            onClick={() => alert('Add match form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Match
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Matches" value={matches.length} icon={Trophy} />
        <StatCard label="Upcoming" value={matches.filter((m) => m.status === 'Scheduled').length} icon={Calendar} />
        <StatCard label="Completed" value={matches.filter((m) => m.status === 'Full Time').length} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={matches.filter((m) => m.status === 'Cancelled').length} icon={AlertCircle} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search matches..."
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
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live</option>
              <option value="Half Time">Half Time</option>
              <option value="Full Time">Full Time</option>
              <option value="Postponed">Postponed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredMatches.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No matches found"
            description="No matches match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Match</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Date & Time</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Venue</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Competition</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Score</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((match) => {
                  const statusColors: Record<string, string> = {
                    Scheduled: 'bg-club-red/15 text-club-red',
                    Live: 'bg-club-gold/15 text-club-gold',
                    'Half Time': 'bg-club-gold/15 text-club-gold',
                    'Full Time': 'bg-club-blue/15 text-club-blue',
                    Postponed: 'bg-club-muted/15 text-club-muted',
                    Cancelled: 'bg-club-muted/15 text-club-muted',
                  };
                  return (
                    <tr key={match.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-white">{match.homeTeamName}</p>
                            <p className="text-xs text-club-muted">vs</p>
                            <p className="text-sm font-semibold text-white">{match.awayTeamName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">
                        {match.date} at {match.kickoffTime}
                      </td>
                      <td className="p-4 text-sm text-club-silver">{match.venue}</td>
                      <td className="p-4 text-sm text-club-silver">{match.competition}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[match.status] || 'bg-club-surface text-club-muted'}`}>
                          {match.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-club-silver">
                        {match.status === 'Full Time' && match.homeScore !== undefined && match.awayScore !== undefined
                          ? `${match.homeScore} - ${match.awayScore}`
                          : '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View match ${match.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit match ${match.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(match.id)}
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

export default AdminMatches;