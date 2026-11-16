import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/portal/PageHeader';
import { dataService } from '@/services/dataService';
import type { Match, Player } from '@/types/domain';

const ParentMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [children, setChildren] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allPlayers = dataService.getPlayers();
    const myChildren = allPlayers.filter((p) => p.parentIds.includes('parent_1'));
    setChildren(myChildren);

    const allMatches = dataService.getMatches();
    const childTeamIds = myChildren.map((c) => c.teamId).filter(Boolean);
    const myMatches = allMatches.filter((m) =>
      childTeamIds.includes(m.homeTeamId) || childTeamIds.includes(m.awayTeamId)
    );
    setMatches(myMatches);
    setLoading(false);
  }, []);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.homeTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.competition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full animate-spin" />
          <p className="text-club-muted">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Matches"
        description="View your children's upcoming and past matches."
      />

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-club-border bg-club-surface p-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-club-muted" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-club-border bg-club-bg text-white placeholder-club-muted focus:outline-none focus:ring-2 focus:ring-club-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-club-border bg-club-surface/50 p-12 text-center">
            <Trophy className="w-16 h-16 text-club-muted mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-club-muted">No matches found for your children.</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const statusColors: Record<string, string> = {
              Scheduled: 'bg-club-red/15 text-club-red',
              Live: 'bg-club-gold/15 text-club-gold',
              'Half Time': 'bg-club-gold/15 text-club-gold',
              'Full Time': 'bg-club-blue/15 text-club-blue',
              Postponed: 'bg-club-muted/15 text-club-muted',
              Cancelled: 'bg-club-muted/15 text-club-muted',
            };
            return (
              <Link
                key={match.id}
                to={`/parent/matches/${match.id}`}
                className="block rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-club-red/15">
                      <Trophy className="h-6 w-6 text-club-red" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{match.homeTeamName} vs {match.awayTeamName}</h3>
                      <p className="text-sm text-club-muted">{match.competition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[match.status] || 'bg-club-surface text-club-muted'}`}>
                      {match.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-club-muted" />
                    <span className="text-sm text-club-silver">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-club-muted" />
                    <span className="text-sm text-club-silver">{match.kickoffTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-club-muted" />
                    <span className="text-sm text-club-silver">{match.venue}</span>
                  </div>
                </div>

                {match.status === 'Full Time' && match.homeScore !== undefined && match.awayScore !== undefined && (
                  <div className="mt-4 pt-4 border-t border-club-border">
                    <p className="text-center font-display text-xl font-bold text-white">
                      Final Score: {match.homeScore} - {match.awayScore}
                    </p>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ParentMatches;