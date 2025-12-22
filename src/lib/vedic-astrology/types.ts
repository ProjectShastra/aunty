/**
 * Vedic Astrology Calculation Engine - Type Definitions
 * 
 * This module defines all TypeScript interfaces for the Vedic astrology
 * calculation system using Sidereal zodiac with Lahiri Ayanamsa.
 */

// Zodiac Signs (Rashis) - 1 to 12
export type ZodiacSign = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// House numbers - 1 to 12
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Nakshatra index - 1 to 27
export type NakshatraIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27;

// Planet identifiers
export type PlanetId = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

// Zodiac sign names
export const ZODIAC_SIGNS: Record<ZodiacSign, string> = {
  1: 'Aries',
  2: 'Taurus',
  3: 'Gemini',
  4: 'Cancer',
  5: 'Leo',
  6: 'Virgo',
  7: 'Libra',
  8: 'Scorpio',
  9: 'Sagittarius',
  10: 'Capricorn',
  11: 'Aquarius',
  12: 'Pisces'
};

// Sanskrit Rashi names
export const RASHI_NAMES: Record<ZodiacSign, string> = {
  1: 'Mesha',
  2: 'Vrishabha',
  3: 'Mithuna',
  4: 'Karka',
  5: 'Simha',
  6: 'Kanya',
  7: 'Tula',
  8: 'Vrishchika',
  9: 'Dhanu',
  10: 'Makara',
  11: 'Kumbha',
  12: 'Meena'
};

// Nakshatra names (27 lunar mansions)
export const NAKSHATRAS: string[] = [
  'Ashwini',      // 1
  'Bharani',      // 2
  'Krittika',     // 3
  'Rohini',       // 4
  'Mrigashira',   // 5
  'Ardra',        // 6
  'Punarvasu',    // 7
  'Pushya',       // 8
  'Ashlesha',     // 9
  'Magha',        // 10
  'Purva Phalguni', // 11
  'Uttara Phalguni', // 12
  'Hasta',        // 13
  'Chitra',       // 14
  'Swati',        // 15
  'Vishakha',     // 16
  'Anuradha',     // 17
  'Jyeshtha',     // 18
  'Mula',         // 19
  'Purva Ashadha', // 20
  'Uttara Ashadha', // 21
  'Shravana',     // 22
  'Dhanishta',    // 23
  'Shatabhisha',  // 24
  'Purva Bhadrapada', // 25
  'Uttara Bhadrapada', // 26
  'Revati'        // 27
];

// Nakshatra Padas (quarters)
export type NakshatraPada = 1 | 2 | 3 | 4;

// Nakshatra lords (ruling planets)
export const NAKSHATRA_LORDS: PlanetId[] = [
  'Ketu',     // Ashwini
  'Venus',    // Bharani
  'Sun',      // Krittika
  'Moon',     // Rohini
  'Mars',     // Mrigashira
  'Rahu',     // Ardra
  'Jupiter',  // Punarvasu
  'Saturn',   // Pushya
  'Mercury',  // Ashlesha
  'Ketu',     // Magha
  'Venus',    // Purva Phalguni
  'Sun',      // Uttara Phalguni
  'Moon',     // Hasta
  'Mars',     // Chitra
  'Rahu',     // Swati
  'Jupiter',  // Vishakha
  'Saturn',   // Anuradha
  'Mercury',  // Jyeshtha
  'Ketu',     // Mula
  'Venus',    // Purva Ashadha
  'Sun',      // Uttara Ashadha
  'Moon',     // Shravana
  'Mars',     // Dhanishta
  'Rahu',     // Shatabhisha
  'Jupiter',  // Purva Bhadrapada
  'Saturn',   // Uttara Bhadrapada
  'Mercury'   // Revati
];

// Planet position in chart
export interface PlanetPosition {
  planet: PlanetId;
  sign: ZodiacSign;
  signName: string;
  degree: number;           // Degree within sign (0-30)
  totalDegree: number;      // Total longitude (0-360)
  house: HouseNumber;       // House from Ascendant
  isRetrograde: boolean;
  nakshatra?: NakshatraIndex;
  nakshatraName?: string;
  nakshatraPada?: NakshatraPada;
  nakshatraLord?: PlanetId;
}

// Lagna (Ascendant) details
export interface LagnaDetails {
  sign: ZodiacSign;
  signName: string;
  rashiName: string;
  degree: number;
  totalDegree: number;
}

// Moon details (important for Vedic astrology)
export interface MoonDetails {
  sign: ZodiacSign;
  signName: string;
  rashiName: string;
  degree: number;
  totalDegree: number;
  nakshatra: NakshatraIndex;
  nakshatraName: string;
  nakshatraPada: NakshatraPada;
  nakshatraLord: PlanetId;
}

// Jaimini Karakas (soul significators)
export interface JaiminiKarakas {
  atmakaraka: PlanetId;       // Highest degree - Soul significator
  amatyakaraka: PlanetId;     // 2nd highest - Career significator
  bhratrikaraka: PlanetId;    // 3rd - Siblings
  matrikaraka: PlanetId;      // 4th - Mother
  putrakaraka: PlanetId;      // 5th - Children
  gnatikaraka: PlanetId;      // 6th - Enemies/competitors
  darakaraka: PlanetId;       // Lowest degree - Spouse significator
}

// Dosha (affliction) status
export interface DoshaStatus {
  isManglik: boolean;
  manglikHouse?: HouseNumber;
  manglikSeverity?: 'mild' | 'moderate' | 'severe';
  cancellationFactors?: string[];
}

// Birth input data
export interface BirthData {
  date: Date;
  time: string;       // HH:MM format (24-hour)
  latitude: number;
  longitude: number;
  timezone?: number;  // Offset in hours from UTC
}

// Complete Vedic Profile output
export interface VedicProfile {
  // Birth data used
  birthData: BirthData;
  
  // Ayanamsa used
  ayanamsa: number;
  ayanamsaName: string;
  
  // Lagna (Ascendant)
  lagna: LagnaDetails;
  
  // Moon position
  moon: MoonDetails;
  
  // All planetary positions
  planets: Record<PlanetId, PlanetPosition>;
  
  // Jaimini Karakas
  karakas: JaiminiKarakas;
  
  // Dosha status
  doshas: DoshaStatus;
  
  // Calculation metadata
  calculatedAt: Date;
  julianDay: number;
}

// Compatibility-related types (for future matching)
export interface KutaScore {
  varna: number;      // 1 point
  vashya: number;     // 2 points
  tara: number;       // 3 points
  yoni: number;       // 4 points
  graha: number;      // 5 points
  gana: number;       // 6 points
  bhakut: number;     // 7 points
  nadi: number;       // 8 points
  total: number;      // Max 36
}

export interface CompatibilityResult {
  profile1: VedicProfile;
  profile2: VedicProfile;
  kutaScore: KutaScore;
  manglikCompatibility: boolean;
  overallScore: number;
  recommendation: string;
}
