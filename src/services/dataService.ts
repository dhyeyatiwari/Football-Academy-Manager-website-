/**
 * VK Football Academy - Data Service
 * 
 * Wraps the storage layer to provide the same API as mockDataService.
 * This allows components to work with either localStorage or Supabase
 * without changing component code.
 */

import { storage } from '@/lib/data/storage';
import type {
  Team,
  Player,
  Match,
  TrainingSession,
  ScoutReport,
  Subscription,
  Payment,
  Announcement,
  Notification,
  DashboardMetrics,
  CoachDashboardData,
  ParentDashboardData,
  Facility,
  Equipment,
  SessionPlan,
  AttendanceRecord,
  PlayerReport,
  SessionObservation,
  FeeRecord,
  Parent,
  Coach,
  UserProfile,
} from '@/types/domain';

export const dataService = {
  // ============================================
  // USERS
  // ============================================

  getUsers: (): UserProfile[] => storage.getUsers(),
  getUser: (id: string): UserProfile | null => storage.getUser(id),
  saveUser: (user: UserProfile): void => storage.saveUser(user),

  // ============================================
  // TEAMS
  // ============================================

  getTeams: (): Team[] => storage.getTeams(),
  getTeamById: (id: string): Team | null => storage.getTeam(id),
  saveTeam: (team: Team): void => storage.saveTeam(team),
  getTeamsByCoach: (coachId: string): Team[] => storage.getTeamsByCoach(coachId),
  getTeamsByAgeGroup: (ageGroup: string): Team[] => storage.getTeamsByAgeGroup(ageGroup as any),

  // ============================================
  // PLAYERS
  // ============================================

  getPlayers: (): Player[] => storage.getPlayers(),
  getPlayerById: (id: string): Player | null => storage.getPlayer(id),
  getPlayersByTeam: (teamId: string): Player[] => storage.getPlayersByTeam(teamId),
  getPlayersByParent: (parentId: string): Player[] => storage.getPlayersByParent(parentId),
  savePlayer: (player: Player): void => storage.savePlayer(player),

  // ============================================
  // MATCHES
  // ============================================

  getMatches: (): Match[] => storage.getMatches(),
  getMatchById: (id: string): Match | null => storage.getMatch(id),
  getUpcomingMatches: (): Match[] => storage.getUpcomingMatches(),
  saveMatch: (match: Match): void => storage.saveMatch(match),

  // ============================================
  // TRAINING SESSIONS
  // ============================================

  getTrainingSessions: (): TrainingSession[] => storage.getTrainingSessions(),
  getSessionById: (id: string): TrainingSession | null => storage.getSession(id),
  getSessionsByTeam: (teamId: string): TrainingSession[] => storage.getSessionsByTeam(teamId),
  saveTrainingSession: (session: TrainingSession): void => storage.saveTrainingSession(session),

  // ============================================
  // SESSION PLANS
  // ============================================

  getSessionPlans: (): SessionPlan[] => storage.getSessionPlans(),
  getSessionPlanById: (id: string): SessionPlan | null => storage.getSessionPlan(id),
  getSessionPlansByTeam: (teamId: string): SessionPlan[] => storage.getSessionPlansByTeam(teamId),
  getSessionPlansBySession: (sessionId: string): SessionPlan[] => storage.getSessionPlansBySession(sessionId),
  saveSessionPlan: (plan: SessionPlan): void => storage.saveSessionPlan(plan),

  // ============================================
  // ATTENDANCE
  // ============================================

  getAttendance: (): AttendanceRecord[] => storage.getAttendance(),
  getAttendanceBySession: (sessionId: string): AttendanceRecord[] => storage.getAttendanceBySession(sessionId),
  getAttendanceByPlayer: (playerId: string): AttendanceRecord[] => storage.getAttendanceByPlayer(playerId),
  saveAttendance: (attendance: AttendanceRecord): void => storage.saveAttendance(attendance),

  // ============================================
  // PLAYER REPORTS
  // ============================================

  getPlayerReports: (): PlayerReport[] => storage.getPlayerReports(),
  getPlayerReportById: (id: string): PlayerReport | null => storage.getPlayerReport(id),
  getPlayerReportsByPlayer: (playerId: string): PlayerReport[] => storage.getPlayerReportsByPlayer(playerId),
  getPlayerReportsByCoach: (coachId: string): PlayerReport[] => storage.getPlayerReportsByCoach(coachId),
  savePlayerReport: (report: PlayerReport): void => storage.savePlayerReport(report),

  // ============================================
  // SESSION OBSERVATIONS
  // ============================================

  getSessionObservations: (): SessionObservation[] => storage.getSessionObservations(),
  getSessionObservationsBySession: (sessionId: string): SessionObservation[] => storage.getSessionObservationsBySession(sessionId),
  getSessionObservationsByPlayer: (playerId: string): SessionObservation[] => storage.getSessionObservationsByPlayer(playerId),
  saveSessionObservation: (observation: SessionObservation): void => storage.saveSessionObservation(observation),

  // ============================================
  // FEE RECORDS
  // ============================================

  getFeeRecords: (): FeeRecord[] => storage.getFeeRecords(),
  getFeeRecordsByPlayer: (playerId: string): FeeRecord[] => storage.getFeeRecordsByPlayer(playerId),
  getFeeRecordsByStatus: (status: FeeRecord['status']): FeeRecord[] => storage.getFeeRecordsByStatus(status),
  saveFeeRecord: (record: FeeRecord): void => storage.saveFeeRecord(record),

  // ============================================
  // PARENTS
  // ============================================

  getParents: (): Parent[] => storage.getParents(),
  getParentById: (id: string): Parent | null => storage.getParent(id),
  getParentByUserId: (userId: string): Parent | null => storage.getParentByUserId(userId),
  saveParent: (parent: Parent): void => storage.saveParent(parent),

  // ============================================
  // COACHES
  // ============================================

  getCoaches: (): Coach[] => storage.getCoaches(),
  getCoachById: (id: string): Coach | null => storage.getCoach(id),
  getCoachByUserId: (userId: string): Coach | null => storage.getCoachByUserId(userId),
  getCoachesByTeam: (teamId: string): Coach[] => storage.getCoachesByTeam(teamId),
  saveCoach: (coach: Coach): void => storage.saveCoach(coach),

  // ============================================
  // SCOUT REPORTS
  // ============================================

  getScoutReports: (): ScoutReport[] => storage.getScoutReports(),
  getScoutReportById: (id: string): ScoutReport | null => storage.getScoutReport(id),
  getScoutReportsByPlayer: (playerId: string): ScoutReport[] => storage.getScoutReportsByPlayer(playerId),
  saveScoutReport: (report: ScoutReport): void => storage.saveScoutReport(report),

  // ============================================
  // SUBSCRIPTIONS & PAYMENTS
  // ============================================

  getSubscriptions: (): Subscription[] => storage.getSubscriptions(),
  getSubscriptionByPlayer: (playerId: string): Subscription | null => storage.getSubscriptionByPlayer(playerId),
  saveSubscription: (subscription: Subscription): void => storage.saveSubscription(subscription),

  getPayments: (): Payment[] => storage.getPayments(),
  getPendingPayments: (): Payment[] => storage.getPendingPayments(),
  savePayment: (payment: Payment): void => storage.savePayment(payment),

  // ============================================
  // ANNOUNCEMENTS & NOTIFICATIONS
  // ============================================

  getAnnouncements: (): Announcement[] => storage.getAnnouncements(),
  getAnnouncementById: (id: string): Announcement | null => storage.getAnnouncement(id),
  getAnnouncementsByRole: (role: string): Announcement[] => storage.getAnnouncementsByRole(role as any),
  getAnnouncementsByTeam: (teamId?: string): Announcement[] => storage.getAnnouncementsByTeam(teamId),
  saveAnnouncement: (announcement: Announcement): void => storage.saveAnnouncement(announcement),

  getNotifications: (userId: string): Notification[] => storage.getNotifications(userId),
  getAllNotifications: (): Notification[] => storage.getAllNotifications(),
  saveNotification: (notification: Notification): void => storage.saveNotification(notification),

  // ============================================
  // FACILITIES & EQUIPMENT
  // ============================================

  getFacilities: (): Facility[] => storage.getFacilities(),
  saveFacility: (facility: Facility): void => storage.saveFacility(facility),

  getEquipment: (): Equipment[] => storage.getEquipmentItems(),
  saveEquipment: (equipment: Equipment): void => storage.saveEquipment(equipment),

  // ============================================
  // DASHBOARDS
  // ============================================

  getDashboardMetrics: (): DashboardMetrics => storage.getDashboardMetrics(),
  getCoachDashboard: (coachId: string): CoachDashboardData => storage.getCoachDashboard(coachId),
  getParentDashboard: (parentId: string): ParentDashboardData => storage.getParentDashboard(parentId),
};

export default dataService;