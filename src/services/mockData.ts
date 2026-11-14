/**
 * VK Football Academy - Mock Data Service
 * Temporary mock data for development before Supabase integration
 * All data follows the domain types defined in src/types/domain.ts
 */

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
  UserProfile,
  DashboardMetrics,
  CoachDashboardData,
  ParentDashboardData,
  Facility,
  Equipment,
} from '@/types/domain';

// ============================================
// MOCK USER PROFILES
// ============================================

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_001',
    email: 'admin@vkfootball.academy',
    fullName: 'Marcus Delgado',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1272a8e396?w=200&h=200&fit=crop',
    phone: '+44 7700 900123',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'usr_002',
    email: 'coach@vkfootball.academy',
    fullName: 'Elena Rossi',
    role: 'coach',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    phone: '+44 7700 900456',
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
  },
  {
    id: 'usr_003',
    email: 'parent@vkfootball.academy',
    fullName: 'Sarah Thompson',
    role: 'parent',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    phone: '+44 7700 900789',
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
  },
];

// ============================================
// MOCK TEAMS
// ============================================

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team_001',
    name: 'VK Academy U12 Elite',
    ageGroup: 'U12',
    category: 'Elite',
    coachId: 'usr_002',
    coachName: 'Elena Rossi',
    maxPlayers: 18,
    currentPlayers: 16,
    trainingDays: ['Monday', 'Wednesday', 'Friday'],
    season: '2024/25',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'team_002',
    name: 'VK Academy U14 Development',
    ageGroup: 'U14',
    category: 'Development',
    coachId: 'usr_002',
    coachName: 'Elena Rossi',
    maxPlayers: 20,
    currentPlayers: 18,
    trainingDays: ['Tuesday', 'Thursday', 'Saturday'],
    season: '2024/25',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'team_003',
    name: 'VK Academy U16 Elite',
    ageGroup: 'U16',
    category: 'Elite',
    coachId: 'usr_002',
    coachName: 'Elena Rossi',
    maxPlayers: 22,
    currentPlayers: 20,
    trainingDays: ['Monday', 'Wednesday', 'Friday'],
    season: '2024/25',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
  },
];

// ============================================
// MOCK PLAYERS
// ============================================

export const MOCK_PLAYERS: Player[] = [
  {
    id: 'ply_001',
    firstName: 'Luca',
    lastName: 'Moretti',
    dateOfBirth: '2012-05-14',
    ageGroup: 'U12',
    position: ['CAM', 'CM'],
    preferredFoot: 'Right',
    height: 152,
    weight: 42,
    teamId: 'team_001',
    teamName: 'VK Academy U12 Elite',
    parentIds: ['usr_003'],
    parentNames: ['Sarah Thompson'],
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Mother',
      phone: '+44 7700 900789',
      email: 'parent@vkfootball.academy',
    },
    joinDate: '2023-09-01',
    isActive: true,
    jerseyNumber: 10,
    photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop',
  },
  {
    id: 'ply_002',
    firstName: 'Mateo',
    lastName: 'Silva',
    dateOfBirth: '2012-08-22',
    ageGroup: 'U12',
    position: ['LW', 'RW'],
    preferredFoot: 'Left',
    height: 148,
    weight: 39,
    teamId: 'team_001',
    teamName: 'VK Academy U12 Elite',
    parentIds: ['usr_003'],
    parentNames: ['Sarah Thompson'],
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Mother',
      phone: '+44 7700 900789',
      email: 'parent@vkfootball.academy',
    },
    joinDate: '2023-09-01',
    isActive: true,
    jerseyNumber: 7,
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop',
  },
  {
    id: 'ply_003',
    firstName: 'Omar',
    lastName: 'Benali',
    dateOfBirth: '2010-03-10',
    ageGroup: 'U14',
    position: ['CB', 'CDM'],
    preferredFoot: 'Right',
    height: 172,
    weight: 58,
    teamId: 'team_002',
    teamName: 'VK Academy U14 Development',
    parentIds: ['usr_003'],
    parentNames: ['Sarah Thompson'],
    emergencyContact: {
      name: 'Sarah Thompson',
      relationship: 'Mother',
      phone: '+44 7700 900789',
      email: 'parent@vkfootball.academy',
    },
    joinDate: '2023-09-01',
    isActive: true,
    jerseyNumber: 4,
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  },
];

// ============================================
// MOCK MATCHES
// ============================================

