import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Calendar,
  Users,
  Eye,
  Edit3,
  Trash2,
  Clock,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
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
import type { Announcement, UserRole } from '@/types/domain';

const AdminAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRoles: ['admin', 'coach', 'parent'] as UserRole[],
    priority: 'Normal' as 'Low' | 'Normal' | 'High' | 'Urgent',
    expiresAt: '',
  });

  useEffect(() => {
    const allAnnouncements = dataService.getAnnouncements();
    setAnnouncements(allAnnouncements);
    setLoading(false);
  }, []);

  const handleOpenDialog = (ann?: Announcement) => {
    if (ann) {
      setEditingAnn(ann);
      setFormData({
        title: ann.title,
        content: ann.content,
        targetRoles: ann.targetRoles,
        priority: ann.priority,
        expiresAt: ann.expiresAt || '',
      });
    } else {
      setEditingAnn(null);
      setFormData({
        title: '',
        content: '',
        targetRoles: ['admin', 'coach', 'parent'],
        priority: 'Normal',
        expiresAt: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAnn(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    const announcement: Announcement = {
      id: editingAnn?.id || `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      content: formData.content,
      authorId: user?.id || '',
      authorName: user?.fullName || '',
      authorRole: user?.role || 'admin',
      targetRoles: formData.targetRoles,
      priority: formData.priority,
      publishedAt: editingAnn?.publishedAt || new Date().toISOString(),
      expiresAt: formData.expiresAt || undefined,
    };

    dataService.saveAnnouncement(announcement);

    if (editingAnn) {
      setAnnouncements((prev) => prev.map((a) => (a.id === announcement.id ? announcement : a)));
      showSuccess('Announcement updated successfully');
    } else {
      setAnnouncements((prev) => [announcement, ...prev]);
      showSuccess('Announcement published successfully');
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      dataService.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showSuccess('Announcement deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Publish and manage academy announcements."
        action={
          <button
            onClick={() => handleOpenDialog()}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total" value={announcements.length} icon={Megaphone} />
        <StatCard label="Active" value={announcements.filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date()).length} icon={CheckCircle2} />
        <StatCard label="Urgent" value={announcements.filter((a) => a.priority === 'Urgent').length} icon={AlertCircle} />
        <StatCard label="Target Roles" value={[...new Set(announcements.flatMap((a) => a.targetRoles))].length} icon={Users} />
      </div>

      {/* Announcements List */}
      <div className="rounded-2xl border border-club-border bg-club-surface p-6">
        {announcements.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No announcements"
            description="No announcements have been published yet."
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => {
              const priorityColors: Record<string, string> = {
                Low: 'bg-club-blue/15 text-club-blue',
                Normal: 'bg-club-surface text-club-silver',
                High: 'bg-club-red/15 text-club-red',
                Urgent: 'bg-club-gold/15 text-club-gold',
              };
              return (
                <div
                  key={ann.id}
                  className="rounded-xl border border-club-border bg-club-bg p-4 hover:border-club-red/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-white">{ann.title}</h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColors[ann.priority] || 'bg-club-surface text-club-muted'}`}>
                          {ann.priority}
                        </span>
                        <span className="rounded-full px-2 py-1 text-xs font-medium bg-club-surface text-club-muted">
                          {ann.authorRole}
                        </span>
                      </div>
                      <p className="text-xs text-club-muted line-clamp-2 mb-2">{ann.content}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-club-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {ann.publishedAt.slice(0, 10)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {ann.targetRoles.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleOpenDialog(ann)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDialog(ann)}
                        className="p-2 rounded-lg text-club-silver hover:text-white hover:bg-club-surface transition-colors"
                        title="Edit announcement"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-2 rounded-lg text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete announcement"
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnn ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Announcement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Announcement content"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as 'Low' | 'Normal' | 'High' | 'Urgent' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires On</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Roles</Label>
              <div className="flex flex-wrap gap-2">
                {(['admin', 'coach', 'parent'] as UserRole[]).map((role) => (
                  <label key={role} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, targetRoles: [...formData.targetRoles, role] });
                        } else {
                          setFormData({ ...formData, targetRoles: formData.targetRoles.filter((r) => r !== role) });
                        }
                      }}
                      className="rounded border-club-border bg-club-bg text-club-red focus:ring-club-red"
                    />
                    <span className="text-sm text-club-silver capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-club-red hover:bg-club-red-hover">
                {editingAnn ? 'Update Announcement' : 'Publish Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncements;