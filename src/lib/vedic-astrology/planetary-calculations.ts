/**
 * Planetary Position Calculator
 * 
 * Calculates planetary positions using VSOP87 and ELP2000 algorithms.
 * This is a simplified implementation suitable for astrological purposes.
 */

import { PlanetId } from './types';
import { 
  ORBITAL_ELEMENTS, 
  MEAN_LONGITUDE_J2000, 
  MEAN_ANOMALY_J2000,
  MEAN_DAILY_MOTION
} from './constants';
import { 
  normalizeDegrees, 
  degreesToRadians, 
  radiansToDegrees,
  dateToJulianDay,
  calculateLahiriAyanamsa,
  tropicalToSidereal
} from './utils';

interface PlanetaryLongitude {
  tropical: number;
  sidereal: number;
  isRetrograde: boolean;
}

/**
 * Calculate Sun's tropical longitude
 * Uses simplified VSOP87 approximation
 */
export function calculateSunPosition(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525; // Julian centuries from J2000
  
  // Mean longitude
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  
  // Mean anomaly
  const M = normalizeDegrees(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = degreesToRadians(M);
  
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  
  // True longitude
  const sunLong = normalizeDegrees(L0 + C);
  
  return sunLong;
}

/**
 * Calculate Moon's tropical longitude
 * Uses simplified ELP2000 approximation
 */
export function calculateMoonPosition(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean longitude
  let Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  
  // Mean elongation
  let D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  
  // Sun's mean anomaly
  let M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  
  // Moon's mean anomaly
  let Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  
  // Moon's argument of latitude
  let F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  
  // Normalize all angles
  Lp = normalizeDegrees(Lp);
  D = normalizeDegrees(D);
  M = normalizeDegrees(M);
  Mp = normalizeDegrees(Mp);
  F = normalizeDegrees(F);
  
  // Convert to radians
  const Drad = degreesToRadians(D);
  const Mrad = degreesToRadians(M);
  const Mprad = degreesToRadians(Mp);
  const Frad = degreesToRadians(F);
  
  // Longitude corrections (simplified - major terms only)
  let dL = 0;
  
  // Main periodic terms
  dL += 6288774 * Math.sin(Mprad);
  dL += 1274027 * Math.sin(2 * Drad - Mprad);
  dL += 658314 * Math.sin(2 * Drad);
  dL += 213618 * Math.sin(2 * Mprad);
  dL -= 185116 * Math.sin(Mrad);
  dL -= 114332 * Math.sin(2 * Frad);
  dL += 58793 * Math.sin(2 * Drad - 2 * Mprad);
  dL += 57066 * Math.sin(2 * Drad - Mrad - Mprad);
  dL += 53322 * Math.sin(2 * Drad + Mprad);
  dL += 45758 * Math.sin(2 * Drad - Mrad);
  dL -= 40923 * Math.sin(Mrad - Mprad);
  dL -= 34720 * Math.sin(Drad);
  dL -= 30383 * Math.sin(Mrad + Mprad);
  dL += 15327 * Math.sin(2 * Drad - 2 * Frad);
  
  // Convert from 0.000001 degrees to degrees
  dL = dL / 1000000;
  
  const moonLong = normalizeDegrees(Lp + dL);
  
  return moonLong;
}

/**
 * Calculate Mars position
 */
export function calculateMarsPosition(julianDay: number): { longitude: number; isRetrograde: boolean } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean elements
  const L = normalizeDegrees(355.45332 + 19140.30268 * T);
  const M = normalizeDegrees(19.387022 + 19139.85836 * T);
  
  const Mrad = degreesToRadians(M);
  
  // Equation of center (simplified)
  const C = 10.6912 * Math.sin(Mrad)
          + 0.6228 * Math.sin(2 * Mrad)
          + 0.0503 * Math.sin(3 * Mrad);
  
  const longitude = normalizeDegrees(L + C);
  
  // Simple retrograde check based on synodic cycle
  const synodic = (julianDay - 2451545.0) % 779.94; // Mars synodic period
  const isRetrograde = synodic > 340 && synodic < 420;
  
  return { longitude, isRetrograde };
}

/**
 * Calculate Mercury position
 */
export function calculateMercuryPosition(julianDay: number): { longitude: number; isRetrograde: boolean } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean elements
  const L = normalizeDegrees(252.2503235 + 149472.6746358 * T);
  const M = normalizeDegrees(174.7947 + 149472.5153 * T);
  
  const Mrad = degreesToRadians(M);
  
  // Equation of center
  const C = 23.4400 * Math.sin(Mrad)
          + 2.9818 * Math.sin(2 * Mrad)
          + 0.5255 * Math.sin(3 * Mrad);
  
  // Heliocentric to geocentric approximation
  const sunLong = calculateSunPosition(julianDay);
  const helioLong = normalizeDegrees(L + C);
  
  // Simplified geocentric correction
  const elongation = normalizeDegrees(helioLong - sunLong);
  let geoCorrection = 0;
  
  if (elongation < 180) {
    geoCorrection = -22.0 * Math.sin(degreesToRadians(elongation));
  } else {
    geoCorrection = 22.0 * Math.sin(degreesToRadians(360 - elongation));
  }
  
  const longitude = normalizeDegrees(sunLong + geoCorrection);
  
  // Mercury retrogrades about 3 times a year
  const synodic = (julianDay - 2451545.0) % 115.88;
  const isRetrograde = synodic > 50 && synodic < 75;
  
  return { longitude, isRetrograde };
}

/**
 * Calculate Venus position
 */
