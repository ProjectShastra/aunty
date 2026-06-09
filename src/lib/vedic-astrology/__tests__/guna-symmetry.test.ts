/**
 * Symmetry suite for Guna Milan scoring (audit 3E fix).
 *
 * Invariants:
 * 1. calculateSymmetricGunaMilan(A,B,gA,gB) === calculateSymmetricGunaMilan(B,A,gB,gA)
 *    for every gender combination — both users see the same score.
 * 2. Man–woman pairs use classical roles: result equals
 *    calculateGunaMilan(maleProfile, femaleProfile) regardless of argument order.
 * 3. Same-gender / unknown pairs equal the average of the two directional runs.
 */
import { describe, it, expect } from 'vitest';
import { calculateGunaMilan, calculateSymmetricGunaMilan } from '../matching/guna-milan';
import type { VedicProfile, NakshatraIndex, ZodiacSign } from '../types';

/** Minimal profile stub: Guna Milan reads only moon.sign and moon.nakshatra. */
function stub(nakshatra: number): VedicProfile {
  const sign = (Math.floor(((nakshatra - 1) * (360 / 27)) / 30) + 1) as ZodiacSign;
  return { moon: { sign, nakshatra: nakshatra as NakshatraIndex } } as unknown as VedicProfile;
}

const GENDER_PAIRS: Array<[string | null, string | null]> = [
  ['male', 'female'],
  ['female', 'male'],
  ['male', 'male'],
  ['female', 'female'],
  ['nonbinary', 'female'],
  ['male', 'nonbinary'],
  [null, null]
];

describe('symmetric Guna Milan', () => {
  it('score(A,B) === score(B,A) for all gender combinations and nakshatra pairs', () => {
    for (let na = 1; na <= 27; na += 2) {
      for (let nb = 1; nb <= 27; nb += 3) {
        const A = stub(na);
        const B = stub(nb);
        for (const [gA, gB] of GENDER_PAIRS) {
          const fwd = calculateSymmetricGunaMilan(A, B, gA, gB);
          const rev = calculateSymmetricGunaMilan(B, A, gB, gA);
          expect(fwd.totalScore, `nak ${na}x${nb} ${gA}/${gB}`).toBe(rev.totalScore);
          expect(fwd.breakdown).toEqual(rev.breakdown);
          expect(fwd.nadiDosha).toBe(rev.nadiDosha);
          expect(fwd.bhakootDosha).toBe(rev.bhakootDosha);
          expect(fwd.matchStatus).toBe(rev.matchStatus);
        }
      }
    }
  });

  it('man-woman pairs use classical gender roles regardless of argument order', () => {
    const man = stub(5);
    const woman = stub(19);
    const classical = calculateGunaMilan(man, woman);

    const a = calculateSymmetricGunaMilan(man, woman, 'male', 'female');
    const b = calculateSymmetricGunaMilan(woman, man, 'female', 'male');

    expect(a.roleConvention).toBe('classical-gender');
    expect(b.roleConvention).toBe('classical-gender');
    expect(a.totalScore).toBe(classical.totalScore);
    expect(b.totalScore).toBe(classical.totalScore);
    expect(a.breakdown).toEqual(classical.breakdown);
    expect(b.breakdown).toEqual(classical.breakdown);
  });

  it('same-gender pairs average both directional runs', () => {
    const A = stub(3);
    const B = stub(22);
    const ab = calculateGunaMilan(A, B);
    const ba = calculateGunaMilan(B, A);

    const sym = calculateSymmetricGunaMilan(A, B, 'male', 'male');
    expect(sym.roleConvention).toBe('bidirectional-average');
    expect(sym.totalScore).toBeCloseTo((ab.totalScore + ba.totalScore) / 2, 10);
    expect(sym.breakdown.varna).toBeCloseTo((ab.breakdown.varna + ba.breakdown.varna) / 2, 10);
    expect(sym.breakdown.vashya).toBeCloseTo((ab.breakdown.vashya + ba.breakdown.vashya) / 2, 10);
  });
});