export const MOCK_MATCHES: Match[] = [
  {
    id: 'match_001',
    homeTeamId: 'team_001',
    homeTeamName: 'VK Academy U12 Elite',
    awayTeamId: 'team_002',
    awayTeamName: 'VK Academy U14 Development',
    date: '2024-12-15',
    kickoffTime: '14:00',
    venue: 'VK Training Ground - Pitch A',
    competition: 'Academy Internal',
    matchType: 'Academy Internal',
    status: 'Scheduled',
    referee: 'J. Müller',
    weather: 'Clear, 12°C',
  },
  {
    id: 'match_002',
    homeTeamId: 'team_001',
    homeTeamName: 'VK Academy U12 Elite',
    awayTeamId: 'team_003',
    awayTeamName: 'VK Academy U16 Elite',
    date: '2024-12-08',
    kickoffTime: '11:00',
    venue: 'VK Training Ground - Pitch B',
    competition: 'Academy Internal',
    matchType: 'Academy Internal',
    status: 'Full Time',
    homeScore: 3,
    awayScore: 1,
    halfTimeHomeScore: 1,
    halfTimeAwayScore: 0,
    referee: 'A. Petrov',
    weather: 'Overcast, 8°C',
    events: [
      {
        id: 'evt_001',
        matchId: 'match_002',
        minute: 12,
        type: 'Goal',
        playerId: 'ply_001',
        playerName: 'Luca Moretti',
        teamId: 'team_001',
        teamName: 'VK Academy U12 Elite',
        description: 'Luca Moretti scores with a curling shot from outside the box',
      },
      {
        id: 'evt_002',
        matchId: 'match_002',
        minute: 34,
        type: 'Goal',
        playerId: 'ply_002',
        playerName: 'Mateo Silva',
        teamId: 'team_001',
        teamName: 'VK Academy U12 Elite',
        description: 'Mateo Silva finishes a quick counter-attack',
      },
      {
        id: 'evt_003',
        matchId: 'match_002',
        minute: 67,
        type: 'Goal',
        playerId: 'ply_001',
        playerName: 'Luca Moretti',
        teamId: 'team_001',
        teamName: 'VK Academy U12 Elite',
        description: 'Luca Moretti completes his brace with a header',
      },
    ],
  },
];

// ============================================
// MOCK TRAINING SESSIONS
// ============================================

export const MOCK_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'session_001',
    teamId: 'team_001',
    teamName: 'VK Academy U12 Elite',
    date: '2024-12-16',
    startTime: '17:00',
    endTime: '18:30',
    location: 'Pitch A',
    type: 'Technical',
    status: 'Scheduled',
    notes: 'Focus on passing accuracy and first touch under pressure',
  },
  {
    id: 'session_002',
    teamId: 'team_001',
    teamName: 'VK Academy U12 Elite',
    date: '2024-12-18',
    startTime: '17:00',
    endTime: '18:30',
    location: 'Pitch B',
    type: 'Tactical',
    status: 'Scheduled',
    notes: 'Defensive shape and pressing triggers',
  },
  {
    id: 'session_003',
    teamId: 'team_002',
    teamName: 'VK Academy U14 Development',
    date: '2024-12-17',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Pitch A',
    type: 'Physical',
    status: 'Scheduled',
    notes: 'Agility circuit and sprint intervals',
  },
];

// ============================================
// MOCK SCOUT REPORTS
// ============================================

export const MOCK_SCOUT_REPORTS: ScoutReport[] = [
  {
    id: 'report_001',
    playerId: 'ply_001',
    playerName: 'Luca Moretti',
    scoutId: 'usr_002',
    scoutName: 'Elena Rossi',
    date: '2024-11-20',
    matchId: 'match_002',
    ratings: {
      technical: 8,
      tactical: 7,
      physical: 6,
      psychological: 8,
      potential: 9,
      overall: 7.6,
    },
    strengths: [
      'Excellent vision and passing range',
      'Composed under pressure',
      'Strong work rate',
    ],
    areasForImprovement: [
      'Defensive contribution',
      'Aerial duels',
      'Consistency in final third',
    ],
    overallRecommendation: 'Develop',
    notes: 'Shows great promise as a creative midfielder. Needs to improve defensive work rate.',
    isConfidential: true,
  },
];

