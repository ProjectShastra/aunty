/**
 * Vedic Astrology Calculation Engine
 * 
 * Main entry point for calculating Vedic astrological profiles.
 * Uses Sidereal zodiac with Lahiri Ayanamsa and Whole Sign Houses.
 */

import {
  VedicProfile,
  BirthData,
  PlanetId,
  PlanetPosition,
  MoonDetails,
  DoshaStatus,
  ZODIAC_SIGNS,
  RASHI_NAMES
} from './types';
import {
  dateToJulianDay,
  calculateLahiriAyanamsa,
  getZodiacSign,
  getDegreeInSign,
  getHouseNumber,
  getNakshatraIndex,
  getNakshatraName,
  getNakshatraPada,
  getNakshatraLord,
  checkManglikDosha,
  getManglikSeverity,
  parseTimeString,
  localToUTC
} from './utils';
import { getAllPlanetaryPositions } from './planetary-calculations';
import { calculateAscendant } from './ascendant-calculator';
import { calculateJaiminiKarakas } from './jaimini-karakas';

/**
 * Calculate a complete Vedic astrological profile
 * 
 * @param date - Birth date
 * @param time - Birth time in HH:MM format (24-hour)
 * @param latitude - Birth location latitude
 * @param longitude - Birth location longitude
 * @param timezone - Timezone offset from UTC (optional, defaults to 0)
 * @returns Complete VedicProfile object
 */
export function calculateProfile(
  date: Date,
  time: string,
  latitude: number,
  longitude: number,
  timezone: number = 0
): VedicProfile {
  // Parse time and create full datetime
  const { hours, minutes } = parseTimeString(time);
  const birthDateTime = new Date(date);
  birthDateTime.setHours(hours, minutes, 0, 0);
  
  // Convert to UTC
  const utcDateTime = localToUTC(birthDateTime, timezone);
  
  // Calculate Julian Day
  const julianDay = dateToJulianDay(utcDateTime);
  
  // Calculate Lahiri Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(julianDay);
  
  // Calculate Ascendant (Lagna)
  const lagna = calculateAscendant(julianDay, latitude, longitude);
  
  // Get all planetary positions
  const planetaryPositions = getAllPlanetaryPositions(julianDay);
  
  // Build planet position records with house placements
  const planets: Record<PlanetId, PlanetPosition> = {} as Record<PlanetId, PlanetPosition>;
  const planetLongitudes: Record<PlanetId, number> = {} as Record<PlanetId, number>;
  
  const planetIds: PlanetId[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  
  for (const planetId of planetIds) {
    const pos = planetaryPositions[planetId];
    const sign = getZodiacSign(pos.sidereal);
    const degree = getDegreeInSign(pos.sidereal);
    const house = getHouseNumber(sign, lagna.sign);
    const nakshatraIdx = getNakshatraIndex(pos.sidereal);
    
    planets[planetId] = {
      planet: planetId,
      sign,
      signName: ZODIAC_SIGNS[sign],
      degree,
      totalDegree: pos.sidereal,
      house,
      isRetrograde: pos.isRetrograde,
      nakshatra: nakshatraIdx,
      nakshatraName: getNakshatraName(nakshatraIdx),
      nakshatraPada: getNakshatraPada(pos.sidereal),
      nakshatraLord: getNakshatraLord(nakshatraIdx)
    };
    
    planetLongitudes[planetId] = pos.sidereal;
  }
  
  // Build Moon details
  const moonPos = planets.Moon;
  const moon: MoonDetails = {
    sign: moonPos.sign,
    signName: moonPos.signName,
    rashiName: RASHI_NAMES[moonPos.sign],
    degree: moonPos.degree,
    totalDegree: moonPos.totalDegree,
    nakshatra: moonPos.nakshatra!,
    nakshatraName: moonPos.nakshatraName!,
    nakshatraPada: moonPos.nakshatraPada!,
    nakshatraLord: moonPos.nakshatraLord!
  };
  
  // Calculate Jaimini Karakas
  const karakas = calculateJaiminiKarakas(planetLongitudes);
  
  // Check Manglik Dosha
  const marsHouse = planets.Mars.house;
  const isManglik = checkManglikDosha(marsHouse);
  const doshas: DoshaStatus = {
    isManglik,
    manglikHouse: isManglik ? marsHouse : undefined,
    manglikSeverity: getManglikSeverity(marsHouse) || undefined
  };
  
  // Build birth data record
  const birthData: BirthData = {
    date,
    time,
    latitude,
    longitude,
    timezone
  };
  
  return {
    birthData,
    ayanamsa,
    ayanamsaName: 'Lahiri (Chitra Paksha)',
    lagna,
    moon,
    planets,
    karakas,
    doshas,
    calculatedAt: new Date(),
    julianDay
  };
}

// Re-export types and utilities
export * from './types';
export * from './utils';
export { calculateJaiminiKarakas, analyzeDarakaraka } from './jaimini-karakas';

// Matching Engine exports
export { 
  evaluateMatch,
  calculateGunaMilan,
  evaluateManglikCompatibility,
  checkManglik,
  calculateSoulmateBonus
} from './matching';

export type {
  MatchResult,
  MatchScoreBreakdown,
  GunaMilanResult,
  GunaScoreBreakdown,
  ManglikMatchResult,
  ManglikStatus,
  SoulmateResult
} from './matching';
