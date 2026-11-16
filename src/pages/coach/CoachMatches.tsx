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
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import type { Match, Team } from '@/types/domain';

const CoachMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const myTeams = dataService.getTeamsByCoach(user.id);
      setTeams(myTeams);
      const teamIds = myTeams.map((t) => t.id);
      const allMatches = dataService.getMatches().filter((m) => teamIds.includes(m.homeTeamId) || teamIds.includes(m.awayTeamId));
      setMatches(allMatches);
      setLoading(false);
    }
  }, [user]);

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
        description="Manage matches and fixtures for your teams."
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

      {/* Matches List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {matches.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No matches"
            description="You have no matches scheduled. Add your first match to get started."
          />
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const statusColors: Record<string, string> = {
                Scheduled: 'bg-club-red/15 text-club-red',
                Live: 'bg-club-gold/15 text-club-gold',
                'Half Time': 'bg-club-gold/15 text-club-gold',
                'Full Time': 'bg-club-blue/15 text-club-blue',
                Postponed: 'bg-club-muted/15 text-club-muted',
                Cancelled: 'bg-club-muted/15 text-club-muted',
              };
              return (
                <div
                  key={match.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-white">{match.homeTeamName}</h3>
                          <span className="text-lg font-bold text-club-muted">-</span>
                          <h3 className="text-sm font-semibold text-white">{match.awayTeamName}</h3>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[match.status] || 'bg-club-surface text-club-muted'}`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {match.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {match.kickoffTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {match.venue}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" /> {match.competition}
                        </span>
                      </div>
                      {match.status === 'Full Time' && match.homeScore !== undefined && match.awayScore !== undefined && (
                        <div className="mt-2 text-xs text-club-muted">
                          Final: {match.homeScore} - {match.awayScore}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => alert(`View match ${match.id}`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View details"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Edit match ${match.id}`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit match"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete match"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachMatches;