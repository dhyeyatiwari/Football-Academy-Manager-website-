/**
 * VK Football Academy - Domain Types
 * Core type definitions for the academy management platform
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export type UserRole = 'admin' | 'coach' | 'parent' | 'player' | 'public';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: unknown | null;
  loading: boolean;
}

// ============================================
// ACADEMY STRUCTURE
// ============================================

export type AgeGroup = 'U6' | 'U7' | 'U8' | 'U9' | 'U10' | 'U11' | 'U12' | 'U13' | 'U14' | 'U15' | 'U16' | 'U17' | 'U18' | 'U19' | 'U21' | 'Senior';

export type TeamCategory = 'Academy' | 'Development' | 'Elite' | 'Pro Pathway';

export interface Team {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  category: TeamCategory;
  coachId: string;
  coachName: string;
  maxPlayers: number;
  currentPlayers: number;
  trainingDays: TrainingDay[];
  season: string;
  isActive: boolean;
  createdAt: string;
}

export type TrainingDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TrainingSession {
  id: string;
  teamId: string;
  teamName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'Technical' | 'Tactical' | 'Physical' | 'Match Prep' | 'Recovery' | 'Video Analysis';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  attendance?: AttendanceRecord[];
}

export interface AttendanceRecord {
  playerId: string;
  playerName: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  checkInTime?: string;
}

// ============================================
// PLAYER & DEVELOPMENT
// ============================================

export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';

export interface Player {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ageGroup: AgeGroup;
  position: PlayerPosition[];
  preferredFoot: 'Left' | 'Right' | 'Both';
  height?: number; // cm
  weight?: number; // kg
  teamId?: string;
  teamName?: string;
  parentIds: string[];
  parentNames: string[];
  emergencyContact: EmergencyContact;
  medicalInfo?: MedicalInfo;
  joinDate: string;
  isActive: boolean;
  jerseyNumber?: number;
  photoUrl?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalInfo {
  allergies?: string;
  conditions?: string;
  medications?: string;
  doctorName?: string;
  doctorPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface ScoutReport {
  id: string;
  playerId: string;
  playerName: string;
  scoutId: string;
  scoutName: string;
  date: string;
  matchId?: string;
  ratings: ScoutRatings;
  strengths: string[];
  areasForImprovement: string[];
  overallRecommendation: 'Sign' | 'Monitor' | 'Develop' | 'Release';
  notes: string;
  isConfidential: boolean;
}

export interface ScoutRatings {
  technical: number; // 1-10
  tactical: number;
  physical: number;
  psychological: number;
  potential: number;
  overall: number;
}

// ============================================
// MATCHES & FIXTURES
// ============================================

export type MatchStatus = 'Scheduled' | 'Live' | 'Half Time' | 'Full Time' | 'Postponed' | 'Cancelled';
export type MatchType = 'League' | 'Cup' | 'Friendly' | 'Tournament' | 'Academy Internal';

export interface Match {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  date: string;
  kickoffTime: string;
  venue: string;
  competition: string;
  matchType: MatchType;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  halfTimeHomeScore?: number;
  halfTimeAwayScore?: number;
  referee?: string;
  weather?: string;
  attendance?: number;
  events?: MatchEvent[];
  lineups?: MatchLineup;
  stats?: MatchStats;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  type: 'Goal' | 'Assist' | 'Yellow Card' | 'Red Card' | 'Substitution In' | 'Substitution Out' | 'Injury' | 'VAR';
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  description: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
}

export interface MatchLineup {
  home: LineupPlayer[];
  away: LineupPlayer[];
}

export interface LineupPlayer {
  playerId: string;
  playerName: string;
  position: PlayerPosition;
  jerseyNumber: number;
  isStarter: boolean;
  isCaptain: boolean;
  substitutedAt?: number;
  substitutedBy?: string;
}

export interface MatchStats {
  home: TeamMatchStats;
  away: TeamMatchStats;
}

export interface TeamMatchStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  passes: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  saves: number;
}

// ============================================
// SUBSCRIPTIONS & PAYMENTS
// ============================================

export type SubscriptionTier = 'Foundation' | 'Development' | 'Elite' | 'Pro Pathway';
export type SubscriptionStatus = 'Active' | 'Pending' | 'Paused' | 'Cancelled' | 'Expired' | 'Overdue';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Overdue';

export interface Subscription {
  id: string;
  playerId: string;
  playerName: string;
  parentId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  monthlyFee: number;
  currency: 'EUR' | 'GBP' | 'USD';
  paymentMethodId?: string;
  benefits: SubscriptionBenefit[];
}

export interface SubscriptionBenefit {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  playerId: string;
  playerName: string;
  parentId: string;
  amount: number;
  currency: 'EUR' | 'GBP' | 'USD';
  status: PaymentStatus;
  date: string;
  dueDate: string;
  method: 'Card' | 'Bank Transfer' | 'Direct Debit' | 'Cash';
  transactionId?: string;
  invoiceUrl?: string;
  description: string;
}

// ============================================
// COMMUNICATIONS & NOTIFICATIONS
// ============================================

export type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error' | 'Match' | 'Training' | 'Payment' | 'Development';
export type NotificationChannel = 'In-App' | 'Email' | 'SMS' | 'Push';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetRoles: UserRole[];
  targetTeamIds?: string[];
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  publishedAt: string;
  expiresAt?: string;
  attachments?: AnnouncementAttachment[];
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
}

// ============================================
// FACILITIES & EQUIPMENT
// ============================================

export interface Facility {
  id: string;
  name: string;
  type: 'Pitch' | 'Gym' | 'Classroom' | 'Medical' | 'Office' | 'Changing Room';
  capacity: number;
  location: string;
  features: string[];
  isActive: boolean;
  maintenanceSchedule?: MaintenanceSchedule[];
}

export interface MaintenanceSchedule {
  id: string;
  facilityId: string;
  date: string;
  description: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Training' | 'Medical' | 'Video' | 'Gym' | 'Pitch' | 'Office';
  quantity: number;
  condition: 'New' | 'Good' | 'Fair' | 'Needs Repair' | 'Retired';
  location: string;
  lastInspection: string;
  nextInspection: string;
  assignedTo?: string;
}

// ============================================
// DASHBOARD & ANALYTICS
// ============================================

export interface DashboardMetrics {
  totalPlayers: number;
  activeTeams: number;
  upcomingMatches: number;
  pendingPayments: number;
  attendanceRate: number;
  developmentSessions: number;
}

export interface CoachDashboardData {
  myTeams: Team[];
  upcomingSessions: TrainingSession[];
  recentMatches: Match[];
  playerDevelopment: PlayerDevelopmentSummary[];
  announcements: Announcement[];
}

export interface ParentDashboardData {
  myChildren: Player[];
  upcomingMatches: Match[];
  upcomingTraining: TrainingSession[];
  subscription: Subscription | null;
  pendingPayments: Payment[];
  notifications: Notification[];
  announcements: Announcement[];
}

export interface PlayerDevelopmentSummary {
  playerId: string;
  playerName: string;
  teamName: string;
  recentRatings: ScoutRatings;
  attendanceRate: number;
  sessionsThisMonth: number;
  lastReportDate?: string;
}

// ============================================
// SESSION PLANS
// ============================================

export type SessionPlanCategory =
  | 'Technical'
  | 'Tactical'
  | 'Physical'
  | 'Goalkeeping'
  | 'Match Prep'
  | 'Recovery'
  | 'Video Analysis';

export interface SessionPlan {
  id: string;
  trainingSessionId: string;
  coachId: string;
  coachName: string;
  teamId: string;
  teamName: string;
  title: string;
  description?: string;
  category: SessionPlanCategory;
  objectives?: string[];
  warmUp?: string[];
  technicalDrills?: string[];
  tacticalActivities?: string[];
  smallSidedGames?: string[];
  physicalConditioning?: string[];
  coolDown?: string[];
  equipmentRequired?: string[];
  coachingPoints?: string[];
  totalDuration?: number; // minutes
  postSessionObservations?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'docx' | 'image' | 'structured';
  fileSize?: number;
  aiSummary?: string;
  aiExtractedDrills?: string[];
  aiDrillDurations?: Record<string, number>;
  aiCoachingPoints?: string[];
  aiSuggestions?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ATTENDANCE
// ============================================

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface Attendance {
  id: string;
  trainingSessionId: string;
  playerId: string;
  playerName: string;
  status: AttendanceStatus;
  checkInTime?: string;
  markedBy: string;
  markedByName: string;
  markedAt: string;
  notes?: string;
}

// ============================================
// PLAYER DEVELOPMENT REPORTS
// ============================================

export type DevelopmentArea = 'Technical' | 'Tactical' | 'Physical' | 'Psychological' | 'Attitude' | 'Overall';

export interface PlayerReport {
  id: string;
  playerId: string;
  playerName: string;
  coachId: string;
  coachName: string;
  teamId: string;
  teamName: string;
  assessmentDate: string;
  ratings: {
    technical: number; // 1-10
    tactical: number;
    physical: number;
    psychological: number;
    attitude: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  developmentObjectives: string[];
  observations: string[];
  coachRecommendations: string[];
  previousReportId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SESSION OBSERVATIONS
// ============================================

export interface SessionObservation {
  id: string;
  trainingSessionId: string;
  sessionPlanId?: string;
  coachId: string;
  coachName: string;
  teamId: string;
  playerId?: string;
  playerName?: string;
  observationType: 'Planned vs Actual' | 'Player Performance' | 'Team Performance' | 'General';
  content: string;
  rating?: number; // 1-10
  createdAt: string;
}

// ============================================
// FEE RECORDS
// ============================================

export type FeeStatus = 'Paid' | 'Pending' | 'Overdue' | 'Refunded';

export interface FeeRecord {
  id: string;
  playerId: string;
  playerName: string;
  parentId: string;
  parentName: string;
  amount: number;
  currency: 'EUR' | 'GBP' | 'USD';
  status: FeeStatus;
  dueDate: string;
  paidDate?: string;
  method?: 'Card' | 'Bank Transfer' | 'Direct Debit' | 'Cash';
  transactionId?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PARENTS & COACHES (extended profiles)
// ============================================

export interface Parent {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  childIds: string[];
  childNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  licenseLevel?: 'UEFA Pro' | 'UEFA A' | 'UEFA B' | 'UEFA C' | 'FA Level 1' | 'FA Level 2' | 'Other';
  teamIds: string[];
  teamNames: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: ResponseMeta;
}

// ============================================
// FORM TYPES
// ============================================

export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface PlayerForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  ageGroup: AgeGroup;
  position: PlayerPosition[];
  preferredFoot: 'Left' | 'Right' | 'Both';
  height?: number;
  weight?: number;
  emergencyContact: EmergencyContact;
  medicalInfo?: MedicalInfo;
}

export interface TeamForm {
  name: string;
  ageGroup: AgeGroup;
  category: TeamCategory;
  coachId: string;
  maxPlayers: number;
  trainingDays: TrainingDay[];
  season: string;
}

export interface MatchForm {
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  kickoffTime: string;
  venue: string;
  competition: string;
  matchType: MatchType;
}

export interface TrainingSessionForm {
  teamId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: TrainingSession['type'];
  notes?: string;
}