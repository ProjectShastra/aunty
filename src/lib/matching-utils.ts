/**
 * Client-side matching utilities for the Discovery Feed
 * Handles Guna Milan scoring and profile sorting
 * 
 * Strategy: "Sort, Don't Filter" - show all profiles but rank them
 */

import { VedicProfile, ZodiacSign, NakshatraIndex } from '@/lib/vedic-astrology/types';
import { calculateGunaMilan, GunaMilanResult } from '@/lib/vedic-astrology/matching';

export type MatchTier = 'soulmate' | 'twinFlame' | 'auntyApproves' | 'itsAVibe' | 'spicy' | 'karmic';

export interface MatchedProfile {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  gender: string | null;
  photo_1: string | null;
  photo_2: string | null;
  birth_location: string | null;
  date_of_birth: string;
  moon_nakshatra_index: number | null;
  moon_sign_index: number | null;
  ascendant_sign_index: number | null;
  is_manglik: boolean | null;
  manglik_cancelled: boolean | null;
  atmakaraka_planet: string | null;
  darakaraka_planet: string | null;
  element: string | null;
  vedic_chart: VedicProfile | null;
  // Computed matching fields
  manglikPriority: number;
  isSoulmate: boolean;
  hasNadiDosha?: boolean;
  gunaScore?: number;
  gunaBreakdown?: GunaMilanResult;
  matchTier?: MatchTier;
}

export interface CurrentUserProfile {
  id: string;
  moon_nakshatra_index: number | null;
  moon_sign_index: number | null;
  is_manglik: boolean;
  atmakaraka_planet: string | null;
  darakaraka_planet: string | null;
  vedic_chart: VedicProfile | null;
}

/**
 * Calculate Guna Milan score between two profiles
 */
export function calculateGunaScore(
  currentProfile: CurrentUserProfile,
  candidateProfile: MatchedProfile
): { score: number; breakdown: GunaMilanResult } | null {
  // Need complete vedic charts for Guna Milan
  if (!currentProfile.vedic_chart || !candidateProfile.vedic_chart) {
    return null;
  }

  try {
    // calculateGunaMilan expects VedicProfile objects (boy, girl)
    const result = calculateGunaMilan(
      currentProfile.vedic_chart,
      candidateProfile.vedic_chart
    );

    return {
      score: result.totalScore,
      breakdown: result,
    };
  } catch (error) {
    console.error('Error calculating Guna Milan:', error);
    return null;
  }
}

/**
 * Determine match tier based on score and special conditions
 * 
 * Tiers (in display order):
 * 1. Soulmate - AK-DK match (cosmic destiny)
 * 2. Twin Flame - Score 25+ (excellent match)
 * 3. Aunty Approves - Score 18-24 (good match)
 * 4. It's a Vibe - Score 15-17 (decent potential)
 * 5. Spicy/Tricky - Score < 15 (challenging)
 * 6. Karmic Lesson - Nadi Dosha (use caution)
 */
function determineMatchTier(
  gunaScore: number | undefined,
  isSoulmate: boolean,
  hasNadiDosha: boolean
): MatchTier {
  // Nadi Dosha is a serious concern - label it
  if (hasNadiDosha) {
    return 'karmic';
  }
  
  // Soulmate takes priority
  if (isSoulmate) {
    return 'soulmate';
  }
  
  // Score-based tiers
  const score = gunaScore ?? 0;
  
  if (score >= 25) {
    return 'twinFlame';
  }
  if (score >= 18) {
    return 'auntyApproves';
  }
  if (score >= 15) {
    return 'itsAVibe';
  }
  
  return 'spicy';
}

/**
 * Get sort priority for match tier (lower = higher priority)
 */
function getTierPriority(tier: MatchTier): number {
  const priorities: Record<MatchTier, number> = {
    soulmate: 0,
    twinFlame: 1,
    auntyApproves: 2,
    itsAVibe: 3,
    spicy: 4,
    karmic: 5, // Pushed to bottom
  };
  return priorities[tier];
}

