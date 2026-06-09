# Sources Audit — Every Rule, Verified or Flagged

**Date:** 2026-06-09. **Mandate:** every astrological rule and table in the engine must trace to a verified source — classical text or named professional/academic author. Modern renditions acceptable if professionally sourced. Reddit/Quora/anonymous content sites are corroboration at best, never the basis.

**Method:** full code inventory, then independent verification of each rule against classical texts in translation and named authors (B.V. Raman, K.S. Charak, K.N. Rao, P.V.R. Narasimha Rao, Sanjay Rath, Sarajit Poddar) plus established software references (Jagannatha Hora, Maitreya/Saravali, Drik Panchang). Owner's local reference library (mounted folders "Vedic #1", "Vedic #2": Muhurta Chintamani, BPHS Santhanam, Jataka Parijata Sastri, Saravali, Phaladeepika, Brihat Jataka, Jaimini Sutras, Raman's Muhurtha-adjacent works, Trivedi's "An Insight into Kuja Dosha", K.N. Rao marriage works, PVR Rao "Integrated Approach") is the verse-level tier for each upcoming fix.

**Verdict legend:** ✅ Classical-verified · 🟢 Modern-professional · 🟡 Variant-disputed · 🔴 Unverified/wrong · 🏷️ Product-tuning (acceptable if labeled)

---

## 1. Ashtakoota (guna-milan.ts + ashtakoota-tables.ts)

| Rule | Verdict | Finding |
|---|---|---|
| Varna mapping, hierarchy, boy≥girl rule | ✅ | Matches dominant convention (Drik Panchang / Muhurta-Chintamani lineage). Minority variant exists (Saravali swaps two groups); we follow the dominant one — document choice. |
| Vashya sign classes | 🟡 | Correct except **Sagittarius and Capricorn are split signs** (Sag 0–15° Manav / 15–30° Chatushpad; Cap 0–15° Chatushpad / 15–30° Jalchar) per Drik Panchang, AnytimeAstro, Saravali. Code's whole-sign version misclassifies half of Sag/Cap Moons. Needs Moon longitude, not just sign. |
| Vashya score matrix | 🔴 | Fractional scores are standard, but the code's exact matrix **matches no published table**. Published families disagree with each other (2/1/0.5/0 vs 2/1.5/1/0) but the code conflicts with all on multiple cells (e.g., Keeta rows). Re-derive from one named family, cite it. |
| Tara names/order, 1.5-step structure | ✅ | Correct. |
| Tara counting + malefic set | 🔴 **BUG** | Off-by-one: uses exclusive count; classical is **inclusive**. And the malefic taras are wrong: code penalizes {1 Janma, 3 Vipat, 7 Vadha}; classical is **{3 Vipat, 5 Pratyari, 7 Vadha}** (Saravali, Jagannath Hora, Poddar). Combined effect verified by simulation: the koota is **effectively inverted** — good positions penalized, bad rewarded. Up to 3 pts wrong. |
| Yoni: all 27 animal+gender assignments | ✅ | Verified entry-by-entry vs Saravali. Perfect. |
| Yoni: 7 enemy pairs | ✅ | Exactly the classical list. |
| Yoni scoring | 🟡 | Classical is graded 4/3/2/1/0 (full 14×14 matrix); code collapses to 4/3/2/0, losing the "friendly"=3 and "unfriendly"=1 tiers. Same-animal-different-nakshatra-gender=3: unsourced app convention. Replace with the published matrix. |
| Graha Maitri: friendship table | ✅ | Matches BPHS naisargika maitri cell-for-cell. |
| Graha Maitri: score map (5/4/3/1/0.5/0) | ✅ | Standard North-Indian compound table (corroborated across professional sources). The audit's earlier "made-up 0.5" suspicion was **wrong** — fractional Maitri is classical practice. Document variant family. |
| Gana: all 27 assignments | ✅ | Perfect vs classical list. |
| Gana matrix | 🟢 | Cell-for-cell identical to Maitreya/Saravali implementation. A second professional family transposes two cells; both defensible — document which we follow. |
| Bhakoot: dosha pairs 6-8 / 2-12 / 5-9, 7/0 scoring | ✅ rule / 🔴 **BUG** | The rule is classical, but the implementation computes exclusive distances that can never satisfy the test: **0 of 144 sign pairs ever trigger Bhakoot Dosha** (verified by exhaustive simulation). Dead code; every couple silently gets 7/7. The single largest scoring error in the engine. |
| Nadi: all 27 assignments, 8/0, dosha flag | ✅ | Perfect. (Classical pada-level Nadi exceptions not implemented — acceptable, note for Sprint 2.) |
| 36-pt structure, koota weights 1–8 | ✅ | Classical. |
| Verdict thresholds (28/21/18/14) | 🟡 | Convention: <18 reject, 18–24 average, 25–32 very good, 33–36 excellent. Keep the 18 floor; align bands. |
| Symmetric scoring extension (Sprint 1.2) | 🏷️ | Correctly labeled product convention; classical texts assign fixed roles. |

## 2. Manglik (manglik-checker.ts)