export function calculateVenusPosition(julianDay: number): { longitude: number; isRetrograde: boolean } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean elements
  const L = normalizeDegrees(181.9798 + 58517.8156 * T);
  const M = normalizeDegrees(50.115 + 58517.8039 * T);
  
  const Mrad = degreesToRadians(M);
  
  // Equation of center
  const C = 0.7758 * Math.sin(Mrad)
          + 0.0033 * Math.sin(2 * Mrad);
  
  // Heliocentric longitude
  const helioLong = normalizeDegrees(L + C);
  
  // Convert to geocentric (simplified)
  const sunLong = calculateSunPosition(julianDay);
  const elongation = normalizeDegrees(helioLong - sunLong);
  
  let geoCorrection = -46.0 * Math.sin(degreesToRadians(elongation));
  
  const longitude = normalizeDegrees(sunLong + geoCorrection);
  
  // Venus retrograde check
  const synodic = (julianDay - 2451545.0) % 583.92;
  const isRetrograde = synodic > 270 && synodic < 320;
  
  return { longitude, isRetrograde };
}

/**
 * Calculate Jupiter position
 */
export function calculateJupiterPosition(julianDay: number): { longitude: number; isRetrograde: boolean } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean elements
  const L = normalizeDegrees(34.40438 + 3034.9056 * T);
  const M = normalizeDegrees(20.020 + 3034.6953 * T);
  
  const Mrad = degreesToRadians(M);
  
  // Equation of center
  const C = 5.5549 * Math.sin(Mrad)
          + 0.1683 * Math.sin(2 * Mrad)
          + 0.0071 * Math.sin(3 * Mrad);
  
  const longitude = normalizeDegrees(L + C);
  
  // Jupiter retrograde (about 4 months/year)
  const synodic = (julianDay - 2451545.0) % 398.88;
  const isRetrograde = synodic > 175 && synodic < 295;
  
  return { longitude, isRetrograde };
}

/**
 * Calculate Saturn position
 */
export function calculateSaturnPosition(julianDay: number): { longitude: number; isRetrograde: boolean } {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean elements
  const L = normalizeDegrees(50.077444 + 1222.1138 * T);
  const M = normalizeDegrees(317.021 + 1222.1143 * T);
  
  const Mrad = degreesToRadians(M);
  
  // Equation of center
  const C = 6.4064 * Math.sin(Mrad)
          + 0.2284 * Math.sin(2 * Mrad)
          + 0.0107 * Math.sin(3 * Mrad);
  
  const longitude = normalizeDegrees(L + C);
  
  // Saturn retrograde (about 4.5 months/year)
  const synodic = (julianDay - 2451545.0) % 378.09;
  const isRetrograde = synodic > 165 && synodic < 300;
  
  return { longitude, isRetrograde };
}

/**
 * Calculate Rahu (North Node) position
 * Rahu is always retrograde in mean motion
 */
export function calculateRahuPosition(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525;
  
  // Mean longitude of the ascending node
  // Rahu moves backwards through the zodiac
  const meanNode = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
  
  return normalizeDegrees(meanNode);
}

/**
 * Calculate Ketu (South Node) position
 * Ketu is always exactly opposite Rahu
 */
export function calculateKetuPosition(julianDay: number): number {
  const rahuLong = calculateRahuPosition(julianDay);
  return normalizeDegrees(rahuLong + 180);
}

/**
 * Get all planetary positions for a given Julian Day
 */
export function getAllPlanetaryPositions(julianDay: number): Record<PlanetId, PlanetaryLongitude> {
  const ayanamsa = calculateLahiriAyanamsa(julianDay);
  
  const sunTropical = calculateSunPosition(julianDay);
  const moonTropical = calculateMoonPosition(julianDay);
  const mars = calculateMarsPosition(julianDay);
  const mercury = calculateMercuryPosition(julianDay);
  const venus = calculateVenusPosition(julianDay);
  const jupiter = calculateJupiterPosition(julianDay);
  const saturn = calculateSaturnPosition(julianDay);
  const rahuTropical = calculateRahuPosition(julianDay);
  const ketuTropical = calculateKetuPosition(julianDay);
  
  return {
    Sun: {
      tropical: sunTropical,
      sidereal: tropicalToSidereal(sunTropical, ayanamsa),
      isRetrograde: false // Sun never retrogrades
    },
    Moon: {
      tropical: moonTropical,
      sidereal: tropicalToSidereal(moonTropical, ayanamsa),
      isRetrograde: false // Moon never retrogrades
    },
    Mars: {
      tropical: mars.longitude,
      sidereal: tropicalToSidereal(mars.longitude, ayanamsa),
      isRetrograde: mars.isRetrograde
    },
    Mercury: {
      tropical: mercury.longitude,
      sidereal: tropicalToSidereal(mercury.longitude, ayanamsa),
      isRetrograde: mercury.isRetrograde
    },
    Jupiter: {
      tropical: jupiter.longitude,
      sidereal: tropicalToSidereal(jupiter.longitude, ayanamsa),
      isRetrograde: jupiter.isRetrograde
    },
    Venus: {
      tropical: venus.longitude,
      sidereal: tropicalToSidereal(venus.longitude, ayanamsa),
      isRetrograde: venus.isRetrograde
    },
    Saturn: {
      tropical: saturn.longitude,
      sidereal: tropicalToSidereal(saturn.longitude, ayanamsa),
      isRetrograde: saturn.isRetrograde
    },
    Rahu: {
      tropical: rahuTropical,
      sidereal: tropicalToSidereal(rahuTropical, ayanamsa),
      isRetrograde: true // Rahu is always retrograde
    },
    Ketu: {
      tropical: ketuTropical,
      sidereal: tropicalToSidereal(ketuTropical, ayanamsa),
      isRetrograde: true // Ketu is always retrograde
    }
  };
}
