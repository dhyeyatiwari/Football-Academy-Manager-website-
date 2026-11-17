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
  Users,
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
import type { SessionPlan, Team, SessionPlanCategory } from '@/types/domain';

const CoachSessionPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SessionPlan[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SessionPlan | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical' as SessionPlanCategory,
    teamId: '',
    totalDuration: '',
    objectives: '',
    warmUp: '',
    technicalDrills: '',
    tacticalActivities: '',
    smallSidedGames: '',
    physicalConditioning: '',
    coolDown: '',
    equipmentRequired: '',
    coachingPoints: '',
  });

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

  const handleOpenDialog = (plan?: SessionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        title: plan.title,
        description: plan.description || '',
        category: plan.category,
        teamId: plan.teamId,
        totalDuration: plan.totalDuration?.toString() || '',
        objectives: plan.objectives?.join('\n') || '',
        warmUp: plan.warmUp?.join('\n') || '',
        technicalDrills: plan.technicalDrills?.join('\n') || '',
        tacticalActivities: plan.tacticalActivities?.join('\n') || '',
        smallSidedGames: plan.smallSidedGames?.join('\n') || '',
        physicalConditioning: plan.physicalConditioning?.join('\n') || '',
        coolDown: plan.coolDown?.join('\n') || '',
        equipmentRequired: plan.equipmentRequired?.join('\n') || '',
        coachingPoints: plan.coachingPoints?.join('\n') || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        teamId: '',
        totalDuration: '',
        objectives: '',
        warmUp: '',
        technicalDrills: '',
        tacticalActivities: '',
        smallSidedGames: '',
        physicalConditioning: '',
        coolDown: '',
        equipmentRequired: '',
        coachingPoints: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.teamId) {
      showError('Please fill in all required fields');
      return;
    }

    const team = teams.find((t) => t.id === formData.teamId);
    if (!team) {
      showError('Invalid team selected');
      return;
    }

    const plan: SessionPlan = {
      id: editingPlan?.id || `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      trainingSessionId: editingPlan?.trainingSessionId || '',
      coachId: user?.id || '',
      coachName: user?.fullName || '',
      teamId: formData.teamId,
      teamName: team.name,
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      objectives: formData.objectives ? formData.objectives.split('\n').filter(Boolean) : undefined,
      warmUp: formData.warmUp ? formData.warmUp.split('\n').filter(Boolean) : undefined,
      technicalDrills: formData.technicalDrills ? formData.technicalDrills.split('\n').filter(Boolean) : undefined,
      tacticalActivities: formData.tacticalActivities ? formData.tacticalActivities.split('\n').filter(Boolean) : undefined,
      smallSidedGames: formData.smallSidedGames ? formData.smallSidedGames.split('\n').filter(Boolean) : undefined,
      physicalConditioning: formData.physicalConditioning ? formData.physicalConditioning.split('\n').filter(Boolean) : undefined,
      coolDown: formData.coolDown ? formData.coolDown.split('\n').filter(Boolean) : undefined,
      equipmentRequired: formData.equipmentRequired ? formData.equipmentRequired.split('\n').filter(Boolean) : undefined,
      coachingPoints: formData.coachingPoints ? formData.coachingPoints.split('\n').filter(Boolean) : undefined,
      totalDuration: formData.totalDuration ? parseInt(formData.totalDuration) : undefined,
      fileType: 'structured',
      createdAt: editingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.saveSessionPlan(plan);
    
    // Update local state
    if (editingPlan) {
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
      showSuccess('Session plan updated successfully');
    } else {
      setPlans((prev) => [plan, ...prev]);
      showSuccess('Session plan created successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this session plan?')) {
      dataService.deleteSessionPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Session plan deleted successfully');
    }
  };

  const handleDownload = (plan: SessionPlan) => {
    if (plan.fileUrl) {
      // In a real app, this would download from Supabase Storage
      // For now, we'll just show a message
      showSuccess(`Downloading ${plan.fileName || 'file'}...`);
    } else {
      showError('No file attached to this plan');
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
            onClick={() => handleOpenDialog()}
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
                        onClick={() => handleOpenDialog(plan)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit plan"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {plan.fileUrl && (
                        <button
                          onClick={() => handleDownload(plan)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Session Plan' : 'Create Session Plan'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., U14 Technical Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as SessionPlanCategory })}
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
                    <SelectItem value="Video Analysis">Video Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Team *</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => setFormData({ ...formData, teamId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.ageGroup})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.totalDuration}
                  onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                  placeholder="e.g., 90"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the session plan"
                rows={2}
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

            <div className="space-y-2">
              <Label htmlFor="warmUp">Warm-up Activities</Label>
              <Textarea
                id="warmUp"
                value={formData.warmUp}
                onChange={(e) => setFormData({ ...formData, warmUp: e.target.value })}
                placeholder="Enter each warm-up activity on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalDrills">Technical Drills</Label>
              <Textarea
                id="technicalDrills"
                value={formData.technicalDrills}
                onChange={(e) => setFormData({ ...formData, technicalDrills: e.target.value })}
                placeholder="Enter each technical drill on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tacticalActivities">Tactical Activities</Label>
              <Textarea
                id="tacticalActivities"
                value={formData.tacticalActivities}
                onChange={(e) => setFormData({ ...formData, tacticalActivities: e.target.value })}
                placeholder="Enter each tactical activity on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smallSidedGames">Small-Sided Games</Label>
              <Textarea
                id="smallSidedGames"
                value={formData.smallSidedGames}
                onChange={(e) => setFormData({ ...formData, smallSidedGames: e.target.value })}
                placeholder="Enter each small-sided game on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalConditioning">Physical Conditioning</Label>
              <Textarea
                id="physicalConditioning"
                value={formData.physicalConditioning}
                onChange={(e) => setFormData({ ...formData, physicalConditioning: e.target.value })}
                placeholder="Enter each physical conditioning activity on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coolDown">Cool-down</Label>
              <Textarea
                id="coolDown"
                value={formData.coolDown}
                onChange={(e) => setFormData({ ...formData, coolDown: e.target.value })}
                placeholder="Enter each cool-down activity on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipmentRequired">Equipment Required</Label>
              <Textarea
                id="equipmentRequired"
                value={formData.equipmentRequired}
                onChange={(e) => setFormData({ ...formData, equipmentRequired: e.target.value })}
                placeholder="Enter each equipment item on a new line"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coachingPoints">Coaching Points</Label>
              <Textarea
                id="coachingPoints"
                value={formData.coachingPoints}
                onChange={(e) => setFormData({ ...formData, coachingPoints: e.target.value })}
                placeholder="Enter each coaching point on a new line"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachSessionPlans;