/**
 * DST-correct timezone resolution for birth-chart calculation.
 *
 * The city database stores a single static UTC offset per city. That is wrong
 * for any birth in a DST-observing country at the "other" time of year (a London
 * summer birth is UTC+1, not 0; a New York summer birth is UTC−4, not −5). A
 * one-hour error is enough to move the ascendant a full sign.
 *
 * Fix: map each city to an IANA zone and ask the built-in Intl database for the
 * actual offset *on the birth date*. No external dependency — the ICU/IANA tz
 * data ships with Node and every modern browser, including historical DST rules.
 *
 * Non-DST zones (India, Gulf, most of Asia) need no IANA zone; their static
 * offset is always correct, so resolveIanaZone returns null and callers fall
 * back to the stored number.
 */

/** Cities in multi-zone countries must be resolved individually. */
const CITY_ZONE_OVERRIDES: Record<string, string> = {
  // USA
  'New York': 'America/New_York', Philadelphia: 'America/New_York',
  Jacksonville: 'America/New_York', Columbus: 'America/New_York',
  Charlotte: 'America/New_York', Boston: 'America/New_York',
  Detroit: 'America/New_York', Atlanta: 'America/New_York',
  Miami: 'America/New_York', Orlando: 'America/New_York',
  Chicago: 'America/Chicago', Houston: 'America/Chicago',
  'San Antonio': 'America/Chicago', Dallas: 'America/Chicago',
  Austin: 'America/Chicago', 'Fort Worth': 'America/Chicago',
  Nashville: 'America/Chicago', Minneapolis: 'America/Chicago',
  Phoenix: 'America/Phoenix', // Arizona does NOT observe DST — IANA handles this
  Denver: 'America/Denver',
  'Los Angeles': 'America/Los_Angeles', 'San Francisco': 'America/Los_Angeles',
  'San Diego': 'America/Los_Angeles', 'San Jose': 'America/Los_Angeles',
  Seattle: 'America/Los_Angeles', Portland: 'America/Los_Angeles',
  'Las Vegas': 'America/Los_Angeles',
  // Canada
  Toronto: 'America/Toronto', Montreal: 'America/Toronto',
  Ottawa: 'America/Toronto', 'Quebec City': 'America/Toronto',
  Vancouver: 'America/Vancouver',
  Calgary: 'America/Edmonton', Edmonton: 'America/Edmonton',
  Winnipeg: 'America/Winnipeg',
  // Australia (Brisbane has no DST; Sydney/Melbourne do)
  Sydney: 'Australia/Sydney', Melbourne: 'Australia/Melbourne',
  Brisbane: 'Australia/Brisbane', Perth: 'Australia/Perth',
  Adelaide: 'Australia/Adelaide',
  // Indonesia / Mexico (multi-zone)
  Jakarta: 'Asia/Jakarta', Bali: 'Asia/Makassar',
  'Mexico City': 'America/Mexico_City', Guadalajara: 'America/Mexico_City',
  Monterrey: 'America/Monterrey',
};

/** Single-zone countries (the whole country shares one set of DST rules). */
const COUNTRY_ZONE: Record<string, string> = {
  India: 'Asia/Kolkata', Pakistan: 'Asia/Karachi', Bangladesh: 'Asia/Dhaka',
  'Sri Lanka': 'Asia/Colombo', Nepal: 'Asia/Kathmandu',
  UK: 'Europe/London', Ireland: 'Europe/Dublin', France: 'Europe/Paris',
  Germany: 'Europe/Berlin', Netherlands: 'Europe/Amsterdam', Italy: 'Europe/Rome',
  Spain: 'Europe/Madrid', Austria: 'Europe/Vienna', Switzerland: 'Europe/Zurich',
  Belgium: 'Europe/Brussels', Sweden: 'Europe/Stockholm', Denmark: 'Europe/Copenhagen',
  Norway: 'Europe/Oslo', Finland: 'Europe/Helsinki', Poland: 'Europe/Warsaw',
  'Czech Republic': 'Europe/Prague', Hungary: 'Europe/Budapest', Greece: 'Europe/Athens',
  Portugal: 'Europe/Lisbon', Russia: 'Europe/Moscow', UAE: 'Asia/Dubai',
  'Saudi Arabia': 'Asia/Riyadh', Singapore: 'Asia/Singapore', Malaysia: 'Asia/Kuala_Lumpur',
  'New Zealand': 'Pacific/Auckland', China: 'Asia/Shanghai', 'Hong Kong': 'Asia/Hong_Kong',
  Japan: 'Asia/Tokyo', 'South Korea': 'Asia/Seoul', Taiwan: 'Asia/Taipei',
  Thailand: 'Asia/Bangkok', Vietnam: 'Asia/Ho_Chi_Minh', Philippines: 'Asia/Manila',
  Egypt: 'Africa/Cairo', Nigeria: 'Africa/Lagos', 'South Africa': 'Africa/Johannesburg',
  Kenya: 'Africa/Nairobi', Morocco: 'Africa/Casablanca', Israel: 'Asia/Jerusalem',
  Turkey: 'Europe/Istanbul', Brazil: 'America/Sao_Paulo', Argentina: 'America/Argentina/Buenos_Aires',
  Peru: 'America/Lima', Colombia: 'America/Bogota', Chile: 'America/Santiago',
};

/**
 * Resolve a city to an IANA timezone, or null if its static offset is reliable
 * (non-DST zone or unknown city — caller falls back to the stored number).
 */
export function resolveIanaZone(name: string, country: string): string | null {
  return CITY_ZONE_OVERRIDES[name] ?? COUNTRY_ZONE[country] ?? null;
}

/**
 * The UTC offset (minutes) that an IANA zone was at for a given UTC instant,
 * derived purely from the Intl database. East of Greenwich is positive.
 */
function zoneOffsetMinutesAtInstant(instantUtc: Date, zone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = dtf.formatToParts(instantUtc);
  const f: Record<string, number> = {};
  for (const p of parts) if (p.type !== 'literal') f[p.type] = parseInt(p.value, 10);
  const asIfUtc = Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second);
  return Math.round((asIfUtc - instantUtc.getTime()) / 60000);
}

/**
 * DST-correct UTC offset (in hours) for a *wall-clock* birth time in a zone.
 *
 * Wall time has no offset of its own, so we make an initial guess (treat the
 * wall time as if UTC), read the zone's offset there, then re-read at the
 * implied true instant. The second read resolves DST-transition edge cases.
 */
export function zoneOffsetHoursForWallTime(
  year: number, month1to12: number, day: number,
  hour: number, minute: number, zone: string,
): number {
  const guessUtc = Date.UTC(year, month1to12 - 1, day, hour, minute);
  const firstOffset = zoneOffsetMinutesAtInstant(new Date(guessUtc), zone);
  const refinedOffset = zoneOffsetMinutesAtInstant(new Date(guessUtc - firstOffset * 60000), zone);
  return refinedOffset / 60;
}