| Rule | Verdict | Finding |
|---|---|---|
| Houses [1,4,7,8,12] from Lagna only | 🟡 | Recognized popular variant (Drik Panchang uses it), **but** B.V. Raman's verse set is 2,12,4,7,8 and he requires checking **from Lagna, Moon, AND Venus** ("weak from Lagna, stronger from Moon, strongest from Venus"). Code misses the 2nd house and the Moon/Venus reference points entirely. |
| Severity tiers (7/8 severe; 1/4 moderate; 12 mild) | 🔴 | No source for this 3-tier scheme. Traditional intensity scale: **8th 100% > Lagna 50% > 7th 25% > 4th 12.5% > 12th/2nd 6.7%** (Dr. A.P. Rao). Re-derive. |
| Cancel: Saturn aspects Mars | 🔴 | No classical/named-author basis found. Worse: code also counts Saturn *conjunct* Mars — classically an affliction, not a remedy. Remove/replace with sourced rules. |
| Cancel: Mars in own sign | ✅ | Muhurta Chintamani lineage (own sign, exaltation; Jagannath Hora rules summary). |
| Cancel: Jupiter conjunct/aspecting Mars | ✅ | Widely attested; code's 5/7/9 graha-drishti aspects are correct. |
| Cancel: age > 28 | 🔴 | Folk belief from Mars maturity (~28); **no classical text** supports age-based cancellation (BPHS, Phaladeepika silent). In code it auto-cancels nearly every adult user. Remove. |
| OR-stack (any one rule fully cancels) | 🔴 | Not classical methodology; practice weighs cumulative intensity. Replace with weighted model. |
| Mutual Manglik neutralization | ✅ | "Dosha Samya" — standard. Caveat: strict practice compares severity parity; note for the fix. |
| Missing sourced cancellations | — | Mars debilitated (Jataka Chandrika), Mars in friend's sign, house-sign verse set (Aries-1st, Scorpio-4th, etc. via H.N. Katwe / Jagannath Hora), benefic in kendra. Add with citations during Sprint 1.3, cross-checked against local library (Muhurta Chintamani PDF + Trivedi's "An Insight into Kuja Dosha"). |

## 3. Jaimini layer (jaimini-karakas.ts + soulmate-bonus.ts)

| Rule | Verdict | Finding |
|---|---|---|
| 7-karaka scheme (no Rahu), AK=highest degree-in-sign, DK=lowest | 🟢 | Legitimate scheme (BPHS gives both 7 and 8); ranking convention correct; degree-in-sign ignoring sign correct. Note: Rath school uses 8 with Rahu reversed — users of that school may compute a different DK. Tie-handling missing (BPHS: Rahu substitutes on exact tie) — minor. |
| AK=partner's DK → "soulmate" | 🟢/🏷️ | Modern practitioner technique (Lubomira Kourteva et al.), **not classical Jaimini** — and the practitioner version compares planet *placements*, not same-planet-name identity as the code does. Keep as feature, label as modern technique, never present as shastra. |
| Bonus points (10/5/3/2/2) | 🏷️ | No precedent; pure product tuning. Acceptable if labeled. |
| Navamsha (D9) math | ✅ | Hand-verified: the element-start formulation is mathematically identical to the classical movable/fixed/dual rule. Real D9, not a stand-in. |
| D9 Moon=Lagna overlay → "deep attraction" | 🏷️ | D9 transplant of the rashi-level Janma-Rashi=Lagna consideration; no named source for the D9 version. Label as app heuristic. |

## 4. Constants & supporting tables — all ✅

Nakshatra lords = exact Vimshottari sequence; sign rulers classical (no outer planets); exaltation/debilitation signs correct per BPHS/Phaladeepika; Vimshottari years sum to 120; nakshatra/pada arcs correct. Ephemeris layer separately validated vs Swiss Ephemeris (see planetary-calculations.ts header).

## 5. Product labels (matching-utils.ts)

"Twin Flame" is new-age (non-Vedic) branding — fine as voice, never present as an astrological finding (Skeptic Rule applies). Nadi Dosha → bottom tier is consistent with Nadi's classical weight.

---

## Newly discovered implementation bugs (beyond the known audit list)

1. **Bhakoot Dosha is unreachable** — exclusive-count math means no couple ever gets the dosha; 7 free points for everyone. *Critical.*
2. **Tara Koota is effectively inverted** — off-by-one inclusive-count bug + wrong malefic-tara set. *High.*

These join the Sprint 1 fix queue alongside Manglik (1.3). Proposed order: Bhakoot + Tara (pure bug fixes with classical answers already verified) → Manglik re-derivation (needs the careful sourced rewrite) → Vashya matrix + Yoni grading + thresholds (sourced re-derivation, lower stakes).

## Standing rule going forward

Every rule in code carries a source comment: text + translation/edition (+ verse where pinned) or named professional author. Anything tuned for product gets `[product convention]`. The local PDF library is the preferred citation tier; web sources are corroboration. A one-page rules summary will be maintained for external review by a practicing Jyotishi.
