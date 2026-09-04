/* ============================================================
Contract Cockpit v7.6
Local-only review, evidence-led outputs, and Word-adjacent drafting handoff
============================================================ */
const DB_NAME = 'contract-cockpit-db';
const DB_STORE = 'sessions';
const DB_KEY = 'autosave-v7-0';
const LEGACY_DB_KEYS = ['autosave-v6-63','autosave-v6-62-1','autosave-v6-62','autosave-v6-61','autosave-v6-60','autosave-v6-59','autosave-v6-58','autosave-v6-57','autosave-v6-56','autosave-v6-55','autosave-v6-54','autosave-v6-53','autosave-v6-52','autosave-v6-51','autosave-v6-50','autosave-v6-49','autosave-v6-48','autosave-v6-47','autosave-v6-46','autosave-v6-45','autosave-v6-42','autosave-v6-41','autosave-v6-40','autosave-v6-39','autosave-v6-38','autosave-v6-37','autosave-v6-36','autosave-v6-35','autosave-v6-34','autosave-v6-33-1','autosave-v6-33','autosave-v6-32','autosave-v6-31','autosave-v6-30','autosave-v6-29','autosave-v6-28'];
const SNAPSHOT_PREFIX = 'snapshot-v7-0-';
const MATTER_AUTOSAVE_PREFIX = 'matter-autosave-v7-0-';
const LEGACY_MATTER_AUTOSAVE_PREFIXES = ['matter-autosave-v6-76-','matter-autosave-v6-75-','matter-autosave-v6-74-','matter-autosave-v6-73-','matter-autosave-v6-72-','matter-autosave-v6-71-','matter-autosave-v6-70-','matter-autosave-v6-69-','matter-autosave-v6-68-','matter-autosave-v6-67-'];
const LIBRARY_KEY = 'clause-library-v7-0';
const LEGACY_LIBRARY_KEYS = ['clause-library-v6-63','clause-library-v6-62-1','clause-library-v6-62','clause-library-v6-61','clause-library-v6-60','clause-library-v6-59','clause-library-v6-58','clause-library-v6-57','clause-library-v6-56','clause-library-v6-55','clause-library-v6-54','clause-library-v6-53','clause-library-v6-52','clause-library-v6-51','clause-library-v6-50','clause-library-v6-49','clause-library-v6-48','clause-library-v6-47','clause-library-v6-46','clause-library-v6-45','clause-library-v6-42','clause-library-v6-41','clause-library-v6-40','clause-library-v6-39','clause-library-v6-38','clause-library-v6-37','clause-library-v6-36','clause-library-v6-35','clause-library-v6-34','clause-library-v6-33-1','clause-library-v6-33','clause-library-v6-32','clause-library-v6-31','clause-library-v6-30','clause-library-v6-29','clause-library-v6-27'];
LEGACY_DB_KEYS.unshift('autosave-v6-76','autosave-v6-75','autosave-v6-74','autosave-v6-73','autosave-v6-72','autosave-v6-71','autosave-v6-70','autosave-v6-69','autosave-v6-68','autosave-v6-67','autosave-v6-66','autosave-v6-65','autosave-v6-64');
LEGACY_LIBRARY_KEYS.unshift('clause-library-v6-76','clause-library-v6-75','clause-library-v6-74','clause-library-v6-73','clause-library-v6-72','clause-library-v6-71','clause-library-v6-70','clause-library-v6-69','clause-library-v6-68','clause-library-v6-67','clause-library-v6-66','clause-library-v6-65','clause-library-v6-64');
const BUILD_VERSION = '7.6';
const ANALYZER_VERSION = '7.6.0';
const ANALYSIS_CORE = globalThis.ContractCockpitAnalysis || {};
const REVIEW_CORE = globalThis.ContractCockpitReview || {};
const WORKFLOW_CORE = globalThis.ContractCockpitWorkflow || {};
const PLAYBOOK_CORE = globalThis.ContractCockpitPlaybook || {};
const SESSION_SCHEMA_VERSION = 5;
const TAB_SESSION_ID = globalThis.crypto?.randomUUID?.() || `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const MAX_PLAIN_FILE_BYTES = 12 * 1024 * 1024;
const MAX_SESSION_FILE_BYTES = 20 * 1024 * 1024;
const MAX_DOCX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 2500;
const MAX_ZIP_EXPANDED_BYTES = 120 * 1024 * 1024;
const MAX_PLAYBOOK_FILE_BYTES = 5 * 1024 * 1024;
const MAX_PLAYBOOK_MODULES = 200;
const MAX_PLAYBOOK_RULES_PER_MODULE = 120;
const MAX_PLAYBOOK_FIELD_LENGTH = 20000;
const MAX_LIBRARY_FILE_BYTES = 3 * 1024 * 1024;
const MAX_LIBRARY_ENTRIES = 1000;
const MAX_LIBRARY_TEXT_LENGTH = 30000;
const AUTOSAVE_LEASE_PREFIX = 'cockpit-autosave-lease-';
const DIAGNOSTIC_LOG_LIMIT = 50;
const PREFS_KEY = 'cockpit-prefs-v1';
const ONBOARDED_KEY = 'cockpit-onboarded';
const WORKSPACES_KEY = 'cockpit-workspaces-v1';
const SESSION_RETURN_KEY = 'cockpit-session-return-v1';
const DRAFTING_AUTOSAVE_DELAY = 1500;
const AUTOSAVE_REASON_DEFAULT_DELAY = {immediate:0, critical:50, substantive:DRAFTING_AUTOSAVE_DELAY, ui:300};
const MAX_REVIEW_LOG_ENTRIES = 200;
const MAX_UNDO = 50;
const NOTE_TYPE_OPTIONS = ['Risk','Query','Business Input','Drafting Issue','Commercial Issue','Follow-Up','General Comment'];
const LEGACY_NOTE_TYPE_ALIASES = { 'Fallback Suggestion':'Follow-Up' };
const HINT_KEYS = {
  XREF_CHIP: 'hint-xref-chip',
  TERM_CHIP: 'hint-term-chip',
  PLACEHOLDER_CHIP: 'hint-placeholder-chip',
  QUEUE_CHIPS: 'hint-queue-chips',
  HEALTH_SCORE: 'hint-health-score',
  TOOLS_STRIP: 'hint-tools-strip',
  DECISION_CARD: 'hint-decision-card'
};

const LEGACY_AI_STORAGE_KEYS = ['cockpit-ai-config-v1','cockpit-ai-consent-v1','cockpit-ai-config-v1-key'];

/* -- Consolidated 4-tab system -- */
const TAB_IDS = ['summary','review','notes','strategy'];
const TOOLS_TAB_IDS = ['map','terms','refs','fills','timeline'];
const OVERVIEW_ID = '__overview__';

function isReviewableClause(clause) {
  const override=state?.reviewabilityOverrides?.[clause?.id];
  if(override==='include') return true;
  if(override==='exclude') return false;
  return typeof WORKFLOW_CORE.isReviewableClause === 'function'
    ? WORKFLOW_CORE.isReviewableClause(clause)
    : !!clause && clause.id !== OVERVIEW_ID;
}
function getReviewableClauses() {
  return (state.clauses || []).filter(isReviewableClause);
}

const SAMPLE_TEXT_MSA = `MASTER SERVICES AGREEMENT

This Master Services Agreement ("Agreement") is made on [EFFECTIVE DATE] between Northstar Retail Solutions Limited, a company incorporated in England and Wales with its registered office at 22 Bishopsgate, London EC2N 4BQ ("Client"), and Orion Digital Services Private Limited, a company incorporated in India with its principal office at [SUPPLIER ADDRESS] ("Supplier").

1. Definitions
1.1 "Affiliate" means any entity that directly or indirectly Controls, is Controlled by, or is under common Control with a party.
1.2 "Applicable Charges" means the fees and charges set out in a Statement of Work or Order Form.
1.3 "Client Data" means all data, content, materials, and information provided by or on behalf of Client, or otherwise generated from Client systems, in connection with the Services.
1.4 "Confidential Information" means all non-public information disclosed by one party to the other in connection with this Agreement, including Client Data, pricing, security information, and business plans.
1.5 "Control" means direct or indirect ownership of more than fifty percent (50%) of the voting interests of an entity, or the power to direct its management.
1.6 "Deliverables" means the work product, documents, reports, configurations, and other outputs expressly identified in a Statement of Work.
1.7 "Personal Data Breach" means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data.
1.8 "Services" means the implementation, transition, support, managed, advisory, and related services performed by Supplier under this Agreement and any Statement of Work.
1.9 "Service Credits" means the credits described in Clause 6 that may be applied against future invoices where Supplier fails to meet the service levels.
1.10 "Statement of Work" or "SOW" means a written statement of work, order form, or similar ordering document executed by the parties under this Agreement.

2. Services
2.1 Supplier shall perform the Services described in each applicable Statement of Work with reasonable skill and care and in accordance with this Agreement.
2.2 Supplier's performance is subject to Client providing timely access to personnel, systems, facilities, decisions, data, and dependencies reasonably required for delivery.
2.3 Supplier shall not be responsible for delays to the extent caused by Client's failure to provide dependencies, approvals, or inputs in a timely manner.
2.4 Supplier may use Affiliates and approved subcontractors to perform portions of the Services, provided Supplier remains responsible for their acts and omissions under this Agreement.

3. Statements of Work and Order Forms
3.1 No Services shall commence unless the parties execute a Statement of Work or Order Form referencing this Agreement.
3.2 Each Statement of Work shall set out the scope, assumptions, timelines, dependencies, Deliverables, acceptance criteria where applicable, and Applicable Charges.
3.3 In the event of conflict, the following order of precedence applies: Statement of Work, this Agreement, and then any other agreed schedules, except as expressly stated otherwise in the relevant Statement of Work.

4. Change Control
4.1 Any change to scope, assumptions, timelines, dependencies, Deliverables, or Applicable Charges shall be managed through a written change control process.
4.2 Either party may submit a written change request describing the proposed change and the expected impact on cost, schedule, risks, and responsibilities.
4.3 Supplier shall have no obligation to implement a requested change until the parties have agreed the relevant change in writing.

5. Fees and Invoicing
5.1 Client shall pay undisputed invoices within thirty (30) days of receipt of a valid invoice.
5.2 If Client disputes an invoice in good faith, Client shall notify Supplier within ten (10) days of receipt, identifying the disputed amount and the basis for the dispute, and shall pay the undisputed portion when due.
5.3 Overdue undisputed amounts may accrue interest at one percent (1%) per month or the maximum rate permitted by law, whichever is lower.
5.4 Supplier may suspend Services for non-payment only after giving at least fifteen (15) days' prior written notice and only where the overdue amount remains undisputed.

6. Service Levels
6.1 Where a Statement of Work identifies managed or support Services, Supplier shall use commercially reasonable efforts to maintain monthly availability of 99.5% for the in-scope production services.
6.2 If Supplier fails to meet the service level in a given calendar month, Client shall be entitled to Service Credits equal to two percent (2%) of the affected monthly recurring fees for each full 0.5% below the service level, capped at ten percent (10%) of the affected monthly recurring fees.
6.3 Service Credits shall be Client's sole and exclusive monetary remedy for the specific service level failure giving rise to them, without limiting termination rights for persistent material breach.

7. Data Protection
7.1 To the extent Supplier processes personal data on behalf of Client, Client acts as controller and Supplier acts as processor.
7.2 Supplier shall process personal data only on documented instructions from Client and only for the purposes of providing the Services.
7.3 Supplier shall implement appropriate technical and organisational security measures to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
7.4 Supplier shall notify Client without undue delay and, where feasible, within seventy-two (72) hours after becoming aware of a Personal Data Breach.
7.5 Supplier may engage sub-processors subject to equivalent written obligations and shall remain responsible for their acts and omissions.
7.6 Supplier shall provide reasonable assistance to Client in responding to data subject requests and regulatory inquiries relating to the Services.

8. Confidentiality
8.1 Each party shall protect the other party's Confidential Information using at least reasonable care and no less than the care it uses for its own similar confidential information.
8.2 Each party shall use the other party's Confidential Information solely for the permitted purpose of performing or receiving the Services under this Agreement.
8.3 Upon written request or termination, each party shall return or securely destroy the other party's Confidential Information, except for routine archival backups maintained in accordance with standard retention processes.
8.4 The confidentiality obligations in this Clause 8 shall survive for three (3) years after termination or expiry of this Agreement.

9. Intellectual Property
9.1 Each party retains ownership of its pre-existing materials, know-how, methods, templates, software, inventions, and other intellectual property rights.
9.2 Supplier grants Client a non-exclusive, non-transferable license to use Supplier's background materials solely to the extent embedded in any Deliverables and only as necessary for Client to receive the benefit of the Services and Deliverables.
9.3 Subject to payment of all undisputed Applicable Charges, ownership of bespoke Deliverables expressly identified in a Statement of Work as work product shall vest in Client on creation, excluding Supplier's background materials, tools, scripts, accelerators, and general know-how.
9.4 Nothing in this Agreement transfers ownership of Client Data to Supplier.

10. Warranties
10.1 Each party represents that it has the full power and authority to enter into and perform this Agreement.
10.2 Supplier warrants that the Services shall be performed with reasonable skill and care in accordance with good industry practice.
10.3 Except as expressly stated in this Agreement, Supplier disclaims all other warranties, whether express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.

11. Indemnities
11.1 Supplier shall indemnify Client against third-party claims alleging that the Services or Deliverables infringe a third party's intellectual property rights, except to the extent the claim arises from Client materials, Client instructions, or unauthorized modifications by Client.
11.2 Client shall indemnify Supplier against third-party claims arising from Client Data, Client materials, or Client's unlawful use of the Services.
11.3 The indemnified party shall promptly notify the indemnifying party of the claim, provide reasonable cooperation, and allow the indemnifying party to control the defence and settlement, subject to standard consent protections for admissions and non-monetary relief.

12. Limitation of Liability
12.1 Subject to Clause 12.3, each party's aggregate liability arising under or in connection with this Agreement shall not exceed the fees paid or payable under this Agreement in the twelve (12) months preceding the event giving rise to the claim.
12.2 Neither party shall be liable for indirect, consequential, special, incidental, punitive, or exemplary damages, or for loss of profit, revenue, goodwill, or anticipated savings.
12.3 Nothing in this Agreement excludes or limits liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any liability that cannot lawfully be excluded or limited.

13. Term and Termination
13.1 This Agreement begins on the Effective Date and continues for an initial term of two (2) years unless terminated earlier in accordance with this Agreement.
13.2 Either party may terminate this Agreement or an affected Statement of Work for material breach if the breach remains uncured for thirty (30) days after written notice.
13.3 Either party may terminate this Agreement for convenience on ninety (90) days' written notice.
13.4 Client may terminate immediately upon written notice if Supplier suffers a security breach caused by gross negligence, becomes insolvent, or repeatedly fails to meet the service levels in three (3) consecutive months.
13.5 Supplier may terminate immediately upon written notice if Client repeatedly fails to pay undisputed amounts and such failure continues for thirty (30) days after notice.
13.6 On termination, Supplier shall comply with the transition obligations in Clause 26.

14. Exit and Transition
14.1 Upon expiry or termination of the Agreement or any Statement of Work, Supplier shall provide reasonable exit and transition assistance for up to ninety (90) days, subject to agreed charges where such assistance exceeds the Services already included in scope.
14.2 Supplier shall cooperate in good faith with Client and any replacement service provider to facilitate an orderly transfer of Services, Deliverables, and relevant operational information.

15. Audit Rights
15.1 Upon at least ten (10) Business Days' prior written notice, Client may audit Supplier's relevant books, records, and controls relating to the Services not more than once in any twelve (12) month period, unless a security incident or regulatory requirement reasonably requires additional review.
15.2 Audits shall be conducted during normal business hours, in a manner that minimizes disruption to Supplier's operations, and subject to reasonable confidentiality and site-security requirements.

16. Compliance with Laws
16.1 Each party shall comply with Applicable Law in performing its obligations under this Agreement.
16.2 Supplier shall maintain policies and procedures reasonably designed to comply with applicable anti-bribery, anti-corruption, and sanctions laws relevant to the Services.
16.3 Client shall be responsible for ensuring that its instructions and use of the Services comply with Applicable Law.

17. Force Majeure
17.1 Neither party shall be liable for delay or failure to perform its obligations to the extent caused by events beyond its reasonable control, including acts of God, natural disasters, war, terrorism, labour disputes, or failures of utilities or telecommunications not caused by that party.
17.2 The affected party shall promptly notify the other party and use reasonable efforts to mitigate the impact of the force majeure event.
17.3 If a force majeure event continues for more than sixty (60) days, either party may terminate the affected Services on written notice.


18. Assignment
18.1 Neither party may assign or transfer this Agreement, whether by operation of law or otherwise, without the other party's prior written consent, not to be unreasonably withheld or delayed.
18.2 Either party may assign this Agreement without consent to an Affiliate or in connection with a merger, acquisition, or sale of substantially all of its assets, provided the assignee is not a direct competitor of the other party and agrees in writing to be bound by this Agreement.

19. Governing Law
19.1 This Agreement and any non-contractual obligations arising out of or in connection with it shall be governed by the laws of England and Wales.

20. Dispute Resolution
20.1 The parties shall first attempt in good faith to resolve any dispute through escalation to their respective contract managers.
20.2 If the dispute is not resolved within ten (10) Business Days, the dispute shall be escalated to senior executives of each party.
20.3 If the dispute remains unresolved after a further fifteen (15) Business Days, the parties submit to the exclusive jurisdiction of the courts of London.

21. Notices
21.1 Notices under this Agreement shall be in writing and sent by courier or email to the addresses set out in the relevant Statement of Work or otherwise notified by a party in writing.
21.2 Notices to Supplier shall also be copied to contracts@oriondigital.example and to the address in Clause 24.

22. Entire Agreement
22.1 This Agreement, together with any Statements of Work and schedules expressly incorporated into it, constitutes the entire agreement between the parties regarding its subject matter and supersedes prior understandings relating to that subject matter.

23. Amendments
23.1 No amendment to this Agreement shall be effective unless made in writing and signed by authorized representatives of both parties.

24. Severability
24.1 If any provision of this Agreement is found invalid or unenforceable, the remaining provisions shall continue in full force and effect, and the parties shall negotiate in good faith a valid replacement provision that most closely reflects the original intent.

25. Waiver
25.1 No failure or delay by either party in exercising any right or remedy under this Agreement shall operate as a waiver of that right or remedy.
25.2 A waiver of any breach shall not be deemed a waiver of any subsequent breach.
25.3 For clarity, the parties acknowledge that transition assistance obligations continue in accordance with Clause 26.

Schedule A
Fees and Services Description [TO BE AGREED]`;

const SAMPLE_TEXT_NDA = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [EFFECTIVE DATE] between Helix Pharmaceuticals Limited, a company incorporated in England and Wales (registered number [COMPANY NUMBER]) with its registered office at [HELIX ADDRESS] ("Helix"), and Meridian Analytics Group Limited, a company incorporated in England and Wales (registered number [COMPANY NUMBER]) with its registered office at [MERIDIAN ADDRESS] ("Meridian"). Each of Helix and Meridian is referred to herein individually as a "Party" and collectively as the "Parties."

BACKGROUND

The Parties wish to explore a potential commercial collaboration relating to data-driven clinical trial optimisation (the "Permitted Purpose"). In connection with this exploration, each Party may disclose Confidential Information to the other. This Agreement sets out the terms on which such information will be received and protected.

1. Definitions

1.1 "Confidential Information" means all non-public information disclosed by or on behalf of the Disclosing Party to the Receiving Party, whether before or after the date of this Agreement, in writing, orally, electronically, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation, trade secrets, technical data, research results, clinical data, formulae, algorithms, software, business plans, financial information, customer lists, pricing information, and personnel data.

1.2 "Disclosing Party" means the Party disclosing Confidential Information under this Agreement.

1.3 "Receiving Party" means the Party receiving Confidential Information under this Agreement.

1.4 "Representatives" means a Party's employees, directors, officers, legal advisers, financial advisers, and consultants who have a genuine need to know the Confidential Information for the Permitted Purpose and who are bound by written confidentiality obligations no less protective than those set out in this Agreement.

2. Obligations of Confidentiality

2.1 The Receiving Party shall:
(a) hold the Disclosing Party's Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential information of similar sensitivity, but in no event less than reasonable care;
(b) use the Disclosing Party's Confidential Information solely for the Permitted Purpose and for no other purpose whatsoever;
(c) not disclose the Disclosing Party's Confidential Information to any third party without the Disclosing Party's prior written consent, except as permitted under Clause 3; and
(d) promptly notify the Disclosing Party upon becoming aware of any actual or suspected unauthorised disclosure, access to, or use of Confidential Information.

2.2 The Receiving Party shall ensure that access to the Disclosing Party's Confidential Information is restricted to its Representatives who require such access for the Permitted Purpose. The Receiving Party shall be liable for any breach of this Agreement by its Representatives as if such breach were its own.

3. Permitted Disclosures

3.1 The obligations in Clause 2 shall not apply to information that:
(a) is or becomes publicly available through no act or omission of the Receiving Party;
(b) was already known to the Receiving Party at the time of disclosure, as evidenced by contemporaneous written records;
(c) is independently developed by the Receiving Party without reference to or use of the Disclosing Party's Confidential Information; or
(d) is rightfully received by the Receiving Party from a third party without restriction on disclosure.

3.2 The Receiving Party may disclose Confidential Information to the extent required by applicable law, regulation, or court order, provided that the Receiving Party:
(a) gives the Disclosing Party prompt written notice of the requirement to disclose, to the extent permitted by law, and sufficient to allow the Disclosing Party to seek a protective order or other appropriate remedy;
(b) cooperates reasonably with the Disclosing Party in seeking such protective order or remedy; and
(c) discloses only that portion of the Confidential Information that is legally required to be disclosed.

4. No Licence or Warranty

4.1 Nothing in this Agreement grants either Party any right, title, or interest in or to the other Party's Confidential Information or any intellectual property rights subsisting therein.

4.2 All Confidential Information is disclosed on an "as is" basis. The Disclosing Party makes no representation or warranty, express or implied, as to the accuracy, completeness, or fitness for any particular purpose of the Confidential Information.

4.3 Neither Party shall be under any obligation to enter into any further agreement, proceed with any transaction, or continue any discussions by reason of this Agreement.

5. Return and Destruction of Confidential Information

5.1 Upon written request by the Disclosing Party, or upon termination or expiry of this Agreement, the Receiving Party shall promptly, and in any event within ten (10) Business Days:
(a) return all tangible materials containing or embodying the Disclosing Party's Confidential Information; and
(b) permanently delete or destroy all electronic copies, notes, summaries, and extracts of the Disclosing Party's Confidential Information.

5.2 The Receiving Party shall, upon request, provide the Disclosing Party with written certification that the obligations in Clause 5.1 have been fulfilled.

5.3 Notwithstanding Clause 5.1, the Receiving Party may retain archival copies of Confidential Information to the extent required by applicable law or regulation, subject to the confidentiality obligations of this Agreement continuing to apply for so long as such copies are retained.

6. Term and Termination

6.1 This Agreement commences on the Effective Date and continues for a period of two (2) years unless terminated earlier by either Party on thirty (30) days' written notice to the other.

6.2 Termination of this Agreement shall not affect any rights or obligations accrued prior to the date of termination.

6.3 The obligations of confidentiality in Clause 2 shall survive termination or expiry of this Agreement for a further period of three (3) years.

7. Remedies

7.1 Each Party acknowledges that any breach of this Agreement may cause the Disclosing Party irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, the Disclosing Party shall be entitled to seek injunctive or other equitable relief in addition to any other remedies available at law or equity, without the requirement to post a bond or other security.

8. Non-Solicitation

8.1 During the term of this Agreement and for a period of twelve (12) months following its termination or expiry, neither Party shall, without the prior written consent of the other Party, directly solicit for employment any employee of the other Party with whom it has had material contact in connection with the Permitted Purpose.

8.2 Nothing in Clause 8.1 shall prevent either Party from conducting general recruitment advertising not specifically targeted at the other Party's employees.

9. Governing Law and Jurisdiction

9.1 This Agreement and any non-contractual obligations arising out of or in connection with it shall be governed by the laws of England and Wales.

9.2 Each Party irrevocably submits to the exclusive jurisdiction of the courts of England and Wales in respect of any dispute or claim arising out of or in connection with this Agreement.

10. General

10.1 This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior agreements, representations, and understandings relating to confidentiality between the Parties in respect of the Permitted Purpose.

10.2 No amendment to this Agreement shall be effective unless made in writing and signed by authorised representatives of both Parties.

10.3 If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

10.4 A waiver of any breach of this Agreement shall not constitute a waiver of any subsequent breach.

10.5 This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed valid.

10.6 Neither Party may assign or transfer its rights or obligations under this Agreement without the prior written consent of the other Party.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

HELIX PHARMACEUTICALS LIMITED

Signed: ___________________________
Name: [AUTHORISED SIGNATORY NAME]
Title: [TITLE]
Date: [DATE]

MERIDIAN ANALYTICS GROUP LIMITED

Signed: ___________________________
Name: [AUTHORISED SIGNATORY NAME]
Title: [TITLE]
Date: [DATE]`;

const SAMPLE_TEXT_SAAS = `SOFTWARE SUBSCRIPTION AGREEMENT

This Software Subscription Agreement ("Agreement") is entered into as of [EFFECTIVE DATE] between Vantage Cloud Technologies Limited, a company incorporated in England and Wales with its registered office at 14 Finsbury Square, London EC2A 1BR ("Supplier"), and Castleton Group plc, a company incorporated in England and Wales with its registered office at [CUSTOMER ADDRESS] ("Customer").

1. Definitions

In this Agreement, the following terms shall have the meanings set out below:

1.1 "Authorised Users" means those employees, contractors, and agents of Customer authorised by Customer to access and use the Service, not to exceed the number of seats set out in the applicable Order Form.

1.2 "Business Day" means any day other than a Saturday, Sunday, or public holiday in England and Wales.

1.3 "Commencement Date" means the date on which Supplier activates Customer's access to the Service following execution of the first Order Form.

1.4 "Confidential Information" means all non-public information disclosed by one party to the other in connection with this Agreement, including technical data, business plans, financial information, and the terms of this Agreement, that is designated as confidential or that should reasonably be understood to be confidential.

1.5 "Customer Data" means all data, content, and information submitted to or processed through the Service by or on behalf of Customer or its Authorised Users.

1.6 "Documentation" means the user guides, technical specifications, and help materials for the Service made available by Supplier from time to time at [DOCUMENTATION URL].

1.7 "Order Form" means a written order document or online order form executed by the parties specifying the Service tier, Authorised Users, Subscription Fees, and Subscription Term.

1.8 "Permitted Purpose" means Customer's internal business operations only, excluding any use for the benefit of a third party or any commercial resale or sub-licensing.

1.9 "Service" means Supplier's proprietary [PRODUCT NAME] software-as-a-service platform, as described in the applicable Order Form and Documentation, including any updates and upgrades made generally available by Supplier during the Subscription Term.

1.10 "Service Credits" means credits applicable against future Subscription Fees calculated in accordance with Schedule 1.

1.11 "Subscription Fees" means the fees payable by Customer for access to the Service as set out in the applicable Order Form.

1.12 "Subscription Term" means the initial subscription period set out in the Order Form, and any renewal periods in accordance with Clause 14.

2. Grant of Licence

2.1 Subject to Customer's compliance with this Agreement and timely payment of all Subscription Fees, Supplier grants Customer a non-exclusive, non-transferable, non-sublicensable, revocable licence during the Subscription Term to access and use the Service for the Permitted Purpose.

2.2 The licence granted in Clause 2.1 is limited to access via Supplier's standard web interface or approved API integration. Customer shall not copy, modify, adapt, translate, reverse engineer, decompile, disassemble, or create derivative works based on the Service or any part of it.

2.3 Customer may permit Authorised Users to access the Service, provided Customer remains responsible for each Authorised User's compliance with this Agreement.

3. Authorised Users and Access Controls

3.1 Customer shall ensure that the total number of Authorised Users does not exceed the number of seats purchased. Additional seats may be purchased at the then-current list price on a pro-rated basis for the remainder of the Subscription Term.

3.2 Customer shall ensure that each Authorised User maintains a unique set of login credentials and shall not permit sharing of credentials between users or concurrent logins by the same user from different devices.

3.3 Customer shall promptly notify Supplier if it becomes aware of any unauthorised access to the Service using Customer's credentials and shall take reasonable steps to prevent further unauthorised access.

4. Acceptable Use

4.1 Customer shall not, and shall procure that its Authorised Users do not:
(a) use the Service to store, transmit, or process any data that is unlawful, harmful, fraudulent, or that infringes any third-party intellectual property, privacy, or other rights;
(b) use the Service to transmit any viruses, malware, or other harmful code;
(c) attempt to gain unauthorised access to any part of the Service or its underlying infrastructure;
(d) use the Service to develop a competing product or service;
(e) circumvent or attempt to circumvent any technical or access control mechanisms in the Service; or
(f) use the Service in a manner that imposes an unreasonably disproportionate load on Supplier's infrastructure.

4.2 Supplier reserves the right to suspend Customer's access to the Service immediately and without notice if Customer materially breaches Clause 4.1, subject to restoring access once the breach has been remediated.

5. Subscription Fees and Payment

5.1 Customer shall pay the Subscription Fees set out in each Order Form in advance, in the currency and by the payment method specified in the Order Form.

5.2 Supplier shall issue invoices in accordance with the invoicing schedule in the applicable Order Form. Customer shall pay each undisputed invoice within thirty (30) days of receipt.

5.3 If Customer disputes any invoice in good faith, Customer shall notify Supplier in writing within ten (10) Business Days of receipt, identifying the disputed amount and the basis for the dispute. Customer shall pay the undisputed portion by the due date.

5.4 Overdue undisputed amounts shall accrue interest at two percent (2%) per annum above the Bank of England base rate, from the due date until the date of payment.

5.5 All Subscription Fees are exclusive of value added tax and any other applicable taxes. Customer shall pay all such taxes in addition to the Subscription Fees.

5.6 Supplier may increase the Subscription Fees on renewal by no more than [FEE INCREASE CAP]% by giving Customer at least sixty (60) days' written notice prior to the renewal date.

6. Service Levels and Service Credits

6.1 Supplier shall use commercially reasonable efforts to make the Service available with a monthly uptime percentage of [UPTIME TARGET]% ("Service Level"), measured on a calendar-month basis and excluding Scheduled Maintenance.

6.2 "Scheduled Maintenance" means planned maintenance notified to Customer at least forty-eight (48) hours in advance via the Service status page at [STATUS PAGE URL], not exceeding eight (8) hours per calendar month.

6.3 If Supplier fails to achieve the Service Level in any calendar month, Customer shall be entitled to Service Credits calculated in accordance with Schedule 1.

6.4 Service Credits shall be Customer's sole and exclusive monetary remedy for a failure to achieve the Service Level, without prejudice to Customer's right to terminate for persistent material breach in accordance with Clause 14.4.

6.5 Service Credits shall be applied against the next invoice issued by Supplier. Service Credits are not redeemable for cash and have no value upon termination of this Agreement.

7. Customer Data

7.1 As between the parties, Customer retains all right, title, and interest in and to Customer Data. Supplier acquires no rights in Customer Data other than as necessary to provide the Service.

7.2 Supplier shall process Customer Data only as a data processor acting on Customer's documented instructions and solely for the purposes of providing the Service. The parties' respective obligations as data controller and data processor are set out in the Data Processing Addendum at Schedule 2.

7.3 Supplier shall implement and maintain appropriate technical and organisational security measures to protect Customer Data against accidental or unlawful destruction, loss, alteration, unauthorised disclosure, or access. The minimum security standards are described in Supplier's Security Policy available at [SECURITY POLICY URL].

7.4 Supplier shall notify Customer without undue delay and, where feasible, within seventy-two (72) hours after becoming aware of any confirmed or suspected personal data breach affecting Customer Data.

7.5 On termination or expiry of this Agreement, Supplier shall make Customer Data available for export in machine-readable format for a period of thirty (30) days, after which Supplier shall securely delete all Customer Data in accordance with its data retention policy.

8. Intellectual Property

8.1 Supplier retains all right, title, and interest in and to the Service, including all software, algorithms, interfaces, user experience elements, Documentation, and all intellectual property rights subsisting therein. No rights in the Service are transferred to Customer under this Agreement other than the limited access licence in Clause 2.

8.2 Customer retains all right, title, and interest in and to Customer Data. Supplier shall not use Customer Data for any purpose other than providing the Service, including not using Customer Data to train any machine learning model or to develop competing products or features, without Customer's prior written consent.

8.3 If Customer provides feedback, suggestions, or ideas relating to the Service ("Feedback"), Customer grants Supplier a perpetual, irrevocable, royalty-free, worldwide licence to use, incorporate, and commercialise such Feedback without restriction or attribution. Feedback is provided without warranty or obligation.

9. Confidentiality

9.1 Each party shall protect the other's Confidential Information using at least the same degree of care it uses for its own confidential information of similar sensitivity, but not less than reasonable care, and shall not disclose it to any third party without the other party's prior written consent.

9.2 Each party shall use the other's Confidential Information only for the purposes of performing or receiving the Service under this Agreement.

9.3 The obligations in this Clause 9 do not apply to information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was already known to the Receiving Party without restriction; (c) is independently developed without use of the Confidential Information; or (d) is required to be disclosed by law or regulation, subject to prompt notice to the Disclosing Party where permitted.

9.4 The obligations of confidentiality shall survive termination or expiry of this Agreement for a period of three (3) years.

10. Warranties

10.1 Supplier warrants that: (a) it has the right to grant the licence in Clause 2; (b) the Service will perform materially in accordance with the Documentation during the Subscription Term; and (c) it will provide the Service using reasonable skill and care.

10.2 Customer warrants that: (a) it has the authority to enter into this Agreement; and (b) its use of the Service and all Customer Data will comply with applicable laws.

10.3 Except as expressly set out in this Agreement, the Service is provided on an "as is" basis. Supplier disclaims all implied warranties including implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the fullest extent permitted by law.

11. Limitation of Liability

11.1 Subject to Clause 11.3, Supplier's aggregate liability to Customer under or in connection with this Agreement shall not exceed the total Subscription Fees paid by Customer in the twelve (12) months immediately preceding the event giving rise to the claim.

11.2 Neither party shall be liable to the other for indirect, consequential, special, incidental, or punitive loss or damage, or for loss of profits, revenue, data, business, opportunity, goodwill, or anticipated savings, whether in contract, tort (including negligence), or otherwise, even if advised of the possibility of such loss or damage.

11.3 Nothing in this Agreement excludes or limits liability for: (a) death or personal injury caused by negligence; (b) fraud or fraudulent misrepresentation; (c) any liability that cannot lawfully be excluded or limited; or (d) Customer's obligation to pay Subscription Fees properly due.

12. Indemnity

12.1 Supplier shall indemnify, defend, and hold harmless Customer from and against any third-party claims, losses, damages, and costs (including reasonable legal fees) arising from any allegation that the Service, as used by Customer in accordance with this Agreement, infringes any third-party intellectual property right enforceable in England and Wales.

12.2 Supplier's obligations under Clause 12.1 shall not apply where the alleged infringement arises from: (a) Customer Data; (b) modification of the Service by Customer or a third party; (c) use of the Service in combination with other products or services not provided or approved by Supplier; or (d) Customer's failure to implement updates made available by Supplier to avoid the alleged infringement.

12.3 Customer shall indemnify, defend, and hold harmless Supplier from and against any third-party claims arising from Customer Data or Customer's use of the Service in breach of this Agreement.

13. Suspension

13.1 Supplier may suspend Customer's access to the Service on written notice if: (a) Customer fails to pay undisputed Subscription Fees within fifteen (15) days of a written payment reminder; (b) Customer materially breaches Clause 4 (Acceptable Use); or (c) suspension is required to protect the security or integrity of the Service or third-party data.

13.2 Supplier shall restore access promptly once the circumstances giving rise to suspension have been remedied.

14. Term, Renewal, and Termination

14.1 This Agreement commences on the Commencement Date and continues for the initial Subscription Term specified in the first Order Form.

14.2 Unless either party gives the other written notice of non-renewal at least sixty (60) days before the end of the then-current Subscription Term, this Agreement and all active Order Forms shall automatically renew for successive periods equal to the initial Subscription Term.

14.3 Either party may terminate this Agreement or an affected Order Form for material breach if the breaching party fails to remedy the breach within thirty (30) days after receiving written notice specifying the breach in reasonable detail.

14.4 If the Service fails to achieve the Service Level in three (3) consecutive calendar months, Customer may terminate this Agreement on thirty (30) days' written notice without liability for any early termination fee.

14.5 Either party may terminate this Agreement immediately on written notice if the other party becomes insolvent, makes a general assignment for the benefit of creditors, or is subject to any insolvency or administration proceedings.

14.6 Supplier may terminate this Agreement on ninety (90) days' written notice if it discontinues the Service generally, in which case Supplier shall provide a pro-rated refund of any prepaid Subscription Fees for the period following termination.

15. Consequences of Termination

15.1 On termination or expiry of this Agreement: (a) the licence granted in Clause 2 terminates immediately; (b) Customer shall cease all use of the Service; (c) all outstanding Subscription Fees become immediately payable; and (d) each party shall comply with its obligations regarding Customer Data and Confidential Information under Clauses 7.5 and 9.

15.2 Clauses 1, 7, 8, 9, 11, 15, and 16 shall survive termination or expiry of this Agreement.

16. Governing Law and Dispute Resolution

16.1 This Agreement and any non-contractual obligations arising out of or in connection with it shall be governed by the laws of England and Wales.

16.2 The parties shall first attempt to resolve any dispute by good faith negotiations between their respective senior representatives for a period of twenty (20) Business Days following written notice of the dispute.

16.3 If a dispute is not resolved under Clause 16.2, either party may refer it to the exclusive jurisdiction of the courts of England and Wales.

17. General

17.1 This Agreement, together with all Order Forms and Schedules, constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior agreements and understandings.

17.2 In the event of conflict between these terms and an Order Form, the Order Form shall prevail to the extent of the inconsistency, unless the Order Form expressly states otherwise.

17.3 Supplier may update these terms from time to time on not less than sixty (60) days' written notice. If Customer objects to any update, it may terminate this Agreement on thirty (30) days' written notice before the update takes effect.

17.4 Neither party may assign this Agreement without the other's prior written consent, except that either party may assign to an Affiliate or in connection with a merger or acquisition, provided the assignee is not a direct competitor of the non-assigning party and agrees in writing to be bound by this Agreement.

17.5 No waiver of any breach of this Agreement shall constitute a waiver of any subsequent breach.

17.6 If any provision of this Agreement is found invalid or unenforceable, the remaining provisions shall continue in full force and the parties shall negotiate a valid replacement in good faith.

17.7 This Agreement may be executed in counterparts. Electronic signatures shall be valid.

SCHEDULE 1 — SERVICE CREDITS

| Monthly Uptime | Service Credit |
|---|---|
| Below [UPTIME TARGET]% but above 99.0% | 5% of monthly Subscription Fee |
| Below 99.0% but above 95.0% | 15% of monthly Subscription Fee |
| Below 95.0% | 30% of monthly Subscription Fee |

Service Credits are calculated based on the monthly Subscription Fee for the affected Service tier and applied against the next invoice.

SCHEDULE 2 — DATA PROCESSING ADDENDUM

[To be inserted — parties to agree data processing terms in accordance with applicable data protection law including UK GDPR and the Data Protection Act 2018]`;

const SAMPLE_CONTRACTS = {
  msa:  { text: SAMPLE_TEXT_MSA,  fileName: 'Sample_MSA.txt',  label: 'Sample MSA — IT Services (UK/India)' },
  nda:  { text: SAMPLE_TEXT_NDA,  fileName: 'Sample_NDA.txt',  label: 'Sample NDA — Mutual (England & Wales)' },
  saas: { text: SAMPLE_TEXT_SAAS, fileName: 'Sample_SaaS.txt', label: 'Sample SaaS Agreement (England & Wales)' },
  tour: { text: `TWO-CLAUSE CONTRACT CHECK TOUR\n\n1. Definitions\n1.1 "Business Day" means a day other than Saturday, Sunday or a public holiday in London.\n1.2 "Services" means the implementation services described in Schedule 1.\n\n2. Delivery\n2.1 Supplier shall deliver the Services within five Business Days after the Effective Date.\n2.2 The acceptance test shall be completed under Clause 4.2.\n2.3 The implementation fee is [INSERT AMOUNT].`, fileName: 'Two-Clause_Check_Tour.txt', label: 'Two-clause guided example' }
};

const CONTRACT_ARCHETYPES = {
Custom:{expectedClauses:['Limitation of liability','Termination','Governing law']},
'Services Agreement':{expectedClauses:['Services','Fees','Acceptance','Change Control','Liability','Indemnity','Termination','Confidentiality','Intellectual Property','Data Protection','Assignment','Governing Law']},
MSA:{expectedClauses:['Liability','Indemnity','Termination','Confidentiality','Intellectual Property','Data Protection','Fees','Assignment','Governing Law','Force Majeure','Change Control','Compliance']},
'SaaS Agreement':{expectedClauses:['Liability','Indemnity','Termination','Confidentiality','Intellectual Property','Data Protection','Fees','Service Levels','Assignment','Governing Law','Force Majeure','Change Control','Compliance']},
NDA:{expectedClauses:['Confidentiality','Termination','Governing Law']},
DPA:{expectedClauses:['Data Protection','Confidentiality','Audit','Governing Law']},
SOW:{expectedClauses:['Services','Fees','Termination','Liability']},
Employment:{expectedClauses:['Confidentiality','Intellectual Property','Termination','Governing Law']},
'IT/ITES Outsourcing':{expectedClauses:['Services','Service Levels','Liability','Indemnity','Termination','Confidentiality','Data Protection','Fees','Assignment','Governing Law','Force Majeure','Change Control','Compliance']},
'Staff Augmentation':{expectedClauses:['Services','Fees','Liability','Indemnity','Termination','Confidentiality','Intellectual Property','Assignment','Governing Law','Compliance']},
'Technology License':{expectedClauses:['Intellectual Property','Fees','Liability','Confidentiality','Termination','Governing Law']},
'Lease':{expectedClauses:['Services','Fees','Termination','Liability','Governing Law','Assignment']},
'DPDP DPA':{expectedClauses:['Data Protection','Confidentiality','Audit','Governing Law','Termination']}
};

const DEFAULT_LIBRARY_ENTRIES = [
  {id:'default-lib-liability-cap',title:'Liability cap tied to fees',type:'Liability',tags:['MSA','SaaS'],text:'Supplier\'s aggregate liability under this Agreement shall not exceed the fees paid or payable in the twelve months preceding the event giving rise to the claim. Neither party shall be liable for indirect, consequential, special, incidental, or punitive damages.',standardPosition:'Tie aggregate liability to fees paid or payable over 12 months and exclude indirect / consequential losses.',fallbackPosition:'If a broader cap is resisted, accept a super-cap only for clearly defined data protection or IP infringement liabilities.',negotiatingPoints:'Cap should remain proportionate to contract value and exposure. Avoid open-ended carve-outs.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-conf-purpose',title:'Confidentiality use restriction',type:'Confidentiality',tags:['MSA','NDA'],text:'Each party shall use the other party\'s Confidential Information solely for the permitted purpose under this Agreement and shall return or securely destroy such Confidential Information upon request or termination, subject to standard archival backups.',standardPosition:'Restrict use to the permitted purpose and include return / destroy mechanics.',fallbackPosition:'Allow limited archival retention for legal, audit, and backup purposes subject to confidentiality obligations.',negotiatingPoints:'Purpose limitation and deletion obligations materially affect practical confidentiality protection.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-dpa-breach',title:'Data breach timing and sub-processors',type:'Data Protection',tags:['MSA','DPA','SaaS'],text:'Processor shall notify Controller without undue delay and, where feasible, within seventy-two (72) hours of becoming aware of a Personal Data Breach. Processor may engage sub-processors subject to equivalent written obligations and remains responsible for their acts and omissions.',standardPosition:'Set a reasonable breach notification timing and require equivalent sub-processor obligations.',fallbackPosition:'Accept shorter notification timing only where limited to confirmed breaches with available information.',negotiatingPoints:'Avoid impossible immediate notice obligations and preserve workable sub-processor use.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-termination-cure',title:'Termination with cure period',type:'Termination',tags:['MSA','SOW'],text:'Either party may terminate this Agreement for material breach if the breach remains uncured for thirty (30) days after written notice. Termination for convenience, if included, shall be subject to reasonable wind-down and payment of undisputed accrued fees.',standardPosition:'Require a cure period and avoid immediate termination for remediable breach.',fallbackPosition:'If convenience termination is accepted, secure wind-down rights and cost recovery.',negotiatingPoints:'Termination triggers should be objective and operationally manageable.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-fees-dispute',title:'Fees and disputed invoice process',type:'Fees',tags:['MSA','SOW','SaaS'],text:'Client shall pay undisputed invoices within thirty (30) days of receipt. If Client disputes an invoice in good faith, Client shall timely notify Supplier of the disputed amount and basis, and shall pay all undisputed amounts when due.',standardPosition:'Separate disputed and undisputed amounts and preserve payment timing.',fallbackPosition:'Allow a modest longer payment cycle if disputes are tightly scoped and do not suspend all payment.',negotiatingPoints:'Dispute mechanics should not become a broad payment holdback right.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-services-dependencies',title:'Client dependencies and change control',type:'Services',tags:['MSA','SOW','Outsourcing'],text:'Supplier\'s performance is subject to Client providing timely access, information, decisions, and dependencies identified in the applicable Statement of Work. Changes to scope, assumptions, timelines, or dependencies shall be handled through a written change control process.',standardPosition:'Allocate client dependencies expressly and link changes to change control.',fallbackPosition:'If no formal change control is accepted, at least preserve timeline/cost adjustments for dependency failures.',negotiatingPoints:'Open-ended scope without assumptions or change control creates unmanaged delivery risk.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-ip-background',title:'Background IP reservation',type:'Intellectual Property',tags:['MSA','SaaS','License'],text:'Each party retains ownership of its pre-existing materials, know-how, tools, templates, and intellectual property. To the extent Supplier materials are embedded in deliverables, Supplier grants Client a non-exclusive license to use them solely as necessary to enjoy the deliverables and services.',standardPosition:'Reserve background IP and narrow any operational license.',fallbackPosition:'Allow use rights limited to internal business purposes tied to paid deliverables.',negotiatingPoints:'Avoid unintended transfer of pre-existing IP through broad ownership language.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'},
  {id:'default-lib-governing-law-neutral',title:'Governing law and forum',type:'Governing Law',tags:['MSA','NDA'],text:'This Agreement shall be governed by the laws of the agreed jurisdiction, excluding conflict-of-laws rules. The parties submit disputes to the courts or arbitral seat expressly identified in this Agreement.',standardPosition:'Keep governing law and forum clear, singular, and coordinated with dispute resolution wording.',fallbackPosition:'If a foreign law is required, ensure operational guidance and compliance scope are workable.',negotiatingPoints:'Avoid fragmented governing law / jurisdiction / arbitration language.',createdAt:new Date(0).toISOString(),updatedAt:new Date(0).toISOString(),sourceDocument:'Default playbook'}
];

const DEFAULT_STOP_LISTS = {definedTerms:['Agreement','Section','Clause','Schedule','Party'],undefinedTerms:['Agreement','Section','Clause','Schedule','Party','Parties','England','Wales','India','United States','State','County','City','North','South','East','West']};
const SIMILARITY_STOPWORDS = new Set(['agreement','agreements','party','parties','clause','clauses','section','sections','schedule','schedules','the','a','an','and','or','of','to','in','this','that','for','with','by','on','at','from','under','shall','will','may','must']);
const CLAUSE_TYPE_KEYWORDS = {
'Liability':['liability','cap','aggregate','indirect','consequential','preceding','claim','limitation'],
'Confidentiality':['confidential','disclose','disclosure','confidential information','recipient','non-disclosure'],
'Data Protection':['personal data','privacy','processor','controller','breach','transfer','security incident','processing'],
'Fees':['fee','fees','invoice','payment','charges','taxes','pricing'],
'Termination':['termination','terminate','notice','expiry','survive','without cause','for convenience'],
'Intellectual Property':['intellectual','property','license','ownership','work product','copyright','patent','background ip'],
'Service Levels':['service level','service credit','uptime','availability','sla','response time'],
'Services':['services','scope','deliverables','milestone','support','statement of work'],
'Audit':['audit','inspection','records','review'],
'Dispute Resolution':['arbitration','tribunal','seat','jurisdiction','courts','venue'],
'Governing Law':['governed by','choice of law','applicable law'],
'Indemnity':['indemnify','indemnification','hold harmless','defend']
};
const CLAUSE_CLASSIFIERS = [
  {type:'Indemnity', weight:10, positive:[/\bindemnif(?:y|ication|ies)?\b/i,/\bhold harmless\b/i,/\bdefend,? indemnify\b/i,/\bdefend against claims?\b/i]},
  {type:'Liability', weight:9, positive:[/^\s*liabilit(?:y|ies)\s*$/i,/\bliability shall not exceed\b/i,/\baggregate liability\b/i,/\blimitation of liability\b/i,/\bno liability (?:of any kind|whatsoever)\b/i,/\bshall have no liability\b/i,/\bconsequential (?:damages?|loss(?:es)?)\b/i,/\bindirect (?:damages?|loss(?:es)?)\b/i,/\b(?:indirect|incidental|special|consequential|punitive)(?:(?:\s*,\s*|\s+or\s+)(?:indirect|incidental|special|consequential|punitive)){1,4}\s+(?:damages?|loss(?:es)?)\b/i,/\bcap (?:on|to) (?:the )?liability\b/i,/\bexcludes?\s+or\s+limits?\s+(?:its|their|his|her)\s+liability\b/i,/\bin no event shall\b[^.\n]{0,80}\bliable\b/i,/\b(?:shall|will)\s+(?:not\s+)?be\s+liable\s+(?:for|to)\b/i]},
  {type:'Service Levels', weight:9, positive:[/\bservice levels?\b/i,/\bservice credits?\b/i,/\buptime\b/i,/\bmonthly availability\b/i,/\bresponse time\b/i,/\bresolution time\b/i,/\bperformance metrics?\b/i,/\bchronic failure\b/i]},
  {type:'Acceptance', weight:8, positive:[/\bacceptance criteria\b/i,/\bdeemed acceptance\b/i,/\bacceptance test(?:ing)?\b/i,/\baccept(?:ed|ance) of (?:the )?deliverables?\b/i,/\breject(?:ion|ed)? of (?:the )?deliverables?\b/i]},
  {type:'Termination', weight:8, positive:[/\bterminate(?:d|s|ion)?\b/i,/\btermination for convenience\b/i,/\bwithout cause\b/i,/\bmaterial breach\b/i,/\bcure period\b/i]},
  {type:'Governing Law', weight:8, positive:[/\bgoverned by(?: and construed in accordance with)? the laws of\b/i,/\bgoverning law\b/i,/\blaws governing this agreement\b/i]},
  {type:'Dispute Resolution', weight:7, positive:[/\barbitration\b/i,/\btribunal\b/i,/\barbitral\b/i,/\bseat of arbitration\b/i,/\bdispute resolution\b/i]},
  {type:'Warranty', weight:7, positive:[/\bwarrant(?:y|ies|ed)?\b/i,/\bdisclaim(?:er|ed|s)? all warranties\b/i,/\bas is\b/i,/\bmerchantability\b/i,/\bfitness for a particular purpose\b/i]},
  {type:'Confidentiality', weight:7, positive:[/\bconfidential information\b/i,/\bconfidentiality\b/i,/\bnon-?disclosure\b/i,/\breceiving party\b/i,/\bdisclosing party\b/i]},
  {type:'Data Protection', weight:7, positive:[/\bpersonal data\b/i,/\bdata protection\b/i,/\bprivacy\b/i,/\bprocessor\b/i,/\bcontroller\b/i,/\bsecurity incident\b/i,/\bpersonal data breach\b/i]},
  {type:'Intellectual Property', weight:7, positive:[/\bintellectual property\b/i,/\bwork product\b/i,/\bbackground ip\b/i,/\blicense back\b/i,/\bownership of deliverables\b/i,/\bretain(?:s)? ownership\b/i]},
  {type:'Assignment', weight:6, positive:[/\bassign(?:ment|ed)?\b/i,/\bchange of control\b/i,/\btransfer this agreement\b/i]},
  {type:'Audit', weight:6, positive:[/\baudit rights?\b/i,/\binspect(?:ion)?\b/i,/\baccess to records\b/i,/\bbooks and records\b/i]},
  {type:'Fees', weight:6, positive:[/\bfees?\b/i,/\binvoice\b/i,/\bpayment terms?\b/i,/\bcharges\b/i,/\bpricing\b/i]},
  {type:'Services', weight:5, positive:[/\bservices\b/i,/\bscope of work\b/i,/\bstatement of work\b/i,/\bdeliverables\b/i,/\bmilestones?\b/i]},
  {type:'Insurance', weight:5, positive:[/\binsurance\b/i,/\binsured\b/i]},
  {type:'Compliance', weight:5, positive:[/\bcompliance with laws\b/i,/\banti-?bribery\b/i,/\banti-?corruption\b/i,/\bsanctions\b/i]},
  {type:'Change Control', weight:5, positive:[/\bchange control\b/i,/\bchange request\b/i,/\bvariation\b/i]},
  {type:'Force Majeure', weight:5, positive:[/\bforce majeure\b/i,/\bacts? of god\b/i]}
];
const ISSUE_TAG_OPTIONS = ['Risk','Query','Follow-Up','Drafting Issue','Commercial Issue'];
const ROUTING_TAG_OPTIONS = ['Legal Only','Needs Business Input','Needs Privacy Review','Needs Finance Input','Escalate to Leadership'];
const NEGOTIATION_POSITION_OPTIONS = ['','Acceptable','Accept with changes','Seek amendment','Reject','Escalate','Need input'];
const REVIEW_STATUS_OPTIONS = ['','Not reviewed','In review','Reviewed','Escalated'];
const NEGOTIATION_STATUS_OPTIONS = ['','Open','In negotiation','Agreed','Parked','Rejected'];
const REVIEW_STATUS_ICONS = {'Reviewed':'✓','In review':'◑','Escalated':'⚡','Not reviewed':''};
const POSITION_COLORS = {'Acceptable':'var(--risk-low)','Accept with changes':'var(--risk-info)','Seek amendment':'var(--risk-med)','Reject':'var(--risk-high)','Escalate':'var(--risk-high)','Need input':'var(--risk-info)'};

/* -- State -- */
const state = {
documentMeta:{fileName:'',loadedAt:'',sourceType:'',warnings:[],matter:{}},
rawText:'',
sourceBlocks:[],
clauses:[],
definedTerms:{},
possibleDefinedTerms:[],
tableDefinitions:[],
definitionGraph:{nodes:[],edges:[],issues:[]},
referenceLedger:[],
reviewItems:[],
issues:{duplicateDefinitions:[],definitionQuality:[],undefinedCapitalizedTerms:[],unusedDefinitions:[],crossReferenceBreaks:[],semanticCrossReferenceWarnings:[],consistency:[],missingStandardClauses:[],unresolvedCrossReferencedDefinitions:[],survivalClauses:[],commercialDeviations:[],openObligations:[],crossClauseChecks:[],subjectiveStandards:[],asymmetries:[]},
detectorHealth:{},
placeholders:[],
obligations:[],
obligationVerification:{},
deadlines:[],
executionCheck:{items:[],status:'not-run'},
dealTermsBaseline:{fee:'',paymentDays:'',termLength:'',noticePeriod:'',liabilityCap:'',startDate:''},
analyzing:false,
notes:[],
clauseTags:{},
clauseRoutingTags:{},
clauseCounterpartyPositions:{},
clausePositions:{},
clauseReviewStatus:{},
clauseRiskScores:{},
reviewPriorityScores:{},
clauseRiskCategories:{},
clauseRiskNarratives:{},
clauseBoilerplateScores:{},
clauseRedlineCache:{},
clauseRedlineMode:{},
clauseTermHits:{}, /* v6.0: pre-computed term highlights */
reviewLog:[],
documentRisk:'Low',
documentReviewPriority:'Low',
contractType:'Custom',
expectedClauseCoverage:{expected:[],missing:[],present:[],weak:[]},
legalConceptEvidence:{byConcept:{},all:[],present:{}},
legalPropositions:[],
sourceAssurance:{status:'unconfirmed',mode:'',statement:'',confirmedAt:'',supplementClauseId:''},
ignoredTerms:[],
ignoredUndefinedTerms:[],
customStopLists:{...DEFAULT_STOP_LISTS},
clauseLibrary:[],
playbookPackages:[],
activePlaybookProfile:{packageId:'',version:'',role:'',activatedAt:''},
clausePlaybookState:{},
playbookExpandedClauseIds:{},
librarySearchQuery:'',
libraryTypeFilter:'',
clauseRecommendations:{},
clauseFallbacks:{},
clauseFallbackLadders:{},
clauseNegotiationStatus:{},
clauseApprovalStatus:{},
clauseIssueStages:{},
clauseCounterpartyNextSteps:{},
clauseCounterpartyLastDiscussed:{},
draftingOpenClauseIds:{},
clauseCompareMode:{},
positionHistory:{},
collapsedBodies:{},
selectedClauseId:null,
searchQuery:'',
filters:{content:'all',review:'all'},
activeTab:'summary', /* v6.0: default to summary */
activeToolsTab:'map',
activeTermFilter:'',
executionMode:false,
executedAt:'',
clauseTimeSpent:{},
clauseOpenedAt:null,
noteFormOpen:false,
noteDraft:null,
sessionRestored:false,
snapshotNotice:'',
notesView:'clause',
termsView:'all',
refsView:'all',
loadingMessage:'',
resolvedPlaceholderIds:[],
ignoredPlaceholderIds:[],
reviewabilityOverrides:{},
clauseAudienceSharing:{},
verificationByKey:{},
focusMode:false,
navigatorBeforeFocus:'outline',
startIntent:'checks',
preferredStartCheck:'review-items',
activeCheck:'',
returnToCheckArmed:false,
activeConcept:'',
checkFilter:'all',
checkCompletion:{},
findingReview:{},
navigatorMode:'outline',
theme:'light',
negotiationContextOpen:{},
dismissedDraftingNudges:{},
prefs:{xrefGlowMs:2200,disableAutosave:false,autoAdvanceDecisions:true,developerMode:false,optionalFeatures:{counterpartyLens:false,positionDrift:false,documentLineage:false,riskHeatmap:false,microAgenda:false}},
mobileView:'decide',
snapshotItems:[],
autosaveFailed:false,
autosaveLastSavedAt:'',
pendingRestoreSession:null,
sidePeekClauseId:null, /* v6.0: side-peek */
reviewSubSection:'issues', /* v6.0: which sub-section in Review tab */
strategySubSection:'packages', /* v6.30: packages / positions / tracker / library */
strategyFilterPreset:'all',
strategyThemeFocus:'',
strategyPackageFilter:'all',
summaryOpenLoopFilter:'all',
workflowMode:'review',
pendingClauseViewRender:false,
intelligenceCache:{},
bookmarkedClauseIds:[],
navHistory:[],
navHistoryIndex:-1,
navForwardHistory:[],
contrastMode:false,
contrastExpandedClauseIds:{},
snoozedClauseIds:[],
clauseBriefs:{},
clauseBriefOpenIds:{},
negotiationRounds:{},
agendaItems:[],
diagnostics:{lastAction:'',lastError:'',lastRender:'',lastRestoreSource:'',renderCounts:{navigator:0,clause:0,rightPanel:0,summary:0,tracker:0,cockpit:0},recentActions:[],recentRenders:[],recentErrors:[]},
issueStatus:{},
issueConsole:{items:[],filters:{risk:'all',status:'all',route:'all',query:''},sortBy:'risk',viewMode:'list'},
savedWorkspaces:[],
currentRound:1,
sessionReturn:{},
peekCard:{open:false,type:'',targetId:'',term:''},
selectedSnapshotCompareId:'',
selectedRoundCompareKey:'',
compareOnlyMode:false,
definitionPassDoneAt:'',
pendingRestoreMeta:null,
hudDismissed:false,
decisionByClause:{},
openLoops:[],
readiness:{status:'blocked',blockers:[],decidedCount:0,totalCount:0,approvalRequestReady:false,finalSignoffReady:false},
workflowStage:'decide',
cockpitCollapsed:true,
queuePreset:'needs-decision',
prepareGroupMode:'priority',
autosavePending:false,
mobileDecisionCollapsed:true,
__primaryAnnunciator:null
};
const pendingDecisionAutoAdvance=new Set();
const NAV_HISTORY_SIZE = 20;
const CLAUSE_TYPE_DEFAULT_ROUTING = {'Data Protection':'Privacy','Privacy':'Privacy','Security':'Privacy','Fees':'Finance','Payment':'Finance','Pricing':'Finance','Financial':'Finance','Insurance':'Finance','IP':'Legal','Intellectual Property':'Legal','Indemnity':'Leadership','Liability':'Leadership','Termination':'Business','Governing Law':'Legal','Dispute Resolution':'Legal','Warranty':'Legal','Assignment':'Legal','Audit':'Legal'};

/* -- Undo/Redo -- */
const undoStack = [];
const redoStack = [];

function deepCloneUndoValue(value){
  if(value==null || typeof value!=='object') return value;
  try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}
}
function recordUndoable(action, clauseId, opts) {
undoStack.push({action, clauseId, before:deepCloneUndoValue(opts.before), after:deepCloneUndoValue(opts.after), reverter:opts.reverter, at:Date.now()});
if (undoStack.length > MAX_UNDO) undoStack.shift();
redoStack.length = 0;
}
function undo() {
const entry = undoStack.pop();
if (!entry) return;
entry.reverter(deepCloneUndoValue(entry.before));
if(entry.clauseId) refreshDerivedClauseState(entry.clauseId);
redoStack.push(entry);
onSubstantiveChange({rerenderClause:true});
showToast(`Undone: ${entry.action}`,'info');
}
function redo() {
const entry = redoStack.pop();
if (!entry) return;
entry.reverter(deepCloneUndoValue(entry.after));
if(entry.clauseId) refreshDerivedClauseState(entry.clauseId);
undoStack.push(entry);
onSubstantiveChange({rerenderClause:true});
showToast(`Redone: ${entry.action}`,'info');
}

/* -- DOM References -- */
const els = {
landing:document.getElementById('landing'),
app:document.getElementById('app'),
fileInput:document.getElementById('fileInput'),
rawText:document.getElementById('rawText'),
analyzePastedBtn:document.getElementById('analyzePastedBtn'),
loadSampleBtn:document.getElementById('loadSampleBtn'),
sampleSelect:document.getElementById('sampleSelect'),
showLandingBtn:document.getElementById('showLandingBtn'),
hubBtn:document.getElementById('hubBtn'),
matterBtn:document.getElementById('matterBtn'),
readingModeBtn:document.getElementById('readingModeBtn'),
printViewBtn:document.getElementById('printViewBtn'),
checksWorkspace:document.getElementById('checksWorkspace'),
resolveWorkspace:document.getElementById('resolveWorkspace'),
hubToggleFocusBtn:document.getElementById('hubToggleFocusBtn'),
hubOpenShortcutsBtn:document.getElementById('hubOpenShortcutsBtn'),
hubOpenCommandPaletteBtn:document.getElementById('hubOpenCommandPaletteBtn'),
themeToggleBtn:document.getElementById('themeToggleBtn'),
workspace:document.querySelector('.workspace'),
clauseList:document.getElementById('clauseList'),
clauseView:document.getElementById('clauseView'),
emptyState:document.getElementById('emptyState'),
docName:document.getElementById('docName'),
docMeta:document.getElementById('docMeta'),
searchInput:document.getElementById('searchInput'),
exportHubModal:document.getElementById('exportHubModal'),
exportHubTitle:document.getElementById('exportHubTitle'),
closeExportHubBtn:document.getElementById('closeExportHubBtn'),
sourceCorrectionModal:document.getElementById('sourceCorrectionModal'),
sourceCorrectionTitle:document.getElementById('sourceCorrectionTitle'),
sourceCorrectionDescription:document.getElementById('sourceCorrectionDescription'),
sourceCorrectionCandidates:document.getElementById('sourceCorrectionCandidates'),
sourceSplitMarkerLabel:document.getElementById('sourceSplitMarkerLabel'),
sourceSplitMarkerInput:document.getElementById('sourceSplitMarkerInput'),
sourceCorrectionPreview:document.getElementById('sourceCorrectionPreview'),
closeSourceCorrectionBtn:document.getElementById('closeSourceCorrectionBtn'),
cancelSourceCorrectionBtn:document.getElementById('cancelSourceCorrectionBtn'),
confirmSourceCorrectionBtn:document.getElementById('confirmSourceCorrectionBtn'),
sourceAssuranceModal:document.getElementById('sourceAssuranceModal'),
sourceAssuranceWarnings:document.getElementById('sourceAssuranceWarnings'),
sourceSupplementText:document.getElementById('sourceSupplementText'),
sourceNoMaterialOmissionCheckbox:document.getElementById('sourceNoMaterialOmissionCheckbox'),
closeSourceAssuranceBtn:document.getElementById('closeSourceAssuranceBtn'),
cancelSourceAssuranceBtn:document.getElementById('cancelSourceAssuranceBtn'),
confirmSourceAssuranceBtn:document.getElementById('confirmSourceAssuranceBtn'),
exportHubPresetSelect:document.getElementById('exportHubPresetSelect'),
playbookGuidanceModal:document.getElementById('playbookGuidanceModal'),
playbookGuidanceBody:document.getElementById('playbookGuidanceBody'),
closePlaybookGuidanceBtn:document.getElementById('closePlaybookGuidanceBtn'),
playbookDecisionPreviewModal:document.getElementById('playbookDecisionPreviewModal'),
playbookDecisionPreviewBody:document.getElementById('playbookDecisionPreviewBody'),
closePlaybookDecisionPreviewBtn:document.getElementById('closePlaybookDecisionPreviewBtn'),
cancelPlaybookDecisionPreviewBtn:document.getElementById('cancelPlaybookDecisionPreviewBtn'),
applyPlaybookDecisionPreviewBtn:document.getElementById('applyPlaybookDecisionPreviewBtn'),
hubExportReportBtn:document.getElementById('hubExportReportBtn'),
hubExportEmailBtn:document.getElementById('hubExportEmailBtn'),
hubExportStateBtn:document.getElementById('hubExportStateBtn'),
hubExportBundleBtn:document.getElementById('hubExportBundleBtn'),
hubExportWorkingNotesBtn:document.getElementById('hubExportWorkingNotesBtn'),
hubExportAgendaBtn:document.getElementById('hubExportAgendaBtn'),
hubExportPackBtn:document.getElementById('hubExportPackBtn'),
hubExportChangesBtn:document.getElementById('hubExportChangesBtn'),
approvalPackBtn:document.getElementById('hubExportApprovalBtn'),
hubExportIssuesBtn:document.getElementById('hubExportIssuesBtn'),
hubExportLeadershipIssuesBtn:document.getElementById('hubExportLeadershipIssuesBtn'),
hubSnapshotsBtn:document.getElementById('hubSnapshotsBtn'),
hubSaveSnapshotBtn:document.getElementById('hubSaveSnapshotBtn'),
snapshotModal:document.getElementById('snapshotModal'),
snapshotList:document.getElementById('snapshotList'),
closeSnapshotsBtn:document.getElementById('closeSnapshotsBtn'),
restoreBanner:document.getElementById('restoreBanner'),
restoreText:document.getElementById('restoreText'),
loadingOverlay:document.getElementById('loadingOverlay'),
loadingText:document.getElementById('loadingText'),
restoreSessionBtn:document.getElementById('restoreSessionBtn'),
startFreshBtn:document.getElementById('startFreshBtn'),
toolsStrip:document.getElementById('toolsStrip'),
toolsPanel:document.getElementById('toolsPanel'),
toolTabs:document.getElementById('toolTabs'),
/* v6.0: 4 consolidated panels */
summaryPanel:document.getElementById('tab-summary'),
reviewPanel:document.getElementById('tab-review'),
notesPanel:document.getElementById('tab-notes'),
strategyPanel:document.getElementById('tab-strategy'),
contractTypeSelect:document.getElementById('contractTypeSelect'),
libraryModal:document.getElementById('libraryModal'),
closeLibraryModalBtn:document.getElementById('closeLibraryModalBtn'),
libraryForm:document.getElementById('libraryForm'),
libraryFormTitle:document.getElementById('libraryFormTitle'),
libraryEntryId:document.getElementById('libraryEntryId'),
libraryTitleInput:document.getElementById('libraryTitleInput'),
libraryTypeInput:document.getElementById('libraryTypeInput'),
libraryTagsInput:document.getElementById('libraryTagsInput'),
libraryNotesInput:document.getElementById('libraryNotesInput'),
libraryStandardPositionInput:document.getElementById('libraryStandardPositionInput'),
libraryFallbackPositionInput:document.getElementById('libraryFallbackPositionInput'),
libraryNegotiatingPointsInput:document.getElementById('libraryNegotiatingPointsInput'),
libraryTextInput:document.getElementById('libraryTextInput'),
cancelLibraryModalBtn:document.getElementById('cancelLibraryModalBtn'),
reviewProgressMount:document.getElementById('reviewProgressMount'),
outlineModeBtn:document.getElementById('outlineModeBtn'),
triageModeBtn:document.getElementById('triageModeBtn'),
libraryImportInput:document.getElementById('libraryImportInput'),
importPlaybookBtn:document.getElementById('importPlaybookBtn'),
playbookImportInput:document.getElementById('playbookImportInput'),
playbookImportStatus:document.getElementById('playbookImportStatus'),
playbookPackageSelect:document.getElementById('playbookPackageSelect'),
activatePlaybookBtn:document.getElementById('activatePlaybookBtn'),
shortcutsModal:document.getElementById('shortcutsModal'),
closeShortcutsBtn:document.getElementById('closeShortcutsBtn'),
mobileClauseDrawerBtn:document.getElementById('mobileClauseDrawerBtn'),
mobileToolsMenu:document.getElementById('mobileToolsMenu'),
mobileBackdrop:document.getElementById('mobileBackdrop'),
mobileBottomNav:document.getElementById('mobileBottomNav'),
mobileToolLauncher:document.getElementById('mobileToolLauncher'),
rightPanelResizeHandle:document.getElementById('rightPanelResizeHandle'),
onboardingOverlay:document.getElementById('onboardingOverlay'),
workflowModes:document.getElementById('workflowModes'),
workflowTriageBtn:document.getElementById('workflowTriageBtn'),
workflowReviewBtn:document.getElementById('workflowReviewBtn'),
workflowNegotiateBtn:document.getElementById('workflowNegotiateBtn'),
workflowOutputsBtn:document.getElementById('workflowOutputsBtn'),
cockpitStrip:document.getElementById('cockpitStrip'),
cockpitFileVal:document.getElementById('cockpitFileVal'),
cockpitFileSub:document.getElementById('cockpitFileSub'),
cockpitClauseVal:document.getElementById('cockpitClauseVal'),
cockpitClauseSub:document.getElementById('cockpitClauseSub'),
cockpitRiskVal:document.getElementById('cockpitRiskVal'),
cockpitRiskSub:document.getElementById('cockpitRiskSub'),
cockpitPriorityVal:document.getElementById('cockpitPriorityVal'),
cockpitPrioritySub:document.getElementById('cockpitPrioritySub'),
cockpitNegotiationVal:document.getElementById('cockpitNegotiationVal'),
cockpitNegotiationSub:document.getElementById('cockpitNegotiationSub'),
clauseScopeBar:document.getElementById('clauseScopeBar'),
minimapRail:document.getElementById('minimapRail'),
autosaveStatus:document.getElementById('autosaveStatus'),
hubDataControlsBtn:document.getElementById('hubDataControlsBtn'),
dataControlsModal:document.getElementById('dataControlsModal'),
closeDataControlsBtn:document.getElementById('closeDataControlsBtn'),
disableAutosaveToggle:document.getElementById('disableAutosaveToggle'),
autoAdvanceToggle:document.getElementById('autoAdvanceToggle'),
exportHubNotice:document.getElementById('exportHubNotice'),
clearAutosaveBtn:document.getElementById('clearAutosaveBtn'),
clearSnapshotsBtn:document.getElementById('clearSnapshotsBtn'),
clearLibraryBtn:document.getElementById('clearLibraryBtn'),
wipeAllDataBtn:document.getElementById('wipeAllDataBtn'),
intakeRoleSelect:document.getElementById('intakeRoleSelect'),
intakeCounterpartyInput:document.getElementById('intakeCounterpartyInput'),
intakeJurisdictionSelect:document.getElementById('intakeJurisdictionSelect'),
intakeRiskAppetiteSelect:document.getElementById('intakeRiskAppetiteSelect'),
commandPaletteModal:document.getElementById('commandPaletteModal'),
closeCommandPaletteBtn:document.getElementById('closeCommandPaletteBtn'),
commandPaletteInput:document.getElementById('commandPaletteInput'),
commandPaletteList:document.getElementById('commandPaletteList'),
hubPreviewNegotiationPackBtn:document.getElementById('hubPreviewNegotiationPackBtn'),
hubPreviewApprovalPackBtn:document.getElementById('hubPreviewApprovalPackBtn'),
hubExportWordHandoffBtn:document.getElementById('hubExportWordHandoffBtn'),
hubPreviewWordHandoffBtn:document.getElementById('hubPreviewWordHandoffBtn'),
hubExportEvidenceLedgerBtn:document.getElementById('hubExportEvidenceLedgerBtn'),
hubRecentMattersList:document.getElementById('hubRecentMattersList'),
hubDiagnosticsBtn:document.getElementById('hubDiagnosticsBtn'),
outputPreviewModal:document.getElementById('outputPreviewModal'),
outputPreviewTitle:document.getElementById('outputPreviewTitle'),
outputPreviewBody:document.getElementById('outputPreviewBody'),
closeOutputPreviewBtn:document.getElementById('closeOutputPreviewBtn'),
copyOutputPreviewBtn:document.getElementById('copyOutputPreviewBtn'),
downloadOutputPreviewBtn:document.getElementById('downloadOutputPreviewBtn'),
printOutputPreviewBtn:document.getElementById('printOutputPreviewBtn'),
diagnosticsModal:document.getElementById('diagnosticsModal'),
diagnosticsBody:document.getElementById('diagnosticsBody'),
closeDiagnosticsBtn:document.getElementById('closeDiagnosticsBtn'),
annunciatorPanel:document.getElementById('annunciatorPanel'),
uploadPrimaryCopy:document.getElementById('uploadPrimaryCopy'),
uploadSecondaryCopy:document.getElementById('uploadSecondaryCopy'),
snapshotSaveConfirmBtn:document.getElementById('snapshotSaveConfirmBtn'),
breadcrumbBar:document.getElementById('breadcrumbBar'),
peekCard:document.getElementById('peekCard'),
hubWorkspaceSelect:document.getElementById('hubWorkspaceSelect'),
hubSaveWorkspaceBtn:document.getElementById('hubSaveWorkspaceBtn'),
hubApplyWorkspaceBtn:document.getElementById('hubApplyWorkspaceBtn'),
hubDeleteWorkspaceBtn:document.getElementById('hubDeleteWorkspaceBtn'),
hubStartRoundBtn:document.getElementById('hubStartRoundBtn'),
toastLiveRegion:document.getElementById('toastLiveRegion')
};

const noteTemplate = document.getElementById('noteFormTemplate');
let autosaveTimer = null;
let autosaveDirtyGeneration = 0;
let autosavePersistedGeneration = 0;
let boilerplateScoresDirty = true;
let commandPaletteSelectedIndex = 0;
let rerenderFrame = null;
let dirtyRenderViews = {header:false,cockpit:false,navigator:false,clause:false,rightPanel:false,tools:false,restore:false};
const uiRefs = Object.freeze({
  panels:{navigator:els.clauseList, clause:els.clauseView, right:els.strategyPanel, summary:els.summaryPanel, review:els.reviewPanel, notes:els.notesPanel},
  modals:{exportHub:els.exportHubModal, snapshots:els.snapshotModal, diagnostics:els.diagnosticsModal, commandPalette:els.commandPaletteModal, dataControls:els.dataControlsModal},
  chrome:{header:document.querySelector('.app-header'), workflow:els.workflowModes, cockpit:els.cockpitStrip, annunciator:els.annunciatorPanel}
});
const RERENDER_VIEW_KEYS = ['header','cockpit','navigator','clause','rightPanel','tools','restore'];
let docxSupportState = null;
let docxSupportProbePromise = null;
let matterFieldDebounceTimer = null;
let librarySearchDebounceTimer = null;
let pendingPlaybookDecisionPreview = null;

/* -- Utility functions -- */
function escapeHtml(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function on(el,event,handler,opts){ if(!el) return; el.addEventListener(event,handler,opts); }
function clearLegacyAIStorage(){try{LEGACY_AI_STORAGE_KEYS.forEach(key=>localStorage.removeItem(key));}catch{}}
function updateLocalHeaderIndicator(){
  const indicator=document.getElementById('offlineIndicator');
  if(!indicator)return;
  indicator.innerHTML='<span class="offline-dot"></span>Local analysis';
  indicator.title='Contract analysis and saved work stay in this browser. The network is used only to load or update the app shell.';
}
function hasSeenHint(key) {
  try { return !!localStorage.getItem(key); } catch { return true; }
}
function markHintSeen(key) {
  try { localStorage.setItem(key, '1'); } catch {}
}
function showHint(anchorEl, text, key) {
  if (!anchorEl || hasSeenHint(key)) return;
  markHintSeen(key);
  const existing = document.getElementById('cockpit-hint-bubble');
  if (existing) existing.remove();
  const bubble = document.createElement('div');
  bubble.id = 'cockpit-hint-bubble';
  bubble.className = 'hint-bubble';
  bubble.innerHTML = `<div class="hint-text">${escapeHtml(text)}</div><button type="button" class="hint-dismiss">Got it</button>`;
  document.body.appendChild(bubble);
  const r = anchorEl.getBoundingClientRect();
  bubble.style.left = `${Math.min(r.left + window.scrollX, window.innerWidth - 260)}px`;
  bubble.style.top = `${r.bottom + window.scrollY + 8}px`;
  bubble.querySelector('.hint-dismiss').addEventListener('click', () => {
    markHintSeen(key);
    bubble.remove();
  });
  setTimeout(() => { if (document.getElementById('cockpit-hint-bubble') === bubble) bubble.remove(); }, 8000);
}
function getSelectedClause() {
  if (!state.selectedClauseId || state.selectedClauseId === OVERVIEW_ID) return null;
  return (state.clauses || []).find(c => c.id === state.selectedClauseId) || null;
}
function assertDomCritical(){
  const actualIds = new Set(Array.from(document.querySelectorAll('[id]')).map(el=>el.id));
  const criticalIds = ['landing','app','fileInput','rawText','clauseList','clauseView','toolTabs','tab-summary','tab-review','tab-notes','tab-strategy','exportHubModal','dataControlsModal','snapshotModal','commandPaletteModal'];
  const optionalIds = ['onboardingOverlay','workflowModes','cockpitStrip','annunciatorPanel','outputPreviewModal','diagnosticsModal'];
  const deprecatedIds = ['exportHubBtn','toggleFocusModeBtn','saveSnapshotBtn','showSnapshotsBtn','reportPresetSelect','shortcutsBtn'];
  const missingCritical = criticalIds.filter(id=>!actualIds.has(id));
  const missingOptional = optionalIds.filter(id=>!actualIds.has(id));
  const presentDeprecated = deprecatedIds.filter(id=>actualIds.has(id));
  if(missingOptional.length){
    console.warn('Optional DOM nodes missing:', missingOptional);
  }
  if(presentDeprecated.length){
    console.warn('Deprecated DOM ids still present:', presentDeprecated);
  }
  if(missingCritical.length){
    const msg = `Critical DOM mismatch: ${missingCritical.join(', ')}`;
    console.error(msg);
    state.diagnostics.lastError = msg;
    throw new Error(msg);
  }
}
function getFocusableElements(container){return Array.from(container?.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')||[]).filter(el=>!el.disabled&&el.getAttribute('aria-hidden')!=='true'&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden');}
function trapFocusWithin(modal){ if(!modal) return; const focusable=getFocusableElements(modal); if(!focusable.length) return; const first=focusable[0]; if(!modal.dataset.focusTrapBound){ modal.addEventListener('keydown',e=>{ if(e.key!=="Tab") return; const items=getFocusableElements(modal); if(!items.length) return; const f=items[0], l=items[items.length-1]; if(e.shiftKey && document.activeElement===f){ e.preventDefault(); l.focus(); } else if(!e.shiftKey&&document.activeElement===l){ e.preventDefault(); f.focus(); } }); modal.dataset.focusTrapBound='true'; } setTimeout(()=>first.focus(),0); }
const modalReturnFocus=new WeakMap();let modalOpenSequence=0;
function ensureModalSemantics(modal){
  if(!modal)return;
  modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  const card=modal.querySelector('.modal-card,.onboarding-card');
  const heading=card?.querySelector('.modal-head h2,.modal-head h3,.modal-head h4,h2,h3,h4');
  if(heading){if(!heading.id)heading.id=`${modal.id||'modal'}Title`;modal.setAttribute('aria-labelledby',heading.id);}
  if(card&&!card.hasAttribute('tabindex'))card.setAttribute('tabindex','-1');
}
function openModal(modal){if(!modal)return;ensureModalSemantics(modal);const active=document.activeElement;if(active&&active!==document.body)modalReturnFocus.set(modal,active);modal.dataset.openSequence=String(++modalOpenSequence);modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');trapFocusWithin(modal);}
function closeModal(modal,{restoreFocus=true}={}){if(!modal)return;if(modal.id==='compareOverlay'){const trigger=modalReturnFocus.get(modal);modal.remove();if(!document.querySelector('.modal-overlay:not(.hidden)'))document.body.classList.remove('modal-open');if(restoreFocus&&trigger?.isConnected)requestAnimationFrame(()=>trigger.focus());return;}modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');if(!document.querySelector('.modal-overlay:not(.hidden)'))document.body.classList.remove('modal-open');const trigger=modalReturnFocus.get(modal);modalReturnFocus.delete(modal);if(restoreFocus&&trigger?.isConnected)requestAnimationFrame(()=>trigger.focus());}
function getTopmostOpenModal(){return [...document.querySelectorAll('.modal-overlay:not(.hidden)')].sort((a,b)=>Number(b.dataset.openSequence||0)-Number(a.dataset.openSequence||0))[0]||null;}
function showConfirmDialog(message,options={}){
  return new Promise(resolve=>{
    const overlay=document.createElement('div');
    overlay.className='modal-overlay';
    overlay.innerHTML=`<div class="modal-card confirm-dialog-card"><div class="modal-head"><h2>${escapeHtml(options.title||'Confirm')}</h2></div><p class="confirm-dialog-message" style="white-space:pre-line">${escapeHtml(message)}</p><div class="card-actions"><button type="button" class="btn btn-ghost" data-confirm-cancel>${escapeHtml(options.cancelLabel||'Cancel')}</button><button type="button" class="btn btn-primary" data-confirm-ok>${escapeHtml(options.confirmLabel||'Confirm')}</button></div></div>`;
    document.body.appendChild(overlay);
    let settled=false;
    const onKeydown=e=>{ if(e.key==='Escape'){ e.stopPropagation(); finish(false); } };
    const finish=(result)=>{
      if(settled)return; settled=true;
      document.removeEventListener('keydown',onKeydown,true);
      closeModal(overlay); overlay.remove();
      resolve(result);
    };
    document.addEventListener('keydown',onKeydown,true);
    overlay.addEventListener('click',e=>{ if(e.target===overlay) finish(false); });
    overlay.querySelector('[data-confirm-cancel]').addEventListener('click',()=>finish(false));
    overlay.querySelector('[data-confirm-ok]').addEventListener('click',()=>finish(true));
    openModal(overlay);
  });
}
function closeTopmostModal(){const modal=getTopmostOpenModal();if(!modal)return false;if(modal.id==='onboardingOverlay')dismissOnboarding();else closeModal(modal);return true;}
function recomputeDerivedState(reason=''){ deriveIssuesFromState({persist:true}); if(reason) state.diagnostics.lastAction=`recompute:${reason}`; }
function syncIssueToClause(issue){ if(!issue) return; const cid=issue.clauseId; if(issue.position!==undefined) setClausePosition(cid, issue.position||''); if(issue.status) { state.issueStatus[cid]=issue.status; setClauseDecision(cid,{status:issue.status}); } if(issue.routeTo!==undefined){ const canonical=canonicalRouteLabel(issue.routeTo); if(!canonical || canonical==='all' || canonical==='Legal Only'){ delete state.clauseRoutingTags[cid]; setClauseDecision(cid,{route:''}); } else { state.clauseRoutingTags[cid]=[canonical]; setClauseDecision(cid,{route:canonical}); } } refreshDerivedClauseState(cid); }
function applyIssueUpdate(issueId, updates={}, opts={}){ const issue=(state.issueConsole?.items||[]).find(i=>i.id===issueId || i.clauseId===issueId); if(!issue) return; Object.assign(issue, updates); syncIssueToClause(issue); if(!opts.silent){ recomputeDerivedState('issue-update'); onSubstantiveChange({rerenderClause:state.selectedClauseId===issue.clauseId}); } }
function bulkApplyIssues(issueIds, updates={}){ (issueIds||[]).forEach(id=>applyIssueUpdate(id, updates, {silent:true})); recomputeDerivedState('issue-bulk-update'); onSubstantiveChange({rerenderClause:(issueIds||[]).includes(state.selectedClauseId)}); }
function safeJumpToClause(cid, opts={}){ const exists=(state.clauses||[]).some(c=>c.id===cid); if(!exists){ state.navHistory=(state.navHistory||[]).filter(id=>id!==cid); state.navForwardHistory=(state.navForwardHistory||[]).filter(id=>id!==cid); if(state.selectedClauseId===cid) state.selectedClauseId=OVERVIEW_ID; scheduleRerender({ clause: true, navigator: true }, 'safe-jump-not-found'); renderClauseList(); return; } jumpToClause(cid, opts); }

function jumpToClause(cid, opts = {}) {
  if (!cid) return;
  recordClauseOpenTime(cid);
  state.returnToCheckArmed = !!opts.fromCheck;
  const prev = state.selectedClauseId;
  if (!opts.skipHistory) pushNavHistory(prev, cid);
  state.selectedClauseId = cid;
  scheduleRerender({ navigator: true, clause: true }, 'jump-to-clause');
  requestAnimationFrame(() => {
    const sel = typeof CSS !== 'undefined' && CSS.escape ? `[data-clause-id="${CSS.escape(cid)}"]` : `[data-clause-id="${cid}"]`;
    const el = els.clauseList?.querySelector(sel);
    if (el) el.scrollIntoView({ block: 'nearest' });
    if (els.clauseView) els.clauseView.scrollTop = 0;
  });
  saveSessionReturn();
}

function escapeRegExp(v){return v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function countWords(t){const s=String(t||'').trim();return s?s.split(/\s+/).length:0;}
function groupBy(items,key){return(items||[]).reduce((a,i)=>{const v=typeof key==='function'?key(i):i?.[key];const k=v==null||v===''?'General':v;a[k]||=[];a[k].push(i);return a;},{});}
function countByValue(obj){const o={};Object.values(obj||{}).forEach(v=>{if(v)o[v]=(o[v]||0)+1;});return o;}
function slugifyStatus(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')||'unset';}
function csvEscape(v){const raw=typeof WORKFLOW_CORE.neutralizeSpreadsheetFormula==='function'?WORKFLOW_CORE.neutralizeSpreadsheetFormula(v):(/^[=+\-@\t\r]/.test(String(v??''))?`'${String(v??'')}`:String(v??''));return /[",\n\r]/.test(raw)?`"${raw.replace(/"/g,'""')}"`:raw;}
function estimateReadMinutes(t){return Math.max(1,Math.ceil(countWords(t)/275));}
async function sha256Hex(value){try{if(!globalThis.crypto?.subtle)return'';const bytes=new TextEncoder().encode(String(value||''));const digest=await globalThis.crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,'0')).join('');}catch{return'';}}
function resolveContractType(v){const map={'SaaS':'SaaS Agreement','License':'Technology License','Other':'Custom','':'Custom'};return map[v]||v||'Custom';}
function inferContractType(text, clauses=[]){
const source=String(text||'');
const hay = `${source}\n${(clauses||[]).map(c=>`${c.heading||''} ${c.body||''}`).join('\n')}`;
const title = source.split(/\r?\n/).map(line=>line.trim()).filter(Boolean).slice(0,4).join(' ');
if(/\bDigital Personal Data Protection Act\s*,?\s*2023\b/i.test(hay) && /\b(?:data fiduciary|data processor|data principal|personal data protection)\b/i.test(hay)) return 'DPDP DPA';
const hits=patterns=>patterns.reduce((n,re)=>n+(re.test(hay)?1:0),0);
const titleScore=re=>re.test(title)?8:0;
const candidates=[
  ['Services Agreement', titleScore(/^(?:professional\s+)?services?\s+agreement\b/i)+hits([/\bscope of (?:services|work)\b/i,/\bfees? and (?:payment|expenses)\b/i,/\bacceptance\b/i,/\bchange control\b/i])],
  ['MSA', titleScore(/\b(?:master|framework)\s+services?\s+agreement\b/i)+hits([/\bstatements? of work\b/i,/\bfees? and invoic/i,/\blimitation of liability\b/i,/\bgoverning law\b/i])],
  ['SaaS Agreement', titleScore(/\b(?:software subscription|software[- ]as[- ]a[- ]service|saas)\s+agreement\b/i)+hits([/\bsubscription fees?\b/i,/\bservice levels?\b/i,/\bservice credits?\b/i,/\buptime|availability\b/i,/\border form\b/i])],
  ['NDA', titleScore(/\b(?:mutual\s+)?(?:non[- ]disclosure|confidentiality)\s+agreement\b/i)+hits([/\bdisclosing party\b/i,/\breceiving party\b/i,/\breturn or destroy\b/i,/\bpermitted purpose\b/i])],
  ['DPDP DPA', titleScore(/\bDPDP\b[^\n]{0,80}\b(?:addendum|agreement)\b/i)+hits([/\bDigital Personal Data Protection Act\b/i,/\bdata fiduciary\b/i,/\bdata principal\b/i])],
  ['DPA', titleScore(/\b(?:data processing|data protection)\s+(?:addendum|agreement)\b/i)+hits([/\bcontroller\b.*\bprocessor\b/is,/\bdata subject rights?\b/i,/\bsub[- ]?processors?\b/i,/\bprocessing instructions?\b/i,/\bcross[- ]border transfer\b/i])],
  ['SOW', titleScore(/\bstatement of work\b|\bSOW\b/i)+hits([/\bmilestones?\b/i,/\bdeliverables?\b/i,/\bacceptance criteria\b/i,/\bproject plan\b/i])],
  ['Technology License', titleScore(/\b(?:technology|software|intellectual property)\s+licen[cs]e\s+agreement\b/i)+hits([/\blicen[cs]e grant\b/i,/\blicensed materials?\b/i,/\blicen[cs]e fee\b/i,/\bsource code escrow\b/i])],
  ['Employment', titleScore(/\bemployment\s+(?:agreement|contract)\b/i)+hits([/\bemployee\b/i,/\bemployer\b/i,/\bsalary|remuneration\b/i,/\bprobation\b/i])],
  ['Lease', titleScore(/\b(?:lease|tenancy)\s+agreement\b/i)+hits([/\blandlord|lessor\b/i,/\btenant|lessee\b/i,/\bpremises\b/i,/\brent\b/i])],
  ['Staff Augmentation', titleScore(/\bstaff augmentation\s+agreement\b/i)+hits([/\bdeployed personnel\b/i,/\bresource replacement\b/i,/\btimesheets?\b/i,/\bnon[- ]solicitation\b/i])],
  ['IT/ITES Outsourcing', titleScore(/\b(?:IT|ITES|outsourcing|managed services?)\s+agreement\b/i)+hits([/\btransition services?\b/i,/\bservice management\b/i,/\bkey personnel\b/i,/\bbusiness continuity\b/i])]
];
candidates.sort((a,b)=>b[1]-a[1]);
const [best,second]=candidates;
return best&&best[1]>=3&&best[1]>Number(second?.[1]||0)?best[0]:'Custom';
}

function getDocumentWordCount(){return countWords(state.rawText)||Number(state.documentMeta.wordCount||0);}
function getEstimatedReviewMinutes(){return estimateReadMinutes(state.rawText)||Number(state.documentMeta.estimatedReviewMinutes||0);}
function formatShortTime(v){try{return new Date(v).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}catch{return '';}}
function getClauseTimeLabel(cid) {
  return '';
}
function formatShortDateTime(v){if(!v)return '';try{return new Date(v).toLocaleString([],{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch{return String(v);}}
function getWorkflowStageLabel(stage){const map={intake:'Checks',decide:'Review',prepare:'Resolve',close:'Export'};return map[stage]||map.decide;}
function getPreferredTabForStage(stage){const map={intake:'summary',decide:'review',prepare:'strategy',close:'summary'};return map[stage]||'summary';}
function buildDateStamp(){const d=new Date();return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;}
function safeBaseName(n){return n.replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]+/gi,'_');}
function highlightHtml(safe,q){if(!q)return safe;const n=String(q||'').trim();if(!n)return safe;return safe.replace(new RegExp(`(${escapeRegExp(n)})(?=[^<]*(?:<|$))`,'ig'),'<mark>$1</mark>');}
function highlightSearchInSafeHtml(safeHtml,q){
  const query=String(q||'').trim();if(!query)return safeHtml;
  const template=document.createElement('template');template.innerHTML=String(safeHtml||'');
  const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const re=new RegExp(escapeRegExp(query),'ig');
  nodes.forEach(node=>{if(node.parentElement?.closest('button,script,style,mark'))return;const text=node.nodeValue||'';if(!re.test(text)){re.lastIndex=0;return;}re.lastIndex=0;const fragment=document.createDocumentFragment();let last=0;for(const match of text.matchAll(re)){fragment.append(document.createTextNode(text.slice(last,match.index)));const mark=document.createElement('mark');mark.textContent=match[0];fragment.append(mark);last=match.index+match[0].length;}fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment);});
  return template.innerHTML;
}
function truncateWords(t,m){const p=String(t||'').split(/\s+/);return p.length<=m?t:p.slice(0,m).join(' ')+' ...';}
function heuristicText(text,maxLen=12000){return String(text||'').slice(0,maxLen);}
function heuristicBody(clause,maxLen=12000){return heuristicText(clause?.body||'',maxLen);}
function riskWeight(v){return v==='High'?3:v==='Medium'?2:1;}
const termBoundaryRegexCache = new Map();
function supportsRegexLookbehind(){
  try{ new RegExp('(?<!a)b'); return true; }catch{return false;}
}
function getDefaultRouteForClause(cid){ const clause=(state.clauses||[]).find(c=>c.id===cid); if(!clause) return ''; return CLAUSE_TYPE_DEFAULT_ROUTING[clause.type] || ''; }
function flashClauseItems(clauseIds, durationMs = 1500){ (clauseIds||[]).forEach(cid=>{ const sel = typeof CSS!=='undefined' && CSS.escape ? `[data-clause-id="${CSS.escape(cid)}"]` : `[data-clause-id="${escapeHtml(cid)}"]`; const el = els.clauseList?.querySelector(sel); if(el){ el.classList.add('ripple-flash'); setTimeout(()=>el.classList.remove('ripple-flash'), durationMs); } }); }
function isClauseBookmarked(cid){ return (state.bookmarkedClauseIds||[]).includes(cid); }
function toggleClauseBookmark(cid){ if(!cid || cid===OVERVIEW_ID) return; state.bookmarkedClauseIds = Array.isArray(state.bookmarkedClauseIds)?state.bookmarkedClauseIds:[]; if(isClauseBookmarked(cid)) state.bookmarkedClauseIds = state.bookmarkedClauseIds.filter(id=>id!==cid); else state.bookmarkedClauseIds.push(cid); renderTargeted({navigator:true,clause:state.selectedClauseId===cid,rightPanel:true}); scheduleAutosave(); showToast(isClauseBookmarked(cid)?'Bookmarked clause':'Bookmark removed','info'); }
function pushNavHistory(prevCid,nextCid){ if(!prevCid || prevCid===OVERVIEW_ID || prevCid===nextCid) return; state.navHistory = Array.isArray(state.navHistory)?state.navHistory:[]; state.navHistory.push(prevCid); if(state.navHistory.length > NAV_HISTORY_SIZE) state.navHistory.shift(); state.navHistoryIndex = state.navHistory.length-1; state.navForwardHistory=[]; }
function navigateBack(){ if(!state.navHistory?.length){ showToast('No previous clause in history','info'); return; } const cid=state.navHistory.pop(); state.navHistoryIndex=state.navHistory.length-1; if(state.selectedClauseId && state.selectedClauseId!==OVERVIEW_ID){ state.navForwardHistory=Array.isArray(state.navForwardHistory)?state.navForwardHistory:[]; state.navForwardHistory.push(state.selectedClauseId); if(state.navForwardHistory.length>NAV_HISTORY_SIZE) state.navForwardHistory.shift(); } safeJumpToClause(cid,{skipHistory:true}); }
function navigateForward(){ if(!state.navForwardHistory?.length){ showToast('No forward clause in history','info'); return; } const cid=state.navForwardHistory.pop(); if(state.selectedClauseId && state.selectedClauseId!==OVERVIEW_ID){ state.navHistory=Array.isArray(state.navHistory)?state.navHistory:[]; state.navHistory.push(state.selectedClauseId); if(state.navHistory.length>NAV_HISTORY_SIZE) state.navHistory.shift(); state.navHistoryIndex=state.navHistory.length-1; } safeJumpToClause(cid,{skipHistory:true}); }
function renderNavHistoryCard(){ return ''; }
function renderBookmarksCard(){ const items=(state.bookmarkedClauseIds||[]).map(id=>(state.clauses||[]).find(c=>c.id===id)).filter(Boolean); return items.length?`<div class="tool-card compact"><h4>Bookmarks</h4><div class="summary-list">${items.map(c=>`<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(c.id)}"><strong>${escapeHtml(c.number||'')}</strong> ${escapeHtml(c.heading||'')}</button>`).join('')}</div></div>`:''; }

function getIssueStatusOptions(){ return ['Open','Under review','Awaiting input','Negotiating','Resolved','Parked']; }
function getIssueStatusLabel(cid){ return state.issueStatus?.[cid] || 'Open'; }
function getIssueRouteLabel(cid){ const tags=state.clauseRoutingTags?.[cid]||[]; return tags[0] || getDefaultRouteForClause(cid) || 'Legal Only'; }
function getIssueNextAction(cid){ const pos=state.clausePositions?.[cid]||''; const route=getIssueRouteLabel(cid); const status=getIssueStatusLabel(cid); const hasFallback=!!String(state.clauseFallbacks?.[cid]||'').trim(); if(status==='Awaiting input') return `Wait for ${route}`; if(status==='Negotiating') return 'Prepare call / pack'; if(!hasFallback && pos && pos!=='Acceptable') return 'Capture fallback'; if(route!=='Legal Only' && ['Open','Under review'].includes(status)) return `Route to ${route}`; if(pos==='Escalate') return 'Escalate internally'; return 'Review clause'; }
function deriveIssuesFromState(opts={persist:true}){
  const notesByClause={};
  (state.notes||[]).forEach(n=>{ if(!notesByClause[n.clauseId]) notesByClause[n.clauseId]=[]; notesByClause[n.clauseId].push(n); });
  const items=[];
  (state.clauses||[]).forEach(clause=>{
    const cid=clause.id; if(!cid || cid===OVERVIEW_ID) return;
    const pos=state.clausePositions?.[cid]||'';
    const risk=state.clauseRiskScores?.[cid]||'Low';
    const route=getIssueRouteLabel(cid);
    const status=getIssueStatusLabel(cid);
    const negotiation=state.clauseNegotiationStatus?.[cid]||'';
    const notes=notesByClause[cid]||[];
    const card=deriveIssueCard(clause)||{};
    const nextAction=getIssueNextAction(cid);
    const openIssue = !!(pos || notes.length || negotiation || risk==='High' || route!=='Legal Only' || (state.placeholders||[]).some(p=>p.clauseId===cid&&!p.resolved));
    if(!openIssue) return;
    items.push({
      id:`issue-${cid}`,
      clauseId:cid,
      clauseNumber:clause.number||'',
      title:card.theme || clause.heading || 'Untitled clause',
      heading:clause.heading||'Untitled clause',
      risk,
      route,
      status,
      position:pos||card.position||'',
      negotiation,
      note:(notes[0]?.text||''),
      noteType:(notes[0]?.type||''),
      updatedAt:(notes[0]?.updatedAt||notes[0]?.createdAt||''),
      nextAction,
      theme:card.theme||'',
      fallback:card.fallback||card.recommendation||state.clauseFallbacks?.[cid]||'',
      blocker:notes.some(n=>n.blocker),
      businessCall:notes.some(n=>n.businessCall),
      readiness:getIssueReadiness({clauseId:cid,status,risk,route,position:pos||card.position||'',fallback:card.fallback||card.recommendation||state.clauseFallbacks?.[cid]||''}).label
    });
  });
  state.issueConsole = state.issueConsole || {items:[],filters:{risk:'all',status:'all',route:'all',query:''},sortBy:'risk',viewMode:'list'};
  if(opts.persist!==false) state.issueConsole.items = items;
  return items;
}
function getIssueConsoleItems(){ const cfg=state.issueConsole||{}; const filters=cfg.filters||{}; let items=deriveIssuesFromState({persist:false}); const q=String(filters.query||'').trim().toLowerCase(); if(q){ items=items.filter(i=>`${i.clauseNumber} ${i.heading} ${i.note} ${i.route} ${i.status} ${i.position}`.toLowerCase().includes(q)); }
  if(filters.risk && filters.risk!=='all') items=items.filter(i=>i.risk===filters.risk);
  if(filters.status && filters.status!=='all') items=items.filter(i=>i.status===filters.status);
  if(filters.route && filters.route!=='all') items=items.filter(i=>i.route===filters.route);
  const sortBy=cfg.sortBy||'risk';
  items.sort((a,b)=>{
    if(sortBy==='risk') return riskWeight(b.risk)-riskWeight(a.risk) || (a.clauseNumber||'').localeCompare(b.clauseNumber||'');
    if(sortBy==='status') return (a.status||'').localeCompare(b.status||'') || (a.clauseNumber||'').localeCompare(b.clauseNumber||'');
    if(sortBy==='route') return (a.route||'').localeCompare(b.route||'') || (a.clauseNumber||'').localeCompare(b.clauseNumber||'');
    return (a.clauseNumber||'').localeCompare(b.clauseNumber||'');
  });
  return items;
}
function getIssueCounts(){ const items=getIssueConsoleItems(); return {total:items.length, unresolved:items.filter(i=>i.status!=='Resolved').length, awaiting:items.filter(i=>i.status==='Awaiting input').length, leadership:items.filter(i=>/Leadership/i.test(i.route) && i.status!=='Resolved').length, highRisk:items.filter(i=>i.risk==='High' && i.status!=='Resolved').length}; }
function setIssueStatus(cid,status){ applyIssueUpdate(cid,{status:status||'Open'}); logReviewAction('issue-status-updated',cid,{summary:status||'Open'}); }
function formatIssueHotlist(routeFilter=''){ const audience=routeFilter==='Leadership'?'Internal Leadership':'Internal Legal'; const prefix=`ISSUE HOTLIST\nAudience: ${audience}\n\n`; const items=getIssueConsoleItems().filter(i=>i.status!=='Resolved' && (!routeFilter || i.route===routeFilter || (routeFilter==='Leadership' && (/Leadership/.test(i.route) || i.position==='Escalate')))); if(!items.length) return prefix+'No open issues.'; return prefix+items.map(i=>`${i.clauseNumber || ''} - ${i.heading}\nRisk: ${i.risk}\nRoute: ${i.route}\nStatus: ${i.status}\nPosition: ${i.position || 'Not set'}\nNext action: ${i.nextAction}\n${i.note?`Note: ${i.note}`:''}`).join('\n\n-\n\n'); }
function exportIssueHotlistTxt(routeFilter=''){ const suffix=routeFilter?routeFilter.toLowerCase().replace(/[^a-z0-9]+/g,'_'):'issues'; downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_${suffix}_${buildDateStamp()}.txt`, new Blob([formatIssueHotlist(routeFilter)],{type:'text/plain;charset=utf-8'})); }

const NOTE_TEMPLATES = {
  business:'Business decision required: ',
  fallback:'Fallback position: ',
  risk:'Risk if accepted: ',
  pushback:'Likely counterparty pushback: ',
  escalate:'Escalation rationale: '
};
const NOTE_SLASH_COMMANDS = [
  {key:'business',label:'Business template',hint:'/business',apply:(form)=>insertTemplateIntoForm(form,'business')},
  {key:'fallback',label:'Fallback template',hint:'/fallback',apply:(form)=>insertTemplateIntoForm(form,'fallback')},
  {key:'risk',label:'Risk template',hint:'/risk',apply:(form)=>insertTemplateIntoForm(form,'risk')},
  {key:'pushback',label:'Pushback template',hint:'/pushback',apply:(form)=>insertTemplateIntoForm(form,'pushback')},
  {key:'escalate',label:'Escalate template',hint:'/escalate',apply:(form)=>insertTemplateIntoForm(form,'escalate')},
  {key:'route-business',label:'Route to Business',hint:'/business-tag',apply:(form)=>setFormRouteValue(form,'Business')},
  {key:'route-privacy',label:'Route to Privacy',hint:'/privacy',apply:(form)=>setFormRouteValue(form,'Privacy')},
  {key:'route-finance',label:'Route to Finance',hint:'/finance',apply:(form)=>setFormRouteValue(form,'Finance')},
  {key:'route-leadership',label:'Route to Leadership',hint:'/leadership',apply:(form)=>setFormRouteValue(form,'Leadership')}
];
function stripNoteSlashTrigger(val){ const str=String(val||''); const lines=str.split('\n'); if(lines.length && lines[lines.length-1].trimStart().startsWith('/')) lines.pop(); return lines.join('\n'); }
function insertTemplateIntoForm(form,key){ const ta=form?.querySelector('textarea[name="text"]'); if(!ta) return; const tpl=NOTE_TEMPLATES[key]||''; const val=stripNoteSlashTrigger(ta.value); ta.value = val && !/\n$/.test(val) ? `${val}\n${tpl}` : `${val}${tpl}`; ta.dispatchEvent(new Event('input',{bubbles:true})); ta.focus(); }
function setFormRouteValue(form,value){ const sel=form?.querySelector('select[name="routeTo"]'); if(!sel) return; sel.value=value||''; sel.dispatchEvent(new Event('change',{bubbles:true})); const ta=form?.querySelector('textarea[name="text"]'); if(ta){ ta.value=stripNoteSlashTrigger(ta.value); ta.dispatchEvent(new Event('input',{bubbles:true})); ta.focus(); } }
function getNoteSlashMenu(form){ return form?.querySelector('[data-note-slash-menu]'); }
function closeNoteSlashMenu(form){ const menu=getNoteSlashMenu(form); if(menu){ menu.classList.add('hidden'); menu.innerHTML=''; delete menu.dataset.activeIndex; } }
function openNoteSlashMenu(form, query=''){ const menu=getNoteSlashMenu(form); if(!menu) return; const q=String(query||'').replace(/^\//,'').trim().toLowerCase(); const items=NOTE_SLASH_COMMANDS.filter(cmd=>!q || cmd.key.includes(q) || cmd.label.toLowerCase().includes(q) || cmd.hint.toLowerCase().includes('/'+q)); if(!items.length){ closeNoteSlashMenu(form); return; } menu.dataset.activeIndex='0'; menu.innerHTML = items.map((cmd,idx)=>`<button type="button" class="note-slash-item ${idx===0?'active':''}" data-note-slash-index="${idx}" data-note-slash-key="${escapeHtml(cmd.key)}"><span>${escapeHtml(cmd.label)}</span><span class="hint">${escapeHtml(cmd.hint)}</span></button>`).join(''); menu.classList.remove('hidden'); menu.querySelectorAll('[data-note-slash-key]').forEach(btn=>btn.addEventListener('click',()=>applyNoteSlashCommand(form,btn.dataset.noteSlashKey))); }
function applyNoteSlashCommand(form,key){ const cmd=NOTE_SLASH_COMMANDS.find(c=>c.key===key); if(!cmd) return; cmd.apply(form); closeNoteSlashMenu(form); }
function handleNoteSlashInput(form){ const ta=form?.querySelector('textarea[name="text"]'); if(!ta) return; const val=String(ta.value||''); const line=(val.split(/\n/).pop()||'').trimStart(); if(line.startsWith('/')) openNoteSlashMenu(form,line); else closeNoteSlashMenu(form); }
function handleNoteSlashKeydown(e){ const form=e.target.closest('.inline-notes-thread form'); if(!form) return; const ta=form.querySelector('textarea[name="text"]'); if(e.target!==ta) return; const line=(String(ta.value||'').split(/\n/).pop()||'').trimStart(); const menu=getNoteSlashMenu(form); if(!menu || menu.classList.contains('hidden')) return; const buttons=[...menu.querySelectorAll('[data-note-slash-key]')]; if(!buttons.length) return; let idx=Number(menu.dataset.activeIndex||0); if(e.key==='ArrowDown'){ e.preventDefault(); idx=(idx+1)%buttons.length; menu.dataset.activeIndex=String(idx); buttons.forEach((b,i)=>b.classList.toggle('active',i===idx)); } else if(e.key==='ArrowUp'){ e.preventDefault(); idx=(idx-1+buttons.length)%buttons.length; menu.dataset.activeIndex=String(idx); buttons.forEach((b,i)=>b.classList.toggle('active',i===idx)); } else if(e.key==='Enter' && line.startsWith('/')){ e.preventDefault(); applyNoteSlashCommand(form,buttons[idx].dataset.noteSlashKey); } else if(e.key==='Escape'){ closeNoteSlashMenu(form); } }
function isInAgenda(cid){ return (state.agendaItems||[]).some(i=>i.cid===cid); }
function addClauseToAgenda(cid){
  if(!cid || cid===OVERVIEW_ID) return;
  state.agendaItems = Array.isArray(state.agendaItems)?state.agendaItems:[];
  if(isInAgenda(cid)){ showToast('Clause already in agenda','info'); return; }
  const c=(state.clauses||[]).find(x=>x.id===cid); if(!c) return;
  const intel=evaluateClauseIntelligence(c)||{}; const card=deriveIssueCard(c)||{};
  state.agendaItems.push({cid,heading:c.heading||'',number:c.number||'',ask:state.clausePositions?.[cid]||card.position||'',fallback:card.fallback||intel.recommendation||'',theme:card.theme||intel.theme||'',addedAt:new Date().toISOString()});
  scheduleAutosave(); renderTargeted({navigator:true,rightPanel:true,clause:state.selectedClauseId===cid}); showToast('Added to micro-agenda','info');
}
function removeClauseFromAgenda(cid){ state.agendaItems=(state.agendaItems||[]).filter(i=>i.cid!==cid); scheduleAutosave(); renderTargeted({navigator:true,rightPanel:true,clause:state.selectedClauseId===cid}); showToast('Removed from micro-agenda','info'); }
function formatMicroAgenda(){
  const items=(state.agendaItems||[]).map(i=>{const c=(state.clauses||[]).find(x=>x.id===i.cid); if(!c) return null; const intel=evaluateClauseIntelligence(c)||{}; return {c,i,intel};}).filter(Boolean);
  if(!items.length) return 'No micro-agenda items.';
  const prefix = matterSummaryLine() ? `Matter: ${matterSummaryLine()}\n\n` : '';
  return prefix + items.map(({c,i,intel})=>`${c.number||''} - ${c.heading||''}\nAsk: ${i.ask||'Not set'}\nTheme: ${i.theme||intel.theme||'General'}\nFallback: ${i.fallback||intel.recommendation||'Not captured'}\nPushback: ${intel.likelyPushback||'Medium'}`).join('\n\n-\n\n');
}
function getNegotiationRounds(cid){ return Array.isArray(state.negotiationRounds?.[cid]) ? state.negotiationRounds[cid] : []; }
function logNegotiationRound(cid, payload={}){
  if(!cid) return;
  state.negotiationRounds = state.negotiationRounds || {};
  const arr = state.negotiationRounds[cid] = Array.isArray(state.negotiationRounds[cid]) ? state.negotiationRounds[cid] : [];
  const last = arr[arr.length-1] || {};
  const next = { round: payload.round || (arr.length + 1), at: new Date().toISOString(), position: payload.position ?? (state.clausePositions?.[cid]||''), status: payload.status ?? (state.clauseNegotiationStatus?.[cid]||''), counterparty: payload.counterparty ?? (state.clauseCounterpartyPositions?.[cid]||'') };
  if(last.position===next.position && last.status===next.status && last.counterparty===next.counterparty) return;
  arr.push(next);
}
function renderNegotiationRoundsHtml(cid){
  return '';
}
function getCounterpartyLens(clause){
  const type=String(clause?.type||'').toLowerCase();
  if(type.includes('liability')||type.includes('indemn')) return {goal:'Cap downside and preserve carve-outs',pushback:'High',palatable:'Fee-linked cap with narrow carve-outs'};
  if(type.includes('data')) return {goal:'Retain compliance flexibility',pushback:'Medium',palatable:'Operationally realistic breach timing and audit limits'};
  if(type.includes('fees')||type.includes('payment')) return {goal:'Protect payment timing and dispute rights',pushback:'Medium',palatable:'Shorter payment cycle with valid-invoice wording'};
  if(type.includes('termination')) return {goal:'Keep exit optionality',pushback:'Medium',palatable:'Convenience termination with ramp-down protections'};
  return {goal:'Balance risk and preserve operational flexibility',pushback:'Medium',palatable:'Mutual, operationally workable fallback'};
}
function renderCounterpartyLensHtml(cid){ if(!state.prefs?.optionalFeatures?.counterpartyLens)return'';const clause=(state.clauses||[]).find(c=>c.id===cid); if(!clause) return ''; const lens=getCounterpartyLens(clause); return `<div class="tool-card compact"><div class="panel-subhead">Counterparty-facing lens <span class="heuristic-badge" title="Pattern-matching estimate — not a legal opinion">heuristic</span></div><div class="mini"><strong>Likely goal:</strong> ${escapeHtml(lens.goal)}</div><div class="mini"><strong>Likely pushback:</strong> ${escapeHtml(lens.pushback)}</div><div class="mini"><strong>Most palatable fallback:</strong> ${escapeHtml(lens.palatable)}</div></div>`; }
function checkPositionConsistency() {
  const issues = [];
  const byType = {};
  (state.clauses || []).forEach(c => {
    if (!byType[c.type]) byType[c.type] = [];
    byType[c.type].push(c);
  });

  const get = (type) => (byType[type] || [])[0];
  const pos = (c) => c ? (state.clausePositions?.[c.id] || '') : '';
  const hard = (p) => ['Reject','Escalate','Seek amendment'].includes(p);
  const soft = (p) => p === 'Acceptable' || p === 'Accept with changes';

  const liability = get('Liability');
  const indemnity = get('Indemnity');
  const ip = get('Intellectual Property');
  const data = get('Data Protection');
  const audit = get('Audit');
  const termination = get('Termination');
  const fees = get('Fees');
  const confidentiality = get('Confidentiality');
  const governing = get('Governing Law');
  const dispute = get('Dispute Resolution');

  if (liability && indemnity && soft(pos(liability)) && hard(pos(indemnity))) {
    issues.push({ severity: 'warn', text: 'Liability clause is acceptable but Indemnity is hard-line — indemnity obligations may sit outside the liability cap.', primaryId: liability.id, secondaryId: indemnity.id });
  }
  if (liability && ip && soft(pos(liability)) && hard(pos(ip))) {
    issues.push({ severity: 'warn', text: 'Liability is acceptable while IP is still hard-line — check whether IP exposure is captured within the cap.', primaryId: liability.id, secondaryId: ip.id });
  }
  if (data && audit && hard(pos(data)) && soft(pos(audit))) {
    issues.push({ severity: 'warn', text: 'Strong data-protection position but Audit clause is acceptable — broad audit rights may undermine data controls.', primaryId: data.id, secondaryId: audit.id });
  }
  if (termination && fees && soft(pos(termination)) && hard(pos(fees))) {
    issues.push({ severity: 'info', text: 'Termination is acceptable but Fees position is hard-line — confirm payment consequences on early exit are addressed.', primaryId: termination.id, secondaryId: fees.id });
  }
  if (confidentiality && governing && hard(pos(confidentiality)) && !pos(governing)) {
    issues.push({ severity: 'info', text: 'Confidentiality position is hard-line but Governing Law has no position set — enforcement jurisdiction affects confidentiality remedies.', primaryId: confidentiality.id, secondaryId: governing.id });
  }
  if (governing && dispute && pos(governing) && pos(dispute) && pos(governing) !== pos(dispute)) {
    const govBody = (state.clauses || []).find(c => c.id === governing.id)?.body || '';
    const disBody = (state.clauses || []).find(c => c.id === dispute.id)?.body || '';
    const govHasArb = /arbitration/i.test(govBody);
    const disHasCourt = /courts?\s+of/i.test(disBody);
    if (govHasArb !== !disHasCourt) {
      issues.push({ severity: 'warn', text: 'Governing Law and Dispute Resolution clauses may point to different forums — check for consistency between court jurisdiction and arbitration seat.', primaryId: governing.id, secondaryId: dispute.id });
    }
  }
  if (ip && confidentiality && hard(pos(ip)) && soft(pos(confidentiality))) {
    issues.push({ severity: 'info', text: 'IP position is hard-line but Confidentiality is acceptable — IP protection often depends on confidentiality controls being equally robust.', primaryId: ip.id, secondaryId: confidentiality.id });
  }

  return issues;
}
function renderConsistencyCard() {
  const items = checkPositionConsistency();
  if (!items.length) return '';
  return `<div class="tool-card compact consistency-card">
    <div class="panel-subhead">Position conflicts (${items.length})</div>
    ${items.map(i => `
      <div class="consistency-row severity-${i.severity}">
        <div class="mini">• ${escapeHtml(i.text)}</div>
        <div class="card-actions">
          <button type="button" class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(i.primaryId || '')}">Open</button>
          ${i.secondaryId ? `<button type="button" class="btn btn-xs consistency-peek-btn" data-primary-id="${escapeHtml(i.primaryId || '')}" data-secondary-id="${escapeHtml(i.secondaryId || '')}">Compare</button>` : ''}
        </div>
      </div>`).join('')}
  </div>`;
}

function detectDocumentLineage() {
  const text = String(state.rawText || '').slice(0, 1500);
  const result = {
    isAmendment: false,
    amendmentNumber: '',
    parentDocumentType: '',
    parentDocumentRef: '',
    orderOfPrecedence: false,
    supersedes: false,
    lineageNote: ''
  };
  const amendMatch = text.match(/amendment\s+no\.?\s*(\d+|one|two|three|first|second|third)/i);
  if (amendMatch) {
    result.isAmendment = true;
    result.amendmentNumber = amendMatch[1] || '';
  }
  const parentMatch = text.match(/(?:to\s+the|amending\s+the|pursuant\s+to\s+the)\s+(master\s+services?\s+agreement|services?\s+agreement|statement\s+of\s+work|non-?disclosure|framework\s+agreement|license\s+agreement)[^,.\n]{0,80}/i);
  if (parentMatch) result.parentDocumentType = parentMatch[1].replace(/\s+/g, ' ').trim();
  if (/order\s+of\s+precedence|in\s+case\s+of\s+conflict.*(?:this|amendment)\s+shall\s+(?:prevail|govern)/i.test(text)) result.orderOfPrecedence = true;
  if (/supersedes?\s+and\s+replaces?|replaces?\s+and\s+supersedes?/i.test(text)) result.supersedes = true;
  if (/statement\s+of\s+work|order\s+form/i.test(String(state.rawText || '').slice(0, 200)) && !result.isAmendment) result.parentDocumentType = result.parentDocumentType || 'Master Services Agreement';
  if (result.isAmendment) {
    result.lineageNote = `This appears to be Amendment ${result.amendmentNumber ? `No. ${result.amendmentNumber}` : ''} to a ${result.parentDocumentType || 'parent agreement'}.${result.orderOfPrecedence ? ' An order of precedence clause was detected — this document may override conflicting terms in the parent.' : ''} Review against the parent document to identify what changes.`;
  } else if (result.parentDocumentType) {
    result.lineageNote = `This document references a ${result.parentDocumentType} as its parent.${result.supersedes ? ' Supersession language detected.' : ''} Confirm which terms from the parent remain operative.`;
  }
  return result;
}

function renderDocumentLineageCard() {
  if(!state.prefs?.optionalFeatures?.documentLineage)return'';
  const lineage = detectDocumentLineage();
  if (!lineage.lineageNote) return '';
  return `<div class="tool-card compact lineage-card">
    <div class="panel-subhead">📎 Document lineage</div>
    <div class="mini">${escapeHtml(lineage.lineageNote)}</div>
    ${lineage.orderOfPrecedence ? '<div class="mini warn-text">⚠ Order of precedence detected — this document may override the parent on conflicting points.</div>' : ''}
    ${lineage.supersedes ? '<div class="mini warn-text">⚠ Supersession language detected — confirm which prior version this replaces.</div>' : ''}
  </div>`;
}

function detectPositionDrift() {
  const rounds = getRoundEntries();
  if (rounds.length < 2) return [];
  const positionWeight = {'Reject': 5, 'Escalate': 5, 'Seek amendment': 3, 'Need input': 2, 'Accept with changes': 1, 'Acceptable': 0, '': 0};
  const drift = [];
  const lastRound = rounds[rounds.length - 1];
  const prevRound = rounds[rounds.length - 2];
  (state.clauses || []).forEach(c => {
    if (c.id === OVERVIEW_ID) return;
    const currentPos = state.clausePositions?.[c.id] || '';
    const prevSnap = prevRound.snapshot?.[c.id]?.position || '';
    const currentW = positionWeight[currentPos] ?? 0;
    const prevW = positionWeight[prevSnap] ?? 0;
    if (prevW - currentW >= 2 && currentW < prevW) {
      drift.push({ clauseId: c.id, clauseNumber: c.number || '', heading: c.heading || '', from: prevSnap || 'Not set', to: currentPos || 'Not set', drop: prevW - currentW });
    }
  });
  return drift.sort((a, b) => b.drop - a.drop);
}

function renderPositionDriftCard() {
  if(!state.prefs?.optionalFeatures?.positionDrift)return'';
  const drift = detectPositionDrift();
  if (!drift.length) return '';
  return `<div class="tool-card compact drift-card">
    <div class="panel-subhead">⚠ Position drift (${drift.length} clause${drift.length === 1 ? '' : 's'})</div>
    <div class="mini" style="margin-bottom:6px">Positions that softened significantly since the last round.</div>
    ${drift.slice(0, 5).map(d => `
      <div class="drift-row">
        <div class="mini"><strong>${escapeHtml(d.clauseNumber)}</strong> ${escapeHtml(d.heading)}</div>
        <div class="mini drift-change"><span class="drift-from">${escapeHtml(d.from)}</span><span> → </span><span class="drift-to">${escapeHtml(d.to)}</span></div>
        <button type="button" class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(d.clauseId)}">Review</button>
      </div>`).join('')}
  </div>`;
}

function renderMicroAgendaCard(){
  if(!state.prefs?.optionalFeatures?.microAgenda)return'';
  const items=(state.agendaItems||[]).map(i=>{ const c=(state.clauses||[]).find(x=>x.id===i.cid); return c?{i,c}:null; }).filter(Boolean);
  if(!items.length) return '';
  return `<div class="tool-card compact"><div class="panel-subhead">Micro-agenda</div><div class="mini">Review, reorder mentally, and remove items before copying.</div><div class="summary-list agenda-manager-list">${items.map(({i,c},idx)=>`<div class="summary-item agenda-item"><div><strong>${escapeHtml(c.number||'')}</strong> ${escapeHtml(c.heading||'')}<div class="summary-meta">Ask: ${escapeHtml(i.ask||'Not set')}${i.fallback?` • Fallback: ${escapeHtml(truncateWords(i.fallback,10))}`:''}</div></div><div class="agenda-item-actions"><button type="button" class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(c.id)}">Open</button><button type="button" class="btn btn-xs" data-action="remove-from-agenda" data-clause-id="${escapeHtml(c.id)}">Remove</button></div></div>`).join('')}</div><div class="card-actions"><button id="copyMicroAgendaBtn" class="btn btn-sm" type="button">Copy micro-agenda</button></div></div>`;
}
function renderScopeBar(cid){ if(!els.clauseScopeBar) return; const c=(state.clauses||[]).find(x=>x.id===cid); if(!c){ els.clauseScopeBar.innerHTML=''; els.clauseScopeBar.classList.add('hidden'); return; } els.clauseScopeBar.classList.remove('hidden'); const intel=evaluateClauseIntelligence(c)||{}; els.clauseScopeBar.innerHTML=`<div class="scope-left"><strong>${escapeHtml(c.number||'')}</strong><span>${escapeHtml(c.heading||'Untitled clause')}</span></div><div class="scope-right"><span class="scope-pill">${escapeHtml(intel.theme||'General')}</span><span class="scope-pill">${escapeHtml(intel.strategyType||getNegotiationStrategyType(c))}</span><button type="button" class="scope-bookmark-btn" data-action="toggle-bookmark">${isClauseBookmarked(cid)?'★':'☆'}</button><button type="button" class="scope-agenda-btn" data-action="${isInAgenda(cid)?'remove-from-agenda':'add-to-agenda'}">${isInAgenda(cid)?'Agenda ✓':'Add agenda'}</button></div>`; }
function renderMinimapRail(){ if(!els.minimapRail) return; const clauses=(state.clauses||[]); if(!clauses.length){ els.minimapRail.innerHTML=''; return; } const total=clauses.length; els.minimapRail.innerHTML=clauses.map((c,i)=>{ const risk=slugifyStatus(state.clauseRiskScores?.[c.id]||'Low'); const pct=((i/Math.max(1,total-1))*100).toFixed(2); const classes=['minimap-node',`risk-${risk}`]; if(c.id===state.selectedClauseId) classes.push('active'); if(isClauseBookmarked(c.id)) classes.push('bookmarked'); if(isClauseSnoozed(c.id)) classes.push('snoozed'); return `<button type="button" class="${classes.join(' ')}" style="top:calc(${pct}% - 5px)" data-clause-id="${escapeHtml(c.id)}" title="${escapeHtml((c.number||'')+' '+(c.heading||''))}"></button>`; }).join(''); if(!els.minimapRail.dataset.delegated){ els.minimapRail.dataset.delegated='true'; els.minimapRail.addEventListener('click',e=>{ const btn=e.target.closest('[data-clause-id]'); if(btn) jumpToClause(btn.dataset.clauseId); }); } }
function toggleContrastMode(){ state.contrastMode=!state.contrastMode; renderTargeted({navigator:true,clause:true,header:true}); savePrefs(); showToast(state.contrastMode?'Contrast mode on — standard clauses dimmed':'Contrast mode off','info'); }
function isClauseSnoozed(cid){ return (state.snoozedClauseIds||[]).includes(cid); }
function snoozeClause(cid){ if(!cid || cid===OVERVIEW_ID) return; state.snoozedClauseIds = Array.isArray(state.snoozedClauseIds)?state.snoozedClauseIds:[]; if(!state.snoozedClauseIds.includes(cid)) state.snoozedClauseIds.push(cid); showToast('Clause ignored for this session','info'); renderTargeted({navigator:true,clause:true,rightPanel:true}); const ids=getNavigableClauseIds().filter(id=>id!==OVERVIEW_ID && !isClauseSnoozed(id)); const next=ids.find(id=>(state.clauseReviewStatus[id]||'')!=='Reviewed'); if(next && next!==cid) jumpToClause(next,{skipHistory:true}); scheduleAutosave(); }
function unsnoozeClause(cid){ state.snoozedClauseIds=(state.snoozedClauseIds||[]).filter(id=>id!==cid); renderTargeted({navigator:true,clause:true,rightPanel:true}); scheduleAutosave(); }
function unsnoozeAll(){ state.snoozedClauseIds=[]; renderTargeted({navigator:true,rightPanel:true,clause:true}); showToast('All snoozed clauses restored','info'); scheduleAutosave(); }
function getClauseBrief(cid){ return state.clauseBriefs?.[cid] || {}; }
function getDefaultClauseBrief(cid){ const clause=(state.clauses||[]).find(c=>c.id===cid); const card=clause?deriveIssueCard(clause):null; return {whatDoes: card?.theme || '', whoOnHook: card?.routeTo || clause?.type || '', riskIfAccept: card?.consequenceIfAccepted || card?.riskSummary || '', preferredOutcome: card?.recommendation || card?.fallback || ''}; }
function renderClauseBriefSection(){ return ''; /* Retained as a migration-safe no-op: the canonical Decision replaces this duplicate draft surface. */ }
function formatClauseBriefText(cid){ const c=(state.clauses||[]).find(x=>x.id===cid); if(!c) return ''; const brief=getClauseBrief(cid); const base=getDefaultClauseBrief(cid); const out={...base,...brief}; return [`${c.number || ''} — ${c.heading || 'Untitled'}`.trim(),`What it does: ${out.whatDoes || '(Not captured)'}`,`Who is on the hook: ${out.whoOnHook || '(Not captured)'}`,`Risk if accepted: ${out.riskIfAccept || '(Not captured)'}`,`Preferred outcome: ${out.preferredOutcome || '(Not captured)'}`].join('\n'); }
function formatAllBriefsText(){ return (state.clauses||[]).filter(c=>{ const b=getClauseBrief(c.id); return b && Object.values(b).some(v=>String(v||'').trim()); }).map(c=>formatClauseBriefText(c.id)).join('\n\n---\n\n'); }

function computeAnnunciatorAlerts(){ const alerts=[]; if(!state.clauses.length) return alerts; const reviewed=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length; const total=state.clauses.length||0; const counts=getIssueCounts(); const next=getNextBestAction(); const stage=getActiveWorkflowStage(); alerts.push({text:`${getWorkflowStageLabel(stage)} stage • ${reviewed}/${total} reviewed • ${counts.highRisk} high-risk open • Next: ${next.label}`,severity:'info',primary:true,action:()=>{ if(stage==='intake'){ dispatch('SET_WORKFLOW_MODE',{mode:'review'}); return; } if(counts.highRisk){ dispatch('OPEN_REVIEW_SUBSECTION',{subSection:'issues-console'}); return; } dispatch('OPEN_STRATEGY_SUBSECTION',{subSection:'packages'}); }}); const missing=state.expectedClauseCoverage?.missing || []; ['Governing Law','Liability','Termination','Confidentiality'].filter(t=>missing.includes(t)).forEach(t=>alerts.push({text:`MISSING: ${t}`,severity:'critical',action:()=>{ dispatch('OPEN_REVIEW_SUBSECTION',{subSection:'issues'}); }})); const broken=(state.issues?.crossReferenceBreaks||[]).length; if(broken>5) alerts.push({text:`${broken} BROKEN XREFS`,severity:'critical',action:()=>{ dispatch('OPEN_REVIEW_SUBSECTION',{subSection:'issues'}); }}); const undef=(state.issues?.undefinedCapitalizedTerms||[]).length; if(undef>8) alerts.push({text:`${undef} UNDEFINED TERMS`,severity:'warning',action:()=>{ dispatch('OPEN_REVIEW_SUBSECTION',{subSection:'terms'}); }}); const placeholders=(state.placeholders||[]).filter(p=>!p.resolved).length; if(placeholders>3) alerts.push({text:`${placeholders} PLACEHOLDERS`,severity:'warning',action:()=>{ dispatch('OPEN_REVIEW_SUBSECTION',{subSection:'placeholders'}); }}); const openObs = (state.issues.openObligations || []).length; if (openObs > 0) alerts.push({ text: `${openObs} AGREE-TO-AGREE clause${openObs === 1 ? '' : 's'} — deferred obligations not yet settled`, severity: 'warning', action: () => { setActiveToolsTab('refs'); } }); const consistencyIssues = checkPositionConsistency().filter(i => i.severity === 'warn'); if (consistencyIssues.length) alerts.push({ text: `${consistencyIssues.length} position conflict${consistencyIssues.length === 1 ? '' : 's'} — e.g. ${consistencyIssues[0].text.slice(0, 60)}…`, severity: 'warning', action: () => { setActiveTab('strategy'); state.strategySubSection = 'positions'; renderStrategyPanel(); } }); return alerts; }

function renderAnnunciatorPanel(){
  if(!els.annunciatorPanel) return;
  const reviewable=getReviewableClauses();
  const reviewed=reviewable.filter(c=>(state.clauseReviewStatus?.[c.id]||'')==='Reviewed').length;
  const highRisk=reviewable.filter(c=>(state.clauseRiskScores?.[c.id]||'')==='High'&&!getClauseDecision(c.id).type).length;
  const next=getNextBestAction();
  const stage=getActiveWorkflowStage();
  const primary={text:`${getWorkflowStageLabel(stage)} • ${reviewed}/${reviewable.length} reviewed • ${highRisk} high-risk open • Next: ${next.label}`,severity:'info',primary:true,action:()=>{if(stage==='intake')setWorkflowStage('decide',{preserveTab:false});else if(stage==='close')openExportHubModal();else if(highRisk){state.queuePreset='high-risk';openMobileLeftPanel();}else jumpToNextUnreviewedClause();}};
  if(!reviewable.length || state.hudDismissed){ els.annunciatorPanel.classList.add('hidden'); els.annunciatorPanel.innerHTML=''; state.__primaryAnnunciator=null; return; }
  state.__primaryAnnunciator=[primary];
  els.annunciatorPanel.classList.remove('hidden');
  els.annunciatorPanel.innerHTML=`<button type="button" class="annunciator-alert primary-alert severity-info" data-annunciator-index="0">${escapeHtml(primary.text)}</button><button type="button" class="annunciator-dismiss" data-annunciator-dismiss aria-label="Dismiss workflow banner for this session">✕</button>`;
}

function getDocumentState(){return {documentMeta:state.documentMeta,rawText:state.rawText,clauses:state.clauses,definedTerms:state.definedTerms,issues:state.issues,placeholders:state.placeholders,obligations:state.obligations,deadlines:state.deadlines,expectedClauseCoverage:state.expectedClauseCoverage,contractType:state.contractType};}
function getReviewState(){return {notes:state.notes,clausePositions:state.clausePositions,clauseRoutingTags:state.clauseRoutingTags,clauseCounterpartyPositions:state.clauseCounterpartyPositions,clauseNegotiationStatus:state.clauseNegotiationStatus,clauseApprovalStatus:state.clauseApprovalStatus,clauseIssueStages:state.clauseIssueStages,clauseRecommendations:state.clauseRecommendations,clauseFallbacks:state.clauseFallbacks,clauseFallbackLadders:state.clauseFallbackLadders};}
function getUIState(){return {selectedClauseId:state.selectedClauseId,activeTab:state.activeTab,filters:state.filters,workflowMode:state.workflowMode,workflowStage:state.workflowStage,navigatorMode:state.navigatorMode,focusMode:state.focusMode,mobileView:state.mobileView,activeCheck:state.activeCheck,activeConcept:state.activeConcept,checkFilter:state.checkFilter};}
function pushDiagnosticLog(bucket, value){
  const diag=state.diagnostics||(state.diagnostics={lastAction:'',lastError:'',lastRender:'',lastRestoreSource:'',renderCounts:{},recentActions:[],recentRenders:[],recentErrors:[]});
  const key=bucket==='action'?'recentActions':bucket==='render'?'recentRenders':'recentErrors';
  diag[key]=Array.isArray(diag[key])?diag[key]:[];
  diag[key].unshift({value:String(value||''),at:new Date().toISOString()});
  if(diag[key].length>DIAGNOSTIC_LOG_LIMIT) diag[key].length=DIAGNOSTIC_LOG_LIMIT;
}
function bumpRenderCount(key){state.diagnostics.renderCounts[key]=(state.diagnostics.renderCounts[key]||0)+1;state.diagnostics.lastRender=key;pushDiagnosticLog('render', key);}
function recordDiagnosticAction(label){state.diagnostics.lastAction=label;pushDiagnosticLog('action', label);}
function recordDiagnosticError(label,err){const msg=`${label}: ${err?.message||err}`;state.diagnostics.lastError=msg;pushDiagnosticLog('error', msg);}
function recordRestoreMeta(session, source='autosave'){
  if(!session||typeof session!=='object') return;
  const reviewable=typeof WORKFLOW_CORE.getReviewableClauses==='function'?WORKFLOW_CORE.getReviewableClauses(session?.clauses||[]):(session?.clauses||[]);
  const reviewableIds=reviewable.map(c=>c.id);
  const decisions=reviewableIds.filter(id=>!!session?.decisionByClause?.[id]?.type).length;
  const openInputs=(session?.notes||[]).filter(note=>note?.businessCall&&!note?.resolved).length;
  const openApprovals=reviewableIds.filter(id=>['Requested','Pending'].includes(session?.clauseApprovalStatus?.[id])).length;
  state.pendingRestoreMeta={source,buildVersion:session.buildVersion||session.schemaVersion||'unknown',savedAt:session?.lastPersistedAt||session?.documentMeta?.loadedAt||session?.sessionReturn?.at||session?.reviewLog?.slice(-1)[0]?.at||'',fileName:session?.documentMeta?.fileName||'Untitled contract',clauseCount:reviewable.length,reviewableIds,decisions,openInputs,openApprovals};
}
function renderRestoreBanner() {
  if (!els.restoreBanner) return;
  const pending = state.pendingRestoreSession;
  const meta = state.pendingRestoreMeta || {};
  if (pending?.clauses?.length) {
    const when = meta.savedAt ? ` · ${formatShortDateTime(meta.savedAt)}` : '';
    const clauses = meta.clauseCount ? ` · ${meta.clauseCount} clauses` : '';
    const reviewed = (meta.reviewableIds||[]).filter(id => pending?.clauseReviewStatus?.[id] === 'Reviewed').length;
    const progress = meta.clauseCount ? ` · ${reviewed}/${meta.clauseCount} reviewed` : '';
    const decisions = meta.decisions ? ` · ${meta.decisions} decisions` : '';
    const openWork = (meta.openInputs||meta.openApprovals) ? ` · ${Number(meta.openInputs||0)+Number(meta.openApprovals||0)} inputs/approvals open` : '';
    els.restoreBanner.classList.remove('hidden');
    els.restoreText.textContent = `Resume: ${meta.fileName || pending.documentMeta?.fileName || 'Untitled contract'}${clauses}${progress}${decisions}${openWork}${when}`;
  } else {
    els.restoreBanner.classList.add('hidden');
    els.restoreText.textContent = '';
  }
}
function normalizeDirtyViews(opts={}){ const out={header:false,cockpit:false,navigator:false,clause:false,rightPanel:false,tools:false,restore:false}; RERENDER_VIEW_KEYS.forEach(key=>{ out[key]=!!opts[key]; }); return out; }
function mergeDirtyViews(target, source){ RERENDER_VIEW_KEYS.forEach(key=>{ target[key]=!!(target[key]||source[key]); }); return target; }
function flushScheduledRerender(){ if(!rerenderFrame) return; const pending={...dirtyRenderViews}; if(typeof cancelAnimationFrame==='function') cancelAnimationFrame(rerenderFrame); else clearTimeout(rerenderFrame); rerenderFrame=null; dirtyRenderViews=normalizeDirtyViews({}); renderTargeted(pending); }
function scheduleRerender(opts={}, reason=''){ mergeDirtyViews(dirtyRenderViews, normalizeDirtyViews(opts)); if(reason) pushDiagnosticLog('render', `queued:${reason}`); if(rerenderFrame) return; const schedule = typeof requestAnimationFrame==='function' ? requestAnimationFrame : (fn)=>setTimeout(fn,16); rerenderFrame = schedule(()=>{ const pending={...dirtyRenderViews}; rerenderFrame=null; dirtyRenderViews=normalizeDirtyViews({}); renderTargeted(pending); }); }
function renderTargeted(opts={}){
  const flags=normalizeDirtyViews(opts);
  if(flags.header) renderHeader();
  if(flags.cockpit) renderCockpitStrip();
  if(flags.navigator) renderClauseList();
  if(flags.clause && state.selectedClauseId) renderClauseView();
  if(flags.rightPanel) renderActiveRightPanel();
  if(flags.tools) renderToolsPanel();
  if(flags.restore) renderRestoreBanner();
}
function dispatch(action,payload={}){
  recordDiagnosticAction(action);
  try{
    switch(action){
      case 'SET_POSITION': return setClausePosition(payload.cid,payload.value);
      case 'SET_NEGOTIATION_STATUS': return setClauseNegotiationStatus(payload.cid,payload.value);
      case 'SET_COUNTERPARTY_POSITION': return setClauseCounterpartyPosition(payload.cid,payload.value);
      case 'SET_ROUTE_TAG': return toggleClauseRoutingTag(payload.cid,payload.tag);
      case 'SET_WORKFLOW_MODE': return setWorkflowMode(payload.mode);
      case 'SET_REVIEW_STATUS': return setClauseReviewStatus(payload.cid,payload.value);
      case 'OPEN_TAB': return setActiveTab(payload.tab);
      case 'OPEN_REVIEW_SUBSECTION': { const sub=payload.subSection||'issues'; if(sub==='terms') setActiveToolsTab('terms'); else if(sub==='placeholders') setActiveToolsTab('fills'); else if(sub==='timeline') setActiveToolsTab('timeline'); else { state.reviewSubSection=sub; setActiveTab('review'); scheduleRerender({rightPanel:true},'review-subsection'); } return true; }
      case 'OPEN_STRATEGY_SUBSECTION': state.strategySubSection=payload.subSection||'packages'; setActiveTab('strategy'); scheduleRerender({rightPanel:true},'strategy-subsection'); return true;
      case 'TOGGLE_BOOKMARK': return toggleClauseBookmark(payload.cid||state.selectedClauseId);
      case 'TOGGLE_SNOOZE': return (isClauseSnoozed(payload.cid||state.selectedClauseId)?unsnoozeClause:snoozeClause)(payload.cid||state.selectedClauseId);
      case 'ADD_TO_AGENDA': return addClauseToAgenda(payload.cid||state.selectedClauseId);
      case 'REMOVE_FROM_AGENDA': return removeClauseFromAgenda(payload.cid||state.selectedClauseId);
      case 'START_NEGOTIATION_ROUND': return startNewNegotiationRound();
      case 'NEXT_UNREVIEWED': return jumpToNextUnreviewedClause();
      default: return null;
    }
  }catch(err){
    recordDiagnosticError(`dispatch:${action}`, err);
    throw err;
  }
}
let currentOutputPreviewDownload = null;
function htmlToPlainText(html){
  return String(html||'')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<\/(?:p|div|h[1-6]|li|tr|section|article)>/gi,'\n')
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/&lt;/gi,'<')
    .replace(/&gt;/gi,'>')
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}
function openOutputPreview(title, text, fileName='output_preview.txt', downloadOverride=null){
  if(!els.outputPreviewModal) return;
  closeExportHubModal();
  const audience=/business/i.test(title)?'Internal Business':/leadership|executive/i.test(title)?'Internal Leadership':/client|counterparty|external/i.test(title)?'External Client / Counterparty':'Internal Legal';
  const rawText=String(text||'');const previewText=/Audience:/i.test(rawText.slice(0,160))?rawText:`Audience: ${audience}\n\n${rawText}`;
  const downloadName=fileName||'output_preview.txt';
  els.outputPreviewTitle.textContent=title||'Output preview';
  els.outputPreviewBody.textContent=previewText;
  els.outputPreviewBody.dataset.downloadName=downloadName;
  if(els.downloadOutputPreviewBtn){
    const ext=(downloadName.match(/\.([a-z0-9]+)$/i)?.[1]||'txt').toUpperCase();
    els.downloadOutputPreviewBtn.textContent=`Download .${ext.toLowerCase()}`;
  }
  currentOutputPreviewDownload={
    fileName:downloadName,
    blob:downloadOverride instanceof Blob ? downloadOverride : new Blob([previewText], {type:'text/plain'})
  };
  openModal(els.outputPreviewModal);
}
function closeOutputPreview(){closeModal(els.outputPreviewModal);}
function runDiagnostics(){ return {clauses:state.clauses.length,missingIds:(state.clauses||[]).filter(c=>!c.id).length,undefinedTerms:(state.issues?.undefinedCapitalizedTerms||[]).length,bookmarks:(state.bookmarkedClauseIds||[]).length,ignored:(state.snoozedClauseIds||[]).length,agenda:(state.agendaItems||[]).length}; }

function getDiagnosticsSummary(){
  return {
    build: BUILD_VERSION, clauses: state.clauses.length, notes: state.notes.length, definedTerms: Object.keys(state.definedTerms||{}).length,
    activeTab: state.activeTab, workflowMode: state.workflowMode, navigatorMode: state.navigatorMode,
    autosaveDisabled: !!state.prefs?.disableAutosave, autosaveFailed: !!state.autosaveFailed, pendingRestore: !!state.pendingRestoreSession,
    lastAction: state.diagnostics.lastAction || '—', lastError: state.diagnostics.lastError || '—', lastRender: state.diagnostics.lastRender || '—',
    restoreSource: state.diagnostics.lastRestoreSource || '—'
  };
}
function renderDiagnosticsPanel(){
  if(!els.diagnosticsBody) return;
  const d=getDiagnosticsSummary();
  const extra=runDiagnostics();
  const buckets=[['Document state', Object.keys(getDocumentState()).length],['Review state', Object.keys(getReviewState()).length],['UI state', Object.keys(getUIState()).length],['UI refs', Object.values(uiRefs.panels).filter(Boolean).length + Object.values(uiRefs.modals).filter(Boolean).length],['Missing clause IDs', extra.missingIds],['Undefined terms', extra.undefinedTerms],['Ignored clauses', extra.ignored],['Agenda items', extra.agenda],['Navigator renders', state.diagnostics.renderCounts.navigator||0],['Clause renders', state.diagnostics.renderCounts.clause||0],['Right-panel renders', state.diagnostics.renderCounts.rightPanel||0],['Cockpit renders', state.diagnostics.renderCounts.cockpit||0]];
  const renderLog=(state.diagnostics.recentRenders||[]).slice(0,8);
  const actionLog=(state.diagnostics.recentActions||[]).slice(0,8);
  const errorLog=(state.diagnostics.recentErrors||[]).slice(0,6);
  const logBlock=(title, items)=>`<div class="tool-card compact"><div class="panel-subhead">${escapeHtml(title)}</div>${items.length?`<div class="summary-list diagnostics-log-list">${items.map(item=>`<div class="summary-item"><span>${escapeHtml(item.value)}</span><span class="summary-meta">${escapeHtml(formatShortDateTime(item.at))}</span></div>`).join('')}</div>`:'<div class="mini">No entries.</div>'}</div>`;
  els.diagnosticsBody.innerHTML=`<div class="tool-card compact"><div class="panel-subhead">Build diagnostics</div><div class="mini">Build: ${escapeHtml(d.build)} • Restore source: ${escapeHtml(d.restoreSource)}</div><div class="mini">Last action: ${escapeHtml(d.lastAction)}</div><div class="mini">Last error: ${escapeHtml(d.lastError)}</div><div class="mini">Last render: ${escapeHtml(d.lastRender)}</div><div class="mini">Autosave: ${d.autosaveDisabled?'Disabled':d.autosaveFailed?'Failed':'OK'} • Pending restore: ${d.pendingRestore?'Yes':'No'}</div><div class="diagnostics-grid">${buckets.map(([k,v])=>`<div class="diagnostics-tile"><strong>${escapeHtml(String(v))}</strong><div class="mini">${escapeHtml(k)}</div></div>`).join('')}</div></div>${logBlock('Recent actions', actionLog)}${logBlock('Recent renders', renderLog)}${logBlock('Recent errors', errorLog)}`;
}

function openDiagnosticsModal(){renderDiagnosticsPanel();openModal(els.diagnosticsModal);}
function closeDiagnosticsModal(){closeModal(els.diagnosticsModal);}
function renderReferencedByHtml(cid){
  const refs=findReferringClauses(cid);
  if(!refs.length) return '<div class="mini">Referenced by: none detected.</div>';
  return `<div class="tool-card compact"><div class="panel-subhead">Referenced by</div><div class="referenced-by-list">${refs.map(id=>{const c=(state.clauses||[]).find(x=>x.id===id);return `<button class="link-btn jump-clause" data-clause-id="${escapeHtml(id)}" type="button">${escapeHtml(c?.number||id)}${c?.heading?` — ${escapeHtml(truncateWords(c.heading,8))}`:''}</button>`;}).join('')}</div></div>`;
}

function getNegotiationLeverageScore(clause){
  const intel = evaluateClauseIntelligence(clause) || {};
  const pos = state.clausePositions?.[clause?.id] || '';
  const push = intel.likelyPushback==='High' ? 2 : intel.likelyPushback==='Medium' ? 1 : 0;
  const conf = intel.confidence==='High' ? 2 : intel.confidence==='Medium' ? 1 : 0;
  const route = getClauseRouteTargets(clause?.id||'').length ? 1 : 0;
  const posWt = pos==='Escalate' ? 3 : pos==='Reject' ? 2 : pos==='Seek amendment' ? 1 : 0;
  return Math.max(1, Number(intel.score||0) + push + conf + route + posWt);
}
function getNegotiationStrategyType(clause){
  const leverage = getNegotiationLeverageScore(clause);
  const intel = evaluateClauseIntelligence(clause) || {};
  const pos = state.clausePositions?.[clause?.id] || '';
  if(pos==='Escalate' || leverage>=9) return 'Redline';
  if(leverage>=7) return 'Anchor';
  if(leverage>=4) return 'Tradeable';
  return 'Concede';
}
function getTradeSuggestion(clause){
  const type = String(clause?.type||'General');
  if(type==='Liability') return 'If cap resistance is high, narrow indemnity scope or tighten carve-outs.';
  if(type==='Data Protection') return 'If audit rights stay broad, narrow scope, frequency, notice, and security controls.';
  if(type==='Fees') return 'If payment timing cannot improve, tighten invoice-dispute mechanics and suspension rights.';
  if(type==='Termination') return 'If convenience termination remains, improve notice, fees, and transition support.';
  if(type==='Services') return 'If scope stays broad, tighten assumptions, dependencies, and acceptance criteria.';
  if(type==='Intellectual Property') return 'If ownership cannot move, narrow license scope and reserve pre-existing IP.';
  return 'Trade this point only against a concrete protection elsewhere in the deal.';
}
function getNextBestAction(){
  const unreviewed = getFilteredClauses({content:'all',review:'unreviewed'}).length;
  const escalations = (state.clauses||[]).filter(c=>(state.clausePositions?.[c.id]||'')==='Escalate' || (state.clauseReviewStatus?.[c.id]||'')==='Escalated').length;
  const approvals = (state.clauses||[]).filter(c=>deriveIssueCard(c)?.approvalNeeded==='Yes').length;
  const openNegotiation = getOpenNegotiationClauses().length;
  const snoozedHighRisk = (state.snoozedClauseIds || []).filter(cid => {
    return (state.clauseRiskScores?.[cid] || 'Low') === 'High' && !getClauseDecision(cid).type;
  }).length;
  if(unreviewed>0) return {label:'Review next unreviewed clause', detail:`${unreviewed} clause${unreviewed===1?'':'s'} still need review.`, action:'next-unreviewed'};
  if(escalations>0) return {label:'Resolve escalations', detail:`${escalations} escalation item${escalations===1?'':'s'} need attention.`, action:'escalations'};
  if(approvals>0) return {label:'Prepare approval pack', detail:`${approvals} item${approvals===1?'':'s'} need stakeholder sign-off.`, action:'approval-pack'};
  if(openNegotiation>0) return {label:'Prepare negotiation pack', detail:`${openNegotiation} open negotiation item${openNegotiation===1?'':'s'}.`, action:'negotiation-pack'};
  return {label:'Generate outputs', detail:'The document appears ready for export and final alignment.', action:'outputs'};
}
function getTopDecisionItems(limit=5){
  return [...(state.clauses||[])].map(clause=>({
    clause,
    card: deriveIssueCard(clause),
    leverage: getNegotiationLeverageScore(clause),
    risk: riskWeight(state.clauseRiskScores?.[clause.id]||'Low')
  })).filter(x=>x.card && ((x.card.position && x.card.position!=='No position') || x.card.approvalNeeded==='Yes' || x.risk>=2))
    .sort((a,b)=>(b.leverage+b.risk)-(a.leverage+a.risk))
    .slice(0,limit);
}
function renderNextBestActionCard(){
  const next = getNextBestAction();
  return `<div class="tool-card compact next-best-action-card"><h4>Next best action</h4><div class="workflow-stat">${escapeHtml(next.label)}</div><div class="mini">${escapeHtml(next.detail)}</div><div class="card-actions">${next.action==='approval-pack'?'<button id="copyApprovalPackFromActionBtn" type="button">Copy approval pack</button>':''}${next.action==='negotiation-pack'?'<button id="copyNegotiationPackFromActionBtn" type="button">Copy negotiation pack</button>':''}${next.action==='next-unreviewed'?'<button id="jumpNextUnreviewedFromActionBtn" type="button">Go to clause</button>':''}${next.action==='escalations'?'<button id="openEscalationsFromActionBtn" type="button">Open escalations</button>':''}${next.action==='outputs'?'<button id="openOutputsFromActionBtn" type="button">Open outputs</button>':''}</div></div>`;
}
function renderTopDecisionItemsCard(){
  const items = getTopDecisionItems(5);
  if(!items.length) return '<div class="tool-card compact"><h4>Top decision items</h4><div class="mini">No material decision items captured yet.</div></div>';
  return `<div class="tool-card compact top-decision-items-card"><h4>Top decision items</h4><div class="summary-list">${items.map(({clause,card,leverage})=>`<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(clause.id)}"><strong>${escapeHtml(clause.number||'')}</strong> ${escapeHtml(clause.heading||'')}<div class="summary-meta">${escapeHtml(card.theme||'General')} • ${escapeHtml(card.position||'No position')} • Leverage ${leverage}</div></button>`).join('')}</div></div>`;
}
function getSortedTriageClauses(list){
  return [...(list||[])].sort((a,b)=>{
    const ar = getTriageReasons(a).length ? 1 : 0;
    const br = getTriageReasons(b).length ? 1 : 0;
    if(br!==ar) return br-ar;
    const lev = getNegotiationLeverageScore(b) - getNegotiationLeverageScore(a);
    if(lev) return lev;
    const risk = riskWeight(state.clauseRiskScores?.[b.id]||'Low') - riskWeight(state.clauseRiskScores?.[a.id]||'Low');
    if(risk) return risk;
    return (clauseFlagCount(b)-clauseFlagCount(a));
  });
}

function showToast(message,type='info'){const t=document.createElement('div');t.className=`toast toast-${type}`;t.textContent=message;document.body.appendChild(t);if(els.toastLiveRegion){els.toastLiveRegion.textContent='';setTimeout(()=>{els.toastLiveRegion.textContent=String(message||'');},10);}setTimeout(()=>t.remove(),3000);}
function yieldToUi(){ return new Promise(resolve=>setTimeout(resolve,0)); }
function safeRun(label,fn,{toastMessage}={}){try{return fn();}catch(err){console.error(label,err);recordDiagnosticError(label,err);showToast(toastMessage||`${label} failed`,'error');return null;}}

function getCommandPaletteItems(){
const clause=getSelectedClause();
const base=[];
const push=(section,label,run)=>base.push({section,label,run});
push('Workflow', getActiveWorkflowStage()==='intake'?'Switch to Decide stage':'Switch to Intake stage',()=>setWorkflowStage(getActiveWorkflowStage()==='intake'?'decide':'intake',{preserveTab:true}));
push('Workflow', getActiveWorkflowStage()==='prepare'?'Switch to Decide stage':'Switch to Prepare stage',()=>setWorkflowStage(getActiveWorkflowStage()==='prepare'?'decide':'prepare',{preserveTab:true}));
push('Workflow','Switch to Outputs mode',()=>setWorkflowMode('outputs'));
push('Navigation','Navigate back',()=>navigateBack());
push('Navigation','Navigate forward',()=>navigateForward());
push('Navigation','Jump to next unreviewed',()=>{const n=getFilteredClauses({content:'all',review:'unreviewed'})[0]; if(n) jumpToClause(n.id);});
push('Issues','Open Issue Console',()=>{setActiveTab('review');state.reviewSubSection='issues-console';renderActiveRightPanel();});
push('Issues','Toggle Negotiation Mode',()=>{state.reviewSubSection='issues-console'; state.issueConsole.negotiationMode=!state.issueConsole.negotiationMode; setActiveTab('review'); renderActiveRightPanel();});
push('Outputs','Open Export Hub',()=>openExportHubModal());
push('Outputs','Copy negotiation pack',()=>safeRun('Copy negotiation pack',()=>copyTextToClipboard(formatNegotiationPack(),'Pack copied')));
push('Outputs','Copy approval pack',()=>safeRun('Copy approval pack',()=>copyTextToClipboard(formatApprovalPack(),'Approval pack copied')));
push('Outputs','Copy call prep',()=>safeRun('Copy call prep',()=>copyTextToClipboard(formatMeetingPrep(),'Call prep copied')));
push('Workspace','Save current workspace',()=>saveCurrentWorkspace());
push('Workspace','Start new negotiation round',()=>startNewNegotiationRound());
push('Workspace','Toggle contrast mode',()=>toggleContrastMode());
if(clause && clause.id!==OVERVIEW_ID){
  push('Current clause','Add note to current clause',()=>openAddNoteWorkflow());
  push('Current clause','Copy clause brief',()=>copyTextToClipboard(formatClauseBriefText(state.selectedClauseId),'Brief copied'));
  push('Current clause', isClauseBookmarked(clause.id)?'Remove bookmark':'Bookmark clause',()=>toggleClauseBookmark(clause.id));
  push('Current clause', isInAgenda(clause.id)?'Remove from agenda':'Add clause to agenda',()=>isInAgenda(clause.id)?removeClauseFromAgenda(clause.id):addClauseToAgenda(clause.id));
}
(state.clauses||[]).slice(0,25).forEach(c=>push('Jump to clause',`Jump to ${c.number} ${c.heading}`,()=>jumpToClause(c.id)));
return base;
}
function renderCommandPalette(filter=''){
if(!els.commandPaletteList)return;
const q=String(filter||'').trim().toLowerCase();
const items=getCommandPaletteItems().filter(i=>!q||(`${i.section} ${i.label}`).toLowerCase().includes(q)).slice(0,40);
window.__commandPaletteItems=items;
commandPaletteSelectedIndex=0;
if(!items.length){ els.commandPaletteList.innerHTML='<div class="mini">No matching commands.</div>'; return; }
let html=''; let current='';
items.forEach((i,idx)=>{ if(i.section!==current){ current=i.section; html += `<div class="command-palette-section">${escapeHtml(current)}</div>`; } html += `<button type="button" class="command-palette-item ${idx===0?'active':''}" data-cmd-index="${idx}"><span>${escapeHtml(i.label)}</span><span class="mini command-palette-section-tag">${escapeHtml(i.section)}</span></button>`; });
els.commandPaletteList.innerHTML=html;
els.commandPaletteList.querySelectorAll('.command-palette-item').forEach((btn,idx)=>{btn.addEventListener('click',()=>{const item=items[idx];closeCommandPalette();item?.run();}); btn.addEventListener('mouseenter',()=>{commandPaletteSelectedIndex=idx;updateCommandPaletteSelection();});});
}
function updateCommandPaletteSelection(){
  els.commandPaletteList?.querySelectorAll('.command-palette-item').forEach((btn,i)=>btn.classList.toggle('active',i===commandPaletteSelectedIndex));
}
function openCommandPalette(){openModal(els.commandPaletteModal);renderCommandPalette('');setTimeout(()=>els.commandPaletteInput?.focus(),0);}
function closeCommandPalette(){closeModal(els.commandPaletteModal);}

async function copyTextToClipboard(text,successNotice='Copied'){
const content=String(text||'');let copied=false;
try{await navigator.clipboard.writeText(content);copied=true;}catch{
try{const ta=document.createElement('textarea');ta.value=content;ta.style.cssText='position:fixed;left:-9999px;opacity:0;';document.body.appendChild(ta);ta.select();copied=document.execCommand('copy');ta.remove();}catch{copied=false;}
}
if(copied){state.snapshotNotice=successNotice;renderHeader();setTimeout(()=>{state.snapshotNotice='';renderHeader();},1500);}
else showToast('Copy failed - select and copy text manually.','error');
}

function downloadBlob(fileName,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}

function extractRegexContextExcerpt(text,regex,radius=120,fallback=''){
const v=String(text||'');if(!v)return String(fallback||'');
try{const m=v.match(regex);if(!m||typeof m.index!=='number')return String(fallback||ANALYSIS_CORE.excerpt?.(v,220)||v.slice(0,220));let s=Math.max(0,m.index-radius);let e=Math.min(v.length,m.index+m[0].length+radius);while(s>0&&/[^\s]/.test(v[s-1]))s--;while(e<v.length&&/[^\s]/.test(v[e]))e++;return v.slice(s,e).trim()||String(fallback||ANALYSIS_CORE.excerpt?.(v,220)||v.slice(0,220));}catch{return String(fallback||ANALYSIS_CORE.excerpt?.(v,220)||v.slice(0,220));}
}

/* -- Note helpers -- */
function makeEmptyNoteDraft(clauseId){return{clauseId:clauseId||'',editingId:'',type:'General Comment',text:'',owner:'',routeTo:'',blocker:false,businessCall:false,proposedFallback:''};}
function openInlineNoteDraft(clauseId,source={}){const isEditing=!!source?.editingId; const defaultRoute = !isEditing ? getDefaultRouteForClause(clauseId) : ''; state.noteDraft={...makeEmptyNoteDraft(clauseId),routeTo:defaultRoute,...(source||{}),clauseId:clauseId||source?.clauseId||''};state.noteFormOpen=true;}
function clearInlineNoteDraft(){state.noteDraft=null;state.noteFormOpen=false;}
function focusInlineNoteEditor(){
  requestAnimationFrame(()=>{
    const notesSection=els.clauseView?.querySelector('.clause-section-notes');
    if(notesSection && !notesSection.open) notesSection.open=true;
    const textArea=els.clauseView?.querySelector('.inline-notes-thread textarea[name="text"]');
    const thread=els.clauseView?.querySelector('.inline-notes-thread');
    if(thread?.scrollIntoView) thread.scrollIntoView({block:'center',behavior:'smooth'});
    textArea?.focus();
  });
}
function getInlineNoteDraft(clauseId){if(!state.noteDraft||state.noteDraft.clauseId!==clauseId)return makeEmptyNoteDraft(clauseId);return{...makeEmptyNoteDraft(clauseId),...state.noteDraft,clauseId};}
function populateInlineNoteForm(form,clauseId){
if(!form)return;const d=getInlineNoteDraft(clauseId);
form.dataset.editingId=d.editingId||'';
if(form.querySelector('[name="type"]'))form.querySelector('[name="type"]').value=NOTE_TYPE_OPTIONS.includes(d.type)?d.type:'General Comment';
if(form.querySelector('[name="text"]'))form.querySelector('[name="text"]').value=d.text||'';
if(form.querySelector('[name="owner"]'))form.querySelector('[name="owner"]').value=d.owner||'';
if(form.querySelector('[name="routeTo"]'))form.querySelector('[name="routeTo"]').value=d.routeTo||'';
if(form.querySelector('[name="blocker"]'))form.querySelector('[name="blocker"]').checked=!!d.blocker;
if(form.querySelector('[name="businessCall"]'))form.querySelector('[name="businessCall"]').checked=!!d.businessCall;
if(form.querySelector('[name="proposedFallback"]'))form.querySelector('[name="proposedFallback"]').value=d.proposedFallback||'';
}
function captureInlineNoteDraft(form,clauseId){
if(!form)return;
state.noteDraft={clauseId,editingId:form.dataset.editingId||'',type:String(form.querySelector('[name="type"]')?.value||'General Comment'),text:String(form.querySelector('[name="text"]')?.value||''),owner:String(form.querySelector('[name="owner"]')?.value||'').trim(),routeTo:String(form.querySelector('[name="routeTo"]')?.value||''),blocker:!!form.querySelector('[name="blocker"]')?.checked,businessCall:!!form.querySelector('[name="businessCall"]')?.checked,proposedFallback:String(form.querySelector('[name="proposedFallback"]')?.value||'').trim()};
}

/* -- Matter helpers -- */
function getMatterDetails(){
const m=state.documentMeta?.matter&&typeof state.documentMeta.matter==='object'?state.documentMeta.matter:{};
return{
counterparty:typeof m.counterparty==='string'?m.counterparty:'',
businessUnit:typeof m.businessUnit==='string'?m.businessUnit:'',
dealValueBand:typeof m.dealValueBand==='string'?m.dealValueBand:'',
jurisdiction:typeof m.jurisdiction==='string'?m.jurisdiction:'',
riskAppetite:typeof m.riskAppetite==='string'?m.riskAppetite:'Medium',
role:typeof m.role==='string'&&m.role?m.role:'Neutral',
strategyNote:typeof m.strategyNote==='string'?m.strategyNote:''
};
}
function matterSummaryLine(){const m=getMatterDetails();const b=[];if(m.role)b.push(`Role: ${m.role}`);if(m.counterparty)b.push(`Counterparty: ${m.counterparty}`);if(m.businessUnit)b.push(`Business: ${m.businessUnit}`);if(m.dealValueBand)b.push(`Value: ${m.dealValueBand}`);if(m.jurisdiction)b.push(`Jurisdiction: ${m.jurisdiction}`);b.push(`Risk appetite: ${m.riskAppetite||'Medium'}`);return b.join(' * ');}


function setMatterField(field,value){
state.documentMeta||={};state.documentMeta.matter||={};
const n=String(value||'');
if((state.documentMeta.matter[field]||'')===n)return;
state.documentMeta.matter[field]=n;
clearTimeout(matterFieldDebounceTimer);
matterFieldDebounceTimer=setTimeout(()=>onSubstantiveChange(),120);
}
function captureLandingIntake(){
const m=readLandingIntake();
if(els.landing?.classList.contains('hidden')){state.documentMeta||={};state.documentMeta.matter={...m};}
return m;
}
function readLandingIntake(){return{role:String(els.intakeRoleSelect?.value||'Neutral'),counterparty:String(els.intakeCounterpartyInput?.value||'').trim(),jurisdiction:String(els.intakeJurisdictionSelect?.value||''),riskAppetite:String(els.intakeRiskAppetiteSelect?.value||'Medium'),businessUnit:'',dealValueBand:'',strategyNote:''};}
function clearLandingIntakeForNewMatter(){if(els.intakeRoleSelect)els.intakeRoleSelect.value='Neutral';if(els.intakeCounterpartyInput)els.intakeCounterpartyInput.value='';if(els.intakeJurisdictionSelect)els.intakeJurisdictionSelect.value='';if(els.intakeRiskAppetiteSelect)els.intakeRiskAppetiteSelect.value='Medium';}
function syncQuickIntakeFromState() {
  const role = document.getElementById('intakeRoleSelectQuick');
  const jur = document.getElementById('intakeJurisdictionSelectQuick');
  const matter = getMatterDetails();
  if (role && matter.role) role.value = matter.role;
  if (jur && matter.jurisdiction) jur.value = matter.jurisdiction;
}
function syncLandingIntakeFromMatter(){
const m=getMatterDetails();
if(els.intakeRoleSelect) els.intakeRoleSelect.value=m.role||'Neutral';
if(els.intakeCounterpartyInput) els.intakeCounterpartyInput.value=m.counterparty||'';
if(els.intakeJurisdictionSelect) els.intakeJurisdictionSelect.value=m.jurisdiction||'';
if(els.intakeRiskAppetiteSelect) els.intakeRiskAppetiteSelect.value=m.riskAppetite||'Medium';
syncQuickIntakeFromState();
}
function invalidateClauseIntelligenceCache(cid){
  if(!state.intelligenceCache||typeof state.intelligenceCache!=='object') state.intelligenceCache={};
  if(cid) delete state.intelligenceCache[cid];
  else state.intelligenceCache={};
}
function normalizeMatterForCache(){
  const m=getMatterDetails();
  return `${m.role||''}::${m.riskAppetite||''}::${m.dealValueBand||''}`;
}
function bindMatterDetailsControls(container=document){container.querySelectorAll('[data-matter-field]').forEach(el=>{const f=el.dataset.matterField;if(!f)return;const h=()=>setMatterField(f,el.value||'');el.addEventListener('change',h);if(el.tagName==='INPUT')el.addEventListener('blur',h);});}
function getRiskThresholds(){const a=getMatterDetails().riskAppetite||'Medium';if(a==='Low')return{high:4,medium:2};if(a==='High')return{high:6,medium:3};return{high:5,medium:2};}
function getRoleRiskAdjustment(type='General'){
  const role=String(getMatterDetails().role||'Neutral');
  if(role==='Neutral') return 0;
  const supplierSensitive=new Set(['Liability','Indemnity','Data Protection','Intellectual Property','Audit','Termination']);
  const customerSensitive=new Set(['Services','Fees','Payment Terms','Service Levels','Data Protection','Confidentiality','Termination']);
  if(role==='Supplier'){
    if(supplierSensitive.has(type)) return 1;
    if(customerSensitive.has(type)) return -1;
    return 0;
  }
  if(role==='Customer'){
    if(customerSensitive.has(type)) return 1;
    if(supplierSensitive.has(type)) return -1;
    return 0;
  }
  return 0;
}

/* -- Snapshot/session helpers -- */
function getSnapshotItemsCache(){return Array.isArray(state.snapshotItems)?state.snapshotItems:[];}
function setSnapshotItemsCache(items){state.snapshotItems=Array.isArray(items)?items:[];}
function setMobileBackdropVisible(v){if(els.mobileBackdrop)els.mobileBackdrop.classList.toggle('hidden',!v);}
function getMyInboxInitials(prompt=false){try{const s=localStorage.getItem('cockpit-my-initials');if(s&&s.trim())return s.trim().toUpperCase();}catch{}try{const prefs=loadPrefs();const p=String(prefs.myInitials||'').trim();if(p){localStorage.setItem('cockpit-my-initials',p.toUpperCase());return p.toUpperCase();}}catch{}const n=(state.notes||[]).map(n=>String(n.owner||'').trim()).find(Boolean);if(n)return n.toUpperCase();if(prompt){const e=window.prompt('Set initials for My Inbox filter','')||'';const norm=e.trim().toUpperCase();if(norm){try{localStorage.setItem('cockpit-my-initials',norm);}catch{}showToast(`My Inbox initials set to ${norm}`,'info');return norm;}}return '';}
function ensureMyInboxInitials(){return getMyInboxInitials(true);}
function getClauseOrderIndex(cid){return Math.max(0,(state.clauses||[]).findIndex(c=>c.id===cid));}
function termHasEarlyUse(t){if(!t?.definedInClauseId||!Array.isArray(t.usedInClauseIds))return false;const d=getClauseOrderIndex(t.definedInClauseId);return t.usedInClauseIds.some(id=>getClauseOrderIndex(id)<d);}

function getClauseRouteTargets(cid){
const direct = new Set(state.clauseRoutingTags?.[cid] || []);
(state.notes||[]).filter(n=>n.clauseId===cid).forEach(n=>{
  const rt = String(n.routeTo||'').trim();
  if(rt==='Business') direct.add('Needs Business Input');
  else if(rt==='Privacy') direct.add('Needs Privacy Review');
  else if(rt==='Finance') direct.add('Needs Finance Input');
  else if(rt==='Leadership') direct.add('Escalate to Leadership');
});
return [...direct];
}
function deriveClauseReviewStatus(cid){
  const pos = state.clausePositions?.[cid] || '';
  const notes = (state.notes||[]).filter(n=>n.clauseId===cid);
  if(pos==='Escalate' || notes.some(n=>n.blocker || String(n.routeTo||'')==='Leadership')) return 'Escalated';
  if(pos && state.verificationByKey?.[`clause-source-${cid}`]==='confirmed') return 'Reviewed';
  if(pos) return 'In review';
  if(notes.length) return 'In review';
  return 'Not reviewed';
}
function getClauseCompletionState(cid){
  const decision=getClauseDecision(cid);const decisionComplete=!!decision.type&&getDecisionCompletionState(cid).complete;
  const sourceVerified=state.verificationByKey?.[`clause-source-${cid}`]==='confirmed';
  const reviewComplete=decisionComplete&&sourceVerified;
  const approvalStatus=String(state.clauseApprovalStatus?.[cid]||decision.approvalStatus||'');
  const approvalResolved=decision.type!=='escalate'||approvalStatus==='Approved';
  const inputResolved=decision.type!=='need-input';
  const negotiationStatus=state.clauseNegotiationStatus?.[cid]||deriveNegotiationStatus(cid)||'';
  const negotiationRequired=['accept-with-changes','seek-amendment','reject'].includes(decision.type);
  const negotiationResolved=!negotiationRequired||negotiationStatus==='Agreed'||decision.status==='Agreed';
  return{decisionComplete,sourceVerified,reviewComplete,approvalResolved,inputResolved,negotiationResolved,negotiationRequired,negotiationStatus};
}
function refreshDerivedClauseState(cid){
  const next = deriveClauseReviewStatus(cid);
  if(!next || next==='Not reviewed') delete state.clauseReviewStatus[cid];
  else state.clauseReviewStatus[cid] = next;
}
function getIssueStage(cid){
  const pos = state.clausePositions?.[cid] || '';
  const review = deriveClauseReviewStatus(cid);
  const routes = getClauseRouteTargets(cid);
  const neg = state.clauseNegotiationStatus?.[cid] || deriveNegotiationStatus(cid) || '';
  if(!pos && review==='Not reviewed') return 'Not reviewed';
  if(routes.some(route=>route!=='Legal Only')) return 'Awaiting input';
  if(neg && neg!=='Agreed') return 'Negotiation in progress';
  if(pos==='Acceptable' || neg==='Agreed') return 'Ready to sign';
  if(review==='Reviewed' || review==='Escalated') return 'In legal review';
  return 'In legal review';
}

function deriveNegotiationStatus(cid){
  const pos = state.clausePositions?.[cid] || '';
  const cp = String(state.clauseCounterpartyPositions?.[cid] || '').trim();
  if(!pos) return '';
  if(pos==='Acceptable') return 'Agreed';
  return cp ? 'In negotiation' : 'Open';
}
function getOpenNegotiationClauses(){
  return (state.clauses||[]).filter(c=>{
    const p = state.clausePositions?.[c.id] || '';
    return p && !['Acceptable',''].includes(p);
  });
}

function getDecisionCompletionMetrics(){
  const clauses = state.clauses||[];
  const total = clauses.length || 0;
  const material = clauses.filter(c=>{
    const risk = state.clauseRiskScores?.[c.id] || 'Low';
    const pos = state.clausePositions?.[c.id] || '';
    const routing = getClauseRouteTargets(c.id);
    return risk==='High' || !!pos || routing.length || isInAgenda(c.id);
  });
  const materialTotal = material.length || 0;
  const withPosition = material.filter(c=>!!(state.clausePositions?.[c.id]||'')).length;
  const withFallback = material.filter(c=>{
    const pos = state.clausePositions?.[c.id] || '';
    if(!pos || pos==='Acceptable') return false;
    return !!String((deriveIssueCard(c)?.fallback)||state.clauseFallbacks?.[c.id]||'').trim();
  }).length;
  const routed = material.filter(c=>getClauseRouteTargets(c.id).length>0).length;
  const withOwner = material.filter(c=>(state.notes||[]).some(n=>n.clauseId===c.id && String(n.owner||'').trim())).length;
  const placeholdersOpen = (state.placeholders||[]).filter(p=>!p.resolved).length;
  const issues = getIssueConsoleItems();
  const blocked = issues.filter(i=>i.status!=='Resolved' && (i.blocker || /Leadership/i.test(i.route||''))).length;
  const pct = (n,d)=> d ? Math.round((n/d)*100) : 0;
  return {
    total,
    materialTotal,
    withPosition,
    withFallback,
    routed,
    withOwner,
    placeholdersOpen,
    blocked,
    positionPct:pct(withPosition, materialTotal),
    fallbackPct:pct(withFallback, material.filter(c=>{
      const pos = state.clausePositions?.[c.id] || '';
      return !!pos && pos!=='Acceptable';
    }).length),
    ownerPct:pct(withOwner, materialTotal)
  };
}

function getOpenLoopItems(routeFilter=''){
  const items = getIssueConsoleItems().filter(i=>i.status!=='Resolved').map(i=>{
    const clause=(state.clauses||[]).find(c=>c.id===i.clauseId);
    const routes=getClauseRouteTargets(i.clauseId);
    const fallback=String((deriveIssueCard(clause||{})?.fallback)||state.clauseFallbacks?.[i.clauseId]||'').trim();
    const hasOwner=(state.notes||[]).some(n=>n.clauseId===i.clauseId && String(n.owner||'').trim());
    const missing=[];
    if(!i.position) missing.push('position');
    if(i.position && i.position!=='Acceptable' && !fallback) missing.push('fallback');
    if(routes.length && !hasOwner) missing.push('owner');
    if((state.placeholders||[]).some(p=>p.clauseId===i.clauseId && !p.resolved)) missing.push('placeholder');
    return {...i, clause, routes, fallback, hasOwner, missing};
  }).filter(i=>i.missing.length || i.route!=='Legal Only' || /Awaiting input|Negotiating|Open/.test(i.status||''));
  if(!routeFilter || routeFilter==='all') return items;
  const rf=routeFilter.toLowerCase();
  return items.filter(i=> (i.route||'').toLowerCase().includes(rf) || i.routes.some(r=>r.toLowerCase().includes(rf)));
}

function buildNegotiationPackages(){
  return groupNegotiationThemes().map(([theme, entries])=>{
    const clauses=entries.map(x=>x.clause);
    const clauseIds=clauses.map(c=>c.id);
    const routes=new Set(clauseIds.flatMap(cid=>getClauseRouteTargets(cid)));
    const riskMix=countByValue(Object.fromEntries(clauseIds.map(cid=>[cid,state.clauseRiskScores?.[cid]||'Low'])));
    const pending=clauseIds.filter(cid=>getIssueStatusLabel(cid)!=='Resolved').length;
    const leadership=clauseIds.filter(cid=>getClauseRouteTargets(cid).some(r=>/Leadership/i.test(r)) || (state.clausePositions?.[cid]||'')==='Escalate').length;
    const fallbackGaps=clauseIds.filter(cid=>{
      const pos=state.clausePositions?.[cid]||'';
      if(!pos || pos==='Acceptable') return false;
      const clause=clauses.find(c=>c.id===cid);
      return !String((deriveIssueCard(clause)?.fallback)||state.clauseFallbacks?.[cid]||'').trim();
    }).length;
    const leverage=Math.max(...entries.map(x=>Number(x.intel?.leverageScore||0)),0);
    return {theme, entries, clauses, routes:[...routes], riskMix, pending, leadership, fallbackGaps, leverage};
  });
}

function renderDecisionCompletionCard(){
  const m=getDecisionCompletionMetrics();
  return `<div class="tool-card compact decision-completion-card"><h4>Decision completion</h4><div class="overview-grid"><div class="overview-card"><div class="overview-stat">${m.positionPct}%</div><div class="mini">Material clauses with position</div></div><div class="overview-card"><div class="overview-stat">${m.fallbackPct}%</div><div class="mini">Open clauses with fallback</div></div><div class="overview-card"><div class="overview-stat">${m.ownerPct}%</div><div class="mini">Material clauses with owner</div></div><div class="overview-card"><div class="overview-stat">${m.placeholdersOpen}</div><div class="mini">Unresolved placeholders</div></div></div><div class="summary-list" style="margin-top:.65rem;"><div class="summary-item"><span>Material clauses in scope</span><span class="summary-meta">${m.materialTotal}</span></div><div class="summary-item"><span>Routed clauses</span><span class="summary-meta">${m.routed}</span></div><div class="summary-item"><span>Blocked / leadership-sensitive</span><span class="summary-meta">${m.blocked}</span></div></div></div>`;
}

function renderOpenLoopsCard(routeFilter='all'){
  const items=getOpenLoopItems(routeFilter).slice(0,8);
  const grouped={Business:getOpenLoopItems('business').length, Privacy:getOpenLoopItems('privacy').length, Finance:getOpenLoopItems('finance').length, Leadership:getOpenLoopItems('leadership').length};
  return `<div class="tool-card compact open-loops-card"><h4>Open loops</h4><div class="dashboard-actions compact"><button type="button" class="sub-pill ${routeFilter==='all'?'active':''}" data-openloop-filter="all">All</button><button type="button" class="sub-pill ${routeFilter==='business'?'active':''}" data-openloop-filter="business">Business ${grouped.Business?`(${grouped.Business})`:''}</button><button type="button" class="sub-pill ${routeFilter==='privacy'?'active':''}" data-openloop-filter="privacy">Privacy ${grouped.Privacy?`(${grouped.Privacy})`:''}</button><button type="button" class="sub-pill ${routeFilter==='finance'?'active':''}" data-openloop-filter="finance">Finance ${grouped.Finance?`(${grouped.Finance})`:''}</button><button type="button" class="sub-pill ${routeFilter==='leadership'?'active':''}" data-openloop-filter="leadership">Leadership ${grouped.Leadership?`(${grouped.Leadership})`:''}</button></div>${items.length?`<div class="summary-list" style="margin-top:.65rem;">${items.map(i=>`<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(i.clauseId)}"><strong>${escapeHtml(i.clauseNumber||'')}</strong> ${escapeHtml(i.heading||i.title||'Untitled clause')}<div class="summary-meta">${escapeHtml(i.route||'Legal Only')} • missing ${escapeHtml(i.missing.join(', ')||'none')} • ${escapeHtml(i.status||'Open')}</div></button>`).join('')}</div>`:'<div class="mini" style="margin-top:.65rem;">No open loops in this lane.</div>'}<div class="card-actions"><button type="button" id="openIssueConsoleFromLoopsBtn">Open issue console</button><button type="button" id="openNegotiateFromLoopsBtn">Open negotiate workspace</button></div></div>`;
}


function buildNegotiationPackagesContent(){
  const bundles=buildNegotiationPackages();
  const openLoopFilter=state.strategyPackageFilter||'all';
  const bundleHtml = bundles.length
    ? `<div class="package-bundle-grid">${bundles.map(bundle=>{
        const clauseList = bundle.clauses.slice(0,5).map(c=>`<button type="button" class="summary-item jump-clause package-clause-item" data-clause-id="${escapeHtml(c.id)}"><strong>${escapeHtml(c.number||'')}</strong> ${escapeHtml(c.heading||'')}</button>`).join('');
        const moreHtml = bundle.clauses.length>5 ? `<div class="mini">+ ${bundle.clauses.length-5} more clause${bundle.clauses.length-5===1?'':'s'}</div>` : '';
        return `<div class="package-bundle-card"><div class="package-bundle-head"><strong>${escapeHtml(bundle.theme)}</strong><span class="clause-pill">Leverage ${escapeHtml(String(bundle.leverage||0))}</span></div><div class="mini">${bundle.clauses.length} clause${bundle.clauses.length===1?'':'s'} • ${bundle.pending} open • ${bundle.fallbackGaps} fallback gap${bundle.fallbackGaps===1?'':'s'}</div><div class="mini">Routes: ${escapeHtml(bundle.routes.join(' • ') || 'Legal Only')}</div><div class="mini">Risk mix: H ${bundle.riskMix.High||0} • M ${bundle.riskMix.Medium||0} • L ${bundle.riskMix.Low||0}</div><div class="package-clause-list">${clauseList}${moreHtml}</div><div class="card-actions"><button type="button" class="btn btn-xs package-open-first-btn" data-clause-id="${escapeHtml(bundle.clauses[0]?.id||'')}">Open first</button><button type="button" class="btn btn-xs package-filter-btn" data-package-theme="${escapeHtml(bundle.theme)}">Focus theme</button></div></div>`;
      }).join('')}</div>`
    : '<div class="mini" style="margin-top:.75rem;">No negotiation packages yet. Set positions on material clauses to create theme bundles.</div>';
  const routeButtons = [
    ['business','Needs Business Input'],
    ['privacy','Needs Privacy Review'],
    ['finance','Needs Finance Input'],
    ['leadership','Escalate to Leadership']
  ].map(([key,label])=>`<button type="button" class="summary-item strategy-route-filter-btn" data-openloop-filter="${key}"><span>${escapeHtml(label)}</span><span class="summary-meta">${getOpenLoopItems(key).length}</span></button>`).join('');
  return `${renderDecisionCompletionCard()}${renderOpenLoopsCard(openLoopFilter)}<div class="tool-card compact"><div class="panel-subhead">Negotiation packages</div><div class="mini">Grouped by theme so linked clauses can be reviewed together.</div>${bundleHtml}</div><div class="tool-card compact stakeholder-inbox-card"><div class="panel-subhead">Stakeholder inbox</div><div class="summary-list">${routeButtons}</div><div class="mini" style="margin-top:.5rem;">Open loops stay visible here until position, fallback, owner, and dependency capture are complete.</div></div>`;
}

function getStrategyFilteredClauses(){
  const all = getOpenNegotiationClauses();
  const preset = state.strategyFilterPreset || 'all';
  const themeFocus = String(state.strategyThemeFocus||'').trim();
  let scoped = all;
  if(themeFocus){
    scoped = scoped.filter(c=>inferNegotiationTheme(c)===themeFocus);
  }
  if(preset==='escalations') return scoped.filter(c=>(state.clausePositions?.[c.id]||'')==='Escalate' || (state.clauseReviewStatus?.[c.id]||'')==='Escalated');
  if(preset==='business') return scoped.filter(c=>getClauseRouteTargets(c.id).includes('Needs Business Input'));
  if(preset==='leadership') return scoped.filter(c=>getClauseRouteTargets(c.id).some(r=>/Leadership/i.test(r)) || (state.clausePositions?.[c.id]||'')==='Escalate');
  if(preset==='open') return scoped.filter(c=>!!(state.clausePositions?.[c.id]||''));
  return scoped;
}
function computeSigningReadinessChecks(){
  const unresolvedPlaceholders = (state.placeholders||[]).filter(p=>!p.resolved).length;
  const brokenXrefs = new Set([...(state.issues?.crossReferenceBreaks||[]),...(state.issues?.unresolvedCrossReferencedDefinitions||[])].map(i=>`${i.clauseId||''}:${i.reference||i.term||i.text||''}`)).size;
  const undefinedTerms = (state.issues?.undefinedCapitalizedTerms||[]).length;
  const missingClauses = (state.expectedClauseCoverage?.missing||[]).length;
  const reviewable=getReviewableClauses();
  const unreviewed = reviewable.filter(c=>!getClauseCompletionState(c.id).reviewComplete).length;
  const escalations = (state.clauses||[]).filter(c=>(state.clausePositions?.[c.id]||'')==='Escalate' || (state.clauseReviewStatus?.[c.id]||'')==='Escalated').length;
  const openNegotiation = reviewable.filter(c=>!getClauseCompletionState(c.id).negotiationResolved).length;
  const snoozedHighRisk = (state.snoozedClauseIds || []).filter(cid => {
    return (state.clauseRiskScores?.[cid] || 'Low') === 'High' && !getClauseDecision(cid).type;
  }).length;
  const checks = [
    {label:'Placeholders resolved', ok: unresolvedPlaceholders===0, count: unresolvedPlaceholders, action:'placeholders'},
    {label:'Cross-references valid', ok: brokenXrefs===0, count: brokenXrefs, action:'issues'},
    {label:'Defined terms consistent', ok: undefinedTerms===0, count: undefinedTerms, action:'terms'},
    {label:'Expected clauses present', ok: missingClauses===0, count: missingClauses, action:'expected'},
    {label:'All clauses reviewed', ok: unreviewed===0, count: unreviewed, action:'unreviewed'},
    {label:'No open escalations', ok: escalations===0, count: escalations, action:'escalations'},
    {label:'Negotiation items closed', ok: openNegotiation===0, count: openNegotiation, action:'open-negotiation'},
    {label:'No snoozed high-risk clauses', ok: snoozedHighRisk===0, count: snoozedHighRisk, action:'unsnooze'}
  ];
  const level = checks.every(c=>c.ok) ? 'Ready' : checks.filter(c=>!c.ok).length <= 2 ? 'Conditional' : 'Not Ready';
  
return {level, checks};
}

function getDealValueWeight(){
  const band = String(getMatterDetails().dealValueBand||'').toLowerCase();
  if(/high|large|significant|enterprise|strategic|major|\b[5-9]\d?m|\d{2,}m/.test(band)) return 2;
  if(/mid|medium|moderate|\b1?\d?m/.test(band)) return 1;
  return 0;
}

function getRiskAppetiteAdjustment(){
  const appetite = String(getMatterDetails().riskAppetite||'Medium');
  return appetite==='Low' ? 1 : appetite==='High' ? -1 : 0;
}
function buildObligationBalanceCard() {
  if (!state.obligations || !state.obligations.length) return '';
  const byParty = {};
  state.obligations.forEach(o => {
    const party = typeof ANALYSIS_CORE.canonicalizeObligationParty==='function'?ANALYSIS_CORE.canonicalizeObligationParty(o.party||'Unspecified',state.rawText||''):String(o.party || 'Unspecified').trim();
    if (!byParty[party]) byParty[party] = { total: 0, byType: {} };
    byParty[party].total++;
    const type = o.topic || 'General';
    byParty[party].byType[type] = (byParty[party].byType[type] || 0) + 1;
  });
  const parties = Object.entries(byParty).sort((a, b) => b[1].total - a[1].total);
  if (parties.length < 2) return '';
  const rows = parties.map(([party, data]) => {
    const topTypes = Object.entries(data.byType).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type, count]) => `${type} (${count})`).join(', ');
    return `<div class="obligation-party-row"><div class="obligation-party-name">${escapeHtml(party)}</div><div class="obligation-party-count">${data.total} obligation${data.total === 1 ? '' : 's'}</div><div class="obligation-party-types mini">${escapeHtml(topTypes)}</div></div>`;
  }).join('');
  const principalAliases=typeof ANALYSIS_CORE.detectPrincipalParties==='function'?ANALYSIS_CORE.detectPrincipalParties(state.rawText||'').map(p=>p.alias):[];
  const principalRows=principalAliases.map(alias=>parties.find(([party])=>party.toLowerCase()===alias.toLowerCase())).filter(Boolean).slice(0,2);
  const comparison=principalRows.length===2?principalRows:parties.filter(([party])=>!['Unspecified','Either party','Both parties','Unknown'].includes(party)).slice(0,2);
  let flag='';
  if(comparison.length===2){
    const [high,low]=[...comparison].sort((a,b)=>b[1].total-a[1].total);
    const ratio=low[1].total>0?high[1].total/low[1].total:0;
    if(ratio>1.5)flag=`<div class="mini warn-text">Principal-party obligation load is ${ratio.toFixed(1)}× higher for ${escapeHtml(high[0])} — review the allocation, not incidental role buckets.</div>`;
  }
  return `<div class="tool-card compact"><h4>Obligation balance</h4><div class="obligation-balance-grid">${rows}</div>${flag}</div>`;
}

function inferNegotiationTheme(clause){
  const type = String(clause?.type||'General');
  const body = `${clause?.heading||''} ${clause?.body||''}`.toLowerCase();
  if(type==='Liability' || /liability|indemn|cap|damages/.test(body)) return 'Liability exposure';
  if(type==='Data Protection' || /privacy|personal data|processor|controller|security|breach|transfer/.test(body)) return 'Data protection';
  if(type==='Fees' || /fees?|payment|invoice|charges|tax/.test(body)) return 'Payment protection';
  if(type==='Services' || /services|scope|deliverables|milestone|acceptance|sla|service level/.test(body)) return 'Service delivery';
  if(type==='Termination' || /termination|exit|transition|survival|suspend/.test(body)) return 'Exit / termination';
  if(type==='Intellectual Property' || /intellectual property|ip|ownership|license|work product/.test(body)) return 'IP ownership';
  if(type==='Confidentiality' || /confidential|non-disclosure|disclos/.test(body)) return 'Information control';
  return 'General commercial';
}

function computeClauseIntelligence(clause){
  if(!clause) return null;
  const cid = clause.id;
  const text = `${clause.heading||''} ${clause.body||''}`;
  const body = text.toLowerCase();
  const type = String(clause.type||'General');
  const pos = state.clausePositions?.[cid] || '';
  const routes = getClauseRouteTargets(cid);
  const riskDrivers = [];
  const missingProtections = [];
  const fallbackOptions = [];
  const consequence = [];
  let score = getClauseTypeLegalWeight(type);

  const addDriver = (msg, weight=1) => { if(!riskDrivers.includes(msg)){ riskDrivers.push(msg); score += weight; } };
  const addMissing = (msg, weight=1) => { if(!missingProtections.includes(msg)){ missingProtections.push(msg); score += weight; } };
  const addFallback = (msg) => { if(msg && !fallbackOptions.includes(msg)) fallbackOptions.push(msg); };
  const addConsequence = (msg) => { if(msg && !consequence.includes(msg)) consequence.push(msg); };
  const has = (re) => re.test(body);

  if(type==='Liability'){
    if(/unlimited|without limit|uncapped/.test(body)) addDriver('Potentially uncapped liability exposure',3);
    if(!has(/shall not exceed|not exceed|aggregate liability|liability cap|cap on liability|limit(?:ation)? of liability/)) addMissing('No clear liability cap detected',2);
    if(has(/shall not exceed|not exceed|aggregate liability|liability cap|cap on liability|limit(?:ation)? of liability/) && !has(/fees?|charges?|amounts paid|amounts payable|twelve months|12 months|preceding 12 months|contract value/)) addDriver('Cap appears not clearly tied to fees, spend, or time period',2);
    if(!has(/indirect|consequential|special|incidental|punitive/)) addMissing('No exclusion for indirect / consequential damages detected',1);
    addFallback('Tie liability cap to fees paid or payable over an agreed period.');
    addFallback('Exclude indirect, consequential, incidental, and punitive losses.');
    addConsequence('Accepting this position may leave exposure disproportionate to deal value.');
  } else if(type==='Indemnity'){
    if(!has(/third[- ]party|claim|demand|proceeding/)) addMissing('No clear third-party claim trigger detected',2);
    if(!has(/defen[cs]e|control of (?:the )?defen[cs]e|settlement/)) addMissing('No defence or settlement-control mechanics detected',1);
    if(!has(/prompt(?:ly)? notify|notice of (?:the )?claim|written notice/)) addMissing('No claim-notice procedure detected',1);
    if(has(/all losses|any and all|unlimited|without limit/)) addDriver('Broad or potentially uncapped indemnity wording detected',2);
    addFallback('Limit indemnity to defined third-party claims and add notice, defence, cooperation, and settlement controls.');
    addConsequence('Unqualified indemnity wording can create exposure beyond the intended risk allocation.');
  } else if(type==='Data Protection'){
    if(!has(/24 hours|48 hours|72 hours|without undue delay|prompt(?:ly)?/)) addMissing('No clear breach notification timing detected',2);
    if(!has(/sub-processor|subprocessor/)) addMissing('No explicit sub-processor controls detected',1);
    if(!has(/transfer|location|localization|residen/)) addMissing('No transfer / residency position detected',1);
    if(has(/audit/)) addDriver('Audit rights may require operational and security qualification',1);
    addFallback('Set reasonable breach timing and qualify sub-processor / audit obligations.');
    addConsequence('Acceptance may create open-ended compliance and security burdens.');
  } else if(type==='Confidentiality'){
    if(!has(/solely|only.*purpose|permitted purpose/)) addMissing('No clear use restriction / permitted purpose language detected',1);
    if(!has(/return|destroy|delete/)) addMissing('No return / destroy obligation detected',1);
    addFallback('Limit use to the permitted purpose and add return / destroy mechanics.');
    addConsequence('Loose confidentiality wording can reduce practical control over sensitive information.');
  } else if(type==='Termination'){
    if(!has(/convenience/)) addMissing('No termination for convenience right detected',1);
    if(!has(/cure|remedy period|notice/)) addMissing('No clear cure or notice period detected',1);
    if(!has(/transition|exit assistance|wind[- ]down/)) addMissing('No exit / transition support wording detected',1);
    addFallback('Add cure periods, convenience termination where needed, and transition support boundaries.');
    addConsequence('Weak exit rights can trap the business in an underperforming arrangement.');
  } else if(type==='Fees'){
    if(!has(/30 days|45 days|60 days|within .* days/)) addMissing('No clear invoice payment timing detected',1);
    if(!has(/dispute|disputed invoice/)) addMissing('No disputed-invoice process detected',1);
    if(!has(/change control|change order|variation/)) addMissing('No clear commercial change mechanism detected',1);
    addFallback('Set payment timing, disputed invoice mechanics, and change control linkage.');
    addConsequence('Acceptance may weaken leverage on invoice timing, scope creep, and payment disputes.');
  } else if(type==='Services'){
    if(!has(/dependencies|assumption|client responsibility/)) addMissing('Dependencies / client inputs not clearly allocated',1);
    if(!has(/acceptance|milestone|deliverable/)) addMissing('Acceptance or milestone structure not clearly stated',1);
    if(!has(/change control|change request|variation/)) addMissing('No change control mechanism detected',1);
    addFallback('Clarify scope, dependencies, acceptance triggers, and change control.');
    addConsequence('Operational delivery risk increases where scope and dependencies remain open-ended.');
  } else if(type==='Intellectual Property'){
    if(!has(/pre-existing|background|retained/)) addMissing('No clear protection for pre-existing / background IP detected',2);
    if(!has(/license/)) addMissing('No explicit license scope detected',1);
    addFallback('Reserve pre-existing IP and narrow any license grant to what is operationally necessary.');
    addConsequence('Acceptance may unintentionally transfer or dilute ownership in pre-existing IP.');
  } else if(type==='Audit'){
    if(!has(/reasonable notice|business hours|annual|once per year/)) addMissing('Audit rights lack clear procedural limits',1);
    addFallback('Limit audit scope, frequency, notice, and access mechanics.');
    addConsequence('Unbounded audit rights can create material operational and confidentiality burdens.');
  }

  if(routes.length) addDriver(`Internal routing required: ${routes.join(', ')}`,1);
  if(pos==='Reject' || pos==='Escalate') addDriver(`Negotiation position is ${pos}`,2);
  else if(pos==='Seek amendment' || pos==='Accept with changes') addDriver(`Negotiation position is ${pos}`,1);
  if((state.clauseCounterpartyPositions?.[cid]||'').trim()) addDriver('Counterparty has already stated a view on this point',1);

  score += getDealValueWeight();
  score += getRiskAppetiteAdjustment();
  score += getRoleRiskAdjustment(type);

  const confidence = (riskDrivers.length + missingProtections.length >= 4 || score >= 7) ? 'High' : (riskDrivers.length + missingProtections.length >= 2 ? 'Medium' : 'Low');
  const marketPosition = score >= 7 ? 'High verification need' : score >= 4 ? 'Moderate verification need' : 'Limited verification need';
  const pushback = (type==='Liability' || type==='Indemnity' || type==='Data Protection' || type==='Intellectual Property' || pos==='Reject' || pos==='Escalate') ? 'High' : (type==='Fees' || type==='Termination' || pos==='Seek amendment' ? 'Medium' : 'Low');
  const theme = inferNegotiationTheme(clause);
  const recommendation = fallbackOptions[0] || String(state.clauseRecommendations?.[cid]||'').trim() || 'Review against internal standard and capture a fallback.';
  const worstCase = consequence[0] || 'Acceptance could reduce leverage or increase exposure on this point.';
  const leverageScore = Math.max(1, score + (pushback==='High'?2:pushback==='Medium'?1:0) + (confidence==='High'?2:confidence==='Medium'?1:0) + (pos==='Escalate'?3:pos==='Reject'?2:pos==='Seek amendment'?1:0));
  const strategyType = leverageScore>=9 ? 'Redline' : leverageScore>=7 ? 'Anchor' : leverageScore>=4 ? 'Tradeable' : 'Concede';
  const tradeSuggestion = getTradeSuggestion(clause);

  return { theme, riskDrivers, missingProtections, fallbackOptions, recommendation, consequenceIfAccepted: worstCase, confidence, marketPosition, likelyPushback: pushback, score, leverageScore, strategyType, tradeSuggestion };
}

function evaluateClauseIntelligence(clause){
  return computeClauseIntelligence(clause);
}

function groupNegotiationThemes(){
  const groups = {};
  (state.clauses||[]).forEach(clause=>{
    const pos = state.clausePositions?.[clause.id] || '';
    if(!pos || pos==='Acceptable') return;
    const intel = evaluateClauseIntelligence(clause);
    const key = intel?.theme || 'General commercial';
    (groups[key] ||= []).push({clause, intel});
  });
  return Object.entries(groups).sort((a,b)=>b[1].length-a[1].length);
}

function renderNegotiationThemesCard(){
  const groups = groupNegotiationThemes();
  if(!groups.length) return '<div class="tool-card compact negotiation-themes-card empty-print-card"><h4>Negotiation themes</h4><div class="mini">No open themes yet.</div></div>';
  return `<div class="tool-card compact negotiation-themes-card"><h4>Negotiation themes</h4><div class="summary-list">${groups.slice(0,6).map(([theme, items])=>{const leverage=Math.max(...items.map(x=>Number(x.intel.leverageScore||0)),0);return `<div class="summary-item"><strong>${escapeHtml(theme)}</strong><div class="summary-meta">${items.length} clause${items.length===1?'':'s'} • leverage ${leverage} • ${escapeHtml(items[0].intel.strategyType||'Tradeable')}</div><div class="mini">${escapeHtml(items.slice(0,3).map(x=>x.clause.number||x.clause.heading).join(' • '))}</div></div>`;}).join('')}</div></div>`;
}

function renderDecisionEngineHtml(clause) {
  if (!clause) return '';
  const intel = evaluateClauseIntelligence(clause) || {};
  if (!intel.riskDrivers?.length && !intel.missingProtections?.length) return '';
  return `<div class="tool-card compact decision-engine-card">
    <div class="panel-subhead" title="Pattern-matching estimates based on clause keywords — not a legal opinion">
      Analysis <span class="heuristic-badge">heuristic</span>
    </div>
    <div class="issue-card-grid">
      <div>
        <div class="mini issue-label">Risk signals</div>
        <div class="issue-value">${escapeHtml(intel.riskDrivers.slice(0, 2).join(' • ') || 'No major signals detected')}</div>
      </div>
      <div>
        <div class="mini issue-label">Suggested fallback</div>
        <div class="issue-value">${escapeHtml(intel.recommendation || 'Not available')}</div>
      </div>
      <div>
        <div class="mini issue-label">Verification need</div>
        <div class="issue-value">${escapeHtml(intel.marketPosition || 'Limited verification need')}</div>
      </div>
    </div>
    <details class="intel-detail-toggle">
      <summary class="link-btn" style="font-size:.75rem;list-style:none;cursor:pointer;color:var(--text-muted);">More signals ▾</summary>
      <div class="issue-card-grid" style="margin-top:8px;">
        ${intel.missingProtections?.length ? `<div><div class="mini issue-label">Potential gaps</div><div class="issue-value">${escapeHtml(intel.missingProtections.slice(0, 3).join(' • '))}</div></div>` : ''}
        ${intel.consequenceIfAccepted ? `<div><div class="mini issue-label">If accepted</div><div class="issue-value">${escapeHtml(intel.consequenceIfAccepted)}</div></div>` : ''}
        ${intel.tradeSuggestion ? `<div><div class="mini issue-label">Trade suggestion</div><div class="issue-value">${escapeHtml(intel.tradeSuggestion)}</div></div>` : ''}
      </div>
      <div class="note-meta-badges" style="margin-top:6px;">
        <span class="clause-pill" title="Strength of the matched patterns, not probability of correctness">Match strength: ${escapeHtml(intel.confidence)}</span>
        <span class="clause-pill">Discussion sensitivity: ${escapeHtml(intel.likelyPushback)}</span>
        <span class="clause-pill" title="Internal workflow heuristic">Advanced priority: ${escapeHtml(intel.strategyType || 'Tradeable')} · ${escapeHtml(String(intel.leverageScore || 0))}</span>
        ${intel.theme ? `<span class="clause-pill">Theme: ${escapeHtml(intel.theme)}</span>` : ''}
      </div>
    </details>
  </div>`;
}

function deriveIssueCard(clause){
  if(!clause) return null;
  const cid = clause.id;
  const pos = state.clausePositions?.[cid] || '';
  const routes = getClauseRouteTargets(cid);
  const latestNote = (state.notes||[]).filter(n=>n.clauseId===cid).slice(-1)[0] || null;
  const riskItems = buildClauseRiskNarrative(clause) || [];
  const intel = evaluateClauseIntelligence(clause) || {};
  const recommendation = String(state.clauseRecommendations?.[cid]||'').trim();
  const fallback = String(state.clauseFallbacks?.[cid]||latestNote?.proposedFallback||intel.recommendation||'').trim();
  const cp = String(state.clauseCounterpartyPositions?.[cid]||'').trim();
  const nextStep = String(state.clauseCounterpartyNextSteps?.[cid]||'').trim();
  const approval = String(state.clauseApprovalStatus?.[cid]||'').trim();
  return {
    clauseId: cid,
    title: `${clause.number||''} ${clause.heading||''}`.trim(),
    position: pos || 'No position',
    reviewStatus: deriveClauseReviewStatus(cid),
    stage: getIssueStage(cid),
    routeTo: routes.join(' • ') || (latestNote?.routeTo || ''),
    riskSummary: riskItems.map(i=>i.text).slice(0,2).join(' • ') || `${state.clauseRiskScores?.[cid]||'Low'} legal risk`,
    fallback: fallback || recommendation || '',
    counterpartyPosition: cp,
    nextStep: nextStep || (latestNote?.businessCall ? 'Needs business input' : ''),
    approvalNeeded: routes.length ? 'Yes' : (pos==='Escalate' ? 'Yes' : 'No'),
    approvalOutcome: approval || '',
    latestNote: latestNote?.text || '',
    confidence: intel.confidence || 'Low',
    marketPosition: intel.marketPosition || 'Limited verification need',
    theme: intel.theme || inferNegotiationTheme(clause),
    likelyPushback: intel.likelyPushback || 'Low',
    consequenceIfAccepted: intel.consequenceIfAccepted || '',
    missingProtections: intel.missingProtections || [],
    recommendation: intel.recommendation || fallback || '',
    leverageScore: intel.leverageScore || getNegotiationLeverageScore(clause),
    strategyType: intel.strategyType || getNegotiationStrategyType(clause),
    tradeSuggestion: intel.tradeSuggestion || getTradeSuggestion(clause)
  };
}

function renderIssueCardHtml(clause){
  const card = deriveIssueCard(clause);
  if(!card) return '';
  const routeMeta = card.routeTo ? `<span class="clause-pill badge-route">Route: ${escapeHtml(card.routeTo)}</span>` : '';
  const approvalMeta = card.approvalNeeded==='Yes' ? `<span class="clause-pill badge-status-in-review">Approval needed</span>` : '';
  const confidenceMeta = `<span class="clause-pill status-pill status-pill-${slugifyStatus(card.confidence)}">Confidence: ${escapeHtml(card.confidence)}</span>`;
  const postureMeta = `<span class="clause-pill">${escapeHtml(card.marketPosition)} posture</span>`;
  return `<div class="tool-card issue-card"><div class="issue-card-head"><div><div class="panel-subhead">Issue card <span class="heuristic-badge" title="Pattern-matching estimate — verify against the clause">heuristic</span></div><h4>${escapeHtml(card.position)}</h4></div><span class="clause-pill status-pill status-pill-${slugifyStatus(card.stage)}">${escapeHtml(card.stage)}</span></div><div class="issue-card-grid"><div><div class="mini issue-label">Risk summary</div><div class="issue-value">${escapeHtml(card.riskSummary || 'No material issue captured yet.')}</div></div><div><div class="mini issue-label">Recommended fallback</div><div class="issue-value">${escapeHtml(card.recommendation || card.fallback || 'No fallback captured')}</div></div>${card.counterpartyPosition?`<div><div class="mini issue-label">Counterparty stance</div><div class="issue-value">${escapeHtml(card.counterpartyPosition)}</div></div>`:''}${card.nextStep?`<div><div class="mini issue-label">Next step</div><div class="issue-value">${escapeHtml(card.nextStep)}</div></div>`:''}${card.consequenceIfAccepted?`<div><div class="mini issue-label">If accepted</div><div class="issue-value">${escapeHtml(card.consequenceIfAccepted)}</div></div>`:''}${card.missingProtections?.length?`<div><div class="mini issue-label">Missing protections</div><div class="issue-value">${escapeHtml(card.missingProtections.slice(0,3).join(' • '))}</div></div>`:''}${card.tradeSuggestion?`<div><div class="mini issue-label">Trade suggestion</div><div class="issue-value">${escapeHtml(card.tradeSuggestion)}</div></div>`:''}</div><div class="note-meta-badges">${routeMeta}${approvalMeta}${confidenceMeta}${postureMeta}${card.theme?`<span class="clause-pill">Theme: ${escapeHtml(card.theme)}</span>`:''}${card.approvalOutcome?`<span class="clause-pill badge-status-reviewed">Approval: ${escapeHtml(card.approvalOutcome)}</span>`:''}<span class="clause-pill">Leverage: ${escapeHtml(String(card.leverageScore||0))}</span><span class="clause-pill">${escapeHtml(card.strategyType||'Tradeable')}</span></div></div>`;
}

function getClauseChecklist(clause){
  const type = String(clause?.type||'General');
  const checks = {
    'Liability':['Cap tied to fees / period','Indirect / consequential damages excluded','Carve-outs proportionate','Super-cap only where justified'],
    'Data Protection':['Roles clear','Breach timing defined','Sub-processor controls','Transfer / residency position clear'],
    'Confidentiality':['Definition scoped','Use restriction clear','Return / destroy on exit','Residual knowledge handled'],
    'Termination':['Cause / convenience rights clear','Cure period reasonable','Exit support addressed','Payment consequences clear'],
    'Fees':['Payment trigger clear','Disputed invoices handled','Taxes addressed','Change control linkage clear'],
    'Services':['Scope clear','Dependencies clear','Acceptance / milestones clear','Change process covered']
  };
  return checks[type] || ['Scope / obligation clear','Defined terms aligned','Fallback captured if needed'];
}

function renderChecklistHtml(clause){
  const items = getClauseChecklist(clause);
  return `<div class="tool-card compact checklist-card"><div class="panel-subhead">Clause checklist</div><ul class="checklist-list">${items.map(i=>`<li>${escapeHtml(i)}</li>`).join('')}</ul></div>`;
}

function renderPlaybookDecisionHtml(clause){
  const m = getPlaybookMatchForClause(clause);
  if(!m) return '';
  const i = m.item || {};
  return `<div class="tool-card compact playbook-decision-card"><div class="panel-subhead">Precedent similarity — drafting aid only</div><div class="compare-grid compare-grid-compact"><div class="compare-col"><div class="compare-head">Current</div><div class="compare-body compare-plain">${escapeHtml(truncateWords(clause.body||'',60))}</div></div><div class="compare-col"><div class="compare-head">Precedent</div><div class="compare-body compare-plain">${escapeHtml(i.text||i.standardPosition||'-')}</div></div><div class="compare-col"><div class="compare-head">Stored fallback</div><div class="compare-body compare-plain">${escapeHtml(i.fallbackPosition||state.clauseFallbacks?.[clause.id]||'-')}</div></div></div><div class="mini">Text similarity does not affect inherent legal risk.</div><div class="card-actions"><button class="link-btn" data-action="apply-playbook" data-clause-id="${escapeHtml(clause.id)}">Apply precedent</button><button class="link-btn" data-action="toggle-compare">${state.clauseCompareMode?.[clause.id]?'Hide':'Compare'}</button></div></div>`;
}

function formatIssueCardText(clause){
  const card = deriveIssueCard(clause);
  if(!card) return '';
  return [
    `${card.title}`,
    `Theme: ${card.theme || 'General commercial'}`,
    `Position: ${card.position}`,
    `Stage: ${card.stage}`,
    `Confidence: ${card.confidence}`,
    `Market posture: ${card.marketPosition}`,
    `Leverage: ${card.leverageScore || 0}`,
    `Strategy: ${card.strategyType || 'Tradeable'}`,
    card.routeTo ? `Route to: ${card.routeTo}` : '',
    card.riskSummary ? `Risk drivers: ${card.riskSummary}` : '',
    card.missingProtections?.length ? `Missing protections: ${card.missingProtections.join(' | ')}` : '',
    card.recommendation ? `Recommended fallback: ${card.recommendation}` : '',
    card.counterpartyPosition ? `Counterparty: ${card.counterpartyPosition}` : '',
    card.nextStep ? `Next step: ${card.nextStep}` : '',
    card.consequenceIfAccepted ? `If accepted: ${card.consequenceIfAccepted}` : '',
    card.tradeSuggestion ? `Trade suggestion: ${card.tradeSuggestion}` : '',
    card.approvalNeeded==='Yes' ? `Approval needed: Yes` : '',
    card.approvalOutcome ? `Approval outcome: ${card.approvalOutcome}` : '',
    card.latestNote ? `Latest note: ${card.latestNote}` : ''
  ].filter(Boolean).join('\n');
}

function formatApprovalPack(){
  const buckets = {'Legal':[], 'Business':[], 'Privacy':[], 'Finance':[], 'Leadership':[]};
  getReviewableClauses().forEach(c=>{
    const decision=getClauseDecision(c.id);
    if(!decision.type || decision.type==='accept') return;
    const card = deriveIssueCard(c);
    const targets = getClauseRouteTargets(c.id);
    const mapped = [];
    if(targets.includes('Needs Business Input')) mapped.push('Business');
    if(targets.includes('Needs Privacy Review')) mapped.push('Privacy');
    if(targets.includes('Needs Finance Input')) mapped.push('Finance');
    if(targets.includes('Escalate to Leadership')) mapped.push('Leadership');
    if(!mapped.length && card?.approvalNeeded==='Yes' && /business/i.test(card.routeTo||'')) mapped.push('Business');
    if(!mapped.length) mapped.push('Legal');
    mapped.forEach(k=>buckets[k].push(c));
  });
  const sections = Object.entries(buckets).map(([k, clauses])=>{
    if(!clauses.length) return `${k}
No open items.`;
    return `${k}
${clauses.map(c=>formatIssueCardText(c)).join('\n\n-\n\n')}`;
  });
  const themes = groupNegotiationThemes().map(([theme, items])=>`${theme}: ${items.map(x=>x.clause.number||x.clause.heading).join(', ')}`).join('\n') || 'No open themes.';
  return `DECISION PACK
Audience: Internal Legal and designated approvers

Matter: ${matterSummaryLine()||'Not set'}
Legal risk: ${state.documentRisk||'Low'}
Review priority: ${state.documentReviewPriority||'Low'}

Negotiation themes
${themes}

====

${sections.join('\n\n====\n\n')}`;
}

function exportApprovalPackTxt(){downloadBlob(`${safeBaseName(state.documentMeta?.fileName||'contract')}_approval_pack_${buildDateStamp()}.txt`,new Blob([formatApprovalPack()],{type:'text/plain'}));}

/* -- Init -- */

init();
async function init(){
applyPrefs(loadPrefs());
clearLegacyAIStorage();
setSavedWorkspaces(loadSavedWorkspaces());
state.sessionReturn=loadSessionReturn();
assertDomCritical();
wireEvents();
installDelegatedPanelHandlers();
await restoreClauseLibrary();
renderPlaybookPackageSelect();
const autosaveCandidate = await restoreAutosave();
if(autosaveCandidate?.clauses?.length){state.pendingRestoreSession = autosaveCandidate;recordRestoreMeta(autosaveCandidate,'autosave');state.sessionRestored=true;}
else if(state.clauses.length){showApp();applySessionReturn(state.sessionReturn);renderAll();restoreSessionReturnScroll();}
normalizeReviewData();
syncLandingIntakeFromMatter();
await probeDocxSupportState();
renderRestoreBanner();
renderCompatibilityBanner();
updateMobileUI();
checkOnboarding();
installAutosaveFlushHandlers();
}

function normalizeReviewData(){
state.notes=(state.notes||[]).map(note=>{const nt=LEGACY_NOTE_TYPE_ALIASES[note.type]||note.type||'General Comment';return{...note,type:NOTE_TYPE_OPTIONS.includes(nt)?nt:'General Comment'};});
const allowed=new Set(ISSUE_TAG_OPTIONS||[]);
Object.keys(state.clauseTags||{}).forEach(cid=>{state.clauseTags[cid]=(state.clauseTags[cid]||[]).filter(tag=>allowed.has(tag));});
state.issueStatus = state.issueStatus || {};
state.issueConsole = state.issueConsole || {items:[],filters:{risk:'all',status:'all',route:'all',query:''},sortBy:'risk',viewMode:'list'};
deriveIssuesFromState();
}

function loadPrefs(){try{return JSON.parse(localStorage.getItem(PREFS_KEY)||'{}');}catch{return {};}}
function savePrefs(){try{localStorage.setItem(PREFS_KEY,JSON.stringify({theme:state.theme,navigatorMode:state.navigatorMode,rightPanelWidth:state.rightPanelWidth||340,xrefGlowMs:state.prefs?.xrefGlowMs||2200,myInitials:getMyInboxInitials(false)||'',disableAutosave:!!state.prefs?.disableAutosave,autoAdvanceDecisions:state.prefs?.autoAdvanceDecisions!==false,contrastMode:!!state.contrastMode,currentRound:Number(state.currentRound||1),cockpitCollapsed:!!state.cockpitCollapsed,developerMode:!!state.prefs?.developerMode,optionalFeatures:{...(state.prefs?.optionalFeatures||{})}}));}catch{}}
function applyPrefs(p={}){
if(p.theme==='light'||p.theme==='dark')state.theme=p.theme;
if(p.navigatorMode==='triage'||p.navigatorMode==='outline')state.navigatorMode=p.navigatorMode;
if(typeof p.contrastMode==='boolean')state.contrastMode=!!p.contrastMode;
if(Number(p.rightPanelWidth))state.rightPanelWidth=Math.min(520,Math.max(300,Number(p.rightPanelWidth)));
state.prefs={...(state.prefs||{}),xrefGlowMs:Number(p.xrefGlowMs)||2200,disableAutosave:!!p.disableAutosave,autoAdvanceDecisions:p.autoAdvanceDecisions!==false,developerMode:!!p.developerMode,optionalFeatures:{...(state.prefs?.optionalFeatures||{}),...(p.optionalFeatures||{})}};
state.currentRound=Number(p.currentRound)||state.currentRound||1;
if(typeof p.cockpitCollapsed === 'boolean') state.cockpitCollapsed = p.cockpitCollapsed;
applyTheme();applyWorkspacePrefs();
}
function openPrefsModal(){
  const modal=document.getElementById('prefsModal');
  if(!modal)return;
  const dark=document.getElementById('prefsDarkBtn');
  const light=document.getElementById('prefsLightBtn');
  dark?.classList.toggle('active',state.theme==='dark');
  light?.classList.toggle('active',state.theme==='light');
  const autoAdvance=document.getElementById('prefsAutoAdvanceToggle');
  const contrast=document.getElementById('prefsContrastToggle');
  const initials=document.getElementById('prefsInitialsInput');
  const disableAutosave=document.getElementById('prefsDisableAutosaveToggle');
  if(autoAdvance)autoAdvance.checked=state.prefs?.autoAdvanceDecisions!==false;
  if(contrast)contrast.checked=!!state.contrastMode;
  if(initials)initials.value=getMyInboxInitials(false)||'';
  if(disableAutosave)disableAutosave.checked=!!state.prefs?.disableAutosave;
  modal.querySelectorAll('[data-optional-feature]').forEach(input=>{input.checked=!!state.prefs?.optionalFeatures?.[input.dataset.optionalFeature];});
  const developerMode=document.getElementById('prefsDeveloperModeToggle');
  if(developerMode)developerMode.checked=!!state.prefs?.developerMode;
  openModal(modal);
}
function closePrefsModal(){closeModal(document.getElementById('prefsModal'));}
function applyTheme(){
document.documentElement.setAttribute('data-theme',state.theme||'dark');
if(els.themeToggleBtn){els.themeToggleBtn.textContent='◑';els.themeToggleBtn.setAttribute('aria-label',state.theme==='light'?'Switch to dark mode':'Switch to light mode');els.themeToggleBtn.setAttribute('title',state.theme==='light'?'Switch to dark mode':'Switch to light mode');els.themeToggleBtn.classList.toggle('active',state.theme==='light');}
}

function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';applyTheme();savePrefs();}

function loadSavedWorkspaces(){try{return JSON.parse(localStorage.getItem(WORKSPACES_KEY)||'[]');}catch{return [];}}
function persistSavedWorkspaces(){try{localStorage.setItem(WORKSPACES_KEY,JSON.stringify(state.savedWorkspaces||[]));}catch{}}
function setSavedWorkspaces(items){state.savedWorkspaces=Array.isArray(items)?items:[]; updateWorkspaceControls();}
function updateWorkspaceControls(){
  const sel=els.hubWorkspaceSelect; if(!sel) return;
  const items=Array.isArray(state.savedWorkspaces)?state.savedWorkspaces:[];
  sel.innerHTML='<option value="">Select workspace…</option>'+items.map(w=>`<option value="${escapeHtml(w.id)}">${escapeHtml(w.name)}</option>`).join('');
}
function buildWorkspacePayload(name=''){
  return {id:`ws-${Date.now()}`,name:name||`Workspace ${new Date().toLocaleString()}`,
    workflowMode:state.workflowMode,activeTab:state.activeTab,navigatorMode:state.navigatorMode,
    filters:{...(state.filters||{})},reviewSubSection:state.reviewSubSection||'issues',strategySubSection:state.strategySubSection||'packages',
    notesView:state.notesView||'clause',termsView:state.termsView||'clause',searchQuery:state.searchQuery||'',
    issueConsole:{filters:{...((state.issueConsole||{}).filters||{})},sortBy:(state.issueConsole||{}).sortBy||'risk',viewMode:(state.issueConsole||{}).viewMode||'list'}
  };
}
function saveCurrentWorkspace(){
  const name=(window.prompt('Save current workspace as','')||'').trim() || `Workspace ${new Date().toLocaleString()}`;
  const payload=buildWorkspacePayload(name);
  state.savedWorkspaces=(state.savedWorkspaces||[]).filter(w=>w.name!==name);
  state.savedWorkspaces.push(payload); persistSavedWorkspaces(); updateWorkspaceControls(); saveSessionReturn(); requestImmediateAutosave('critical'); showToast(`Workspace saved: ${name}`,'info');
}
function applyWorkspaceById(id){
  const ws=(state.savedWorkspaces||[]).find(w=>w.id===id); if(!ws) return;
  state.workflowMode=ws.workflowMode||'review'; state.activeTab=TAB_IDS.includes(ws.activeTab)?ws.activeTab:'summary'; state.navigatorMode=ws.navigatorMode||'outline';
  state.filters={content:ws.filters?.content||'all',review:ws.filters?.review||'all'}; state.searchQuery=ws.searchQuery||''; if(els.searchInput) els.searchInput.value=state.searchQuery;
  state.reviewSubSection=ws.reviewSubSection||'issues'; state.strategySubSection=ws.strategySubSection||'packages'; state.notesView=ws.notesView||'clause'; state.termsView=ws.termsView||'clause';
  state.issueConsole=state.issueConsole||{items:[],filters:{risk:'all',status:'all',route:'all',query:''},sortBy:'risk',viewMode:'list'};
  state.issueConsole.filters={risk:ws.issueConsole?.filters?.risk||'all',status:ws.issueConsole?.filters?.status||'all',route:ws.issueConsole?.filters?.route||'all',query:ws.issueConsole?.filters?.query||''};
  state.issueConsole.sortBy=ws.issueConsole?.sortBy||'risk'; state.issueConsole.viewMode=ws.issueConsole?.viewMode||'list';
  applyWorkflowMode(); renderAll(); const sync=()=>syncFilterUI(); if(typeof requestAnimationFrame==='function') requestAnimationFrame(sync); else setTimeout(sync,0); savePrefs(); saveSessionReturn(); requestImmediateAutosave('critical'); showToast(`Workspace applied: ${ws.name}`,'info');
}
function deleteWorkspaceById(id){
  const ws=(state.savedWorkspaces||[]).find(w=>w.id===id); if(!ws) return;
  if(!window.confirm(`Delete workspace "${ws.name}"?`)) return;
  state.savedWorkspaces=(state.savedWorkspaces||[]).filter(w=>w.id!==id); persistSavedWorkspaces(); updateWorkspaceControls(); saveSessionReturn(); requestImmediateAutosave('critical'); showToast('Workspace deleted','info');
}
function saveSessionReturn(){
  try{ if(!state.clauses?.length) return; const payload={selectedClauseId:state.selectedClauseId||OVERVIEW_ID, activeTab:state.activeTab, workflowStage:getActiveWorkflowStage(), workflowMode:state.workflowMode, navigatorMode:state.navigatorMode, reviewSubSection:state.reviewSubSection, strategySubSection:state.strategySubSection, filters:state.filters, searchQuery:state.searchQuery||'', scrollTop:els.clauseView?.scrollTop||0, at:new Date().toISOString()}; localStorage.setItem(SESSION_RETURN_KEY, JSON.stringify(payload)); state.sessionReturn=payload; }catch{}
}
function loadSessionReturn(){try{return JSON.parse(localStorage.getItem(SESSION_RETURN_KEY)||'{}');}catch{return {};}}
function applySessionReturn(saved){ if(!saved || !saved.selectedClauseId || !state.clauses?.length) return; state.sessionReturn=saved; state.activeTab=TAB_IDS.includes(saved.activeTab)?saved.activeTab:state.activeTab; const restoredStage=['intake','decide','prepare','close'].includes(saved.workflowStage)?saved.workflowStage:mapLegacyModeToStage(['triage','review','negotiate','outputs'].includes(saved.workflowMode)?saved.workflowMode:state.workflowMode); state.workflowStage=restoredStage; state.workflowMode=mapStageToLegacyMode(restoredStage); state.navigatorMode=saved.navigatorMode==='triage'?'triage':'outline'; state.reviewSubSection=saved.reviewSubSection||state.reviewSubSection; state.strategySubSection=saved.strategySubSection||state.strategySubSection; if(saved.filters) state.filters={content:saved.filters.content||'all',review:saved.filters.review||'all'}; state.searchQuery=saved.searchQuery||state.searchQuery; if(els.searchInput) els.searchInput.value=state.searchQuery||''; const target=(state.clauses||[]).some(c=>c.id===saved.selectedClauseId)?saved.selectedClauseId:OVERVIEW_ID; state.selectedClauseId=target; }
function restoreSessionReturnScroll(){ const st=Number(state.sessionReturn?.scrollTop||0); if(els.clauseView && st>0) requestAnimationFrame(()=>{els.clauseView.scrollTop=st;}); }
function getSessionResumeLabel(){ const cid=state.sessionReturn?.selectedClauseId; const clause=(state.clauses||[]).find(c=>c.id===cid); if(!clause) return ''; return `${clause.number||''} ${clause.heading||''}`.trim(); }
function deriveBreadcrumbTrail(clause){ if(!clause) return []; const list=state.clauses||[]; const idx=list.findIndex(c=>c.id===clause.id); if(idx<0) return [clause]; const level=Number(clause.level||1); const trail=[clause]; let expected=level-1; for(let i=idx-1;i>=0 && expected>=1;i--){ const c=list[i]; if(Number(c.level||1)===expected){ trail.unshift(c); expected--; } } return trail; }
function renderBreadcrumbBar(clause){ if(!els.breadcrumbBar) return; if(!clause || clause.id===OVERVIEW_ID){ els.breadcrumbBar.innerHTML=''; els.breadcrumbBar.classList.add('hidden'); return; } const trail=deriveBreadcrumbTrail(clause); els.breadcrumbBar.classList.remove('hidden'); const returningCheck=state.returnToCheckArmed&&state.activeCheck&&getActiveWorkflowStage()!=='intake'?CHECK_DEFINITIONS.find(d=>d.id===state.activeCheck):null; const returnChip=returningCheck?`<button type="button" class="breadcrumb-chip breadcrumb-return" data-return-to-check title="Return to where you left off in this check">← Back to ${escapeHtml(returningCheck.title)}</button><span class="breadcrumb-sep">›</span>`:''; els.breadcrumbBar.innerHTML=returnChip+trail.map((c,idx)=>`<button type="button" class="breadcrumb-chip" data-breadcrumb-id="${escapeHtml(c.id)}">${escapeHtml(c.number||c.heading||'Clause')}</button>${idx<trail.length-1?'<span class="breadcrumb-sep">›</span>':''}`).join(''); els.breadcrumbBar.querySelectorAll('[data-breadcrumb-id]').forEach(btn=>btn.addEventListener('click',()=>jumpToClause(btn.dataset.breadcrumbId))); els.breadcrumbBar.querySelector('[data-return-to-check]')?.addEventListener('click',()=>setWorkflowStage('intake',{preserveTab:false})); }
function hidePeekCard(){ state.peekCard={open:false,type:'',targetId:'',term:''}; els.peekCard?.classList.add('hidden'); }
function positionPeekCard(anchor){ const card=els.peekCard; if(!anchor||!card) return; card.classList.remove('hidden'); card.style.left='0px'; card.style.top='0px'; const r=anchor.getBoundingClientRect(); const cr=card.getBoundingClientRect(); let left=r.left+window.scrollX; left=Math.max(window.scrollX+12, Math.min(left, window.scrollX+window.innerWidth-cr.width-12)); let top=r.bottom+window.scrollY+10; if(top+cr.height>window.scrollY+window.innerHeight-12) top=r.top+window.scrollY-cr.height-10; card.style.left=`${left}px`; card.style.top=`${top}px`; }
function showPeekCardForClause(targetClauseId, anchorEl) {
  const clause = (state.clauses || []).find(c => c.id === targetClauseId);
  if (!clause || !els.peekCard) return;
  state.peekCard = { open: true, type: 'xref', targetId: targetClauseId, term: '' };

  const risk = state.clauseRiskScores?.[targetClauseId] || 'Low';
  const reviewStatus = state.clauseReviewStatus?.[targetClauseId] || 'Not reviewed';
  const pos = state.clausePositions?.[targetClauseId] || '';
  const noteCount = (state.notes || []).filter(n => n.clauseId === targetClauseId).length;

  const statusLine = [
    `<span class="peek-badge peek-risk-${risk.toLowerCase()}">${escapeHtml(risk)} risk</span>`,
    `<span class="peek-badge">${escapeHtml(reviewStatus)}</span>`,
    pos ? `<span class="peek-badge peek-pos">${escapeHtml(pos)}</span>` : '',
    noteCount ? `<span class="peek-badge">${noteCount} note${noteCount === 1 ? '' : 's'}</span>` : ''
  ].filter(Boolean).join('');

  els.peekCard.innerHTML = `
    <div class="peek-card-head">
      <strong>${escapeHtml(clause.number || '')}</strong> ${escapeHtml(clause.heading || '')}
    </div>
    <div class="peek-status-row">${statusLine}</div>
    <div class="peek-card-body">${escapeHtml(truncateWords(clause.body || '', 80))}</div>
    <div class="peek-card-actions">
      <button type="button" class="btn btn-xs" data-peek-open="${escapeHtml(clause.id)}">Open full</button>
      <button type="button" class="btn btn-xs btn-ghost" data-peek-close="1">Close</button>
    </div>`;

  positionPeekCard(anchorEl);
  els.peekCard.querySelector('[data-peek-open]')?.addEventListener('click', () => {
    hidePeekCard();
    jumpToClause(targetClauseId);
  });
  els.peekCard.querySelector('[data-peek-close]')?.addEventListener('click', hidePeekCard);
}
function startNewNegotiationRound(){ const label=(window.prompt('Round label', `R${Number(state.currentRound||1)}`)||'').trim() || `R${Number(state.currentRound||1)}`; const snapshot={}; (state.clauses||[]).forEach(c=>{ snapshot[c.id]={position:state.clausePositions?.[c.id]||'', recommendation:state.clauseRecommendations?.[c.id]||'', fallback:state.clauseFallbacks?.[c.id]||'', noteCount:(state.notes||[]).filter(n=>n.clauseId===c.id).length}; }); state.negotiationRounds=state.negotiationRounds||{}; const key=`round-${Date.now()}`; state.negotiationRounds[key]={key,label,createdAt:new Date().toISOString(),snapshot}; state.currentRound=Number(state.currentRound||1)+1; requestImmediateAutosave('critical'); renderAll(); showToast(`Started ${label}`,'info'); }
function getRoundEntries(){ return Object.entries(state.negotiationRounds||{}).map(([key,r])=>({...r,key:r?.key||key})).sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))); }
function renderRoundSummaryCard(){ return ''; }
function compareCurrentAgainstRound(roundKey){ const entry=(state.negotiationRounds||{})[roundKey]; if(!entry) return []; const changed=[]; (state.clauses||[]).forEach(c=>{ const base=entry.snapshot?.[c.id]||{}; if((base.position||'')!==(state.clausePositions?.[c.id]||'') || (base.recommendation||'')!==(state.clauseRecommendations?.[c.id]||'') || (base.fallback||'')!==(state.clauseFallbacks?.[c.id]||'')){ changed.push(c.id); } }); return changed; }
function compareCurrentAgainstSnapshotId(snapshotId){ const item=(state.snapshotItems||[]).find(i=>i.id===snapshotId); if(!item?.payload?.clauses) return []; const changed=[]; const snapPos=item.payload?.clausePositions||{}; const snapRec=item.payload?.clauseRecommendations||{}; const snapFallback=item.payload?.clauseFallbacks||{}; (state.clauses||[]).forEach(c=>{ if((snapPos[c.id]||'')!==(state.clausePositions?.[c.id]||'') || (snapRec[c.id]||'')!==(state.clauseRecommendations?.[c.id]||'') || (snapFallback[c.id]||'')!==(state.clauseFallbacks?.[c.id]||'')){ changed.push(c.id);} }); return changed; }
function getActiveChangedClauseIds(){
  if(state.selectedSnapshotCompareId) return compareCurrentAgainstSnapshotId(state.selectedSnapshotCompareId);
  if(state.selectedRoundCompareKey) return compareCurrentAgainstRound(state.selectedRoundCompareKey);
  return [];
}
function getActiveChangedClauseIdSet(){ return new Set(getActiveChangedClauseIds()); }
function getActiveChangeLabel(){
  if(state.selectedSnapshotCompareId){ const item=(state.snapshotItems||[]).find(i=>i.id===state.selectedSnapshotCompareId); return item ? `snapshot ${item.label||item.fileName||'Snapshot'}` : 'snapshot'; }
  if(state.selectedRoundCompareKey){ const entry=(state.negotiationRounds||{})[state.selectedRoundCompareKey]; return entry ? `round ${entry.label||'Round'}` : 'round'; }
  return '';
}
function clearCompareContext(){ state.selectedSnapshotCompareId=''; state.selectedRoundCompareKey=''; state.compareOnlyMode=false; renderAll(); }
function getChangedClauseRows(limit=8){ const ids=getActiveChangedClauseIds(); return ids.map(id=>(state.clauses||[]).find(c=>c.id===id)).filter(Boolean).slice(0,limit); }
function renderVersionDeltaCard(){
  const snapshots=(state.snapshotItems||[]);
  const rounds=getRoundEntries();
  const changed=getChangedClauseRows(8);
  const totalChanged=getActiveChangedClauseIds().length;
  const label=getActiveChangeLabel();
  return `<div class="tool-card compact"><h4>Version intelligence</h4>
    <div class="mini">Compare current work against a saved snapshot or negotiation round.</div>
    <div class="version-compare-grid">
      <label class="drafting-field compact-field"><span>Snapshot baseline</span><select id="snapshotCompareSelect"><option value="">None</option>${snapshots.map(s=>`<option value="${escapeHtml(s.id)}" ${state.selectedSnapshotCompareId===s.id?'selected':''}>${escapeHtml(s.label||s.fileName||'Snapshot')}</option>`).join('')}</select></label>
      <label class="drafting-field compact-field"><span>Round baseline</span><select id="roundCompareSelect"><option value="">None</option>${rounds.map(r=>`<option value="${escapeHtml(r.key)}" ${state.selectedRoundCompareKey===r.key?'selected':''}>${escapeHtml(r.label||'Round')}</option>`).join('')}</select></label>
    </div>
    ${label?`<div class="mini compare-summary">${totalChanged} changed clause${totalChanged===1?'':'s'} since ${escapeHtml(label)}.</div>`:'<div class="mini compare-summary">No comparison baseline selected.</div>'}
    ${changed.length?`<div class="summary-list changed-clause-list">${changed.map(c=>`<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(c.id)}"><strong>${escapeHtml(c.number||'')}</strong> ${escapeHtml(c.heading||'')}<span class="summary-meta">Changed</span></button>`).join('')}</div>`:''}
    <div class="card-actions"><button id="toggleCompareOnlyBtn" type="button">${state.compareOnlyMode?'Show all clauses':'Show changed only'}</button><button id="clearCompareCtxBtn" type="button">Clear compare</button></div>
  </div>`;
}
function buildDefinitionHygieneSummary(){
  return {
    duplicate:(state.issues?.duplicateDefinitions||[]).length,
    unused:(state.issues?.unusedDefinitions||[]).length,
    undefinedCaps:(state.issues?.undefinedCapitalizedTerms||[]).length,
    unresolvedXref:(state.issues?.unresolvedCrossReferencedDefinitions||[]).length,
    completeAt:state.definitionPassDoneAt||''
  };
}
function renderDefinitionHygieneCard(){
  const s=buildDefinitionHygieneSummary();
  return `<div class="tool-card compact"><h4>Definition hygiene</h4>
    <div class="summary-list definition-hygiene-list">
      <button type="button" class="summary-item" data-defh-action="duplicates"><span>Duplicates</span><span class="summary-meta">${s.duplicate}</span></button>
      <button type="button" class="summary-item" data-defh-action="unused"><span>Unused</span><span class="summary-meta">${s.unused}</span></button>
      <button type="button" class="summary-item" data-defh-action="undefined"><span>Undefined capitals</span><span class="summary-meta">${s.undefinedCaps}</span></button>
      <button type="button" class="summary-item" data-defh-action="xref"><span>Unresolved xref terms</span><span class="summary-meta">${s.unresolvedXref}</span></button>
    </div>
    <div class="mini">${s.completeAt?`Definitions pass marked complete ${escapeHtml(formatShortDateTime(s.completeAt))}`:'Definitions pass not marked complete.'}</div>
    <div class="card-actions"><button id="markDefinitionPassBtn" type="button">${s.completeAt?'Refresh completion time':'Mark definitions pass complete'}</button></div>
  </div>`;
}

function applyWorkspacePrefs(){if(!els.workspace)return;const w=Math.min(520,Math.max(300,Number(state.rightPanelWidth)||340));state.rightPanelWidth=w;els.workspace.style.setProperty('--right-panel-width',`${w}px`);els.rightPanelResizeHandle?.setAttribute('aria-valuenow',String(w));}
/* removed duplicate legacy definition: renderCockpitStrip */
function renderCompatibilityBanner(){
const b=document.getElementById('docxCompatibilityBanner');if(!b)return;
const supported=getDocxSupportState();
updateUploadZoneCopy();
if(!supported){b.textContent='DOCX upload is only supported in Chrome/Edge in this offline build. Use .txt / .html / session .json in this browser.';b.classList.remove('hidden');}
else {b.textContent='';b.classList.add('hidden');}
}

/* -- Onboarding -- */
function checkOnboarding(){
if(!els.onboardingOverlay)return;
try{if(localStorage.getItem(ONBOARDED_KEY))return;}catch{}
if(state.clauses.length)return; /* already has data */
openModal(els.onboardingOverlay);
}
function dismissOnboarding(){
if(els.onboardingOverlay)closeModal(els.onboardingOverlay);
try{localStorage.setItem(ONBOARDED_KEY,'1');}catch{}
}

/* -- Focus mode -- */
function toggleFocusMode(force){const next=typeof force==='boolean'?force:!state.focusMode;if(next&&getActiveWorkflowStage()==='intake')setWorkflowStage('decide',{preserveTab:true});state.focusMode=next;applyFocusMode();renderClauseView();saveSessionReturn();}
function applyFocusMode(){if(!els.app)return;els.app.classList.toggle('focus-mode',!!state.focusMode);if(els.hubToggleFocusBtn){els.hubToggleFocusBtn.textContent=state.focusMode?'Exit reading mode':'Reading mode';els.hubToggleFocusBtn.classList.toggle('active',!!state.focusMode);}if(els.readingModeBtn){els.readingModeBtn.textContent=state.focusMode?'Exit reading':'Read';els.readingModeBtn.classList.toggle('active',!!state.focusMode);els.readingModeBtn.setAttribute('aria-pressed',state.focusMode?'true':'false');}updateMobileUI();}


/* removed duplicate legacy definition: setWorkflowMode */
/* removed duplicate legacy definition: updateWorkflowModeUI */
/* removed duplicate legacy definition: applyWorkflowMode */
/* -- Navigator mode -- */
function setNavigatorMode(mode){state.navigatorMode=mode==='triage'?'triage':'outline';updateNavigatorModeUI();renderClauseList();savePrefs();saveSessionReturn();}
function updateNavigatorModeUI(){els.outlineModeBtn?.classList.toggle('active',state.navigatorMode==='outline');els.triageModeBtn?.classList.toggle('active',state.navigatorMode==='triage');}

/* -- Mobile -- */
function isMobileViewport(){return window.matchMedia('(max-width: 900px)').matches;}
function closeMobilePanels(){if(!els.app)return;els.app.classList.remove('mobile-left-open','mobile-right-open');setMobileBackdropVisible(false);closeMobileToolLauncher();updateMobileUI();}
/* removed duplicate legacy definition: openMobileToolLauncher */
function closeMobileToolLauncher(){if(!els.mobileToolLauncher)return;els.mobileToolLauncher.classList.add('hidden');if(!els.app?.classList.contains('mobile-left-open')&&!els.app?.classList.contains('mobile-right-open'))setMobileBackdropVisible(false);document.body.classList.remove('modal-open');}
/* removed duplicate legacy definition: openMobileLeftPanel */
function openMobileRightPanel(tab){if(tab&&state.activeTab!==tab)state.activeTab=tab;if(!isMobileViewport()||!els.app){if(tab)updateTabVisibility();return;}els.app.classList.add('mobile-right-open');els.app.classList.remove('mobile-left-open');setMobileBackdropVisible(true);if(tab)updateTabVisibility();state.mobileView='tools';updateMobileUI();}
/* removed duplicate legacy definition: setMobileView */
/* removed duplicate legacy definition: syncMobileViewToActiveTab */
/* removed duplicate legacy definition: updateMobileUI */
function handleMobileMenuActionLegacy(action){if(!action)return;if(action==='new'){showLanding();closeMobilePanels();closeMobileToolLauncher();return;}if(action==='theme'){toggleTheme();return;}if(action==='focus'){toggleFocusMode();return;}if(action==='shortcuts'){openShortcutsModal();return;}if(action==='snapshots'){openSnapshotsModal();return;}if(action==='report'||action==='email'||action==='session'){openExportHubModal();return;}if(TAB_IDS.includes(action)){closeMobileToolLauncher();setActiveTab(action);openMobileRightPanel(action);return;}}

/* -- Right panel resize -- */
function initRightPanelResize(){const h=els.rightPanelResizeHandle;const w=els.workspace;if(!h||!w)return;let sX=0,sW=0;const onM=e=>{state.rightPanelWidth=Math.min(520,Math.max(300,sW+(sX-e.clientX)));applyWorkspacePrefs();};const onLeave=()=>{document.body.classList.remove('resizing-panel');window.removeEventListener('mousemove',onM);window.removeEventListener('mouseup',onU);document.documentElement.removeEventListener('mouseleave', onLeave);};const onU=()=>{document.body.classList.remove('resizing-panel');window.removeEventListener('mousemove',onM);window.removeEventListener('mouseup',onU);document.documentElement.removeEventListener('mouseleave', onLeave);savePrefs();};h.addEventListener('mousedown',e=>{if(isMobileViewport())return;e.preventDefault();sX=e.clientX;sW=Number(state.rightPanelWidth)||w.getBoundingClientRect().width;document.body.classList.add('resizing-panel');window.addEventListener('mousemove',onM);window.addEventListener('mouseup',onU);document.documentElement.addEventListener('mouseleave', onLeave);});h.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?40:12;const delta=e.key==='ArrowLeft'?step:-step;state.rightPanelWidth=Math.min(520,Math.max(300,(Number(state.rightPanelWidth)||340)+delta));applyWorkspacePrefs();savePrefs();});}
function initModalAccessibility(){document.querySelectorAll('.modal-overlay').forEach(overlay=>overlay.setAttribute('aria-hidden',overlay.classList.contains('hidden')?'true':'false'));document.querySelectorAll('.modal-card').forEach((card,idx)=>{card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');const heading=card.querySelector('.modal-head h2,.modal-head h3,.modal-head h4,h2,h3,h4');if(heading){if(!heading.id)heading.id=`modalTitle${idx}`;card.setAttribute('aria-labelledby',heading.id);}});}


function installDelegatedPanelHandlers(){
  if(els.reviewPanel && !els.reviewPanel.dataset.delegated){
    els.reviewPanel.dataset.delegated='true';
    els.reviewPanel.addEventListener('click', handleReviewPanelClick);
    els.reviewPanel.addEventListener('change', handleReviewPanelChange);
    els.reviewPanel.addEventListener('input', handleReviewPanelInput);
  }
  if(els.strategyPanel && !els.strategyPanel.dataset.delegated){
    els.strategyPanel.dataset.delegated='true';
    els.strategyPanel.addEventListener('click', handleStrategyPanelClick);
    els.strategyPanel.addEventListener('change', handleStrategyPanelChange);
    els.strategyPanel.addEventListener('input', handleStrategyPanelInput);
    els.strategyPanel.addEventListener('focusout', handleStrategyPanelFocusOut);
  }
  const toolsPanel=document.getElementById('toolsPanel');
  if(toolsPanel && !toolsPanel.dataset.delegated){
    toolsPanel.dataset.delegated='true';
    toolsPanel.addEventListener('click', e=>{
      const termView=e.target.closest('[data-terms-view]');
      if(termView){ state.termsView=termView.dataset.termsView||'all'; renderToolsPanel(); return; }
      const refsView=e.target.closest('[data-refs-view]');
      if(refsView){ state.refsView=refsView.dataset.refsView||'all'; renderToolsPanel(); return; }
      const jumpBtn=e.target.closest('[data-clause-id]');
      if(jumpBtn){ jumpToClause(jumpBtn.dataset.clauseId); return; }
    });
  }
}
function handleReviewPanelClick(e){
  const tab=e.target.closest('.sub-tab'); if(tab){ state.reviewSubSection=tab.dataset.sub||'issues'; renderReviewPanel(); return; }
  const jump=e.target.closest('.jump-clause'); if(jump){ jumpToClause(jump.dataset.clauseId); return; }
  const actionMap=[['.ignore-undefined-btn', btn=>ignoreUndefinedTerm(btn.dataset.term)],['.resolve-xref-term-btn', btn=>resolveReferenceAsDefinedTerm(btn.dataset.term,btn.dataset.reference)],['.view-term', ()=>{setActiveToolsTab('terms');}],['.promote-term-btn', btn=>promotePossibleDefinedTerm(btn.dataset.term,btn.dataset.clauseId)],['.ignore-term-btn', btn=>ignorePossibleTerm(btn.dataset.term)],['.copy-term-btn', btn=>copyTextToClipboard(formatTermDetail(btn.dataset.term),'Term copied')],['#exportTermsCsvBtn', ()=>exportTermsCsv()],['#exportObligationsCsvBtn', ()=>exportObligationsCsv()],['#copyObligationsBtn', ()=>copyTextToClipboard(formatObligationsSummary(state.selectedClauseId===OVERVIEW_ID?null:getSelectedClause()?.id),'Obligations copied')],['#issueConsoleListViewBtn', ()=>{state.issueConsole.viewMode='list';renderReviewPanel();}],['#issueConsoleGroupedViewBtn', ()=>{state.issueConsole.viewMode='grouped';renderReviewPanel();}],['#toggleNegotiationModeBtn', ()=>{state.issueConsole.negotiationMode=!state.issueConsole.negotiationMode;renderReviewPanel();}],['#openMeetingPrepBtn', ()=>openOutputPreview('Call prep', formatMeetingPrep(), `${safeBaseName(state.documentMeta.fileName||'contract')}_call_prep_${buildDateStamp()}.txt`)],['#bulkAddAgendaBtn', ()=>applyBulkIssueAgenda()],['#bulkMarkResolvedBtn', ()=>markSelectedIssuesResolved()],['#clearIssueSelectionBtn', ()=>{clearIssueSelection();renderReviewPanel();}],['#copyIssueHotlistBtn', ()=>copyTextToClipboard(formatIssueHotlist(),'Issue hotlist copied')],['#copyLeadershipIssuePackBtn', ()=>copyTextToClipboard(formatIssueHotlist('Leadership'),'Leadership briefing copied')],['#copyMeetingPrepBtn', ()=>copyTextToClipboard(formatMeetingPrep(),'Call prep copied')],['#negotiationResolveSelectedBtn', ()=>markSelectedIssuesResolved()],['#negotiationNextIssueBtn', ()=>{ const next=getIssueConsoleItems().find(i=>i.status!=='Resolved'); if(next){ state.reviewSubSection='issues-console'; setActiveTab('review'); jumpToClause(next.clauseId); }}]];
  for(const [sel,fn] of actionMap){ const btn=e.target.closest(sel); if(btn){ fn(btn); return; } }
  const termView=e.target.closest('[data-terms-view]'); if(termView){ state.termsView=termView.dataset.termsView||'all'; renderToolsPanel(); return; }
  const issueOpen=e.target.closest('[data-issue-open]'); if(issueOpen){ state.reviewSubSection='issues-console'; setActiveTab('review'); jumpToClause(issueOpen.dataset.issueOpen); return; }
  const issueAgenda=e.target.closest('[data-issue-agenda]'); if(issueAgenda){ const cid=issueAgenda.dataset.issueAgenda; if(isInAgenda(cid)) removeClauseFromAgenda(cid); else addClauseToAgenda(cid); renderReviewPanel(); return; }
  const quick=e.target.closest('[data-issue-quick]'); if(quick){ applyIssueQuickAction(quick.dataset.cid, quick.dataset.issueQuick); return; }
}
function handleReviewPanelInput(e){ if(e.target.id==='issueConsoleSearch'){ state.issueConsole.filters.query=e.target.value||''; renderReviewPanel(); } }
function handleReviewPanelChange(e){
  const t=e.target;
  if(t.classList.contains('placeholder-toggle')){ togglePlaceholderResolved(t.dataset.placeholderId); return; }
  if(t.id==='issueConsoleRiskFilter'){ state.issueConsole.filters.risk=t.value||'all'; renderReviewPanel(); return; }
  if(t.id==='issueConsoleStatusFilter'){ state.issueConsole.filters.status=t.value||'all'; renderReviewPanel(); return; }
  if(t.id==='issueConsoleRouteFilter'){ state.issueConsole.filters.route=t.value||'all'; renderReviewPanel(); return; }
  if(t.id==='issueConsoleSortBy'){ state.issueConsole.sortBy=t.value||'risk'; renderReviewPanel(); return; }
  if(t.dataset.issueStatus){ setIssueStatus(t.dataset.issueStatus, t.value); return; }
  if(t.dataset.issueSelect){ toggleIssueSelection(t.dataset.issueSelect, t.checked, {range:false}); renderReviewPanel(); return; }
  if(t.id==='bulkIssueStatusSelect'){ if(t.value) applyBulkIssueStatus(t.value); t.value=''; return; }
  if(t.id==='bulkIssueRouteSelect'){ if(t.value) applyBulkIssueRoute(t.value); t.value=''; return; }
  if(t.id==='bulkIssuePositionSelect'){ if(t.value) applyBulkIssuePosition(t.value); t.value=''; return; }
}
function handleWorkspacePlaybookAction(container,e){
  const activate=e.target.closest('[data-workspace-playbook-activate],[data-activate-compatible-playbook]');
  if(activate){
    const select=container?.querySelector?.('[data-workspace-playbook-select]');
    const key=activate.dataset.playbookKey||select?.value||'';
    activatePlaybookKey(key);
    renderStrategyPanel();renderContextPanel();renderClauseView();
    return true;
  }
  const deactivate=e.target.closest('[data-workspace-playbook-deactivate]');
  if(deactivate){activatePlaybookKey('');showToast('Playbook deactivated. Frozen clause provenance remains in the audit trail.','info');renderStrategyPanel();return true;}
  return false;
}
function handleStrategyPanelClick(e){
  if(handleWorkspacePlaybookAction(els.strategyPanel,e))return;
  const tab=e.target.closest('.sub-tab'); if(tab){ state.strategySubSection=tab.dataset.sub||'packages'; renderStrategyPanel(); return; }
  const jump=e.target.closest('.jump-clause'); if(jump){ jumpToClause(jump.dataset.clauseId); return; }
  const consistency=e.target.closest('.consistency-peek-btn'); if(consistency){ const secondary=consistency.dataset.secondaryId; if(secondary) showPeekCardForClause(secondary, consistency); if(consistency.dataset.primaryId) jumpToClause(consistency.dataset.primaryId); return; }
  const copyBrief=e.target.closest('.copy-review-brief'); if(copyBrief){ copyTextToClipboard(formatClauseReviewBrief(copyBrief.dataset.clauseId),'Brief copied'); return; }
  const clickMap=[['#copyNegPackBtn', ()=>copyTextToClipboard(formatNegotiationPack(),'Pack copied')],['#copyAgendaBtn', ()=>copyTextToClipboard(formatNegotiationAgenda(),'Internal negotiation prep copied')],['#openExportHubFromStrategyBtn', ()=>openExportHubModal()],['#exportAgendaBtn', ()=>exportNegotiationAgendaTxt()],['#openIssueConsoleFromLoopsBtn', ()=>{setWorkflowMode('review');setActiveTab('review');state.reviewSubSection='issues-console';renderActiveRightPanel();}],['#openNegotiateFromLoopsBtn', ()=>{setWorkflowMode('negotiate');setActiveTab('strategy');state.strategySubSection='packages';renderActiveRightPanel();}],['#addLibraryEntryBtn', ()=>addManualLibraryEntry()],['#exportLibraryBtn', ()=>exportClauseLibraryJson()],['#importLibraryBtn', ()=>els.libraryImportInput?.click()],['#copyMicroAgendaBtn', ()=>copyTextToClipboard(formatMicroAgenda(),'Micro-agenda copied')],['#startNewRoundBtn', ()=>startNewNegotiationRound()]];
  for(const [sel,fn] of clickMap){ const btn=e.target.closest(sel); if(btn){ fn(); return; } }
  const filterBtn=e.target.closest('[data-strategy-filter]'); if(filterBtn){ state.strategyFilterPreset=filterBtn.dataset.strategyFilter||'all'; renderStrategyPanel(); return; }
  const loopBtn=e.target.closest('[data-openloop-filter]'); if(loopBtn){ state.strategyPackageFilter=loopBtn.dataset.openloopFilter||'all'; state.strategySubSection='packages'; renderStrategyPanel(); return; }
  const packageBtn=e.target.closest('.package-filter-btn'); if(packageBtn){ state.strategyThemeFocus=packageBtn.dataset.packageTheme||''; state.strategySubSection='positions'; renderStrategyPanel(); return; }
  const clearTheme=e.target.closest('#clearStrategyThemeFocusBtn'); if(clearTheme){ state.strategyThemeFocus=''; renderStrategyPanel(); return; }
  const openFirst=e.target.closest('.package-open-first-btn'); if(openFirst && openFirst.dataset.clauseId){ jumpToClause(openFirst.dataset.clauseId); return; }
  const routeBtn=e.target.closest('.strategy-route-filter-btn'); if(routeBtn){ state.strategyPackageFilter=routeBtn.dataset.openloopFilter||'all'; state.strategySubSection='packages'; renderStrategyPanel(); return; }
  const copyLib=e.target.closest('.copy-library-item-btn'); if(copyLib){ copyTextToClipboard(formatLibraryEntry(state.clauseLibrary.find(x=>x.id===copyLib.dataset.id)),'Library entry copied'); return; }
  const agendaAction=e.target.closest('[data-action="add-to-agenda"],[data-action="remove-from-agenda"]'); if(agendaAction){ if(agendaAction.dataset.action==='add-to-agenda') addClauseToAgenda(agendaAction.dataset.clauseId); else removeClauseFromAgenda(agendaAction.dataset.clauseId); return; }
  const copySnap=e.target.closest('[data-action="copy-negotiation-snapshot"]'); if(copySnap){ if(state.selectedClauseId&&state.selectedClauseId!==OVERVIEW_ID) copyTextToClipboard(generateNegotiationSnapshot(state.selectedClauseId),'Negotiation snapshot copied'); return; }
  const editLib=e.target.closest('.edit-library-item-btn'); if(editLib){ editLibraryEntry(editLib.dataset.id); return; }
  const delLib=e.target.closest('.delete-library-item-btn'); if(delLib){ deleteLibraryEntry(delLib.dataset.id); return; }
}
function handleStrategyPanelInput(e){ if(e.target.id==='librarySearchInput'){ state.librarySearchQuery=e.target.value; clearTimeout(librarySearchDebounceTimer); librarySearchDebounceTimer=setTimeout(()=>{ if(state.activeTab==='strategy') scheduleRerender({rightPanel:true},'library-search'); },120); } }
function handleStrategyPanelChange(e){ const t=e.target; if(t.classList.contains('tracker-position-select')){ dispatch('SET_POSITION',{cid:t.dataset.clauseId,value:t.value}); return; } if(t.classList.contains('tracker-status-select')){ dispatch('SET_NEGOTIATION_STATUS',{cid:t.dataset.clauseId,value:t.value}); return; } }
function handleStrategyPanelFocusOut(e){ const t=e.target; if(t.classList.contains('tracker-cp-input')){ dispatch('SET_COUNTERPARTY_POSITION',{cid:t.dataset.clauseId,value:t.value}); return; } if(t.classList.contains('tracker-note-input')){ updateTrackerLatestNote(t.dataset.clauseId,t.value); } }

/* -- Wire Events -- */
function wireEvents(){
els.analyzePastedBtn.addEventListener('click',async()=>{const t=els.rawText.value.trim();if(!t){showToast('Paste contract text first.','warn');return;}captureLandingIntake();await withLoading('Analyzing pasted text...',()=>analyzeText(t,'Pasted contract text','pasted'));});
els.loadSampleBtn.addEventListener('click', async () => {
  const select = document.getElementById('sampleSelect');
  const key = select?.value || 'msa';
  const sample = SAMPLE_CONTRACTS[key] || SAMPLE_CONTRACTS.msa;
  captureLandingIntake();
  await withLoading(`Loading ${sample.label}...`, () =>
    analyzeText(sample.text, sample.fileName, 'sample')
  );
});
document.querySelectorAll('[data-start-intent]').forEach(btn=>btn.addEventListener('click',()=>{state.startIntent=btn.dataset.startIntent||'checks';document.querySelectorAll('[data-start-intent]').forEach(item=>item.classList.toggle('active',item===btn));const picker=document.querySelector('.focused-start-picker');if(picker)picker.hidden=state.startIntent!=='checks';}));
document.getElementById('focusedStartCheck')?.addEventListener('change',e=>{state.preferredStartCheck=e.target.value||'review-items';state.startIntent='checks';document.querySelectorAll('[data-start-intent]').forEach(item=>item.classList.toggle('active',item.dataset.startIntent==='checks'));});
els.readingModeBtn?.addEventListener('click',()=>toggleFocusMode());
els.printViewBtn?.addEventListener('click',()=>window.print());
els.checksWorkspace?.addEventListener('click',e=>{
  const open=e.target.closest('[data-open-check]');if(open){state.activeCheck=open.dataset.openCheck||'';state.activeConcept='';state.activeTermFilter='';state.checkFilter='all';renderChecksWorkspace();saveSessionReturn();return;}
  const origin=e.target.closest('[data-open-check-origin]');if(origin){state.activeCheck=origin.dataset.openCheckOrigin||'';state.activeConcept='';state.activeTermFilter='';state.checkFilter='all';renderChecksWorkspace();return;}
  if(e.target.closest('[data-check-back]')){state.activeCheck='';state.activeConcept='';state.activeTermFilter='';state.checkFilter='all';renderChecksWorkspace();return;}
  if(e.target.closest('[data-clear-term-filter]')){state.activeTermFilter='';renderChecksWorkspace();return;}
  const concept=e.target.closest('[data-concept-filter]');if(concept){state.activeConcept=state.activeConcept===concept.dataset.conceptFilter?'':concept.dataset.conceptFilter||'';renderChecksWorkspace();return;}
  const filter=e.target.closest('[data-check-filter]');if(filter){state.checkFilter=filter.dataset.checkFilter||'all';renderChecksWorkspace();return;}
  if(e.target.closest('[data-open-full-review]')){state.activeCheck='';setWorkflowStage('decide',{preserveTab:false});return;}
  const source=e.target.closest('[data-check-source]');if(source){setWorkflowStage('decide',{preserveTab:true});jumpToClause(source.dataset.checkSource,{fromCheck:true});return;}
  const finding=e.target.closest('[data-finding-state]');if(finding){state.findingReview||={};const key=finding.dataset.findingKey;const next=finding.dataset.findingState;state.findingReview[key]=state.findingReview[key]===next?'':next;renderChecksWorkspace();scheduleAutosave({reason:'critical'});return;}
  const complete=e.target.closest('[data-complete-check]');if(complete){state.checkCompletion||={};const id=complete.dataset.completeCheck;if(state.checkCompletion[id])delete state.checkCompletion[id];else state.checkCompletion[id]=new Date().toISOString();renderChecksWorkspace();scheduleAutosave({reason:'critical'});return;}
  const exp=e.target.closest('[data-check-export]');if(exp){exportCurrentCheck(CHECK_DEFINITIONS.find(i=>i.id===exp.dataset.checkExport));return;}
  if(e.target.closest('[data-export-glossary]')){exportDefinedTermsGlossary();return;}
  const resolve=e.target.closest('[data-resolve-placeholder]');if(resolve){togglePlaceholderResolved(resolve.dataset.resolvePlaceholder);renderChecksWorkspace();return;}
  const ignore=e.target.closest('.ignore-undefined-btn');if(ignore){ignoreUndefinedTerm(ignore.dataset.term);renderChecksWorkspace();return;}
  const copy=e.target.closest('.copy-term-btn');if(copy){copyTextToClipboard(formatTermDetail(copy.dataset.term),'Term copied');return;}
  const termUse=e.target.closest('[data-term-use-clause]');if(termUse){setWorkflowStage('decide',{preserveTab:true});jumpToClause(termUse.dataset.termUseClause,{fromCheck:true});return;}
  const playbook=e.target.closest('[data-check-playbook-guidance]');if(playbook){const cid=playbook.dataset.checkPlaybookGuidance;setWorkflowStage('decide',{preserveTab:true});jumpToClause(cid);openPlaybookGuidance(cid,playbook.dataset.moduleId||'');return;}
});
els.contractTypeSelect?.addEventListener('change',e=>{state.contractType=resolveContractType(e.target.value||'Custom');if(state.clauses.length){state.contractType=resolveContractType(els.contractTypeSelect?.value||'Custom');
if(state.contractType==='Custom'){
  const detected=inferContractType(state.rawText,state.clauses);
  state.contractType=detected;
  if(els.contractTypeSelect){const forward={'SaaS Agreement':'SaaS Agreement','Technology License':'Technology License','DPA':'DPA','DPDP DPA':'DPDP DPA','Custom':'Custom','IT/ITES Outsourcing':'IT/ITES Outsourcing','Staff Augmentation':'Staff Augmentation','Lease':'Lease'}; els.contractTypeSelect.value=forward[detected]||detected||'Custom';}
  if(detected!=='Custom') showToast(`Detected contract type: ${detected}`,'info');
}
state.expectedClauseCoverage=detectExpectedClauseCoverage(state.clauses,state.contractType);calculateAllRiskScores();renderAfterContentChange();scheduleAutosave();}});
els.fileInput.addEventListener('change',handleFileUpload);
const uz=document.querySelector('.upload-zone');
uz?.addEventListener('dragover',e=>{e.preventDefault();uz.classList.add('drag-over');});
uz?.addEventListener('dragleave',()=>uz.classList.remove('drag-over'));
uz?.addEventListener('drop',e=>{e.preventDefault();uz.classList.remove('drag-over');const f=e.dataTransfer?.files?.[0];if(f)handleUploadedFile(f).finally(()=>{if(els.fileInput)els.fileInput.value='';});});
els.showLandingBtn.addEventListener('click',()=>showLanding());
els.themeToggleBtn?.addEventListener('click',toggleTheme);
document.getElementById('landingThemeBtn')?.addEventListener('click', toggleTheme);
document.getElementById('landingPrefsBtn')?.addEventListener('click', openPrefsModal);
document.getElementById('headerPrefsBtn')?.addEventListener('click', openPrefsModal);
document.getElementById('closePrefsModalBtn')?.addEventListener('click', closePrefsModal);
document.getElementById('prefsModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('prefsModal')) closePrefsModal();
});

document.getElementById('prefsDarkBtn')?.addEventListener('click', () => {
  if (state.theme !== 'dark') toggleTheme();
  document.getElementById('prefsDarkBtn')?.classList.add('active');
  document.getElementById('prefsLightBtn')?.classList.remove('active');
});
document.getElementById('prefsLightBtn')?.addEventListener('click', () => {
  if (state.theme !== 'light') toggleTheme();
  document.getElementById('prefsLightBtn')?.classList.add('active');
  document.getElementById('prefsDarkBtn')?.classList.remove('active');
});

document.getElementById('prefsAutoAdvanceToggle')?.addEventListener('change', e => {
  state.prefs = { ...(state.prefs || {}), autoAdvanceDecisions: !!e.target.checked };
  savePrefs();
  showToast(state.prefs.autoAdvanceDecisions ? 'Auto-advance enabled' : 'Auto-advance disabled', 'info');
});
document.getElementById('prefsContrastToggle')?.addEventListener('change', () => toggleContrastMode());
document.querySelectorAll('[data-optional-feature]').forEach(input=>input.addEventListener('change',e=>{
  const key=e.target.dataset.optionalFeature;
  state.prefs={...(state.prefs||{}),optionalFeatures:{...(state.prefs?.optionalFeatures||{}),[key]:!!e.target.checked}};
  savePrefs();renderAll();showToast(`${e.target.closest('label')?.innerText?.trim()||'Optional module'} ${e.target.checked?'enabled':'disabled'}`,'info');
}));
document.getElementById('prefsDeveloperModeToggle')?.addEventListener('change',e=>{state.prefs={...(state.prefs||{}),developerMode:!!e.target.checked};savePrefs();renderAll();showToast(e.target.checked?'Developer diagnostics enabled':'Developer diagnostics hidden','info');});

document.getElementById('prefsInitialsInput')?.addEventListener('change', e => {
  const norm = String(e.target.value || '').trim().toUpperCase().slice(0, 6);
  e.target.value = norm;
  try { localStorage.setItem('cockpit-my-initials', norm); } catch {}
  savePrefs();
  if (norm) showToast(`My Inbox initials set to ${norm}`, 'info');
});

document.getElementById('prefsDisableAutosaveToggle')?.addEventListener('change', async e => { await setAutosaveDisabled(!!e.target.checked); });

document.getElementById('prefsClearAutosaveBtn')?.addEventListener('click', async () => {
  if(!window.confirm('Clear autosave for all locally stored matters? Snapshots and exported files will remain available.'))return;
  await clearAutosave();
  state.pendingRestoreSession = null;
  state.pendingRestoreMeta = null;
  state.sessionRestored = false;
  renderRestoreBanner();
  showToast('Autosave cleared', 'info');
});
document.getElementById('prefsClearSnapshotsBtn')?.addEventListener('click', async () => {
  if(!window.confirm('Permanently delete all local recovery snapshots? This cannot be undone.'))return;
  await clearAllSnapshots();
  showToast('Snapshots cleared', 'info');
});
document.getElementById('prefsClearLibraryBtn')?.addEventListener('click', async () => {
  if(!window.confirm('Permanently delete every saved precedent from this browser?'))return;
  await clearClauseLibraryStorage();
  state.clauseLibrary = [];
  showToast('Precedent library cleared', 'info');
});
document.getElementById('prefsWipeAllBtn')?.addEventListener('click', () => {
  if (confirm('Wipe all local data? This cannot be undone.')) wipeAllLocalData();
});

document.getElementById('headerHelpBtn')?.addEventListener('click', openShortcutsModal);
els.annunciatorPanel?.addEventListener('click',e=>{ const dismiss=e.target.closest('[data-annunciator-dismiss]'); if(dismiss){ state.hudDismissed=true; renderHeader(); return; } const btn=e.target.closest('[data-annunciator-index]'); if(!btn) return; const alerts=state.__primaryAnnunciator||computeAnnunciatorAlerts(); alerts[Number(btn.dataset.annunciatorIndex)]?.action?.(); });
els.workflowTriageBtn?.addEventListener('click',()=>setWorkflowStage('intake'));
els.workflowReviewBtn?.addEventListener('click',()=>setWorkflowStage('decide'));
els.workflowNegotiateBtn?.addEventListener('click',()=>setWorkflowStage('prepare'));
els.workflowOutputsBtn?.addEventListener('click',()=>setWorkflowStage('close'));
document.getElementById('healthTile')?.classList.add('clickable');
document.getElementById('healthTile')?.addEventListener('click', () => {
  setActiveTab('summary');
  renderActiveRightPanel();
});
els.outlineModeBtn?.addEventListener('click',()=>setNavigatorMode('outline'));
els.triageModeBtn?.addEventListener('click',()=>{ state.activeTermFilter=''; state.queuePreset='needs-decision'; setNavigatorMode('triage'); renderClauseList(); });
els.queueBar?.querySelectorAll('.queue-chip').forEach(btn=>{btn.dataset.baseLabel=btn.textContent.trim();});
els.queueBar?.addEventListener('click',e=>{const btn=e.target.closest('.queue-chip');if(!btn)return;state.activeTermFilter='';state.queuePreset=btn.dataset.queue||'needs-decision';state.navigatorMode='outline';renderClauseList();renderActiveRightPanel();scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);});
if (!hasSeenHint(HINT_KEYS.QUEUE_CHIPS)) { const firstChip = els.queueBar?.querySelector('.queue-chip'); if (firstChip) showHint(firstChip, 'Use queue chips to focus on specific clause groups — needs decision, high risk, awaiting input.', HINT_KEYS.QUEUE_CHIPS); }
document.getElementById('intakeRoleSelectQuick')?.addEventListener('change', e => {
  const full = document.getElementById('intakeRoleSelect');
  if (full) full.value = e.target.value;
  full?.dispatchEvent(new Event('change'));
});

document.getElementById('intakeJurisdictionSelectQuick')?.addEventListener('change', e => {
  const full = document.getElementById('intakeJurisdictionSelect');
  if (full) full.value = e.target.value;
  full?.dispatchEvent(new Event('change'));
});
let searchDebounce=null;
els.searchInput.addEventListener('input',e=>{state.activeTermFilter='';state.searchQuery=e.target.value.trim().toLowerCase();clearTimeout(searchDebounce);searchDebounce=setTimeout(()=>renderClauseList(),150);});
els.clauseList?.addEventListener('click',e=>{const btn=e.target.closest('.clause-item');if(!btn)return;jumpToClause(btn.dataset.clauseId);if(isMobileViewport())closeMobilePanels();});
els.resolveWorkspace?.addEventListener('click',e=>{const clause=e.target.closest('[data-resolve-open]');if(clause){setWorkflowStage('decide',{preserveTab:false});jumpToClause(clause.dataset.resolveOpen);return;}const stage=e.target.closest('[data-stage-jump]');if(stage)setWorkflowStage(stage.dataset.stageJump,{preserveTab:false});});
/* v6.0: Delegated clause view events */
els.clauseView?.addEventListener('click',handleClauseViewClick);
els.clauseView?.addEventListener('change',handleClauseViewChange);
els.clauseView?.addEventListener('input',handleClauseViewInput);
els.clauseView?.addEventListener('focusin',handleClauseViewFocusIn);
els.clauseView?.addEventListener('keydown',handleNoteSlashKeydown);
els.clauseView?.addEventListener('blur',handleClauseViewBlur,true);
els.clauseView?.addEventListener('submit',handleClauseViewSubmit);
document.querySelectorAll('.seg-btn').forEach(btn=>{btn.addEventListener('click',()=>{if(!btn.dataset.filter)return;state.activeTermFilter='';const g=btn.dataset.group||'content';const v=btn.dataset.filter||'all';state.filters||={content:'all',review:'all'};if(g==='review')state.filters.review=v;else state.filters.content=v;syncFilterUI();document.querySelector('.filter-popover[open]')?.removeAttribute('open');renderClauseList();scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);});});
els.toolTabs?.querySelectorAll('.tool-tab').forEach(btn=>{btn.addEventListener('click',()=>setActiveTab(btn.dataset.tab));});
document.getElementById('cockpitCollapseBtn')?.addEventListener('click', () => {
  state.cockpitCollapsed = !state.cockpitCollapsed;
  updateCockpitCollapseUI();
  savePrefs();
});
document.getElementById('cockpitSummaryBar')?.addEventListener('click', () => {
  if (state.cockpitCollapsed) {
    state.cockpitCollapsed = false;
    updateCockpitCollapseUI();
    savePrefs();
  }
});
els.toolsStrip?.querySelectorAll('.tools-tab').forEach(btn=> {
  btn.addEventListener('click', () => setActiveToolsTab(btn.dataset.toolsTab));
});
initRightPanelResize();
initModalAccessibility();

on(els.hubBtn,'click',()=>openExportHubModal('share'));
on(els.matterBtn,'click',()=>openExportHubModal('matter'));
on(els.closeSourceAssuranceBtn,'click',closeSourceAssuranceDialog);
on(els.cancelSourceAssuranceBtn,'click',closeSourceAssuranceDialog);
on(els.confirmSourceAssuranceBtn,'click',applySourceAssurance);
els.sourceAssuranceModal?.addEventListener('click',e=>{if(e.target===els.sourceAssuranceModal)closeSourceAssuranceDialog();});
on(els.closeSourceCorrectionBtn,'click',closeSourceCorrectionDialog);
on(els.cancelSourceCorrectionBtn,'click',closeSourceCorrectionDialog);
on(els.confirmSourceCorrectionBtn,'click',applyPendingSourceCorrection);
on(els.sourceSplitMarkerInput,'input',updateSourceCorrectionPreview);
els.sourceCorrectionCandidates?.addEventListener('click',e=>{const btn=e.target.closest('[data-source-marker]');if(!btn)return;els.sourceSplitMarkerInput.value=btn.dataset.sourceMarker||'';updateSourceCorrectionPreview();});
els.sourceCorrectionModal?.addEventListener('click',e=>{if(e.target===els.sourceCorrectionModal)closeSourceCorrectionDialog();});
els.cockpitClauseVal?.closest('.cockpit-tile')?.classList.add('clickable');
els.cockpitRiskVal?.closest('.cockpit-tile')?.classList.add('clickable');
els.cockpitPriorityVal?.closest('.cockpit-tile')?.classList.add('clickable');
els.cockpitNegotiationVal?.closest('.cockpit-tile')?.classList.add('clickable');
els.cockpitClauseVal?.closest('.cockpit-tile')?.addEventListener('click',()=>{ state.activeTermFilter=''; state.queuePreset='needs-decision'; renderClauseList(); });
els.cockpitRiskVal?.closest('.cockpit-tile')?.addEventListener('click',()=>{ state.activeTermFilter=''; state.queuePreset='high-risk'; renderClauseList(); });
els.cockpitPriorityVal?.closest('.cockpit-tile')?.addEventListener('click',()=>{ setWorkflowStage('close',{preserveTab:false}); });
els.cockpitNegotiationVal?.closest('.cockpit-tile')?.addEventListener('click',()=>{ setWorkflowStage('prepare',{preserveTab:false}); });
on(els.hubToggleFocusBtn,'click',()=>{ closeExportHubModal(); toggleFocusMode(); });
on(els.hubOpenShortcutsBtn,'click',()=>{ closeExportHubModal(); openShortcutsModal(); });
on(els.hubOpenCommandPaletteBtn,'click',()=>{ closeExportHubModal(); openCommandPalette(); });
on(els.hubWorkspaceSelect,'change',e=>{ const id=e.target.value||''; if(!id) return; applyWorkspaceById(id); });
on(els.hubSaveWorkspaceBtn,'click',saveCurrentWorkspace);
on(els.hubApplyWorkspaceBtn,'click',()=>{ const id=els.hubWorkspaceSelect?.value||''; if(id) applyWorkspaceById(id); else showToast('Select a workspace first','warn'); });
on(els.hubDeleteWorkspaceBtn,'click',()=>{ const id=els.hubWorkspaceSelect?.value||''; if(id) deleteWorkspaceById(id); else showToast('Select a workspace first','warn'); });
on(els.hubStartRoundBtn,'click',startNewNegotiationRound);
els.closeExportHubBtn?.addEventListener('click',closeExportHubModal);
els.exportHubModal?.addEventListener('click',e=>{if(e.target===els.exportHubModal)closeExportHubModal();});
els.hubExportReportBtn?.addEventListener('click', () => {
  if (!ensureExportReady()) return;
  if(els.exportHubPresetSelect)els.exportHubPresetSelect.value='client';
  const base = safeBaseName(state.documentMeta?.fileName || 'contract');
  const preset = getSelectedReportPreset();
  if(preset==='client'&&!getReviewableClauses().some(isClauseApprovedForExternalOutput)){
    showToast('Approve at least one clause and its external wording before creating a client-facing report.','warn');
    return;
  }
  const reportHtml = buildReportHtml(preset);
  const plainText = htmlToPlainText(reportHtml);
  const reportName=`${base}_review_${buildDateStamp()}.html`;
  openOutputPreview(`Review report preview (${preset})`, plainText, reportName, new Blob([reportHtml], {type:'text/html'}));
  closeExportHubModal();
});
els.hubExportEmailBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportEmailSummaryTxt(); closeExportHubModal();});
document.getElementById('hubInternalSummaryBtn')?.addEventListener('click',()=>{
  const targetByType={email:'hubExportEmailBtn',working:'hubExportWorkingNotesBtn',agenda:'hubExportAgendaBtn',pack:'hubExportPackBtn',changes:'hubExportChangesBtn',issues:'hubExportIssuesBtn',leadership:'hubExportLeadershipIssuesBtn'};
  document.getElementById(targetByType[document.getElementById('internalSummaryType')?.value||'email'])?.click();
});
els.hubExportStateBtn?.addEventListener('click',()=>{exportSessionJson(); closeExportHubModal();});
els.hubExportBundleBtn?.addEventListener('click',async()=>{await exportSessionBundleJson(); closeExportHubModal();});
els.hubExportWorkingNotesBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportWorkingNotesTxt(); closeExportHubModal();});
els.hubExportAgendaBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportNegotiationAgendaTxt(); closeExportHubModal();});
els.hubExportPackBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportNegotiationPack(); closeExportHubModal();});
els.hubExportChangesBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportChangeInstructionsTxt(); closeExportHubModal();});
els.approvalPackBtn?.addEventListener('click',()=>{if(!ensureApprovalExportReady()) return; exportApprovalPackTxt(); closeExportHubModal();});
els.hubSnapshotsBtn?.addEventListener('click',()=>{closeExportHubModal(); openSnapshotsModal();});
els.hubSaveSnapshotBtn?.addEventListener('click',()=>{closeExportHubModal(); openSnapshotsModal({focusNew:true});});
els.hubDataControlsBtn?.addEventListener('click',()=>{closeExportHubModal();openDataControlsModal();});
els.hubPreviewNegotiationPackBtn?.addEventListener('click',()=>{ if(!ensureExportReady()) return; openOutputPreview('Negotiation pack preview',formatNegotiationPack(),`${safeBaseName(state.documentMeta?.fileName||'contract')}_negotiation_pack.txt`); });
els.hubPreviewApprovalPackBtn?.addEventListener('click',()=>{ if(!ensureApprovalExportReady()) return; openOutputPreview('Approval pack preview',formatApprovalPack(),`${safeBaseName(state.documentMeta?.fileName||'contract')}_approval_pack.txt`); });
els.hubExportIssuesBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportIssueHotlistTxt(); closeExportHubModal();});
els.hubExportLeadershipIssuesBtn?.addEventListener('click',()=>{if(!ensureExportReady()) return; exportIssueHotlistTxt('Leadership'); closeExportHubModal();});
els.hubExportWordHandoffBtn?.addEventListener('click',()=>{if(!ensureExportReady())return;exportWordHandoff();closeExportHubModal();});
els.hubPreviewWordHandoffBtn?.addEventListener('click',()=>{if(!ensureExportReady())return;const base=safeBaseName(state.documentMeta?.fileName||'contract');const html=buildWordHandoffHtml();openOutputPreview('Word drafting handoff preview',htmlToPlainText(html),`${base}_word_handoff.html`,new Blob([html],{type:'text/html;charset=utf-8'}));});
els.hubExportEvidenceLedgerBtn?.addEventListener('click',()=>{if(!ensureExportReady())return;exportEvidenceLedger();closeExportHubModal();});
els.hubRecentMattersList?.addEventListener('click',e=>{const btn=e.target.closest('[data-open-matter-key]');if(btn)openRecentMatter(btn.dataset.openMatterKey);});
els.hubDiagnosticsBtn?.addEventListener('click',()=>{closeExportHubModal();openDiagnosticsModal();});
els.closeOutputPreviewBtn?.addEventListener('click',closeOutputPreview);
els.outputPreviewModal?.addEventListener('click',e=>{if(e.target===els.outputPreviewModal)closeOutputPreview();});
els.copyOutputPreviewBtn?.addEventListener('click',()=>copyTextToClipboard(els.outputPreviewBody?.textContent||'','Preview copied'));
els.downloadOutputPreviewBtn?.addEventListener('click',()=>{
  const current=currentOutputPreviewDownload;
  if(current?.blob){downloadBlob(current.fileName||'output_preview.txt',current.blob);return;}
  downloadBlob(els.outputPreviewBody?.dataset.downloadName||'output_preview.txt',new Blob([els.outputPreviewBody?.textContent||''],{type:'text/plain'}));
});
els.printOutputPreviewBtn?.addEventListener('click',()=>{const win=window.open('','_blank');if(!win){showToast('Allow pop-ups to print this preview.','warn');return;}win.opener=null;win.document.write(`<!doctype html><html><head><title>${escapeHtml(els.outputPreviewTitle?.textContent||'Output')}</title><style>body{font:14px/1.5 system-ui;margin:24px}pre{white-space:pre-wrap}</style></head><body><pre>${escapeHtml(els.outputPreviewBody?.textContent||'')}</pre></body></html>`);win.document.close();win.focus();win.print();});
els.closeDiagnosticsBtn?.addEventListener('click',closeDiagnosticsModal);
els.diagnosticsModal?.addEventListener('click',e=>{if(e.target===els.diagnosticsModal)closeDiagnosticsModal();});
els.closeDataControlsBtn?.addEventListener('click',closeDataControlsModal);
els.dataControlsModal?.addEventListener('click',e=>{if(e.target===els.dataControlsModal)closeDataControlsModal();});
els.disableAutosaveToggle?.addEventListener('change',async e=>{await setAutosaveDisabled(!!e.target.checked);});
els.autoAdvanceToggle?.addEventListener('change',e=>{ state.prefs={...(state.prefs||{}),autoAdvanceDecisions:!!e.target.checked}; savePrefs(); showToast(state.prefs.autoAdvanceDecisions?'Auto-advance enabled':'Auto-advance disabled','info'); });
els.clearAutosaveBtn?.addEventListener('click',async()=>{if(!window.confirm('Clear autosave for all locally stored matters? Snapshots and exported files will remain available.'))return;await clearAutosave();state.pendingRestoreSession=null;state.pendingRestoreMeta=null;state.sessionRestored=false;renderRestoreBanner();showToast('Autosave cleared','info');});
els.clearSnapshotsBtn?.addEventListener('click',async()=>{if(!window.confirm('Permanently delete all local recovery snapshots? This cannot be undone.'))return;await clearAllSnapshots();showToast('Snapshots cleared','info');});
els.clearLibraryBtn?.addEventListener('click',async()=>{if(!window.confirm('Permanently delete every saved precedent from this browser?'))return;await clearClauseLibraryStorage();state.clauseLibrary=[];renderActiveRightPanel();showToast('Precedent library cleared','info');});
els.wipeAllDataBtn?.addEventListener('click',async()=>{const confirmText=window.prompt('Type DELETE to remove autosave, snapshots, clause library, playbook repository, and local preferences from this browser.');if(confirmText!=='DELETE') return; await wipeAllLocalData();state.playbookPackages=mergePlaybookPackages([],PLAYBOOK_CORE.BUILTIN_PACKAGES||[]);state.activePlaybookProfile={packageId:'',version:'',role:'',activatedAt:''};state.clausePlaybookState={};renderPlaybookPackageSelect();closeDataControlsModal();showToast('All local data cleared','info');showLanding();});
document.addEventListener('keydown',handleGlobalKeydown);
els.commandPaletteInput?.addEventListener('keydown',e=>{const items=window.__commandPaletteItems||[];if(e.key==='ArrowDown'){e.preventDefault();commandPaletteSelectedIndex=Math.min(commandPaletteSelectedIndex+1,Math.max(items.length-1,0));updateCommandPaletteSelection();}else if(e.key==='ArrowUp'){e.preventDefault();commandPaletteSelectedIndex=Math.max(commandPaletteSelectedIndex-1,0);updateCommandPaletteSelection();}else if(e.key==='Enter'){e.preventDefault();items[commandPaletteSelectedIndex]?.run?.();closeCommandPalette();}});
els.closeSnapshotsBtn?.addEventListener('click',closeSnapshotsModal);
els.snapshotSaveConfirmBtn?.addEventListener('click',saveSnapshot);
els.snapshotModal?.addEventListener('click',e=>{if(e.target===els.snapshotModal)closeSnapshotsModal();});
els.restoreSessionBtn?.addEventListener('click',()=>{if(state.pendingRestoreSession?.clauses?.length){const valid=validateSessionShape(state.pendingRestoreSession);if(!valid.ok){showToast(valid.message,'error');state.pendingRestoreSession=null;state.pendingRestoreMeta=null;state.sessionRestored=false;renderRestoreBanner();return;}hydrateState(valid.session);syncLandingIntakeFromMatter(); state.diagnostics.lastRestoreSource='autosave'; state.pendingRestoreSession=null; state.pendingRestoreMeta=null; state.sessionRestored=false; showApp(); renderAll(); scheduleAutosave();} else {state.sessionRestored=false;renderRestoreBanner();}});
els.startFreshBtn?.addEventListener('click',async()=>{const pending=state.pendingRestoreSession;const recoverable=state.clauses.length?serializeStateForExport():pending;const matterName=state.documentMeta?.fileName||pending?.documentMeta?.fileName||'the current matter';if(!window.confirm(`Start fresh?\n\n${matterName} will be removed from autosave. A recovery snapshot will be created first; other recent matters will remain available.`))return;let snapshot=null;if(recoverable?.clauses?.length)snapshot=await saveSnapshotPayloadRecord(recoverable,`Recovery before Start fresh · ${matterName}`,getActiveWorkflowStage(),{recovery:true});await clearAutosaveForMatter(recoverable);resetState();state.pendingRestoreSession=null;state.pendingRestoreMeta=null;state.sessionRestored=false;renderRestoreBanner();showLanding();showToast(snapshot?'Started fresh. The matter remains available as a recovery snapshot.':'Started fresh. No review data required recovery.','info');});
els.closeLibraryModalBtn?.addEventListener('click',closeLibraryModal);
els.cancelLibraryModalBtn?.addEventListener('click',closeLibraryModal);
els.libraryModal?.addEventListener('click',e=>{if(e.target===els.libraryModal)closeLibraryModal();});
els.libraryForm?.addEventListener('submit',submitLibraryForm);
els.libraryImportInput?.addEventListener('change',handleClauseLibraryImport);
els.closeShortcutsBtn?.addEventListener('click',closeShortcutsModal);
els.shortcutsModal?.addEventListener('click',e=>{if(e.target===els.shortcutsModal)closeShortcutsModal();});
els.closeCommandPaletteBtn?.addEventListener('click',closeCommandPalette);
els.commandPaletteModal?.addEventListener('click',e=>{if(e.target===els.commandPaletteModal)closeCommandPalette();});
els.commandPaletteInput?.addEventListener('input',e=>renderCommandPalette(e.target.value||''));
els.mobileClauseDrawerBtn?.addEventListener('click',()=>openMobileLeftPanel());
els.mobileBackdrop?.addEventListener('click',closeMobilePanels);
els.mobileToolLauncher?.addEventListener('click',e=>{if(e.target===els.mobileToolLauncher||e.target.closest('[data-close-mobile-launcher]'))closeMobileToolLauncher();});
els.mobileToolLauncher?.querySelectorAll('[data-mobile-action]').forEach(btn=>btn.addEventListener('click',()=>handleMobileMenuAction(btn.dataset.mobileAction)));
els.mobileBottomNav?.querySelectorAll('.mobile-nav-btn').forEach(btn=>btn.addEventListener('click',()=>setMobileWorkflowStage(btn.dataset.mobileStage)));
els.mobileToolsMenu?.querySelectorAll('[data-mobile-action]').forEach(btn=>btn.addEventListener('click',()=>{handleMobileMenuAction(btn.dataset.mobileAction);els.mobileToolsMenu?.removeAttribute('open');}));
let resizeTimer=null;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    const mobile=isMobileViewport();
    if(!mobile){ closeMobilePanels(); closeMobileToolLauncher(); state.mobileView='review'; }
    updateMobileUI();
    renderMinimapRail();
  },100);
});
document.querySelectorAll('.topbar-menu').forEach(menu=>{menu.addEventListener('toggle',()=>{if(menu.open)document.querySelectorAll('.topbar-menu').forEach(o=>{if(o!==menu)o.removeAttribute('open');});});});
document.addEventListener('click',e=>{if(!e.target.closest('.topbar-menu'))document.querySelectorAll('.topbar-menu[open]').forEach(m=>m.removeAttribute('open')); if(!e.target.closest('.filter-popover')) document.querySelectorAll('.filter-popover[open]').forEach(m=>m.removeAttribute('open'));});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.filter-popover[open]').forEach(m=>m.removeAttribute('open')); });
els.onboardingOverlay?.addEventListener('click',async e=>{if(e.target.closest('[data-onboarding-tour]')){dismissOnboarding();state.startIntent='checks';captureLandingIntake();await withLoading(`Loading ${SAMPLE_CONTRACTS.tour.label}...`,()=>analyzeText(SAMPLE_CONTRACTS.tour.text,SAMPLE_CONTRACTS.tour.fileName,'sample'));return;}if(e.target===els.onboardingOverlay||e.target.closest('[data-dismiss-onboarding]'))dismissOnboarding();});
els.importPlaybookBtn?.addEventListener('click',()=>els.playbookImportInput?.click());
els.playbookImportInput?.addEventListener('change',handlePlaybookImport);
els.activatePlaybookBtn?.addEventListener('click',activateSelectedPlaybook);
els.closePlaybookGuidanceBtn?.addEventListener('click',()=>closeModal(els.playbookGuidanceModal));
els.closePlaybookDecisionPreviewBtn?.addEventListener('click',()=>closeModal(els.playbookDecisionPreviewModal));
els.cancelPlaybookDecisionPreviewBtn?.addEventListener('click',()=>{pendingPlaybookDecisionPreview=null;closeModal(els.playbookDecisionPreviewModal);});
els.applyPlaybookDecisionPreviewBtn?.addEventListener('click',()=>{const pending=pendingPlaybookDecisionPreview;pendingPlaybookDecisionPreview=null;closeModal(els.playbookDecisionPreviewModal);if(pending)commitPlaybookRung(pending.cid,pending.moduleId,pending.rungId,true);});
els.playbookGuidanceBody?.addEventListener('change',e=>{if(e.target.matches('[data-playbook-guidance-select]'))openPlaybookGuidance(els.playbookGuidanceModal?.dataset.clauseId||state.selectedClauseId,e.target.value);});
els.playbookGuidanceBody?.addEventListener('click',e=>{const copy=e.target.closest('[data-guidance-copy-sample]');if(copy){const pkg=getActivePlaybookPackage();const module=pkg?.modules?.find(item=>item.id===copy.dataset.moduleId);if(module?.sampleLanguage)copyTextToClipboard(module.sampleLanguage,`${module.id} suggested clause copied`);return;}const related=e.target.closest('[data-guidance-related-module]');if(related){openPlaybookGuidance(els.playbookGuidanceModal?.dataset.clauseId||state.selectedClauseId,related.dataset.guidanceRelatedModule);return;}const confirm=e.target.closest('[data-guidance-confirm]');if(confirm){setClausePlaybookModule(confirm.dataset.clauseId,confirm.dataset.moduleId,'confirmed');openPlaybookGuidance(confirm.dataset.clauseId,confirm.dataset.moduleId);return;}const drafting=e.target.closest('[data-guidance-apply-rung]');if(drafting){commitPlaybookRung(drafting.dataset.clauseId,drafting.dataset.moduleId,drafting.dataset.rung,false);openPlaybookGuidance(drafting.dataset.clauseId,drafting.dataset.moduleId);return;}const preview=e.target.closest('[data-guidance-preview-decision]');if(preview){openPlaybookDecisionPreview(preview.dataset.clauseId,preview.dataset.moduleId,preview.dataset.rung);}});
}

/* -- Delegated clause view handlers -- */
function handleClauseViewSubmit(e){
const form=e.target.closest('.inline-notes-thread form');if(!form)return;e.preventDefault();
const clause=getSelectedClause();const cid=clause?.id;if(!cid)return;
captureInlineNoteDraft(form,cid);const d=getInlineNoteDraft(cid);const txt=String(d.text||'').trim();if(!txt)return;
const eid=d.editingId||form.dataset.editingId;
if(eid){const n=state.notes.find(x=>x.id===eid);if(n){n.type=d.type;n.text=txt;n.owner=d.owner||'';n.routeTo=d.routeTo||'';n.blocker=!!d.blocker;n.businessCall=!!d.businessCall;n.proposedFallback=d.proposedFallback||'';n.updatedAt=new Date().toISOString();logReviewAction('note-edited',cid,{summary:n.type||'Note'});}}
else{const newNote={id:`note-${Date.now()}`,clauseId:cid,type:d.type,text:txt,owner:d.owner||'',routeTo:d.routeTo||'',blocker:!!d.blocker,businessCall:!!d.businessCall,proposedFallback:d.proposedFallback||'',createdAt:new Date().toISOString()};state.notes.push(newNote);logReviewAction('note-added',cid,{summary:d.type||'Note'});recordUndoable('Add note',cid,{before:newNote.id,after:null,reverter:(noteId)=>{if(typeof noteId==='string'){state.notes=state.notes.filter(n=>n.id!==noteId);}refreshDerivedClauseState(cid);onSubstantiveChange({rerenderClause:true});}});}
refreshDerivedClauseState(cid);
clearInlineNoteDraft();renderAfterContentChange();state.pendingClauseViewRender=false;renderClauseView();scheduleAutosave();
}

function handleClauseViewClick(e){
const actionEl=e.target.closest('[data-action]');
const findingTool=e.target.closest('[data-open-finding-tool]');if(findingTool){setActiveToolsTab(findingTool.dataset.openFindingTool||'map');document.getElementById('toolsStrip')?.setAttribute('open','');return;}
if(actionEl?.dataset?.action==='copy-negotiation-snapshot'){ copyTextToClipboard(generateNegotiationSnapshot(state.selectedClauseId),'Negotiation snapshot copied'); return; }

const clause=getSelectedClause();const cid=clause?.id;
const action=actionEl?.dataset?.action;
if(e.target.closest('[data-risk-clause-id]')){jumpToClause(e.target.closest('[data-risk-clause-id]').dataset.riskClauseId);return;}
if(e.target.closest('.jump-clause[data-clause-id]')){jumpToClause(e.target.closest('.jump-clause[data-clause-id]').dataset.clauseId);return;}
if(cid && e.target.closest('.tag-chip')){const chip=e.target.closest('.tag-chip');toggleClauseTag(cid,chip.dataset.tag);renderClauseView();scheduleAutosave();return;}
if(cid && e.target.closest('.routing-chip')){const chip=e.target.closest('.routing-chip');toggleClauseRoutingTag(cid,chip.dataset.routing);renderClauseView();scheduleAutosave();return;}
const phBtn = e.target.closest('.placeholder-resolve-btn');
if (phBtn) {
  e.stopPropagation();
  togglePlaceholderResolved(phBtn.dataset.placeholderId);
  renderClauseView();
  renderToolsPanel();
  return;
}
/* v6.0: side-peek on xref chip */
if(e.target.closest('.xref-chip')){const chip=e.target.closest('.xref-chip');const targetId=chip.dataset.targetClauseId;if (!hasSeenHint(HINT_KEYS.XREF_CHIP)) { showHint(chip, 'Click to preview the referenced clause. Shift+click to jump directly to it.', HINT_KEYS.XREF_CHIP); markHintSeen(HINT_KEYS.XREF_CHIP); }if(e.shiftKey){traceXrefChain(targetId,{persistent:true});jumpToClause(targetId);}else{showPeekCardForClause(targetId,chip);}return;}
if(!action||!cid)return;
switch(action){
case 'add-note':case 'open-inline-note':openInlineNoteDraft(cid);renderClauseView();focusInlineNoteEditor();scheduleAutosave();break;
case 'cancel-note':clearInlineNoteDraft();renderClauseView();scheduleAutosave();break;
case 'focus-issues':setActiveTab('review');break;
case 'focus-terms':openFocusedCheck('definitions');break;
case 'view-clause-obligations':openFocusedCheck('obligations');break;
case 'copy-clause':copyTextToClipboard(formatClauseCopy(cid),'Clause copied');break;
case 'open-playbook-guidance':openPlaybookGuidance(cid,actionEl.dataset.moduleId||'');break;
case 'activate-compatible-playbook':activatePlaybookKey(actionEl.dataset.playbookKey||'');break;
case 'prepare-external-wording':state.clauseAudienceSharing[cid]={...(state.clauseAudienceSharing[cid]||{}),client:true};scheduleAutosave({reason:'critical'});renderClauseView();queueMicrotask(()=>els.clauseView?.querySelector('#decisionExternalSummaryInput')?.focus());break;
case 'set-decision':applyClauseDecision(cid,actionEl.dataset.decisionType||'');renderClauseView();renderClauseList();renderContextPanel();break;
case 'verify-clause-source':state.verificationByKey={...(state.verificationByKey||{}),[`clause-source-${cid}`]:'confirmed'};refreshDerivedClauseState(cid);logReviewAction('clause-source-verified',cid,{summary:'Lawyer confirmed the decision against the source clause'});onSubstantiveChange({rerenderClause:true});showToast('Clause source verified','info');break;
case 'toggle-decision-collapse':state.mobileDecisionCollapsed=!state.mobileDecisionCollapsed; if(els.app) els.app.classList.toggle('mobile-decision-collapsed', state.mobileDecisionCollapsed && isMobileViewport()); renderClauseView(); break;
case 'exclude-review-block':state.reviewabilityOverrides[cid]='exclude';state.selectedClauseId=OVERVIEW_ID;calculateAllRiskScores();scheduleAutosave({reason:'critical'});renderClauseList();renderClauseView();showToast('Block excluded from the review queue; restore it from Advanced analysis.','info');break;
case 'set-position':dispatch('SET_POSITION',{cid,value:actionEl.dataset.position||''});renderClauseView();break;
case 'clear-position':dispatch('SET_POSITION',{cid,value:''});renderClauseView();break;
case 'toggle-compare':state.clauseCompareMode[cid]=!state.clauseCompareMode[cid];renderClauseView();scheduleAutosave();break;
case 'open-compare-overlay':openCompareOverlay(cid);break;
case 'toggle-redline':if(!(state.clauseRecommendations[cid]||'').trim())return;state.clauseRedlineMode[cid]=!state.clauseRedlineMode[cid];renderClauseView();scheduleAutosave();break;
case 'toggle-risk-narrative':document.getElementById('riskNarrativeWrap')?.classList.toggle('hidden');break;
case 'toggle-clause-body':state.collapsedBodies||={};state.collapsedBodies[cid]=!state.collapsedBodies[cid];renderClauseView();break;
case 'correct-split-clause':correctSplitClause(cid);break;
case 'correct-merge-next':correctMergeWithNext(cid);break;
case 'copy-review-brief':state.clauseBriefOpenIds[cid]=!state.clauseBriefOpenIds[cid];renderClauseView();scheduleAutosave();break;
case 'copy-clause-brief':copyTextToClipboard(formatClauseBriefText(cid)||formatClauseReviewBrief(cid),'Brief copied');break;
case 'insert-note-template':{const form=actionEl.closest('form'); if(form) applyNoteSlashCommand(form,actionEl.dataset.template); break;}
case 'toggle-bookmark':toggleClauseBookmark(cid);renderClauseView();break;
case 'snooze-clause':if(isClauseSnoozed(cid)) unsnoozeClause(cid); else snoozeClause(cid); break;
case 'expand-contrast':state.contrastExpandedClauseIds[cid]=true;renderClauseView();break;
case 'save-clause-library':saveClauseToLibrary(cid);break;
case 'save-as-playbook':saveClauseAsPlaybook(cid);break;
case 'show-drafting-fields':state.draftingOpenClauseIds[cid]=true;if(!Object.prototype.hasOwnProperty.call(state.clauseRecommendations,cid))state.clauseRecommendations[cid]='';renderClauseView();els.clauseView?.querySelector('#recommendationInput')?.focus();scheduleAutosave();break;
case 'next-changed-clause':jumpToNextChangedClause();break;
case 'copy-negotiation-script': { const script = generateNegotiationScript(cid); if (script) copyTextToClipboard(script, 'Negotiation script copied'); break; }
case 'remove-drafting-fields':delete state.clauseRecommendations[cid];delete state.clauseFallbacks[cid];delete state.draftingOpenClauseIds[cid];renderClauseView();scheduleAutosave();break;
case 'show-negotiation-context':toggleNegotiationContextOpen(cid,true);break;
case 'dismiss-drafting-nudge':dismissDraftingNudge(cid);break;
case 'apply-playbook':applyPlaybookMatchToClause(actionEl.dataset.clauseId||cid);break;
case 'confirm-playbook-module':setClausePlaybookModule(cid,actionEl.dataset.moduleId,'confirmed');break;
case 'ignore-playbook-module':setClausePlaybookModule(cid,actionEl.dataset.moduleId,'ignored');break;
case 'toggle-playbook-guidance':state.playbookExpandedClauseIds[cid]=!state.playbookExpandedClauseIds[cid];renderClauseView();break;
case 'apply-playbook-rung':applyPlaybookRung(cid,actionEl.dataset.moduleId,actionEl.dataset.rung);break;
case 'apply-playbook-rung-and-decision':applyPlaybookRung(cid,actionEl.dataset.moduleId,actionEl.dataset.rung,true);break;
case 'copy-suggested-library':case 'copy-playbook':{const it=state.clauseLibrary.find(x=>x.id===actionEl.dataset.id);if(it)copyTextToClipboard(formatLibraryEntry(it),'Copied');break;}
case 'edit-playbook':editLibraryEntry(actionEl.dataset.id);break;
case 'copy-inline-note':{const n=state.notes.find(x=>x.id===actionEl.dataset.noteId);if(n)copyTextToClipboard(formatSingleNote(n),'Note copied');break;}
case 'delete-inline-note':{const nid=actionEl.dataset.noteId;const del=state.notes.find(n=>n.id===nid);state.notes=state.notes.filter(n=>n.id!==nid);if(del)logReviewAction('note-deleted',del.clauseId,{summary:del.type||'Note'});refreshDerivedClauseState(cid);renderAfterContentChange();renderClauseView();scheduleAutosave();break;}
case 'edit-inline-note':{const n=state.notes.find(x=>x.id===actionEl.dataset.noteId);if(!n)return;openInlineNoteDraft(cid,{editingId:n.id,type:n.type,text:n.text,owner:n.owner||'',routeTo:n.routeTo||'',blocker:!!n.blocker,businessCall:!!n.businessCall,proposedFallback:n.proposedFallback||''});renderClauseView();focusInlineNoteEditor();break;}
case 'close-side-peek':closeSidePeek();break;
case 'jump-side-peek':jumpToClause(actionEl.dataset.clauseId);closeSidePeek();break;
}
}

function handleClauseViewChange(e){
const t=e.target;
if(t.matches('[data-verification-key]')){state.verificationByKey={...(state.verificationByKey||{}),[t.dataset.verificationKey]:t.value||'unverified'};scheduleAutosave({reason:'critical'});showToast(`Marked ${t.value||'unverified'}`,'info');return;}
if(t.matches('[data-deal-term-field]')){state.dealTermsBaseline={...(state.dealTermsBaseline||{}),[t.dataset.dealTermField]:t.value};scheduleAutosave({reason:'critical'});renderClauseView();return;}
const clause=getSelectedClause();const cid=clause?.id;if(!cid)return;
if(t.matches('.tag-chip'))toggleClauseTag(cid,t.dataset.tag);
else if(t.matches('.routing-chip'))toggleClauseRoutingTag(cid,t.dataset.routing);
else if(t.id==='negotiationPositionSelect')setClausePosition(cid,t.value);
else if(t.id==='reviewStatusSelect')setClauseReviewStatus(cid,t.value);
else if(t.id==='counterpartyLastDiscussedInput')setClauseCounterpartyLastDiscussed(cid,t.value);
else if(t.id==='negotiationStatusSelect')setClauseNegotiationStatus(cid,t.value);
else if(t.closest('.inline-notes-thread form')){const form=t.closest('form');captureInlineNoteDraft(form,cid);if(t.name==='text')handleNoteSlashInput(form);} 
if(['decisionRouteSelect','decisionPrioritySelect','decisionIncludePackCheckbox','decisionApprovalStatusSelect','decisionBlocksApprovalCheckbox'].includes(t.id)){
  if(t.id==='decisionRouteSelect') setClauseDecision(cid,{route:t.value});
  if(t.id==='decisionPrioritySelect') setClauseDecision(cid,{priority:t.value});
  if(t.id==='decisionIncludePackCheckbox') setClauseDecision(cid,{includeInPack:!!t.checked});
  if(t.id==='decisionApprovalStatusSelect'){state.clauseApprovalStatus[cid]=t.value;setClauseDecision(cid,{approvalStatus:t.value});}
  if(t.id==='decisionBlocksApprovalCheckbox') setClauseDecision(cid,{blocksApproval:!!t.checked});
  syncDecisionToLegacyState(cid);
  recomputeOpenLoops();
  scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
  renderCockpitStrip(); renderQueueBar(); renderContextPanel();
  if(!maybeAutoAdvanceDecision(cid)) renderClauseView();
}
if(t.id==='decisionShareClientCheckbox'){state.clauseAudienceSharing[cid]={...(state.clauseAudienceSharing[cid]||{}),client:!!t.checked};scheduleAutosave({reason:'critical'});showToast(t.checked?'Added to external-output preparation':'Removed from external-output preparation','info');renderClauseView();}
if(t.id==='decisionExternalSummaryApproved'){
  const current=state.clauseAudienceSharing[cid]||{};
  const approved=!!t.checked&&!!String(current.summary||'').trim();
  state.clauseAudienceSharing[cid]={...current,summaryApproved:approved};
  if(t.checked&&!approved)showToast('Write the external wording before approving it.','warn');
  scheduleAutosave({reason:'critical'});renderClauseView();
}
}

function handleClauseViewFocusIn(e){
const clause=getSelectedClause();const cid=clause?.id;if(!cid)return;const t=e.target;
if(['decisionRationaleInput','decisionOpeningAskInput','decisionFallbackInput','decisionRouteSelect','decisionPrioritySelect','decisionIncludePackCheckbox','decisionOwnerInput','decisionQuestionInput','decisionApprovalStatusSelect','decisionBlocksApprovalCheckbox','counterpartyPositionInput','counterpartyNextStepInput'].includes(t.id) || t.closest('.inline-notes-thread form')){
  t.dataset.undoBefore = JSON.stringify(deepCloneUndoValue(getClauseDecision(cid)));
}
}

function handleClauseViewInput(e){
const t=e.target;if(t.matches('[data-deal-term-field]')){state.dealTermsBaseline={...(state.dealTermsBaseline||{}),[t.dataset.dealTermField]:t.value};scheduleAutosave();return;}const clause=getSelectedClause();const cid=clause?.id;if(!cid)return;
if(t.id==='recommendationInput')setClauseRecommendation(cid,t.value);
else if(t.id==='fallbackInput')setClauseFallback(cid,t.value);
else if(t.id==='decisionRationaleInput') setClauseDecision(cid,{rationale:t.value});
else if(t.id==='decisionOpeningAskInput') setClauseDecision(cid,{openingAsk:t.value});
else if(t.id==='decisionFallbackInput') setClauseDecision(cid,{fallback:t.value});
else if(t.id==='decisionRouteSelect') setClauseDecision(cid,{route:t.value});
else if(t.id==='decisionPrioritySelect') setClauseDecision(cid,{priority:t.value});
else if(t.id==='decisionIncludePackCheckbox') setClauseDecision(cid,{includeInPack:!!t.checked});
else if(t.id==='decisionOwnerInput') setClauseDecision(cid,{owner:t.value});
else if(t.id==='decisionQuestionInput') setClauseDecision(cid,{question:t.value});
else if(t.id==='decisionApprovalStatusSelect'){state.clauseApprovalStatus[cid]=t.value;setClauseDecision(cid,{approvalStatus:t.value});}
else if(t.id==='decisionBlocksApprovalCheckbox') setClauseDecision(cid,{blocksApproval:!!t.checked});
else if(t.id==='counterpartyPositionInput')setClauseCounterpartyPosition(cid,t.value);
else if(t.id==='counterpartyNextStepInput')setClauseCounterpartyNextStep(cid,t.value);
else if(t.id==='decisionExternalSummaryInput'){
  const current=state.clauseAudienceSharing[cid]||{};
  state.clauseAudienceSharing[cid]={...current,summary:t.value,summaryApproved:false};
}
else if(t.id==='fallback2Input')setClauseFallbackLadderValue(cid,'fallback2',t.value);
else if(t.id==='walkAwayInput')setClauseFallbackLadderValue(cid,'walkAway',t.value);
else if(t.closest('.inline-notes-thread form')){const form=t.closest('form');captureInlineNoteDraft(form,cid);if(t.name==='text')handleNoteSlashInput(form);} 
if(['decisionRationaleInput','decisionOpeningAskInput','decisionFallbackInput','decisionRouteSelect','decisionPrioritySelect','decisionIncludePackCheckbox','decisionOwnerInput','decisionQuestionInput','decisionApprovalStatusSelect','decisionBlocksApprovalCheckbox','counterpartyPositionInput','counterpartyNextStepInput','decisionExternalSummaryInput'].includes(t.id) || t.closest('.inline-notes-thread form')){
  scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
}
}

function handleClauseViewBlur(e){
const clause=getSelectedClause();const cid=clause?.id;if(!cid)return;const t=e.target;
if(t.id==='decisionRationaleInput'||t.id==='decisionOpeningAskInput'||t.id==='decisionFallbackInput'||t.id==='decisionRouteSelect'||t.id==='decisionPrioritySelect'||t.id==='decisionIncludePackCheckbox'||t.id==='decisionOwnerInput'||t.id==='decisionQuestionInput'||t.id==='decisionApprovalStatusSelect'||t.id==='decisionBlocksApprovalCheckbox'){
  const before=t.dataset.undoBefore?JSON.parse(t.dataset.undoBefore):null;
  const after=deepCloneUndoValue(getClauseDecision(cid));
  if(before&&JSON.stringify(before)!==JSON.stringify(after)){
    recordUndoable('Decision detail update',cid,{before,after,reverter:(val)=>{state.decisionByClause[cid]=deepCloneUndoValue(val)||{};syncDecisionToLegacyState(cid);recomputeOpenLoops();renderClauseView();renderClauseList();renderActiveRightPanel();}});
  }
  delete t.dataset.undoBefore;
  syncDecisionToLegacyState(cid);
  recomputeOpenLoops();
  scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
  renderCockpitStrip();renderQueueBar();renderContextPanel();
  if(!maybeAutoAdvanceDecision(cid)) renderClauseView();
}
if(t.id==='recommendationInput'||t.id==='fallbackInput'||t.id==='fallback2Input'||t.id==='walkAwayInput')scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
else if(t.id==='counterpartyPositionInput')commitClauseCounterpartyPosition(cid,t.value);
else if(t.id==='counterpartyNextStepInput')commitClauseCounterpartyNextStep(cid,t.value);
else if(t.closest('.inline-notes-thread form')){
closeNoteSlashMenu(t.closest('form'));
scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
requestAnimationFrame(()=>{
const form=els.clauseView?.querySelector('.inline-notes-thread form');
if(state.pendingClauseViewRender && (!form || !form.contains(document.activeElement))){
state.pendingClauseViewRender=false;
renderClauseView();
}
});
}
}

/* -- Side-peek (v6.0) -- */
function toggleSidePeek(targetClauseId,anchorEl){
if(state.sidePeekClauseId===targetClauseId){closeSidePeek();return;}
closeSidePeek();
const clause=state.clauses.find(c=>c.id===targetClauseId);if(!clause)return;
state.sidePeekClauseId=targetClauseId;
const peek=document.createElement('div');peek.className='side-peek';peek.id='sidePeekPanel';
peek.innerHTML=`<div class="side-peek-header"><span class="side-peek-label">${escapeHtml(clause.number)} - ${escapeHtml(clause.heading)}</span><div class="side-peek-actions"><button data-action="jump-side-peek" data-clause-id="${escapeHtml(clause.id)}" class="link-btn">Open full</button><button data-action="close-side-peek" class="link-btn">Close</button></div></div><div class="side-peek-body">${escapeHtml(clause.body||'').replace(/\n/g,'<br>')}</div>`;
const body=anchorEl?.closest('.clause-body-wrap')||anchorEl?.closest('.clause-body');
if(body)body.after(peek);else els.clauseView?.appendChild(peek);
}
function closeSidePeek(){state.sidePeekClauseId=null;document.getElementById('sidePeekPanel')?.remove();}

/* -- Scheduling -- */
function resolveAutosaveDelay(delayOrOpts=300){ if(typeof delayOrOpts==='number') return delayOrOpts; if(typeof delayOrOpts==='object' && delayOrOpts){ if(typeof delayOrOpts.delay==='number') return delayOrOpts.delay; if(delayOrOpts.reason && Object.prototype.hasOwnProperty.call(AUTOSAVE_REASON_DEFAULT_DELAY, delayOrOpts.reason)) return AUTOSAVE_REASON_DEFAULT_DELAY[delayOrOpts.reason]; } return 300; }
function scheduleAutosave(delayOrOpts=300){autosaveDirtyGeneration+=1;clearTimeout(autosaveTimer);if(state.prefs?.disableAutosave){state.autosavePending=false;renderHeader();return;}const delay=resolveAutosaveDelay(delayOrOpts);state.autosavePending=true;renderHeader();autosaveTimer=setTimeout(()=>persistAutosave(),delay);}
function requestImmediateAutosave(reason='immediate'){ scheduleAutosave({reason}); }
async function setAutosaveDisabled(disabled){
  const next=!!disabled;
  if(next&&!state.prefs?.disableAutosave){
    clearTimeout(autosaveTimer);autosaveTimer=null;
    if(autosaveDirtyGeneration>autosavePersistedGeneration)await persistAutosave();
  }
  state.prefs={...(state.prefs||{}),disableAutosave:next};
  if(next){clearTimeout(autosaveTimer);autosaveTimer=null;state.autosavePending=false;}
  savePrefs();renderHeader();
  if(!next)await persistAutosave();
  document.querySelectorAll('#prefsDisableAutosaveToggle,#disableAutosaveToggle').forEach(input=>{input.checked=next;});
  showToast(next?'Autosave disabled after pending work was flushed':'Autosave enabled and current work saved','info');
}
function flushPendingAutosave(){
  if(state.prefs?.disableAutosave) return;
  if(autosaveTimer || autosaveDirtyGeneration>autosavePersistedGeneration){
    clearTimeout(autosaveTimer);
    autosaveTimer=null;
    persistAutosave();
  }
}
function installAutosaveFlushHandlers(){
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden') flushPendingAutosave(); });
  window.addEventListener('beforeunload',()=>{ flushClauseTime(); flushPendingAutosave(); });
  window.addEventListener('pagehide',()=>{ flushPendingAutosave(); });
  window.addEventListener('unload',()=>{const id=sanitizeClauseId(state.documentMeta?.id,'');if(!id)return;try{const key=`${AUTOSAVE_LEASE_PREFIX}${id}`;const lease=JSON.parse(localStorage.getItem(key)||'null');if(lease?.tabId===TAB_SESSION_ID)localStorage.removeItem(key);}catch{}});
  setInterval(()=>{const id=sanitizeClauseId(state.documentMeta?.id,'');if(!id)return;try{const key=`${AUTOSAVE_LEASE_PREFIX}${id}`;const lease=JSON.parse(localStorage.getItem(key)||'null');if(lease?.tabId===TAB_SESSION_ID)localStorage.setItem(key,JSON.stringify({...lease,tabId:TAB_SESSION_ID,at:Date.now()}));}catch{}},5000);
  window.addEventListener('storage',event=>{const id=sanitizeClauseId(state.documentMeta?.id,'');if(!id||event.key!==`${AUTOSAVE_LEASE_PREFIX}${id}`||!event.newValue)return;try{const lease=JSON.parse(event.newValue);if(lease?.tabId&&lease.tabId!==TAB_SESSION_ID&&Date.now()-Number(lease.at||0)<15000){state.autosaveConflict=true;state.autosaveFailed=true;state.autosavePending=false;renderHeader();if(!state.autosaveConflictNotified){state.autosaveConflictNotified=true;showToast('This matter is active in another tab. This tab is read-only until the other tab closes or its lease expires.','error');}}}catch{}});
}
function onSubstantiveChange({recalcRisk=true,rerenderClause=true,autosaveDelay=DRAFTING_AUTOSAVE_DELAY,summary=false,header=false}={}){
recordDiagnosticAction('substantive-change');
if(recalcRisk){ calculateAllRiskScores(); recomputeDerivedState('substantive-change'); }
if(!state.prefs?.disableAutosave) scheduleAutosave(autosaveDelay);
scheduleRerender({navigator:true,clause:rerenderClause&&!!state.selectedClauseId,rightPanel:true,tools:true,summary,header,cockpit:true},'substantive-change');
}

/* -- Keyboard -- */
function handleGlobalKeydown(e){
if((e.metaKey||e.ctrlKey) && String(e.key||'').toLowerCase()==='k'){e.preventDefault(); if(els.commandPaletteModal?.classList.contains('hidden')) openCommandPalette(); else closeCommandPalette(); return;}
if(e.key==='Escape' && document.querySelector('.modal-overlay:not(.hidden)')){e.preventDefault(); closeTopmostModal(); return;}
if(document.querySelector('.modal-overlay:not(.hidden)'))return;
const tgt=e.target;const tag=tgt?.tagName||'';const isTyping=tgt?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(tag);
if(e.key==='Escape'&&state.focusMode){toggleFocusMode(false);hideTermTooltip();return;}
if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='f'){e.preventDefault();els.searchInput?.focus();els.searchInput?.select?.();return;}
if(e.key.toLowerCase()==='f'&&!isTyping){e.preventDefault();toggleFocusMode();return;}
if(e.key==='Escape'){closeSidePeek();return;}
if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='n'&&!e.shiftKey&&!isTyping){e.preventDefault();dispatch('NEXT_UNREVIEWED');return;}
if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='a'&&!isTyping){e.preventDefault();const cid=state.selectedClauseId; if(cid&&cid!==OVERVIEW_ID){ (isInAgenda(cid)?dispatch('REMOVE_FROM_AGENDA',{cid}):dispatch('ADD_TO_AGENDA',{cid})); } return;}
if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='b'&&!isTyping){e.preventDefault();dispatch('TOGGLE_BOOKMARK',{cid:state.selectedClauseId});return;}
if(e.altKey && ['1','2','3','4'].includes(e.key) && !isTyping){ e.preventDefault(); const map={'1':'intake','2':'decide','3':'prepare','4':'close'}; setWorkflowStage(map[e.key], {preserveTab:true}); return; }
/* v6.0: Undo/Redo */
if((e.metaKey||e.ctrlKey)&&!e.shiftKey&&e.key.toLowerCase()==='z'&&!isTyping){e.preventDefault();undo();return;}
if((e.metaKey||e.ctrlKey)&&(e.shiftKey&&e.key.toLowerCase()==='z'||e.key.toLowerCase()==='y')&&!isTyping){e.preventDefault();redo();return;}
if(isTyping)return;
if(e.key==='?' && !e.metaKey && !e.ctrlKey){e.preventDefault();openShortcutsModal();return;}
if(!state.clauses.length||els.landing&&!els.landing.classList.contains('hidden'))return;
if(e.key==='ArrowDown'||e.key.toLowerCase()==='j'){e.preventDefault();navigateClauseSelection(1);return;}
if(e.key==='ArrowUp'||e.key.toLowerCase()==='k'){e.preventDefault();navigateClauseSelection(-1);return;}
if(e.key.toLowerCase()==='x'){e.preventDefault();state.filters={content:'broken-xrefs',review:'all'};syncFilterUI();renderClauseList();showToast('Filtered to broken xrefs','info');return;}
if(e.key.toLowerCase()==='m'){e.preventDefault();ensureMyInboxInitials();state.filters={content:'all',review:'my-inbox'};syncFilterUI();renderClauseList();showToast('Filtered to inbox','info');return;}
if(e.key.toLowerCase()==='d'){e.preventDefault();toggleContrastMode();return;}
if(e.key.toLowerCase()==='b'){e.preventDefault();toggleClauseBookmark(state.selectedClauseId);return;}
if(e.key==='['){e.preventDefault();navigateBack();return;}
if(e.key===']'){e.preventDefault();navigateForward();return;}
if(e.key.toLowerCase()==='o'){e.preventDefault();jumpToNextObligation();return;}
if(state.selectedClauseId&&state.selectedClauseId!==OVERVIEW_ID){
if(e.metaKey||e.ctrlKey||e.altKey)return;const k=e.key.toLowerCase();
if(k==='a'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'accept');return;}
if(k==='c'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'accept-with-changes');return;}
if(k==='s'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'seek-amendment');return;}
if(k==='r'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'reject');return;}
if(k==='l'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'escalate');return;}
if(k==='i'){e.preventDefault();applyClauseDecision(state.selectedClauseId,'need-input');return;}
if(k==='e'){e.preventDefault();jumpToNextUnreviewedClause();return;}
if(k==='n'){e.preventDefault();openAddNoteWorkflow();return;}
if(e.key==='1'){e.preventDefault();setActiveTab('summary');return;}
if(e.key==='2'){e.preventDefault();setActiveTab('review');return;}
if(e.key==='3'){e.preventDefault();setActiveTab('notes');return;}
if(e.key==='4'){e.preventDefault();setActiveTab('strategy');return;}
}
}
function jumpToNextUnreviewedClause(){const ids=getNavigableClauseIds().filter(id=>id!==OVERVIEW_ID);const current=ids.indexOf(state.selectedClauseId);for(const id of ids.slice(Math.max(0,current+1))){if((state.clauseReviewStatus[id]||'')!=='Reviewed'){jumpToClause(id);return;}}showToast('No next unreviewed clause','info');}
function navigateClauseSelection(dir){const ids=getNavigableClauseIds();if(!ids.length)return;let ci=ids.indexOf(state.selectedClauseId);if(ci===-1)ci=0;const ni=Math.max(0,Math.min(ids.length-1,ci+dir));if(ni===ci)return;jumpToClause(ids[ni]);}
function openShortcutsModal(){openModal(els.shortcutsModal);}
function closeShortcutsModal(){closeModal(els.shortcutsModal);}
function openAddNoteWorkflow(){if(state.selectedClauseId===OVERVIEW_ID){showToast('Select a clause first.','info');return;}if(!getSelectedClause())return;openInlineNoteDraft(state.selectedClauseId);renderClauseView();scheduleAutosave();if(isMobileViewport())setMobileView('review');focusInlineNoteEditor();}

/* -- Loading -- */
async function withLoading(msg,work){showLoading(msg);await new Promise(r=>setTimeout(r,0));try{return await work();}finally{hideLoading();}}
function showLoading(msg='Analyzing document...'){state.loadingMessage=msg;if(els.loadingText)els.loadingText.textContent=msg;els.loadingOverlay?.classList.remove('hidden');}
function hideLoading(){state.loadingMessage='';els.loadingOverlay?.classList.add('hidden');}

/* -- File handling -- */

function detectOpenObligations() {
  const OPEN_OBLIGATION_PATTERNS = [
    /shall\s+be\s+(?:mutually\s+)?agreed/i,/to\s+be\s+(?:mutually\s+)?agreed/i,/to\s+be\s+determined/i,/as\s+(?:the\s+parties\s+)?(?:may\s+)?(?:mutually\s+)?agree/i,/subject\s+to\s+(?:further\s+)?agreement/i,/as\s+set\s+out\s+in\s+a\s+(?:separate|future)/i,/in\s+a\s+form\s+to\s+be\s+agreed/i,/\bTBD\b|\bTBA\b/,/to\s+be\s+negotiated/i,/such\s+(?:terms\s+as\s+)?(?:the\s+parties\s+)?(?:shall\s+)?(?:mutually\s+)?agree/i
  ];
  const results = [];
  const PREAMBLE_HEADING_RE = /how\s+to\s+use|disclaimer|table\s+of\s+contents|introduction|preamble|background|recital/i;
  (state.clauses || []).forEach(c => {
    if (c.id === OVERVIEW_ID) return;
    if (PREAMBLE_HEADING_RE.test(c.heading || '')) return;
    const body = c.body || '';
    const matches = [];
    OPEN_OBLIGATION_PATTERNS.forEach(re => { const m = body.match(re); if (m) matches.push(m[0]); });
    if (matches.length) results.push({ clauseId: c.id, clauseNumber: c.number || '', heading: c.heading || '', matches: [...new Set(matches)] });
  });
  return results;
}

async function handleFileUpload(event){const f=event.target.files?.[0];if(!f)return;try{await handleUploadedFile(f);}catch(err){showToast(err?.message || 'Could not process this file. Try saving as .txt and uploading that.', 'error');renderCompatibilityBanner();return true;}finally{if(els.fileInput)els.fileInput.value='';}}
async function handleUploadedFile(file){
const ext=(file?.name?.split('.').pop()||'').toLowerCase();
const supported=new Set(['docx','txt','md','html','htm','json']);
if(!supported.has(ext)) throw new Error('Unsupported file type.');
if(!file || !file.size) throw new Error('Empty file.');
const maxBytes=ext==='docx'?MAX_DOCX_FILE_BYTES:ext==='json'?MAX_SESSION_FILE_BYTES:MAX_PLAIN_FILE_BYTES;
if(file.size>maxBytes)throw new Error(`File is too large for safe local processing (limit ${Math.round(maxBytes/1024/1024)} MB).`);
captureLandingIntake();
try{await withLoading(ext==='docx'?'Reading and analyzing DOCX...':'Loading document...',async()=>{
if(ext==='docx'){ await probeDocxSupportState(); if(!getDocxSupportState()) { els.docxCompatibilityBanner?.classList.remove('hidden'); showToast('DOCX is not supported by this browser. Please paste the text or upload a .txt copy.', 'error'); throw new Error('DOCX not supported in this browser. Please export as .txt.'); }
const buf=await file.arrayBuffer();
const parsed=await extractTextFromDocx(buf);
if(!String(parsed?.text||'').trim()) throw new Error('Empty document.');
await analyzeText(parsed.text,file.name,'docx',parsed);
return;
}
const text=await file.text();
if(!String(text||'').trim()) throw new Error('Empty document.');
if(ext==='json'){
let session;
try{session=normalizeSession(JSON.parse(text));}catch{throw new Error('Invalid session JSON.');}
const validation=validateSessionShape(session);
if(!validation.ok) throw new Error(validation.message||'Invalid session JSON.');
session=validation.session;
if(!session.clauses.length){showToast('Session JSON has no clauses.','error');throw new Error('Empty session JSON.');}
hydrateState(session);syncLandingIntakeFromMatter();state.diagnostics.lastRestoreSource='session-json';showApp();renderAll();scheduleAutosave();return;
}
const normalized=(ext==='html'||ext==='htm')?htmlToText(text):text;
if(!String(normalized||'').trim()) throw new Error(ext==='html'||ext==='htm'?'No readable text found in that HTML file.':'Empty document.');
await analyzeText(normalized,file.name,ext);
});}catch(err){console.error(err);showToast(getFriendlyUploadError(err,ext),'error');}
}
function htmlToText(html){
  const parser=new DOMParser();
  const doc=parser.parseFromString(String(html||''),'text/html');
  doc.querySelectorAll('script,style,template,noscript,svg,canvas,iframe,object').forEach(node=>node.remove());
  doc.querySelectorAll('br').forEach(br=>br.replaceWith('\n'));
  doc.querySelectorAll('tr').forEach(row=>{[...row.querySelectorAll(':scope > th,:scope > td')].forEach((cell,index,cells)=>{if(index<cells.length-1)cell.appendChild(doc.createTextNode(' | '));});});
  doc.querySelectorAll('p,div,section,article,li,tr,table,h1,h2,h3,h4,h5,h6').forEach(el=>{
    if(!el.textContent) return;
    if(!/\n$/.test(el.textContent||'')) el.appendChild(doc.createTextNode('\n'));
  });
  return (doc.body.textContent||'').replace(/\u00a0/g,' ').replace(/\n{3,}/g,'\n\n').trim();
}
function getFriendlyUploadError(err,ext){
const m=String(err?.message||err||'').trim();
if(/unsupported file type/i.test(m)) return 'Unsupported file type. Please upload a .docx, .txt, .md, .html, .htm, or exported .json session file.';
if(/invalid session json/i.test(m)) return 'That JSON file is not a valid exported Contract Cockpit session.';
if(/empty session json/i.test(m)) return 'That session JSON is valid but contains no clause data.';
if(/empty document/i.test(m)) return 'The selected file appears to be empty or contains no readable contract text.';
if(/no readable text found/i.test(m)) return 'That HTML file contains no readable text content after stripping markup.';
if(ext!=='docx')return 'Unable to load that file. Please confirm it is readable and try again.';
if(/decompressionstream/i.test(m))return 'This browser cannot decompress .docx locally. Paste the text or export the document to .txt.';
if(/word\/document\.xml/i.test(m))return 'Missing main Word document part. Re-save as .docx and retry.';
if(/compression method/i.test(m))return 'Unsupported ZIP compression. Re-save as standard .docx and retry.';
return 'Unable to read that .docx. Try a clean .docx, different browser, or export to .txt.';
}

/* ============================================================
ANALYSIS PIPELINE
============================================================ */
async function analyzeText(text,fileName,sourceType,extras={}){
  if (state.analyzing) {
    showToast('Analysis already in progress', 'warn');
    return;
  }
  const nextMatter=readLandingIntake();
    const requestedIntent=state.startIntent||'checks';
    const requestedCheck=state.preferredStartCheck||'review-items';
  if(state.clauses.length){
    try{await persistAutosave();await saveSnapshotRecord(`Recovery before opening ${fileName||'new document'}`,getActiveWorkflowStage(),{recovery:true});}
    catch{throw new Error('Your current review could not be preserved, so the new document was not opened. Export the session or retry.');}
  }
  state.analyzing = true;
  try {
    resetState();state.startIntent=requestedIntent;state.preferredStartCheck=requestedCheck;state.rawText=text;
    const sourceFingerprint=await sha256Hex(text);
    const paragraphRecords=Array.isArray(extras.paragraphRecords)?extras.paragraphRecords:[];
    state.documentMeta={id:globalThis.crypto?.randomUUID?.()||`matter-${Date.now()}-${Math.random().toString(36).slice(2)}`,fileName,loadedAt:new Date().toISOString(),sourceType,analysisVersion:BUILD_VERSION,sourceFingerprint,warnings:[...(extras.warnings||[])],extractionStats:{paragraphs:paragraphRecords.filter(p=>p.sourceType==='paragraph').length,tableRows:Array.isArray(extras.tableRows)?extras.tableRows.length:0,styleNumbered:paragraphRecords.filter(p=>p.numberingSource==='style').length,directNumbered:paragraphRecords.filter(p=>p.numberingSource==='direct').length},sourceIntegrity:{status:'normal',recoveredNumbered:0,strongBoundaryCandidates:0,representedStrongBoundaries:0,nestedNumberedItems:0,requiresConfirmation:false},wordCount:countWords(text),estimatedReviewMinutes:estimateReadMinutes(text),matter:{...nextMatter}};
    if(!sourceFingerprint)state.documentMeta.warnings.push('Source fingerprint unavailable: this browser context does not expose secure SHA-256. Review can continue, but exported provenance will record that limitation.');
    state.sourceBlocks=paragraphRecords.length&&typeof ANALYSIS_CORE.buildSourceBlocks==='function'?ANALYSIS_CORE.buildSourceBlocks(paragraphRecords):String(text||'').split(/\r?\n/).map((line,index)=>({id:`source-block-${index+1}`,sourceOrder:index,type:'text',text:line,exactText:line,parentBlockId:'',numberingSource:'',numberingLevel:0}));
    const clauseSource=state.sourceBlocks.length?state.sourceBlocks:text;
    state.clauses=detectClauses(clauseSource);
    const sourceIntegrity=typeof ANALYSIS_CORE.classifyNumberedSourceIntegrity==='function'
      ? ANALYSIS_CORE.classifyNumberedSourceIntegrity(paragraphRecords,state.clauses.map(clause=>({...clause,reviewable:isReviewableClause(clause)})))
      : {status:'normal',recoveredNumbered:0,strongBoundaryCandidates:0,representedStrongBoundaries:0,nestedNumberedItems:0,requiresConfirmation:false};
    if(sourceIntegrity.missingStrongBoundaries>0){
      state.documentMeta.warnings.push(`Extraction integrity concern: ${sourceIntegrity.missingStrongBoundaries} strong numbered clause boundar${sourceIntegrity.missingStrongBoundaries===1?'y was':'ies were'} not represented in the review model. Verify the outline against Word.`);
    }
    if(sourceIntegrity.strongBoundaryCandidates>0&&!state.clauses.some(isReviewableClause)){
      state.documentMeta.warnings.push('Extraction integrity concern: numbered source blocks were recovered but no substantive clauses reached the review queue. Re-save the DOCX or correct source boundaries before review.');
    }
    state.documentMeta.sourceIntegrity=sourceIntegrity;
    await yieldToUi();
    const executionBoundary=getExecutionBoundary(text);state.detectorHealth.executionBoundary={status:'checked',coveragePercent:Math.round((executionBoundary.coverageRatio||1)*100),rule:executionBoundary.rule||'',confidence:executionBoundary.confidence||'None'};
    if(executionBoundary.status==='candidates-rejected')state.documentMeta.warnings.push('Signature-like text was found but retained because it appeared too early or substantive provisions followed it.');
    state.placeholders=detectPlaceholders(state.clauses,extras.tableRows||[]);syncPlaceholderResolution();
    const td=extractDefinedTerms(state.clauses,extras.tableRows||[]);
    state.definedTerms=td.terms;state.possibleDefinedTerms=td.possibleTerms;state.tableDefinitions=td.tableDefinitions||[];state.issues.duplicateDefinitions=td.duplicateDefinitions;
    mergeDetectedTerms(state.definedTerms,state.issues.duplicateDefinitions,extractParagraphRecordDefinedTerms(paragraphRecords,state.clauses));
    const pt=extractPartyDefinedTerms(text,state.clauses);mergeDetectedTerms(state.definedTerms,state.issues.duplicateDefinitions,pt);
    resolveCrossReferencedDefinitions(state.clauses,state.definedTerms);
    state.issues.unresolvedCrossReferencedDefinitions=detectUnresolvedCrossReferencedDefinitions(state.definedTerms);
    state.issues.definitionQuality=detectDefinitionQuality(state.definedTerms,state.issues.duplicateDefinitions);
    mapTermUsage(state.clauses,state.definedTerms);
    precomputeTermHits();
    await yieldToUi();
    state.issues.undefinedCapitalizedTerms=detectUndefinedCapitalizedTerms(state.clauses,state.definedTerms);
    state.issues.unusedDefinitions=detectUnusedDefinitions(state.definedTerms);
    state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);
    classifyClauses(state.clauses);
    state.legalConceptEvidence=typeof ANALYSIS_CORE.detectLegalConcepts==='function'?ANALYSIS_CORE.detectLegalConcepts(state.clauses):{byConcept:{},all:[],present:{}};
    state.legalPropositions=typeof ANALYSIS_CORE.extractLegalPropositions==='function'?ANALYSIS_CORE.extractLegalPropositions(state.clauses,state.rawText||''):[];
    if((state.contractType||'Custom')==='Custom'){
      const inferred=resolveContractType(inferContractType(text,state.clauses)||'Custom');
      if(inferred!=='Custom'){state.contractType=inferred;if(els.contractTypeSelect)els.contractTypeSelect.value=inferred;}
    }
    state.obligations=extractObligations(state.clauses);state.deadlines=state.obligations.filter(item=>item.calendarable&&item.deadline).map((item,index)=>({id:`dl-${item.clauseId}-${index+1}`,clauseId:item.clauseId,clauseLabel:item.clauseLabel,expression:item.deadline,sentence:item.sourceSentence||item.action,unresolved:/\[[^\]]+\]|[●]/.test(item.sourceSentence||item.action),topic:item.topic||'General',kind:'deadline',confidence:item.confidence||'High',obligationId:item.id}));
    state.issues.subjectiveStandards=typeof ANALYSIS_CORE.detectSubjectiveStandards==='function'?ANALYSIS_CORE.detectSubjectiveStandards(state.clauses,state.rawText||''):[];
    state.issues.asymmetries=typeof ANALYSIS_CORE.detectAsymmetries==='function'?ANALYSIS_CORE.detectAsymmetries(state.clauses,state.rawText||'',state.legalPropositions):[];
    state.referenceLedger=buildReferenceLedger(state.clauses);
    state.issues.crossReferenceBreaks=state.referenceLedger.filter(item=>item.status==='missing'||item.status==='ambiguous'||item.status==='malformed');
    state.issues.semanticCrossReferenceWarnings=state.referenceLedger.filter(item=>item.status==='semantic-mismatch');
    state.issues.consistency=detectConsistencyIssues(state.clauses,state.definedTerms);
    state.issues.survivalClauses=detectSurvivalClauses(state.clauses);
    state.issues.commercialDeviations=detectNumericalAnomalies(state.clauses);
    state.issues.missingStandardClauses=detectMissingStandardClauses(state.clauses);
    state.expectedClauseCoverage=detectExpectedClauseCoverage(state.clauses,state.contractType);
    state.issues.openObligations = detectOpenObligations();
    state.issues.crossClauseChecks = detectCrossClauseChecks();
    const limited=state.documentMeta.sourceIntegrity?.status==='degraded';const healthStatus=limited?'limited':'checked';
    state.detectorHealth={...state.detectorHealth,definitions:{status:healthStatus,count:Object.keys(state.definedTerms).length},undefinedTerms:{status:healthStatus,count:state.issues.undefinedCapitalizedTerms.length},crossReferences:{status:healthStatus,count:state.issues.crossReferenceBreaks.length},placeholders:{status:healthStatus,count:state.placeholders.filter(p=>!p.resolved&&!p.ignored).length},obligations:{status:healthStatus,count:state.obligations.length},deadlines:{status:healthStatus,count:state.deadlines.length},subjectiveStandards:{status:healthStatus,count:state.issues.subjectiveStandards.length},asymmetries:{status:healthStatus,count:state.issues.asymmetries.length},legalConcepts:{status:healthStatus,count:state.legalConceptEvidence?.all?.length||0}};
    state.reviewItems=buildCanonicalReviewItems();
    boilerplateScoresDirty=true;
    await yieldToUi();
    calculateAllRiskScores();
    if(!state.clauses.some(c=>!String(c.id||'').startsWith('clause-fallback-'))&&state.clauses.length)state.documentMeta.warnings.push('No clearly numbered clauses detected. Split into review blocks.');
    state.selectedClauseId=state.clauses.length?OVERVIEW_ID:null;state.activeTab='summary';state.sessionRestored=false;
    state.workflowStage=requestedIntent==='checks'?'intake':'decide';state.workflowMode=mapStageToLegacyMode(state.workflowStage);state.focusMode=requestedIntent==='read';state.activeCheck=requestedIntent==='checks'?requestedCheck:'';
    showApp();renderAll();renderRestoreBanner();scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);
  } finally {
    state.analyzing = false;
  }
}

/* v6.0: Pre-computed term highlights */
function precomputeTermHits(){
const terms=Object.values(state.definedTerms).sort((a,b)=>b.term.length-a.term.length).map(t=>{const canonical=String(t.term||'');const variants=/s$/i.test(canonical)?[canonical,`${canonical}'s`,`${canonical}'`]:[canonical,`${canonical}s`,`${canonical}es`,`${canonical}'s`,`${canonical}'`];return{...t,_usageRes:variants.map(value=>buildTermBoundaryRegex(value,'g'))};});
state.clauseTermHits={};
state.clauses.forEach(clause=>{
const hits=[];
const body=`${clause.heading||''}\n${clause.body||''}`;
terms.forEach(t=>{
if(t._usageRes.some(re=>{const found=re.test(body);re.lastIndex=0;return found;}))hits.push(t.term);
});
state.clauseTermHits[clause.id]=hits;
});
}

function resetState(){
state.documentMeta={fileName:'',loadedAt:'',sourceType:'',analysisVersion:'',warnings:[],wordCount:0,estimatedReviewMinutes:0,matter:{}};
state.rawText='';state.sourceBlocks=[];state.clauses=[];state.definedTerms={};state.possibleDefinedTerms=[];state.tableDefinitions=[];state.definitionGraph={nodes:[],edges:[],issues:[]};state.referenceLedger=[];state.reviewItems=[];
state.issues={duplicateDefinitions:[],definitionQuality:[],undefinedCapitalizedTerms:[],unusedDefinitions:[],crossReferenceBreaks:[],semanticCrossReferenceWarnings:[],consistency:[],missingStandardClauses:[],unresolvedCrossReferencedDefinitions:[],survivalClauses:[],commercialDeviations:[],openObligations:[],crossClauseChecks:[],subjectiveStandards:[],asymmetries:[]};state.detectorHealth={};
state.placeholders=[];state.obligations=[];state.obligationVerification={};state.deadlines=[];state.executionCheck={items:[],status:'not-run'};state.dealTermsBaseline={fee:'',paymentDays:'',termLength:'',noticePeriod:'',liabilityCap:'',startDate:''};state.notes=[];
state.clauseTags={};state.clauseRoutingTags={};state.clauseCounterpartyPositions={};state.clausePositions={};state.clauseReviewStatus={};state.clauseRiskScores={};
state.reviewPriorityScores={};state.clauseRiskCategories={};state.clauseRiskNarratives={};state.clauseBoilerplateScores={};state.clauseRedlineCache={};state.clauseRedlineMode={};state.clauseTermHits={};
state.reviewLog=[];state.documentRisk='Low';
state.documentReviewPriority='Low';state.contractType=resolveContractType(els.contractTypeSelect?.value||'Custom');
state.expectedClauseCoverage={expected:[],missing:[],present:[],weak:[]};
state.legalConceptEvidence={byConcept:{},all:[],present:{}};
state.legalPropositions=[];state.sourceAssurance=null;
state.ignoredTerms=[];state.ignoredUndefinedTerms=[];state.customStopLists={...DEFAULT_STOP_LISTS};
state.librarySearchQuery='';state.libraryTypeFilter='';
state.clausePlaybookState={};state.playbookExpandedClauseIds={};state.decisionByClause={};state.openLoops=[];state.readiness={status:'blocked',blockers:[],decidedCount:0,totalCount:0,approvalRequestReady:false,finalSignoffReady:false};
state.clauseRecommendations={};state.clauseFallbacks={};state.clauseFallbackLadders={};state.clauseNegotiationStatus={};state.clauseApprovalStatus={};state.clauseIssueStages={};state.clauseCounterpartyNextSteps={};state.clauseCounterpartyLastDiscussed={};
state.draftingOpenClauseIds={};state.clauseCompareMode={};state.positionHistory={};state.collapsedBodies={};
state.resolvedPlaceholderIds=[];state.ignoredPlaceholderIds=[];state.reviewabilityOverrides={};state.clauseAudienceSharing={};state.verificationByKey={};state.selectedClauseId=null;state.searchQuery='';state.activeTermFilter='';state.executionMode=false;state.executedAt='';state.clauseTimeSpent={};state.clauseOpenedAt=null;state.analyzing=false;state._activeTimerClauseId=null;
state.filters={content:'all',review:'all'};state.activeTab='summary';
state.noteFormOpen=false;state.noteDraft=null;state.sessionRestored=false;state.snapshotNotice='';
state.notesView='clause';state.termsView='all';state.refsView='all';state.focusMode=false;
state.startIntent='checks';state.preferredStartCheck='review-items';state.activeCheck='';state.activeConcept='';state.checkFilter='all';state.checkCompletion={};state.findingReview={};
state.negotiationContextOpen={};state.dismissedDraftingNudges={};state.clauseBriefOpenIds={};
pendingDecisionAutoAdvance.clear();
state.prefs=state.prefs?{...state.prefs}:{xrefGlowMs:2200};state.mobileView='review';state.snapshotItems=[];state.autosaveFailed=false;
state.sidePeekClauseId=null;state.reviewSubSection='issues';state.strategySubSection='packages';state.workflowMode='review';state.workflowStage='decide';state.queuePreset='needs-decision';state.currentRound=1;state.sessionReturn={};state.selectedSnapshotCompareId='';state.selectedRoundCompareKey='';state.compareOnlyMode=false;state.definitionPassDoneAt='';state.pendingRestoreMeta=null;state.diagnostics.recentActions=[];state.diagnostics.recentRenders=[];state.diagnostics.recentErrors=[];hidePeekCard();
boilerplateScoresDirty=true;applyFocusMode();els.searchInput.value='';syncFilterUI();updateNavigatorModeUI();
undoStack.length=0;redoStack.length=0;
}

/* -- Clause detection -- */
function normalizeDocxLine(raw){return String(raw||'').replace(/[\u00A0\t]+/g,' ').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');}
function parseClauseHeading(line){
const t=normalizeDocxLine(line);if(!t)return null;
const patterns=[/^(Schedule\s+[A-Z0-9]+|Annex(?:ure)?\s+[A-Z0-9]+|Exhibit\s+[A-Z0-9]+|Appendix\s+[A-Z0-9]+|(?:Article|Section|Clause)\s+[A-Z0-9.-]+)(?:\s*[—–:.-]?\s*)(.*)$/i,/^(\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*)(?:[.)])?\s+(.+)$/i,/^([A-Z])[.)]?\s+(.+)$/,/^([A-Z][A-Z\s&\-/]{3,80})$/,/^([ivxlcdm]{1,8})[.)]?\s+(.+)$/i];
for(const p of patterns){const m=t.match(p);if(m){const r1=String(m[1]||'').trim(),r2=String(m[2]||'').trim();const ac=p.source==='^([A-Z][A-Z\s&\-/]{3,80})$';return{number:ac?'':r1,heading:(r2||r1).trim().replace(/[.;:]$/,'').trim()};}}return null;
}
function splitNumberedClauseContent(parsed,line){
  const content=String(parsed?.heading||'').trim();
  if(!content)return{heading:'Clause',body:''};
  const match=content.match(/^(.{2,100}?)[.:—–-]\s+(.+)$/);
  if(match){
    const candidate=match[1].trim();
    const words=candidate.split(/\s+/).filter(Boolean);
    if(words.length<=12&&!/\b(?:shall|must|will|means|includes?|agrees?\s+to|undertakes?\s+to)\b/i.test(candidate))return{heading:candidate,body:match[2].trim()};
  }
  const heading=conciseClauseHeading(content,parsed?.number||'');
  const strippedBody=normalizeDocxLine(line).replace(/^\s*(?:Schedule\s+[A-Z0-9]+|Annex(?:ure)?\s+[A-Z0-9]+|Exhibit\s+[A-Z0-9]+|Appendix\s+[A-Z0-9]+|(?:Article|Section|Clause)\s+[A-Z0-9.-]+|\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*|[A-Z]|[ivxlcdm]{1,8})[.):—–-]?\s*/i,'').trim();
  const isDuplicateOfHeading=strippedBody.replace(/[.;:]$/,'').trim().toLowerCase()===heading.trim().toLowerCase();
  return{heading,body:isDuplicateOfHeading?'':strippedBody};
}
function isAdministrativeLine(t){return /(signature of authorized representative|business office only|funding source|district contract|attn:|email:|phone number|print\s+title|contracts?@|accounts?-payable@)/i.test(t||'');}
function isLikelyClauseBoundary(number,heading){
const h=String(heading||'').trim();const n=String(number||'').trim();
if(!h)return true;if(/^(schedule|annex|annexure|exhibit|appendix|article|section|clause)/i.test(n))return true;
if(isAdministrativeLine(h))return false;
const w=h.split(/\s+/).filter(Boolean);if(!w.length||w.length>10)return false;
if(/,/.test(h)&&/(road|street|avenue|drive|lane|boulevard|blvd|court|way|po box|suite|floor|building|sector|district contract|email|attn|phone)/i.test(h))return false;
if(/^[A-Z]{3,80}$/.test(h)&&w.length>=2&&w.length<=6)return true;
if(/\b(shall|must|will|may|should|within|before|after|unless|provided|where|when|because|include|includes|means)\b/i.test(h))return false;
if(/^(the|a|an|if|when|while|supplier|client|each|either|party|parties|district|vendor)\b/i.test(h))return false;
if(/(road|street|avenue|drive|lane|boulevard|blvd|court|way|email|attn|phone|california|district contract)/i.test(h))return false;
const uc=w.filter(x=>/^[A-Z]/.test(x)).length;return uc>=Math.max(1,Math.ceil(w.length/2));
}
function isOperativeStyledParagraph(text, parsed){
const words=String(parsed?.heading||text||'').split(/\s+/).filter(Boolean);
return words.length>10||/\b(shall|must|will|may not|agrees? to|undertakes? to|is required to|means|includes?|excludes?)\b/i.test(text||'');
}
function conciseClauseHeading(text,number=''){
const cleaned=String(text||'').replace(/^\s*\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*[.)]?\s*/i,'').replace(/\s+/g,' ').trim();
const first=cleaned.split(/(?<=[.!?;:])\s+/)[0]||cleaned;
const words=first.split(/\s+/).filter(Boolean);
if(words.length<=10)return first.replace(/[.;:]$/,'');
return `${words.slice(0,10).join(' ')}…${number?` (${number})`:''}`;
}
function detectClauses(source){
const recs=Array.isArray(source)?source.map((i,sourceOrder)=>({sourceBlockId:i?.id||`source-block-${sourceOrder+1}`,text:normalizeDocxLine(i?.text||''),headingLevel:i?.headingLevel||0,sourceType:i?.type||i?.sourceType||'paragraph',numberingSource:i?.numberingSource||'',numberingLevel:Number(i?.numberingLevel??0),numberingPrefix:i?.numberingPrefix||'',sourceOrder:Number.isFinite(i?.sourceOrder)?i.sourceOrder:sourceOrder})):String(source||'').split(/\r?\n/).map((r,sourceOrder)=>({sourceBlockId:`source-block-${sourceOrder+1}`,text:normalizeDocxLine(r),headingLevel:0,sourceType:'text',numberingSource:'',numberingLevel:0,numberingPrefix:'',sourceOrder}));
const cls=[];let cur=null;let fc=0;let seen=false;
for(const rec of recs){const line=rec.text;if(!line){if(cur)cur.bodyParts.push('');continue;}
if(!seen&&/^(WHEREAS|NOW\s*,?\s*THEREFORE|RECITALS?)\b/i.test(line)){if(!cur||cur.number!=='Recitals'){if(cur)cls.push(finalizeClause(cur));cur={id:`clause-fallback-${++fc}`,number:'Recitals',heading:'Recitals',bodyParts:[],level:1};}if(!/^RECITALS?$/i.test(line))cur.bodyParts.push(line);continue;}
const parsed=parseClauseHeading(line);const hasWordNumbering=!!rec.numberingSource&&!!parsed;const operativeStyled=(!!rec.headingLevel||hasWordNumbering)&&isOperativeStyledParagraph(line,parsed);
if(hasWordNumbering&&rec.numberingLevel>1&&cur&&!/^(?:Article|Section|Clause|Schedule|Annex|Exhibit|Appendix)\b/i.test(parsed?.number||'')){
  cur.bodyParts.push(line);cur.sourceBlockIds=cur.sourceBlockIds||[];cur.sourceBlockIds.push(rec.sourceBlockId);cur.sourceEndOrder=rec.sourceOrder;continue;
}
const startsStyledClause=!rec.headingLevel||typeof ANALYSIS_CORE.shouldStartStyledClause!=='function'?true:ANALYSIS_CORE.shouldStartStyledClause(line,parsed?.number||'',operativeStyled);
if(rec.headingLevel&&operativeStyled&&!startsStyledClause&&!hasWordNumbering){
  if(!cur){fc++;cur={id:`clause-fallback-${fc}`,number:seen?`Block ${fc}`:'Preamble',heading:'Preamble',bodyParts:[],level:1};}
  cur.bodyParts.push(line);continue;
}
const numberedParts=hasWordNumbering?splitNumberedClauseContent(parsed,line):null;
const sh=hasWordNumbering?{number:parsed.number,heading:numberedParts.heading,bodySeed:numberedParts.body,headingDerivedFromBody:!!numberedParts.body,numberingSource:rec.numberingSource,numberingLevel:rec.numberingLevel,sourceOrder:rec.sourceOrder,sourceBlockId:rec.sourceBlockId}:(rec.headingLevel&&startsStyledClause?{number:parsed?.number||'',heading:operativeStyled?conciseClauseHeading(parsed?.heading||line,parsed?.number||''):(parsed?.heading||line).trim(),bodySeed:operativeStyled?line:'',headingDerivedFromBody:operativeStyled,numberingSource:rec.numberingSource,numberingLevel:rec.numberingLevel,sourceOrder:rec.sourceOrder,sourceBlockId:rec.sourceBlockId}:null);
let plainNumberedBoundary=null;
if(parsed&&/^\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*$/i.test(parsed.number||'')&&!isAdministrativeLine(parsed.heading)){
  const headingOnly=isLikelyClauseBoundary(parsed.number,parsed.heading);
  const parts=splitNumberedClauseContent(parsed,line);
  plainNumberedBoundary=headingOnly?{...parsed,bodySeed:'',headingDerivedFromBody:false}:{number:parsed.number,heading:parts.heading,bodySeed:parts.body,headingDerivedFromBody:!!parts.body};
}
const boundary=sh||plainNumberedBoundary||(parsed&&isLikelyClauseBoundary(parsed.number,parsed.heading)?parsed:null);
if(boundary){seen=true;if(cur)cls.push(finalizeClause(cur));cur={id:`clause-${cls.length+1}`,number:boundary.number,heading:boundary.heading,bodyParts:boundary.bodySeed?[boundary.bodySeed]:[],level:rec.headingLevel||inferLevel(boundary.number),numberingSource:boundary.numberingSource||rec.numberingSource||'',numberingLevel:Number(boundary.numberingLevel??rec.numberingLevel??0),headingDerivedFromBody:!!boundary.headingDerivedFromBody,sourceOrder:Number.isFinite(boundary.sourceOrder)?boundary.sourceOrder:rec.sourceOrder,sourceStartOrder:rec.sourceOrder,sourceEndOrder:rec.sourceOrder,sourceBlockIds:[boundary.sourceBlockId||rec.sourceBlockId]};continue;}
if(!cur){fc++;cur={id:`clause-fallback-${fc}`,number:seen?`Block ${fc}`:'Preamble',heading:line.slice(0,80),bodyParts:[],level:1,sourceStartOrder:rec.sourceOrder,sourceEndOrder:rec.sourceOrder,sourceBlockIds:[rec.sourceBlockId]};}else{cur.bodyParts.push(line);cur.sourceBlockIds=cur.sourceBlockIds||[];cur.sourceBlockIds.push(rec.sourceBlockId);cur.sourceEndOrder=rec.sourceOrder;}
}
if(cur)cls.push(finalizeClause(cur));
return cls.length?cls:String(source||'').split(/\n\s*\n/).filter(Boolean).map((b,i)=>({id:`clause-fallback-${i+1}`,number:i===0?'Preamble':`Block ${i+1}`,heading:b.split(/\n/)[0].trim().slice(0,80),body:b,level:1,issues:[],noteIds:[],type:'General'}));
}
function finalizeClause(c){const sourceBlockIds=[...new Set((c.sourceBlockIds||[]).filter(Boolean))];return{id:c.id,number:c.number,heading:c.heading,body:c.bodyParts.join('\n').trim(),level:c.level,numberingSource:c.numberingSource||'',numberingLevel:Number(c.numberingLevel??0),headingDerivedFromBody:!!c.headingDerivedFromBody,sourceOrder:Number.isFinite(c.sourceOrder)?c.sourceOrder:0,sourceStartOrder:Number.isFinite(c.sourceStartOrder)?c.sourceStartOrder:(Number.isFinite(c.sourceOrder)?c.sourceOrder:0),sourceEndOrder:Number.isFinite(c.sourceEndOrder)?c.sourceEndOrder:(Number.isFinite(c.sourceOrder)?c.sourceOrder:0),sourceBlockIds,sourceSpans:REVIEW_CORE.fullBlockSpans(sourceBlockIds,state.sourceBlocks),issues:[],noteIds:[],type:'General'};}
function inferLevel(num){const r=String(num||'');if(/^schedule|^annex|^exhibit/i.test(r))return 1;const dm=r.match(/\d+(?:\.\d+)*/);let l=dm?dm[0].split('.').length:1;l+=(r.match(/([a-z])/gi)||[]).length;l+=(r.match(/((?:i|ii|iii|iv|v|vi|vii|viii|ix|x))/gi)||[]).length;return l;}

function classifyPlaceholderCandidate(value){const text=String(value||'').trim();if(/^\[(?:sic|see\s+[^\]]+|schedule|annex|exhibit|clause|section)\b/i.test(text)||/^\[\d+(?:[.,-]\d+)*\]$/.test(text))return{include:false,confidence:'low',reason:'citation-or-editorial'};if(/\b(?:TBD|TBA|to be inserted|insert|effective date|company name|address|amount|date)\b/i.test(text)||/^\[[A-Z0-9 _\-/]{2,80}\]$/.test(text))return{include:true,confidence:'high',reason:'drafting-placeholder'};if(/^\[[^\]]{1,100}\]$|^\{[^}]{1,100}\}$/.test(text))return{include:true,confidence:'medium',reason:'bracketed-text-verify'};return{include:true,confidence:'high',reason:'explicit-marker'};}
function detectPlaceholders(clauses,tableRows=[]){const list=[];const marker=/(\[[^\]]+\]|{[^}]+}|<[^>]+>|\bTBD\b|\bTBA\b|\bTBC\b|\bTo be (?:inserted|confirmed|determined)\b|_{4,}|●|\bREDACTED\b)/gi;clauses.forEach(c=>{const areas=c.headingDerivedFromBody?[['body',c.body]]:[['heading',c.heading],['body',c.body]];areas.forEach(([sourceArea,value])=>{let areaIndex=0;[...String(value||'').matchAll(marker)].forEach(m=>{const classification=classifyPlaceholderCandidate(m[0]);if(!classification.include)return;list.push({id:`ph-${c.id}-${sourceArea}-${m.index}`,clauseId:c.id,clauseLabel:c.number,text:m[0],sourceArea,sourceStart:Number(m.index)||0,sourceEnd:(Number(m.index)||0)+String(m[0]||'').length,areaIndex:areaIndex++,sourcePresent:true,resolved:false,reviewed:false,confidence:classification.confidence,reason:classification.reason});});});});(tableRows||[]).forEach((row,rowIndex)=>{const cells=row?.cells||[];cells.forEach((cell,cellIndex)=>{if(String(cell||'').trim())return;const label=String(cells[Math.max(0,cellIndex-1)]||'').trim();if(!label||!/\b(?:date|name|address|amount|fee|rate|term|notice|email|phone|title|signature)\b/i.test(label))return;list.push({id:`ph-table-${rowIndex}-${cellIndex}`,clauseId:'',clauseLabel:row.contextHint||'Table',text:`Empty ${label} field`,sourceArea:'table',areaIndex:cellIndex,sourcePresent:true,resolved:false,reviewed:false,confidence:'High',reason:'Empty structured table field'});});});return list;}
function syncPlaceholderResolution(){const reviewed=new Set(state.resolvedPlaceholderIds||[]);const ignored=new Set(state.ignoredPlaceholderIds||[]);state.placeholders.forEach(p=>{p.ignored=ignored.has(p.id);p.reviewed=reviewed.has(p.id);p.sourcePresent=p.sourcePresent!==false;p.resolved=p.sourcePresent===false;});}
function togglePlaceholderResolved(pid){const p=state.placeholders.find(x=>x.id===pid);if(!p)return;const reviewed=new Set(state.resolvedPlaceholderIds||[]);if(reviewed.has(pid))reviewed.delete(pid);else reviewed.add(pid);state.resolvedPlaceholderIds=[...reviewed];p.reviewed=reviewed.has(pid);p.resolved=p.sourcePresent===false;logReviewAction(p.reviewed?'placeholder-reviewed':'placeholder-review-reopened',p.clauseId,{summary:p.text});onSubstantiveChange();showToast(p.reviewed?'Reviewed; the source blank remains a signing blocker until the document is updated.':'Placeholder review reopened','info');}
function togglePlaceholderIgnored(pid){const p=state.placeholders.find(x=>x.id===pid);if(!p)return;const set=new Set(state.ignoredPlaceholderIds||[]);if(set.has(pid))set.delete(pid);else set.add(pid);state.ignoredPlaceholderIds=[...set];syncPlaceholderResolution();onSubstantiveChange();renderToolsPanel();}

/* -- Term extraction -- */
function splitIntoSentences(t){return t.replace(/\n+/g,' ').split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);}
function normalizeTerm(t){return t.replace(/["“”'‘’]/g,'').replace(/\s+/g,' ').trim();}
function isBadDefinitionTerm(t,context='',explicit=false){if(typeof ANALYSIS_CORE.assessDefinedTermCandidate==='function')return !ANALYSIS_CORE.assessDefinedTermCandidate(t,context,explicit).include;return /^(The|This|That|Any|Each|Either|For|If|In|On|At|From|To|And|Or)$/i.test(t);}
function cleanInlineCandidate(t){const n=t.replace(/\s+/g,' ').trim();let c=n;[' and ','; ',': ','. '].forEach(m=>{const i=c.lastIndexOf(m);if(i>-1&&c.length-i<180)c=c.slice(i+m.length).trim();});return c;}
function getExecutionBoundary(text){return typeof ANALYSIS_CORE.detectExecutionBoundary==='function'?ANALYSIS_CORE.detectExecutionBoundary(String(text||'')):{index:-1,status:'not-found',coverageRatio:1,confidence:'None',candidates:[]};}
function findExecutionBoundaryIndex(text){return getExecutionBoundary(text).index;}
function truncateAtExecutionBoundary(text){const source=String(text||'');const index=findExecutionBoundaryIndex(source);return index>=0?source.slice(0,index):source;}
function isClauseAfterExecutionBoundary(clause){const boundary=findExecutionBoundaryIndex(state.rawText||'');if(boundary<0)return false;const sourceBefore=String(state.rawText||'').slice(0,boundary);const needle=String(clause?.body||clause?.heading||'').slice(0,80).trim();return !!needle&&!sourceBefore.includes(needle);}
function buildTermBoundaryRegex(term,flags='g'){
const raw=String(term||'').trim();
const cacheKey=`${raw}__${flags}`;
if(termBoundaryRegexCache.has(cacheKey)) return termBoundaryRegexCache.get(cacheKey);
const escaped=escapeRegExp(raw);
const suffix=/s$/i.test(raw)?"(?:'s|')?":"(?:s|es|'s|')?";
const re=supportsRegexLookbehind()
  ? new RegExp(`(?<![A-Za-z0-9])(${escaped}${suffix})(?![A-Za-z0-9])`,flags)
  : new RegExp(`(^|[^A-Za-z0-9])((?:${escaped}${suffix}))(?=$|[^A-Za-z0-9])`,flags);
termBoundaryRegexCache.set(cacheKey,re);
return re;
}

function extractDefinedTerms(clauses,tableRows=[]){
const terms={};const duplicateDefinitions=[];const possibleTerms=[];const tableDefinitions=[];
const addTerm=(p)=>{const k=p.term.trim();if(!k)return;if((state.customStopLists?.definedTerms||DEFAULT_STOP_LISTS.definedTerms).includes(k))return;if(terms[k]){const ex=terms[k];if(p.carveOuts?.length)ex.carveOuts=[...new Set([...(ex.carveOuts||[]),...p.carveOuts])];const normalizeDefinition=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();const sameSource=String(ex.definedInClauseId||'')===String(p.definedInClauseId||'')&&normalizeDefinition(ex.definition)===normalizeDefinition(p.definition);if(!sameSource&&!(ex.scope==='local'&&p.scope==='global')&&!(ex.scope==='global'&&p.scope==='local')){const identical=normalizeDefinition(ex.definition)===normalizeDefinition(p.definition);duplicateDefinitions.push({term:k,firstClauseId:ex.definedInClauseId,secondClauseId:p.definedInClauseId,kind:identical?'identical':'conflicting',firstDefinition:ex.definition||'',secondDefinition:p.definition||''});}if(p.confidenceRank>ex.confidenceRank)terms[k]=p;return;}terms[k]=p;};
clauses.forEach(originalClause=>{
if(isClauseAfterExecutionBoundary(originalClause))return;const clause={...originalClause,body:truncateAtExecutionBoundary(originalClause.body)};if(!clause.body.trim())return;
const sentences=splitIntoSentences(clause.body);const hb=/definition|interpretation|schedule|annex|appendix/i.test(clause.heading)?1:0;
const scope=/for the purposes of this clause/i.test(clause.body)?'local':'global';
const formalPatterns=[
{regex:/["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s*:?\s*(?:shall\s+mean|means)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/gi,type:'formal',confidence:'high',rank:3,rule:'quoted_term_means'},
{regex:/\bBy\s+["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s+is\s+meant\s+([^.;\n]+(?:[.;\n][^\n]*)?)/gi,type:'formal',confidence:'high',rank:3,rule:'by_quoted_term_is_meant'},
{regex:/["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s*:?\s*(?:is\s+defined\s+as|refers\s+to|denotes|shall\s+be\s+construed\s+to\s+mean)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/gi,type:'formal',confidence:'high',rank:3,rule:'quoted_term_equivalent_definition'},
{regex:/["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s*:?\s*(?:(?:shall\s+)?have|has)\s+the\s+meaning\s+(?:given(?:\s+to\s+it)?|set\s+out|set\s+forth|assigned)\s+in\s+((?:Clause|Section|Subsection|Schedule|Annex(?:ure)?|Appendix)\s+[A-Z0-9().-]+)/gi,type:'cross_reference',confidence:'high',rank:3,rule:'quoted_term_has_meaning'},
{regex:/["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s+(?:does\s+not\s+include|excludes)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/gi,type:'negative-definition',confidence:'medium',rank:2,rule:'negative_definition'},
{regex:/["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s+(?:shall\s+include|includes?)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/gi,type:'formal',confidence:'medium',rank:2,rule:'quoted_term_include'}
];
if(hb){formalPatterns.push({regex:/^([A-Z][A-Za-z0-9&/ -]{1,80})\s*:\s*([^\n]{8,240})$/gim,type:'formal',confidence:'medium',rank:2,rule:'colon_definition'});formalPatterns.push({regex:/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*:?\s*(?:shall\s+mean|means)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/g,type:'definitions-style',confidence:'medium',rank:2,rule:'multiword_term_means'});}
if(!hb){let c;const cr=/\b([A-Z][A-Za-z][A-Za-z0-9&/-]{1,60})\s*:?\s*(?:shall\s+mean|means)\s+([^.;\n]+(?:[.;\n][^\n]*)?)/g;while((c=cr.exec(clause.body))!==null){const t=normalizeTerm(c[1]);if(!t||isBadDefinitionTerm(t))continue;possibleTerms.push({term:t,definition:c[2].trim(),contextSentence:sentences.find(s=>s.includes(c[0]))||c[0],clauseId:clause.id,clauseLabel:clause.number,confidence:'low',reason:'Unquoted term + means outside definitions clause.',detectionRule:'possible_capitalized_term_means'});}}
formalPatterns.forEach(({regex,type,confidence,rank,rule})=>{let m;while((m=regex.exec(clause.body))!==null){let t=normalizeTerm(m[1]);if(!t||isBadDefinitionTerm(t,'',true))continue;const cs=sentences.find(s=>s.includes(m[0]))||m[0];const def=m[2].trim();addTerm({term:t,normalized:t,definition:type==='negative-definition'?'':(type==='cross_reference'?`See ${def}`:def),carveOuts:type==='negative-definition'?[def]:[],reference:type==='cross_reference'?def:'',contextSentence:cs,definitionType:type,confidence,confidenceRank:rank+hb,detectionRule:rule,definedInClauseId:clause.id,usedInClauseIds:[],scope});}});
let m;const ir=/([^\n\r()]{1,180}?)\s*\(\s*(?:(?:altogether|collectively|jointly|together)\s+)?(?:called\s+|referred\s+to\s+as\s+|known\s+as\s+)?(?:the\s+)?["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]\s*\)/gi;
while((m=ir.exec(clause.body))!==null){let t=normalizeTerm(m[2]);if(/^the\s+/i.test(t))t=t.replace(/^the\s+/i,'');if(!t||isBadDefinitionTerm(t,'',true)||/\b(?:console|function|javascript|script|alert|onerror)\b/i.test(m[1]))continue;const cs=sentences.find(s=>s.includes(m[0]))||m[0];const parenInSentence=cs.match(new RegExp(`\\(\\s*(?:the\\s+)?["“”'‘’]${escapeRegExp(m[2])}["“”'‘’]\\s*\\)`,'i'));const precedingInSentence=parenInSentence?cs.slice(0,parenInSentence.index):m[1];const c=cleanInlineCandidate((precedingInSentence||m[1]).trim())||cleanInlineCandidate(m[1].trim());addTerm({term:t,normalized:t,definition:c,candidateDefinition:c,contextSentence:cs,definitionType:'inline',confidence:'medium',confidenceRank:2+hb,detectionRule:'inline_parenthetical_term',definedInClauseId:clause.id,usedInClauseIds:[],scope});}
const dir=/([^\n\r()]{2,180}?)\s*\(\s*(?:each\s*,?\s*)?(?:a|an|the)?\s*["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’](?:\s*,?\s*(?:and|or)\s*["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’])?\s*\)/gi;
while((m=dir.exec(clause.body))!==null){const phrase=cleanInlineCandidate(m[1]);[m[2],m[3]].filter(Boolean).forEach(rawTerm=>{const t=normalizeTerm(rawTerm);if(!t||isBadDefinitionTerm(t,phrase,true))return;addTerm({term:t,normalized:t,definition:phrase,candidateDefinition:phrase,contextSentence:sentences.find(s=>s.includes(m[0]))||m[0],definitionType:'inline',confidence:'medium',confidenceRank:2+hb,detectionRule:'inline_each_or_dual_term',definedInClauseId:clause.id,usedInClauseIds:[],scope});});}
const rr=/((?:referred\s+to\s+in\s+this\s+Agreement\s+as|referred\s+to\s+as)\s+(?:the\s+)?["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’])/gi;
while((m=rr.exec(clause.body))!==null){const t=normalizeTerm(m[2]);if(!t||isBadDefinitionTerm(t,'',true))continue;const cs=sentences.find(s=>s.includes(m[0]))||m[0];const before=clause.body.slice(0,m.index);const phrase=cleanInlineCandidate(before.slice(Math.max(0,before.length-220)));addTerm({term:t,normalized:t,definition:phrase,candidateDefinition:phrase,contextSentence:cs,definitionType:'inline',confidence:'medium',confidenceRank:2+hb,detectionRule:'referred_to_as_term',definedInClauseId:clause.id,usedInClauseIds:[],scope});}
const hr=/\bhereinafter\s*(?:(?:collectively\s+|jointly\s+)?referred\s+to\s+as)?\s*:?\s*(?:the\s+)?["“”'‘’]([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]/gi;
while((m=hr.exec(clause.body))!==null){const t=normalizeTerm(m[1]).replace(/^the\s+/i,'');if(!t||isBadDefinitionTerm(t,'',true)||/^hereinafter/i.test(t))continue;const cs=sentences.find(s=>s.includes(m[0]))||m[0];const before=clause.body.slice(0,m.index);const phrase=cleanInlineCandidate(before.slice(Math.max(0,before.length-260)));addTerm({term:t,normalized:t,definition:phrase||'Defined label in the preamble.',candidateDefinition:phrase,contextSentence:cs,definitionType:'inline',confidence:'high',confidenceRank:4,detectionRule:'hereinafter_parenthetical_or_colon',definedInClauseId:clause.id,usedInClauseIds:[],scope});}
});
const tt=extractTableDefinedTerms(tableRows,clauses);tt.forEach(p=>{tableDefinitions.push(p);addTerm(p);});
return{terms,duplicateDefinitions,possibleTerms:possibleTerms.filter(i=>!terms[i.term]&&!state.ignoredTerms.includes(i.term)),tableDefinitions};
}

function extractTableDefinedTerms(rows,clauses){if(!rows.length)return[];const out=[];const boundary=findExecutionBoundaryIndex(state.rawText||'');const beforeBoundary=boundary>=0?String(state.rawText||'').slice(0,boundary):String(state.rawText||'');rows.forEach(r=>{if(!r||!r.cells||r.cells.length<2)return;if(boundary>=0&&r.rowText&&!beforeBoundary.includes(String(r.rowText||'').trim()))return;const[f,...rest]=r.cells;const t=normalizeTableTerm(f);const d=rest.join(' ').replace(/\s+/g,' ').trim();if(!t||!d||isBadDefinitionTerm(t))return;if(!looksLikeDefinitionText(d))return;const c=findBestClauseForTableRow(r,clauses);out.push({term:t,normalized:t,definition:d,contextSentence:r.rowText||`${f} | ${d}`,definitionType:'table',confidence:c&&/definition|interpretation|schedule|annex|appendix/i.test(c.heading)?'high':'medium',confidenceRank:c&&/definition|interpretation|schedule|annex|appendix/i.test(c.heading)?3:2,detectionRule:'table_term_definition',definedInClauseId:c?c.id:'',usedInClauseIds:[],scope:'global',contextHint:r.contextHint||''});});return dedupeTableTerms(out);}
function normalizeTableTerm(c){let t=String(c||'').replace(/^[""'']|[""'']$/g,'').replace(/\s+/g,' ').trim();if(!t)return '';if(/^(term|defined term|definition|meaning|name)$/i.test(t))return '';if(/^For\s+(?:[A-Z][\w&.'-]*)(?:\s+[A-Z][\w&.'-]*){0,4}$/i.test(t))return '';if(t.length>80)return '';if(/[:;,.]$/.test(t))t=t.slice(0,-1).trim();if(!/^[A-Z]/.test(t))return '';if(/(signature|print|title|date|business office|contact name|funding source|contract\s*#|attn|email|phone)/i.test(t))return '';return t;}
function looksLikeDefinitionText(t){if(!t)return false;const c=t.trim();if(/^(definition|meaning)$/i.test(c))return false;if(c.length<8||c.length>240)return false;if(/(signature|print|title|date|business office only|funding source|district contract|attn:|email:|phone)/i.test(c))return false;return true;}
function findBestClauseForTableRow(row,clauses){const h=normalizeReferenceLabel(row.contextHint||'');const uc=clauses.filter(c=>!isAdministrativeLine(`${c.number} ${c.heading}`));if(h){const bl=uc.find(c=>buildReferenceAliases(c.number).has(h));if(bl)return bl;const bh=uc.find(c=>normalizeReferenceLabel(`${c.number} ${c.heading}`).includes(h)||h.includes(normalizeReferenceLabel(`${c.number} ${c.heading}`)));if(bh)return bh;}return uc.find(c=>/definition|interpretation|schedule|annex|appendix/i.test(c.heading))||uc[0]||null;}
function dedupeTableTerms(items){const s=new Set();return items.filter(i=>{const k=`${i.term}@@${i.definedInClauseId||i.contextHint||''}`;if(s.has(k))return false;s.add(k);return true;});}

function extractParagraphRecordDefinedTerms(records,clauses){
  if(!Array.isArray(records)||!records.length)return[];
  const sorted=(clauses||[]).slice().sort((a,b)=>Number(a.sourceOrder||0)-Number(b.sourceOrder||0));
  const parentFor=sourceOrder=>{let parent=sorted[0]||null;for(const clause of sorted){if(Number(clause.sourceOrder||0)>sourceOrder)break;parent=clause;}return parent;};
  const out=[];const seen=new Set();
  const patterns=[
    {regex:/^[\s•\uF0B7\-–]*(?:(?:\([a-zivx]+\)|\d+(?:\.\d+)*[.)]?|[a-zivx]+[.)])\s*)?["“”'‘’]?([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]?\s*:?[\s]*(?:shall\s+mean|means?)\s+(.{8,1200})$/i,rule:'paragraph_term_means'},
    {regex:/^[\s•\uF0B7\-–]*(?:(?:\([a-zivx]+\)|\d+(?:\.\d+)*[.)]?|[a-zivx]+[.)])\s*)?["“”'‘’]?([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]?\s*:?[\s]*(?:shall\s+)?(?:has|shall have)\s+the\s+meaning\s+(.{8,1200})$/i,rule:'paragraph_term_has_meaning'},
    {regex:/^[\s•\uF0B7\-–]*(?:(?:\([a-zivx]+\)|\d+(?:\.\d+)*[.)]?|[a-zivx]+[.)])\s*)?["“”'‘’]?([A-Z][A-Za-z0-9&/ -]{1,80})["“”'‘’]?\s*:\s*(.{8,1200})$/i,rule:'paragraph_colon_definition'}
  ];
  const joined=records.map(record=>String(record?.rawText||record?.text||'')).join('\n');const boundary=findExecutionBoundaryIndex(joined);let cursor=0;
  records.forEach((record,index)=>{const raw=String(record?.rawText||record?.text||'');const recordStart=cursor;cursor+=raw.length+1;if(boundary>=0&&recordStart>=boundary)return;const text=raw.replace(/\s+/g,' ').trim();if(!text)return;const parent=parentFor(Number(record.sourceOrder??index));const context=`${parent?.heading||''} ${text}`;if(/\b(?:contact persons?|for\s+(?:innostars|service provider|supplier|customer)|name\s*:|phone\s*:|e-?mail\s*:|signature\s*:|address\s*:)/i.test(context)&&!/definition|interpretation/i.test(parent?.heading||''))return;for(const pattern of patterns){const match=text.match(pattern.regex);if(!match)continue;const term=normalizeTerm(match[1]);if(!term||isBadDefinitionTerm(term,context)||seen.has(term.toLowerCase()))break;seen.add(term.toLowerCase());out.push({term,normalized:term,definition:String(match[2]||'').trim(),contextSentence:text,definitionType:'nested-paragraph',confidence:'high',confidenceRank:4,detectionRule:pattern.rule,definedInClauseId:parent?.id||'',usedInClauseIds:[],scope:'global'});break;}});
  return out;
}

function getPrincipalPartyTermKeys(terms={}){
  const detected=typeof ANALYSIS_CORE.detectPrincipalParties==='function'?ANALYSIS_CORE.detectPrincipalParties(state.rawText||''):[];
  return new Set([
    ...Object.values(terms||{}).filter(term=>term?.definitionType==='party').map(term=>term.term),
    ...detected.flatMap(party=>[party.alias,party.name])
  ].filter(Boolean).map(value=>String(value).trim().toLowerCase()));
}
function detectDefinitionQuality(terms,duplicates=[]){const partyKeys=getPrincipalPartyTermKeys(terms);const all=Object.values(terms||{}).filter(term=>term?.term&&!partyKeys.has(String(term.term).trim().toLowerCase()));const issues=[];duplicates.filter(item=>item.kind==='conflicting'&&!partyKeys.has(String(item.term||'').trim().toLowerCase())).forEach(item=>issues.push({type:'conflicting-duplicate',severity:'High',term:item.term,description:`${item.term} has materially different definitions.`}));all.forEach(term=>{const definition=String(term.resolvedDefinition||term.definition||'').replace(/^See\s+/i,'').trim();if(!definition)return;const termRe=new RegExp(`\\b${escapeRegExp(term.term)}\\b`,'ig');const withoutTerm=definition.replace(termRe,' ');const substance=withoutTerm.toLowerCase().replace(/\b(?:means?|shall|have|has|the|a|an|to|of|and|or|is|be|for|this|agreement)\b/g,' ').replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean);const directLoop=new RegExp(`^\\s*(?:the\\s+)?${escapeRegExp(term.term)}\\s+(?:means?|shall\\s+mean|has\\s+the\\s+meaning)\\s+(?:the\\s+)?${escapeRegExp(term.term)}\\b`,'i').test(`${term.term} means ${definition}`);if(termRe.test(definition)&&(directLoop||substance.length<3))issues.push({type:'possible-circular-definition',severity:'Medium',term:term.term,description:`${term.term} may define itself without enough independent substance.`});});const graph=new Map(all.map(term=>[term.term,all.filter(other=>other.term!==term.term&&new RegExp(`\\b${escapeRegExp(other.term)}\\b`,'i').test(String(term.definition||''))).map(other=>other.term)]));all.forEach(term=>{for(const dependency of graph.get(term.term)||[]){if((graph.get(dependency)||[]).includes(term.term)&&term.term.localeCompare(dependency)<0)issues.push({type:'definition-cycle',severity:'Medium',term:`${term.term} ↔ ${dependency}`,description:'These definitions depend on each other.'});}});return issues;}

function mapTermUsage(clauses,terms){Object.values(terms).forEach(t=>{const re=buildTermBoundaryRegex(t.term,'g');clauses.forEach(c=>{if(c.id===t.definedInClauseId)return;if(re.test(c.body))t.usedInClauseIds.push(c.id);re.lastIndex=0;});})}
function recomputeUsageForTerm(t){t.usedInClauseIds=[];const re=buildTermBoundaryRegex(t.term,'g');state.clauses.forEach(c=>{if(c.id===t.definedInClauseId)return;if(re.test(c.body))t.usedInClauseIds.push(c.id);re.lastIndex=0;});}

function extractPartyDefinedTerms(text,clauses){
const pool=splitIntoSentences(truncateAtExecutionBoundary(String(text||'')).slice(0,12000));const out=[];const tid=clauses[0]?.id||'';
pool.forEach(s=>{
const coll=s.match(/\b([A-Z][A-Za-z]+)\s+and\s+([A-Z][A-Za-z]+)\b[^.]{0,220}?collectively\s+as\s+(?:the\s+)?[""''](Parties)[""''][^.]{0,120}?individually\s+as\s+(?:the\s+)?[""''](Party)[""'']/i);
if(coll)[coll[1],coll[2],'Parties','Party'].forEach(t=>{const n=normalizeTerm(t);if(!n)return;out.push({term:n,normalized:n,definition:/Part/.test(n)?'Collective or individual party label.':'Named party to this Agreement.',contextSentence:s,definitionType:'party',confidence:'high',confidenceRank:4,detectionRule:'party_collective_individual',definedInClauseId:tid,usedInClauseIds:[],scope:'global'});});
const rp=s.match(/\bhereinafter\s*(?:(?:collectively\s+|jointly\s+)?referred\s+to\s+as)?\s*:?\s*(?:the\s+)?[""'']([A-Z][A-Za-z0-9&/ -]{1,80})[""'']/i);
if(rp){const n=normalizeTerm(rp[1]);if(n)out.push({term:n,normalized:n,definition:'Named party to this Agreement.',contextSentence:s,definitionType:'party',confidence:'high',confidenceRank:4,detectionRule:'party_hereinafter_referred_to_as',definedInClauseId:tid,usedInClauseIds:[],scope:'global'});}
const bp=s.match(/([A-Z][A-Za-z0-9 ,.&()/-]+?(?:Private Limited|Limited|LLP|LLC|Inc.?|Pvt.? Ltd.?|Corporation|Company))\s*(being\s+[^)]{10,})[^.]{0,220}?(?:hereinafter\s+referred\s+to\s+as|referred\s+to\s+as)\s+(?:the\s+)?[""'']([A-Z][A-Za-z0-9&/ -]{1,60})[""'']/i);
if(bp){const cn=normalizeTerm(bp[1].replace(/\s+/g,' ').trim());const al=normalizeTerm(bp[2]);[cn,al].forEach((n,i)=>{if(!n)return;out.push({term:n,normalized:n,definition:i===0?'Named party in the preamble.':'Defined party label in the preamble.',contextSentence:s,definitionType:'party',confidence:'high',confidenceRank:4,detectionRule:i===0?'party_being_parenthetical_name':'party_being_parenthetical_alias',definedInClauseId:tid,usedInClauseIds:[],scope:'global'});});}
});return out;
}
function mergeDetectedTerms(base,dups,incoming){incoming.forEach(p=>{const k=p.term.trim();if(!k)return;if((state.customStopLists?.definedTerms||DEFAULT_STOP_LISTS.definedTerms).includes(k))return;if(!base[k]||p.confidenceRank>(base[k].confidenceRank||0))base[k]=p;});}

/* -- Cross-reference detection -- */
function buildReferenceAliases(label){const out=new Set();const r=String(label||'').trim();if(!r)return out;out.add(normalizeReferenceLabel(r));if(/^\d+(?:\.\d+)*$/.test(r)){['Clause','Section','Subsection','Sub-clause','Article','Paragraph','Para','Part'].forEach(k=>out.add(normalizeReferenceLabel(`${k} ${r}`)));}const s=r.match(/^(Schedule|Annex|Annexure|Exhibit|Appendix|Attachment|Recital)\s+(.+)$/i);if(s){if(/^annexure$/i.test(s[1])||/^annex$/i.test(s[1])){out.add(normalizeReferenceLabel(`Annex ${s[2]}`));out.add(normalizeReferenceLabel(`Annexure ${s[2]}`));}else out.add(normalizeReferenceLabel(`${s[1]} ${s[2]}`));}return out;}
function normalizeReferenceLabel(v){return String(v||'')
  .replace(/[,:;.]$/,'')
  .replace(/Annexure/ig,'Annex')
  .replace(/\bArt\.?\b/ig,'Article')
  .replace(/\bSecs?\.?\b/ig,'Section')
  .replace(/\bClauses?\b/ig,'Clause')
  .replace(/\bSub-?clauses?\b/ig,'Clause')
  .replace(/\bSubsections?\b/ig,'Section')
  .replace(/\bParas?\.?\b/ig,'Paragraph')
  .replace(/(Clause|Section)\s+(\d+(?:\.\d+)*)(?:([a-z]))?/ig,(m,k,n,suffix)=>`${k} ${n}${suffix||''}`)
  .replace(/\b(article|section|clause|paragraph|part)\s+([ivxlcdm]+)\b/ig,(m,k,n)=>`${k} ${n.toUpperCase()}`)
  .replace(/\s+/g,' ').trim().toLowerCase();}
function buildReferenceIndex(clauses){
  const index=new Map();const numericTopLevels=new Map();
  const add=(alias,clause)=>{const existing=index.get(alias);if(!existing)index.set(alias,clause);else if(Array.isArray(existing)){if(!existing.some(item=>item.id===clause.id))existing.push(clause);}else if(existing.id!==clause.id)index.set(alias,[existing,clause]);};
  (clauses||[]).forEach(c=>{buildReferenceAliases(c.number).forEach(alias=>add(alias,c));const top=String(c.number||'').match(/^(?:Article|Section|Clause)\s+(\d+)$/i);if(top){const list=numericTopLevels.get(top[1])||[];list.push(c);numericTopLevels.set(top[1],list);}const body=String(c.body||'');for(const match of body.matchAll(/(?:^|\n)\s*((?:\d+(?:\.\d+)+|\([a-z0-9ivx]+\)))(?=\s|[.)])/gi)){const token=match[1];['Clause','Section','Article','Paragraph'].forEach(kind=>add(normalizeReferenceLabel(`${kind} ${token}`),c));}});
  // Customer paper often calls the same unique top-level unit an Article,
  // Section or Clause. Alias only where the number is unambiguous.
  numericTopLevels.forEach((items,number)=>{if(items.length!==1)return;['Article','Section','Clause'].forEach(kind=>index.set(normalizeReferenceLabel(`${kind} ${number}`),items[0]));});
  return index;
}
function findClauseByReference(ref,clauses){const list=clauses||state.clauses||[];const t=normalizeReferenceLabel(ref);const indexed=buildReferenceIndex(list).get(t);if(Array.isArray(indexed))return null;return indexed||list.find(c=>normalizeReferenceLabel(`${c.number||''} ${c.heading||''}`).includes(t));}


function extractReferenceCandidates(text){
const out=[];
const source=String(text||'');
const numbered=/\b((?:Article|Paragraph|Para\.?|Part|Clause|Sub-?clause|Section|Subsection)\s+\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*)/gi;
const numberedRoman=/\b((?:Article|Paragraph|Para\.?|Part|Clause|Sub-?clause|Section|Subsection)\s+[IVXLCDM]+(?:\([a-z0-9ivx]+\))*)\b/g;
const schedules=/\b((?:Schedule|Sched\.?|Sch\.?|Annex(?:ure)?|Exhibit|Appendix|Attachment|Recital)\s+\d+(?:\.\d+)*(?:\([a-z0-9ivx]+\))*)/gi;
const schedulesRoman=/\b((?:Schedule|Sched\.?|Sch\.?|Annex(?:ure)?|Exhibit|Appendix|Attachment|Recital)\s+[IVXLCDM]+(?:\([a-z0-9ivx]+\))*)\b/g;
const schedulesLetter=/\b((?:Schedule|Sched\.?|Sch\.?|Annex(?:ure)?|Exhibit|Appendix|Attachment|Recital)\s+[A-Z](?:\([a-z0-9ivx]+\))*)(?![A-Za-z])/g;
for(const re of [numbered,numberedRoman,schedules,schedulesRoman,schedulesLetter]) for(const match of source.matchAll(re)){
  const raw=String(match[1]||'').replace(/\s+/g,' ').trim();
  if(raw)out.push({raw,start:Number(match.index)||0,end:(Number(match.index)||0)+String(match[0]||'').length});
}
return out.sort((a,b)=>a.start-b.start||a.end-b.end);
}
function normalizeReferenceToken(token){
return normalizeReferenceLabel(String(token||'').replace(/\bSched\.?\b/ig,'Schedule').replace(/\bSch\.?\b/ig,'Schedule').trim());
}
function resolveReferenceTarget(token, clauses){
return findClauseByReference(token, clauses||state.clauses||[]) || null;
}

function detectCrossReferenceBreaks(clauses){
return buildReferenceLedger(clauses).filter(item=>item.status==='missing'||item.status==='ambiguous');
}

const REFERENCE_SEMANTIC_TOPICS=[
  ['termination',/\b(?:terminat(?:e|ion|ed)|expiry|cure period)\b/i],
  ['liability',/\b(?:liabilit(?:y|ies)|aggregate cap|consequential loss)\b/i],
  ['indemnity',/\b(?:indemnif(?:y|ication|ies)|hold harmless|defend)\b/i],
  ['confidentiality',/\b(?:confidential(?:ity| information)|non-disclosure)\b/i],
  ['data protection',/\b(?:personal data|data protection|processor|controller|privacy)\b/i],
  ['intellectual property',/\b(?:intellectual property|background ip|work product|copyright|patent)\b/i],
  ['fees and payment',/\b(?:fees?|payment|invoice|charges?)\b/i],
  ['acceptance',/\b(?:acceptance|accepted|reject(?:ion|ed))\b/i],
  ['assignment',/\b(?:assignment|assign|change of control)\b/i],
  ['audit',/\b(?:audit|inspect(?:ion)?|books and records)\b/i],
  ['dispute resolution',/\b(?:arbitration|jurisdiction|courts?|tribunal|venue)\b/i]
];
function referenceSemanticTopic(text){
  const source=String(text||'');
  const hits=REFERENCE_SEMANTIC_TOPICS.filter(([,regex])=>regex.test(source)).map(([topic])=>topic);
  return hits.length===1?hits[0]:'';
}
function referenceContextSentence(text,reference){return splitIntoSentences(String(text||'')).find(sentence=>sentence.toLowerCase().includes(String(reference||'').toLowerCase()))||String(text||'').slice(0,420);}
const MALFORMED_REFERENCE_CONTINUATION=/\b((?:Article|Paragraph|Para\.?|Part|Clause|Sub-?clause|Section|Subsection)\s+\d+(?:\.\d+)*)\s*[.,]?\s+(and|or)\s+(\d{1,2},\d{1,2})\b/gi;
function buildReferenceLedger(clauses){
  const list=clauses||[];const referenceIndex=buildReferenceIndex(list);const out=[];
  list.forEach(clause=>{
    const body=heuristicBody(clause,16000);
    for(const match of body.matchAll(MALFORMED_REFERENCE_CONTINUATION)){
      const malformed=match[3];const suggested=malformed.replace(',','.');const start=match.index+match[0].length-malformed.length;
      out.push({id:`xref:${clause.id}:${start}:malformed:${malformed}`,occurrenceIndex:0,sourceStart:start,sourceEnd:start+malformed.length,clauseId:clause.id,clauseLabel:clause.number||clause.heading||'',reference:malformed,normalizedReference:malformed,status:'malformed',targetClauseId:'',targetClauseLabel:'',candidates:[],context:referenceContextSentence(body,malformed)||`…${match[1]} ${match[2]} ${malformed}…`,sourceTopic:'',confidence:'High',suggestedCorrection:`${match[1].split(/\s+/)[0]} ${suggested}`});
    }
    extractReferenceCandidates(body).forEach((occurrence,index)=>{
      const reference=occurrence.raw;
      const norm=normalizeReferenceToken(reference);const indexed=referenceIndex.get(norm);const context=referenceContextSentence(body,reference);let target=null;let status='missing';let candidates=[];
      if(Array.isArray(indexed)){status='ambiguous';candidates=indexed.map(item=>item.id);}
      else if(indexed){status='valid';target=indexed;}
      else {target=resolveReferenceTarget(reference,list);if(target)status='valid';}
      const sourceTopic=referenceSemanticTopic(context);
      if(status==='valid'&&target&&sourceTopic&&/\b(?:under|pursuant to|in accordance with|subject to|as set out in|specified in)\b/i.test(context)){
        const targetTopic=referenceSemanticTopic(`${target.heading||''} ${target.body||''}`);
        if(targetTopic&&targetTopic!==sourceTopic)status='semantic-mismatch';
      }
      out.push({id:`xref:${clause.id}:${occurrence.start}:${norm}`,occurrenceIndex:index,sourceStart:occurrence.start,sourceEnd:occurrence.end,clauseId:clause.id,clauseLabel:clause.number||clause.heading||'',reference,normalizedReference:norm,status,targetClauseId:target?.id||'',targetClauseLabel:target?(target.number||target.heading||''):'',candidates,context,sourceTopic,confidence:status==='valid'?'High':status==='semantic-mismatch'?'Moderate':'High'});
    });
  });
  return out;
}

function resolveCrossReferencedDefinitions(clauses,terms){
Object.values(terms).forEach(t=>{if(t.definitionType!=='cross_reference'||!t.reference){t.resolutionStatus||='';return;}
const parts=String(t.reference||'').split(/\s+(?:and|&|through|to)\s+/i).map(p=>p.trim()).filter(Boolean);
const tc=findClauseByReference(t.reference,clauses)||parts.map(p=>findClauseByReference(p,clauses)).find(Boolean);
if(!tc){t.resolutionStatus='unresolved';t.resolutionMessage='Referenced clause not found.';return;}
t.resolvedClauseId=tc.id;t.resolvedClauseLabel=tc.number;
const res=extractDefinitionFromReferencedClause(t.term,tc);
if(res&&res.definition){t.resolutionStatus='resolved';t.resolvedDefinition=res.definition;t.resolvedContextSentence=res.contextSentence||'';t.resolutionMessage='';return;}
t.resolutionStatus='reference_found';t.resolvedContextSentence=findSentenceContainingTerm(tc.body,t.term)||splitIntoSentences(tc.body)[0]||'';t.resolutionMessage='Clause found, definition not extracted confidently.';
});
}
function detectUnresolvedCrossReferencedDefinitions(terms){return Object.values(terms).filter(t=>t.definitionType==='cross_reference'&&['unresolved','reference_found'].includes(t.resolutionStatus)).map(t=>({term:t.term,reference:t.reference,definedInClauseId:t.definedInClauseId,reason:t.resolutionStatus==='reference_found'?'Referenced clause exists but does not confidently define this term.':'Referenced clause not found.'}));}
function extractDefinitionFromReferencedClause(term,clause){
const esc=escapeRegExp(term);const patterns=[new RegExp(`[\\""'']${esc}[\\""'']\\s*:?\\s*(?:shall\\s+mean|means)\\s+([^.;\\n]+(?:[.;\\n][^\\n]*)?)`,'i'),new RegExp(`\\b${esc}\\b\\s*:?\\s*(?:shall\\s+mean|means)\\s+([^.;\\n]+(?:[.;\\n][^\\n]*)?)`,'i')];
for(const p of patterns){const m=clause.body.match(p);if(m)return{definition:m[1].trim(),contextSentence:findSentenceContainingText(clause.body,m[0])||findSentenceContainingTerm(clause.body,term)||''};}
const s=findSentenceContainingTerm(clause.body,term);return s?{definition:'',contextSentence:s}:null;
}
function findSentenceContainingTerm(text,term){const re=new RegExp(`\\b${escapeRegExp(term)}\\b`,'i');return splitIntoSentences(text).find(s=>re.test(s))||'';}
function findSentenceContainingText(text,snippet){return splitIntoSentences(text).find(s=>s.includes(snippet))||'';}
function countResolvedCrossReferenceDefinitions(terms){return Object.values(terms).filter(t=>t.definitionType==='cross_reference'&&t.resolutionStatus==='resolved').length;}

function resolveReferenceAsDefinedTerm(term,reference){
const tc=findClauseByReference(reference,state.clauses||[]);if(!tc){showToast('Referenced clause not found','warn');return;}
const ext=extractDefinitionFromReferencedClause(term,tc);if(!ext){showToast('Definition could not be extracted','warn');return;}
const existing=state.definedTerms?.[term]||{};
const resolved={...existing,term,normalized:existing.normalized||term,definition:ext.definition||existing.definition||'',contextSentence:ext.contextSentence||existing.contextSentence||'',definitionType:existing.definitionType||'cross_reference',confidence:'reviewer',confidenceRank:Math.max(existing.confidenceRank||0,5),detectionRule:existing.detectionRule||'resolved_cross_reference',definedInClauseId:existing.definedInClauseId||tc.id,usedInClauseIds:Array.isArray(existing.usedInClauseIds)?existing.usedInClauseIds:[],scope:existing.scope||'global',resolutionStatus:'resolved',resolvedClauseId:tc.id,resolvedClauseLabel:tc.number||tc.heading||reference,reference};
recomputeUsageForTerm(resolved);state.definedTerms[term]=resolved;
state.issues.unresolvedCrossReferencedDefinitions=(state.issues.unresolvedCrossReferencedDefinitions||[]).filter(i=>!(i.term===term&&i.reference===reference));
state.issues.unusedDefinitions=detectUnusedDefinitions(state.definedTerms);state.issues.consistency=detectConsistencyIssues(state.clauses,state.definedTerms);state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);
precomputeTermHits();state.reviewItems=buildCanonicalReviewItems();
logReviewAction('xref-definition-resolved',tc.id,{summary:`${term} from ${reference}`});onSubstantiveChange({rerenderClause:true});showToast(`Resolved ${term} from ${reference}`,'info');
}

/* -- Issue detection -- */
function detectUndefinedCapitalizedTerms(clauses,terms){
const defined=new Set(Object.keys(terms));const principalTokens=typeof ANALYSIS_CORE.detectPrincipalParties==='function'?ANALYSIS_CORE.detectPrincipalParties(state.rawText||'').flatMap(p=>[p.alias,p.name]).filter(Boolean):[];const party=new Set([...Object.values(terms).filter(t=>t.definitionType==='party').map(t=>t.term),...principalTokens]);
const stop=new Set([...(state.customStopLists?.undefinedTerms||DEFAULT_STOP_LISTS.undefinedTerms),'Agreement','Clause','Section','Schedule','Annexure','Annex','Exhibit','Appendix','Article','Party','Parties','Client','Supplier','Vendor','District','State','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','January','February','March','April','May','June','July','August','September','October','November','December']);
const counts={};const clauseHits={};const contexts={};
const CAPWORD='[A-Z][A-Za-z]+(?:-[A-Z][A-Za-z]+)*';const capPhraseRe=new RegExp(`\\b(${CAPWORD}(?:\\s+(?:of|and|for|the)\\s+${CAPWORD}|\\s+${CAPWORD}){0,3})\\b`,'g');
const SENTENCE_INITIAL_STOPWORDS=/^(?:The|This|That|Any|Each|Either|For|If|In|On|At|From|To|Not|No|Unless|Where|While|Although|Additional|Fails?|With|Without|Notwithstanding|Provided|Subject|Prior|After|Before|During|Following|Pursuant|Except|Should|When|Whereas|Furthermore|However|Moreover|Nonetheless|Nevertheless|Both|All|Such|Upon)$/;
clauses.forEach(c=>{if(isAdministrativeLine(`${c.number} ${c.heading}`)||isClauseAfterExecutionBoundary(c))return;const seen=new Set();splitIntoSentences(truncateAtExecutionBoundary(c.body)).forEach(s=>{if(/^[A-Z\s]{6,}$/.test(s.trim()))return;[...s.matchAll(capPhraseRe)].forEach(match=>{let n=match[1].trim();const isStructuralStart=match.index===0||/\([a-z0-9ivx]+\)\s*$/i.test(s.slice(0,match.index));if(isStructuralStart){const words=n.split(/\s+/);if(SENTENCE_INITIAL_STOPWORDS.test(words[0])){words.shift();n=words.join(' ');}if(!n)return;}if(defined.has(n)||stop.has(n)||party.has(n))return;const joinedParts=n.split(/\s+(?:of|and|for|the)\s+/i);if(joinedParts.length>1&&joinedParts.every(w=>defined.has(w)||stop.has(w)||party.has(w)))return;if(/^(?:The|This|That|Any|Each|Either|For|If|In|On|At|From|To|Not|No)(?:\s|$)/.test(n))return;if(/\b(?:Agreement|Party|Parties)$/.test(n))return;if(n.length<4)return;if(/^(Page|Date|Name|Phone|E-?mail|Email|Road|Street|California|Eureka|For InnoStars)$/i.test(n))return;counts[n]=(counts[n]||0)+1;seen.add(n);contexts[n]||=[];contexts[n].push({clauseId:c.id,sentence:s,heading:c.heading||''});});});seen.forEach(t=>{clauseHits[t]||=new Set();clauseHits[t].add(c.id);});});
const minCount=Math.max(3,Math.ceil((clauses.length||1)/12));
return Object.entries(counts).map(([term,count])=>{const assessment=REVIEW_CORE.scoreDefinedTermCandidate(term,contexts[term]||[],{clauseCount:clauses.length,frequency:count,spread:clauseHits[term]?.size||0});return{term,count,clauseCount:clauseHits[term]?.size||0,assessment};}).filter(item=>!state.ignoredUndefinedTerms.includes(item.term)).filter(item=>item.assessment.structural||(item.count>=minCount&&item.clauseCount>=3)).sort((a,b)=>Number(b.assessment.structural)-Number(a.assessment.structural)||b.assessment.score-a.assessment.score||b.count-a.count).slice(0,36).map(item=>({term:item.term,count:item.count,clauseCount:item.clauseCount,lane:item.assessment.structural?'structural':'frequency',confidence:item.assessment.score>=6?'High':'Moderate',structuralReasons:item.assessment.reasons||[],contexts:(contexts[item.term]||[]).slice(0,3)}));
}
function detectUnusedDefinitions(terms){return Object.values(terms).filter(t=>!t.usedInClauseIds.length&&t.scope!=='local').map(t=>({term:t.term,definedInClauseId:t.definedInClauseId}));}

function buildDefinitionGraph(clauses,terms){
  const entries=Object.values(terms||{}).filter(term=>term?.term);const order=new Map((clauses||[]).map((clause,index)=>[clause.id,index]));
  const partyKeys=getPrincipalPartyTermKeys(terms);
  const nodes=entries.map(term=>({term:term.term,definitionType:term.definitionType||'',isPartyTerm:partyKeys.has(String(term.term).trim().toLowerCase()),definedInClauseId:term.definedInClauseId||'',definition:(term.resolutionStatus==='resolved'?term.resolvedDefinition:'')||term.definition||term.contextSentence||'',usedInClauseIds:[...new Set(term.usedInClauseIds||[])],scope:term.scope||'global',dependencies:[],usedBeforeDefinition:[]}));
  const byTerm=new Map(nodes.map(node=>[String(node.term).toLowerCase(),node]));
  nodes.forEach(node=>{
    const definition=String(node.definition||'');
    entries.forEach(candidate=>{
      if(candidate.term===node.term||node.isPartyTerm||partyKeys.has(String(candidate.term).trim().toLowerCase())||candidate.definitionType==='party')return;
      if(node.isPartyTerm||/\b(?:private limited|limited|llp|llc|inc\.?|corporation|company)\b/i.test(node.term))return;
      const regex=buildTermBoundaryRegex(candidate.term,'i');
      if(regex.test(definition))node.dependencies.push(candidate.term);
    });
    const definitionOrder=order.has(node.definedInClauseId)?order.get(node.definedInClauseId):Number.MAX_SAFE_INTEGER;
    node.usedBeforeDefinition=node.usedInClauseIds.filter(id=>(order.get(id)??Number.MAX_SAFE_INTEGER)<definitionOrder);
  });
  const edges=[];nodes.forEach(node=>node.dependencies.forEach(target=>edges.push({from:node.term,to:target})));
  const issues=[];
  nodes.forEach(node=>node.usedBeforeDefinition.forEach(clauseId=>issues.push({id:`used-before:${node.term}:${clauseId}`,kind:'used-before-definition',term:node.term,clauseId,definedInClauseId:node.definedInClauseId,detail:`${node.term} appears before its detected definition.`})));
  const visiting=new Set(),visited=new Set(),cycles=new Set();
  const walk=(term,path=[])=>{const key=String(term).toLowerCase();if(visiting.has(key)){const start=path.findIndex(item=>String(item).toLowerCase()===key);const cycle=[...path.slice(Math.max(0,start)),term];const canonical=cycle.map(String).join(' → ');const reverse=[...cycle].reverse().join(' → ');cycles.add(canonical.localeCompare(reverse)<0?canonical:reverse);return;}if(visited.has(key))return;visiting.add(key);const node=byTerm.get(key);(node?.dependencies||[]).forEach(next=>walk(next,[...path,term]));visiting.delete(key);visited.add(key);};
  nodes.forEach(node=>walk(node.term,[]));cycles.forEach(path=>issues.push({id:`cycle:${path}`,kind:'circular-definition',term:path.split(' → ')[0],clauseId:byTerm.get(path.split(' → ')[0].toLowerCase())?.definedInClauseId||'',detail:`Possible circular definition: ${path}.`}));
  return{nodes,edges,issues};
}

function detectConsistencyIssues(clauses,terms=state.definedTerms){
const issues=[];const sup=countRegexInClauses(clauses,/\bSupplier\b/g);const sp=countRegexInClauses(clauses,/\bService Provider\b/g);
if(sup>=1&&sp>=2)issues.push({category:'Drafting consistency',severity:'style',type:'Naming variation',description:'Supplier and Service Provider both appear.'});
const cl=countRegexInClauses(clauses,/\bClient\b/g);const cu=countRegexInClauses(clauses,/\bCustomer\b/g);
if(cl>=1&&cu>=2)issues.push({category:'Drafting consistency',severity:'style',type:'Naming variation',description:'Client and Customer both appear.'});
const sh=countRegexInClauses(clauses,/\bshall\b/gi);const wi=countRegexInClauses(clauses,/\bwill\b/gi);
if(sh>=3&&wi>=3)issues.push({category:'Drafting consistency',severity:'style',type:'Mandatory language variation',description:'Both "shall" and "will" are used extensively. Review for drafting consistency; this is not scored as legal risk.'});
const bd=countRegexInClauses(clauses,/\bBusiness Days?\b/g);const pd=countRegexInClauses(clauses,/\bdays\b/gi);
if(bd>=1&&pd>=bd+3)issues.push({category:'Drafting consistency',severity:'style',type:'Time period variation',description:'Both "Business Days" and plain "days" appear. Confirm that the distinction is intentional.'});
collectEarlyTermUseIssues(clauses,terms).slice(0,5).forEach(i=>issues.push({category:'Document hygiene',severity:'hygiene',type:'Term used before definition',description:`${i.term} appears before its definition.`}));
return issues;
}
function collectEarlyTermUseIssues(clauses,terms){
const issues=[];const firstUse={};clauses.forEach((c,i)=>{(c.body.match(/\b([A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,2})\b/g)||[]).forEach(t=>{if(!(t.trim() in firstUse))firstUse[t.trim()]=i;});});
Object.values(terms||{}).forEach(t=>{const di=clauses.findIndex(c=>c.id===t.definedInClauseId);const ui=firstUse[t.term];if(typeof ui==='number'&&di>-1&&ui<di)issues.push({term:t.term,useIdx:ui,defIdx:di});});
return issues;
}
function countRegexInClauses(clauses,re){let c=0;const r=new RegExp(re.source,re.flags);clauses.forEach(cl=>{r.lastIndex=0;const m=cl.body.match(r);c+=m?m.length:0;});return c;}
function detectMissingStandardClauses(clauses){return detectExpectedClauseCoverage(clauses,state.contractType||'Custom').missing||[];}
function detectSurvivalClauses(clauses){
const out=[];const re=/\b(?:shall\s+survive|survives?\s+(?:termination|expiry)|survive\s+(?:termination|expiration|expiry)|notwithstanding\s+termination|continue\s+after\s+termination|remain\s+in\s+effect\s+after\s+termination)\b/i;
clauses.forEach(c=>{if(re.test(`${c.heading} ${c.body}`))out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,excerpt:extractRegexContextExcerpt(c.body||'',re,120,String(c.body||'').slice(0,220)),note:''});
else{const arbitration=ANALYSIS_CORE.assessOperativeAssertion?.(c.body||'',{heading:c.heading||'',allowHeading:true,mention:/\b(?:arbitration|diac|siac|ica|arbitration and conciliation act)\b/i,operative:/\b(?:shall|must|will|agrees? to|submit(?:s|ted)? to|refer(?:s|red)? to)\b[^.;]{0,180}\b(?:arbitration|diac|siac|ica)\b|\b(?:arbitration|diac|siac|ica)\b[^.;]{0,180}\b(?:shall|must|will|binding|final)\b/i});if(arbitration?.asserted)out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,excerpt:'Operative arbitration clause - survival may apply by statute.',note:'statutory'});}});
return out;
}
function detectExpectedClauseCoverage(clauses,type){
const canonicalClauseType=value=>{const key=String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,'');const map={limitationofliability:'Liability',liabilitycap:'Liability',governinglawandjurisdiction:'Governing Law',ip:'Intellectual Property',dataprivacy:'Data Protection',paymentterms:'Fees',forcemajeure:'Force Majeure',changemanagement:'Change Control'};return map[key]||value;};
const prof=CONTRACT_ARCHETYPES[type]||CONTRACT_ARCHETYPES.Custom;const exp=[...(prof.expectedClauses||[])].map(canonicalClauseType);const ft=new Set(clauses.map(c=>canonicalClauseType(c.type)));const text=clauses.map(c=>`${c.heading} ${c.body}`).join('\n');
const aliases={'Liability':/limitation of liability|aggregate liability|liability shall not exceed|consequential damages/i,'Confidentiality':/confidential information|confidentiality|non-?disclosure/i,'Data Protection':/personal data|data protection|privacy|processor|controller|personal data breach/i,'Fees':/fees?|invoice|payment terms?|charges|pricing/i,'Termination':/termination|terminate|without cause|for convenience|material breach/i,'Intellectual Property':/intellectual property|ownership of deliverables|work product|license|background ip/i,'Assignment':/assignment|change of control/i,'Governing Law':/governed by(?: and construed in accordance with)? the laws of|governing law|laws governing this agreement/i,'Audit':/audit rights?|inspection|books and records|access to records/i,'Service Levels':/service levels|sla|uptime|availability|performance standards|kpi|service credits/i,'Acceptance':/acceptance criteria|deemed acceptance|acceptance test|accept the deliverable|reject the deliverable/i,'Change Control':/change control|change request|variation|change order|modification/i,'Services':/services|scope of work|statement of work/i};
const conceptKeys={'Acceptance':'acceptance','Change Control':'changeControl','Liability':'liabilityCap','Confidentiality':'confidentiality','Data Protection':'dataProtection','Fees':'fees','Termination':'termination','Intellectual Property':'intellectualProperty','Assignment':'assignment','Governing Law':'governingLaw','Audit':'audit','Service Levels':'serviceLevels'};
const conceptPresent=state.legalConceptEvidence?.present||{};
const present=[];const missing=[];const weak=[];const coverage={};exp.forEach(l=>{const concept=conceptKeys[l];const strong=conceptPresent[concept]===true;const classified=ft.has(l);const lexical=!!(aliases[l]&&aliases[l].test(text));const placeholder=l==='Data Protection'&&/\b(?:dpa|data protection)\b[^.\n]{0,120}\b(?:to be agreed|to be entered|future|applicable schedule|see \[|tbd)\b/i.test(text)&&!strong;const evidenceRequired=['Governing Law','Liability','Acceptance','Change Control'].includes(l);if(strong||(!evidenceRequired&&classified&&!placeholder)){present.push(l);coverage[l]={status:'present',basis:strong?'operative-evidence':'classified-clause'};}else if(placeholder||lexical||classified){weak.push(l);coverage[l]={status:placeholder?'placeholder':'mentioned',basis:placeholder?'placeholder-reference':classified?'classification-candidate':'lexical-signal'};}else{missing.push(l);coverage[l]={status:'missing',basis:'no-evidence'};}});
return{expected:exp,present,missing,weak,coverage};
}

/* -- Obligations -- */
function extractObligations(clauses){
if(typeof ANALYSIS_CORE.extractObligationEvidence==='function')return ANALYSIS_CORE.extractObligationEvidence(clauses,state.rawText||'');
return [];
}
function extractDeadlines(clauses){
const obligations=extractObligations(clauses);return obligations.filter(item=>item.calendarable&&item.deadline).map((item,index)=>({id:`dl-${item.clauseId}-${index+1}`,clauseId:item.clauseId,clauseLabel:item.clauseLabel,expression:item.deadline,sentence:item.sourceSentence||item.action,unresolved:/\[[^\]]+\]|[●]/.test(item.sourceSentence||item.action),topic:item.topic||'General',kind:'deadline',confidence:item.confidence||'High',obligationId:item.id}));
}

function buildExecutionCheck(){
const items=[];const add=(type,label,detail,clauseId='',severity='blocker')=>items.push({id:`exec-${type}-${items.length+1}`,type,label,detail,clauseId,severity,status:'open'});
(state.placeholders||[]).filter(p=>!p.resolved&&!p.ignored).forEach(p=>add('placeholder','Unfilled drafting blank',`${p.clauseLabel||''} · ${p.text}`,p.clauseId));
(state.issues?.crossReferenceBreaks||[]).filter(i=>/\b(?:schedule|annex(?:ure)?|exhibit|appendix)\b/i.test(i.reference||'')).forEach(i=>add('missing-annex','Referenced attachment not found',`${i.clauseLabel||''} refers to ${i.reference}`,i.clauseId));
const executionText=findExecutionBoundaryIndex(state.rawText||'')>=0?String(state.rawText||'').slice(findExecutionBoundaryIndex(state.rawText||'')):'';
if(!executionText)add('signature','Signature block not identified','No IN WITNESS WHEREOF, For [Party], or Name/Phone/E-mail signature pattern was found.','', 'verify');
else{
 const expected=typeof ANALYSIS_CORE.detectPrincipalParties==='function'?ANALYSIS_CORE.detectPrincipalParties(state.rawText||'').slice(0,4):[];
 expected.forEach(p=>{if(!new RegExp(`(?:For\\s+)?${escapeRegExp(p.alias)}|${escapeRegExp(p.name)}`,'i').test(executionText))add('signature','Party signature block may be missing',`${p.alias||p.name} was identified in the preamble but not in the execution block.`,'','verify');});
 if(/\b(?:Name|Title|Signature|Date)\s*:\s*(?:\[[^\]]+\]|_{3,}|●|\s*(?:\n|$))/i.test(executionText))add('signature','Incomplete signature details','At least one Name, Title, Signature or Date field appears blank.');
}
const undated=(state.placeholders||[]).filter(p=>!p.resolved&&!p.ignored&&/date|effective|start|commencement/i.test(p.text||''));
if(!undated.length&&/\b(?:effective|commencement|start) date\b/i.test(state.rawText||'')&&!/\b(?:effective|commencement|start) date\b[^.\n]{0,80}(?:\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}|[A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i.test(state.rawText||''))add('date','Effective/start date requires verification','A date concept was found but no explicit calendar date was confidently extracted.','','verify');
return{items,status:items.some(i=>i.severity==='blocker')?'not-ready':items.length?'verify':'ready',generatedAt:new Date().toISOString()};
}
function renderExecutionCheckCard({compact=false}={}){const check=buildExecutionCheck();state.executionCheck=check;const open=check.items;return `<section class="tool-card guided-card execution-check-card ${check.status==='ready'?'low':check.status==='not-ready'?'high':'warn'}"><div class="guided-card-head"><div><div class="mini-label">Pre-signature execution check</div><h3>${check.status==='ready'?'No execution blockers detected':`${open.length} item${open.length===1?'':'s'} before signature`}</h3></div><span class="clause-pill">${escapeHtml(check.status==='ready'?'Ready to verify':check.status==='not-ready'?'Not ready':'Verify')}</span></div>${open.length?`<div class="summary-list">${open.slice(0,compact?4:12).map(i=>`<button type="button" class="summary-item ${i.clauseId?'jump-clause':''}" ${i.clauseId?`data-clause-id="${escapeHtml(i.clauseId)}"`:''}><span><strong>${escapeHtml(i.label)}</strong><small>${escapeHtml(i.detail)}</small></span><span class="summary-meta">${escapeHtml(i.severity==='blocker'?'Fix':'Verify')}</span></button>`).join('')}</div>`:'<p class="mini">No unresolved blanks, missing referenced attachments, incomplete signature fields or undated start provisions were detected. Verify the final Word document before signing.</p>'}<p class="mini">This is a deterministic preflight, not confirmation that the agreement is legally ready to execute.</p></section>`;}
function renderUpfrontFindingsCard(){const xrefCount=new Set([...(state.issues?.crossReferenceBreaks||[]),...(state.issues?.semanticCrossReferenceWarnings||[]),...(state.issues?.unresolvedCrossReferencedDefinitions||[])].map(i=>`${i.clauseId||''}:${i.reference||i.term||i.text||''}`)).size;const rows=[{tool:'terms',detector:'undefinedTerms',count:(state.issues?.undefinedCapitalizedTerms||[]).length+(state.definitionGraph?.issues||[]).length,singular:'term issue',plural:'term issues',clean:'defined terms checked · none found'},{tool:'refs',detector:'crossReferences',count:xrefCount,singular:'reference issue',plural:'reference issues',clean:'cross-references checked · none found'},{tool:'fills',detector:'placeholders',count:(state.placeholders||[]).filter(p=>!p.resolved&&!p.ignored).length,singular:'unfilled blank',plural:'unfilled blanks',clean:'placeholders checked · none found'},{tool:'timeline',detector:'deadlines',count:(state.deadlines||[]).length,singular:'tracked deadline',plural:'tracked deadlines',clean:'deadline signals checked · none found'},{tool:'refs',detector:'subjectiveStandards',count:(state.issues?.subjectiveStandards||[]).length,singular:'subjective standard',plural:'subjective standards',clean:'subjective standards checked · none found'},{tool:'refs',detector:'asymmetries',count:(state.issues?.asymmetries||[]).length,singular:'material asymmetry',plural:'material asymmetries',clean:'material asymmetry checked · none found'}];return `<section class="tool-card guided-card findings-first-card"><div class="guided-card-head"><div><div class="mini-label">Document findings</div><h3>What needs attention before review</h3></div><span class="heuristic-badge">click to inspect</span></div><div class="findings-summary-grid">${rows.map(r=>{const health=state.detectorHealth?.[r.detector]?.status||'not-run';const trustworthy=health==='checked';const limited=health==='limited';return `<button type="button" data-open-finding-tool="${r.tool}" class="finding-summary ${r.count?'has-findings':trustworthy?'is-clean':'is-limited'}"><strong>${r.count?r.count:trustworthy?'✓':'?'}</strong><span>${escapeHtml(r.count?`${r.count} ${r.count===1?r.singular:r.plural}`:trustworthy?r.clean:limited?'Check completed with limited source coverage':'Check not completed')}</span></button>`;}).join('')}</div></section>`;}

function getDealTermsConformance(){const baseline=state.dealTermsBaseline||{};const actual=extractCommercialTermsSummary();const rows=[];const add=(key,label,expected,found,normalizer=v=>String(v||'').toLowerCase().replace(/\s+/g,' ').trim())=>{if(!String(expected||'').trim())return;const e=normalizer(expected),a=normalizer(found);const silent=!found||/not detected/i.test(found);rows.push({key,label,expected:String(expected),actual:String(found||'Not detected'),status:silent?'silent':(a.includes(e)||e.includes(a)?'match':'mismatch')});};add('fee','Fee / pricing',baseline.fee,actual.fees||actual.paymentTerms);add('paymentDays','Payment days',baseline.paymentDays,actual.paymentTerms,v=>String(v||'').match(/\d+/)?.[0]||String(v||'').trim());add('termLength','Term length',baseline.termLength,actual.initialTerm);add('noticePeriod','Notice period',baseline.noticePeriod,actual.terminationNotice);add('liabilityCap','Liability cap',baseline.liabilityCap,actual.liabilityCap);add('startDate','Start date',baseline.startDate,actual.effectiveDate);return rows;}
function renderDealTermsConformanceCard(){const b=state.dealTermsBaseline||{};const rows=getDealTermsConformance();const fields=[['fee','Fee / pricing'],['paymentDays','Payment days'],['termLength','Term length'],['noticePeriod','Notice period'],['liabilityCap','Liability cap'],['startDate','Start date']];return `<details class="tool-card guided-card deal-conformance-card"><summary><strong>Check against agreed deal terms</strong><span class="mini">Optional · flags mismatches and silence</span></summary><div class="deal-term-grid">${fields.map(([key,label])=>`<label class="drafting-field compact-field"><span>${escapeHtml(label)}</span><input type="text" data-deal-term-field="${key}" value="${escapeHtml(b[key]||'')}" placeholder="Expected ${escapeHtml(label.toLowerCase())}"></label>`).join('')}</div>${rows.length?`<div class="summary-list">${rows.map(r=>`<div class="summary-item"><span><strong>${escapeHtml(r.label)}</strong><small>Expected: ${escapeHtml(r.expected)} · Contract: ${escapeHtml(r.actual)}</small></span><span class="clause-pill status-pill-${r.status==='match'?'low':r.status==='silent'?'medium':'high'}">${escapeHtml(r.status)}</span></div>`).join('')}</div>`:'<p class="mini">Enter the commercial deal points you expect. Cockpit will compare them with the document’s extracted terms; every result remains lawyer-verifiable.</p>'}</details>`;}

/* -- Classification -- */
function scoreClauseAgainstClassifier(text, classifier){
let score=0;
(classifier.positive||[]).forEach(re=>{ if(re.test(text)) score += (classifier.weight||1); });
(classifier.negative||[]).forEach(re=>{ if(re.test(text)) score -= Math.max(1, Math.floor((classifier.weight||1)/2)); });
return score;
}
const CLASSIFIER_OPERATIVE_RULES={
  'Termination':/\b(?:may|shall|can|is entitled to)\s+terminat|\btermination\s+(?:for|upon|by)|\b(?:cure|remedy)\s+period\b/i,
  'Governing Law':/\bgoverned by\b|\bexclusive jurisdiction\b|\bsubmits? to (?:the )?jurisdiction\b/i,
  'Warranty':/\b(?:represents? and warrants?|warrants? that|disclaims?\s+(?:all\s+)?warrant)/i,
  'Data Protection':/\b(?:process(?:es|ing)?\s+personal data|data controller|data processor|comply with\s+(?:applicable\s+)?data protection|personal data breach)\b/i,
  'Indemnity':/\b(?:shall|will|agrees? to|undertakes? to)\s+(?:defend,?\s*)?(?:indemnif|hold harmless)/i,
  'Assignment':/\b(?:shall not|may not|must not|may|can)\s+(?:assign|transfer)\b/i,
  'Audit':/\b(?:may|shall be entitled to|has the right to)\s+(?:audit|inspect|access)\b/i
};
function classifyClauses(clauses){
clauses.forEach(c=>{
  const heading=String(c.heading||'').trim();
  const explicitHeading=[
    [/^(?:definitions?|interpretation|defined terms?)\b/i,'Definitions'],
    [/^(?:service levels?|service credits?|sla)\b/i,'Service Levels'],
    [/^(?:force majeure|events? beyond control)\b/i,'Force Majeure'],
    [/^(?:governing law|applicable law)\b/i,'Governing Law'],
    [/^(?:termination|term and termination)\b/i,'Termination']
  ].find(([pattern])=>pattern.test(heading));
  if(explicitHeading){c.type=explicitHeading[1];c.classificationConfidence='High';c.classificationStatus='classified';return;}
  let best={type:'General', score:0};
  CLAUSE_CLASSIFIERS.forEach(classifier=>{
    const headingScore=scoreClauseAgainstClassifier(String(c.heading||''),classifier)*3;const operative=CLASSIFIER_OPERATIVE_RULES[classifier.type];if(operative&&!headingScore){const assertion=ANALYSIS_CORE.assessOperativeAssertion?.(c.body||'',{heading:c.heading||'',allowHeading:false,mention:(classifier.positive||[])[0],operative});if(assertion&&!assertion.asserted)return;}const bodyScore=scoreClauseAgainstClassifier(String(c.body||''),classifier);const score=headingScore+bodyScore;
    if(score>best.score) best={type:classifier.type, score};
  });
  c.type=best.score>0 ? best.type : 'General';
  c.classificationConfidence=best.score>=15?'High':best.score>=6?'Medium':'Low';
  c.classificationStatus=best.score>0?'classified':'unknown';
});
}

/* -- Commercial anomalies -- */
function detectNumericalAnomalies(clauses){
const defaults={'Fees':{paymentDays:30},'Termination':{noticeDays:30,termYears:3},'Liability':{capMonths:12,percentCap:100},'Services':{milestoneDays:90}};
const out=[];(clauses||[]).forEach(c=>{const t=c.type||'General';const body=String(c.body||'');const cfg={...(defaults[t]||{}),...(typeof getPlaybookMatchForClause==='function'?getPlaybookMatchForClause(c)?.item||{}:{})};const found=[];
[...body.matchAll(/(\d+)\s*(days?|months?|years?|%|percent|times?|x\b)/gi)].forEach(m=>{const v=Number(m[1]);const u=String(m[2]||'').toLowerCase();const ph=`${m[1]} ${m[2]}`;found.push(ph);
if(/day/.test(u)&&/fee|invoice|payment|pay/i.test(body)&&cfg.paymentDays&&v>cfg.paymentDays)out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,type:'Commercial deviation',topic:'Payment term',expression:ph,message:`Payment term ${v} days vs ${cfg.paymentDays}-day baseline.`});
else if(/day/.test(u)&&/notice|terminate|termination/i.test(body)&&cfg.noticeDays&&v>(cfg.noticeDays*2))out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,type:'Commercial deviation',topic:'Notice period',expression:ph,message:`Notice ${v} days vs ${cfg.noticeDays}-day baseline.`});
if(/year/.test(u)&&/term|renew|initial term/i.test(body)&&cfg.termYears&&v>cfg.termYears)out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,type:'Commercial deviation',topic:'Term length',expression:ph,message:`Term ${v} years vs ${cfg.termYears}-year baseline.`});
});
if(!out.some(i=>i.clauseId===c.id)&&found.length&&['Fees','Liability','Termination'].includes(t))out.push({clauseId:c.id,clauseLabel:c.number||c.heading,heading:c.heading,type:'Commercial datapoint',topic:t,expression:found.slice(0,4).join(' * '),message:`Commercial numbers: ${found.slice(0,4).join(', ')}.`});

});return out;
}

function extractCommercialTermsSummary(){
  const text=String(state.rawText||state.clauses.map(c=>`${c.heading||''}\n${c.body||''}`).join('\n')||'');
  if(typeof ANALYSIS_CORE.extractCommercialTermsSummary==='function'){
    const summary=ANALYSIS_CORE.extractCommercialTermsSummary(text);
    const evidence=typeof ANALYSIS_CORE.extractClauseLocalEvidence==='function'?ANALYSIS_CORE.extractClauseLocalEvidence(state.clauses||[]):{indemnities:[],dispute:[]};
    if(evidence.indemnities?.length){summary.indemnityEvidence=evidence.indemnities;summary.indemnityScope=evidence.indemnities.map(item=>`${item.sourceLabel}: ${item.value}`).join(' · ');}
    if(evidence.dispute?.length){summary.disputeEvidence=evidence.dispute;const preferred=evidence.dispute.find(item=>/option/i.test(item.value))||evidence.dispute[evidence.dispute.length-1];summary.disputeResolution=`${preferred.value}: ${preferred.sourceExcerpt}`;}
    return summary;
  }
  const pick=(regex, transform=(m)=>m[0])=>{ const match=text.match(regex); return match?transform(match):'Not detected'; };
  const clean=value=>String(value||'').replace(/\s*\|\s*/g,' · ').replace(/\s+/g,' ').trim().replace(/^[,;:\s]+|[,;:\s]+$/g,'');
  const ranked=(regex,score)=>{const hits=[...text.matchAll(regex)].map(m=>({m,value:clean(m[1]||m[0]),score:score(m)})).sort((a,b)=>b.score-a.score);return hits[0]?.value||'Not detected';};
  const partyHits=[...text.slice(0,2500).matchAll(/([^\n]{2,220}?)\s*(?:\(|,)?\s*(?:hereinafter\s+referred\s+to\s+as|referred\s+to\s+as)\s*:?\s*["“”]([^"“”]{1,50})["“”]/gi)]
    .map(m=>({name:clean(m[1].replace(/^(?:and|between)\s+/i,'')),alias:clean(m[2])}))
    .filter(p=>p.name&&p.alias);
  const uniqueParties=[];partyHits.forEach(p=>{if(!uniqueParties.some(x=>x.alias.toLowerCase()===p.alias.toLowerCase()))uniqueParties.push(p);});
  const standardParties=text.slice(0,2500).replace(/\s+/g,' ').match(/between\s+(.{2,280}?)\s+\(["“]([^"”]{1,40})["”]\)\s*,?\s+and\s+(.{2,280}?)\s+\(["“]([^"”]{1,40})["”]\)/i);
  const parties=uniqueParties.length>=2?uniqueParties.slice(0,8).map(p=>`${p.name} (${p.alias})`).join(' / '):standardParties?`${clean(standardParties[1])} (${clean(standardParties[2])}) / ${clean(standardParties[3])} (${clean(standardParties[4])})`:'Not detected';
  return {
    effectiveDate: pick(/(?:effective date|effective as of|dated as of|made on)\s*(?:is|of|:)?\s*([A-Z][a-z]+\s+\d{1,2},\s*\d{4}|\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\[[^\]]+\])/i, m=>m[1].replace(/\s+/g,' ').trim()),
    initialTerm: pick(/(initial term[^.\n]{0,80}?\b\d+\s+(?:months?|years?)|continue for an initial term of[^.\n]{0,80})/i, m=>m[1].replace(/\s+/g,' ').trim()),
    renewal: pick(/(auto(?:matic)? renewal[^.\n]{0,80}|renew(?:al)? term[^.\n]{0,80}|renews? automatically[^.\n]{0,80}|mutual written agreement[^.\n]{0,40}renew)/i, m=>m[1].replace(/\s+/g,' ').trim()),
    terminationNotice: pick(/((?:terminate|termination)[^.\n]{0,80}?\b\d+\s+days?'?\s+(?:written\s+)?notice|\b\d+\s+days?'?\s+(?:written\s+)?notice[^.\n]{0,60}terminate)/i, m=>m[1].replace(/\s+/g,' ').trim()),
    paymentTerms: ranked(/([^\n.]{0,80}(?:payment\s+term|invoice|payable)[^\n.]{0,120}\b(?:[a-z]+\s*\()?\d+\)?\s+days?[^\n.]{0,80}|[^\n.]{0,60}\b(?:[a-z]+\s*\()?\d+\)?\s+days?[^\n.]{0,120}(?:invoice|payment|payable)[^\n.]{0,40})/gi,m=>/payment\s+term/i.test(m[0])?4:/invoice/i.test(m[0])?3:1),
    liabilityCap: ranked(/([^\n.]{0,50}(?:liability|aggregate cap|financial liability)[^\n.]{0,220}(?:shall not exceed|limited to|capped at|maximum|percentage|%)[^\n.]{0,120})/gi,m=>/shall not exceed|capped at|limited to/i.test(m[0])?4:2),
    indemnityScope: ranked(/([^\n.]{0,40}(?:indemnify|indemnification|hold harmless)[^\n.]{0,220})/gi,m=>/third.part|claim|loss|damage/i.test(m[0])?3:1),
    ipOwnership: ranked(/([^\n.]{0,80}(?:intellectual property|background ip|work product|deliverables|ownership)[^\n.]{0,220}(?:vest(?:ed)? in|retain(?:s|ed)?|own(?:s|ed)?|assign(?:s|ed)?)[^\n.]{0,100}|[^\n.]{0,80}(?:vest(?:ed)? in|retain(?:s|ed)? ownership|shall own)[^\n.]{0,160}(?:intellectual property|work product|deliverables)[^\n.]{0,60})/gi,m=>/vest|shall own|retain/i.test(m[0])?4:2),
    governingLaw: pick(/(?:governed by the laws of|laws of)\s+([A-Za-z &]+)(?:[.,;\n]|\s+and)/i, m=>m[1].replace(/\s+/g,' ').trim()),
    disputeResolution: ranked(/([^\n.]{0,80}(?:arbitration|exclusive jurisdiction|courts? of|SIAC|LCIA|ICC|DIAC)[^\n.]{0,220})/gi,m=>(/arbitration|exclusive jurisdiction|ICC|SIAC|LCIA|DIAC/i.test(m[0])?6:1)-(/court of auditors|audit|anti.fraud/i.test(m[0])?10:0)),
    dataProcessingRole: ranked(/([^\n.]{0,80}(?:data processor|data controller|acts? as (?:a )?(?:processor|controller)|process(?:es|ing)? personal data on behalf of|documented instructions)[^\n.]{0,200})/gi,m=>/data processor|data controller|acts? as|on behalf of|documented instructions/i.test(m[0])?3:1),
    confidentialityTerm: ranked(/([^\n.]{0,120}(?:confidential|non-disclosure)[^\n.]{0,180}\b\d+\s+years?[^\n.]{0,100}|[^\n.]{0,80}\b\d+\s+years?[^\n.]{0,180}(?:confidential|after (?:termination|expiry))[^\n.]{0,80})/gi,m=>/after termination|after expiry|survive/i.test(m[0])?4:2),
    forceMajeure: /(force majeure|act of god)/i.test(text) ? 'Present' : 'Not detected',
    assignmentRestriction: ranked(/([^\n.]{0,60}(?:shall not|may not|must not)[^\n.]{0,80}(?:assign|transfer|pledge)[^\n.]{0,160}(?:consent|approval)[^\n.]{0,80}|[^\n.]{0,60}(?:assign|transfer|pledge)[^\n.]{0,120}(?:consent|approval)[^\n.]{0,80})/gi,m=>/shall not|must not|may not/i.test(m[0])?4:2),
    parties
  };
}
function getCommercialTermEvidence(label,value,terms={}){
  if(!value||value==='Not detected')return{source:'No source located',confidence:'Low',excerpt:''};
  const structured=label==='Indemnity scope'?terms.indemnityEvidence:label==='Dispute resolution'?terms.disputeEvidence:null;
  if(structured?.length){
    const evidence=structured[0];
    return{source:evidence.sourceLabel||'Source clause',confidence:evidence.matchStrength||'Medium',excerpt:evidence.sourceExcerpt||''};
  }
  const keywords={Parties:/party|between|supplier|client/i,'Effective date':/effective|starting date/i,'Termination date':/termination|end date/i,'Initial term':/initial term|shall end|duration/i,Renewal:/renew/i,'Termination notice':/notice|terminate/i,'Confidentiality term':/confidential|non-disclosure/i,'Payment terms':/payment|invoice|payable/i,'Liability cap':/liability|cap|damages/i,'Indemnity scope':/indemn/i,'IP ownership':/intellectual property|ownership|deliverable/i,'Data processing role':/personal data|processor|controller/i,'Governing law':/governed by|laws of/i,'Dispute resolution':/arbitration|jurisdiction|courts/i,'Assignment restriction':/assign|transfer/i,'Force majeure':/force majeure|act of god/i};
  const re=keywords[label];
  const clause=(state.clauses||[]).find(c=>re?.test(`${c.heading} ${c.body}`));
  return{source:clause?`${clause.number||''} ${clause.heading||'Clause'}`.trim():'Document text',confidence:clause?'Medium':'Low',excerpt:clause?String(clause.body||'').replace(/\s+/g,' ').slice(0,360):''};
}

function renderCommercialEvidenceRegister(title,items=[]){
  if(!items.length)return'';
  return `<details class="commercial-evidence-register" open><summary>${escapeHtml(title)} <span class="count-badge">${items.length}</span></summary><div class="commercial-evidence-list">${items.map(item=>`<article class="commercial-evidence-item"><div><strong>${escapeHtml(item.value||'Candidate')}</strong><span>${escapeHtml(item.sourceLabel||'Source clause')} · ${escapeHtml(item.matchStrength||'Medium')} match · ${escapeHtml(item.verificationStatus||'Unverified')}</span></div><p>${escapeHtml(item.sourceExcerpt||'')}</p>${item.sourceClauseId?`<button type="button" class="link-btn" data-risk-clause-id="${escapeHtml(item.sourceClauseId)}">Open source clause</button>`:''}</article>`).join('')}</div></details>`;
}

function renderCommercialTermsSheet(){
  const t=extractCommercialTermsSummary();
  const sections=[
    ['Key dates & term', [['Parties', t.parties], ['Effective date', t.effectiveDate], ['Termination date', t.terminationDate||'Not detected'], ['Initial term', t.initialTerm], ['Renewal', t.renewal], ['Termination notice', t.terminationNotice], ['Confidentiality term', t.confidentialityTerm]]],
    ['Financial', [['Payment terms', t.paymentTerms], ['Liability cap', t.liabilityCap]]],
    ['Risk allocation', [['Indemnity scope', t.indemnityScope], ['IP ownership', t.ipOwnership], ['Data processing role', t.dataProcessingRole]]],
    ['Governance', [['Governing law', t.governingLaw], ['Dispute resolution', t.disputeResolution], ['Assignment restriction', t.assignmentRestriction]]],
    ['Other provisions', [['Force majeure', t.forceMajeure]]]
  ];
  return `<div class="tool-card compact"><h4>Deal terms sheet</h4><div class="mini">Machine-extracted candidates. Confirm, correct, ignore, or leave unverified after checking the source.</div><div class="deal-terms-sections">${sections.map(([title,rows])=>`<div class="deal-terms-section"><h5>${escapeHtml(title)}</h5><div class="deal-terms-grid">${rows.map(([label,value])=>{const evidence=getCommercialTermEvidence(label,value,t);const key=`commercial-${slugifyStatus(label)}`;const status=state.verificationByKey?.[key]||'unverified';return `<div class="deal-term-row"><span>${escapeHtml(label)}</span><strong class="${value==='Not detected'?'muted-detect':''}">${escapeHtml(value)}</strong><small>Source: ${escapeHtml(evidence.source)} • Match strength: ${escapeHtml(evidence.confidence)}</small>${evidence.excerpt?`<details class="term-evidence"><summary>Source excerpt</summary><p>${escapeHtml(evidence.excerpt)}</p></details>`:''}<label class="verification-control"><span class="sr-only">Verification status for ${escapeHtml(label)}</span><select data-verification-key="${escapeHtml(key)}"><option value="unverified" ${status==='unverified'?'selected':''}>Unverified</option><option value="confirmed" ${status==='confirmed'?'selected':''}>Confirmed</option><option value="corrected" ${status==='corrected'?'selected':''}>Corrected in source/work notes</option><option value="ignored" ${status==='ignored'?'selected':''}>Ignored</option></select></label></div>`;}).join('')}</div></div>`).join('')}</div>${renderCommercialEvidenceRegister('Indemnities detected — verify each source',t.indemnityEvidence)}${renderCommercialEvidenceRegister('Dispute forums detected — verify the operative structure',t.disputeEvidence)}</div>`;
}

/* -- Risk & Boilerplate -- */
function getClauseTypeLegalWeight(type){
const weights={
  'Liability':3,'Indemnity':3,'Data Protection':3,'Intellectual Property':3,
  'Confidentiality':2,'Termination':2,'Services':2,'Fees':2,'Audit':2,
  'Governing Law':1,'Dispute Resolution':1,'Payment Terms':2
};
return weights[type]||1;
}
function hasMissingFallbackForClause(clauseId){
  const pos=state.clausePositions?.[clauseId]||'';
  if(!['Seek amendment','Reject','Escalate'].includes(pos)) return false;
  const rec=String(state.clauseRecommendations?.[clauseId]||'').trim();
  const fb1=String(state.clauseFallbacks?.[clauseId]||'').trim();
  const ladder=state.clauseFallbackLadders?.[clauseId]||{};
  const fb2=String(ladder.fallback2||'').trim();
  const walk=String(ladder.walkAway||'').trim();
  return !(rec||fb1||fb2||walk);
}
function isDefinitionOnlyClause(clause){
const text=`${clause?.heading||''} ${clause?.body||''}`;
const definitionSignals=(text.match(/\b(?:means|shall mean|has the meaning|referred to as|includes)\b/gi)||[]).length;
const operative=text.replace(/\bshall\s+mean\b/gi,'means');
return definitionSignals>0&&!/\b(?:shall|must|will|undertakes? to|agrees? to|is required to|indemnif|liable|pay(?:ment)?|terminate|warrant)\b/i.test(operative);
}
function calculateClauseLegalRisk(clause){
const definitionOnly=isDefinitionOnlyClause(clause);
const baseWeight=definitionOnly?0:getClauseTypeLegalWeight(clause.type||'General');
let s=baseWeight;
if((state.issues.commercialDeviations||[]).some(i=>i.clauseId===clause.id&&i.type==='Commercial deviation'))s+=1;
if(state.issues.survivalClauses?.some(i=>i.clauseId===clause.id)&&/termination|liability|confidential|data/i.test(String(clause.type||'')))s+=1;
const intel=definitionOnly?null:evaluateClauseIntelligence(clause);
if(intel){if((intel.missingProtections||[]).length>=2)s+=1; if(intel.confidence==='High')s+=1; if(intel.likelyPushback==='High')s+=1;}
const calculated=s>=7?'High':s>=4?'Medium':'Low';
const text=`${clause.heading||''} ${clause.body||''}`;
const floor=typeof ANALYSIS_CORE.objectiveRiskFloor==='function'?ANALYSIS_CORE.objectiveRiskFloor(text):'';
if(floor==='High')return 'High';
const confidenceAdjusted=clause.classificationConfidence==='Low'&&calculated==='High'?'Medium':calculated;
if(floor==='Medium'&&confidenceAdjusted==='Low')return 'Medium';
return confidenceAdjusted;
}
function calculateClauseReviewPriority(clause){
let s=0;
const pos=state.clausePositions?.[clause.id]||'';
const review=state.clauseReviewStatus?.[clause.id]||'';
if(!review||review==='Not reviewed')s+=2;
else if(review==='In review')s+=1;
if(review==='Escalated')s+=3;
if(pos==='Escalate'||pos==='Reject')s+=2;
else if(pos==='Seek amendment')s+=1;
if(state.issues.crossReferenceBreaks.filter(i=>i.clauseId===clause.id).length)s+=2;
if(state.issues.duplicateDefinitions.filter(i=>i.firstClauseId===clause.id||i.secondClauseId===clause.id).length)s+=1;
if(state.issues.undefinedCapitalizedTerms.filter(i=>(clause.body||'').includes(i.term)).length)s+=1;
if((state.clauseTags?.[clause.id]||[]).length)s+=1;
if(hasMissingFallbackForClause(clause.id))s+=2;
const playbookMatch=getActivePlaybookPackage()?getPlaybookCandidates(clause)[0]:null;
if(playbookMatch?.deviations?.length)s+=playbookMatch.deviations.length>=2?2:1;
const roleAdjustment=getRoleRiskAdjustment(clause.type||'General');
if(roleAdjustment>0)s+=roleAdjustment;
return s>=6?'High':s>=3?'Medium':'Low';
}
function calculateClauseRiskCategories(clause){
const body=`${clause.heading||''} ${clause.body||''}`.toLowerCase();
const cats=[];
if(/liability|fees?|payment|invoice|charges|tax|indemn/.test(body))cats.push('Financial');
if(/intellectual|ip|license|ownership|confidential|termination|warranty|governing law|indemn/.test(body))cats.push('Legal');
if(/services|service levels?|sla|support|milestone|deliverables|transition|audit|records/.test(body))cats.push('Operational');
if(/data|privacy|personal data|processor|controller|security|compliance|breach|transfer/.test(body))cats.push('Regulatory');
return [...new Set(cats)].slice(0,3);
}

function calculateClauseRisk(clause){ return calculateClauseLegalRisk(clause); }
function getDocumentRiskDisplayLabel(){const role=String(state.documentMeta?.matter?.role||'Neutral');return role==='Neutral'?`Provisional ${state.documentRisk||'Low'} · role unconfirmed`:(state.documentRisk||'Low');}
function calculateAllRiskScores(){
const out={}, pri={}, cats={}, nar={}, bp=boilerplateScoresDirty?{}:{...(state.clauseBoilerplateScores||{})};
state.clauses.forEach(c=>{
  if(boilerplateScoresDirty||!(c.id in bp))bp[c.id]=computeClauseBoilerplateScore(c);
});
state.clauses.forEach(c=>{
  out[c.id]=calculateClauseLegalRisk(c);
  pri[c.id]=calculateClauseReviewPriority(c);
  cats[c.id]=calculateClauseRiskCategories(c);
  nar[c.id]=buildClauseRiskNarrative(c);
});
state.clauseRiskScores=out;
state.reviewPriorityScores=pri;
state.clauseRiskCategories=cats;
state.clauseRiskNarratives=nar;
state.clauseBoilerplateScores=bp;
boilerplateScoresDirty=false;
const h=Object.values(out).filter(v=>v==='High').length;
const m=Object.values(out).filter(v=>v==='Medium').length;
state.documentRisk=typeof WORKFLOW_CORE.aggregateDocumentRisk==='function'?WORKFLOW_CORE.aggregateDocumentRisk(out,state.clauses):(h>=2?'High':(h||m?'Medium':'Low'));
state.riskDistribution=typeof WORKFLOW_CORE.riskDistribution==='function'?WORKFLOW_CORE.riskDistribution(out,state.clauses):{High:h,Medium:m,Low:Object.values(out).filter(v=>v==='Low').length,Unverified:0,total:Object.keys(out).length};
const ph=Object.values(pri).filter(v=>v==='High').length;
const pm=Object.values(pri).filter(v=>v==='Medium').length;
state.documentReviewPriority=ph?'High':pm?'Medium':'Low';
}
function buildClauseRiskNarrative(clause){
const reasons=[];
const typeWeight=getClauseTypeLegalWeight(clause.type||'General');
const commercialDeviation=(state.issues.commercialDeviations||[]).filter(i=>i.clauseId===clause.id&&i.type==='Commercial deviation').length;
if(!isDefinitionOnlyClause(clause)&&typeWeight>=3)reasons.push({text:`High-exposure clause type: ${clause.type||'General'}`,priority:1});
else if(!isDefinitionOnlyClause(clause)&&typeWeight===2)reasons.push({text:`Sensitive clause type: ${clause.type||'General'}`,priority:2});
if(commercialDeviation)reasons.push({text:`${commercialDeviation} commercial deviation${commercialDeviation===1?'':'s'}`,priority:2});
if((state.issues?.subjectiveStandards||[]).some(i=>i.clauseId===clause.id&&i.severity!=='Low'))reasons.push({text:'Material counterparty-controlled or subjective standard',priority:1});
if((state.issues?.asymmetries||[]).some(i=>i.clauseId===clause.id))reasons.push({text:'Material one-way contractual right; confirm reciprocity',priority:1});
const floor=typeof ANALYSIS_CORE.objectiveRiskFloor==='function'?ANALYSIS_CORE.objectiveRiskFloor(`${clause.heading||''} ${clause.body||''}`):'';if(floor)reasons.push({text:`Objective structural floor: ${floor}`,priority:1});
return reasons.sort((a,b)=>a.priority-b.priority);
}

/* -- Similarity/Boilerplate -- */
function normalizeForSimilarity(t){return String(t||'').toLowerCase().split(/[^a-z0-9]+/).map(v=>v.trim()).filter(v=>v.length>1&&!SIMILARITY_STOPWORDS.has(v));}
function ngramTokens(t,n){const out=[];for(let i=0;i<=t.length-n;i++)out.push(t.slice(i,i+n).join(' '));return out;}
function calculateSimilarity(a,b,type='General'){
const ta=normalizeForSimilarity(a);const tb=normalizeForSimilarity(b);if(!ta.length||!tb.length)return 0;
const fa=new Set([...ta,...ngramTokens(ta,2),...ngramTokens(ta,3)]);const fb=new Set([...tb,...ngramTokens(tb,2),...ngramTokens(tb,3)]);
const kw=CLAUSE_TYPE_KEYWORDS[type]||[];let iw=0,uw=0;const union=new Set([...fa,...fb]);
union.forEach(t=>{const w=kw.some(k=>t.includes(k))?2.5:1;if(fa.has(t)&&fb.has(t))iw+=w;uw+=w;});
return uw?iw/uw:0;
}
function classifyBoilerplateScore(s){if(s==null)return '';return s>=0.85?'standard':s>=0.5?'partial':'deviates';}
function scoreLabel(s){if(s==null)return '';return s>=0.85?'Standard':s>=0.5?'Partial':'Deviates';}
function getBestLibraryMatchForClause(clause){const ms=(state.clauseLibrary||[]).filter(i=>(i.type||'General')===(clause.type||'General'));if(!ms.length)return null;let best=null;ms.forEach(i=>{const c=(i.text||i.standardPosition||i.fallbackPosition||i.negotiatingPoints||'');if(!c.trim())return;const s=calculateSimilarity(clause.body||'',c,clause.type||'General');if(!best||s>best.score)best={item:i,score:s};});return best;}
function classifyPlaybookGap(s){if(s==null)return 'none';return s>=0.75?'standard':s>=0.4?'partial':'deviation';}
function playbookGapLabel(s){if(s==null)return '';return s>=0.75?'Standard alignment':s>=0.4?'Partial deviation':'Material deviation';}
function getPlaybookMatchForClause(clause){const m=getBestLibraryMatchForClause(clause);if(!m)return null;const i=m.item;if(!((i.standardPosition||'').trim()||(i.fallbackPosition||'').trim()||(i.negotiatingPoints||'').trim()))return null;return{item:i,score:m.score,gap:classifyPlaybookGap(m.score)};}
function computeClauseBoilerplateScore(clause){const m=getBestLibraryMatchForClause(clause);return m?m.score:null;}
function getPlaybookGapClassForClause(cid){const s=state.clauseBoilerplateScores?.[cid];if(s==null)return '';const m=classifyBoilerplateScore(s);return m==='deviates'?'deviation':m;}

function recordClauseOpenTime(clauseId) {
  state.clauseOpenedAt = null;state._activeTimerClauseId = null;
}
function flushClauseTime() {
  state.clauseOpenedAt = null;state._activeTimerClauseId = null;
}
function toggleExecutionMode() {
  if (!state.executionMode) {
    const dateStr = window.prompt('Enter the execution date (or leave blank for today):', new Date().toISOString().slice(0, 10));
    if (dateStr === null) return;
    state.executionMode = true;
    state.executedAt = dateStr || new Date().toISOString().slice(0, 10);
    setWorkflowStage('close');
    showToast('Contract marked as executed — obligation tracking mode active', 'info');
  } else {
    if (!window.confirm('Return to review mode? Execution status will be cleared.')) return;
    state.executionMode = false;
    state.executedAt = '';
    showToast('Returned to review mode', 'info');
  }
  scheduleAutosave();
  renderAll();
}
function buildUpcomingObligationsCard() {
  const confirmed=(state.obligations||[]).filter(item=>state.obligationVerification?.[item.id]==='confirmed');
  if (!state.executionMode || !confirmed.length) return '';
  const now = new Date();
  const parseDeadline = (str) => {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };
  const confirmedClauseIds=new Set(confirmed.map(item=>item.clauseId));
  const withDates = (state.deadlines||[]).filter(d=>confirmedClauseIds.has(d.clauseId)).map(d => {
      const parsed = parseDeadline(d.expression);
      if (!parsed) return null;
      const daysUntil = Math.round((parsed - now) / (1000 * 60 * 60 * 24));
      return { ...d, parsed, daysUntil };
    }).filter(Boolean).sort((a, b) => a.daysUntil - b.daysUntil);
  const overdue = withDates.filter(d => d.daysUntil < 0);
  const soon = withDates.filter(d => d.daysUntil >= 0 && d.daysUntil <= 30);
  const upcoming = withDates.filter(d => d.daysUntil > 30 && d.daysUntil <= 90);
  const renderGroup = (label, items, cls) => {
    if (!items.length) return '';
    return `<div class="panel-subhead ${cls}">${escapeHtml(label)} (${items.length})</div>` +
      items.map(d => `<div class="tool-card compact ${cls}"><div class="mini"><strong>${escapeHtml(d.expression)}</strong></div><div class="mini">${escapeHtml(d.clauseLabel)} ${d.daysUntil < 0 ? `• ${Math.abs(d.daysUntil)} days overdue` : `• in ${d.daysUntil} days`}</div></div>`).join('');
  };
  const noDateObligations = confirmed.filter(o => !o.deadline).length;
  return `<div class="tool-card compact execution-obligations-card"><div class="panel-subhead">📋 Confirmed obligations</div><div class="mini" style="margin-bottom:6px">Executed: ${escapeHtml(state.executedAt)} • ${confirmed.length} lawyer-confirmed obligation${confirmed.length===1?'':'s'}. Unconfirmed scan results stay outside execution tracking.</div>${renderGroup('Overdue', overdue, 'high')}${renderGroup('Due within 30 days', soon, 'medium')}${renderGroup('Due in 31–90 days', upcoming, 'info')}${!overdue.length && !soon.length && !upcoming.length ? '<div class="mini">No confirmed time-bound obligations with parseable dates.</div>' : ''}${noDateObligations ? `<div class="mini" style="margin-top:6px">${noDateObligations} confirmed obligation${noDateObligations === 1 ? '' : 's'} ha${noDateObligations===1?'s':'ve'} no specific date — review manually.</div>` : ''}</div>`;
}
async function handlePlaybookImport(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  if(f.size>MAX_PLAYBOOK_FILE_BYTES){showToast('Playbook package exceeds the 5 MB local import limit.','error');e.target.value='';return;}
  f.text().then(async t => {
    const data = JSON.parse(t);
    const playbookPackage=typeof PLAYBOOK_CORE.normalizePackage==='function'?PLAYBOOK_CORE.normalizePackage(data):null;
    if(playbookPackage){
      validatePlaybookPackageBounds(playbookPackage);
      const canonical=typeof PLAYBOOK_CORE.canonicalPackageContent==='function'?PLAYBOOK_CORE.canonicalPackageContent(playbookPackage):JSON.stringify(playbookPackage);
      const calculatedHash=await sha256Hex(canonical);
      if(!calculatedHash)throw new Error('This browser cannot verify the playbook package hash.');
      if(playbookPackage.contentHash&&playbookPackage.contentHash!==calculatedHash)throw new Error('Playbook content does not match its declared package hash.');
      playbookPackage.contentHash=calculatedHash;
      const existing=(state.playbookPackages||[]).find(pkg=>pkg.packageId===playbookPackage.packageId&&pkg.version===playbookPackage.version);
      if(existing&&existing.contentHash&&existing.contentHash!==calculatedHash)throw new Error('A different package already uses this ID and version. Import it under a new version.');
      state.playbookPackages=mergePlaybookPackages(state.playbookPackages,[playbookPackage]);
      saveClauseLibraryState();renderPlaybookPackageSelect();
      if(els.playbookImportStatus)els.playbookImportStatus.textContent=`✓ ${playbookPackage.name||playbookPackage.packageId} v${playbookPackage.version} imported`;
      showToast('Local playbook package imported. Activate it explicitly for a matching matter.','info');
      if(els.playbookImportInput)els.playbookImportInput.value='';
      return;
    }
    const entries = Array.isArray(data) ? data : (Array.isArray(data.library) ? data.library : (Array.isArray(data.entries) ? data.entries : null));
    if (!entries) throw new Error('Invalid playbook format');
    const norm = entries.map(normalizeLibraryEntry).filter(Boolean);
    if (!norm.length) throw new Error('No valid entries found');
    state.clauseLibrary = mergeClauseLibraryEntries(state.clauseLibrary, norm);
    boilerplateScoresDirty = true;
    saveClauseLibraryState();
    const status = els.playbookImportStatus;
    if (status) status.textContent = `✓ ${norm.length} playbook entries imported`;
    showToast(`Firm playbook imported — ${norm.length} entries added to your library`, 'info');
    if (els.playbookImportInput) els.playbookImportInput.value = '';
  }).catch(err => {
    console.warn(err);
    showToast(err?.message||'Could not import playbook. Check the file is valid JSON.', 'error');
    if (els.playbookImportInput) els.playbookImportInput.value = '';
  });
}

function validatePlaybookPackageBounds(pkg){
  if(!pkg||!Array.isArray(pkg.modules))throw new Error('Invalid playbook package schema.');
  if(pkg.modules.length>MAX_PLAYBOOK_MODULES)throw new Error(`Playbook contains more than ${MAX_PLAYBOOK_MODULES} modules.`);
  const checkField=(value,label)=>{if(String(value??'').length>MAX_PLAYBOOK_FIELD_LENGTH)throw new Error(`${label} exceeds the ${MAX_PLAYBOOK_FIELD_LENGTH.toLocaleString()} character field limit.`);};
  checkField(pkg.name,'Package name');checkField(pkg.status,'Package status');
  if((pkg.sourceModuleRegistry||[]).length>400)throw new Error('Playbook source registry exceeds 400 entries.');
  (pkg.sourceModuleRegistry||[]).forEach((entry,index)=>{checkField(entry?.id,`Source registry ${index+1} id`);checkField(entry?.title,`Source registry ${index+1} title`);});
  pkg.modules.forEach((module,index)=>{
    ['id','title','standardPosition','whyItMatters'].forEach(key=>checkField(module?.[key],`Module ${index+1} ${key}`));
    const rules=[...(module?.applicability?.requiredAny||[]),...(module?.applicability?.excludeAny||[]),...(module?.applicability?.issueRules||[]).flatMap(rule=>rule?.any||[])];
    if(rules.length>MAX_PLAYBOOK_RULES_PER_MODULE)throw new Error(`Module ${module?.id||index+1} exceeds ${MAX_PLAYBOOK_RULES_PER_MODULE} applicability rules.`);
    rules.forEach((rule,ruleIndex)=>checkField(rule,`Module ${module?.id||index+1} rule ${ruleIndex+1}`));
    (module?.checks||[]).forEach((value,itemIndex)=>checkField(value,`Module ${module?.id||index+1} check ${itemIndex+1}`));
    if((module?.decisionTable||[]).length>50)throw new Error(`Module ${module?.id||index+1} exceeds 50 decision-table rows.`);
    (module?.decisionTable||[]).forEach((row,itemIndex)=>{checkField(row?.paper,`Module ${module?.id||index+1} decision ${itemIndex+1} paper`);checkField(row?.decision,`Module ${module?.id||index+1} decision ${itemIndex+1} response`);checkField(row?.reason,`Module ${module?.id||index+1} decision ${itemIndex+1} reason`);});
    (module?.fallbackLadder||[]).forEach((rung,itemIndex)=>{checkField(rung?.position,`Module ${module?.id||index+1} fallback ${itemIndex+1}`);checkField(rung?.approval,`Module ${module?.id||index+1} fallback ${itemIndex+1} approval`);});
    ['sampleLanguage','redlineMoves','pushback','reviewChecklist','dealOverlays','supplements','sourceAnchors'].forEach(key=>{
      const values=Array.isArray(module?.[key])?module[key]:[module?.[key]];
      if(values.length>100)throw new Error(`Module ${module?.id||index+1} ${key} exceeds 100 entries.`);
      values.forEach((value,itemIndex)=>checkField(typeof value==='object'?JSON.stringify(value):value,`Module ${module?.id||index+1} ${key} ${itemIndex+1}`));
    });
  });
}

function mergePlaybookPackages(existing,incoming){
  const map=new Map();
  [...(existing||[]),...(incoming||[])].forEach(pkg=>{const normalized=typeof PLAYBOOK_CORE.normalizePackage==='function'?PLAYBOOK_CORE.normalizePackage(pkg):pkg;if(!normalized?.packageId||!normalized?.version)return;const key=`${normalized.packageId}@${normalized.version}`;const prior=map.get(key);if(prior&&prior.contentHash&&normalized.contentHash&&prior.contentHash!==normalized.contentHash)return;map.set(key,normalized);});
  return [...map.values()].sort((a,b)=>String(a.name||a.packageId).localeCompare(String(b.name||b.packageId))||String(b.version).localeCompare(String(a.version)));
}
function ensureBuiltinPlaybooks(){state.playbookPackages=mergePlaybookPackages(state.playbookPackages,PLAYBOOK_CORE.BUILTIN_PACKAGES||[]);}
function renderPlaybookPackageSelect(){
  ensureBuiltinPlaybooks();if(!els.playbookPackageSelect)return;
  const selected=state.activePlaybookProfile?.packageId?`${state.activePlaybookProfile.packageId}@${state.activePlaybookProfile.version}`:'';
  els.playbookPackageSelect.innerHTML=`<option value="">No playbook</option>${state.playbookPackages.map(pkg=>`<option value="${escapeHtml(`${pkg.packageId}@${pkg.version}`)}" ${selected===`${pkg.packageId}@${pkg.version}`?'selected':''}>${escapeHtml(pkg.name||pkg.packageId)} · v${escapeHtml(pkg.version)} · ${escapeHtml(pkg.role||'Any role')}</option>`).join('')}`;
}
function activateSelectedPlaybook(){
  const key=els.playbookPackageSelect?.value||'';
  activatePlaybookKey(key);
}
function activatePlaybookKey(key){
  if(!key){state.activePlaybookProfile={packageId:'',version:'',role:'',activatedAt:''};if(els.playbookImportStatus)els.playbookImportStatus.textContent='No playbook active';scheduleAutosave({reason:'critical'});renderContextPanel();return;}
  const pkg=state.playbookPackages.find(item=>`${item.packageId}@${item.version}`===key);if(!pkg)return;
  const role=String((state.clauses.length?state.documentMeta?.matter?.role:'')||els.intakeRoleSelectQuick?.value||els.intakeRoleSelect?.value||'Neutral');
  if(pkg.role&&role!==pkg.role){showToast(`This package is for ${pkg.role} matters. Confirm that role before activation.`,'warn');return;}
  const matterJurisdiction=String(state.documentMeta?.matter?.jurisdiction||els.intakeJurisdictionSelect?.value||'').trim();const anchor=String(pkg.jurisdictionAnchor||'').trim();
  if(matterJurisdiction&&anchor&&!/global|multi|not specified/i.test(anchor)&&!anchor.toLowerCase().includes(matterJurisdiction.toLowerCase())&&!matterJurisdiction.toLowerCase().includes(anchor.toLowerCase())){if(!window.confirm(`Jurisdiction check\n\nThis matter is tagged ${matterJurisdiction}, while the playbook is anchored to ${anchor}. Activate it anyway and preserve this mismatch in the review record?`))return;state.documentMeta.warnings=[...new Set([...(state.documentMeta.warnings||[]),`Playbook jurisdiction mismatch accepted: matter ${matterJurisdiction}; package ${anchor}.`])];}
  state.activePlaybookProfile={packageId:pkg.packageId,version:pkg.version,role:pkg.role||role,activatedAt:new Date().toISOString(),sourceFingerprint:pkg.sourceFingerprint||'',contentHash:pkg.contentHash||''};
  if(els.playbookImportStatus)els.playbookImportStatus.textContent=`Active: ${pkg.name||pkg.packageId} v${pkg.version}`;
  calculateAllRiskScores();scheduleAutosave({reason:'critical'});renderContextPanel();renderClauseView();renderClauseList();showToast('Playbook activated for this matter. Suggestions still require confirmation.','info');
}
function getActivePlaybookPackage(){const profile=state.activePlaybookProfile||{};return(state.playbookPackages||[]).find(pkg=>pkg.packageId===profile.packageId&&pkg.version===profile.version)||null;}
function getPlaybookCandidates(clause){const pkg=getActivePlaybookPackage();return typeof PLAYBOOK_CORE.candidateModules==='function'?PLAYBOOK_CORE.candidateModules(pkg,clause,state.documentMeta?.matter||readLandingIntake()):[];}
function getSourcePlaybookCandidates(clause){const pkg=getActivePlaybookPackage();return typeof PLAYBOOK_CORE.candidateSourceModules==='function'?PLAYBOOK_CORE.candidateSourceModules(pkg,clause,state.documentMeta?.matter||readLandingIntake()):[];}
function getClausePlaybookSelection(cid){return state.clausePlaybookState?.[cid]||{};}
function freezePlaybookProvenance(pkg,module,rung,status){return{packageId:pkg.packageId,packageName:pkg.name||pkg.packageId,version:pkg.version,packageContentHash:pkg.contentHash||'',sourceFingerprint:pkg.sourceFingerprint||'',moduleId:module.id,moduleTitle:module.title,moduleRevision:module.revision||pkg.version,standardPosition:module.standardPosition||'',selectedRung:rung?.rung||'',rungLabel:rung?.label||'',rungPosition:rung?.position||'',status,recordedAt:new Date().toISOString()};}
function getPlaybookProvenance(cid){const selection=getClausePlaybookSelection(cid);const frozen=selection.provenance;if(frozen?.moduleId)return `${frozen.packageName||frozen.packageId} v${frozen.version} · ${frozen.moduleId}${frozen.selectedRung?` · ${frozen.selectedRung}`:''} · ${frozen.status||selection.status||'confirmed'} · package ${String(frozen.packageContentHash||'unhashed').slice(0,12)}`;const pkg=getActivePlaybookPackage();if(!selection.moduleId||!pkg)return'';return `${pkg.name||pkg.packageId} v${pkg.version} · ${selection.moduleId}${selection.selectedRung?` · ${selection.selectedRung}`:''} · ${selection.status||'suggested'}`;}
function getCompatibleInactivePlaybook(){ensureBuiltinPlaybooks();const role=String(state.documentMeta?.matter?.role||'Neutral');return(state.playbookPackages||[]).find(pkg=>!pkg.role||role==='Neutral'||pkg.role===role)||null;}
function renderClausePlaybookStatus(clause){
  const pkg=getActivePlaybookPackage();
  if(!pkg){const available=getCompatibleInactivePlaybook();if(!available)return'<div class="clause-playbook-status muted">Playbook: no package available</div>';const role=String(state.documentMeta?.matter?.role||'Neutral');const key=`${available.packageId}@${available.version}`;return `<div class="clause-playbook-status muted"><span>Playbook inactive · ${escapeHtml(available.name||available.packageId)} available${role==='Neutral'?' after confirming your perspective':''}</span>${role!=='Neutral'?`<button type="button" class="link-btn" data-action="activate-compatible-playbook" data-playbook-key="${escapeHtml(key)}">Activate</button>`:''}</div>`;}
  const saved=getClausePlaybookSelection(clause.id);const candidates=getPlaybookCandidates(clause);const top=candidates[0];
  if(saved.status==='ignored')return `<div class="clause-playbook-status muted"><span>Playbook: ignored for this clause</span><button type="button" class="link-btn" data-action="open-playbook-guidance">Check guidance</button></div>`;
  if(!top){const sourceCandidate=getSourcePlaybookCandidates(clause)[0];if(sourceCandidate)return `<div class="clause-playbook-status has-deviation"><span>Source playbook: ${escapeHtml(sourceCandidate.id)} ${escapeHtml(sourceCandidate.title)} may apply · detailed operational guidance not loaded</span><button type="button" class="link-btn" data-action="open-playbook-guidance" data-module-id="${escapeHtml(sourceCandidate.id)}">Review source route</button></div>`;return `<div class="clause-playbook-status muted"><span>Playbook: no automatic match</span><button type="button" class="link-btn" data-action="open-playbook-guidance">Check guidance</button></div>`;}
  const deviations=top.deviations?.length||0;return `<div class="clause-playbook-status ${deviations?'has-deviation':''}"><span>Playbook: ${escapeHtml(top.module.id)} ${escapeHtml(top.module.title)} · ${escapeHtml(top.matchStrength)}${deviations?` · ${deviations} deviation prompt${deviations===1?'':'s'}`:''}</span><button type="button" class="link-btn" data-action="open-playbook-guidance">View guidance</button></div>`;
}
function renderContextualPlaybookCard(clause){
  if(isMobileViewport())return'';
  const pkg=getActivePlaybookPackage();if(!pkg)return'';
  const match=getPlaybookCandidates(clause)[0];if(!match||match.matchStrength!=='Strong'||!match.deviations?.length)return'';
  return `<section class="playbook-inline-alert"><div><span class="mini-label">Playbook alert · verify</span><strong>${escapeHtml(match.module.id)} · ${escapeHtml(match.module.title)}</strong><p>${match.deviations.slice(0,2).map(item=>escapeHtml(item.label)).join(' · ')}</p></div><button class="btn btn-xs" type="button" data-action="open-playbook-guidance">Review guidance →</button></section>`;
}
function renderPlaybookLanguageDiff(module,clause){
  const sample=String(module?.sampleLanguage||'').trim();const current=String(clause?.body||'').trim();const decision=getClauseDecision(clause?.id);const selected=getClausePlaybookSelection(clause?.id);const selectedRung=(module?.fallbackLadder||[]).find(item=>item.rung===selected.selectedRung);const needsApproval=!!selectedRung?.approvalRequired;const approvalReady=!needsApproval||decision.approvalStatus==='Approved';const conditionsReady=!!String(decision.rationale||'').trim()&&!!String(decision.fallback||state.clauseFallbacks?.[clause?.id]||'').trim();const posture=['reject','escalate'].includes(decision.type)||selectedRung?.escalationOnly?'Protect':needsApproval?'Pre-clear':decision.type==='accept'?'Can trade':'Review before trade';const linked=[...(module?.interactionPoints||[]).map(item=>item.moduleId),...(module?.relatedModules||[])].filter(Boolean);const guardrail=`<section class="playbook-ambient-guardrail"><div class="mini-label">A-00 ambient trade guardrail</div><strong>${escapeHtml(posture)}</strong><div class="mini">Conditions ${conditionsReady?'captured':'open'} · Approval ${approvalReady?'ready':'required'}${linked.length?` · Recheck ${linked.slice(0,4).map(escapeHtml).join(', ')}`:''}</div>${needsApproval&&!approvalReady?`<p class="mini">This rung is drafting-prepared, not available to offer. Required: ${escapeHtml(selectedRung.approver||'named approval')}.</p>`:''}</section>`;
  if(!sample||!current)return guardrail;
  const html=wordDiffTokens(current,sample).map(part=>part.type==='equal'?escapeHtml(part.text):part.type==='delete'?`<del>${escapeHtml(part.text)}</del>`:`<ins>${escapeHtml(part.text)}</ins>`).join('');
  return `${guardrail}<details class="playbook-language-diff"><summary>Drafting aid · compare with playbook sample</summary><div class="mini">Removed from the current clause is struck through; playbook sample wording is highlighted. This is ready to copy as a starting clause, not an automatic or tracked redline.</div><div class="redline-output">${html}</div><div class="card-actions"><button class="btn btn-xs" type="button" data-guidance-copy-sample data-module-id="${escapeHtml(module.id)}">Copy suggested clause</button></div></details>`;
}
function renderPlaybookGuidanceModule(pkg,module,match,clause){
  const decisionRowId=match?.deviations?.map(item=>item.decisionRowId).find(Boolean);const decisionRow=(module.decisionTable||[]).find(row=>row.id===decisionRowId)||null;
  const checklist=(module.checklist||[]).filter(item=>!item.appliesWhen||item.appliesWhen==='module-relevant');
  const related=(module.interactionPoints?.length?module.interactionPoints:(module.relatedModules||[]).map(moduleId=>({moduleId,reason:''}))).filter(item=>pkg.modules.some(candidate=>candidate.id===item.moduleId));
  return `<section class="tool-card compact playbook-guidance-module"><div class="guided-card-head"><div><div class="mini-label">${escapeHtml(match?.matchStrength||'Manual selection')} · lawyer verification required</div><h3>${escapeHtml(module.id)} · ${escapeHtml(module.title)}</h3></div><span class="clause-pill">${escapeHtml(module.orientation?.tier||'Core')}</span></div><div class="playbook-at-glance"><div><span>House principle</span><strong>${escapeHtml(module.orientation?.corePrinciple||module.standardPosition||'')}</strong></div><div><span>Typical landing zone</span><strong>${escapeHtml(module.orientation?.typicalLandingZone||module.standardPosition||'')}</strong></div><div><span>Negotiation heat</span><strong>${escapeHtml(module.orientation?.negotiationHeat||'Verify')}</strong></div></div>${match?.reasons?.length?`<p class="mini"><strong>Why it may apply:</strong> ${match.reasons.map(escapeHtml).join(' · ')}</p>`:'<p class="mini">Selected manually. Automatic silence is not a conclusion that the module is irrelevant.</p>'}${match?.deviations?.length?`<div class="playbook-deviation"><strong>Issues detected</strong><ul>${match.deviations.map(item=>`<li>${escapeHtml(item.label)}</li>`).join('')}</ul></div>`:''}${decisionRow?`<div class="playbook-decision-row"><span>Matched decision row · ${escapeHtml(decisionRow.id)}</span><strong>${escapeHtml(decisionRow.recommendedAction||'Review')}</strong><p>${escapeHtml(decisionRow.reason||'')}</p><small>Target: ${escapeHtml(decisionRow.targetRung||'rung-1')}</small></div>`:match?.deviations?.length?'<p class="mini">No authored decision row is mapped to this signal. Review manually; Cockpit will not substitute an unrelated row.</p>':''}<p><strong>Supplier standard:</strong> ${escapeHtml(module.standardPosition||'')}</p><div class="playbook-quick-checks"><strong>Quick checklist</strong><ul>${checklist.slice(0,4).map(item=>`<li>${escapeHtml(item.text||item)}</li>`).join('')}</ul></div>${related.length?`<div class="playbook-related"><strong>Connected guidance</strong><div class="card-actions">${related.map(item=>`<button type="button" class="btn btn-xs" data-guidance-related-module="${escapeHtml(item.moduleId)}" title="${escapeHtml(item.reason||'Open related module')}">${escapeHtml(item.moduleId)}</button>`).join('')}</div></div>`:''}${renderPlaybookLanguageDiff(module,clause)}<details class="playbook-full-module"><summary>Open full module guidance</summary><div class="playbook-rungs">${(module.fallbackLadder||[]).map(rung=>`<div class="playbook-rung ${rung.escalationOnly?'is-guardrail':''}"><strong>${escapeHtml(rung.label||rung.rung)}</strong><span>${escapeHtml(rung.position||'')}</span><small>${escapeHtml(rung.knowledgeStatus==='source-structured'?'Structured from source playbook':'Operational source summary')}</small>${rung.approvalRequired?`<small>Approval: ${escapeHtml(rung.approver||'Required')}</small>`:''}<div class="card-actions">${rung.escalationOnly?`<button class="btn btn-xs" type="button" data-guidance-preview-decision data-clause-id="${escapeHtml(clause.id)}" data-module-id="${escapeHtml(module.id)}" data-rung="${escapeHtml(rung.rung)}">Preview escalation</button>`:`<button class="btn btn-xs" type="button" data-guidance-apply-rung data-clause-id="${escapeHtml(clause.id)}" data-module-id="${escapeHtml(module.id)}" data-rung="${escapeHtml(rung.rung)}">Apply drafting only</button><button class="btn btn-xs" type="button" data-guidance-preview-decision data-clause-id="${escapeHtml(clause.id)}" data-module-id="${escapeHtml(module.id)}" data-rung="${escapeHtml(rung.rung)}">Preview decision action</button>`}</div></div>`).join('')}</div>${module.sampleLanguage?`<div class="playbook-reference-block"><strong>Sample language</strong><p>${escapeHtml(module.sampleLanguage)}</p></div>`:''}${module.redlineMoves?.length?`<div class="playbook-reference-block"><strong>Redline moves</strong><ul>${module.redlineMoves.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`:''}${module.pushback?`<div class="playbook-reference-block"><strong>Conversation</strong><p><em>Soft:</em> ${escapeHtml(module.pushback.soft||'')}</p><p><em>Strong:</em> ${escapeHtml(module.pushback.strong||'')}</p></div>`:''}<div class="playbook-reference-block"><strong>Full checklist</strong><ul>${checklist.map(item=>`<li>${escapeHtml(item.text||item)}</li>`).join('')}</ul></div>${module.dealOverlays?.length?`<p class="mini"><strong>Deal overlays:</strong> ${module.dealOverlays.map(escapeHtml).join(', ')}</p>`:''}${module.supplements?.length?`<p class="mini"><strong>Supplements:</strong> ${module.supplements.map(escapeHtml).join(', ')}</p>`:''}</details><div class="card-actions"><button class="link-btn" type="button" data-guidance-confirm data-clause-id="${escapeHtml(clause.id)}" data-module-id="${escapeHtml(module.id)}">Confirm this module</button></div><p class="mini">Source: ${escapeHtml(pkg.name||pkg.packageId)} v${escapeHtml(pkg.version)} · module revision ${escapeHtml(module.revision||pkg.version)} · ${escapeHtml((module.sourceAnchors||[]).join(' · '))} · ${escapeHtml(module.knowledgeStatus||'operational source summary')} · source ${escapeHtml(String(pkg.sourceFingerprint||'unavailable').slice(0,16))}…</p></section>`;
}
function openPlaybookGuidance(clauseId,moduleId=''){
  const clause=(state.clauses||[]).find(item=>item.id===clauseId);const pkg=getActivePlaybookPackage();
  if(!clause)return;if(!pkg){showToast('Activate a compatible playbook first.','warn');return;}
  const candidates=getPlaybookCandidates(clause);const sourceCandidates=getSourcePlaybookCandidates(clause);const requestedSource=sourceCandidates.find(item=>item.id===moduleId);const selected=pkg.modules.find(item=>item.id===moduleId)||(!requestedSource?candidates[0]?.module:null)||(!sourceCandidates.length?pkg.modules[0]:null);const match=candidates.find(item=>item.module.id===selected?.id);const sourceSelected=requestedSource||(!selected?sourceCandidates[0]:null);const operationalOptions=pkg.modules.map(module=>`<option value="${escapeHtml(module.id)}" ${module.id===selected?.id?'selected':''}>${escapeHtml(module.id)} · ${escapeHtml(module.title)}</option>`).join('');const sourceOptions=sourceCandidates.length?`<optgroup label="Source-indexed guidance · summary only">${sourceCandidates.map(module=>`<option value="${escapeHtml(module.id)}" ${module.id===sourceSelected?.id?'selected':''}>${escapeHtml(module.id)} · ${escapeHtml(module.title)}</option>`).join('')}</optgroup>`:'';const sourceNotice=sourceSelected?`<section class="tool-card compact playbook-source-notice"><div class="mini-label">Source playbook route · ${escapeHtml(sourceSelected.matchStrength||'Source signal')}</div><h3>${escapeHtml(sourceSelected.id)} · ${escapeHtml(sourceSelected.title)}</h3><p>Relevant source guidance appears to exist, but detailed operational content has not yet been loaded into this local package. Review the governing source module; Cockpit will not invent a position or fallback.</p>${sourceSelected.reasons?.length?`<p class="mini">${sourceSelected.reasons.map(escapeHtml).join(' · ')}</p>`:''}<p class="mini">Status: indexed, not operational · lawyer verification required</p></section>`:'';
  els.playbookGuidanceBody.innerHTML=`<div class="tool-card compact"><div class="mini-label">Source clause</div><strong>${escapeHtml(`${clause.number||''} ${clause.heading||''}`.trim())}</strong><p class="mini">${escapeHtml(ANALYSIS_CORE.excerpt?.(clause.body||'',420)||String(clause.body||'').slice(0,420))}</p></div><label class="playbook-module-picker"><span>Search or choose another module</span><select data-playbook-guidance-select>${operationalOptions}${sourceOptions}</select></label>${selected?renderPlaybookGuidanceModule(pkg,selected,match,clause):sourceNotice||'<p>No modules are available.</p>'}`;
  els.playbookGuidanceModal.dataset.clauseId=clauseId;openModal(els.playbookGuidanceModal);
}
function openPlaybookDecisionPreview(cid,moduleId,rungId){
  const pkg=getActivePlaybookPackage();const module=pkg?.modules?.find(item=>item.id===moduleId);const rung=module?.fallbackLadder?.find(item=>item.rung===rungId);if(!module||!rung)return;
  const current=getClauseDecision(cid);const proposedType=rung.recommendedDecision||'seek-amendment';pendingPlaybookDecisionPreview={cid,moduleId,rungId};
  els.playbookDecisionPreviewBody.innerHTML=`<div class="preview-diff-grid"><div class="tool-card compact"><div class="mini-label">Current</div><p><strong>Decision:</strong> ${escapeHtml(mapDecisionTypeToLegacyPosition(current.type)||'Not set')}</p><p><strong>Fallback:</strong> ${escapeHtml(current.fallback||'Not set')}</p><p><strong>Route:</strong> ${escapeHtml(current.route||'Not set')}</p></div><div class="tool-card compact"><div class="mini-label">Proposed from ${escapeHtml(module.id)} · ${escapeHtml(rung.label||rung.rung)}</div><p><strong>Decision:</strong> ${escapeHtml(mapDecisionTypeToLegacyPosition(proposedType))}</p><p><strong>Fallback:</strong> ${escapeHtml(rung.position||'')}</p><p><strong>Route:</strong> ${escapeHtml(proposedType==='escalate'?'Escalate to Leadership':(current.route||'Legal Only'))}</p></div></div><p class="mini">Applying records the package, module, rung and source fingerprint. Required decision fields remain visibly incomplete until you finish them.</p>`;
  openModal(els.playbookDecisionPreviewModal);
}
function setClausePlaybookModule(cid,moduleId,status){const pkg=getActivePlaybookPackage();const module=pkg?.modules?.find(item=>item.id===moduleId);if(!pkg||!module)return;state.clausePlaybookState[cid]={...(state.clausePlaybookState[cid]||{}),moduleId,status,provenance:freezePlaybookProvenance(pkg,module,null,status),updatedAt:new Date().toISOString()};logReviewAction(`playbook-${status}`,cid,{summary:getPlaybookProvenance(cid)});scheduleAutosave({reason:'critical'});renderClauseView();}
function applyPlaybookRung(cid,moduleId,rungId,applyDecision=false){
  const pkg=getActivePlaybookPackage();const module=pkg?.modules?.find(item=>item.id===moduleId);const rung=module?.fallbackLadder?.find(item=>item.rung===rungId);if(!rung)return;
  if(applyDecision){openPlaybookDecisionPreview(cid,moduleId,rungId);return;}
  commitPlaybookRung(cid,moduleId,rungId,false);
}
function commitPlaybookRung(cid,moduleId,rungId,applyDecision=false){
  const pkg=getActivePlaybookPackage();const module=pkg?.modules?.find(item=>item.id===moduleId);const rung=module?.fallbackLadder?.find(item=>item.rung===rungId);if(!rung)return;
  const current=String(state.clauseFallbacks?.[cid]||'').trim();if(current&&current!==rung.position&&!window.confirm('Replace the existing fallback with this playbook rung?'))return;
  state.clausePlaybookState[cid]={...(state.clausePlaybookState[cid]||{}),moduleId,status:'confirmed',selectedRung:rungId,provenance:freezePlaybookProvenance(pkg,module,rung,'confirmed'),updatedAt:new Date().toISOString()};state.clauseRecommendations[cid]=module.standardPosition||state.clauseRecommendations[cid]||'';state.clauseFallbacks[cid]=rung.position||'';const d=getClauseDecision(cid);if(applyDecision){const type=rung.recommendedDecision||'seek-amendment';setClauseDecision(cid,{type,fallback:rung.position||d.fallback,rationale:module.whyItMatters||d.rationale,route:type==='escalate'?'Escalate to Leadership':(d.route||'Legal Only'),includeInPack:true,includeInEscalation:type==='escalate'});syncDecisionToLegacyState(cid);}else if(['seek-amendment','reject'].includes(d.type))setClauseDecision(cid,{fallback:rung.position||d.fallback});const appliedDecision=getClauseDecision(cid);state.clausePlaybookState[cid].negotiationState={scenarioSelected:true,draftingPrepared:true,conditionsSatisfied:!!String(appliedDecision.rationale||'').trim(),approvalsObtained:!rung.approvalRequired||appliedDecision.approvalStatus==='Approved',availableToOffer:!rung.approvalRequired||appliedDecision.approvalStatus==='Approved',actuallyOffered:false,counterpartyResponse:'',finalLandingRung:''};logReviewAction(applyDecision?'playbook-rung-and-decision-applied':'playbook-rung-applied',cid,{summary:getPlaybookProvenance(cid)});onSubstantiveChange();
}

/* -- Review actions -- */
function logReviewAction(action,clauseId,details={}){state.reviewLog.push({id:`log-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,at:new Date().toISOString(),action,clauseId,details});if(state.reviewLog.length>MAX_REVIEW_LOG_ENTRIES)state.reviewLog=state.reviewLog.slice(-MAX_REVIEW_LOG_ENTRIES);}

function setClausePosition(cid,value){
invalidateClauseIntelligenceCache(cid);
const mapped=mapLegacyPositionToDecisionType(value||'');
const route=(state.clauseRoutingTags?.[cid]||[])[0]||'';
const fallback=state.clauseFallbacks?.[cid]||'';
const rationale=state.clauseRecommendations?.[cid]||'';
const existing=getClauseDecision(cid);
setClauseDecision(cid,{
  type:mapped,
  route: existing.route||route,
  fallback: existing.fallback||fallback,
  rationale: existing.rationale||rationale,
  includeInPack: mapped ? mapped!=='accept' : false,
  includeInEscalation: mapped==='escalate',
  priority: existing.priority || (mapped==='escalate'?'high':'medium'),
  status: mapped==='accept' ? 'Agreed' : (existing.status||'Open')
});
const next=state.clausePositions[cid]||'';
if(!Array.isArray(state.positionHistory[cid]))state.positionHistory[cid]=[];
state.positionHistory[cid].push({from:existing.type||'Not set',to:next||'Not set',at:new Date().toISOString()});
logReviewAction('position-changed',cid,{summary:`${existing.type||'Not set'} -> ${next||'Not set'}`});
recordUndoable('Set position',cid,{before:existing.type||'',after:mapped||'',reverter:(val)=>{setClauseDecision(cid,{type:val||''});}});
logNegotiationRound(cid,{position:next});
refreshDerivedClauseState(cid);
recomputeOpenLoops();
onSubstantiveChange();
if(next){
  const idx=(getNavigableClauseIds().filter(id=>id!==OVERVIEW_ID)).indexOf(cid);
  const ids=getNavigableClauseIds().filter(id=>id!==OVERVIEW_ID);
  const nextUnreviewed=ids.slice(Math.max(0,idx+1)).find(id=>(state.clauseReviewStatus[id]||'')!=='Reviewed');
  if(nextUnreviewed) showToast('Decision updated. Press ↓ for next unreviewed.','info');
}
}

function setClauseReviewStatus(cid,value){
invalidateClauseIntelligenceCache(cid);
const prev=state.clauseReviewStatus[cid]||'';
if(!value) delete state.clauseReviewStatus[cid]; else state.clauseReviewStatus[cid]=value;
if(prev!==(state.clauseReviewStatus[cid]||'')) logReviewAction('review-status-updated',cid,{summary:`${prev||'Not set'} -> ${state.clauseReviewStatus[cid]||'Not set'}`});
refreshDerivedClauseState(cid);
onSubstantiveChange();
}
function toggleClauseTag(cid,tag){const s=new Set(state.clauseTags[cid]||[]);if(s.has(tag))s.delete(tag);else s.add(tag);state.clauseTags[cid]=[...s];onSubstantiveChange();}
function toggleClauseRoutingTag(cid,tag){invalidateClauseIntelligenceCache(cid);const s=new Set(state.clauseRoutingTags[cid]||[]);if(s.has(tag))s.delete(tag);else s.add(tag);state.clauseRoutingTags[cid]=[...s];state.negotiationContextOpen||={};state.negotiationContextOpen[cid]=!!((state.clauseCounterpartyPositions[cid]||'').trim()||state.clauseRoutingTags[cid].length||state.negotiationContextOpen[cid]);logReviewAction('routing-updated',cid,{summary:state.clauseRoutingTags[cid].join(', ')||'Cleared'});refreshDerivedClauseState(cid);onSubstantiveChange();}
function setClauseRecommendation(cid,v){state.draftingOpenClauseIds[cid]=true;if(v.trim())state.clauseRecommendations[cid]=v;else delete state.clauseRecommendations[cid];clearDraftingNudgeIfResolved(cid);delete state.clauseRedlineCache[cid];logReviewAction('recommendation-updated',cid,{summary:v.trim()?'Drafted':'Cleared'});scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);}
function setClauseFallback(cid,v){state.draftingOpenClauseIds[cid]=true;if(v.trim())state.clauseFallbacks[cid]=v;else delete state.clauseFallbacks[cid];logReviewAction('fallback-updated',cid,{});scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);}
function setClauseFallbackLadderValue(cid,key,v){state.draftingOpenClauseIds[cid]=true;state.clauseFallbackLadders||={};state.clauseFallbackLadders[cid]||={};if(String(v||'').trim())state.clauseFallbackLadders[cid][key]=v;else delete state.clauseFallbackLadders[cid][key];if(!Object.keys(state.clauseFallbackLadders[cid]).length)delete state.clauseFallbackLadders[cid];logReviewAction('fallback-ladder-updated',cid,{summary:key});scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);}
function setClauseNegotiationStatus(cid,v){invalidateClauseIntelligenceCache(cid);if(!v)delete state.clauseNegotiationStatus[cid];else state.clauseNegotiationStatus[cid]=v;logReviewAction('negotiation-status-updated',cid,{summary:v||'Cleared'});logNegotiationRound(cid,{status:v||''});onSubstantiveChange({rerenderClause:true});}
function setClauseCounterpartyPosition(cid,v){invalidateClauseIntelligenceCache(cid);const t=String(v||'');if(!t.trim())delete state.clauseCounterpartyPositions[cid];else state.clauseCounterpartyPositions[cid]=t;state.negotiationContextOpen||={};state.negotiationContextOpen[cid]=!!((state.clauseCounterpartyPositions[cid]||'').trim()||(state.clauseRoutingTags[cid]||[]).length||state.negotiationContextOpen[cid]);logReviewAction('counterparty-position-updated',cid,{summary:t||'Cleared'});logNegotiationRound(cid,{counterparty:t||''});onSubstantiveChange({rerenderClause:false});}
function commitClauseCounterpartyPosition(cid,v){const prev=state.clauseCounterpartyPositions[cid]||'';setClauseCounterpartyPosition(cid,v);if(prev!==(state.clauseCounterpartyPositions[cid]||'')){logReviewAction('counterparty-position-updated',cid,{});renderActiveRightPanel();if(state.selectedClauseId===cid)renderClauseView();scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);}}
function setClauseCounterpartyNextStep(cid,v){const t=String(v||'');if(!t.trim())delete state.clauseCounterpartyNextSteps[cid];else state.clauseCounterpartyNextSteps[cid]=t;}
function commitClauseCounterpartyNextStep(cid,v){const prev=state.clauseCounterpartyNextSteps[cid]||'';setClauseCounterpartyNextStep(cid,v);if(prev!==(state.clauseCounterpartyNextSteps[cid]||'')){logReviewAction('counterparty-next-step-updated',cid,{});renderActiveRightPanel();if(state.selectedClauseId===cid)renderClauseView();scheduleAutosave(DRAFTING_AUTOSAVE_DELAY);}}
function setClauseCounterpartyLastDiscussed(cid,v){const t=String(v||'');if(!t.trim())delete state.clauseCounterpartyLastDiscussed[cid];else state.clauseCounterpartyLastDiscussed[cid]=t;logReviewAction('last-discussed-updated',cid,{summary:t||'Cleared'});onSubstantiveChange({rerenderClause:true});}
function toggleNegotiationContextOpen(cid,force){state.negotiationContextOpen||={};state.negotiationContextOpen[cid]=typeof force==='boolean'?force:!state.negotiationContextOpen[cid];if(state.selectedClauseId===cid)renderClauseView();}
function formatFallbackLadderText(cid){const l=state.clauseFallbackLadders?.[cid]||{};const p=[];if((state.clauseFallbacks?.[cid]||'').trim())p.push(`Fallback 1: ${state.clauseFallbacks[cid].trim()}`);if((l.fallback2||'').trim())p.push(`Fallback 2: ${l.fallback2.trim()}`);if((l.walkAway||'').trim())p.push(`Walk-away: ${l.walkAway.trim()}`);return p.join('\n');}
function getDraftingNudge(cid){if(state.dismissedDraftingNudges?.[cid])return '';const routing=getClauseRouteTargets(cid);if(routing.some(t=>t&&t!=='Legal Only'))return '';const pos=state.clausePositions?.[cid]||'';const risk=state.clauseRiskScores?.[cid]||'Low';const hasRec=!!String(state.clauseRecommendations?.[cid]||'').trim();if((pos==='Seek amendment'||pos==='Reject'||pos==='Escalate'||risk==='High')&&!hasRec)return 'Add drafting language or playbook standard before negotiation.';return '';}
function dismissDraftingNudge(cid){state.dismissedDraftingNudges||={};state.dismissedDraftingNudges[cid]=true;scheduleAutosave();if(state.selectedClauseId===cid)renderClauseView();}
function clearDraftingNudgeIfResolved(cid){if(String(state.clauseRecommendations?.[cid]||'').trim())delete state.dismissedDraftingNudges?.[cid];}
function applyPlaybookMatchToClause(cid){const c=state.clauses.find(i=>i.id===cid);if(!c)return;const m=getPlaybookMatchForClause(c);if(!m?.item)return;const i=m.item;if(i.text)state.clauseRecommendations[cid]=i.text;if(i.fallbackPosition)state.clauseFallbacks[cid]=i.fallbackPosition;state.draftingOpenClauseIds[cid]=true;clearDraftingNudgeIfResolved(cid);const pos=String(i.standardPosition||'').trim();if(pos && NEGOTIATION_POSITION_OPTIONS.includes(pos))setClausePosition(cid,pos);else{logReviewAction('playbook-applied',cid,{summary:i.title||'Playbook'});onSubstantiveChange({rerenderClause:true});}showToast('Playbook applied','info');}

/* -- Xref tracing -- */
function findReferringClauses(targetId){const t=(state.clauses||[]).find(c=>c.id===targetId);if(!t)return[];const aliases=Array.from(buildReferenceAliases(t.number||''));if(!aliases.length)return[];const suffixes=aliases.map(a=>a.replace(/^(clause|section|article|paragraph|part)\s+/i,'')).filter(Boolean);if(!suffixes.length)return[];const re=new RegExp(`\\b(?:Clause|Section|Article|Paragraph|Part)\\s+(?:${suffixes.map(v=>escapeRegExp(v)).join('|')})\\b`,'i');return(state.clauses||[]).filter(c=>c.id!==targetId&&re.test(String(c.body||''))).map(c=>c.id);}
function traceXrefChain(targetId,opts={}){const ids=new Set([targetId,...findReferringClauses(targetId)]);ids.forEach(id=>{const el=document.querySelector(`.clause-item[data-clause-id="${CSS.escape(id)}"]`);if(el){if(opts.persistent)el.classList.toggle('xref-glow');else{el.classList.add('xref-glow');setTimeout(()=>el.classList.remove('xref-glow'),state.prefs?.xrefGlowMs??2200);}}});}

/* ============================================================
RENDERING
============================================================ */
const CHECK_DEFINITIONS=[
  {id:'review-items',title:'Review items',description:'One prioritised queue combining source defects, structural findings and unresolved legal-review prompts.',icon:'!',health:'reviewItems',group:'queue',isQueue:true},
  {id:'definitions',title:'Defined terms',description:'Definitions, uses, duplicates, possible gaps and terms used before definition.',icon:'Aa',health:'definitions',group:'source'},
  {id:'references',title:'Cross-references',description:'Broken, missing or unverifiable clause and attachment references.',icon:'↗',health:'crossReferences',group:'source'},
  {id:'placeholders',title:'Blanks & placeholders',description:'Unfilled brackets, drafting blanks and unresolved commercial fields.',icon:'□',health:'placeholders',group:'source'},
  {id:'readiness',title:'Signing readiness',description:'A final deterministic check for blanks, missing attachments and execution fields.',icon:'✓',health:'placeholders',group:'source'},
  {id:'obligations',title:'Obligations & deadlines',description:'Who must do what, when, and which candidates need lawyer confirmation.',icon:'⏱',health:'obligations',group:'structured'},
  {id:'concepts',title:'Legal issues by concept',description:'See every clause touching liability, termination, data, IP and other concepts in one place.',icon:'◎',health:'legalConcepts',group:'judgment'},
  {id:'playbook',title:'Playbook coverage',description:'Relevant house-policy modules, deviation prompts and areas still awaiting lawyer consideration.',icon:'PB',health:'playbook',group:'judgment'},
  {id:'subjective',title:'Subjective standards',description:'Satisfaction, discretion, reasonableness and determination language.',icon:'◐',health:'subjectiveStandards',group:'judgment'},
  {id:'asymmetry',title:'One-way rights',description:'Material rights or remedies identified for one party but not the other.',icon:'⇄',health:'asymmetries',group:'judgment'},
  {id:'missing',title:'Expected clauses',description:'Common provisions not confidently located for this contract type.',icon:'§',health:'crossReferences',group:'judgment'}
];
const CHECK_GROUPS=[
  {id:'queue',title:'Your review queue',description:'Resolve the items that currently need a lawyer’s attention. Every item remains linked to its originating check and source evidence.'},
  {id:'source',title:'Source checks',description:'Mechanical checks of text, structure and completion. These are the highest-confidence results.'},
  {id:'structured',title:'Structured fact checks',description:'Actor, action and timing evidence assembled from operative sentences. Confirm before execution tracking.'},
  {id:'judgment',title:'Legal review prompts',description:'Issue routing and legal-effect heuristics. These accelerate review but are not legal conclusions.'}
];
const LEGAL_CONCEPT_LABELS={acceptance:'Acceptance',changeControl:'Change control',indemnity:'Indemnities',liabilityCap:'Liability cap',disputeResolution:'Dispute resolution',termination:'Termination',assignment:'Assignment',setOff:'Set-off',dataProtection:'Data protection',intellectualProperty:'Intellectual property',serviceLevels:'Service levels',confidentiality:'Confidentiality',fees:'Fees and payment',audit:'Audit rights',governingLaw:'Governing law'};
const SOURCE_LIMITATION_PATTERN=/not included in clause analysis|extraction integrity concern|very little text|numbering definitions not found|fingerprint unavailable|text boxes detected|embedded or externally linked word content|content controls detected|tracked (?:changes|revisions|deletions)|footnotes?|endnotes?|omitted word (?:part|content)/i;
function buildCanonicalReviewItems(){
  const items=[];const byFact=new Map();const add=(checkId,key,data={})=>{const factKey=data.factKey||`${checkId}:${key}`;const existing=byFact.get(factKey);if(existing){existing.signals.push({checkId,key,title:data.title||''});existing.checkIds=[...new Set([...(existing.checkIds||[]),checkId])];existing.signalCount=existing.signals.length;if(({high:3,medium:2,low:1}[data.severity||'medium']||2)>({high:3,medium:2,low:1}[existing.severity]||2))existing.severity=data.severity;return existing;}const id=`fact:${factKey}`;const legacyId=`${checkId}:${key}`;const disposition=state.findingReview?.[id]||state.findingReview?.[legacyId]||'';const item={id,factKey,checkId,checkIds:[checkId],key,disposition,severity:data.severity||'medium',confidence:data.confidence||'Moderate',evidenceState:data.evidenceState||'detected',title:data.title||'Review item',detail:data.detail||'Verify against the source document.',clauseId:data.clauseId||'',meta:data.meta||'',cannotVerify:data.cannotVerify||'',lawyerQuestion:data.lawyerQuestion||'',targetClauseId:data.targetClauseId||'',signals:[{checkId,key,title:data.title||''}],signalCount:1};items.push(item);byFact.set(factKey,item);return item;};
  (state.documentMeta?.warnings||[]).filter(w=>SOURCE_LIMITATION_PATTERN.test(w)).forEach((warning,index)=>add('readiness',`source-warning:${index}`,{title:'Source limitation',detail:warning,severity:'high',confidence:'High',cannotVerify:'The omitted or weakly mapped source content cannot be analysed from the current import.',lawyerQuestion:'Has the original Word document been checked for material content outside the extracted clause model?'}));
  if(countWords(state.rawText||'')<20){add('readiness','insufficient-source',{factKey:'source:insufficient-text',title:'Insufficient source text for substantive review',detail:'The imported source contains too little text for reliable structural or legal analysis.',severity:'high',confidence:'High',cannotVerify:'No substantive conclusion can be drawn from this source.',lawyerQuestion:'Was the correct document imported, and is its contract text accessible?'});return items;}
  (state.issues.duplicateDefinitions||[]).forEach((item,index)=>add('definitions',`duplicate:${item.term}:${index}`,{title:`Duplicate definition · ${item.term}`,detail:item.kind==='conflicting'?'Definitions appear materially different.':'The same label appears to be defined more than once.',clauseId:item.firstClauseId,severity:item.kind==='conflicting'?'high':'medium',confidence:'High',cannotVerify:'Whether the duplication is intentional or controlled by document hierarchy.',lawyerQuestion:'Which definition should govern, and should the other be deleted or narrowed?'}));
  (state.issues.definitionQuality||[]).forEach((item,index)=>add('definitions',`quality:${item.term}:${index}`,{title:item.term,detail:item.description,clauseId:item.clauseId||'',confidence:'Moderate',cannotVerify:'Whether the drafting pattern changes the intended commercial scope.',lawyerQuestion:'Is this definition complete and appropriate for every operative use?'}));
  (state.issues.undefinedCapitalizedTerms||[]).forEach(item=>add('definitions',`undefined:${item.term}`,{factKey:REVIEW_CORE.canonicalTermFactKey(item.term),title:`Defined-term cluster · ${item.term}`,detail:`Possible undefined term: ${item.count} uses across ${item.clauseCount||'multiple'} clauses.`,confidence:item.confidence||'Moderate',cannotVerify:'Capitalisation may be stylistic rather than definitional.',lawyerQuestion:'Should this expression be defined, de-capitalised or intentionally left as ordinary language?'}));
  (state.issues.unusedDefinitions||[]).forEach(item=>add('definitions',`unused:${item.term}`,{factKey:REVIEW_CORE.canonicalTermFactKey(item.term),title:`Defined-term cluster · ${item.term}`,detail:'The term is defined, but no operative use outside the definition was located.',clauseId:item.definedInClauseId,confidence:'High',lawyerQuestion:'Is the definition obsolete, or is a required operative provision missing?'}));
  (state.definitionGraph?.issues||[]).forEach(item=>add('definitions',item.id,{factKey:REVIEW_CORE.canonicalTermFactKey(item.term),title:`Defined-term cluster · ${item.term}`,detail:item.detail,clauseId:item.clauseId,severity:item.kind==='circular-definition'?'high':'medium',confidence:item.kind==='circular-definition'?'Moderate':'High',cannotVerify:'Document hierarchy or an incorporated schedule may resolve the apparent dependency.',lawyerQuestion:item.kind==='circular-definition'?'Can each term be understood without relying circularly on the other?':'Is forward use intentional and unambiguous?'}));
  (state.referenceLedger||[]).filter(item=>item.status!=='valid').forEach(item=>add('references',item.id,{title:item.status==='semantic-mismatch'?`Possible wrong target · ${item.reference}`:item.status==='ambiguous'?`Ambiguous reference · ${item.reference}`:`Reference not found · ${item.reference}`,detail:item.context||'The reference target could not be verified.',clauseId:item.clauseId,targetClauseId:item.targetClauseId,severity:item.status==='missing'?'high':'medium',confidence:item.confidence||'Moderate',cannotVerify:item.status==='semantic-mismatch'?'The target exists, but its apparent subject differs from the referring sentence.':'The intended target could not be established from the extracted clause model.',lawyerQuestion:'Does this reference point to the intended operative provision?'}));
  (state.issues.unresolvedCrossReferencedDefinitions||[]).forEach((item,index)=>add('references',`definition:${item.term}:${index}`,{title:`${item.term} → ${item.reference}`,detail:item.reason||'The referenced definition could not be resolved.',clauseId:item.definedInClauseId,severity:'high',confidence:'High',cannotVerify:'The referenced location did not yield a complete definition.',lawyerQuestion:'Where is the governing definition, and should the reference be corrected?'}));
  (state.placeholders||[]).filter(item=>!item.resolved&&!item.ignored).forEach((item,index)=>add('placeholders',item.id||String(index),{factKey:`placeholder:${item.id||item.clauseId||'unknown'}:${item.start??index}`,title:`${item.text} · ${item.clauseLabel||item.clauseId||'source'} · occurrence ${Number(item.occurrenceIndex??index)+1}`,detail:item.reviewed?'Reviewed by the lawyer, but still present in the imported source.':item.reason||'Unresolved drafting blank.',clauseId:item.clauseId,severity:'high',confidence:item.confidence||'High',lawyerQuestion:'What final value or wording must be inserted in the source document before signature?'}));
  (state.obligations||[]).filter(item=>state.obligationVerification?.[item.id]!=='confirmed'&&(!item.party||!item.action||item.confidence==='Low'||item.relativeDeadline||item.trigger||item.deadline)).forEach((item,index)=>add('obligations',item.id||String(index),{title:`${item.party||'Actor unclear'} · ${truncateWords(item.action||'Obligation candidate',12)}`,detail:item.sourceSentence||item.action||'',clauseId:item.clauseId,confidence:item.confidence||'Moderate',cannotVerify:'Whether this statement is execution-relevant and whether its actor, trigger or timing is complete.',lawyerQuestion:'Confirm the actor, action, trigger and deadline. Routine complete obligations remain in the inventory.'}));
  (state.issues.subjectiveStandards||[]).forEach((item,index)=>add('subjective',item.id||String(index),{title:`${item.tier||'Contextual'} · ${item.rule||'subjective standard'}`,detail:item.sourceExcerpt||'',clauseId:item.clauseId,severity:String(item.severity||'medium').toLowerCase(),confidence:item.matchStrength||'Moderate',cannotVerify:'Whether the discretion is constrained elsewhere in the agreement.',lawyerQuestion:'Is the standard sufficiently objective and balanced for this deal?'}));
  (state.issues.asymmetries||[]).forEach((item,index)=>add('asymmetry',item.id||String(index),{title:`${item.category||'One-way provision'} · benefits ${item.beneficiary||'one party'}`,detail:item.sourceExcerpt||'',clauseId:item.clauseId,severity:item.materiality==='Material'?'high':'medium',confidence:item.confidence||'Moderate',cannotVerify:'A reciprocal right may use materially different wording elsewhere.',lawyerQuestion:`Is the one-way position acceptable for ${item.missingReciprocalFor||'the other party'}?`}));
  if(getActivePlaybookPackage())getReviewableClauses().forEach(clause=>{const match=getPlaybookCandidates(clause)?.[0];if(!match?.module||!match.deviations?.length)return;const selection=getClausePlaybookSelection(clause.id);if(selection.moduleId===match.module.id&&['confirmed','ignored'].includes(selection.status))return;add('playbook',`${clause.id}:${match.module.id}`,{title:`${match.module.id} · ${match.module.title}`,detail:match.deviations.map(item=>item.label).join(' · '),clauseId:clause.id,severity:match.deviations.length>1?'high':'medium',confidence:match.matchStrength||'Moderate',cannotVerify:'Whether the detected wording should result in a concession, fallback or escalation for this matter.',lawyerQuestion:'Which authorised playbook rung should govern the clause?'});});
  (state.expectedClauseCoverage?.missing||[]).forEach((item,index)=>{const label=typeof item==='string'?item:item.name||item.label||'Expected provision';add('missing',`missing:${label}:${index}`,{title:`${label} not located`,detail:`Expected for ${state.contractType||'this contract type'}, but no strong evidence was found.`,confidence:'Moderate',cannotVerify:'Absence from the extracted model is not proof that the source document omits it.',lawyerQuestion:'Is the provision genuinely absent, located in another document, or intentionally unnecessary?'});});
  (state.expectedClauseCoverage?.weak||[]).forEach((item,index)=>{const label=typeof item==='string'?item:item.name||item.label||'Expected provision';add('missing',`weak:${label}:${index}`,{title:`${label} · weak evidence`,detail:'Related wording was found, but its legal effect could not be verified confidently.',clauseId:item.clauseId||'',confidence:'Low',evidenceState:'uncertain',cannotVerify:'Whether the wording performs the expected legal function.',lawyerQuestion:'Does the located wording provide the intended protection?'});});
  buildExecutionCheck().items.filter(item=>item.type!=='placeholder').forEach((item,index)=>add('readiness',`${item.type||'item'}:${index}`,{factKey:`execution:${item.type}:${item.clauseId||''}:${item.detail||index}`,title:item.label,detail:item.detail||'',clauseId:item.clauseId||'',severity:item.severity==='blocker'?'high':'medium',confidence:'High',cannotVerify:'Execution readiness outside the imported document, including authority and attachments not supplied.',lawyerQuestion:'Has this item been resolved in the final execution copy?'}));
  return items.sort((a,b)=>({high:0,medium:1,low:2}[a.severity]??1)-({high:0,medium:1,low:2}[b.severity]??1)||a.title.localeCompare(b.title));
}
function getCanonicalReviewItems(){state.reviewItems=buildCanonicalReviewItems();return state.reviewItems;}
function getCheckAttentionCount(id){
  if(id==='review-items')return getCanonicalReviewItems().filter(item=>!item.disposition).length;
  if(id==='definitions')return (state.issues.duplicateDefinitions||[]).length+(state.issues.definitionQuality||[]).length+(state.issues.undefinedCapitalizedTerms||[]).length+(state.issues.unusedDefinitions||[]).length;
  if(id==='references')return (state.issues.crossReferenceBreaks||[]).length+(state.issues.semanticCrossReferenceWarnings||[]).length+(state.issues.unresolvedCrossReferencedDefinitions||[]).length;
  if(id==='placeholders')return (state.placeholders||[]).filter(i=>!i.resolved&&!i.ignored).length;
  if(id==='obligations')return (state.obligations||[]).filter(i=>state.obligationVerification?.[i.id]!=='confirmed').length;
  if(id==='subjective')return (state.issues.subjectiveStandards||[]).length;
  if(id==='asymmetry')return (state.issues.asymmetries||[]).length;
  if(id==='concepts')return (state.legalConceptEvidence?.all||[]).length;
  if(id==='playbook'){if(!getActivePlaybookPackage())return 0;return getReviewableClauses().filter(clause=>{const match=getPlaybookCandidates(clause)?.[0];const selection=getClausePlaybookSelection(clause.id);return match?.deviations?.length&&!(selection.moduleId===match.module.id&&['confirmed','ignored'].includes(selection.status));}).length;}
  if(id==='missing')return (state.expectedClauseCoverage?.missing||[]).length+(state.expectedClauseCoverage?.weak||[]).length;
  if(id==='readiness')return buildExecutionCheck().items.length+(state.documentMeta?.warnings||[]).filter(w=>SOURCE_LIMITATION_PATTERN.test(w)).length;
  return 0;
}
function evidenceStateHtml(kind='detected',label=''){
  const map={confirmed:['✓','Confirmed'],detected:['●','Detected · not reviewed'],uncertain:['?','Could not verify'],clear:['○','Checked · nothing found'],'not-run':['–','Not run'],'not-applicable':['—','Not applicable']};
  const [icon,text]=map[kind]||map.detected;return `<span class="evidence-state evidence-${kind}"><span aria-hidden="true">${icon}</span>${escapeHtml(label||text)}</span>`;
}
function getCheckStatus(def){const count=getCheckAttentionCount(def.id);if(def.id==='review-items')return count?{kind:'detected',label:`${count} open review item${count===1?'':'s'}`,count}:{kind:'confirmed',label:'All review items resolved',count};if(def.id==='playbook'&&!getActivePlaybookPackage())return{kind:'not-applicable',label:'No playbook active',count:0};const health=def.id==='playbook'?'checked':state.detectorHealth?.[def.health]?.status||'not-run';if(state.checkCompletion?.[def.id])return {kind:'confirmed',label:'Check completed',count};if(health==='not-run')return {kind:'not-run',label:'Not run',count};if(health==='limited')return {kind:'uncertain',label:count?`${count} item${count===1?'':'s'} · limited source`:'Could not verify fully',count};if(def.id==='concepts')return count?{kind:'detected',label:`${count} evidence item${count===1?'':'s'} mapped`,count}:{kind:'clear',label:'Checked · no concept evidence',count};return count?{kind:'detected',label:`${count} ${count===1?'needs':'need'} attention`,count}:{kind:'clear',label:'Checked · nothing found',count};}
function checkFindingRecord(check,key){return state.findingReview?.[`${check}:${key}`]||'';}
function findingStatusHtml(check,key){const status=checkFindingRecord(check,key);return status==='confirmed'?evidenceStateHtml('confirmed'):status==='ignored'?evidenceStateHtml('not-applicable','Marked not applicable'):evidenceStateHtml('detected');}
function findingActions(check,key,clauseId='',extra=''){
  const status=checkFindingRecord(check,key);return `<div class="check-finding-actions">${clauseId?`<button type="button" class="link-btn" data-check-source="${escapeHtml(clauseId)}">Open source</button>`:''}${extra}<button type="button" class="link-btn" data-finding-state="confirmed" data-finding-key="${escapeHtml(`${check}:${key}`)}">${status==='confirmed'?'Confirmed ✓':'Confirm'}</button><button type="button" class="link-btn" data-finding-state="ignored" data-finding-key="${escapeHtml(`${check}:${key}`)}">${status==='ignored'?'Restore':'Not applicable'}</button></div>`;
}
function renderCheckFinding(check,key,title,detail,clauseId='',meta='',extra=''){
  const status=checkFindingRecord(check,key);if(state.checkFilter==='confirmed'&&status!=='confirmed')return'';if(state.checkFilter==='ignored'&&status!=='ignored')return'';if(state.checkFilter==='attention'&&status)return'';return `<article class="check-finding-card ${status?`is-${status}`:''}"><div class="check-finding-head"><div><h3>${escapeHtml(title)}</h3>${meta?`<div class="check-finding-meta">${escapeHtml(meta)}</div>`:''}</div>${findingStatusHtml(check,key)}</div><p>${escapeHtml(detail||'Verify against the source document.')}</p>${findingActions(check,key,clauseId,extra)}</article>`;
}
function buildSourceConfidenceLedger(){
  const reviewable=getReviewableClauses();const mapped=reviewable.filter(clause=>(Array.isArray(clause.sourceSpans)&&clause.sourceSpans.length)||(Array.isArray(clause.sourceBlockIds)&&clause.sourceBlockIds.length)).length;const mappingPercent=reviewable.length?Math.round(mapped/reviewable.length*100):0;const warnings=state.documentMeta?.warnings||[];
  const classified=REVIEW_CORE.classifySourceWarnings(warnings);const omitted=classified.material;const integrity=state.documentMeta?.sourceIntegrity||{};const degraded=integrity.status==='degraded'||integrity.requiresConfirmation||classified.hasTrackedChanges||classified.hasOmittedWordParts;const limited=degraded||mappingPercent<95||omitted.length>0;
  return{status:degraded?'degraded':limited?'limited':'strong',sourceType:state.documentMeta?.sourceType||'unknown',mappingPercent,mapped,total:reviewable.length,sourceBlocks:(state.sourceBlocks||[]).length,omitted,warnings,requiresConfirmation:!!integrity.requiresConfirmation||classified.requiresAssurance,hasTrackedChanges:classified.hasTrackedChanges,hasOmittedWordParts:classified.hasOmittedWordParts,fingerprint:state.documentMeta?.sourceFingerprint||''};
}
function renderSourceConfidenceLedger(){const ledger=buildSourceConfidenceLedger();const label=ledger.status==='strong'?'Strong source coverage':ledger.status==='degraded'?'Source verification required':'Source coverage has limits';const kind=ledger.status==='strong'?'confirmed':'uncertain';return `<details class="source-confidence-ledger" ${ledger.status==='strong'?'':'open'}><summary><span><strong>Source confidence</strong><small>${escapeHtml(label)}</small></span>${evidenceStateHtml(kind,`${ledger.mappingPercent}% clause mapping`)}</summary><div class="source-ledger-grid"><div><span>Imported source</span><strong>${escapeHtml(ledger.sourceType.toUpperCase())}</strong></div><div><span>Stable source blocks</span><strong>${ledger.sourceBlocks}</strong></div><div><span>Mapped review clauses</span><strong>${ledger.mapped}/${ledger.total}</strong></div><div><span>Fingerprint</span><strong>${ledger.fingerprint?'Recorded':'Unavailable'}</strong></div></div>${ledger.omitted.length?`<div class="source-ledger-warning"><strong>Not analysed</strong>${ledger.omitted.map(w=>`<p>${escapeHtml(w)}</p>`).join('')}</div>`:''}<p class="mini">A strong mapping confirms traceability into the extracted text, not completeness of the original Word file or legal correctness. Verify formatting, tracked changes and omitted Word structures in the source document.</p></details>`;}
const CHECK_ASSURANCE={
  definitions:['Definitions, dependencies and usage patterns','Detected definition text and clause-level uses','Intentional capitalisation, incorporated definitions and drafting intent','Confirm the governing definition and every material operative use'],
  references:['Resolved, broken, ambiguous and possibly mismatched references','Reference token, referring sentence and target clause','Intended commercial target where drafting is indirect or external','Confirm that the target exists and performs the function described'],
  placeholders:['Unresolved blanks and drafting markers','Visible bracket, marker or table evidence','Whether a blank is intentionally inapplicable','Insert, resolve or mark the candidate not applicable'],
  readiness:['Deterministic execution blockers','Unresolved source, attachment and execution evidence','Business readiness or authority outside the document','Confirm every blocker before signature'],
  obligations:['Operative actor, action and timing candidates','Sentence-level obligation evidence','Operational ownership and whether the statement is execution-relevant','Confirm actor, action, trigger and deadline'],
  concepts:['Legal-effect evidence grouped by concept','Sentence-scoped propositions and concept rules','Final interpretation, enforceability and deal context','Confirm the legal effect before relying on a classification'],
  playbook:['Relevant modules and detected policy deviations','Clause evidence, applicability rules and authored module checks','Whether the matter facts justify a concession or exception','Confirm the governing module, authorised rung and required approval'],
  subjective:['Discretionary and subjective standards','Source sentence and matched legal formulation','Whether other provisions constrain the discretion','Confirm that the standard is workable and appropriately balanced'],
  asymmetry:['Potentially one-way material rights','Actor, modality, polarity and reciprocal-right search','Commercial justification or differently worded reciprocity','Confirm whether the asymmetry is intentional and acceptable'],
  missing:['Expected provisions not strongly located','Contract-family expectations and concept evidence','Whether another document supplies the provision','Confirm genuine absence before treating it as a gap']
};
function renderCheckAssurance(def,status){const a=CHECK_ASSURANCE[def.id];if(!a)return'';return `<details class="check-assurance"><summary>How to read this result</summary><div class="check-assurance-grid"><div><span>What Cockpit found</span><strong>${escapeHtml(status.label)}</strong><p>${escapeHtml(a[0])}</p></div><div><span>Evidence used</span><p>${escapeHtml(a[1])}</p></div><div><span>Could not verify</span><p>${escapeHtml(a[2])}</p></div><div><span>Lawyer confirms</span><p>${escapeHtml(a[3])}</p></div></div></details>`;}
function renderDefinitionGraphSummary(){const graph=state.definitionGraph||{nodes:[],edges:[],issues:[]};const before=graph.issues.filter(i=>i.kind==='used-before-definition').length;const cycles=graph.issues.filter(i=>i.kind==='circular-definition').length;return `<section class="structural-summary"><div><span>Defined terms</span><strong>${graph.nodes.length}</strong></div><div><span>Definition dependencies</span><strong>${graph.edges.length}</strong></div><div><span>Used before definition</span><strong>${before}</strong></div><div><span>Possible circularity</span><strong>${cycles}</strong></div></section>`;}
function renderReferenceLedgerSummary(){const ledger=state.referenceLedger||[];const count=status=>ledger.filter(item=>item.status===status).length;const valid=ledger.filter(item=>item.status==='valid');return `<section class="structural-summary"><div><span>References checked</span><strong>${ledger.length}</strong></div><div><span>Targets located</span><strong>${count('valid')}</strong></div><div><span>Missing or ambiguous</span><strong>${count('missing')+count('ambiguous')}</strong></div><div><span>Likely malformed</span><strong>${count('malformed')}</strong></div><div><span>Possible wrong target</span><strong>${count('semantic-mismatch')}</strong></div></section>${state.checkFilter==='all'&&valid.length?`<details class="verified-reference-list"><summary>${valid.length} verified target${valid.length===1?'':'s'}</summary>${valid.map(item=>`<div class="verified-reference-row"><span>${escapeHtml(item.clauseLabel)} → ${escapeHtml(item.reference)}</span><span>${escapeHtml(item.targetClauseLabel||'Target located')}</span><button type="button" class="link-btn" data-check-source="${escapeHtml(item.targetClauseId)}">Open target</button></div>`).join('')}</details>`:''}`;}
function renderReviewItemsDetail(def){const items=getCanonicalReviewItems();const visible=items.filter(item=>state.checkFilter==='confirmed'?item.disposition==='confirmed':state.checkFilter==='ignored'?item.disposition==='ignored':state.checkFilter==='attention'?!item.disposition:true);const resolved=items.filter(item=>item.disposition).length;const status=getCheckStatus(def);const filters=[['all','All'],['attention','Needs attention'],['confirmed','Confirmed'],['ignored','Not applicable']];return `<div class="checks-detail review-items-detail"><div class="checks-detail-top"><button type="button" class="back-link" data-check-back>← All checks</button><button type="button" class="btn btn-sm" data-check-export="review-items">Export review items</button></div><header class="checks-detail-header"><div class="check-icon large">!</div><div><span class="eyebrow">Matter review queue</span><h1>Review items</h1><p>One evidence-linked queue across structural checks and legal-review prompts. Resolving an item updates its originating check.</p></div>${evidenceStateHtml(status.kind,status.label)}</header>${renderSourceConfidenceLedger()}<section class="review-item-progress"><div><strong>${resolved}/${items.length}</strong><span>items resolved</span></div><div class="review-progress-track"><span style="width:${items.length?Math.round(resolved/items.length*100):100}%"></span></div></section><div class="check-filter-row">${filters.map(([id,label])=>`<button type="button" class="sub-pill ${state.checkFilter===id?'active':''}" data-check-filter="${id}">${label}</button>`).join('')}</div><div class="check-findings-list compact-review-list">${visible.map(item=>`<details class="check-finding-card review-item-card ${item.disposition?`is-${item.disposition}`:''} severity-${escapeHtml(item.severity)}"><summary><span><span class="review-item-origin">${escapeHtml(CHECK_DEFINITIONS.find(check=>check.id===item.checkId)?.title||item.checkId)}${item.signalCount>1?` · ${item.signalCount} linked observations`:''}</span><strong>${escapeHtml(item.title)}</strong></span>${item.disposition==='confirmed'?evidenceStateHtml('confirmed'):item.disposition==='ignored'?evidenceStateHtml('not-applicable','Not applicable'):evidenceStateHtml(item.evidenceState,item.evidenceState==='uncertain'?'Could not verify':'Needs review')}</summary><div class="review-item-body"><div class="check-finding-meta">${escapeHtml(item.confidence)} confidence${item.meta?` · ${escapeHtml(item.meta)}`:''}</div><blockquote>${escapeHtml(item.detail)}</blockquote>${item.cannotVerify?`<div class="review-item-question"><span>Could not verify</span><p>${escapeHtml(item.cannotVerify)}</p></div>`:''}${item.lawyerQuestion?`<div class="review-item-question lawyer"><span>Lawyer confirms</span><p>${escapeHtml(item.lawyerQuestion)}</p></div>`:''}<div class="check-finding-actions">${item.clauseId?`<button type="button" class="link-btn" data-check-source="${escapeHtml(item.clauseId)}">Open source</button>`:''}${item.targetClauseId?`<button type="button" class="link-btn" data-check-source="${escapeHtml(item.targetClauseId)}">Open target</button>`:''}<button type="button" class="link-btn" data-open-check-origin="${escapeHtml(item.checkId)}">Open originating check</button><button type="button" class="link-btn" data-finding-state="confirmed" data-finding-key="${escapeHtml(item.id)}">${item.disposition==='confirmed'?'Confirmed ✓':'Confirm'}</button><button type="button" class="link-btn" data-finding-state="ignored" data-finding-key="${escapeHtml(item.id)}">${item.disposition==='ignored'?'Restore':'Not applicable'}</button></div></div></details>`).join('')||`<div class="check-empty">${evidenceStateHtml('confirmed','Queue clear')}<h2>No review items in this view</h2><p>All detected items have been resolved or the selected filter has no results.</p></div>`}</div></div>`;}
function renderCheckDetail(def){
  if(def.id==='review-items')return renderReviewItemsDetail(def);
  let findings='';
  let conceptNav='';
  if(def.id==='definitions'){
    const termFilter=state.activeTermFilter||'';
    const termMatch=name=>!termFilter||String(name||'').toLowerCase()===termFilter.toLowerCase();
    if(termFilter)conceptNav=`<div class="term-filter-banner">Showing the defined-term check for <strong>${escapeHtml(termFilter)}</strong><button type="button" class="link-btn" data-clear-term-filter>Clear ✕</button></div>`;
    (state.issues.duplicateDefinitions||[]).filter(i=>termMatch(i.term)).forEach((i,n)=>{findings+=renderCheckFinding(def.id,`duplicate:${i.term}:${n}`,`Duplicate definition · ${i.term}`,i.kind==='conflicting'?'Definitions differ materially.':'The same label appears to be defined more than once.',i.firstClauseId,`${i.kind} duplicate`);});
    (state.issues.definitionQuality||[]).filter(i=>termMatch(i.term)).forEach((i,n)=>{findings+=renderCheckFinding(def.id,`quality:${i.term}:${n}`,i.term,i.description,'','Definition quality');});
    (state.issues.undefinedCapitalizedTerms||[]).filter(i=>termMatch(i.term)).forEach(i=>{findings+=renderCheckFinding(def.id,`undefined:${i.term}`,`Possible undefined term · ${i.term}`,`${i.count} uses across ${i.clauseCount||'multiple'} clauses.`,'','Possible gap',`<button type="button" class="link-btn ignore-undefined-btn" data-term="${escapeHtml(i.term)}">Ignore term</button>`);});
    (state.issues.unusedDefinitions||[]).filter(i=>termMatch(i.term)).forEach(i=>{findings+=renderCheckFinding(def.id,`unused:${i.term}`,`Defined but not used · ${i.term}`,'No use outside its definition was located.',i.definedInClauseId,'Usage check');});
    (state.definitionGraph?.issues||[]).filter(i=>termMatch(i.term)).forEach(i=>{findings+=renderCheckFinding(def.id,i.id,i.kind==='circular-definition'?`Possible circular definition · ${i.term}`:`Used before definition · ${i.term}`,i.detail,i.clauseId,i.kind==='circular-definition'?'Dependency check':'Definition order');});
    if(state.checkFilter==='all'||termFilter)Object.values(state.definedTerms||{}).filter(t=>termMatch(t.term)).sort((a,b)=>a.term.localeCompare(b.term)).forEach(t=>{const node=(state.definitionGraph?.nodes||[]).find(n=>n.term===t.term);const dependencies=node?.dependencies||[];findings+=renderCheckFinding(def.id,`term:${t.term}`,t.term,(t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||'Definition captured.',t.definedInClauseId,`${t.definitionType} · ${t.usedInClauseIds?.length||0} uses${dependencies.length?` · depends on ${dependencies.join(', ')}`:''}`,`<button type="button" class="link-btn copy-term-btn" data-term="${escapeHtml(t.term)}">Copy</button>${(t.usedInClauseIds||[]).slice(0,3).map((id,index)=>`<button type="button" class="link-btn" data-term-use-clause="${escapeHtml(id)}">Use ${index+1}</button>`).join('')}`);});
  } else if(def.id==='references'){
    (state.issues.crossReferenceBreaks||[]).forEach((i,n)=>{findings+=renderCheckFinding(def.id,i.id||`${i.clauseId}:${i.reference}:${n}`,`${i.status==='ambiguous'?'Ambiguous reference':i.status==='malformed'?'Likely malformed reference':'Reference not found'} · ${i.reference}`,i.status==='malformed'?`${i.context||''}${i.suggestedCorrection?` Likely intended as ${i.suggestedCorrection}.`:''}`.trim():(i.context||i.excerpt||'No matching source target was located.'),i.clauseId,i.clauseLabel||'Cross-reference');});
    (state.issues.unresolvedCrossReferencedDefinitions||[]).forEach((i,n)=>{findings+=renderCheckFinding(def.id,`definition:${i.term}:${n}`,`${i.term} → ${i.reference}`,i.reason||'The referenced definition could not be resolved.',i.definedInClauseId,'Definition reference');});
    (state.issues.semanticCrossReferenceWarnings||[]).forEach(i=>{findings+=renderCheckFinding(def.id,i.id,`Possible wrong target · ${i.reference}`,i.context||'The apparent subject of the target differs from the referring sentence.',i.clauseId,`${i.sourceTopic||'Semantic'} reference`,`<button type="button" class="link-btn" data-check-source="${escapeHtml(i.targetClauseId)}">Open target</button>`);});
  } else if(def.id==='placeholders'){
    (state.placeholders||[]).forEach((i,n)=>{if(i.resolved||i.ignored)return;findings+=renderCheckFinding(def.id,i.id||String(n),i.text,i.reason||'Unresolved drafting blank.',i.clauseId,`${i.confidence||'High'} confidence`,`<button type="button" class="link-btn" data-resolve-placeholder="${escapeHtml(i.id)}">${i.reviewed?'Reopen review':'Mark reviewed'}</button>`);});
  } else if(def.id==='obligations'){
    (state.obligations||[]).forEach((i,n)=>{findings+=renderCheckFinding(def.id,i.id||String(n),`${i.party||'Unspecified'} · ${truncateWords(i.action||'Obligation candidate',12)}`,i.sourceSentence||i.action||'',i.clauseId,[i.deadline,i.confidence].filter(Boolean).join(' · '),`<button type="button" class="link-btn" data-confirm-obligation="${escapeHtml(i.id)}">${state.obligationVerification?.[i.id]==='confirmed'?'Unconfirm obligation':'Confirm obligation'}</button>`);});
  } else if(def.id==='concepts'){
    const groups=Object.entries(state.legalConceptEvidence?.byConcept||{}).filter(([,items])=>items?.length);
    conceptNav=`<nav class="concept-filter-grid" aria-label="Legal issue filter"><button type="button" class="concept-filter ${!state.activeConcept?'active':''}" data-concept-filter="">All issues<span>${state.legalConceptEvidence?.all?.length||0}</span></button>${groups.map(([key,items])=>`<button type="button" class="concept-filter ${state.activeConcept===key?'active':''}" data-concept-filter="${escapeHtml(key)}">${escapeHtml(LEGAL_CONCEPT_LABELS[key]||key)}<span>${items.length}</span></button>`).join('')}</nav>`;
    groups.filter(([key])=>!state.activeConcept||key===state.activeConcept).forEach(([key,items])=>items.forEach((i,n)=>{findings+=renderCheckFinding(def.id,`${key}:${i.sourceClauseId}:${i.rule}:${n}`,`${LEGAL_CONCEPT_LABELS[key]||key} · ${i.mechanism||'concept evidence'}`,i.sourceExcerpt||'Review the source clause.',i.sourceClauseId,`${i.matchStrength||'Possible'} match · ${i.rule||'shared concept engine'}`);}));
  } else if(def.id==='playbook'){
    const pkg=getActivePlaybookPackage();
    if(pkg){
      const rows=getReviewableClauses().map(clause=>({clause,match:getPlaybookCandidates(clause)?.[0]})).filter(row=>row.match?.module);
      const completeness=getPlaybookCompleteness(rows.map(row=>({clause:row.clause,candidates:[row.match]})));
      conceptNav=`<section class="structural-summary"><div><span>Operational modules</span><strong>${completeness.operationalTotal}/${completeness.sourceTotal}</strong></div><div><span>Relevant modules</span><strong>${completeness.total}</strong></div><div><span>Considered</span><strong>${completeness.considered}</strong></div><div><span>Coverage boundary</span><strong>${completeness.sourceGap}</strong></div></section>`;
      rows.forEach(({clause,match})=>{const selection=getClausePlaybookSelection(clause.id);const deviations=match.deviations||[];const key=`${clause.id}:${match.module.id}`;const detail=deviations.length?deviations.map(item=>item.label).join(' · '):(match.reasons||[]).join(' · ')||'Relevant module routed for lawyer consideration.';const meta=[match.matchStrength,selection.status==='confirmed'?'Module confirmed':selection.status==='ignored'?'Module ignored':'Not yet considered'].filter(Boolean).join(' · ');findings+=renderCheckFinding(def.id,key,`${match.module.id} · ${match.module.title}`,detail,clause.id,meta,`<button type="button" class="link-btn" data-check-playbook-guidance="${escapeHtml(clause.id)}" data-module-id="${escapeHtml(match.module.id)}">Open guidance</button>`);});
    } else findings='<div class="check-empty"><h2>No playbook is active</h2><p>Activate a role-appropriate local package from the playbook repository. Cockpit will not infer house policy while no package is active.</p></div>';
  } else if(def.id==='subjective'){
    (state.issues.subjectiveStandards||[]).forEach((i,n)=>{findings+=renderCheckFinding(def.id,i.id||String(n),`${i.tier||'Contextual'} · ${i.rule||'subjective standard'}`,i.sourceExcerpt||'',i.clauseId,`${i.severity||'Medium'} · ${i.matchStrength||'Possible'}`);});
  } else if(def.id==='asymmetry'){
    (state.issues.asymmetries||[]).forEach((i,n)=>{findings+=renderCheckFinding(def.id,i.id||String(n),`${i.category||'One-way provision'} · benefits ${i.beneficiary||'one party'}`,i.sourceExcerpt||'',i.clauseId,`${i.materiality||'Possible'} · reciprocal right for ${i.missingReciprocalFor||'other party'} not located`);});
  } else if(def.id==='missing'){
    (state.expectedClauseCoverage?.missing||[]).forEach((item,n)=>{const label=typeof item==='string'?item:item.name||item.label||'Expected provision';findings+=renderCheckFinding(def.id,`missing:${label}:${n}`,`${label} not located`,`Cockpit expected this provision for ${state.contractType||'this contract type'} but did not locate strong evidence.`,'','Document-level check');});
    (state.expectedClauseCoverage?.weak||[]).forEach((item,n)=>{const label=typeof item==='string'?item:item.name||item.label||'Expected provision';findings+=renderCheckFinding(def.id,`weak:${label}:${n}`,`${label} · weak evidence`,'Some related wording was found, but the legal effect could not be verified confidently.',item.clauseId||'','Could not verify');});
  } else if(def.id==='readiness'){
    (state.documentMeta?.warnings||[]).filter(w=>SOURCE_LIMITATION_PATTERN.test(w)).forEach((warning,index)=>{findings+=renderCheckFinding(def.id,`source-warning:${index}`,'Source limitation',warning,'','Source confidence');});
    buildExecutionCheck().items.forEach((i,n)=>{findings+=renderCheckFinding(def.id,`${i.type||'item'}:${n}`,i.label,i.detail||'',i.clauseId,`${i.severity==='blocker'?'Fix before signing':'Verify'}`);});
  }
  const status=getCheckStatus(def);const filters=[['all','All'],['attention','Needs attention'],['confirmed','Confirmed'],['ignored','Not applicable']];
  const kindLabel=def.group==='source'?'Source check':def.group==='structured'?'Structured fact check':'Legal review prompt';
  return `<div class="checks-detail"><div class="checks-detail-top"><button type="button" class="back-link" data-check-back>← All checks</button><div class="check-export-actions">${def.id==='definitions'?'<button type="button" class="btn btn-sm" data-export-glossary>Export glossary</button>':''}<button type="button" class="btn btn-sm" data-check-export="${escapeHtml(def.id)}">Export this check</button></div></div><header class="checks-detail-header"><div class="check-icon large">${def.icon}</div><div><span class="eyebrow">${kindLabel}</span><h1>${escapeHtml(def.title)}</h1><p>${escapeHtml(def.description)}</p></div>${evidenceStateHtml(status.kind,status.label)}</header>${renderCheckAssurance(def,status)}${def.id==='definitions'?renderDefinitionGraphSummary():''}${def.id==='references'?renderReferenceLedgerSummary():''}${conceptNav}<div class="check-filter-row">${filters.map(([id,label])=>`<button type="button" class="sub-pill ${state.checkFilter===id?'active':''}" data-check-filter="${id}">${label}</button>`).join('')}</div><div class="check-findings-list">${findings||`<div class="check-empty">${evidenceStateHtml(status.kind,status.label)}<h2>No findings in this view</h2><p>${status.kind==='clear'?'The detector ran and did not locate an item needing attention. Verify the final source before relying on this result.':'Try another filter or review the source manually.'}</p></div>`}</div><footer class="check-completion-bar"><div><strong>${state.checkCompletion?.[def.id]?'Check completed':'Finish this check when you have reviewed its findings'}</strong><span>Completion is lawyer-confirmed and shared with the full review record.</span></div><button type="button" class="btn btn-primary" data-complete-check="${escapeHtml(def.id)}">${state.checkCompletion?.[def.id]?'Reopen check':'Mark check complete'}</button></footer></div>`;
}
function renderCheckCard(definition){const s=getCheckStatus(definition);return `<button type="button" class="check-card" data-open-check="${definition.id}"><span class="check-icon">${definition.icon}</span><span class="check-card-copy"><strong>${escapeHtml(definition.title)}</strong><small>${escapeHtml(definition.description)}</small></span>${evidenceStateHtml(s.kind,s.label)}<span class="check-arrow">→</span></button>`;}
function renderChecksWorkspace(){if(!els.checksWorkspace)return;const def=CHECK_DEFINITIONS.find(i=>i.id===state.activeCheck);if(def){els.checksWorkspace.innerHTML=renderCheckDetail(def);return;}const actualChecks=CHECK_DEFINITIONS.filter(i=>!i.isQueue);const completed=actualChecks.filter(i=>state.checkCompletion?.[i.id]).length;const openItems=getCanonicalReviewItems().filter(item=>!item.disposition).length;els.checksWorkspace.innerHTML=`<div class="checks-home"><header class="checks-hero"><div><span class="eyebrow">Focused checks</span><h1>Check only what you need</h1><p>Each check is independent. Findings and confirmations still feed the same contract record used in Review and exports.</p></div><div class="checks-progress"><strong>${completed}/${actualChecks.length}</strong><span>checks completed</span></div></header>${renderSourceConfidenceLedger()}<button type="button" class="review-queue-banner ${openItems?'has-open':'is-clear'}" data-open-check="review-items"><span><strong>${openItems?`${openItems} review item${openItems===1?'':'s'} need attention`:'Review queue clear'}</strong><small>One prioritised queue across every focused check</small></span><span>Open queue →</span></button><div class="confidence-key" aria-label="Finding status legend">${evidenceStateHtml('confirmed')}${evidenceStateHtml('detected')}${evidenceStateHtml('uncertain')}${evidenceStateHtml('clear')}${evidenceStateHtml('not-run')}</div>${CHECK_GROUPS.filter(group=>group.id!=='queue').map(group=>`<section class="check-group check-group-${group.id}"><header><div><span class="eyebrow">${escapeHtml(group.title)}</span><p>${escapeHtml(group.description)}</p></div></header><div class="checks-grid">${CHECK_DEFINITIONS.filter(item=>item.group===group.id).map(renderCheckCard).join('')}</div></section>`).join('')}<section class="checks-next"><div><strong>Need a complete legal review?</strong><span>Move into the clause-by-clause workspace when you need decisions, playbook guidance or negotiation outputs.</span></div><button type="button" class="btn" data-open-full-review>Open Review</button></section></div>`;}
function exportCurrentCheck(def){if(!def)return;const cards=[...(els.checksWorkspace?.querySelectorAll('.check-finding-card')||[])];const lines=[`${def.title.toUpperCase()} — FOCUSED CHECK`,`Audience: Internal Legal`,`Document: ${state.documentMeta.fileName||'Untitled'}`,`Generated locally: ${new Date().toISOString()}`,`Status: ${getCheckStatus(def).label}`,''];if(cards.length)cards.forEach((card,index)=>{lines.push(`${index+1}. ${card.querySelector('h3')?.textContent||'Finding'}`,card.querySelector('p')?.textContent||'',card.querySelector('.evidence-state')?.textContent?.trim()||'Detected · not reviewed','');});else lines.push('No findings in the current view.');downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_${def.id}_check_${buildDateStamp()}.txt`,new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));}
function buildDefinedTermsGlossaryHtml(){const terms=Object.values(state.definedTerms||{}).sort((a,b)=>String(a.term||'').localeCompare(String(b.term||'')));return `<!doctype html><html><head><meta charset="utf-8"><title>Defined Terms Glossary</title><style>body{font-family:Arial,sans-serif;color:#17233b;max-width:1050px;margin:36px auto;padding:0 28px;line-height:1.5}h1{font-family:Georgia,serif;margin-bottom:4px}.meta{color:#59667a;margin-bottom:24px}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #d9dee8}th{background:#f3f6f8;font-size:12px;text-transform:uppercase;letter-spacing:.04em}td:first-child{width:18%;font-weight:700}small{color:#697386}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Defined Terms Glossary</h1><div class="meta">${escapeHtml(state.documentMeta.fileName||'Untitled contract')} · generated locally · ${escapeHtml(new Date().toLocaleString())}</div><table><thead><tr><th>Term</th><th>Definition</th><th>Dependencies / use</th><th>Source</th></tr></thead><tbody>${terms.map(t=>{const node=(state.definitionGraph?.nodes||[]).find(item=>item.term===t.term);return `<tr><td>${escapeHtml(t.term||'')}</td><td>${escapeHtml((t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||'Definition not captured')}</td><td>${escapeHtml(node?.dependencies?.join(', ')||'No dependency detected')}<br><small>${t.usedInClauseIds?.length||0} uses${node?.usedBeforeDefinition?.length?` · ${node.usedBeforeDefinition.length} before definition`:''}</small></td><td>${escapeHtml((state.clauses||[]).find(c=>c.id===t.definedInClauseId)?.number||t.definedInClauseId||'Source not located')}<br><small>${escapeHtml(t.definitionType||'detected')} · ${escapeHtml(t.scope||'global')}</small></td></tr>`;}).join('')}</tbody></table><p><small>Generated from detected terms. Verify definitions, dependencies, usage and source references before external use.</small></p></body></html>`;}
function exportDefinedTermsGlossary(){if(!Object.keys(state.definedTerms||{}).length){showToast('No defined terms are available to export.','warn');return;}downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_defined_terms_glossary_${buildDateStamp()}.html`,new Blob([buildDefinedTermsGlossaryHtml()],{type:'text/html;charset=utf-8'}));}
function renderResolveWorkspace(){
  if(!els.resolveWorkspace)return;recomputeOpenLoops();
  const clauses=getReviewableClauses();const groups=[
    ['Decisions',clauses.filter(c=>!getClauseDecision(c.id).type),'Choose a legal disposition'],
    ['Business questions',clauses.filter(c=>getClauseDecision(c.id).type==='need-input'),'Obtain missing commercial or operational input'],
    ['Approvals',clauses.filter(c=>getClauseDecision(c.id).type==='escalate'&&String(state.clauseApprovalStatus?.[c.id]||'')!=='Approved'),'Secure required approval'],
    ['Negotiation',clauses.filter(c=>['Open','Counterparty reviewing','Discussed'].includes(state.clauseNegotiationStatus?.[c.id])),'Close the current negotiation point']
  ];const total=groups.reduce((sum,group)=>sum+group[1].length,0);
  els.resolveWorkspace.innerHTML=`<div class="resolve-home"><header class="resolve-hero"><div><span class="eyebrow">Resolve</span><h1>Open work, grouped by the decision needed</h1><p>This canvas shows only unresolved human dependencies. It does not repeat the clause review.</p></div><div class="resolve-summary"><strong>${total}</strong><span>open item${total===1?'':'s'}</span></div></header><div class="resolve-list">${groups.map(([title,items,description])=>`<section class="resolve-group"><div class="resolve-group-head"><div><h2>${title}</h2><p>${description}</p></div><span>${items.length}</span></div>${items.length?items.map(c=>{const d=getClauseDecision(c.id);return`<details class="resolve-row"><summary><span><strong>${escapeHtml(c.number||c.heading||'Clause')}</strong><small>${escapeHtml(c.heading||c.type||'Contract provision')}</small></span><span>${escapeHtml(d.type?mapDecisionTypeToLegacyPosition(d.type):'Not decided')}</span></summary><div class="resolve-row-body"><p>${escapeHtml(truncateWords(c.body||'',34))}</p><div class="resolve-actions"><button type="button" class="btn btn-sm" data-resolve-open="${escapeHtml(c.id)}">Open clause</button></div></div></details>`;}).join(''):`<div class="resolve-empty">No open ${title.toLowerCase()}.</div>`}</section>`).join('')}</div><footer class="resolve-footer"><button type="button" class="btn" data-stage-jump="decide">Return to review</button><button type="button" class="btn btn-primary" data-stage-jump="close">Prepare outputs</button></footer></div>`;
}
function applyChecksWorkspace(){const stage=getActiveWorkflowStage(),checks=stage==='intake',resolve=stage==='prepare';els.checksWorkspace?.classList.toggle('hidden',!checks);els.resolveWorkspace?.classList.toggle('hidden',!resolve);els.workspace?.classList.toggle('hidden',checks||resolve);els.cockpitStrip?.classList.toggle('checks-hidden',checks||resolve);els.cockpitSummaryBar?.classList.toggle('checks-hidden',checks||resolve);if(checks)renderChecksWorkspace();if(resolve)renderResolveWorkspace();}
function renderAll(){if(rerenderFrame) flushScheduledRerender();applyTheme();applyWorkflowMode();applyChecksWorkspace();applyFocusMode();updateNavigatorModeUI();normalizeReviewData();scheduleRerender({header:true,cockpit:true,navigator:true,clause:true,rightPanel:true,restore:true},'render-all');requestAnimationFrame(()=>{renderCompatibilityBanner();renderMinimapRail();updateMobileUI();});}
function renderAfterClauseChange(){renderHeader();renderClauseList();renderClauseView();renderActiveRightPanel();renderMinimapRail();}
function renderAfterContentChange(){normalizeReviewData();calculateAllRiskScores();renderTargeted({header:true,cockpit:true,navigator:true,rightPanel:true,clause:state.selectedClauseId===OVERVIEW_ID});renderMinimapRail();}
function showApp(){els.landing.classList.add('hidden');els.app.classList.remove('hidden');applyWorkflowMode();updateCockpitCollapseUI();updateMobileUI();}
function closeAllModals(){
  document.querySelectorAll('.modal-overlay').forEach(m => closeModal(m,{restoreFocus:false}));
  document.body.classList.remove('modal-open');
}

function showLanding(force=false){
flushClauseTime();
if(!force && state.clauses.length && !window.confirm('Return to the landing page? A recovery copy will be saved before another document replaces this review.')) return;
els.app?.classList.add('hidden');
els.landing?.classList.remove('hidden');
closeAllModals();
renderRestoreBanner();
const focusedStart=document.getElementById('focusedStartCheck');if(focusedStart)focusedStart.value=state.preferredStartCheck||'review-items';const picker=document.querySelector('.focused-start-picker');if(picker)picker.hidden=state.startIntent!=='checks';
document.querySelectorAll('[data-start-intent]').forEach(item=>item.classList.toggle('active',item.dataset.startIntent===(state.startIntent||'checks')));
if(state.clauses.length) clearLandingIntakeForNewMatter();
}

/* removed duplicate legacy definition: renderHeader */
function countFlags(){return state.issues.duplicateDefinitions.length+(state.issues.definitionQuality||[]).length+state.issues.undefinedCapitalizedTerms.length+state.issues.unusedDefinitions.length+(state.definitionGraph?.issues||[]).length+state.placeholders.filter(p=>!p.resolved).length+state.issues.crossReferenceBreaks.length+(state.issues.semanticCrossReferenceWarnings||[]).length+state.issues.consistency.length+state.issues.missingStandardClauses.length+state.issues.unresolvedCrossReferencedDefinitions.length+(state.issues.subjectiveStandards||[]).length+(state.issues.asymmetries||[]).length;}
function clauseFlagCount(c){return state.placeholders.filter(p=>p.clauseId===c.id&&!p.resolved).length+state.issues.duplicateDefinitions.filter(d=>d.firstClauseId===c.id||d.secondClauseId===c.id).length+state.issues.unusedDefinitions.filter(d=>d.definedInClauseId===c.id).length+(state.definitionGraph?.issues||[]).filter(d=>d.clauseId===c.id).length+state.issues.crossReferenceBreaks.filter(d=>d.clauseId===c.id).length+(state.issues.semanticCrossReferenceWarnings||[]).filter(d=>d.clauseId===c.id).length;}

/* -- Filtering -- */
function syncFilterUI(){
const f=state.filters||{content:'all',review:'all'};
document.querySelectorAll('.seg-btn').forEach(b=>{const g=b.dataset.group||'content';const av=g==='review'?f.review:f.content;b.classList.toggle('active',!!b.dataset.filter&&b.dataset.filter===av);});
const fs=document.querySelector('.filter-summary');if(fs){const ha=f.review&&!['all','action-required','unreviewed'].includes(f.review);const hc=f.content&&!['all','notes'].includes(f.content);fs.classList.toggle('active',ha||hc);const ec=Number(ha)+Number(hc);fs.textContent=ec?`⚙ Filters (${ec})`:'⚙ Filters';}
}

function getFilteredClausesLegacy(overrideFilters){
if (state.activeTermFilter) {
  const termHits = state.clauseTermHits || {};
  return (state.clauses||[]).filter(c => (termHits[c.id] || []).includes(state.activeTermFilter));
}
const q=state.searchQuery;const af=overrideFilters&&typeof overrideFilters==='object'?{content:overrideFilters.content||'all',review:overrideFilters.review||'all'}:(state.filters||{content:'all',review:'all'});
const mi=getMyInboxInitials();const brIds=new Set((state.issues.crossReferenceBreaks||[]).map(i=>i.clauseId));
const changedOnly=!!state.compareOnlyMode; const changedSet=getActiveChangedClauseIdSet();
return state.clauses.filter(c=>{ if(changedOnly && !changedSet.has(c.id)) return false;
const hasN=state.notes.some(n=>n.clauseId===c.id);const hasF=clauseFlagCount(c)>0;const hasT=(state.clauseTags[c.id]||[]).length>0;
const rs=state.clauseReviewStatus[c.id]||'';const pos=state.clausePositions[c.id]||'';const unrev=!rs||rs==='Not reviewed';const isEsc=rs==='Escalated'||pos==='Escalate';
const risk=state.clauseRiskScores[c.id]||'Low';const hasIss=hasF||hasT||hasN||risk==='High';const ar=isEsc||risk==='High'||hasIss;
const hasRI=(state.clauseRoutingTags[c.id]||[]).some(t=>t!=='Legal Only')||(!!mi&&state.notes.some(n=>n.clauseId===c.id&&String(n.owner||'').toUpperCase()===mi&&n.businessCall));
if(af.content==='notes'&&!hasN)return false;if(af.content==='flagged'&&!hasF)return false;if(af.content==='tagged'&&!hasT)return false;if(af.content==='broken-xrefs'&&!brIds.has(c.id))return false;
if(af.review==='unreviewed'&&!unrev)return false;if(af.review==='action-required'&&!ar)return false;if(af.review==='escalated'&&!isEsc)return false;if(af.review==='high-risk'&&risk!=='High')return false;if(af.review==='has-issues'&&!hasIss)return false;if(af.review==='my-inbox'&&!hasRI)return false;
if(!q)return true;
const termHit=Object.values(state.definedTerms).some(t=>(t.definedInClauseId===c.id||t.usedInClauseIds.includes(c.id))&&t.term.toLowerCase().includes(q));
const noteHit=state.notes.some(n=>n.clauseId===c.id&&`${n.type} ${n.text}`.toLowerCase().includes(q));
return `${c.number} ${c.heading} ${c.body}`.toLowerCase().includes(q)||termHit||noteHit||pos.toLowerCase().includes(q)||rs.toLowerCase().includes(q);
});
}
function getNavigableClauseIds(){const cls=getFilteredClauses().filter(c=>state.navigatorMode!=='triage'||getTriageReasons(c).length);const ids=cls.map(c=>c.id);return state.clauses.length?[OVERVIEW_ID,...ids]:[];}
function getTriageReasons(c){
const r=[];const risk=state.clauseRiskScores[c.id]||'Low';const rs=state.clauseReviewStatus[c.id]||'Not reviewed';const pos=state.clausePositions[c.id]||'';const up=state.placeholders.filter(p=>p.clauseId===c.id&&!p.resolved).length;const hd=!!((state.clauseRecommendations[c.id]||'').trim()||(state.clauseFallbacks[c.id]||'').trim());const routing=getClauseRouteTargets(c.id);
if(risk==='High')r.push('High risk');if(rs==='Escalated'||pos==='Escalate')r.push('Escalated');if(up)r.push(`${up} placeholder${up===1?'':'s'}`);if(routing.some(x=>x!=='Legal Only'))r.push('Routing');if(!hd&&(pos==='Seek amendment'||pos==='Reject'||risk==='High'))r.push('No drafting');
return r;
}

/* v6.0: Simplified clause navigator (legacy, superseded by queue-aware implementation below) */
function renderClauseListLegacy(){bumpRenderCount('navigator');
const q=state.searchQuery;updateNavigatorModeUI();syncFilterUI();
const base=getFilteredClauses();const filtered=state.navigatorMode==='triage'?getSortedTriageClauses(base.filter(c=>getTriageReasons(c).length)):base;
const overview=state.clauses.length?`<button class="clause-item overview-item ${state.selectedClauseId==='__overview__'?'active':''}" style="--indent:0px" data-clause-id="__overview__"><div class="clause-meta-line"><span>${state.navigatorMode==='triage'?'Triage':'Overview'}</span></div><div class="clause-title">${state.navigatorMode==='triage'?'Action Required View':'⌂ Document Overview'}</div></button>`:'';
const empty=state.navigatorMode==='triage'&&!filtered.length?'<div class="navigator-empty">No action-required clauses.</div>':'';

const termBanner = state.activeTermFilter ? `<div class="term-filter-banner">Showing uses of <strong>${escapeHtml(state.activeTermFilter)}</strong><button type="button" class="link-btn" id="clearTermFilterBtn">Clear ✕</button></div>` : '';
els.clauseList.innerHTML=termBanner+overview+filtered.map(c=>{
const nc=state.notes.filter(n=>n.clauseId===c.id).length;const fc=clauseFlagCount(c);
const rs=state.clauseReviewStatus[c.id]||'Not reviewed';const pos=state.clausePositions[c.id]||'';
const risk=state.clauseRiskScores[c.id]||'Low';
const riskClass=slugifyStatus(risk);const rsIcon=REVIEW_STATUS_ICONS[rs]||'';
const posColor=POSITION_COLORS[pos]||'';const combined=(nc||0)+(fc||0);
const triageReasons=getTriageReasons(c);
const agendaMark=isInAgenda(c.id)?'<span class="nav-icon" title="In micro-agenda">≣</span>':'';
const attn=getAttentionScore(c.id);
const bookMark=isClauseBookmarked(c.id)?'<span class="nav-icon" title="Bookmarked">★</span>':'';
const snoozeMark=isClauseSnoozed(c.id)?'<span class="nav-icon" title="Ignored for session">⏸</span>':'';
const changedMark=getActiveChangedClauseIdSet().has(c.id)?'<span class="nav-icon changed-mark" title="Changed against selected baseline">Δ</span>':'';
const attnMark=attn>=4?`<span class="nav-icon attention-icon" title="High attention">!</span>`:attn>=2?`<span class="nav-icon attention-icon muted" title="Needs attention">•</span>`:'';
const hasPlaceholder = state.placeholders.some(p => p.clauseId === c.id && !p.resolved);
const hasBrokenXref = state.issues.crossReferenceBreaks.some(b => b.clauseId === c.id);
const hasNoFallback = ['Seek amendment','Reject','Escalate'].includes(pos) && hasMissingFallbackForClause(c.id);
const clauseHealthDots = [hasPlaceholder ? '<span class="health-dot dot-placeholder" title="Unresolved placeholder">▣</span>' : '', hasBrokenXref ? '<span class="health-dot dot-xref" title="Broken cross-reference">⚡</span>' : '', hasNoFallback ? '<span class="health-dot dot-fallback" title="No fallback captured">△</span>' : ''].filter(Boolean).join('');
return `<button class="clause-item ${c.id===state.selectedClauseId?'active':''} ${state.navigatorMode==='triage'?'triage-item':''} ${getActiveChangedClauseIdSet().has(c.id)?'changed-clause':''}" style="--indent:${state.navigatorMode==='triage'?0:Math.min((c.level-1)*12,24)}px" data-clause-id="${escapeHtml(c.id)}" data-risk="${riskClass}"> <div class="clause-meta-line"><span>${escapeHtml(c.number)}</span><span class="nav-indicators">${changedMark}${attnMark}${bookMark}${agendaMark}${snoozeMark}${rsIcon?`<span class="nav-icon nav-review-icon" title="${escapeHtml(rs)}">${rsIcon}</span>`:''}${posColor?`<span class="nav-dot" style="background:${posColor}" title="${escapeHtml(pos)}"></span>`:''}${combined?`<span class="nav-count" title="${nc} notes, ${fc} flags">${combined}</span>`:''}${clauseHealthDots}</span></div> <div class="clause-title">${highlightHtml(escapeHtml(c.heading),q)}</div> ${state.navigatorMode==='triage'&&triageReasons.length?`<div class="triage-reasons"><span class="triage-pill risk">Lev ${getNegotiationLeverageScore(c)}</span>${triageReasons.slice(0,2).map(r=>`<span class="triage-pill">${escapeHtml(r)}</span>`).join('')}</div>`:''} </button>`;
}).join('')+empty;
els.clauseList.querySelector('#clearTermFilterBtn')?.addEventListener('click',()=>{state.activeTermFilter='';renderClauseList();});
}

/* -- Term tooltips & highlights -- */
function getTermPreviewData(termName){const t=state.definedTerms?.[termName];if(!t)return null;const def=((t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||'Definition not captured.');const uc=Array.isArray(t.usedInClauseIds)?t.usedInClauseIds.length:0;return{term:t.term,definition:def,usageCount:uc,earlyUse:termHasEarlyUse(t)};}
function ensureTermTooltip(){let n=document.getElementById('termTooltip');if(!n){n=document.createElement('div');n.id='termTooltip';n.className='term-tooltip-floating hidden';document.body.appendChild(n);}return n;}
function positionFloatingTooltip(a,t){if(!a||!t)return;t.classList.remove('hidden');t.style.left='0px';t.style.top='0px';const r=a.getBoundingClientRect();const tr=t.getBoundingClientRect();let l=r.left+window.scrollX+(r.width/2)-(tr.width/2);l=Math.max(window.scrollX+12,Math.min(l,window.scrollX+window.innerWidth-tr.width-12));let top=r.top+window.scrollY-tr.height-10;if(top<window.scrollY+12)top=r.bottom+window.scrollY+10;t.style.left=`${l}px`;t.style.top=`${top}px`;}
function showTermTooltip(a){const t=a?.dataset?.term;if(!t)return;const d=getTermPreviewData(t);if(!d)return;const tt=ensureTermTooltip();tt.innerHTML=`<div class="term-tooltip-title">${escapeHtml(d.term)}</div><div class="term-tooltip-def">${escapeHtml(d.definition)}</div><div class="term-tooltip-meta">${d.usageCount} use${d.usageCount===1?'':'s'}${d.earlyUse?' * Used before definition':''}</div>`;positionFloatingTooltip(a,tt);}
function hideTermTooltip(){const t=document.getElementById('termTooltip');if(t)t.classList.add('hidden');}
function openFocusedCheck(checkId,options={}){state.activeCheck=checkId||'review-items';state.activeConcept=options.concept||'';state.checkFilter=options.filter||'all';setWorkflowStage('intake',{preserveTab:false});state.activeTermFilter=options.term||'';renderChecksWorkspace();saveSessionReturn();}
function bindTermChipInteractions(container = document) {const firstChip = container.querySelector('.term-chip'); if (!hasSeenHint(HINT_KEYS.TERM_CHIP) && firstChip) showHint(firstChip, 'Click any highlighted term to see its definition and find all uses across the contract.', HINT_KEYS.TERM_CHIP);container.querySelectorAll('.term-chip').forEach(n=>{if(n.dataset.boundTermChip==='true')return;n.dataset.boundTermChip='true';n.addEventListener('click',()=>{const term=n.dataset.term;if(term)showToast(`Opening the defined-term check for "${term}"`,'info');openFocusedCheck('definitions',{term});});n.addEventListener('mouseenter',()=>showTermTooltip(n));n.addEventListener('mouseleave',hideTermTooltip);n.addEventListener('focus',()=>showTermTooltip(n));n.addEventListener('blur',hideTermTooltip);});}

/* v6.0: Use pre-computed term hits for highlight rendering */
function highlightDefinedTermsInSafeHtml(safeHtml,clauseId){
const src=String(safeHtml||'');if(!src)return src;
const hitNames=state.clauseTermHits?.[clauseId]||Object.keys(state.definedTerms);
if(!hitNames.length)return src;
const terms=hitNames.map(n=>state.definedTerms[n]).filter(Boolean).sort((a,b)=>b.term.length-a.term.length);
if(!terms.length)return src;
/* One canonical variant map keeps highlighting, tooltips and usage navigation in
   agreement. Plurals and possessives display exactly as drafted but resolve to
   the underlying defined label. Longest variants win, so nested labels such as
   "Personal Data" are not consumed by the shorter "Data". */
const termLookup=new Map();
for(const item of terms){const canonical=String(item.term||'').trim();if(!canonical)continue;const variants=/s$/i.test(canonical)?[canonical,`${canonical}'s`,`${canonical}'`]:[canonical,`${canonical}s`,`${canonical}es`,`${canonical}'s`,`${canonical}'`];for(const variant of variants)termLookup.set(variant.toLocaleLowerCase(),canonical);}
const alternatives=[...termLookup.keys()].sort((a,b)=>b.length-a.length).map(escapeRegExp).join('|');
if(!alternatives)return src;
let combined;
try{combined=new RegExp(`(^|[^\\p{L}\\p{N}_])(${alternatives})(?=$|[^\\p{L}\\p{N}_])`,'giu');}
catch{combined=new RegExp(`(^|[^A-Za-z0-9_])(${alternatives})(?=$|[^A-Za-z0-9_])`,'gi');}
/* Work on DOM text nodes, not an HTML string. Sequential string replacement can
   accidentally match inside a chip inserted by an earlier term and corrupt the
   rendered clause. A single combined expression scans each original text node
   once, avoiding a terms-by-cursor loop on large definitions schedules. */
const template=document.createElement('template');template.innerHTML=src;
const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);
const textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);
textNodes.forEach(node=>{
  if(node.parentElement?.closest('.term-chip'))return;
  const value=node.nodeValue||'';if(!value.trim())return;
  const fragment=document.createDocumentFragment();let cursor=0;let replaced=false;combined.lastIndex=0;
  let match;
  while((match=combined.exec(value))){
    const prefix=match[1]||'';const found=match[2]||'';
    const start=match.index+prefix.length;const end=start+found.length;
    const termText=termLookup.get(found.toLocaleLowerCase())||found;
    if(/^[A-Z]/.test(termText)&&found.charAt(0)!==termText.charAt(0))continue;
    if(start>cursor)fragment.append(document.createTextNode(value.slice(cursor,start)));
    const chip=document.createElement('span');chip.className='term-chip';chip.dataset.term=termText;chip.title=(getTermPreviewData(termText)?.definition||'').slice(0,120);chip.textContent=value.slice(start,end);fragment.append(chip);
    cursor=end;replaced=true;
  }
  if(!replaced)return;
  if(cursor<value.length)fragment.append(document.createTextNode(value.slice(cursor)));
  node.replaceWith(fragment);
});
return template.innerHTML;
}

function highlightTermRichText(text=''){return highlightDefinedTermsInSafeHtml(escapeHtml(String(text)),null);}
function linkCrossReferencesInSafeHtml(safeHtml){
const parts=String(safeHtml||'').split(/(<[^>]+>)/g);
return parts.map(p=>{if(!p||p.startsWith('<'))return p;return p.replace(/\b((?:Clause|Section|Article|Paragraph|Part)\s+[A-Z0-9]+(?:\.[A-Z0-9]+)*(?:\([a-z0-9ivx]+\))*)\b/gi,(match,ref)=>{const tc=findClauseByReference(ref,state.clauses||[]);if(!tc)return match;return `<span class="xref-chip" data-target-clause-id="${escapeHtml(tc.id)}" title="Click to peek, Shift+click to jump">${ref}</span>`;});}).join('');
}

/* -- Diff -- */
function wordDiffTokens(a,b){
const ta=String(a||'').split(/(\s+)/);const tb=String(b||'').split(/(\s+)/);
const maxCells=(ta.length+1)*(tb.length+1);
if(maxCells>2_000_000){
  return [{type:'delete',text:String(a||'')},{type:'insert',text:String(b||'')}];
}
const dp=Array(ta.length+1).fill(null).map(()=>Array(tb.length+1).fill(0));
for(let i=1;i<=ta.length;i++)for(let j=1;j<=tb.length;j++)dp[i][j]=ta[i-1]===tb[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
const out=[];let i=ta.length,j=tb.length;
while(i>0&&j>0){
  if(ta[i-1]===tb[j-1]){out.unshift({type:'equal',text:ta[i-1]});i--;j--;}
  else if(dp[i-1][j]>=dp[i][j-1]){out.unshift({type:'delete',text:ta[i-1]});i--;}
  else{out.unshift({type:'insert',text:tb[j-1]});j--;}
}
while(i>0){out.unshift({type:'delete',text:ta[i-1]});i--;}
while(j>0){out.unshift({type:'insert',text:tb[j-1]});j--;}
return out;
}
function getClauseRedlineHtml(clause){const rec=state.clauseRecommendations[clause.id]||'';if(!rec.trim())return '';const ck=`${clause.body}|||${rec}`;const cached=state.clauseRedlineCache[clause.id];if(cached&&cached.key===ck)return cached.html;const html=wordDiffTokens(clause.body||'',rec).map(p=>{if(p.type==='equal')return escapeHtml(p.text);if(p.type==='delete')return `<span class="diff-delete">${escapeHtml(p.text)}</span>`;return `<span class="diff-insert">${escapeHtml(p.text)}</span>`;}).join('');state.clauseRedlineCache[clause.id]={key:ck,html};return html;}
function renderDeterministicClauseExplanation(clause){const obligations=(state.obligations||[]).filter(item=>item.clauseId===clause.id),concepts=(state.legalConceptEvidence?.forClause?.(clause.id)||[]),propositions=(state.legalPropositions||[]).filter(item=>item.clauseId===clause.id);if(!obligations.length&&!concepts.length&&!propositions.length)return'';const obligationRows=obligations.slice(0,3).map(item=>{const actor=item.party||'A party',action=ANALYSIS_CORE.excerpt?.(item.actionObject||item.action||'',190)||truncateWords(item.actionObject||item.action||'',28),timing=item.deadline?` Timing: ${item.deadline}.`:item.timingCharacterization?` Timing: ${item.timingCharacterization}.`:'',condition=item.condition?` Condition: ${ANALYSIS_CORE.excerpt?.(item.condition,120)||item.condition}.`:'';return `<li><strong>${escapeHtml(actor)}</strong> — ${escapeHtml(action)}${escapeHtml(timing)}${escapeHtml(condition)}</li>`;}).join('');const propositionRows=propositions.slice(0,5).map(item=>`<li><strong>${escapeHtml(item.actor||'Party')}</strong> — ${escapeHtml(item.polarity==='prohibited'?'is restricted from':item.modality||'holds')} ${escapeHtml(item.concept||'a contractual right')}${item.condition?` · ${escapeHtml(truncateWords(item.condition,16))}`:''}</li>`).join('');const conceptRows=concepts.slice(0,4).map(item=>`<li><strong>${escapeHtml(LEGAL_CONCEPT_LABELS[item.concept]||item.concept)}</strong> — ${escapeHtml(item.mechanism||'related provision')} <span class="inline-subtle">(${escapeHtml(item.matchStrength||'Possible')})</span></li>`).join('');return `<details class="clause-explainer"><summary>Plain-English clause map</summary><div class="mini">Built only from detected actors, actions, timing and shared legal-concept evidence. Verify it against the clause.</div>${obligationRows?`<div class="mini-label">Who must do what</div><ul>${obligationRows}</ul>`:''}${propositionRows?`<div class="mini-label">Who holds which right</div><ul>${propositionRows}</ul>`:''}${conceptRows?`<div class="mini-label">Legal issues touched</div><ul>${conceptRows}</ul>`:''}</details>`;}

/* -- Clause view (v6.0: decluttered read->decide->record) -- */

function renderCompactIssueSummaryHtml(clause){ const card=deriveIssueCard(clause)||{}; const cid=clause?.id; if(!cid) return ''; const route=getClauseRouteTargets(cid); return `<div class="compact-issue-summary"><div class="mini"><strong>${escapeHtml(card.theme||'Issue summary')}</strong></div><div class="mini">${escapeHtml(card.riskSummary||'No major issue summary captured.')}</div><div class="mini">Position: ${escapeHtml(card.position||state.clausePositions[cid]||'Not set')} • Route: ${escapeHtml(route.join(' • ')||'Legal Only')} • Stage: ${escapeHtml(card.stage||getIssueStage(cid)||'Open')}</div></div>`; }
function renderClauseFindingsInline(clause){const cid=clause?.id;if(!cid)return'';const body=String(clause.body||'');const undefinedTerms=(state.issues?.undefinedCapitalizedTerms||[]).filter(i=>body.includes(i.term));const xrefs=(state.issues?.crossReferenceBreaks||[]).filter(i=>i.clauseId===cid);const fills=(state.placeholders||[]).filter(i=>i.clauseId===cid&&!i.resolved&&!i.ignored);const deadlines=(state.deadlines||[]).filter(i=>i.clauseId===cid);const subjective=(state.issues?.subjectiveStandards||[]).filter(i=>i.clauseId===cid);const asym=(state.issues?.asymmetries||[]).filter(i=>i.clauseId===cid);const findings=[...undefinedTerms.map(i=>({label:`Undefined term: ${i.term}`,tool:'terms'})),...xrefs.map(i=>({label:`Broken reference: ${i.reference}`,tool:'refs'})),...fills.map(i=>({label:`Unfilled blank: ${i.text}`,tool:'fills'})),...deadlines.map(i=>({label:`Deadline: ${i.expression}`,tool:'timeline'})),...subjective.map(i=>({label:`${i.severity||'Medium'} subjective standard`,tool:'refs'})),...asym.map(i=>({label:`${i.materiality||'Possible'} ${i.category||'one-way right'} for ${i.beneficiary}`,tool:'refs'}))];if(!findings.length){const limited=['undefinedTerms','crossReferences','placeholders','deadlines'].some(key=>state.detectorHealth?.[key]?.status==='limited');return limited?'<div class="clause-findings-inline limited"><span>Source limitation</span><strong>Some checks could not verify this clause completely.</strong></div>':'';}return `<div class="clause-findings-inline"><span>${findings.length} item${findings.length===1?'':'s'} to verify</span><div>${findings.slice(0,4).map(i=>`<button type="button" class="finding-chip" data-open-finding-tool="${escapeHtml(i.tool)}">${escapeHtml(i.label)}</button>`).join('')}</div></div>`;}

function renderFallbackQuickBar(cid) {
  if (!cid || cid === OVERVIEW_ID) return '';
  const decision = getClauseDecision(cid);
  const pos = state.clausePositions?.[cid] || '';
  const needsFallback = ['Seek amendment', 'Reject', 'Escalate', 'Accept with changes', 'seek-amendment', 'reject', 'escalate', 'accept-with-changes'].includes(pos || decision.type);
  if (!needsFallback) return '';
  const hasFallback = !!(decision.fallback || state.clauseFallbacks?.[cid] || '').trim();
  if (hasFallback) return '';
  return `<div class="fallback-quick-bar"><span class="mini warn-text">No fallback captured for this position.</span><button type="button" class="btn btn-xs" data-action="show-drafting-fields">Add fallback</button></div>`;
}


function jumpToNextChangedClause() {
  const changedIds = [...getActiveChangedClauseIdSet()];
  if (!changedIds.length) { showToast('No changed clauses in this comparison', 'info'); return; }
  const current = state.selectedClauseId;
  const allIds = (state.clauses || []).map(c => c.id);
  const currentIdx = allIds.indexOf(current);
  const next = changedIds.find(id => allIds.indexOf(id) > currentIdx) || changedIds[0];
  if (next) jumpToClause(next);
}

function renderPlaybookBrief(){
  const pkg=getActivePlaybookPackage();
  if(!pkg){const available=getCompatibleInactivePlaybook();return available?`<section class="tool-card guided-card playbook-brief"><div class="guided-card-head"><div><div class="mini-label">Playbook scan</div><h3>Not active</h3></div><span class="clause-pill">${escapeHtml(available.role||'Any role')} perspective</span></div><p class="mini">Activate ${escapeHtml(available.name||available.packageId)} after confirming your matter perspective. Until then, no automatic playbook silence should be treated as clearance.</p><button type="button" class="btn btn-sm" data-overview-tab="strategy">Open playbook repository</button></section>`:'';}
  const rows=getReviewableClauses().map(clause=>({clause,candidates:getPlaybookCandidates(clause)})).filter(row=>row.candidates.length);
  const deviations=rows.reduce((count,row)=>count+(row.candidates[0]?.deviations?.length||0),0);
  const uncertain=getReviewableClauses().length-rows.length;
  const top=rows.filter(row=>row.candidates[0]?.deviations?.length).sort((a,b)=>(b.candidates[0].deviations.length-a.candidates[0].deviations.length)||(b.candidates[0].score-a.candidates[0].score)).slice(0,4);
  const completeness=getPlaybookCompleteness(rows);
  return `<section class="tool-card guided-card playbook-brief"><div class="guided-card-head"><div><div class="mini-label">Playbook scan</div><h3>${escapeHtml(pkg.name||pkg.packageId)} v${escapeHtml(pkg.version)}</h3><p class="mini">${escapeHtml(pkg.status||'Operational guidance — verify against the source playbook.')}</p></div><span class="clause-pill">${rows.length} relevant area${rows.length===1?'':'s'}</span></div><div class="guided-summary-grid compact"><div class="guided-summary-card"><span>Operational modules</span><strong>${completeness.operationalTotal}/${completeness.sourceTotal}</strong></div><div class="guided-summary-card"><span>Deviation prompts</span><strong>${deviations}</strong></div><div class="guided-summary-card"><span>No automatic match</span><strong>${uncertain}</strong></div><div class="guided-summary-card"><span>Relevant modules considered</span><strong>${completeness.considered}/${completeness.total}</strong></div></div>${top.length?`<div class="guided-priority-list">${top.map(({clause,candidates})=>{const match=candidates[0];return `<button type="button" class="guided-priority-item" data-risk-clause-id="${escapeHtml(clause.id)}"><span class="badge">${escapeHtml(match.module.id)}</span><span><strong>${escapeHtml(clause.number||'')} ${escapeHtml(clause.heading||'')}</strong><small>${escapeHtml(match.deviations[0].label)}</small></span><span>Review →</span></button>`;}).join('')}</div>`:'<p class="mini">No material automatic deviation was established. Manual “Check playbook” remains available on every clause.</p>'}${completeness.items.length?`<details class="playbook-completeness"><summary>Playbook completeness · ${completeness.considered}/${completeness.total} relevant modules considered</summary><p class="mini">Operational guidance is loaded for ${completeness.operationalTotal} of ${completeness.sourceTotal} indexed source modules. The remaining ${completeness.sourceGap} stay visible as a coverage boundary rather than being treated as checked.</p><div class="summary-list">${completeness.items.map(item=>`<div class="summary-item"><span><strong>${escapeHtml(item.moduleId)}</strong> ${escapeHtml(item.title)}</span><span class="summary-meta">${escapeHtml(item.status)}</span></div>`).join('')}</div></details>`:''}<p class="mini">Automatic matching is a routing aid, not a conclusion. Review the exact source and confirm any module you rely on.</p></section>`;
}

function getPlaybookCompleteness(precomputedRows=null){
  const pkg=getActivePlaybookPackage();if(!pkg)return{total:0,considered:0,items:[]};
  const rows=precomputedRows||getReviewableClauses().map(clause=>({clause,candidates:getPlaybookCandidates(clause)})).filter(row=>row.candidates.length);
  const moduleMap=new Map();rows.forEach(row=>row.candidates.forEach(candidate=>{if(!moduleMap.has(candidate.module.id))moduleMap.set(candidate.module.id,candidate.module);}));
  const items=[...moduleMap.values()].map(module=>{const relevantClauses=rows.filter(row=>row.candidates.some(candidate=>candidate.module.id===module.id)).map(row=>row.clause.id);const selections=relevantClauses.map(cid=>getClausePlaybookSelection(cid));const reviewed=selections.filter(selection=>selection.moduleId===module.id&&['confirmed','ignored'].includes(selection.status)).length;const total=relevantClauses.length;return{moduleId:module.id,title:module.title,reviewed,total,status:reviewed===total?`All occurrences reviewed · ${reviewed}/${total}`:reviewed?`Partially reviewed · ${reviewed}/${total}`:`Not yet considered · 0/${total}`};}).sort((a,b)=>a.moduleId.localeCompare(b.moduleId));
  const sourceTotal=(pkg.sourceModuleRegistry||[]).length;const operationalTotal=(pkg.modules||[]).length;return{total:items.length,considered:items.filter(item=>item.reviewed===item.total&&item.total>0).length,partiallyConsidered:items.filter(item=>item.reviewed>0&&item.reviewed<item.total).length,items,sourceTotal,operationalTotal,sourceGap:Math.max(0,sourceTotal-operationalTotal)};
}

function renderOverviewReviewQueue(){
  const items=getCanonicalReviewItems();
  const open=items.filter(item=>!item.disposition);
  const high=open.filter(item=>item.severity==='high').length;
  const uncertain=open.filter(item=>item.evidenceState==='uncertain').length;
  return `<button type="button" class="review-queue-banner overview-review-queue ${open.length?'has-open':'is-clear'}" data-open-review-items><span><strong>${open.length?`${open.length} review item${open.length===1?'':'s'} need attention`:'Review queue clear'}</strong><small>${high?`${high} high-priority · `:''}${uncertain?`${uncertain} could not be verified · `:''}one shared queue across source, structure, legal concepts and playbook</small></span><span>Open queue →</span></button>`;
}

function renderGuidedOverview(){
  const reviewable=getReviewableClauses();
  const decided=reviewable.filter(c=>!!getClauseDecision(c.id).type).length;
  const riskRank={High:3,Medium:2,Low:1};
  const priorities=reviewable.filter(c=>!getClauseDecision(c.id).type).sort((a,b)=>(riskRank[state.clauseRiskScores?.[b.id]||'Low']-riskRank[state.clauseRiskScores?.[a.id]||'Low'])||(riskRank[state.reviewPriorityScores?.[b.id]||'Low']-riskRank[state.reviewPriorityScores?.[a.id]||'Low'])).slice(0,3);
  const terms=extractCommercialTermsSummary();
  const termRows=[['Parties',terms.parties],['Effective date',terms.effectiveDate],['Payment',terms.paymentTerms],['Liability cap',terms.liabilityCap],['Governing law',terms.governingLaw]];
  const unresolved=(state.placeholders||[]).filter(p=>!p.resolved).length;
  const broken=(state.issues?.crossReferenceBreaks||[]).length+(state.issues?.semanticCrossReferenceWarnings||[]).length;
  const missing=(state.expectedClauseCoverage?.missing||[]).length;
  const extraction=state.documentMeta?.extractionStats||{};
  const sourceWarnings=state.documentMeta?.warnings||[];
  const sourceLedger=buildSourceConfidenceLedger();
  const degradedSource=sourceLedger.status!=='strong';
  const sourceConfirmed=!hasUnconfirmedDegradedSource();
  return `<div class="guided-overview">
    <section class="guided-hero"><div><div class="clause-kicker">Analyze</div><h1 class="clause-heading">Contract snapshot</h1><p class="mini">Confirm the facts and signals below, then work through the substantive-clause queue.</p></div><button id="startGuidedReviewBtn" class="btn btn-primary" type="button">${decided?'Continue review':'Start review'} →</button></section>
    <div class="guided-summary-grid"><div class="guided-summary-card"><span>Reviewable clauses</span><strong>${reviewable.length}</strong></div><div class="guided-summary-card"><span>Decisions</span><strong>${decided}/${reviewable.length}</strong></div><div class="guided-summary-card"><span>Structural signals</span><strong>${unresolved+broken+missing}</strong></div></div>
    ${renderOverviewReviewQueue()}
    <section class="tool-card guided-card source-integrity-card ${degradedSource?'source-integrity-degraded':''}"><div class="guided-card-head"><div><div class="mini-label">Source trust</div><h3>Was the document imported completely?</h3></div><span class="clause-pill ${degradedSource&&!sourceConfirmed?'status-pill-high':'status-pill-low'}">${degradedSource?(sourceConfirmed?'Source assurance recorded':'Output blocked pending verification'):'Source coverage strong'}</span></div><div class="guided-term-list"><div class="guided-term-row"><span>Source</span><strong>${escapeHtml(String(state.documentMeta?.sourceType||'text').toUpperCase())}</strong></div><div class="guided-term-row"><span>Clauses found</span><strong>${state.clauses.length}</strong></div>${state.documentMeta?.sourceType==='docx'?`<div class="guided-term-row"><span>Paragraphs / table rows</span><strong>${Number(extraction.paragraphs||0)} / ${Number(extraction.tableRows||0)}</strong></div><div class="guided-term-row"><span>Recovered Word numbering</span><strong>${Number(extraction.directNumbered||0)} direct · ${Number(extraction.styleNumbered||0)} style-inherited</strong></div><div class="guided-term-row"><span>Strong clause boundaries represented</span><strong>${Number(state.documentMeta?.sourceIntegrity?.representedStrongBoundaries||0)} / ${Number(state.documentMeta?.sourceIntegrity?.strongBoundaryCandidates||0)}</strong></div><div class="guided-term-row"><span>Nested numbered items retained in parent clauses</span><strong>${Number(state.documentMeta?.sourceIntegrity?.nestedNumberedItems||0)}</strong></div>`:''}<div class="guided-term-row"><span>Source fingerprint</span><strong class="source-fingerprint">${escapeHtml(state.documentMeta?.sourceFingerprint||'Unavailable in this browser')}</strong></div></div>${sourceWarnings.length?`<ul class="health-breakdown mini">${sourceWarnings.map(w=>`<li>${escapeHtml(w)}</li>`).join('')}</ul>`:'<p class="mini">Confirm the clause count and first/last source blocks before relying on analysis.</p>'}${degradedSource?`<div class="source-integrity-action"><p class="mini"><strong>Review the original Word file.</strong> Check every listed limitation. Either add any material omitted text to this review or record the exact no-material-omission assurance.</p><button type="button" class="btn ${sourceConfirmed?'btn-secondary':'btn-primary'}" data-source-integrity-confirm>${sourceConfirmed?'Source assurance recorded ✓':'Verify omitted source content'}</button></div>`:''}</section>
    ${renderPlaybookBrief()}
    <section class="tool-card guided-card"><div class="guided-card-head"><div><div class="mini-label">Critical terms</div><h3>What the document says</h3></div><span class="heuristic-badge">verify against source</span></div><div class="guided-term-list">${termRows.map(([label,value])=>`<div class="guided-term-row"><span>${escapeHtml(label)}</span><strong class="${value==='Not detected'?'muted-detect':''}">${escapeHtml(value||'Not detected')}</strong></div>`).join('')}</div></section>
    <section class="tool-card guided-card"><div class="guided-card-head"><div><div class="mini-label">Review priorities</div><h3>Start here</h3></div></div>${priorities.length?`<div class="guided-priority-list">${priorities.map(c=>`<button type="button" class="guided-priority-item" data-risk-clause-id="${escapeHtml(c.id)}"><span class="badge risk-${slugifyStatus(state.clauseRiskScores?.[c.id]||'Low')}">${escapeHtml(state.clauseRiskScores?.[c.id]||'Low')}</span><span><strong>${escapeHtml(c.number||'')} ${escapeHtml(c.heading||'Untitled')}</strong><small>${escapeHtml(state.clauseRecommendations?.[c.id]||'Decision required')}</small></span><span>Open →</span></button>`).join('')}</div>`:'<p class="mini">All reviewable clauses have decisions. Move to Resolve.</p>'}</section>
    <section class="tool-card guided-card"><div class="guided-card-head"><div><div class="mini-label">Document hygiene</div><h3>Signals to verify</h3></div></div><div class="guided-signal-row"><button type="button" data-overview-tool="fills"><strong>${unresolved}</strong><span>placeholders</span></button><button type="button" data-overview-tool="refs"><strong>${broken}</strong><span>broken references</span></button><button type="button" data-overview-tab="review"><strong>${missing}</strong><span>expected clauses missing</span></button></div><p class="mini">These are pattern-based review prompts, not findings or legal opinions.</p></section>
    <details class="tool-card guided-card advanced-analysis"><summary><strong>Advanced analysis and utilities</strong><span class="mini">Terms sheet, confirmed obligations, DOCX hygiene, and excluded source blocks</span></summary>${renderCommercialTermsSheet()}${renderNegotiationThemesCard()}${renderObligationsWorkbenchCard()}${renderDocxUtilityCard()}${renderExcludedBlocksCard()}${renderRiskHeatmap()}<div class="overview-grid">${[['Source clauses',state.clauses.length],['Reviewable',reviewable.length],['Notes',state.notes.length],['Terms',Object.keys(state.definedTerms).length],['Word count',getDocumentWordCount()]].map(([l,v])=>`<div class="overview-card"><div class="overview-stat">${v}</div><div class="mini">${l}</div></div>`).join('')}</div></details>
  </div>`;
}
function renderExcludedBlocksCard(){const excluded=(state.clauses||[]).filter(c=>!isReviewableClause(c));if(!excluded.length)return'';return `<details class="tool-card compact excluded-blocks-card"><summary><strong>Excluded source blocks (${excluded.length})</strong></summary><div class="mini">Titles, contact rows and signature blocks stay out of the decision queue. Include any block the detector got wrong.</div>${excluded.slice(0,30).map(c=>{const classification=WORKFLOW_CORE.classifyReviewability?.(c)||{};return `<div class="summary-item"><span>${escapeHtml(c.number||'')} ${escapeHtml(c.heading||truncateWords(c.body||'',12))}<small>${escapeHtml(classification.reason||'excluded')}</small></span><button type="button" class="btn btn-xs" data-reviewability-include="${escapeHtml(c.id)}">Include</button></div>`;}).join('')}</details>`;}

function renderReadingDocument(){const clauses=(state.clauses||[]).filter(c=>String(c.body||c.heading||'').trim());return `<article class="reading-document"><header class="reading-document-head"><span class="eyebrow">Reading mode</span><h1>${escapeHtml(state.documentMeta.fileName||'Contract')}</h1><p>${clauses.length} document blocks · ${getDocumentWordCount()} words · terms and references remain interactive</p></header>${clauses.map(c=>`<section class="reading-clause" data-reading-clause="${escapeHtml(c.id)}"><div class="reading-clause-number">${escapeHtml(c.number||'')}</div>${c.headingDerivedFromBody?'':`<h2>${highlightDefinedTermsInSafeHtml(escapeHtml(c.heading||'Untitled clause'),c.id)}</h2>`}<div class="clause-body">${renderClauseBody(c.body||c.heading||'',c.id)}</div></section>`).join('')}</article>`;}
function renderClauseView(){ if(els.app) els.app.classList.toggle('mobile-decision-collapsed', !!state.mobileDecisionCollapsed && isMobileViewport());bumpRenderCount('clause');
const activeNoteForm = els.clauseView?.querySelector('.inline-notes-thread form');
if(state.noteFormOpen && activeNoteForm && activeNoteForm.contains(document.activeElement)){
state.pendingClauseViewRender=true;
return;
}
state.pendingClauseViewRender=false;
closeSidePeek();
if(state.focusMode){renderScopeBar(null);renderBreadcrumbBar(null);els.emptyState.classList.add('hidden');els.clauseView.classList.remove('hidden');els.clauseView.innerHTML=renderReadingDocument();bindTermChipInteractions(els.clauseView);return;}
if(state.selectedClauseId===OVERVIEW_ID){
renderScopeBar(null); renderBreadcrumbBar(null);
els.emptyState.classList.add('hidden');els.clauseView.classList.remove('hidden');
els.clauseView.innerHTML=renderGuidedOverview();
els.clauseView.querySelector('.guided-summary-grid')?.insertAdjacentHTML('afterend',`${renderUpfrontFindingsCard()}${renderExecutionCheckCard({compact:true})}${renderDealTermsConformanceCard()}`);
els.clauseView.querySelectorAll('[data-risk-clause-id]').forEach(b=>b.addEventListener('click',()=>jumpToClause(b.dataset.riskClauseId)));
els.clauseView.querySelector('#openTimelineSubBtn')?.addEventListener('click',()=>{setActiveToolsTab('timeline');});
els.clauseView.querySelector('#exportObligationsSheetBtn')?.addEventListener('click',exportObligationsCsv);
els.clauseView.querySelector('#copyDocxHygieneChecklistBtn')?.addEventListener('click',()=>copyTextToClipboard(formatDocxHygieneChecklist(),'Checklist copied'));
els.clauseView.querySelector('#openExportHubFromDocxBtn')?.addEventListener('click',openExportHubModal);
els.clauseView.querySelector('#startGuidedReviewBtn')?.addEventListener('click',()=>setMobileWorkflowStage('decide'));
els.clauseView.querySelector('[data-open-review-items]')?.addEventListener('click',()=>{state.activeCheck='review-items';state.activeConcept='';state.checkFilter='attention';setWorkflowStage('intake',{preserveTab:false});});
els.clauseView.querySelector('[data-source-integrity-confirm]')?.addEventListener('click',()=>{if(!hasUnconfirmedDegradedSource())return;openSourceAssuranceDialog();});
els.clauseView.querySelectorAll('[data-overview-tool]').forEach(btn=>btn.addEventListener('click',()=>{setActiveToolsTab(btn.dataset.overviewTool);if(isMobileViewport())openMobileRightPanel('review');}));
els.clauseView.querySelectorAll('[data-overview-tab]').forEach(btn=>btn.addEventListener('click',()=>{setActiveTab(btn.dataset.overviewTab);if(isMobileViewport())openMobileRightPanel(btn.dataset.overviewTab);}));
els.clauseView.querySelectorAll('[data-reviewability-include]').forEach(btn=>btn.addEventListener('click',()=>{state.reviewabilityOverrides[btn.dataset.reviewabilityInclude]='include';calculateAllRiskScores();scheduleAutosave({reason:'critical'});renderClauseView();renderClauseList();showToast('Block added to the review queue','info');}));
return;
}
const clause=getSelectedClause();
if(!clause){renderBreadcrumbBar(null); els.emptyState.classList.remove('hidden');els.clauseView.classList.add('hidden');return;}
renderBreadcrumbBar(clause);
els.emptyState.classList.add('hidden');els.clauseView.classList.remove('hidden');
const cid=clause.id;const risk=state.clauseRiskScores[cid]||'Low';const reviewPriority=state.reviewPriorityScores?.[cid]||'Low';
const draftOpen=!!state.draftingOpenClauseIds[cid]||Object.prototype.hasOwnProperty.call(state.clauseRecommendations,cid)||Object.prototype.hasOwnProperty.call(state.clauseFallbacks,cid)||!!state.clauseFallbackLadders?.[cid];
const pos=state.clausePositions?.[cid]||'';
const showStrategy=!!(getClauseRouteTargets(cid).length||(state.clauseCounterpartyPositions[cid]||'').trim()||(state.clauseCounterpartyNextSteps?.[cid]||'').trim()||['Accept with changes','Seek amendment','Reject','Escalate'].includes(pos));
const showDrafting=draftOpen||getSuggestedLibraryEntries(clause).length||getPlaybookMatchForClause(clause)||['Accept with changes','Seek amendment','Reject','Escalate'].includes(pos)||(risk==='High');
const nudge=getDraftingNudge(cid);
const routeTargets=getClauseRouteTargets(cid);
const reviewStatus=deriveClauseReviewStatus(cid);
const isComplex = risk === 'High' || risk === 'Medium' ||
  ['Accept with changes','Seek amendment','Reject','Escalate','Need input'].includes(pos) ||
  !!(state.clauseRecommendations[cid]||'').trim() ||
  !!(state.clauseFallbacks[cid]||'').trim() ||
  (state.notes||[]).some(n => n.clauseId === cid) ||
  getClauseRouteTargets(cid).length > 0;

const draftingOpenAttr = (isComplex && showDrafting) ? 'open' : '';
const contextOpenAttr = (isComplex && showStrategy) ? 'open' : '';
const notesOpen = state.workflowMode==='review' || state.noteFormOpen;
const simplePrompt = !isComplex ? `<div class="simple-clause-prompt">Low risk • use the canonical Decision control to accept or record another legal disposition.</div>` : '';
els.clauseView.innerHTML=` ${renderClauseContextHeader(clause)} <div class="clause-kicker">${escapeHtml(clause.number)}</div> <h1 class="clause-heading">${escapeHtml(clause.heading)}</h1> <div class="clause-meta-strip"><span class="clause-type-badge">${escapeHtml(clause.type||'General')}${clause.classificationConfidence&&clause.classificationConfidence!=='High'?` <span class="heuristic-badge" title="${escapeHtml(clause.classificationConfidence)} confidence classification — verify the clause type against the source text">${escapeHtml(clause.classificationConfidence)}</span>`:''}</span><span class="clause-pill risk-pill risk-pill-${slugifyStatus(risk)}">${escapeHtml(risk)} legal risk</span>${renderReviewPriorityBadge(reviewPriority)}<span class="secondary-risk-badges">${renderRiskCategoryBadges(cid)}</span><span class="clause-pill status-pill status-pill-${slugifyStatus(reviewStatus)}">${escapeHtml(reviewStatus)}</span>${getClauseTimeLabel(cid) ? `<span class="clause-pill time-pill" title="Time spent on this clause">${escapeHtml(getClauseTimeLabel(cid))}</span>` : ''}<button data-action="toggle-risk-narrative" class="link-btn" type="button">Why?</button></div>${renderClausePlaybookStatus(clause)} <div id="riskNarrativeWrap" class="risk-narrative-wrap hidden">${renderRiskNarrativeHtml(cid)}</div> ${isComplex ? renderCompactIssueSummaryHtml(clause) : ""} ${renderClauseBodyWrap(clause)} ${renderDecisionCard(clause)} <div class="clause-decision-bar sticky-decision-bar canonical-action-bar"><button data-action="toggle-decision-collapse" class="primary compact-btn" type="button">Decision: ${escapeHtml(mapDecisionTypeToLegacyPosition(getClauseDecision(cid).type)||'Not set')} ▾</button><button data-action="add-note" class="compact-btn" type="button">+ Note</button><button data-action="open-playbook-guidance" class="compact-btn" type="button">Check playbook</button><details class="clause-more-actions"><summary class="compact-btn">More</summary><div class="clause-more-menu"><button data-action="copy-clause" class="compact-btn link-btn" type="button">Copy clause</button><button data-action="copy-review-brief" class="compact-btn link-btn" type="button">Review brief</button><button data-action="copy-negotiation-script" class="compact-btn link-btn" type="button">Negotiation script</button><button data-action="toggle-bookmark" class="compact-btn link-btn" type="button">${isClauseBookmarked(cid)?'★ Bookmarked':'☆ Bookmark'}</button><button data-action="snooze-clause" class="compact-btn link-btn" type="button">${isClauseSnoozed(cid)?'Unsnooze':'Snooze'}</button>${getActiveChangedClauseIdSet().size > 0 ? `<button type="button" class="compact-btn link-btn" data-action="next-changed-clause">Next change ↓</button>` : ``}</div></details></div> ${renderFallbackQuickBar(cid)} ${simplePrompt} ${isComplex ? renderClauseBriefSection(cid) : ""} <details class="clause-section clause-section-notes" ${notesOpen?'open':''}><summary>Notes & working thread</summary>${renderInlineClauseNotesHtml(clause)}</details> <div class="clause-controls-block"> ${nudge?`<div class="tool-card warn drafting-nudge"><div class="mini">${escapeHtml(nudge)}</div><button class="link-btn" data-action="dismiss-drafting-nudge" type="button">Dismiss</button></div>`:''} <details class="clause-section clause-section-primary complex-only-section" ${draftingOpenAttr}> <summary>Drafting aids & checklist</summary>${renderChecklistHtml(clause)}${renderPlaybookDecisionHtml(clause)}${renderDraftingSection(clause,draftOpen)}${renderPlaybookHtml(clause)}<div class="card-actions"><button data-action="save-clause-library" class="link-btn">Save to library</button><button data-action="save-as-playbook" class="link-btn">Save as playbook</button><button data-action="toggle-compare" class="link-btn">${state.clauseCompareMode[cid]?'Hide':'Compare'}</button><button data-action="toggle-redline" class="link-btn" ${!(state.clauseRecommendations[cid]||'').trim()?'disabled':''}>${state.clauseRedlineMode[cid]?'Hide':'Redline'}</button><button data-action="open-compare-overlay" class="link-btn" ${!(state.clauseRecommendations[cid]||state.clauseFallbacks[cid]||'').trim()?'disabled':''}>Expand</button></div>${renderClauseComparisonHtml(clause)}${renderClauseRedlineHtml(clause)} </details> <details class="clause-section" ${contextOpenAttr}> <summary>Negotiation context & history</summary><div class="tool-card compact"><div class="mini"><strong>Review status:</strong> ${escapeHtml(reviewStatus)}${routeTargets.length?` • <strong>Route to:</strong> ${escapeHtml(routeTargets.join(' • '))}`:''}</div></div>${renderNegotiationContextSection(cid)}${renderReferencedByHtml(cid)}<div class="tool-card compact"><div class="panel-subhead">Negotiation rounds</div>${renderNegotiationRoundsHtml(cid)}</div><div class="tool-card compact"><div class="panel-subhead">Position history</div>${renderPositionHistoryHtml(cid)}</div><div class="tool-card compact"><div class="panel-subhead">Activity timeline</div><div class="history-timeline">${renderReviewTimelineHtml(cid)}</div></div> </details> </div>`;
  const renderedHeading=els.clauseView.querySelector('.clause-heading');if(renderedHeading)renderedHeading.innerHTML=highlightDefinedTermsInSafeHtml(escapeHtml(clause.heading),cid);
  const sourceWrap=els.clauseView.querySelector('.clause-body-wrap');sourceWrap?.insertAdjacentHTML('afterend',`${renderDeterministicClauseExplanation(clause)}${renderSourceVerification(clause)}${renderClauseFindingsInline(clause)}`);if(!isComplex&&state.clauseBriefOpenIds?.[cid])sourceWrap?.insertAdjacentHTML('afterend',renderClauseBriefSection(cid));
  bindTermChipInteractions(els.clauseView);
setupCanonicalDecisionObserver();
if (!hasSeenHint(HINT_KEYS.PLACEHOLDER_CHIP) && (state.placeholders||[]).some(p => p.clauseId === cid && !p.resolved)) { const chip = els.clauseView.querySelector('.placeholder-chip'); if (chip) showHint(chip, 'Placeholders appear as coloured chips. Click the ○ button to mark them resolved.', HINT_KEYS.PLACEHOLDER_CHIP); }
els.clauseView.querySelectorAll('[data-risk-clause-id]').forEach(b=>b.addEventListener('click',()=>jumpToClause(b.dataset.riskClauseId)));
/* Populate inline note form if open */
const form=els.clauseView.querySelector('.inline-notes-thread form');
if(form&&state.noteFormOpen)populateInlineNoteForm(form,cid);
}

function renderSelectOptions(options,current,label){return options.map(o=>`<option value="${escapeHtml(o)}" ${o===current?'selected':''}>${escapeHtml(o||label||'Not set')}</option>`).join('');}

function renderReviewPriorityBadge(level){
  return `<span class="clause-pill priority-pill priority-pill-${slugifyStatus(level||'Low')}">${escapeHtml(level||'Low')} priority</span>`;
}
function renderRiskCategoryBadges(cid){
  const cats = state.clauseRiskCategories?.[cid] || [];
  if(!cats.length) return '';
  return `<span class="risk-dimension-row">${cats.map(c=>`<span class="risk-dimension-badge ${slugifyStatus(c)}">${escapeHtml(c)}</span>`).join('')}</span>`;
}

function renderPositionButtonsHtml(current){
const defs=[['Acceptable','Accept','A'],['Accept with changes','Accept+','C'],['Seek amendment','Seek','S'],['Reject','Reject','R'],['Escalate','Escalate','']];
return `<div class="position-button-row">${defs.map(([value,label,shortcut])=>`<button type="button" class="position-btn ${current===value?'active':''} ${slugifyStatus(value)}" data-action="set-position" data-position="${escapeHtml(value)}" title="${shortcut?`Shortcut ${shortcut}`:'Set position'}" aria-label="${escapeHtml(value)}${shortcut?` (shortcut ${shortcut})`:''}">${escapeHtml(label)}${shortcut?` <kbd>${escapeHtml(shortcut)}</kbd>`:''}</button>`).join('')}<button type="button" class="position-btn ghost ${!current?'active':''}" data-action="clear-position">Clear</button></div>`;
}

function renderRiskNarrativeHtml(cid){const clause=(state.clauses||[]).find(c=>c.id===cid);const r=state.clauseRiskNarratives[cid]||[];const card=clause?deriveIssueCard(clause):null;const intel=clause?evaluateClauseIntelligence(clause):null;if(!r.length&&!card&&!intel)return '<div class="mini">No specific drivers.</div>';const response=card?.recommendation||card?.fallback||state.clausePositions?.[cid]||'Review further';const gaps=intel?.missingProtections?.length?`<div class="mini"><strong>Patterns to verify:</strong> ${escapeHtml(intel.missingProtections.slice(0,3).join(' • '))}</div>`:'';return `<div class="tool-card info compact"><div class="panel-subhead">Observed patterns <span class="heuristic-badge" title="Pattern match only — verify against the source clause">verify</span></div>${r.length?r.map(i=>`<div class="mini">• ${escapeHtml(i.text)}</div>`).join(''):'<div class="mini">No specific drivers captured.</div>'}${gaps}${intel?`<div class="mini"><strong>Match strength:</strong> ${escapeHtml(intel.confidence)} • <strong>Discussion sensitivity:</strong> ${escapeHtml(intel.likelyPushback)}</div>`:''}<div class="mini risk-response-line"><strong>Suggested review response:</strong> ${escapeHtml(response||'Review further')}</div></div>`;}
function renderRiskHeatmap(){if(!state.prefs?.optionalFeatures?.riskHeatmap)return'';return `<div class="risk-heatmap" role="list" aria-label="Clause risk map">${getReviewableClauses().map(c=>`<button role="listitem" class="${slugifyStatus(state.clauseRiskScores[c.id]||'Low')}" data-risk-clause-id="${escapeHtml(c.id)}" title="${escapeHtml(c.number||c.heading)} - ${escapeHtml(state.clauseRiskScores[c.id]||'Low')}" aria-label="Open ${escapeHtml(c.number||c.heading)}; inherent risk ${escapeHtml(state.clauseRiskScores[c.id]||'Low')}"></button>`).join('')}</div>`;}
function renderClauseTagControls(cid){const a=new Set(state.clauseTags[cid]||[]);return ISSUE_TAG_OPTIONS.map(t=>`<button class="tag-chip ${a.has(t)?'active':''}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');}
function renderRoutingTagControls(cid){const a=new Set(state.clauseRoutingTags[cid]||[]);return ROUTING_TAG_OPTIONS.map(t=>`<button class="routing-chip ${a.has(t)?'active':''}" data-routing="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');}

function renderClauseBodyWrap(clause){
const w=countWords(clause.body||'');const preference=state.collapsedBodies?.[clause.id];const sc=w>500;const col=sc&&(preference===true||(preference==null&&isMobileViewport()));
const bodyText=sc&&col?truncateWords(clause.body||'',220):(clause.body||'');
const toggle=sc?`<div class="body-toggle-row"><button data-action="toggle-clause-body" class="link-btn">${col?'Show full':'Collapse'}</button><span class="inline-subtle">${w} words</span></div>`:'';
const body=String(bodyText||'').trim()?renderClauseBody(bodyText,clause.id):'<div class="heading-only-state"><strong>Heading-only source block</strong><span>No separate clause body was extracted beneath this heading. Verify whether the operative text sits in the next source unit or an omitted Word structure.</span></div>';
return `<div class="clause-body-wrap"><div class="clause-body" dir="auto">${body}</div>${toggle}${renderContextualPlaybookCard(clause)}</div>`;
}
function renderSourceVerification(clause){const source=String(state.rawText||'');if(!source||!clause)return'';const spans=clause.sourceSpans?.length?clause.sourceSpans:REVIEW_CORE.fullBlockSpans(clause.sourceBlockIds||[],state.sourceBlocks);const mapped=REVIEW_CORE.materializeSpans(spans,state.sourceBlocks).filter(item=>item.text);if(mapped.length){const exact=mapped.map(item=>item.text).join('\n');const corrected=spans.some(span=>span.kind==='lawyer-corrected-span')||!!clause.sourceCorrection;return `<details class="source-verification"><summary>Compare with imported source</summary><div class="source-verification-note">${corrected?'Lawyer-corrected exact source span':'Mapped by stable source blocks'} · ${escapeHtml(mapped[0].blockId)}${mapped.length>1?`–${escapeHtml(mapped[mapped.length-1].blockId)}`:''}. Word styling is not reproduced; compare the original DOCX for layout, tracked changes and footnotes.</div><pre>${escapeHtml(exact)}</pre></details>`;}const needles=[String(clause.body||'').replace(/\s+/g,' ').trim().slice(0,90),String(clause.heading||'').trim()].filter(Boolean);let index=-1;for(const needle of needles){index=source.toLowerCase().indexOf(needle.toLowerCase());if(index>=0)break;}if(index<0)return `<details class="source-verification"><summary>Compare with imported source</summary><p class="mini">The exact source neighbourhood could not be mapped automatically. Verify this clause against the original file.</p></details>`;const desired=index+Math.max(700,String(clause.body||'').length+220),nextBreak=source.indexOf('\n',Math.min(source.length-1,desired)),start=Math.max(0,source.lastIndexOf('\n',Math.max(0,index-280))),end=Math.min(source.length,nextBreak>=0?nextBreak:source.length);return `<details class="source-verification"><summary>Compare with imported source</summary><div class="source-verification-note">Legacy text match used because this restored matter has no source-block map. Verify duplicate wording against the original file.</div><pre>${escapeHtml(source.slice(start,end).trim())}</pre></details>`;}
function transformSafeTextNodes(safeHtml, collectMatches, buildNode, skipSelector='button,script,style,mark,.placeholder-chip,.term-inconsistent,.obligation-sentence'){
  const template=document.createElement('template');template.innerHTML=String(safeHtml||'');
  const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{if(node.parentElement?.closest(skipSelector))return;const text=node.nodeValue||'';const matches=(collectMatches(text)||[]).filter(m=>m&&m.length>0).sort((a,b)=>a.index-b.index||b.length-a.length);if(!matches.length)return;const fragment=document.createDocumentFragment();let cursor=0;matches.forEach(match=>{if(match.index<cursor)return;fragment.append(document.createTextNode(text.slice(cursor,match.index)));fragment.append(buildNode(match,text.slice(match.index,match.index+match.length)));cursor=match.index+match.length;});fragment.append(document.createTextNode(text.slice(cursor)));node.replaceWith(fragment);});
  return template.innerHTML;
}
function highlightPlaceholdersInSafeHtml(safeHtml, clauseId) {
  if (!clauseId || !state.placeholders?.length) return safeHtml;
  const clausePhs = state.placeholders.filter(p => p.clauseId === clauseId && p.text && (!p.sourceArea||p.sourceArea==='body'));
  if (!clausePhs.length) return safeHtml;
  const queues=new Map();
  clausePhs.sort((a,b)=>Number(a.areaIndex||0)-Number(b.areaIndex||0)).forEach(ph=>{const list=queues.get(ph.text)||[];list.push(ph);queues.set(ph.text,list);});
  return transformSafeTextNodes(safeHtml,text=>{const matches=[];for(const [value,queue] of queues){let from=0;while(queue.length&&from<text.length){const index=text.indexOf(value,from);if(index<0)break;matches.push({index,length:value.length,ph:queue.shift()});from=index+value.length;}}return matches;},match=>{const ph=match.ph;const span=document.createElement('span');span.className=ph.reviewed?'placeholder-chip reviewed':'placeholder-chip unresolved';span.dataset.placeholderId=ph.id;span.title=ph.reviewed?'Reviewed — still present in source':'Unresolved source placeholder — click to record review';span.append(document.createTextNode(ph.text));const button=document.createElement('button');button.type='button';button.className='placeholder-resolve-btn';button.dataset.placeholderId=ph.id;button.setAttribute('aria-label',ph.reviewed?'Reopen placeholder review':'Mark placeholder reviewed');span.append(button);return span;});
}

function highlightObligationsInSafeHtml(safeHtml, clauseId) {
  if (!clauseId || !state.obligations?.length) return safeHtml;
  const clause = (state.clauses || []).find(c => c.id === clauseId);
  if (!clause) return safeHtml;
  if (/definition|interpretation|meaning/i.test(clause.heading || '')) return safeHtml;
  const clauseObls = state.obligations.filter(o => o.clauseId === clauseId);
  if (!clauseObls.length) return safeHtml;
  const oblMap = {};
  clauseObls.forEach(o => {
    const snippet = String(o.action || '').slice(0, 60).toLowerCase().trim();
    if (snippet) oblMap[snippet] = o.party || 'Unknown';
  });
  return transformSafeTextNodes(safeHtml,text=>[...text.matchAll(/[^\n]{20,}(?:shall|must)[^\n]{5,}/gi)].map(match=>({index:match.index,length:match[0].length,value:match[0]})),match => {
    const value=match.value;const lower = value.toLowerCase();
    let party = '';
    Object.entries(oblMap).forEach(([snippet, p]) => {
      if (snippet.length > 10 && lower.includes(String(snippet).slice(0, 30))) party = p;
    });
    if (!party) {
      if (/\bsupplier\b|\bservice provider\b|\bvendor\b/i.test(value)) party = 'Supplier';
      else if (/\bclient\b|\bcustomer\b|\bbuyer\b/i.test(value)) party = 'Client';
      else party = 'Party';
    }
    const partySlug = party.toLowerCase().replace(/[^a-z]/g, '');
    const span=document.createElement('span');span.className=`obligation-sentence obligation-${partySlug}`;span.title=`${party} obligation`;span.textContent=value;return span;
  });
}

function highlightTermInconsistenciesInSafeHtml(safeHtml, clauseId) {
  if (!clauseId) return safeHtml;
  const definedTermNames = Object.keys(state.definedTerms || {});
  if (!definedTermNames.length) return safeHtml;
  const clause = (state.clauses || []).find(c => c.id === clauseId);
  if (!clause) return safeHtml;
  const clauseDrift=ANALYSIS_CORE.findDefinedTermCaseDrift?.(clause.body||'',definedTermNames)||[];
  if (!clauseDrift.length) return safeHtml;
  const driftTerms=[...new Set(clauseDrift.map(item=>item.term))];
  return transformSafeTextNodes(safeHtml,text=>ANALYSIS_CORE.findDefinedTermCaseDrift?.(text,driftTerms)||[],match=>{const span=document.createElement('span');span.className='term-inconsistent';span.title=`Case differs from defined term: '${match.value}' vs '${match.term}'`;span.textContent=match.value;return span;});
}

function renderClauseBody(body,clauseId){
const paras=String(body||'').split(/\n{2,}/);
return '<p>'+paras.map(p=>{let s=escapeHtml(p);/* Obligation wrapping must happen before line-break or chip markup is introduced; otherwise its sentence regex can consume generated tags. */s=highlightObligationsInSafeHtml(s,clauseId);s=s.replace(/\n/g,'<br>');s=linkCrossReferencesInSafeHtml(s);s=highlightDefinedTermsInSafeHtml(s,clauseId);s=highlightPlaceholdersInSafeHtml(s, clauseId);s=highlightTermInconsistenciesInSafeHtml(s, clauseId);if(state.searchQuery)s=highlightSearchInSafeHtml(s,state.searchQuery);return s;}).join('</p><p>')+'</p>';
}

function renderNegotiationContextSection(cid){
const routing=getClauseRouteTargets(cid);const cp=state.clauseCounterpartyPositions[cid]||'';const ns=state.clauseCounterpartyNextSteps?.[cid]||'';const ld=state.clauseCounterpartyLastDiscussed?.[cid]||'';const negStat=state.clauseNegotiationStatus?.[cid]||'';
const isOpen=!!state.negotiationContextOpen?.[cid]||!!routing.length||!!cp.trim()||!!ns.trim()||!!ld||!!negStat;
if(!isOpen)return `<div><button data-action="show-negotiation-context" class="link-btn">Add counterparty position / routing</button></div>`;
return `<div class="negotiation-context-card"><div class="panel-subhead">Routing</div><div class="routing-row-inner">${routing.length?routing.map(t=>`<span class="routing-chip active readonly">${escapeHtml(t)}</span>`).join(''):'<span class="mini">Legal only</span>'}</div>
<div class="compact-grid"><label for="negotiationStatusSelect">Status</label><select id="negotiationStatusSelect" class="compact-select">${renderSelectOptions(NEGOTIATION_STATUS_OPTIONS,negStat,'Status')}</select><label for="counterpartyLastDiscussedInput">Discussed</label><input id="counterpartyLastDiscussedInput" type="date" value="${escapeHtml(ld)}" /></div>
<label class="drafting-field compact-field"><span>Counterparty position</span><textarea id="counterpartyPositionInput" rows="2">${escapeHtml(cp)}</textarea></label>
<label class="drafting-field compact-field"><span>Next step</span><textarea id="counterpartyNextStepInput" rows="2">${escapeHtml(ns)}</textarea></label>

  </div>`;
}

function renderDraftingSection(clause,open){
if(!open)return `<div class="drafting-collapsed"><button data-action="show-drafting-fields">+ Add recommendation / fallback</button></div>`;
const l=state.clauseFallbackLadders?.[clause.id]||{};
return `<div class="drafting-grid"><div class="drafting-grid-head"><div class="panel-subhead">Drafting response</div><button data-action="remove-drafting-fields" class="link-btn">Remove</button></div> <label class="drafting-field"><span>Recommendation</span><textarea id="recommendationInput" rows="3">${escapeHtml(state.clauseRecommendations[clause.id]||'')}</textarea></label> <label class="drafting-field"><span>Fallback 1</span><textarea id="fallbackInput" rows="3">${escapeHtml(state.clauseFallbacks[clause.id]||'')}</textarea></label> <label class="drafting-field"><span>Fallback 2</span><textarea id="fallback2Input" rows="2">${escapeHtml(l.fallback2||'')}</textarea></label> <label class="drafting-field"><span>Walk-away</span><textarea id="walkAwayInput" rows="2">${escapeHtml(l.walkAway||'')}</textarea></label></div>`;
}
function renderPlaybookHtml(clause){const m=getPlaybookMatchForClause(clause);if(!m)return '';const i=m.item;const sp=Math.round((m.score||0)*100);return `<div class="playbook-block ${escapeHtml(m.gap)}"><div class="panel-subhead">Precedent similarity</div><span class="clause-pill playbook-badge ${escapeHtml(m.gap)}">${escapeHtml(playbookGapLabel(m.score))}</span> <span class="mini">${sp}% drafting similarity · not a risk score</span><div class="tool-card info compact"><h4>${escapeHtml(i.title||'Clause-library precedent')}</h4>${i.standardPosition?`<div class="mini"><strong>Stored position:</strong> ${escapeHtml(i.standardPosition)}</div>`:''}${i.fallbackPosition?`<div class="mini"><strong>Stored fallback:</strong> ${escapeHtml(i.fallbackPosition)}</div>`:''}${i.negotiatingPoints?`<div class="mini"><strong>Drafting notes:</strong> ${escapeHtml(i.negotiatingPoints)}</div>`:''}<div class="card-actions"><button class="link-btn" data-action="apply-playbook" data-clause-id="${escapeHtml(clause.id)}">Apply precedent</button><button class="link-btn" data-action="copy-playbook" data-id="${escapeHtml(i.id)}">Copy</button><button class="link-btn" data-action="edit-playbook" data-id="${escapeHtml(i.id)}">Edit</button></div></div></div>`;}

function renderClauseComparisonHtml(clause,opts={}){if(!opts.forceOpen&&!state.clauseCompareMode[clause.id])return '';return `<div class="compare-view${opts.overlay?' compare-view-overlay':''}"><div class="compare-grid"><div class="compare-col"><div class="compare-head">Original</div><div class="compare-body">${renderClauseBody(clause.body,clause.id)}</div></div><div class="compare-col"><div class="compare-head">Recommendation</div><div class="compare-body compare-plain">${escapeHtml(state.clauseRecommendations[clause.id]||'-')}</div></div><div class="compare-col"><div class="compare-head">Fallback</div><div class="compare-body compare-plain">${escapeHtml(state.clauseFallbacks[clause.id]||'-')}</div></div></div></div>`;}
function renderClauseRedlineHtml(clause){if(!state.clauseRedlineMode[clause.id])return '';const rec=state.clauseRecommendations[clause.id]||'';if(!rec.trim())return '';return `<div class="redline-block"><div class="redline-body">${getClauseRedlineHtml(clause)}</div></div>`;}
function renderPositionHistoryHtml(cid){const h=state.positionHistory[cid]||[];if(!h.length)return '<div class="mini">No position changes recorded.</div>';return h.slice(-5).reverse().map(i=>`<div class="mini"><strong>${escapeHtml(i.from||'Not set')}</strong> -> <strong>${escapeHtml(i.to||'Not set')}</strong> <span class="inline-subtle">${escapeHtml(formatShortDateTime(i.at))}</span></div>`).join('');}
function renderReviewTimelineHtml(cid){const items=(state.reviewLog||[]).filter(i=>i.clauseId===cid).slice(-8).reverse();if(!items.length)return '<div class="mini">No recent activity.</div>';return items.map(i=>`<div class="mini"><strong>${escapeHtml(i.action)}</strong> <span class="inline-subtle">${escapeHtml(formatShortDateTime(i.at))}</span>${i.details?.summary?` - ${escapeHtml(i.details.summary)}`:''}</div>`).join('');}

function renderInlineClauseNotesHtml(clause){
const cn=(state.notes||[]).filter(n=>n.clauseId===clause.id).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
const showForm=!!state.noteFormOpen;const formHtml=showForm?noteTemplate.innerHTML:'';
const threadHtml=cn.length?cn.map(n=>`<div class="inline-note-card"><div class="inline-note-head"><strong>${escapeHtml(n.type)}</strong><span class="mini">${escapeHtml(new Date(n.updatedAt||n.createdAt).toLocaleString())}${n.owner?` * ${escapeHtml(n.owner)}`:''}</span></div><div class="inline-note-body">${escapeHtml(n.text).replace(/\n/g,'<br>')}</div>${(n.blocker||n.businessCall||n.proposedFallback||n.routeTo)?`<div class="note-meta-badges">${n.blocker?'<span class="clause-pill badge-status-escalated">Blocker</span>':''}${n.businessCall?'<span class="clause-pill badge-status-in-review">Business input</span>':''}${n.routeTo?`<span class="clause-pill badge-route">Route: ${escapeHtml(n.routeTo)}</span>`:''}${n.proposedFallback?`<span class="mini"><strong>Fallback:</strong> ${escapeHtml(n.proposedFallback)}</span>`:''}</div>`:''}<div class="card-actions"><button class="link-btn" data-action="edit-inline-note" data-note-id="${escapeHtml(n.id)}">Edit</button><button class="link-btn" data-action="copy-inline-note" data-note-id="${escapeHtml(n.id)}">Copy</button><button class="link-btn" data-action="delete-inline-note" data-note-id="${escapeHtml(n.id)}">Delete</button></div></div>`).join(''):'<div class="mini">No notes for this clause yet.</div>';
const templated=formHtml?formHtml.replace('<label>Note</label>', '<label>Note</label><div class="note-template-row"><button type="button" class="mini-toggle" data-action="insert-note-template" data-template="business">Business</button><button type="button" class="mini-toggle" data-action="insert-note-template" data-template="fallback">Fallback</button><button type="button" class="mini-toggle" data-action="insert-note-template" data-template="risk">Risk</button><button type="button" class="mini-toggle" data-action="insert-note-template" data-template="pushback">Pushback</button><button type="button" class="mini-toggle" data-action="insert-note-template" data-template="escalate">Escalate</button></div>') : formHtml; return `<section class="clause-inline-notes inline-notes-thread" data-clause-id="${escapeHtml(clause.id)}"><div class="inline-notes-head"><div><h3>Notes</h3></div>${showForm?'':`<button data-action="open-inline-note" type="button">Add note</button>`}</div>${templated}<div class="inline-note-list">${threadHtml}</div></section>`;
}


function renderObligationsWorkbenchCard(){
const items=(state.obligations||[]).slice(0,8);
return `<details class="tool-card compact print-hide-collapsed"><summary><strong>Obligations scan</strong></summary><div class="mini">Pattern-based candidates. Confirm a record before it enters post-signature tracking.</div>${items.length?`<div class="obligation-preview-list">${items.map(i=>`<div class="summary-item"><strong>${escapeHtml(i.party||'Party')}</strong> ${escapeHtml(i.action||'')}<div class="summary-meta">${escapeHtml(i.clauseLabel||'')} ${i.deadline?`• ${escapeHtml(i.deadline)}`:''} • ${state.obligationVerification?.[i.id]==='confirmed'?'Confirmed':'Unverified'}</div><button type="button" class="btn btn-xs" data-confirm-obligation="${escapeHtml(i.id)}">${state.obligationVerification?.[i.id]==='confirmed'?'Unconfirm':'Confirm'}</button></div>`).join('')}</div><div class="card-actions"><button id="openTimelineSubBtn" type="button">Open scan</button><button id="exportObligationsSheetBtn" type="button">Export CSV</button></div>`:'<div class="mini">No obligation candidates extracted yet.</div>'}</details>`;
}
function renderDocxUtilityCard(){
const warnings=(state.documentMeta?.warnings||[]).slice(0,4);
const source=state.documentMeta?.sourceType||'';
return `<details class="tool-card compact print-hide-collapsed"><summary><strong>DOCX hygiene utility</strong></summary><div class="mini">${source==='docx'?'DOCX source detected.':'Load a DOCX to get the most value from this utility.'}</div><ul class="summary-list"><li class="summary-item">Check tracked changes intentionally</li><li class="summary-item">Remove comments / reviewer notes</li><li class="summary-item">Scrub metadata / author details</li><li class="summary-item">Review placeholders before export</li></ul>${warnings.length?`<div class="mini"><strong>Current signals:</strong><br>${warnings.map(escapeHtml).join('<br>')}</div>`:''}<div class="card-actions"><button id="copyDocxHygieneChecklistBtn" type="button">Copy checklist</button><button id="openExportHubFromDocxBtn" type="button">Open export hub</button></div></details>`;
}
function buildExecutiveSummaryHtml(){
const hr=state.clauses.filter(c=>(state.clauseRiskScores[c.id]||'Low')==='High');
const materialTypes=new Set(['Liability','Indemnity','Data Protection','Intellectual Property','Confidentiality','Termination','Fees','Payment Terms','Services','Audit']);
const ranked=[...state.clauses].map(c=>{const risk=state.clauseRiskScores[c.id]||'Low';const pos=state.clausePositions[c.id]||'';const review=state.reviewPriorityScores?.[c.id]||'Low';const material=materialTypes.has(c.type);const eligible=risk!=='Low'||material||['Escalate','Reject','Seek amendment'].includes(pos)||review==='High';const score=(risk==='High'?24:risk==='Medium'?12:0)+(material?7:0)+(review==='High'?8:review==='Medium'?3:0)+(['Escalate','Reject'].includes(pos)?10:pos==='Seek amendment'?6:0)+Math.min(5,clauseFlagCount(c))-(isDefinitionOnlyClause(c)?12:0);return{clause:c,score,eligible};}).filter(i=>i.eligible&&i.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
const positions={acceptable:Object.values(state.clausePositions||{}).filter(v=>v==='Acceptable').length,seek:Object.values(state.clausePositions||{}).filter(v=>v==='Seek amendment').length,reject:Object.values(state.clausePositions||{}).filter(v=>v==='Reject').length,escalate:Object.values(state.clausePositions||{}).filter(v=>v==='Escalate').length};
return `<div class="document-summary"><h3>At-a-glance</h3>${matterSummaryLine()?`<div class="summary-line"><strong>Matter:</strong> ${escapeHtml(matterSummaryLine())}</div>`:''}<div class="summary-line"><strong>Legal risk:</strong> ${escapeHtml(getDocumentRiskDisplayLabel())} * ${hr.length} high-risk * <strong>Review priority:</strong> ${escapeHtml(state.documentReviewPriority||'Low')} * ${countFlags()} issues * ${Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length}/${state.clauses.length} reviewed</div>${ranked.length?`<div class="summary-list">${ranked.map(({clause:c})=>`<div class="summary-item ${slugifyStatus(state.clauseRiskScores[c.id]||'Low')}"><strong>${escapeHtml(c.number||c.heading)}</strong> - ${escapeHtml(c.heading)}<div class="summary-meta">${escapeHtml(state.clauseRiskScores[c.id]||'Low')} legal risk * ${escapeHtml(state.reviewPriorityScores?.[c.id]||'Low')} priority * ${escapeHtml((state.clauseRiskCategories?.[c.id]||[]).join(', ')||'General')} * ${escapeHtml(state.clausePositions[c.id]||'No position')}</div></div>`).join('')}</div>`:''}<div class="summary-line"><strong>Posture:</strong> ${positions.acceptable} ✓ * ${positions.seek} △ * ${positions.reject} ✗ * ${positions.escalate} ⚡</div><div class="summary-line"><strong>Next best action:</strong> ${escapeHtml(getNextBestAction().label)}</div>${renderConsistencyCard()}${renderMicroAgendaCard()}</div>`;
}

function openCompareOverlay(cid){const c=(state.clauses||[]).find(i=>i.id===cid);if(!c)return;closeCompareOverlay();const o=document.createElement('div');o.id='compareOverlay';o.className='modal-overlay compare-overlay hidden';o.innerHTML=`<div class="modal-card compare-overlay-card"><div class="modal-head"><h2>Clause comparison</h2><button type="button" id="closeCompareOverlayBtn">Close</button></div>${renderClauseComparisonHtml(c,{forceOpen:true,overlay:true})}</div>`;document.body.appendChild(o);initModalAccessibility();o.addEventListener('click',e=>{if(e.target===o)closeCompareOverlay();});o.querySelector('#closeCompareOverlayBtn')?.addEventListener('click',closeCompareOverlay);openModal(o);}
function closeCompareOverlay(){closeModal(document.getElementById('compareOverlay'));}

/* ============================================================
v6.0: CONSOLIDATED 4-TAB PANELS
Summary | Review | Notes | Strategy
============================================================ */
function getTabCount(tab){
if(tab==='summary')return Math.max(Object.values(state.clausePositions||{}).filter(v=>v==='Escalate'||v==='Reject').length,Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Escalated').length);
if(tab==='review')return countFlags()+Object.keys(state.definedTerms).length;
if(tab==='notes')return state.notes.length;
if(tab==='strategy')return Object.values(state.clausePositions||{}).filter(v=>v&&v!=='Acceptable').length+state.clauseLibrary.length;
return 0;
}

function setActiveTab(tab){if(!TAB_IDS.includes(tab))tab='summary';state.activeTab=tab;scheduleRerender({rightPanel:true},'active-tab');updateTabVisibility();updateMobileUI();savePrefs();saveSessionReturn();}

function setActiveToolsTab(tab){
  if(!TOOLS_TAB_IDS.includes(tab)) tab='map';
  state.activeToolsTab=tab;
  els.toolsStrip?.setAttribute('open','');
  document.querySelectorAll('.tools-tab').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.toolsTab===tab);
  });
  renderToolsPanel();
}

function renderToolsPanel(){
  const panel=document.getElementById('toolsPanel');
  if(!panel) return;
  const clause=getSelectedClause();
  let content='';

  const showScopeBar = clause && clause.id!==OVERVIEW_ID && ['terms','refs','timeline','fills'].includes(state.activeToolsTab);
  const scopeBar = showScopeBar
    ? `<div class="tools-scope-bar"><span class="mini">Clause: <strong>${escapeHtml(clause.number||'')} ${escapeHtml(clause.heading||'')}</strong></span><button class="link-btn tools-scope-overview-btn" data-clause-id="__overview__">← Document view</button></div>`
    : '';

  if(state.activeToolsTab==='map'){
    content=buildClauseMapContent();
  } else if(state.activeToolsTab==='terms'){
    content=scopeBar+buildTermsContent(clause);
  } else if(state.activeToolsTab==='refs'){
    content=scopeBar+buildRefsContent(clause);
  } else if(state.activeToolsTab==='fills'){
    content=scopeBar+buildPlaceholdersContent(clause);
  } else if(state.activeToolsTab==='timeline'){
    content=scopeBar+buildTimelineContent(clause);
  }

  panel.innerHTML=content;

  if(state.activeToolsTab==='terms'){
    bindTermChipInteractions(panel);
  }

  if(state.activeToolsTab==='fills'){
    panel.querySelectorAll('.placeholder-toggle').forEach(cb=>{
      cb.addEventListener('change',()=>togglePlaceholderResolved(cb.dataset.placeholderId));
    });
    panel.querySelectorAll('.placeholder-ignore').forEach(btn=>btn.addEventListener('click',()=>togglePlaceholderIgnored(btn.dataset.placeholderId)));
  }

  panel.querySelectorAll('[data-clause-id]').forEach(btn=>{ btn.addEventListener('click',()=>jumpToClause(btn.dataset.clauseId)); });
  panel.querySelector('#exportObligationsICSBtn')?.addEventListener('click', exportObligationsICS);
  if(state.activeToolsTab==='map'){
    panel.querySelectorAll('[data-clause-id]').forEach(btn=>{
      btn.addEventListener('click',()=>jumpToClause(btn.dataset.clauseId));
    });
  }
}

function buildClauseMapContent(){
  if(!state.clauses.length) return '<div class="mini">No document loaded.</div>';
  return '<div class="clause-map-list">' +
    state.clauses
      .filter(c=>c.id!==OVERVIEW_ID)
      .map(c=>{
        const risk=state.clauseRiskScores?.[c.id] || 'Low';
        const pos=state.clausePositions?.[c.id] || '';
        const reviewed=(state.clauseReviewStatus?.[c.id] || '')==='Reviewed';
        const indent=Math.max(0,(c.level || 1)-1);
        const posLabel=pos && pos!=='Acceptable' ? pos : '';
        return `<button type="button" class="map-clause-item ${reviewed ? 'map-reviewed' : ''}" data-clause-id="${escapeHtml(c.id)}" style="padding-left:${8 + indent * 12}px"><span class="map-risk-dot risk-dot-${String(risk).toLowerCase()}"></span><span class="map-num">${escapeHtml(c.number || '')}</span><span class="map-head">${escapeHtml(c.heading || '')}</span>${posLabel ? `<span class="map-pos">${escapeHtml(posLabel)}</span>` : ''}</button>`;
      }).join('') +
    '</div>';
}


function buildRefsContent(clause){
  const breaks=state.issues?.crossReferenceBreaks || [];
  const isClauseScope = clause && clause.id!==OVERVIEW_ID && state.refsView==='clause';
  const scopedBreaks = isClauseScope ? breaks.filter(b=>b.clauseId===clause.id) : breaks;
  const toggleHtml = clause && clause.id!==OVERVIEW_ID
    ? `<div class="panel-toggle-row"><button class="mini-toggle ${!isClauseScope?'active':''}" data-refs-view="all">All refs</button><button class="mini-toggle ${isClauseScope?'active':''}" data-refs-view="clause">This clause</button></div>`
    : '';
  const brokenHtml = scopedBreaks.length
    ? '<div class="panel-subhead">' + scopedBreaks.length + ' broken reference' + (scopedBreaks.length===1 ? '' : 's') + '</div>' + scopedBreaks.map(b=>`<div class="tool-card compact"><div class="mini"><strong>${escapeHtml(b.reference)}</strong></div><div class="mini">Clause ${escapeHtml(b.clauseLabel)} — target not found</div></div>`).join('')
    : '<div class="mini">No broken cross-references detected' + (isClauseScope ? ' in this clause.' : '.') + '</div>';
  const openObs = isClauseScope ? (state.issues.openObligations||[]).filter(o=>o.clauseId===clause.id) : (state.issues.openObligations || []);
  const openObsHtml = openObs.length ? `<div class="panel-subhead">Agree-to-agree obligations (${openObs.length})</div><div class="mini warn-text" style="margin-bottom:6px">These clauses contain deferred obligations — positions not yet agreed. Review before signing.</div>${openObs.map(o => `<div class="tool-card compact"><div class="mini"><strong>${escapeHtml(o.clauseNumber)}</strong> ${escapeHtml(o.heading)}</div><div class="mini">${o.matches.map(m => `<span class="clause-pill badge-status-in-review">${escapeHtml(m)}</span>`).join(' ')}</div><div class="card-actions"><button class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(o.clauseId)}">Open</button></div></div>`).join('')}` : '';
  const subjective=isClauseScope?(state.issues?.subjectiveStandards||[]).filter(i=>i.clauseId===clause.id):(state.issues?.subjectiveStandards||[]);const subjectiveHtml=subjective.length?`<div class="panel-subhead">Subjective standards (${subjective.length})</div>${subjective.map(i=>`<div class="tool-card compact"><div class="mini"><strong>${escapeHtml(i.severity||'Medium')} · ${escapeHtml(i.tier||'contextual')}</strong></div><div class="mini">${escapeHtml(i.sourceExcerpt)}</div><div class="card-actions"><button class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(i.clauseId)}">Open</button></div></div>`).join('')}`:'<div class="mini">Subjective standards checked · none found.</div>';
  const asym=isClauseScope?(state.issues?.asymmetries||[]).filter(i=>i.clauseId===clause.id):(state.issues?.asymmetries||[]);const asymHtml=asym.length?`<div class="panel-subhead">Material one-way rights (${asym.length})</div>${asym.map(i=>`<div class="tool-card compact"><div class="mini"><strong>${escapeHtml(i.materiality||'Possible')} · ${escapeHtml(i.category||'contractual right')}</strong></div><div class="mini"><strong>${escapeHtml(i.beneficiary)}</strong> appears to receive a right without a matching ${escapeHtml(i.missingReciprocalFor)} right.</div><div class="mini">${escapeHtml(i.sourceExcerpt)}</div><div class="card-actions"><button class="btn btn-xs jump-clause" data-clause-id="${escapeHtml(i.clauseId)}">Open</button></div></div>`).join('')}`:'<div class="mini">Material asymmetry checked · none found.</div>';
  return toggleHtml + brokenHtml + subjectiveHtml + asymHtml + openObsHtml;
}

function updateTabVisibility(){
const map={summary:els.summaryPanel,review:els.reviewPanel,notes:els.notesPanel,strategy:els.strategyPanel};
els.toolTabs.querySelectorAll('.tool-tab').forEach(b=>{b.classList.toggle('active',b.dataset.tab===state.activeTab);const c=getTabCount(b.dataset.tab);const l=b.dataset.baseLabel||(b.dataset.tab.charAt(0).toUpperCase()+b.dataset.tab.slice(1));b.innerHTML=c?`${escapeHtml(l)} <span class="tab-count">${c}</span>`:escapeHtml(l);});
Object.entries(map).forEach(([k,p])=>{if(p)p.classList.toggle('hidden',k!==state.activeTab);});
els.toolTabs?.classList.remove('hidden');
els.strategyPanel?.closest('.right-panel')?.classList.remove('legacy-hidden');
}
/* removed duplicate legacy definition: renderActiveRightPanel */
/* -- Summary Tab (Dashboard + Meta + Session Health) -- */

function renderTopActionsPanel() {
  const next = getNextBestAction();
  const stage = getActiveWorkflowStage();
  const decided = Object.values(state.decisionByClause || {}).filter(d => d.type).length;
  const total = (state.clauses || []).filter(c => c.id !== OVERVIEW_ID).length;
  return `<div class="top-actions-panel"><div class="top-actions-progress"><span class="mini">${decided}/${total} decided</span><div class="progress-bar-track"><div class="progress-bar-fill" style="width:${total ? Math.round((decided/total)*100) : 0}%"></div></div></div><div class="top-actions-next"><span class="mini">Next: ${escapeHtml(next.label || 'Review clauses')}</span><button type="button" class="btn btn-xs btn-primary" data-stage-jump="${escapeHtml(next.stage || stage)}">${escapeHtml(next.action || 'Continue')}</button></div></div>`;
}

function renderSummaryPanel(){bumpRenderCount('summary');
const reviewedCount=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length;
const unreviewedCount=Math.max(0,state.clauses.length-Object.keys(state.clauseReviewStatus||{}).length);
const actionCount=getFilteredClauses({content:'all',review:'action-required'}).length;
const highRiskCount=getFilteredClauses({content:'all',review:'high-risk'}).length;
const highPriorityCount=state.clauses.filter(c=>(state.reviewPriorityScores?.[c.id]||'Low')==='High').length;
const matter=getMatterDetails();
const posC=countByValue(state.clausePositions||{});
const seekC=posC['Seek amendment']||0;const rejectC=posC['Reject']||0;const escC=posC['Escalate']||0;const awc=posC['Accept with changes']||0;
const signing=computeSigningReadinessChecks();
const topItems=getStrategyFilteredClauses().slice().sort((a,b)=>riskWeight(state.clauseRiskScores?.[b.id]||'Low')-riskWeight(state.clauseRiskScores?.[a.id]||'Low')).slice(0,8);

els.summaryPanel.innerHTML=`<div class="panel-subhead">Overview</div>
${state.workflowMode==='outputs'?'<div class="tool-card info"><div class="mini">Outputs mode is active. Use the Export card or the Export button in the header to generate negotiation and approval packs.</div><div class="card-actions"><button id="copyApprovalPackFromSummaryBtn" type="button">Copy approval pack</button><button id="exportApprovalPackFromSummaryBtn" type="button">Export approval pack</button></div></div>':''}
${renderNextBestActionCard()}
${state.executionMode ? buildUpcomingObligationsCard() : ''}
${state.executionMode||getActiveWorkflowStage()==='close'?`<div class="tool-card compact"><div class="panel-subhead">Post-signature tracking</div><div class="mini">${state.executionMode ? `Contract marked as executed on ${escapeHtml(state.executedAt)}.` : 'Contract signed? Start obligation tracking after the final document is executed.'}</div><div class="card-actions"><button id="toggleExecutionModeBtn" type="button">${state.executionMode ? '⚡ Executed — exit tracking mode' : 'Start post-signature tracking'}</button></div></div>`:''}
${renderDocumentLineageCard()}
${renderMatterStatusCard()}
${renderRoundSummaryCard()}
${renderVersionDeltaCard()}
${renderDefinitionHygieneCard()}
${renderTopActionsPanel()}
${renderDecisionCompletionCard()}
${renderOpenLoopsCard(state.summaryOpenLoopFilter||'all')}
${renderGuardrailCheckCard()}
${renderTopDecisionItemsCard()}
${renderBookmarksCard()}
${renderNavHistoryCard()}
<div class="tool-card ${signing.level==='Ready'?'low':signing.level==='Conditional'?'medium':'high'} signing-readiness-card">
  <h4>Signing readiness</h4>
  <div class="workflow-stat">${escapeHtml(signing.level)}</div>
  <div class="summary-list">
    ${signing.checks.map(c=>`<button type="button" class="summary-item readiness-check ${c.ok?'ok':'warn'}" data-readiness-action="${escapeHtml(c.action)}"><span>${c.ok?'✓':'•'} ${escapeHtml(c.label)}</span><span class="summary-meta">${c.ok?'OK':`${c.count} open`}</span></button>`).join('')}
  </div>
</div>
<div class="tool-card compact deal-brief-card">
  <h4>Deal brief</h4>
  <div class="mini"><strong>Matter:</strong> ${escapeHtml(matterSummaryLine()||'Not set')}</div>
  ${renderCommercialTermsSheet()}
  <div class="overview-grid" style="margin-top:.75rem;">
    <div class="overview-card"><div class="overview-stat">${seekC+rejectC+escC+awc}</div><div class="mini">Open items</div></div>
    <div class="overview-card"><div class="overview-stat">${seekC}</div><div class="mini">Seek</div></div>
    <div class="overview-card"><div class="overview-stat">${rejectC}</div><div class="mini">Reject</div></div>
    <div class="overview-card"><div class="overview-stat">${escC}</div><div class="mini">Escalate</div></div>
  </div>
  <div class="summary-list" style="margin-top:.75rem;">
    ${topItems.length?topItems.map(c=>{const n=(state.notes||[]).find(x=>x.clauseId===c.id);return `<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(c.id)}"><strong>${escapeHtml(c.number||'')}</strong> ${escapeHtml(c.heading||'')}<div class="summary-meta">${escapeHtml(state.clausePositions?.[c.id]||'Not set')} • ${escapeHtml(state.clauseRiskScores?.[c.id]||'Low')} risk${n?` • ${escapeHtml(truncateWords(n.text||'',14))}`:''}</div></button>`;}).join(''):'<div class="mini">No active negotiation items captured.</div>'}
  </div>
  <label class="drafting-field" style="margin-top:.75rem;"><span>Negotiation strategy / internal guidance</span><textarea id="dealStrategyNoteInput" rows="4" placeholder="Capture the deal posture, internal guidance, concessions, or escalation context here...">${escapeHtml(matter.strategyNote||'')}</textarea></label>
</div>
${renderNegotiationThemesCard()}${renderObligationsWorkbenchCard()}${renderDocxUtilityCard()}
<div class="workflow-card-grid">
  <div class="workflow-card"><h4>Review</h4><div class="workflow-stat">${reviewedCount}/${state.clauses.length||0}</div><div class="mini">${unreviewedCount} unreviewed</div><div class="card-actions"><button class="primary" id="jumpNextUnreviewedBtn">Jump to next</button></div></div>
  <div class="workflow-card"><h4>Action items</h4><div class="workflow-stat">${actionCount}</div><div class="mini">${highRiskCount} high-risk • ${highPriorityCount} high-priority</div><div class="card-actions"><button class="primary" id="reviewHighRiskBtn">Review high risk</button></div></div>
  <div class="workflow-card"><h4>Negotiate</h4><div class="workflow-stat">${seekC+rejectC+escC+awc}</div><div class="mini">${seekC} seek • ${rejectC} reject • ${escC} escalate • ${awc} accept w/ changes</div><div class="card-actions"><button class="primary" id="openStrategyTabBtn">Open negotiate</button></div></div>
  <div class="workflow-card"><h4>Exports</h4><div class="workflow-stat">${state.notes.length}</div><div class="mini">${countFlags()} flags</div><div class="card-actions"><details class="inline-action-menu"><summary>Exports ▾</summary><div class="inline-action-menu-panel"><button id="copyDashSummaryBtn" type="button">Copy summary</button><button id="exportReportFromSum" type="button">Export report</button><button id="exportWorkingNotesBtn" type="button">Working notes</button><button id="exportAgendaBtn" type="button">Negotiation agenda</button><button id="exportChangeInstBtn" type="button">Change instructions</button></div></details></div></div>
</div>
<details class="tool-card compact"><summary><strong>Bulk decision actions</strong></summary><div class="dashboard-actions"><button id="bulkAccBtn">Visible → Acceptable</button><button id="bulkSeekBtn">Visible → Seek amendment</button></div><p class="mini">A bulk decision never certifies review. Each clause still requires source verification.</p></details>
<details class="tool-card compact"><summary><strong>Matter details</strong></summary>${renderMatterForm()}</details>
<details class="tool-card compact"><summary><strong>Document meta</strong></summary><div class="mini"><strong>File:</strong> ${escapeHtml(state.documentMeta.fileName||'Untitled')} • <strong>Type:</strong> ${escapeHtml(state.contractType||'Custom')} • <strong>Legal risk:</strong> ${escapeHtml(state.documentRisk||'Low')} • <strong>Review priority:</strong> ${escapeHtml(state.documentReviewPriority||'Low')} • <strong>Words:</strong> ${getDocumentWordCount()} • <strong>Est. review:</strong> ${getEstimatedReviewMinutes()} min • <strong>Build:</strong> ${BUILD_VERSION}</div>${state.documentMeta.warnings.length?`<div class="mini" style="margin-top:0.5rem"><strong>Warnings:</strong><br>${state.documentMeta.warnings.map(escapeHtml).join('<br>')}</div>`:''}</details>`;
els.summaryPanel.querySelector('#toggleExecutionModeBtn')?.addEventListener('click',toggleExecutionMode);
els.summaryPanel.querySelector('#jumpNextUnreviewedBtn')?.addEventListener('click',()=>{const n=getFilteredClauses({content:'all',review:'unreviewed'})[0];if(n)jumpToClause(n.id);});
els.summaryPanel.querySelector('#jumpNextUnreviewedFromActionBtn')?.addEventListener('click',()=>{const n=getFilteredClauses({content:'all',review:'unreviewed'})[0];if(n)jumpToClause(n.id);});
els.summaryPanel.querySelector('#openEscalationsFromActionBtn')?.addEventListener('click',()=>{setActiveTab('strategy');state.strategySubSection='positions';state.strategyFilterPreset='escalations';renderStrategyPanel();});
els.summaryPanel.querySelector('#openOutputsFromActionBtn')?.addEventListener('click',()=>{setWorkflowMode('outputs');setActiveTab('summary');});
els.summaryPanel.querySelector('#copyNegotiationPackFromActionBtn')?.addEventListener('click',()=>copyTextToClipboard(formatNegotiationPack(),'Pack copied'));
els.summaryPanel.querySelector('#copyApprovalPackFromActionBtn')?.addEventListener('click',()=>copyTextToClipboard(formatApprovalPack(),'Approval pack copied'));
els.summaryPanel.querySelector('#reviewHighRiskBtn')?.addEventListener('click',()=>{state.filters={content:'all',review:'action-required'};syncFilterUI();renderClauseList();const n=getFilteredClauses()[0];if(n)jumpToClause(n.id);});
els.summaryPanel.querySelector('#openStrategyTabBtn')?.addEventListener('click',()=>{setWorkflowMode('negotiate');setActiveTab('strategy');state.strategySubSection='packages';});
els.summaryPanel.querySelector('#copyDashSummaryBtn')?.addEventListener('click',()=>copyTextToClipboard(formatDashboardSummary(),'Summary copied'));
els.summaryPanel.querySelector('#exportReportFromSum')?.addEventListener('click',exportReport);
els.summaryPanel.querySelector('#exportWorkingNotesBtn')?.addEventListener('click',exportWorkingNotesTxt);
els.summaryPanel.querySelector('#exportAgendaBtn')?.addEventListener('click',exportNegotiationAgendaTxt);
els.summaryPanel.querySelector('#exportChangeInstBtn')?.addEventListener('click',exportChangeInstructionsTxt);
els.summaryPanel.querySelector('#bulkAccBtn')?.addEventListener('click',()=>bulkSetVisiblePositions('Acceptable'));
els.summaryPanel.querySelector('#bulkSeekBtn')?.addEventListener('click',()=>bulkSetVisiblePositions('Seek amendment'));
els.summaryPanel.querySelectorAll('.jump-clause').forEach(b=>b.addEventListener('click',()=>jumpToClause(b.dataset.clauseId)));
els.summaryPanel.querySelectorAll('[data-openloop-filter]').forEach(btn=>btn.addEventListener('click',()=>{state.summaryOpenLoopFilter=btn.dataset.openloopFilter||'all';renderSummaryPanel();}));
els.summaryPanel.querySelector('#openIssueConsoleFromLoopsBtn')?.addEventListener('click',()=>{setWorkflowMode('review');setActiveTab('review');state.reviewSubSection='issues-console';renderActiveRightPanel();});
els.summaryPanel.querySelector('#openNegotiateFromLoopsBtn')?.addEventListener('click',()=>{setWorkflowMode('negotiate');setActiveTab('strategy');state.strategySubSection='packages';renderActiveRightPanel();});

els.summaryPanel.querySelector('#dealStrategyNoteInput')?.addEventListener('blur',e=>setMatterField('strategyNote', e.target.value||''));
els.summaryPanel.querySelectorAll('[data-readiness-action]').forEach(btn=>btn.addEventListener('click',()=>{
  const action=btn.dataset.readinessAction;
  if(action==='placeholders'){openFocusedCheck('placeholders');}
  else if(action==='issues'){openFocusedCheck('review-items',{filter:'attention'});}
  else if(action==='terms'){openFocusedCheck('definitions');}
  else if(action==='expected'){openFocusedCheck('missing');}
  else if(action==='unreviewed'){state.filters={content:'all',review:'unreviewed'};syncFilterUI();renderClauseList();const n=getFilteredClauses()[0]; if(n) jumpToClause(n.id);}
  else if(action==='escalations'){setWorkflowMode('negotiate');setActiveTab('strategy');state.strategySubSection='packages';state.strategyFilterPreset='escalations';renderStrategyPanel();}
  else if(action==='open-negotiation'){setWorkflowMode('negotiate');setActiveTab('strategy');state.strategySubSection='packages';state.strategyFilterPreset='open';renderStrategyPanel();}
  else if(action==='unsnooze') { unsnoozeAll(); showToast('All snoozed clauses restored — please review high-risk items', 'warn'); }
}));
bindMatterDetailsControls(els.summaryPanel);
if(state.prefs?.developerMode){els.summaryPanel.insertAdjacentHTML('beforeend', `<div class="tool-card compact"><h4>Developer diagnostics</h4><div class="mini">Render counts — navigator: ${state.diagnostics.renderCounts.navigator||0}, clause: ${state.diagnostics.renderCounts.clause||0}, right panel: ${state.diagnostics.renderCounts.rightPanel||0}</div><div class="card-actions"><button id="openDiagnosticsFromSummaryBtn" type="button">Open diagnostics</button></div></div>`);els.summaryPanel.querySelector('#openDiagnosticsFromSummaryBtn')?.addEventListener('click',openDiagnosticsModal);}
els.summaryPanel.querySelector('#startNewRoundBtn')?.addEventListener('click',startNewNegotiationRound);
els.summaryPanel.querySelector('#snapshotCompareSelect')?.addEventListener('change',e=>{state.selectedSnapshotCompareId=e.target.value||''; if(state.selectedSnapshotCompareId) state.selectedRoundCompareKey=''; state.compareOnlyMode=false; renderAll();});
els.summaryPanel.querySelector('#roundCompareSelect')?.addEventListener('change',e=>{state.selectedRoundCompareKey=e.target.value||''; if(state.selectedRoundCompareKey) state.selectedSnapshotCompareId=''; state.compareOnlyMode=false; renderAll();});
els.summaryPanel.querySelector('#toggleCompareOnlyBtn')?.addEventListener('click',()=>{state.compareOnlyMode=!state.compareOnlyMode; renderClauseList(); renderSummaryPanel();});
els.summaryPanel.querySelector('#clearCompareCtxBtn')?.addEventListener('click',clearCompareContext);
els.summaryPanel.querySelector('#markDefinitionPassBtn')?.addEventListener('click',()=>{state.definitionPassDoneAt=new Date().toISOString(); scheduleAutosave(); renderSummaryPanel(); showToast('Definitions pass marked complete','info');});
els.summaryPanel.querySelectorAll('[data-defh-action]').forEach(btn=>btn.addEventListener('click',()=>openFocusedCheck('definitions')));
els.summaryPanel.querySelector('#openTimelineSubBtn')?.addEventListener('click',()=>openFocusedCheck('obligations'));
els.summaryPanel.querySelector('#exportObligationsSheetBtn')?.addEventListener('click',exportObligationsCsv);
els.summaryPanel.querySelector('#copyDocxHygieneChecklistBtn')?.addEventListener('click',()=>copyTextToClipboard(formatDocxHygieneChecklist(),'Checklist copied'));
els.summaryPanel.querySelector('#openExportHubFromDocxBtn')?.addEventListener('click',openExportHubModal);
}

function renderMatterForm(){
const m=getMatterDetails();
return `<div class="matter-grid"> <label class="drafting-field compact-field"><span>Role</span><select data-matter-field="role">${['Neutral','Supplier','Customer'].map(v=>`<option value="${escapeHtml(v)}" ${v===m.role?'selected':''}>${escapeHtml(v==='Neutral'?'Role not confirmed':v)}</option>`).join('')}</select></label> <label class="drafting-field compact-field"><span>Counterparty</span><input data-matter-field="counterparty" type="text" value="${escapeHtml(m.counterparty)}" /></label> <label class="drafting-field compact-field"><span>Business unit</span><input data-matter-field="businessUnit" type="text" value="${escapeHtml(m.businessUnit)}" /></label> <label class="drafting-field compact-field"><span>Deal value</span><select data-matter-field="dealValueBand">${['','Under 10L','10L-1Cr','1Cr-10Cr','Above 10Cr'].map(v=>`<option value="${escapeHtml(v)}" ${v===m.dealValueBand?'selected':''}>${escapeHtml(v||'Not set')}</option>`).join('')}</select></label> <label class="drafting-field compact-field"><span>Jurisdiction</span><select data-matter-field="jurisdiction">${['','India','UK','US','EU','Singapore','Other'].map(v=>`<option value="${escapeHtml(v)}" ${v===m.jurisdiction?'selected':''}>${escapeHtml(v||'Not set')}</option>`).join('')}</select></label> <label class="drafting-field compact-field"><span>Risk appetite</span><select data-matter-field="riskAppetite">${['Low','Medium','High'].map(v=>`<option value="${escapeHtml(v)}" ${v===m.riskAppetite?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label>

  </div>`;
}

/* -- Review Tab (Issues + Placeholders + Terms) -- */
function renderReviewPanel(){
const invalidReviewSubSections=['terms','placeholders','timeline'];
if(invalidReviewSubSections.includes(state.reviewSubSection)) state.reviewSubSection='issues';
const subSec=state.reviewSubSection||'issues';
const clause=getSelectedClause();
deriveIssuesFromState();
const issueCount=countFlags();
let content='';
if(subSec==='issues')content=buildIssuesContent(clause);
else if(subSec==='issues-console')content=buildIssueConsoleContent();
const issueConsoleCount=(state.issueConsole?.items||[]).length;
els.reviewPanel.innerHTML=` <div class="review-sub-nav"><button class="sub-tab ${subSec==='issues'?'active':''}" data-sub="issues">Issue signals ${issueCount?`(${issueCount})`:''}</button><button class="sub-tab ${subSec==='issues-console'?'active':''}" data-sub="issues-console">Execution console ${issueConsoleCount?`(${issueConsoleCount})`:''}</button></div> ${content}`;
}


function buildIssuesContent(clause){
const cid=clause?.id;const cCards=[];const dCards=[];
if(cid&&cid!==OVERVIEW_ID){
state.placeholders.filter(p=>p.clauseId===cid&&!p.resolved).forEach(i=>cCards.push(cardHtml('medium','Placeholder',escapeHtml(i.text),clause.number)));
state.issues.duplicateDefinitions.filter(d=>d.firstClauseId===cid||d.secondClauseId===cid).forEach(i=>cCards.push(cardHtml('high','Duplicate definition',escapeHtml(i.term),clause.number)));
state.issues.unusedDefinitions.filter(d=>d.definedInClauseId===cid).forEach(i=>cCards.push(cardHtml('low','Defined but unused',escapeHtml(i.term),clause.number)));
state.issues.crossReferenceBreaks.filter(d=>d.clauseId===cid).forEach(i=>cCards.push(cardHtml('high','Broken xref',escapeHtml(i.reference),clause.number)));
}
state.issues.consistency.forEach(i=>dCards.push(cardHtml('info',i.type,escapeHtml(i.description),'Document')));
(state.issues.definitionQuality||[]).forEach(i=>dCards.push(cardHtml(i.severity==='High'?'high':'medium',i.type,escapeHtml(i.description),'Definitions')));
state.issues.missingStandardClauses.forEach(i=>dCards.push(cardHtml('high','Missing clause',escapeHtml(i),'Document')));
state.issues.unresolvedCrossReferencedDefinitions.slice(0,5).forEach(i=>{const ht=!!findClauseByReference(i.reference,state.clauses||[]);dCards.push(cardHtml('medium','Unresolved xref definition',`${escapeHtml(i.term)} - ${escapeHtml(i.reference)}${ht?`<div class="card-actions"><button class="link-btn resolve-xref-term-btn" data-term="${escapeHtml(i.term)}" data-reference="${escapeHtml(i.reference)}">Promote</button></div>`:''}`,'Document'));});
state.issues.survivalClauses.slice(0,6).forEach(i=>dCards.push(cardHtml('info','Survival',`<strong>${escapeHtml(i.clauseLabel)}</strong> - ${escapeHtml(i.heading)}<div class="mini">${escapeHtml(i.excerpt||'')}</div>`,'Document')));
(state.issues.commercialDeviations||[]).slice(0,8).forEach(i=>dCards.push(cardHtml(i.type==='Commercial deviation'?'medium':'info',i.type,`<strong>${escapeHtml(i.clauseLabel)}</strong> - ${escapeHtml(i.message)}`,'Document')));
const ff=state.issues.undefinedCapitalizedTerms.slice(0,6).map(i=>cardHtml('low','Possible undefined term',`${escapeHtml(i.term)} (${i.count} uses)<div class="card-actions"><button class="link-btn ignore-undefined-btn" data-term="${escapeHtml(i.term)}">Ignore</button></div>`,'Document'));
return `<div class="panel-subhead">This clause</div>${cCards.length?cCards.join(''):'<p class="mini">No clause-level issues.</p>'}<div class="panel-subhead">Document</div>${dCards.length?dCards.join(''):'<p class="mini">No document-wide issues.</p>'}${ff.length?`<details><summary class="mini">Formatting flags (${ff.length})</summary>${ff.join('')}</details>`:''}`;
}
function cardHtml(severity,title,body,clauseRef){return `<div class="tool-card ${severity}"><h4>${title}</h4><div>${body}</div><div class="mini">${escapeHtml(clauseRef)}</div></div>`;}

function buildTermsContent(clause){
const all=Object.values(state.definedTerms).sort((a,b)=>a.term.localeCompare(b.term));
const current=clause?all.filter(t=>t.definedInClauseId===clause.id||t.usedInClauseIds.includes(clause.id)):[];
const possible=clause?state.possibleDefinedTerms.filter(t=>t.clauseId===clause.id):[];
const health=state.detectorHealth?.definitions||{status:'not-run'};let html=renderDefinitionHygieneCard()+`<div class="tool-card compact ${health.status==='checked'?'low':'medium'}"><div class="mini"><strong>Detector coverage:</strong> ${escapeHtml(health.status==='checked'?'checked':health.status==='limited'?'limited by source integrity':'not run')} · ${all.length} terms · ${(state.issues.definitionQuality||[]).length} quality signal${(state.issues.definitionQuality||[]).length===1?'':'s'}</div></div>`+`<div class="panel-toggle-row"><button class="mini-toggle ${state.termsView==='clause'?'active':''}" data-terms-view="clause">This clause</button><button class="mini-toggle ${state.termsView==='all'?'active':''}" data-terms-view="all">All terms</button><button class="mini-toggle" id="exportTermsCsvBtn">CSV</button></div>`;
const terms=state.termsView==='all'?all:current;
const possibles=state.termsView==='all'?state.possibleDefinedTerms:possible;
html+=terms.length?terms.map(t=>`<div class="tool-card low"><h4>${escapeHtml(t.term)}</h4><div class="mini">${escapeHtml(t.definitionType)} * ${escapeHtml(t.confidence)} * ${t.usedInClauseIds.length} uses${t.resolutionStatus==='resolved'?' * resolved':t.resolutionStatus==='unresolved'?' * unresolved':''}</div><p class="mini">${highlightTermRichText(((t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||'').slice(0,180))}</p><div class="card-actions"><button class="link-btn copy-term-btn" data-term="${escapeHtml(t.term)}">Copy</button></div></div>`).join(''):'<p class="mini">No terms in this scope.</p>';
if(possibles.length)html+=`<div class="panel-subhead">Possible candidates</div>`+possibles.map(t=>`<div class="tool-card info"><h4>${escapeHtml(t.term)}</h4><div class="mini">${escapeHtml(t.clauseLabel)} * low</div><p class="mini">${escapeHtml((t.definition||'').slice(0,160))}</p><div class="card-actions"><button class="link-btn promote-term-btn" data-term="${escapeHtml(t.term)}" data-clause-id="${escapeHtml(t.clauseId)}">Promote</button><button class="link-btn ignore-term-btn" data-term="${escapeHtml(t.term)}">Ignore</button></div></div>`).join('');
return html;
}

function buildPlaceholdersContent(clause){
const items=state.placeholders;const unres=items.filter(i=>!i.resolved&&!i.ignored).length;
if(!items.length)return '<p class="mini">No placeholders detected.</p>';
return `<div class="panel-subhead">${unres} still present in source</div>`+items.map(i=>`<div class="tool-card ${i.reviewed?'reviewed':'medium'} ${clause&&i.clauseId===clause.id?'current-clause-placeholder':''}"><h4>${escapeHtml(i.text)}</h4><div class="mini">Clause ${escapeHtml(i.clauseLabel)} • confidence ${escapeHtml(i.confidence||'High')} • ${escapeHtml(i.reason||'marker')}</div><label class="check-row"><input type="checkbox" class="placeholder-toggle" data-placeholder-id="${escapeHtml(i.id)}" ${i.reviewed?'checked':''}> Reviewed (does not clear source blocker)</label><button type="button" class="link-btn placeholder-ignore" data-placeholder-id="${escapeHtml(i.id)}">${i.ignored?'Restore candidate':'Ignore as non-placeholder'}</button></div>`).join('');
}

function buildTimelineContent(clause){
const items=clause&&state.selectedClauseId!==OVERVIEW_ID?state.obligations.filter(i=>i.clauseId===clause.id):state.obligations;
const grouped=groupBy(items,'party');const dates=state.selectedClauseId===OVERVIEW_ID?state.deadlines:state.deadlines.filter(i=>i.clauseId===clause?.id);
return `<div class="mini">Obligations scan · confirm candidates before using them for execution tracking.</div><div class="dashboard-actions"><button id="copyObligationsBtn">Copy candidates</button><button id="exportObligationsCsvBtn">CSV</button><button id="exportObligationsICSBtn">Calendar (.ics)</button></div> <div class="panel-subhead">${items.length} candidate${items.length===1?'':'s'}</div> ${items.length?Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([party,g])=>`<div class="panel-subhead">${escapeHtml(party)} (${g.length})</div>${g.map(i=>`<div class="tool-card ${i.confidence==='High'?'high':i.confidence==='Low'?'low':'medium'}"><p class="mini">${escapeHtml(i.action)}</p><div class="mini">${escapeHtml(i.clauseLabel)}${i.deadline?` * ${escapeHtml(i.deadline)}`:''} * ${escapeHtml(i.confidence)} * ${state.obligationVerification?.[i.id]==='confirmed'?'Confirmed':'Unverified'}</div><button type="button" class="btn btn-xs" data-confirm-obligation="${escapeHtml(i.id)}">${state.obligationVerification?.[i.id]==='confirmed'?'Unconfirm':'Confirm'}</button></div>`).join('')}`).join(''):'<p class="mini">No obligation candidates extracted.</p>'} <div class="panel-subhead">Deadline signals (${dates.length})</div> ${dates.length?dates.slice(0,20).map(i=>`<div class="tool-card ${i.unresolved?'medium':'info'}"><h4>${escapeHtml(i.expression)}</h4><div class="mini">${escapeHtml(i.clauseLabel)}</div></div>`).join(''):'<p class="mini">No deadlines detected.</p>'}`;
}

/* -- Notes Tab -- */
function renderNotesPanel(){
const allNotes=[...state.notes].sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
const selectedCid=state.selectedClauseId&&state.selectedClauseId!==OVERVIEW_ID?state.selectedClauseId:null;
const mode=state.notesView||'clause';
const notes=mode==='business' ? allNotes.filter(n=>/Business/i.test(n.type||'') || /Business/i.test(n.routeTo||'') || n.businessCall)
  : mode==='all' ? allNotes
  : selectedCid ? allNotes.filter(n=>n.clauseId===selectedCid) : allNotes;
const html=notes.length?notes.map(n=>{const cl=state.clauses.find(c=>c.id===n.clauseId);return `<div class="tool-card medium"><h4>${escapeHtml(n.type)}</h4><p class="mini">${escapeHtml(n.text)}</p><div class="mini">Clause ${escapeHtml(cl?.number||'')}${cl?.heading?` - ${escapeHtml(cl.heading)}`:''} * ${new Date(n.updatedAt||n.createdAt).toLocaleString()}${n.owner?` * ${escapeHtml(n.owner)}`:''}</div>${(n.blocker||n.businessCall||n.routeTo)?`<div class="note-meta-badges">${n.blocker?'<span class="clause-pill badge-status-escalated">Blocker</span>':''}${n.businessCall?'<span class="clause-pill badge-status-in-review">Business</span>':''}${n.routeTo?`<span class="clause-pill badge-route">${escapeHtml(n.routeTo)}</span>`:''}</div>`:''}<div class="card-actions"><button class="link-btn jump-note-btn" data-clause-id="${escapeHtml(n.clauseId)}">Open clause</button><button class="link-btn copy-note-btn" data-note-id="${escapeHtml(n.id)}">Copy</button><button class="link-btn delete-note-btn" data-note-id="${escapeHtml(n.id)}">Delete</button></div></div>`}).join(''):'<div class="empty-panel-state"><h4>No notes in this view</h4><p>Add notes inline beneath any clause.</p></div>';
const countLabel=`${notes.length} note${notes.length===1?'':'s'}`;
els.notesPanel.innerHTML=`<div class="dashboard-actions"><div class="panel-toggle-row"><button class="mini-toggle ${mode==='clause'?'active':''}" data-notes-view="clause">This clause</button><button class="mini-toggle ${mode==='all'?'active':''}" data-notes-view="all">All notes</button><button class="mini-toggle ${mode==='business'?'active':''}" data-notes-view="business">Business notes</button></div><div class="dashboard-actions"><button id="copyNotesViewBtn">Copy view</button><button id="copyBusinessNotesBtn">Copy business notes</button></div></div><div class="mini">${countLabel}</div>${html}`;
els.notesPanel.querySelector('#copyNotesViewBtn')?.addEventListener('click',()=>copyTextToClipboard(mode==='business'?formatBusinessNotesExport():formatNotesSummary(mode==='clause'?selectedCid:null),'Notes copied'));
els.notesPanel.querySelector('#copyBusinessNotesBtn')?.addEventListener('click',()=>copyTextToClipboard(formatBusinessNotesExport(),'Business notes copied'));
els.notesPanel.querySelectorAll('[data-notes-view]').forEach(b=>b.addEventListener('click',()=>{state.notesView=b.dataset.notesView||'clause';renderNotesPanel();}));
els.notesPanel.querySelectorAll('.jump-note-btn').forEach(b=>b.addEventListener('click',()=>jumpToClause(b.dataset.clauseId)));
els.notesPanel.querySelectorAll('.copy-note-btn').forEach(b=>b.addEventListener('click',()=>{const n=state.notes.find(x=>x.id===b.dataset.noteId);if(n)copyTextToClipboard(formatSingleNote(n),'Note copied');}));
els.notesPanel.querySelectorAll('.delete-note-btn').forEach(b=>b.addEventListener('click',()=>{const nid=b.dataset.noteId;const del=state.notes.find(n=>n.id===nid);state.notes=state.notes.filter(n=>n.id!==nid);if(del)logReviewAction('note-deleted',del.clauseId,{summary:del.type||'Note'});renderAfterContentChange();scheduleAutosave();}));
}

/* -- Strategy Tab (Negotiate + Library) -- */
function renderSelectedClauseInsightsCard(){
 const clause=getSelectedClause(); if(!clause || state.selectedClauseId===OVERVIEW_ID) return '';
 const cid=clause.id; const hints=getDraftingHints(clause)||[];
 return `<div class="tool-card strategy-context-card"><div class="panel-subhead">Issue details</div>${renderCompactIssueSummaryHtml(clause)}${renderDecisionEngineHtml(clause)}${renderCounterpartyLensHtml(cid)}${hints.length?`<div class="drafting-hints-card"><div class="panel-subhead">Drafting hints</div><ul class="mini">${hints.map(h=>`<li>${escapeHtml(h)}</li>`).join('')}</ul></div>`:''}<div class="card-actions"><button type="button" data-action="copy-negotiation-snapshot">Copy snapshot</button></div></div>`;
}
function deriveIssueList(limit=8){
 return (state.clauses||[]).map(c=>{const card=deriveIssueCard(c); if(!card || !(card.riskSummary||state.clausePositions[c.id]||getClauseRouteTargets(c.id).length)) return null; return {clause:c,card,score:getNegotiationLeverageScore(c)+(state.clauseRiskScores[c.id]==='High'?3:state.clauseRiskScores[c.id]==='Medium'?1:0)+(getClauseRouteTargets(c.id).length?2:0)};}).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,limit);
}
function renderIssueListCard(){ const rows=deriveIssueList(8); if(!rows.length) return ''; return `<div class="tool-card issue-list-card"><div class="panel-subhead">Issue list</div><div class="issue-list">${rows.map(({clause,card})=>`<div class="issue-row"><strong>${escapeHtml(clause.number||'')} ${escapeHtml(clause.heading||'')}</strong><div class="mini">${escapeHtml(card.riskSummary||'Issue captured')} • ${escapeHtml(card.position||state.clausePositions[clause.id]||'No position')} • ${escapeHtml(card.routeTo||'Legal')}</div><div class="issue-actions"><button class="link-btn jump-clause" data-clause-id="${escapeHtml(clause.id)}">Open</button><button class="link-btn copy-review-brief" data-clause-id="${escapeHtml(clause.id)}">Copy brief</button></div></div>`).join('')}</div></div>`; }
function renderStrategyPanel(){bumpRenderCount('tracker');
const subSec=state.strategySubSection||'packages';
const negCount=getOpenNegotiationClauses().length;const libCount=state.clauseLibrary.length;const packageCount=buildNegotiationPackages().length;
let content='';
if(subSec==='packages')content=buildNegotiationPackagesContent();
else if(subSec==='positions')content=buildPositionsContent();
else if(subSec==='tracker')content=buildNegotiationTrackerContent();
else if(subSec==='library')content=buildLibraryContent();
els.strategyPanel.innerHTML=` <div class="review-sub-nav"><button class="sub-tab ${subSec==='packages'?'active':''}" data-sub="packages">Negotiation packs ${packageCount?`(${packageCount})`:''}</button><button class="sub-tab ${subSec==='positions'?'active':''}" data-sub="positions">Positions ${negCount?`(${negCount})`:''}</button><button class="sub-tab ${subSec==='tracker'?'active':''}" data-sub="tracker">Tracker</button><button class="sub-tab ${subSec==='library'?'active':''}" data-sub="library">Playbook & precedents ${libCount?`(${libCount})`:''}</button></div> ${content}`;
bindTermChipInteractions(els.strategyPanel);
}


function buildPositionsContent(){const items=getStrategyFilteredClauses();const themesHtml=renderNegotiationThemesCard();const selectedInsights=renderSelectedClauseInsightsCard();const roundCard=renderRoundSummaryCard();const driftCard=renderPositionDriftCard();return `<div class="strategy-presets">${[['all','All'],['escalations','Escalations'],['business','Needs business'],['leadership','Leadership'],['open','All open']].map(([k,l])=>`<button class="sub-pill ${state.strategyFilterPreset===k?'active':''}" data-strategy-filter="${k}">${l}</button>`).join('')}${state.strategyThemeFocus?`<button class="sub-pill active" id="clearStrategyThemeFocusBtn">Theme: ${escapeHtml(state.strategyThemeFocus)} ✕</button>`:''}</div>${selectedInsights}${driftCard}${roundCard}${themesHtml}${renderConsistencyCard()}${renderMicroAgendaCard()}${items.length?items.map(c=>{const card=deriveIssueCard(c);const rounds=getNegotiationRounds(c.id);return `<div class="tool-card compact"><div class="panel-subhead">${escapeHtml(c.number||'')} - ${escapeHtml(c.heading||'')}</div><div class="mini"><strong>${escapeHtml(card?.position||state.clausePositions[c.id]||'No position')}</strong> • ${escapeHtml(card?.stage||getIssueStage(c.id))} • ${escapeHtml(card?.confidence||'Low')} confidence</div><div class="mini">${escapeHtml(card?.theme||'General commercial')} • leverage ${escapeHtml(String(card?.leverageScore||0))} • ${escapeHtml(card?.strategyType||'Tradeable')}</div><div class="mini">${escapeHtml(card?.riskSummary||'No issue summary')}</div>${card?.routeTo?`<div class="mini"><strong>Route:</strong> ${escapeHtml(card.routeTo)}</div>`:''}${card?.fallback?`<div class="mini"><strong>Fallback:</strong> ${escapeHtml(truncateWords(card.fallback,18))}</div>`:''}${card?.tradeSuggestion?`<div class="mini"><strong>Trade:</strong> ${escapeHtml(truncateWords(card.tradeSuggestion,18))}</div>`:''}<div class="mini">Rounds: ${escapeHtml(String(rounds.length||0))}</div><div class="card-actions"><button class="link-btn jump-clause" data-clause-id="${escapeHtml(c.id)}">Jump</button><button class="link-btn copy-review-brief" data-clause-id="${escapeHtml(c.id)}">Copy brief</button><button class="link-btn" data-action="${isInAgenda(c.id)?'remove-from-agenda':'add-to-agenda'}" data-clause-id="${escapeHtml(c.id)}">${isInAgenda(c.id)?'Agenda ✓':'Add agenda'}</button></div></div>`;}).join(''):'<p class="mini">No open strategy items.</p>'}`;}


function buildNegotiationTrackerContent(){
const items=(state.clauses||[]).filter(c=>{const p=state.clausePositions[c.id]||'';const routing=getClauseRouteTargets(c.id);const notes=state.notes.filter(n=>n.clauseId===c.id);return p||routing.length||notes.length;});
return `<div class="dashboard-actions"><button id="copyTrackerCsvBtn" type="button">Copy tracker CSV</button><button id="copyNegPackBtn" type="button">Copy pack</button><button id="copyAgendaBtn" type="button">Copy micro-agenda</button></div>${items.length?`<div class="tracker-table-wrap"><table class="tracker-table editable-tracker"><thead><tr><th>Clause</th><th>Risk</th><th>Leverage</th><th>Position</th><th>Status</th><th>Counterparty position</th><th>Rounds</th><th>Action</th></tr></thead><tbody>${items.map(c=>{const status=state.clauseNegotiationStatus?.[c.id]||deriveNegotiationStatus(c.id)||'';const intel=evaluateClauseIntelligence(c)||{};const rounds=getNegotiationRounds(c.id);return `<tr><td><strong>${escapeHtml(c.number||'')}</strong><div class="mini">${escapeHtml(c.heading||'')}</div></td><td><div class="mini">${escapeHtml(state.clauseRiskScores[c.id]||'Low')} • ${escapeHtml(state.reviewPriorityScores[c.id]||'Low')}</div></td><td><div class="mini">${escapeHtml(String(intel.leverageScore||getNegotiationLeverageScore(c)))} • ${escapeHtml(intel.strategyType||getNegotiationStrategyType(c))}</div></td><td><select class="tracker-position-select" data-clause-id="${escapeHtml(c.id)}">${NEGOTIATION_POSITION_OPTIONS.map(v=>`<option value="${escapeHtml(v)}" ${v===(state.clausePositions[c.id]||'')?'selected':''}>${escapeHtml(v||'Not set')}</option>`).join('')}</select></td><td><select class="tracker-status-select" data-clause-id="${escapeHtml(c.id)}">${NEGOTIATION_STATUS_OPTIONS.map(v=>`<option value="${escapeHtml(v)}" ${v===status?'selected':''}>${escapeHtml(v||'Not set')}</option>`).join('')}</select></td><td><input class="tracker-cp-input" data-clause-id="${escapeHtml(c.id)}" type="text" value="${escapeHtml(state.clauseCounterpartyPositions[c.id]||'')}" placeholder="Counterparty stance"></td><td><div class="mini">${escapeHtml(String(rounds.length||0))}</div></td><td><button class="link-btn jump-clause" data-clause-id="${escapeHtml(c.id)}">Jump</button></td></tr>`}).join('')}</tbody></table></div>`:'<p class="mini">No negotiation tracker items yet.</p>'}`;
}

function updateTrackerLatestNote(cid, text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return;
  state.notes.push({
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    clauseId: cid,
    type: 'General Comment',
    text: trimmed,
    owner: '',
    routeTo: '',
    blocker: false,
    businessCall: false,
    proposedFallback: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  refreshDerivedClauseState(cid);
  onSubstantiveChange({ recalcRisk: true, rerenderClause: false });
}

function buildLibraryContent(){
const q=(state.librarySearchQuery||'').toLowerCase();
const items=(state.clauseLibrary||[]).filter(i=>{if(!q)return true;return `${i.title||''} ${i.type||''} ${i.tags?.join(' ')||''} ${i.text||''}`.toLowerCase().includes(q);}).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));
ensureBuiltinPlaybooks();const active=getActivePlaybookPackage();
const packageOptions=state.playbookPackages.map(pkg=>{const key=`${pkg.packageId}@${pkg.version}`;const selected=active&&active.packageId===pkg.packageId&&active.version===pkg.version;return `<option value="${escapeHtml(key)}" ${selected?'selected':''}>${escapeHtml(pkg.name||pkg.packageId)} · v${escapeHtml(pkg.version)} · ${escapeHtml(pkg.role||'Any role')}</option>`;}).join('');
const packages=`<div class="tool-card compact playbook-repository-card"><div class="panel-subhead">Playbook repository</div><div class="mini">Packages are local, versioned policy. Contextual guidance requires explicit activation and lawyer confirmation; it never changes inherent risk by itself.</div><div class="dashboard-actions"><select data-workspace-playbook-select><option value="">No active playbook</option>${packageOptions}</select><button type="button" data-workspace-playbook-activate>Activate</button>${active?'<button type="button" data-workspace-playbook-deactivate>Deactivate</button>':''}</div>${state.playbookPackages.map(pkg=>`<details ${active&&active.packageId===pkg.packageId&&active.version===pkg.version?'open':''}><summary>${escapeHtml(pkg.name||pkg.packageId)} · v${escapeHtml(pkg.version)} · ${escapeHtml(pkg.role||'Any role')}</summary><div class="mini">${escapeHtml(pkg.status||'Verify before use')} · ${pkg.modules.length} modules · package ${escapeHtml(String(pkg.contentHash||'unhashed').slice(0,12))}</div><div class="mini"><strong>Jurisdiction anchor:</strong> ${escapeHtml(pkg.jurisdictionAnchor||'Not specified — verify')}</div><div class="playbook-module-list">${pkg.modules.map(module=>`<div><strong>${escapeHtml(module.id)}</strong> ${escapeHtml(module.title)}${module.relatedModules?.length?` <span class="mini">· with ${escapeHtml(module.relatedModules.join(', '))}</span>`:''}</div>`).join('')}</div></details>`).join('')}</div>`;
return `${packages}<div class="panel-subhead">Precedent library</div><div class="mini">Clause-library text similarity is a drafting aid only and is separate from policy playbooks.</div><div class="dashboard-actions"><input id="librarySearchInput" type="search" placeholder="Search precedents" value="${escapeHtml(state.librarySearchQuery||'')}" /><button id="addLibraryEntryBtn">Add</button><button id="exportLibraryBtn">Export</button><button id="importLibraryBtn">Import</button></div> ${items.length?items.map(i=>`<div class="tool-card low"><h4>${escapeHtml(i.title||'Untitled')}</h4><div class="mini">${escapeHtml(i.type||'General')}${i.tags?.length?` * ${escapeHtml(i.tags.join(', '))}`:''}</div>${i.standardPosition?`<div class="mini"><strong>Stored position:</strong> ${escapeHtml(i.standardPosition)}</div>`:''}<div class="card-actions"><button class="link-btn copy-library-item-btn" data-id="${escapeHtml(i.id)}">Copy</button><button class="link-btn edit-library-item-btn" data-id="${escapeHtml(i.id)}">Edit</button><button class="link-btn delete-library-item-btn" data-id="${escapeHtml(i.id)}">Delete</button></div></div>`).join(''):'<div class="empty-panel-state"><h4>No precedents</h4><p>Save clauses and drafting precedents here. Policy playbook modules remain separate.</p></div>'}`;
}

function getSuggestedLibraryEntries(clause){if(!clause)return[];const t=String(clause.type||'').toLowerCase();return(state.clauseLibrary||[]).filter(i=>String(i.type||'').toLowerCase()===t||(i.tags||[]).some(tag=>String(tag).toLowerCase()===t)).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||''))).slice(0,3);}

/* -- Format functions -- */
function formatClauseCopy(cid){const c=state.clauses.find(x=>x.id===cid);return c?`${c.number} - ${c.heading}\n\n${c.body}`:'';}
function formatSingleNote(n){const c=state.clauses.find(x=>x.id===n.clauseId);const meta=[n.owner?`Owner: ${n.owner}`:'',n.routeTo?`Route to: ${n.routeTo}`:'',n.blocker?'Blocker':'',n.businessCall?'Business input':'',n.proposedFallback?`Fallback: ${n.proposedFallback}`:'' ].filter(Boolean).join(' * ');return `${c?.number||''} - ${c?.heading||''}\n[${n.type}] ${n.text}${meta?`\n${meta}`:''}`.trim();}
function formatNotesSummary(cid){const n=cid?state.notes.filter(x=>x.clauseId===cid):state.notes;return n.length?n.map(formatSingleNote).join('\n\n'):'No notes.';}
function formatTermDetail(key){const t=state.definedTerms[key];if(!t)return key||'';const node=(state.definitionGraph?.nodes||[]).find(item=>item.term===t.term);return `${t.term}\nType: ${t.definitionType}\nConfidence: ${t.confidence}\nScope: ${t.scope||'global'}\nDefinition: ${(t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||''}\nDependencies: ${node?.dependencies?.join(', ')||'None detected'}\nUses: ${t.usedInClauseIds?.length||0}${node?.usedBeforeDefinition?.length?`\nUsed before definition: ${node.usedBeforeDefinition.length}`:''}`;}
function formatClauseReviewBrief(cid){const c=(state.clauses||[]).find(i=>i.id===cid);if(!c)return '';const card=deriveIssueCard(c);return [`${c.number||''} ${c.heading||''}`.trim(),`Type: ${c.type||'General'}`,`Legal risk: ${state.clauseRiskScores[cid]||'Low'}`,`Review priority: ${state.reviewPriorityScores[cid]||'Low'}`,`Position: ${card?.position||state.clausePositions[cid]||'No position'}`,`Stage: ${card?.stage||getIssueStage(cid)}`,card?.routeTo?`Route to: ${card.routeTo}`:'',card?.riskSummary?`Issue: ${card.riskSummary}`:'',card?.fallback?`Fallback: ${card.fallback}`:'',card?.counterpartyPosition?`Counterparty: ${card.counterpartyPosition}`:'',card?.nextStep?`Next step: ${card.nextStep}`:'',card?.confidence?`Confidence: ${card.confidence}`:'',card?.theme?`Theme: ${card.theme}`:'',card?.consequenceIfAccepted?`If accepted: ${card.consequenceIfAccepted}`:'',card?.latestNote?`Latest note: ${card.latestNote}`:''].filter(Boolean).join('\n');}

function formatDashboardSummary(){return `DASHBOARD SUMMARY\nAudience: Internal Legal\n\nDocument: ${state.documentMeta.fileName||'Untitled'}\nMatter: ${matterSummaryLine()||'Not set'}\nClauses: ${state.clauses.length}\nFlags: ${countFlags()}\nNotes: ${state.notes.length}\nReviewed: ${Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length}\nRisk: ${state.documentRisk||'Low'}`;}
function formatNegotiationPack(){const prefix='NEGOTIATION PACK\nAudience: Internal Legal\n\n';const items=getReviewableClauses().filter(c=>{const d=getClauseDecision(c.id);return typeof WORKFLOW_CORE.shouldIncludeInNegotiationPack==='function'?WORKFLOW_CORE.shouldIncludeInNegotiationPack(d):(!!d.includeInPack||['accept-with-changes','seek-amendment','reject'].includes(d.type));});return prefix+(items.map(c=>formatClauseReviewBrief(c.id)).join('\n\n-\n\n')||'No negotiation items have been selected or decided yet.');}
function formatNegotiationSummary(){const g={'Reject':[],'Escalate':[],'Seek amendment':[],'Acceptable':[]};Object.entries(state.clausePositions||{}).forEach(([cid,v])=>{if(!v||!g[v])return;const c=state.clauses.find(x=>x.id===cid);g[v].push(`${c?.number||cid} - ${c?.heading||''}`);});return[`Matter: ${matterSummaryLine()||'Not set'}`,'',...Object.entries(g).map(([l,items])=>`${l}\n${items.length?items.map(i=>`- ${i}`).join('\n'):'- None'}`)].join('\n\n');}
function formatNegotiationAgenda(){
const label='INTERNAL NEGOTIATION PREP\nAudience: Internal Legal\n\n';
if((state.agendaItems||[]).length) return label+formatMicroAgenda();
const items=(state.clauses||[]).map(c=>({clause:c,position:state.clausePositions?.[c.id]||'',status:state.clauseNegotiationStatus?.[c.id]||'',routing:getClauseRouteTargets(c.id),nextStep:state.clauseCounterpartyNextSteps?.[c.id]||'',counterparty:state.clauseCounterpartyPositions?.[c.id]||'',risk:state.clauseRiskScores?.[c.id]||'Low',notes:(state.notes||[]).filter(n=>n.clauseId===c.id)})).filter(i=>i.position&&i.position!=='Acceptable'||i.status==='Open'||i.routing.length||i.notes.some(n=>n.blocker||n.businessCall));
if(!items.length)return label+'No open agenda items.';
return label+`${matterSummaryLine()?`Matter: ${matterSummaryLine()}\n\n`:''}`+items.map(i=>`${i.clause.number} - ${i.clause.heading}\nRisk: ${i.risk}\nPosition: ${i.position||'Not set'}\nStatus: ${i.status||'Not set'}\nRouting: ${i.routing.length?i.routing.join(', '):'None'}\nCounterparty: ${i.counterparty||'Not captured'}\nNext: ${i.nextStep||'Not set'}`).join('\n\n-\n\n');
}
function formatObligationsSummary(cid){const i=cid?state.obligations.filter(x=>x.clauseId===cid):state.obligations;return i.map(x=>`${x.clauseLabel} | ${x.party}${x.deadline?` | ${x.deadline}`:''} | ${x.action}`).join('\n')||'No obligations.';}
function formatBusinessNotesExport(){ const notes=(state.notes||[]).filter(n=>/Business/i.test(n.type||'') || n.routeTo==='Business'); return notes.length?notes.map(formatSingleNote).join('\n\n'):'No business notes.';}
function formatWorkingNotesExport(){
const secs=state.clauses.map(c=>{const p=state.clausePositions[c.id]||'Not set';const rs=state.clauseReviewStatus[c.id]||'Not set';const risk=state.clauseRiskScores[c.id]||'Low';const tags=state.clauseTags[c.id]||[];const notes=state.notes.filter(n=>n.clauseId===c.id);const routing=getClauseRouteTargets(c.id);if(!notes.length&&p==='Not set'&&rs==='Not set'&&risk==='Low'&&!tags.length&&!routing.length)return '';return `${c.number} - ${c.heading}\nReview: ${rs}\nLegal Risk: ${risk}\nReview Priority: ${state.reviewPriorityScores[c.id]||'Low'}\nPosition: ${p}\nRouting: ${routing.length?routing.join(', '):'None'}\nTags: ${tags.length?tags.join(', '):'None'}\nNotes:\n${notes.length?notes.map(n=>`- [${n.type}] ${n.text}`).join('\n'):'- None'}`;}).filter(Boolean);
return `WORKING NOTES\nAudience: Internal Legal\n\nDocument: ${state.documentMeta.fileName||'Untitled'}\nMatter: ${matterSummaryLine()||'Not set'}\nRisk: ${state.documentRisk||'Low'}\n\n${secs.join('\n\n---\n\n')||'No review data.'}`;
}
function buildChangeInstructionPack(){
const items=state.clauses.filter(c=>{const p=state.clausePositions[c.id]||'';return(p&&p!=='Acceptable')||(state.clauseRiskScores[c.id]||'Low')==='High'||(state.clauseTags[c.id]||[]).length||state.notes.filter(n=>n.clauseId===c.id).length;});
return `CHANGE INSTRUCTIONS\nAudience: Internal Legal / Drafting Team\n\n`+(items.map(c=>{const notes=state.notes.filter(n=>n.clauseId===c.id);return[`${c.number} - ${c.heading}`,`Legal risk: ${state.clauseRiskScores[c.id]||'Low'} | Review priority: ${state.reviewPriorityScores[c.id]||'Low'}`,`Position: ${state.clausePositions[c.id]||'Not set'}`,`Current: ${c.body.replace(/\s+/g,' ').slice(0,400)}`,notes.length?`Notes: ${notes.map(n=>`[${n.type}] ${n.text}`).join(' | ')}`:'',`Recommendation: ${state.clauseRecommendations[c.id]||''}`,`Fallback: ${state.clauseFallbacks[c.id]||''}`].filter(Boolean).join('\n');}).join('\n\n-\n\n')||'No change instructions.');
}
function getWordHandoffItems(){
  return getReviewableClauses().filter(c=>{
    const d=getClauseDecision(c.id);
    const playbookConfirmed=state.clausePlaybookState?.[c.id]?.status==='confirmed'&&!!getPlaybookProvenance(c.id);
    return playbookConfirmed || !!(d.type && d.type!=='accept') || !!d.includeInPack || !!String(state.clauseRecommendations?.[c.id]||'').trim() || !!String(d.fallback||state.clauseFallbacks?.[c.id]||'').trim() || (state.notes||[]).some(n=>n.clauseId===c.id);
  });
}
function getWordHandoffChecks(){
  const reviewable=getReviewableClauses();
  const handoffItems=getWordHandoffItems();
  const reviewItems=typeof getCanonicalReviewItems==='function'?getCanonicalReviewItems():(state.reviewItems||[]);
  const checks=[
    {label:'Undecided reviewable clauses',count:reviewable.filter(c=>!getClauseDecision(c.id).type).length},
    {label:'Incomplete contested decisions',count:reviewable.filter(c=>{const d=getClauseDecision(c.id);return d.type&&d.type!=='accept'&&!getDecisionCompletionState(c.id).complete;}).length},
    {label:'Handoff items without drafting text',count:handoffItems.filter(c=>{const d=getClauseDecision(c.id);return ![state.clauseRecommendations?.[c.id],d.rationale,d.openingAsk,d.fallback,state.clauseFallbacks?.[c.id]].some(v=>String(v||'').trim());}).length},
    {label:'Unresolved placeholders',count:(state.placeholders||[]).filter(p=>!p.resolved&&!p.ignored).length},
    {label:'Broken cross-references',count:(state.issues?.crossReferenceBreaks||[]).length},
    {label:'Possible wrong cross-reference targets',count:(state.issues?.semanticCrossReferenceWarnings||[]).length},
    {label:'Open canonical review items',count:reviewItems.filter(item=>!item.disposition).length},
    {label:'Missing expected clauses',count:(state.expectedClauseCoverage?.missing||[]).length},
    {label:'Source DOCX warnings to verify',count:(state.documentMeta?.warnings||[]).filter(w=>SOURCE_LIMITATION_PATTERN.test(w)||/tracked changes/i.test(w)).length}
  ];
  return checks;
}
function buildWordHandoffHtml(){
  const items=getWordHandoffItems();
  const checks=getWordHandoffChecks();
  const rows=items.map((clause,index)=>{
    const cid=clause.id;const d=getClauseDecision(cid);const completion=getDecisionCompletionState(cid);const riskDrivers=(state.clauseRiskNarratives?.[cid]||[]).map(i=>i.text).filter(Boolean).join('; ');const notes=(state.notes||[]).filter(n=>n.clauseId===cid);const instruction=state.clauseRecommendations?.[cid]||d.rationale||d.nextAction||'Review and draft in Word';const playbookProvenance=getPlaybookProvenance(cid);
    return `<section class="handoff-item"><h2>${index+1}. ${escapeHtml(clause.number||'')} ${escapeHtml(clause.heading||'Untitled clause')}</h2><table><tbody><tr><th>Decision</th><td>${escapeHtml(mapDecisionTypeToLegacyPosition(d.type)||'Not set')}</td><th>Completion</th><td>${completion.complete?'Complete':`Missing: ${escapeHtml(completion.missing.join(', '))}`}</td></tr><tr><th>Inherent risk</th><td>${escapeHtml(state.clauseRiskScores?.[cid]||'Low')}</td><th>Review priority</th><td>${escapeHtml(state.reviewPriorityScores?.[cid]||'Low')}</td></tr><tr><th>Route / owner</th><td>${escapeHtml([d.route,d.owner].filter(Boolean).join(' / ')||'Legal Only')}</td><th>Type confidence</th><td>${escapeHtml(`${clause.type||'General'} / ${clause.classificationConfidence||'Unverified'}`)}</td></tr>${playbookProvenance?`<tr><th>Playbook provenance</th><td colspan="3">${escapeHtml(playbookProvenance)}</td></tr>`:''}</tbody></table><h3>Drafting instruction</h3><p>${escapeHtml(instruction)}</p>${d.openingAsk?`<h3>Opening ask</h3><p>${escapeHtml(d.openingAsk)}</p>`:''}${(d.fallback||state.clauseFallbacks?.[cid])?`<h3>Fallback</h3><p>${escapeHtml(d.fallback||state.clauseFallbacks[cid])}</p>`:''}${riskDrivers?`<h3>Why flagged</h3><p>${escapeHtml(riskDrivers)}</p>`:''}${notes.length?`<h3>Internal notes</h3><ul>${notes.map(n=>`<li><strong>${escapeHtml(n.type||'Note')}:</strong> ${escapeHtml(n.text||'')}</li>`).join('')}</ul>`:''}<h3>Source clause — verify before editing</h3><pre>${escapeHtml(`${clause.number||''} ${clause.heading||''}\n${clause.body||''}`.trim())}</pre></section>`;
  }).join('');
  const preflight=checks.map(c=>`<li class="${c.count?'open':'clear'}"><strong>${escapeHtml(String(c.count))}</strong> ${escapeHtml(c.label)}</li>`).join('');
  const css=`body{font:11pt/1.45 Arial,sans-serif;color:#202124;margin:28px}h1{font-size:20pt}h2{font-size:14pt;margin-top:26px;border-bottom:1px solid #aab4c0;padding-bottom:5px}h3{font-size:10pt;text-transform:uppercase;letter-spacing:.04em;margin:14px 0 4px;color:#475467}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #cfd7df;padding:6px;text-align:left;vertical-align:top}th{width:15%;background:#eef3f8}pre{white-space:pre-wrap;border-left:4px solid #5a9fd4;background:#f7f9fb;padding:10px}.notice{border:1px solid #d0a13c;background:#fff8e8;padding:12px}.meta{color:#5d6672}.handoff-item{page-break-inside:avoid}.preflight{columns:2}.open{color:#9a5c00}.clear{color:#276749}@media print{body{margin:16mm}.handoff-item{page-break-inside:auto}}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Word Drafting Handoff</title><style>${css}</style></head><body><h1>Word Drafting Handoff</h1><p class="meta"><strong>Audience:</strong> Internal Legal / Drafting Team<br><strong>Document:</strong> ${escapeHtml(state.documentMeta?.fileName||'Untitled')}<br><strong>Source SHA-256:</strong> ${escapeHtml(state.documentMeta?.sourceFingerprint||'Unavailable')}<br><strong>Matter:</strong> ${escapeHtml(matterSummaryLine()||'Not set')}<br><strong>Generated:</strong> ${escapeHtml(formatShortDateTime(new Date().toISOString()))}</p><div class="notice"><strong>Use in Word:</strong> Open this HTML file in Microsoft Word, apply each instruction to the source DOCX, and save the edited DOCX separately. This handoff does not modify the source document or create tracked changes. Verify every source clause, instruction and fallback before use.</div><h2>Preflight</h2><ul class="preflight">${preflight}</ul><p>${items.length} clause${items.length===1?'':'s'} selected for drafting handoff.</p>${rows||'<p>No contested decisions, drafting recommendations or clause notes were captured.</p>'}</body></html>`;
}
function buildEvidenceLedgerCsv(){
  const sourceConfidence=typeof buildSourceConfidenceLedger==='function'?buildSourceConfidenceLedger():{status:'Not assessed',mappingPercent:0};const reviewItems=typeof getCanonicalReviewItems==='function'?getCanonicalReviewItems():(state.reviewItems||[]);
  const rows=[['Audience','Source SHA-256','Source confidence','Source order','Clause','Heading','Clause type','Type match strength','Inherent risk','Risk drivers','Review priority','Decision','Decision complete','Missing fields','Route','Owner','Status','Playbook provenance','Open review items','Placeholders open','Broken references','Possible wrong targets','Notes','Source excerpt']];
  getReviewableClauses().forEach((clause,index)=>{const cid=clause.id;const d=getClauseDecision(cid);const completion=getDecisionCompletionState(cid);const riskDrivers=(state.clauseRiskNarratives?.[cid]||[]).map(i=>i.text).filter(Boolean).join(' | ');const placeholders=(state.placeholders||[]).filter(p=>p.clauseId===cid&&!p.resolved&&!p.ignored).length;const xrefs=(state.issues?.crossReferenceBreaks||[]).filter(i=>i.clauseId===cid).map(i=>i.reference).join(' | ');const semanticRefs=(state.issues?.semanticCrossReferenceWarnings||[]).filter(i=>i.clauseId===cid).map(i=>i.reference).join(' | ');const openItems=reviewItems.filter(item=>item.clauseId===cid&&!item.disposition).map(item=>item.title).join(' | ');const notes=(state.notes||[]).filter(n=>n.clauseId===cid).map(n=>`[${n.type}] ${n.text}`).join(' | ');rows.push(['Internal Legal / Audit',state.documentMeta?.sourceFingerprint||'',`${sourceConfidence.status} / ${sourceConfidence.mappingPercent}% mapped`,String(index+1),clause.number||'',clause.heading||'',clause.type||'General',clause.classificationConfidence||'Unverified',state.clauseRiskScores?.[cid]||'Low',riskDrivers,state.reviewPriorityScores?.[cid]||'Low',mapDecisionTypeToLegacyPosition(d.type)||'Not set',completion.complete?'Yes':'No',completion.missing.join(' | '),d.route||getDefaultRouteForClause(cid)||'Legal Only',d.owner||'',d.status||'Open',getPlaybookProvenance(cid),openItems,String(placeholders),xrefs,semanticRefs,notes,String(clause.body||'').replace(/\s+/g,' ').slice(0,800)]);});
  return rows.map(row=>row.map(csvEscape).join(',')).join('\n');
}
function exportWordHandoff(){const base=safeBaseName(state.documentMeta?.fileName||'contract');downloadBlob(`${base}_word_handoff_${buildDateStamp()}.html`,new Blob([buildWordHandoffHtml()],{type:'text/html;charset=utf-8'}));}
function exportEvidenceLedger(){const base=safeBaseName(state.documentMeta?.fileName||'contract');downloadBlob(`${base}_evidence_ledger_${buildDateStamp()}.csv`,new Blob([buildEvidenceLedgerCsv()],{type:'text/csv;charset=utf-8'}));}
function formatLibraryEntry(i){return `${i.title}\n${i.tags?.length?`Tags: ${i.tags.join(', ')}\n`:''}${i.notes?`Notes: ${i.notes}\n`:''}\n${i.text}`;}
function buildEmailSummaryTxt(){
const mc=state.clauses.filter(c=>{const p=state.clausePositions[c.id]||'';return(p&&p!=='Acceptable')||state.notes.filter(n=>n.clauseId===c.id).length;});
const lines=['EMAIL DRAFT','Audience: Internal Legal — review recipients before sending','',`Subject: Review summary - ${state.documentMeta.fileName||'Contract'}`,`Matter: ${matterSummaryLine()||'Not set'}`,`Legal risk: ${state.documentRisk||'Low'} * Review priority: ${state.documentReviewPriority||'Low'}`,'','Material points:',''];
if(!mc.length)lines.push('- No material comments captured.');
else mc.forEach(c=>{const p=state.clausePositions[c.id]||'Review required';const n=state.notes.find(x=>x.clauseId===c.id);const t=n?.text?`[INTERNAL NOTE — DO NOT FORWARD] ${n.text} [END INTERNAL NOTE]`:(p==='Reject'?'Not acceptable in current form.':'Requires attention.');lines.push(`- Clause ${c.number} (${c.heading}): ${t} Position: ${p}.`);});
if((state.expectedClauseCoverage?.missing||[]).length)lines.push('',`Missing expected clauses: ${(state.expectedClauseCoverage.missing||[]).join(', ')}.`);
return lines.join('\n');
}

/* -- Exports -- */
function getSelectedReportPreset(){return els.exportHubPresetSelect?.value||'internal';}
function exportReport(){if(!state.clauses.length){showToast('Load a document first','warn');return;}try{downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_review_${buildDateStamp()}.html`,new Blob([buildReportHtml(getSelectedReportPreset())],{type:'text/html'}));}catch(e){console.error(e);showToast('Export failed','error');}}
function formatNegotiationTrackerCsv(){const rows=[['Clause','Heading','Legal Risk','Review Priority','Position','Negotiation Status','Counterparty Position','Latest Note']];(state.clauses||[]).forEach(c=>{const pos=state.clausePositions?.[c.id]||'';const status=state.clauseNegotiationStatus?.[c.id]||deriveNegotiationStatus(c.id)||'';const cp=state.clauseCounterpartyPositions?.[c.id]||'';const note=(state.notes||[]).filter(n=>n.clauseId===c.id).slice(-1)[0];if(!(pos||status||cp||note)) return;rows.push([c.number||'',c.heading||'',state.clauseRiskScores?.[c.id]||'Low',state.reviewPriorityScores?.[c.id]||'Low',pos,status,cp,note?.text||'']);});return rows.map(r=>r.map(csvEscape).join(',')).join('\n');}
function formatDocxHygieneChecklist(){const warnings=(state.documentMeta?.warnings||[]);const parts=[`DOCX Hygiene Checklist`,`` ,`File: ${state.documentMeta?.fileName||'Untitled'}`,`Build: ${BUILD_VERSION}`,`` ,`1. Re-save the source as a clean .docx if upload warnings appear.`,`2. Prefer standard Word numbering and heading styles for better clause detection.`,`3. Remove tracked deletions / comments if the document parses poorly.`,`4. If DOCX parsing fails, export the document to .txt and analyze that copy.`,`5. Validate definitions, cross-references, and placeholders before relying on outputs.`]; if(warnings.length){parts.push('', 'Current warnings:'); warnings.forEach(w=>parts.push(`- ${w}`));} return parts.join('\n');}
function exportSessionJson(){if(!state.clauses.length){showToast('Load a document first','warn');return;}downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_session_${buildDateStamp()}.json`,new Blob([JSON.stringify(serializeStateForExport(),null,2)],{type:'application/json'}));}
async function exportSessionBundleJson(){if(!state.clauses.length){showToast('Load a document first','warn');return;} try{ const snapshots=await listSnapshots(); const bundle={buildVersion:BUILD_VERSION, exportedAt:new Date().toISOString(), document:{fileName:state.documentMeta.fileName||'Untitled', contractType:state.contractType||'Custom'}, session:serializeStateForExport(), snapshots:snapshots.map(s=>({id:s.id,label:s.label||s.fileName||'Snapshot',createdAt:s.createdAt||'',clauseCount:s.clauseCount||0,noteCount:s.noteCount||0,payload:s.payload||{}})), outputs:{emailSummary:buildEmailSummaryTxt(), negotiationAgenda:formatNegotiationAgenda(), approvalPack:formatApprovalPack(), changeInstructions:buildChangeInstructionPack(), evidenceLedgerCsv:buildEvidenceLedgerCsv()}, diagnostics:{lastAction:state.diagnostics.lastAction||'', lastRender:state.diagnostics.lastRender||'', lastError:state.diagnostics.lastError||''}}; let bundleJson=''; try{ bundleJson=JSON.stringify(bundle,null,2); }catch(err){ throw new Error(`Bundle serialization failed: ${err?.message||err}`); } downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_session_bundle_${buildDateStamp()}.json`, new Blob([bundleJson], {type:'application/json'})); }catch(e){ console.error(e); showToast(e?.message||'Bundle export failed','error'); } }
function exportEmailSummaryTxt(){if(!state.clauses.length){showToast('Load a document first','warn');return;}downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_email_${buildDateStamp()}.txt`,new Blob([buildEmailSummaryTxt()],{type:'text/plain;charset=utf-8'}));}
function exportWorkingNotesTxt(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_working_notes_${buildDateStamp()}.txt`,new Blob([formatWorkingNotesExport()],{type:'text/plain;charset=utf-8'}));}
function exportNegotiationAgendaTxt(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_internal_negotiation_prep_${buildDateStamp()}.txt`,new Blob([formatNegotiationAgenda()],{type:'text/plain;charset=utf-8'}));}
function exportChangeInstructionsTxt(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_changes_${buildDateStamp()}.txt`,new Blob([buildChangeInstructionPack()],{type:'text/plain;charset=utf-8'}));}
function exportClauseLibraryJson(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_library_${buildDateStamp()}.json`,new Blob([JSON.stringify(state.clauseLibrary||[],null,2)],{type:'application/json'}));}
function buildTermsCsv(){const rows=[['Term','Type','Confidence','Scope','Defined In','Uses','Definition']];Object.values(state.definedTerms).sort((a,b)=>a.term.localeCompare(b.term)).forEach(t=>{rows.push([t.term,t.definitionType,t.confidence,t.scope||'global',state.clauses.find(c=>c.id===t.definedInClauseId)?.number||'',String(t.usedInClauseIds.length),(t.resolutionStatus==='resolved'?t.resolvedDefinition:'')||t.definition||t.contextSentence||'']);});return rows.map(r=>r.map(csvEscape).join(',')).join('\n');}
function exportTermsCsv(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_terms_${buildDateStamp()}.csv`,new Blob([buildTermsCsv()],{type:'text/csv'}));}
function buildObligationsCsv(){const rows=[['Clause','Party','Action','Deadline','Timing characterization','Topic','Confidence','Lawyer confirmed','Source sentence']];state.obligations.forEach(i=>rows.push([i.clauseLabel,i.party,i.action,i.deadline||'',i.timingCharacterization||'',i.topic||'',i.confidence||'',state.obligationVerification?.[i.id]==='confirmed'?'Yes':'No',i.sourceSentence||'']));return rows.map(r=>r.map(csvEscape).join(',')).join('\n');}
function exportObligationsCsv(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_obligations_${buildDateStamp()}.csv`,new Blob([buildObligationsCsv()],{type:'text/csv'}));}

/* -- Bulk actions -- */
function bulkSetVisiblePositions(value){const f=getFilteredClauses().filter(c=>state.navigatorMode!=='triage'||getTriageReasons(c).length);if(!f.length){showToast('No visible clauses','info');return;}if(!window.confirm(`Set ${value} for ${f.length} clause${f.length===1?'':'s'}?`))return;let ch=0;f.forEach(c=>{if((state.clausePositions[c.id]||'')!==value){setClausePosition(c.id,value);ch++;}});if(!ch){showToast('Already set','info');return;}flashClauseItems(f.map(c=>c.id));showToast(`Set ${value} for ${ch}`,'info');}
function findNextObligationFromSelection(){const cls=state.clauses||[];if(!cls.length)return null;const si=Math.max(0,cls.findIndex(c=>c.id===state.selectedClauseId));const ranked=(state.obligations||[]).map(i=>{const ci=cls.findIndex(c=>c.id===i.clauseId);return{item:i,clauseIdx:ci,explicit:!!String(i.deadline||'').trim()};}).filter(e=>e.clauseIdx>=si).sort((a,b)=>(a.clauseIdx-b.clauseIdx)||((b.explicit?1:0)-(a.explicit?1:0)));return ranked[0]?.item||null;}
function jumpToNextObligation(){const n=findNextObligationFromSelection();if(!n){showToast('No later obligations','info');return;}jumpToClause(n.clauseId);setActiveToolsTab('timeline');showToast(`Next: ${n.party}${n.deadline?` - ${n.deadline}`:''}`,'info');}

/* -- Promote/ignore terms -- */
function promotePossibleDefinedTerm(term,clauseId){
const idx=state.possibleDefinedTerms.findIndex(i=>i.term===term&&String(i.clauseId)===String(clauseId));if(idx===-1)return;const cand=state.possibleDefinedTerms[idx];
if(!state.definedTerms[cand.term]){const promoted={term:cand.term,normalized:cand.term,definition:cand.definition||'',contextSentence:cand.contextSentence||'',definitionType:'promoted',confidence:'reviewer',confidenceRank:5,detectionRule:'promoted_possible_term',definedInClauseId:cand.clauseId,usedInClauseIds:[],scope:'global'};recomputeUsageForTerm(promoted);state.definedTerms[cand.term]=promoted;}
state.possibleDefinedTerms.splice(idx,1);precomputeTermHits();
state.issues.undefinedCapitalizedTerms=detectUndefinedCapitalizedTerms(state.clauses,state.definedTerms);state.issues.unusedDefinitions=detectUnusedDefinitions(state.definedTerms);state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);state.reviewItems=buildCanonicalReviewItems();
renderClauseView();renderActiveRightPanel();scheduleAutosave();
}
function ignorePossibleTerm(term){if(!term)return;if(!state.ignoredTerms.includes(term))state.ignoredTerms.push(term);state.possibleDefinedTerms=state.possibleDefinedTerms.filter(i=>i.term!==term);renderAfterContentChange();scheduleAutosave();}
function ignoreUndefinedTerm(term){if(!term)return;if(!state.ignoredUndefinedTerms.includes(term))state.ignoredUndefinedTerms.push(term);state.issues.undefinedCapitalizedTerms=state.issues.undefinedCapitalizedTerms.filter(i=>i.term!==term);renderAfterContentChange();scheduleAutosave();}

/* -- Library management -- */
function mergeClauseLibraryEntries(existing=[],imported=[]){const m=new Map();[...existing,...imported].forEach((i,idx)=>{if(!i||typeof i!=='object')return;const n={...i,id:String(i.id||`lib-import-${idx+1}`),title:String(i.title||'Untitled'),text:String(i.text||'').trim(),type:String(i.type||'General'),tags:Array.isArray(i.tags)?i.tags.filter(Boolean):[],notes:String(i.notes||''),standardPosition:String(i.standardPosition||''),fallbackPosition:String(i.fallbackPosition||''),negotiatingPoints:String(i.negotiatingPoints||''),sourceDocument:String(i.sourceDocument||''),createdAt:i.createdAt||new Date().toISOString(),updatedAt:i.updatedAt||i.createdAt||new Date().toISOString()};if(!n.text)return;const ex=m.get(n.id);if(!ex)m.set(n.id,n);else if(String(n.updatedAt||n.createdAt||'')>=String(ex.updatedAt||ex.createdAt||''))m.set(n.id,n);});return Array.from(m.values()).sort((a,b)=>String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));}
function getDefaultLibraryEntries(){ return mergeClauseLibraryEntries([], DEFAULT_LIBRARY_ENTRIES); }
function normalizeLibraryEntry(raw){if(!raw||typeof raw!=='object'||typeof raw.text!=='string'||!raw.text.trim()||raw.text.length>MAX_LIBRARY_TEXT_LENGTH)return null;const now=new Date().toISOString();const field=value=>String(value||'').slice(0,4000);return{id:field(raw.id)||`lib-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title:field(raw.title).trim()||'Untitled',text:raw.text.trim(),type:field(raw.type).trim()||'General',tags:Array.isArray(raw.tags)?raw.tags.slice(0,30).map(value=>field(value).slice(0,80)).filter(Boolean):[],notes:field(raw.notes),standardPosition:field(raw.standardPosition),fallbackPosition:field(raw.fallbackPosition),negotiatingPoints:field(raw.negotiatingPoints),sourceDocument:field(raw.sourceDocument),createdAt:raw.createdAt||now,updatedAt:raw.updatedAt||now};}
function saveClauseLibraryState(){boilerplateScoresDirty=true;persistClauseLibrary();renderStrategyPanel();scheduleAutosave();}
function openLibraryModal(config={}){const{mode='add',entry=null,clause=null,title=''}=config;if(!els.libraryModal)return;els.libraryFormTitle.textContent=title||(mode==='edit'?'Edit library clause':'Add to library');els.libraryEntryId.value=entry?.id||'';els.libraryTitleInput.value=entry?.title||(clause?`${clause.number||''} - ${clause.heading||''}`.trim():'');els.libraryTypeInput.value=entry?.type||clause?.type||'General';els.libraryTagsInput.value=(entry?.tags||(clause?.type?[clause.type]:[])).join(', ');els.libraryNotesInput.value=entry?.notes||'';els.libraryStandardPositionInput.value=entry?.standardPosition||(clause?(state.clauseRecommendations[clause.id]||state.clausePositions[clause.id]||''):'');els.libraryFallbackPositionInput.value=entry?.fallbackPosition||(clause?(state.clauseFallbacks[clause.id]||''):'');els.libraryNegotiatingPointsInput.value=entry?.negotiatingPoints||'';els.libraryTextInput.value=entry?.text||clause?.body||'';els.libraryForm.dataset.mode=mode;els.libraryForm.dataset.sourceDocument=entry?.sourceDocument||state.documentMeta.fileName||'';els.libraryForm.dataset.sourceClauseId=entry?.sourceClauseId||clause?.id||'';openModal(els.libraryModal);}
function closeLibraryModal(){closeModal(els.libraryModal);els.libraryForm?.reset();if(els.libraryEntryId)els.libraryEntryId.value='';}
function submitLibraryForm(e){e.preventDefault();const id=els.libraryEntryId.value||`lib-${Date.now()}`;const entry={id,title:(els.libraryTitleInput.value||'').trim()||'Untitled',text:(els.libraryTextInput.value||'').trim(),type:(els.libraryTypeInput.value||'General').trim()||'General',tags:(els.libraryTagsInput.value||'').split(',').map(v=>v.trim()).filter(Boolean),notes:els.libraryNotesInput.value||'',standardPosition:els.libraryStandardPositionInput.value||'',fallbackPosition:els.libraryFallbackPositionInput.value||'',negotiatingPoints:els.libraryNegotiatingPointsInput.value||'',sourceDocument:els.libraryForm.dataset.sourceDocument||'',sourceClauseId:els.libraryForm.dataset.sourceClauseId||'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};if(!entry.text){showToast('Clause text is required','warn');return;}const ei=state.clauseLibrary.findIndex(i=>i.id===id);if(ei>-1){entry.createdAt=state.clauseLibrary[ei].createdAt||entry.createdAt;state.clauseLibrary[ei]=entry;}else state.clauseLibrary.unshift(entry);saveClauseLibraryState();closeLibraryModal();}
function saveClauseToLibrary(cid){const c=state.clauses.find(x=>x.id===cid);if(c)openLibraryModal({mode:'add',clause:c});}
function saveClauseAsPlaybook(cid){const c=state.clauses.find(x=>x.id===cid);if(c)openLibraryModal({mode:'add',clause:c,title:'Save playbook entry'});}
function addManualLibraryEntry(){openLibraryModal({mode:'add'});}
function editLibraryEntry(id){const i=state.clauseLibrary.find(x=>x.id===id);if(i)openLibraryModal({mode:'edit',entry:i});}
function deleteLibraryEntry(id){state.clauseLibrary=state.clauseLibrary.filter(x=>x.id!==id);saveClauseLibraryState();}
function handleClauseLibraryImport(e){const f=e.target.files?.[0];if(!f)return;if(f.size>MAX_LIBRARY_FILE_BYTES){showToast('Precedent import exceeds the 3 MB safety limit.','error');e.target.value='';return;}f.text().then(t=>{const imp=JSON.parse(t);if(!Array.isArray(imp)||imp.length>MAX_LIBRARY_ENTRIES)throw new Error(`Import must contain no more than ${MAX_LIBRARY_ENTRIES} entries.`);const norm=imp.map(normalizeLibraryEntry).filter(Boolean);if(!norm.length)throw new Error('No valid entries');const rejected=imp.length-norm.length;const preview=norm.slice(0,5).map(item=>item.title).join('\n• ');if(!window.confirm(`Import ${norm.length} validated precedent${norm.length===1?'':'s'}${rejected?` (${rejected} rejected by limits)`:''}?\n\nPreview:\n• ${preview}${norm.length>5?'\n• …':''}`))return;state.clauseLibrary=mergeClauseLibraryEntries(state.clauseLibrary,norm).slice(0,MAX_LIBRARY_ENTRIES);boilerplateScoresDirty=true;saveClauseLibraryState();showToast(`Imported ${norm.length} entries${rejected?`; rejected ${rejected}`:''}`,'info');}).catch(err=>{console.warn(err);showToast(err?.message||'Unable to import library.','error');}).finally(()=>{if(els.libraryImportInput)els.libraryImportInput.value='';});}

/* -- Storage -- */
function serializeStateForStorage(){const p=JSON.parse(JSON.stringify(state));delete p.clauseLibrary;delete p.playbookPackages;delete p.clauseRedlineCache;delete p.pendingRestoreSession;delete p.pendingRestoreMeta;delete p.navHistory;delete p.navHistoryIndex;delete p.navForwardHistory;p.noteFormOpen=!!(p.noteDraft&&String(p.noteDraft.text||'').length);p.sessionRestored=false;p.snapshotNotice='';p.loadingMessage='';p.focusMode=false;p.clauseCompareMode={};p.clauseRedlineMode={};p.reviewLog=Array.isArray(p.reviewLog)?p.reviewLog.slice(-MAX_REVIEW_LOG_ENTRIES):[];p.lastPersistedAt=new Date().toISOString();p.writerTabId=TAB_SESSION_ID;p.storageGeneration=autosaveDirtyGeneration;p.buildVersion=BUILD_VERSION;p.schemaVersion=SESSION_SCHEMA_VERSION;p.analyzerVersion=ANALYZER_VERSION;p.sourceHash=state.documentMeta?.sourceFingerprint||'';return p;}
function serializeStateForExport(){const p=JSON.parse(JSON.stringify(state));delete p.clauseLibrary;delete p.playbookPackages;p.currentRound=Number(state.currentRound||1);p.savedWorkspaces=state.savedWorkspaces||[];p.sessionReturn=state.sessionReturn||{};p.selectedSnapshotCompareId=state.selectedSnapshotCompareId||'';p.selectedRoundCompareKey=state.selectedRoundCompareKey||'';p.compareOnlyMode=!!state.compareOnlyMode;p.definitionPassDoneAt=state.definitionPassDoneAt||'';delete p.navHistory;delete p.navHistoryIndex;delete p.navForwardHistory;delete p.pendingRestoreMeta;p.noteFormOpen=!!(p.noteDraft&&String(p.noteDraft.text||'').length);p.sessionRestored=false;p.snapshotNotice='';p.loadingMessage='';p.focusMode=false;delete p.clauseRedlineCache;p.reviewLog=Array.isArray(p.reviewLog)?p.reviewLog.slice(-MAX_REVIEW_LOG_ENTRIES):[];p.lastPersistedAt=new Date().toISOString();p.buildVersion=BUILD_VERSION;p.schemaVersion=SESSION_SCHEMA_VERSION;p.analyzerVersion=ANALYZER_VERSION;p.sourceHash=state.documentMeta?.sourceFingerprint||'';return p;}
function sanitizeClauseId(id,fallback){
  const raw=typeof id==='string'?id:String(id||'');
  const cleaned=raw.replace(/[^A-Za-z0-9_.:-]/g,'').trim();
  return cleaned||fallback;
}
function remapObjectKeys(obj,idMap){
  if(!obj||typeof obj!=='object') return {};
  const out={};
  Object.entries(obj).forEach(([k,v])=>{ const nk=idMap[k]||sanitizeClauseId(k,k); out[nk]=v; });
  return out;
}
function ensureClauseIds(clauses){
  const seen=new Set();
  return (Array.isArray(clauses)?clauses:[]).map((c,idx)=>{
    const base=sanitizeClauseId(c?.id, `clause-${idx+1}`);
    let id=base; let n=1;
    while(seen.has(id)) { id=`${base}-${n++}`; }
    seen.add(id);
    return {...(c&&typeof c==='object'?c:{}), id};
  });
}
function getSafeSnapshotLabel(){
  const el=getSnapshotLabelInput();
  const stage=document.getElementById('snapshotStageSelect');
  const raw=el?String(el.value||'').trim():'';
  const stageLabel=stage?String(stage.value||'').trim():'';
  return [stageLabel,raw].filter(Boolean).join(' — ');
}
function getDocxSupportState(){ return docxSupportState===true; }
async function probeDocxSupportState(){
  if(docxSupportProbePromise) return docxSupportProbePromise;
  docxSupportProbePromise=(async()=>{
    if(typeof DecompressionStream==='undefined'){ docxSupportState=false; return docxSupportState; }
    try{
      const compressed=new Uint8Array([243,247,6,0]); // raw deflate for "OK"
      const ds=new DecompressionStream('deflate-raw');
      const result=new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(ds)).arrayBuffer());
      docxSupportState=(new TextDecoder().decode(result)==='OK');
    }catch{
      docxSupportState=false;
    }
    return docxSupportState;
  })();
  return docxSupportProbePromise;
}
function updateUploadZoneCopy(){
  const supported=getDocxSupportState();
  if(els.uploadPrimaryCopy) els.uploadPrimaryCopy.innerHTML=supported ? 'Drop a <strong>.docx</strong> or <strong>.txt</strong> file here' : 'Drop a <strong>.txt</strong> file here <span class="inline-subtle">(.docx unavailable in this browser)</span>' ;
  if(els.uploadSecondaryCopy) els.uploadSecondaryCopy.textContent=supported ? 'or click to browse' : 'or click to browse (.txt / .html / session .json recommended here)';
}
function getAttentionScore(cid){
  let score=0;
  if((state.clauseRiskScores?.[cid]||'Low')==='High') score+=3; else if((state.clauseRiskScores?.[cid]||'Low')==='Medium') score+=1;
  if((state.notes||[]).some(n=>n.clauseId===cid)) score+=1;
  if((state.placeholders||[]).some(p=>p.clauseId===cid && !p.resolved)) score+=2;
  if((state.clausePositions?.[cid]||'') && !['Acceptable',''].includes(state.clausePositions?.[cid]||'')) score+=1;
  return score;
}
function getDraftingHints(clause){
  const text=String(clause?.body||'').toLowerCase();
  const hints=[];
  if(text.includes('reasonable efforts')) hints.push('Consider tightening to “commercially reasonable efforts” or a measurable standard.');
  if(text.includes('sole discretion')) hints.push('High-risk phrasing — consider adding an objective or reasonableness qualifier.');
  if(text.includes('material adverse')) hints.push('Check whether the trigger needs objective thresholds or examples.');
  return hints;
}
function renderDraftingHintsHtml(clause){
  const hints=getDraftingHints(clause);
  if(!hints.length) return '';
  return `<div class="tool-card compact drafting-hints-card"><div class="panel-subhead">Drafting hints</div>${hints.map(h=>`<div class="mini">• ${escapeHtml(h)}</div>`).join('')}</div>`;
}
function generateNegotiationSnapshot(cid){
  const clause=(state.clauses||[]).find(c=>c.id===cid); if(!clause) return '';
  const intel=evaluateClauseIntelligence(clause)||{};
  return [`Clause: ${(clause.number||'').trim()} ${(clause.heading||'').trim()}`.trim(),`Our position: ${state.clausePositions?.[cid]||'Not set'}`,`Counterparty: ${state.clauseCounterpartyPositions?.[cid]||'Not captured'}`,`Strategy: ${intel.strategyType||'—'}`,`Fallback: ${intel.recommendation||'—'}`,`Risk: ${state.clauseRiskScores?.[cid]||'Low'}`].join('\n');
}
function renderClauseContextHeader(clause){
  if(!clause) return '';
  const risk=state.clauseRiskScores?.[clause.id]||'Low';
  const pos=state.clausePositions?.[clause.id]||'—';
  const index=(state.clauses||[]).findIndex(item=>item.id===clause.id);const hasNext=index>=0&&index<state.clauses.length-1;
  return `<div class="context-header"><span class="pill risk-${slugifyStatus(risk)}">${escapeHtml(risk)}</span><span class="pill">${escapeHtml(clause.type||'General')}</span><span class="pill">Position: ${escapeHtml(pos)}</span><details class="source-correction-menu"><summary class="link-btn">Correct source</summary><div><button type="button" class="link-btn" data-action="correct-split-clause">Split this clause…</button>${hasNext?'<button type="button" class="link-btn" data-action="correct-merge-next">Merge with next…</button>':''}</div></details></div>`;
}

function recomputeAfterSourceCorrection(){
  classifyClauses(state.clauses);const td=extractDefinedTerms(state.clauses,[]);state.definedTerms=td.terms;state.possibleDefinedTerms=td.possibleTerms;state.issues.duplicateDefinitions=td.duplicateDefinitions;resolveCrossReferencedDefinitions(state.clauses,state.definedTerms);mapTermUsage(state.clauses,state.definedTerms);precomputeTermHits();state.issues.undefinedCapitalizedTerms=detectUndefinedCapitalizedTerms(state.clauses,state.definedTerms);state.issues.unusedDefinitions=detectUnusedDefinitions(state.definedTerms);state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);state.legalConceptEvidence=ANALYSIS_CORE.detectLegalConcepts?.(state.clauses)||{byConcept:{},all:[],present:{}};state.legalPropositions=ANALYSIS_CORE.extractLegalPropositions?.(state.clauses,state.rawText||'')||[];state.issues.asymmetries=ANALYSIS_CORE.detectAsymmetries?.(state.clauses,state.rawText||'',state.legalPropositions)||[];state.referenceLedger=buildReferenceLedger(state.clauses);state.issues.crossReferenceBreaks=state.referenceLedger.filter(item=>item.status==='missing'||item.status==='ambiguous');state.issues.semanticCrossReferenceWarnings=state.referenceLedger.filter(item=>item.status==='semantic-mismatch');state.expectedClauseCoverage=detectExpectedClauseCoverage(state.clauses,state.contractType);state.documentMeta.sourceIntegrity={...(state.documentMeta.sourceIntegrity||{}),lawyerCorrected:true,requiresConfirmation:false};calculateAllRiskScores();state.reviewItems=buildCanonicalReviewItems();recomputeDerivedState('source-correction');renderAll();scheduleAutosave({reason:'critical'});
}
function invalidateDecisionAfterSourceChange(clauseIds,reason){for(const clauseId of clauseIds.filter(Boolean)){const prior=state.decisionByClause?.[clauseId];if(prior?.type)logReviewAction('decision-invalidated-by-source-change',clauseId,{summary:reason,priorDecision:JSON.parse(JSON.stringify(prior))});delete state.decisionByClause?.[clauseId];delete state.clausePositions?.[clauseId];delete state.clauseReviewStatus?.[clauseId];delete state.verificationByKey?.[`clause-source-${clauseId}`];}state.documentMeta.sourceCorrectionAudit=[...(state.documentMeta.sourceCorrectionAudit||[]),{at:new Date().toISOString(),reason,affectedClauseIds:[...clauseIds]}].slice(-100);}
let pendingSourceCorrection=null;
function getSuggestedSplitMarkers(clause){return String(clause?.body||'').split(/\r?\n/).map(line=>line.trim()).filter((line,index)=>index>0&&line.length>4&&(parseClauseHeading(line)||/^\(?[a-z0-9ivx]+\)[.)]?\s+/i.test(line))).slice(0,6).map(line=>line.slice(0,120));}
function updateSourceCorrectionPreview(){if(!pendingSourceCorrection)return;const {kind,clause,next}=pendingSourceCorrection;if(kind==='merge'){els.sourceCorrectionPreview.innerHTML=`<div><strong>Current</strong><pre>${escapeHtml(`${clause.number||''} ${clause.heading||''}\n${clause.body||''}`.trim())}</pre></div><div><strong>Will absorb</strong><pre>${escapeHtml(`${next.number||''} ${next.heading||''}\n${next.body||''}`.trim())}</pre></div><p class="mini">Notes will be remapped. Decisions on both source units will be archived and require reconfirmation.</p>`;return;}const marker=String(els.sourceSplitMarkerInput?.value||'').trim(),at=String(clause.body||'').indexOf(marker);const valid=at>0;els.confirmSourceCorrectionBtn.disabled=!valid;els.sourceCorrectionPreview.innerHTML=valid?`<div class="source-preview-columns"><div><strong>Clause remains</strong><pre>${escapeHtml(String(clause.body||'').slice(0,at).trim())}</pre></div><div><strong>New clause</strong><pre>${escapeHtml(String(clause.body||'').slice(at).trim())}</pre></div></div><p class="mini">The source mapping will be split at this exact boundary; both decisions require reconfirmation.</p>`:`<p class="source-preview-invalid">Enter an exact marker found after the start of this clause.</p>`;}
function closeSourceCorrectionDialog(){pendingSourceCorrection=null;closeModal(els.sourceCorrectionModal);}
function correctSplitClause(cid){const clause=(state.clauses||[]).find(item=>item.id===cid);if(!clause)return;pendingSourceCorrection={kind:'split',clause};els.sourceCorrectionTitle.textContent='Split source clause';els.sourceCorrectionDescription.textContent='Choose or enter the exact first words of the next clause. Review the before/after boundary before applying.';els.sourceSplitMarkerLabel.classList.remove('hidden');els.sourceSplitMarkerInput.value='';const candidates=getSuggestedSplitMarkers(clause);els.sourceCorrectionCandidates.innerHTML=candidates.length?candidates.map(marker=>`<button type="button" class="source-boundary-candidate" data-source-marker="${escapeHtml(marker)}">${escapeHtml(marker)}</button>`).join(''):'<p class="mini">No reliable automatic boundary was found. Paste an exact marker from the clause text.</p>';els.confirmSourceCorrectionBtn.disabled=true;updateSourceCorrectionPreview();openModal(els.sourceCorrectionModal);}
function correctMergeWithNext(cid){const index=(state.clauses||[]).findIndex(item=>item.id===cid);if(index<0||index>=state.clauses.length-1)return;pendingSourceCorrection={kind:'merge',clause:state.clauses[index],next:state.clauses[index+1]};els.sourceCorrectionTitle.textContent='Merge source clauses';els.sourceCorrectionDescription.textContent='Review both source units. Applying this correction archives their decisions and creates a recovery snapshot.';els.sourceSplitMarkerLabel.classList.add('hidden');els.sourceCorrectionCandidates.innerHTML='';els.confirmSourceCorrectionBtn.disabled=false;updateSourceCorrectionPreview();openModal(els.sourceCorrectionModal);}
async function applyPendingSourceCorrection(){if(!pendingSourceCorrection)return;const {kind,clause,next}=pendingSourceCorrection;if(kind==='split'){const marker=String(els.sourceSplitMarkerInput.value||'').trim(),at=String(clause.body||'').indexOf(marker);if(at<=0)return;const baseSpans=clause.sourceSpans?.length?clause.sourceSpans:REVIEW_CORE.fullBlockSpans(clause.sourceBlockIds||[],state.sourceBlocks);const spanSplit=REVIEW_CORE.splitSourceSpans(baseSpans,state.sourceBlocks,marker);if(!spanSplit.exact){showToast('The marker could not be mapped exactly to imported source blocks.','warn');return;}await saveSnapshotRecord(`Recovery before source split · ${clause.number||clause.heading}`,getActiveWorkflowStage(),{recovery:true});const tail=String(clause.body||'').slice(at).trim(),parsed=parseClauseHeading(tail.split(/\r?\n/)[0])||parseClauseHeading(tail),newId=`clause-corrected-${Date.now()}`,split=parsed?splitNumberedClauseContent(parsed,tail):null;const newClause={...clause,id:newId,number:parsed?.number||`${clause.number||''}a`,heading:split?.heading||conciseClauseHeading(tail),body:split?.body||tail,sourceSpans:spanSplit.right,sourceCorrection:{kind:'manual-split',fromClauseId:clause.id,atText:marker,correctedAt:new Date().toISOString(),requiresDecisionReconfirmation:true},issues:[],noteIds:[]};clause.body=String(clause.body||'').slice(0,at).trim();clause.sourceSpans=spanSplit.left;clause.sourceCorrection={kind:'manual-split-origin',newClauseId:newId,correctedAt:new Date().toISOString(),requiresDecisionReconfirmation:true};state.clauses.splice(state.clauses.indexOf(clause)+1,0,newClause);invalidateDecisionAfterSourceChange([clause.id,newId],`Clause split at “${marker.slice(0,80)}”`);state.selectedClauseId=newId;logReviewAction('source-clause-split',clause.id,{summary:`Created ${newClause.number||newClause.heading}`,affectedClauseIds:[clause.id,newId]});}
  else{await saveSnapshotRecord(`Recovery before source merge · ${clause.number||clause.heading}`,getActiveWorkflowStage(),{recovery:true});const priorIds=[...(clause.sourceBlockIds||[])],nextIds=[...(next.sourceBlockIds||[])],left=clause.sourceSpans?.length?clause.sourceSpans:REVIEW_CORE.fullBlockSpans(priorIds,state.sourceBlocks),right=next.sourceSpans?.length?next.sourceSpans:REVIEW_CORE.fullBlockSpans(nextIds,state.sourceBlocks);clause.body=[clause.body,`${next.number||''} ${next.heading||''}`.trim(),next.body].filter(Boolean).join('\n');clause.sourceBlockIds=[...new Set([...priorIds,...nextIds])];clause.sourceSpans=REVIEW_CORE.mergeSourceSpans(left,right);clause.sourceCorrection={kind:'manual-merge',mergedClauseId:next.id,correctedAt:new Date().toISOString(),requiresDecisionReconfirmation:true};state.notes=(state.notes||[]).map(note=>note.clauseId===next.id?{...note,clauseId:clause.id}:note);invalidateDecisionAfterSourceChange([clause.id,next.id],`Merged ${next.number||next.heading} into ${clause.number||clause.heading}`);state.clauses.splice(state.clauses.indexOf(next),1);state.selectedClauseId=clause.id;logReviewAction('source-clauses-merged',clause.id,{summary:`Merged ${next.number||next.heading}`,affectedClauseIds:[clause.id,next.id]});}
  closeSourceCorrectionDialog();recomputeAfterSourceCorrection();showToast('Source structure corrected. A recovery snapshot was saved and affected decisions require reconfirmation.','info');
}
function getMatterStatusSummary(){
  const signing=computeSigningReadinessChecks();
  const approvals=(state.clauses||[]).filter(c=>deriveIssueCard(c)?.approvalNeeded==='Yes').length;
  const reviewed=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length;
  return {phase: getWorkflowStageLabel(getActiveWorkflowStage()), reviewed, total: state.clauses.length||0, escalations:Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Escalated').length, approvals, readiness: signing.level||'Unknown'};
}
function renderMatterStatusCard(){
  const s=getMatterStatusSummary();
  return `<div class="tool-card compact matter-status-card"><div class="panel-subhead">Matter status</div><div class="mini"><strong>Phase:</strong> ${escapeHtml(s.phase)} • <strong>Reviewed:</strong> ${s.reviewed}/${s.total} • <strong>Escalations:</strong> ${s.escalations} • <strong>Approvals pending:</strong> ${s.approvals} • <strong>Readiness:</strong> ${escapeHtml(s.readiness)}</div></div>`;
}
function renderGuardrailCheckCard(){
  const items=[];
  const missing=state.expectedClauseCoverage?.missing||[];
  missing.slice(0,4).forEach(m=>items.push(`Missing expected clause: ${m}`));
  (state.issues?.crossClauseChecks||[]).forEach(check=>items.push(`${check.label}: ${check.summary}`));
  (state.clauses||[]).forEach(c=>{ const intel=evaluateClauseIntelligence(c)||{}; (intel.missingProtections||[]).slice(0,1).forEach(mp=>items.push(`${c.number||c.heading}: ${mp}`)); });
  const uniq=[...new Set(items)].slice(0,6);
  if(!uniq.length) return '';
  return `<div class="tool-card compact"><div class="panel-subhead">Guardrail check</div>${uniq.map(i=>`<div class="mini">• ${escapeHtml(i)}</div>`).join('')}</div>`;
}
function detectCrossClauseChecks(){
  const checks=[];const text=String(state.rawText||'');const terms=ANALYSIS_CORE.extractCommercialTermsSummary?.(text)||{};
  if(terms.governingLaw&&terms.governingLaw!=='Not detected'&&terms.disputeResolution&&terms.disputeResolution!=='Not detected')checks.push({id:'law-forum',label:'Governing law and forum',status:'verify',summary:'Both provisions were found. Verify that the chosen law, court and arbitration routes align.'});
  const cap=(state.clauses||[]).find(c=>/limitation of liability|liability cap/i.test(`${c.heading} ${c.body}`));
  const indemnity=(state.clauses||[]).find(c=>/indemnif/i.test(`${c.heading} ${c.body}`));
  if(cap&&indemnity)checks.push({id:'indemnity-cap',label:'Indemnity and liability cap',status:'verify',clauseIds:[indemnity.id,cap.id],summary:/indemn/i.test(cap.body||'')?'A cap treatment for indemnities may be stated. Verify scope and carve-outs.':'No explicit indemnity treatment was found in the liability-cap clause. Verify whether indemnities are capped.'});
  const confidentiality=(state.clauses||[]).find(c=>/confidential/i.test(`${c.heading} ${c.body}`));
  if(confidentiality)checks.push({id:'confidentiality-survival',label:'Confidentiality survival',status:'verify',clauseIds:[confidentiality.id],summary:/surviv|after (?:termination|expiry)|years?/i.test(confidentiality.body||'')?'A survival period appears present. Verify duration and treatment of trade secrets.':'No clear post-termination duration was found in the confidentiality clause.'});
  if(terms.renewal&&terms.renewal!=='Not detected')checks.push({id:'renewal-term',label:'Renewal, term and notice',status:'verify',summary:terms.terminationNotice&&terms.terminationNotice!=='Not detected'?'Renewal and termination-notice language were found. Verify dates, notice windows and interaction.':'Renewal language was found without a clear termination-notice period.'});
  const relation=(id,label,patterns,summary)=>{const clauseIds=(state.clauses||[]).filter(c=>patterns.some(pattern=>pattern.test(`${c.heading||''} ${c.body||''}`))).map(c=>c.id);if(clauseIds.length>=2)checks.push({id,label,status:'verify',clauseIds:[...new Set(clauseIds)],summary});};
  relation('liability-indemnity-insurance','Liability, indemnity and insurance',[/\bliabilit/i,/\bindemnif/i,/\binsurance\b/i],'Verify that every indemnity and insurance obligation fits the agreed cap, carve-outs and recovery structure.');
  relation('term-termination-renewal','Term, renewal and termination',[/\binitial term|\bterm of/i,/\brenew(?:al|s|ed)?\b/i,/\bterminat/i],'Verify renewal mechanics, termination notice windows, accrued fees and transition consequences together.');
  relation('acceptance-payment-warranty','Acceptance, payment and warranty',[/\baccept(?:ance|ed)|\breject(?:ion|ed)/i,/\bpayment|\binvoice/i,/\bwarrant/i],'Verify that acceptance triggers, invoice timing, rejection rights and warranty remedies do not conflict.');
  relation('sla-credit-remedy','Service levels, credits and remedies',[/\bservice level|\buptime|\bavailability/i,/\bservice credit/i,/\bsole remedy|\bexclusive remedy/i],'Verify whether service credits are exclusive, capped, and coordinated with termination and damages rights.');
  relation('ip-license-exit','IP, licence and termination',[/\bintellectual property|\bbackground ip|\bwork product/i,/\blicen[cs]e/i,/\bterminat|\bexit|\btransition/i],'Verify ownership, continuing licences, return obligations and exit rights after termination.');
  relation('data-security-audit','Data, security, breach and audit',[/\bpersonal data|\bdata protection|\bprocessor\b/i,/\bsecurity|\bbreach|\bincident/i,/\baudit|\binspect|\bsub-?processor/i],'Verify that security, breach, audit and sub-processor duties align with liability, notification and data-return terms.');
  const propositionGroup=concept=>(state.legalPropositions||[]).filter(item=>item.concept===concept);
  const terminationRights=propositionGroup('termination').filter(item=>item.polarity==='affirmative');
  if(terminationRights.length)checks.push({id:'termination-rights-by-party',label:'Termination rights by party',status:'verify',clauseIds:[...new Set(terminationRights.map(item=>item.clauseId))],propositionIds:terminationRights.map(item=>item.id),summary:[...new Set(terminationRights.map(item=>item.actor))].map(actor=>`${actor}: ${terminationRights.filter(item=>item.actor===actor).length} detected right${terminationRights.filter(item=>item.actor===actor).length===1?'':'s'}`).join(' · ')});
  const forumRights=propositionGroup('forum election').filter(item=>item.polarity==='affirmative');
  if(forumRights.length)checks.push({id:'forum-election-by-party',label:'Forum election by party',status:'verify',clauseIds:[...new Set(forumRights.map(item=>item.clauseId))],propositionIds:forumRights.map(item=>item.id),summary:[...new Set(forumRights.map(item=>item.actor))].map(actor=>`${actor}: ${forumRights.filter(item=>item.actor===actor).length} detected option${forumRights.filter(item=>item.actor===actor).length===1?'':'s'}`).join(' · ')});
  return checks;
}
function normalizeSession(raw){
  if(!raw||typeof raw!=='object')return null;
  const idMap={};
  const clauses=Array.isArray(raw.clauses)?raw.clauses.map((c,i)=>{
    const s=c&&typeof c==='object'?{...c}:{};
    const safeId=sanitizeClauseId(s.id,`clause-restored-${i+1}`);
    idMap[s.id||safeId]=safeId;
    s.id=safeId;
    return s;
  }):[];
  const remapId=value=>idMap[value]||sanitizeClauseId(value,value||'');
  const remapDeep=value=>{
    if(Array.isArray(value))return value.map(remapDeep);
    if(!value||typeof value!=='object')return value;
    const out={};for(const [key,item] of Object.entries(value)){
      if(['clauseId','firstClauseId','secondClauseId','definedInClauseId','sourceClauseId','targetClauseId'].includes(key))out[key]=remapId(item);
      else if(['clauseIds','usedInClauseIds'].includes(key)&&Array.isArray(item))out[key]=item.map(remapId);
      else out[key]=remapDeep(item);
    }return out;
  };
  const keyMaps=['clausePositions','clauseReviewStatus','clauseTags','clauseRoutingTags','clauseCounterpartyPositions','clauseNegotiationStatus','clauseRecommendations','clauseFallbacks','clauseFallbackLadders','clauseCounterpartyNextSteps','clauseCounterpartyLastDiscussed','draftingOpenClauseIds','positionHistory','dismissedDraftingNudges','negotiationContextOpen','clauseApprovalStatus','clauseIssueStages','clauseAudienceSharing','reviewabilityOverrides','clauseRiskScores','reviewPriorityScores','clauseRiskCategories','clauseRiskNarratives','clauseBriefs'];
  const normalized={...raw,clauses};
  // Matter/session files never import browser-global precedent or playbook stores.
  delete normalized.clauseLibrary;delete normalized.playbookPackages;
  keyMaps.forEach(key=>{normalized[key]=remapObjectKeys(raw[key],idMap);});
  normalized.notes=remapDeep(Array.isArray(raw.notes)?raw.notes:[]);
  normalized.placeholders=remapDeep(Array.isArray(raw.placeholders)?raw.placeholders:[]);
  normalized.obligations=remapDeep(Array.isArray(raw.obligations)?raw.obligations:[]);
  normalized.deadlines=remapDeep(Array.isArray(raw.deadlines)?raw.deadlines:[]);
  normalized.openLoops=remapDeep(Array.isArray(raw.openLoops)?raw.openLoops:[]);
  normalized.reviewLog=remapDeep(Array.isArray(raw.reviewLog)?raw.reviewLog:[]);
  normalized.issues=remapDeep(raw.issues&&typeof raw.issues==='object'?raw.issues:{});
  normalized.definedTerms=remapDeep(raw.definedTerms&&typeof raw.definedTerms==='object'?raw.definedTerms:{});
  normalized.decisionByClause=remapObjectKeys(raw.decisionByClause,idMap);
  normalized.selectedClauseId=raw.selectedClauseId===OVERVIEW_ID?OVERVIEW_ID:remapId(raw.selectedClauseId);
  normalized.noteDraft=remapDeep(raw.noteDraft);
  normalized.readiness=raw.readiness&&typeof raw.readiness==='object'?raw.readiness:{status:'blocked',blockers:[],decidedCount:0,totalCount:0};
  normalized.workflowStage=typeof raw.workflowStage==='string'?raw.workflowStage:'decide';normalized.queuePreset=typeof raw.queuePreset==='string'?raw.queuePreset:'needs-decision';normalized.filters=raw.filters&&typeof raw.filters==='object'?{content:raw.filters.content||'all',review:raw.filters.review||'all'}:{content:'all',review:'all'};
  return normalized;
}
function validateSessionShape(session){
  if(!session||typeof session!=='object') return {ok:false,message:'Invalid session JSON.'};
  const normalized=normalizeSession(session);
  if(!normalized||!Array.isArray(normalized.clauses)) return {ok:false,message:'Session JSON must contain a clauses array.'};
  const clauses=normalized.clauses.filter(c=>c&&typeof c==='object').map((c,i)=>({
    ...c,
    id:(typeof c.id==='string'&&c.id.trim())?c.id.trim():`clause-restored-${i+1}`,
    body:typeof c.body==='string'?c.body:'',
    heading:typeof c.heading==='string'?c.heading:'',
    number:typeof c.number==='string'?c.number:''
  })).filter(c=>typeof c.body==='string');
  if(!clauses.length) return {ok:false,message:'Session JSON has no valid clauses.'};
  normalized.clauses=clauses;
  normalized.notes=(normalized.notes||[]).filter(n=>n&&typeof n==='object'&&typeof n.clauseId==='string');
  normalized.documentMeta=normalized.documentMeta&&typeof normalized.documentMeta==='object'?normalized.documentMeta:{fileName:'',loadedAt:'',sourceType:'session',warnings:[],matter:{}};
  normalized.schemaVersion=Number(normalized.schemaVersion)||SESSION_SCHEMA_VERSION;
  normalized.buildVersion=String(normalized.buildVersion||normalized.schemaVersion||'');
  normalized.placeholders=Array.isArray(normalized.placeholders)?normalized.placeholders:[];
  normalized.obligations=Array.isArray(normalized.obligations)?normalized.obligations:[];
  normalized.deadlines=Array.isArray(normalized.deadlines)?normalized.deadlines:[];
  return {ok:true,session:normalized};
}



function getDecisionCount(){ return getReviewableClauses().filter(c=>!!getClauseDecision(c.id).type).length; }
function hasLoadedDocument(){ return getReviewableClauses().length > 0; }
function getExportGuardState(){
  const total=getReviewableClauses().length;
  const decided=getDecisionCount();
  const ready = total>0 && decided>0;
  let message='';
  if(!total) message='Load a contract to generate exports.';
  else if(!decided) message='Add at least one decision to enable exports.';
  else if(decided<total) message=`Partial export warning: ${decided}/${total} clauses have decisions.`;
  return {ready,total,decided,message,partial: ready && decided<total};
}
function updateExportAvailability(){
  const guard=getExportGuardState();
  const sourceBlocked=hasUnconfirmedDegradedSource();
  const ids=['hubExportReportBtn','hubExportEmailBtn','hubExportWorkingNotesBtn','hubExportAgendaBtn','hubExportPackBtn','hubExportChangesBtn','approvalPackBtn','hubExportIssuesBtn','hubExportLeadershipIssuesBtn','hubPreviewNegotiationPackBtn','hubPreviewApprovalPackBtn','hubExportWordHandoffBtn','hubPreviewWordHandoffBtn','hubExportEvidenceLedgerBtn'];
  ids.forEach(id=>{ const el=els[id]; if(el) el.disabled=!guard.ready||sourceBlocked; });
  const approvalReady=!sourceBlocked&&guard.ready&&guard.decided===guard.total&&state.readiness?.approvalRequestReady===true;
  [els.approvalPackBtn,els.hubPreviewApprovalPackBtn].forEach(el=>{if(el){el.disabled=!approvalReady;el.title=approvalReady?'Ready to prepare an approval request':'Complete all decisions and approval-request blockers first';}});
  if(els.exportHubNotice){
    const message=sourceBlocked?'Source integrity verification is required before legal outputs.':guard.message||'';
    els.exportHubNotice.textContent=message;
    els.exportHubNotice.classList.toggle('hidden', !message);
    els.exportHubNotice.classList.toggle('warn', !!guard.partial||sourceBlocked);
  }
  return guard;
}
function hasUnconfirmedDegradedSource(){const ledger=buildSourceConfidenceLedger();if(ledger.status==='strong')return false;const assurance=state.sourceAssurance;if(!assurance)return true;return assurance.sourceFingerprint!==String(state.documentMeta?.sourceFingerprint||'')||!['no-material-omission','material-added'].includes(assurance.mode);}
function openSourceAssuranceDialog(){
  const ledger=buildSourceConfidenceLedger();if(ledger.status==='strong')return;
  els.sourceAssuranceWarnings.innerHTML=`<strong>Source content requiring verification</strong>${ledger.omitted.map(w=>`<p>${escapeHtml(w)}</p>`).join('')||'<p>The extracted clause map has material source limitations.</p>'}`;
  els.sourceSupplementText.value='';els.sourceNoMaterialOmissionCheckbox.checked=false;openModal(els.sourceAssuranceModal);
}
function closeSourceAssuranceDialog(){closeModal(els.sourceAssuranceModal);}
async function applySourceAssurance(){
  const supplied=String(els.sourceSupplementText?.value||'').trim();const noMaterial=!!els.sourceNoMaterialOmissionCheckbox?.checked;
  if(!supplied&&!noMaterial){showToast('Paste material omitted text or confirm the exact no-material-omission statement.','warn');return;}
  if(supplied&&noMaterial){showToast('Choose one source-assurance route, not both.','warn');return;}
  await saveSnapshotRecord('Recovery before source assurance',getActiveWorkflowStage(),{recovery:true});
  if(supplied){const blockId=`source-supplement-${Date.now()}`;const order=(state.sourceBlocks||[]).length;state.sourceBlocks.push({id:blockId,sourceType:'lawyer-supplied-omitted-content',sourceOrder:order,text:supplied,exactText:supplied});const clauseId=`clause-source-supplement-${Date.now()}`;state.clauses.push({id:clauseId,number:'Source supplement',heading:'Lawyer-supplied omitted source content',body:supplied,level:1,sourceOrder:order,sourceStartOrder:order,sourceEndOrder:order,sourceBlockIds:[blockId],sourceSpans:REVIEW_CORE.fullBlockSpans([blockId],state.sourceBlocks),sourceCorrection:{kind:'material-source-supplement',correctedAt:new Date().toISOString()},issues:[],noteIds:[],type:'General'});state.rawText=`${state.rawText||''}\n\n[SOURCE SUPPLEMENT — LAWYER SUPPLIED]\n${supplied}`;state.sourceAssurance={mode:'material-added',sourceFingerprint:String(state.documentMeta?.sourceFingerprint||''),recordedAt:new Date().toISOString(),supplementClauseId:clauseId};logReviewAction('source-material-added',clauseId,{summary:'Lawyer supplied omitted source content for review'});recomputeAfterSourceCorrection();}
  else{state.sourceAssurance={mode:'no-material-omission',sourceFingerprint:String(state.documentMeta?.sourceFingerprint||''),recordedAt:new Date().toISOString(),statement:'I reviewed the omitted source content and confirm that it contains no material provisions that need to be incorporated into this review.'};state.verificationByKey={...(state.verificationByKey||{}),'source-integrity':'confirmed'};logReviewAction('source-assurance-recorded','',{summary:'Lawyer confirmed no material omitted source content'});scheduleAutosave({reason:'critical'});renderClauseView();updateExportAvailability();}
  closeSourceAssuranceDialog();showToast('Source assurance recorded. Original limitations remain in the evidence trail.','info');
}
function ensureExportReady(){
  const guard=updateExportAvailability();
  if(hasUnconfirmedDegradedSource()){showToast('Source coverage has unverified limitations. Check the original file and acknowledge the listed limitations before generating legal outputs.','warn');return false;}
  if(!guard.ready){ showToast(guard.message || 'Load a contract and add decisions before exporting.','warn'); return false; }
  if(guard.partial) showToast(guard.message,'warn');
  return true;
}
function ensureApprovalExportReady(){
  const guard=getExportGuardState();
  if(hasUnconfirmedDegradedSource()){showToast('Approval output is blocked until all source limitations are checked and acknowledged.','warn');return false;}
  if(!guard.ready){showToast(guard.message||'Load a contract and complete the review before generating an approval pack.','warn');return false;}
  recomputeOpenLoops();
  const readiness=state.readiness||{};
  if(guard.decided<guard.total||readiness.approvalRequestReady!==true){
    const blockers=Number(readiness.approvalRequestBlockers?.length||0);
    showToast(`Approval request is blocked: ${guard.decided}/${guard.total} clauses decided${blockers?` • ${blockers} request blocker${blockers===1?'':'s'}`:''}.`,'warn');
    return false;
  }
  return true;
}
function getNextQueueClauseId(currentId){
  if(typeof WORKFLOW_CORE.nextUndecidedClauseId==='function'){
    const visibleIds=getQueueFilteredClauses().map(c=>c.id);
    return WORKFLOW_CORE.nextUndecidedClauseId(state.clauses,state.decisionByClause,currentId,visibleIds.length?visibleIds:null);
  }
  const ids=getReviewableClauses().map(c=>c.id);
  const idx=ids.indexOf(currentId);
  return ids.slice(Math.max(0,idx+1)).find(id=>!getClauseDecision(id).type)
    || ids.slice(0,Math.max(0,idx)).find(id=>!getClauseDecision(id).type)
    || null;
}

function openDb(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE);};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function promisifyRequest(r){return new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function waitForTransaction(tx){return new Promise((res,rej)=>{tx.oncomplete=()=>res();tx.onabort=()=>rej(tx.error||new Error('Aborted'));tx.onerror=()=>rej(tx.error||new Error('Failed'));});}
function claimAutosaveLease(matterId){if(!matterId)return true;try{const key=`${AUTOSAVE_LEASE_PREFIX}${matterId}`;const now=Date.now();const current=JSON.parse(localStorage.getItem(key)||'null');if(current?.tabId&&current.tabId!==TAB_SESSION_ID&&now-Number(current.at||0)<20000)return false;localStorage.setItem(key,JSON.stringify({tabId:TAB_SESSION_ID,at:now}));return true;}catch{return true;}}

async function persistAutosave(){if(state.prefs?.disableAutosave){state.autosavePending=false;renderHeader();return;}try{const matterId=sanitizeClauseId(state.documentMeta?.id,'');if(matterId&&!claimAutosaveLease(matterId))throw new Error('This matter is active in another tab. Autosave paused here to prevent an overwrite.');const payload=serializeStateForStorage();const db=await openDb();if(matterId){const readTx=db.transaction(DB_STORE,'readonly');const existing=await promisifyRequest(readTx.objectStore(DB_STORE).get(`${MATTER_AUTOSAVE_PREFIX}${matterId}`));const baseline=Date.parse(state.autosaveLastSavedAt||'')||0;const existingAt=Date.parse(existing?.lastPersistedAt||'')||0;if(existing?.writerTabId&&existing.writerTabId!==TAB_SESSION_ID&&existingAt>baseline)throw new Error('A newer save from another tab was detected. Autosave is paused here to prevent an overwrite.');}const tx=db.transaction(DB_STORE,'readwrite');const store=tx.objectStore(DB_STORE);store.put(payload,DB_KEY);if(matterId)store.put(payload,`${MATTER_AUTOSAVE_PREFIX}${matterId}`);await waitForTransaction(tx);autosavePersistedGeneration=Math.max(autosavePersistedGeneration,autosaveDirtyGeneration);state.autosavePending=false;state.autosaveLastSavedAt=payload.lastPersistedAt||new Date().toISOString();state.autosaveConflict=false;state.autosaveConflictNotified=false;if(state.autosaveFailed){state.autosaveFailed=false;showToast('Autosave restored','info');}renderHeader();} catch(e) {
  console.warn('Autosave failed', e);
  state.autosavePending = false;
  renderHeader();
  if (!state.autosaveFailed) {
    state.autosaveFailed = true;
    const isQuota = e?.name === 'QuotaExceededError' || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED';
    if (isQuota) {
      showToast('⚠ Storage full — autosave unavailable. Clear old snapshots in Data Controls.', 'error');
    } else {
      showToast(e?.message||'⚠ Autosave unavailable. Export manually to preserve your work.', 'error');
    }
  }
}}
globalThis.ContractCockpitBeforeUpdate=async()=>{
  flushClauseTime();clearTimeout(autosaveTimer);
  if(state.prefs?.disableAutosave)return{ok:false,message:'Autosave is disabled. Save a snapshot or export the session before updating if you want a recoverable checkpoint.'};
  try{await persistAutosave();return state.autosaveFailed?{ok:false,message:'The current matter could not be saved locally before update.'}:{ok:true};}catch(error){return{ok:false,message:error?.message||'The current matter could not be saved locally before update.'};}
};
async function restoreAutosave(){
  try{
    const keys=[DB_KEY,...LEGACY_DB_KEYS];
    let restored=null;
    let usedKey='';
    for(const key of keys){
      const db=await openDb();
      const tx=db.transaction(DB_STORE,'readonly');
      const saved=await promisifyRequest(tx.objectStore(DB_STORE).get(key));
      const valid=validateSessionShape(saved);
      if(valid.ok){ restored=valid.session; usedKey=key; break; }
    }
    if(restored && usedKey && usedKey!==DB_KEY){
      const db=await openDb();
      const tx=db.transaction(DB_STORE,'readwrite');
      const store=tx.objectStore(DB_STORE);
      store.put(restored, DB_KEY);
      store.delete(usedKey);
      await waitForTransaction(tx);
    }
    return restored;
  }catch(e){console.warn('Restore failed',e);return null;}
}
async function listMatterAutosaves(){
  try{
    const db=await openDb();const tx=db.transaction(DB_STORE,'readonly');const store=tx.objectStore(DB_STORE);const [keys,values]=await Promise.all([promisifyRequest(store.getAllKeys()),promisifyRequest(store.getAll())]);
    const prefixes=[MATTER_AUTOSAVE_PREFIX,...LEGACY_MATTER_AUTOSAVE_PREFIXES];const byMatter=new Map();
    keys.forEach((key,index)=>{const str=String(key||'');const prefix=prefixes.find(p=>str.startsWith(p));const value=values[index];if(!prefix||!value?.clauses?.length)return;const matterId=str.slice(prefix.length);const savedAt=value.lastPersistedAt||value.documentMeta?.loadedAt||'';const current=byMatter.get(matterId);if(!current||String(savedAt).localeCompare(String(current.savedAt||''))>0)byMatter.set(matterId,{key:str,matterId,fileName:value.documentMeta?.fileName||'Untitled contract',savedAt,clauseCount:(value.clauses||[]).filter(c=>c.id!==OVERVIEW_ID).length,decidedCount:Object.values(value.decisionByClause||{}).filter(d=>d?.type).length,documentRisk:value.documentRisk||'Unverified',buildVersion:value.buildVersion||'unknown'});});
    return [...byMatter.values()].sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt))).slice(0,8);
  }catch(e){console.warn('Recent matters unavailable',e);return [];}
}
async function renderRecentMatters(){
  if(!els.hubRecentMattersList)return;els.hubRecentMattersList.innerHTML='<div class="mini">Checking local matters…</div>';
  const items=await listMatterAutosaves();
  els.hubRecentMattersList.innerHTML=items.length?items.map(item=>`<div class="recent-matter-row"><div><strong>${escapeHtml(item.fileName)}</strong><div class="mini">${escapeHtml(formatShortDateTime(item.savedAt)||'Date unavailable')} • ${item.clauseCount} clauses • ${item.decidedCount} decisions • ${escapeHtml(item.documentRisk)} risk • v${escapeHtml(String(item.buildVersion))}</div></div><button class="btn btn-xs" type="button" data-open-matter-key="${escapeHtml(item.key)}">Open</button></div>`).join(''):'<div class="mini">No matter-specific autosaves yet. A matter appears here after its first successful autosave.</div>';
}
async function openRecentMatter(key){
  try{
    const db=await openDb();const tx=db.transaction(DB_STORE,'readonly');const saved=await promisifyRequest(tx.objectStore(DB_STORE).get(key));const valid=validateSessionShape(saved);if(!valid.ok)throw new Error(valid.message);
    const label=valid.session.documentMeta?.fileName||'this matter';if(!window.confirm(`Open “${label}”?\n\nYour current review will be saved as a recovery snapshot before it is replaced.`))return;
    if(state.clauses.length)await saveSnapshotRecord(`Recovery before opening ${label}`,getActiveWorkflowStage(),{recovery:true});
    hydrateState(valid.session);syncLandingIntakeFromMatter();state.diagnostics.lastRestoreSource='recent-matter';state.sessionRestored=false;state.snapshotNotice=`Opened: ${label}`;showApp();renderAll();closeExportHubModal();scheduleAutosave({reason:'immediate'});showToast(`${state.snapshotNotice} • previous work preserved as a snapshot`,'info');
  }catch(e){console.warn('Recent matter restore failed',e);showToast(e?.message||'Unable to open that matter.','error');}
}
async function clearAutosave(){try{const db=await openDb();const readTx=db.transaction(DB_STORE,'readonly');const keys=await promisifyRequest(readTx.objectStore(DB_STORE).getAllKeys());const tx=db.transaction(DB_STORE,'readwrite');const store=tx.objectStore(DB_STORE);const prefixes=[MATTER_AUTOSAVE_PREFIX,...LEGACY_MATTER_AUTOSAVE_PREFIXES];keys.forEach(key=>{const str=String(key||'');if(str===DB_KEY||LEGACY_DB_KEYS.includes(str)||prefixes.some(prefix=>str.startsWith(prefix)))store.delete(key);});await waitForTransaction(tx);}catch(e){console.warn('Clear failed',e);}}
async function clearAutosaveForMatter(session){
  try{
    const matterId=sanitizeClauseId(session?.documentMeta?.id,'');
    const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');const store=tx.objectStore(DB_STORE);
    [DB_KEY,...LEGACY_DB_KEYS].forEach(key=>store.delete(key));
    if(matterId)[MATTER_AUTOSAVE_PREFIX,...LEGACY_MATTER_AUTOSAVE_PREFIXES].forEach(prefix=>store.delete(`${prefix}${matterId}`));
    await waitForTransaction(tx);
  }catch(e){console.warn('Matter autosave clear failed',e);throw e;}
}
async function persistClauseLibrary(){try{const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put({type:'library',items:state.clauseLibrary||[],playbookPackages:state.playbookPackages||[],schemaVersion:BUILD_VERSION},LIBRARY_KEY);await waitForTransaction(tx);}catch(e){console.warn('Library save failed',e);}}
async function clearAllSnapshots(){try{const items=await listSnapshots();const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');const store=tx.objectStore(DB_STORE);for(const item of items)store.delete(item.id);await waitForTransaction(tx);}catch(e){console.warn('Clear snapshots failed',e);}}
async function clearClauseLibraryStorage(){try{const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');const store=tx.objectStore(DB_STORE);[LIBRARY_KEY,...LEGACY_LIBRARY_KEYS].forEach(key=>store.delete(key));await waitForTransaction(tx);}catch(e){console.warn('Clear library failed',e);}}
function deleteCockpitDatabase(){return new Promise((resolve,reject)=>{const request=indexedDB.deleteDatabase(DB_NAME);request.onsuccess=()=>resolve();request.onerror=()=>reject(request.error||new Error('Database deletion failed'));request.onblocked=()=>reject(new Error('Close other Contract Cockpit tabs, then retry the wipe.'));});}
async function wipeAllLocalData(){clearTimeout(autosaveTimer);state.autosavePending=false;await deleteCockpitDatabase();try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&/^(?:cockpit-|hint-)/.test(key))localStorage.removeItem(key);}for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i);if(key&&/^cockpit-/.test(key))sessionStorage.removeItem(key);}}catch{}autosaveDirtyGeneration=0;autosavePersistedGeneration=0;resetState();state.clauseLibrary=[];state.pendingRestoreSession=null;state.sessionRestored=false;closeAllModals();hidePeekCard();document.body.classList.remove('modal-open','resizing-panel');if(els.mobileToolLauncher)els.mobileToolLauncher.classList.add('hidden');if(els.mobileBackdrop)els.mobileBackdrop.classList.add('hidden');if(els.app)els.app.classList.remove('mobile-left-open','mobile-right-open');showLanding(true);renderRestoreBanner();renderHeader();scheduleRerender({header:true,cockpit:true,navigator:true,clause:true,rightPanel:true,restore:true},'wipe-all-local-data');}
async function restoreClauseLibrary(){
  try{
    const keys=[LIBRARY_KEY,...LEGACY_LIBRARY_KEYS];
    let saved=null;
    let usedKey='';
    for(const key of keys){
      const db=await openDb();
      const tx=db.transaction(DB_STORE,'readonly');
      const candidate=await promisifyRequest(tx.objectStore(DB_STORE).get(key));
      if(candidate?.items){ saved=candidate; usedKey=key; break; }
    }
    state.clauseLibrary=Array.isArray(saved?.items)?saved.items:[];
    state.playbookPackages=mergePlaybookPackages(saved?.playbookPackages||[],PLAYBOOK_CORE.BUILTIN_PACKAGES||[]);
    if(!state.clauseLibrary.length) state.clauseLibrary=getDefaultLibraryEntries();
    if(saved && usedKey && usedKey!==LIBRARY_KEY){
      const db=await openDb();
      const tx=db.transaction(DB_STORE,'readwrite');
      const store=tx.objectStore(DB_STORE);
      store.put({type:'library',items:state.clauseLibrary||[],playbookPackages:state.playbookPackages||[],schemaVersion:BUILD_VERSION},LIBRARY_KEY);
      store.delete(usedKey);
      await waitForTransaction(tx);
    }
    boilerplateScoresDirty=true;
  }catch(e){console.warn('Library restore failed',e);state.clauseLibrary=[];state.playbookPackages=mergePlaybookPackages([],PLAYBOOK_CORE.BUILTIN_PACKAGES||[]);boilerplateScoresDirty=true;}
}

function recomputeAllDerivedReviewState(){(state.clauses||[]).forEach(c=>refreshDerivedClauseState(c.id));}

function recomputeDeterministicModelFromRestoredSource(){
  const td=extractDefinedTerms(state.clauses,[]);state.definedTerms=td.terms;state.possibleDefinedTerms=td.possibleTerms;state.tableDefinitions=td.tableDefinitions||[];state.issues.duplicateDefinitions=td.duplicateDefinitions;
  mergeDetectedTerms(state.definedTerms,state.issues.duplicateDefinitions,extractPartyDefinedTerms(state.rawText,state.clauses));resolveCrossReferencedDefinitions(state.clauses,state.definedTerms);mapTermUsage(state.clauses,state.definedTerms);
  state.issues.unresolvedCrossReferencedDefinitions=detectUnresolvedCrossReferencedDefinitions(state.definedTerms);state.issues.definitionQuality=detectDefinitionQuality(state.definedTerms,state.issues.duplicateDefinitions);state.issues.undefinedCapitalizedTerms=detectUndefinedCapitalizedTerms(state.clauses,state.definedTerms);state.issues.unusedDefinitions=detectUnusedDefinitions(state.definedTerms);state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);
  state.placeholders=detectPlaceholders(state.clauses,[]);syncPlaceholderResolution();classifyClauses(state.clauses);state.legalConceptEvidence=typeof ANALYSIS_CORE.detectLegalConcepts==='function'?ANALYSIS_CORE.detectLegalConcepts(state.clauses):{byConcept:{},all:[],present:{}};state.legalPropositions=ANALYSIS_CORE.extractLegalPropositions?.(state.clauses,state.rawText||'')||[];state.obligations=extractObligations(state.clauses);state.deadlines=extractDeadlines(state.clauses);state.issues.subjectiveStandards=ANALYSIS_CORE.detectSubjectiveStandards?.(state.clauses,state.rawText||'')||[];state.issues.asymmetries=ANALYSIS_CORE.detectAsymmetries?.(state.clauses,state.rawText||'',state.legalPropositions)||[];
  state.referenceLedger=buildReferenceLedger(state.clauses);state.issues.crossReferenceBreaks=state.referenceLedger.filter(item=>['missing','ambiguous'].includes(item.status));state.issues.semanticCrossReferenceWarnings=state.referenceLedger.filter(item=>item.status==='semantic-mismatch');state.issues.consistency=detectConsistencyIssues(state.clauses,state.definedTerms);state.issues.survivalClauses=detectSurvivalClauses(state.clauses);state.issues.commercialDeviations=detectNumericalAnomalies(state.clauses);state.issues.missingStandardClauses=detectMissingStandardClauses(state.clauses);state.expectedClauseCoverage=detectExpectedClauseCoverage(state.clauses,state.contractType);state.issues.openObligations=detectOpenObligations();state.issues.crossClauseChecks=detectCrossClauseChecks();
  const healthStatus=buildSourceConfidenceLedger().status==='strong'?'checked':'limited';state.detectorHealth={definitions:{status:healthStatus,count:Object.keys(state.definedTerms).length},undefinedTerms:{status:healthStatus,count:state.issues.undefinedCapitalizedTerms.length},crossReferences:{status:healthStatus,count:state.issues.crossReferenceBreaks.length},placeholders:{status:healthStatus,count:state.placeholders.filter(p=>!p.resolved&&!p.ignored).length},obligations:{status:healthStatus,count:state.obligations.length},deadlines:{status:healthStatus,count:state.deadlines.length},subjectiveStandards:{status:healthStatus,count:state.issues.subjectiveStandards.length},asymmetries:{status:healthStatus,count:state.issues.asymmetries.length},legalConcepts:{status:healthStatus,count:state.legalConceptEvidence?.all?.length||0}};precomputeTermHits();state.reviewItems=buildCanonicalReviewItems();
}

function hydrateState(saved){
saved=normalizeSession(saved);resetState();if(!saved||typeof saved!=='object')return;
const analyzerChanged=saved.analyzerVersion!==ANALYZER_VERSION;
if(saved.buildVersion&&saved.buildVersion!==BUILD_VERSION)showToast(`Loaded from v${saved.buildVersion}`,'info');
state.documentMeta={...state.documentMeta,...(saved.documentMeta||{})};
state.rawText=typeof saved.rawText==='string'?saved.rawText:'';
state.sourceBlocks=Array.isArray(saved.sourceBlocks)?saved.sourceBlocks:[];
if(saved.buildVersion&&saved.buildVersion!==BUILD_VERSION&&state.documentMeta?.fileName){
  const warning=`This restored session was analysed with v${saved.documentMeta?.analysisVersion||saved.buildVersion}. Re-upload the original document to apply v${BUILD_VERSION} segmentation and detection improvements.`;
  state.documentMeta.warnings=[...new Set([...(state.documentMeta.warnings||[]),warning])];
}
state.clauses=ensureClauseIds(Array.isArray(saved.clauses)?saved.clauses:[]).map(clause=>({...clause,sourceSpans:Array.isArray(clause.sourceSpans)&&clause.sourceSpans.length?clause.sourceSpans:REVIEW_CORE.fullBlockSpans(clause.sourceBlockIds||[],state.sourceBlocks)}));
state.definedTerms=saved.definedTerms&&typeof saved.definedTerms==='object'?saved.definedTerms:{};
state.possibleDefinedTerms=Array.isArray(saved.possibleDefinedTerms)?saved.possibleDefinedTerms:[];
state.tableDefinitions=Array.isArray(saved.tableDefinitions)?saved.tableDefinitions:[];
state.issues={...state.issues,...(saved.issues||{})};
state.detectorHealth=saved.detectorHealth&&typeof saved.detectorHealth==='object'?saved.detectorHealth:{};
state.placeholders=Array.isArray(saved.placeholders)?saved.placeholders:[];
state.obligations=Array.isArray(saved.obligations)?saved.obligations:[];
state.deadlines=Array.isArray(saved.deadlines)?saved.deadlines:[];
state.executionCheck=saved.executionCheck&&typeof saved.executionCheck==='object'?saved.executionCheck:{items:[],status:'not-run'};
state.dealTermsBaseline=saved.dealTermsBaseline&&typeof saved.dealTermsBaseline==='object'?{...state.dealTermsBaseline,...saved.dealTermsBaseline}:state.dealTermsBaseline;
state.notes=Array.isArray(saved.notes)?saved.notes:[];
['clauseTags','clauseRoutingTags','clauseCounterpartyPositions','clausePositions','clauseReviewStatus','clauseRiskScores','clauseRiskNarratives','clauseBoilerplateScores','clauseRecommendations','clauseFallbacks','clauseFallbackLadders','clauseNegotiationStatus','clauseApprovalStatus','clauseIssueStages','clauseCounterpartyNextSteps','clauseCounterpartyLastDiscussed','draftingOpenClauseIds','clauseCompareMode','positionHistory','dismissedDraftingNudges','negotiationContextOpen','contrastExpandedClauseIds','clauseBriefs','clauseBriefOpenIds','clauseAudienceSharing','reviewabilityOverrides','clausePlaybookState','verificationByKey','obligationVerification'].forEach(k=>{state[k]=saved[k]&&typeof saved[k]==='object'?saved[k]:{};});
state.activePlaybookProfile=saved.activePlaybookProfile&&typeof saved.activePlaybookProfile==='object'?saved.activePlaybookProfile:{packageId:'',version:'',role:'',activatedAt:''};
state.playbookExpandedClauseIds={};
state.clauseRedlineCache={};state.clauseRedlineMode={};state.clauseTermHits=saved.clauseTermHits||{};
state.reviewLog=Array.isArray(saved.reviewLog)?saved.reviewLog:[];
state.documentRisk=typeof saved.documentRisk==='string'?saved.documentRisk:'Low';
state.contractType=typeof saved.contractType==='string'?saved.contractType:'Custom';
state.expectedClauseCoverage=saved.expectedClauseCoverage&&typeof saved.expectedClauseCoverage==='object'?saved.expectedClauseCoverage:{expected:[],missing:[],present:[],weak:[]};
state.legalConceptEvidence=typeof ANALYSIS_CORE.detectLegalConcepts==='function'?ANALYSIS_CORE.detectLegalConcepts(state.clauses):{byConcept:{},all:[],present:{}};
state.legalPropositions=ANALYSIS_CORE.extractLegalPropositions?.(state.clauses,state.rawText||'')||[];
state.sourceAssurance=saved.sourceAssurance&&typeof saved.sourceAssurance==='object'?saved.sourceAssurance:null;
state.expectedClauseCoverage=detectExpectedClauseCoverage(state.clauses,state.contractType);
state.ignoredTerms=Array.isArray(saved.ignoredTerms)?saved.ignoredTerms:[];
state.ignoredUndefinedTerms=Array.isArray(saved.ignoredUndefinedTerms)?saved.ignoredUndefinedTerms:[];
state.ignoredPlaceholderIds=Array.isArray(saved.ignoredPlaceholderIds)?saved.ignoredPlaceholderIds:[];
state.customStopLists=saved.customStopLists&&typeof saved.customStopLists==='object'?saved.customStopLists:{...DEFAULT_STOP_LISTS};
state.bookmarkedClauseIds=Array.isArray(saved.bookmarkedClauseIds)?saved.bookmarkedClauseIds:[];
state.snoozedClauseIds=Array.isArray(saved.snoozedClauseIds)?saved.snoozedClauseIds:[];
state.decisionByClause=saved.decisionByClause&&typeof saved.decisionByClause==='object'?saved.decisionByClause:{};
state.openLoops=Array.isArray(saved.openLoops)?saved.openLoops:[];
state.readiness=saved.readiness&&typeof saved.readiness==='object'?saved.readiness:{status:'blocked',blockers:[],decidedCount:0,totalCount:0,approvalRequestReady:false,finalSignoffReady:false};
state.startIntent=typeof saved.startIntent==='string'?saved.startIntent:'checks';state.preferredStartCheck=typeof saved.preferredStartCheck==='string'?saved.preferredStartCheck:'review-items';state.activeCheck=typeof saved.activeCheck==='string'?saved.activeCheck:'';state.activeConcept=typeof saved.activeConcept==='string'?saved.activeConcept:'';state.checkFilter=typeof saved.checkFilter==='string'?saved.checkFilter:'all';state.checkCompletion=saved.checkCompletion&&typeof saved.checkCompletion==='object'?saved.checkCompletion:{};state.findingReview=saved.findingReview&&typeof saved.findingReview==='object'?saved.findingReview:{};
state.workflowStage=typeof saved.workflowStage==='string'?saved.workflowStage:mapLegacyModeToStage(saved.workflowMode||'review');
state.queuePreset=typeof saved.queuePreset==='string'?saved.queuePreset:'needs-decision';
state.prepareGroupMode=typeof saved.prepareGroupMode==='string'?saved.prepareGroupMode:'priority';
state.currentRound=Number(saved.currentRound)||state.currentRound||1;
state.savedWorkspaces=Array.isArray(saved.savedWorkspaces)?saved.savedWorkspaces:state.savedWorkspaces;
state.selectedSnapshotCompareId=saved.selectedSnapshotCompareId||state.selectedSnapshotCompareId||'';
state.selectedRoundCompareKey=saved.selectedRoundCompareKey||state.selectedRoundCompareKey||'';
state.compareOnlyMode=!!saved.compareOnlyMode;
state.definitionPassDoneAt=saved.definitionPassDoneAt||state.definitionPassDoneAt||'';
state.sessionReturn=saved.sessionReturn&&typeof saved.sessionReturn==='object'?saved.sessionReturn:state.sessionReturn;
state.autosaveLastSavedAt=saved.lastPersistedAt||saved.autosaveLastSavedAt||'';
state.navHistory=[]; state.navHistoryIndex=-1; state.navForwardHistory=[];
state.selectedClauseId=typeof saved.selectedClauseId==='string'?sanitizeClauseId(saved.selectedClauseId,''):null;
if(state.selectedClauseId && !state.clauses.some(c=>c.id===state.selectedClauseId) && state.selectedClauseId!==OVERVIEW_ID) state.selectedClauseId=null;
state.searchQuery=typeof saved.searchQuery==='string'?saved.searchQuery:'';
state.filters=saved.filters&&typeof saved.filters==='object'?{content:saved.filters.content||'all',review:saved.filters.review||'all'}:{content:'all',review:'all'};
state.activeTab=TAB_IDS.includes(saved.activeTab)?saved.activeTab:'summary';
state.resolvedPlaceholderIds=Array.isArray(saved.resolvedPlaceholderIds)?saved.resolvedPlaceholderIds:[];
state.noteDraft=saved.noteDraft&&typeof saved.noteDraft==='object'?{...makeEmptyNoteDraft(saved.noteDraft.clauseId||''),...saved.noteDraft}:null;
state.noteFormOpen=!!state.noteDraft;state.focusMode=false;applyFocusMode();
syncPlaceholderResolution();state.sessionRestored=true;
if(els.contractTypeSelect){const rev={'SaaS Agreement':'SaaS Agreement','Technology License':'Technology License','DPA':'DPA','DPDP DPA':'DPDP DPA','Custom':'Custom','IT/ITES Outsourcing':'IT/ITES Outsourcing','Staff Augmentation':'Staff Augmentation','Lease':'Lease'};els.contractTypeSelect.value=rev[state.contractType||'Custom']||(state.contractType||'Custom');}
if(!state.selectedClauseId&&state.clauses[0])state.selectedClauseId=OVERVIEW_ID;
if(state.clauses.length){seedDecisionStateFromLegacy();boilerplateScoresDirty=true;if(analyzerChanged)recomputeDeterministicModelFromRestoredSource();calculateAllRiskScores();if(!Object.keys(state.clauseTermHits||{}).length)precomputeTermHits();state.issues.undefinedCapitalizedTerms=detectUndefinedCapitalizedTerms(state.clauses,state.definedTerms);state.definitionGraph=buildDefinitionGraph(state.clauses,state.definedTerms);state.referenceLedger=buildReferenceLedger(state.clauses);state.issues.crossReferenceBreaks=state.referenceLedger.filter(item=>item.status==='missing'||item.status==='ambiguous');state.issues.semanticCrossReferenceWarnings=state.referenceLedger.filter(item=>item.status==='semantic-mismatch');state.reviewItems=buildCanonicalReviewItems();}
syncLandingIntakeFromMatter();
renderPlaybookPackageSelect();
syncFilterUI();
}

/* -- Snapshots -- */
function getSnapshotLabelInput(){return document.getElementById('snapshotLabelInput');}
async function saveSnapshotPayloadRecord(payload,label,stage='',opts={}){
  if(!payload?.clauses?.length)return null;
  const safePayload=JSON.parse(JSON.stringify(payload));
  delete safePayload.pendingRestoreSession;delete safePayload.pendingRestoreMeta;
  safePayload.sessionRestored=false;
  const createdAt=new Date().toISOString();
  const id=`${SNAPSHOT_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  const record={type:'snapshot',id,createdAt,fileName:safePayload.documentMeta?.fileName||'Untitled',label:label||`Snapshot ${new Date(createdAt).toLocaleString()}`,stage:String(stage||''),clauseCount:safePayload.clauses.length,flagCount:Number(safePayload.placeholders?.length||0)+Number(safePayload.issues?.crossReferenceBreaks?.length||0)+Number(safePayload.issues?.undefinedCapitalizedTerms?.length||0),noteCount:Number(safePayload.notes?.length||0),payload:safePayload,recovery:!!opts.recovery};
  const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(record,id);await waitForTransaction(tx);return record;
}
async function saveSnapshotRecord(label,stage='',opts={}){
  if(!state.clauses.length)return null;
  return saveSnapshotPayloadRecord(serializeStateForExport(),label,stage,opts);
}
async function saveSnapshot(){if(!state.clauses.length){showToast('Load a contract first.','warn');return;}try{const rawLabel=getSafeSnapshotLabel();const label=rawLabel||`Snapshot ${new Date().toLocaleString()}`;await saveSnapshotRecord(label,String(document.getElementById('snapshotStageSelect')?.value||''));state.snapshotNotice=`Snapshot: ${label}`;renderHeader();setTimeout(()=>{state.snapshotNotice='';renderHeader();},1800);if(getSnapshotLabelInput())getSnapshotLabelInput().value='';const stageEl=document.getElementById('snapshotStageSelect');if(stageEl) stageEl.value='';await openSnapshotsModal();}catch(e){console.warn('Snapshot failed',e);showToast('Unable to save snapshot.','error');}}
async function listSnapshots(){const db=await openDb();const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).getAll();const all=await promisifyRequest(r);return(all||[]).filter(i=>i&&i.type==='snapshot').sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));}
function openExportHubModal(mode='share'){updateExportAvailability();renderRecentMatters();const matter=mode==='matter';if(els.exportHubTitle)els.exportHubTitle.textContent=matter?'Matter & recovery':'Share & handoff';els.exportHubModal?.querySelectorAll('[data-hub-section]').forEach(section=>section.classList.toggle('hidden',section.dataset.hubSection!==(matter?'matter':'share')));openModal(els.exportHubModal);}
function closeExportHubModal(){closeModal(els.exportHubModal);}
function openDataControlsModal(){ if(els.disableAutosaveToggle) els.disableAutosaveToggle.checked=!!state.prefs?.disableAutosave; if(els.autoAdvanceToggle) els.autoAdvanceToggle.checked=state.prefs?.autoAdvanceDecisions!==false; openModal(els.dataControlsModal); }
function closeDataControlsModal(){closeModal(els.dataControlsModal);}

async function openSnapshotsModal(opts={}){try{const items=await listSnapshots();renderSnapshotsModal(items);openModal(els.snapshotModal);if(opts.focusNew)requestAnimationFrame(()=>getSnapshotLabelInput()?.focus());}catch(e){showToast('Unable to load snapshots','error');}}
function closeSnapshotsModal(){closeModal(els.snapshotModal);if(getSnapshotLabelInput())getSnapshotLabelInput().value='';const stageEl=document.getElementById('snapshotStageSelect');if(stageEl)stageEl.value='';}
function renderSnapshotsModal(items){
setSnapshotItemsCache(items||[]);
els.snapshotList.innerHTML=(items.length?items.map(i=>`<div class="snapshot-item"><div class="snapshot-title">${escapeHtml(i.label||i.fileName||'Untitled')}</div><div class="snapshot-meta">${new Date(i.createdAt).toLocaleString()}${i.stage?` • ${escapeHtml(i.stage)}`:''} • ${i.clauseCount||0} clauses • ${i.noteCount||0} notes</div><div class="snapshot-actions"><button class="restore-snapshot-btn primary" data-id="${escapeHtml(i.id)}">Restore</button><button class="compare-snapshot-btn" data-id="${escapeHtml(i.id)}">Compare with current</button><button class="delete-snapshot-btn" data-id="${escapeHtml(i.id)}">Delete</button></div></div>`).join(''):`<div class="tool-card low"><h4>No snapshots</h4><div class="mini">Save a snapshot before major negotiation or approval steps.</div></div>`);
els.snapshotList.querySelectorAll('.restore-snapshot-btn').forEach(b=>b.addEventListener('click',()=>restoreSnapshot(b.dataset.id)));
els.snapshotList.querySelectorAll('.compare-snapshot-btn').forEach(b=>b.addEventListener('click',()=>showSnapshotDiff(b.dataset.id))); state.snapshotItems=items||[];
els.snapshotList.querySelectorAll('.delete-snapshot-btn').forEach(b=>b.addEventListener('click',()=>deleteSnapshot(b.dataset.id)));
}
async function restoreSnapshot(id){try{const db=await openDb();const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).get(id);const i=await promisifyRequest(r);if(!i?.payload)return;const label=i.label||i.fileName||'this snapshot';const details=`${i.clauseCount||0} clauses • ${i.noteCount||0} notes • ${formatShortDateTime(i.createdAt)||'date unavailable'}`;const confirmed=await showConfirmDialog(`${details}\n\nYour current review will be saved automatically as a recovery snapshot first.`,{title:`Restore "${label}"?`,confirmLabel:'Restore'});if(!confirmed)return;if(state.clauses.length)await saveSnapshotRecord(`Recovery before restoring ${label}`,getActiveWorkflowStage(),{recovery:true});hydrateState(i.payload);syncLandingIntakeFromMatter();state.diagnostics.lastRestoreSource='snapshot';state.sessionRestored=false;state.snapshotNotice=`Restored: ${label}`;showApp();renderAll();closeSnapshotsModal();scheduleAutosave({reason:'immediate'});showToast(`${state.snapshotNotice} • recovery snapshot saved`,'info');setTimeout(()=>{state.snapshotNotice='';renderHeader();},2400);}catch(e){console.warn('Restore failed',e);showToast('Restore failed. Your current review was not replaced.','error');}}
async function deleteSnapshot(id){const item=(state.snapshotItems||[]).find(entry=>entry.id===id);if(!window.confirm(`Delete recovery snapshot “${item?.label||item?.fileName||'Selected snapshot'}”? This cannot be undone.`))return;try{const db=await openDb();const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).delete(id);await waitForTransaction(tx);const items=await listSnapshots();renderSnapshotsModal(items);showToast('Snapshot deleted','info');}catch(e){console.warn('Delete failed',e);}}

/* -- Report HTML builder -- */
function getReportStyles(){return `body{font-family:Arial,sans-serif;margin:24px;color:#1f2328;line-height:1.55;background:#fff;}h1,h2,h3{margin:0 0 0.6rem;}h1{font-size:1.7rem;}h2{margin-top:1.4rem;border-bottom:1px solid #d0d7de;padding-bottom:0.25rem;}h3{margin-top:1rem;font-size:1rem;} .report-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #0b63ce;} .report-brand{font-size:1.1rem;font-weight:700;} .report-meta{font-size:.92rem;color:#475467;} .report-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;} .report-card{border:1px solid #d0d7de;border-left:4px solid #d0d7de;padding:12px;margin:10px 0;background:#f8fafc;border-radius:8px;} .report-table{border-collapse:collapse;width:100%;margin:12px 0;} .report-table th,.report-table td{border:1px solid #d0d7de;padding:8px;text-align:left;vertical-align:top;} .report-table th{background:#eef3f8;} .pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#eef3f8;font-size:.8rem;font-weight:600;} pre{white-space:pre-wrap;background:#fff;border:1px solid #d0d7de;padding:10px;border-radius:6px;} ul{margin:0.4rem 0 0.8rem 1.2rem;} @media print{body{margin:18mm;}}`;}
function clientFacingPositionLabel(position){const labels={'Acceptable':'Accepted','Accept with changes':'Amendment proposed','Seek amendment':'Amendment requested','Reject':'Not accepted','Escalate':'Requires further discussion','Need input':'Pending clarification'};return labels[position]||'Review required';}
function getShareableClauseSummary(clause){return String(state.clauseAudienceSharing?.[clause?.id]?.summary||'').trim();}
function isClauseApprovedForExternalOutput(clause){const share=state.clauseAudienceSharing?.[clause?.id]||{};const policyAllows=typeof WORKFLOW_CORE.shouldIncludeClauseForAudience==='function'?WORKFLOW_CORE.shouldIncludeClauseForAudience('externalClient',{shareWithClient:share.client===true}):share.client===true;return policyAllows&&share.summaryApproved===true&&!!String(share.summary||'').trim();}
function getReportClauseProjection(clause,preset){const decision=getClauseDecision(clause.id);const source={number:clause.number||'',heading:clause.heading||'',position:state.clausePositions?.[clause.id]||'',clientPosition:clientFacingPositionLabel(state.clausePositions?.[clause.id]||''),inherentRisk:state.clauseRiskScores?.[clause.id]||'Low',reviewPriority:state.reviewPriorityScores?.[clause.id]||'Low',shareableSummary:getShareableClauseSummary(clause),fallback:decision.fallback||state.clauseFallbacks?.[clause.id]||'',internalNote:(state.notes||[]).find(n=>n.clauseId===clause.id)?.text||'',counterpartyPosition:state.clauseCounterpartyPositions?.[clause.id]||'',nextStep:state.clauseCounterpartyNextSteps?.[clause.id]||'',shareWithClient:isClauseApprovedForExternalOutput(clause),decisionComplete:getDecisionCompletionState(clause.id).complete,sourceOrder:state.clauses.indexOf(clause)};return typeof WORKFLOW_CORE.projectClauseForReport==='function'?WORKFLOW_CORE.projectClauseForReport(preset,source):source;}
function buildReportHeader(preset){const audience=preset==='client'?'External Client / Counterparty':preset==='executive'?'Internal Leadership':'Internal Legal';const fingerprint=state.documentMeta?.sourceFingerprint?`<br><strong>Source SHA-256:</strong> ${escapeHtml(state.documentMeta.sourceFingerprint)}`:'';const common=`<strong>Audience:</strong> ${escapeHtml(audience)}<br><strong>File:</strong> ${escapeHtml(state.documentMeta.fileName||'Untitled')}<br><strong>Contract type:</strong> ${escapeHtml(state.contractType||'Custom')}${fingerprint}`;const internal=preset==='client'?'':preset==='executive'?`<br><strong>Overall inherent risk:</strong> ${escapeHtml(state.documentRisk||'Low')}`:`<br><strong>Matter:</strong> ${escapeHtml(matterSummaryLine()||'Not set')}<br><strong>Overall inherent risk:</strong> ${escapeHtml(state.documentRisk||'Low')}`;return `<div class="report-header"><div><div class="report-brand">Contract Cockpit Review Report</div><div class="report-meta">Generated ${escapeHtml(formatShortDateTime(new Date().toISOString()))}</div></div><div class="report-meta">${common}${internal}</div></div>`;}
function wrapReportDocument(title,css,sections){return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${css}</style></head><body>${sections}</body></html>`;}
function buildReportHtml(preset='internal'){
const clauseMap=Object.fromEntries(state.clauses.map(c=>[c.id,c]));
const notesByClause=groupBy(state.notes,'clauseId');
const positionedClauses=state.clauses.filter(c=>!!state.clausePositions?.[c.id]);
const flagged=state.clauses.filter(c=>{const p=state.clausePositions[c.id]||'';return ['Reject','Escalate','Seek amendment','Accept with changes','Need input'].includes(p)||clauseFlagCount(c)||(state.notes||[]).some(n=>n.clauseId===c.id);});
const css=getReportStyles();let sections=buildReportHeader(preset);
if(preset==='executive'){
  const executiveCandidates=flagged.map(c=>getReportClauseProjection(c,'executive'));
  const executiveTop=(typeof WORKFLOW_CORE.rankExecutiveItems==='function'?WORKFLOW_CORE.rankExecutiveItems(executiveCandidates):executiveCandidates).slice(0,5);
  sections+=`<h2>Executive Summary</h2><div class="report-grid">${[['High inherent-risk clauses',state.clauses.filter(c=>(state.clauseRiskScores[c.id]||'Low')==='High').length],['High review-priority clauses',state.clauses.filter(c=>(state.reviewPriorityScores?.[c.id]||'Low')==='High').length],['Open negotiation asks',positionedClauses.filter(c=>(state.clausePositions[c.id]||'')!=='Acceptable').length],['Deadlines / obligations',state.obligations.length]].map(([l,v])=>`<div class="report-card"><strong>${escapeHtml(l)}</strong><div style="font-size:1.4rem;margin-top:8px;">${v}</div></div>`).join('')}</div>`;
  sections+=`<h2>Top Negotiation Items</h2>${executiveTop.length?executiveTop.map(item=>`<div class="report-card"><strong>${escapeHtml(item.number)} - ${escapeHtml(item.heading)}</strong><div class="mini">${escapeHtml(item.position||item.inherentRisk||'Review required')}</div><p>${escapeHtml(item.shareableSummary||'Requires discussion.')}</p></div>`).join(''):'<p>No material items captured.</p>'}`;
  if((state.expectedClauseCoverage?.missing||[]).length)sections+=`<h2>Missing Expected Clauses</h2><div class="report-card">${state.expectedClauseCoverage.missing.map(escapeHtml).join(', ')}</div>`;
  return wrapReportDocument('Executive Review Summary',css,sections);
}
if(preset==='client'){
  const clientItems=flagged.filter(isClauseApprovedForExternalOutput).map(c=>getReportClauseProjection(c,'client'));
  sections+=`<h2>Items for Discussion</h2>${clientItems.length?clientItems.map(item=>`<div class="report-card"><strong>${escapeHtml(item.number)} - ${escapeHtml(item.heading)}</strong><div class="pill">${escapeHtml(item.position)}</div><p>${escapeHtml(item.shareableSummary||'Requires discussion.')}</p></div>`).join(''):'<p>No discussion items captured.</p>'}`;
  return wrapReportDocument('Client Review Report',css,sections);
}
const internalItems=positionedClauses.map(c=>({clause:c,item:getReportClauseProjection(c,'internal')}));
sections+=`<h2>Positions</h2><div class="report-card"><strong>Overall inherent risk:</strong> ${escapeHtml(state.documentRisk||'Low')}<br><strong>Review priority:</strong> ${escapeHtml(state.documentReviewPriority||'Low')}<br><strong>Decision progress:</strong> ${getReviewableClauses().filter(c=>!!getClauseDecision(c.id).type).length}/${getReviewableClauses().length}</div>${internalItems.length?`<table class="report-table"><thead><tr><th>Clause</th><th>Heading</th><th>Position</th><th>Internal fallback / note</th></tr></thead><tbody>${internalItems.map(({item})=>`<tr><td>${escapeHtml(item.number)}</td><td>${escapeHtml(item.heading)}</td><td><span class="pill">${escapeHtml(item.position)}</span></td><td>${escapeHtml(item.fallback||item.internalNote||'—')}</td></tr>`).join('')}</tbody></table>`:'<p>No positions captured.</p>'}`;
sections+=`<h2>Document Hygiene</h2><div class="report-card"><strong>Broken xrefs:</strong> ${state.issues.crossReferenceBreaks.length}<br><strong>Missing expected clauses:</strong> ${state.issues.missingStandardClauses.length}<br><strong>Drafting consistency observations:</strong> ${state.issues.consistency.length}</div>`;
if(state.notes.length)sections+=`<h2>Internal Notes</h2>${Object.entries(notesByClause).map(([cid,ns])=>`<h3>${escapeHtml(clauseMap[cid]?.number||cid)} - ${escapeHtml(clauseMap[cid]?.heading||'')}</h3>${ns.map(n=>`<div class="report-card"><strong>${escapeHtml(n.type)}</strong>${n.owner?` <span class="mini">(${escapeHtml(n.owner)})</span>`:''}<p>${escapeHtml(n.text)}</p>${n.proposedFallback?`<pre>${escapeHtml(n.proposedFallback)}</pre>`:''}</div>`).join('')}`).join('')}`;
sections+=`<h2>Negotiation Context</h2>${flagged.length?flagged.map(c=>{const item=getReportClauseProjection(c,'internal');return `<div class="report-card"><strong>${escapeHtml(item.number)} - ${escapeHtml(item.heading)}</strong><div class="mini">Position: ${escapeHtml(item.position||'Not set')} | Review: ${escapeHtml(state.clauseReviewStatus[c.id]||'Not reviewed')} | Inherent risk: ${escapeHtml(item.inherentRisk)} | Priority: ${escapeHtml(item.reviewPriority)}</div>${item.counterpartyPosition?`<p><strong>Counterparty position:</strong> ${escapeHtml(item.counterpartyPosition)}</p>`:''}${item.nextStep?`<p><strong>Next step:</strong> ${escapeHtml(item.nextStep)}</p>`:''}</div>`;}).join(''):'<p>No negotiation context captured.</p>'}`;
return wrapReportDocument('Contract Review Report',css,sections);
}


/* ============================================================
DOCX PARSING
============================================================ */
function supportsDocxInflate(){ return getDocxSupportState(); }
async function extractTextFromDocx(arrayBuffer){
const warnings=[];if(!supportsDocxInflate())throw new Error('DOCX decompression not supported in this browser.');
const zip=parseZipEntries(new Uint8Array(arrayBuffer));if(!zip['word/document.xml'])throw new Error('word/document.xml not found.');
const docXml=await readZipTextEntry(zip['word/document.xml']);
if(/<w:ins\b|<w:del\b|<w:moveFrom\b/i.test(docXml))warnings.push('Tracked changes detected - insertions included, deletions excluded.');
const omittedParts=[];
if(zip['word/footnotes.xml']&&await wordPartHasMaterialText(zip['word/footnotes.xml'],'footnotes'))omittedParts.push('footnotes');
if(zip['word/endnotes.xml']&&await wordPartHasMaterialText(zip['word/endnotes.xml'],'endnotes'))omittedParts.push('endnotes');
if(zip['word/comments.xml']&&await wordPartHasMaterialText(zip['word/comments.xml'],'comments'))omittedParts.push('comments');
if(await anyWordPartsHaveMaterialText(zip,/^word\/header\d*\.xml$/i,'header'))omittedParts.push('headers');
if(await anyWordPartsHaveMaterialText(zip,/^word\/footer\d*\.xml$/i,'footer'))omittedParts.push('footers');
if(omittedParts.length)warnings.push(`Not included in clause analysis: ${omittedParts.join(', ')}. Review these parts in Word before relying on the analysis.`);
if(/<w:txbxContent\b/i.test(docXml))warnings.push('Word text boxes detected. Visible text may not preserve its intended position in the clause model; verify text boxes in Word.');
if(/<(?:w:object|o:OLEObject|w:altChunk)\b/i.test(docXml))warnings.push('Embedded or externally linked Word content detected and not interpreted as operative clause content. Verify embedded objects in Word.');
if(/<w:sdt\b/i.test(docXml))warnings.push('Word content controls detected. Visible text was included where readable, but control state and metadata are not represented.');
const numXml=zip['word/numbering.xml']?await readZipTextEntry(zip['word/numbering.xml']):'';
const styXml=zip['word/styles.xml']?await readZipTextEntry(zip['word/styles.xml']):'';
const numbering=numXml?parseNumberingXml(numXml):{numToAbstract:{},abstractLevels:{}};
const styles=styXml?parseStylesXml(styXml):{};
const bodyResult=extractParagraphTextFromDocumentXml(docXml,numbering,styles,warnings);
if(!numXml)warnings.push('Numbering definitions not found.');
if(!bodyResult.text.trim())warnings.push('Very little text extracted.');
if(bodyResult.tableRows.length)warnings.push(`${bodyResult.tableRows.length} table rows extracted.`);
return{text:bodyResult.text,warnings,tableRows:bodyResult.tableRows||[],paragraphRecords:bodyResult.paragraphRecords||[]};
}

function parseZipEntries(bytes){
const eocd=findEndOfCentralDirectory(bytes);if(eocd<0)throw new Error('ZIP EOCD not found.');
const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);const total=view.getUint16(eocd+10,true);const cdOff=view.getUint32(eocd+16,true);const entries={};let ptr=cdOff;
if(total>MAX_ZIP_ENTRIES)throw new Error('DOCX contains too many archive entries to process safely.');let expandedTotal=0;
for(let i=0;i<total;i++){if(ptr+46>bytes.length||view.getUint32(ptr,true)!==0x02014b50)throw new Error('Invalid ZIP CD.');const cm=view.getUint16(ptr+10,true);const cs=view.getUint32(ptr+20,true);const us=view.getUint32(ptr+24,true);const fnl=view.getUint16(ptr+28,true);const efl=view.getUint16(ptr+30,true);const fcl=view.getUint16(ptr+32,true);const lho=view.getUint32(ptr+42,true);expandedTotal+=us;if(expandedTotal>MAX_ZIP_EXPANDED_BYTES)throw new Error('DOCX expands beyond the safe processing limit.');if(ptr+46+fnl+efl+fcl>bytes.length||lho>=bytes.length)throw new Error('Invalid ZIP offsets.');const fn=new TextDecoder('utf-8').decode(bytes.slice(ptr+46,ptr+46+fnl));entries[fn]={fileName:fn,compressionMethod:cm,compressedSize:cs,uncompressedSize:us,localHeaderOffset:lho,bytes};ptr+=46+fnl+efl+fcl;}
return entries;
}
function findEndOfCentralDirectory(b){const min=Math.max(0,b.length-65557);for(let i=b.length-22;i>=min;i--)if(b[i]===0x50&&b[i+1]===0x4b&&b[i+2]===0x05&&b[i+3]===0x06)return i;return -1;}
async function readZipTextEntry(e){return new TextDecoder('utf-8').decode(await readZipEntry(e));}
async function wordPartHasMaterialText(entry,kind='part'){try{const xml=await readZipTextEntry(entry);const doc=new DOMParser().parseFromString(xml,'application/xml');const excluded=new Set(['separator','continuationSeparator']);const nodes=[...doc.getElementsByTagName('*')].filter(node=>node.localName==='footnote'||node.localName==='endnote'||node.localName==='comment');if(nodes.length){return nodes.some(node=>{const type=getAttrByLocalName(node,'type');const id=Number(getAttrByLocalName(node,'id'));if(excluded.has(type)||id<0)return false;return [...node.getElementsByTagName('*')].filter(child=>child.localName==='t').map(child=>child.textContent||'').join('').trim().length>0;});}return [...doc.getElementsByTagName('*')].filter(node=>node.localName==='t').map(node=>node.textContent||'').join('').trim().length>0;}catch(error){console.warn(`Unable to inspect ${kind}`,error);return true;}}
async function anyWordPartsHaveMaterialText(zip,pattern,kind){for(const name of Object.keys(zip).filter(value=>pattern.test(value))){pattern.lastIndex=0;if(await wordPartHasMaterialText(zip[name],kind))return true;}return false;}
async function readStreamWithLimit(stream,limit){const reader=stream.getReader();const chunks=[];let total=0;try{while(true){const{done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>limit){await reader.cancel('DOCX entry exceeds safe decompression limit.');throw new Error('DOCX entry too large to process safely.');}chunks.push(value);}}finally{reader.releaseLock();}const out=new Uint8Array(total);let offset=0;chunks.forEach(chunk=>{out.set(chunk,offset);offset+=chunk.byteLength;});return out;}
async function readZipEntry(entry){const limit=50*1024*1024;const view=new DataView(entry.bytes.buffer,entry.bytes.byteOffset,entry.bytes.byteLength);const off=entry.localHeaderOffset;if(view.getUint32(off,true)!==0x04034b50)throw new Error(`Invalid local header for ${entry.fileName}`);const fnl=view.getUint16(off+26,true);const efl=view.getUint16(off+28,true);const ds=off+30+fnl+efl;const compressed=entry.bytes.slice(ds,ds+entry.compressedSize);if(entry.uncompressedSize>limit||compressed.byteLength>limit)throw new Error('DOCX entry too large to process safely.');if(entry.compressionMethod===0)return compressed;if(entry.compressionMethod!==8)throw new Error(`Unsupported compression method: ${entry.compressionMethod}`);const d=new DecompressionStream('deflate-raw');return readStreamWithLimit(new Blob([compressed]).stream().pipeThrough(d),limit);}

function getAttrByLocalName(node,name){if(!node?.attributes)return null;for(const a of node.attributes)if(a.localName===name)return a.value;return null;}
function parseNumberingXml(xml){const d=new DOMParser().parseFromString(xml,'application/xml');const nta={};const al={};const overrides={};[...d.getElementsByTagName('*')].forEach(n=>{if(n.localName==='num'){const ni=getAttrByLocalName(n,'numId');const abs=[...n.children].find(c=>c.localName==='abstractNumId');const ai=abs?getAttrByLocalName(abs,'val'):null;if(ni&&ai)nta[ni]=ai;if(ni){overrides[ni]={};[...n.children].filter(c=>c.localName==='lvlOverride').forEach(o=>{const il=getAttrByLocalName(o,'ilvl')||'0';const start=[...o.children].find(c=>c.localName==='startOverride');if(start)overrides[ni][il]=Number(getAttrByLocalName(start,'val'))||1;});}}if(n.localName==='abstractNum'){const ai=getAttrByLocalName(n,'abstractNumId');if(!ai)return;al[ai]={};[...n.children].filter(c=>c.localName==='lvl').forEach(l=>{const il=getAttrByLocalName(l,'ilvl')||'0';const lt=[...l.children].find(c=>c.localName==='lvlText');const nf=[...l.children].find(c=>c.localName==='numFmt');const st=[...l.children].find(c=>c.localName==='start');al[ai][il]={lvlText:lt?getAttrByLocalName(lt,'val')||'%1':'%1',numFmt:nf?getAttrByLocalName(nf,'val')||'decimal':'decimal',start:st?Number(getAttrByLocalName(st,'val'))||1:1};});}});return{numToAbstract:nta,abstractLevels:al,overrides};}
function parseStylesXml(xml){const d=new DOMParser().parseFromString(xml,'application/xml');const out={};[...d.getElementsByTagName('*')].forEach(n=>{if(n.localName!=='style'||getAttrByLocalName(n,'type')!=='paragraph')return;const styleId=getAttrByLocalName(n,'styleId')||'';if(!styleId)return;const child=name=>[...n.children].find(c=>c.localName===name);const pPr=child('pPr');const numPr=pPr?[...pPr.children].find(c=>c.localName==='numPr'):null;const numIdNode=numPr?[...numPr.children].find(c=>c.localName==='numId'):null;const ilvlNode=numPr?[...numPr.children].find(c=>c.localName==='ilvl'):null;const nameNode=child('name');const basedOnNode=child('basedOn');const label=`${styleId} ${nameNode?(getAttrByLocalName(nameNode,'val')||''):''}`;const headingMatch=label.match(/heading\s*([1-6])/i);out[styleId]={headingLevel:headingMatch?parseInt(headingMatch[1],10):0,basedOn:basedOnNode?(getAttrByLocalName(basedOnNode,'val')||''):'',numId:numIdNode?(getAttrByLocalName(numIdNode,'val')||''):'',ilvl:ilvlNode?(getAttrByLocalName(ilvlNode,'val')||''):''};});return out;}
function resolveParagraphStyle(styleId,styleMap,seen=new Set()){return typeof ANALYSIS_CORE.resolveStyleNumbering==='function'?ANALYSIS_CORE.resolveStyleNumbering(styleId,styleMap,seen):{headingLevel:0,basedOn:'',numId:'',ilvl:'0'};}
function getParagraphStyleId(pNode){const pPr=[...pNode.children].find(c=>c.localName==='pPr');const ps=pPr?[...pPr.children].find(c=>c.localName==='pStyle'):null;return ps?(getAttrByLocalName(ps,'val')||''):'';}
function getParagraphHeadingLevel(pNode,styleMap){return resolveParagraphStyle(getParagraphStyleId(pNode),styleMap).headingLevel||0;}
function collectParagraphText(pNode){
  let out='';
  const fieldStates=[];
  const walk=n=>{
    if(n.nodeType!==1)return;
    if(n.localName==='del'||n.localName==='moveFrom')return;
    if(n.localName==='instrText')return;
    if(n.localName==='fldChar'){
      const t=n.getAttribute('w:fldCharType')||n.getAttributeNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','fldCharType')||'';
      if(t==='begin')fieldStates.push('instruction');
      else if(t==='separate'&&fieldStates.length)fieldStates[fieldStates.length-1]='result';
      else if(t==='end')fieldStates.pop();
      return;
    }
    if(n.localName==='r'){
      if(fieldStates[fieldStates.length-1]==='instruction')return;
      const rPr=[...n.children].find(c=>c.localName==='rPr');
      if(rPr&&[...rPr.children].some(c=>c.localName==='strike'||c.localName==='dstrike'))return;
    }
    if(n.localName==='t')out+=n.textContent||'';
    else if(n.localName==='tab')out+='\t';
    else if(n.localName==='br'||n.localName==='cr')out+='\n';
    [...n.children].forEach(walk);
  };
  [...pNode.children].forEach(walk);
  return out;
}
function extractParagraphTextFromDocumentXml(xmlText,numbering,styles,warnings){
const xml=new DOMParser().parseFromString(xmlText,'application/xml');const paras=[];const tableRows=[];const paragraphRecords=[];const counters={};let ns='main';let lastCtx='';
const hasTableAncestor=node=>{let parent=node?.parentElement;while(parent){if(parent.localName==='tbl')return true;parent=parent.parentElement;}return false;};
const nestedTableCount=[...xml.getElementsByTagName('*')].filter(node=>node.localName==='tbl'&&hasTableAncestor(node)).length;
if(nestedTableCount)warnings.push(`${nestedTableCount} nested table${nestedTableCount===1?'':'s'} detected; nested cell text was included in analysis.`);
const updateCtx=l=>{const c=String(l||'').replace(/\s+/g,' ').trim();if(!c)return;if(/^(Schedule|Annex(?:ure)?|Appendix|Exhibit|Clause|Section|Article|\d+(?:.\d+)*)\b/i.test(c))lastCtx=c.slice(0,140);else if(!lastCtx&&c.length<=140)lastCtx=c;};
const walk=n=>{if(!n||n.nodeType!==1)return;
if(n.localName==='p'){const text=collectParagraphText(n).replace(/\s+/g,' ').trim();const hl=getParagraphHeadingLevel(n,styles);const ni=getParagraphNumberingInfo(n,numbering,counters,ns,styles);const line=[ni.prefix,text].filter(Boolean).join(' ').trim();if(line){paras.push(line);paragraphRecords.push({text:line,rawText:text,headingLevel:hl,sourceType:'paragraph',numberingSource:ni.source||'',numberingPrefix:ni.prefix||'',numberingLevel:ni.ilvl||'',numberingId:ni.numId||'',sourceOrder:paragraphRecords.length});updateCtx(line);if(/^(Schedule|Annex(?:ure)?|Appendix|Exhibit)\b/i.test(line))ns=line.toLowerCase().replace(/[^a-z0-9]+/g,'-');}return;}
if(n.localName==='tbl'){[...n.children].filter(c=>c.localName==='tr').forEach(tr=>{const cells=[...tr.children].filter(c=>c.localName==='tc').map(tc=>{const parts=[...tc.getElementsByTagName('*')].filter(ch=>ch.localName==='p').map(ch=>collectParagraphText(ch).replace(/\s+/g,' ').trim()).filter(Boolean);return parts.join(' ');}).filter(Boolean);if(cells.length){const rowText=cells.join(' | ');tableRows.push({contextHint:lastCtx,cells,rowText});paras.push(rowText);paragraphRecords.push({text:rowText,rawText:rowText,headingLevel:0,sourceType:'table',cells:[...cells],contextHint:lastCtx,sourceOrder:paragraphRecords.length});}});return;}
[...n.children].forEach(walk);
};
walk(xml.documentElement);if(!paras.length)warnings.push('No paragraph text extracted.');
return{text:paras.join('\n'),tableRows,paragraphRecords};
}
function getParagraphNumberingInfo(pNode,numbering,counters,ns='main',styles={}){
const pPr=[...pNode.children].find(c=>c.localName==='pPr');const numPr=pPr?[...pPr.children].find(c=>c.localName==='numPr'):null;
const niNode=numPr?[...numPr.children].find(c=>c.localName==='numId'):null;const ilNode=numPr?[...numPr.children].find(c=>c.localName==='ilvl'):null;
const inherited=resolveParagraphStyle(getParagraphStyleId(pNode),styles);
const numId=niNode?(getAttrByLocalName(niNode,'val')||''):inherited.numId;const ilvl=ilNode?(getAttrByLocalName(ilNode,'val')||'0'):(inherited.ilvl||'0');if(!numId||numId==='0')return{prefix:'',source:'',numId:'',ilvl:''};
const scoped=`${ns}:${numId}`;if(!counters[scoped])counters[scoped]=[];const depth=parseInt(ilvl,10)||0;
const absId=numbering.numToAbstract[numId];const lc=absId&&numbering.abstractLevels[absId]?numbering.abstractLevels[absId][ilvl]:null;
const start=numbering.overrides?.[numId]?.[ilvl]||lc?.start||1;if(counters[scoped][depth]==null)counters[scoped][depth]=start-1;counters[scoped][depth]+=1;for(let i=depth+1;i<counters[scoped].length;i++)counters[scoped][i]=0;
const lt=lc?.lvlText||Array.from({length:depth+1},(_,i)=>`%${i+1}`).join('.');
const prefix=lt.replace(/%([1-9])/g,(_,n)=>{const idx=parseInt(n,10)-1;const v=counters[scoped][idx]||0;const fmt=numbering.abstractLevels[absId]?.[String(idx)]?.numFmt||'decimal';if(fmt==='lowerLetter')return String.fromCharCode(96+v);if(fmt==='upperLetter')return String.fromCharCode(64+v);if(fmt==='lowerRoman')return toRoman(v).toLowerCase();if(fmt==='upperRoman')return toRoman(v);return String(v);});
return{prefix:prefix.replace(/[\u0000-\u001F]/g,'').trim(),source:niNode?'direct':'style',numId,ilvl};
}
function toRoman(num){const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let out='',n=num;for(const[v,s]of m)while(n>=v){out+=s;n-=v;}return out||String(num);}

/* -- Missing utility functions -- */
function buildGlobalIssueLog(){
const grouped={};const push=(theme,sev,clause,text)=>{const k=theme||'General';grouped[k]||=[];grouped[k].push({severity:sev,clauseId:clause.id,clauseLabel:clause.number||clause.heading,heading:clause.heading||'',text});};
state.clauses.forEach(c=>{const theme=c.type||'General';(state.notes||[]).filter(n=>n.clauseId===c.id&&['Risk','Query','Follow-Up','Drafting Issue','Commercial Issue'].includes(n.type)).forEach(n=>push(theme,n.blocker?'high':'info',c,`${n.type}: ${n.text}`));(state.clauseTags?.[c.id]||[]).forEach(tag=>push(theme,tag==='Risk'||tag==='Commercial Issue'?'medium':'info',c,`Tag: ${tag}`));const pos=state.clausePositions?.[c.id]||'';if(pos==='Reject'||pos==='Escalate')push(theme,'high',c,`Position: ${pos}`);if((state.clauseReviewStatus?.[c.id]||'')==='Escalated')push(theme,'high',c,'Status: Escalated');});
return grouped;
}
function formatResolutionForReport(term,clauseMap){
if(term.definitionType!=='cross_reference')return '-';
if(term.resolutionStatus==='resolved')return `Resolved from ${clauseMap[term.resolvedClauseId]?.number||term.resolvedClauseLabel||term.reference}`;
if(term.resolutionStatus==='reference_found')return `Clause found (${clauseMap[term.resolvedClauseId]?.number||term.resolvedClauseLabel||term.reference}), definition not extracted`;
return `Unresolved: ${term.reference||'ref not found'}`;
}
function showSnapshotDiff(id){ const item=(state.snapshotItems||[]).find(i=>String(i.id)===String(id)); if(!item) return; const mount=document.getElementById('snapshotDiffOutput'); if(mount) mount.classList.remove('hidden'); renderSnapshotDiffOutput(item.id); }

function buildSnapshotDiffData(snapshot){
const payload=snapshot?.payload||{};const currentMap=new Map(state.clauses.map(c=>[c.id,c]));
const allIds=Array.from(new Set([...Object.keys(payload.clausePositions||{}),...Object.keys(state.clausePositions||{}),...Object.keys(payload.clauseReviewStatus||{}),...Object.keys(state.clauseReviewStatus||{}),...Object.keys(payload.decisionByClause||{}),...Object.keys(state.decisionByClause||{})]));
return allIds.map(id=>{const c=currentMap.get(id)||(payload.clauses||[]).find(x=>x.id===id)||{};const bp=payload.clausePositions?.[id]||'';const ap=state.clausePositions?.[id]||'';const bd=payload.decisionByClause?.[id]||{};const ad=state.decisionByClause?.[id]||{};const br=payload.clauseReviewStatus?.[id]||'';const ar=state.clauseReviewStatus?.[id]||'';const bn=(payload.notes||[]).filter(x=>x.clauseId===id).length;const an=(state.notes||[]).filter(x=>x.clauseId===id).length;const beforeDecision=[bd.type||'',bd.rationale||'',bd.openingAsk||'',bd.fallback||'',bd.route||'',bd.owner||'',bd.question||''].join('|');const afterDecision=[ad.type||'',ad.rationale||'',ad.openingAsk||'',ad.fallback||'',ad.route||'',ad.owner||'',ad.question||''].join('|');if(bp===ap&&br===ar&&bn===an&&beforeDecision===afterDecision)return null;return{id,label:c.number||c.heading||id,heading:c.heading||'',beforePosition:bp,afterPosition:ap,beforeDecision:bd.type||'',afterDecision:ad.type||'',beforeRoute:bd.route||'',afterRoute:ad.route||'',beforeFallback:[bd.openingAsk||'',bd.fallback||''].filter(Boolean).join(' → '),afterFallback:[ad.openingAsk||'',ad.fallback||''].filter(Boolean).join(' → '),beforeReview:br,afterReview:ar,beforeNotes:bn,afterNotes:an};}).filter(Boolean);
}
function renderSnapshotDiffOutput(snapshotId){
const mount=document.getElementById('snapshotDiffOutput');if(!mount)return;
mount.classList.remove('hidden');
const item=getSnapshotItemsCache().find(e=>e.id===snapshotId);if(!item){mount.innerHTML='';return;}
const rows=buildSnapshotDiffData(item);
if(!rows.length){mount.innerHTML=`<div class="tool-card low"><h4>No deltas vs current</h4><div class="mini">Snapshot: ${escapeHtml(item.label||item.fileName||'Untitled')}</div></div>`;return;}
const changedPositions=rows.filter(r=>(r.beforePosition||'')!==(r.afterPosition||'')).length;
const changedReviews=rows.filter(r=>(r.beforeReview||'')!==(r.afterReview||'')).length;
const changedNotes=rows.filter(r=>r.beforeNotes!==r.afterNotes).length;
mount.innerHTML=`<div class="tool-card info"><h4>Diff vs current</h4><div class="mini">Snapshot: ${escapeHtml(item.label||item.fileName||'Untitled')} • ${rows.length} changed clauses • ${changedPositions} position changes • ${changedReviews} review changes • ${changedNotes} note-count changes</div>${rows.map(r=>`<div class="snapshot-diff-row"><strong>${escapeHtml(r.label)}</strong><div class="mini">Position: ${escapeHtml(r.beforePosition||'Not set')} -> ${escapeHtml(r.afterPosition||'Not set')}</div><div class="mini">Review: ${escapeHtml(r.beforeReview||'Not set')} -> ${escapeHtml(r.afterReview||'Not set')}</div><div class="mini">Notes: ${r.beforeNotes} -> ${r.afterNotes}</div></div>`).join('')}</div>`;
}
function getSessionHealthMetrics(){
const reviewed=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Reviewed').length;
const inReview=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='In review').length;
const escalated=Object.values(state.clauseReviewStatus||{}).filter(v=>v==='Escalated').length;
const positionsSet=Object.values(state.clausePositions||{}).filter(Boolean).length;
const unresolvedPH=(state.placeholders||[]).filter(i=>!i.resolved).length;
return{reviewed,inReview,escalated,positionsSet,unresolvedPlaceholders:unresolvedPH,snapshotCount:getSnapshotItemsCache().length,autosaveOn:!!(state.clauses||[]).length&&!state.prefs?.disableAutosave&&!state.autosaveFailed};
}
function renderSessionHealthCard({compact=false}={}){
const h=getSessionHealthMetrics();
const bits=[{label:'Autosave',value:h.autosaveOn?'On':'Off'},{label:'Reviewed',value:`${h.reviewed}/${state.clauses.length||0}`},{label:'In review',value:h.inReview},{label:'Escalated',value:h.escalated},{label:'Positions',value:h.positionsSet},{label:'Placeholders',value:h.unresolvedPlaceholders},{label:'Snapshots',value:h.snapshotCount}];
return `<div class="tool-card info session-health-card ${compact?'compact':''}"><h4>Session health</h4><div class="session-health-grid">${bits.map(b=>`<div class="session-health-item"><span>${escapeHtml(b.label)}</span><strong>${escapeHtml(String(b.value))}</strong></div>`).join('')}</div></div>`;
}
function renderMatterDetailsCard({compact=false}={}){
const matter=getMatterDetails();const hasMatter=!!(matter.counterparty||matter.businessUnit||matter.dealValueBand||matter.jurisdiction);
return `<div class="tool-card info matter-card ${compact?'compact':''}"><details ${hasMatter?'':'open'}><summary><strong>Matter details</strong></summary>${renderMatterForm()}<div class="mini">Matter context is optional. Improves exports and risk calibration.</div></details></div>`;
}
function formatStakeholderPing(tagLabel){
const items=(state.clauses||[]).filter(c=>(state.clauseRoutingTags?.[c.id]||[]).some(t=>t.includes(tagLabel))).map(c=>{const notes=(state.notes||[]).filter(n=>n.clauseId===c.id).slice(0,2);return `${c.number} - ${c.heading}\nPosition: ${state.clausePositions?.[c.id]||'Not set'}\nRouting: ${(state.clauseRoutingTags?.[c.id]||[]).join(', ')||'None'}\n${notes.length?`Notes: ${notes.map(n=>`[${n.type}] ${n.text}`).join(' | ')}`:'Notes: None'}\n`;});
return `Subject: Input needed: ${tagLabel} clauses\n\n${matterSummaryLine()?`Matter: ${matterSummaryLine()}\n\n`:''}${items.length?items.join('\n---\n'):`No clauses routed to ${tagLabel}.`}`;
}
function exportStakeholderPing(tagLabel){copyTextToClipboard(formatStakeholderPing(tagLabel),`${tagLabel} ping copied`);}
function exportNegotiationPack(){downloadBlob(`${safeBaseName(state.documentMeta.fileName||'contract')}_negotiation_pack_${buildDateStamp()}.html`,new Blob([buildNegotiationPackHtml()],{type:'text/html'}));}
function buildApprovalPackHtml(){return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Approval Pack</title><style>${getReportStyles()}</style></head><body><h1>Approval Pack</h1><pre>${escapeHtml(formatApprovalPack())}</pre></body></html>`;}
function exportApprovalPackHtml(){downloadBlob(`${safeBaseName(state.documentMeta?.fileName||'contract')}_approval_pack_${buildDateStamp()}.html`,new Blob([buildApprovalPackHtml()],{type:'text/html'}));}

function buildNegotiationPackHtml(){return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Negotiation Pack</title><style>${getReportStyles()}</style></head><body>${buildExecutiveSummaryHtml()}<h1>Negotiation Pack</h1><pre>${escapeHtml(formatNegotiationAgenda())}</pre><h2>Clause pack</h2><pre>${escapeHtml(formatNegotiationPack())}</pre></body></html>`;}
function renderDraftingNudgeHtml(clauseId){
const msg=getDraftingNudge(clauseId);if(!msg)return '';
return `<div class="tool-card warn drafting-nudge"><div class="panel-subhead">Drafting nudge</div><div class="mini">${escapeHtml(msg)}</div><div class="card-actions"><button class="link-btn" data-action="dismiss-drafting-nudge" type="button">Dismiss</button></div></div>`;
}
function renderSuggestedLibraryHtml(clause){
const items=getSuggestedLibraryEntries(clause);if(!items.length)return '';
return `<div class="suggested-library"><div class="panel-subhead">Suggested library clauses</div>${items.map(i=>`<div class="tool-card info compact"><h4>${escapeHtml(i.title)}</h4><div class="mini">${escapeHtml(i.type||'General')}${i.standardPosition?' * Playbook':''}</div><div class="card-actions"><button class="link-btn" data-action="copy-suggested-library" data-id="${escapeHtml(i.id)}">Copy</button></div></div>`).join('')}</div>`;
}
function updateToolModeUI(){
els.toolTabs?.querySelectorAll('.tool-tab').forEach(btn=>btn.classList.remove('hidden'));
const notesTab=els.toolTabs?.querySelector('.tool-tab[data-tab="notes"]');
if(notesTab) notesTab.classList.toggle('hidden', getActiveWorkflowStage()==='close');
}

/* ============================================================
   v6.24 — Execution Layer (bulk actions, negotiation mode, call prep)
   ============================================================ */
state.issueConsole = Object.assign({items:[],filters:{risk:'all',status:'all',route:'all',query:''},sortBy:'risk',viewMode:'list',selectedIds:[],selectionAnchor:null,negotiationMode:false}, state.issueConsole||{});

function canonicalRouteLabel(route){
  const r=String(route||'').trim();
  if(!r || r==='all') return 'all';
  if(r==='Business') return 'Needs Business Input';
  if(r==='Privacy') return 'Needs Privacy Review';
  if(r==='Finance') return 'Needs Finance Input';
  if(r==='Leadership') return 'Escalate to Leadership';
  return r;
}
function getIssueSelectedIds(){
  state.issueConsole = state.issueConsole || {};
  state.issueConsole.selectedIds = Array.isArray(state.issueConsole.selectedIds)?state.issueConsole.selectedIds:[];
  return state.issueConsole.selectedIds;
}
function clearIssueSelection(){ state.issueConsole.selectedIds=[]; state.issueConsole.selectionAnchor=null; }
function isIssueSelected(cid){ return getIssueSelectedIds().includes(cid); }
function toggleIssueSelection(cid, selected, opts={}){
  const ids=getIssueSelectedIds();
  const shouldSelect = typeof selected==='boolean' ? selected : !ids.includes(cid);
  const visibleIds=(getIssueConsoleItems()||[]).map(i=>i.clauseId);
  if(opts.range && state.issueConsole.selectionAnchor && visibleIds.includes(state.issueConsole.selectionAnchor) && visibleIds.includes(cid)){
    const a=visibleIds.indexOf(state.issueConsole.selectionAnchor), b=visibleIds.indexOf(cid);
    const rng=visibleIds.slice(Math.min(a,b), Math.max(a,b)+1);
    const set=new Set(ids);
    rng.forEach(id=>{ if(shouldSelect) set.add(id); else set.delete(id); });
    state.issueConsole.selectedIds=[...set];
  } else {
    state.issueConsole.selectedIds = shouldSelect ? Array.from(new Set([...ids,cid])) : ids.filter(id=>id!==cid);
    state.issueConsole.selectionAnchor = cid;
  }
}
function getIssueReadiness(issue){
  let score=0;
  if(issue.position) score+=1;
  if((issue.fallback||'').trim()) score+=1;
  if((issue.note||'').trim()) score+=1;
  if(issue.route && issue.route!=='Legal Only') score+=1;
  const label = score>=4?'Ready':score>=2?'Partial':'Unprepared';
  return {score,label};
}
function setIssueRoute(cid, route){ const canonical=canonicalRouteLabel(route); applyIssueUpdate(cid,{routeTo:canonical||'Legal Only'}); logReviewAction('routing-updated',cid,{summary:canonical||'Legal Only'}); }
function applyBulkIssueStatus(status){
  const ids=getIssueSelectedIds(); if(!ids.length) return;
  bulkApplyIssues(ids,{status});
  showToast(`Updated ${ids.length} issue${ids.length===1?'':'s'} to ${status}`,'info');
  renderReviewPanel();
}
function applyBulkIssueRoute(route){
  const ids=getIssueSelectedIds(); if(!ids.length) return;
  bulkApplyIssues(ids,{routeTo:route});
  showToast(`Routed ${ids.length} issue${ids.length===1?'':'s'}`,'info');
  renderReviewPanel();
}
function applyBulkIssuePosition(position){
  const ids=getIssueSelectedIds(); if(!ids.length) return;
  bulkApplyIssues(ids,{position});
  showToast(`Set position for ${ids.length} issue${ids.length===1?'':'s'}`,'info');
  renderReviewPanel();
}
function applyBulkIssueAgenda(){
  const ids=getIssueSelectedIds(); if(!ids.length) return;
  ids.forEach(cid=>{ if(!isInAgenda(cid)) addClauseToAgenda(cid); });
  showToast(`Added ${ids.length} issue${ids.length===1?'':'s'} to agenda`,'info');
  renderReviewPanel();
}
function markSelectedIssuesResolved(){
  const ids=getIssueSelectedIds(); if(!ids.length) return;
  bulkApplyIssues(ids,{status:'Resolved'});
  showToast(`Resolved ${ids.length} issue${ids.length===1?'':'s'}`,'info');
  renderReviewPanel();
}
function applyIssueQuickAction(cid, action){
  if(action==='accept'){ bulkApplyIssues([cid],{position:'Acceptable',status:'Resolved'}); }
  else if(action==='counter'){ bulkApplyIssues([cid],{position:'Seek amendment',status:'Negotiating'}); }
  else if(action==='escalate'){ bulkApplyIssues([cid],{position:'Escalate',status:'Awaiting input'}); }
  else if(action==='park'){ bulkApplyIssues([cid],{status:'Parked'}); }
  renderReviewPanel();
}
function formatMeetingPrep(){
  const items=getIssueConsoleItems().filter(i=>i.status!=='Resolved').sort((a,b)=>riskWeight(b.risk)-riskWeight(a.risk)).slice(0,12);
  if(!items.length) return 'No unresolved issues for meeting prep.';
  const groups=groupBy(items,'route');
  const order=['Escalate to Leadership','Needs Business Input','Needs Privacy Review','Needs Finance Input','Legal Only'];
  const lines=['INTERNAL CALL PREP — TOP ISSUES','Audience: Internal Legal',''];
  order.filter(k=>groups[k]).forEach(k=>{
    lines.push(k.toUpperCase());
    groups[k].forEach(i=>{
      lines.push(`- ${i.clauseNumber || ''} ${i.heading}`.trim());
      lines.push(`  Ask: ${i.position || 'Not set'}`);
      lines.push(`  Fallback: ${i.fallback || 'Not captured'}`);
      lines.push(`  Risk: ${i.risk}`);
      if(i.note) lines.push(`  Note: ${truncateWords(i.note, 20)}`);
    });
    lines.push('');
  });
  Object.keys(groups).filter(k=>!order.includes(k)).forEach(k=>{
    lines.push(k.toUpperCase());
    groups[k].forEach(i=>{
      lines.push(`- ${i.clauseNumber || ''} ${i.heading}`.trim());
      lines.push(`  Ask: ${i.position || 'Not set'}`);
      lines.push(`  Fallback: ${i.fallback || 'Not captured'}`);
      lines.push(`  Risk: ${i.risk}`);
    });
    lines.push('');
  });
  return lines.join('\n');
}
function renderIssueBulkBar(){
  const count=getIssueSelectedIds().length;
  if(!count) return '';
  return `<div class="issue-bulk-bar"><div class="bulk-count">${count} selected</div><div class="bulk-actions"><select id="bulkIssueStatusSelect"><option value="">Set status…</option>${getIssueStatusOptions().map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}</select><select id="bulkIssueRouteSelect"><option value="">Set route…</option>${['Legal Only','Needs Business Input','Needs Privacy Review','Needs Finance Input','Escalate to Leadership'].map(r=>`<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join('')}</select><select id="bulkIssuePositionSelect"><option value="">Set position…</option>${NEGOTIATION_POSITION_OPTIONS.filter(Boolean).map(p=>`<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')}</select><button id="bulkAddAgendaBtn" class="btn btn-xs" type="button">Add to agenda</button><button id="bulkMarkResolvedBtn" class="btn btn-xs" type="button">Mark resolved</button><button id="clearIssueSelectionBtn" class="btn btn-xs btn-ghost" type="button">Clear</button></div></div>`;
}
function renderIssueLane(title, items){ return `<div class="issue-lane"><div class="issue-lane-title">${escapeHtml(title)} <span class="mini">(${items.length})</span></div>${items.length?items.map(renderIssueRow).join(''):'<div class="mini">No issues.</div>'}</div>`; }
function renderIssueConsoleFilters(){
  const cfg=state.issueConsole||{}; const f=cfg.filters||{};
  const routeOpts=['all','Legal Only','Needs Business Input','Needs Privacy Review','Needs Finance Input','Escalate to Leadership'];
  return `<div class="issue-console-toolbar"><input id="issueConsoleSearch" class="search-input" type="text" placeholder="Search issues…" value="${escapeHtml(f.query||'')}"><select id="issueConsoleRiskFilter">${['all','High','Medium','Low'].map(v=>`<option value="${v}" ${f.risk===v?'selected':''}>${v==='all'?'All risk':v}</option>`).join('')}</select><select id="issueConsoleStatusFilter">${['all',...getIssueStatusOptions()].map(v=>`<option value="${v}" ${f.status===v?'selected':''}>${v==='all'?'All status':v}</option>`).join('')}</select><select id="issueConsoleRouteFilter">${routeOpts.map(v=>`<option value="${v}" ${f.route===v?'selected':''}>${v==='all'?'All routes':v}</option>`).join('')}</select><select id="issueConsoleSortBy">${[['risk','Sort: risk'],['status','Sort: status'],['route','Sort: route'],['clause','Sort: clause']].map(([v,l])=>`<option value="${v}" ${cfg.sortBy===v?'selected':''}>${l}</option>`).join('')}</select><button id="issueConsoleListViewBtn" class="btn btn-xs ${cfg.viewMode!=='grouped'?'active':''}" type="button">List</button><button id="issueConsoleGroupedViewBtn" class="btn btn-xs ${cfg.viewMode==='grouped'?'active':''}" type="button">Stakeholder lanes</button><button id="toggleNegotiationModeBtn" class="btn btn-xs ${cfg.negotiationMode?'active':''}" type="button">⚡ Negotiation Mode</button><button id="openMeetingPrepBtn" class="btn btn-xs" type="button">Prepare for call</button></div>`;
}
function renderIssueRow(issue){
  const ready=getIssueReadiness(issue);
  const selected=isIssueSelected(issue.clauseId);
  const neg=!!state.issueConsole?.negotiationMode;
  const push=issue.theme? escapeHtml(issue.theme) : '';
  return `<div class="issue-row ${issue.status==='Resolved'?'resolved':''} ${selected?'selected':''}" data-issue-cid="${escapeHtml(issue.clauseId)}"><div class="issue-select-wrap"><input type="checkbox" class="issue-select-checkbox" data-issue-select="${escapeHtml(issue.clauseId)}" ${selected?'checked':''}></div><div class="issue-main"><div class="issue-title"><strong>${escapeHtml(issue.clauseNumber||'')}</strong> ${escapeHtml(issue.heading||issue.title||'Untitled clause')}</div><div class="issue-meta"><span class="badge risk-${slugifyStatus(issue.risk)}">${escapeHtml(issue.risk)}</span><span class="badge">${escapeHtml(issue.route)}</span><span class="badge">${escapeHtml(issue.position||'No position')}</span><span class="badge">${escapeHtml(issue.status)}</span><span class="badge readiness-${slugifyStatus(ready.label)}">${escapeHtml(ready.label)}</span></div>${neg?`<div class="issue-negotiation-grid"><div><span class="mini-label">Ask</span><div class="mini">${escapeHtml(issue.position || 'Not set')}</div></div><div><span class="mini-label">Fallback</span><div class="mini">${escapeHtml(truncateWords(issue.fallback || 'Not captured', 12))}</div></div><div><span class="mini-label">Pushback</span><div class="mini">${issue.risk==='High'?'High':'Medium'}</div></div></div>`:''}${issue.note?`<div class="mini issue-note">${escapeHtml(truncateWords(issue.note,18))}</div>`:''}<div class="mini issue-next">Next: ${escapeHtml(issue.nextAction||'Review clause')}</div></div><div class="issue-actions"><select class="issue-status-select" data-issue-status="${escapeHtml(issue.clauseId)}">${getIssueStatusOptions().map(s=>`<option value="${s}" ${issue.status===s?'selected':''}>${s}</option>`).join('')}</select><button type="button" class="btn btn-xs" data-issue-open="${escapeHtml(issue.clauseId)}">Open</button><button type="button" class="btn btn-xs" data-issue-agenda="${escapeHtml(issue.clauseId)}">${isInAgenda(issue.clauseId)?'Agenda ✓':'Agenda +'}</button>${neg?`<div class="issue-quick-actions"><button type="button" class="btn btn-xs" data-issue-quick="accept" data-cid="${escapeHtml(issue.clauseId)}">Accept</button><button type="button" class="btn btn-xs" data-issue-quick="counter" data-cid="${escapeHtml(issue.clauseId)}">Counter</button><button type="button" class="btn btn-xs" data-issue-quick="escalate" data-cid="${escapeHtml(issue.clauseId)}">Escalate</button><button type="button" class="btn btn-xs" data-issue-quick="park" data-cid="${escapeHtml(issue.clauseId)}">Park</button></div>`:''}</div></div>`;
}
function renderNegotiationModeFooter(){
  if(!state.issueConsole?.negotiationMode) return '';
  const counts=getIssueCounts();
  return `<div class="negotiation-mode-footer"><span>${counts.unresolved} unresolved</span><span>${counts.awaiting} awaiting input</span><span>${counts.highRisk} high risk</span><div class="spacer"></div><button id="negotiationNextIssueBtn" class="btn btn-xs" type="button">Next issue →</button><button id="negotiationResolveSelectedBtn" class="btn btn-xs" type="button">Resolve selected</button></div>`;
}
function buildIssueConsoleContent(){
  const items=getIssueConsoleItems(); const cfg=state.issueConsole||{}; const counts=getIssueCounts(); let content='';
  if(cfg.viewMode==='grouped'){
    const groups={}; items.forEach(i=>{ const key=i.route||'Legal Only'; (groups[key]||(groups[key]=[])).push(i); });
    const order=['Needs Business Input','Needs Privacy Review','Needs Finance Input','Escalate to Leadership','Legal Only'];
    content=`<div class="issue-lanes">${order.filter(k=>groups[k]).map(k=>renderIssueLane(k,groups[k])).join('')}${Object.keys(groups).filter(k=>!order.includes(k)).map(k=>renderIssueLane(k,groups[k])).join('')}</div>`;
  } else {
    content=`<div class="issue-list ${cfg.negotiationMode?'negotiation-mode-list':''}">${items.length?items.map(renderIssueRow).join(''):'<div class="mini">No issues match these filters.</div>'}</div>`;
  }
  return `${renderIssueConsoleFilters()}${renderIssueBulkBar()}<div class="issue-console-top mini">${counts.unresolved} unresolved • ${counts.awaiting} awaiting input • ${counts.leadership} leadership • ${counts.highRisk} high-risk open</div>${content}<div class="card-actions"><button id="copyIssueHotlistBtn" type="button">Copy hotlist</button><button id="copyLeadershipIssuePackBtn" type="button">Copy leadership briefing</button><button id="copyMeetingPrepBtn" type="button">Copy call prep</button></div>${renderNegotiationModeFooter()}`;
}



/* ============================================================
   v6.37 — decision engine release
   ============================================================ */
Object.assign(els, {
  queueBar: document.getElementById('queueBar'),
  contextPanelHeader: document.getElementById('contextPanelHeader'),
  contextPanelModeLabel: document.getElementById('contextPanelModeLabel'),
  contextPanelTitle: document.getElementById('contextPanelTitle'),
  contextPanelBody: document.getElementById('contextPanelBody'),
  contextUtilitiesDrawer: document.getElementById('contextUtilitiesDrawer')
});
installContextPanelHandlers();
state.workflowStage = state.workflowStage || mapLegacyModeToStage(state.workflowMode || 'review');
state.queuePreset = state.queuePreset || 'needs-decision';
state.decisionByClause = state.decisionByClause || {};
state.openLoops = state.openLoops || [];
state.readiness = state.readiness || {status:'blocked', blockers:[], decidedCount:0, totalCount:0};

function mapLegacyModeToStage(mode){
  if(mode==='triage') return 'intake';
  if(mode==='review') return 'decide';
  if(mode==='negotiate') return 'prepare';
  if(mode==='outputs') return 'close';
  return 'decide';
}
function mapStageToLegacyMode(stage){
  if(stage==='intake') return 'triage';
  if(stage==='decide') return 'review';
  if(stage==='prepare') return 'negotiate';
  if(stage==='close') return 'outputs';
  return 'review';
}
function getActiveWorkflowStage(){ return state.workflowStage || mapLegacyModeToStage(state.workflowMode || 'review'); }
function getClauseDecision(cid){
  if(!cid || cid===OVERVIEW_ID) return {type:'', rationale:'', fallback:'', route:'', status:'Open', nextAction:'', includeInPack:false, includeInEscalation:false, updatedAt:''};
  if(!state.decisionByClause[cid]){
    state.decisionByClause[cid]={
      type: mapLegacyPositionToDecisionType(state.clausePositions?.[cid] || ''),
      rationale:'',
      openingAsk: state.clauseFallbackLadders?.[cid]?.openingAsk || '',
      fallback: state.clauseFallbacks?.[cid] || state.clauseFallbackLadders?.[cid]?.fallback || '',
      route: (state.clauseRoutingTags?.[cid] || [])[0] || '',
      status: state.clauseNegotiationStatus?.[cid] || 'Open',
      nextAction:'',
      includeInPack:false,
      includeInEscalation:false,
      priority:'medium',
      updatedAt:''
    };
  }
  return state.decisionByClause[cid];
}
function mapLegacyPositionToDecisionType(pos){
  if(pos==='Acceptable') return 'accept';
  if(pos==='Accept with changes') return 'accept-with-changes';
  if(pos==='Seek amendment') return 'seek-amendment';
  if(pos==='Reject') return 'reject';
  if(pos==='Escalate') return 'escalate';
  if(pos==='Need input') return 'need-input';
  return '';
}

function mapDecisionTypeToLegacyPosition(type){
  if(type==='accept') return 'Acceptable';
  if(type==='accept-with-changes') return 'Accept with changes';
  if(type==='seek-amendment') return 'Seek amendment';
  if(type==='reject') return 'Reject';
  if(type==='escalate') return 'Escalate';
  if(type==='need-input') return 'Need input';
  return '';
}

function syncDecisionToLegacyState(cid){
  const d=getClauseDecision(cid);
  const mappedPos=mapDecisionTypeToLegacyPosition(d.type);
  if(mappedPos) state.clausePositions[cid]=mappedPos; else delete state.clausePositions[cid];
  if(String(d.route||'').trim()) state.clauseRoutingTags[cid]=[d.route]; else delete state.clauseRoutingTags[cid];
  if(d.status) state.clauseNegotiationStatus[cid]=d.status; else delete state.clauseNegotiationStatus[cid];
}
function syncAllDecisionsToLegacyState(){
  (state.clauses||[]).forEach(c=>{ if(c?.id && c.id!==OVERVIEW_ID) syncDecisionToLegacyState(c.id); });
}
function seedDecisionStateFromLegacy(){
  (state.clauses||[]).forEach(c=>{
    if(!c?.id || c.id===OVERVIEW_ID) return;
    const existing=state.decisionByClause?.[c.id];
    if(existing && (existing.type || existing.rationale || existing.fallback || existing.route || existing.owner || existing.question)) return;
    const legacyPos=state.clausePositions?.[c.id]||'';
    const legacyRoute=(state.clauseRoutingTags?.[c.id]||[])[0]||'';
    const legacyFallback=state.clauseFallbacks?.[c.id]||'';
    const legacyRationale=state.clauseRecommendations?.[c.id]||'';
    const legacyStatus=state.clauseNegotiationStatus?.[c.id]||'';
    if(legacyPos || legacyRoute || legacyFallback || legacyRationale || legacyStatus){
      state.decisionByClause[c.id]={
        type: mapLegacyPositionToDecisionType(legacyPos),
        rationale: legacyRationale,
        openingAsk: state.clauseFallbackLadders?.[c.id]?.openingAsk || '',
        fallback: legacyFallback || state.clauseFallbackLadders?.[c.id]?.fallback || '',
        route: legacyRoute,
        owner:'',
        question:'',
        status: legacyStatus || 'Open',
        nextAction:'',
        includeInPack: !!(legacyPos && legacyPos!=='Acceptable'),
        includeInEscalation: legacyPos==='Escalate',
        priority: legacyPos==='Escalate' ? 'high' : 'medium',
        updatedAt:''
      };
    }
  });
}

function setClauseDecision(cid, patch={}){
  const d=getClauseDecision(cid);
  if(Object.prototype.hasOwnProperty.call(patch,'type')&&patch.type!==d.type){
    d.transitionHistory=[...(d.transitionHistory||[]),{from:d.type||'',to:patch.type||'',at:new Date().toISOString(),archived:{route:d.route||'',owner:d.owner||'',question:d.question||'',fallback:d.fallback||'',openingAsk:d.openingAsk||'',rationale:d.rationale||''}}].slice(-20);
    if(!decisionRequiresRoute(patch.type))d.route='';
    if(!decisionRequiresOwner(patch.type))d.owner='';
    if(!decisionRequiresQuestion(patch.type))d.question='';
    if(!decisionRequiresFallback(patch.type)){d.fallback='';d.openingAsk='';}
    if(!decisionRequiresRationale(patch.type))d.rationale='';
    d.blocksApproval=patch.type==='need-input';
  }
  Object.assign(d, patch||{});
  d.updatedAt=new Date().toISOString();
  syncDecisionToLegacyState(cid);
  return d;
}
function decisionRequiresRationale(type){ return ['accept-with-changes','escalate'].includes(type); }
function decisionRequiresFallback(type){ return ['seek-amendment','reject'].includes(type); }
function decisionRequiresRoute(type){ return ['seek-amendment','need-input','escalate'].includes(type); }
function decisionRequiresOwner(type){ return type==='escalate'; }
function decisionRequiresQuestion(type){ return type==='need-input'; }
function decisionShowsOwner(type){ return type==='escalate'; }
function decisionShowsQuestion(type){ return type==='need-input'; }
function getDecisionCompletionForValue(d={}){
  const missing=[];
  if(!d.type) missing.push('Decision');
  if(d.type){
    if(decisionRequiresRationale(d.type) && !String(d.rationale||'').trim()) missing.push('Rationale');
    if(decisionRequiresFallback(d.type) && !String(d.fallback||'').trim()) missing.push('Fallback');
    if(decisionRequiresRoute(d.type) && !String(d.route||'').trim()) missing.push('Route');
    if(decisionRequiresOwner(d.type) && !String(d.owner||'').trim()) missing.push('Owner');
    if(decisionRequiresQuestion(d.type) && !String(d.question||'').trim()) missing.push('Question');
  }
  return {complete: missing.length===0, missing};
}
function getDecisionCompletionState(cid){return getDecisionCompletionForValue(getClauseDecision(cid));}
function maybeAutoAdvanceDecision(cid){
  if(!cid||cid===OVERVIEW_ID)return false;
  if(state.prefs?.autoAdvanceDecisions===false){pendingDecisionAutoAdvance.delete(cid);return false;}
  if(!pendingDecisionAutoAdvance.has(cid)||state.selectedClauseId!==cid)return false;
  if(!getDecisionCompletionState(cid).complete)return false;
  if(getClauseDecision(cid).type!=='accept'){pendingDecisionAutoAdvance.delete(cid);return false;}
  const nextId=getNextQueueClauseId(cid);
  if(!nextId||nextId===cid){pendingDecisionAutoAdvance.delete(cid);return false;}
  pendingDecisionAutoAdvance.delete(cid);
  setTimeout(()=>{
    if(state.selectedClauseId===cid&&getDecisionCompletionState(cid).complete)safeJumpToClause(nextId,{preserveHistory:true});
  },0);
  return true;
}
function recordDecisionLog(cid){
  const d=getClauseDecision(cid);
  logReviewAction('decision-updated', cid, {summary:`${d.type||'Not set'}${d.route?` • ${d.route}`:''}`});
}
function applyClauseDecision(cid, nextType){
  if(!cid || cid===OVERVIEW_ID) return;
  const before=deepCloneUndoValue(getClauseDecision(cid));
  const patch={type:nextType||'', includeInPack:false, includeInEscalation:false, priority:getClauseDecision(cid).priority||'medium'};
  if(nextType==='accept'){
    patch.status='Agreed';
    patch.nextAction=state.verificationByKey?.[`clause-source-${cid}`]==='confirmed'?'Decision and source verified':'Verify decision against source';
  } else if(nextType==='accept-with-changes'){
    patch.includeInPack=true;
    patch.status='Drafting fix';
    patch.nextAction='Capture the lawyer drafting rationale';
  } else if(nextType==='seek-amendment'){
    patch.includeInPack=true;
    patch.status='In negotiation';
    patch.nextAction='Capture fallback and route';
  } else if(nextType==='reject'){
    patch.includeInPack=true;
    patch.status='In negotiation';
    patch.nextAction='Capture fallback before pushing back';
  } else if(nextType==='escalate'){
    patch.includeInPack=true;
    patch.includeInEscalation=true;
    patch.priority='high';
    patch.status='Open';
    patch.nextAction='Escalate internally';
  } else if(nextType==='need-input'){
    patch.includeInPack=true;
    patch.priority=patch.priority||'medium';
    patch.status='Awaiting input';
    patch.nextAction='Route for input';
  } else {
    patch.status='Open';
    patch.nextAction='Capture a decision';
  }
  setClauseDecision(cid, patch);
  const after=deepCloneUndoValue(getClauseDecision(cid));
  recordUndoable('Decision update',cid,{before,after,reverter:(val)=>{state.decisionByClause[cid]=deepCloneUndoValue(val)||{}; syncDecisionToLegacyState(cid); recomputeOpenLoops(); renderClauseView(); renderClauseList(); renderActiveRightPanel();}});
  showToast(`Decision saved${patch.nextAction?` • ${patch.nextAction}`:''}`,'info');
  recordDecisionLog(cid);
  refreshDerivedClauseState(cid);
  recomputeOpenLoops();
  onSubstantiveChange({rerenderClause:state.selectedClauseId===cid});
  if(state.prefs?.autoAdvanceDecisions!==false)pendingDecisionAutoAdvance.add(cid);else pendingDecisionAutoAdvance.delete(cid);
  maybeAutoAdvanceDecision(cid);
}
let canonicalDecisionObserver=null;
function setupCanonicalDecisionObserver(){
  canonicalDecisionObserver?.disconnect?.();
  const card=els.clauseView?.querySelector('.decision-card');const bar=els.clauseView?.querySelector('.canonical-action-bar');if(!card||!bar)return;
  if(!('IntersectionObserver' in globalThis)){bar.classList.add('is-sticky-enabled');return;}
  canonicalDecisionObserver=new IntersectionObserver(entries=>{bar.classList.toggle('is-sticky-enabled',!entries[0]?.isIntersecting);},{root:null,threshold:0.05,rootMargin:'-8px 0px 0px 0px'});
  canonicalDecisionObserver.observe(card);
}
function renderDecisionCardBase(clause){
  if(!clause || clause.id===OVERVIEW_ID) return '';
  const cid=clause.id;
  const d=getClauseDecision(cid);
  const completion=getDecisionCompletionState(cid);
  const legalOpts=[['accept','Accept'],['seek-amendment','Amend'],['reject','Reject']];
  const workflowOpts=[['need-input','Get input'],['escalate','Escalate']];
  const opts=[...legalOpts,...workflowOpts,['accept-with-changes','Amend']];
  const risk=state.clauseRiskScores?.[cid]||'Low';
  const suggestedRoute=getDefaultRouteForClause(cid)||'Legal Only';
  const currentLabel=opts.find(([key])=>key===d.type)?.[1]||'Not set';
  const approvalStatus=String(state.clauseApprovalStatus?.[cid]||d.approvalStatus||'Raised');
  const escalationWorkflow=d.type==='escalate'?`<label><span>Approval state</span><select id="decisionApprovalStatusSelect">${['Raised','Sent for approval','Approved','Rejected','Returned'].map(value=>`<option value="${value}" ${approvalStatus===value?'selected':''}>${value}</option>`).join('')}</select><span class="mini">An approval request pack may be prepared once the escalation context is complete. Final sign-off waits for Approved.</span></label>`:'';
  const inputPolicy=`<div class="decision-source-check"><button type="button" class="btn btn-xs ${state.verificationByKey?.[`clause-source-${cid}`]==='confirmed'?'btn-secondary':'btn-ghost'}" data-action="verify-clause-source">${state.verificationByKey?.[`clause-source-${cid}`]==='confirmed'?'Source verified ✓':'Verify decision against source'}</button><span class="mini">A decision alone does not mark this clause reviewed.</span></div>${d.type==='need-input'?`<label class="decision-checkbox"><input id="decisionBlocksApprovalCheckbox" type="checkbox" ${d.blocksApproval!==false?'checked':''}> <span>This input blocks approval and final sign-off</span></label>`:''}`;
  const legalActive=d.type==='accept-with-changes'?'seek-amendment':d.type;
  return `<div class="decision-card"><div class="decision-card-topline"><div><div class="mini-label">Legal decision</div><strong>${escapeHtml(currentLabel)}</strong></div><button type="button" class="btn btn-xs btn-ghost decision-card-collapse" data-action="toggle-decision-collapse">${state.mobileDecisionCollapsed&&isMobileViewport()?'Choose / edit':'Collapse'}</button></div><div class="decision-choice-group" aria-label="Legal decision">${legalOpts.map(([key,label])=>`<button type="button" aria-pressed="${legalActive===key?'true':'false'}" class="decision-chip ${legalActive===key?'active':''}" data-action="set-decision" data-decision-type="${key}">${escapeHtml(label)}</button>`).join('')}</div><div class="workflow-choice-group"><span>Need someone else?</span>${workflowOpts.map(([key,label])=>`<button type="button" aria-pressed="${d.type===key?'true':'false'}" class="decision-chip workflow ${d.type===key?'active':''}" data-action="set-decision" data-decision-type="${key}">${escapeHtml(label)}</button>`).join('')}</div><div class="decision-card-meta"><span class="decision-pill">${escapeHtml(risk)} risk</span><span class="decision-pill">${escapeHtml(state.reviewPriorityScores?.[cid]||'Low')} priority</span><span class="decision-pill">${d.route?`Route: ${escapeHtml(d.route)}`:`Suggested: ${escapeHtml(suggestedRoute)}`}</span></div>${!completion.complete?`<ul class="decision-required-list">${completion.missing.map(item=>`<li>${escapeHtml(item)} required</li>`).join('')}</ul>`:`<div class="decision-helper">Decision complete. ${escapeHtml(d.nextAction||'Move to the next clause.')}</div>`}<div class="decision-card-fields">${decisionRequiresRationale(d.type)?`<label><span>Rationale</span><textarea id="decisionRationaleInput" placeholder="Why are we taking this position?">${escapeHtml(d.rationale||'')}</textarea></label>`:''}${decisionRequiresFallback(d.type)?`<label><span>Opening ask</span><textarea id="decisionOpeningAskInput" placeholder="Opening ask or first position">${escapeHtml(d.openingAsk||'')}</textarea></label><label><span>Fallback</span><textarea id="decisionFallbackInput" placeholder="Fallback or compromise position">${escapeHtml(d.fallback||'')}</textarea></label>`:''}${decisionRequiresRoute(d.type)?`<label><span>Route</span><select id="decisionRouteSelect"><option value="">Select route…</option>${ROUTING_TAG_OPTIONS.map(o=>`<option value="${escapeHtml(o)}" ${o===d.route?'selected':''}>${escapeHtml(o)}</option>`).join('')}</select><span class="mini">Suggested: ${escapeHtml(suggestedRoute)}</span></label>`:''}<label><span>Priority</span><select id="decisionPrioritySelect"><option value="high" ${d.priority==='high'?'selected':''}>High</option><option value="medium" ${(!d.priority||d.priority==='medium')?'selected':''}>Medium</option><option value="low" ${d.priority==='low'?'selected':''}>Low</option></select></label><label class="decision-checkbox"><input id="decisionIncludePackCheckbox" type="checkbox" ${d.includeInPack?'checked':''}> <span>Include in negotiation pack</span></label>${decisionRequiresOwner(d.type)?`<label><span>Owner</span><input id="decisionOwnerInput" type="text" value="${escapeHtml(d.owner||'')}" placeholder="Who owns the escalation?"></label>`:''}${decisionRequiresQuestion(d.type)?`<label><span>Question / ask</span><textarea id="decisionQuestionInput" placeholder="What input do you need?">${escapeHtml(d.question||'')}</textarea></label>`:''}${escalationWorkflow}${inputPolicy}</div></div>`;
}
function renderClientShareControl(cid){const share=state.clauseAudienceSharing?.[cid]||{};if(share.client!==true&&getActiveWorkflowStage()!=='close')return'';return `<div class="client-share-control"><div class="panel-subhead">External wording gate</div><label class="decision-checkbox"><input id="decisionShareClientCheckbox" type="checkbox" ${share.client===true?'checked':''}> <span>Prepare this clause for client / counterparty output</span></label>${share.client===true?`<label class="drafting-field"><span>Lawyer-authored external wording</span><textarea id="decisionExternalSummaryInput" placeholder="Write the exact wording that may be shared externally. Internal notes, risk narratives and fallbacks are never copied here automatically.">${escapeHtml(share.summary||'')}</textarea></label><label class="decision-checkbox"><input id="decisionExternalSummaryApproved" type="checkbox" ${share.summaryApproved===true&&String(share.summary||'').trim()?'checked':''}> <span>I have reviewed and approve this wording for external output</span></label>`:''}<div class="mini">A client-facing report includes this item only when both the wording and approval are present.</div></div>`;}
function renderDecisionCard(clause){return `${renderDecisionCardBase(clause)}${renderClientShareControl(clause.id)}`;}
function recomputeOpenLoops(){ const reviewable=getReviewableClauses(); const sig=JSON.stringify(reviewable.map(c=>{ const d=getClauseDecision(c.id); return [c.id,d.type||"",d.fallback||"",d.route||"",d.owner||"",d.question||"",d.blocksApproval!==false,state.clauseApprovalStatus?.[c.id]||d.approvalStatus||""]; })); state.memoCache=state.memoCache||{}; if(state.memoCache.openLoopsSig===sig && Array.isArray(state.memoCache.openLoopsValue)){ state.openLoops=state.memoCache.openLoopsValue.map(x=>({...x})); recomputeReadiness(); return; }
  const loops=[];
  reviewable.forEach(clause=>{
    const cid=clause.id;
    const d=getClauseDecision(cid);
    if(!d.type) loops.push({id:`loop-${cid}-decision`, clauseId:cid, type:'missing-decision', priority:'completion', blocksApprovalRequest:true,blocksFinalSignoff:true});
    if(decisionRequiresFallback(d.type) && !String(d.fallback||'').trim()) loops.push({id:`loop-${cid}-fallback`, clauseId:cid, type:'missing-fallback', priority:'high',blocksApprovalRequest:true,blocksFinalSignoff:true});
    if(d.type==='need-input') loops.push({id:`loop-${cid}-input`, clauseId:cid, type:'awaiting-input', priority:'medium',blocksApprovalRequest:d.blocksApproval!==false,blocksFinalSignoff:true});
    if(d.type==='escalate'){
      const approvalStatus=String(state.clauseApprovalStatus?.[cid]||d.approvalStatus||'Raised');
      if(approvalStatus!=='Approved')loops.push({id:`loop-${cid}-escalation`, clauseId:cid, type:'escalation-open', priority:'high',approvalStatus,blocksApprovalRequest:false,blocksFinalSignoff:true});
    }
  });
  state.openLoops=loops;
  recomputeReadiness();
}
function recomputeReadiness(){
  const clauses=getReviewableClauses();
  const decided=clauses.filter(c=>!!getClauseDecision(c.id).type).length;
  const approvalRequestBlockers=(state.openLoops||[]).filter(loop=>loop.blocksApprovalRequest===true);
  const finalSignoffBlockers=(state.openLoops||[]).filter(loop=>loop.blocksFinalSignoff===true);
  const incompleteContested=clauses.filter(c=>{ const d=getClauseDecision(c.id); return ['accept-with-changes','seek-amendment','reject','escalate','need-input'].includes(d.type) && !getDecisionCompletionState(c.id).complete; });
  const incompleteLoops=incompleteContested.map(c=>({id:`incomplete-${c.id}`, clauseId:c.id, type:'incomplete-decision',blocksApprovalRequest:true,blocksFinalSignoff:true}));
  const completion=clauses.map(c=>({clause:c,...getClauseCompletionState(c.id)}));
  const unverified=completion.filter(item=>!item.reviewComplete).map(item=>({id:`unverified-${item.clause.id}`,clauseId:item.clause.id,type:item.decisionComplete?'source-not-verified':'review-incomplete',blocksApprovalRequest:true,blocksFinalSignoff:true}));
  const negotiationOpen=completion.filter(item=>!item.negotiationResolved).map(item=>({id:`negotiation-${item.clause.id}`,clauseId:item.clause.id,type:'negotiation-open',blocksApprovalRequest:false,blocksFinalSignoff:true}));
  const approvalRequestReady=decided===clauses.length&&clauses.length>0&&!approvalRequestBlockers.length&&!incompleteLoops.length&&!unverified.length;
  const finalSignoffReady=approvalRequestReady&&!finalSignoffBlockers.length&&!negotiationOpen.length;
  const status=finalSignoffReady?'ready':approvalRequestReady?'caution':'blocked';
  state.readiness={status,reviewComplete:unverified.length===0,approvalReady:approvalRequestReady,executionReady:finalSignoffReady,blockers:[...new Map([...finalSignoffBlockers,...incompleteLoops,...unverified,...negotiationOpen].map(item=>[item.id,item])).values()],approvalRequestBlockers:[...approvalRequestBlockers,...incompleteLoops,...unverified],finalSignoffBlockers:[...finalSignoffBlockers,...incompleteLoops,...unverified,...negotiationOpen],approvalRequestReady,finalSignoffReady,reviewedCount:completion.filter(i=>i.reviewComplete).length,decidedCount:decided,totalCount:clauses.length};
}
function getQueueFilteredClauses(){
  const clauses=getFilteredClauses({content:'all',review:'all'}).filter(isReviewableClause);
  switch(state.queuePreset){
    case 'needs-decision': return clauses.filter(c=>!getClauseDecision(c.id).type);
    case 'high-risk': return clauses.filter(c=>(state.clauseRiskScores?.[c.id]||'')==='High');
    case 'needs-fallback': return clauses.filter(c=>{ const d=getClauseDecision(c.id); return ['seek-amendment','reject'].includes(d.type) && !String(d.fallback||'').trim(); });
    case 'awaiting-input': return clauses.filter(c=>getClauseDecision(c.id).type==='need-input');
    case 'escalations': return clauses.filter(c=>getClauseDecision(c.id).type==='escalate'&&String(state.clauseApprovalStatus?.[c.id]||'')!=='Approved');
    case 'decided': return clauses.filter(c=>!!getClauseDecision(c.id).type);
    default: return clauses;
  }
}
function getQueueCountSignature(){return JSON.stringify(getReviewableClauses().map(c=>{const d=getClauseDecision(c.id);return [c.id,state.clauseRiskScores?.[c.id]||'',d.type,d.fallback];}));}
function getQueueCounts(){
  const signature=getQueueCountSignature();
  if(memoCache.queueCounts.signature===signature && memoCache.queueCounts.value) return memoCache.queueCounts.value;
  const clauses=getReviewableClauses();
  const counts={
    'needs-decision': clauses.filter(c=>!getClauseDecision(c.id).type).length,
    'high-risk': clauses.filter(c=>(state.clauseRiskScores?.[c.id]||'')==='High').length,
    'needs-fallback': clauses.filter(c=>{const d=getClauseDecision(c.id); return ['seek-amendment','reject'].includes(d.type) && !String(d.fallback||'').trim();}).length,
    'awaiting-input': clauses.filter(c=>getClauseDecision(c.id).type==='need-input').length,
    'escalations': clauses.filter(c=>getClauseDecision(c.id).type==='escalate'&&String(state.clauseApprovalStatus?.[c.id]||'')!=='Approved').length,
    'decided': clauses.filter(c=>!!getClauseDecision(c.id).type).length
  };
  memoCache.queueCounts={signature,value:counts};
  return counts;
}
function renderQueueBar(){
  if(!els.queueBar) return;
  const counts=getQueueCounts();
  els.queueBar.querySelectorAll('.queue-chip').forEach(btn=>{
    const key=btn.dataset.queue;
    const count=counts[key]||0;
    const label=btn.dataset.baseLabel||btn.textContent.split('<')[0].trim()||btn.textContent.trim();
    btn.classList.toggle('active', key===state.queuePreset);
    btn.innerHTML=`${escapeHtml(label)} <span class="nav-count">${count}</span>`;
    btn.setAttribute('aria-label',`${label}: ${count} in this matter`);
    btn.title='Count across all reviewable clauses in this matter';
  });
}

function renderContextPanel(){
  if(!els.contextPanelBody) return;
  recomputeOpenLoops();
  const stage=getActiveWorkflowStage();
  const rightPanel=els.contextPanelBody.closest('.right-panel');
  if(rightPanel)rightPanel.dataset.workflowStage=stage;
  const selected=getSelectedClause?.();
  if(els.contextPanelModeLabel) els.contextPanelModeLabel.textContent=stage.charAt(0).toUpperCase()+stage.slice(1);
  let title='Decision Context';
  let body='';
  if(stage==='intake'){
    title='Analysis Summary';
    body = renderIntakeContext();
  } else if(stage==='prepare'){
    title='Resolve Open Points';
    body = renderPrepareContext();
  } else if(stage==='close'){
    title='Export & Handoff';
    body = renderCloseContext();
  } else {
    title='Review Context';
    body = renderDecisionContext(selected);
  }
  if(els.contextPanelTitle) els.contextPanelTitle.textContent=title;
  els.contextPanelBody.innerHTML=body;
  if (els.contextUtilitiesDrawer) {
    els.contextUtilitiesDrawer.classList.remove('hidden');
    const utilities=stage==='intake'?[['summary','Contract facts'],['review','Structural checks'],['strategy','Playbook']]:stage==='decide'?[['review','Terms & references'],['strategy','Playbook'],['notes','Notes']]:stage==='prepare'?[['strategy','Negotiation state'],['review','Open issues'],['notes','Working notes']]:[['summary','Handoff readiness'],['review','Audit evidence'],['notes','Notes']];
    els.contextUtilitiesDrawer.innerHTML = `<div class="mini-label">Stage tools</div><div class="context-actions">${utilities.map(([tab,label])=>`<button class="btn btn-xs" type="button" data-context-utility="${tab}">${escapeHtml(label)}</button>`).join('')}</div>`;
  }
  els.toolTabs?.classList.remove('hidden');
  els.strategyPanel?.closest('.right-panel')?.classList.remove('legacy-hidden');
}
function renderIntakeContext(){
  const matter=getMatterDetails ? getMatterDetails() : {};
  const missing=state.expectedClauseCoverage?.missing || [];
  return `<div class="context-summary-grid"><div class="context-summary-card"><span class="label">Contract type</span><strong>${escapeHtml(state.contractType||'Custom')}</strong></div><div class="context-summary-card"><span class="label">Clauses</span><strong>${String((state.clauses||[]).length)}</strong></div><div class="context-summary-card"><span class="label">High-risk flags</span><strong>${String(getIssueCounts?.().highRisk||0)}</strong></div><div class="context-summary-card"><span class="label">Missing standards</span><strong>${String(missing.length)}</strong></div></div><ul class="context-list"><li>Counterparty: ${escapeHtml(matter.counterparty||'Not set')}</li><li>Jurisdiction: ${escapeHtml(matter.jurisdiction||'Not set')}</li><li>Role: ${escapeHtml(matter.role||'Not set')}</li><li>Risk appetite: ${escapeHtml(matter.riskAppetite||'Medium')}</li></ul><div class="context-actions"><button class="btn btn-primary btn-sm" type="button" data-stage-jump="decide">Start decisions</button><button class="btn btn-sm" type="button" data-context-utility="summary">Open overview</button></div>`;
}


function deriveObjectiveExposure(clause){
const type=String(clause?.type||'General');
if(['Indemnity','Liability','Termination','Governing Law','Intellectual Property','Data Protection','Warranty'].includes(type)) return 'high';
if(['Audit','Assignment','Dispute Resolution','Fees','Services','Insurance','Compliance'].includes(type)) return 'medium';
return 'low';
}
function deriveDeviationLevel(clause){
const match=getBestLibraryMatchForClause ? getBestLibraryMatchForClause(clause) : null;
if(!match || typeof match.score!=='number') return 'unknown';
if(match.score>=0.75) return 'low';
if(match.score>=0.4) return 'medium';
return 'high';
}
function deriveReadinessImpact(clause){
const cid=clause?.id;
const d=getClauseDecision(cid);
if(['escalate'].includes(d.type)) return 'blocker';
if(['seek-amendment','reject','need-input'].includes(d.type)) return getDecisionCompletionState(cid).complete ? 'caution' : 'blocker';
return 'none';
}
function buildClauseDependencyHints(clause){
const refs=extractReferenceCandidates(clause?.body||'').slice(0,4);
return refs.map(ref=>({label:ref.raw,target:resolveReferenceTarget(ref.raw,state.clauses||[]),sourceStart:ref.start,sourceEnd:ref.end}));
}

function renderDecisionContext(clause){
  if(!clause || clause.id===OVERVIEW_ID){
    return `<div class="mini">Select a clause from the queue to start decisions.</div><div class="context-actions"><button class="btn btn-primary btn-sm" type="button" data-stage-jump="decide">Decide next clause</button></div>`;
  }
  const d=getClauseDecision(clause.id);
  const risk=state.clauseRiskScores?.[clause.id] || 'Low';
  const loops=(state.openLoops||[]).filter(loop=>loop.clauseId===clause.id);
  const completion=getDecisionCompletionState(clause.id);
  const history=(state.reviewLog||[]).filter(item=>item.clauseId===clause.id && item.action==='decision-updated').slice(-3).reverse();
  const issueCard=deriveIssueCard(clause)||{};
  const objective=deriveObjectiveExposure(clause);
  const deviation=deriveDeviationLevel(clause);
  const readinessImpact=deriveReadinessImpact(clause);
  const deps=buildClauseDependencyHints(clause);
  return `<div class="context-summary-grid"><div class="context-summary-card"><span class="label">Clause</span><strong>${escapeHtml(clause.number||'')} ${escapeHtml(clause.heading||'Untitled')}</strong></div><div class="context-summary-card"><span class="label">Inherent risk</span><strong>${escapeHtml(risk)}</strong></div><div class="context-summary-card"><span class="label">Exposure</span><strong>${escapeHtml(objective)}</strong></div><div class="context-summary-card"><span class="label">Deviation</span><strong>${escapeHtml(deviation)}</strong></div></div><div class="context-summary-grid"><div class="context-summary-card"><span class="label">Decision</span><strong>${escapeHtml(d.type||'Not decided')}</strong></div><div class="context-summary-card"><span class="label">Readiness impact</span><strong>${escapeHtml(readinessImpact)}</strong></div><div class="context-summary-card"><span class="label">Open loops</span><strong>${String(loops.length)}</strong></div><div class="context-summary-card"><span class="label">Status</span><strong>${escapeHtml(d.status||'Open')}</strong></div></div>${!completion.complete?`<div class="context-danger">Missing: ${escapeHtml(completion.missing.join(' • '))}</div>`:`<div class="context-warning">Decision complete. ${escapeHtml(d.nextAction||'Move to the next clause.')}</div>`}<ul class="context-list"><li><strong>Why it matters:</strong> ${escapeHtml(issueCard.riskSummary||state.clauseRiskNarratives?.[clause.id]||'No issue summary captured yet.')}</li><li><strong>Route:</strong> ${escapeHtml(d.route||getDefaultRouteForClause(clause.id)||'Legal Only')}</li><li><strong>Fallback:</strong> ${escapeHtml(d.fallback||state.clauseFallbacks?.[clause.id]||'Not captured')}</li><li><strong>Next action:</strong> ${escapeHtml(d.nextAction||'Capture a decision')}</li></ul>${deps.length?`<div class="tool-card compact context-dependency-card"><div class="panel-subhead">Dependencies</div><div class="summary-list">${deps.map(dep=>`<div class="summary-item"><div><strong>${escapeHtml(dep.label)}</strong><div class="summary-meta">${escapeHtml(dep.target?.heading||'Referenced clause not resolved')}</div></div></div>`).join('')}</div></div>`:''}<div class="context-decision-history">${history.length?history.map(item=>`<div class="history-item"><strong>${escapeHtml(formatShortDateTime(item.at)||'')}</strong><div class="mini">${escapeHtml(item.details?.summary||item.action)}</div></div>`).join(''):'<div class="history-item"><div class="mini">No decision history yet.</div></div>'}</div>`;
}

const memoCache={queueCounts:{signature:'',value:null},preparePack:{signature:'',value:null}};
function getPreparePackSignature(){return JSON.stringify((state.clauses||[]).filter(c=>c.id!==OVERVIEW_ID).map(c=>{const d=getClauseDecision(c.id);return [c.id,c.type,state.clauseRiskScores?.[c.id]||'',d.type,d.fallback,d.route,d.priority,d.includeInPack];}));}
function buildPreparePackItems(){
  const signature=getPreparePackSignature();
  if(memoCache.preparePack.signature===signature && memoCache.preparePack.value) return memoCache.preparePack.value;
  const clauses=getReviewableClauses();
  const items = clauses.map(clause=>{
    const d=getClauseDecision(clause.id);
    const completion=getDecisionCompletionState(clause.id);
    const card=deriveIssueCard(clause)||{};
    const issue=card.riskSummary||state.clauseRiskNarratives?.[clause.id]||card.theme||'No issue summary captured';
    const priority=d.priority||(((state.clauseRiskScores?.[clause.id]||'Low')==='High')?'high':'medium');
    const include=!!(d.includeInPack || ['accept-with-changes','seek-amendment','reject','escalate','need-input'].includes(d.type));
    return {clause,d,completion,issue,priority,include,theme:(inferNegotiationTheme?inferNegotiationTheme(clause):clause.type)||'General'};
  }).filter(item=>item.include);
  memoCache.preparePack={signature,value:items};
  return items;
}

function groupPreparePackItems(mode='priority'){
  const items=buildPreparePackItems();
  const groups={};
  items.forEach(item=>{
    const key=mode==='theme'?(item.theme||'General'):(item.priority||'medium');
    (groups[key]||(groups[key]=[])).push(item);
  });
  const order=mode==='theme'?Object.keys(groups).sort():['high','medium','low'];
  return order.filter(k=>groups[k]?.length).map(k=>[k,groups[k]]);
}


function buildBusinessSummaryTxt() {
  const matter = getMatterDetails();
  const fileName = state.documentMeta.fileName || 'this contract';
  const contractType = state.contractType || 'agreement';
  const counterparty = matter.counterparty || 'the counterparty';
  const role = matter.role || 'our organisation';
  const lines = ['INTERNAL BUSINESS SUMMARY', 'Audience: Internal Business', '', `Document: ${fileName}`, `Type: ${contractType}`, `Counterparty: ${counterparty}`, `Our role: ${role}`, `Overall risk: ${state.documentRisk || 'Low'}`, ''];
  const terms = extractCommercialTermsSummary();
  lines.push('WHAT THIS CONTRACT DOES', '');
  if (terms.initialTerm && terms.initialTerm !== 'Not detected') lines.push(`This is a ${contractType} between ${role} and ${counterparty}. The initial term is ${terms.initialTerm}.`);
  else lines.push(`This is a ${contractType} between ${role} and ${counterparty}.`);
  if (terms.paymentTerms && terms.paymentTerms !== 'Not detected') lines.push(`Payment: ${terms.paymentTerms}.`);
  if (terms.renewal && terms.renewal !== 'Not detected') lines.push(`Renewal: ${terms.renewal}.`);
  lines.push('');
  const businessItems = buildPreparePackItems().filter(item => /Business/i.test(item.d.route || '') || item.d.type === 'escalate' || item.priority === 'high').slice(0, 8);
  lines.push('KEY POINTS REQUIRING YOUR ATTENTION', '');
  if (!businessItems.length) lines.push('No items currently flagged for business attention.');
  else businessItems.forEach((item, i) => { const posLabel = {'accept':'We are comfortable accepting this','accept-with-changes':'We can accept this with some changes','seek-amendment':'We need to negotiate changes here','reject':'This is not acceptable in its current form','escalate':'This needs leadership approval','need-input':'We need your input on this point'}[item.d.type || ''] || 'Under review'; lines.push(`${i + 1}. ${item.clause.heading || item.clause.number || 'Clause'}`); lines.push(`   ${item.issue}`); lines.push(`   Our position: ${posLabel}.`); if (item.d.question) lines.push(`   Question for you: ${item.d.question}`); lines.push(''); });
  const signing = computeSigningReadinessChecks();
  lines.push('WHERE THINGS STAND', '');
  lines.push(`Review status: ${signing.level}`);
  const blockers = signing.checks.filter(c => !c.ok);
  if (blockers.length) { lines.push('Still to resolve:'); blockers.forEach(b => lines.push(`- ${b.label}${b.count ? ` (${b.count})` : ''}`)); }
  else lines.push('All review checks are complete. The contract is ready for sign-off.');
  return lines.join('\n');
}
function buildLeadershipEscalationTxt(){
  const items=buildPreparePackItems().filter(item=>item.d.type==='escalate' || /leadership/i.test(item.d.route||'') || item.priority==='high');
  if(!items.length) return 'No leadership escalations captured.';
  return `INTERNAL LEADERSHIP ESCALATION PACK\nAudience: Internal Leadership\n\n${items.map(item=>`${item.clause.number||''} ${item.clause.heading||'Untitled'}\nIssue: ${item.issue}\nDecision: ${item.d.type||'not decided'}\nFallback: ${item.d.fallback||'Not captured'}\nOwner: ${item.d.owner||item.d.route||'Not assigned'}\n`).join('\n---\n')}`;
}
function buildCallAgendaTxt(){
  const rank={high:3,medium:2,low:1};
  const items=buildPreparePackItems().sort((a,b)=>(rank[b.priority||'medium']||2)-(rank[a.priority||'medium']||2)).slice(0,10);
  if(!items.length) return 'No live negotiation agenda items.';
  return `INTERNAL NEGOTIATION PREP\nAudience: Internal Legal\n\n${items.map((item,idx)=>`${idx+1}. ${item.clause.number||''} ${item.clause.heading||'Untitled'} — ${item.d.type||'not decided'}${item.d.fallback?` | Fallback: ${item.d.fallback}`:''}`).join('\n')}`;
}
function renderStakeholderPackCards(){
  const businessCount=buildPreparePackItems().filter(item=>/Business/i.test(item.d.route||'')).length;
  const leadershipCount=buildPreparePackItems().filter(item=>item.d.type==='escalate' || /leadership/i.test(item.d.route||'')).length;
  const approvalCount=buildPreparePackItems().filter(item=>item.d.type && item.d.type!=='accept').length;
  return `<div class="prepare-grid two-up">
    <div class="tool-card compact"><h4>Business summary</h4><div class="mini">Internal commercial audience • ${businessCount} item${businessCount===1?'':'s'} routed or commercially material.</div><div class="card-actions"><button class="btn btn-xs" type="button" data-export-action="business">Preview</button><button class="btn btn-xs" type="button" data-copy-action="business">Copy</button></div></div>
    <div class="tool-card compact"><h4>Leadership escalation pack</h4><div class="mini">Internal leadership • ${leadershipCount} escalation / leadership-sensitive item${leadershipCount===1?'':'s'}.</div><div class="card-actions"><button class="btn btn-xs" type="button" data-export-action="leadership">Preview</button><button class="btn btn-xs" type="button" data-copy-action="leadership">Copy</button></div></div>
    <div class="tool-card compact"><h4>Approval pack</h4><div class="mini">Internal approvers • ${approvalCount} contested clause${approvalCount===1?'':'s'} to summarize.</div><div class="card-actions"><button class="btn btn-xs" type="button" data-export-action="approval">Preview</button><button class="btn btn-xs" type="button" data-copy-action="approval">Copy</button></div></div>
    <div class="tool-card compact"><h4>Internal negotiation prep</h4><div class="mini">Internal legal • ranked asks and fallbacks for the next counterparty call. This is not a client-facing agenda.</div><div class="card-actions"><button class="btn btn-xs" type="button" data-export-action="agenda">Preview</button><button class="btn btn-xs" type="button" data-copy-action="agenda">Copy</button></div></div>
  </div>`;
}
function renderHandoffReadinessCard(){
  const checks=getWordHandoffChecks();const open=checks.reduce((sum,item)=>sum+Number(item.count||0),0);const items=getWordHandoffItems().length;
  return `<div class="tool-card compact handoff-readiness-card ${open?'caution':'ready'}"><div class="panel-subhead">Word drafting handoff</div><div class="mini">${items} clause${items===1?'':'s'} selected • ${open} preflight item${open===1?'':'s'} still open. Open items do not block export, but they remain visible in the handoff.</div><div class="handoff-check-grid">${checks.map(check=>`<div class="handoff-check ${check.count?'open':'clear'}"><strong>${check.count}</strong><span>${escapeHtml(check.label)}</span></div>`).join('')}</div><div class="card-actions"><button class="btn btn-primary btn-sm" type="button" data-export-action="word-handoff">Preview handoff</button><button class="btn btn-sm" type="button" data-export-action="evidence-ledger">Evidence ledger</button></div></div>`;
}
function renderPreparePackSection(mode='priority'){
  const groups=groupPreparePackItems(mode);
  if(!groups.length) return `<div class="tool-card compact"><h4>Negotiation pack</h4><div class="mini">No clauses are currently marked for pack inclusion.</div></div>`;
  return `<div class="tool-card compact"><div class="panel-subhead">Negotiation pack</div><div class="dashboard-actions compact"><button type="button" class="sub-pill ${mode==='priority'?'active':''}" data-prepare-group="priority">By priority</button><button type="button" class="sub-pill ${mode==='theme'?'active':''}" data-prepare-group="theme">By theme</button></div>${groups.map(([group,items])=>`<details class="prepare-pack-group" open><summary>${escapeHtml(group.charAt(0).toUpperCase()+group.slice(1))} (${items.length})</summary><div class="summary-list">${items.map(item=>`<div class="summary-item"><div><strong>${escapeHtml(item.clause.number||'')}</strong> ${escapeHtml(item.clause.heading||'Untitled')}<div class="summary-meta">${escapeHtml(item.issue)} • ${escapeHtml(item.d.type||'not decided')} • ${escapeHtml(item.d.route||'Legal Only')}</div>${item.d.fallback?`<div class="mini"><strong>Fallback:</strong> ${escapeHtml(truncateWords(item.d.fallback,18))}</div>`:''}</div><div class="card-actions"><button class="btn btn-xs jump-clause" type="button" data-clause-id="${escapeHtml(item.clause.id)}">Open</button><button class="btn btn-xs" type="button" data-toggle-pack="${escapeHtml(item.clause.id)}">${item.d.includeInPack?'Included':'Include'}</button></div></div>`).join('')}</div></details>`).join('')}<div class="card-actions"><button class="btn btn-primary btn-sm" type="button" data-export-action="pack">Preview pack</button><button class="btn btn-sm" type="button" data-copy-action="pack">Copy pack</button></div></div>`;
}
function renderPrepareOpenLoopsDashboard(){
  const loops=state.openLoops||[];
  const groups={
    'Escalations': loops.filter(l=>l.type==='escalation-open'),
    'Awaiting input': loops.filter(l=>l.type==='awaiting-input'),
    'Missing fallback': loops.filter(l=>l.type==='missing-fallback'),
    'Missing decisions': loops.filter(l=>l.type==='missing-decision')
  };
  return `<div class="tool-card compact"><div class="panel-subhead">Open loops dashboard</div><div class="prepare-grid two-up">${Object.entries(groups).map(([label,items])=>`<div class="open-loop-block"><div class="mini-label">${escapeHtml(label)}</div><div class="open-loop-count">${items.length}</div>${items.length?`<div class="summary-list">${items.slice(0,4).map(loop=>`<button type="button" class="summary-item jump-clause" data-clause-id="${escapeHtml(loop.clauseId)}">${escapeHtml((state.clauses||[]).find(c=>c.id===loop.clauseId)?.heading||loop.clauseId)}</button>`).join('')}</div>`:'<div class="mini">None.</div>'}</div>`).join('')}</div></div>`;
}

function renderPrepareContext(){
  const loops=state.openLoops||[];
  const escalations=loops.filter(l=>l.type==='escalation-open').length;
  const awaiting=loops.filter(l=>l.type==='awaiting-input').length;
  const mode=state.prepareGroupMode||'priority';
  return `${renderPrepareOpenLoopsDashboard()}<div class="context-summary-grid"><div class="context-summary-card"><span class="label">Open loops</span><strong>${String(loops.length)}</strong></div><div class="context-summary-card"><span class="label">Escalations</span><strong>${String(escalations)}</strong></div><div class="context-summary-card"><span class="label">Awaiting input</span><strong>${String(awaiting)}</strong></div><div class="context-summary-card"><span class="label">Pack items</span><strong>${String(buildPreparePackItems().length)}</strong></div></div>${renderPreparePackSection(mode)}${renderHandoffReadinessCard()}${renderStakeholderPackCards()}<div class="context-actions"><button class="btn btn-primary btn-sm" type="button" data-stage-jump="close">Move to close</button><button class="btn btn-sm" type="button" data-context-utility="strategy">Open negotiation workspace</button></div>`;
}
function renderCloseContext(){
  const ready=state.readiness||{status:'blocked',blockers:[],decidedCount:0,totalCount:0};
  const blockers=(ready.blockers||[]).filter(loop=>['missing-decision','missing-fallback','escalation-open'].includes(loop.type));
  const cautions=(ready.blockers||[]).filter(loop=>!['missing-decision','missing-fallback','escalation-open'].includes(loop.type));
  return `<div class="context-summary-grid"><div class="context-summary-card"><span class="label">Readiness</span><strong>${escapeHtml((ready.status||'blocked').toUpperCase())}</strong></div><div class="context-summary-card"><span class="label">Decisions</span><strong>${ready.decidedCount||0}/${ready.totalCount||0}</strong></div><div class="context-summary-card"><span class="label">Blockers</span><strong>${blockers.length}</strong></div><div class="context-summary-card"><span class="label">Cautions</span><strong>${cautions.length}</strong></div></div>${renderExecutionCheckCard()}<div class="tool-card compact readiness-card ${escapeHtml(ready.status||'blocked')}"><h4>Closure guidance</h4><div class="mini">${ready.status==='ready'?'Ready for client discussion or internal sign-off.' : ready.status==='caution'?'Most decisions are captured but some internal follow-up remains.' : 'Not ready. Resolve blockers before moving forward.'}</div>${blockers.length?`<div class="panel-subhead">Blockers</div><ul class="context-list">${blockers.slice(0,6).map(loop=>`<li>${escapeHtml(loop.type)} — ${escapeHtml((state.clauses||[]).find(c=>c.id===loop.clauseId)?.heading||loop.clauseId)}</li>`).join('')}</ul>`:''}${cautions.length?`<div class="panel-subhead">Caution</div><ul class="context-list">${cautions.slice(0,6).map(loop=>`<li>${escapeHtml(loop.type)} — ${escapeHtml((state.clauses||[]).find(c=>c.id===loop.clauseId)?.heading||loop.clauseId)}</li>`).join('')}</ul>`:''}</div>${renderHandoffReadinessCard()}${renderStakeholderPackCards()}<div class="context-actions"><button class="btn btn-primary btn-sm" type="button" data-export-action="approval">Approval pack</button><button class="btn btn-sm" type="button" data-export-action="business">Business summary</button><button class="btn btn-sm" type="button" data-export-action="leadership">Leadership pack</button><button class="btn btn-sm" type="button" data-export-action="agenda">Internal negotiation prep</button></div>`;
}


function exportObligationsICS() {
  const deadlines = state.deadlines || [];
  const parseDateExpression=d=>{const normalized=String(d.expression||'').replace(/^(?:by|on or before|no later than)\s+/i,'').trim();const parsed=new Date(normalized);return isNaN(parsed.getTime())?null:parsed;};
  const parseable = deadlines.map(d=>({d,date:parseDateExpression(d)})).filter(item=>item.date);
  if (!parseable.length) {
    showToast('No fixed calendar dates found. Relative countdowns remain in the obligations scan until their trigger dates are known.', 'info');
    return;
  }
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Contract Cockpit//Contract Obligations//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  parseable.forEach(({d,date:dt}) => {
    const stamp = dt.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const uid = `cockpit-${Date.now()}-${Math.random().toString(36).slice(2)}@contractcockpit`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${stamp.slice(0, 8)}`);
    lines.push(`SUMMARY:${(d.expression || 'Obligation deadline').replace(/[,;\\]/g, '')}`);
    lines.push(`DESCRIPTION:${(d.clauseLabel || '').replace(/[,;\\]/g, '')} — ${(state.documentMeta.fileName || 'Contract').replace(/[,;\\]/g, '')}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const filename = `${safeBaseName(state.documentMeta.fileName || 'contract')}_obligations_${buildDateStamp()}.ics`;
  downloadBlob(filename, new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  showToast(`Exported ${parseable.length} deadline${parseable.length === 1 ? '' : 's'} as calendar file`, 'info');
}

function generateNegotiationScript(cid) {
  const clause = (state.clauses || []).find(c => c.id === cid);
  if (!clause) return '';
  const intel = evaluateClauseIntelligence(clause) || {};
  const decision = getClauseDecision(cid);
  const strategyType = intel.strategyType || getNegotiationStrategyType(clause);
  const pushback = intel.likelyPushback || 'Medium';
  const fallback = decision.fallback || state.clauseFallbacks?.[cid] || '';
  const openingAsk = decision.openingAsk || intel.recommendation || '';
  const theme = intel.theme || clause.type || 'General';
  const SCRIPTS = {
    Redline: { open: `Our standard position on ${theme} is [OPENING ASK]. This is a firm requirement and we cannot accept the current drafting.`, pushbackHigh: `We understand this is a departure from your standard terms. Our position is based on [RATIONALE]. We can discuss the specific language but not the principle.`, pushbackMed: `We appreciate your position, but we need [OPENING ASK]. If that's not workable, our fallback would be [FALLBACK].`, close: `We'd like to resolve this now. Can you confirm whether [OPENING ASK] is acceptable?` },
    Anchor: { open: `On ${theme}, we're starting from [OPENING ASK]. That gives us room to move if you have concerns.`, pushbackHigh: `We anchored high intentionally. We can come to [FALLBACK] if you can give us something on [TRADE SUGGESTION].`, pushbackMed: `What specifically concerns you about our position? We have flexibility on [FALLBACK] if the underlying issue is [THEME].`, close: `Let's land at [FALLBACK] — that works for both sides on ${theme}.` },
    Tradeable: { open: `On ${theme}, we'd prefer [OPENING ASK], but we're open to discussion.`, pushbackHigh: `We can move on this if you can give us something elsewhere — specifically on [TRADE SUGGESTION].`, pushbackMed: `Our fallback on ${theme} would be [FALLBACK]. Does that work for you?`, close: `We're comfortable at [FALLBACK] on ${theme}. Can we agree that and move on?` },
    Concede: { open: `We've reviewed ${theme} and we can accept your drafting, subject to one point: [OPENING ASK].`, pushbackHigh: `We're largely accepting your position. The one thing we need is [OPENING ASK] — it's a practical point, not a legal one.`, pushbackMed: `We'll take your language. Can you just confirm [OPENING ASK]?`, close: `Agreed on ${theme} with that one confirmation.` }
  };
  const script = SCRIPTS[strategyType] || SCRIPTS.Tradeable;
  const fill = s => s.replace('[OPENING ASK]', openingAsk || 'our proposed position').replace('[FALLBACK]', fallback || 'a revised position').replace('[RATIONALE]', decision.rationale || 'our standard risk framework').replace('[THEME]', theme).replace('[TRADE SUGGESTION]', intel.tradeSuggestion || 'the commercial terms');
  const pushbackScript = pushback === 'High' ? script.pushbackHigh : script.pushbackMed;
  return [`NEGOTIATION SCRIPT — ${clause.number || ''} ${clause.heading || ''}`, `Strategy: ${strategyType} | Pushback likelihood: ${pushback}`, '', 'OPENING:', fill(script.open), '', `IF THEY PUSH BACK (${pushback} likelihood):`, fill(pushbackScript), '', 'CLOSING:', fill(script.close)].join('\n');
}

function renderActiveRightPanel(){
  renderContextPanel();
  const a=state.activeTab||'summary';
  if(a==='summary')renderSummaryPanel();else if(a==='review')renderReviewPanel();else if(a==='notes')renderNotesPanel();else if(a==='strategy')renderStrategyPanel();
  updateTabVisibility();
}
function renderCockpitStrip(){
  bumpRenderCount('cockpit');
  if(!els.cockpitStrip) return;
  const hasDoc=!!state.clauses.length;
  els.cockpitStrip.classList.toggle('hidden',!hasDoc);
  if(!hasDoc) return;
  recomputeOpenLoops();
  const clauses=getReviewableClauses();
  const decided=clauses.filter(c=>!!getClauseDecision(c.id).type).length;
  const issueCounts=getIssueCounts();
  const ready=state.readiness||{status:'blocked',blockers:[],decidedCount:0,totalCount:0};
  const sourceDegraded=state.documentMeta?.sourceIntegrity?.status==='degraded';
  const sourceVerified=state.verificationByKey?.['source-integrity']==='confirmed';
  const healthClass='health-'+(sourceDegraded&&!sourceVerified?'needs-work':'strong');
  if(els.cockpitFileVal) els.cockpitFileVal.textContent=sourceDegraded?(sourceVerified?'Verified':'Check'):'Clean';
  if(els.cockpitFileSub) els.cockpitFileSub.textContent=sourceDegraded?'Source boundaries':'Source import';
  const healthTile=els.cockpitFileVal?.closest('.cockpit-tile');
  healthTile?.classList.remove('health-strong','health-good','health-fair','health-needs-work');
  healthTile?.classList.add(healthClass);
  const healthKey=healthTile?.querySelector('.k'); if(healthKey) healthKey.textContent='Source integrity';
  if(healthTile) healthTile.title='Whether recovered clause boundaries need lawyer verification.';
  if(els.cockpitClauseVal) els.cockpitClauseVal.textContent=`${decided}/${clauses.length||0}`;
  if(els.cockpitClauseSub) els.cockpitClauseSub.textContent='Decision progress';
  if(els.cockpitRiskVal) els.cockpitRiskVal.textContent=String(state.documentMeta?.matter?.role||'Neutral')==='Neutral'?`Provisional ${state.documentRisk||'Low'}`:(state.documentRisk||'Low');
  const riskTile=els.cockpitRiskVal?.closest('.cockpit-tile');
  const riskKey=riskTile?.querySelector('.k'); if(riskKey) riskKey.textContent='Legal exposure';
  if(riskTile) riskTile.title='Pattern-based inherent legal exposure estimate. Verify the clause and source context.';
  if(els.cockpitRiskSub){const d=state.riskDistribution||{};els.cockpitRiskSub.textContent=(state.clauses.length||0)?`H ${d.High||0} • M ${d.Medium||0} • L ${d.Low||0} • ${countFlags()} signals`:'Load a contract';}
  if(els.cockpitPriorityVal) els.cockpitPriorityVal.textContent=(ready.status||'blocked').charAt(0).toUpperCase()+(ready.status||'blocked').slice(1);
  if(els.cockpitPrioritySub) els.cockpitPrioritySub.textContent=`${(ready.blockers||[]).length} blockers • ${Math.max(0,(ready.totalCount||0)-(ready.decidedCount||0))} undecided`;
  if(els.cockpitNegotiationVal) els.cockpitNegotiationVal.textContent=String((state.openLoops||[]).length);
  if(els.cockpitNegotiationSub) els.cockpitNegotiationSub.textContent=`Escalations ${(state.openLoops||[]).filter(l=>l.type==='escalation-open').length} • Awaiting ${(state.openLoops||[]).filter(l=>l.type==='awaiting-input').length}`;
  updateCockpitCollapseUI();
}
function updateCockpitCollapseUI() {
  const strip = els.cockpitStrip;
  const bar = document.getElementById('cockpitSummaryBar');
  const btn = document.getElementById('cockpitCollapseBtn');
  if (!strip) return;
  const collapsed = isMobileViewport() || !!state.cockpitCollapsed;
  strip.classList.toggle('cockpit-collapsed', collapsed);
  if (bar) {
    bar.classList.toggle('hidden', !collapsed);
    if (collapsed && state.clauses.length) {
      const reviewable = getReviewableClauses();
      const decided = reviewable.filter(c => !!getClauseDecision(c.id).type).length;
      const total = reviewable.length;
      const loops = (state.openLoops || []).length;
      bar.textContent = `${decided}/${total} decided · ${countFlags()} findings · ${loops} open loop${loops === 1 ? '' : 's'}`;
    }
  }
  if (btn) btn.textContent = collapsed ? '▸' : '▾';
}

function renderHeader(){
  renderAnnunciatorPanel(); updateWorkspaceControls(); recomputeOpenLoops();
  els.docName.textContent=state.documentMeta.fileName||'Untitled';
  const ready=state.readiness||{status:'blocked',blockers:[],decidedCount:0,totalCount:0};
  const base=`${getReviewableClauses().length} reviewable clauses • ${countFlags()} signals • ${ready.decidedCount||0}/${ready.totalCount||0} decided • ${(state.openLoops||[]).length} open loops`;
  els.docMeta.textContent=state.snapshotNotice?`${base} • ${state.snapshotNotice}`:base;
  renderMinimapRail();
  if(els.autosaveStatus){
    const label = state.prefs?.disableAutosave ? 'Autosave off' : (state.autosaveFailed ? 'Autosave failed' : (state.autosavePending ? 'Saving…' : (state.autosaveLastSavedAt ? `Saved ${formatShortTime(state.autosaveLastSavedAt)}` : 'Autosave ready')));
    els.autosaveStatus.textContent = label;
    els.autosaveStatus.classList.toggle('warn', !!state.autosaveFailed);
    els.autosaveStatus.classList.toggle('muted', !!state.prefs?.disableAutosave);
  }
  if (els.reviewProgressMount) {
  if (state.clauses.length) {
    const _reviewable = getReviewableClauses();
    const _reviewed = _reviewable.filter(c => (state.clauseReviewStatus?.[c.id] || '') === 'Reviewed').length;
    const _total = _reviewable.length;
    const _pct = _total ? Math.round((_reviewed / _total) * 100) : 0;
    els.reviewProgressMount.innerHTML = `<div class="review-progress"><div class="review-progress-bar" style="width:${_pct}%"></div><span class="review-progress-label">${_reviewed}/${_total} reviewed</span></div>`;
  } else {
    els.reviewProgressMount.innerHTML = '';
  }
}
  renderQueueBar();
  updateLocalHeaderIndicator();
  updateCockpitCollapseUI();
  updateWorkflowModeUI();
}
function updateWorkflowModeUI(){
  if(!els.workflowModes) return;
  const stage=getActiveWorkflowStage();
  els.workflowModes.classList.toggle('hidden',els.app?.classList.contains('hidden'));
  const reviewable=getReviewableClauses();
  const reviewed=reviewable.filter(c=>(state.clauseReviewStatus?.[c.id]||'')==='Reviewed').length;
  const total=reviewable.length;
  els.workflowTriageBtn?.classList.toggle('active',stage==='intake');
  els.workflowReviewBtn?.classList.toggle('active',stage==='decide');
  els.workflowNegotiateBtn?.classList.toggle('active',stage==='prepare');
  els.workflowOutputsBtn?.classList.toggle('active',stage==='close');
  els.workflowTriageBtn?.setAttribute('aria-pressed', stage==='intake' ? 'true' : 'false');
  els.workflowReviewBtn?.setAttribute('aria-pressed', stage==='decide' ? 'true' : 'false');
  els.workflowNegotiateBtn?.setAttribute('aria-pressed', stage==='prepare' ? 'true' : 'false');
  els.workflowOutputsBtn?.setAttribute('aria-pressed', stage==='close' ? 'true' : 'false');
  els.workflowTriageBtn?.setAttribute('aria-label',`Open focused checks (${countFlags()} signals)`);
  els.workflowReviewBtn?.setAttribute('aria-label',`Open full review (${reviewed}/${total} reviewed)`);
  els.workflowNegotiateBtn?.setAttribute('aria-label',`Switch to Resolve stage (${(state.openLoops||[]).length} open loops)`);
  els.workflowOutputsBtn?.setAttribute('aria-label',`Switch to Export stage (${(state.readiness?.blockers||[]).length||0} blockers)`);
}
function applyWorkflowMode(){
  if(!els.app) return;
  const stage=getActiveWorkflowStage();
  els.app.classList.toggle('workflow-intake',stage==='intake');
  els.app.classList.toggle('workflow-decide',stage==='decide');
  els.app.classList.toggle('workflow-prepare',stage==='prepare');
  els.app.classList.toggle('workflow-close',stage==='close');
  els.app.classList.toggle('workflow-triage',stage==='intake');
  els.app.classList.toggle('workflow-review',stage==='decide');
  els.app.classList.toggle('workflow-negotiate',stage==='prepare');
  els.app.classList.toggle('workflow-outputs',stage==='close');
  updateWorkflowModeUI();
  applyChecksWorkspace();
}
function setWorkflowStage(stage, opts={}){
  state.workflowStage=['intake','decide','prepare','close'].includes(stage)?stage:'decide';
  state.workflowMode=mapStageToLegacyMode(state.workflowStage);
  state.activeTermFilter='';
  state.hudDismissed=false;
  const preserveTab = opts.preserveTab !== false;
  if(state.workflowStage==='intake'){
    state.navigatorMode='triage';
  } else if(state.workflowStage==='decide'){
    if(state.navigatorMode==='triage') state.navigatorMode='outline';
    state.reviewSubSection=state.reviewSubSection||'issues-console';
  } else if(state.workflowStage==='prepare'){
    state.navigatorMode='outline';
    state.strategySubSection=state.strategySubSection||'packages';
  } else if(state.workflowStage==='close'){
    state.strategySubSection='packages';
  }
  const preferredTab=getPreferredTabForStage(state.workflowStage);
  const activeIsValid=TAB_IDS.includes(state.activeTab);
  const shouldSyncTab = !preserveTab || !activeIsValid || state.activeTab==='summary' || (state.workflowStage==='intake' && state.activeTab!=='summary' && state.activeTab!=='notes') || (state.workflowStage==='prepare' && state.activeTab==='review') || (state.workflowStage==='close' && state.activeTab==='strategy');
  if(shouldSyncTab) state.activeTab=preferredTab;
  applyWorkflowMode(); scheduleRerender({header:true,cockpit:true,navigator:true,clause:true,rightPanel:true,restore:true},'workflow-stage'); renderCompatibilityBanner(); renderMinimapRail(); updateMobileUI(); savePrefs(); saveSessionReturn();
}
function setWorkflowMode(mode){ setWorkflowStage(mapLegacyModeToStage(mode), {preserveTab:false}); }
function syncMobileViewToActiveTab(){
  if(!isMobileViewport()) return;
  if(!els.mobileToolLauncher?.classList.contains('hidden')){ state.mobileView='packs'; return; }
  if(els.app?.classList.contains('mobile-left-open')){ state.mobileView='queue'; return; }
  if(els.app?.classList.contains('mobile-right-open')){ state.mobileView='packs'; return; }
  state.mobileView='decide';
}
function openMobileToolLauncher(){ if(!isMobileViewport()||!els.mobileToolLauncher) return; closeMobilePanels(); els.mobileToolLauncher.classList.remove('hidden'); setMobileBackdropVisible(true); document.body.classList.add('modal-open'); state.mobileView='packs'; updateMobileUI(); }
function openMobileLeftPanel(){ if(!isMobileViewport()||!els.app) return; els.app.classList.add('mobile-left-open'); els.app.classList.remove('mobile-right-open'); setMobileBackdropVisible(true); state.mobileView='queue'; updateMobileUI(); }
function setMobileView(view){ state.mobileView=view; if(!isMobileViewport()){ updateMobileUI(); return; } if(view==='queue'){ closeMobileToolLauncher(); openMobileLeftPanel(); return; } if(view==='decide'){ closeMobileToolLauncher(); closeMobilePanels(); return; } openMobileToolLauncher(); }
function setMobileWorkflowStage(stage){
  if(!['intake','decide','prepare','close'].includes(stage)) return;
  closeMobilePanels(); closeMobileToolLauncher();
  setWorkflowStage(stage,{preserveTab:false});
  if(stage==='intake'){
    state.selectedClauseId=OVERVIEW_ID;
    state.activeTab='summary';
    renderClauseView(); renderActiveRightPanel();
  } else if(stage==='decide'){
    if(!isReviewableClause(getSelectedClause())){
      const next=getReviewableClauses().find(c=>!getClauseDecision(c.id).type) || getReviewableClauses()[0];
      if(next) safeJumpToClause(next.id,{preserveHistory:true});
    }
  } else if(stage==='prepare'){
    state.activeTab='strategy';
    openMobileRightPanel('strategy');
  } else {
    openExportHubModal();
  }
  updateMobileUI();
}
function updateMobileUI(){ if(!els.mobileBottomNav||!els.app) return; const m=isMobileViewport(); document.body.classList.toggle('mobile-single-pane',m); els.mobileBottomNav.classList.toggle('hidden',!m||els.app.classList.contains('hidden')); syncMobileViewToActiveTab(); if(!m){ els.app.classList.remove('mobile-left-open','mobile-right-open'); setMobileBackdropVisible(false); return; } state.mobileView=state.mobileView||'decide'; const stage=getActiveWorkflowStage(); els.mobileBottomNav.querySelectorAll('.mobile-nav-btn').forEach(b=>{ b.classList.toggle('active',b.dataset.mobileStage===stage); }); document.querySelectorAll('.filter-popover[open]').forEach(m=>m.removeAttribute('open')); }
function handleMobileMenuAction(action){ if(!action) return; if(action==='new'){showLanding();closeMobilePanels();closeMobileToolLauncher();return;} if(action==='theme'){toggleTheme();return;} if(action==='focus'){toggleFocusMode();return;} if(action==='shortcuts'){openShortcutsModal();return;} if(action==='snapshots'){openSnapshotsModal();return;} if(action==='report'||action==='email'||action==='session'){openExportHubModal();return;} if(action==='queue'){closeMobileToolLauncher(); openMobileLeftPanel(); return;} if(action==='decide'){closeMobileToolLauncher(); closeMobilePanels(); return;} if(action==='packs'){closeMobileToolLauncher(); openMobileRightPanel('strategy'); return;} if(TAB_IDS.includes(action)){closeMobileToolLauncher();setActiveTab(action);openMobileRightPanel(action);return;} }

function getBaseFilteredClauses(overrideFilters){
  const q=state.searchQuery;const af=overrideFilters&&typeof overrideFilters==='object'?{content:overrideFilters.content||'all',review:overrideFilters.review||'all'}:(state.filters||{content:'all',review:'all'});
  const mi=getMyInboxInitials();const brIds=new Set((state.issues.crossReferenceBreaks||[]).map(i=>i.clauseId));
  const changedOnly=!!state.compareOnlyMode; const changedSet=getActiveChangedClauseIdSet();
  return state.clauses.filter(c=>{ if(!isReviewableClause(c)) return false; if(changedOnly && !changedSet.has(c.id)) return false;
  const hasN=state.notes.some(n=>n.clauseId===c.id);const hasF=clauseFlagCount(c)>0;const hasT=(state.clauseTags[c.id]||[]).length>0;
  const rs=state.clauseReviewStatus[c.id]||'';const pos=state.clausePositions[c.id]||'';const unrev=!rs||rs==='Not reviewed';const isEsc=rs==='Escalated'||pos==='Escalate';
  const risk=state.clauseRiskScores[c.id]||'Low';const hasIss=hasF||hasT||hasN||risk==='High';const ar=isEsc||risk==='High'||hasIss;
  const hasRI=(state.clauseRoutingTags[c.id]||[]).some(t=>t!=='Legal Only')||(!!mi&&state.notes.some(n=>n.clauseId===c.id&&String(n.owner||'').toUpperCase()===mi&&n.businessCall));
  if(af.content==='notes'&&!hasN)return false;if(af.content==='flagged'&&!hasF)return false;if(af.content==='tagged'&&!hasT)return false;if(af.content==='broken-xrefs'&&!brIds.has(c.id))return false;
  if(af.review==='unreviewed'&&!unrev)return false;if(af.review==='action-required'&&!ar)return false;if(af.review==='escalated'&&!isEsc)return false;if(af.review==='high-risk'&&risk!=='High')return false;if(af.review==='has-issues'&&!hasIss)return false;if(af.review==='my-inbox'&&!hasRI)return false;
  if(!q)return true;
  const termHit=Object.values(state.definedTerms).some(t=>(t.definedInClauseId===c.id||t.usedInClauseIds.includes(c.id))&&t.term.toLowerCase().includes(q));
  const noteHit=state.notes.some(n=>n.clauseId===c.id&&`${n.type} ${n.text}`.toLowerCase().includes(q));
  return `${c.number} ${c.heading} ${c.body}`.toLowerCase().includes(q)||termHit||noteHit||pos.toLowerCase().includes(q)||rs.toLowerCase().includes(q);
  });
}

function getFilteredClauses(overrideFilters) {
  if (!overrideFilters && state.activeTermFilter) {
    const termHits = state.clauseTermHits || {};
    return (state.clauses || []).filter(c => isReviewableClause(c) && (termHits[c.id] || []).includes(state.activeTermFilter));
  }
  const base = getBaseFilteredClauses(overrideFilters);
  if (!overrideFilters && state.queuePreset && ['needs-decision','high-risk','needs-fallback','awaiting-input','decided'].includes(state.queuePreset)) {
    if (state.queuePreset === 'needs-decision') return base.filter(c => c.id === OVERVIEW_ID || !getClauseDecision(c.id).type);
    if (state.queuePreset === 'high-risk') return base.filter(c => c.id === OVERVIEW_ID || (state.clauseRiskScores?.[c.id] || '') === 'High');
    if (state.queuePreset === 'needs-fallback') return base.filter(c => c.id === OVERVIEW_ID || (['seek-amendment','reject'].includes(getClauseDecision(c.id).type) && !String(getClauseDecision(c.id).fallback || '').trim()));
    if (state.queuePreset === 'awaiting-input') return base.filter(c => c.id === OVERVIEW_ID || getClauseDecision(c.id).type === 'need-input');
    if (state.queuePreset === 'decided') return base.filter(c => c.id === OVERVIEW_ID || !!getClauseDecision(c.id).type);
  }
  return base;
}
function renderClauseList(){
  bumpRenderCount('navigator');
  if(!els.clauseList) return;
  renderQueueBar();
  const items=getFilteredClauses().filter(isReviewableClause);
  const activeQueue=(state.queuePreset||'').replace(/-/g,' ');
  const activeFilters=[];
  if(state.filters?.content && state.filters.content!=='all') activeFilters.push(state.filters.content);
  if(state.filters?.review && state.filters.review!=='all') activeFilters.push(state.filters.review);
  const summary=(activeQueue || activeFilters.length)?`<div class="queue-filter-summary mini">Queue: ${escapeHtml(activeQueue||'all')} ${activeFilters.length?`• Filter: ${escapeHtml(activeFilters.join(', '))}`:''}</div>`:'';
  const banner=state.activeTermFilter?`<div class="term-filter-banner">Showing uses of <strong>${escapeHtml(state.activeTermFilter)}</strong><button type="button" class="link-btn" id="clearTermFilterBtn">Clear ✕</button></div>`:'';
  if(!items.length){ els.clauseList.innerHTML=banner+summary+'<div class="empty-state"><div><p>No clauses match this queue yet.</p></div></div>'; els.clauseList.querySelector('#clearTermFilterBtn')?.addEventListener('click',()=>{state.activeTermFilter=''; renderClauseList();}); return; }
  els.clauseList.innerHTML=banner+summary+items.map(c=>{
    const active=state.selectedClauseId===c.id;
    const risk=state.clauseRiskScores?.[c.id]||'Low';
    const pos=state.clausePositions?.[c.id]||'';
    const reasons=c.id===OVERVIEW_ID?[]:getTriageReasons(c);
    const queueBadge=(state.queuePreset||'').replace(/-/g,' ');
    return `<button type="button" role="option" aria-selected="${active?'true':'false'}" class="clause-item clause-nav-item ${active?'selected active':''}" data-clause-id="${escapeHtml(c.id)}" data-risk="${escapeHtml(risk)}"><span class="nav-number">${escapeHtml(c.number||'')}</span><span class="nav-label"><span class="nav-heading">${highlightHtml(escapeHtml(c.heading||'Overview'), state.searchQuery||'')}</span>${c.id!==OVERVIEW_ID?`<span class="nav-count"> • ${escapeHtml(queueBadge)}</span>`:''}</span><span class="nav-indicators">${pos?`<span class="nav-dot" data-pos="${escapeHtml(pos)}"></span>`:''}${reasons.length?`<span class="nav-count">${reasons.length}</span>`:''}</span></button>`;
  }).join('');
  els.clauseList.querySelector('#clearTermFilterBtn')?.addEventListener('click',()=>{state.activeTermFilter=''; renderClauseList();});
}
function installContextPanelHandlers(){
  if(els.contextPanelBody && !els.contextPanelBody.dataset.delegated){
    els.contextPanelBody.dataset.delegated='true';
    els.contextPanelBody.addEventListener('click', e=>{
      if(handleWorkspacePlaybookAction(els.contextPanelBody,e))return;
      const jump=e.target.closest('[data-stage-jump]'); if(jump){ setWorkflowStage(jump.dataset.stageJump); return; }
      const util=e.target.closest('[data-context-utility]'); if(util){ const tab=util.dataset.contextUtility; if(TAB_IDS.includes(tab)){ setActiveTab(tab); renderActiveRightPanel(); } return; }
      const packToggle=e.target.closest('[data-toggle-pack]'); if(packToggle){ const cid=packToggle.dataset.togglePack; const d=getClauseDecision(cid); setClauseDecision(cid,{includeInPack:!d.includeInPack}); recomputeOpenLoops(); renderActiveRightPanel(); renderClauseList(); scheduleAutosave(DRAFTING_AUTOSAVE_DELAY); return; }
      const prepareGroup=e.target.closest('[data-prepare-group]'); if(prepareGroup){ state.prepareGroupMode=prepareGroup.dataset.prepareGroup||'priority'; renderContextPanel(); scheduleAutosave(DRAFTING_AUTOSAVE_DELAY); return; }
      const copyBtn=e.target.closest('[data-copy-action]'); if(copyBtn){ const action=copyBtn.dataset.copyAction; if(action==='pack') copyTextToClipboard(formatNegotiationPack(),'Pack copied'); else if(action==='approval') copyTextToClipboard(formatApprovalPack(),'Approval pack copied'); else if(action==='business') copyTextToClipboard(buildBusinessSummaryTxt(),'Business summary copied'); else if(action==='leadership') copyTextToClipboard(buildLeadershipEscalationTxt(),'Leadership pack copied'); else if(action==='agenda') copyTextToClipboard(buildCallAgendaTxt(),'Internal negotiation prep copied'); return; }
      const exportBtn=e.target.closest('[data-export-action]'); if(exportBtn){ const action=exportBtn.dataset.exportAction;if(action==='approval'?!ensureApprovalExportReady():!ensureExportReady()) return; const base=safeBaseName(state.documentMeta?.fileName||'contract'); if(action==='approval') openOutputPreview('Approval pack preview',formatApprovalPack(),`${base}_approval_pack.txt`); else if(action==='report') exportReport(); else if(action==='pack') openOutputPreview('Negotiation pack preview',formatNegotiationPack(),`${base}_negotiation_pack.txt`); else if(action==='business') openOutputPreview('Business summary preview',buildBusinessSummaryTxt(),`${base}_business_summary.txt`); else if(action==='leadership') openOutputPreview('Leadership escalation pack preview',buildLeadershipEscalationTxt(),`${base}_leadership_escalation_pack.txt`); else if(action==='agenda') openOutputPreview('Internal negotiation prep preview',buildCallAgendaTxt(),`${base}_internal_negotiation_prep.txt`); else if(action==='word-handoff'){const html=buildWordHandoffHtml();openOutputPreview('Word drafting handoff preview',htmlToPlainText(html),`${base}_word_handoff.html`,new Blob([html],{type:'text/html;charset=utf-8'}));} else if(action==='evidence-ledger') exportEvidenceLedger(); return; }
    });
  }
}

window.addEventListener('beforeunload', flushClauseTime);

if (typeof showLanding === 'function' && !window.__cockpitWrappedShowLanding) {
  window.__cockpitWrappedShowLanding = true;
  const __origShowLanding = showLanding;
  showLanding = function(...args) {
    flushClauseTime();
    return __origShowLanding.apply(this, args);
  };
}
document.addEventListener('click', e => {
  const obligationBtn=e.target.closest('[data-confirm-obligation]');
  if(obligationBtn){const id=obligationBtn.dataset.confirmObligation;state.obligationVerification[id]=state.obligationVerification[id]==='confirmed'?'unverified':'confirmed';scheduleAutosave({reason:'critical'});renderSummaryPanel();renderToolsPanel();renderChecksWorkspace();return;}
  const copyBtn = e.target.closest('.ai-copy-fallback-btn');
  if(copyBtn && copyBtn.dataset.copyText){
    navigator.clipboard?.writeText(copyBtn.dataset.copyText);
    showToast('Fallback copied','info');
  }
});
