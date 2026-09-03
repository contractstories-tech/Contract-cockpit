# Contract Cockpit v7.6 — Trust Completion & Workflow Reduction

## Release position

v7.6 completes the trust architecture introduced across v7.3–v7.5 and reduces the application to four legible jobs: focused checks, clause review, resolution of human dependencies, and controlled handoff. It remains a deterministic, local-first legal workbench. It does not use a cloud contract-processing service, telemetry or an online AI model.

## Source trust and provenance

- Tracked-change, tracked-deletion, footnote, endnote and omitted-Word-part warnings now participate in the legal-output gate.
- A generic acknowledgement is no longer sufficient. The reviewer must either add material omitted text into the review model or record the exact no-material-omission assurance.
- Added text becomes a separately identified, auditable source supplement.
- Clause splitting records exact block-relative source spans rather than cloning whole source-block IDs onto both resulting clauses.
- Clause merging coalesces the original spans and archives affected decisions for reconfirmation.
- Split and merge now use an in-product preview and validation dialog with a recovery snapshot, replacing native browser prompt/confirm interactions.
- Heading-only source units show an explicit explanation instead of an unexplained empty card.

## Defined terms and structural checks

- Undefined-term detection now scores drafting structure: operative use, conditional use, contractual-object use, cross-document structure and clause spread. It is no longer dependent on a fixed list of familiar legal terms.
- All defined-term signals for the same expression share one review identity, including undefined use, unused definition, forward use and possible circularity.
- Highlighting, tooltip lookup, usage navigation and defined-term checks continue to use one canonical variant map.
- Repeated placeholders are labelled by clause and occurrence so identical markers remain distinguishable.
- Very short or degenerate imports now produce one source-insufficiency blocker and suppress misleading substantive queues.

## Legal-effect coherence

- Legal propositions are computed once and reused by asymmetry and cross-clause review.
- Party detection and commercial summaries retain up to eight detected principal parties rather than silently truncating the matter to two.
- The notice proposition requires an operative give, deliver, serve, send, provide or notify formulation; “terminate on notice” is no longer double-counted as a notice right.
- Clause explanations now include a party-relative “who holds which right” layer.
- Cross-clause review adds party-indexed termination and forum-election summaries with proposition provenance.

## Workflow and interface

- The navigation vocabulary is now consistently Checks, Review, Resolve and Export on desktop and mobile.
- Focused checks remain independent entry points for defined terms, cross-references, placeholders, obligations, concepts, playbook coverage, subjective standards, asymmetry, expected clauses and signing readiness.
- Clicking a highlighted defined term opens its independent Defined terms check instead of a hidden legacy utility surface.
- Resolve is a dedicated canvas grouped by decisions, business questions, approvals and negotiation items.
- Share & handoff is visually separated from Matter & recovery, while preserving every existing output and recovery control.
- The clause queue exposes only Needs decision, Awaiting input, Escalated and Done as primary states.
- Review items use compact expandable rows and show the number of linked observations.
- The stale main decision-card rendering path is closed: clause, navigator and context surfaces refresh together.
- Every modal receives dialog semantics, an accessible label, focus containment and focus restoration at open time.
- The existing parchment, charcoal, teal and restrained gold visual system is retained and extended.

## Performance and maintainability

- Asymmetry review indexes precomputed propositions by clause instead of repeatedly filtering the complete proposition collection.
- Source trust and review identity logic moved into `review-core.js`, the next step in dismantling the monolithic application layer without a risky rewrite.
- The offline shell manifest and standalone builder include the new pure core.

## Preserved deliberately

- DOCX numbering and nested-list fidelity.
- Local IndexedDB autosave, per-matter recovery, snapshots and migration compatibility.
- Lawyer decisions, notes, approvals, negotiation state, audience isolation and external-wording approval gates.
- Playbook V3 guidance, source registry, completeness reporting and provenance in handoff/evidence exports.
- Word drafting handoff, evidence ledger, approval pack and all secondary internal outputs.
- Restrictive standalone CSP and no application-level outbound contract-data path.

## Intentional next major capability

Incoming-version comparison remains the correct next major product step. It should carry decisions only across confidently unchanged clauses, force re-review of changed text, expose new/deleted/uncertain mappings, and never silently carry a decision onto changed language.
