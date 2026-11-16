import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CreditCard,
  Activity,
  ArrowRight,
  Trophy,
  UserCheck,
  Megaphone,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { dataService } from '@/services/dataService';
import type { DashboardMetrics, Announcement, Match } from '@/types/domain';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    setMetrics(dataService.getDashboardMetrics());
    setAnnouncements(dataService.getAnnouncements());
    setMatches(dataService.getUpcomingMatches());
  }, []);

  return (
    <div>
      <PageHeader
        title="Academy Overview"
        description="Monitor academy performance, enrollment, and operations at a glance."
        action={
          <Link
            to="/admin/players"
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            Manage Players
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Players"
          value={metrics?.totalPlayers ?? '—'}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          accent
        />
        <StatCard
          label="Active Teams"
          value={metrics?.activeTeams ?? '—'}
          icon={Trophy}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          label="Upcoming Matches"
          value={metrics?.upcomingMatches ?? '—'}
          icon={Calendar}
        />
        <StatCard
          label="Pending Payments"
          value={metrics?.pendingPayments ?? '—'}
          icon={CreditCard}
          trend={{ value: 4, isPositive: false }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Upcoming Fixtures</h2>
            <Link to="/admin/matches" className="text-xs font-medium text-club-red hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-xl border border-club-border bg-club-bg p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {match.homeTeamName} <span className="text-club-muted">vs</span> {match.awayTeamName}
                  </p>
                  <p className="mt-1 text-xs text-club-muted">
                    {match.date} · {match.kickoffTime} · {match.venue}
                  </p>
                </div>
                <span className="ml-4 flex-shrink-0 rounded-full bg-club-red/15 px-3 py-1 text-xs font-medium text-club-red">
                  {match.competition}
                </span>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="py-8 text-center text-sm text-club-muted">No upcoming fixtures.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="mb-5 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-club-red" />
            <h2 className="font-display text-lg font-bold text-white">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="border-b border-club-border pb-4 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-white">{ann.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-club-muted">{ann.content}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-club-red">
                  {ann.priority} priority
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-club-red/15 text-club-red">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-club-muted">Attendance Rate</p>
            <p className="font-display text-2xl font-bold text-white">{metrics?.attendanceRate ?? '—'}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-club-red/15 text-club-red">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-club-muted">Development Sessions</p>
            <p className="font-display text-2xl font-bold text-white">{metrics?.developmentSessions ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;