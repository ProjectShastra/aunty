import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { MapPin, Heart, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchedProfile } from '@/lib/matching-utils';
import { getVibeTag, generateAuntysTea } from '@/lib/auntys-tea';
import { ZODIAC_SIGNS, NAKSHATRAS } from '@/lib/vedic-astrology/types';

interface SwipeCardProps {
  profile: MatchedProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  currentUserManglik: boolean;
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

export function SwipeCard({ profile, onSwipe, currentUserManglik }: SwipeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Swipe indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const age = calculateAge(profile.date_of_birth);
  const city = profile.birth_location?.split(',')[0] || 'Unknown';
  const vibeTag = getVibeTag(profile.gunaScore, profile.isSoulmate);
  
  const candidateManglik = profile.is_manglik && !profile.manglik_cancelled;
  const auntysTea = generateAuntysTea(
    profile.gunaBreakdown,
    profile.isSoulmate,
    currentUserManglik,
    candidateManglik || false
  );

  const moonSign = profile.moon_sign_index 
    ? ZODIAC_SIGNS[profile.moon_sign_index as keyof typeof ZODIAC_SIGNS] 
    : null;
  const nakshatra = profile.moon_nakshatra_index 
    ? NAKSHATRAS[profile.moon_nakshatra_index - 1] 
    : null;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setExitDirection('right');
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitDirection('left');
      onSwipe('left');
    }
  };

  const handleTap = () => {
    if (Math.abs(x.get()) < 10) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
      <AnimatePresence mode="wait">
        {!exitDirection && (
          <motion.div
            ref={cardRef}
            key={profile.id}
            className="relative w-full aspect-[3/4.5] cursor-grab active:cursor-grabbing"
            style={{ x, rotate, opacity, transformStyle: 'preserve-3d' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            onClick={handleTap}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              rotateY: isFlipped ? 180 : 0
            }}
            exit={{ 
              x: exitDirection === 'right' ? 300 : -300,
              opacity: 0,
              rotate: exitDirection === 'right' ? 20 : -20,
              transition: { duration: 0.3 }
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            {/* Front of Card */}
            <div 
              className={cn(
                "absolute inset-0 rounded-3xl overflow-hidden shadow-2xl",
                isFlipped && "pointer-events-none"
              )}
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Full Photo */}
              <div className="absolute inset-0 bg-muted">
                {profile.photo_1 ? (
                  <img
                    src={profile.photo_1}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Heart className="h-24 w-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Vibe Tag */}
              <motion.div 
                className={cn(
                  "absolute top-4 right-4 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm",
                  `bg-gradient-to-r ${vibeTag.gradient}`
                )}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              >
                <span className={cn("font-semibold text-sm", vibeTag.textColor)}>
                  {vibeTag.label} {vibeTag.emoji}
                </span>
              </motion.div>

              {/* Soulmate Sparkle Effect */}
              {profile.isSoulmate && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-ping" />
                  <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-32 left-12 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                </div>
              )}

              {/* Swipe Indicators */}
              <motion.div 
                className="absolute top-1/2 left-6 -translate-y-1/2 px-4 py-2 rounded-lg border-4 border-red-500 bg-red-500/20 rotate-[-20deg]"
                style={{ opacity: nopeOpacity }}
              >
                <span className="text-red-500 font-bold text-2xl tracking-wider">NOPE</span>
              </motion.div>

              <motion.div 
                className="absolute top-1/2 right-6 -translate-y-1/2 px-4 py-2 rounded-lg border-4 border-green-500 bg-green-500/20 rotate-[20deg]"
                style={{ opacity: likeOpacity }}
              >
                <span className="text-green-500 font-bold text-2xl tracking-wider">LIKE</span>
              </motion.div>

              {/* Bottom Gradient & Info */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
                {/* Name & Age */}
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                  <span className="text-2xl text-white/80">{age}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-white/70">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{city}</span>
                </div>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {moonSign && (
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium">
                      🌙 {moonSign}
                    </span>
                  )}
                  {profile.element && (
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium">
                      {profile.element === 'Fire' && '🔥'}
                      {profile.element === 'Water' && '💧'}
                      {profile.element === 'Air' && '💨'}
                      {profile.element === 'Earth' && '🌍'}
                      {profile.element}
                    </span>
                  )}
                </div>

                {/* Tap hint */}
                <p className="text-white/50 text-xs text-center pt-2">
                  Tap to see Aunty's Tea ☕
                </p>
              </div>
            </div>

            {/* Back of Card - Aunty's Tea */}
            <div 
              className={cn(
                "absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-secondary via-secondary/90 to-primary/80",
                !isFlipped && "pointer-events-none"
              )}
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="absolute inset-0 p-6 flex flex-col">
                {/* Header */}
                <div className="text-center space-y-2 mb-6">
                  <span className="text-4xl">☕</span>
                  <h3 className="text-2xl font-bold text-white">Aunty's Tea</h3>
                  <p className="text-white/70 text-sm">The cosmic lowdown on {profile.name}</p>
                </div>

                {/* Main Summary */}
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                    <div className="text-center">
                      <span className="text-4xl">{auntysTea.emoji}</span>
                    </div>
                    <p className="text-white text-lg text-center leading-relaxed font-medium">
                      "{auntysTea.summary}"
                    </p>
                  </div>
                </div>

                {/* Compatibility Details */}
                <div className="space-y-3 mt-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-white/60 text-xs uppercase tracking-wide">Moon Sign</div>
                      <div className="text-white font-semibold">{moonSign || '—'}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-white/60 text-xs uppercase tracking-wide">Nakshatra</div>
                      <div className="text-white font-semibold text-sm">{nakshatra || '—'}</div>
                    </div>
                  </div>

                  {profile.gunaScore !== undefined && (
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Compatibility</span>
                        <span className="text-white font-bold">
                          {Math.round((profile.gunaScore / 36) * 100)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(profile.gunaScore / 36) * 100}%` }}
                          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Manglik Warning */}
                  {candidateManglik && (
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 text-center">
                      <span className="text-amber-200 text-sm">♂️ Manglik - Aunty recommends matching</span>
                    </div>
                  )}
                </div>

                {/* Tap hint */}
                <p className="text-white/50 text-xs text-center mt-4">
                  Tap to flip back
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SwipeButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function SwipeButtons({ onSwipeLeft, onSwipeRight, onUndo, canUndo }: SwipeButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-6 py-6">
      {/* Undo Button */}
      {canUndo && (
        <motion.button
          onClick={onUndo}
          className="w-12 h-12 rounded-full bg-card border-2 border-amber-400 text-amber-500 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="h-5 w-5" />
        </motion.button>
      )}

      {/* Pass Button */}
      <motion.button
        onClick={onSwipeLeft}
        className="w-16 h-16 rounded-full bg-card border-2 border-red-400 text-red-500 flex items-center justify-center shadow-xl"
        whileHover={{ scale: 1.1, borderColor: '#f87171' }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-8 w-8" />
      </motion.button>

      {/* Like Button */}
      <motion.button
        onClick={onSwipeRight}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 text-white flex items-center justify-center shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className="h-10 w-10" fill="currentColor" />
      </motion.button>
    </div>
  );
}
