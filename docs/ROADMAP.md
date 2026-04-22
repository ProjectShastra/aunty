# Aunty Roadmap

## Sprint 1 — Correctness Pass (now)
**Goal:** What exists works right. Nothing new in the product.

- [ ] **Replace `planetary-calculations.ts`** with `astronomia`-backed positions
- [ ] Add reference fixture suite (10+ charts vs Gambler's Dharma ground truth)
- [ ] Port `src/lib/vedic-astrology/` → `supabase/functions/_shared/vedic/` (Deno-compatible)
- [ ] Rewrite `fetch-matches` to call `evaluateMatch()` server-side, return ranked `MatchResult` list
- [ ] Remove shallow inline Nadi/Manglik logic from edge function
- [ ] Rewrite `Onboarding.tsx` birth-time prompt in Aunty voice + add "I don't know" fallback with noon-default disclaimer
- [ ] Add `messages` + `conversations` migration (schema only, no UI yet)
- [ ] Set up Vercel project + CI deploy from `main`
- [ ] Kill the Lovable subscription

**Exit criteria:** A new user can sign up, see properly-ranked profiles using the full Ashtakoota+Manglik+Jaimini engine, with planetary positions validated against Swiss Ephemeris.

## Sprint 2 — Aunty Voice + Chat
**Goal:** Matched users can talk, and they understand *why* they matched.

- [ ] `messages` UI with Supabase Realtime subscription
- [ ] Match-explanation edge function (Claude Haiku) — inputs full `MatchResult`, outputs Aunty-voice narration
- [ ] Add Dasha overlap (Vimshottari) to `MatchResult`
- [ ] Add 7th-house synastry overlay
- [ ] Add cross-chart aspect synastry (Moon-Venus, Sun-Moon, Moon-Jupiter)
- [ ] Typing indicators + read receipts
- [ ] Unmatch / block / report

**Exit criteria:** Match view shows a paragraph of Aunty-voice explanation tied to real planetary interactions, not templated scores.

## Sprint 3 — Trust + Growth
**Goal:** Safe to invite friends.

- [ ] Photo moderation (Supabase + Sightengine free tier)
- [ ] Email notifications via Resend
- [ ] Location filtering (diaspora city + India city)
- [ ] Birth-time rectification flow (optional upsell — user enters life-event dates, we narrow)
- [ ] Dasha "best marriage year" badge on profiles
- [ ] Analytics (PostHog)

## Sprint 4 — Differentiation
- [ ] Aunty as AI concierge — proactive nudges ("beta, you haven't messaged Rohan in 3 days")
- [ ] Audio/video intro loops
- [ ] Family intro flow (South Asian moms opt into seeing potential match profiles)
- [ ] Premium tier (rationale TBD — initial direction: deeper dasha readings, personalized remedies)
