import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Download,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { TrainingSession, Team } from '@/types/domain';

const AdminTraining = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    setSessions(dataService.getTrainingSessions());
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || session.teamId === selectedTeam;
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;
    return matchesSearch && matchesTeam && matchesStatus;
  });

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
        description="Manage all training sessions across the academy."
        action={
          <button
            onClick={() => alert('Add training session form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Sessions" value={sessions.length} icon={Calendar} />
        <StatCard label="Scheduled" value={sessions.filter((s) => s.status === 'Scheduled').length} icon={Calendar} />
        <StatCard label="Completed" value={sessions.filter((s) => s.status === 'Completed').length} icon={Users} />
        <StatCard label="Cancelled" value={sessions.filter((s) => s.status === 'Cancelled').length} icon={Trash2} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredSessions.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No training sessions found"
            description="No sessions match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Team</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Type</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Date</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Time</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Location</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => {
                  const team = teams.find((t) => t.id === session.teamId);
                  const statusColors: Record<string, string> = {
                    Scheduled: 'bg-club-red/15 text-club-red',
                    'In Progress': 'bg-club-gold/15 text-club-gold',
                    Completed: 'bg-club-blue/15 text-club-blue',
                    Cancelled: 'bg-club-muted/15 text-club-muted',
                  };
                  return (
                    <tr key={session.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-club-red text-white text-xs font-bold">
                            {team?.name.split(' ').map((n) => n[0]).join('') || 'VK'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{session.teamName}</p>
                            <p className="text-xs text-club-muted">{team?.ageGroup || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{session.type}</td>
                      <td className="p-4 text-sm text-club-silver">{session.date}</td>
                      <td className="p-4 text-sm text-club-silver">{session.startTime}–{session.endTime}</td>
                      <td className="p-4 text-sm text-club-silver">{session.location}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[session.status] || 'bg-club-surface text-club-muted'}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`View session ${session.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Edit session ${session.id}`)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTraining;