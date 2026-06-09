# Aunty Codebase Audit — 2026-04

**Purpose:** Document what exists, what's missing, what's wrong, and what to build next.
Scope: `ProjectShastra/aunty` at HEAD of `main` (59 commits in).

---

## 1. Stack Snapshot

| Layer | What's there |
|---|---|
| Frontend | Vite + React 18 + TS + shadcn-ui + Tailwind + React Router + TanStack Query + React Hook Form + Zod |
| Backend | Supabase (Auth + Postgres + Storage + Edge Functions) |
| Vedic math | Hand-rolled in `src/lib/vedic-astrology/` (~2,000 lines) + `astronomia` in deps but **unused** |
| Hosting | Lovable (paid) — we will drop this and deploy to Vercel free |

**Recurring cost today:** Lovable subscription.
**After changes:** $0 (Vercel free + Supabase free + pay-per-use Anthropic API).

---

## 2. What Exists (and is Good)

### Database schema (`supabase/migrations/`)
- `profiles` table with precomputed Vedic fields: `moon_nakshatra_index`, `moon_sign_index`, `ascendant_sign_index`, `is_manglik`, `manglik_cancelled`, `atmakaraka_planet`, `darakaraka_planet`, `element`, `vedic_chart` JSONB
- `matches` table with bidirectional `user1_liked`/`user2_liked` and computed `is_mutual`
- `get_discovery_profiles()` security-definer RPC with proper filtering
- RLS policies are sound — users can only SELECT profiles of mutual matches, own profile otherwise

### Client-side Vedic engine (`src/lib/vedic-astrology/`)
- `matching/guna-milan.ts` — full 8-koota Ashtakoota (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi), 36-point total
- `matching/ashtakoota-tables.ts` — compatibility tables (yoni pairs, graha maitri matrix, etc.)
- `matching/manglik-checker.ts` — Mars-in-1/2/4/7/8/12 with cancellation rules
- `matching/soulmate-bonus.ts` — Jaimini AK↔DK matching + Navamsha overlay bonuses
- `matching/matchingEngine.ts` — orchestrator that combines all three layers, returns verdict + badges + recommendations
- `jaimini-karakas.ts` — 7-karaka hierarchy (AK/AmK/BK/MK/PiK/PuK/GK/DK)
- `ascendant-calculator.ts` — LST-based ascendant math
- `utils.ts` — Julian day, Lahiri ayanamsa (with nutation), sidereal conversion, nakshatra/pada helpers
- `constants.ts` + `types.ts` — strong typing throughout

**This is real work.** Do not rebuild it. Extend and correct it.

---

## 3. What's Wrong (Critical Bugs)

### 3A. Planetary positions are inaccurate — **THIS IS THE #1 BUG**

`src/lib/vedic-astrology/planetary-calculations.ts` hand-rolls planetary positions using **truncated VSOP87/ELP2000 series**:

- **Moon** uses only ~14 periodic terms (full ELP2000 has 100+). Error: up to ~0.3° in longitude.
- **Mercury/Venus** use a hack `-22*sin(elongation)` to fake geocentric correction from heliocentric. Not physically correct. Error: multiple degrees.
- **Mars/Jupiter/Saturn** return **heliocentric longitudes** labelled as geocentric. This is genuinely wrong — they never compute the Earth-Sun-planet triangle. Error: up to 15°.
- **Retrograde** is computed from synodic-period modulo, not actual velocity. Will mislabel ~20% of chart instances.

**Impact:** Wrong Moon longitude → wrong nakshatra → wrong Nadi group → wrong Nadi Dosha verdict → wrong match. This silently breaks the entire compatibility layer.

**`astronomia` is already a dependency** but nothing imports it. Either:
- **Option A (recommended):** replace `planetary-calculations.ts` with calls to `astronomia.planetposition` + VSOP87 data files. Accurate to arcseconds for modern dates.
- **Option B:** swap for `sweph-wasm` (Swiss Ephemeris compiled to WASM). Gold-standard, NASA-JPL-grade, but ~3MB bundle.

### 3B. Edge function doesn't use the real engine

