/**
 * Ashtakoota (Eight-fold) Matching Tables
 * 
 * These tables define the compatibility values for Guna Milan (Kundli matching)
 * based on traditional Vedic astrology principles.
 */

import { NakshatraIndex, ZodiacSign } from '../types';

// ============ VARNA (Caste) - 1 Point ============
// Sign-based Varna classification
// Brahmin (highest) > Kshatriya > Vaishya > Shudra
export type Varna = 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';

export const SIGN_VARNA: Record<ZodiacSign, Varna> = {
  1: 'Kshatriya',  // Aries
  2: 'Vaishya',    // Taurus
  3: 'Shudra',     // Gemini
  4: 'Brahmin',    // Cancer
  5: 'Kshatriya',  // Leo
  6: 'Vaishya',    // Virgo
  7: 'Shudra',     // Libra
  8: 'Brahmin',    // Scorpio
  9: 'Kshatriya',  // Sagittarius
  10: 'Vaishya',   // Capricorn
  11: 'Shudra',    // Aquarius
  12: 'Brahmin'    // Pisces
};

export const VARNA_HIERARCHY: Record<Varna, number> = {
  'Brahmin': 4,
  'Kshatriya': 3,
  'Vaishya': 2,
  'Shudra': 1
};

// ============ VASHYA (Dominance) - 2 Points ============
// Nakshatra-based Vashya classification
export type VashyaType = 'Manav' | 'Vanchar' | 'Chatushpad' | 'Jalchar' | 'Keeta';

export const SIGN_VASHYA: Record<ZodiacSign, VashyaType> = {
  1: 'Chatushpad',  // Aries - Quadruped
  2: 'Chatushpad',  // Taurus - Quadruped
  3: 'Manav',       // Gemini - Human
  4: 'Keeta',       // Cancer - Insect
  5: 'Vanchar',     // Leo - Wild
  6: 'Manav',       // Virgo - Human
  7: 'Manav',       // Libra - Human
  8: 'Keeta',       // Scorpio - Insect
  9: 'Manav',       // Sagittarius - Human (upper half)
  10: 'Jalchar',    // Capricorn - Water (lower half) / Quadruped mix
  11: 'Manav',      // Aquarius - Human
  12: 'Jalchar'     // Pisces - Water
};

// Vashya compatibility matrix (Boy's Vashya -> Girl's Vashya)
export const VASHYA_COMPATIBILITY: Record<VashyaType, Record<VashyaType, number>> = {
  'Manav': { 'Manav': 2, 'Vanchar': 1, 'Chatushpad': 1, 'Jalchar': 1, 'Keeta': 0 },
  'Vanchar': { 'Manav': 0, 'Vanchar': 2, 'Chatushpad': 1, 'Jalchar': 0, 'Keeta': 0 },
  'Chatushpad': { 'Manav': 0.5, 'Vanchar': 0, 'Chatushpad': 2, 'Jalchar': 1, 'Keeta': 0 },
  'Jalchar': { 'Manav': 0.5, 'Vanchar': 0, 'Chatushpad': 0, 'Jalchar': 2, 'Keeta': 0 },
  'Keeta': { 'Manav': 0, 'Vanchar': 0, 'Chatushpad': 0, 'Jalchar': 0, 'Keeta': 2 }
};

// ============ TARA (Birth Star) - 3 Points ============
// Based on counting from boy's nakshatra to girl's and vice versa
export const TARA_GROUPS = [
  'Janma',      // 1st - Birth star
  'Sampat',     // 2nd - Wealth
  'Vipat',      // 3rd - Danger
  'Kshema',     // 4th - Prosperity
  'Pratyak',    // 5th - Obstacles
  'Sadhak',     // 6th - Achievement
  'Vadha',      // 7th - Death
  'Mitra',      // 8th - Friend
  'Ati-Mitra'   // 9th - Best friend
] as const;

// Good Taras (full points), Neutral (half), Bad (zero)
export const TARA_SCORES: Record<typeof TARA_GROUPS[number], number> = {
  'Janma': 0,       // Bad
  'Sampat': 3,      // Good
  'Vipat': 0,       // Bad
  'Kshema': 3,      // Good
  'Pratyak': 1.5,   // Neutral
  'Sadhak': 3,      // Good
  'Vadha': 0,       // Bad
  'Mitra': 3,       // Good
  'Ati-Mitra': 3    // Good
};

// ============ YONI (Sexual Compatibility) - 4 Points ============
// Nakshatra-based animal classification
export type YoniAnimal = 'Horse' | 'Elephant' | 'Sheep' | 'Serpent' | 'Dog' | 
  'Cat' | 'Rat' | 'Cow' | 'Buffalo' | 'Tiger' | 'Hare' | 'Monkey' | 'Lion' | 'Mongoose';

export const NAKSHATRA_YONI: Record<NakshatraIndex, { animal: YoniAnimal; gender: 'Male' | 'Female' }> = {
  1: { animal: 'Horse', gender: 'Male' },      // Ashwini
  2: { animal: 'Elephant', gender: 'Male' },   // Bharani
  3: { animal: 'Sheep', gender: 'Female' },    // Krittika
  4: { animal: 'Serpent', gender: 'Male' },    // Rohini
  5: { animal: 'Serpent', gender: 'Female' },  // Mrigashira
  6: { animal: 'Dog', gender: 'Female' },      // Ardra
  7: { animal: 'Cat', gender: 'Female' },      // Punarvasu
  8: { animal: 'Sheep', gender: 'Male' },      // Pushya
  9: { animal: 'Cat', gender: 'Male' },        // Ashlesha
  10: { animal: 'Rat', gender: 'Male' },       // Magha
  11: { animal: 'Rat', gender: 'Female' },     // Purva Phalguni
  12: { animal: 'Cow', gender: 'Male' },       // Uttara Phalguni
  13: { animal: 'Buffalo', gender: 'Female' }, // Hasta
  14: { animal: 'Tiger', gender: 'Female' },   // Chitra
  15: { animal: 'Buffalo', gender: 'Male' },   // Swati
  16: { animal: 'Tiger', gender: 'Male' },     // Vishakha
  17: { animal: 'Hare', gender: 'Female' },    // Anuradha
  18: { animal: 'Hare', gender: 'Male' },      // Jyeshtha
  19: { animal: 'Dog', gender: 'Male' },       // Mula
  20: { animal: 'Monkey', gender: 'Male' },    // Purva Ashadha
  21: { animal: 'Mongoose', gender: 'Male' },  // Uttara Ashadha
  22: { animal: 'Monkey', gender: 'Female' },  // Shravana
  23: { animal: 'Lion', gender: 'Female' },    // Dhanishta
  24: { animal: 'Horse', gender: 'Female' },   // Shatabhisha
  25: { animal: 'Lion', gender: 'Male' },      // Purva Bhadrapada
  26: { animal: 'Cow', gender: 'Female' },     // Uttara Bhadrapada
  27: { animal: 'Elephant', gender: 'Female' } // Revati
};

// Yoni compatibility (4 = same animal, 3 = friendly, 2 = neutral, 1 = enemy, 0 = sworn enemies)
export const YONI_ENEMIES: [YoniAnimal, YoniAnimal][] = [
  ['Horse', 'Buffalo'],
  ['Elephant', 'Lion'],
  ['Sheep', 'Monkey'],
  ['Serpent', 'Mongoose'],
  ['Dog', 'Hare'],
  ['Cat', 'Rat'],
  ['Cow', 'Tiger']
];

// ============ GRAHA MAITRI (Planetary Friendship) - 5 Points ============
// Based on Moon sign lords
export type FriendshipLevel = 'Friend' | 'Neutral' | 'Enemy';

export const PLANETARY_FRIENDSHIPS: Record<string, Record<string, FriendshipLevel>> = {
  Sun: { Moon: 'Friend', Mars: 'Friend', Jupiter: 'Friend', Venus: 'Enemy', Saturn: 'Enemy', Mercury: 'Neutral', Rahu: 'Enemy', Ketu: 'Neutral' },
  Moon: { Sun: 'Friend', Mercury: 'Friend', Mars: 'Neutral', Jupiter: 'Neutral', Venus: 'Neutral', Saturn: 'Neutral', Rahu: 'Neutral', Ketu: 'Neutral' },
  Mars: { Sun: 'Friend', Moon: 'Friend', Jupiter: 'Friend', Venus: 'Neutral', Saturn: 'Neutral', Mercury: 'Enemy', Rahu: 'Neutral', Ketu: 'Neutral' },
  Mercury: { Sun: 'Friend', Venus: 'Friend', Moon: 'Enemy', Mars: 'Neutral', Jupiter: 'Neutral', Saturn: 'Neutral', Rahu: 'Neutral', Ketu: 'Neutral' },
  Jupiter: { Sun: 'Friend', Moon: 'Friend', Mars: 'Friend', Venus: 'Enemy', Mercury: 'Enemy', Saturn: 'Neutral', Rahu: 'Enemy', Ketu: 'Neutral' },
  Venus: { Mercury: 'Friend', Saturn: 'Friend', Sun: 'Enemy', Moon: 'Enemy', Mars: 'Neutral', Jupiter: 'Neutral', Rahu: 'Neutral', Ketu: 'Neutral' },
  Saturn: { Mercury: 'Friend', Venus: 'Friend', Sun: 'Enemy', Moon: 'Enemy', Mars: 'Enemy', Jupiter: 'Neutral', Rahu: 'Friend', Ketu: 'Neutral' }
};

