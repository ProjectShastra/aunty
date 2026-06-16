/**
 * Real-couples validation harness.
 *
 * Runs every couple in src/lib/vedic-astrology/__fixtures__/validation-couples.json
 * (Astro-Databank, both partners Rodden AA/A) through the matching engine and
 * reports group statistics: lasting marriages vs divorces.
 *
 * Run with:  npx tsx scripts/validate-couples.ts   (TZ must be UTC)
 * or:        npm run validate:couples
 *
 * IMPORTANT: calculateProfile uses Date#setHours (process-local time), so the
 * process MUST run with TZ=UTC for the tz offsets in the fixture to be applied
 * correctly. The npm script sets this via cross-env-free inline env.
 */
import { calculateProfile } from '../src/lib/vedic-astrology/index';
import { evaluateMatch } from '../src/lib/vedic-astrology/matching/matchingEngine';
import fixtures from '../src/lib/vedic-astrology/__fixtures__/validation-couples.json';

if (new Date().getTimezoneOffset() !== 0) {
  console.error('ERROR: run with TZ=UTC (e.g. TZ=UTC npx tsx scripts/validate-couples.ts)');
  process.exit(1);
}

interface PersonRow { n: string; d: string; t: string; tz: number; lat: number; lon: number }
const rows: Array<{ id: string; cat: string; guna: number; nadi: boolean; bhakoot: boolean; verdict: string }> = [];

for (const c of (fixtures as any).couples) {
  const mk = (p: PersonRow) => {
    const [y, mo, dd] = p.d.split('-').map(Number);
    return calculateProfile(new Date(Date.UTC(y, mo - 1, dd)), p.t, p.lat, p.lon, p.tz);
  };
  const r = evaluateMatch(mk(c.m), mk(c.f), { a: 'male', b: 'female' });
  rows.push({ id: c.id, cat: c.cat, guna: r.gunaMilan.totalScore, nadi: r.nadiDosha, bhakoot: r.bhakootDosha, verdict: r.verdict });
}

console.log('couple               cat       guna  nadi bhk  verdict');
for (const r of rows) {
  console.log(`${r.id.padEnd(20)} ${r.cat.padEnd(9)} ${String(r.guna).padStart(4)}  ${r.nadi ? 'Y' : '-'}    ${r.bhakoot ? 'Y' : '-'}   ${r.verdict}`);
}

const grp = (cat: string) => rows.filter(r => r.cat === cat).map(r => r.guna);
const L = grp('LONG'), D = grp('DIVORCED');
const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };

// AUC: probability a random LONG couple outscores a random DIVORCED couple (ties 0.5)
let auc = 0;
for (const l of L) for (const d of D) auc += l > d ? 1 : l === d ? 0.5 : 0;
auc /= L.length * D.length;

const acc = (L.filter(x => x >= 18).length + D.filter(x => x < 18).length) / (L.length + D.length);
const nadiRate = (cat: string) => rows.filter(r => r.cat === cat && r.nadi).length;
const bhkRate = (cat: string) => rows.filter(r => r.cat === cat && r.bhakoot).length;

console.log(`\nLONG     n=${L.length}  mean=${avg(L).toFixed(2)}  median=${med(L)}`);
console.log(`DIVORCED n=${D.length}  mean=${avg(D).toFixed(2)}  median=${med(D)}`);
console.log(`AUC (LONG ranked above DIVORCED): ${auc.toFixed(3)}   accuracy@18: ${(acc * 100).toFixed(0)}%`);
console.log(`Nadi dosha:    LONG ${nadiRate('LONG')}/${L.length}  vs DIVORCED ${nadiRate('DIVORCED')}/${D.length}`);
console.log(`Bhakoot dosha: LONG ${bhkRate('LONG')}/${L.length}  vs DIVORCED ${bhkRate('DIVORCED')}/${D.length}`);
