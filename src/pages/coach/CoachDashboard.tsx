import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  ClipboardList,
  ArrowRight,
  MapPin,
  Clock,
  TrendingUp,
  Trophy,
  UserCheck,
  FileText,
  Plus,
  ChevronRight,
  Activity,
  Target,
  Award,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import type { CoachDashboardData, Team, TrainingSession, Match, PlayerDevelopmentSummary } from '@/types/domain';

const CoachDashboard = () => {
  const [data, setData] = useState<CoachDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      dataService.getCoachDashboard(user.id).then((result) => {
        setData(result);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Coach Dashboard"
        description="Your teams, sessions, and player development at a glance."
        action={
          <Link
            to="/coach/training"
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Plan Session
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Teams" value={data?.myTeams.length ?? 0} icon={Users} accent />
        <StatCard label="Upcoming Sessions" value={data?.upcomingSessions.length ?? 0} icon={Calendar} />
        <StatCard label="Recent Matches" value={data?.recentMatches.length ?? 0} icon={ClipboardList} />
        <StatCard label="Players Tracked" value={data?.playerDevelopment.length ?? 0} icon={TrendingUp} />
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Teams & Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Teams */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-club-red" />
                <h2 className="font-display text-lg font-bold text-white">My Teams</h2>
              </div>
              <Link to="/coach/teams" className="text-xs font-medium text-club-red hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data?.myTeams.map((team) => (
                <div key={team.id} className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{team.name}</p>
                      <p className="text-xs text-club-muted mt-1">{team.ageGroup} · {team.category}</p>
                    </div>
                    <span className="rounded-full bg-club-red/15 px-2 py-1 text-xs font-medium text-club-red">
                      {team.currentPlayers}/{team.maxPlayers}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-club-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{team.trainingDays.join(', ')}</span>
                  </div>
                </div>
              ))}
              {(!data?.myTeams || data.myTeams.length === 0) && (
                <div className="col-span-full">
                  <EmptyState icon={Users} title="No teams assigned" description="You haven't been assigned to any teams yet." />
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-club-red" />
                <h2 className="font-display text-lg font-bold text-white">Upcoming Sessions</h2>
              </div>
              <Link to="/coach/training" className="text-xs font-medium text-club-red hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.upcomingSessions.map((session) => (
                <div key={session.id} className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{session.teamName}</p>
                      <p className="text-xs text-club-muted mt-1">{session.type} Session</p>
                    </div>
                    <span className="rounded-full bg-club-red/15 px-3 py-1 text-xs font-medium text-club-red">
                      {session.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {session.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {session.startTime}–{session.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {session.location}
                    </span>
                  </div>
                </div>
              ))}
              {(!data?.upcomingSessions || data.upcomingSessions.length === 0) && (
                <EmptyState icon={Calendar} title="No upcoming sessions" description="You have no training sessions scheduled." />
              )}
            </div>
          </div>

          {/* Recent Matches */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-club-red" />
                <h2 className="font-display text-lg font-bold text-white">Recent Matches</h2>
              </div>
              <Link to="/coach/matches" className="text-xs font-medium text-club-red hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.recentMatches.map((match) => (
                <div key={match.id} className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{match.homeTeamName}</p>
                        <span className="mx-3 text-lg font-bold text-club-red">
                          {match.homeScore} - {match.awayScore}
                        </span>
                        <p className="text-sm font-semibold text-white">{match.awayTeamName}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-club-muted">
                        <span>{match.date}</span>
                        <span>·</span>
                        <span>{match.competition}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.recentMatches || data.recentMatches.length === 0) && (
                <EmptyState icon={Trophy} title="No recent matches" description="No match results available." />
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Player Development & Quick Actions */}
        <div className="space-y-6">
          {/* Player Development */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-club-red" />
                <h2 className="font-display text-lg font-bold text-white">Player Development</h2>
              </div>
              <Link to="/coach/reports" className="text-xs font-medium text-club-red hover:underline flex items-center gap-1">
                Reports <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {data?.playerDevelopment.map((player) => (
                <div key={player.playerId} className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{player.playerName}</p>
                      <p className="text-xs text-club-muted">{player.teamName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-club-red">
                        {player.recentRatings.overall.toFixed(1)}
                      </p>
                      <p className="text-[11px] uppercase tracking-wider text-club-muted">Overall</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-club-muted">
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" /> {player.attendanceRate}%
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" /> {player.sessionsThisMonth} sessions
                    </span>
                  </div>
                </div>
              ))}
              {(!data?.playerDevelopment || data.playerDevelopment.length === 0) && (
                <EmptyState icon={TrendingUp} title="No player data" description="Player development data will appear here." />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/coach/training"
                className="flex items-center justify-between rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-red/15 text-club-red">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Schedule Training</p>
                    <p className="text-xs text-club-muted">Plan a new session</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-club-muted group-hover:text-club-red transition-colors" />
              </Link>

              <Link
                to="/coach/attendance"
                className="flex items-center justify-between rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-red/15 text-club-red">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Mark Attendance</p>
                    <p className="text-xs text-club-muted">Record player attendance</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-club-muted group-hover:text-club-red transition-colors" />
              </Link>

              <Link
                to="/coach/reports"
                className="flex items-center justify-between rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-red/15 text-club-red">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Player Reports</p>
                    <p className="text-xs text-club-muted">Write development reports</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-club-muted group-hover:text-club-red transition-colors" />
              </Link>

              <Link
                to="/coach/session-plans"
                className="flex items-center justify-between rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-red/15 text-club-red">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Session Plans</p>
                    <p className="text-xs text-club-muted">Create training plans</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-club-muted group-hover:text-club-red transition-colors" />
              </Link>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="rounded-2xl border border-club-red/40 bg-club-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-club-red" />
              <h2 className="font-display text-lg font-bold text-white">Performance Summary</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-club-muted">Teams Managed</span>
                <span className="font-display text-xl font-bold text-white">{data?.myTeams.length ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-club-muted">Total Players</span>
                <span className="font-display text-xl font-bold text-white">
                  {data?.myTeams.reduce((acc, team) => acc + team.currentPlayers, 0) ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-club-muted">Sessions This Month</span>
                <span className="font-display text-xl font-bold text-white">
                  {data?.upcomingSessions.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;