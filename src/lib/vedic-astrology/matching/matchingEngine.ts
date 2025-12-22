/**
 * Vedic Astrology Matching Engine
 * 
 * Main entry point for evaluating compatibility between two birth charts.
 * Combines Guna Milan, Manglik checking, and Jaimini Soulmate analysis.
 */

import { VedicProfile } from '../types';
import { calculateGunaMilan, GunaMilanResult, GunaScoreBreakdown } from './guna-milan';
import { evaluateManglikCompatibility, ManglikMatchResult } from './manglik-checker';
import { calculateSoulmateBonus, SoulmateResult } from './soulmate-bonus';

export interface MatchScoreBreakdown extends GunaScoreBreakdown {
  soulmateBonus: number;
}

export interface MatchResult {
  // Core scores
  score: number;
  maxPossibleScore: number;
  percentage: number;
  
  // Detailed breakdown
  scoreBreakdown: MatchScoreBreakdown;
  
  // Guna Milan details
  gunaMilan: GunaMilanResult;
  
  // Manglik analysis
  manglik: {
    hasDosha: boolean;
    isCancelled: boolean;
    reason: string;
    boyIsManglik: boolean;
    girlIsManglik: boolean;
    cancellationReasons: string[];
  };
  
  // Soulmate analysis
  soulmate: SoulmateResult;
  
  // Final verdict
  verdict: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Below Average' | 'Not Recommended';
  matchStatus: 'approved' | 'caution' | 'critical';
  
  // Doshas
  nadiDosha: boolean;
  bhakootDosha: boolean;
  
  // Badges earned
  badges: string[];
  
  // Detailed recommendations
  recommendations: string[];
}

/**
 * Determine final verdict based on all factors
 */
function determineVerdict(
  gunaScore: number,
  manglikStatus: string,
  nadiDosha: boolean,
  soulmateBonus: number
): { verdict: MatchResult['verdict']; matchStatus: MatchResult['matchStatus'] } {
  const effectiveScore = gunaScore + soulmateBonus;
  
  // Critical failures
  if (gunaScore < 18 && manglikStatus === 'BAD') {
    return { verdict: 'Not Recommended', matchStatus: 'critical' };
  }
  
  if (nadiDosha && gunaScore < 18) {
    return { verdict: 'Not Recommended', matchStatus: 'critical' };
  }
  
  // Adjusted scoring with bonuses
  if (effectiveScore >= 30) {
    return { verdict: 'Excellent Match', matchStatus: 'approved' };
  }
  
  if (effectiveScore >= 24) {
    return { verdict: 'Good Match', matchStatus: 'approved' };
  }
  
  if (effectiveScore >= 18) {
    if (manglikStatus === 'BAD') {
      return { verdict: 'Below Average', matchStatus: 'caution' };
    }
    return { verdict: 'Average Match', matchStatus: 'approved' };
  }
  
  if (effectiveScore >= 14) {
    return { verdict: 'Below Average', matchStatus: 'caution' };
  }
  
  return { verdict: 'Not Recommended', matchStatus: 'critical' };
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  gunaMilan: GunaMilanResult,
  manglik: ManglikMatchResult,
  soulmate: SoulmateResult
): string[] {
  const recommendations: string[] = [];
  
  // Score-based recommendations
  if (gunaMilan.totalScore >= 28) {
    recommendations.push('Highly compatible charts with excellent prospects for a harmonious marriage.');
  } else if (gunaMilan.totalScore >= 21) {
    recommendations.push('Good compatibility. Minor adjustments may be needed in some areas.');
  } else if (gunaMilan.totalScore >= 18) {
    recommendations.push('Average compatibility. Consider other factors like family values and personal compatibility.');
  } else {
    recommendations.push('Low compatibility score. Careful consideration recommended.');
  }
  
  // Nadi Dosha
  if (gunaMilan.nadiDosha) {
    recommendations.push('⚠️ Nadi Dosha present: May indicate health or progeny concerns. Remedies recommended.');
  }
  
  // Bhakoot Dosha
  if (gunaMilan.bhakootDosha) {
    recommendations.push('⚠️ Bhakoot Dosha present: May affect financial stability. Consult for remedies.');
  }
  
  // Manglik guidance
  if (manglik.status === 'BAD') {
    recommendations.push('⚠️ Manglik Dosha mismatch: Consider performing Kumbh Vivah or other remedies.');
  } else if (manglik.status === 'CANCELLED') {
    recommendations.push('✓ Manglik Dosha is present but cancelled. No remedies needed.');
  }
  
  // Soulmate insights
  if (soulmate.hasSoulmateConnection) {
    recommendations.push('✨ Karmic soulmate connection detected. This is a spiritually significant match.');
  }
  
  if (soulmate.deepAttraction) {
    recommendations.push('💫 Deep subconscious attraction indicated through Navamsha overlay.');
  }
  
  return recommendations;
}