/**
 * Sort profiles by match quality - "The Judgmental Feed"
 * 
 * Sorting order:
 * 1. Soulmates (AK-DK match) - force to top with ✨
 * 2. Twin Flames (Score 25+) - gold tier
 * 3. Aunty Approves (Score 18-24) - green tier
 * 4. It's a Vibe (Score 15-17) - blue tier
 * 5. Spicy/Tricky (Score < 15) - orange tier
 * 6. Karmic Lessons (Nadi Dosha) - red tier, bottom
 * 
 * Within each tier, sort by Guna score descending
 */
export function sortProfilesByMatch(
  profiles: MatchedProfile[],
  currentProfile: CurrentUserProfile
): MatchedProfile[] {
  // Calculate Guna scores and assign tiers for all profiles
  const profilesWithScores = profiles.map(profile => {
    const gunaResult = calculateGunaScore(currentProfile, profile);

    // Check for soulmate connection (current user's AK = candidate's DK)
    const isSoulmate = 
      currentProfile.atmakaraka_planet && 
      profile.darakaraka_planet && 
      currentProfile.atmakaraka_planet === profile.darakaraka_planet;

    // Also check reverse (candidate's AK = current user's DK)
    const isReverseSoulmate = 
      currentProfile.darakaraka_planet && 
      profile.atmakaraka_planet && 
      currentProfile.darakaraka_planet === profile.atmakaraka_planet;

    const finalIsSoulmate = isSoulmate || isReverseSoulmate || profile.isSoulmate;
    const gunaScore = gunaResult?.score ?? 0;
    
    const matchTier = determineMatchTier(
      gunaScore,
      finalIsSoulmate,
      profile.hasNadiDosha || false
    );

    return {
      ...profile,
      gunaScore,
      gunaBreakdown: gunaResult?.breakdown,
      matchTier,
      isSoulmate: finalIsSoulmate,
    };
  });

  // Sort profiles by tier priority, then by score within tier
  profilesWithScores.sort((a, b) => {
    const tierA = getTierPriority(a.matchTier || 'spicy');
    const tierB = getTierPriority(b.matchTier || 'spicy');
    
    // First sort by tier
    if (tierA !== tierB) {
      return tierA - tierB;
    }

    // Within same tier, sort by Guna score (higher first)
    return (b.gunaScore || 0) - (a.gunaScore || 0);
  });

  return profilesWithScores;
}

/**
 * Get badge text for a profile based on match quality
 */
export function getMatchBadges(profile: MatchedProfile): string[] {
  const badges: string[] = [];

  // Soulmate badge (highest priority)
  if (profile.isSoulmate) {
    badges.push('✨ Soulmate Potential');
  }

  // Guna score badges
  if (profile.gunaScore) {
    if (profile.gunaScore >= 30) {
      badges.push('🌟 Excellent Match');
    } else if (profile.gunaScore >= 25) {
      badges.push('💫 Great Match');
    } else if (profile.gunaScore >= 18) {
      badges.push('👍 Good Match');
    }
  }

  // Warning badges
  if (profile.hasNadiDosha) {
    badges.push('⚠️ Karmic Challenge');
  }

  return badges;
}

/**
 * Get compatibility color based on Guna score
 */
export function getScoreColor(score: number): string {
  if (score >= 25) return 'text-green-600';
  if (score >= 18) return 'text-emerald-500';
  if (score >= 15) return 'text-blue-500';
  if (score >= 10) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get match tier label
 */
export function getMatchTierLabel(tier: MatchTier): string {
  switch (tier) {
    case 'soulmate':
      return 'Cosmic Destiny';
    case 'twinFlame':
      return 'Twin Flame';
    case 'auntyApproves':
      return 'Aunty Approves';
    case 'itsAVibe':
      return 'Potential Match';
    case 'spicy':
      return 'Challenging';
    case 'karmic':
      return 'Use Caution';
  }
}