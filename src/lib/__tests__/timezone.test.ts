/**
 * DST timezone-resolution tests.
 *
 * Validates that wall-clock birth times resolve to the correct UTC offset for
 * the birth date, using the built-in IANA database — the bug that previously
 * put every DST-region summer/winter birth an hour off.
 */
import { describe, it, expect } from 'vitest';
import { resolveIanaZone, zoneOffsetHoursForWallTime } from '../timezone';

describe('resolveIanaZone', () => {
  it('maps multi-zone-country cities individually', () => {
    expect(resolveIanaZone('New York', 'USA')).toBe('America/New_York');
    expect(resolveIanaZone('Los Angeles', 'USA')).toBe('America/Los_Angeles');
    expect(resolveIanaZone('Phoenix', 'USA')).toBe('America/Phoenix'); // no DST
    expect(resolveIanaZone('Vancouver', 'Canada')).toBe('America/Vancouver');
  });

  it('maps single-zone countries by country', () => {
    expect(resolveIanaZone('London', 'UK')).toBe('Europe/London');
    expect(resolveIanaZone('Mumbai', 'India')).toBe('Asia/Kolkata');
    expect(resolveIanaZone('Kathmandu', 'Nepal')).toBe('Asia/Kathmandu');
  });

  it('returns null for unknown cities (caller uses static offset)', () => {
    expect(resolveIanaZone('Nowhere', 'Atlantis')).toBeNull();
  });
});

describe('zoneOffsetHoursForWallTime — DST correctness', () => {
  const cases: Array<[string, string, number, number, number, number]> = [
    // [label, zone, year, month, day, expectedOffsetHours]
    ['London summer (BST)', 'Europe/London', 1990, 7, 15, 1],
    ['London winter (GMT)', 'Europe/London', 1990, 1, 15, 0],
    ['New York summer (EDT)', 'America/New_York', 1990, 7, 15, -4],
    ['New York winter (EST)', 'America/New_York', 1990, 1, 15, -5],
    ['Phoenix summer (no DST, MST)', 'America/Phoenix', 1990, 7, 15, -7],
    ['Toronto summer (EDT)', 'America/Toronto', 1990, 7, 15, -4],
    ['Sydney Jan (AEDT, S-hemisphere summer)', 'Australia/Sydney', 1990, 1, 15, 11],
    ['Sydney Jul (AEST)', 'Australia/Sydney', 1990, 7, 15, 10],
    ['Mumbai (IST, no DST)', 'Asia/Kolkata', 1990, 7, 15, 5.5],
    ['Kathmandu (+5:45)', 'Asia/Kathmandu', 1990, 7, 15, 5.75],
  ];

  for (const [label, zone, y, m, d, expected] of cases) {
    it(`${label}`, () => {
      expect(zoneOffsetHoursForWallTime(y, m, d, 12, 0, zone)).toBe(expected);
    });
  }

  it('same wall time, summer vs winter London differs by exactly 1 hour', () => {
    const summer = zoneOffsetHoursForWallTime(1990, 7, 15, 6, 30, 'Europe/London');
    const winter = zoneOffsetHoursForWallTime(1990, 1, 15, 6, 30, 'Europe/London');
    expect(summer - winter).toBe(1);
  });

  it('survives a non-existent spring-forward wall time without throwing', () => {
    // 2021-03-28 01:30 London does not exist (clocks jump 01:00 -> 02:00).
    const off = zoneOffsetHoursForWallTime(2021, 3, 28, 1, 30, 'Europe/London');
    expect([0, 1]).toContain(off);
  });
});