/**
 * Collect all earned badges
 */
function collectBadges(
  gunaMilan: GunaMilanResult,
  manglik: ManglikMatchResult,
  soulmate: SoulmateResult
): string[] {
  const badges: string[] = [...soulmate.badges];
  
  // Score badges
  if (gunaMilan.totalScore >= 32) {
    badges.push('Perfect Score');
  } else if (gunaMilan.totalScore >= 28) {
    badges.push('Excellent Match');
  } else if (gunaMilan.totalScore >= 24) {
    badges.push('Strong Compatibility');
  }
  
  // Individual koota badges
  if (gunaMilan.breakdown.nadi === 8) {
    badges.push('Nadi Compatible');
  }
  if (gunaMilan.breakdown.bhakoot === 7) {
    badges.push('Bhakoot Harmony');
  }
  if (gunaMilan.breakdown.gana === 6) {
    badges.push('Temperament Match');
  }
  if (gunaMilan.breakdown.yoni === 4) {
    badges.push('Physical Compatibility');
  }
  
  // Manglik badges
  if (manglik.status === 'CANCELLED') {
    badges.push('Manglik Cancelled');
  }
  if (manglik.boyManglik.isManglik && manglik.girlManglik.isManglik) {
    badges.push('Double Manglik Safe');
  }
  
  return badges;
}

/**
 * Main matching function
 * Evaluates compatibility between two Vedic profiles
 */
export function evaluateMatch(
  boyChart: VedicProfile,
  girlChart: VedicProfile
): MatchResult {
  // Layer 1: Guna Milan (Ashtakoota)
  const gunaMilan = calculateGunaMilan(boyChart, girlChart);
  
  // Layer 2: Manglik Safety Check
  const manglikResult = evaluateManglikCompatibility(boyChart, girlChart);
  
  // Layer 3: Soulmate Bonus (Jaimini)
  const soulmateResult = calculateSoulmateBonus(boyChart, girlChart);
  
  // Calculate total score with bonuses
  const baseScore = gunaMilan.totalScore;
  const totalScore = baseScore + soulmateResult.bonusPoints;
  const maxPossibleScore = 36 + 17; // Base 36 + max possible bonuses
  
  // Determine verdict
  const { verdict, matchStatus } = determineVerdict(
    baseScore,
    manglikResult.status,
    gunaMilan.nadiDosha,
    soulmateResult.bonusPoints
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(gunaMilan, manglikResult, soulmateResult);
  
  // Collect badges
  const badges = collectBadges(gunaMilan, manglikResult, soulmateResult);
  
  // Compile full breakdown
  const scoreBreakdown: MatchScoreBreakdown = {
    ...gunaMilan.breakdown,
    soulmateBonus: soulmateResult.bonusPoints
  };
  
  // Build manglik summary
  const hasAnyManglik = manglikResult.boyManglik.isManglik || manglikResult.girlManglik.isManglik;
  const manglikCancelled = manglikResult.status === 'CANCELLED';
  const cancellationReasons = [
    ...manglikResult.boyCancellation.reasons,
    ...manglikResult.girlCancellation.reasons
  ];
  
  return {
    score: totalScore,
    maxPossibleScore,
    percentage: Math.round((baseScore / 36) * 100),
    
    scoreBreakdown,
    gunaMilan,
    
    manglik: {
      hasDosha: hasAnyManglik && !manglikCancelled && manglikResult.status === 'BAD',
      isCancelled: manglikCancelled,
      reason: manglikResult.finalReason,
      boyIsManglik: manglikResult.boyManglik.isManglik,
      girlIsManglik: manglikResult.girlManglik.isManglik,
      cancellationReasons
    },
    
    soulmate: soulmateResult,
    
    verdict,
    matchStatus,
    
    nadiDosha: gunaMilan.nadiDosha,
    bhakootDosha: gunaMilan.bhakootDosha,
    
    badges,
    recommendations
  };
}

// Re-export types for convenience
export type { GunaMilanResult, GunaScoreBreakdown } from './guna-milan';
export type { ManglikMatchResult, ManglikStatus } from './manglik-checker';
export type { SoulmateResult } from './soulmate-bonus';
