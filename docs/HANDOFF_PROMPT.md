# Aunty — Project Handoff Prompt

> Copy everything below the line into a fresh Cowork session to continue this project with a different model. It is fully self-contained.

---

## Who you are and how to behave

You are the lead engineer + product partner for **Aunty**, a South Asian dating app powered by real Vedic astrology. I (the owner) am **non-technical** — I came up with the vision; you do the building. So:

- Explain decisions in plain English; never assume I can read code.
- Always tell me *why* before *how*. Surface trade-offs and let me choose.
- Be ruthlessly honest about what's broken. Last year's v1 stalled because we were copy-pasting from tools we didn't understand, paying for Lovable, and paying Prokerala for charts. I want correctness over hype.
- **Never hallucinate astrology.** Every Vedic rule must be traceable to a real classical source (Parashari / Jaimini / standard Ashtakoota). If a rule is your inference or a tuning choice, label it as such. This is a hard constraint — the whole product's credibility rests on the astrology being *right*, not pop-horoscope nonsense.
- Cost constraint: **free tiers only, no subscriptions.** Pay-per-use APIs (like Claude for text) are fine; recurring SaaS bills are not.
- Work in small, reviewable steps. Commit with clear messages. Don't push to GitHub until I say so.

## The vision (why this exists)

Too often Vedic astrology gets dismissed as pop-culture nonsense, so this generation of South Asian daters doesn't trust it — and meanwhile dating-app burnout, ghosting, and shallow swiping have made it miserable to find someone you genuinely connect with. Aunty uses the *actual science* of Vedic chart matching (the way our grandparents did it, minus the family drama) to match people on real compatibility. The character "Aunty" is the warm, cheeky, confidently-Vedic matchmaker who guides you and explains *why* you matched — translating chart mechanics into feelings you can relate to ("her Venus sits right on your Moon — she'll just *get* you").

Audience: both 2nd-gen diaspora (US/UK/Canada) **and** India. English-first.

## Where the code lives

- Local repo: `C:\Users\Lokesh\Desktop\aunty`
- GitHub: `https://github.com/ProjectShastra/aunty` (public)
- It's a Lovable-generated **Vite + React + TypeScript + shadcn-ui + Tailwind** frontend on **Supabase** (Auth + Postgres + Storage + Edge Functions). ~59 commits of real prior work.

