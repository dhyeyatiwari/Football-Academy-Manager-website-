import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Search,
  Edit3,
  Trash2,
  FileText,
  Download,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import type { SessionPlan, Team } from '@/types/domain';

const CoachSessionPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SessionPlan[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const myTeams = dataService.getTeamsByCoach(user.id);
      setTeams(myTeams);
      const teamIds = myTeams.map((t) => t.id);
      const allPlans = dataService.getSessionPlans().filter((p) => teamIds.includes(p.teamId));
      setPlans(allPlans);
      setLoading(false);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this session plan?')) {
      // In a real app, this would call dataService.deleteSessionPlan
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading session plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Session Plans"
        description="Create and manage training session plans for your teams."
        action={
          <button
            onClick={() => alert('Create session plan form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Plan
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Plans" value={plans.length} icon={ClipboardList} />
        <StatCard label="Structured" value={plans.filter((p) => p.fileType === 'structured').length} icon={FileText} />
        <StatCard label="AI Generated" value={plans.filter((p) => p.aiSummary).length} icon={Eye} />
        <StatCard label="Teams" value={[...new Set(plans.map((p) => p.teamId))].length} icon={Users} />
      </div>

      {/* Session Plans List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {plans.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No session plans"
            description="You have no session plans yet. Create your first plan to organize your training sessions."
          />
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const team = teams.find((t) => t.id === plan.teamId);
              return (
                <div
                  key={plan.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">{plan.title}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium bg-club-red/15 text-club-red`}>
                          {plan.category}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {plan.createdAt.slice(0, 10)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {team?.name || 'Unknown Team'}
                        </span>
                        {plan.totalDuration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> {plan.totalDuration} min
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p className="mt-2 text-xs text-club-muted line-clamp-2">{plan.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => alert(`View plan ${plan.id}`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View plan"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Edit plan ${plan.id}`)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit plan"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {plan.fileUrl && (
                        <button
                          onClick={() => alert(`Download ${plan.fileName || 'file'}`)}
                          className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete plan"
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

export default CoachSessionPlans;