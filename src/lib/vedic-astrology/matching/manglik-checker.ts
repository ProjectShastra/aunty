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
 * Check if Mars is aspected by Saturn
 * Saturn aspects 3rd, 7th, and 10th houses from its position
 */
function isMarsAspectedBySaturn(profile: VedicProfile): boolean {
  const marsHouse = profile.planets.Mars.house;
  const saturnHouse = profile.planets.Saturn.house;
  
  // Saturn aspects: 3rd, 7th, 10th from Saturn
  const saturnAspects = [
    ((saturnHouse + 2) % 12) || 12,  // 3rd house
    ((saturnHouse + 6) % 12) || 12,  // 7th house
    ((saturnHouse + 9) % 12) || 12   // 10th house
  ];
  
  // Saturn also occupies its own house
  saturnAspects.push(saturnHouse);
  
  return saturnAspects.includes(marsHouse);
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
 * Check Manglik cancellation rules
 */
function checkCancellations(profile: VedicProfile, birthDate: Date): ManglikCancellation {
  const reasons: string[] = [];
  const marsSign = profile.planets.Mars.sign;
  const marsHouse = profile.planets.Mars.house;
  
  // Rule 1: Saturn aspecting Mars
  if (isMarsAspectedBySaturn(profile)) {
    reasons.push('Saturn Aspect: Saturn aspects Mars, neutralizing the dosha');
  }
  
  // Rule 2: Mars in own signs (Aries, Scorpio) or exaltation (Capricorn)
  if (marsSign === 1 || marsSign === 8 || marsSign === 10) {
    const signName = marsSign === 1 ? 'Aries' : marsSign === 8 ? 'Scorpio' : 'Capricorn';
    reasons.push(`Sign Rule: Mars in ${signName} (own/exalted sign) reduces dosha`);
  }
  
  // Rule 3: Mars in 2nd house in Gemini/Virgo
  if (marsHouse === 2 && (marsSign === 3 || marsSign === 6)) {
    const signName = marsSign === 3 ? 'Gemini' : 'Virgo';
    reasons.push(`House Rule: Mars in 2nd house in ${signName} is not harmful`);
  }
  
  // Rule 4: Mars in 12th house in Taurus/Libra (Venus signs)
  if (marsHouse === 12 && (marsSign === 2 || marsSign === 7)) {
    const signName = marsSign === 2 ? 'Taurus' : 'Libra';
    reasons.push(`House Rule: Mars in 12th house in ${signName} is not harmful`);
  }
  
  // Rule 5: Jupiter aspect/conjunction with Mars
  if (isMarsWithJupiter(profile)) {
    reasons.push('Jupiter Rule: Jupiter conjunct/aspecting Mars cancels dosha');
  }
  
  // Rule 6: Age > 28 years (Manglik dosha weakens after 28)
  const now = new Date();
  const ageInYears = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (ageInYears > 28) {
    reasons.push(`Age Rule: Person is over 28 years old (${Math.floor(ageInYears)} years), dosha is weakened`);
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
    ? checkCancellations(boyProfile, boyProfile.birthData.date)
    : { isCancelled: false, reasons: [] };
    
  const girlCancellation = girlManglik.isManglik
    ? checkCancellations(girlProfile, girlProfile.birthData.date)
    : { isCancelled: false, reasons: [] };
  
  // Determine status
  let status: ManglikMatchResult['status'];
  let finalReason: string;
  
  // Case 1: Neither is Manglik - SAFE
  if (!boyManglik.isManglik && !girlManglik.isManglik) {
    status = 'SAFE';
    finalReason = 'Neither partner has Manglik Dosha';
  }
  // Case 2: Both are Manglik - SAFE (Manglik + Manglik cancels out)
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
