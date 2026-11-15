import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { mockDataService } from '@/services/mockData';
import type { ParentDashboardData } from '@/types/domain';

const ParentDashboard = () => {
  const [data, setData] = useState<ParentDashboardData | null>(null);

  useEffect(() => {
    mockDataService.getParentDashboard().then(setData);
  }, []);

  return (
    <div>
      <PageHeader
        title="Parent Dashboard"
        description="Track your children's progress, schedules, and payments in one place."
        action={
          <Link
            to="/parent/payments"
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            Make Payment
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Children" value={data?.myChildren.length ?? '—'} icon={Calendar} accent />
        <StatCard label="Upcoming Matches" value={data?.upcomingMatches.length ?? '—'} icon={Calendar} />
        <StatCard label="Pending Payments" value={data?.pendingPayments.length ?? '—'} icon={CreditCard} />
        <StatCard label="Notifications" value={data?.notifications.length ?? '—'} icon={Bell} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Children */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <h2 className="mb-5 font-display text-lg font-bold text-white">My Children</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data?.myChildren.map((child) => (
                <div key={child.id} className="rounded-xl border border-club-border bg-club-bg p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-club-red text-sm font-bold text-white">
                      {child.firstName[0]}
                      {child.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-club-muted">{child.teamName}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-club-muted">
                    <span>#{child.jerseyNumber} · {child.position.join(', ')}</span>
                    <span className="rounded-full bg-club-red/15 px-2 py-0.5 text-club-red">
                      {child.ageGroup}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Training */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Upcoming Training</h2>
              <Link to="/parent/training" className="text-xs font-medium text-club-red hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {data?.upcomingTraining.map((session) => (
                <div key={session.id} className="rounded-xl border border-club-border bg-club-bg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{session.teamName}</p>
                    <span className="rounded-full bg-club-red/15 px-3 py-1 text-xs font-medium text-club-red">
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
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Subscription */}
          {data?.subscription && (
            <div className="rounded-2xl border border-club-red/40 bg-club-surface p-6">
              <p className="text-xs uppercase tracking-wider text-club-muted">Current Plan</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">{data.subscription.tier}</p>
              <p className="mt-1 text-sm text-club-muted">
                €{data.subscription.monthlyFee}/month · {data.subscription.status}
              </p>
              <div className="mt-4 space-y-2">
                {data.subscription.benefits.map((benefit) => (
                  <div key={benefit.id} className="flex items-center gap-2 text-xs">
                    {benefit.included ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-club-red" />
                    ) : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-club-muted" />
                    )}
                    <span className={benefit.included ? 'text-club-silver' : 'text-club-muted line-through'}>
                      {benefit.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="rounded-2xl border border-club-border bg-club-surface p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">Notifications</h2>
            <div className="space-y-3">
              {data?.notifications.map((notif) => (
                <div key={notif.id} className="rounded-xl border border-club-border bg-club-bg p-3">
                  <p className="text-sm font-semibold text-white">{notif.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-club-muted">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;