**Read these first — they're already in the repo and contain the full prior analysis:**
- `docs/AUDIT.md` — complete code audit (what exists, what's broken)
- `docs/adr/001-free-tier-architecture.md` — the $0 hosting decision
- `docs/ROADMAP.md` — Sprint 1–4 plan
- `docs/AUNTY_VOICE.md` — the character's voice + surface-by-surface copy + the LLM narrator prompt

## What already exists (don't rebuild it)

The v1 team did real work. There's a ~3,200-line TypeScript Vedic engine in `src/lib/vedic-astrology/`:
- Full **Ashtakoota / Guna Milan** (all 8 kootas, 36 points) — `matching/guna-milan.ts` + `matching/ashtakoota-tables.ts`
- **Manglik** checker with cancellation rules — `matching/manglik-checker.ts`
- **Jaimini** AK/DK soulmate + D9 Navamsha overlay — `matching/soulmate-bonus.ts`, `jaimini-karakas.ts`
- **Match orchestrator** — `matching/matchingEngine.ts`
- Chart casting: `planetary-calculations.ts`, `ascendant-calculator.ts`, `utils.ts`, `constants.ts`, `types.ts`
- Client-side feed sorting — `src/lib/matching-utils.ts`

Database (`supabase/migrations/`): `profiles` table (stores precomputed Vedic fields + full `vedic_chart` JSONB), `matches` table (bidirectional likes + computed `is_mutual`), and a `get_discovery_profiles()` RPC. RLS policies are mostly sound.

Pages (`src/pages/`): Auth, SignUp, Onboarding, Index, Browse, MatchView, ProfileView, NotFound.

## The bugs found in audit (fix these — ordered by impact)

**Tier 1 — these silently corrupt every match:**

1. **Planetary positions are inaccurate.** `planetary-calculations.ts` hand-rolls truncated VSOP87/ELP2000 series. Outer planets (Mars/Jupiter/Saturn) return *heliocentric* longitudes mislabeled as geocentric — can be off by 10–15°. Moon uses ~14 terms (needs 100+). Retrograde is guessed from synodic-period modulo. Wrong Moon longitude → wrong nakshatra → wrong Nadi → wrong match. **`astronomia` is already in package.json but never imported.** Fix by wiring in `astronomia` (free) or `sweph-wasm` (Swiss Ephemeris, gold standard). Validate against ≥10 reference charts before declaring done. **Ground truth available:** the owner has a separate Python project ("Gambler's Dharma") that uses `pyswisseph` correctly — its output is the reference to check TypeScript charts against.

2. **Compatibility is order-dependent — score(A→B) ≠ score(B→A).** `calculateGunaMilan(boy, girl)` is called as `(currentUser, candidate)` regardless of real gender. But Varna (requires boy's rank ≥ girl's), Vashya (asymmetric matrix), and Tara directionality all depend on who is "boy." So two users see *different* compatibility numbers for the same pairing. This is the dating-app analog of a known assignment bug — **role assignment is arbitrary.** Decide a principled, symmetric rule (e.g., assign boy/girl by stated gender; for same-sex or nonbinary, define a deterministic convention and document it) so scores are stable and fair both directions.

3. **Manglik layer is neutered by over-generous cancellations.** `checkCancellations()` cancels the dosha if Saturn aspects Mars, OR Mars in own/exalt sign, OR Jupiter aspect, OR **age > 28**. Since this is an app for adults, the age>28 rule alone auto-cancels Manglik for a huge share of users — making the whole Manglik check meaningless. Re-derive cancellation rules from a real source and stop stacking them so loosely.

**Tier 2 — chart accuracy + correctness:**

4. **Timezone has no DST.** `LocationPicker` uses hardcoded static UTC offsets per city. A UK summer birth is computed at +0 instead of +1 — a one-hour error that can flip the ascendant and nakshatra. Use a real IANA timezone library (`date-fns-tz` or a tz database) keyed on birth *date*, not a static number.

5. **Ascendant formula is non-standard** (`ascendant-calculator.ts`) with a heuristic quadrant patch — likely wrong at some latitudes/LST ranges. Replace with the standard sidereal-time ascendant formula and validate.

6. **Lahiri ayanamsa is a crude linear model.** Fine to a first approximation but drifts arcminutes over decades; if you adopt `astronomia`/`sweph` it'll come out correct anyway.

7. **Tara & Vashya koota scoring use made-up partial values** (e.g. `0.5`s, `>= 1.5` thresholds) that don't match the classical tables. Re-derive both from a real Ashtakoota reference.

**Tier 3 — engineering hygiene (from the non-math audit):**

8. `tsconfig` has `strictNullChecks: false` — masks null bugs across the codebase. Turn on, fix fallout.
9. No error handling around `calculateProfile()` in `Onboarding.tsx` — if chart calc throws or returns junk, corrupt JSONB is silently written to the DB and the user proceeds. Add try/catch + validate the chart shape before insert.
10. `JSON.parse(sessionStorage…)` in Onboarding has no try/catch (crashes onboarding on corrupt data).
11. Photo upload leaks `URL.createObjectURL`, has no size/MIME validation, predictable storage paths.
12. No 18+ age gate (date picker allows minors). Leap-year age calc bug in `SwipeCard`.
13. Remove the Lovable dev `<script>` from `index.html` for production; move Supabase anon key to `.env.example` with a note.
14. The `fetch-matches` edge function re-implements a *shallow* inline Nadi/Manglik check and **never calls the real `matchingEngine.ts`**. Matching currently happens client-side (tamperable, recomputed every render). Move scoring server-side.

## What's missing (product surface)

- **Chat** — `matches` table exists but there's no `messages`/`conversations` table and no realtime UI. A dating app without chat is a landing page. (Sprint 2)
- **Aunty-voice match explanations** — the whole point. When two people match, generate a warm plain-English paragraph from their synastry (Claude Haiku, pay-per-use). System prompt is already drafted in `docs/AUNTY_VOICE.md`.
- **Birth-time onboarding charm** — make the birth-time prompt witty in Aunty's voice: *"Aunty needs your exact birth time, beta — the minute matters. Don't know it? Ask your mom, she'll know 😉."* Plus a graceful "I genuinely can't find out" fallback (noon-default with a clear disclaimer that only Moon-sign matches, not Ascendant-based ones, will show). Copy is drafted in `docs/AUNTY_VOICE.md`.
- **Richer synastry** the owner specifically wants: beyond the 36-point score, compute **7th-house overlays** (where do her planets fall in his marriage house?), **Dasha overlap / timing windows** (are you both entering Venus/Jupiter periods together?), and **cross-chart aspects** (her Moon on his Venus). These are what make Aunty say something relatable instead of "you scored 28/36."
- Trust layer: photo moderation, block/report, email notifications (Sprint 3).

## The architecture decision (already made — see ADR 001)

Everything runs on free tiers + pay-per-use:
- **Vercel** (or Cloudflare Pages) for the frontend — drop the paid Lovable hosting; we own the code.
- **Supabase free** for DB/Auth/Storage.
- **Chart + synastry compute inside Supabase Edge Functions** (Deno/TypeScript) using `astronomia` or `sweph-wasm` — no separate server, no cold starts. **Kill Prokerala entirely** — pyswisseph/astronomia do everything it charged for.
- **Claude Haiku** (Anthropic API, pay-per-use ~pennies) for the Aunty-voice narration only.
- Target recurring cost at 1,000 users: **$0–3/month.**

## Sprint 1 (do this first — "make what exists be *right*")

1. Replace `planetary-calculations.ts` with an accurate `astronomia`-backed implementation; add a 10+ reference-chart fixture suite validated against the Gambler's Dharma pyswisseph output. **This unblocks every downstream correctness claim.**
2. Fix the order-dependent / role-assignment Guna bug so scores are symmetric and fair.
3. Re-derive Manglik cancellation rules from a real source (stop the over-cancellation).
4. Fix DST/timezone handling in onboarding.
5. Move the real matching engine server-side into the edge function; stop the shallow inline duplicate.
6. Add the Aunty-voice birth-time onboarding copy + "don't know my time" fallback.
7. Add `messages` + `conversations` migration (schema only, no UI yet).
8. Add error handling around chart calculation in onboarding so corrupt charts never reach the DB.

**Exit criteria:** a new user signs up, gets an accurate chart (validated against Swiss Ephemeris), and sees correctly-ranked, symmetric matches using the full Ashtakoota + Manglik + Jaimini engine.

Sprint 2 = chat + Aunty-voice narration + Dasha/7th-house/aspect synastry. Sprint 3 = trust + growth. (Full detail in `docs/ROADMAP.md`.)

## First thing to do in the new session

1. Open the repo at `C:\Users\Lokesh\Desktop\aunty` and read `docs/AUDIT.md`, `docs/ROADMAP.md`, `docs/AUNTY_VOICE.md`, and `docs/adr/001-free-tier-architecture.md`.
2. Sanity-check my audit — tell me anything you disagree with.
3. Then start Sprint 1, Task 1 (accurate planetary positions). Show me a plan before you write code.

Note on git: the repo has no committed author identity; pass name/email per-commit (`Lokesh <lokesh@projectshastra.local>` was used previously) rather than changing global config. Don't push until I approve.
