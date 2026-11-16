/**
 * VK Football Academy - Seed Data
 * 
 * Initializes localStorage with data from mockData.ts.
 * Run this once to populate the database with sample data.
 */

import { storage } from '@/lib/data/storage';
import {
  MOCK_USERS,
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_MATCHES,
  MOCK_TRAINING_SESSIONS,
  MOCK_SCOUT_REPORTS,
  MOCK_SUBSCRIPTIONS,
  MOCK_PAYMENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_NOTIFICATIONS,
} from '@/services/mockData';
import type { Parent, Coach } from '@/types/domain';

const mockParents: Parent[] = [
  {
    id: 'parent_001',
    userId: 'usr_003',
    fullName: 'Sarah Thompson',
    email: 'parent@vkfootball.academy',
    phone: '+44 7700 900789',
    childIds: ['ply_001', 'ply_002', 'ply_003'],
    childNames: ['Luca Moretti', 'Mateo Silva', 'Omar Benali'],
    createdAt: '2024-02-01T10:15:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
  },
];

const mockCoaches: Coach[] = [
  {
    id: 'usr_002',
    userId: 'usr_002',
    fullName: 'Elena Rossi',
    email: 'coach@vkfootball.academy',
    phone: '+44 7700 900456',
    licenseLevel: 'UEFA Pro',
    teamIds: ['team_001', 'team_002', 'team_003'],
    teamNames: ['VK Academy U12 Elite', 'VK Academy U14 Development', 'VK Academy U16 Elite'],
    createdAt: '2024-01-20T09:30:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
  },
];

export function seedDatabase() {
  // Only seed if not already seeded
  if (storage.getUsers().length > 0) {
    return;
  }

  MOCK_USERS.forEach((user) => storage.saveUser(user));
  MOCK_TEAMS.forEach((team) => storage.saveTeam(team));
  MOCK_PLAYERS.forEach((player) => storage.savePlayer(player));
  MOCK_MATCHES.forEach((match) => storage.saveMatch(match));
  MOCK_TRAINING_SESSIONS.forEach((session) => storage.saveTrainingSession(session));
  MOCK_SCOUT_REPORTS.forEach((report) => storage.saveScoutReport(report));
  MOCK_SUBSCRIPTIONS.forEach((sub) => storage.saveSubscription(sub));
  MOCK_PAYMENTS.forEach((payment) => storage.savePayment(payment));
  MOCK_ANNOUNCEMENTS.forEach((ann) => storage.saveAnnouncement(ann));
  MOCK_NOTIFICATIONS.forEach((notif) => storage.saveNotification(notif));
  mockParents.forEach((parent) => storage.saveParent(parent));
  mockCoaches.forEach((coach) => storage.saveCoach(coach));
}

export { mockParents, mockCoaches };