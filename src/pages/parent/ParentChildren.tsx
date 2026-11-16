import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircle,
  Calendar,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { dataService } from '@/services/dataService';
import type { Player, TrainingSession, Match, FeeRecord } from '@/types/domain';

const ParentChildren = () => {
  const [children, setChildren] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allPlayers = dataService.getPlayers();
    const myChildren = allPlayers.filter((p) => p.parentIds.includes('parent_1'));
    setChildren(myChildren);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading children...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Children"
        description="View and manage your children's profiles and activities."
      />

      {children.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-club-border bg-club-surface/50 p-12 text-center">
          <UserCircle className="w-16 h-16 text-club-muted mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">No children linked</h3>
          <p className="text-club-muted mb-6">No children are currently linked to your account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {children.map((child) => (
            <div key={child.id} className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-club-red text-2xl font-bold text-white">
                    {child.firstName[0]}{child.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-white">{child.firstName} {child.lastName}</h3>
                    <p className="text-club-muted">#{child.jerseyNumber} · {child.position.join(', ')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-xl bg-club-bg p-4 text-center">
                    <p className="font-display text-2xl font-bold text-white">{child.teamName}</p>
                    <p className="text-xs text-club-muted">Team</p>
                  </div>
                  <div className="rounded-xl bg-club-bg p-4 text-center">
                    <p className="font-display text-2xl font-bold text-white">{child.age}</p>
                    <p className="text-xs text-club-muted">Age</p>
                  </div>
                  <div className="rounded-xl bg-club-bg p-4 text-center">
                    <p className="font-display text-2xl font-bold text-white">{child.attendanceRate}%</p>
                    <p className="text-xs text-club-muted">Attendance</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-club-bg">
                    <Calendar className="h-5 w-5 text-club-muted" />
                    <div>
                      <p className="text-xs text-club-muted">Date of Birth</p>
                      <p className="font-medium text-white">{child.dateOfBirth}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-club-bg">
                    <Trophy className="h-5 w-5 text-club-muted" />
                    <div>
                      <p className="text-xs text-club-muted">Medical Notes</p>
                      <p className="font-medium text-white">{child.medicalNotes || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-club-border p-4 bg-club-bg/50">
                <h4 className="font-medium text-white mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/parent/training?child=${child.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-club-surface p-3 text-sm font-medium text-club-silver hover:text-white hover:bg-club-red/10 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Training
                  </Link>
                  <Link
                    to={`/parent/matches?child=${child.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-club-surface p-3 text-sm font-medium text-club-silver hover:text-white hover:bg-club-red/10 transition-colors"
                  >
                    <Trophy className="h-4 w-4" />
                    Matches
                  </Link>
                  <Link
                    to={`/parent/payments?child=${child.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-club-surface p-3 text-sm font-medium text-club-silver hover:text-white hover:bg-club-red/10 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Payments
                  </Link>
                  <Link
                    to={`/parent/attendance?child=${child.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-club-surface p-3 text-sm font-medium text-club-silver hover:text-white hover:bg-club-red/10 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    Attendance
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentChildren;