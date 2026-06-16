/**
 * Ascendant quadrant-robustness stress test (audit 3H).
 *
 * Ground truth: 216 points (9 latitudes x 24 hours, longitude 0) computed with
 * pyswisseph 2.10 / Lahiri — see scripts/gen-ascendant-grid.py and
 * __fixtures__/ascendant-grid.json. The hour sweep drives Local Sidereal Time
 * through the full 360°, so this exercises every quadrant boundary the old
 * heuristic patch could have misfired on.
 *
 * A quadrant bug shows up as a ~180° drift at specific points; a sound formula
 * keeps every point within a fraction of a degree (residual = our linear Lahiri
 * ayanamsa model vs Swiss Ephemeris, ~0.01° at this epoch).
 */
import { describe, it, expect } from 'vitest';
import { calculateAscendant } from '../ascendant-calculator';
import grid from '../__fixtures__/ascendant-grid.json';

function angleDiff(a: number, b: number): number {
  return ((a - b + 540) % 360) - 180;
}

interface GridPoint {
  jd_ut: number;
  lat: number;
  lon: number;
  hour: number;
  asc_sidereal: number;
  asc_sign_index: number;
}

describe('ascendant robustness across full LST sweep', () => {
  it('stays within 0.2° of Swiss Ephemeris at all 216 grid points', () => {
    let worst = { drift: 0, lat: 0, hour: 0 };
    for (const p of grid.points as GridPoint[]) {
      const asc = calculateAscendant(p.jd_ut, p.lat, p.lon);
      const drift = Math.abs(angleDiff(asc.totalDegree, p.asc_sidereal));
      if (drift > worst.drift) worst = { drift, lat: p.lat, hour: p.hour };
    }
    expect(
      worst.drift,
      `worst drift ${worst.drift.toFixed(4)}° at lat ${worst.lat}, hour ${worst.hour}`,
    ).toBeLessThan(0.2);
  });

  it('agrees on ascendant sign except within 0.2° of a sign boundary', () => {
    for (const p of grid.points as GridPoint[]) {
      const asc = calculateAscendant(p.jd_ut, p.lat, p.lon);
      const nearBoundary = Math.min(p.asc_sidereal % 30, 30 - (p.asc_sidereal % 30)) < 0.2;
      if (nearBoundary) continue; // tiny ayanamsa-model offset can flip a boundary case
      const sign = Math.floor(asc.totalDegree / 30);
      expect(sign, `sign mismatch at lat ${p.lat}, hour ${p.hour} (asc ${p.asc_sidereal}°)`).toBe(
        p.asc_sign_index,
      );
    }
  });
});
