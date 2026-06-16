/**
 * Ascendant (Lagna) validation suite.
 *
 * Ground truth: the same 12 reference charts as the planetary suite, whose
 * `_ascendant` field was computed with pyswisseph 2.10 (Swiss Ephemeris,
 * Lahiri ayanamsa) from the chart's JD_UT, latitude and longitude.
 *
 * Acceptance criteria:
 * - sidereal ascendant within 0.5° of Swiss Ephemeris (ascendant is far more
 *   time/position-sensitive than a planet; the residual is dominated by our
 *   linear Lahiri ayanamsa model, not the spherical formula)
 * - 100% ascendant-sign agreement
 */
import { describe, it, expect } from 'vitest';
import { calculateAscendant } from '../ascendant-calculator';
import fixtures from '../__fixtures__/reference-charts.json';

/** Smallest signed angular difference in degrees. */
function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

interface ChartFixture {
  label: string;
  jd_ut: number;
  lat: number;
  lon: number;
  positions: { _ascendant: { sidereal: number; sign_index: number } };
}

describe('ascendant vs Swiss Ephemeris reference charts', () => {
  for (const chart of fixtures.charts as ChartFixture[]) {
    it(`${chart.label} (JD ${chart.jd_ut})`, () => {
      const asc = calculateAscendant(chart.jd_ut, chart.lat, chart.lon);
      const truth = chart.positions._ascendant;

      const drift = Math.abs(angleDiff(asc.totalDegree, truth.sidereal));
      expect(drift, `${chart.label} ascendant drift ${drift.toFixed(4)}°`).toBeLessThan(0.5);

      const sign = Math.floor(asc.totalDegree / 30); // 0-based, matches fixture sign_index
      expect(sign, `${chart.label} ascendant sign`).toBe(truth.sign_index);
    });
  }
});