// ============================================
// MOCK SUBSCRIPTIONS & PAYMENTS
// ============================================

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_001',
    playerId: 'ply_001',
    playerName: 'Luca Moretti',
    parentId: 'usr_003',
    tier: 'Elite',
    status: 'Active',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    autoRenew: true,
    monthlyFee: 180,
    currency: 'EUR',
    benefits: [
      { id: 'ben_1', name: 'Elite Training Sessions', description: '3x weekly elite coaching', included: true },
      { id: 'ben_2', name: 'Match Fixtures', description: 'Competitive league matches', included: true },
      { id: 'ben_3', name: 'Scout Reports', description: 'Monthly development reports', included: true },
      { id: 'ben_4', name: 'Gym Access', description: 'Strength and conditioning', included: false },
    ],
  },
  {
    id: 'sub_002',
    playerId: 'ply_003',
    playerName: 'Omar Benali',
    parentId: 'usr_003',
    tier: 'Development',
    status: 'Active',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    autoRenew: true,
    monthlyFee: 140,
    currency: 'EUR',
    benefits: [
      { id: 'ben_1', name: 'Development Training', description: '2x weekly development coaching', included: true },
      { id: 'ben_2', name: 'Match Fixtures', description: 'Friendly matches', included: true },
      { id: 'ben_3', name: 'Scout Reports', description: 'Quarterly development reports', included: true },
      { id: 'ben_4', name: 'Gym Access', description: 'Strength and conditioning', included: false },
    ],
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_001',
    subscriptionId: 'sub_001',
    playerId: 'ply_001',
    playerName: 'Luca Moretti',
    parentId: 'usr_003',
    amount: 180,
    currency: 'EUR',
    status: 'Paid',
    date: '2024-12-01',
    dueDate: '2024-12-01',
    method: 'Direct Debit',
    transactionId: 'txn_abc123',
    description: 'Monthly Elite Subscription - December 2024',
  },
  {
    id: 'pay_002',
    subscriptionId: 'sub_002',
    playerId: 'ply_003',
    playerName: 'Omar Benali',
    parentId: 'usr_003',
    amount: 140,
    currency: 'EUR',
    status: 'Pending',
    date: '2024-12-01',
    dueDate: '2024-12-05',
    method: 'Direct Debit',
    description: 'Monthly Development Subscription - December 2024',
  },
];

// ============================================
// MOCK ANNOUNCEMENTS & NOTIFICATIONS
// ============================================

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_001',
    title: 'Winter Training Schedule Update',
    content: 'Due to the holiday period, training sessions will be adjusted from December 23rd to January 5th. Please check your team schedule for updated times.',
    authorId: 'usr_001',
    authorName: 'Marcus Delgado',
    authorRole: 'admin',
    targetRoles: ['parent', 'player'],
    priority: 'Normal',
    publishedAt: '2024-12-01T09:00:00Z',
    expiresAt: '2025-01-10T00:00:00Z',
  },
  {
    id: 'ann_002',
    title: 'New Elite Pathway Program Launch',
    content: 'We are excited to announce the launch of our Pro Pathway program for U16-U19 players. Trials will be held on January 15th.',
    authorId: 'usr_001',
    authorName: 'Marcus Delgado',
    authorRole: 'admin',
    targetRoles: ['parent', 'player'],
    priority: 'High',
    publishedAt: '2024-11-25T10:00:00Z',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_001',
    userId: 'usr_003',
    title: 'Match Reminder: U12 Elite vs U14 Development',
    message: 'Luca has a match scheduled for Sunday, December 15th at 14:00. Please arrive 45 minutes before kickoff.',
    type: 'Match',
    channel: 'In-App',
    read: false,
    actionUrl: '/parent/matches',
    actionLabel: 'View Match',
    createdAt: '2024-12-10T08:00:00Z',
  },
  {
    id: 'not_002',
    userId: 'usr_003',
    title: 'Payment Due: Development Subscription',
    message: 'Your December payment of €140 for Omar\'s Development subscription is now due.',
    type: 'Payment',
    channel: 'In-App',
    read: false,
    actionUrl: '/parent/payments',
    actionLabel: 'Pay Now',
    createdAt: '2024-12-01T09:00:00Z',
  },
];

// ============================================
// MOCK DASHBOARD DATA
// ============================================

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  totalPlayers: 142,
  activeTeams: 12,
  upcomingMatches: 8,
  pendingPayments: 23,
  attendanceRate: 94,
  developmentSessions: 45,
};

export const MOCK_COACH_DASHBOARD: CoachDashboardData = {
  myTeams: MOCK_TEAMS,
  upcomingSessions: MOCK_TRAINING_SESSIONS,
  recentMatches: MOCK_MATCHES,
  playerDevelopment: [
    {
      playerId: 'ply_001',
      playerName: 'Luca Moretti',
      teamName: 'VK Academy U12 Elite',
      recentRatings: MOCK_SCOUT_REPORTS[0].ratings,
      attendanceRate: 96,
      sessionsThisMonth: 12,
      lastReportDate: '2024-11-20',
    },
    {
      playerId: 'ply_002',
      playerName: 'Mateo Silva',
      teamName: 'VK Academy U12 Elite',
      recentRatings: {
        technical: 7,
        tactical: 6,
        physical: 7,
        psychological: 7,
        potential: 8,
        overall: 7.0,
      },
      attendanceRate: 92,
      sessionsThisMonth: 11,
    },
  ],
  announcements: MOCK_ANNOUNCEMENTS,
};

