/**
 * Bundle the canonical matching engine into a single Deno-importable file for
 * the Supabase edge function — the "single source of truth + generated bundle"
 * strategy (ADR-style decision, 2026-06). The engine lives ONCE in
 * src/lib/vedic-astrology/matching; this regenerates the server copy so there
 * is never a hand-maintained duplicate to drift.
 *
 * Run: npm run build:edge   (also enforced by the parity test, which fails if
 * the bundle is stale relative to source).
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const entry = resolve(root, 'src/lib/vedic-astrology/matching/index.ts');
const outfile = resolve(root, 'supabase/functions/_shared/matching.bundle.js');

await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  outfile,
  legalComments: 'none',
  banner: {
    js:
      '// AUTO-GENERATED — DO NOT EDIT.\n' +
      '// Source: src/lib/vedic-astrology/matching (single source of truth).\n' +
      '// Regenerate with: npm run build:edge\n',
  },
});

console.log(`Edge matching bundle written -> ${outfile}`);
