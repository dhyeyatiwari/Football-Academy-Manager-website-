import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ClubBadge } from '@/components/ui/ClubBadge';

const footerLinks = {
  academy: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Philosophy', href: '/philosophy' },
    { name: 'Coaching Staff', href: '/coaching' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'History', href: '/history' },
  ],
  programs: [
    { name: 'U6-U10 Foundation', href: '/programs/foundation' },
    { name: 'U11-U14 Development', href: '/programs/development' },
    { name: 'U15-U18 Elite', href: '/programs/elite' },
    { name: 'Pro Pathway', href: '/programs/pro-pathway' },
    { name: 'Holiday Camps', href: '/programs/camps' },
  ],
  info: [
    { name: 'Admissions', href: '/admissions' },
    { name: 'Fees & Subscriptions', href: '/fees' },
    { name: 'Trial Sessions', href: '/trials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ],
};

const contactInfo = [
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'VK Training Ground, London, UK',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+44 20 7946 0958',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@vkfootball.academy',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon–Fri 9:00–18:00',
  },
];

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="border-t border-club-border bg-[#07090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <ClubBadge size="md" variant="default" showText={false} />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                VK Football Academy
              </span>
            </div>
            <p className="text-club-muted text-sm leading-relaxed max-w-xs">
              Elite European-standard youth development academy. Shaping the next generation of football talent through technical excellence, tactical intelligence, and unwavering discipline.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="w-10 h-10 rounded-lg border border-club-border bg-club-surface flex items-center justify-center text-club-silver hover:text-club-pitch hover:border-club-pitch transition-all"
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-club-muted text-sm hover:text-white transition-colors"
                    >
                      {link.name} <ArrowRight className="w-3 h-3 inline ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-club-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-club-pitch" />
                    <div>
                      <p className="text-xs font-medium text-club-silver">{info.label}</p>
                      <p className="text-xs text-club-muted">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-club-pitch" />
              <p className="text-xs text-club-muted">
                VK Football Academy © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}