/**
 * Ephemeris validation suite.
 *
 * Ground truth: 12 reference charts computed with pyswisseph 2.10 (Swiss
 * Ephemeris — the same engine as the Gambler's Dharma project), Lahiri
 * ayanamsa, mean node. Generated 2026-06-09; see __fixtures__/reference-charts.json.
 *
 * Acceptance criteria (ADR 001):
 * - every planet within 0.1° of Swiss Ephemeris sidereal longitude
 * - 100% nakshatra agreement (includes a chart with the Moon 0.04 arcmin
 *   from a nakshatra boundary)
 * - 100% retrograde-flag agreement for the five true planets
 */
import { describe, it, expect } from 'vitest';
import { getAllPlanetaryPositions } from '../planetary-calculations';
import fixtures from '../__fixtures__/reference-charts.json';

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'] as const;
const RETRO_CHECKED = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'] as const;
const NAKSHATRA_SPAN = 360 / 27;

/** Smallest signed angular difference in degrees. */
function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

describe('planetary positions vs Swiss Ephemeris reference charts', () => {
  for (const chart of fixtures.charts) {
    it(`${chart.label} (JD ${chart.jd_ut})`, () => {
      const computed = getAllPlanetaryPositions(chart.jd_ut);

      for (const planet of PLANETS) {
        const ours = computed[planet];
        const truth = (chart.positions as Record<string, { sidereal: number; nakshatra_index: number; retrograde: boolean }>)[planet];

        const drift = Math.abs(angleDiff(ours.sidereal, truth.sidereal));
        expect(drift, `${planet} sidereal drift ${drift.toFixed(5)}°`).toBeLessThan(0.1);

        const nakshatra = Math.floor(ours.sidereal / NAKSHATRA_SPAN);
        expect(nakshatra, `${planet} nakshatra`).toBe(truth.nakshatra_index);
      }

      for (const planet of RETRO_CHECKED) {
        const truth = (chart.positions as Record<string, { retrograde: boolean }>)[planet];
        expect(computed[planet].isRetrograde, `${planet} retrograde flag`).toBe(truth.retrograde);
      }
    });
  }
});
