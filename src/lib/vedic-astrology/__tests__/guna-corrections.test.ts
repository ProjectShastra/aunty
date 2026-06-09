/**
 * Regression tests for the 2026-06 classical-correctness fixes
 * (see docs/SOURCES_AUDIT.md): Bhakoot inclusive counting, Tara inclusive
 * counting + correct malefic set, Manglik cancellation prune.
 */
import { describe, it, expect } from 'vitest';
import { calculateGunaMilan } from '../matching/guna-milan';
import { checkManglik, evaluateManglikCompatibility } from '../matching/manglik-checker';
import type { VedicProfile, NakshatraIndex, ZodiacSign } from '../types';

function moonStub(sign: number, nakshatra: number): VedicProfile {
  return { moon: { sign: sign as ZodiacSign, nakshatra: nakshatra as NakshatraIndex } } as unknown as VedicProfile;
}

// Consistent sign for a nakshatra (so Bhakoot input stays plausible)
function signFor(nak: number): number {
  return Math.floor(((nak - 1) * (360 / 27)) / 30) + 1;
}

describe('Bhakoot Koota (fixed inclusive counting)', () => {
  // Aries(1) vs Taurus(2): inclusive counts 2 and 12 -> dwirdwadasha dosha
  it('flags 2/12 dosha', () => {
    const r = calculateGunaMilan(moonStub(1, 1), moonStub(2, 3));
    expect(r.bhakootDosha).toBe(true);
    expect(r.breakdown.bhakoot).toBe(0);
  });
  // Aries(1) vs Leo(5): counts 5 and 9 -> dosha
  it('flags 5/9 dosha', () => {
    const r = calculateGunaMilan(moonStub(1, 1), moonStub(5, 11));
    expect(r.bhakootDosha).toBe(true);
  });
  // Aries(1) vs Virgo(6): counts 6 and 8 -> shadashtaka dosha
  it('flags 6/8 dosha', () => {
    const r = calculateGunaMilan(moonStub(1, 1), moonStub(6, 14));
    expect(r.bhakootDosha).toBe(true);
  });
  // Aries(1) vs Libra(7): counts 7 and 7 -> no dosha
  it('opposition (1/7) is clean', () => {
    const r = calculateGunaMilan(moonStub(1, 1), moonStub(7, 16));
    expect(r.bhakootDosha).toBe(false);
    expect(r.breakdown.bhakoot).toBe(7);
  });
  // Same sign -> counts 1/1 -> no dosha
  it('same sign is clean', () => {
    const r = calculateGunaMilan(moonStub(1, 1), moonStub(1, 2));
    expect(r.bhakootDosha).toBe(false);
  });
  it('dosha fires for some but not all sign pairs (was: never)', () => {
    let doshaCount = 0;
    for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) {
      if (calculateGunaMilan(moonStub(a, 1), moonStub(b, 2)).bhakootDosha) doshaCount++;
    }
    expect(doshaCount).toBeGreaterThan(0);
    expect(doshaCount).toBeLessThan(144);
  });
});

describe('Tara Koota (fixed inclusive counting + classical malefic set {3,5,7})', () => {
  const tara = (na: number, nb: number) =>
    calculateGunaMilan(moonStub(signFor(na), na), moonStub(signFor(nb), nb)).breakdown.tara;

  it('same nakshatra (Janma both ways) is auspicious -> 3', () => {
    expect(tara(1, 1)).toBe(3);
  });
  // 1 -> 3: inclusive count 3 (Vipat, malefic); 3 -> 1: count 26, 26%9=8 (benefic)
  it('one malefic direction -> 1.5', () => {
    expect(tara(1, 3)).toBe(1.5);
  });
  // 1 -> 10: count 10, 10%9=1 (Janma, benefic); 10 -> 1: count 19, 19%9=1 -> 3
  it('both benefic directions -> 3', () => {
    expect(tara(1, 10)).toBe(3);
  });
  // 1 -> 5: count 5 (Pratyari, malefic); 5 -> 1: count 24, 24%9=6 (benefic) -> 1.5
  it('Pratyari (5) counts as malefic now', () => {
    expect(tara(1, 5)).toBe(1.5);
  });
});

describe('Manglik cancellations (unsourced rules removed)', () => {
  function profile(marsHouse: number, marsSign: number, jupiterHouse: number, saturnHouse: number): VedicProfile {
    return {
      planets: {
        Mars: { house: marsHouse, sign: marsSign },
        Jupiter: { house: jupiterHouse },
        Saturn: { house: saturnHouse }
      },
      birthData: { date: new Date('1960-01-01') } // 66 years old: age must NOT cancel
    } as unknown as VedicProfile;
  }
  const nonManglik = profile(3, 4, 2, 5);

  it('age alone no longer cancels (66-year-old stays Manglik)', () => {
    // Mars in 7th, Gemini; Jupiter in 12th (aspects 4,6,8 - not 7); Saturn anywhere
    const manglik = profile(7, 3, 12, 7);
    const r = evaluateManglikCompatibility(manglik, nonManglik);
    expect(r.boyManglik.isManglik).toBe(true);
    expect(r.boyCancellation.isCancelled).toBe(false);
    expect(r.status).toBe('BAD');
  });

  it('Saturn aspecting Mars no longer cancels', () => {
    // Saturn in 1st aspects 3,7,10; Mars in 7th (aspected); Jupiter in 12th (no aspect)
    const manglik = profile(7, 3, 12, 1);
    const r = evaluateManglikCompatibility(manglik, nonManglik);
    expect(r.boyCancellation.isCancelled).toBe(false);
  });

  it('Jupiter aspect still cancels (classical)', () => {
    // Jupiter in 1st aspects 5,7,9 -> Mars in 7th is aspected
    const manglik = profile(7, 3, 1, 2);
    const r = evaluateManglikCompatibility(manglik, nonManglik);
    expect(r.boyCancellation.isCancelled).toBe(true);
    expect(r.status).toBe('CANCELLED');
  });

  it('Mars in own sign still cancels (Muhurta Chintamani lineage)', () => {
    const manglik = profile(7, 1, 12, 2); // Mars in Aries in 7th
    const r = evaluateManglikCompatibility(manglik, nonManglik);
    expect(r.boyCancellation.isCancelled).toBe(true);
  });

  it('mutual Manglik still neutralizes (Dosha Samya)', () => {
    const a = profile(7, 3, 12, 2);
    const b = profile(8, 4, 12, 2);
    const r = evaluateManglikCompatibility(a, b);
    expect(r.status).toBe('SAFE');
  });

  it('checkManglik unchanged for non-dosha houses', () => {
    expect(checkManglik(nonManglik).isManglik).toBe(false);
  });
});
