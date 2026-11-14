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
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { mockDataService } from '@/services/mockData';
import type { CoachDashboardData } from '@/types/domain';

const CoachDashboard = () => {
  const [data, setData] = useState<CoachDashboardData | null>(null);

  useEffect(() => {
    mockDataService.getCoachDashboard().then(setData);
  }, []);

  return (
    <div>
      <PageHeader
        title="Coach Dashboard"
        description="Your teams, sessions, and player development at a glance."
        action={
          <Link
            to="/coach/training"
            className="inline-flex items-center gap-2 rounded-xl bg-club-pitch px-5 py-2.5 text-sm font-semibold text-club-darkest transition-colors hover:bg-club-pitch-hover"
          >
            Plan Session
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Teams" value={data?.myTeams.length ?? '—'} icon={Users} accent />
        <StatCard label="Upcoming Sessions" value={data?.upcomingSessions.length ?? '—'} icon={Calendar} />
        <StatCard label="Recent Matches" value={data?.recentMatches.length ?? '—'} icon={ClipboardList} />
        <StatCard label="Players Tracked" value={data?.playerDevelopment.length ?? '—'} icon={TrendingUp} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Upcoming Sessions</h2>
            <Link to="/coach/training" className="text-xs font-medium text-club-pitch hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data?.upcomingSessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-club-border bg-[#07090C] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{session.teamName}</p>
                  <span className="rounded-full bg-club-pitch/15 px-3 py-1 text-xs font-medium text-club-pitch">
                    {session.type}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
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
          </div>
        </div>

        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Player Development</h2>
            <Link to="/coach/reports" className="text-xs font-medium text-club-pitch hover:underline">
              Reports
            </Link>
          </div>
          <div className="space-y-3">
            {data?.playerDevelopment.map((player) => (
              <div key={player.playerId} className="rounded-xl border border-club-border bg-[#07090C] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{player.playerName}</p>
                    <p className="text-xs text-club-muted">{player.teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold text-club-pitch">
                      {player.recentRatings.overall.toFixed(1)}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-club-muted">Overall</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-club-muted">
                  <span>Attendance {player.attendanceRate}%</span>
                  <span>{player.sessionsThisMonth} sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;