/**
 * Vedic Astrology Matching Module
 * 
 * Exports all matching-related functionality
 */

export { evaluateMatch } from './matchingEngine';
export type { 
  MatchResult, 
  MatchScoreBreakdown,
  GunaMilanResult,
  GunaScoreBreakdown,
  ManglikMatchResult,
  ManglikStatus,
  SoulmateResult
} from './matchingEngine';

export { calculateGunaMilan, calculateSymmetricGunaMilan } from './guna-milan';
export { evaluateManglikCompatibility, checkManglik } from './manglik-checker';
export { calculateSoulmateBonus } from './soulmate-bonus';