// Maitri scoring based on both lords' relationship
export const MAITRI_SCORES: Record<string, number> = {
  'Friend-Friend': 5,
  'Friend-Neutral': 4,
  'Neutral-Friend': 4,
  'Neutral-Neutral': 3,
  'Friend-Enemy': 1,
  'Enemy-Friend': 1,
  'Neutral-Enemy': 0.5,
  'Enemy-Neutral': 0.5,
  'Enemy-Enemy': 0
};

// ============ GANA (Temperament) - 6 Points ============
export type GanaType = 'Deva' | 'Manushya' | 'Rakshasa';

export const NAKSHATRA_GANA: Record<NakshatraIndex, GanaType> = {
  1: 'Deva',       // Ashwini
  2: 'Manushya',   // Bharani
  3: 'Rakshasa',   // Krittika
  4: 'Manushya',   // Rohini
  5: 'Deva',       // Mrigashira
  6: 'Manushya',   // Ardra
  7: 'Deva',       // Punarvasu
  8: 'Deva',       // Pushya
  9: 'Rakshasa',   // Ashlesha
  10: 'Rakshasa',  // Magha
  11: 'Manushya',  // Purva Phalguni
  12: 'Manushya',  // Uttara Phalguni
  13: 'Deva',      // Hasta
  14: 'Rakshasa',  // Chitra
  15: 'Deva',      // Swati
  16: 'Rakshasa',  // Vishakha
  17: 'Deva',      // Anuradha
  18: 'Rakshasa',  // Jyeshtha
  19: 'Rakshasa',  // Mula
  20: 'Manushya',  // Purva Ashadha
  21: 'Manushya',  // Uttara Ashadha
  22: 'Deva',      // Shravana
  23: 'Rakshasa',  // Dhanishta
  24: 'Rakshasa',  // Shatabhisha
  25: 'Manushya',  // Purva Bhadrapada
  26: 'Manushya',  // Uttara Bhadrapada
  27: 'Deva'       // Revati
};

export const GANA_COMPATIBILITY: Record<GanaType, Record<GanaType, number>> = {
  'Deva': { 'Deva': 6, 'Manushya': 5, 'Rakshasa': 1 },
  'Manushya': { 'Deva': 6, 'Manushya': 6, 'Rakshasa': 0 },
  'Rakshasa': { 'Deva': 0, 'Manushya': 0, 'Rakshasa': 6 }
};

// ============ BHAKOOT (Sign Compatibility) - 7 Points ============
// Based on relative positions of Moon signs
// Dosha occurs in 6/8, 9/5, 2/12 positions
export const BHAKOOT_DOSHA_POSITIONS = [
  [6, 8],   // 6th and 8th from each other
  [9, 5],   // 9th and 5th from each other  
  [2, 12]   // 2nd and 12th from each other
] as const;

// ============ NADI (Health/Genes) - 8 Points ============
export type NadiType = 'Aadi' | 'Madhya' | 'Antya';

export const NAKSHATRA_NADI: Record<NakshatraIndex, NadiType> = {
  1: 'Aadi',     // Ashwini
  2: 'Madhya',   // Bharani
  3: 'Antya',    // Krittika
  4: 'Antya',    // Rohini
  5: 'Madhya',   // Mrigashira
  6: 'Aadi',     // Ardra
  7: 'Aadi',     // Punarvasu
  8: 'Madhya',   // Pushya
  9: 'Antya',    // Ashlesha
  10: 'Antya',   // Magha
  11: 'Madhya',  // Purva Phalguni
  12: 'Aadi',    // Uttara Phalguni
  13: 'Aadi',    // Hasta
  14: 'Madhya',  // Chitra
  15: 'Antya',   // Swati
  16: 'Antya',   // Vishakha
  17: 'Madhya',  // Anuradha
  18: 'Aadi',    // Jyeshtha
  19: 'Aadi',    // Mula
  20: 'Madhya',  // Purva Ashadha
  21: 'Antya',   // Uttara Ashadha
  22: 'Antya',   // Shravana
  23: 'Madhya',  // Dhanishta
  24: 'Aadi',    // Shatabhisha
  25: 'Aadi',    // Purva Bhadrapada
  26: 'Madhya',  // Uttara Bhadrapada
  27: 'Antya'    // Revati
};
