/**
 * Manglik Dosha Checker with Cancellation Rules
 * 
 * Implements comprehensive Manglik (Mangal Dosha / Kuja Dosha) checking
 * with traditional cancellation conditions.
 */

import { VedicProfile, HouseNumber, ZodiacSign, PlanetId } from '../types';
import { MANGLIK_HOUSES } from '../constants';

export interface ManglikStatus {
  isManglik: boolean;
  marsHouse: HouseNumber;
  marsSign: ZodiacSign;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
}

export interface ManglikCancellation {
  isCancelled: boolean;
  reasons: string[];
}

export interface ManglikMatchResult {
  boyManglik: ManglikStatus;
  girlManglik: ManglikStatus;
  boyCancellation: ManglikCancellation;
  girlCancellation: ManglikCancellation;
  status: 'SAFE' | 'BAD' | 'CANCELLED';
  finalReason: string;
}

/**
 * Check if Mars is conjunct with or aspected by Jupiter
 * Jupiter aspects 5th, 7th, and 9th houses from its position
 */
function isMarsWithJupiter(profile: VedicProfile): boolean {
  const marsHouse = profile.planets.Mars.house;
  const jupiterHouse = profile.planets.Jupiter.house;
  
  // Conjunction (same house)
  if (marsHouse === jupiterHouse) return true;
  
  // Jupiter aspects: 5th, 7th, 9th from Jupiter
  const jupiterAspects = [
    ((jupiterHouse + 4) % 12) || 12,  // 5th house
    ((jupiterHouse + 6) % 12) || 12,  // 7th house
    ((jupiterHouse + 8) % 12) || 12   // 9th house
  ];
  
  return jupiterAspects.includes(marsHouse);
}

/**
 * Check Manglik cancellation rules.
 *
 * Every rule below traces to a sourced tradition (see docs/SOURCES_AUDIT.md
 * section 2). Removed 2026-06 as unsourced: "Saturn aspects Mars" (no
 * classical/named-author basis; the conjunction case is classically an
 * affliction, not a remedy) and "age > 28" (folk belief derived from Mars's
 * maturity age; BPHS/Phaladeepika contain no age-based cancellation - it
 * auto-cancelled the dosha for nearly every adult user).
 *
 * TODO (Sprint 2, tracked): replace the any-one-rule-cancels OR-stack with a
 * weighted intensity model (8th 100% > Lagna 50% > 7th 25% > 4th 12.5% >
 * 12th/2nd 6.7%), add Raman's Moon and Venus reference points and the 2nd
 * house, citing Muhurta Chintamani + Trivedi "An Insight into Kuja Dosha"
 * from the local reference library.
 */
function checkCancellations(profile: VedicProfile): ManglikCancellation {
  const reasons: string[] = [];
  const marsSign = profile.planets.Mars.sign;
  const marsHouse = profile.planets.Mars.house;
  
  // Rule: Mars in own signs (Aries, Scorpio) or exaltation (Capricorn) -
  // Muhurta Chintamani lineage (own/exalted-sign cancellation)
  if (marsSign === 1 || marsSign === 8 || marsSign === 10) {
    const signName = marsSign === 1 ? 'Aries' : marsSign === 8 ? 'Scorpio' : 'Capricorn';
    reasons.push(`Sign Rule: Mars in ${signName} (own/exalted sign) reduces dosha`);
  }
  
  // Rule: Mars in 2nd house in Gemini/Virgo - attested in the standard
  // exception lists (Mercury-sign 2nd-house relief)
  if (marsHouse === 2 && (marsSign === 3 || marsSign === 6)) {
    const signName = marsSign === 3 ? 'Gemini' : 'Virgo';
    reasons.push(`House Rule: Mars in 2nd house in ${signName} is not harmful`);
  }
  
  // Rule: Mars in 12th house in Taurus/Libra (Venus signs) - attested in
  // the standard exception lists
  if (marsHouse === 12 && (marsSign === 2 || marsSign === 7)) {
    const signName = marsSign === 2 ? 'Taurus' : 'Libra';
    reasons.push(`House Rule: Mars in 12th house in ${signName} is not harmful`);
  }
  
  // Rule: Jupiter conjunct/aspecting Mars (graha drishti 5/7/9) - widely
  // attested benefic-aspect cancellation (BPHS-lineage rules)
  if (isMarsWithJupiter(profile)) {
    reasons.push('Jupiter Rule: Jupiter conjunct/aspecting Mars cancels dosha');
  }
  
  return {
    isCancelled: reasons.length > 0,
    reasons
  };
}

/**
 * Determine Manglik severity based on house position
 */
function getManglikSeverity(marsHouse: HouseNumber): ManglikStatus['severity'] {
  if (!MANGLIK_HOUSES.includes(marsHouse as typeof MANGLIK_HOUSES[number])) {
    return 'none';
  }
  
  // 7th and 8th houses are most severe
  if (marsHouse === 7 || marsHouse === 8) return 'severe';
  
  // 1st and 4th are moderate
  if (marsHouse === 1 || marsHouse === 4) return 'moderate';
  
  // 12th is mild
  return 'mild';
}

/**
 * Check Manglik status for a single profile
 */
export function checkManglik(profile: VedicProfile): ManglikStatus {
  const marsHouse = profile.planets.Mars.house;
  const marsSign = profile.planets.Mars.sign;
  const isManglik = MANGLIK_HOUSES.includes(marsHouse as typeof MANGLIK_HOUSES[number]);
  
  return {
    isManglik,
    marsHouse,
    marsSign,
    severity: getManglikSeverity(marsHouse)
  };
}

/**
 * Evaluate Manglik compatibility between two profiles
 */
export function evaluateManglikCompatibility(
  boyProfile: VedicProfile,
  girlProfile: VedicProfile
): ManglikMatchResult {
  const boyManglik = checkManglik(boyProfile);
  const girlManglik = checkManglik(girlProfile);
  
  // Check cancellations for both
  const boyCancellation = boyManglik.isManglik 
    ? checkCancellations(boyProfile)
    : { isCancelled: false, reasons: [] };
    
  const girlCancellation = girlManglik.isManglik
    ? checkCancellations(girlProfile)
    : { isCancelled: false, reasons: [] };
  
  // Determine status
  let status: ManglikMatchResult['status'];
  let finalReason: string;
  
  // Case 1: Neither is Manglik - SAFE
  if (!boyManglik.isManglik && !girlManglik.isManglik) {
    status = 'SAFE';
    finalReason = 'Neither partner has Manglik Dosha';
  }
  // Case 2: Both are Manglik - SAFE ("Dosha Samya": mutual Manglik
  // counterbalance, standard matching practice / Raman's Muhurtha)
  else if (boyManglik.isManglik && girlManglik.isManglik) {
    status = 'SAFE';
    finalReason = 'Both partners are Manglik - doshas cancel each other';
  }
  // Case 3: Only one is Manglik - check cancellations
  else {
    const manglikPerson = boyManglik.isManglik ? 'Boy' : 'Girl';
    const cancellation = boyManglik.isManglik ? boyCancellation : girlCancellation;
    
    if (cancellation.isCancelled) {
      status = 'CANCELLED';
      finalReason = `${manglikPerson} is Manglik but cancelled: ${cancellation.reasons[0]}`;
    } else {
      status = 'BAD';
      finalReason = `${manglikPerson} is Manglik (Mars in House ${
        boyManglik.isManglik ? boyManglik.marsHouse : girlManglik.marsHouse
      }) without cancellation`;
    }
  }
  
  return {
    boyManglik,
    girlManglik,
    boyCancellation,
    girlCancellation,
    status,
    finalReason
  };
}
