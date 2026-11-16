/**
 * VK Football Academy - LocalStorage Data Service
 * 
 * This service provides a Supabase-compatible API surface using localStorage.
 * When Supabase credentials are configured, this can be replaced with
 * a real Supabase client without changing component code.
 * 
 * All data persists in the browser's localStorage and is seeded from
 * the mock data on first access.
 */

import type {
  UserProfile,
  UserRole,
  Team,
  AgeGroup,
  TeamCategory,
  TrainingSession,
  AttendanceRecord,
  Player,
  PlayerPosition,
  EmergencyContact,
  MedicalInfo,
  ScoutReport,
  ScoutRatings,
  Match,
  MatchStatus,
  MatchType,
  MatchEvent,
  LineupPlayer,
  MatchLineup,
  MatchStats,
  TeamMatchStats,
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  Payment,
  PaymentStatus,
  Notification,
  NotificationType,
  NotificationChannel,
  Announcement,
  AnnouncementAttachment,
  Facility,
  MaintenanceSchedule,
  Equipment,
  DashboardMetrics,
  CoachDashboardData,
  ParentDashboardData,
  PlayerDevelopmentSummary,
  SessionPlan,
  SessionPlanCategory,
  AttendanceStatus,
  PlayerReport,
  SessionObservation,
  FeeRecord,
  Parent,
  Coach,
} from '@/types/domain';

// ============================================
// STORAGE KEYS
// ============================================

