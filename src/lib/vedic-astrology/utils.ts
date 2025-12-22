/**
 * Vedic Astrology Utility Functions
 * 
 * Helper functions for astronomical and astrological calculations.
 */

import { 
  ZodiacSign, 
  HouseNumber, 
  NakshatraIndex, 
  NakshatraPada,
  PlanetId,
  NAKSHATRAS,
  NAKSHATRA_LORDS
} from './types';
import { 
  DEGREES_PER_SIGN, 
  DEGREES_PER_NAKSHATRA, 
  DEGREES_PER_PADA,
  LAHIRI_AYANAMSA_1900,
  AYANAMSA_ANNUAL_PRECESSION,
  JD_1900
} from './constants';

/**
 * Convert date to Julian Day Number
 * The Julian Day is a continuous count of days since the beginning of the Julian Period
 */
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  // Convert time to fraction of day
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;
  
  // Julian Day calculation (Meeus algorithm)
  let y = year;
  let m = month;
  
  if (month <= 2) {
    y = year - 1;
    m = month + 12;
  }
  
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  const JD = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + dayFraction + B - 1524.5;
  
  return JD;
}

/**
 * Calculate Lahiri Ayanamsa for a given Julian Day
 * Ayanamsa is the angular difference between tropical and sidereal zodiac
 */
export function calculateLahiriAyanamsa(julianDay: number): number {
  // Years since 1900
  const yearsSince1900 = (julianDay - JD_1900) / 365.25;
  
  // Lahiri ayanamsa with precession
  const ayanamsa = LAHIRI_AYANAMSA_1900 + (yearsSince1900 * AYANAMSA_ANNUAL_PRECESSION);
  
  // Apply nutation correction (simplified)
  // More accurate calculations would use full nutation series
  const T = yearsSince1900 / 100; // Centuries since 1900
  const omega = 125.04 - 1934.136 * T; // Moon's ascending node
  const nutationCorrection = -0.00478 * Math.sin(omega * Math.PI / 180);
  
  return ayanamsa + nutationCorrection;
}

/**
 * Convert tropical longitude to sidereal longitude
 */
export function tropicalToSidereal(tropicalLongitude: number, ayanamsa: number): number {
  let sidereal = tropicalLongitude - ayanamsa;
  
  // Normalize to 0-360 range
  while (sidereal < 0) sidereal += 360;
  while (sidereal >= 360) sidereal -= 360;
  
  return sidereal;
}

/**
 * Get zodiac sign (1-12) from longitude
 */
export function getZodiacSign(longitude: number): ZodiacSign {
  const normalized = normalizeDegrees(longitude);
  return (Math.floor(normalized / DEGREES_PER_SIGN) + 1) as ZodiacSign;
}

/**
 * Get degree within sign (0-30) from total longitude
 */
export function getDegreeInSign(longitude: number): number {
  const normalized = normalizeDegrees(longitude);
  return normalized % DEGREES_PER_SIGN;
}

/**
 * Get Nakshatra index (1-27) from longitude
 */
export function getNakshatraIndex(longitude: number): NakshatraIndex {
  const normalized = normalizeDegrees(longitude);
  return (Math.floor(normalized / DEGREES_PER_NAKSHATRA) + 1) as NakshatraIndex;
}

/**
 * Get Nakshatra name from index
 */
export function getNakshatraName(index: NakshatraIndex): string {
  return NAKSHATRAS[index - 1];
}

/**
 * Get Nakshatra pada (1-4) from longitude
 */
export function getNakshatraPada(longitude: number): NakshatraPada {
  const normalized = normalizeDegrees(longitude);
  const positionInNakshatra = normalized % DEGREES_PER_NAKSHATRA;
  return (Math.floor(positionInNakshatra / DEGREES_PER_PADA) + 1) as NakshatraPada;
}

/**
 * Get Nakshatra lord from index
 */
export function getNakshatraLord(index: NakshatraIndex): PlanetId {
  return NAKSHATRA_LORDS[index - 1];
}

/**
 * Calculate house number from planet sign and ascendant sign
 * Uses Whole Sign House system where Ascendant sign = 1st house
 */
export function getHouseNumber(planetSign: ZodiacSign, ascendantSign: ZodiacSign): HouseNumber {
  let house = planetSign - ascendantSign + 1;
  if (house <= 0) house += 12;
  if (house > 12) house -= 12;
  return house as HouseNumber;
}

/**
 * Normalize degrees to 0-360 range
 */
export function normalizeDegrees(degrees: number): number {
  let result = degrees % 360;
  if (result < 0) result += 360;
  return result;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate the angular distance between two points
 */
export function angularDistance(deg1: number, deg2: number): number {
  const diff = Math.abs(normalizeDegrees(deg1) - normalizeDegrees(deg2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Check if Manglik Dosha is present
 * Mars in houses 1, 4, 7, 8, or 12 from Ascendant
 */
export function checkManglikDosha(marsHouse: HouseNumber): boolean {
  return [1, 4, 7, 8, 12].includes(marsHouse);
}

/**
 * Get Manglik severity based on house position
 */
export function getManglikSeverity(marsHouse: HouseNumber): 'mild' | 'moderate' | 'severe' | null {
  if (!checkManglikDosha(marsHouse)) return null;
  
  // 7th and 8th houses are considered more severe
  if (marsHouse === 7 || marsHouse === 8) return 'severe';
  // 1st and 4th are moderate
  if (marsHouse === 1 || marsHouse === 4) return 'moderate';
  // 12th is mild
  if (marsHouse === 12) return 'mild';
  
  return null;
}

/**
 * Parse time string to hours and minutes
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hoursStr, minutesStr] = timeStr.split(':');
  return {
    hours: parseInt(hoursStr, 10) || 0,
    minutes: parseInt(minutesStr, 10) || 0
  };
}

/**
 * Convert local time to UTC given timezone offset
 */
export function localToUTC(date: Date, timezoneOffset: number): Date {
  const utcDate = new Date(date);
  utcDate.setTime(utcDate.getTime() - timezoneOffset * 60 * 60 * 1000);
  return utcDate;
}

/**
 * Calculate Local Sidereal Time
 * Used for accurate Ascendant calculation
 */
export function calculateLST(julianDay: number, longitude: number): number {
  // Days since J2000.0
  const D = julianDay - 2451545.0;
  
  // Greenwich Mean Sidereal Time
  let GMST = 280.46061837 + 360.98564736629 * D;
  GMST = normalizeDegrees(GMST);
  
  // Local Sidereal Time = GMST + longitude
  const LST = normalizeDegrees(GMST + longitude);
  
  return LST;
}

/**
 * Calculate obliquity of the ecliptic
 */
export function calculateObliquity(julianDay: number): number {
  const T = (julianDay - 2451545.0) / 36525; // Julian centuries from J2000
  
  // Mean obliquity
  const eps0 = 23.439291 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  
  return eps0;
}

/**
 * Format degree as degrees, minutes, seconds
 */
export function formatDegree(degree: number): string {
  const d = Math.floor(degree);
  const mFloat = (degree - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  
  return `${d}° ${m}' ${s}"`;
}

/**
 * Format longitude with sign
 */
export function formatLongitudeWithSign(longitude: number): string {
  const sign = getZodiacSign(longitude);
  const degree = getDegreeInSign(longitude);
  const signNames = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
  
  return `${formatDegree(degree)} ${signNames[sign - 1]}`;
}
