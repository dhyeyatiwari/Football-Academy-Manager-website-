import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
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
import type { Match, Team, MatchType, MatchStatus } from '@/types/domain';

const CoachMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    homeTeamId: '',
    homeTeamName: '',
    awayTeamId: '',
    awayTeamName: '',
    date: new Date().toISOString().split('T')[0],
    kickoffTime: '',
    venue: '',
    competition: '',
    matchType: 'Friendly' as MatchType,
    status: 'Scheduled' as MatchStatus,
    homeScore: '',
    awayScore: '',
    referee: '',
    weather: '',
  });

  useEffect(() => {
    if (user) {
      const myTeams = dataService.getTeamsByCoach(user.id);
      setTeams(myTeams);
      const teamIds = myTeams.map((t) => t.id);
      const allMatches = dataService.getMatches().filter((m) => teamIds.includes(m.homeTeamId) || teamIds.includes(m.awayTeamId));
      setMatches(allMatches);
      setLoading(false);
    }
  }, [user]);

  const handleOpenDialog = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        homeTeamId: match.homeTeamId,
        homeTeamName: match.homeTeamName,
        awayTeamId: match.awayTeamId,
        awayTeamName: match.awayTeamName,
        date: match.date,
        kickoffTime: match.kickoffTime,
        venue: match.venue,
        competition: match.competition,
        matchType: match.matchType,
        status: match.status,
        homeScore: match.homeScore?.toString() || '',
        awayScore: match.awayScore?.toString() || '',
        referee: match.referee || '',
        weather: match.weather || '',
      });
    } else {
      setEditingMatch(null);
      setFormData({
        homeTeamId: '',
        homeTeamName: '',
        awayTeamId: '',
        awayTeamName: '',
        date: new Date().toISOString().split('T')[0],
        kickoffTime: '',
        venue: '',
        competition: '',
        matchType: 'Friendly',
        status: 'Scheduled',
        homeScore: '',
        awayScore: '',
        referee: '',
        weather: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMatch(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.homeTeamId || !formData.awayTeamId || !formData.date || !formData.kickoffTime) {
      showError('Please fill in all required fields');
      return;
    }

    const homeTeam = teams.find((t) => t.id === formData.homeTeamId);
    const awayTeam = teams.find((t) => t.id === formData.awayTeamId);

    if (!homeTeam || !awayTeam) {
      showError('Invalid team selected');
      return;
    }

    const match: Match = {
      id: editingMatch?.id || `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      homeTeamId: formData.homeTeamId,
      homeTeamName: formData.homeTeamName || homeTeam.name,
      awayTeamId: formData.awayTeamId,
      awayTeamName: formData.awayTeamName || awayTeam.name,
      date: formData.date,
      kickoffTime: formData.kickoffTime,
      venue: formData.venue,
      competition: formData.competition,
      matchType: formData.matchType,
      status: formData.status,
      homeScore: formData.homeScore ? parseInt(formData.homeScore) : undefined,
      awayScore: formData.awayScore ? parseInt(formData.awayScore) : undefined,
      referee: formData.referee || undefined,
      weather: formData.weather || undefined,
    };

    dataService.saveMatch(match);

    if (editingMatch) {
      setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m)));
      showSuccess('Match updated successfully');
    } else {
      setMatches((prev) => [match, ...prev]);
      showSuccess('Match created successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      dataService.deleteMatch(id);
      setMatches((prev) => prev.filter((m) => m.id !== id));
      showSuccess('Match deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Matches"
        description="Manage matches and fixtures for your teams."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Match
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Matches" value={matches.length} icon={Trophy} />
        <StatCard label="Upcoming" value={matches.filter((m) => m.status === 'Scheduled').length} icon={Calendar} />
        <StatCard label="Completed" value={matches.filter((m) => m.status === 'Full Time').length} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={matches.filter((m) => m.status === 'Cancelled').length} icon={AlertCircle} />
      </div>

      {/* Matches List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {matches.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No matches"
            description="You have no matches scheduled. Add your first match to get started."
          />
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const statusColors: Record<string, string> = {
                Scheduled: 'bg-club-red/15 text-club-red',
                Live: 'bg-club-gold/15 text-club-gold',
                'Half Time': 'bg-club-gold/15 text-club-gold',
                'Full Time': 'bg-club-blue/15 text-club-blue',
                Postponed: 'bg-club-muted/15 text-club-muted',
                Cancelled: 'bg-club-muted/15 text-club-muted',
              };
              return (
                <div
                  key={match.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold text-white">{match.homeTeamName}</h3>
                          <span className="text-lg font-bold text-club-muted">-</span>
                          <h3 className="text-sm font-semibold text-white">{match.awayTeamName}</h3>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[match.status] || 'bg-club-surface text-club-muted'}`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {match.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {match.kickoffTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {match.venue}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" /> {match.competition}
                        </span>
                      </div>
                      {match.status === 'Full Time' && match.homeScore !== undefined && match.awayScore !== undefined && (
                        <div className="mt-2 text-xs text-club-muted">
                          Final: {match.homeScore} - {match.awayScore}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleOpenDialog(match)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View details"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDialog(match)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit match"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete match"
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

      {/* Create/Edit Match Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMatch ? 'Edit Match' : 'Add Match'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Home Team *</Label>
                <Select
                  value={formData.homeTeamId}
                  onValueChange={(value) => {
                    const team = teams.find((t) => t.id === value);
                    setFormData({ ...formData, homeTeamId: value, homeTeamName: team?.name || '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
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
                <Label htmlFor="awayTeam">Away Team *</Label>
                <Select
                  value={formData.awayTeamId}
                  onValueChange={(value) => {
                    const team = teams.find((t) => t.id === value);
                    setFormData({ ...formData, awayTeamId: value, awayTeamName: team?.name || '' });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
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
                <Label htmlFor="kickoffTime">Kickoff Time *</Label>
                <Input
                  id="kickoffTime"
                  type="time"
                  value={formData.kickoffTime}
                  onChange={(e) => setFormData({ ...formData, kickoffTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., Main Pitch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competition">Competition</Label>
                <Input
                  id="competition"
                  value={formData.competition}
                  onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                  placeholder="e.g., League"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchType">Match Type</Label>
                <Select
                  value={formData.matchType}
                  onValueChange={(value) => setFormData({ ...formData, matchType: value as MatchType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="League">League</SelectItem>
                    <SelectItem value="Cup">Cup</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Tournament">Tournament</SelectItem>
                    <SelectItem value="Academy Internal">Academy Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as MatchStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Half Time">Half Time</SelectItem>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Postponed">Postponed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeScore">Home Score</Label>
                <Input
                  id="homeScore"
                  type="number"
                  value={formData.homeScore}
                  onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayScore">Away Score</Label>
                <Input
                  id="awayScore"
                  type="number"
                  value={formData.awayScore}
                  onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referee">Referee</Label>
                <Input
                  id="referee"
                  value={formData.referee}
                  onChange={(e) => setFormData({ ...formData, referee: e.target.value })}
                  placeholder="Referee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weather">Weather</Label>
                <Input
                  id="weather"
                  value={formData.weather}
                  onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                  placeholder="Weather conditions"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingMatch ? 'Update Match' : 'Add Match'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachMatches;