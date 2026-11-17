import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  UserPlus,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  FileText,
  Download,
  Eye,
  Award,
  Target,
  Activity,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PlayerReport, Player, Team, ScoutRatings } from '@/types/domain';

const CoachPlayerDevelopment = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<PlayerReport[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<PlayerReport | null>(null);
  const [formData, setFormData] = useState({
    playerId: '',
    playerName: '',
    coachId: user?.id || '',
    coachName: user?.fullName || '',
    teamId: '',
    teamName: '',
    assessmentDate: new Date().toISOString(),
    ratings: {
      technical: 5,
      tactical: 5,
      physical: 5,
      psychological: 5,
      attitude: 5,
      overall: 5.0,
    },
    strengths: '',
    weaknesses: '',
    developmentObjectives: '',
    observations: '',
    coachRecommendations: '',
  });

  useEffect(() => {
    if (user) {
      const myTeams = dataService.getTeamsByCoach(user.id);
      setTeams(myTeams);
      const teamIds = myTeams.map((t) => t.id);
      const allPlayers = dataService.getPlayers().filter((p) => teamIds.includes(p.teamId || ''));
      setPlayers(allPlayers);
      const allReports = dataService.getPlayerReports().filter((r) => teamIds.includes(r.teamId));
      setReports(allReports);
      setLoading(false);
    }
  }, [user]);

  const handleOpenDialog = (report?: PlayerReport) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        playerId: report.playerId,
        playerName: report.playerName,
        coachId: report.coachId,
        coachName: report.coachName,
        teamId: report.teamId,
        teamName: report.teamName,
        assessmentDate: report.assessmentDate,
        ratings: {
          technical: report.ratings.technical,
          tactical: report.ratings.tactical,
          physical: report.ratings.physical,
          psychological: report.ratings.psychological,
          attitude: report.ratings.attitude,
          overall: report.ratings.overall,
        },
        strengths: report.strengths.join(', ') || '',
        weaknesses: report.weaknesses.join(', ') || '',
        developmentObjectives: report.developmentObjectives.join(', ') || '',
        observations: report.observations.join(', ') || '',
        coachRecommendations: report.coachRecommendations || '',
      });
    } else {
      setEditingReport(null);
      setFormData({
        playerId: '',
        playerName: '',
        coachId: user?.id || '',
        coachName: user?.fullName || '',
        teamId: '',
        teamName: '',
        assessmentDate: new Date().toISOString(),
        ratings: {
          technical: 5,
          tactical: 5,
          physical: 5,
          psychological: 5,
          attitude: 5,
          overall: 5.0,
        },
        strengths: '',
        weaknesses: '',
        developmentObjectives: '',
        observations: '',
        coachRecommendations: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingReport(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.playerId || !formData.teamId) {
      showError('Please select a player and team');
      return;
    }

    const report: PlayerReport = {
      id: editingReport?.id || `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: formData.playerId,
      playerName: formData.playerName,
      coachId: formData.coachId,
      coachName: formData.coachName,
      teamId: formData.teamId,
      teamName: formData.teamName,
      assessmentDate: formData.assessmentDate,
      ratings: {
        technical: formData.ratings.technical,
        tactical: formData.ratings.tactical,
        physical: formData.ratings.physical,
        psychological: formData.ratings.psychological,
        attitude: formData.ratings.attitude,
        overall: formData.ratings.overall,
      },
      strengths: formData.strengths ? formData.strengths.split(',').filter(Boolean) : [],
      weaknesses: formData.weaknesses ? formData.weaknesses.split(',').filter(Boolean) : [],
      developmentObjectives: formData.developmentObjectives ? formData.developmentObjectives.split(',').filter(Boolean) : [],
      observations: formData.observations ? formData.observations.split(',').filter(Boolean) : [],
      coachRecommendations: formData.coachRecommendations || '',
      previousReportId: editingReport?.id,
      createdAt: editingReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataService.savePlayerReport(report);

    // Update local state
    if (editingReport) {
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? report : r))
      );
      showSuccess('Player report updated successfully');
    } else {
      setReports((prev) => [report, ...prev]);
      showSuccess('Player report created successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      dataService.deletePlayerReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
      showSuccess('Player report deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading player development...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Player Development"
        description="Track and manage player development reports and progress."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Report
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Reports" value={reports.length} icon={FileText} />
        <StatCard label="Players Tracked" value={players.length} icon={Users} />
        <StatCard label="Avg Overall Rating" value={reports.length > 0 ? (reports.reduce((acc, r) => acc + r.ratings.overall, 0) / reports.length).toFixed(1) : '—'} icon={TrendingUp} />
        <StatCard label="Teams" value={teams.length} icon={Award} />
      </div>

      {/* Player Development Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => {
          const latestReport = reports.filter((r) => r.playerId === player.id).sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())[0];
          const team = teams.find((t) => t.id === player.teamId);
          return (
            <div
              key={player.id}
              className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-club-red text-white font-bold">
                    {player.firstName[0]}{player.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{player.firstName} {player.lastName}</h3>
                    <p className="text-xs text-club-muted">{team?.name || 'No team'} · #{player.jerseyNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-club-muted">Overall</p>
                  <p className="font-display text-2xl font-bold text-club-red">
                    {latestReport ? latestReport.ratings.overall.toFixed(1) : '—'}
                  </p>
                </div>
              </div>

              {latestReport && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-club-muted">Technical</span>
                    <span className="font-medium text-white">{latestReport.ratings.technical}/10</span>
                  </div>
                  <div className="w-full bg-club-bg rounded-full h-1.5">
                    <div className="bg-club-red h-1.5 rounded-full" style={{ width: `${latestReport.ratings.technical * 10}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-club-muted">Tactical</span>
                    <span className="font-medium text-white">{latestReport.ratings.tactical}/10</span>
                  </div>
                  <div className="w-full bg-club-bg rounded-full h-1.5">
                    <div className="bg-club-red h-1.5 rounded-full" style={{ width: `${latestReport.ratings.tactical * 10}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-club-muted">Physical</span>
                    <span className="font-medium text-white">{latestReport.ratings.physical}/10</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDialog(latestReport)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Report
                </button>
                <button
                  onClick={() => handleOpenDialog(latestReport)}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(latestReport?.id || '')}
                  className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete report"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {players.length === 0 && (
        <EmptyState
          icon={TrendingUp}
          title="No players"
          description="You have no players assigned to your teams. Add players to start tracking development."
        />
      )}
    </div>
  );
};

export default CoachPlayerDevelopment;