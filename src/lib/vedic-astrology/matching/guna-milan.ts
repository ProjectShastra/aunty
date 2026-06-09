/**
 * Guna Milan (Ashtakoota) Calculator
 * 
 * Implements the 8-fold matching system for marriage compatibility
 * Based on traditional Vedic astrology principles.
 */

import { VedicProfile, NakshatraIndex, ZodiacSign, PlanetId } from '../types';
import { SIGN_RULERS } from '../constants';
import {
  SIGN_VARNA,
  VARNA_HIERARCHY,
  SIGN_VASHYA,
  VASHYA_COMPATIBILITY,
  TARA_GROUPS,
  TARA_SCORES,
  NAKSHATRA_YONI,
  YONI_ENEMIES,
  PLANETARY_FRIENDSHIPS,
  MAITRI_SCORES,
  NAKSHATRA_GANA,
  GANA_COMPATIBILITY,
  BHAKOOT_DOSHA_POSITIONS,
  NAKSHATRA_NADI,
  YoniAnimal,
  Varna,
  VashyaType,
  GanaType,
  NadiType,
  FriendshipLevel
} from './ashtakoota-tables';

export interface GunaScoreBreakdown {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  maitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
}

export interface GunaMilanResult {
  totalScore: number;
  maxScore: 36;
  breakdown: GunaScoreBreakdown;
  nadiDosha: boolean;
  bhakootDosha: boolean;
  matchStatus: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Critical Failure';
  percentage: number;
}

/**
 * Calculate Varna Koota (1 point max)
 * Boy's varna should be >= Girl's varna
 */
function calculateVarna(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): number {
  const boyVarna = SIGN_VARNA[boyMoonSign];
  const girlVarna = SIGN_VARNA[girlMoonSign];
  
  const boyRank = VARNA_HIERARCHY[boyVarna];
  const girlRank = VARNA_HIERARCHY[girlVarna];
  
  // Boy's varna should be equal or higher than girl's
  return boyRank >= girlRank ? 1 : 0;
}

/**
 * Calculate Vashya Koota (2 points max)
 * Based on dominance/control compatibility
 */
function calculateVashya(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): number {
  const boyVashya = SIGN_VASHYA[boyMoonSign];
  const girlVashya = SIGN_VASHYA[girlMoonSign];
  
  return VASHYA_COMPATIBILITY[boyVashya][girlVashya];
}

/**
 * Calculate Tara Koota (3 points max)
 * Based on birth star (nakshatra) counting
 */
function calculateTara(boyNakshatra: NakshatraIndex, girlNakshatra: NakshatraIndex): number {
  // Count from boy's nakshatra to girl's
  let count1 = ((girlNakshatra - boyNakshatra + 27) % 27);
  if (count1 === 0) count1 = 27;
  const tara1Index = (count1 - 1) % 9;
  
  // Count from girl's nakshatra to boy's
  let count2 = ((boyNakshatra - girlNakshatra + 27) % 27);
  if (count2 === 0) count2 = 27;
  const tara2Index = (count2 - 1) % 9;
  
  const tara1 = TARA_GROUPS[tara1Index];
  const tara2 = TARA_GROUPS[tara2Index];
  
  const score1 = TARA_SCORES[tara1];
  const score2 = TARA_SCORES[tara2];
  
  // Both should be favorable for full points
  if (score1 >= 1.5 && score2 >= 1.5) return 3;
  if (score1 >= 1.5 || score2 >= 1.5) return 1.5;
  return 0;
}

/**
 * Calculate Yoni Koota (4 points max)
 * Based on sexual/physical compatibility
 */
function calculateYoni(boyNakshatra: NakshatraIndex, girlNakshatra: NakshatraIndex): number {
  const boyYoni = NAKSHATRA_YONI[boyNakshatra];
  const girlYoni = NAKSHATRA_YONI[girlNakshatra];
  
  // Same animal
  if (boyYoni.animal === girlYoni.animal) {
    // Same animal, opposite gender is best
    if (boyYoni.gender !== girlYoni.gender) return 4;
    return 3; // Same gender
  }
  
  // Check for sworn enemies
  for (const [animal1, animal2] of YONI_ENEMIES) {
    if ((boyYoni.animal === animal1 && girlYoni.animal === animal2) ||
        (boyYoni.animal === animal2 && girlYoni.animal === animal1)) {
      return 0; // Enemies
    }
  }
  
  // Neutral animals
  return 2;
}

/**
 * Calculate Graha Maitri Koota (5 points max)
 * Based on Moon sign lord friendship
 */
