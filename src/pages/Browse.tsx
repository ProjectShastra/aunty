import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { evaluateMatch, VedicProfile } from '@/lib/vedic-astrology';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/vedic-astrology/types';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  gender: string | null;
  photo_1: string | null;
  photo_2: string | null;
  birth_location: string | null;
  moon_sign_index: number | null;
  moon_nakshatra_index: number | null;
  ascendant_sign_index: number | null;
  is_manglik: boolean | null;
  manglik_cancelled: boolean | null;
  atmakaraka_planet: string | null;
  element: string | null;
  vedic_chart: unknown;
  date_of_birth: string;
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function Browse() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      // Fetch my profile first
      const { data: myProfileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!myProfileData) {
        navigate('/onboarding');
        return;
      }

      setMyProfile(myProfileData as Profile);

      // Fetch other profiles
      const { data: otherProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .eq('onboarding_complete', true);

      if (error) throw error;

      setProfiles((otherProfiles || []) as Profile[]);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  // Calculate match score when current profile changes
  useEffect(() => {
    if (myProfile && profiles[currentIndex]) {
      const currentProfile = profiles[currentIndex];
      
      if (myProfile.vedic_chart && currentProfile.vedic_chart) {
        try {
          const result = evaluateMatch(
            myProfile.vedic_chart as unknown as VedicProfile,
            currentProfile.vedic_chart as unknown as VedicProfile
          );
          setMatchScore(result.score);
        } catch {
          setMatchScore(null);
        }
      }
    }
  }, [currentIndex, myProfile, profiles]);

  const handleSwipe = (action: 'like' | 'pass') => {
    setDirection(action === 'like' ? 'right' : 'left');
    
    setTimeout(() => {
      if (action === 'like') {
        toast.success('Aunty noted your interest! 💕');
      }
      
      setDirection(null);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        toast.info('That\'s everyone for now! Check back later.');
      }
    }, 300);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-semibold text-foreground">No More Profiles</h2>
          <p className="text-muted-foreground">
            Aunty is searching the cosmos for more matches. Check back soon!
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const age = calculateAge(currentProfile.date_of_birth);
  const moonSign = currentProfile.moon_sign_index ? ZODIAC_SIGNS[currentProfile.moon_sign_index] : null;
  const nakshatra = currentProfile.moon_nakshatra_index ? NAKSHATRAS[currentProfile.moon_nakshatra_index - 1] : null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-secondary flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Aunty's Picks
          </h1>
          <p className="text-sm text-muted-foreground">
            {profiles.length - currentIndex} potential matches remaining
          </p>
        </div>

        {/* Profile Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
              rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border"
          >
            {/* Photo */}
            <div className="relative aspect-[3/4] bg-muted">
              {currentProfile.photo_1 ? (
                <img
                  src={currentProfile.photo_1}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="h-16 w-16 text-muted-foreground" />
                </div>
              )}

              {/* Match Score Overlay */}
              {matchScore !== null && (
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                  <Star className="h-4 w-4 text-aunty-gold fill-aunty-gold" />
                  <span className="font-semibold text-foreground">{matchScore.toFixed(0)}</span>
                  <span className="text-xs text-muted-foreground">/36</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent" />

              {/* Profile Info Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{currentProfile.name}</h2>
                  <span className="text-lg text-muted-foreground">{age}</span>
                </div>

                {currentProfile.birth_location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{currentProfile.birth_location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-4">
              {/* Astrological Badges */}
              <div className="flex flex-wrap gap-2">
                {moonSign && (
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    🌙 {moonSign}
                  </Badge>
                )}
                {nakshatra && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    ⭐ {nakshatra}
                  </Badge>
                )}
                {currentProfile.element && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {currentProfile.element === 'Fire' && '🔥'}
                    {currentProfile.element === 'Water' && '💧'}
                    {currentProfile.element === 'Air' && '💨'}
                    {currentProfile.element === 'Earth' && '🌍'}
                    {currentProfile.element}
                  </Badge>
                )}
                {currentProfile.is_manglik && !currentProfile.manglik_cancelled && (
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive">
                    ♂️ Manglik
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {currentProfile.bio && (
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {currentProfile.bio}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-6">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleSwipe('pass')}
          >
            <X className="h-8 w-8" />
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => handleSwipe('like')}
          >
            <Heart className="h-8 w-8" />
          </Button>
        </div>

        {/* Counter */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Profile {currentIndex + 1} of {profiles.length}
        </p>
      </div>
    </div>
  );
}
