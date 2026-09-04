# Contract Cockpit v7.6.1 — Independent Product, Legal, Technical and Clean-Sheet Audit

**Auditor:** Independent review (Claude, Anthropic), conducted by direct code inspection, live application testing (Playwright/headless Chromium), and execution of the shipped regression suite.
**Date:** 2026-09-04
**Version reviewed:** v7.6.1 ("Focus & Fidelity")

---

## A. Executive verdict

Contract Cockpit is a genuinely unusual piece of software: a single-author, ~12,000-line, dependency-free, offline-first legal-review workbench that is more carefully engineered — on privacy, persistence, XSS-safety, and source-span provenance — than the great majority of funded legal-tech products. The "no cloud, no telemetry, no LLM" claim was verified, not assumed: a full code search of every `.js` file in the shipped app found zero outbound network calls anywhere except the service worker's same-origin asset caching. That is a real, load-bearing engineering achievement, not marketing.

At the same time, this audit found two **Critical**, independently reproduced problems that sit squarely inside the product's stated purpose and directly contradict its own design principle ("failures must not look clean," AUDIT_MATRIX_v7.6.1.md line 37):

1. **A lawyer's recorded decision can be silently lost.** Live-reproduced: accepting a clause decision and closing/reloading the tab within ~1.5 seconds discards the decision with no error, despite an immediate "Decision saved" toast. Waiting 3 seconds preserves it. This is the exact "lawyer believes work was saved when it wasn't" scenario the audit brief was designed to catch — reproduced, not inferred.
2. **A detector's silence is not evidence of absence, but the UI cannot tell the difference.** The "checked · none found" green-check signal is wired only to whether DOCX extraction succeeded, not to whether the underlying regex/heuristic actually has coverage for the drafting style in front of it. Combined with a literal-phrase-brittle liability-cap detector (misses "shall … exceed" with intervening words, a completely ordinary construction) that cascades into playbook non-applicability, risk-floor non-triggering, and commercial-summary silence — a real, competently drafted liability cap can be invisible to *every layer of the tool at once*, and the UI will still show a reassuring checkmark.

Neither of these is a hypothetical edge case. Both are common, everyday contract-drafting patterns. Both were reached through direct code tracing with file:line citations, and the first was independently reproduced live in a running browser.

**Strongest aspect:** the trust architecture around source fidelity and persistence — exact block-relative source spans that survive split/merge, self-disclosed extraction warnings that gate export, atomic paired IndexedDB writes, real cross-tab lease protection, a genuinely enforced CSP, and a verified zero-network posture. This is not a product bolting privacy language onto a leaky implementation; the implementation backs the claim.

**Most serious weakness:** the deterministic legal-analysis layer's false-clean risk is systemic, not anecdotal — it recurs across liability caps, warranties (no detector exists at all), cross-reference renumbering-drift (the semantic safety net silently disables itself on multi-topic clauses, which are the norm), and passive-voice obligations. The tool's own honesty infrastructure (the three-state "not-run/limited/checked" health signal) is present but measures the wrong thing, so it cannot actually deliver the assurance its checkmark implies.

**The most important strategic choice facing the product** is not "add more detectors" or "add an AI model" — it is deciding what a green checkmark is allowed to mean. Today it means "extraction succeeded." It needs to mean "we looked, and here is exactly what we looked for, in a form the lawyer can audit" — a fundamentally different (and achievable, still local-first) design goal than adding coverage.

**Is it converging toward a coherent professional product?** Yes, directionally. The v7.3–v7.6 release history shows a real pattern of consolidation (four workflow jobs instead of many overlapping ones, one canonical highlighting/variant map, one source-of-truth for progress metrics, warnings promoted into an export gate). But the pace of *feature* consolidation has outrun the pace of *detector-honesty* consolidation — the newest, best-designed piece of infrastructure (the three-state detector-health signal) was built and then wired to the wrong input. That is fixable without a rewrite, and doing so should be the single highest-priority engineering item ahead of any new capability.

**Present use boundary:** appropriate today for structural navigation, clause inventory, definitions/cross-reference/placeholder mechanical scanning (with verification), drafting/export scaffolding, and as a source-linked reading aid — always with the discipline of treating a populated finding as a lead and an absent one as untested, not confirmed-clean. It is **not** safe today for unsupervised reliance on "no issues found" for liability, warranties, or cross-reference integrity, and any decision recorded should be given a couple of seconds before closing the tab.

---

## B. Scope, methodology and evidence

### Artifacts inspected

| Artifact | SHA-256 | Verified identical to other artifacts? |
|---|---|---|
| `Contract-Cockpit-v7.6.1-Standalone.html` | `a06eaa97…61ab6` (per `SHA256SUMS_v7.6.1.txt`, independently recomputed and matched) | Byte-identical copy present in both the top-level release zip and the Source-Audit package |
| `Contract-Cockpit-v7.6.1-PWA.zip` → `cockpit/*` | recomputed per-file | Every file in the PWA's `cockpit/` (11 files: `app.js`, `analysis-core.js`, `review-core.js`, `workflow-core.js`, `playbook-core.js`, `index.html`, `styles.css`, `manifest.webmanifest`, `pwa.js`, `service-worker.js`, `shell-files.js`) is **byte-for-byte identical** to the corresponding file in the git repository (`Contract-cockpit/cockpit/`) and in the Source-Audit package's `public/cockpit/` |
| `Contract-Cockpit-v7.6.1-Source-Audit.zip` | recomputed | Contains the same `public/cockpit/*` (verified identical, see above) plus a Next.js/Vite/Cloudflare-Worker hosting harness, a Node test suite, and the golden DOCX fixture |
| `Contract-Cockpit-v7.6.1-Playbook-V3.json` | per `SHA256SUMS_v7.6.1.txt` | Not independently re-verified byte-for-byte in this pass; playbook content was instead verified by reading `playbook-core.js`'s `BUILTIN_PACKAGES` (same data, inlined) |
| Git repository `contractstories-tech/Contract-cockpit`, branch under audit | — | `cockpit/` contents byte-identical to all three packaged artifacts above; repo additionally carries `RELEASE_NOTES_v7.6.md`, `AUDIT_MATRIX_v7.6.md`, `README.md` (v7.6, not v7.6.1 — see Finding REL-1) |

**Conclusion: all four distributed artifacts (repo, PWA, Standalone HTML, Source-Audit) demonstrably come from the same source state.** This is a real, independently-confirmed provenance guarantee, not an assumption — every one of the eleven core JS/HTML/CSS files was hashed and cross-compared, not spot-checked.

### Environment

- Linux container, Node v22.22.2, Chromium 141 (Playwright 1.56.1) headless, served over `python3 -m http.server` on `127.0.0.1:8099` (no HTTPS — acceptable for local-loopback testing, not representative of a real HTTPS-hosted PWA install, which was **not tested**).
- Viewports exercised: 1400×900 (desktop), iPhone-13-class mobile emulation (~390×844 CSS px @3x DPR).
- No physical device, no Safari/WebKit or Firefox engine, no screen reader (VoiceOver/NVDA/JAWS) was available in this environment — **all engine-specific and assistive-technology behavior is Not tested** and should be treated as an open risk, not a pass.

### Tests performed and results

- **`node --test tests/cockpit-regression.test.mjs`** (no build required) — **93/93 pass**, both with and without the `COCKPIT_FIXTURE_DOCX` golden-fixture environment variable set.
- **`node --test tests/rendered-html.test.mjs`** — **fails** (`ERR_MODULE_NOT_FOUND`, missing `dist/server/index.js`), because it depends on a Next.js/vinext production build.
- **`npm run build`** (the literal script in `package.json`, and the prerequisite for `npm test`) — **fails**: `vite.config.ts` imports `./build/sites-vite-plugin`, which does not exist anywhere in the extracted Source-Audit package. `npm ci` itself succeeds (507 packages installed with network access).
- **Consequence:** `AUDIT_MATRIX_v7.6.1.md`'s claim of "Regression suite | 94/94 passed" is **not independently reproducible** via the documented `npm test` command in this or (very likely) any environment outside the original author's private hosting toolchain. The 93 ingestion/analysis-relevant tests that *can* run were executed and do pass; the 94th test (`rendered-html.test.mjs`, testing an unrelated Next.js SSR shell, not contract-analysis logic) could not be verified. See Finding REL-2.
- **Live application testing** (Playwright driving real Chromium against the served `cockpit/` static app): cold boot with console/network capture, DOCX import of a real 92-clause, 13-section service agreement (the shipped golden fixture) with pre-recorded ground-truth structure, navigation through Checks/Review/Resolve/Export, a clause decision recorded and verified against IndexedDB-backed reload behavior at two timing thresholds, CSV export inspection, and a mobile-viewport onboarding walkthrough.
- **Static code audit**, performed by three independent focused passes (source-fidelity/DOCX ingestion; legal-analysis detector logic; persistence/PWA/security), each reading the full text of `analysis-core.js`, `review-core.js`, `workflow-core.js`, `playbook-core.js` and the relevant sections of `app.js` (7,482 lines), with every finding cited to a file:line.

### Test corpus

- The shipped golden fixture, `tests/fixtures/Service-agreement-template.docx` — a real, non-synthetic 92-clause "InnoStars/Supplier" services agreement with direct+style-inherited numbering, a pricing table in Annex 1, embedded definitions, placeholder brackets (`[Company name]`, `[DATE]`, etc.), headers/footers, and footnotes/endnotes parts. Ground-truth structure (13 numbered sections, ~194 raw paragraphs, 1 table, multiple numbering IDs) was extracted directly from the DOCX XML **before** running it through the app, per the audit brief's discipline.
- Synthetic fixtures embedded in the regression test suite (multilevel `basedOn` style chains, malformed/oversized ZIP archives, tracked-change fragments, split/merge span cases) — read and traced, not independently re-authored.
- **Not tested in this pass, for lack of time/tooling within the session:** a bulleted-list DOCX, a DOCX using non-"Heading N"-named paragraph styles, a manually-strikethrough-formatted DOCX, an MSA/NDA/SaaS/DPA corpus spanning multiple represented-party positions (only the Supplier-side services agreement was live-tested end-to-end), a corrupted/partial DOCX, an extremely short or extremely long agreement, PDF-extracted text, and multi-agreement/multi-attachment documents. These gaps are called out explicitly wherever they bear on a finding's confidence, rather than silently assumed to pass.

