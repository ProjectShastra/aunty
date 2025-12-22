/**
 * Generates "Aunty's Tea" - a one-sentence astrological compatibility summary
 * And "Vibe Tags" for the card display
 */

import { GunaMilanResult } from '@/lib/vedic-astrology/matching';
import { MatchTier } from '@/lib/matching-utils';

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
  "Aunty sees karmic tests ahead",
  "Traditional astrologers advise caution",
  "Strong connection but challenging path",
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

const MEDIUM_PHRASES = [
  "Could be interesting with effort",
  "Some spark here worth exploring",
  "The universe is curious about this one",
  "Worth a conversation at least!",
];

const CHALLENGING_PHRASES = [
  "This one will keep you on your toes!",
  "Spicy match - not for the faint-hearted",
  "Opposites attract, but at what cost?",
  "Aunty says proceed with open eyes",
];

const KARMIC_PHRASES = [
  "Strong karmic energy - approach with awareness",
  "Past life lessons may surface here",
  "Traditional astrology flags this one",
  "Chemistry exists, but challenges await",
];

export function generateAuntysTea(
  gunaResult: GunaMilanResult | undefined,
  isSoulmate: boolean,
  isManglik: boolean,
  candidateManglik: boolean,
  hasNadiDosha?: boolean
): AuntysTea {
  // Nadi Dosha - special handling
  if (hasNadiDosha) {
    return {
      summary: KARMIC_PHRASES[Math.floor(Math.random() * KARMIC_PHRASES.length)] + 
        " " + NADI_WARNINGS[Math.floor(Math.random() * NADI_WARNINGS.length)] + ".",
      emoji: "⚠️"
    };
  }

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

  // Excellent match (25+)
  if (score >= 25) {
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
  // Good match (18-24)
  else if (score >= 18) {
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
  // Medium match (15-17)
  else if (score >= 15) {
    const base = MEDIUM_PHRASES[Math.floor(Math.random() * MEDIUM_PHRASES.length)];
    
    if (gunaResult.nadiDosha) {
      summary = `${base} ${NADI_WARNINGS[0]}.`;
    } else if (gunaResult.bhakootDosha) {
      summary = `${base} Financial planning is important.`;
    } else {
      summary = `${base} Work through differences together.`;
    }
    emoji = "🌊";
  }
  // Challenging match (< 15)
  else {
    const base = CHALLENGING_PHRASES[Math.floor(Math.random() * CHALLENGING_PHRASES.length)];
    
    if (gunaResult.nadiDosha) {
      summary = `${base} ${NADI_WARNINGS[1]}.`;
    } else {
      summary = `${base} Not impossible, but requires work.`;
    }
    emoji = "🌶️";
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
  borderColor?: string;
}

/**
 * Get vibe tag for display on card
 * Supports the new tier system with visual hierarchy
 */
export function getVibeTag(
  gunaScore: number | undefined,
  isSoulmate: boolean,
  hasNadiDosha?: boolean,
  matchTier?: MatchTier
): VibeTag {
  // Use matchTier if provided for more accurate tagging
  if (matchTier) {
    return getVibeTagFromTier(matchTier, gunaScore);
  }

  // Fallback to score-based logic
  // Nadi Dosha - karmic warning
  if (hasNadiDosha) {
    return {
      label: "Karmic Lesson",
      emoji: "⚠️",
      gradient: "from-red-500 via-rose-600 to-red-700",
      textColor: "text-white",
      borderColor: "border-red-400"
    };
  }

  // Soulmate takes highest priority
  if (isSoulmate) {
    return {
      label: "Destiny",
      emoji: "✨",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      textColor: "text-white",
      borderColor: "border-purple-300"
    };
  }

  if (!gunaScore && gunaScore !== 0) {
    return {
      label: "Exploring",
      emoji: "🔮",
      gradient: "from-gray-400 to-gray-500",
      textColor: "text-white"
    };
  }

  if (gunaScore >= 25) {
    return {
      label: "Twin Flame",
      emoji: "🔥",
      gradient: "from-amber-400 via-orange-500 to-amber-600",
      textColor: "text-white",
      borderColor: "border-amber-300"
    };
  }

  if (gunaScore >= 18) {
    return {
      label: "Aunty Approves",
      emoji: "✅",
      gradient: "from-emerald-400 to-green-600",
      textColor: "text-white",
      borderColor: "border-emerald-300"
    };
  }

  if (gunaScore >= 15) {
    return {
      label: "It's a Vibe",
      emoji: "🌊",
      gradient: "from-blue-400 to-cyan-500",
      textColor: "text-white",
      borderColor: "border-blue-300"
    };
  }

  // Low score - spicy/challenging
  return {
    label: "Spicy",
    emoji: "🌶️",
    gradient: "from-orange-400 via-red-500 to-orange-600",
    textColor: "text-white",
    borderColor: "border-orange-300"
  };
}

/**
 * Get vibe tag from explicit match tier
 */
function getVibeTagFromTier(tier: MatchTier, gunaScore?: number): VibeTag {
  switch (tier) {
    case 'soulmate':
      return {
        label: "Destiny",
        emoji: "✨",
        gradient: "from-purple-500 via-pink-500 to-purple-600",
        textColor: "text-white",
        borderColor: "border-purple-300"
      };
    
    case 'twinFlame':
      return {
        label: "Twin Flame",
        emoji: "🔥",
        gradient: "from-amber-400 via-orange-500 to-amber-600",
        textColor: "text-white",
        borderColor: "border-amber-300"
      };
    
    case 'auntyApproves':
      return {
        label: "Aunty Approves",
        emoji: "✅",
        gradient: "from-emerald-400 to-green-600",
        textColor: "text-white",
        borderColor: "border-emerald-300"
      };
    
    case 'itsAVibe':
      return {
        label: "It's a Vibe",
        emoji: "🌊",
        gradient: "from-blue-400 to-cyan-500",
        textColor: "text-white",
        borderColor: "border-blue-300"
      };
    
    case 'spicy':
      return {
        label: "Spicy",
        emoji: "🌶️",
        gradient: "from-orange-400 via-red-500 to-orange-600",
        textColor: "text-white",
        borderColor: "border-orange-300"
      };
    
    case 'karmic':
      return {
        label: "Karmic Lesson",
        emoji: "⚠️",
        gradient: "from-red-500 via-rose-600 to-red-700",
        textColor: "text-white",
        borderColor: "border-red-400"
      };
    
    default:
      return {
        label: "Exploring",
        emoji: "🔮",
        gradient: "from-gray-400 to-gray-500",
        textColor: "text-white"
      };
  }
}