const KEYS = {
  USERS: 'vk_users',
  TEAMS: 'vk_teams',
  PLAYERS: 'vk_players',
  MATCHES: 'vk_matches',
  TRAINING_SESSIONS: 'vk_training_sessions',
  SCOUT_REPORTS: 'vk_scout_reports',
  SUBSCRIPTIONS: 'vk_subscriptions',
  PAYMENTS: 'vk_payments',
  ANNOUNCEMENTS: 'vk_announcements',
  NOTIFICATIONS: 'vk_notifications',
  SESSION_PLANS: 'vk_session_plans',
  ATTENDANCE: 'vk_attendance',
  PLAYER_REPORTS: 'vk_player_reports',
  SESSION_OBSERVATIONS: 'vk_session_observations',
  FEE_RECORDS: 'vk_fee_records',
  PARENTS: 'vk_parents',
  COACHES: 'vk_coaches',
  FACILITIES: 'vk_facilities',
  EQUIPMENT: 'vk_equipment',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return defaultValue;
    return JSON.parse(serialized) as T;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage key "${key}":`, error);
  }
}

// ============================================
// STORAGE SERVICE
// ============================================

export const storage = {
  // ============================================
  // USERS / AUTHENTICATION
  // ============================================

  getUsers: (): UserProfile[] => {
    return loadFromStorage<UserProfile[]>(KEYS.USERS, []);
  },

  getUser: (id: string): UserProfile | null => {
    const users = storage.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  saveUser: (user: UserProfile): void => {
    const users = storage.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    saveToStorage(KEYS.USERS, users);
  },

  // ============================================
  // TEAMS
  // ============================================

  getTeams: (): Team[] => {
    return loadFromStorage<Team[]>(KEYS.TEAMS, []);
  },

  getTeam: (id: string): Team | null => {
    const teams = storage.getTeams();
    return teams.find((t) => t.id === id) || null;
  },

  saveTeam: (team: Team): void => {
    const teams = storage.getTeams();
    const index = teams.findIndex((t) => t.id === team.id);
    if (index >= 0) {
      teams[index] = team;
    } else {
      teams.push(team);
    }
    saveToStorage(KEYS.TEAMS, teams);
  },

  getTeamsByCoach: (coachId: string): Team[] => {
    return storage.getTeams().filter((t) => t.coachId === coachId);
  },

  getTeamsByAgeGroup: (ageGroup: AgeGroup): Team[] => {
    return storage.getTeams().filter((t) => t.ageGroup === ageGroup);
  },

  // ============================================
  // PLAYERS
  // ============================================

  getPlayers: (): Player[] => {
    return loadFromStorage<Player[]>(KEYS.PLAYERS, []);
  },

  getPlayer: (id: string): Player | null => {
    const players = storage.getPlayers();
    return players.find((p) => p.id === id) || null;
  },

  getPlayersByTeam: (teamId: string): Player[] => {
    return storage.getPlayers().filter((p) => p.teamId === teamId);
  },

  getPlayersByParent: (parentId: string): Player[] => {
    return storage.getPlayers().filter((p) => p.parentIds.includes(parentId));
  },

  savePlayer: (player: Player): void => {
    const players = storage.getPlayers();
    const index = players.findIndex((p) => p.id === player.id);
    if (index >= 0) {
      players[index] = player;
    } else {
      players.push(player);
    }
    saveToStorage(KEYS.PLAYERS, players);
  },

  // ============================================
  // MATCHES
  // ============================================

  getMatches: (): Match[] => {
    return loadFromStorage<Match[]>(KEYS.MATCHES, []);
  },

  getMatch: (id: string): Match | null => {
    const matches = storage.getMatches();
    return matches.find((m) => m.id === id) || null;
  },

  getUpcomingMatches: (): Match[] => {
    return storage.getMatches().filter((m) => m.status === 'Scheduled');
  },

  saveMatch: (match: Match): void => {
    const matches = storage.getMatches();
    const index = matches.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      matches[index] = match;
    } else {
      matches.push(match);
    }
    saveToStorage(KEYS.MATCHES, matches);
  },

  // ============================================
  // TRAINING SESSIONS
  // ============================================

  getTrainingSessions: (): TrainingSession[] => {
    return loadFromStorage<TrainingSession[]>(KEYS.TRAINING_SESSIONS, []);
  },

  getSession: (id: string): TrainingSession | null => {
    const sessions = storage.getTrainingSessions();
    return sessions.find((s) => s.id === id) || null;
  },

  getSessionsByTeam: (teamId: string): TrainingSession[] => {
    return storage.getTrainingSessions().filter((s) => s.teamId === teamId);
  },

  saveTrainingSession: (session: TrainingSession): void => {
    const sessions = storage.getTrainingSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    saveToStorage(KEYS.TRAINING_SESSIONS, sessions);
  },

  // ============================================
  // SESSION PLANS
  // ============================================

  getSessionPlans: (): SessionPlan[] => {
    return loadFromStorage<SessionPlan[]>(KEYS.SESSION_PLANS, []);
  },

  getSessionPlan: (id: string): SessionPlan | null => {
    const plans = storage.getSessionPlans();
    return plans.find((p) => p.id === id) || null;
  },

  getSessionPlansByTeam: (teamId: string): SessionPlan[] => {
    return storage.getSessionPlans().filter((p) => p.teamId === teamId);
  },

  getSessionPlansBySession: (sessionId: string): SessionPlan[] => {
    return storage.getSessionPlans().filter((p) => p.trainingSessionId === sessionId);
  },

  saveSessionPlan: (plan: SessionPlan): void => {
    const plans = storage.getSessionPlans();
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    saveToStorage(KEYS.SESSION_PLANS, plans);
  },

  // ============================================
  // ATTENDANCE
  // ============================================

  getAttendance: (): AttendanceRecord[] => {
    return loadFromStorage<AttendanceRecord[]>(KEYS.ATTENDANCE, []);
  },

  getAttendanceBySession: (sessionId: string): AttendanceRecord[] => {
    return storage.getAttendance().filter((a) => a.trainingSessionId === sessionId);
  },

  getAttendanceByPlayer: (playerId: string): AttendanceRecord[] => {
    return storage.getAttendance().filter((a) => a.playerId === playerId);
  },

  saveAttendance: (attendance: AttendanceRecord): void => {
    const records = storage.getAttendance();
    const index = records.findIndex((a) => a.id === attendance.id);
    if (index >= 0) {
      records[index] = attendance;
    } else {
      records.push(attendance);
    }
    saveToStorage(KEYS.ATTENDANCE, records);
  },

  // ============================================
  // PLAYER REPORTS
  // ============================================

  getPlayerReports: (): PlayerReport[] => {
    return loadFromStorage<PlayerReport[]>(KEYS.PLAYER_REPORTS, []);
  },

  getPlayerReport: (id: string): PlayerReport | null => {
    const reports = storage.getPlayerReports();
    return reports.find((r) => r.id === id) || null;
  },

  getPlayerReportsByPlayer: (playerId: string): PlayerReport[] => {
    return storage.getPlayerReports().filter((r) => r.playerId === playerId);
  },

  getPlayerReportsByCoach: (coachId: string): PlayerReport[] => {
    return storage.getPlayerReports().filter((r) => r.coachId === coachId);
  },

  savePlayerReport: (report: PlayerReport): void => {
    const reports = storage.getPlayerReports();
    const index = reports.findIndex((r) => r.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    saveToStorage(KEYS.PLAYER_REPORTS, reports);
  },

  // ============================================
  // SESSION OBSERVATIONS
  // ============================================

  getSessionObservations: (): SessionObservation[] => {
    return loadFromStorage<SessionObservation[]>(KEYS.SESSION_OBSERVATIONS, []);
  },

  getSessionObservationsBySession: (sessionId: string): SessionObservation[] => {
    return storage.getSessionObservations().filter((o) => o.trainingSessionId === sessionId);
  },

  getSessionObservationsByPlayer: (playerId: string): SessionObservation[] => {
    return storage.getSessionObservations().filter((o) => o.playerId === playerId);
  },

  saveSessionObservation: (observation: SessionObservation): void => {
    const observations = storage.getSessionObservations();
    const index = observations.findIndex((o) => o.id === observation.id);
    if (index >= 0) {
      observations[index] = observation;
    } else {
      observations.push(observation);
    }
    saveToStorage(KEYS.SESSION_OBSERVATIONS, observations);
  },

  // ============================================
  // FEE RECORDS
  // ============================================

  getFeeRecords: (): FeeRecord[] => {
    return loadFromStorage<FeeRecord[]>(KEYS.FEE_RECORDS, []);
  },

  getFeeRecordsByPlayer: (playerId: string): FeeRecord[] => {
    return storage.getFeeRecords().filter((f) => f.playerId === playerId);
  },

  getFeeRecordsByStatus: (status: FeeRecord['status']): FeeRecord[] => {
    return storage.getFeeRecords().filter((f) => f.status === status);
  },

  saveFeeRecord: (record: FeeRecord): void => {
    const records = storage.getFeeRecords();
    const index = records.findIndex((f) => f.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }
    saveToStorage(KEYS.FEE_RECORDS, records);
  },

  // ============================================
  // PARENTS
  // ============================================

  getParents: (): Parent[] => {
    return loadFromStorage<Parent[]>(KEYS.PARENTS, []);
  },

  getParent: (id: string): Parent | null => {
    const parents = storage.getParents();
    return parents.find((p) => p.id === id) || null;
  },

  getParentByUserId: (userId: string): Parent | null => {
    return storage.getParents().find((p) => p.userId === userId) || null;
  },

  saveParent: (parent: Parent): void => {
    const parents = storage.getParents();
    const index = parents.findIndex((p) => p.id === parent.id);
    if (index >= 0) {
      parents[index] = parent;
    } else {
      parents.push(parent);
    }
    saveToStorage(KEYS.PARENTS, parents);
  },

  // ============================================
  // COACHES
  // ============================================

  getCoaches: (): Coach[] => {
    return loadFromStorage<Coach[]>(KEYS.COACHES, []);
  },

  getCoach: (id: string): Coach | null => {
    const coaches = storage.getCoaches();
    return coaches.find((c) => c.id === id) || null;
  },

  getCoachByUserId: (userId: string): Coach | null => {
    return storage.getCoaches().find((c) => c.userId === userId) || null;
  },

  getCoachesByTeam: (teamId: string): Coach[] => {
    return storage.getCoaches().filter((c) => c.teamIds.includes(teamId));
  },

  saveCoach: (coach: Coach): void => {
    const coaches = storage.getCoaches();
    const index = coaches.findIndex((c) => c.id === coach.id);
    if (index >= 0) {
      coaches[index] = coach;
    } else {
      coaches.push(coach);
    }
    saveToStorage(KEYS.COACHES, coaches);
  },

  // ============================================
  // ANNOUNCEMENTS
  // ============================================

  getAnnouncements: (): Announcement[] => {
    return loadFromStorage<Announcement[]>(KEYS.ANNOUNCEMENTS, []);
  },

  getAnnouncement: (id: string): Announcement | null => {
    const announcements = storage.getAnnouncements();
    return announcements.find((a) => a.id === id) || null;
  },

  getAnnouncementsByRole: (role: UserRole): Announcement[] => {
    return storage.getAnnouncements().filter((a) => a.targetRoles.includes(role));
  },

  getAnnouncementsByTeam: (teamId?: string): Announcement[] => {
    if (!teamId) return storage.getAnnouncements();
    return storage.getAnnouncements().filter((a) => a.targetTeamIds?.includes(teamId));
  },

  saveAnnouncement: (announcement: Announcement): void => {
    const announcements = storage.getAnnouncements();
    const index = announcements.findIndex((a) => a.id === announcement.id);
    if (index >= 0) {
      announcements[index] = announcement;
    } else {
      announcements.push(announcement);
    }
    saveToStorage(KEYS.ANNOUNCEMENTS, announcements);
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================

  getNotifications: (userId: string): Notification[] => {
    return loadFromStorage<Notification[]>(KEYS.NOTIFICATIONS, []).filter(
      (n) => n.userId === userId
    );
  },

  getAllNotifications: (): Notification[] => {
    return loadFromStorage<Notification[]>(KEYS.NOTIFICATIONS, []);
  },

  saveNotification: (notification: Notification): void => {
    const notifications = storage.getAllNotifications();
    const index = notifications.findIndex((n) => n.id === notification.id);
    if (index >= 0) {
      notifications[index] = notification;
    } else {
      notifications.push(notification);
    }
    saveToStorage(KEYS.NOTIFICATIONS, notifications);
  },

  // ============================================
  // SCOUT REPORTS (existing)
  // ============================================

  getScoutReports: (): ScoutReport[] => {
    return loadFromStorage<ScoutReport[]>(KEYS.SCOUT_REPORTS, []);
  },

  getScoutReport: (id: string): ScoutReport | null => {
    const reports = storage.getScoutReports();
    return reports.find((r) => r.id === id) || null;
  },

  getScoutReportsByPlayer: (playerId: string): ScoutReport[] => {
    return storage.getScoutReports().filter((r) => r.playerId === playerId);
  },

  saveScoutReport: (report: ScoutReport): void => {
    const reports = storage.getScoutReports();
    const index = reports.findIndex((r) => r.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    saveToStorage(KEYS.SCOUT_REPORTS, reports);
  },

  // ============================================
  // FACILITIES & EQUIPMENT
  // ============================================

  getFacilities: (): Facility[] => {
    return loadFromStorage<Facility[]>(KEYS.FACILITIES, []);
  },

  saveFacility: (facility: Facility): void => {
    const facilities = storage.getFacilities();
    const index = facilities.findIndex((f) => f.id === facility.id);
    if (index >= 0) {
      facilities[index] = facility;
    } else {
      facilities.push(facility);
    }
    saveToStorage(KEYS.FACILITIES, facilities);
  },

  getEquipmentItems: (): Equipment[] => {
    return loadFromStorage<Equipment[]>(KEYS.EQUIPMENT, []);
  },

  saveEquipment: (equipment: Equipment): void => {
    const items = storage.getEquipmentItems();
    const index = items.findIndex((e) => e.id === equipment.id);
    if (index >= 0) {
      items[index] = equipment;
    } else {
      items.push(equipment);
    }
    saveToStorage(KEYS.EQUIPMENT, items);
  },

  // ============================================
  // DASHBOARD METRICS
  // ============================================

  getDashboardMetrics: (): DashboardMetrics => {
    const players = storage.getPlayers();
    const teams = storage.getTeams();
    const sessions = storage.getTrainingSessions();
    const matches = storage.getMatches();
    const attendance = storage.getAttendance();
    const feeRecords = storage.getFeeRecords();

    const totalPlayers = players.length;
    const activeTeams = teams.filter((t) => t.isActive).length;
    const upcomingMatches = matches.filter(
      (m) => m.status === 'Scheduled'
    ).length;
    
    // Calculate attendance rate
    let totalAttendanceChecks = 0;
    let presentCount = 0;
    attendance.forEach((a) => {
      totalAttendanceChecks++;
      if (a.status === 'Present') presentCount++;
    });
    const attendanceRate = totalAttendanceChecks > 0 ? Math.round((presentCount / totalAttendanceChecks) * 100) : 0;

    const developmentSessions = sessions.length;
    const pendingPayments = feeRecords.filter((f) => f.status === 'Pending' || f.status === 'Overdue').length;

    return {
      totalPlayers,
      activeTeams,
      upcomingMatches,
      pendingPayments,
      attendanceRate,
      developmentSessions,
    };
  },

  // ============================================
  // COACH DASHBOARD
  // ============================================

  getCoachDashboard: (coachId: string): CoachDashboardData => {
    const players = storage.getPlayers();
    const teams = storage.getTeams();
    const sessions = storage.getTrainingSessions();
    const matches = storage.getMatches();
    const reports = storage.getPlayerReports();
    const announcements = storage.getAnnouncements();

    const myTeams = teams.filter((t) => t.coachId === coachId);
    const allPlayers = players.filter((p) => p.teamId && myTeams.some((t) => t.id === p.teamId));
    const upcomingSessions = sessions.filter(
      (s) => s.teamId && myTeams.some((t) => t.id === s.teamId) && s.status === 'Scheduled'
    );
    const recentMatches = matches
      .filter((m) => m.status === 'Full Time')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const playerDevelopment = allPlayers.map((player) => {
      const playerReports = reports.filter((r) => r.playerId === player.id);
      const latestReport = playerReports.length > 0
        ? playerReports[playerReports.length - 1]
        : { ratings: { technical: 5, tactical: 5, physical: 5, psychological: 5, attitude: 5, overall: 5.0 }, strengths: [], weaknesses: [], developmentObjectives: [], observations: [], coachRecommendations: [] };

      const allAttendance = storage.getAttendanceByPlayer(player.id);
      const totalChecks = allAttendance.length;
      const presentCount = allAttendance.filter((a) => a.status === 'Present').length;
      const attendanceRate = totalChecks > 0 ? Math.round((presentCount / totalChecks) * 100) : 0;

      return {
        playerId: player.id,
        playerName: player.firstName + ' ' + player.lastName,
        teamName: player.teamName || '',
        recentRatings: latestReport.ratings,
        attendanceRate,
        sessionsThisMonth: 0,
        lastReportDate: latestReport.assessmentDate,
      };
    });

    return {
      myTeams,
      upcomingSessions,
      recentMatches,
      playerDevelopment,
      announcements,
    };
  },

  // ============================================
  // PARENT DASHBOARD
  // ============================================

  getParentDashboard: (parentId: string): ParentDashboardData => {
    const players = storage.getPlayers();
    const matches = storage.getMatches();
    const sessions = storage.getTrainingSessions();
    const subscriptions = storage.getSubscriptions();
    const payments = storage.getPayments();
    const notifications = storage.getNotifications(parentId);
    const announcements = storage.getAnnouncementsByRole('parent');
    const myChildren = storage.getPlayersByParent(parentId);

    const upcomingMatches = matches.filter(
      (m) => m.status === 'Scheduled'
    );

    const upcomingTraining = sessions.filter(
      (s) => s.teamId && myChildren.some((c) => c.teamId === s.teamId) && s.status === 'Scheduled'
    );

    const subscription = subscriptions.find(
      (s) => s.playerId && myChildren.some((c) => c.id === s.playerId)
    ) || null;

    const pendingPayments = payments.filter(
      (p) => p.status === 'Pending'
    );

    return {
      myChildren,
      upcomingMatches,
      upcomingTraining,
      subscription,
      pendingPayments,
      notifications,
      announcements,
    };
  },

  // ============================================
  // SUBSCRIPTIONS (mock - for compatibility)
  // ============================================

  getSubscriptions: (): Subscription[] => {
    return loadFromStorage<Subscription[]>(KEYS.SUBSCRIPTIONS, []);
  },

  getSubscriptionByPlayer: (playerId: string): Subscription | null => {
    return storage.getSubscriptions().find((s) => s.playerId === playerId) || null;
  },

  saveSubscription: (subscription: Subscription): void => {
    const subscriptions = storage.getSubscriptions();
    const index = subscriptions.findIndex((s) => s.id === subscription.id);
    if (index >= 0) {
      subscriptions[index] = subscription;
    } else {
      subscriptions.push(subscription);
    }
    saveToStorage(KEYS.SUBSCRIPTIONS, subscriptions);
  },

  // ============================================
  // PAYMENTS (mock - for compatibility)
  // ============================================

  getPayments: (): Payment[] => {
    return loadFromStorage<Payment[]>(KEYS.PAYMENTS, []);
  },

  getPendingPayments: (): Payment[] => {
    return storage.getPayments().filter((p) => p.status === 'Pending');
  },

  savePayment: (payment: Payment): void => {
    const payments = storage.getPayments();
    const index = payments.findIndex((p) => p.id === payment.id);
    if (index >= 0) {
      payments[index] = payment;
    } else {
      payments.push(payment);
    }
    saveToStorage(KEYS.PAYMENTS, payments);
  },
};

export default storage;