# Contract Cockpit v7.6 — Consolidated feedback disposition

| Feedback / observation | Disposition | v7.6 treatment |
|---|---|---|
| Tracked changes were visible as warnings but not part of the output trust gate | Adopted — critical | Material tracked-revision warnings now block legal outputs until scoped source assurance is recorded. |
| Source acknowledgement was too permissive | Adopted — critical | Reviewer must add material omitted content or attest to an exact no-material-omission statement; the warning remains in the evidence trail. |
| Split clauses cloned whole source-block IDs | Adopted — critical | Block-relative source spans are split at the exact marker and later materialised for source comparison. |
| Native prompt/confirm was unsafe and visually inconsistent | Adopted | Added preview, exact-boundary validation, recovery snapshot and explicit apply/cancel dialogs. |
| Defined-term highlighting/detection felt inconsistent | Adopted substantially | One canonical variant map continues to drive highlights; structural undefined-term scoring replaces the fixed legal-term list; related signals aggregate per term. |
| Same term could create multiple independent queue items | Adopted | Canonical term fact keys merge undefined, unused, forward-use and circularity observations while retaining originating signals. |
| Duplicate placeholders were hard to distinguish | Adopted | Queue labels include source clause and occurrence identity. |
| Cross-reference and defined-term checks should work independently | Adopted | Focused Checks remains a first-class workspace; relevant clause/overview entry points now open the corresponding check. |
| Resolve was still contextual rather than a true working surface | Adopted | Dedicated canvas groups undecided clauses, business inputs, approvals and negotiation items. |
| Review and utility navigation remained conceptually crowded | Adopted | Four consistent jobs; reduced primary queue chips; hidden legacy utility duplication; right rail remains contextual. |
| Share/handoff and recovery were mixed | Adopted | One modal has explicit Share & handoff and Matter & recovery modes without deleting controls. |
| Mobile still said Full review | Adopted | Desktop and mobile now use Review. |
| Main Decision card could remain stale after a choice | Adopted defensively | Decision action explicitly refreshes clause, navigator and context surfaces. |
| 11/12 modals lacked robust dialog semantics | Adopted — accessibility | Semantics, accessible labels, focus trap and return focus are applied to every opened modal. |
| Heading-only clauses showed unexplained empty cards | Adopted | Explicit heading-only source state and verification guidance. |
| Potential RTL clause-list issue | Adopted defensively | Clause body uses `dir=auto`; RTL text receives correct alignment. True device/font QA remains a release-environment check. |
| Degenerate one-character input generated misleading queues | Adopted | One insufficient-source blocker is returned before substantive review items. |
| Multiparty agreements were reduced to two parties | Adopted | Proposition and commercial-term paths preserve up to eight detected principals; asymmetry can report every missing reciprocal party. |
| Cross-clause checks were prompts rather than structured reasoning | Partially adopted, deliberately | Termination and forum rights now use party-indexed propositions with IDs. Broader proposition families should grow only with fixture-backed precision. |
| `app.js` remains too large | Adopted incrementally | New pure `review-core.js`; no risky full-framework rewrite. Further extraction remains warranted. |
| 900-clause performance was worse than linear | Adopted in the verified hotspot | Asymmetry uses a pre-indexed proposition map. Full browser performance profiling remains necessary because DOM layout cost cannot be proven by Node tests alone. |
| Preserve visual palette | Adopted | Parchment/charcoal/teal/gold system retained; manifest and browser theme colours aligned. |
| Replace icons wholesale | Deferred | A local SVG icon system is desirable, but not at the expense of trust and workflow work in this release. |
| Add cloud AI, dashboards, CLM, OCR, more exports or online collaboration | Rejected for current product | These conflict with the private local workbench boundary or add breadth before the negotiation loop is complete. |
| Incoming-version comparison | Deferred to next major release | Still the highest-value new workflow after v7.6 trust completion. |

## Neutral product assessment

The three reviews were directionally strong and mostly consistent with observed source behaviour. The most valuable recommendations were not requests for more detection categories; they exposed places where evidence, user assurance and navigation did not yet form one dependable loop. v7.6 therefore concentrates on trust gates, provenance, review-item identity and job-based workspaces.

Two recommendations were treated carefully rather than copied literally. First, the application was not rebuilt from scratch: its mature local persistence, evidence, playbook and migration layers make a rewrite disproportionately risky. Second, the right rail was not removed; it was narrowed to contextual support because source, playbook and history are useful beside a clause, while independent checks belong in Checks.

## Release boundary

This remains suitable for a controlled lawyer pilot, subject to installed-PWA checks on the target devices and continued fixture expansion. It should not be represented as autonomous legal advice, a complete substitute for source review, or a native tracked-redline engine.
