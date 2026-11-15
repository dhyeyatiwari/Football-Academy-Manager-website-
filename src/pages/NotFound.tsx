import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { ClubBadge } from '@/components/ui/ClubBadge';
import { PitchBackground } from '@/components/ui/PitchBackground';

const NotFound = () => {
  return (
    <PitchBackground variant="minimal">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <ClubBadge size="xl" variant="default" showText={true} />
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white tracking-tight">
            404
          </h1>
          
          <p className="text-xl md:text-2xl text-club-muted max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-club-red text-white font-bold text-lg rounded-xl hover:bg-club-red-hover transition-all duration-300 shadow-[0_0_20px_rgba(197,30,50,0.3)]"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-club-red text-club-red font-bold text-lg rounded-xl hover:bg-club-red hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Explore Academy
            </Link>
          </div>
        </div>
      </div>
    </PitchBackground>
  );
};

export default NotFound;