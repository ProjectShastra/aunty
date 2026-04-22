# ADR 001 — Free-Tier Architecture

**Status:** Accepted
**Date:** 2026-04-22
**Context:** Initial build-out of Aunty following a paused v1 that was expensive (Lovable + Prokerala API).

## Decision

Run the entire stack on **free tiers + pay-per-use** only. No recurring subscriptions.

| Layer | Service | Why |
|---|---|---|
| Frontend hosting | **Vercel** (or Cloudflare Pages) | Free personal tier; drop Lovable |
| Database / Auth / Storage | **Supabase free** | Already set up; 500 MB DB, 50K MAU, 1 GB storage |
| Chart + synastry compute | **Supabase Edge Functions + `astronomia`** (or `sweph-wasm`) | Runs inside Supabase free tier, no separate host |
| AI narration (Aunty voice) | **Anthropic API — Claude Haiku** | Pay-per-use (~$0.25/1M input tokens). Not a subscription |
| Transactional email | **Resend free** (3K/mo) | Used later for match notifications |
| Analytics | **PostHog free** (1M events/mo) | Optional |
| Repo | **GitHub public** | Free |

**Target recurring cost at 1,000 MAU:** $0–3/month (Claude API usage only).

## Alternatives Considered

### A. Python FastAPI service on Render/Fly (share code with Gambler's Dharma engine)
**Rejected.** Render free tier spins down after 15 min idle → 30–60 s cold start = bad first-swipe UX. Fly.io free tier was recently tightened. Not worth the code-sharing win: the overlap with Gambler's Dharma (chart casting, ayanamsha, dasha math) is ~300 lines — trivially portable to TypeScript. Marriage-specific logic (Ashtakoota, Manglik, Navamsha synastry) is entirely net-new and has no counterpart in Gambler's Dharma.

### B. Keep Lovable
**Rejected.** User flagged cost as a blocker from v1. Lovable generates standard Vite + TS — we own the code, no lock-in, Vercel deploys it identically.

### C. Prokerala API for charts
**Rejected.** Paid, rate-limited, and unnecessary given `astronomia` (already in deps) or `sweph-wasm`. Prokerala was a key v1 cost killer.

## Consequences

**Positive**
- Zero fixed monthly cost until scale forces tier bumps
- Single deploy pipeline (everything lives in Supabase + Vercel)
- No cold-start penalty — edge functions warm in ~50–200 ms
- Ground truth cross-check available: Gambler's Dharma's pyswisseph output for any birth data

**Negative**
- Chart math in TypeScript, not Python — cannot directly import the Gambler's Dharma engine
- `astronomia` accuracy is arcminute-level (sufficient for nakshatra work, 13°20′ buckets) but not arcsecond — if we later find edge cases at nakshatra boundaries, we upgrade to `sweph-wasm`
- Supabase free tier caps: 500 MB DB (~500K profiles with current schema), 50K MAU, 2 GB egress — fine through low-thousands of users; upgrade triggered by growth, not by architecture

## Ground-Truth Validation

Any change to the chart-calculation layer must be validated against at least **10 reference charts** computed with Gambler's Dharma's pyswisseph engine for the same birth data. Acceptable drift: < 0.1° per planet longitude, correct nakshatra assignment in 100% of cases.

Reference chart suite lives in `supabase/functions/_shared/vedic/__fixtures__/` (added in Sprint 1).