export const MOCK_PARENT_DASHBOARD: ParentDashboardData = {
  myChildren: MOCK_PLAYERS,
  upcomingMatches: MOCK_MATCHES,
  upcomingTraining: MOCK_TRAINING_SESSIONS,
  subscription: MOCK_SUBSCRIPTIONS[0],
  pendingPayments: MOCK_PAYMENTS.filter(p => p.status === 'Pending'),
  notifications: MOCK_NOTIFICATIONS,
  announcements: MOCK_ANNOUNCEMENTS,
};

// ============================================
// MOCK FACILITIES & EQUIPMENT
// ============================================

export const MOCK_FACILITIES: Facility[] = [
  {
    id: 'fac_001',
    name: 'Pitch A - Main',
    type: 'Pitch',
    capacity: 22,
    location: 'North Stand',
    features: ['Floodlit', 'Natural Grass', 'VAR Ready', 'Covered Seating'],
    isActive: true,
  },
  {
    id: 'fac_002',
    name: 'Pitch B - Development',
    type: 'Pitch',
    capacity: 22,
    location: 'South Stand',
    features: ['Floodlit', 'Artificial Turf', 'Training Goals'],
    isActive: true,
  },
  {
    id: 'fac_003',
    name: 'Strength & Conditioning Gym',
    type: 'Gym',
    capacity: 15,
    location: 'Main Building - Floor 1',
    features: ['Weight Racks', 'Cardio Zone', 'Recovery Area'],
    isActive: true,
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq_001',
    name: 'Adidas Match Ball Pro',
    category: 'Training',
    quantity: 24,
    condition: 'Good',
    location: 'Equipment Room A',
    lastInspection: '2024-11-01',
    nextInspection: '2025-02-01',
  },
  {
    id: 'eq_002',
    name: 'Training Cones Set',
    category: 'Training',
    quantity: 100,
    condition: 'New',
    location: 'Equipment Room B',
    lastInspection: '2024-12-01',
    nextInspection: '2025-03-01',
  },
];

// ============================================
// MOCK DATA SERVICE (simulates API)
// ============================================

export const mockDataService = {
  // Teams
  getTeams: () => Promise.resolve(MOCK_TEAMS),
  getTeamById: (id: string) => Promise.resolve(MOCK_TEAMS.find(t => t.id === id) || null),

  // Players
  getPlayers: () => Promise.resolve(MOCK_PLAYERS),
  getPlayerById: (id: string) => Promise.resolve(MOCK_PLAYERS.find(p => p.id === id) || null),
  getPlayersByTeam: (teamId: string) => Promise.resolve(MOCK_PLAYERS.filter(p => p.teamId === teamId)),

  // Matches
  getMatches: () => Promise.resolve(MOCK_MATCHES),
  getMatchById: (id: string) => Promise.resolve(MOCK_MATCHES.find(m => m.id === id) || null),
  getUpcomingMatches: () => Promise.resolve(MOCK_MATCHES.filter(m => m.status === 'Scheduled')),

  // Training Sessions
  getTrainingSessions: () => Promise.resolve(MOCK_TRAINING_SESSIONS),
  getSessionsByTeam: (teamId: string) => Promise.resolve(MOCK_TRAINING_SESSIONS.filter(s => s.teamId === teamId)),

  // Scout Reports
  getScoutReports: () => Promise.resolve(MOCK_SCOUT_REPORTS),
  getScoutReportsByPlayer: (playerId: string) => Promise.resolve(MOCK_SCOUT_REPORTS.filter(r => r.playerId === playerId)),

  // Subscriptions & Payments
  getSubscriptions: () => Promise.resolve(MOCK_SUBSCRIPTIONS),
  getSubscriptionByPlayer: (playerId: string) => Promise.resolve(MOCK_SUBSCRIPTIONS.find(s => s.playerId === playerId) || null),
  getPayments: () => Promise.resolve(MOCK_PAYMENTS),
  getPendingPayments: () => Promise.resolve(MOCK_PAYMENTS.filter(p => p.status === 'Pending')),

  // Announcements & Notifications
  getAnnouncements: () => Promise.resolve(MOCK_ANNOUNCEMENTS),
  getNotifications: (userId: string) => Promise.resolve(MOCK_NOTIFICATIONS.filter(n => n.userId === userId)),

  // Dashboard
  getDashboardMetrics: () => Promise.resolve(MOCK_DASHBOARD_METRICS),
  getCoachDashboard: () => Promise.resolve(MOCK_COACH_DASHBOARD),
  getParentDashboard: () => Promise.resolve(MOCK_PARENT_DASHBOARD),

  // Facilities & Equipment
  getFacilities: () => Promise.resolve(MOCK_FACILITIES),
  getEquipment: () => Promise.resolve(MOCK_EQUIPMENT),
};