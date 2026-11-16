import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  ChevronRight,
  Filter,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import type { TrainingSession, Team } from '@/types/domain';

const CoachTraining = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const myTeams = dataService.getTeamsByCoach(user.id);
      setTeams(myTeams);
      const teamIds = myTeams.map((t) => t.id);
      const allSessions = dataService.getTrainingSessions().filter((s) => teamIds.includes(s.teamId));
      setSessions(allSessions);
      setLoading(false);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this training session?')) {
      // In a real app, this would call dataService.deleteTrainingSession
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading training sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Training Sessions"
        description="Schedule and manage training sessions for your teams."
        action={
          <button
            onClick={() => navigate('/coach/training/new')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Session
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Sessions" value={sessions.length} icon={Calendar} />
        <StatCard label="Scheduled" value={sessions.filter((s) => s.status === 'Scheduled').length} icon={Calendar} />
        <StatCard label="Completed" value={sessions.filter((s) => s.status === 'Completed').length} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={sessions.filter((s) => s.status === 'Cancelled').length} icon={AlertCircle} />
      </div>

      {/* Sessions List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {sessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No training sessions"
            description="You have no training sessions scheduled. Create your first session to get started."
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const team = teams.find((t) => t.id === session.teamId);
              const statusColors: Record<string, string> = {
                Scheduled: 'bg-club-red/15 text-club-red',
                'In Progress': 'bg-club-gold/15 text-club-gold',
                Completed: 'bg-club-blue/15 text-club-blue',
                Cancelled: 'bg-club-muted/15 text-club-muted',
              };
              return (
                <div
                  key={session.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">{session.teamName}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[session.status] || 'bg-club-surface text-club-muted'}`}>
                          {session.status}
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
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {session.type}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-xs text-club-muted line-clamp-2">{session.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/coach/training/${session.id}`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View details"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/coach/training/${session.id}/edit`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit session"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete session"
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

export default CoachTraining;