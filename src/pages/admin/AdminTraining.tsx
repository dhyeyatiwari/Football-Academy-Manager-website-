import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TrainingSession, Team } from '@/types/domain';

const AdminTraining = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [formData, setFormData] = useState({
    teamId: '',
    teamName: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '90',
    pitchLocation: '',
    category: 'Technical',
    objectives: '',
  });

  useEffect(() => {
    setTeams(dataService.getTeams());
    setSessions(dataService.getTrainingSessions());
    setLoading(false);
  }, []);

  const handleOpenDialog = (session?: TrainingSession) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        teamId: session.teamId,
        teamName: session.teamName,
        title: session.title,
        description: session.description || '',
        date: session.date,
        time: session.time,
        duration: session.duration?.toString() || '90',
        pitchLocation: session.pitchLocation || '',
        category: session.category || 'Technical',
        objectives: session.objectives?.join('\n') || '',
      });
    } else {
      setEditingSession(null);
      setFormData({
        teamId: '',
        teamName: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        duration: '90',
        pitchLocation: '',
        category: 'Technical',
        objectives: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSession(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.teamId || !formData.title.trim() || !formData.date || !formData.time) {
      showError('Please fill in all required fields');
      return;
    }

    const team = teams.find((t) => t.id === formData.teamId);
    if (!team) {
      showError('Invalid team selected');
      return;
    }

    const session: TrainingSession = {
      id: editingSession?.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId: formData.teamId,
      teamName: formData.teamName || team.name,
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      pitchLocation: formData.pitchLocation || undefined,
      category: formData.category,
      objectives: formData.objectives ? formData.objectives.split('\n').filter(Boolean) : undefined,
      status: 'Scheduled',
      createdAt: editingSession?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveTrainingSession(session);

    if (editingSession) {
      setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
      showSuccess('Training session updated successfully');
    } else {
      setSessions((prev) => [session, ...prev]);
      showSuccess('Training session created successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this training session?')) {
      dataService.deleteTrainingSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      showSuccess('Training session deleted successfully');
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
        description="Manage academy-wide training schedules."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Sessions" value={sessions.length} icon={Clock} />
        <StatCard label="Upcoming" value={sessions.filter((s) => s.status === 'Scheduled').length} icon={Calendar} />
        <StatCard label="Completed" value={sessions.filter((s) => s.status === 'Completed').length} icon={Eye} />
        <StatCard label="Teams" value={[...new Set(sessions.map((s) => s.teamId))].length} icon={Users} />
      </div>

      {/* Sessions List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {sessions.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No training sessions"
            description="No training sessions have been scheduled yet."
          />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const team = teams.find((t) => t.id === session.teamId);
              return (
                <div
                  key={session.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-white">{session.title}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium bg-club-red/15 text-club-red`}>
                          {session.category}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {session.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {session.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {session.pitchLocation || 'TBD'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {team?.name || 'Unknown Team'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleOpenDialog(session)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View session"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDialog(session)}
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

      {/* Create/Edit Session Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSession ? 'Edit Training Session' : 'Add Training Session'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamId">Team *</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => {
                    const team = teams.find((t) => t.id === value);
                    setFormData({ ...formData, teamId: value, teamName: team?.name || '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a team</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.ageGroup})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Technical Development"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pitchLocation">Pitch Location</Label>
                <Input
                  id="pitchLocation"
                  value={formData.pitchLocation}
                  onChange={(e) => setFormData({ ...formData, pitchLocation: e.target.value })}
                  placeholder="e.g., Main Pitch A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as string })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Tactical">Tactical</SelectItem>
                  <SelectItem value="Physical">Physical</SelectItem>
                  <SelectItem value="Goalkeeping">Goalkeeping</SelectItem>
                  <SelectItem value="Match Prep">Match Prep</SelectItem>
                  <SelectItem value="Recovery">Recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Session description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Enter each objective on a new line"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingSession ? 'Update Session' : 'Add Session'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTraining;