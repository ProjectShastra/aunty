// AUTO-GENERATED — DO NOT EDIT.
// Source: src/lib/vedic-astrology/matching (single source of truth).
// Regenerate with: npm run build:edge


// src/lib/vedic-astrology/constants.ts
var AYANAMSA_ANNUAL_PRECESSION = 50.27 / 3600;
var MANGLIK_HOUSES = [1, 4, 7, 8, 12];
var SIGN_RULERS = {
  1: "Mars",
  // Aries
  2: "Venus",
  // Taurus
  3: "Mercury",
  // Gemini
  4: "Moon",
  // Cancer
  5: "Sun",
  // Leo
  6: "Mercury",
  // Virgo
  7: "Venus",
  // Libra
  8: "Mars",
  // Scorpio (traditional)
  9: "Jupiter",
  // Sagittarius
  10: "Saturn",
  // Capricorn
  11: "Saturn",
  // Aquarius
  12: "Jupiter"
  // Pisces
};

// src/lib/vedic-astrology/matching/ashtakoota-tables.ts
var SIGN_VARNA = {
  1: "Kshatriya",
  // Aries
  2: "Vaishya",
  // Taurus
  3: "Shudra",
  // Gemini
  4: "Brahmin",
  // Cancer
  5: "Kshatriya",
  // Leo
  6: "Vaishya",
  // Virgo
  7: "Shudra",
  // Libra
  8: "Brahmin",
  // Scorpio
  9: "Kshatriya",
  // Sagittarius
  10: "Vaishya",
  // Capricorn
  11: "Shudra",
  // Aquarius
  12: "Brahmin"
  // Pisces
};
var VARNA_HIERARCHY = {
  "Brahmin": 4,
  "Kshatriya": 3,
  "Vaishya": 2,
  "Shudra": 1
};
var SIGN_VASHYA = {
  1: "Chatushpad",
  // Aries - Quadruped
  2: "Chatushpad",
  // Taurus - Quadruped
  3: "Manav",
  // Gemini - Human
  4: "Keeta",
  // Cancer - Insect
  5: "Vanchar",
  // Leo - Wild
  6: "Manav",
  // Virgo - Human
  7: "Manav",
  // Libra - Human
  8: "Keeta",
  // Scorpio - Insect
  9: "Manav",
  // Sagittarius - Human (upper half)
  10: "Jalchar",
  // Capricorn - Water (lower half) / Quadruped mix
  11: "Manav",
  // Aquarius - Human
  12: "Jalchar"
  // Pisces - Water
};
var VASHYA_COMPATIBILITY = {
  "Manav": { "Manav": 2, "Vanchar": 1, "Chatushpad": 1, "Jalchar": 1, "Keeta": 0 },
  "Vanchar": { "Manav": 0, "Vanchar": 2, "Chatushpad": 1, "Jalchar": 0, "Keeta": 0 },
  "Chatushpad": { "Manav": 0.5, "Vanchar": 0, "Chatushpad": 2, "Jalchar": 1, "Keeta": 0 },
  "Jalchar": { "Manav": 0.5, "Vanchar": 0, "Chatushpad": 0, "Jalchar": 2, "Keeta": 0 },
  "Keeta": { "Manav": 0, "Vanchar": 0, "Chatushpad": 0, "Jalchar": 0, "Keeta": 2 }
};
var NAKSHATRA_YONI = {
  1: { animal: "Horse", gender: "Male" },
  // Ashwini
  2: { animal: "Elephant", gender: "Male" },
  // Bharani
  3: { animal: "Sheep", gender: "Female" },
  // Krittika
  4: { animal: "Serpent", gender: "Male" },
  // Rohini
  5: { animal: "Serpent", gender: "Female" },
  // Mrigashira
  6: { animal: "Dog", gender: "Female" },
  // Ardra
  7: { animal: "Cat", gender: "Female" },
  // Punarvasu
  8: { animal: "Sheep", gender: "Male" },
  // Pushya
  9: { animal: "Cat", gender: "Male" },
  // Ashlesha
  10: { animal: "Rat", gender: "Male" },
  // Magha
  11: { animal: "Rat", gender: "Female" },
  // Purva Phalguni
  12: { animal: "Cow", gender: "Male" },
  // Uttara Phalguni
  13: { animal: "Buffalo", gender: "Female" },
  // Hasta
  14: { animal: "Tiger", gender: "Female" },
  // Chitra
  15: { animal: "Buffalo", gender: "Male" },
  // Swati
  16: { animal: "Tiger", gender: "Male" },
  // Vishakha
  17: { animal: "Hare", gender: "Female" },
  // Anuradha
  18: { animal: "Hare", gender: "Male" },
  // Jyeshtha
  19: { animal: "Dog", gender: "Male" },
  // Mula
  20: { animal: "Monkey", gender: "Male" },
  // Purva Ashadha
  21: { animal: "Mongoose", gender: "Male" },
  // Uttara Ashadha
  22: { animal: "Monkey", gender: "Female" },
  // Shravana
  23: { animal: "Lion", gender: "Female" },
  // Dhanishta
  24: { animal: "Horse", gender: "Female" },
  // Shatabhisha
  25: { animal: "Lion", gender: "Male" },
  // Purva Bhadrapada
  26: { animal: "Cow", gender: "Female" },
  // Uttara Bhadrapada
  27: { animal: "Elephant", gender: "Female" }
  // Revati
};
var YONI_ENEMIES = [
  ["Horse", "Buffalo"],
  ["Elephant", "Lion"],
  ["Sheep", "Monkey"],
  ["Serpent", "Mongoose"],
  ["Dog", "Hare"],
  ["Cat", "Rat"],
  ["Cow", "Tiger"]
];
var PLANETARY_FRIENDSHIPS = {
  Sun: { Moon: "Friend", Mars: "Friend", Jupiter: "Friend", Venus: "Enemy", Saturn: "Enemy", Mercury: "Neutral", Rahu: "Enemy", Ketu: "Neutral" },
  Moon: { Sun: "Friend", Mercury: "Friend", Mars: "Neutral", Jupiter: "Neutral", Venus: "Neutral", Saturn: "Neutral", Rahu: "Neutral", Ketu: "Neutral" },
  Mars: { Sun: "Friend", Moon: "Friend", Jupiter: "Friend", Venus: "Neutral", Saturn: "Neutral", Mercury: "Enemy", Rahu: "Neutral", Ketu: "Neutral" },
  Mercury: { Sun: "Friend", Venus: "Friend", Moon: "Enemy", Mars: "Neutral", Jupiter: "Neutral", Saturn: "Neutral", Rahu: "Neutral", Ketu: "Neutral" },
  Jupiter: { Sun: "Friend", Moon: "Friend", Mars: "Friend", Venus: "Enemy", Mercury: "Enemy", Saturn: "Neutral", Rahu: "Enemy", Ketu: "Neutral" },
  Venus: { Mercury: "Friend", Saturn: "Friend", Sun: "Enemy", Moon: "Enemy", Mars: "Neutral", Jupiter: "Neutral", Rahu: "Neutral", Ketu: "Neutral" },
  Saturn: { Mercury: "Friend", Venus: "Friend", Sun: "Enemy", Moon: "Enemy", Mars: "Enemy", Jupiter: "Neutral", Rahu: "Friend", Ketu: "Neutral" }
};
var MAITRI_SCORES = {
  "Friend-Friend": 5,
  "Friend-Neutral": 4,
  "Neutral-Friend": 4,
  "Neutral-Neutral": 3,
  "Friend-Enemy": 1,
  "Enemy-Friend": 1,
  "Neutral-Enemy": 0.5,
  "Enemy-Neutral": 0.5,
  "Enemy-Enemy": 0
};
var NAKSHATRA_GANA = {
  1: "Deva",
  // Ashwini
  2: "Manushya",
  // Bharani
  3: "Rakshasa",
  // Krittika
  4: "Manushya",
  // Rohini
  5: "Deva",
  // Mrigashira
  6: "Manushya",
  // Ardra
  7: "Deva",
  // Punarvasu
  8: "Deva",
  // Pushya
  9: "Rakshasa",
  // Ashlesha
  10: "Rakshasa",
  // Magha
  11: "Manushya",
  // Purva Phalguni
  12: "Manushya",
  // Uttara Phalguni
  13: "Deva",
  // Hasta
  14: "Rakshasa",
  // Chitra
  15: "Deva",
  // Swati
  16: "Rakshasa",
  // Vishakha
  17: "Deva",
  // Anuradha
  18: "Rakshasa",
  // Jyeshtha
  19: "Rakshasa",
  // Mula
  20: "Manushya",
  // Purva Ashadha
  21: "Manushya",
  // Uttara Ashadha
  22: "Deva",
  // Shravana
  23: "Rakshasa",
  // Dhanishta
  24: "Rakshasa",
  // Shatabhisha
  25: "Manushya",
  // Purva Bhadrapada
  26: "Manushya",
  // Uttara Bhadrapada
  27: "Deva"
  // Revati
};
var GANA_COMPATIBILITY = {
  "Deva": { "Deva": 6, "Manushya": 5, "Rakshasa": 1 },
  "Manushya": { "Deva": 6, "Manushya": 6, "Rakshasa": 0 },
  "Rakshasa": { "Deva": 0, "Manushya": 0, "Rakshasa": 6 }
};
var BHAKOOT_DOSHA_POSITIONS = [
  [6, 8],
  // 6th and 8th from each other
  [9, 5],
  // 9th and 5th from each other  
  [2, 12]
  // 2nd and 12th from each other
];
var NAKSHATRA_NADI = {
  1: "Aadi",
  // Ashwini
  2: "Madhya",
  // Bharani
  3: "Antya",
  // Krittika
  4: "Antya",
  // Rohini
  5: "Madhya",
  // Mrigashira
  6: "Aadi",
  // Ardra
  7: "Aadi",
  // Punarvasu
  8: "Madhya",
  // Pushya
  9: "Antya",
  // Ashlesha
  10: "Antya",
  // Magha
  11: "Madhya",
  // Purva Phalguni
  12: "Aadi",
  // Uttara Phalguni
  13: "Aadi",
  // Hasta
  14: "Madhya",
  // Chitra
  15: "Antya",
  // Swati
  16: "Antya",
  // Vishakha
  17: "Madhya",
  // Anuradha
  18: "Aadi",
  // Jyeshtha
  19: "Aadi",
  // Mula
  20: "Madhya",
  // Purva Ashadha
  21: "Antya",
  // Uttara Ashadha
  22: "Antya",
  // Shravana
  23: "Madhya",
  // Dhanishta
  24: "Aadi",
  // Shatabhisha
  25: "Aadi",
  // Purva Bhadrapada
  26: "Madhya",
  // Uttara Bhadrapada
  27: "Antya"
  // Revati
};

// src/lib/vedic-astrology/matching/guna-milan.ts
function calculateVarna(boyMoonSign, girlMoonSign) {
  const boyVarna = SIGN_VARNA[boyMoonSign];
  const girlVarna = SIGN_VARNA[girlMoonSign];
  const boyRank = VARNA_HIERARCHY[boyVarna];
  const girlRank = VARNA_HIERARCHY[girlVarna];
  return boyRank >= girlRank ? 1 : 0;
}
function calculateVashya(boyMoonSign, girlMoonSign) {
  const boyVashya = SIGN_VASHYA[boyMoonSign];
  const girlVashya = SIGN_VASHYA[girlMoonSign];
  return VASHYA_COMPATIBILITY[boyVashya][girlVashya];
}
function calculateTara(boyNakshatra, girlNakshatra) {
  const MALEFIC_REMAINDERS = [3, 5, 7];
  const countBoyToGirl = (girlNakshatra - boyNakshatra + 27) % 27 + 1;
  const countGirlToBoy = (boyNakshatra - girlNakshatra + 27) % 27 + 1;
  const auspicious1 = !MALEFIC_REMAINDERS.includes(countBoyToGirl % 9);
  const auspicious2 = !MALEFIC_REMAINDERS.includes(countGirlToBoy % 9);
  return (auspicious1 ? 1.5 : 0) + (auspicious2 ? 1.5 : 0);
}
function calculateYoni(boyNakshatra, girlNakshatra) {
  const boyYoni = NAKSHATRA_YONI[boyNakshatra];
  const girlYoni = NAKSHATRA_YONI[girlNakshatra];
  if (boyYoni.animal === girlYoni.animal) {
    if (boyYoni.gender !== girlYoni.gender) return 4;
    return 3;
  }
  for (const [animal1, animal2] of YONI_ENEMIES) {
    if (boyYoni.animal === animal1 && girlYoni.animal === animal2 || boyYoni.animal === animal2 && girlYoni.animal === animal1) {
      return 0;
    }
  }
  return 2;
}
function calculateMaitri(boyMoonSign, girlMoonSign) {
  const boyLord = SIGN_RULERS[boyMoonSign];
  const girlLord = SIGN_RULERS[girlMoonSign];
  if (boyLord === girlLord) return 5;
  const boyToGirl = PLANETARY_FRIENDSHIPS[boyLord]?.[girlLord] || "Neutral";
  const girlToBoy = PLANETARY_FRIENDSHIPS[girlLord]?.[boyLord] || "Neutral";
  const key = `${boyToGirl}-${girlToBoy}`;
  return MAITRI_SCORES[key] ?? 2;
}
function calculateGana(boyNakshatra, girlNakshatra) {
  const boyGana = NAKSHATRA_GANA[boyNakshatra];
  const girlGana = NAKSHATRA_GANA[girlNakshatra];
  return GANA_COMPATIBILITY[boyGana][girlGana];
}
function calculateBhakoot(boyMoonSign, girlMoonSign) {
  const boyFromGirl = (boyMoonSign - girlMoonSign + 12) % 12 + 1;
  const girlFromBoy = (girlMoonSign - boyMoonSign + 12) % 12 + 1;
  for (const [pos1, pos2] of BHAKOOT_DOSHA_POSITIONS) {
    if (boyFromGirl === pos1 && girlFromBoy === pos2 || boyFromGirl === pos2 && girlFromBoy === pos1) {
      return { score: 0, hasDosha: true };
    }
  }
  return { score: 7, hasDosha: false };
}
function calculateNadi(boyNakshatra, girlNakshatra) {
  const boyNadi = NAKSHATRA_NADI[boyNakshatra];
  const girlNadi = NAKSHATRA_NADI[girlNakshatra];
  if (boyNadi === girlNadi) {
    return { score: 0, hasDosha: true };
  }
  return { score: 8, hasDosha: false };
}
function calculateGunaMilan(boyProfile, girlProfile) {
  const boyMoonSign = boyProfile.moon.sign;
  const girlMoonSign = girlProfile.moon.sign;
  const boyNakshatra = boyProfile.moon.nakshatra;
  const girlNakshatra = girlProfile.moon.nakshatra;
  const varna = calculateVarna(boyMoonSign, girlMoonSign);
  const vashya = calculateVashya(boyMoonSign, girlMoonSign);
  const tara = calculateTara(boyNakshatra, girlNakshatra);
  const yoni = calculateYoni(boyNakshatra, girlNakshatra);
  const maitri = calculateMaitri(boyMoonSign, girlMoonSign);
  const gana = calculateGana(boyNakshatra, girlNakshatra);
  const bhakootResult = calculateBhakoot(boyMoonSign, girlMoonSign);
  const nadiResult = calculateNadi(boyNakshatra, girlNakshatra);
  const breakdown = {
    varna,
    vashya,
    tara,
    yoni,
    maitri,
    gana,
    bhakoot: bhakootResult.score,
    nadi: nadiResult.score
  };
  const totalScore = varna + vashya + tara + yoni + maitri + gana + bhakootResult.score + nadiResult.score;
  const percentage = Math.round(totalScore / 36 * 100);
  let matchStatus;
  if (totalScore >= 33) {
    matchStatus = "Excellent";
  } else if (totalScore >= 25) {
    matchStatus = "Good";
  } else if (totalScore >= 18) {
    matchStatus = "Average";
  } else if (totalScore >= 14) {
    matchStatus = "Below Average";
  } else {
    matchStatus = "Critical Failure";
  }
  return {
    totalScore,
    maxScore: 36,
    breakdown,
    nadiDosha: nadiResult.hasDosha,
    bhakootDosha: bhakootResult.hasDosha,
    matchStatus,
    percentage
  };
}
function isMaleGender(gender) {
  return (gender ?? "").toLowerCase() === "male";
}
function isFemaleGender(gender) {
  return (gender ?? "").toLowerCase() === "female";
}
function statusForScore(totalScore) {
  if (totalScore >= 33) return "Excellent";
  if (totalScore >= 25) return "Good";
  if (totalScore >= 18) return "Average";
  if (totalScore >= 14) return "Below Average";
  return "Critical Failure";
}
function calculateSymmetricGunaMilan(profileA, profileB, genderA, genderB) {
  if (isMaleGender(genderA) && isFemaleGender(genderB)) {
    return { ...calculateGunaMilan(profileA, profileB), roleConvention: "classical-gender" };
  }
  if (isFemaleGender(genderA) && isMaleGender(genderB)) {
    return { ...calculateGunaMilan(profileB, profileA), roleConvention: "classical-gender" };
  }
  const ab = calculateGunaMilan(profileA, profileB);
  const ba = calculateGunaMilan(profileB, profileA);
  const breakdown = {
    varna: (ab.breakdown.varna + ba.breakdown.varna) / 2,
    vashya: (ab.breakdown.vashya + ba.breakdown.vashya) / 2,
    tara: (ab.breakdown.tara + ba.breakdown.tara) / 2,
    yoni: (ab.breakdown.yoni + ba.breakdown.yoni) / 2,
    maitri: (ab.breakdown.maitri + ba.breakdown.maitri) / 2,
    gana: (ab.breakdown.gana + ba.breakdown.gana) / 2,
    bhakoot: (ab.breakdown.bhakoot + ba.breakdown.bhakoot) / 2,
    nadi: (ab.breakdown.nadi + ba.breakdown.nadi) / 2
  };
  const totalScore = breakdown.varna + breakdown.vashya + breakdown.tara + breakdown.yoni + breakdown.maitri + breakdown.gana + breakdown.bhakoot + breakdown.nadi;
  return {
    totalScore,
    maxScore: 36,
    breakdown,
    // Nadi and Bhakoot checks are symmetric pair-properties; OR for safety
    nadiDosha: ab.nadiDosha || ba.nadiDosha,
    bhakootDosha: ab.bhakootDosha || ba.bhakootDosha,
    matchStatus: statusForScore(totalScore),
    percentage: Math.round(totalScore / 36 * 100),
    roleConvention: "bidirectional-average"
  };
}

// src/lib/vedic-astrology/matching/manglik-checker.ts
function isMarsWithJupiter(profile) {
  const marsHouse = profile.planets.Mars.house;
  const jupiterHouse = profile.planets.Jupiter.house;
  if (marsHouse === jupiterHouse) return true;
  const jupiterAspects = [
    (jupiterHouse + 4) % 12 || 12,
    // 5th house
    (jupiterHouse + 6) % 12 || 12,
    // 7th house
    (jupiterHouse + 8) % 12 || 12
    // 9th house
  ];
  return jupiterAspects.includes(marsHouse);
}
function checkCancellations(profile) {
  const reasons = [];
  const marsSign = profile.planets.Mars.sign;
  const marsHouse = profile.planets.Mars.house;
  if (marsSign === 1 || marsSign === 8 || marsSign === 10) {
    const signName = marsSign === 1 ? "Aries" : marsSign === 8 ? "Scorpio" : "Capricorn";
    reasons.push(`Sign Rule: Mars in ${signName} (own/exalted sign) reduces dosha`);
  }
  if (marsHouse === 2 && (marsSign === 3 || marsSign === 6)) {
    const signName = marsSign === 3 ? "Gemini" : "Virgo";
    reasons.push(`House Rule: Mars in 2nd house in ${signName} is not harmful`);
  }
  if (marsHouse === 12 && (marsSign === 2 || marsSign === 7)) {
    const signName = marsSign === 2 ? "Taurus" : "Libra";
    reasons.push(`House Rule: Mars in 12th house in ${signName} is not harmful`);
  }
  if (isMarsWithJupiter(profile)) {
    reasons.push("Jupiter Rule: Jupiter conjunct/aspecting Mars cancels dosha");
  }
  return {
    isCancelled: reasons.length > 0,
    reasons
  };
}
function getManglikSeverity(marsHouse) {
  if (!MANGLIK_HOUSES.includes(marsHouse)) {
    return "none";
  }
  if (marsHouse === 7 || marsHouse === 8) return "severe";
  if (marsHouse === 1 || marsHouse === 4) return "moderate";
  return "mild";
}
function checkManglik(profile) {
  const marsHouse = profile.planets.Mars.house;
  const marsSign = profile.planets.Mars.sign;
  const isManglik = MANGLIK_HOUSES.includes(marsHouse);
  return {
    isManglik,
    marsHouse,
    marsSign,
    severity: getManglikSeverity(marsHouse)
  };
}
function evaluateManglikCompatibility(boyProfile, girlProfile) {
  const boyManglik = checkManglik(boyProfile);
  const girlManglik = checkManglik(girlProfile);
  const boyCancellation = boyManglik.isManglik ? checkCancellations(boyProfile) : { isCancelled: false, reasons: [] };
  const girlCancellation = girlManglik.isManglik ? checkCancellations(girlProfile) : { isCancelled: false, reasons: [] };
  let status;
  let finalReason;
  if (!boyManglik.isManglik && !girlManglik.isManglik) {
    status = "SAFE";
    finalReason = "Neither partner has Manglik Dosha";
  } else if (boyManglik.isManglik && girlManglik.isManglik) {
    status = "SAFE";
    finalReason = "Both partners are Manglik - doshas cancel each other";
  } else {
    const manglikPerson = boyManglik.isManglik ? "Boy" : "Girl";
    const cancellation = boyManglik.isManglik ? boyCancellation : girlCancellation;
    if (cancellation.isCancelled) {
      status = "CANCELLED";
      finalReason = `${manglikPerson} is Manglik but cancelled: ${cancellation.reasons[0]}`;
    } else {
      status = "BAD";
      finalReason = `${manglikPerson} is Manglik (Mars in House ${boyManglik.isManglik ? boyManglik.marsHouse : girlManglik.marsHouse}) without cancellation`;
    }
  }
  return {
    boyManglik,
    girlManglik,
    boyCancellation,
    girlCancellation,
    status,
    finalReason
  };
}

// src/lib/vedic-astrology/matching/soulmate-bonus.ts
function calculateNavamshaSign(totalDegree) {
  const navamshaSize = 30 / 9;
  const degreeInSign = totalDegree % 30;
  const padaInSign = Math.floor(degreeInSign / navamshaSize);
  const baseSign = Math.floor(totalDegree / 30) + 1;
  let navamshaStart;
  const signMod = (baseSign - 1) % 4 + 1;
  switch (signMod) {
    case 1:
      navamshaStart = 1;
      break;
    case 2:
      navamshaStart = 10;
      break;
    case 3:
      navamshaStart = 7;
      break;
    case 4:
      navamshaStart = 4;
      break;
    default:
      navamshaStart = 1;
  }
  const navamshaSign = (navamshaStart - 1 + padaInSign) % 12 + 1;
  return navamshaSign;
}
function checkAKDKConnection(boyProfile, girlProfile) {
  const boyAK = boyProfile.karakas.atmakaraka;
  const boyDK = boyProfile.karakas.darakaraka;
  const girlAK = girlProfile.karakas.atmakaraka;
  const girlDK = girlProfile.karakas.darakaraka;
  const boyAKMatchesGirlDK = boyAK === girlDK;
  const girlAKMatchesBoyDK = girlAK === boyDK;
  let matchType;
  if (boyAKMatchesGirlDK && girlAKMatchesBoyDK) {
    matchType = "mutual";
  } else if (boyAKMatchesGirlDK) {
    matchType = "boy-to-girl";
  } else if (girlAKMatchesBoyDK) {
    matchType = "girl-to-boy";
  } else {
    matchType = "none";
  }
  return {
    match: matchType !== "none",
    matchType,
    boyAK,
    girlDK,
    girlAK,
    boyDK
  };
}
function checkNavamshaOverlay(boyProfile, girlProfile) {
  const boyMoonNavamsha = calculateNavamshaSign(boyProfile.moon.totalDegree);
  const girlLagnaNavamsha = calculateNavamshaSign(girlProfile.lagna.totalDegree);
  const girlMoonNavamsha = calculateNavamshaSign(girlProfile.moon.totalDegree);
  const boyLagnaNavamsha = calculateNavamshaSign(boyProfile.lagna.totalDegree);
  const boyMoonGirlLagna = boyMoonNavamsha === girlLagnaNavamsha;
  const girlMoonBoyLagna = girlMoonNavamsha === boyLagnaNavamsha;
  return {
    hasOverlay: boyMoonGirlLagna || girlMoonBoyLagna,
    boyMoonSign: boyMoonNavamsha,
    girlLagnaSign: girlLagnaNavamsha,
    girlMoonSign: girlMoonNavamsha,
    boyLagnaSign: boyLagnaNavamsha,
    moonLagnaMatch: boyMoonGirlLagna || girlMoonBoyLagna
  };
}
function calculateSoulmateBonus(boyProfile, girlProfile) {
  const akDkResult = checkAKDKConnection(boyProfile, girlProfile);
  const navamshaResult = checkNavamshaOverlay(boyProfile, girlProfile);
  const badges = [];
  let bonusPoints = 0;
  if (akDkResult.match) {
    if (akDkResult.matchType === "mutual") {
      bonusPoints += 10;
      badges.push("Perfect Soulmate Match");
      badges.push("Mutual AK-DK Connection");
    } else {
      bonusPoints += 5;
      badges.push("Soulmate Potential");
    }
  }
  if (navamshaResult.hasOverlay) {
    bonusPoints += 3;
    badges.push("Deep Attraction");
  }
  if (boyProfile.karakas.atmakaraka === girlProfile.karakas.atmakaraka) {
    bonusPoints += 2;
    badges.push("Shared Soul Purpose");
  }
  if (boyProfile.moon.nakshatra === girlProfile.moon.nakshatra) {
    bonusPoints += 2;
    badges.push("Emotional Twins");
  }
  return {
    hasSoulmateConnection: akDkResult.match,
    akDkMatch: akDkResult.match,
    akDkDetails: {
      boyAK: akDkResult.boyAK,
      girlDK: akDkResult.girlDK,
      girlAK: akDkResult.girlAK,
      boyDK: akDkResult.boyDK,
      matchType: akDkResult.matchType
    },
    deepAttraction: navamshaResult.hasOverlay,
    attractionDetails: {
      boyMoonSign: navamshaResult.boyMoonSign,
      girlLagnaSign: navamshaResult.girlLagnaSign,
      girlMoonSign: navamshaResult.girlMoonSign,
      boyLagnaSign: navamshaResult.boyLagnaSign,
      moonLagnaOverlay: navamshaResult.moonLagnaMatch
    },
    bonusPoints,
    badges
  };
}

// src/lib/vedic-astrology/matching/matchingEngine.ts
function determineVerdict(gunaScore, manglikStatus, nadiDosha, soulmateBonus) {
  const effectiveScore = gunaScore + soulmateBonus;
  if (gunaScore < 18 && manglikStatus === "BAD") {
    return { verdict: "Not Recommended", matchStatus: "critical" };
  }
  if (nadiDosha && gunaScore < 18) {
    return { verdict: "Not Recommended", matchStatus: "critical" };
  }
  if (effectiveScore >= 30) {
    return { verdict: "Excellent Match", matchStatus: "approved" };
  }
  if (effectiveScore >= 24) {
    return { verdict: "Good Match", matchStatus: "approved" };
  }
  if (effectiveScore >= 18) {
    if (manglikStatus === "BAD") {
      return { verdict: "Below Average", matchStatus: "caution" };
    }
    return { verdict: "Average Match", matchStatus: "approved" };
  }
  if (effectiveScore >= 14) {
    return { verdict: "Below Average", matchStatus: "caution" };
  }
  return { verdict: "Not Recommended", matchStatus: "critical" };
}
function generateRecommendations(gunaMilan, manglik, soulmate) {
  const recommendations = [];
  if (gunaMilan.totalScore >= 28) {
    recommendations.push("Highly compatible charts with excellent prospects for a harmonious marriage.");
  } else if (gunaMilan.totalScore >= 21) {
    recommendations.push("Good compatibility. Minor adjustments may be needed in some areas.");
  } else if (gunaMilan.totalScore >= 18) {
    recommendations.push("Average compatibility. Consider other factors like family values and personal compatibility.");
  } else {
    recommendations.push("Low compatibility score. Careful consideration recommended.");
  }
  if (gunaMilan.nadiDosha) {
    recommendations.push("\u26A0\uFE0F Nadi Dosha present: May indicate health or progeny concerns. Remedies recommended.");
  }
  if (gunaMilan.bhakootDosha) {
    recommendations.push("\u26A0\uFE0F Bhakoot Dosha present: May affect financial stability. Consult for remedies.");
  }
  if (manglik.status === "BAD") {
    recommendations.push("\u26A0\uFE0F Manglik Dosha mismatch: Consider performing Kumbh Vivah or other remedies.");
  } else if (manglik.status === "CANCELLED") {
    recommendations.push("\u2713 Manglik Dosha is present but cancelled. No remedies needed.");
  }
  if (soulmate.hasSoulmateConnection) {
    recommendations.push("\u2728 Karmic soulmate connection detected. This is a spiritually significant match.");
  }
  if (soulmate.deepAttraction) {
    recommendations.push("\u{1F4AB} Deep subconscious attraction indicated through Navamsha overlay.");
  }
  return recommendations;
}
function collectBadges(gunaMilan, manglik, soulmate) {
  const badges = [...soulmate.badges];
  if (gunaMilan.totalScore >= 32) {
    badges.push("Perfect Score");
  } else if (gunaMilan.totalScore >= 28) {
    badges.push("Excellent Match");
  } else if (gunaMilan.totalScore >= 24) {
    badges.push("Strong Compatibility");
  }
  if (gunaMilan.breakdown.nadi === 8) {
    badges.push("Nadi Compatible");
  }
  if (gunaMilan.breakdown.bhakoot === 7) {
    badges.push("Bhakoot Harmony");
  }
  if (gunaMilan.breakdown.gana === 6) {
    badges.push("Temperament Match");
  }
  if (gunaMilan.breakdown.yoni === 4) {
    badges.push("Physical Compatibility");
  }
  if (manglik.status === "CANCELLED") {
    badges.push("Manglik Cancelled");
  }
  if (manglik.boyManglik.isManglik && manglik.girlManglik.isManglik) {
    badges.push("Double Manglik Safe");
  }
  return badges;
}
function evaluateMatch(boyChart, girlChart, genders) {
  const gunaMilan = genders ? calculateSymmetricGunaMilan(boyChart, girlChart, genders.a, genders.b) : calculateGunaMilan(boyChart, girlChart);
  const manglikResult = evaluateManglikCompatibility(boyChart, girlChart);
  const soulmateResult = calculateSoulmateBonus(boyChart, girlChart);
  const baseScore = gunaMilan.totalScore;
  const totalScore = baseScore + soulmateResult.bonusPoints;
  const maxPossibleScore = 36 + 17;
  const { verdict, matchStatus } = determineVerdict(
    baseScore,
    manglikResult.status,
    gunaMilan.nadiDosha,
    soulmateResult.bonusPoints
  );
  const recommendations = generateRecommendations(gunaMilan, manglikResult, soulmateResult);
  const badges = collectBadges(gunaMilan, manglikResult, soulmateResult);
  const scoreBreakdown = {
    ...gunaMilan.breakdown,
    soulmateBonus: soulmateResult.bonusPoints
  };
  const hasAnyManglik = manglikResult.boyManglik.isManglik || manglikResult.girlManglik.isManglik;
  const manglikCancelled = manglikResult.status === "CANCELLED";
  const cancellationReasons = [
    ...manglikResult.boyCancellation.reasons,
    ...manglikResult.girlCancellation.reasons
  ];
  return {
    score: totalScore,
    maxPossibleScore,
    percentage: Math.round(baseScore / 36 * 100),
    scoreBreakdown,
    gunaMilan,
    manglik: {
      hasDosha: hasAnyManglik && !manglikCancelled && manglikResult.status === "BAD",
      isCancelled: manglikCancelled,
      reason: manglikResult.finalReason,
      boyIsManglik: manglikResult.boyManglik.isManglik,
      girlIsManglik: manglikResult.girlManglik.isManglik,
      cancellationReasons
    },
    soulmate: soulmateResult,
    verdict,
    matchStatus,
    nadiDosha: gunaMilan.nadiDosha,
    bhakootDosha: gunaMilan.bhakootDosha,
    badges,
    recommendations
  };
}
export {
  calculateGunaMilan,
  calculateSoulmateBonus,
  calculateSymmetricGunaMilan,
  checkManglik,
  evaluateManglikCompatibility,
  evaluateMatch
};