`supabase/functions/fetch-matches/index.ts` re-implements a shallow Nadi/Manglik/soulmate check inline and **never calls `matchingEngine.ts`**. So the real Ashtakoota + Jaimini code sits unused on the server path. Clients would have to recompute match scores themselves with profile data — and looking at `Browse.tsx`/`MatchView.tsx` (to verify), this is the current implicit design.

This matters because:
- Client-side scoring means rankings can be tampered with
- Deep Ashtakoota calculation on every browse render is wasteful
- The "why did we match" narration should happen server-side with LLM cost control

### 3C. No chat / messaging layer

`matches` table exists, `is_mutual` flag exists, but:
- No `messages` table
- No `conversations` table
- No realtime subscription wiring

A dating app without chat is a landing page. This is Sprint 2's hole.

### 3D. No 7th house synastry, no Dasha overlap, no cross-aspects

The existing engine computes **individual chart features** (your nakshatra, your manglik status) and scores them in Ashtakoota. It does **not** do the richer synastry:

- **7th house overlay** — where do *her* planets fall in *your* 7th? (the marriage house)
- **Dasha overlap** — are you both about to enter Venus/Jupiter periods together?
- **Cross-aspects** — her Moon conjunct your Venus, your Sun trine her Moon, etc.
- **D9 (Navamsha) cross-chart** — the real marriage divisional (partially done in `soulmate-bonus.ts` but only as AK/DK lookup, not full D9 synastry)

These are the features that make Aunty say "her Venus is sitting right on your Moon, you'll feel *seen* by her" instead of "you scored 28/36."

### 3E. Compatibility scoring is order-dependent — **second-pass finding, 2026-06**

`matching/guna-milan.ts` computes `calculateGunaMilan(boyProfile, girlProfile)` and every caller passes `(currentUser, candidate)` — the current user is *always* scored as "boy," regardless of either person's gender. Varna, Vashya, and Tara are directional kootas (classical rules require the boy's value to rank ≥ the girl's), so **score(A→B) ≠ score(B→A)**: two users viewing the same pairing see different numbers, and rankings differ depending on who is browsing.

Fix: define a principled role convention (use actual profile gender where applicable; for same-gender or unspecified pairs, score both directions and take a defined combination, e.g. mean or max — decide and document). The result must be symmetric: both users see the same score.

### 3F. Manglik cancellation is neutered — **second-pass finding, 2026-06**

`matching/manglik-checker.ts` cancels Manglik dosha if **any one** of these holds: Saturn aspects Mars, Mars in own sign, Jupiter aspect/conjunction, **or age > 28**. Since every user on a dating app is an adult, the age clause alone cancels Manglik for most users — `is_manglik` effectively never matters. The age-28 "rule" is pop-astrology folklore with no Parashari basis as a standalone cancellation.

Fix: re-derive cancellation conditions from a real classical source (standard references: mutual Manglik match, Mars in own/exalted sign in the dosha house, specific benefic aspects per tradition), cite each rule in code comments, and never let a single weak factor fully cancel.

### 3G. No DST handling in birth-time conversion — **second-pass finding, 2026-06**

Onboarding converts birth time to UT using **static city offsets** (London is always UTC+0, New York always −5). A UK summer birth is off by exactly 1 hour — enough to flip the ascendant. Fix: IANA timezone lookup keyed on the birth *date* (e.g. a tz library + city→IANA zone mapping). `date-fns` is already in deps; needs `date-fns-tz` or equivalent.

### 3H. Non-standard formulas — **second-pass finding, 2026-06**

- `ascendant-calculator.ts` uses a non-standard ascendant formula — re-derive from the standard oblique-ascension form, or take it from the ephemeris library directly.
- `utils.ts` approximates Lahiri ayanamsa with a crude linear model — replace with the ephemeris library's Lahiri value.
- Tara, Vashya, and Graha Maitri use fractional partial scores (0.5, 1.5) that don't match standard Ashtakoota tables — re-derive against a published reference; label any deliberate tuning as such.

### 3I. Engineering gaps — **second-pass finding, 2026-06**

- `strictNullChecks: false` in tsconfig
- No effective error handling around `calculateProfile()` — corrupt/partial charts can be saved to the DB silently
- `JSON.parse(sessionStorage…)` un-try/caught in onbo