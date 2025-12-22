import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, Sparkles, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/vedic-astrology/types';
import { 
  MatchedProfile, 
  CurrentUserProfile, 
  sortProfilesByMatch, 
  getMatchBadges,
  getScoreColor 
} from '@/lib/matching-utils';

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
  
  const [profiles, setProfiles] = useState<MatchedProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myProfile, setMyProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const fetchMatches = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Call edge function for server-side filtering
      const { data, error } = await supabase.functions.invoke('fetch-matches', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        // Fallback to direct query if edge function fails
        await fetchMatchesFallback();
        return;
      }

      if (!data.currentProfile) {
        navigate('/onboarding');
        return;
      }

      setMyProfile(data.currentProfile);

      // Sort profiles client-side using Guna Milan
      const sortedProfiles = sortProfilesByMatch(
        data.profiles || [],
        data.currentProfile
      );

      setProfiles(sortedProfiles);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // Fallback direct query if edge function is not deployed
  const fetchMatchesFallback = async () => {
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

      const currentUserProfile: CurrentUserProfile = {
        id: myProfileData.id,
        moon_nakshatra_index: myProfileData.moon_nakshatra_index,
        moon_sign_index: myProfileData.moon_sign_index,
        is_manglik: myProfileData.is_manglik && !myProfileData.manglik_cancelled,
        atmakaraka_planet: myProfileData.atmakaraka_planet,
        darakaraka_planet: myProfileData.darakaraka_planet,
        vedic_chart: myProfileData.vedic_chart as any,
      };

      setMyProfile(currentUserProfile);

      // Fetch other profiles
      const { data: otherProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .eq('onboarding_complete', true);

      if (error) throw error;

      // Convert to MatchedProfile format
      const matchedProfiles: MatchedProfile[] = (otherProfiles || []).map((p: any) => ({
        ...p,
        manglikPriority: 1,
        isSoulmate: false,
      }));

      // Sort profiles client-side
      const sortedProfiles = sortProfilesByMatch(matchedProfiles, currentUserProfile);
      setProfiles(sortedProfiles);
    } catch (error) {
      console.error('Error in fallback fetch:', error);
      toast.error('Failed to load profiles');
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user, fetchMatches]);

  const handleSwipe = (action: 'like' | 'pass') => {
    setDirection(action === 'like' ? 'right' : 'left');
    
    setTimeout(() => {
      if (action === 'like') {
        const profile = profiles[currentIndex];
        if (profile?.isSoulmate) {
          toast.success('✨ Aunty sees a cosmic connection here!');
        } else {
          toast.success('Aunty noted your interest! 💕');
        }
      }
      
      setDirection(null);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        toast.info("That's everyone for now! Check back later.");
      }
    }, 300);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Finding your cosmic matches...</p>
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
          <div className="flex gap-3 justify-center">
            <Button onClick={() => fetchMatches()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const age = calculateAge(currentProfile.date_of_birth);
  const moonSign = currentProfile.moon_sign_index ? ZODIAC_SIGNS[currentProfile.moon_sign_index as keyof typeof ZODIAC_SIGNS] : null;
  const nakshatra = currentProfile.moon_nakshatra_index ? NAKSHATRAS[currentProfile.moon_nakshatra_index - 1] : null;
  const badges = getMatchBadges(currentProfile);
  const scoreColor = currentProfile.gunaScore ? getScoreColor(currentProfile.gunaScore) : '';

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-secondary flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Aunty's Picks
          </h1>
          <p className="text-sm text-muted-foreground">
            {profiles.length - currentIndex} cosmic connections remaining
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

              {/* Soulmate indicator */}
              {currentProfile.isSoulmate && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-1.5 flex items-center gap-1.5 shadow-lg animate-pulse">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold text-sm">Soulmate Match</span>
                </div>
              )}

              {/* Match Score */}
              {currentProfile.gunaScore !== undefined && currentProfile.gunaScore > 0 && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg hover:bg-background transition-colors"
                >
                  <Star className="h-4 w-4 text-aunty-gold fill-aunty-gold" />
                  <span className={`font-semibold ${scoreColor}`}>
                    {currentProfile.gunaScore.toFixed(0)}
                  </span>
                  <span className="text-xs text-muted-foreground">/36</span>
                  <Info className="h-3 w-3 text-muted-foreground ml-1" />
                </button>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent" />

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
              {/* Match Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={
                        badge.includes('Soulmate') 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200' 
                          : badge.includes('Excellent')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-accent text-accent-foreground'
                      }
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Guna Score Progress */}
              {currentProfile.gunaScore !== undefined && currentProfile.gunaScore > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Compatibility Score</span>
                    <span className={`font-medium ${scoreColor}`}>
                      {Math.round((currentProfile.gunaScore / 36) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(currentProfile.gunaScore / 36) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Astrological Badges */}
              <div className="flex flex-wrap gap-2">
                {moonSign && (
                  <Badge variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">
                    🌙 {moonSign}
                  </Badge>
                )}
                {nakshatra && (
                  <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent">
                    ⭐ {nakshatra}
                  </Badge>
                )}
                {currentProfile.element && (
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {currentProfile.element === 'Fire' && '🔥'}
                    {currentProfile.element === 'Water' && '💧'}
                    {currentProfile.element === 'Air' && '💨'}
                    {currentProfile.element === 'Earth' && '🌍'}
                    {currentProfile.element}
                  </Badge>
                )}
                {currentProfile.is_manglik && !currentProfile.manglik_cancelled && (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
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

      {/* Guna Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-aunty-gold fill-aunty-gold" />
              Compatibility Breakdown
            </DialogTitle>
          </DialogHeader>
          
          {currentProfile.gunaBreakdown && (
            <div className="space-y-3">
              {Object.entries(currentProfile.gunaBreakdown.breakdown).map(([key, value]) => {
                const maxScores: Record<string, number> = {
                  varna: 1, vashya: 2, tara: 3, yoni: 4,
                  maitri: 5, gana: 6, bhakoot: 7, nadi: 8
                };
                const max = maxScores[key] || 1;
                const numValue = typeof value === 'number' ? value : 0;
                const percentage = (numValue / max) * 100;
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-foreground">{key}</span>
                      <span className="text-muted-foreground">{numValue}/{max}</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
              
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between font-semibold">
                  <span>Total Score</span>
                  <span className={scoreColor}>
                    {currentProfile.gunaScore}/36
                  </span>
                </div>
              </div>

              {currentProfile.gunaBreakdown.nadiDosha && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                  ⚠️ Nadi Dosha detected - Consider consulting an astrologer
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
