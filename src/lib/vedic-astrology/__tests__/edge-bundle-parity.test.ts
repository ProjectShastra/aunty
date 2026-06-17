/**
 * Edge-bundle parity guard.
 *
 * The Supabase edge function imports a generated bundle of the matching engine
 * (supabase/functions/_shared/matching.bundle.js) rather than a hand-written
 * duplicate. This test runs identical inputs through the canonical source and
 * the bundle and asserts identical output — so if anyone edits the engine and
 * forgets `npm run build:edge`, CI fails instead of the server silently scoring
 * with stale logic.
 */
import { describe, it, expect } from 'vitest';
import { calculateProfile } from '../index';
import { evaluateMatch as canonicalEvaluateMatch } from '../matching';

// Bundle is plain ESM with no type declarations; load it dynamically as any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadBundle(): Promise<any> {
  return await import('../../../../supabase/functions/_shared/matching.bundle.js');
}

const A = calculateProfile(new Date(1990, 4, 20), '14:30', 19.076, 72.8777, 5.5);
const B = calculateProfile(new Date(1992, 10, 3), '08:15', 28.6139, 77.209, 5.5);
const C = calculateProfile(new Date(1988, 1, 14), '23:50', 40.7128, -74.006, -5);

const PAIRS: Array<[string, ReturnType<typeof calculateProfile>, ReturnType<typeof calculateProfile>, string, string]> = [
  ['A-B man/woman', A, B, 'male', 'female'],
  ['B-A woman/man', B, A, 'female', 'male'],
  ['A-C nonbinary', A, C, 'nonbinary', 'female'],
];

describe('edge bundle matches canonical engine', () => {
  it('produces byte-identical MatchResults for representative pairings', async () => {
    const bundle = await loadBundle();
    for (const [label, x, y, ga, gb] of PAIRS) {
      const canonical = canonicalEvaluateMatch(x, y, { a: ga, b: gb });
      const bundled = bundle.evaluateMatch(x, y, { a: ga, b: gb });
      expect(bundled, `bundle drifted from source for ${label} — run \`npm run build:edge\``).toEqual(
        canonical,
      );
    }
  });
});
