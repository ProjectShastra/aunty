/**
 * Ascendant (Lagna) Calculator
 * 
 * Calculates the rising sign based on birth time and location.
 * Uses spherical astronomy formulas for accuracy.
 */

import { ZodiacSign, ZODIAC_SIGNS, RASHI_NAMES, LagnaDetails } from './types';
import { 
  normalizeDegrees, 
  degreesToRadians, 
  radiansToDegrees,
  getZodiacSign,
  getDegreeInSign,
  calculateLST,
  calculateObliquity,
  tropicalToSidereal,
  calculateLahiriAyanamsa
} from './utils';

/**
 * Calculate the Ascendant (Lagna) for a given Julian Day and location
 * 
 * @param julianDay - Julian Day Number
 * @param latitude - Geographic latitude in degrees
 * @param longitude - Geographic longitude in degrees
 * @returns LagnaDetails object with sign, degree, and names
 */
export function calculateAscendant(
  julianDay: number, 
  latitude: number, 
  longitude: number
): LagnaDetails {
  // Calculate Local Sidereal Time
  const LST = calculateLST(julianDay, longitude);
  
  // Calculate obliquity of the ecliptic
  const obliquity = calculateObliquity(julianDay);
  
  // Convert to radians
  const LSTrad = degreesToRadians(LST);
  const latRad = degreesToRadians(latitude);
  const oblRad = degreesToRadians(obliquity);
  
  // Calculate tropical Ascendant using spherical trigonometry
  // tan(ASC) = cos(LST) / (-sin(LST)*cos(obliquity) - tan(latitude)*sin(obliquity))
  
  const cosLST = Math.cos(LSTrad);
  const sinLST = Math.sin(LSTrad);
  const cosObl = Math.cos(oblRad);
  const sinObl = Math.sin(oblRad);
  const tanLat = Math.tan(latRad);
  
  const denominator = -(sinLST * cosObl) - (tanLat * sinObl);
  
  let ascTropical: number;
  
  if (Math.abs(denominator) < 0.000001) {
    // Handle near-zero denominator
    ascTropical = LST;
  } else {
    ascTropical = radiansToDegrees(Math.atan2(cosLST, denominator));
  }
  
  // Adjust for quadrant
  ascTropical = normalizeDegrees(ascTropical);
  
  // If LST is in the 2nd or 3rd quadrant (90-270), ASC should be in 3rd or 4th
  if (LST >= 90 && LST < 270) {
    if (ascTropical < 180) {
      ascTropical += 180;
    }
  } else {
    if (ascTropical >= 180) {
      ascTropical -= 180;
    }
  }
  
  ascTropical = normalizeDegrees(ascTropical);
  
  // Convert to sidereal using Lahiri ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(julianDay);
  const ascSidereal = tropicalToSidereal(ascTropical, ayanamsa);
  
  // Get sign and degree
  const sign = getZodiacSign(ascSidereal);
  const degree = getDegreeInSign(ascSidereal);
  
  return {
    sign,
    signName: ZODIAC_SIGNS[sign],
    rashiName: RASHI_NAMES[sign],
    degree,
    totalDegree: ascSidereal
  };
}

/**
 * Calculate Ascendant for all 12 houses (for Bhava Chalit)
 * This gives the cusp degrees for each house
 * 
 * Note: In Whole Sign Houses, this is simply the start of each sign from Lagna
 */
export function calculateHouseCusps(ascendant: LagnaDetails): number[] {
  const cusps: number[] = [];
  
  // In Whole Sign Houses, each house starts at 0° of the respective sign
  for (let i = 0; i < 12; i++) {
    const houseSign = ((ascendant.sign - 1 + i) % 12) + 1;
    cusps.push((houseSign - 1) * 30);
  }
  
  return cusps;
}

/**
 * Get the 10th house (MC/Midheaven) for career analysis
 */
export function calculate10thHouse(ascendant: LagnaDetails): ZodiacSign {
  return (((ascendant.sign - 1 + 9) % 12) + 1) as ZodiacSign;
}

/**
 * Get the 7th house for marriage/partnership analysis
 */
export function calculate7thHouse(ascendant: LagnaDetails): ZodiacSign {
  return (((ascendant.sign - 1 + 6) % 12) + 1) as ZodiacSign;
}
