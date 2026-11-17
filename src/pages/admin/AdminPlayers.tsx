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
import type { Player, Team, AgeGroup, PlayerPosition } from '@/types/domain';

const AdminPlayers = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    ageGroup: 'U12' as AgeGroup,
    position: ['CM'] as PlayerPosition[],
    preferredFoot: 'Right' as 'Left' | 'Right' | 'Both',
    height: '',
    weight: '',
    teamId: '',
    parentIds: [] as string[],
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: '',
    },
    medicalInfo: {
      allergies: '',
      conditions: '',
      medications: '',
      doctorName: '',
      doctorPhone: '',
      insuranceProvider: '',
      insuranceNumber: '',
    },
    jerseyNumber: '',
    isActive: true,
  });

  useEffect(() => {
    setPlayers(dataService.getPlayers());
    setTeams(dataService.getTeams());
    setLoading(false);
  }, []);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.jerseyNumber && player.jerseyNumber.toString().includes(searchTerm));
    const matchesTeam = selectedTeam === 'all' || player.teamId === selectedTeam;
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' ? player.isActive : !player.isActive);
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const handleOpenDialog = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        firstName: player.firstName,
        lastName: player.lastName,
        dateOfBirth: player.dateOfBirth,
        ageGroup: player.ageGroup,
        position: player.position,
        preferredFoot: player.preferredFoot,
        height: player.height?.toString() || '',
        weight: player.weight?.toString() || '',
        teamId: player.teamId || '',
        parentIds: player.parentIds,
        emergencyContact: player.emergencyContact,
        medicalInfo: player.medicalInfo || {
          allergies: '',
          conditions: '',
          medications: '',
          doctorName: '',
          doctorPhone: '',
          insuranceProvider: '',
          insuranceNumber: '',
        },
        jerseyNumber: player.jerseyNumber?.toString() || '',
        isActive: player.isActive,
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        ageGroup: 'U12',
        position: ['CM'],
        preferredFoot: 'Right',
        height: '',
        weight: '',
        teamId: '',
        parentIds: [],
        emergencyContact: {
          name: '',
          relationship: '',
          phone: '',
          email: '',
        },
        medicalInfo: {
          allergies: '',
          conditions: '',
          medications: '',
          doctorName: '',
          doctorPhone: '',
          insuranceProvider: '',
          insuranceNumber: '',
        },
        jerseyNumber: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlayer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.dateOfBirth) {
      showError('Please fill in all required fields');
      return;
    }

    const player: Player = {
      id: editingPlayer?.id || `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)},
      userId: editingPlayer?.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      ageGroup: formData.ageGroup,
      position: formData.position,
      preferredFoot: formData.preferredFoot,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      teamId: formData.teamId || undefined,
      teamName: formData.teamId ? teams.find((t) => t.id === formData.teamId)?.name : undefined,
      parentIds: formData.parentIds,
      parentNames: formData.parentIds.map((id) => dataService.getParentById(id)?.fullName || ''),
      emergencyContact: formData.emergencyContact,
      medicalInfo: formData.medicalInfo,
      joinDate: editingPlayer?.joinDate || new Date().toISOString(),
      isActive: formData.isActive,
      jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber) : undefined,
    };

    dataService.savePlayer(player);

    if (editingPlayer) {
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
      showSuccess('Player updated successfully');
    } else {
      setPlayers((prev) => [...prev, player]);
      showSuccess('Player added successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      dataService.deletePlayer(id);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Player deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Players"
        description="Manage all academy players and their profiles."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            Add Player
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Players" value={players.length} icon={Users} />
        <StatCard label="Active" value={players.filter((p) => p.isActive).length} icon={UserPlus} />
        <StatCard label="Inactive" value={players.filter((p) => !p.isActive).length} icon={Users} />
        <StatCard label="Teams" value={teams.length} icon={Users} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search players..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="rounded-2xl border border-club-border bg-club-surface overflow-hidden">
        {filteredPlayers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No players found"
            description="No players match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Team</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Age Group</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Position</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Jersey</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-4 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player) => {
                  const team = teams.find((t) => t.id === player.teamId);
                  return (
                    <tr key={player.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-club-red text-white font-bold">
                            {player.firstName[0]}{player.lastName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{player.firstName} {player.lastName}</p>
                            <p className="text-xs text-club-muted">{player.dateOfBirth}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-club-silver">{team?.name || 'Unassigned'}</td>
                      <td className="p-4 text-sm text-club-silver">{player.ageGroup}</td>
                      <td className="p-4 text-sm text-club-silver">{player.position.join(', ')}</td>
                      <td className="p-4 text-sm text-club-silver">{player.jerseyNumber || '—'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          player.isActive
                            ? 'bg-club-red/15 text-club-red'
                            : 'bg-club-muted/15 text-club-muted'
                        }`}>
                          {player.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(player)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDialog(player)}
                            className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(player.id)}
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

      {/* Create/Edit Player Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlayer ? 'Edit Player' : 'Add Player'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position(s)</Label>
                <Select
                  value={formData.position[0]}
                  onValueChange={(value) => setFormData({ ...formData, position: [value as PlayerPosition] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'] as PlayerPosition[]).map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredFoot">Preferred Foot</Label>
                <Select
                  value={formData.preferredFoot}
                  onValueChange={(value) => setFormData({ ...formData, preferredFoot: value as 'Left' | 'Right' | 'Both' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Left</SelectItem>
                    <SelectItem value="Right">Right</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="70"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamId">Team</Label>
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => setFormData({ ...formData, teamId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.ageGroup})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jerseyNumber">Jersey Number</Label>
                <Input
                  id="jerseyNumber"
                  type="number"
                  value={formData.jerseyNumber}
                  onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                  placeholder="10"
                />
              </div>
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

            <div className="border-t border-club-border pt-4">
              <h4 className="font-medium text-white mb-3">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                    placeholder="e.g., Mother, Father"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                    placeholder="+44 7700 900123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail">Email</Label>
                  <Input
                    id="emergencyEmail"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, email: e.target.value } })}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingPlayer ? 'Update Player' : 'Add Player'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlayers;