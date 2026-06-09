# Competitive Design Brief — 2026-06

**Purpose:** Make Aunty's product flow and look compete with — and beat — Dil Mil, Mirchi, and Hinge, and out-execute align27 on astrological storytelling. Sources: 34 align27 couples-report screenshots (full transcription in session archive), public UX teardowns and review analysis (June 2026).

---

## 1. align27 couples report — reverse-engineered

### 1A. The scoring model is fully cracked

The screenshots expose section denominators. Their 100-point engine:

| Section | Points | Weight | Lokesh × Bianca |
|---|---|---|---|
| Soul Print | /20 | 20% | 4.2 (21%) |
| Chemistry | /25 | 25% | 17.5 (70%) |
| Long Game | /15 | 15% | 10.5 (70%) |
| Synastry | /40 | **40%** | 29 (72.5%) |
| **Total** | /100 | | **61.2** ✓ |

Sum matches the headline score exactly. Their own copy admits the bias: *"Synastry carries the most weight in the reading because it captures the most nuance."*

### 1B. What each category actually computes (evidence from snippets)

- **Soul Print** = four "static" pairwise comparisons: Moon (emotional), "daily rhythm," Sun, Venus — plus an additive cross-connection bonus. Despite the mystical name, no Jaimini/Darakaraka content appears.
- **Chemistry** = classical kootas in disguise + planet pairs: Mars–Venus ("Spark"), **Gana** ("Vibe Match"), **Yoni** ("Sexual Compatibility"), **Nadi** ("Depth Frequency" *and* "Energy Exchange" — double-counted), Mercury ("Mind Meld").
- **Long Game** = the extended kuta set beyond Ashtakoota: **Stree Deergha**, **Mahendra**, 7th-lord harmony, a Mars "Intensity Test" (Kuja-adjacent), plus a "structural distance" longevity check.
- **Synastry (40%)** = same-sign overlay contacts only: "Planet → Planet in [Sign]" cards, tiered into positive / friction / neutral, with Rahu contacts badged "KARMIC AXIS." **No aspects, no houses** — sign conjunction only.
- **Override Flags** close the report: three plain-language callouts that re-surface the biggest structural results (Stree Deergha, Nadi, Moon gap).

### 1C. Honest assessment of their astrology

Real classical material (Gana, Yoni, Nadi, Stree Deergha, Mahendra, 7th lords) wrapped in renamed packaging — but notably **no nakshatra-level analysis, no ascendant, no Navamsha, no dasha timing anywhere** in 34 screens, and their headline "synastry" is sign-bucket granularity (30° resolution). Our engine already computes at degree-level with Jaimini karakas, and Sprint 2 adds dasha overlap + 7th-house overlays. **On substance we can beat them outright.** They also double-count Nadi across two Chemistry sub-scores and contradict themselves (Stree Deergha scored 0.5/2.5 in Long Game, then "passed cleanly" in an override flag) — sloppiness a careful engine won't have.

**Adopt for our extended kuta layer (with classical citations, Sprint 2+):** Stree Deergha and Mahendra are genuine South-Indian-tradition kutas computed from nakshatra distance — cheap to add to our engine and they round out the "will it last" story.

### 1D. Their five design patterns worth stealing

1. **One ruthless card template:** big color-coded number → category label → human verdict title ("On Fire," "Energy Drain") → italic question → one ~100-word plain-English paragraph. Jargon demoted to a single phrase mid-narrative.
2. **Scroll choreography:** the next card's giant numeral always peeks above the fold; the next section header peeks below the last card. Continuous teaser engine.
3. **Honesty as luxury:** 0-scores stated bluntly, then reframed as actionable counsel. Bad news builds trust; good scores feel earned.
4. **Heavy name injection:** full names in nearly every sentence — intensely personal.
5. **Narrative tiering + closing flags:** synastry hits grouped under editorial headlines instead of a chart wheel; report ends on three memory-sticky takeaways.

**Their weaknesses we exploit:** zero visual variety (text walls, no diagrams), template seams (mid-sentence capitalization bugs), no timing dimension, sign-only synastry, and a clinical tone — no character. Aunty's voice does what their template prose can't.

---

## 2. Dating-app competitors

### Dil Mil — owns cultural filtering, executes poorly
- Onboarding: <5 min to browsing; cultural depth (community, religion, education) deferred until after first browse — good completion tactic.
- Tinder-style swipe deck; shallow profiles; shows "popularity %" and response-rate stats.
- Match → free immediate chat, no structure, no context.
- Complaints checklist: no distance filter, wonky filters, repeated profiles, paywall resentment ("blatant cash grab"), near-unusable free male experience.
- Astrology = one throwaway stat ("signs that like you most").

### Mirchi — warm ideas, fatal reliability
- Liked: visible likes without paywall, photo comments, video "Peeks," nearby map.
- Review themes are a what-not-to-ship checklist: crashes, **messages disappearing so matches think you ghosted**, no profile verification → bots, broken distance range, dead profiles.
- Cultural play is ambient (South Asian pool) not structural — no community/astrology features.

### Hinge — the interaction-quality benchmark
- Onboarding: long but deliberate; one question per screen; visibility toggles; 6 photos + 3 prompts required — quality floor protects the whole marketplace.
- **No swipe deck:** one profile at a time as a scrollable stack of photo cards and prompt cards, each individually likeable. You like a *specific thing*, not a person wholesale.
- **Match arrives with context:** likes carry comments on a specific card; commented likes are 2× as likely to lead to a date (Hinge's own data). "Your Turn" labels assign conversational responsibility — structural anti-ghosting.
- Visual identity (Red Antler): black/white + single accent (Kohlrabi green), typography-forward, editorial. The premium benchmark.
- Complaint themes: 8-like/day cap, "Rose jail" perception.

### Astrology presentation benchmarks
- **Struck:** 5-star meter, one star per planet (Mercury=communication, Venus=love, Moon=emotions, Mars=sex, Rising=personality). Cleanest scannable-synastry pattern found.
- **NUiT:** full birth-chart synastry visualized legibly for novices.
- No mainstream app and **no South Asian app does real chart matching** — despite kundli matching being culturally native to our audience. This is Aunty's open lane.

---

## 3. Design principles for Aunty

**Positioning sentence:** Hinge's interaction quality × Dil Mil's cultural specificity × a real Vedic engine nobody else has — narrated by a character no template can match.

1. **Profile = scrollable card stack, not a swipe deck** (Hinge pattern). Photo cards + prompt cards + one **"Aunty's take" card** — a single-line chart tease per candidate ("Her Moon sits in your 7th house, beta. Just saying."). Each card individually likeable.
2. **Likes carry context.** Liking a specific card nudges a comment (Hinge's 2× mechanic). Aunty suggests a starter tied to the chart connection.
3. **Match moment = the payoff screen.** "Arre, look at this 👀" + the Haiku-narrated explanation (Sprint 2). This is our version of Hinge's comment-context: the conversation starts with *why you two make sense*.
4. **Compatibility report = align27's structure, Aunty's soul.** Card template (big number → verdict title → one warm paragraph), scroll choreography, tiered synastry feed, closing "Aunty's real talk" flags (= their Override Flags; already specified in AUNTY_VOICE.md). Add what they lack: a Struck-style planet meter for scannability, dasha timing windows, degree-level aspects.
5. **Honesty as luxury.** Never inflate a score. Bhakoot Dosha gets named, explained in feeling-terms, and framed as a growth edge. Trust is the moat — same reason "every rule traces to a classical source" is an engine rule.
6. **Onboarding = Hinge discipline + Aunty charm.** One question per screen, witty birth-time copy with the "ask your mom 😉" beat and noon-default fallback, a quality floor (photos + minimum prompts), cultural fields with visibility toggles (Dil Mil's depth without its walls). Add the 18+ gate here (also an audit item).
7. **Ship the boring things competitors fumbled:** working distance filter, reliable message delivery, profile verification path, no pay-to-function male experience. Mirchi's review page is the cautionary tale.
8. **Visual identity:** typography-forward, warm-dark editorial base with a single warm accent; premium like Hinge, never "game-like" (Mirchi's mistake). Aunty's playfulness lives in the *copy and mascot moments*, not in juvenile UI.

## 4. Concrete implications

| Item | Where it lands |
|---|---|
| Aunty's-take teaser card on profiles | Sprint 2 (needs server-side engine first) |
| Match-moment narration screen | Sprint 2 (already on roadmap) |
| Report layout (cards, tiers, real-talk flags) | Sprint 2 design work; voice already drafted |
| Stree Deergha + Mahendra kutas (with citations) | Sprint 2 engine extension |
| Comment-on-card like mechanic | Sprint 2/3 (after messages schema) |
| 18+ gate, photo validation, distance filter | Sprint 1/3 (audit items 3I, roadmap) |
| Planet-per-star scannable meter | Sprint 2/3 visual design |

Nothing here changes Sprint 1. Correct positions, symmetric scoring, real Manglik rules, DST, and the server-side engine remain the foundation everything above renders from.
