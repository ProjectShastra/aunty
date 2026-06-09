import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Heart, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SwipeCard, SwipeButtons } from '@/components/SwipeCard';
import { 
  MatchedProfile, 
  CurrentUserProfile, 
  sortProfilesByMatch 
} from '@/lib/matching-utils';

export default function Browse() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [profiles, setProfiles] = useState<MatchedProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myProfile, setMyProfile] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);

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

      // Try edge function first
      const { data, error } = await supabase.functions.invoke('fetch-matches', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
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
      setSwipeHistory([]);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // Fallback using secure RPC function
  const fetchMatchesFallback = async () => {
    if (!user) return;

    try {
      // Get own profile first (allowed by RLS)
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
        gender: myProfileData.gender,
        moon_nakshatra_index: myProfileData.moon_nakshatra_index,
        moon_sign_index: myProfileData.moon_sign_index,
        is_manglik: myProfileData.is_manglik && !myProfileData.manglik_cancelled,
        atmakaraka_planet: myProfileData.atmakaraka_planet,
        darakaraka_planet: myProfileData.darakaraka_planet,
        vedic_chart: myProfileData.vedic_chart as any,
      };

      setMyProfile(currentUserProfile);

      // Use secure RPC function for discovery
      const { data: otherProfiles, error } = await supabase
        .rpc('get_discovery_profiles', {
          p_user_id: user.id,
          p_looking_for: myProfileData.looking_for,
          p_limit: 50
        });

      if (error) throw error;

      const matchedProfiles: MatchedProfile[] = (otherProfiles || []).map((p: any) => ({
        ...p,
        manglikPriority: 1,
        isSoulmate: false,
      }));

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

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    
    if (direction === 'right') {
      if (currentProfile?.isSoulmate) {
        toast.success('✨ Aunty sees a cosmic connection here!', {
          description: 'Interest sent to your destined match!',
        });
      } else {
        toast.success('Interest sent! 💕', {
          description: `Aunty will let ${currentProfile?.name} know!`,
        });
      }
    }

    setSwipeHistory(prev => [...prev, currentIndex]);
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleUndo = () => {
    if (swipeHistory.length > 0) {
      const lastIndex = swipeHistory[swipeHistory.length - 1];
      setSwipeHistory(prev => prev.slice(0, -1));
      setCurrentIndex(lastIndex);
      toast.info('Brought back the last profile');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <p className="text-muted-foreground text-lg">Finding your cosmic matches...</p>
          <p className="text-muted-foreground/60 text-sm">Aunty is consulting the stars</p>
        </motion.div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length - 1;

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div 
          className="text-center space-y-6 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <Heart className="h-20 w-20 text-muted-foreground/30 mx-auto" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">You've Seen Everyone!</h2>
          <p className="text-muted-foreground">
            Aunty is searching the cosmos for more matches. 
            Check back soon or expand your preferences!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={() => fetchMatches()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Matches
            </Button>
            <Button onClick={() => navigate('/')} className="gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pt-4 pb-24">
      <div className="container max-w-lg mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-pink-500 to-secondary bg-clip-text text-transparent">
            Aunty's Picks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profiles.length - currentIndex} cosmic connections waiting
          </p>
        </motion.div>

        {/* Card Stack */}
        <div className="relative min-h-[500px]">
          {/* Background cards for stack effect */}
          {hasMoreProfiles && profiles[currentIndex + 1] && (
            <motion.div
              className="absolute inset-0 rounded-3xl bg-card shadow-lg"
              style={{ 
                transform: 'scale(0.95) translateY(10px)',
                opacity: 0.5,
                zIndex: 0
              }}
            />
          )}

          {/* Main Card */}
          <div className="relative z-10">
            <SwipeCard
              key={currentProfile.id}
              profile={currentProfile}
              onSwipe={handleSwipe}
              currentUserManglik={myProfile?.is_manglik || false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <SwipeButtons
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          onUndo={handleUndo}
          canUndo={swipeHistory.length > 0}
        />

        {/* Progress indicator */}
        <div className="flex justify-center gap-1 mt-2">
          {profiles.slice(0, Math.min(10, profiles.length)).map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-6 bg-primary' 
                  : idx < currentIndex 
                    ? 'w-2 bg-primary/30' 
                    : 'w-2 bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
