"""
Generate a dense sidereal-ascendant ground-truth grid with pyswisseph
(Swiss Ephemeris 2.10, Lahiri ayanamsa) to stress-test the TypeScript
ascendant formula across every LST quadrant and a wide latitude range.

Sweeps 9 latitudes x 24 hours (longitude 0) so Local Sidereal Time moves
through the full 360 degrees, exercising the quadrant-disambiguation logic
that audit 3H flagged. Output: src/lib/vedic-astrology/__fixtures__/ascendant-grid.json
"""
import json
import os
import swisseph as swe

swe.set_sid_mode(swe.SIDM_LAHIRI)

# Fixed date keeps ayanamsa/obliquity constant so any large error is a
# formula/quadrant bug, not an ephemeris-model drift.
YEAR, MONTH, DAY = 2000, 1, 1
LATS = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
LON = 0.0

points = []
for lat in LATS:
    for hour in range(24):
        jd_ut = swe.julday(YEAR, MONTH, DAY, hour + 0.0)
        # houses_ex with sidereal flag -> ascmc[0] is the sidereal ascendant.
        cusps, ascmc = swe.houses_ex(jd_ut, lat, LON, b'W', swe.FLG_SIDEREAL)
        asc = ascmc[0] % 360.0
        points.append({
            "jd_ut": round(jd_ut, 8),
            "lat": lat,
            "lon": LON,
            "hour": hour,
            "asc_sidereal": round(asc, 6),
            "asc_sign_index": int(asc // 30),  # 0-based
        })

out = {
    "generator": "pyswisseph 2.10 SIDM_LAHIRI, houses_ex 'W' (whole sign), FLG_SIDEREAL",
    "date": f"{YEAR:04d}-{MONTH:02d}-{DAY:02d} UT, lon {LON}",
    "count": len(points),
    "points": points,
}

dest = os.path.join(
    os.path.dirname(__file__), "..", "src", "lib", "vedic-astrology",
    "__fixtures__", "ascendant-grid.json",
)
with open(os.path.abspath(dest), "w") as f:
    json.dump(out, f, indent=2)
print(f"wrote {len(points)} points -> {os.path.abspath(dest)}")