function calculateMaitri(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): number {
  const boyLord = SIGN_RULERS[boyMoonSign] as PlanetId;
  const girlLord = SIGN_RULERS[girlMoonSign] as PlanetId;
  
  // Same lord
  if (boyLord === girlLord) return 5;
  
  // Get friendships (handle Rahu/Ketu edge cases)
  const boyToGirl = PLANETARY_FRIENDSHIPS[boyLord]?.[girlLord] || 'Neutral';
  const girlToBoy = PLANETARY_FRIENDSHIPS[girlLord]?.[boyLord] || 'Neutral';
  
  const key = `${boyToGirl}-${girlToBoy}`;
  return MAITRI_SCORES[key] ?? 2;
}

/**
 * Calculate Gana Koota (6 points max)
 * Based on temperament compatibility
 */
function calculateGana(boyNakshatra: NakshatraIndex, girlNakshatra: NakshatraIndex): number {
  const boyGana = NAKSHATRA_GANA[boyNakshatra];
  const girlGana = NAKSHATRA_GANA[girlNakshatra];
  
  return GANA_COMPATIBILITY[boyGana][girlGana];
}

/**
 * Calculate Bhakoot Koota (7 points max)
 * Based on Moon sign positions relative to each other
 */
function calculateBhakoot(boyMoonSign: ZodiacSign, girlMoonSign: ZodiacSign): { score: number; hasDosha: boolean } {
  // Calculate positions relative to each other
  let boyFromGirl = ((boyMoonSign - girlMoonSign + 12) % 12);
  if (boyFromGirl === 0) boyFromGirl = 12;
  
  let girlFromBoy = ((girlMoonSign - boyMoonSign + 12) % 12);
  if (girlFromBoy === 0) girlFromBoy = 12;
  
  // Check for dosha positions
  for (const [pos1, pos2] of BHAKOOT_DOSHA_POSITIONS) {
    if ((boyFromGirl === pos1 && girlFromBoy === pos2) ||
        (boyFromGirl === pos2 && girlFromBoy === pos1)) {
      return { score: 0, hasDosha: true };
    }
  }
  
  return { score: 7, hasDosha: false };
}

/**
 * Calculate Nadi Koota (8 points max)
 * Based on health/genetic compatibility - Most important!
 */
function calculateNadi(boyNakshatra: NakshatraIndex, girlNakshatra: NakshatraIndex): { score: number; hasDosha: boolean } {
  const boyNadi = NAKSHATRA_NADI[boyNakshatra];
  const girlNadi = NAKSHATRA_NADI[girlNakshatra];
  
  // Same Nadi is a serious dosha (genetic incompatibility)
  if (boyNadi === girlNadi) {
    return { score: 0, hasDosha: true };
  }
  
  return { score: 8, hasDosha: false };
}

/**
 * Calculate complete Guna Milan score
 */
export function calculateGunaMilan(boyProfile: VedicProfile, girlProfile: VedicProfile): GunaMilanResult {
  const boyMoonSign = boyProfile.moon.sign;
  const girlMoonSign = girlProfile.moon.sign;
  const boyNakshatra = boyProfile.moon.nakshatra;
  const girlNakshatra = girlProfile.moon.nakshatra;
  
  // Calculate each koota
  const varna = calculateVarna(boyMoonSign, girlMoonSign);
  const vashya = calculateVashya(boyMoonSign, girlMoonSign);
  const tara = calculateTara(boyNakshatra, girlNakshatra);
  const yoni = calculateYoni(boyNakshatra, girlNakshatra);
  const maitri = calculateMaitri(boyMoonSign, girlMoonSign);
  const gana = calculateGana(boyNakshatra, girlNakshatra);
  const bhakootResult = calculateBhakoot(boyMoonSign, girlMoonSign);
  const nadiResult = calculateNadi(boyNakshatra, girlNakshatra);
  
  const breakdown: GunaScoreBreakdown = {
    varna,
    vashya,
    tara,
    yoni,
    maitri,
    gana,
    bhakoot: bhakootResult.score,
    nadi: nadiResult.score
  };
  
  const totalScore = varna + vashya + tara + yoni + maitri + gana + 
                     bhakootResult.score + nadiResult.score;
  
  const percentage = Math.round((totalScore / 36) * 100);
  
  // Determine match status
  let matchStatus: GunaMilanResult['matchStatus'];
  if (totalScore >= 28) {
    matchStatus = 'Excellent';
  } else if (totalScore >= 21) {
    matchStatus = 'Good';
  } else if (totalScore >= 18) {
    matchStatus = 'Average';
  } else if (totalScore >= 14) {
    matchStatus = 'Below Average';
  } else {
    matchStatus = 'Critical Failure';
  }
  
  return {
    totalScore,
    maxScore: 36,
    breakdown,
    nadiDosha: nadiResult.hasDosha,
    bhakootDosha: bhakootResult.hasDosha,
    matchStatus,
    percentage
  };
}

