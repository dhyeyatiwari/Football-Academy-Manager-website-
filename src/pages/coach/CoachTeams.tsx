import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Users,
  UserPlus,
  ArrowRight,
  ChevronDown,
  X,
  TrendingUp,
  Calendar,
  MapPin,
  Shield,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import type { Team } from '@/types/domain';

const CoachTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setTeams(dataService.getTeamsByCoach(user.id));
      setLoading(false);
    }
  }, [user]);

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
        title="My Teams"
        description="Manage and view your assigned teams."
        action={
          <Link
            to="/coach/training"
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Link>
        }
      />

      {/* Teams Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Teams" value={teams.length} icon={Users} />
      </div>

      {/* Teams List */}
      <div className="space-y-4">
        {teams.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No teams assigned"
            description="You haven't been assigned to any teams yet. Contact the admin to be added."
          />
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-white">{team.name}</h3>
                  <p className="text-sm text-club-muted mt-1">
                    {team.ageGroup} · {team.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-club-muted">
                  <span>{team.currentPlayers}/{team.maxPlayers} players</span>
                  <span className="rounded-full bg-club-red/15 px-2 py-1 text-xs font-medium text-club-red">
                    {team.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-club-muted">
                Training days: {team.trainingDays.map((day) => day).join(', ')}
              </p>
              <div className="mt-4 pt-4 border-t border-club-border">
                <Link
                  to={`/coach/teams/${team.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-club-red px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-club-red-hover"
                >
                  <Users className="h-4 w-4" />
                  Manage Squad
                </Link>
                <Link
                  to={`/coach/training?teamId=${team.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-club-surface/50 px-4 py-2.5 text-sm text-club-silver transition-colors hover:bg-club-surface"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Training
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CoachTeams;