### Material limitations

- Single live end-to-end pass with one real contract; most of Pass 3's exhaustive fixture matrix (bullets, footnotes-as-material-text, corrupted archives, PDF-extracted text, multi-agreement documents) was audited **by code tracing only**, not executed against a crafted file. Findings from that mode are explicitly labeled "Confirmed defect (code trace; not exec-verified)" rather than upgraded to full "Confirmed" status.
- No hosted/production deployment was reachable or tested; only the local static server and (partially) the standalone HTML were exercised.
- No screen reader, no WebKit/Firefox engine, no physical mobile device.
- The three parallel research passes and the live-testing pass were not exhaustively cross-verified against each other line-by-line; synthesis below reconciles them but a residual risk of minor duplication or divergence between the passes exists.

---

## C. System and workflow map

Contract Cockpit is a single-page, framework-free JavaScript application (`app.js`, 7,482 lines / ~860KB — the overwhelming majority of the logic) plus four extracted "core" modules that the release notes describe as an in-progress decomposition of the historical monolith:

- **`analysis-core.js`** (734 lines) — deterministic party detection, commercial-term extraction, legal-concept detection (`detectLegalConcepts`), legal-proposition extraction, asymmetry detection, obligation/deadline extraction, and the `assessOperativeAssertion` mention/asserted/negated/placeholder gate that most concept detectors share.
- **`review-core.js`** (21 lines) — source-span provenance (`splitSourceSpans`/`mergeSourceSpans`), warning classification, and the structural defined-term candidate scorer.
- **`workflow-core.js`** (195 lines) — clause reviewability classification, decision-completion/readiness rules, risk aggregation, CSV formula-injection safety.
- **`playbook-core.js`** (340 lines) — the built-in Playbook V3 package (a Supplier-role services-agreement playbook, 20 modules across issue tiers), applicability scoring, and deviation/issue-rule matching.
- **`app.js`** — everything else: DOCX/ZIP/OOXML parsing, clause segmentation, all UI rendering, the persistence layer (IndexedDB), decisions/notes/negotiation state, exports, and orchestration.

**Ingestion pipeline** (verified live and by code trace): a `.docx` is parsed by a hand-rolled ZIP central-directory reader (no external library) with bounded entry counts and decompressed-byte caps; `word/document.xml`, `word/styles.xml`, and `word/numbering.xml` are parsed into paragraph/table records with resolved heading levels, resolved `basedOn` style chains, and rendered numbering prefixes; `word/header*.xml`/`footer*.xml`/`footnotes.xml`/`endnotes.xml`/`comments.xml` are checked for *material text* (not just presence) and surfaced as disclosed warnings rather than parsed into clauses. A single forward pass (`detectClauses`) then segments paragraph/table records into a flat clause list using a mix of Word-numbering signals and text-heuristic fallbacks, producing stable per-session clause IDs and parent/child source-block spans.

**Analysis pipeline**: every clause is scored by a fixed set of deterministic regex/heuristic detectors (concepts, propositions, obligations, defined terms, cross-references, placeholders, playbook modules) — there is no LLM anywhere in this path. Detector output feeds risk scores, a findings list, and playbook module applicability, all computed once per full analysis (there is no incremental re-analysis of an already-loaded document).

**Review/workflow state**: a single in-memory `state` object holds clauses, decisions, notes, negotiation items, playbook activations, and UI navigation state. Every substantive mutation calls a debounced `scheduleAutosave()` (delay depends on a reason tag: 50ms "critical," 300ms "ui," 1500ms "substantive" default) that eventually writes to IndexedDB in an atomic paired transaction (a generic "current session" record plus a per-matter record keyed by a `crypto.randomUUID()` minted at document load). Matter-global stores (clause library, playbook packages) are deliberately excluded from matter-scoped persistence and from session import/export, verified by code trace of `normalizeSession()`.

**Workflow surfaces** (verified live): four top-level tabs — **Checks** (nine independent focused-check entry points: defined terms, cross-references, blanks/placeholders, obligations/deadlines, legal issues by concept, playbook coverage, one-way rights, expected clauses, signing readiness), **Review** (the full clause-by-clause queue with Accept/Amend/Reject/Get input/Escalate decisions, notes, playbook checks, negotiation scripts, and a compare view), **Resolve** (a canvas grouping open items by decisions/business questions/approvals/negotiation, tagged by function — Business/Privacy/Finance/Leadership — and by liability-exposure/leverage framing), and **Export** (Word drafting handoff, counterparty summary, approval pack, evidence ledger, session JSON/bundle, snapshot management, and local-data controls including a secure-wipe option).

**PWA/offline shell**: a version-pinned service worker (`shell-files.js` is the single source of truth for the cache-version string, imported by both `service-worker.js` and `pwa.js`), network-first navigation with cache fallback, and an explicit (not silent) update-available banner gated on flushing any pending autosave before reload.

---

## D. Strengths worth preserving

These should survive any future redesign, including the clean-sheet concept in Section N:

1. **The zero-network posture is real, not asserted.** Verified by direct code search, not by trusting documentation — the only `fetch()` calls anywhere in `cockpit/*.js` are the service worker's own same-origin, GET-only asset caching, explicitly scope-checked against `self.location.origin`.
2. **Exact block-relative source spans, verified end-to-end.** Clause split/merge operations cut/rejoin source text at precise character offsets within the original imported blocks (not whole-block cloning), confirmed both by code trace and by the executed regression test that splits a block, checks byte-exact left/right text, and merges it back to reconstruct the original text exactly.
3. **Fail-closed behavior on ambiguous source corrections.** If a split marker can't be mapped exactly onto imported source blocks, the operation aborts with a toast rather than guessing — no silent approximate application.
4. **A genuinely enforced Content Security Policy**, consistent with the code that runs under it: `script-src 'self'` with no `'unsafe-eval'` in the PWA build, and zero `eval`/`new Function`/string-timer usage found anywhere in `app.js` by direct grep.
5. **An escape-first, DOM-node-based highlighting pipeline for contract-derived text.** Every attacker-influenced string (from a hostile DOCX) is HTML-escaped *before* any highlighting markup is generated, and subsequent highlighters manipulate parsed DOM text nodes rather than concatenating HTML strings — a genuinely safe design, not merely one that happened not to be exploited yet.
6. **A real, working CSV formula-injection guard**, applied consistently across every CSV export path found in the code.
7. **Atomic paired IndexedDB writes, legacy-key migration, and quota-exhaustion handling that surfaces to the user** rather than failing silently.
8. **Real cross-tab autosave-conflict protection** (a `localStorage`-based lease with staleness detection and a user-facing "this matter is open in another tab" message), even though a narrow race window remains (see Finding SEC-1).
9. **Self-disclosed extraction limitations that gate export**, not just decorate the UI: headers/footers/footnotes/endnotes/tracked-changes warnings feed a "material limitation" classification that blocks legal-output export pending explicit reviewer acknowledgment — a genuine implementation of "prefer uncertainty to a false-clean conclusion," even though this audit found the same discipline is not yet applied to *detector-level* (as opposed to *extraction-level*) uncertainty (see Finding LGL-1).
10. **A structural, non-dictionary-based defined-term scorer.** The release notes' claim that undefined-term detection "no longer depends on a fixed list of familiar legal terms" is verified true: a five-signal compositional score (capitalization shape, specific-object usage, operative-modal usage, conditional usage, cross-document/schedule reference, multi-clause spread) replaces a keyword list, with a sensible OR-fallback so a single dangerous undefined term isn't buried by a frequency floor.
11. **A tiered, calibration-aware indemnity detector** (operative-grant / cap-treatment / cross-reference / heading-only, each with a distinct confidence tier) — the single best example in the codebase of correctly demoting weak evidence instead of asserting presence.
12. **The four-job workflow consolidation itself** (Checks / Review / Resolve / Export) is a real simplification relative to the product's own history, and the "confirmations made in a focused check carry into Full Review" claim is architecturally consistent with the single shared `state` object.

---

## E. Release blockers (Critical / High findings)

These are the findings that, in this auditor's judgment, prevent or materially constrain serious unsupervised professional use today. Full finding records are in Section F; this is the prioritized subset.

| ID | Title | Severity | Confidence |
|---|---|---|---|
| PER-1 | Decisions recorded within ~1.5s of tab close/reload are silently lost | **Critical** | **High — live reproduced** |
| LGL-1 | "Checked · none found" health signal reflects extraction success only, not detector-pattern adequacy | **Critical** | High (code-traced across multiple detector call sites) |
| LGL-2 | Liability-cap detection is literal-contiguous-phrase-brittle and cascades into playbook/risk-floor/summary silence | **Critical** | High (code-traced; not exec-verified against a live brittle-phrasing fixture in this session) |
| LGL-3 | No deterministic warranty detector exists at all | High | High |
| LGL-4 | Cross-reference semantic-mismatch safety net silently disables on multi-topic clauses (the common case) | High | High |
| LGL-5 | Passive-voice obligations are categorically unreachable by the actor-attribution algorithm | High | High |
| DOCX-1 | Bulleted-list numbering (`numFmt="bullet"`) is never special-cased; can inject glyphs or fabricate numbering with zero warning | High | Medium-High (code-traced; not exec-verified against a live bulleted DOCX) |
| DOCX-2 | Direct-formatting strikethrough runs are dropped without checking `w:val`, silently deleting explicitly-not-struck text, with no warning surfaced | High | High (deterministic logic error, verified by reading the exact condition) |
| MOB-1 | First-run onboarding modal overflows/misaligns on a real mobile viewport, intermittently blocking the primary "Use my own contract" CTA | High | Medium-High (live reproduced: persistent 30s pointer-interception failure plus visual overflow in screenshot) |

---

## F. Confirmed and likely defect ledger

Findings are ordered by consequence within each area. Classification and confidence are stated per the audit's required taxonomy.

---

