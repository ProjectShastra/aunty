/**
 * Soulmate Bonus Calculator (Jaimini System)
 * 
 * Uses Jaimini astrology principles to identify deep karmic
 * and soulmate connections between two charts.
 */

import { VedicProfile, PlanetId, ZodiacSign } from '../types';

export interface SoulmateResult {
  hasSoulmateConnection: boolean;
  akDkMatch: boolean;
  akDkDetails: {
    boyAK: PlanetId;
    girlDK: PlanetId;
    girlAK: PlanetId;
    boyDK: PlanetId;
    matchType: 'none' | 'boy-to-girl' | 'girl-to-boy' | 'mutual';
  };
  deepAttraction: boolean;
  attractionDetails: {
    boyMoonSign: ZodiacSign;
    girlLagnaSign: ZodiacSign;
    girlMoonSign: ZodiacSign;
    boyLagnaSign: ZodiacSign;
    moonLagnaOverlay: boolean;
  };
  bonusPoints: number;
  badges: string[];
}

/**
 * Calculate Navamsha (D9) sign from total longitude
 * Navamsha divides each sign into 9 parts of 3°20' each
 */
function calculateNavamshaSign(totalDegree: number): ZodiacSign {
  // Each navamsha spans 3.333... degrees
  const navamshaSize = 30 / 9; // 3.333...
  
  // Get degree within sign (0-30)
  const degreeInSign = totalDegree % 30;
  
  // Get navamsha pada (0-8 within sign)
  const padaInSign = Math.floor(degreeInSign / navamshaSize);
  
  // Get base sign (1-12)
  const baseSign = Math.floor(totalDegree / 30) + 1;
  
  // Navamsha follows a specific pattern based on sign element
  // Fire signs (1,5,9) start from Aries
  // Earth signs (2,6,10) start from Capricorn
  // Air signs (3,7,11) start from Libra
  // Water signs (4,8,12) start from Cancer
  
  let navamshaStart: number;
  const signMod = ((baseSign - 1) % 4) + 1;
  
  switch (signMod) {
    case 1: navamshaStart = 1; break;  // Fire
    case 2: navamshaStart = 10; break; // Earth
    case 3: navamshaStart = 7; break;  // Air
    case 4: navamshaStart = 4; break;  // Water
    default: navamshaStart = 1;
  }
  
  // Calculate final navamsha sign
  const navamshaSign = ((navamshaStart - 1 + padaInSign) % 12) + 1;
  
  return navamshaSign as ZodiacSign;
}

/**
 * Check Atmakaraka-Darakaraka connection
 * When one person's soul significator matches the other's spouse significator
 */
function checkAKDKConnection(boyProfile: VedicProfile, girlProfile: VedicProfile): {
  match: boolean;
  matchType: 'none' | 'boy-to-girl' | 'girl-to-boy' | 'mutual';
  boyAK: PlanetId;
  girlDK: PlanetId;
  girlAK: PlanetId;
  boyDK: PlanetId;
} {
  const boyAK = boyProfile.karakas.atmakaraka;
  const boyDK = boyProfile.karakas.darakaraka;
  const girlAK = girlProfile.karakas.atmakaraka;
  const girlDK = girlProfile.karakas.darakaraka;
  
  const boyAKMatchesGirlDK = boyAK === girlDK;
  const girlAKMatchesBoyDK = girlAK === boyDK;
  
  let matchType: 'none' | 'boy-to-girl' | 'girl-to-boy' | 'mutual';
  
  if (boyAKMatchesGirlDK && girlAKMatchesBoyDK) {
    matchType = 'mutual';
  } else if (boyAKMatchesGirlDK) {
    matchType = 'boy-to-girl';
  } else if (girlAKMatchesBoyDK) {
    matchType = 'girl-to-boy';
  } else {
    matchType = 'none';
  }
  
  return {
    match: matchType !== 'none',
    matchType,
    boyAK,
    girlDK,
    girlAK,
    boyDK
  };
}

