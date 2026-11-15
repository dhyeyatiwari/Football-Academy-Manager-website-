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
  CheckCircle,
  Award,
  Target,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { PitchBackground } from '@/components/ui/PitchBackground';
import { mockDataService } from '@/services/mockData';
import type { Match, TrainingSession } from '@/types/domain';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';

const programmes = [
  {
    age: 'U6–U10',
    name: 'Foundation',
    accent: 'red',
    description:
      'Introduction to football through play. Motor skills, ball mastery, and a lifelong love of the game in a safe, encouraging environment.',
    icon: Compass,
  },
  {
    age: 'U11–U14',
    name: 'Development',
    accent: 'blue',
    description:
      'Technical refinement and tactical awareness. Position-specific coaching, small-sided games, and competitive fixtures against peer academies.',
    icon: Target,
  },
  {
    age: 'U15–U18',
    name: 'Elite',
    accent: 'gold',
    description:
      'High-performance pathway. Professional-style training blocks, video analysis, strength conditioning, and exposure to scout networks.',
    icon: Award,
  },
  {
    age: 'U19+',
    name: 'Pro Pathway',
    accent: 'red',
    description:
    'Individual development plans, trial placements, and direct links to clubs and universities across Europe for standout athletes.',
    icon: GraduationCap,
  },
];

const achievements = [
  { value: '142', label: 'Academy Players' },
  { value: '12', label: 'Competitive Teams' },
  { value: '28', label: 'Trophies Won' },
  { value: '47', label: 'Players Signed Pro' },
];

