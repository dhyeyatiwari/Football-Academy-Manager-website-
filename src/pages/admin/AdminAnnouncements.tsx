import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  UserPlus,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Send,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { Announcement } from '@/types/domain';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {
    setAnnouncements(dataService.getAnnouncements());
    setLoading(false);
  }, []);

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || ann.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      // In a real app, this would call dataService.deleteAnnouncement
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
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
        description="Create and manage academy announcements and communications."
        action={
          <button
            onClick={() => alert('Create announcement form would go here')}
            className="inline-flex items-center gap-2 rounded-xl bg-club-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-club-red-hover"
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total Announcements" value={announcements.length} icon={Megaphone} />
        <StatCard label="High Priority" value={announcements.filter((a) => a.priority === 'High' || a.priority === 'Urgent').length} icon={AlertCircle} />
        <StatCard label="Normal Priority" value={announcements.filter((a) => a.priority === 'Normal').length} icon={CheckCircle2} />
        <StatCard label="Low Priority" value={announcements.filter((a) => a.priority === 'Low').length} icon={Clock} />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 rounded-lg border border-club-border bg-club-bg text-white focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No announcements found"
            description="No announcements match your current filters."
          />
        ) : (
          filteredAnnouncements.map((ann) => {
            const priorityColors: Record<string, string> = {
              Low: 'bg-club-muted/15 text-club-muted',
              Normal: 'bg-club-blue/15 text-club-blue',
              High: 'bg-club-gold/15 text-club-gold',
              Urgent: 'bg-club-red/15 text-club-red',
            };
            return (
              <div
                key={ann.id}
                className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-white">{ann.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColors[ann.priority] || 'bg-club-surface text-club-muted'}`}>
                        {ann.priority}
                      </span>
                    </div>
                    <p className="text-sm text-club-muted line-clamp-2">{ann.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-club-muted mb-4">
                  <div className="flex items-center gap-4">
                    <span>By {ann.authorName}</span>
                    <span>·</span>
                    <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ann.targetRoles.map((role) => (
                      <span key={role} className="px-2 py-1 rounded-lg bg-club-bg border border-club-border text-xs text-club-silver capitalize">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`View announcement ${ann.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => alert(`Edit announcement ${ann.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-club-surface/50 px-3 py-2 text-xs font-medium text-club-silver hover:bg-club-surface hover:text-white transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 rounded-xl text-club-silver hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;