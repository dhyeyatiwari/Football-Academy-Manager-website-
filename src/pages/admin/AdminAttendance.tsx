import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Users,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { StatCard } from '@/components/portal/StatCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { dataService } from '@/services/dataService';
import type { TrainingSession, AttendanceRecord, Team, Player } from '@/types/domain';

const AdminAttendance = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessions(dataService.getTrainingSessions());
    setTeams(dataService.getTeams());
    setPlayers(dataService.getPlayers());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      const sessionAttendance = dataService.getAttendanceBySession(selectedSessionId);
      setAttendance(sessionAttendance);
    } else {
      setAttendance([]);
    }
  }, [selectedSessionId]);

  const handleMarkAttendance = (sessionId: string, playerId: string, status: AttendanceRecord['status']) => {
    const existingIndex = attendance.findIndex((a) => a.playerId === playerId);
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const newRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? attendance[existingIndex].id : `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      trainingSessionId: sessionId,
      playerId,
      playerName: `${player.firstName} ${player.lastName}`,
      status,
      checkInTime: status === 'Present' ? new Date().toISOString() : undefined,
      markedBy: 'admin',
      markedByName: 'Admin',
      markedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const updated = [...attendance];
      updated[existingIndex] = newRecord;
      setAttendance(updated);
    } else {
      setAttendance((prev) => [...prev, newRecord]);
    }
  };

  const getAttendanceStats = (sessionId: string) => {
    const sessionAttendance = dataService.getAttendanceBySession(sessionId);
    const total = sessionAttendance.length;
    const present = sessionAttendance.filter((a) => a.status === 'Present').length;
    const absent = sessionAttendance.filter((a) => a.status === 'Absent').length;
    const late = sessionAttendance.filter((a) => a.status === 'Late').length;
    const excused = sessionAttendance.filter((a) => a.status === 'Excused').length;
    return { total, present, absent, late, excused };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Monitor and manage player attendance across all training sessions."
      />

      {/* Session Selector */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-6">
        <h3 className="mb-4 font-display text-lg font-bold text-white">Select Session</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sessions.map((session) => {
            const stats = getAttendanceStats(session.id);
            const isSelected = selectedSessionId === session.id;
            return (
              <button
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`rounded-xl border p-4 transition-all text-left ${
                  isSelected
                    ? 'border-club-red bg-club-red/5 shadow-[0_0_15px_rgba(197,30,50,0.1)]'
                    : 'border-club-border bg-club-bg hover:border-club-red/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{session.teamName}</p>
                    <p className="text-xs text-club-muted">{session.date} · {session.startTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-club-muted">Attendance</p>
                    <p className="font-display text-xl font-bold text-club-red">
                      {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
          {sessions.length === 0 && (
            <div className="col-span-full">
              <EmptyState icon={Calendar} title="No sessions" description="No training sessions available for attendance tracking." />
            </div>
          )}
        </div>
      </div>

      {/* Attendance Marking */}
      {selectedSessionId && (
        <div className="rounded-2xl border border-club-border bg-club-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              {(() => {
                const session = sessions.find((s) => s.id === selectedSessionId);
                return (
                  <>
                    <h3 className="font-display text-lg font-bold text-white">{session?.teamName}</h3>
                    <p className="text-sm text-club-muted">{session?.date} · {session?.startTime}–{session?.endTime} · {session?.location}</p>
                  </>
                );
              })()}
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-club-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-club-red-hover">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-club-border">
                  <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-club-muted">Player</th>
                  <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-club-muted">Position</th>
                  <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-club-muted">Status</th>
                  <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-club-muted">Check-in</th>
                  <th className="text-left p-3 text-xs font-medium uppercase tracking-wider text-club-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players
                  .filter((p) => p.teamId === sessions.find((s) => s.id === selectedSessionId)?.teamId)
                  .map((player) => {
                    const record = attendance.find((a) => a.playerId === player.id);
                    return (
                      <tr key={player.id} className="border-b border-club-border/50 hover:bg-club-bg/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-club-red text-xs font-bold text-white">
                              {player.firstName[0]}{player.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{player.firstName} {player.lastName}</p>
                              <p className="text-xs text-club-muted">#{player.jerseyNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-club-muted">{player.position.join(', ')}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {['Present', 'Absent', 'Late', 'Excused'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleMarkAttendance(selectedSessionId!, player.id, status as AttendanceRecord['status'])}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  record?.status === status
                                    ? 'bg-club-red text-white shadow-[0_0_10px_rgba(197,30,50,0.3)]'
                                    : 'bg-club-surface text-club-silver hover:bg-club-red/10 hover:text-club-red'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-club-muted">
                          {record?.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '—'}
                        </td>
                        <td className="p-3">
                          {record && (
                            <span className="inline-flex items-center gap-1 text-xs text-club-muted">
                              <Clock className="h-3 w-3" />
                              Marked by {record.markedByName}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Attendance Summary */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            {(() => {
              const stats = getAttendanceStats(selectedSessionId!);
              return [
                { label: 'Total', value: stats.total, icon: Users, color: 'text-club-silver' },
                { label: 'Present', value: stats.present, icon: CheckCircle2, color: 'text-club-red' },
                { label: 'Absent', value: stats.absent, icon: AlertCircle, color: 'text-destructive' },
                { label: 'Late', value: stats.late, icon: Clock, color: 'text-club-gold' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-club-border bg-club-bg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="text-xs font-medium uppercase tracking-wider text-club-muted">{stat.label}</span>
                  </div>
                  <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {!selectedSessionId && sessions.length > 0 && (
        <div className="rounded-2xl border border-dashed border-club-border bg-club-surface/50 p-8 text-center">
          <Calendar className="w-12 h-12 text-club-muted mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold text-white mb-2">Select a session</h3>
          <p className="text-club-muted">Choose a training session from above to mark attendance.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;