/**
 * Check Moon-Lagna overlay in Navamsha
 * Indicates deep subconscious attraction
 */
function checkNavamshaOverlay(boyProfile: VedicProfile, girlProfile: VedicProfile): {
  hasOverlay: boolean;
  boyMoonSign: ZodiacSign;
  girlLagnaSign: ZodiacSign;
  girlMoonSign: ZodiacSign;
  boyLagnaSign: ZodiacSign;
  moonLagnaMatch: boolean;
} {
  // Calculate Navamsha positions
  const boyMoonNavamsha = calculateNavamshaSign(boyProfile.moon.totalDegree);
  const girlLagnaNavamsha = calculateNavamshaSign(girlProfile.lagna.totalDegree);
  const girlMoonNavamsha = calculateNavamshaSign(girlProfile.moon.totalDegree);
  const boyLagnaNavamsha = calculateNavamshaSign(boyProfile.lagna.totalDegree);
  
  // Check if Boy's Moon Navamsha = Girl's Lagna Navamsha (or vice versa)
  const boyMoonGirlLagna = boyMoonNavamsha === girlLagnaNavamsha;
  const girlMoonBoyLagna = girlMoonNavamsha === boyLagnaNavamsha;
  
  return {
    hasOverlay: boyMoonGirlLagna || girlMoonBoyLagna,
    boyMoonSign: boyMoonNavamsha,
    girlLagnaSign: girlLagnaNavamsha,
    girlMoonSign: girlMoonNavamsha,
    boyLagnaSign: boyLagnaNavamsha,
    moonLagnaMatch: boyMoonGirlLagna || girlMoonBoyLagna
  };
}

/**
 * Calculate complete Soulmate Bonus
 */
export function calculateSoulmateBonus(
  boyProfile: VedicProfile,
  girlProfile: VedicProfile
): SoulmateResult {
  const akDkResult = checkAKDKConnection(boyProfile, girlProfile);
  const navamshaResult = checkNavamshaOverlay(boyProfile, girlProfile);
  
  const badges: string[] = [];
  let bonusPoints = 0;
  
  // AK-DK Connection bonus
  if (akDkResult.match) {
    if (akDkResult.matchType === 'mutual') {
      bonusPoints += 10; // Double bonus for mutual connection
      badges.push('Perfect Soulmate Match');
      badges.push('Mutual AK-DK Connection');
    } else {
      bonusPoints += 5;
      badges.push('Soulmate Potential');
    }
  }
  
  // Navamsha overlay bonus
  if (navamshaResult.hasOverlay) {
    bonusPoints += 3;
    badges.push('Deep Attraction');
  }
  
  // Additional connection checks
  // Same Atmakaraka planet (shared soul purpose)
  if (boyProfile.karakas.atmakaraka === girlProfile.karakas.atmakaraka) {
    bonusPoints += 2;
    badges.push('Shared Soul Purpose');
  }
  
  // Same Moon Nakshatra (deep emotional resonance)
  if (boyProfile.moon.nakshatra === girlProfile.moon.nakshatra) {
    bonusPoints += 2;
    badges.push('Emotional Twins');
  }
  
  return {
    hasSoulmateConnection: akDkResult.match,
    akDkMatch: akDkResult.match,
    akDkDetails: {
      boyAK: akDkResult.boyAK,
      girlDK: akDkResult.girlDK,
      girlAK: akDkResult.girlAK,
      boyDK: akDkResult.boyDK,
      matchType: akDkResult.matchType
    },
    deepAttraction: navamshaResult.hasOverlay,
    attractionDetails: {
      boyMoonSign: navamshaResult.boyMoonSign,
      girlLagnaSign: navamshaResult.girlLagnaSign,
      girlMoonSign: navamshaResult.girlMoonSign,
      boyLagnaSign: navamshaResult.boyLagnaSign,
      moonLagnaOverlay: navamshaResult.moonLagnaMatch
    },
    bonusPoints,
    badges
  };
}
