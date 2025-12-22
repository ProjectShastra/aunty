/**
 * Calculate element based on Moon Sign (Vedic approach)
 * Fire: Aries, Leo, Sagittarius (1, 5, 9)
 * Earth: Taurus, Virgo, Capricorn (2, 6, 10)
 * Air: Gemini, Libra, Aquarius (3, 7, 11)
 * Water: Cancer, Scorpio, Pisces (4, 8, 12)
 */

export type Element = 'Fire' | 'Water' | 'Air' | 'Earth';

const SIGN_TO_ELEMENT: Record<number, Element> = {
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

export function getElementFromMoonSign(moonSignIndex: number): Element {
  return SIGN_TO_ELEMENT[moonSignIndex] || 'Fire';
}

/**
 * Alternative: Calculate element based on first letter of name (traditional approach)
 */
const NAME_SOUND_TO_ELEMENT: Record<string, Element> = {
  // Fire sounds
  'A': 'Fire', 'L': 'Fire', 'E': 'Fire', 'I': 'Fire', 'O': 'Fire', 'U': 'Fire',
  // Earth sounds
  'B': 'Earth', 'G': 'Earth', 'D': 'Earth', 'M': 'Earth', 'N': 'Earth',
  // Air sounds
  'K': 'Air', 'CH': 'Air', 'GH': 'Air', 'J': 'Air', 'SH': 'Air',
  // Water sounds
  'C': 'Water', 'S': 'Water', 'T': 'Water', 'TH': 'Water', 'H': 'Water',
  // Default mappings for remaining letters
  'F': 'Fire', 'P': 'Fire', 'R': 'Fire',
  'V': 'Air', 'W': 'Air', 'Y': 'Air', 'Z': 'Air',
  'Q': 'Water', 'X': 'Water'
};

export function getElementFromName(name: string): Element {
  if (!name || name.length === 0) return 'Fire';
  
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Check for digraphs first
  if (name.length >= 2) {
    const firstTwo = name.substring(0, 2).toUpperCase();
    if (NAME_SOUND_TO_ELEMENT[firstTwo]) {
      return NAME_SOUND_TO_ELEMENT[firstTwo];
    }
  }
  
  return NAME_SOUND_TO_ELEMENT[firstLetter] || 'Fire';
}
