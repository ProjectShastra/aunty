/**
 * Client-side matching utilities for the Discovery Feed
 * Handles Guna Milan scoring and profile sorting
 */

import { VedicProfile, ZodiacSign, NakshatraIndex } from '@/lib/vedic-astrology/types';
import { calculateGunaMilan, GunaMilanResult } from '@/lib/vedic-astrology/matching';

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
  gunaScore?: number;
  gunaBreakdown?: GunaMilanResult;
  matchTier?: 'excellent' | 'good' | 'average';
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
 * Sort profiles by match quality
 * Priority order:
 * 1. Soulmate connections (AK-DK match) - force to top with ✨
 * 2. Excellent matches (30+ Guna points)
 * 3. Good matches (18-29 Guna points)
 * 4. Average matches (below 18)
 * 
 * Within each tier, sort by Guna score descending
 */
export function sortProfilesByMatch(
  profiles: MatchedProfile[],
  currentProfile: CurrentUserProfile
): MatchedProfile[] {
  // Calculate Guna scores for all profiles
  const profilesWithScores = profiles.map(profile => {
    const gunaResult = calculateGunaScore(currentProfile, profile);
    
    let matchTier: 'excellent' | 'good' | 'average' = 'average';
    if (gunaResult) {
      if (gunaResult.score >= 30) {
        matchTier = 'excellent';
      } else if (gunaResult.score >= 18) {
        matchTier = 'good';
      }
    }

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

    return {
      ...profile,
      gunaScore: gunaResult?.score ?? 0,
      gunaBreakdown: gunaResult?.breakdown,
      matchTier,
      isSoulmate: isSoulmate || isReverseSoulmate || profile.isSoulmate,
    };
  });

  // Sort profiles
  profilesWithScores.sort((a, b) => {
    // Soulmates always first
    if (a.isSoulmate && !b.isSoulmate) return -1;
    if (!a.isSoulmate && b.isSoulmate) return 1;

    // Then by match tier
    const tierOrder = { excellent: 0, good: 1, average: 2 };
    const tierDiff = tierOrder[a.matchTier || 'average'] - tierOrder[b.matchTier || 'average'];
    if (tierDiff !== 0) return tierDiff;

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

  // Element compatibility (simplified)
  // This could be expanded based on element matching rules

  return badges;
}

/**
 * Get compatibility color based on Guna score
 */
export function getScoreColor(score: number): string {
  if (score >= 30) return 'text-green-600';
  if (score >= 25) return 'text-emerald-500';
  if (score >= 18) return 'text-yellow-600';
  return 'text-orange-500';
}

/**
 * Get match tier label
 */
export function getMatchTierLabel(tier: 'excellent' | 'good' | 'average'): string {
  switch (tier) {
    case 'excellent':
      return 'Highly Compatible';
    case 'good':
      return 'Compatible';
    case 'average':
      return 'May Need Work';
  }
}
