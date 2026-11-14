import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Calendar,
  Trophy,
  Play,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Camera,
  Heart,
  CheckCircle
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { PitchBackground } from '@/components/ui/PitchBackground';
import { mockDataService } from '@/services/mockData';
import type { Match, TrainingSession } from '@/types/domain';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';

const PublicHome = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [nextSession, setNextSession] = useState<TrainingSession | null>(null);

  useEffect(() => {
    mockDataService.getUpcomingMatches().then(setUpcomingMatches);
    mockDataService.getTrainingSessions().then((sessions) => {
      const today = new Date();
      const todaySession = sessions.find((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate.toDateString() === today.toDateString();
      });
      setNextSession(todaySession || null);
    });
  }, []);

  return (
    <PitchBackground variant="strong">
      <Navigation />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <ClubBadge size="xl" variant="default" showText={true} />
            </div>
            
            <SectionHeading
              title="VK Football Academy"
              subtitle="Elite European-standard youth development academy. Shaping the next generation of football talent through technical excellence, tactical intelligence, and unwavering discipline."
              centered={true}
              size="xl"
              accent={true}
            />
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link
                to="/academy"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-club-pitch text-club-darkest font-bold text-lg rounded-xl hover:bg-club-pitch-hover transition-all duration-300 shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_30px_rgba(0,230,118,0.5)]"
              >
                <Play className="w-5 h-5" />
                Explore Academy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/coach"
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-club-pitch text-club-pitch font-bold text-lg rounded-xl hover:bg-club-pitch hover:text-club-darkest transition-all duration-300"
              >
                <Shield className="w-5 h-5" />
                Coach Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#07090C]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose VK Football Academy?"
            subtitle="Our comprehensive approach to youth development combines professional coaching, state-of-the-art facilities, and a proven pathway to success."
            centered={true}
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="group p-8 rounded-2xl border border-club-border bg-club-surface hover:border-club-pitch transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-club-pitch/20 flex items-center justify-center mb-6 group-hover:bg-club-pitch group-hover:text-club-darkest transition-all">
                <Users className="w-8 h-8 text-club-pitch group-hover:text-club-darkest" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Elite Coaching</h3>
              <p className="text-club-muted text-sm leading-relaxed">
                Professional UEFA-licensed coaches with proven track record in youth development.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-club-border bg-club-surface hover:border-club-pitch transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-club-pitch/20 flex items-center justify-center mb-6 group-hover:bg-club-pitch group-hover:text-club-darkest transition-all">
                <Trophy className="w-8 h-8 text-club-pitch group-hover:text-club-darkest" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Competitive Matches</h3>
              <p className="text-club-muted text-sm leading-relaxed">
                Regular league fixtures and tournaments against top academies across Europe.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-club-border bg-club-surface hover:border-club-pitch transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-club-pitch/20 flex items-center justify-center mb-6 group-hover:bg-club-pitch group-hover:text-club-darkest transition-all">
                <Calendar className="w-8 h-8 text-club-pitch group-hover:text-club-darkest" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Structured Program</h3>
              <p className="text-club-muted text-sm leading-relaxed">
                Age-specific pathways from U6 to Elite levels with progressive development stages.
              </p>
            </div>

            <div className="group p-8 rounded-2xl border border-club-border bg-club-surface hover:border-club-pitch transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-club-pitch/20 flex items-center justify-center mb-6 group-hover:bg-club-pitch group-hover:text-club-darkest transition-all">
                <Heart className="w-8 h-8 text-club-pitch group-hover:text-club-darkest" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Holistic Development</h3>
              <p className="text-club-muted text-sm leading-relaxed">
                Academic support, mental training, and character building alongside football skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Schedule Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Next Training Session */}
            <div className="space-y-6">
              <SectionHeading
                title="Next Training Session"
                subtitle="Elite coaching sessions designed to maximize your potential. Our structured program ensures progressive development for all age groups."
                size="md"
              />
              
              {nextSession && (
                <div className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-pitch transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-club-pitch/20 flex items-center justify-center">
                        <Play className="w-6 h-6 text-club-pitch" />
                      </div>
                      <div>
                        <p className="text-sm text-club-muted">Today</p>
                        <p className="text-lg font-bold text-white">{nextSession.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-club-muted">Time</p>
                      <p className="text-lg font-bold text-club-pitch">{nextSession.startTime} - {nextSession.endTime}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-club-muted">
                      <MapPin className="w-4 h-4" />
                      <span>{nextSession.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-club-muted">
                      <Trophy className="w-4 h-4" />
                      <span>{nextSession.type} Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-club-muted">
                      <Users className="w-4 h-4" />
                      <span>{nextSession.teamName}</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-club-pitch text-club-darkest font-medium rounded-lg hover:bg-club-pitch-hover transition-colors">
                    View Full Schedule
                  </button>
                </div>
              )}

              {!nextSession && (
                <div className="rounded-2xl border border-club-border bg-club-surface p-8 text-center">
                  <Calendar className="w-12 h-12 text-club-muted mx-auto mb-4" />
                  <p className="text-club-muted">No training sessions scheduled for today</p>
                </div>
              )}
            </div>

            {/* Upcoming Matches */}
            <div className="space-y-6">
              <SectionHeading
                title="Upcoming Matches"
                subtitle="Competitive fixtures that test your skills against the best academies in the region."
                size="md"
              />
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {upcomingMatches.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-club-border bg-club-surface p-4 hover:border-club-pitch transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">HOME</p>
                        <p className="font-bold text-white text-sm">{match.homeTeamName}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">VS</p>
                        <p className="text-lg font-bold text-club-pitch">VS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">AWAY</p>
                        <p className="font-bold text-white text-sm">{match.awayTeamName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-club-border">
                      <div className="flex items-center gap-2 text-club-muted">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{match.date} at {match.kickoffTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-club-muted">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{match.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {upcomingMatches.length === 0 && (
                  <div className="rounded-xl border border-club-border bg-club-surface p-8 text-center">
                    <Trophy className="w-12 h-12 text-club-muted mx-auto mb-4" />
                    <p className="text-club-muted">No upcoming matches scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-club-pitch/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Join Elite Football?
          </h2>
          <p className="text-club-muted text-lg mb-8 max-w-2xl mx-auto">
            Start your journey with VK Football Academy today. Book your trial session and experience world-class coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-club-pitch text-club-darkest font-bold rounded-xl hover:bg-club-pitch-hover transition-all duration-300 shadow-[0_0_20px_rgba(0,230,118,0.3)]">
              Book Trial Session
            </button>
            <button className="px-8 py-4 border border-club-pitch text-club-pitch font-bold rounded-xl hover:bg-club-pitch hover:text-club-darkest transition-all duration-300">
              Download Brochure
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </PitchBackground>
  );
};

export default PublicHome;