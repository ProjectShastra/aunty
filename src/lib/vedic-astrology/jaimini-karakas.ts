/**
 * Jaimini Karaka Calculator
 * 
 * Calculates the Chara Karakas (variable significators) based on
 * planetary degrees within their signs.
 */

import { PlanetId, JaiminiKarakas } from './types';
import { KARAKA_PLANETS } from './constants';
import { getDegreeInSign } from './utils';

interface PlanetDegree {
  planet: PlanetId;
  degreeInSign: number;
}

/**
 * Calculate Jaimini Chara Karakas
 * 
 * Karakas are determined by the degree of planets within their signs:
 * - Atmakaraka: Highest degree (Soul)
 * - Amatyakaraka: 2nd highest (Minister/Career)
 * - Bhratrikaraka: 3rd highest (Siblings)
 * - Matrikaraka: 4th highest (Mother)
 * - Putrakaraka: 5th highest (Children)
 * - Gnatikaraka: 6th highest (Relatives/Enemies)
 * - Darakaraka: Lowest degree (Spouse)
 * 
 * Note: Rahu and Ketu are excluded from Karaka calculations
 * 
 * @param planetLongitudes - Record of planet sidereal longitudes
 * @returns JaiminiKarakas object
 */
export function calculateJaiminiKarakas(
  planetLongitudes: Record<PlanetId, number>
): JaiminiKarakas {
  // Get degrees within sign for each karaka planet
  const planetDegrees: PlanetDegree[] = KARAKA_PLANETS.map(planet => ({
    planet: planet as PlanetId,
    degreeInSign: getDegreeInSign(planetLongitudes[planet as PlanetId])
  }));
  
  // Sort by degree in descending order (highest first)
  planetDegrees.sort((a, b) => b.degreeInSign - a.degreeInSign);
  
  return {
    atmakaraka: planetDegrees[0].planet,      // Highest degree
    amatyakaraka: planetDegrees[1].planet,    // 2nd highest
    bhratrikaraka: planetDegrees[2].planet,   // 3rd highest
    matrikaraka: planetDegrees[3].planet,     // 4th highest
    putrakaraka: planetDegrees[4].planet,     // 5th highest
    gnatikaraka: planetDegrees[5].planet,     // 6th highest
    darakaraka: planetDegrees[6].planet       // Lowest degree (7th = last)
  };
}

/**
 * Get the karaka name for a given planet
 */
export function getKarakaName(karakas: JaiminiKarakas, planet: PlanetId): string | null {
  if (karakas.atmakaraka === planet) return 'Atmakaraka';
  if (karakas.amatyakaraka === planet) return 'Amatyakaraka';
  if (karakas.bhratrikaraka === planet) return 'Bhratrikaraka';
  if (karakas.matrikaraka === planet) return 'Matrikaraka';
  if (karakas.putrakaraka === planet) return 'Putrakaraka';
  if (karakas.gnatikaraka === planet) return 'Gnatikaraka';
  if (karakas.darakaraka === planet) return 'Darakaraka';
  return null;
}

/**
 * Get description of what each karaka signifies
 */
export function getKarakaDescription(karakaName: string): string {
  const descriptions: Record<string, string> = {
    'Atmakaraka': 'Soul significator - represents the self, life purpose, and spiritual evolution',
    'Amatyakaraka': 'Minister - represents career, profession, and how you serve society',
    'Bhratrikaraka': 'Siblings - represents brothers, sisters, courage, and initiative',
    'Matrikaraka': 'Mother - represents mother, nurturing, and emotional foundations',
    'Putrakaraka': 'Children - represents children, creativity, and intelligence',
    'Gnatikaraka': 'Relatives - represents extended family, competitors, and obstacles',
    'Darakaraka': 'Spouse - represents marriage partner, relationships, and desires'
  };
  
  return descriptions[karakaName] || 'Unknown karaka';
}

/**
 * Analyze Darakaraka for relationship compatibility
 * The Darakaraka planet indicates the nature of the ideal spouse
 */
export function analyzeDarakaraka(darakaraka: PlanetId): {
  qualities: string[];
  challenges: string[];
  compatibility: string[];
} {
  const analysis: Record<PlanetId, { qualities: string[]; challenges: string[]; compatibility: string[] }> = {
    Sun: {
      qualities: ['Confident', 'Authoritative', 'Dignified', 'Warm-hearted'],
      challenges: ['Ego clashes', 'Need for recognition', 'Dominating tendencies'],
      compatibility: ['Leo Moon/Lagna', 'Strong Sun in partner chart']
    },
    Moon: {
      qualities: ['Nurturing', 'Emotional', 'Caring', 'Intuitive'],
      challenges: ['Mood swings', 'Dependency', 'Over-sensitivity'],
      compatibility: ['Cancer Moon/Lagna', 'Strong Moon in partner chart']
    },
    Mars: {
      qualities: ['Energetic', 'Passionate', 'Protective', 'Adventurous'],
      challenges: ['Aggression', 'Impatience', 'Conflicts'],
      compatibility: ['Aries/Scorpio Moon/Lagna', 'Strong Mars in partner chart']
    },
    Mercury: {
      qualities: ['Intellectual', 'Communicative', 'Youthful', 'Versatile'],
      challenges: ['Indecision', 'Restlessness', 'Over-analyzing'],
      compatibility: ['Gemini/Virgo Moon/Lagna', 'Strong Mercury in partner chart']
    },
    Jupiter: {
      qualities: ['Wise', 'Generous', 'Spiritual', 'Optimistic'],
      challenges: ['Over-confidence', 'Preachiness', 'Extravagance'],
      compatibility: ['Sagittarius/Pisces Moon/Lagna', 'Strong Jupiter in partner chart']
    },
    Venus: {
      qualities: ['Romantic', 'Artistic', 'Harmonious', 'Affectionate'],
      challenges: ['Indulgence', 'Vanity', 'Avoiding conflict'],
      compatibility: ['Taurus/Libra Moon/Lagna', 'Strong Venus in partner chart']
    },
    Saturn: {
      qualities: ['Mature', 'Responsible', 'Loyal', 'Structured'],
      challenges: ['Coldness', 'Restrictions', 'Delays in marriage'],
      compatibility: ['Capricorn/Aquarius Moon/Lagna', 'Strong Saturn in partner chart']
    },
    Rahu: {
      qualities: ['Unconventional', 'Foreign', 'Ambitious', 'Mysterious'],
      challenges: ['Obsession', 'Deception', 'Unusual circumstances'],
      compatibility: ['Unusual or cross-cultural connections']
    },
    Ketu: {
      qualities: ['Spiritual', 'Detached', 'Intuitive', 'Past-life connection'],
      challenges: ['Separation', 'Confusion', 'Lack of material focus'],
      compatibility: ['Spiritual or karmic connections']
    }
  };
  
  return analysis[darakaraka] || { qualities: [], challenges: [], compatibility: [] };
}