**PER-1 — Recorded clause decisions can be silently lost on quick tab close/reload**
- **Classification:** Confirmed defect · **Severity: Critical** · **Confidence: High (live-reproduced twice, at two timing thresholds)**
- **Affected artifact/version:** v7.6.1, all builds (PWA, standalone uses no persistence so is unaffected; source-audit package shares the same `app.js`)
- **Affected workflow:** Review → clause decision
- **Observed behaviour:** Accepting a clause decision, then reloading the page within ~800ms–1.2s, results in the decision being absent after the resumed matter loads (`0/78 decided`), despite the UI having already displayed the decision (`1/78 decided`) and an implied "Decision saved" state before reload. Repeating the identical sequence but waiting 3 seconds before reload preserves the decision correctly.
- **Expected behaviour:** A recorded decision should either be durably saved before any user-visible "saved" confirmation, or the UI should not imply the decision is safe until it actually is (e.g. a visible "saving…" state, or a synchronous/high-priority flush).
- **Evidence:** Live Playwright reproduction: `applyClauseDecision()` → Accept → wait 800ms → `page.reload()` → resume matter → `0/78 decided` (decision lost). Same sequence with a 3000ms wait → `1/78 decided` (decision preserved). Static trace (independent second pass) confirms the mechanism: `applyClauseDecision()` (`app.js:6826`, wired from the Accept/Reject/etc. buttons and keyboard shortcuts) calls `onSubstantiveChange()` with no `autosaveDelay` override, so it falls to the function's default `DRAFTING_AUTOSAVE_DELAY = 1500ms`, not the 50ms `'critical'` path used elsewhere (e.g. source-assurance confirmation). The `beforeunload`/`pagehide`/`visibilitychange` flush handlers exist (`app.js:3445-3451`) but their async IndexedDB write is not guaranteed by the browser to complete before teardown, and this session's live test shows it did not complete inside the 1.5s debounce window.
- **Reproduction steps:** Load a document → Review tab → open any clause → click Accept → reload the browser tab within ~1 second → resume the matter → decision is gone.
- **Likely root cause:** `applyClauseDecision()` uses the default 1500ms "substantive" autosave delay rather than the 50ms "critical" delay reserved for other high-value single actions; the unload-flush safety net is not reliably completing an async IndexedDB open+transaction+put cycle within a real browser teardown window.
- **Relevant file/function:** `cockpit/app.js`, `applyClauseDecision()` (~line 6826), `scheduleAutosave()`/`onSubstantiveChange()` (~lines 3421-3457), `installAutosaveFlushHandlers()` (~lines 3445-3451), delay constants (~lines 57-58).
- **Lawyer or product consequence:** The single most trust-destroying failure mode for a legal tool — a decision the lawyer believes is recorded is not, with no error surfaced, discoverable only by chance on return to the matter.
- **Recommended resolution:** Route `applyClauseDecision()` (and any other single, deliberate legal-decision action) through the 50ms "critical" autosave path, not the 1500ms default; additionally, make the "Decision saved" UI state genuinely reflect persistence completion (or a distinct "saving…"/"saved" two-phase indicator) rather than the in-memory state change.
- **Acceptance criteria:** Recording any decision (Accept/Amend/Reject/Get input/Escalate) and reloading immediately (0ms wait, scripted) never loses the decision in an automated test.
- **Regression tests:** Automated: record decision → reload at 0ms, 100ms, 500ms, 1000ms, 1500ms, 3000ms delays → assert decision present at every threshold. Add to the existing `cockpit-regression.test.mjs` suite (currently has no test covering unload-timing behavior at all).
- **Dependencies and second-order risks:** Moving more actions to the "critical" 50ms path increases IndexedDB write frequency; verify this does not introduce write contention with the cross-tab lease mechanism (Finding SEC-1) or degrade perceived responsiveness on very large matters.

---