// ===========================================================================
// Symmetric scoring — fix for order-dependent results (audit 3E, 2026-06)
//
// Classical Ashtakoota assigns "boy"/"girl" roles: Varna requires the boy's
// varna rank >= the girl's, and Vashya reads its table directionally. The old
// call path passed (currentUser, candidate), so whoever was browsing got the
// boy role and score(A→B) ≠ score(B→A).
//
// Convention (product decision, 2026-06):
// - Man–woman pair: classical role assignment from actual profile gender,
//   regardless of who is viewing. Matches traditional practice.
// - Same-gender / nonbinary / unknown: classical texts are silent, so we
//   compute both directions and average each koota. Labeled as our own
//   convention, not a classical rule.
// Either way the result is identical for both users in the pairing.
// ===========================================================================

export type GunaRoleConvention = 'classical-gender' | 'bidirectional-average';

export interface SymmetricGunaMilanResult extends GunaMilanResult {
  roleConvention: GunaRoleConvention;
}

function isMaleGender(gender?: string | null): boolean {
  return (gender ?? '').toLowerCase() === 'male';
}

function isFemaleGender(gender?: string | null): boolean {
  return (gender ?? '').toLowerCase() === 'female';
}

function statusForScore(totalScore: number): GunaMilanResult['matchStatus'] {
  // Same thresholds as calculateGunaMilan
  if (totalScore >= 28) return 'Excellent';
  if (totalScore >= 21) return 'Good';
  if (totalScore >= 18) return 'Average';
  if (totalScore >= 14) return 'Below Average';
  return 'Critical Failure';
}

/**
 * Order-independent Guna Milan.
 *
 * `calculateSymmetricGunaMilan(A, B, gA, gB)` always equals
 * `calculateSymmetricGunaMilan(B, A, gB, gA)` — both people in a pairing see
 * the same score. See convention note above.
 */
export function calculateSymmetricGunaMilan(
  profileA: VedicProfile,
  profileB: VedicProfile,
  genderA?: string | null,
  genderB?: string | null
): SymmetricGunaMilanResult {
  // Classical role assignment when the pair is unambiguously man–woman
  if (isMaleGender(genderA) && isFemaleGender(genderB)) {
    return { ...calculateGunaMilan(profileA, profileB), roleConvention: 'classical-gender' };
  }
  if (isFemaleGender(genderA) && isMaleGender(genderB)) {
    return { ...calculateGunaMilan(profileB, profileA), roleConvention: 'classical-gender' };
  }

  // Otherwise: average of both directions (our documented convention)
  const ab = calculateGunaMilan(profileA, profileB);
  const ba = calculateGunaMilan(profileB, profileA);

  const breakdown: GunaScoreBreakdown = {
    varna: (ab.breakdown.varna + ba.breakdown.varna) / 2,
    vashya: (ab.breakdown.vashya + ba.breakdown.vashya) / 2,
    tara: (ab.breakdown.tara + ba.breakdown.tara) / 2,
    yoni: (ab.breakdown.yoni + ba.breakdown.yoni) / 2,
    maitri: (ab.breakdown.maitri + ba.breakdown.maitri) / 2,
    gana: (ab.breakdown.gana + ba.breakdown.gana) / 2,
    bhakoot: (ab.breakdown.bhakoot + ba.breakdown.bhakoot) / 2,
    nadi: (ab.breakdown.nadi + ba.breakdown.nadi) / 2
  };

  const totalScore =
    breakdown.varna + breakdown.vashya + breakdown.tara + breakdown.yoni +
    breakdown.maitri + breakdown.gana + breakdown.bhakoot + breakdown.nadi;

  return {
    totalScore,
    maxScore: 36,
    breakdown,
    // Nadi and Bhakoot checks are symmetric pair-properties; OR for safety
    nadiDosha: ab.nadiDosha || ba.nadiDosha,
    bhakootDosha: ab.bhakootDosha || ba.bhakootDosha,
    matchStatus: statusForScore(totalScore),
    percentage: Math.round((totalScore / 36) * 100),
    roleConvention: 'bidirectional-average'
  };
}
