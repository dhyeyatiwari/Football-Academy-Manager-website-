import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Download,
  Calendar,
  MapPin,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Team, AgeGroup } from '@/types/domain';

const AdminTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: 'U12' as AgeGroup,
    category: 'Academy',
    coachId: '',
    maxPlayers: '25',
    trainingDays: ['Monday', 'Wednesday'],
    trainingTime: '',
    pitchLocation: '',
    season: '2024/25',
    isActive: true,
  });

  useEffect(() => {
    setTeams(dataService.getTeams());
    setCoaches(dataService.getCoaches());
    setLoading(false);
  }, []);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coachName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        ageGroup: team.ageGroup,
        category: team.category,
        coachId: team.coachIds[0] || '',
        maxPlayers: team.maxPlayers.toString(),
        trainingDays: team.trainingDays,
        trainingTime: team.trainingTime || '',
        pitchLocation: team.pitchLocation || '',
        season: team.season,
        isActive: team.isActive,
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        ageGroup: 'U12',
        category: 'Academy',
        coachId: '',
        maxPlayers: '25',
        trainingDays: ['Monday', 'Wednesday'],
        trainingTime: '',
        pitchLocation: '',
        season: '2024/25',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTeam(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Please enter a team name');
      return;
    }

    const coach = coaches.find((c) => c.id === formData.coachId);

    const team: Team = {
      id: editingTeam?.id || `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      ageGroup: formData.ageGroup,
      category: formData.category,
      coachIds: formData.coachId ? [formData.coachId] : [],
      coachName: coach?.fullName || 'Unassigned',
      currentPlayers: editingTeam?.currentPlayers || 0,
      maxPlayers: parseInt(formData.maxPlayers),
      trainingDays: formData.trainingDays,
      trainingTime: formData.trainingTime || undefined,
      pitchLocation: formData.pitchLocation || undefined,
      season: formData.season,
      isActive: formData.isActive,
      createdAt: editingTeam?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveTeam(team);

    if (editingTeam) {
      setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
      showSuccess('Team updated successfully');
    } else {
      setTeams((prev) => [...prev, team]);
      showSuccess('Team added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      dataService.deleteTeam(id);
      setTeams((prev) => prev.filter((t) => t.id !== id));
      showSuccess('Team deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Teams"
        description="Manage all academy teams and their configurations."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Teams" value={teams.length} icon={Users} />
        <StatCard label="Active Teams" value={teams.filter((t) => t.isActive).length} icon={UserPlus} />
        <StatCard label="Total Players" value={teams.reduce((acc, t) => acc + t.currentPlayers, 0)} icon={Users} />
        <StatCard label="Categories" value={[...new Set(teams.map((t) => t.category))].length} icon={Filter} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Academy">Academy</option>
              <option value="Development">Development</option>
              <option value="Elite">Elite</option>
              <option value="Pro Pathway">Pro Pathway</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No teams found"
              description="No teams match your current filters."
            />
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{team.name}</h3>
                  <p className="text-xs text-club-muted mt-1">{team.ageGroup} · {team.category}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  team.isActive ? 'bg-club-red/15 text-club-red' : 'bg-club-muted/15 text-club-muted'
                }`}>
                  {team.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Coach</span>
                  <span className="text-white font-medium">{team.coachName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Players</span>
                  <span className="text-white font-medium">{team.currentPlayers}/{team.maxPlayers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Training Days</span>
                  <span className="text-white font-medium">{team.trainingDays.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-club-muted">Season</span>
                  <span className="text-white font-medium">{team.season}</span>
                </div>
              </div>

              {/* Player capacity bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-club-muted mb-1">
                  <span>Capacity</span>
                  <span>{team.currentPlayers}/{team.maxPlayers}</span>
                </div>
                <div className="w-full bg-club-bg rounded-full h-2">
                  <div
                    className="bg-club-red h-2 rounded-full transition-all"
                    style={{ width: `${(team.currentPlayers / team.maxPlayers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDialog(team)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => handleOpenDialog(team)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete team"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Team Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., U12 Academy Blue"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group *</Label>
                <Select
                  value={formData.ageGroup}
                  onValueChange={(value) => setFormData({ ...formData, ageGroup: value as AgeGroup })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'U19', 'U21', 'Senior'] as AgeGroup[]).map((age) => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academy">Academy</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Elite">Elite</SelectItem>
                    <SelectItem value="Pro Pathway">Pro Pathway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coachId">Coach</Label>
                <Select
                  value={formData.coachId}
                  onValueChange={(value) => setFormData({ ...formData, coachId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainingTime">Training Time</Label>
                <Input
                  id="trainingTime"
                  value={formData.trainingTime}
                  onChange={(e) => setFormData({ ...formData, trainingTime: e.target.value })}
                  placeholder="e.g., 17:00-18:30"
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
              <Label>Training Days</Label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.trainingDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, trainingDays: [...formData.trainingDays, day] });
                        } else {
                          setFormData({ ...formData, trainingDays: formData.trainingDays.filter((d) => d !== day) });
                        }
                      }}
                      className="rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                    />
                    <span className="text-sm text-club-silver">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="2024/25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingTeam ? 'Update Team' : 'Add Team'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeams;