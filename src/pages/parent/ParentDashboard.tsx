import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CreditCard,
  Trophy,
  Bell,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { dataService } from '@/services/dataService';
import type { Player, Match, TrainingSession, FeeRecord, Announcement } from '@/types/domain';

const ParentDashboard = () => {
  const [children, setChildren] = useState<Player[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [upcomingTraining, setUpcomingTraining] = useState<TrainingSession[]>([]);
  const [pendingFees, setPendingFees] = useState<FeeRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would filter by parent ID
    const allPlayers = dataService.getPlayers();
    const myChildren = allPlayers.filter((p) => p.parentIds.includes('parent_1'));
    setChildren(myChildren);

    const allMatches = dataService.getMatches();
    const childTeamIds = myChildren.map((c) => c.teamId).filter(Boolean);
    const myMatches = allMatches
      .filter((m) => childTeamIds.includes(m.homeTeamId) || childTeamIds.includes(m.awayTeamId))
      .filter((m) => m.status === 'Scheduled')
      .slice(0, 3);
    setUpcomingMatches(myMatches);

    const allTraining = dataService.getTrainingSessions();
    const myTraining = allTraining
      .filter((t) => childTeamIds.includes(t.teamId))
      .filter((t) => new Date(t.date) >= new Date())
      .slice(0, 3);
    setUpcomingTraining(myTraining);

    const allFees = dataService.getFeeRecords();
    const myFees = allFees
      .filter((f) => myChildren.some((c) => c.id === f.playerId))
      .filter((f) => f.status === 'Pending' || f.status === 'Overdue');
    setPendingFees(myFees);

    const allAnnouncements = dataService.getAnnouncements();
    const myAnnouncements = allAnnouncements
      .filter((a) => a.targetRoles.includes('parent'))
      .slice(0, 3);
    setAnnouncements(myAnnouncements);

    setLoading(false);
  }, []);

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

  const totalPendingAmount = pendingFees.reduce((acc, f) => acc + f.amount, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your children's activities."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Children" value={children.length} icon={Users} />
        <StatCard label="Upcoming Matches" value={upcomingMatches.length} icon={Calendar} />
        <StatCard label="Training Sessions" value={upcomingTraining.length} icon={Trophy} />
        <StatCard label="Pending Payments" value={`€${totalPendingAmount}`} icon={CreditCard} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Upcoming Matches */}
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">Upcoming Matches</h3>
            <Link to="/parent/matches" className="text-sm text-club-red hover:text-club-red-hover flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {upcomingMatches.length === 0 ? (
            <p className="text-club-muted text-center py-4">No upcoming matches</p>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/parent/matches/${match.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-club-bg/50 hover:bg-club-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-red/15">
                      <Trophy className="h-5 w-5 text-club-red" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{match.homeTeamName} vs {match.awayTeamName}</p>
                      <p className="text-xs text-club-muted">{match.competition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{match.date}</p>
                    <p className="text-xs text-club-muted">{match.kickoffTime} · {match.venue}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Training */}
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">Upcoming Training</h3>
            <Link to="/parent/training" className="text-sm text-club-red hover:text-club-red-hover flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {upcomingTraining.length === 0 ? (
            <p className="text-club-muted text-center py-4">No upcoming training sessions</p>
          ) : (
            <div className="space-y-3">
              {upcomingTraining.map((session) => (
                <Link
                  key={session.id}
                  to={`/parent/training/${session.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-club-bg/50 hover:bg-club-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-blue/15">
                      <Calendar className="h-5 w-5 text-club-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{session.teamName}</p>
                      <p className="text-xs text-club-muted">{session.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{session.date}</p>
                    <p className="text-xs text-club-muted">{session.startTime}–{session.endTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pending Payments */}
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">Pending Payments</h3>
            <Link to="/parent/payments" className="text-sm text-club-red hover:text-club-red-hover flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {pendingFees.length === 0 ? (
            <p className="text-club-muted text-center py-4">No pending payments</p>
          ) : (
            <div className="space-y-3">
              {pendingFees.map((fee) => (
                <Link
                  key={fee.id}
                  to={`/parent/payments/${fee.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-club-bg/50 hover:bg-club-bg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-gold/15">
                      <CreditCard className="h-5 w-5 text-club-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{fee.description}</p>
                      <p className="text-xs text-club-muted">{fee.playerName} · Due {fee.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-club-red">€{fee.amount}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      fee.status === 'Overdue' ? 'bg-destructive/15 text-destructive' : 'bg-club-red/15 text-club-red'
                    }`}>
                      {fee.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Children Quick View */}
        <div className="lg:col-span-2 rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">Your Children</h3>
            <Link to="/parent/children" className="text-sm text-club-red hover:text-club-red-hover flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {children.length === 0 ? (
            <p className="text-club-muted text-center py-4">No children linked to your account</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {children.map((child) => (
                <div key={child.id} className="rounded-xl border border-club-border bg-club-bg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-club-red text-xl font-bold text-white">
                      {child.firstName[0]}{child.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-lg font-bold text-white">{child.firstName} {child.lastName}</p>
                      <p className="text-sm text-club-muted">#{child.jerseyNumber} · {child.position.join(', ')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-club-surface/50 p-2">
                      <p className="font-display text-lg font-bold text-white">{child.teamName}</p>
                      <p className="text-xs text-club-muted">Team</p>
                    </div>
                    <div className="rounded-lg bg-club-surface/50 p-2">
                      <p className="font-display text-lg font-bold text-white">{child.age}</p>
                      <p className="text-xs text-club-muted">Age</p>
                    </div>
                    <div className="rounded-lg bg-club-surface/50 p-2">
                      <p className="font-display text-lg font-bold text-white">{child.attendanceRate}%</p>
                      <p className="text-xs text-club-muted">Attendance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-white">Announcements</h3>
            <Link to="/parent/announcements" className="text-sm text-club-red hover:text-club-red-hover flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="text-club-muted text-center py-4">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-club-bg/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{ann.title}</p>
                      <p className="text-xs text-club-muted line-clamp-2">{ann.content}</p>
                    </div>
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-club-red/15 text-club-red">
                      {ann.priority}
                    </span>
                  </div>
                  <p className="text-xs text-club-muted mt-2">By {ann.authorName} · {new Date(ann.publishedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;