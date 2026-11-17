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
  Mail,
  Phone,
  MapPin,
  Award,
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
import type { Coach, Team } from '@/types/domain';

const AdminCoaches = () => {
  const { user } = useAuth();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licenseLevel: 'UEFA C' as Coach['licenseLevel'],
    teamIds: [] as string[],
  });

  useEffect(() => {
    setCoaches(dataService.getCoaches());
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch = coach.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenDialog = (coach?: Coach) => {
    if (coach) {
      setEditingCoach(coach);
      setFormData({
        fullName: coach.fullName,
        email: coach.email,
        phone: coach.phone || '',
        licenseLevel: coach.licenseLevel || 'UEFA C',
        teamIds: coach.teamIds,
      });
    } else {
      setEditingCoach(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        licenseLevel: 'UEFA C',
        teamIds: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCoach(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const coach: Coach = {
      id: editingCoach?.id || `coach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: editingCoach?.userId || `user_${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      licenseLevel: formData.licenseLevel,
      teamIds: formData.teamIds,
      teamNames: formData.teamIds.map((id) => teams.find((t) => t.id === id)?.name || ''),
      createdAt: editingCoach?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveCoach(coach);

    if (editingCoach) {
      setCoaches((prev) => prev.map((c) => (c.id === coach.id ? coach : c)));
      showSuccess('Coach updated successfully');
    } else {
      setCoaches((prev) => [...prev, coach]);
      showSuccess('Coach added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coach?')) {
      dataService.deleteCoach(id);
      setCoaches((prev) => prev.filter((c) => c.id !== id));
      showSuccess('Coach deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Coaches"
        description="Manage academy coaching staff and their assignments."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Coach
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Coaches" value={coaches.length} icon={Users} />
        <StatCard label="With Teams" value={coaches.filter((c) => c.teamIds.length > 0).length} icon={UserPlus} />
        <StatCard label="UEFA Pro" value={coaches.filter((c) => c.licenseLevel === 'UEFA Pro').length} icon={Award} />
        <StatCard label="UEFA A" value={coaches.filter((c) => c.licenseLevel === 'UEFA A').length} icon={Award} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
          <input
            type="text"
            placeholder="Search coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCoaches.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Users}
              title="No coaches found"
              description="No coaches match your current filters."
            />
          </div>
        ) : (
          filteredCoaches.map((coach) => {
            const coachTeams = teams.filter((t) => coach.teamIds.includes(t.id));
            return (
              <div
                key={coach.id}
                className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-club-red text-white font-bold">
                      {coach.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{coach.fullName}</h3>
                      <p className="text-xs text-club-muted">{coach.email}</p>
                    </div>
                  </div>
                  {coach.licenseLevel && (
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-club-gold/15 text-club-gold border border-club-gold/30">
                      {coach.licenseLevel}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {coach.phone && (
                    <div className="flex items-center gap-2 text-sm text-club-silver">
                      <Phone className="h-4 w-4" />
                      <span>{coach.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-club-silver">
                    <Mail className="h-4 w-4" />
                    <span>{coach.email}</span>
                  </div>
                </div>

                {/* Teams assigned */}
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-club-muted mb-2">Assigned Teams</p>
                  <div className="flex flex-wrap gap-2">
                    {coachTeams.length > 0 ? (
                      coachTeams.map((team) => (
                        <span key={team.id} className="px-2.5 py-1 rounded-lg bg-club-bg border border-club-border text-xs text-club-silver">
                          {team.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-club-muted">No teams assigned</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDialog(coach)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenDialog(coach)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coach.id)}
                    className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete coach"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Coach Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoach ? 'Edit Coach' : 'Add Coach'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Coach full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="coach@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7700 900123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseLevel">License Level</Label>
              <Select
                value={formData.licenseLevel}
                onValueChange={(value) => setFormData({ ...formData, licenseLevel: value as Coach['licenseLevel'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UEFA Pro">UEFA Pro</SelectItem>
                  <SelectItem value="UEFA A">UEFA A</SelectItem>
                  <SelectItem value="UEFA B">UEFA B</SelectItem>
                  <SelectItem value="UEFA C">UEFA C</SelectItem>
                  <SelectItem value="FA Level 1">FA Level 1</SelectItem>
                  <SelectItem value="FA Level 2">FA Level 2</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned Teams</Label>
              <div className="space-y-2">
                {teams.map((team) => (
                  <label key={team.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teamIds.includes(team.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, teamIds: [...formData.teamIds, team.id] });
                        } else {
                          setFormData({ ...formData, teamIds: formData.teamIds.filter((id) => id !== team.id) });
                        }
                      }}
                      className="rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                    />
                    <span className="text-sm text-club-silver">{team.name} ({team.ageGroup})</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingCoach ? 'Update Coach' : 'Add Coach'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoaches;