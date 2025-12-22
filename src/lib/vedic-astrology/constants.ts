/**
 * Vedic Astrology Constants
 * 
 * Fixed astronomical and astrological values used throughout calculations.
 */

// Lahiri Ayanamsa base values
// Ayanamsa is the difference between tropical and sidereal zodiac
export const LAHIRI_AYANAMSA_1900 = 22.460148;  // Degrees at Jan 1, 1900
export const AYANAMSA_ANNUAL_PRECESSION = 50.27 / 3600; // Degrees per year (50.27 arc seconds)

// Julian Day constants
export const J2000 = 2451545.0;  // Julian day for Jan 1, 2000, 12:00 TT
export const JD_1900 = 2415020.0; // Julian day for Jan 1, 1900

// Degrees per sign and nakshatra
export const DEGREES_PER_SIGN = 30;
export const DEGREES_PER_NAKSHATRA = 13.333333333333334; // 360 / 27
export const DEGREES_PER_PADA = 3.333333333333333; // 360 / 108

// Planetary mean motion per day (approximate, in degrees)
export const MEAN_DAILY_MOTION: Record<string, number> = {
  Sun: 0.9856,
  Moon: 13.1764,
  Mars: 0.5240,
  Mercury: 1.3833,
  Jupiter: 0.0831,
  Venus: 1.2,
  Saturn: 0.0335,
  Rahu: -0.0529,  // Retrograde
  Ketu: -0.0529   // Retrograde (always opposite Rahu)
};

// Planet orbital periods in days
export const ORBITAL_PERIODS: Record<string, number> = {
  Sun: 365.25,
  Moon: 27.32,
  Mars: 687,
  Mercury: 88,
  Jupiter: 4333,
  Venus: 225,
  Saturn: 10759,
  Rahu: 6798,
  Ketu: 6798
};

// Mean longitude at J2000 (for basic calculations)
export const MEAN_LONGITUDE_J2000: Record<string, number> = {
  Sun: 280.46646,
  Moon: 218.3164477,
  Mars: 355.45332,
  Mercury: 252.2503235,
  Jupiter: 34.40438,
  Venus: 181.9798,
  Saturn: 50.077444
};

// Mean anomaly at J2000
export const MEAN_ANOMALY_J2000: Record<string, number> = {
  Sun: 357.52911,
  Moon: 134.9633964,
  Mars: 19.387022,
  Mercury: 174.7947,
  Jupiter: 20.020,
  Venus: 50.115,
  Saturn: 317.021
};

// Orbital elements for more accurate calculations
export const ORBITAL_ELEMENTS = {
  Sun: {
    L0: 280.46646,    // Mean longitude at J2000
    L1: 36000.76983,  // Mean longitude rate per century
    M0: 357.52911,    // Mean anomaly at J2000
    M1: 35999.05029,  // Mean anomaly rate per century
    e: 0.016709,      // Eccentricity
    w: 282.9373       // Longitude of perihelion
  },
  Moon: {
    L0: 218.3165,
    L1: 481267.8813,
    M0: 134.9634,
    M1: 477198.8676,
    D0: 297.8502,     // Mean elongation
    D1: 445267.1115,
    F0: 93.2721,      // Argument of latitude
    F1: 483202.0175
  }
};

// Manglik houses (Mars in these houses from Lagna causes Manglik dosha)
export const MANGLIK_HOUSES = [1, 4, 7, 8, 12] as const;

// Karakas - planets used for Jaimini system (excluding Rahu/Ketu)
export const KARAKA_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as const;

// Vimshottari Dasha periods in years
export const DASHA_YEARS: Record<string, number> = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ketu: 7,
  Venus: 20
};

// Total Vimshottari Dasha cycle
export const TOTAL_DASHA_YEARS = 120;

// Sign elements
export const SIGN_ELEMENTS: Record<number, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  1: 'Fire',    // Aries
  2: 'Earth',   // Taurus
  3: 'Air',     // Gemini
  4: 'Water',   // Cancer
  5: 'Fire',    // Leo
  6: 'Earth',   // Virgo
  7: 'Air',     // Libra
  8: 'Water',   // Scorpio
  9: 'Fire',    // Sagittarius
  10: 'Earth',  // Capricorn
  11: 'Air',    // Aquarius
  12: 'Water'   // Pisces
};

// Sign modalities
export const SIGN_MODALITIES: Record<number, 'Cardinal' | 'Fixed' | 'Mutable'> = {
  1: 'Cardinal',  // Aries
  2: 'Fixed',     // Taurus
  3: 'Mutable',   // Gemini
  4: 'Cardinal',  // Cancer
  5: 'Fixed',     // Leo
  6: 'Mutable',   // Virgo
  7: 'Cardinal',  // Libra
  8: 'Fixed',     // Scorpio
  9: 'Mutable',   // Sagittarius
  10: 'Cardinal', // Capricorn
  11: 'Fixed',    // Aquarius
  12: 'Mutable'   // Pisces
};

// Sign rulers (lords)
export const SIGN_RULERS: Record<number, string> = {
  1: 'Mars',      // Aries
  2: 'Venus',     // Taurus
  3: 'Mercury',   // Gemini
  4: 'Moon',      // Cancer
  5: 'Sun',       // Leo
  6: 'Mercury',   // Virgo
  7: 'Venus',     // Libra
  8: 'Mars',      // Scorpio (traditional)
  9: 'Jupiter',   // Sagittarius
  10: 'Saturn',   // Capricorn
  11: 'Saturn',   // Aquarius
  12: 'Jupiter'   // Pisces
};

// Exaltation signs
export const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 1,       // Aries
  Moon: 2,      // Taurus
  Mars: 10,     // Capricorn
  Mercury: 6,   // Virgo
  Jupiter: 4,   // Cancer
  Venus: 12,    // Pisces
  Saturn: 7     // Libra
};

// Debilitation signs
export const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 7,       // Libra
  Moon: 8,      // Scorpio
  Mars: 4,      // Cancer
  Mercury: 12,  // Pisces
  Jupiter: 10,  // Capricorn
  Venus: 6,     // Virgo
  Saturn: 1     // Aries
};