const coaches = [
  {
    name: 'Elena Rossi',
    role: 'Head of Coaching',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    badge: 'UEFA Pro',
  },
  {
    name: 'Marcus Delgado',
    role: 'Academy Director',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    badge: 'UEFA A',
  },
  {
    name: 'James Whitfield',
    role: 'Lead Goalkeeping Coach',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1272a8e396?w=400&h=400&fit=crop',
    badge: 'UEFA B',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
  'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
  'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
];

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-club-bg/80 via-club-bg/60 to-club-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-club-bg/70 via-transparent to-club-bg/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="flex justify-center mb-8">
            <ClubBadge size="xl" variant="default" showText={false} />
          </div>

          <p className="text-club-gold font-display font-bold text-sm md:text-base uppercase tracking-[0.3em] mb-4">
            Est. 2010 · Elite Youth Development
          </p>

          <h1 className="font-display font-bold text-white text-4xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[1.05]">
            VK Football
            <span className="block text-club-red">Academy</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-club-silver text-base md:text-lg leading-relaxed">
            Elite European-standard youth development academy. Shaping the next generation of
            football talent through technical excellence, tactical intelligence, and unwavering
            discipline.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
            <Link
              to="/academy"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-club-red text-white font-bold text-lg rounded-xl hover:bg-club-red-hover transition-all duration-300 shadow-[0_0_20px_rgba(197,30,50,0.3)] hover:shadow-[0_0_30px_rgba(197,30,50,0.5)]"
            >
              <Play className="w-5 h-5" />
              Register Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/coach"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-club-gold text-club-gold font-bold text-lg rounded-xl hover:bg-club-gold hover:text-club-bg transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              Coach Portal
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {achievements.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-club-gold">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-club-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes Section */}
      <section className="py-20 bg-club-bg/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Programmes"
            subtitle="Age-specific pathways from foundation to elite, each designed to maximise every player's potential."
            centered={true}
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {programmes.map((programme) => {
              const Icon = programme.icon;
              const accentMap = {
                red: {
                  border: 'hover:border-club-red',
                  iconBg: 'bg-club-red/15 text-club-red',
                  iconHover: 'group-hover:bg-club-red group-hover:text-white',
                  tag: 'bg-club-red/10 text-club-red border-club-red/30',
                },
                blue: {
                  border: 'hover:border-club-blue',
                  iconBg: 'bg-club-blue/15 text-club-blue',
                  iconHover: 'group-hover:bg-club-blue group-hover:text-white',
                  tag: 'bg-club-blue/10 text-club-blue border-club-blue/30',
                },
                gold: {
                  border: 'hover:border-club-gold',
                  iconBg: 'bg-club-gold/15 text-club-gold',
                  iconHover: 'group-hover:bg-club-gold group-hover:text-club-bg',
                  tag: 'bg-club-gold/10 text-club-gold border-club-gold/30',
                },
              };
              const accent = accentMap[programme.accent as keyof typeof accentMap];
              return (
                <div
                  key={programme.name}
                  className={`group p-8 rounded-2xl border border-club-border bg-club-surface transition-all duration-300 hover:-translate-y-2 ${accent.border}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${accent.iconBg} ${accent.iconHover}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${accent.tag}`}
                    >
                      {programme.age}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{programme.name}</h3>
                  <p className="text-club-muted text-sm leading-relaxed">{programme.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-club-silver group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose VK */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose VK Football Academy?"
            subtitle="Our comprehensive approach to youth development combines professional coaching, state-of-the-art facilities, and a proven pathway to success."
            centered={true}
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              {
                icon: Users,
                title: 'Elite Coaching',
                text: 'Professional UEFA-licensed coaches with proven track record in youth development.',
              },
              {
                icon: Trophy,
                title: 'Competitive Matches',
                text: 'Regular league fixtures and tournaments against top academies across Europe.',
              },
              {
                icon: Calendar,
                title: 'Structured Program',
                text: 'Age-specific pathways from U6 to Elite levels with progressive development stages.',
              },
              {
                icon: Heart,
                title: 'Holistic Development',
                text: 'Academic support, mental training, and character building alongside football skills.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl border border-club-border bg-club-surface hover:border-club-red transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-club-red/15 flex items-center justify-center mb-6 group-hover:bg-club-red group-hover:text-white transition-all">
                    <Icon className="w-8 h-8 text-club-red group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-club-muted text-sm leading-relaxed">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-club-graphite/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                title="Championship Standard"
                subtitle="A decade of developing players who go on to compete at the highest levels of European football."
                size="lg"
              />
              <div className="mt-8 space-y-4">
                {[
                  'UEFA-licensed coaching staff across all age groups',
                  'Official partnership with 12 professional clubs',
                  'Annual trial placements in top European academies',
                  'State-of-the-art video analysis and performance lab',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-club-silver">
                    <CheckCircle className="w-5 h-5 text-club-gold flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-club-gold/30 bg-club-surface p-6 text-center hover:border-club-gold transition-all duration-300"
                >
                  <Trophy className="w-8 h-8 text-club-gold mx-auto mb-3" />
                  <p className="font-display text-3xl md:text-4xl font-bold text-club-gold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-club-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Profiles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Coaching Staff"
            subtitle="World-class mentors dedicated to unlocking every player's potential."
            centered={true}
            size="lg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {coaches.map((coach) => (
              <div
                key={coach.name}
                className="group rounded-2xl border border-club-border bg-club-surface overflow-hidden hover:border-club-red transition-all duration-300 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{coach.name}</h3>
                    <span className="px-2 py-1 rounded-md bg-club-gold/10 text-club-gold text-xs font-bold uppercase tracking-wider border border-club-gold/30">
                      {coach.badge}
                    </span>
                  </div>
                  <p className="text-sm text-club-muted">{coach.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-club-bg/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Academy Gallery"
            subtitle="Moments from the pitch, the training ground, and the journey of our players."
            centered={true}
            size="lg"
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl border border-club-border ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={src}
                  alt={`Academy moment ${index + 1}`}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-club-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-5 h-5 text-club-gold" />
                </div>
              </div>
            ))}
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
                <div className="rounded-2xl border border-club-border bg-club-surface p-6 hover:border-club-red transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-club-red/15 flex items-center justify-center">
                        <Play className="w-6 h-6 text-club-red" />
                      </div>
                      <div>
                        <p className="text-sm text-club-muted">Today</p>
                        <p className="text-lg font-bold text-white">{nextSession.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-club-muted">Time</p>
                      <p className="text-lg font-bold text-club-red">
                        {nextSession.startTime} - {nextSession.endTime}
                      </p>
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
                  <button className="w-full mt-6 py-3 bg-club-red text-white font-medium rounded-lg hover:bg-club-red-hover transition-colors">
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
                    className="rounded-xl border border-club-border bg-club-surface p-4 hover:border-club-red transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">HOME</p>
                        <p className="font-bold text-white text-sm">{match.homeTeamName}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">VS</p>
                        <p className="text-lg font-bold text-club-red">VS</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-club-muted mb-1">AWAY</p>
                        <p className="font-bold text-white text-sm">{match.awayTeamName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-club-border">
                      <div className="flex items-center gap-2 text-club-muted">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {match.date} at {match.kickoffTime}
                        </span>
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
      <section className="py-20 bg-gradient-to-r from-club-red/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Ready to Join Elite Football?
          </h2>
          <p className="text-club-muted text-lg mb-8 max-w-2xl mx-auto">
            Start your journey with VK Football Academy today. Book your trial session and
            experience world-class coaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-club-red text-white font-bold rounded-xl hover:bg-club-red-hover transition-all duration-300 shadow-[0_0_20px_rgba(197,30,50,0.3)]">
              Book Trial Session
            </button>
            <button className="px-8 py-4 border border-club-gold text-club-gold font-bold rounded-xl hover:bg-club-gold hover:text-club-bg transition-all duration-300">
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