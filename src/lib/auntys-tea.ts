/**
 * Generates "Aunty's Tea" - a one-sentence astrological compatibility summary
 */

import { GunaMilanResult } from '@/lib/vedic-astrology/matching';

interface AuntysTea {
  summary: string;
  emoji: string;
}

const POSITIVE_TRAITS = [
  "Great emotional connection",
  "Strong mental compatibility",
  "Beautiful spiritual bond",
  "Natural chemistry",
  "Deep understanding",
  "Harmonious energies",
  "Complementary natures",
  "Magnetic attraction",
];

const CAUTION_TRAITS = [
  "watch out for ego clashes",
  "communication needs work",
  "different life rhythms",
  "stubbornness may arise",
  "patience is key",
  "give each other space",
  "respect differences",
  "avoid power struggles",
];

const MANGLIK_WARNINGS = [
  "Mars energy needs balance",
  "channel passion wisely",
  "patience with conflicts",
];

const NADI_WARNINGS = [
  "health compatibility needs attention",
  "consult family astrologer",
];

const SOULMATE_PHRASES = [
  "This is written in the stars, beta!",
  "Aunty sees a past-life connection here!",
  "Your souls have been searching for each other!",
  "The cosmos aligned for this match!",
];

const EXCELLENT_PHRASES = [
  "Aunty would approve this at first sight!",
  "This match makes Aunty's heart sing!",
  "Beta, this one is special!",
  "Perfect chai and pakora combo!",
];

const GOOD_PHRASES = [
  "Solid foundation for a beautiful story",
  "Good match with room to grow together",
  "The stars are mostly aligned",
  "A promising connection awaits",
];

const AVERAGE_PHRASES = [
  "Could work with effort from both sides",
  "Some challenges, but love conquers all",
  "The universe is testing you here",
  "Worth exploring if hearts are open",
];

export function generateAuntysTea(
  gunaResult: GunaMilanResult | undefined,
  isSoulmate: boolean,
  isManglik: boolean,
  candidateManglik: boolean
): AuntysTea {
  // Soulmate match - highest priority
  if (isSoulmate) {
    return {
      summary: SOULMATE_PHRASES[Math.floor(Math.random() * SOULMATE_PHRASES.length)],
      emoji: "✨"
    };
  }

  if (!gunaResult) {
    return {
      summary: "Aunty is still reading the stars for this one...",
      emoji: "🔮"
    };
  }

  const score = gunaResult.totalScore;
  const breakdown = gunaResult.breakdown;

  // Build contextual summary
  let summary = "";
  let emoji = "";

  // Excellent match (30+)
  if (score >= 30) {
    const base = EXCELLENT_PHRASES[Math.floor(Math.random() * EXCELLENT_PHRASES.length)];
    
    // Add specific praise based on high-scoring areas
    if (breakdown.nadi === 8) {
      summary = `${base} Exceptional health compatibility!`;
    } else if (breakdown.gana === 6) {
      summary = `${base} Your temperaments are perfectly matched!`;
    } else if (breakdown.maitri === 5) {
      summary = `${base} Mental wavelengths in sync!`;
    } else {
      summary = base;
    }
    emoji = "🔥";
  }
  // Good match (20-29)
  else if (score >= 20) {
    const positive = POSITIVE_TRAITS[Math.floor(Math.random() * POSITIVE_TRAITS.length)];
    
    // Add caution based on low-scoring areas
    let caution = "";
    if (breakdown.varna === 0) {
      caution = "respect each other's social views";
    } else if (breakdown.yoni === 0) {
      caution = "physical compatibility needs attention";
    } else if (breakdown.gana < 3) {
      caution = "different temperaments - compromise is key";
    } else {
      caution = CAUTION_TRAITS[Math.floor(Math.random() * CAUTION_TRAITS.length)];
    }
    
    summary = `${positive}, but ${caution}.`;
    emoji = "✅";
  }
  // Average match (18-20)
  else if (score >= 18) {
    const base = GOOD_PHRASES[Math.floor(Math.random() * GOOD_PHRASES.length)];
    
    if (gunaResult.nadiDosha) {
      summary = `${base}. ${NADI_WARNINGS[0]}.`;
    } else if (gunaResult.bhakootDosha) {
      summary = `${base}. Financial planning is important.`;
    } else {
      summary = `${base}. Work through differences together.`;
    }
    emoji = "🌊";
  }
  // Below average
  else {
    const base = AVERAGE_PHRASES[Math.floor(Math.random() * AVERAGE_PHRASES.length)];
    
    if (gunaResult.nadiDosha) {
      summary = `${base}. ${NADI_WARNINGS[1]}.`;
    } else {
      summary = `${base}. Aunty says proceed with open eyes.`;
    }
    emoji = "🤔";
  }

  // Add manglik warning if applicable
  if ((isManglik && !candidateManglik) || (!isManglik && candidateManglik)) {
    summary += ` (${MANGLIK_WARNINGS[Math.floor(Math.random() * MANGLIK_WARNINGS.length)]})`;
  }

  return { summary, emoji };
}

export interface VibeTag {
  label: string;
  emoji: string;
  gradient: string;
  textColor: string;
}

export function getVibeTag(
  gunaScore: number | undefined,
  isSoulmate: boolean
): VibeTag {
  // Soulmate takes highest priority
  if (isSoulmate) {
    return {
      label: "Destiny",
      emoji: "✨",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      textColor: "text-white"
    };
  }

  if (!gunaScore) {
    return {
      label: "Exploring",
      emoji: "🔮",
      gradient: "from-gray-400 to-gray-500",
      textColor: "text-white"
    };
  }

  if (gunaScore >= 30) {
    return {
      label: "Twin Flame",
      emoji: "🔥",
      gradient: "from-amber-400 via-orange-500 to-amber-600",
      textColor: "text-white"
    };
  }

  if (gunaScore >= 20) {
    return {
      label: "Aunty Approves",
      emoji: "✅",
      gradient: "from-emerald-400 to-green-600",
      textColor: "text-white"
    };
  }

  if (gunaScore >= 18) {
    return {
      label: "It's a Vibe",
      emoji: "🌊",
      gradient: "from-blue-400 to-cyan-500",
      textColor: "text-white"
    };
  }

  return {
    label: "Worth a Chat",
    emoji: "💭",
    gradient: "from-slate-400 to-slate-500",
    textColor: "text-white"
  };
}