**LGL-1 — The "checked · none found" health signal cannot distinguish extraction success from detector-pattern adequacy**
- **Classification:** Confirmed defect · **Severity: Critical** · **Confidence: High**
- **Affected artifact/version:** v7.6.1
- **Affected workflow:** Every focused check and the per-clause findings card
- **Observed behaviour:** `state.detectorHealth`'s three-state signal (`not-run` / `limited` / `checked`) — rendered to the lawyer as, effectively, "checked · none found" with a green checkmark — is computed *only* from `state.documentMeta.sourceIntegrity?.status==='degraded'`, i.e. whether DOCX text extraction itself hit a snag. It is shared identically across every distinct detector (definitions, undefined terms, cross-references, placeholders, obligations, deadlines, subjective standards, asymmetries, legal concepts).
- **Expected behaviour:** A "none found" result should only be presented with confidence when the specific detector's own coverage is adequate for the document's drafting style — e.g. when a clause plainly discusses the relevant topic (by heading, or by a lower-confidence partial match) but the operative-assertion pattern didn't fire, that should read differently from a clause with no topical signal at all.
- **Evidence:** `app.js:3667-3668`, `:646`, `:3699` (health computation), `app.js:4137` (`renderUpfrontFindingsCard` consuming the shared signal). Cross-referenced against LGL-2, LGL-4, LGL-5 below — each of those detector-specific misses would still be labeled "checked · none found" whenever DOCX extraction itself succeeded.
- **Reproduction steps:** Not independently re-executed live in this pass beyond the DOCX-extraction-success case (which was observed: the golden fixture's extraction succeeded, and multiple checks showed "OK"/"none found" states — this audit did not independently verify each such state against a hand-checked ground truth for every check type, which is itself evidence of how easy it is to trust the signal).
- **Likely root cause:** The three-state infrastructure was (correctly) built to solve the extraction-quality half of the false-clean problem, and the detector-quality half was never separately modeled.
- **Relevant file/function:** `cockpit/app.js:3667-3668, 4137`.
- **Lawyer or product consequence:** This is the single highest-leverage false-clean risk in the product: it is the exact mechanism a lawyer would rely on to decide "I don't need to read this clause myself," and it cannot deliver that assurance.
- **Recommended resolution:** Add a per-detector-family coverage estimate independent of extraction status — e.g., "this clause's heading/type matches [concept], but no operative-assertion pattern matched within it" should render as a distinct, lower-confidence state ("topic present, pattern not matched — verify manually") rather than "checked · none found."
- **Acceptance criteria:** A clause containing a real liability cap phrased outside the detector's literal pattern set (see LGL-2) renders a state other than an unqualified green "none found" for the liability-cap check.
- **Regression tests:** A fixture clause per major concept (liability, warranty, indemnity, IP) using a semantically-clear but pattern-divergent phrasing; assert the health state is not the unqualified "checked" state.
- **Dependencies and second-order risks:** Adding a fourth practical state ("topic present, no operative match") without careful UI design could increase noise/anxiety; needs to be visually distinct from an actual finding, not merely a duller green.

---

**LGL-2 — Liability-cap detection depends on literal contiguous phrasing and cascades into a multi-layer false-clean**
- **Classification:** Confirmed defect (code-traced across four independent consuming layers; not exec-verified live against a deliberately-brittle-phrasing fixture in this session) · **Severity: Critical** · **Confidence: High**
- **Affected artifact/version:** v7.6.1
- **Affected workflow:** Legal issues by concept (Checks), playbook coverage (module H-04), risk scoring, commercial-terms summary
- **Observed behaviour:** `detectLegalConcepts`'s `liabilityCap` mention/operative patterns (`analysis-core.js:374-378`) require the literal phrases "aggregate liability," "liability cap," "limitation of liability," "cap(ped)," "shall not exceed," or "in excess of" in close contiguous proximity to "liability"/"cap." A clause such as *"In no event shall either party's total liability … exceed the total fees paid or payable in the twelve (12) months preceding the claim"* — an entirely ordinary liability-cap construction — matches none of these literal anchors (no "shall not exceed," no "aggregate liability," no "cap").
- **Expected behaviour:** A liability cap phrased with any reasonable verb ("shall … exceed," "is limited to," "will be capped at," "in no event shall liability be greater than") should be detected as at least a lower-confidence candidate, not silently missed.
- **Evidence:** `analysis-core.js:374-378` (concept pattern); `app.js:2228` (a second, independent, near-identical narrow phrase set in `computeClauseIntelligence` that would *also* miss the same clause, compounding false confidence); `playbook-core.js:316` (module H-04's applicability is concept-driven only, with no independent regex branch, so an undetected `liabilityCap` concept means H-04 — a Tier-1 "walk-away" playbook module — never surfaces at all); `analysis-core.js:298` (the risk-floor override pattern, same literal-phrase dependency); `analysis-core.js:655` (commercial-terms summary, same fallback pattern).
- **Reproduction steps:** Not executed live against a crafted fixture in this session (a genuine gap — this finding should be re-verified by importing a document containing exactly this phrasing and confirming the concept/playbook/risk-floor/summary all miss it as predicted).
- **Likely root cause:** All four consuming layers derive from the same narrow literal-phrase family rather than a token-proximity or paraphrase-tolerant model.
- **Relevant file/function:** `cockpit/analysis-core.js:298, 374-378, 655`; `cockpit/app.js:2228`; `cockpit/playbook-core.js:316`.
- **Lawyer or product consequence:** One of the two highest-stakes clause types in any commercial contract can be invisible to every layer of the tool simultaneously, with the UI showing "none found."
- **Recommended resolution:** Broaden the liability-cap detector to a token-proximity model (modal verb + liability-noun + magnitude-comparison verb within a wider window, tolerant of intervening clauses) rather than a fixed phrase list; give H-04 an independent structural evaluator (as several other modules already have) rather than pure concept-gating.
- **Acceptance criteria:** The example clause above (and 3-5 other common cap phrasings drafted independently of the existing test fixture) are detected as at least "Possible" confidence.
- **Regression tests:** Add the example clause (and variants) as a dedicated fixture in `cockpit-regression.test.mjs`; assert non-empty `byConcept.liabilityCap`, H-04 applicability, and a non-"Not detected" commercial-summary liability line.
- **Dependencies and second-order risks:** Broadening the pattern risks new false positives (e.g. matching a clause that discusses "liability" and "exceed" in an unrelated sense, like a performance SLA); should be validated against a negative-case fixture set alongside the positive one. This also interacts with LGL-1 — even a partial fix here should be paired with the coverage-signal fix, since broader-but-still-imperfect regex coverage will always leave some residual gap.

---

**LGL-3 — No deterministic detector exists for warranties**
- **Classification:** Confirmed defect · **Severity: High** · **Confidence: High**
- **Affected workflow:** Legal issues by concept, per-clause gap analysis
- **Observed behaviour:** `detectLegalConcepts`'s concept map has no `warranty` key at all. `computeClauseIntelligence`'s type-specific branch chain has no `'Warranties'` case, so a clause classified `type==='Warranty'` gets zero heuristic gap-analysis output. The only warranty-aware logic anywhere in the core is inside the *playbook's* H-01 module keyword list (`error-free|uninterrupted|fit for purpose|all requirements`), which only fires if that playbook module happens to be active.
- **Expected behaviour:** Warranty clauses (a standard, universal contract category) should have at least a baseline concept detector independent of playbook activation.
- **Evidence:** `analysis-core.js:335-339` (concept map, no warranty entry); `app.js:2226-2280` (branch chain, no Warranty case); `playbook-core.js:76` (the only warranty-aware pattern, playbook-scoped).
- **Reproduction steps:** Code trace only; not independently exec-verified.
- **Likely root cause:** Warranty coverage was implemented only inside the playbook layer and never promoted to the shared concept-detection layer used by non-playbook checks.
- **Relevant file/function:** `cockpit/analysis-core.js:335-339`; `cockpit/app.js:2226-2280`.
- **Lawyer or product consequence:** "Legal issues by concept" and the per-clause gap-analysis card silently omit an entire standard contract category unless the (Supplier-role-specific) built-in playbook happens to be active and relevant.
- **Recommended resolution:** Add a `warranty` entry to `detectLegalConcepts` (mention: `warrant(y|ies|s)?|represents and warrants`; operative: modal + warrant/represent verb, tolerant of "fit for purpose," "error-free," "merchantable," "conforms to specification") and a corresponding `'Warranties'` branch in `computeClauseIntelligence`.
- **Acceptance criteria:** A standalone warranty clause (no playbook active) produces non-empty concept evidence and a populated gap-analysis card.
- **Regression tests:** Fixture clause with an absolute/perfection warranty and one with a qualified warranty; assert both produce concept evidence with different risk framing.
- **Dependencies and second-order risks:** New concept key needs a corresponding entry in whatever aggregate "concepts checked" count is shown to the user, or the visible coverage-list will look incomplete relative to what's actually running.

---

**LGL-4 — Cross-reference semantic-mismatch safety net silently disables on multi-topic clauses**
- **Classification:** Confirmed defect · **Severity: High** · **Confidence: High**
- **Affected workflow:** Cross-references check
- **Observed behaviour:** A cross-reference that *resolves* to a real, existing clause (e.g. after renumbering drift during redlining) is classified `'valid'` unless a semantic-mismatch heuristic catches the drift. That heuristic requires *both* the referring sentence and the target clause to classify to exactly one of 11 fixed topics; if either side matches zero or two-or-more topics (the norm for real clauses, which routinely touch multiple topics), the mismatch check is silently skipped and the reference is reported `'valid'`.
- **Expected behaviour:** A reference pointing to a clause whose actual content plainly doesn't match the referring context should be flagged for verification even when both sides are topically mixed, or the tool should at minimum disclose that the semantic check did not run for that reference (rather than reporting a bare "valid").
- **Evidence:** `app.js:3961-3972` (11-topic fixed list), `app.js:3996-3998` (trigger-phrase gate and the `if(targetTopic&&targetTopic!==sourceTopic)` single-topic precondition), `MALFORMED_REFERENCE_CONTINUATION` (`app.js:3980`) — separately confirmed to catch exactly one typo pattern (a comma-for-period second-reference join) and nothing broader.
- **Reproduction steps:** Code trace only; not independently exec-verified against a live renumbering-drift fixture.
- **Likely root cause:** The single-topic precondition was presumably added to avoid false-positive mismatch flags on genuinely multi-topic clauses, but its failure mode (silent skip → reported "valid") is worse than a false positive would be.
- **Relevant file/function:** `cockpit/app.js:3961-4004`.
- **Lawyer or product consequence:** Renumbering-drift — the single most common real-world cause of broken cross-references during active redlining — is structurally the failure mode this safety net is least able to catch.
- **Recommended resolution:** When either side is multi-topic, don't skip the check — instead compare topic *sets* for zero overlap (a stronger, still-conservative signal) rather than requiring exact single-topic equality; or explicitly surface "semantic check not applicable" as a distinct low-confidence state rather than folding into "valid."
- **Acceptance criteria:** A reference pointing from a termination clause to an unrelated IP-ownership clause (both otherwise well-formed) is flagged, even when either clause also touches a second topic.
- **Regression tests:** Multi-topic source/target clause pair with a genuinely mismatched reference; assert it is not reported `'valid'`.
- **Dependencies and second-order risks:** Set-overlap comparison needs a negative-case fixture (a correct multi-topic-to-multi-topic reference) to confirm it doesn't introduce new false positives.

---

**LGL-5 — Passive-voice obligations are categorically unreachable**
- **Classification:** Confirmed defect · **Severity: High** · **Confidence: High**
- **Affected workflow:** Obligations & deadlines check
- **Observed behaviour:** `extractObligationEvidence`'s actor detection scans only the text *preceding* the matched modal verb for a party token or bound pronoun; if none is found there, the sentence is dropped entirely. A passive construction such as *"All deliverables shall be provided by the Supplier within ten (10) Business Days of the acceptance date"* has no actor token before "shall" — the actor ("the Supplier") appears only after, via "by" — so the entire obligation, including its ten-business-day deadline, is silently dropped from both the obligations register and the deadline/calendar register.
- **Expected behaviour:** A clear, unambiguous passive-voice obligation with an actor named via "by X" should be captured.
- **Evidence:** `analysis-core.js:452-456` (prefix-only actor scan, `if(!actorMatch&&!pronoun)continue;`); contrasted with a *different* actor-attribution algorithm used by the separate `extractLegalPropositions` function in the same file, confirming this is an isolated gap rather than a systemic inability to handle "by X" constructions.
- **Reproduction steps:** Code trace only; not independently exec-verified against a live passive-voice fixture (the golden fixture used in this audit is predominantly active-voice "Supplier shall …" drafting, so this gap did not surface in the live test).
- **Likely root cause:** The actor-detection algorithm was written prefix-first and never extended with a post-modal "by [actor]" fallback.
- **Relevant file/function:** `cockpit/analysis-core.js:429-483`, specifically the actor gate at `:452-456`.
- **Lawyer or product consequence:** Passive-voice obligation drafting is extremely common (deliverable, reporting, and notice clauses especially) — this is a high-frequency, not edge-case, silent omission from a feature specifically marketed as extracting obligations and deadlines.
- **Recommended resolution:** Add a post-modal "by [actor]" fallback scan when the prefix scan finds nothing, mirroring the pattern the proposition extractor already uses.
- **Acceptance criteria:** The example sentence above is captured in the obligations register with the correct actor and the 10-business-day deadline.
- **Regression tests:** Fixture sentence set covering active voice, passive voice with "by X," and passive voice with no named actor (correctly still dropped); assert only the first two are captured.
- **Dependencies and second-order risks:** Broadening actor detection could increase false-positive actor attribution in ambiguous sentences; needs a negative-case check alongside the fix.

---

**DOCX-1 — Bulleted-list numbering is never special-cased; can inject glyphs or fabricate sequential numbering with zero warning**
- **Classification:** Confirmed defect (code-traced; not exec-verified against a live bulleted-list DOCX in this session — the golden fixture used has no bullet lists) · **Severity: High** · **Confidence: Medium-High**
- **Affected workflow:** DOCX import / clause segmentation
- **Observed behaviour:** `getParagraphNumberingInfo`'s prefix-rendering logic only special-cases `lowerLetter`/`upperLetter`/`lowerRoman`/`upperRoman` number formats; any other `numFmt` — including `bullet`, the format Word uses for essentially all non-numbered bullet lists — falls through to a decimal-style rendering path. Concretely: a genuine bullet glyph (a Private-Use-Area/Symbol-font character Word stores as the literal `lvlText`) gets prepended verbatim to the paragraph text with no substitution, feeding into clause bodies, definition scans, obligation scans, evidence excerpts, and exports. Separately, if a bullet level's `lvlText` is stored as an empty string (valid OOXML), the code's `lt?...:'%1'` fallback treats the falsy empty string as "no value" and defaults to a real sequential decimal counter — meaning an ordinary bullet item can be rendered with fabricated "1," "2," "3" numbering indistinguishable from genuine clause numbering, potentially promoting a bullet-list item into its own standalone reviewable clause.
- **Expected behaviour:** Bullet-formatted list items should render as plain text (or a normalized bullet marker), never as a raw font glyph or a fabricated sequential number, and any such normalization should be disclosed if it can't be done with full fidelity.
- **Evidence:** `app.js:6380` (`parseNumberingXml`, the `lt?getAttrByLocalName(lt,'val')||'%1':'%1'` fallback), `app.js:6426-6437` (prefix rendering, only 4 of many `numFmt` values special-cased), `app.js:6419` (unconditional prefix-prepend into paragraph text). No corresponding entry in `warnings[]` and no interaction with `sourceIntegrity`/the export-blocking gate.
- **Reproduction steps:** Not executed; requires constructing/obtaining a DOCX with a genuine Word bullet list (not a numbered list) to confirm live.
- **Likely root cause:** The numbering-rendering function was built around numbered/lettered/Roman clause numbering (its primary, well-tested use case) and never extended to explicitly handle or suppress bullet-format glyphs.
- **Relevant file/function:** `cockpit/app.js:6380, 6419, 6426-6437`.
- **Lawyer or product consequence:** Itemized deliverables, exclusions lists, notice-address lists, and definitions lists frequently use bullets in real commercial contracts — this is not an exotic construct, and neither the glyph-injection nor the fabricated-numbering variant is disclosed to the reviewer or gated on export.
- **Recommended resolution:** Explicitly special-case `numFmt==='bullet'`/`'none'` to strip the raw glyph (optionally substitute a normalized `•` for display only, never fed into text-matching detectors) and never fabricate a decimal counter for an empty `lvlText`; add a source-integrity warning when bullet-format content is detected and normalized.
- **Acceptance criteria:** A DOCX with a genuine bullet list imports with clean text (no raw glyphs) and does not create spurious numbered clauses; a disclosed warning appears if any bullet-format normalization occurred.
- **Regression tests:** New fixture DOCX (or synthetic `numbering.xml`) with a `bullet`-format list including at least one empty-`lvlText` level; assert clean text output and correct warning presence.
- **Dependencies and second-order risks:** Changing how bullet content renders could shift existing clause counts/IDs for any document with bullets already loaded in a saved matter — needs a migration note if deployed, since existing autosaved matters may have glyph-corrupted text baked into stored clause bodies.

---

**DOCX-2 — Direct-formatting strikethrough runs are dropped without checking `w:val`; explicitly non-struck text can be silently deleted**
- **Classification:** Confirmed defect · **Severity: High (for the `w:val="false"/"0"` branch — unambiguously wrong regardless of design intent) / Medium-High (for the broader undisclosed-drop behavior)** · **Confidence: High**
- **Affected workflow:** DOCX import / body-text extraction
- **Observed behaviour:** `collectParagraphText` drops any run whose `rPr` contains a `<w:strike>` or `<w:dstrike>` element, but never inspects that element's `w:val` attribute. Per OOXML, `<w:strike w:val="false"/>` or `<w:strike w:val="0"/>` is valid and means strikethrough is explicitly *turned off* for that run (commonly used to override an inherited style-level strikethrough) — the code treats this identically to an actual strikethrough and drops the text anyway. This is a separate mechanism from Track Changes handling (which is correctly implemented and warned) and does not trigger the "tracked changes detected" warning.
- **Expected behaviour:** Only runs with `w:strike`/`w:dstrike` present *and* `w:val` absent or truthy ("true"/"1"/"on") should be treated as struck-through; text explicitly marked not-struck should never be dropped. Separately, any manual-strikethrough-driven text omission (even when correctly identified) should be disclosed to the reviewer, since it is a genuine content omission the tool is choosing to make silently.
- **Evidence:** `app.js:6402` (the unconditional presence check, no `w:val` inspection), contrasted with the correctly-guarded, correctly-warned `w:del`/`w:moveFrom` handling elsewhere in the same function.
- **Reproduction steps:** Not executed; requires a DOCX with a run carrying `<w:strike w:val="0"/>` to confirm live.
- **Likely root cause:** The condition checks only for element presence, an incomplete implementation of the OOXML attribute semantics.
- **Relevant file/function:** `cockpit/app.js:6385-6411`, specifically `:6402`.
- **Lawyer or product consequence:** Text a drafter deliberately marked as *not* struck through can be silently deleted from the extracted contract text with no warning, which is a genuine source-fidelity failure — worse than the "any manual strikethrough is dropped" design choice on its own, because it is simply incorrect per the format's own semantics.
- **Recommended resolution:** Check `w:val` before dropping (only drop when truthy/absent-defaulting-to-true per the format spec); add a disclosed warning whenever any run is dropped for direct-formatting strikethrough, mirroring the Track Changes warning pattern.
- **Acceptance criteria:** A run with `w:val="false"` is retained in extracted text; a run with `w:val="true"` or no `w:val` (default-true) is dropped and a warning is shown.
- **Regression tests:** Synthetic paragraph XML with both `w:val` variants; assert correct retention/drop and correct warning presence.
- **Dependencies and second-order risks:** None significant beyond the general note that any change to text extraction can shift downstream clause segmentation for affected documents.

---

**MOB-1 — First-run onboarding modal overflows/misaligns on a real mobile viewport**
- **Classification:** Confirmed defect (live reproduced) · **Severity: High** · **Confidence: Medium-High**
- **Affected artifact/version:** v7.6.1, PWA/hosted build, mobile viewport (~390×844 CSS px / iPhone-13-class)
- **Affected workflow:** First-run onboarding → "Use my own contract"
- **Observed behaviour:** On a real mobile viewport, Playwright's actionability engine failed to click the "Use my own contract" button after 30 seconds of retries, reporting that overlapping onboarding-tip/step-text elements intercepted pointer events at the button's location. A viewport-only screenshot shows the onboarding modal rendering wider than the viewport, with its right-hand content (including part of the CTA button row) extending past the visible/scrollable area.
- **Expected behaviour:** The onboarding modal should fit within the viewport width at common phone screen sizes, and its primary call-to-action buttons should be reliably tappable.
- **Evidence:** Live screenshots `screenshot_mobile_landing.png` (full-page, shows the modal) and `screenshot_mobile_viewport_only.png` (viewport-clipped, shows the modal's right edge and the "Use my own" button cut off/overflowing); Playwright's exhaustive actionability-retry log showing persistent pointer-event interception by `.step-text`/`.onboarding-tip` elements over ~30 seconds of retries.
- **Reproduction steps:** Load the app in a 390×844 CSS-pixel mobile viewport (e.g. Chromium device emulation for iPhone 13) → attempt to tap "Use my own contract" in the onboarding modal.
- **Likely root cause:** Not fully isolated from the outside (this would require reading the modal's CSS directly, which was not part of this pass's scope) — but the visual evidence points to the modal's fixed/min-width or an internal flex-row layout not collapsing to a narrow-viewport-appropriate stacked layout.
- **Relevant file/function:** Likely `cockpit/styles.css` onboarding-modal rules and `cockpit/index.html` onboarding markup — not pinpointed to a specific line in this pass.
- **Lawyer or product consequence:** A first-time mobile user can be blocked from ever reaching the "use your own contract" path on first load — a severe first-impression and adoption barrier for the mobile audience the product explicitly markets to ("Install on iPhone or iPad").
- **Recommended resolution:** Audit the onboarding modal's CSS for a fixed-width or non-wrapping layout at narrow viewports; add responsive breakpoints ensuring the modal and its CTA row fit within `100vw` with no horizontal overflow.
- **Acceptance criteria:** The onboarding modal's primary CTA is reliably tappable (no actionability timeout) across a representative set of phone viewport widths (360px–430px).
- **Regression tests:** Automated Playwright viewport test asserting the CTA button's bounding box is fully within the viewport and clickable at 360px, 390px, and 430px widths.
- **Dependencies and second-order risks:** None beyond standard responsive-CSS regression risk; should be re-tested against the "Try the two-clause example" button and any other first-run modal content at the same viewport widths.

---

**PER-2 — Two-tab autosave race has a narrow TOCTOU window and fails open if `localStorage` is blocked**
- **Classification:** Likely defect · **Severity: Medium** · **Confidence: Medium**
- **Observed behaviour:** The cross-tab lease check (a `localStorage`-based read-then-write pattern) is not atomic against the actual IndexedDB write; if two tabs' first autosave timers fire within roughly the same window before either has claimed the lease, one tab's edits can be silently discarded, detected only reactively (on the losing tab's own next autosave, or via the `storage` event). Additionally, `claimAutosaveLease()` fails open (returns `true`, disabling protection) if `localStorage` throws (private browsing / storage blocked), with no user-facing warning.
- **Evidence:** `app.js:6073, 6075`.
- **Lawyer or product consequence:** A lawyer working the same matter in two tabs (easy to do accidentally) can lose edits from one tab with no warning in the narrow race window, or lose all cross-tab protection silently in a private-browsing context.
- **Recommended resolution:** Narrow the race by claiming the lease optimistically before the first autosave attempt rather than only reactively; surface a warning (not a silent fail-open) when `localStorage` is unavailable.
- **Regression tests:** Simulated two-context test racing two `persistAutosave()` calls; assert one loses cleanly with a surfaced warning rather than silently.

---

**SEC-1 — Unguarded `__proto__` key in session-import deep remap (narrow, unexploited)**
- **Classification:** Design concern (hardening item, no exploitation path found) · **Severity: Low** · **Confidence: Medium**
- **Observed behaviour:** `remapDeep()`'s `out[key]=...` pattern on a fresh `{}` will, for a JSON-parsed `"__proto__"` own-property key, go through the standard `[[Set]]` path and can repoint that one local object's prototype. No downstream code trusting prototype-chain properties in a security-relevant way was found, and the effect does not propagate to global `Object.prototype`.
- **Evidence:** `app.js:5941-5949`.
- **Recommended resolution:** Add an explicit `key==='__proto__'` skip in `remapDeep`/`remapObjectKeys` as defense-in-depth.
- **Regression tests:** Import a crafted session JSON with a `"__proto__"` key under a remapped field; assert no prototype pollution occurs and the import either sanitizes or rejects the key.

---

**REL-1 — Repository root release notes/README lag the shipped v7.6.1 artifacts**
- **Classification:** Confirmed defect (documentation/release-hygiene) · **Severity: Low** · **Confidence: High**
- **Observed behaviour:** The git repository's top-level `RELEASE_NOTES_v7.6.md`, `AUDIT_MATRIX_v7.6.md`, and `README.md` describe v7.6, while the shipped `cockpit/` code (byte-identical across all artifacts) is v7.6.1, and the uploaded release package carries its own `RELEASE_NOTES_v7.6.1.md`/`AUDIT_MATRIX_v7.6.1.md`/`README_SOURCE.md` that are not present in the git repository root.
- **Recommended resolution:** Sync the repository root docs to the v7.6.1 versions (or add them alongside) so the repository is self-describing for anyone auditing it without the separate release zip.

---

**REL-2 — "94/94 regression tests passed" is not independently reproducible via the documented `npm test` command**
- **Classification:** Confirmed inaccuracy of the specific claim as stated evidence (the underlying 93 ingestion/analysis tests do pass) · **Severity: Low-Medium** · **Confidence: High**
- **Observed behaviour:** `npm test` (`npm run build && node --test tests/*.test.mjs`) fails at the build step: `vite.config.ts` imports `./build/sites-vite-plugin`, a file not present anywhere in the extracted Source-Audit package (evidently a private/internal hosting-platform module stripped during export). This blocks both the build itself and `tests/rendered-html.test.mjs` (which requires the build's output). Only `tests/cockpit-regression.test.mjs` (93 tests) can be run directly and does pass, with and without the golden DOCX fixture.
- **Recommended resolution:** Either include the missing build dependency in the audit-source package, or clearly state in the audit package's README that `npm run build`/the 94th test require infrastructure not included in the package, and adjust the "94/94" claim to specify "93/93 of the portable suite; the 94th requires the internal hosting build."
- **Second-order note:** related design concern — a substantial fraction of the 93 passing tests are `assert.match(app, /literal-regex/)` checks against the raw source text of `app.js`, which verify a code pattern hasn't been refactored away rather than verifying runtime behavior on constructed input. The genuinely behavioral tests (calling exported functions with constructed input) are real and did catch real logic; the string-presence tests should not be counted with equal evidentiary weight when citing "94/94" as a quality signal.

---

**REL-3 — Source-Audit package bundles unused, unrelated cloud-hosting scaffolding (Next.js, Cloudflare Worker, D1 database bindings, ChatGPT-authentication headers)**
- **Classification:** Design concern (release hygiene / trust-confusion risk; not a live privacy defect — the code is genuinely unreferenced) · **Severity: Low-Medium** · **Confidence: High**
- **Observed behaviour:** The Source-Audit package includes `app/chatgpt-auth.ts` (an unused ChatGPT-authentication-header helper — confirmed by grep that nothing imports or calls it), `worker/index.ts` (a generic Cloudflare Worker entry point from a starter template), `drizzle.config.ts`/`drizzle/meta/_journal.json` (an empty, unused D1/SQLite ORM scaffold), and `.openai/hosting.json` (a hosting-platform project manifest with `d1: null, r2: null`). `app/page.tsx` — the only file that actually executes on the hosted route — does nothing but `redirect("/cockpit/index.html")`.
- **Verification:** This audit confirmed by direct grep that none of `chatgpt-auth.ts`'s exports are imported anywhere else in the package, and that the app's only meaningful route is the redirect. This is genuinely dead/vestigial hosting-template code, not a live cloud-processing path for contract content.
- **Lawyer or product consequence:** None to the actual product's behavior — but an independent auditor (or a security-conscious lawyer's IT team) encountering ChatGPT-authentication headers and a Cloudflare Worker in a package marketed as "no AI provider, API-key, analytics, telemetry or other application-level third-party network implementation" could reasonably be alarmed before tracing the code far enough to confirm it's inert. It also raises an open, unanswered question this audit could not resolve from the source alone: **if/when this product is deployed via its apparent intended hosting channel (an OpenAI "Sites"/Apps-SDK-style platform, given the `.openai/hosting.json` and ChatGPT-auth scaffolding), does that hosting layer itself run through any non-local infrastructure** — even if it never touches contract content? This is worth a direct answer in the product's public documentation rather than left to inference from stripped build scaffolding.
- **Recommended resolution:** Either remove the unused hosting scaffolding from the audit-source package entirely (it adds no value to an independent auditor and only risks confusion), or add an explicit note in `README_SOURCE.md` explaining what it is, why it's present but unused, and confirming (with specifics) what the actual hosting/distribution channel is and whether it touches the local-first boundary in any way.

---

## G. Legal and document-analysis quality

**Accuracy and missed issues:** The deterministic engine is genuinely more sophisticated than a keyword matcher in its best areas — the shared `assessOperativeAssertion` mention/asserted/negated/placeholder gate, the tiered indemnity ladder, the structural (non-dictionary) defined-term scorer, and the party-indexed termination/forum-election proposition summaries are all real, inspectable, non-cosmetic signal processing, and every specific release-note claim tested against the code (notice-right double-count fix, structural defined-term scoring, party-indexed cross-clause summaries, exact source spans, heading-only explanation) verified as **true**. But accuracy is uneven: liability caps (LGL-2), warranties (LGL-3), governing law (a single brittle phrase with no fallback, unlike its well-guarded dispute-resolution sibling), and passive-voice obligations (LGL-5) all have concrete, common-phrasing false-negative scenarios.

**Noisy findings:** Some detectors trade precision for safety in the right direction (e.g. indemnity's tiered confidence correctly demotes ambiguous matches rather than asserting), but others are noisy in ways that could train a lawyer to distrust the tool: the `fees` concept has no operative-assertion gate (a cross-reference merely mentioning "fees" registers as full evidence), and "net 30" phrasing is flagged as *missing* clear payment timing by `computeClauseIntelligence`'s day-count-only pattern even though it's present.

**False-clean risks:** This is the dimension where the product is weakest, and it is systemic rather than anecdotal — see LGL-1 through LGL-5. The product's own design principle ("failures must not look clean") is implemented faithfully at the *extraction* layer and not yet at the *detector* layer.

**Evidence quality:** Strong where it exists — every finding links back to exact source spans, and the tiered-confidence detectors show their work. The weakness is upstream of evidence quality: when a detector simply doesn't fire, there is no evidence to show, and nothing distinguishes that from a genuine absence.

**Clause interactions:** The marketed "clause interaction" checks (indemnity vs. cap, SLA vs. credits, IP vs. exit) are, on inspection, static co-occurrence reminders with canned text (`.find()`-based, examining only the *first* matching clause of each type, never computing an actual relationship) — not computed relationship analysis. The two genuinely computed cross-clause outputs (termination-rights-by-party, forum-election-by-party) are real and match the release notes' specific claim, but that claim is narrower than "clause interaction analysis" would suggest to a reader who hasn't traced the code.

**Role sensitivity:** Role (Supplier/Customer) is a manual dropdown never cross-checked against the document's own detected party identities — a wrong selection silently reverses every asymmetry/playbook framing with no self-check.

**Confidence calibration:** Three non-interoperating confidence vocabularies exist (analysis-core's tiered `matchStrength`, review-core's additive-score `High/Moderate/Low`, and app.js's raw keyword-hit-count `computeClauseIntelligence` confidence) — the first two are genuinely calibrated to signal strength; the third is a hit-count with a helpful, honestly-worded disclaimer tooltip, but that disclaimer isn't applied consistently to every surface using the same underlying number (e.g. playbook `matchStrength` labels don't carry equivalent framing).

**Explainability:** Generally strong — most findings show the matched pattern's basis, and the UI's "Detected does not mean confirmed" onboarding language is a genuinely good framing choice, faithfully implemented in most of the product except where LGL-1 undermines it.

---

## H. Source-fidelity findings

The core ingestion pipeline (custom ZIP reader, `basedOn` style-chain resolution, Word-numbering-aware clause segmentation, schedule-namespace-scoped numbering, exact block-relative source spans) is genuinely well-engineered and its specific release-note claims verify true under both code trace and executed regression tests. Live testing against the golden 92-clause fixture showed correct section/subsection numbering hierarchy (1.1–12.13 matching the source document's actual structure), correct table detection (1 table found in Annex 1, matching ground truth), and a self-disclosed extraction-integrity warning ("4 strong numbered clause boundaries were not represented in the review model — verify the outline against Word") that is itself evidence of the right design instinct, even though this audit did not have time to pin down exactly which four boundaries were affected or why.

Where source structure or traceability can fail: bulleted lists (DOCX-1, likely-common, undisclosed), direct-formatting strikethrough with `w:val` misread (DOCX-2, a genuine logic bug), custom paragraph-style names not containing the literal word "Heading" (silently downgrades to weaker text-heuristics with no warning), and nested tables (content is correctly retained but row/column structure is flattened — disclosed, so a design trade-off rather than a defect). Headers, footers, footnotes, endnotes, and comments are correctly excluded from clause text and correctly, accurately warned on (checking actual material text, not mere file presence) — a genuine positive finding, not merely a documentation claim.

---

## I. Lawyer workflow and UX findings

The four-job model (Checks / Review / Resolve / Export) is a real, coherent consolidation, and the live UI surface confirms an extensive, mostly well-organized feature set: nine independent focused checks, a clause queue with four legible states (Needs decision / Awaiting input / Escalated / Done), a Resolve canvas grouped by function (Business/Privacy/Finance/Leadership) with liability-exposure/leverage framing, and an Export surface covering Word handoff, counterparty summaries, approval packs, and an evidence ledger.

**Unnecessary work / duplication:** Recitals/preamble clauses land in the mandatory decision queue identically to operative clauses (no special-case exclusion despite a differently-scoped preamble regex existing elsewhere in the code), inflating the "decision debt" count in a way that doesn't map to how a lawyer actually thinks about what needs deciding.

**Navigation/orientation:** The button-label survey taken during live testing found roughly 70+ distinct interactive control labels reachable from a single clause's detail view plus the surrounding chrome — a large surface area that, while individually well-labeled, represents meaningful cognitive load for a first-time user, and was not stress-tested for discoverability.

**Mobile:** MOB-1 (onboarding modal overflow) is a concrete, live-reproduced failure of the mobile experience at the exact entry point a new mobile user would hit first. Deeper mobile review-workspace usability (post-onboarding) was screenshotted but not exhaustively exercised in this pass — labeled **Not tested** beyond the onboarding failure itself.

**Accessibility:** Not independently tested with a screen reader or keyboard-only navigation in this pass (a material limitation, not a pass). Static code trace (by the persistence/security research pass) found evidence of deliberate dialog semantics, focus containment, and focus restoration work on modals, consistent with the release notes' accessibility claims, but this was not behaviorally verified with assistive technology.

---

## J. Privacy, persistence and resilience

This is the product's strongest area, and the findings here are narrow relative to its overall soundness:

- **Confirmed, not assumed, zero-network posture** — the strongest possible form of evidence (direct code search) supports the "no cloud, no telemetry" claim.
- **Matter isolation is real**, not just documented: fresh UUID per matter, full state reset before any new load, pre-switch autosave-and-snapshot of the outgoing matter, session-import stripping of browser-global stores, and clause-ID remapping that prevents cross-matter ID collisions.
- **CSV export is genuinely protected against formula injection**, consistently applied.
- **The one Critical persistence finding (PER-1)** is a real, live-reproduced data-loss scenario that sits in tension with all of the above careful engineering — it is a narrow, fixable timing bug, not evidence of a broader architectural weakness, but its consequence (a lost legal decision, with no error shown) is severe enough to be release-blocking on its own.
- **The service worker update flow is explicit and non-silent** — a genuine positive, avoiding the common PWA failure mode of a stale cache serving invisibly after an update; the one residual edge case (a dismissed-banner tab continuing to run an old in-memory app version) is a deliberate UX trade-off, not an oversight, and is disclosed via the banner itself.
- **Quota exhaustion is surfaced to the user**, not silently swallowed.

---

## K. Architecture, performance and maintainability

`app.js` at 7,482 lines / ~860KB is a genuine, unresolved maintainability concern — the release notes' own framing ("dismantling the monolithic application layer without a risky rewrite") acknowledges this directly, and the extraction of `analysis-core.js`/`review-core.js`/`workflow-core.js`/`playbook-core.js` shows real, incremental progress in the right direction, not a stalled effort. Within that progress, this audit found: a dead, unexported V1 asymmetry-detection implementation left in `analysis-core.js` alongside its superseding V2 (no functional risk, since it's unreferenced, but a maintainability/clarity cost); playbook structural evaluation implemented in depth for only 8 of ~24 operational modules, with the remaining majority falling back to a flatter substring-keyword layer that inherits the liability-cap detector's phrase-brittleness for at least one Tier-1 module (H-04); and a test suite where a meaningful fraction of "regression" tests assert on the *presence of a code pattern in the raw source string* rather than on runtime behavior — real for what they test, but weaker evidence than their count alone suggests.

Performance at scale (large documents, long review sessions, memory growth over repeated imports) was **not tested** in this pass — the one live document analyzed (92 clauses) loaded and analyzed in roughly 2.5 seconds with no observable jank, which is reassuring but not evidence about documents an order of magnitude larger, or about behavior across a multi-hour review session.

---

## L. Subtraction list

1. **Remove the unused Next.js/Cloudflare/D1/ChatGPT-auth hosting scaffolding from the audit-source package** (or clearly document it) — see REL-3. The underlying need (a hosting mechanism for the static app) remains, but the audit-source package's job is independent verifiability, and this scaffolding actively works against that job by adding unrelated, alarming-looking surface area with zero product value to the auditor.
2. **Remove or consolidate the dead V1 asymmetry-detection function** in `analysis-core.js` — the need (asymmetry detection) is fully met by V2; the dead code only costs future-reader clarity.
3. **Collapse the three non-interoperating confidence vocabularies into one consistently-disclosed model** (or at minimum, apply the existing honest disclaimer tooltip uniformly wherever any of the three numbers reaches the UI) — the underlying signals are worth keeping, but presenting three different things as visually similar "confidence" labels is a clarity cost with no offsetting value.
4. **Do not add new focused-check entry points or new playbook modules until the false-clean findings (LGL-1 through LGL-5) are addressed.** The product's real risk today is coverage that *looks* more complete than it is; adding more surface area before fixing the signal-honesty problem would compound rather than reduce that risk.
5. **Consider whether "checked · none found" needs a genuinely distinct fourth UI state** rather than reusing the binary not-run/checked model — this is additive, not subtractive, but is listed here because it should be prioritized *ahead of* any subtraction-adjacent visual simplification of the check cards, since simplifying the presentation of an unreliable signal makes the underlying problem harder to see, not easier.

No major screen, workflow mode, or navigation layer was found to be a strong subtraction candidate in this pass — the four-job model is a real consolidation already, and this audit did not find evidence of a fifth competing workflow or a redundant screen duplicating another's job. This is a genuine strength of the current design, not a gap in this pass's scrutiny.

---

## M. Enhancement opportunities (ranked by practical lawyer value, not novelty)

1. **Detector-coverage disclosure (directly addresses LGL-1).** Highest value: turns every existing detector into a trustworthy signal rather than adding new detectors on an untrustworthy foundation.
2. **Broaden the liability-cap, warranty, and passive-voice-obligation detectors (LGL-2/3/5).** High value, contained scope, directly closes the audit's most concrete false-negative examples.
3. **Party-role self-check.** Cross-reference the manually-selected role against detected party aliases and surface a warning on mismatch — low implementation cost, removes a silent-misframing risk that touches every downstream asymmetry/playbook output.
4. **A genuine (not co-occurrence-canned) indemnity-vs-cap relationship check.** The two clauses' text is already located by the existing `detectCrossClauseChecks` mechanism; extending it to test whether the indemnity clause's own text falls inside or outside the cap clause's carve-out list would convert a "go look" reminder into an actual finding, for one of the highest-value clause interactions lawyers routinely check.
5. **Extend the mobile-viewport regression test suite** to catch MOB-1-class overflow issues automatically before release — moderate cost, prevents an entire class of first-impression-breaking regressions.

---

## N. Clean-sheet design

### The irreducible job

Get a lawyer from "I have a contract I haven't read" to "I know exactly what I need to decide, I can prove why, and I can hand off my position" — faster and with better evidence than reading cold, without ever pretending to have read it *for* them.

### What the lawyer should see within the first minute after import

Not a dashboard of counts. A single, ranked list of the 5-15 things in this specific document that most need a human decision, each one a direct link to source text, each one honestly labeled by *how* it was found (a real pattern match vs. "this document mentions the topic but our pattern didn't match — read it yourself"). Everything else — the full clause inventory, the complete defined-terms list, the playbook comparison — should be one click away, not competing for the same first minute.

### What should always remain anchored to source evidence

Every claim the tool makes about the document — a defined term, an obligation, a cross-reference, a risk flag — should carry a permanent, unbreakable link to the exact source text it's based on, with the honesty to say "no pattern matched here" as a distinct, differently-colored state from "we checked and found nothing." This is the one non-negotiable carried forward from the current product's genuinely good instincts (Section D), made more rigorous.

### What should be automated, suggested, or left to judgment

Automate: extraction, segmentation, mechanical checks (placeholders, cross-reference resolution, defined-term consistency) — these are the areas where the current product is already strong and where determinism is a genuine advantage over an LLM (repeatable, auditable, no hallucination risk).
Suggest, never assert: anything requiring legal judgment about *materiality* or *risk* — liability exposure framing, playbook deviations, asymmetry flags. The current product mostly gets this right in language ("Detected does not mean confirmed") but not yet in the confidence-signal architecture (LGL-1).
Leave entirely to the lawyer: which issues matter for *this* deal, what to concede, what to escalate, and the final drafting language.

### The smallest set of concepts to carry a matter from intake to negotiation

Document → Clauses (each with source-anchored evidence) → Findings (each explicitly tiered: pattern-matched / topic-present-no-match / not-checked) → Decisions (source-linked, timestamped, durably saved *before* any "saved" confirmation is shown) → Handoff (drafting instructions and negotiation position, generated from decisions, never from raw findings). Five concepts, not the current product's larger surface of overlapping progress metrics, confidence vocabularies, and workflow states.

### Resuming work instantly

The current product's autosave-and-resume-matter flow is already close to right in concept; PER-1 shows the execution needs to close the gap between "shown as saved" and "actually saved" before this concept can be trusted.

### Rapid triage and detailed review without two disconnected products

The current product's "Checks" vs. "Review" split is a reasonable answer to this — triage via focused checks, depth via the full clause queue, with shared state. The clean-sheet refinement is making the *findings* first-class objects that both surfaces reference identically (today, this is close to true but not perfectly consistent — the "Legal issues by concept" check and the per-clause card sometimes compute confidence differently, per Section G).

### What would most naturally lead into Word-based drafting

The existing Word-handoff export is a sound instinct; the clean-sheet version would generate it from a lawyer's actual *decisions* (with rationale) rather than from the raw findings list, so a drafter receiving the handoff sees "why we're asking for this change," not just "here's what the tool noticed."

### What would make a lawyer choose this tool for every significant contract

Trustworthy silence. A lawyer will return to a tool that they've verified tells the truth about what it doesn't know, far more reliably than one with more features but occasional false reassurance. This is the single biggest lever available to Contract Cockpit, and it does not require adding any new detection capability — it requires fixing LGL-1 and its downstream cascade.

### What to deliberately omit

An AI-generated redline or "suggested language" feature that isn't clearly and permanently labeled as a suggestion requiring verification (risk of over-reliance without the current product's careful "detected ≠ confirmed" framing); a CLM-style approval-workflow/e-signature/contract-repository feature set (out of scope for the stated job and a significant complexity/maintenance cost for a single-author project); any move toward cloud processing "just for this one feature" (the local-first boundary is the product's most defensible differentiator and should not be eroded for convenience).

### Comparison with Contract Cockpit today

The current product is closer to this clean-sheet concept than a typical from-scratch redesign exercise would suggest — the four-job model, the source-span architecture, and the "detected ≠ confirmed" framing are already real and mostly well-executed. The most consequential gap is not structural but architectural-in-the-small: the confidence/health signal that should carry the entire "trustworthy silence" value proposition is wired to the wrong input (LGL-1). Closing that gap is a smaller engineering lift than the clean-sheet exercise itself, and should be treated as the highest-priority step toward it.

---

## O. Recommended target product model

- **Primary user:** an experienced commercial contracts lawyer or in-house counsel doing first-pass review, negotiation prep, or a supervised second-pass check — not a junior associate relying on it unsupervised, and not a business stakeholder without legal training.
- **Central job:** turn "I have a contract" into "I know what needs a decision, I can prove why, and I can hand off my position" — faster than cold reading, with better evidence, never with false reassurance.
- **Canonical workflow:** Import → Triage (ranked, source-anchored findings, honestly tiered by detection confidence) → Review (clause-by-clause, decisions recorded with a durable-before-confirmed save) → Resolve (open loops grouped by who needs to act) → Export (handoff generated from decisions, not raw findings).
- **Principal surfaces:** kept to the current four (Checks/Review/Resolve/Export) — this audit found no evidence a fifth surface is needed, and real evidence that consolidation has already been valuable.
- **Core data model:** Document → Clauses (source-anchored) → Findings (three-tiered confidence, always) → Decisions (durable, timestamped, rationale-carrying) → Handoff artifacts (generated, not primary).
- **Analysis philosophy:** deterministic-first, always explainable, always honest about non-coverage; local AI (on-device models, not cloud) considered only where it can preserve the same explainability and local-first guarantees — never as a way to paper over a detector gap that a broader regex or a coverage-honesty fix could close instead.
- **Output model:** every export traces back to specific decisions, not raw findings; the evidence ledger and approval pack remain, since they're genuinely used pieces of the current surface.
- **What remains human judgment:** materiality, risk tolerance, negotiation strategy, and final drafting language — always.
- **What the product should deliberately not become:** a CLM, an unsupervised drafting tool, or a cloud-connected product. These are all real, current risks to guard against explicitly as pressure to "add more" grows.
- **Staying coherent as it grows:** every new detector or check must ship with its three-tier confidence classification from day one (not retrofitted later, as happened with the current health signal) — this should be a standing engineering rule, not a one-time fix.

---

## P. Prioritised roadmap

### Critical — before serious use

1. **Fix PER-1** (decision-loss on quick close/reload). Problem solved: silent data loss of legal decisions. Benefit: restores the basic trust precondition for any persistence-dependent workflow. Affected areas: `applyClauseDecision`, autosave scheduling. Dependencies: none. Effort: small (route one call through the existing "critical" delay path; add a two-phase saved-state indicator). Acceptance: automated 0ms-reload test never loses a decision. Regression coverage: new autosave-timing test suite (see PER-1).
2. **Fix LGL-1** (health-signal wired to extraction, not detector coverage). Problem solved: the product's core false-clean risk. Benefit: every other detector improvement becomes trustworthy rather than cosmetically reassuring. Affected areas: `detectorHealth`, every focused-check card. Dependencies: should land before or alongside LGL-2/3/5 fixes, since those fixes' value is capped without this. Effort: medium (new state model + per-detector coverage heuristic). Acceptance: the LGL-2 example clause renders a non-"checked-clean" state. Regression coverage: per-concept fixture set asserting correct health-state classification.
3. **Fix LGL-2** (liability-cap brittleness) and **LGL-3** (warranty detector gap). Problem solved: false-clean risk on the two highest-stakes clause categories. Effort: medium each. Acceptance/regression: per Section F findings.
4. **Fix DOCX-2** (`w:val` strikethrough bug). Problem solved: an unambiguous, currently-live source-fidelity defect (not a design trade-off). Effort: small. Acceptance/regression: per Section F.

### High — next professional-use release

5. **Fix LGL-4** (cross-reference semantic-mismatch silent-skip) and **LGL-5** (passive-voice obligations). Effort: medium each.
6. **Fix DOCX-1** (bullet-list handling). Effort: medium (needs a live bulleted fixture to validate against).
7. **Fix MOB-1** (mobile onboarding overflow). Effort: small-medium (CSS fix + regression viewport tests).
8. **Party-role self-check** (Section M item 3). Effort: small.
9. **Extend playbook structural evaluation** to the remaining ~16 modules currently on the flat keyword fallback, prioritizing any other Tier-1 "walk-away" modules beyond H-04. Effort: large (module-by-module work).

### Medium — valuable after the foundation is dependable

10. Genuine indemnity-vs-cap relationship check (Section M item 4).
11. Custom-heading-style-name detection warning (Finding C from the source-fidelity pass — silently downgrades to weaker heuristics with no disclosure).
12. Consolidate the three confidence vocabularies (Subtraction item 3).
13. Repository documentation sync (REL-1) and audit-source package hygiene (REL-2, REL-3).
14. Performance testing at scale (large documents, long sessions, memory growth) — currently entirely untested.
15. Accessibility testing with real assistive technology (screen reader, keyboard-only) — currently untested; the code shows evidence of intent (dialog semantics, focus management) but no behavioral verification exists.

### Lower priority / exploratory

16. On-device/local AI augmentation for paraphrase-tolerant detection (only after the deterministic layer's coverage-honesty problem is fixed — otherwise this compounds rather than solves the false-clean risk).
17. Incoming-version comparison (the release notes' own stated "next major capability," not evaluated in depth in this pass since it doesn't yet exist — its design should build the three-tier confidence discipline in from day one, not retrofit it).
18. Removal of dead V1 asymmetry code (cosmetic, no functional risk).

---

## Q. Top ten no-regret actions

1. **Fix the decision-loss-on-quick-reload bug (PER-1).** Live-reproduced, Critical, small effort, direct trust impact.
2. **Rewire the "checked · none found" signal to reflect detector coverage, not just extraction success (LGL-1).** The single highest-leverage change in the entire audit — makes every other detector trustworthy by association.
3. **Broaden the liability-cap detector past its literal-phrase dependency (LGL-2).** Concrete, scoped, addresses the audit's most consequential false-negative example.
4. **Add a baseline warranty detector (LGL-3).** Currently absent entirely; low effort relative to impact given the concept-detection infrastructure already exists for every other major clause category.
5. **Fix the `w:val` strikethrough bug (DOCX-2).** An unambiguous logic error, not a design trade-off — small, contained fix.
6. **Fix the mobile onboarding modal overflow (MOB-1).** A live-reproduced first-impression blocker for the mobile audience the product explicitly targets.
7. **Cross-check the manual role selection against detected party identities.** Small effort, removes a silent-misframing risk touching every downstream legal-asymmetry and playbook output.
8. **Disclose (or fix) the cross-reference semantic-mismatch silent-skip on multi-topic clauses (LGL-4).** Directly targets the single most common real-world cause of broken cross-references (renumbering drift during redlining).
9. **Add a passive-voice fallback to obligation-actor detection (LGL-5).** Common drafting pattern, currently a categorical blind spot.
10. **Clean up the audit-source package** (remove or document the unused hosting/auth scaffolding; fix the broken `npm run build`; correct the "94/94" claim). Zero product-code risk, materially improves the credibility of every other verified claim in the release, and costs almost nothing to do.

---

## Scoring and readiness assessment

| Dimension | Score (1-5) | Justification | Evidence quality | Blocking next-score factor | Confidence |
|---|---|---|---|---|---|
| Source fidelity | 3 | Strong core (exact spans, schedule-scoped numbering, disclosed material-part warnings, verified split/merge) undercut by two real silent-corruption paths (bullets, strikethrough) in common constructs | Mixed — several findings code-traced, not exec-verified | Fix DOCX-1/DOCX-2 and re-verify live against crafted fixtures | Medium |
| Functional reliability | 3 | Clean boot, working end-to-end import/analysis, 93/93 executable tests pass — offset by the live-reproduced decision-loss bug | High (live-tested + executed tests) | Fix PER-1 | High |
| Legal-analysis usefulness | 2 | Real sophistication in places, but core clause categories (liability, warranty) have concrete common-phrasing blind spots | High (extensive code trace) | Fix LGL-2/LGL-3 and re-test with a broader corpus | Medium-High |
| Analysis explainability & calibration | 3 | Two of three confidence systems are genuinely calibrated and well-disclosed; the third is a disclosed-but-inconsistent hit-count | High | Consolidate/disclose consistently | Medium |
| False-clean resistance | 2 | The dimension most directly targeted by this audit's brief; systemic, not anecdotal, gaps (LGL-1 through LGL-5) | High | Fix LGL-1 first — it's the structural fix that makes every other fix visible | High |
| Lawyer workflow coherence | 3 | Genuine four-job consolidation; Recitals-in-decision-queue and metric-consistency gaps remain | Medium (live-tested UI surface, not exhaustively) | Fix decision-queue scoping for non-operative content | Medium |
| Decision and negotiation support | 3 | Rich, genuinely-implemented feature set; undermined by PER-1's trust impact | Medium | Fix PER-1; broader negotiation-workflow testing not done this pass | Medium |
| Information architecture | 3 | Reasonably clear four-tab model; large control surface area (70+ labels reachable from one clause view) | Medium (live-tested) | Not deeply tested for discoverability/learnability with real users | Medium |
| Everyday usability | 3 | Desktop flow is clean; mobile onboarding is broken for a common viewport | Medium | Fix MOB-1; broader mobile-workspace testing not done | Medium |
| Accessibility and responsive use | 2 | One concrete live-reproduced mobile failure; no screen-reader/keyboard-only testing performed despite code evidence of intent | Low-Medium | Real assistive-technology testing needed | Low |
| Persistence and recovery | 3 | Excellent architecture (atomic writes, migration, quota handling, cross-tab lease) undercut by the live-reproduced Critical PER-1 | High | Fix PER-1 | High |
| Privacy and local security | 5 | Zero-network posture confirmed by direct code search; real CSP; no confirmed XSS path; real CSV-injection guard; robust matter isolation | High | None material found | High |
| Performance | 3 | One document, one session, no jank observed — not stress-tested | Low | Large-document and long-session testing not performed this pass | Low |
| Maintainability | 2 | 7,482-line monolith with real but partial decomposition progress; dead code; inconsistent playbook-module depth; test suite partly string-presence | Medium-High | Continue the extraction pattern; complete playbook structural coverage | Medium |
| Release discipline | 3 | Genuine cross-artifact hash verification (a real positive); "94/94" claim not reproducible as documented; unused hosting scaffolding in the audit package | High | Fix REL-2/REL-3; sync repo docs (REL-1) | High |

**Do not average these scores.** The release-blocking picture is set by the lowest scores on the dimensions the audit brief identifies as release-critical — false-clean resistance (2) and persistence/recovery's one Critical live-reproduced defect — not by the overall shape of the table, which includes a genuine 5/5 on privacy.

### Professional-use classification

**Suitable for controlled internal use with verification.**

This sits between "suitable for structured testing" and "dependable for regular professional use." The engineering quality (privacy, persistence architecture, source-span provenance, CSP/XSS posture) is well past experimental — this is not a prototype. But two independently-confirmed Critical findings (PER-1, a live-reproduced data-loss bug; LGL-1/LGL-2, a systemic and consequential false-clean risk on liability and warranty clauses specifically) mean it is not yet safe for unsupervised professional reliance.

**A lawyer may safely rely on today:** structural navigation and clause inventory; source-linked evidence excerpts (verify what's shown, don't assume what's absent); mechanical checks with a populated finding (placeholders, resolved cross-references, defined-term consistency) as genuine leads; drafting/export scaffolding as a starting point, always reviewed; the tool's zero-network privacy guarantee, which this audit independently confirmed rather than merely trusted.

**A lawyer may not safely rely on today:** an absence of findings as confirmation a document is "clean," specifically for liability caps and warranties; any clause-interaction "check" as an actual computed relationship rather than a reminder to look; a recorded decision as saved without either waiting a few seconds before closing the tab or watching for an explicit save-confirmed state; the mobile onboarding flow as reliably usable on a phone-sized screen.

---

*This report reflects code-level and live-application evidence gathered in a single audit session against the artifacts described in Section B. Findings marked "code-traced, not exec-verified" should be re-confirmed against live crafted fixtures before being treated as fully Confirmed. Areas marked Not tested (accessibility with real assistive technology, performance at scale, cross-browser/cross-engine behavior, a broader multi-family document corpus) are open risk, not passed checks, and should be closed before any claim of comprehensive verification.*
