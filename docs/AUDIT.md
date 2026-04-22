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

---

## 4. What's Missing (Product Surface)

| Feature | Status | Priority |
|---|---|---|
| Chat between matched users | ❌ absent | Sprint 2 |
| Likes / swipes / passes | Partial — `matches` table has flags, no UI verified | Sprint 1 |
| Aunty-voice match explanations | ❌ absent | Sprint 2 |
| Birth-time-unknown flow with witty copy | ❌ absent (currently required field, no charm) | Sprint 1 |
| Photo moderation | ❌ absent | Sprint 3 |
| Block / report | ❌ absent | Sprint 3 |
| Email notifications | ❌ absent | Sprint 3 |
| Mobile responsive QA | Unknown | Sprint 2 |
| Dasha timing windows ("best marriage year") | ❌ absent | Sprint 2 |
| Location-based filtering (diaspora + India) | Partial via `location_preference` field, no distance math | Sprint 2 |

---

## 5. Recommended Path (Sprint 1)

**Goal:** Correct the engine, wire it server-side, and ship the Aunty-voice onboarding charm. No new features; make what exists be *right*.

1. **Fix planetary positions**
   Replace `planetary-calculations.ts` with `astronomia`-backed implementation. Validate against 10 known charts (published ephemeris data for celebrity birth times) before declaring done.

2. **Move the matching engine to the server**
   - Port `matching/` modules from `src/lib/` to `supabase/functions/_shared/vedic/`
   - Rewrite `fetch-matches` to call `evaluateMatch()` for each candidate and return ranked results with full `MatchResult` payload
   - Client becomes a view-only renderer of server rankings

3. **Add Aunty-voice onboarding copy**
   Rewrite the birth-time prompt in `Onboarding.tsx`:
   > *"Aunty needs your exact birth time, beta. The minute matters more than you think — it moves your whole chart. Don't know it? **Ask your mom, she'll know 😉** (or check your birth certificate — it's on there)."*

   Add a "still don't know" fallback that noon-defaults with a clear disclaimer on the profile ("birth time approximate — Moon-sign matches only, no Ascendant-based features").

4. **Add messages schema**
   Migration for `messages` and `conversations` tables with RLS scoped to mutual-match pairs. No UI yet — just the data layer.

## 6. Sprint 2 Preview

- Aunty-voice LLM narration (Claude Haiku) on match view — takes full `MatchResult` JSON and writes the explanation
- Chat UI using Supabase Realtime
- Dasha overlap computation (Vimshottari comparison) added to `MatchResult`
- 7th house synastry overlay
- Move off Lovable → deploy to Vercel free tier

---

## 7. Reuse Note: Gambler's Dharma

The Python `vedic_engine/` in Gambler's Dharma has the ideal chart engine (pyswisseph, Lahiri + KP dual ayanamsha). We're not porting it here — the free-tier edge-function path uses TypeScript. But if the Aunty engine's TypeScript chart layer ever drifts, we cross-check against Gambler's Dharma's pyswisseph output for the same birth data. That's the ground truth.
