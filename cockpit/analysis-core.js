/* Contract Cockpit v7.6: pure analysis helpers shared by the app and regression tests. */
(function attachContractCockpitAnalysis(root) {
  const clean = value => String(value || '')
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/\s*\|\s*/g, ' · ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim()
    .replace(/^[,;:\s]+|[,;:\s]+$/g, '');

  function excerpt(value, max = 220) {
    const normalized = clean(value);
    if (normalized.length <= max) return normalized;
    const slice = normalized.slice(0, max + 1);
    const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('; '));
    const wordEnd = slice.lastIndexOf(' ');
    const cut = sentenceEnd > Math.floor(max * 0.58) ? sentenceEnd + 1 : wordEnd;
    return `${slice.slice(0, Math.max(1, cut)).replace(/[\s,;:.]+$/, '')}\u2026`;
  }

  function isRegexLike(pattern) {
    return !!pattern && typeof pattern.source === 'string' && typeof pattern.flags === 'string';
  }

  function testPattern(pattern, value) {
    if (!isRegexLike(pattern)) return false;
    return new RegExp(pattern.source, pattern.flags.replace(/g/g, '')).test(String(value || ''));
  }

  /* Shared assertion gate for semantic detectors. A legal concept is not treated as
     operative merely because its noun appears in the clause. Classifiers, concept
     evidence and sibling detectors can now use the same mentioned/asserted/negated
     distinction instead of learning this safeguard independently after a false hit. */
  function assessOperativeAssertion(value, options = {}) {
    const text = clean(value);
    const heading = clean(options.heading || '');
    const mention = isRegexLike(options.mention) ? options.mention : /$a/;
    const operative = isRegexLike(options.operative) ? options.operative : /$a/;
    const mentioned = !!(testPattern(mention, text) || (options.allowHeading && testPattern(mention, heading)));
    const headingAssertion = !!(options.allowHeading && testPattern(mention, heading));
    const operativeAssertion = testPattern(operative, text);
    const placeholder = /\[(?:insert|tbd|tba|to be agreed|see\s+(?:schedule|annex|dpa)|applicable if)[^\]]*\]|\b(?:subject to|as set out in)\s+(?:a|the)\s+(?:future|applicable)\s+(?:dpa|schedule|annex)\b/i.test(text);
    const sentences = splitLegalSentences(text);
    const negationPattern = new RegExp(`(?:\\b(?:nothing\\s+to\\s+do\\s+with|not\\s+related\\s+to|does\\s+not\\s+(?:address|concern|govern|submit|create|establish|agree)|do\\s+not\\s+(?:address|concern|govern|submit|create|establish|agree)|did\\s+not\\s+(?:agree|create|establish|accept)|shall\\s+not|must\\s+not|may\\s+not|will\\s+not|without|there\\s+is\\s+no|there\\s+shall\\s+be\\s+no|no)\\b[^.;]{0,120}(?:${mention.source})|(?:${mention.source})[^.;]{0,90}\\b(?:does\\s+not\\s+apply|is\\s+not\\s+(?:created|established|agreed|applicable)|shall\\s+not\\s+apply))`, 'i');
    const operativeSentences = sentences.filter(sentence => testPattern(operative, sentence));
    const affirmativeSentences = operativeSentences.filter(sentence => !testPattern(negationPattern, sentence));
    const negatedSentences = sentences.filter(sentence => testPattern(mention, sentence) && testPattern(negationPattern, sentence));
    const negatedMention = negatedSentences.length > 0;
    const asserted = mentioned && affirmativeSentences.length > 0 && !placeholder;
    return {
      mentioned,
      asserted,
      negated: mentioned && negatedMention,
      placeholder,
      assertionState: placeholder ? 'placeholder' : asserted ? 'asserted' : negatedMention ? 'negated' : operativeAssertion ? 'mentioned' : mentioned ? 'mentioned' : 'absent',
      basis: placeholder ? 'placeholder-reference' : asserted ? 'operative-language' : negatedMention ? 'negated-mention' : headingAssertion ? 'heading-only' : mentioned ? 'mention-only' : 'absent',
      affirmativeEvidence: affirmativeSentences.map(sentence => excerpt(sentence, 260)),
      negatedEvidence: negatedSentences.map(sentence => excerpt(sentence, 260))
    };
  }

  function splitLegalSentences(value) {
    return String(value || '').replace(/\r?\n+/g, ' ').split(/(?<=[.!?;])\s+|\s+(?=(?:provided that|except that|however|but)\b)/i).map(clean).filter(Boolean);
  }

  const PROPOSITION_CATEGORIES = [
    { concept:'forum election', action:/\b(?:submit|refer|bring|commence|elect|choose|select)\b[^.;]{0,140}\b(?:court|jurisdiction|forum|venue|arbitrat)|\b(?:court|jurisdiction|forum|venue|arbitrat)\b[^.;]{0,140}\b(?:elect|choose|option|dispute|claim|proceeding)/i, materiality:'High' },
    { concept:'termination', action:/\bterminat(?:e|es|ed|ion)\b/i, materiality:'High' },
    { concept:'acceptance or rejection', action:/\b(?:accept|reject)(?:s|ed|ion|ance)?\b/i, materiality:'High' },
    { concept:'indemnity', action:/\b(?:indemnif(?:y|ies|ication)|hold harmless|defend)\b/i, materiality:'High' },
    { concept:'audit or access', action:/\b(?:audit|inspect|inspection|access to (?:records|systems)|books and records)\b/i, materiality:'Medium' },
    { concept:'assignment', action:/\b(?:assign|assignment|transfer|change of control)\b/i, materiality:'Medium' },
    { concept:'notice', action:/\b(?:give|deliver|serve|send|provide)\s+(?:a\s+)?(?:written\s+)?notice\b|\bnotif(?:y|ies|ied|ication)\b/i, materiality:'Medium' }
  ];

  function extractLegalPropositions(clauses = [], source = '') {
    const detected = detectPrincipalParties(source).slice(0, 8);
    const parties = detected.length >= 2 ? detected : [{name:'Customer',alias:'Customer'},{name:'Supplier',alias:'Supplier'}];
    const esc = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const actors = [...new Set(parties.flatMap(p => [p.alias, p.name]).filter(Boolean))].sort((a,b)=>b.length-a.length);
    const actorPattern = new RegExp(`\\b(${actors.map(esc).join('|')}|Either Party|Each Party|Both Parties|The Parties)\\b`, 'ig');
    const modalityPattern = /\b(shall not|must not|may not|will not|is not entitled to|cannot|can not|shall|must|may|will|is entitled to|has the right to|can)\b/i;
    const propositions = [];
    for (const clause of clauses || []) {
      for (const sentence of splitLegalSentences(`${clause.heading || ''}. ${clause.body || ''}`)) {
        const categories=PROPOSITION_CATEGORIES.filter(item => item.action.test(sentence));
        for(const category of categories){
          actorPattern.lastIndex = 0;
          const actorMatches = [...sentence.matchAll(actorPattern)];
          for (let index = 0; index < actorMatches.length; index++) {
          const match = actorMatches[index];
          const start = match.index || 0;
          const end = index + 1 < actorMatches.length ? (actorMatches[index + 1].index || sentence.length) : sentence.length;
          const actorText = match[1];
          const isPossessive = /^['’]s?\b/.test(sentence.slice(start+actorText.length, start+actorText.length+3));
          if (isPossessive) continue;
          const segment = sentence.slice(start, end);
          const modality = segment.match(modalityPattern)?.[1] || '';
          const explicitOption=new RegExp(`\\b(?:at the option of|if so chosen by|as elected by)\\s+(?:the\\s+)?${esc(actorText)}\\b`,'i').test(sentence);
          if ((!modality&&!explicitOption) || !category.action.test(sentence)) continue;
          const genericBoth = /^(?:Either Party|Each Party|Both Parties|The Parties)$/i.test(actorText);
          const actor = parties.find(p => [p.alias,p.name].some(v => String(v||'').toLowerCase() === actorText.toLowerCase()));
          const polarity = /\b(?:not|cannot|can not)\b/i.test(modality) ? 'prohibited' : 'affirmative';
          const canonicalActors = genericBoth ? parties.map(p=>p.alias) : [actor?.alias || actorText];
          for (const canonicalActor of canonicalActors) propositions.push({
            id:`proposition:${clause.id}:${category.concept}:${canonicalActor}:${propositions.length+1}`,
            clauseId:clause.id, clauseLabel:clause.number||clause.heading, actor:canonicalActor,
            concept:category.concept, action:excerpt(segment,180), polarity, modality:clean(modality||'option').toLowerCase(),
            condition:clean(segment.match(/\b(?:if|when|where|provided that|subject to|unless)\b[^.;]*/i)?.[0]||''),
            exception:clean(segment.match(/\b(?:except|other than|save for)\b[^.;]*/i)?.[0]||''),
            sourceExcerpt:excerpt(sentence,420), sourceSpan:{start,end}, materiality:category.materiality,
            confidence:actor||genericBoth?'Strong':'Moderate'
          });
        }
        }
      }
    }
    return propositions;
  }

  function buildSourceBlocks(records = []) {
    const stack = [];
    return (records || []).map((record, index) => {
      const level = Number(record?.numberingLevel ?? 0);
      while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
      const id = `source-block-${index + 1}`;
      const parentBlockId = record?.numberingSource && level > 0 ? (stack[stack.length - 1]?.id || '') : '';
      const block = {
        id,
        sourceOrder: Number.isFinite(record?.sourceOrder) ? record.sourceOrder : index,
        type: record?.sourceType || 'paragraph',
        text: String(record?.text || ''),
        exactText: String(record?.text || ''),
        headingLevel: Number(record?.headingLevel || 0),
        numberingSource: record?.numberingSource || '',
        numberingLevel: level,
        numberingPrefix: record?.numberingPrefix || '',
        parentBlockId,
        cells: Array.isArray(record?.cells) ? record.cells.map(String) : []
      };
      if (block.numberingSource) stack.push({ id, level });
      return block;
    });
  }

  function findDefinedTermCaseDrift(value, definedTerms = []) {
    const text = String(value || '');
    const out = [];
    const seen = new Set();
    const terms = [...new Set((definedTerms || []).map(item => clean(item)).filter(Boolean))].sort((a, b) => b.length - a.length);
    for (const term of terms) {
      const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=$|[^\\p{L}\\p{N}_])`, 'giu');
      for (const match of text.matchAll(pattern)) {
        const actual = match[2] || '';
        if (actual === term || actual.toLocaleLowerCase() !== term.toLocaleLowerCase()) continue;
        const index = (match.index || 0) + (match[1] || '').length;
        const key = `${index}:${term}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ index, length: actual.length, term, value: actual });
      }
    }
    return out.sort((a, b) => a.index - b.index || b.length - a.length);
  }

  function detectPrincipalParties(source) {
    const text = String(source || '').replace(/[\u2018\u2019\u201c\u201d]/g, "'");
    const preamble = text.split(/\r?\n(?=(?:\d+(?:\.\d+)*|Article\s+[A-Z0-9]+)[.)]?\s+)/i)[0].slice(0, 6000);
    const lines = preamble.split(/\r?\n/).map(clean).filter(Boolean).slice(0, 45);
    const parties = [];
    const add = (candidate, aliasValue) => {
      const alias = clean(aliasValue).replace(/^the\s+/i, '');
      let name = clean(candidate)
        .replace(/^(?:this\s+.+?\s+is\s+(?:made|entered\s+into)[^]*?\bbetween|between|and)\s+/i, '')
        .replace(/^(?:and|between)\s+/i, '');
      const betweenName=clean(candidate).match(/\bbetween\s+(.{2,240})$/i);
      const andName=clean(candidate).match(/(?:^|,\s*)and\s+(.{2,240})$/i);
      if(betweenName)name=betweenName[1];
      else if(andName)name=andName[1];
      // A comma often introduces an address, but it can also be part of the legal
      // entity name (Acme, LLC). Preserve recognised corporate suffixes.
      const nameParts = name.split(',').map(clean).filter(Boolean);
      const corporateSuffix = /^(?:inc\.?|incorporated|llc|l\.l\.c\.?|llp|l\.l\.p\.?|ltd\.?|limited|plc|corp\.?|corporation|company|co\.?|gmbh|ag|s\.a\.?|s\.r\.l\.?)$/i;
      name = clean(nameParts.length > 1 && corporateSuffix.test(nameParts[1]) ? `${nameParts[0]}, ${nameParts[1]}` : nameParts[0] || name)
        .replace(/^(?:and|between)\s+/i,'');
      if (!alias || /^(?:agreement|party|parties)$/i.test(alias)) return;
      if (/\b(?:tender|request for proposal|rfp|agreement|annex|schedule|services|deliverables?|personal data|confidential information)\b/i.test(alias)) return;
      if (/\[[^\]]+\]/.test(name) || !name) name = alias;
      if (!parties.some(p => p.alias.toLowerCase() === alias.toLowerCase())) parties.push({ name, alias });
    };
    for (const line of lines) {
      const hereinafter = line.match(/^(.{2,520}?)\s*;?\s*hereinafter\s*(?:(?:collectively\s+)?referred\s+to\s+as)?\s*:?\s*(?:the\s+)?['"]([^'"]{1,60})['"]/i);
      if (hereinafter) add(hereinafter[1], hereinafter[2]);
      for (const match of line.matchAll(/(.{2,520}?)\s*\(\s*(?:the\s+)?['"]([^'"]{1,60})['"]\s*\)/gi)) add(match[1], match[2]);
    }
    if (parties.length < 2) {
      const joined = clean(lines.join(' '));
      const between = joined.match(/\bbetween\s+(.{2,220}?)\s+and\s+(.{2,220}?)(?=\s+(?:whereas|recitals?|now,? therefore|the parties agree|1[.)]\s)|$)/i);
      const trimParty = value => clean(value).replace(/\s+(?:having|with)\s+(?:its|a)\s+(?:registered|principal)\s+office[\s\S]*$/i, '').replace(/[,;:]$/, '');
      if (between) {
        const names = [trimParty(between[1]), trimParty(between[2])].filter(Boolean);
        names.forEach((name, index) => {
          if (!parties.some(p => p.name.toLowerCase() === name.toLowerCase())) parties.push({ name, alias: index === 0 ? 'First Party' : 'Second Party', inferredAlias: true });
        });
      }
    }
    return parties.slice(0, 4);
  }

  function resolveStyleNumbering(styleId, styleMap, seen = new Set()) {
    if (!styleId || !styleMap?.[styleId] || seen.has(styleId)) return { headingLevel: 0, basedOn: '', numId: '', ilvl: '0' };
    seen.add(styleId);
    const own = styleMap[styleId] || {};
    const base = own.basedOn ? resolveStyleNumbering(own.basedOn, styleMap, seen) : {};
    return {
      ...base,
      ...own,
      headingLevel: own.headingLevel || base.headingLevel || 0,
      numId: own.numId || base.numId || '',
      // Word styles may inherit the numbering scheme while owning their level.
      // numId and ilvl therefore have to inherit independently.
      ilvl: own.ilvl !== '' && own.ilvl != null ? String(own.ilvl) : String(base.ilvl ?? '0')
    };
  }

  function detectExecutionBoundary(value) {
    const source = String(value || '');
    const length = source.length;
    const candidates = [];
    if (!length) return { index: -1, status: 'not-found', coverageRatio: 1, confidence: 'None', candidates: [] };
    const add = (rule, regex, minimumRatio, confidence) => {
      for (const match of source.matchAll(regex)) {
        const index = match.index ?? -1;
        if (index < 0) continue;
        candidates.push({ rule, index, ratio: index / length, minimumRatio, confidence, text: excerpt(match[0], 120) });
      }
    };
    add('witness', /\bIN WITNESS WHEREOF\b/gi, 0.55, 'High');
    add('signed-copies', /(?:^|\n)\s*(?:drawn up|executed|signed)\b[^\n]{0,180}\bsigned\b[^\n]{0,120}(?:copies|counterparts?)?/gim, 0.65, 'High');
    add('signature-heading', /(?:^|\n)\s*(?:SIGNATURES?|EXECUTION)\s*(?:\n|$)/gim, 0.70, 'High');
    add('contact-designation', /\bThe Parties designate the following contact persons\b/gi, 0.82, 'Low');
    add('signature-for-block', /(?:^|\n)\s*For\s+(?:\[[^\]]+\]|[A-Z][^:\n]{1,90})\s*:\s*(?:\n|$)/gim, 0.82, 'Medium');
    add('signature-name-block', /(?:^|\n)\s*Name\s*:\s*[^\n]*\n\s*(?:Title\s*:\s*[^\n]*\n\s*)?(?:Signature|Date)\s*:/gim, 0.82, 'Medium');
    const accepted = candidates.filter(candidate => candidate.ratio >= candidate.minimumRatio || (length < 9000 && candidate.index > 250 && ['witness','signature-heading','signature-for-block','signature-name-block'].includes(candidate.rule))).sort((a, b) => a.index - b.index);
    for (const candidate of accepted) {
      const tail = source.slice(candidate.index);
      const substantiveTail = source.slice(candidate.index + candidate.text.length);
      const definitionSignals = (tail.match(/(?:["“][A-Z][^"”]{1,80}["”]\s+(?:means|has\s+the\s+meaning)|(?:^|\n)\s*(?:Schedule|Annex|Appendix)\b[^\n]*(?:Definitions?|Interpretation))/gim) || []).length;
      const operativeTail = (substantiveTail.match(/\b(?:shall|must|agrees? to|undertakes? to|may not|is required to)\b/gi) || []).length;
      if (definitionSignals >= 2 || (operativeTail >= 4 && candidate.ratio < 0.88)) {
        candidate.rejectedReason = definitionSignals >= 2 ? 'definitions annex follows marker' : 'substantive provisions follow marker';
        continue;
      }
      return {
        index: candidate.index,
        status: 'found',
        rule: candidate.rule,
        confidence: candidate.confidence,
        coverageRatio: candidate.ratio,
        candidates
      };
    }
    return { index: -1, status: candidates.length ? 'candidates-rejected' : 'not-found', coverageRatio: 1, confidence: 'None', candidates };
  }

  function assessDefinedTermCandidate(value, context = '') {
    const term = clean(value).replace(/^["']|["']$/g, '');
    const lower = term.toLowerCase();
    if (!term || term.length > 90) return { include: false, reason: 'empty or implausibly long candidate' };
    if (/^(?:the|this|that|any|each|either|for|if|in|on|at|from|to|and|or|name|term|defined term|meaning)$/i.test(term)) return { include: false, reason: 'function word or administrative label' };
    if (/^[a-z]/.test(term)) return { include: false, reason: 'lower-case prose fragment, not a defined label' };
    if (/^For\s+(?:[A-Z][\w&.'-]*)(?:\s+[A-Z][\w&.'-]*){0,4}$/i.test(term) && /\b(?:contact|name|phone|e-?mail|signature|address)\b/i.test(context)) return { include: false, reason: 'contact or signature block label' };
    if (/^(?:hereinafter\s+(?:jointly|collectively)?\s*referred\s+to\s+as|in\s+case\s+of\s+advance\s+payment|timesheets?\s+of\s+experts?)$/i.test(term)) return { include: false, reason: 'captured drafting phrase, not a label' };
    if (/\b(?:shall|must|means?|referred to|hereinafter|payment|invoice|timesheet)\b/i.test(term) && term.split(/\s+/).length > 3) return { include: false, reason: 'operative phrase, not a defined label' };
    if (/\b(?:phone|e-?mail|address|contact persons?|signature|print name|title)\b/i.test(`${term} ${context}`) && !/definition|interpretation/i.test(context)) return { include: false, reason: 'administrative field' };
    if (!/[A-Za-z]/.test(term) || lower === 'n/a') return { include: false, reason: 'non-word candidate' };
    return { include: true, reason: 'plausible defined label' };
  }

  function objectiveRiskFloor(value) {
    const text = clean(value);
    const protectiveNegation = /\b(?:there\s+is\s+)?no\s+(?:unlimited|uncapped)\s+liabilit|\b(?:not|never)\s+(?:be\s+)?(?:unlimited|uncapped)\s+liabilit|\b(?:unlimited|uncapped)\s+liabilit[^.;]{0,50}\b(?:shall|does)\s+not\s+apply/i;
    const paymentDebtOnly = /\bno cap applies to\b[^.;]{0,100}\b(?:payment|fees?|charges?|invoice)\s+obligations?\b/i.test(text)
      && !/\b(?:breach|damages?|loss(?:es)?|indemnif|negligence|misconduct)\b/i.test(text);
    const high = [
      /\b(?:unlimited|uncapped)\s+liabilit/i,
      /\bno\s+(?:aggregate\s+)?cap\b/i,
      /\bcap\b[^.;]{0,180}\b(?:may|shall)\s+apply\s+only\s+if\b/i,
      /\bindemnif(?:y|ies|ication)\b[^.;]{0,220}\b(?:all|any)\s+(?:loss(?:es)?|claim(?:s)?|damage(?:s)?|cost(?:s)?|expense(?:s)?|proceedings?)\b/i
    ];
    if (high.some(pattern => pattern.test(text)) && !protectiveNegation.test(text) && !paymentDebtOnly) return 'High';
    const medium = [
      /\b(?:aggregate liability|liability cap|limitation of liability)\b/i,
      /\bindemnif(?:y|ication)|hold harmless|defend\b/i,
      /\b(?:assign|transfer)\b[^.;]{0,140}\bconsent\b/i,
      /\b(?:terminate|termination)\b[^.;]{0,180}\b(?:convenience|without cause|at any time|immediately|with immediate effect)\b/i,
      /\b(?:set[- ]?off|withhold)\b[^.;]{0,180}\b(?:any|all|other agreement|affiliate)\b/i,
      /\b(?:customer|client|purchaser|recipient|[A-Z][A-Za-z0-9&.'-]{2,60})\b[^.;]{0,160}\b(?:(?:not|in no event)\s+(?:be\s+)?liable|exclude|excluded)\b[^.;]{0,120}\b(?:indirect|consequential|special)\s+(?:loss|damage)s?\b/i,
      /\bin no event shall\s+(?:customer|client|purchaser|recipient|[A-Z][A-Za-z0-9&.'-]{2,60})\s+be liable\b[^.;]{0,160}\b(?:indirect|consequential|special|punitive)\b/i,
      /\b(?:customer|client|purchaser|recipient|[A-Z][A-Za-z0-9&.'-]{2,60})\b[^.;]{0,180}\b(?:indirect|consequential|special)\s+(?:loss|damage)s?\b[^.;]{0,120}\b(?:not liable|exclude|excluded)\b/i,
      /\b(?:at its option|sole discretion|may elect|may choose|if so chosen by)\b[^.;]{0,260}\b(?:court|jurisdiction|arbitrat)/i,
      /\b(?:court|jurisdiction|arbitrat)[^.;]{0,260}\bif so chosen by\b/i,
      /\b(?:court|jurisdiction|arbitrat)[^.;]{0,260}\bat the option of\s+(?:the\s+)?[A-Z][A-Za-z0-9&.'-]{2,60}\b/i,
      /\bat the option of\s+(?:the\s+)?[A-Z][A-Za-z0-9&.'-]{2,60}\b[^.;]{0,260}\b(?:court|jurisdiction|arbitrat)/i,
      /\b(?:assign|transfer|vest)\b[^.;]{0,220}\b(?:background ip|background intellectual property|tools|know-how|pre-existing)\b/i,
      /\b(?:unrestricted|at any time|without notice)\b[^.;]{0,140}\b(?:audit|inspection|access to systems?|step-in)\b/i,
      /\b(?:absolute|unconditional)\b[^.;]{0,120}\b(?:security|data protection|compliance)\b/i
    ];
    return medium.some(pattern => pattern.test(text)) ? 'Medium' : '';
  }

  function makeConceptEvidence(concept, clause, mechanism, sourceExcerpt, rule, matchStrength = 'Strong', details = {}) {
    return {
      id: `${concept}:${clause?.id || 'source'}:${rule}`,
      concept,
      present: true,
      sourceClauseId: clause?.id || '',
      sourceLabel: clean(`${clause?.number || ''} ${clause?.heading || ''}`),
      mechanism,
      sourceExcerpt: excerpt(sourceExcerpt, 420),
      rule,
      matchStrength,
      verificationStatus: 'unverified',
      ...details
    };
  }

  function detectLegalConcepts(clauses = []) {
    const byConcept = {
      acceptance: [], changeControl: [], indemnity: [], liabilityCap: [], governingLaw: [], disputeResolution: [],
      termination: [], assignment: [], setOff: [], dataProtection: [], intellectualProperty: [],
      serviceLevels: [], confidentiality: [], fees: [], audit: []
    };
    const add = (concept, item) => {
      if (!item || !byConcept[concept]) return;
      if (byConcept[concept].some(existing => existing.sourceClauseId === item.sourceClauseId && existing.rule === item.rule)) return;
      byConcept[concept].push(item);
    };
    for (const clause of clauses || []) {
      const text = clean(`${clause.heading || ''}. ${clause.body || ''}`);

      const acceptanceWindow = /\b(?:accept(?:ed|ance)|reject(?:ed|ion))\b/i.test(text)
        && /\b(?:within|after|expiry|expiration)\b[^.;]{0,100}\b(?:day|business day)s?\b/i.test(text);
      const acceptanceAssertion=assessOperativeAssertion(text,{mention:/\b(?:accept(?:ed|ance)|reject(?:ed|ion))\b/i,operative:/\b(?:if|unless)\b[^.;]{0,220}\b(?:reject|object|notify)\b[^.;]{0,220}\b(?:considered|treated|regarded|automatically|deemed)\s+(?:as\s+)?accepted\b|\b(?:considered|treated|regarded|automatically|deemed)\s+(?:as\s+)?accepted\b/i});
      const acceptanceBySilence = acceptanceAssertion.asserted;
      if (acceptanceWindow || acceptanceBySilence || /\bacceptance (?:criteria|test)\b/i.test(text)) {
        const period = text.match(/\b(?:within|after)\s+([^.;]{0,45}\b(?:day|business day)s?)\b/i)?.[1] || '';
        add('acceptance', makeConceptEvidence('acceptance', clause, acceptanceBySilence ? 'acceptance-by-silence' : 'express acceptance process', text, acceptanceBySilence ? 'acceptance-by-silence' : 'acceptance-process', acceptanceBySilence || acceptanceWindow ? 'Strong' : 'Moderate', { facts: { rejectionWindow: clean(period), acceptanceBySilence } }));
      }

      const modification = /\b(?:modify|modified|modification|amend|amendment|vary|variation|change)\b/i.test(text);
      const changeImpact = /\b(?:scope|services?|fees?|price|charges?|schedule|timeline|delivery date|responsibilit(?:y|ies))\b/i.test(text);
      const changeApproval = /\b(?:mutual|both parties|written agreement|signed|approval|consent)\b/i.test(text);
      if (modification && (changeImpact || changeApproval)) add('changeControl', makeConceptEvidence('changeControl', clause, 'documented contract-change mechanism', text, 'change-mechanism', changeImpact && changeApproval ? 'Strong' : 'Moderate', { facts: { impactAssessment: changeImpact, mutualApproval: changeApproval } }));

      const indemnityGrant = /\b(?:shall|will|agrees? to|undertakes? to)\s+(?:defend,?\s*)?(?:indemnif(?:y|ies)|hold harmless)\b|\bindemnif(?:y|ies)\s+and\s+hold harmless\b/i.test(text);
      const indemnityHeading = /\bindemnif(?:y|ies|ication)\b|\bhold harmless\b/i.test(String(clause.heading || ''));
      const indemnityCrossReference = /\b(?:under|pursuant to|subject to|without prejudice to)\b[^.;]{0,90}\bindemnif(?:y|ication)\b/i.test(text) && !indemnityGrant;
      const indemnityCapTreatment = /\bindemnif(?:y|ication)\b[^.;]{0,180}\b(?:cap|limitation of liability|excluded from|outside)\b|\b(?:cap|limitation of liability)\b[^.;]{0,180}\bindemnif/i.test(text);
      if (indemnityGrant) {
        const thirdParty = /\bthird[- ]party\b/i.test(text);
        const broad = /\b(?:all|any)\s+(?:suits?|actions?|proceedings?|claims?|damages?|liabilit(?:y|ies)|loss(?:es)?|fees?|costs?|expenses?)\b/i.test(text) || /\bacts?,?\s+omissions?|\bbreach(?:es)?\b|\bnegligence\b/i.test(text);
        add('indemnity', makeConceptEvidence('indemnity', clause, thirdParty ? 'operative third-party indemnity grant' : 'operative general/direct-loss indemnity grant', text, broad && !thirdParty ? 'broad-general-indemnity' : 'operative-indemnity-grant', broad ? 'Strong' : 'Moderate', { evidenceType: 'operative-grant', facts: { thirdPartyLimited: thirdParty, broadLossHeads: broad, capTreatmentDetected: indemnityCapTreatment } }));
      } else if (indemnityCapTreatment) add('indemnity', makeConceptEvidence('indemnity', clause, 'liability-cap treatment of indemnity', text, 'indemnity-cap-treatment', 'Moderate', { evidenceType: 'cap-treatment' }));
      else if (indemnityCrossReference) add('indemnity', makeConceptEvidence('indemnity', clause, 'cross-reference to indemnity', text, 'indemnity-cross-reference', 'Possible', { evidenceType: 'cross-reference' }));
      else if (indemnityHeading) add('indemnity', makeConceptEvidence('indemnity', clause, 'heading only', text, 'indemnity-heading', 'Possible', { evidenceType: 'heading-only' }));

      const capAssertion = assessOperativeAssertion(text, {
        mention:/\b(?:aggregate liability|liability cap|limitation of liability|cap(?:ped)?|shall not exceed|in excess of)\b/i,
        operative:/\b(?:aggregate liability|liability)\b[^.;]{0,180}\b(?:shall not exceed|is limited to|will not exceed|is capped at|may apply only if)\b|\bcap\b[^.;]{0,120}\b(?:is|shall be|may apply)\b/i
      });
      if (capAssertion.asserted&&!/\b(?:no|not any)\s+(?:aggregate\s+)?liability cap\b|\bliability cap\b[^.;]{0,80}\b(?:is not|shall not be)\s+(?:created|established|agreed)\b/i.test(text)) add('liabilityCap', makeConceptEvidence('liabilityCap', clause, /may apply only if|only if expressly/i.test(text) ? 'conditional liability cap' : 'liability-cap architecture', text, /may apply only if|only if expressly/i.test(text) ? 'conditional-cap' : 'liability-cap', 'Strong', { assertionBasis: capAssertion.basis }));

      if (/\b(?:governed by(?: and construed in accordance with)? the laws of|governing law is|laws governing this agreement)\b/i.test(text)) {
        add('governingLaw', makeConceptEvidence('governingLaw', clause, 'choice of governing law', text, 'governing-law', 'Strong'));
      }

      const arbitrationAssertion=assessOperativeAssertion(text,{mention:/\b(?:arbitrat(?:e|ion)|ICC|SIAC|LCIA|DIAC)\b/i,operative:/\b(?:shall|must|will|may|agrees? to|submit(?:s|ted)? to|refer(?:s|red)? to|elect(?:s|ed)?|binding|final)\b[^.;]{0,220}\b(?:arbitrat(?:e|ion)|ICC|SIAC|LCIA|DIAC)\b|\b(?:arbitrat(?:e|ion)|ICC|SIAC|LCIA|DIAC)\b[^.;]{0,180}\b(?:shall|must|will|may|binding|final|seat|rules?)\b/i});
      const arbitration = arbitrationAssertion.asserted;
      const forumSelection = /\b(?:submits?|consents?)\s+to\b[^.;]{0,120}\bjurisdiction\b|\b(?:exclusive|non-exclusive)\s+jurisdiction\b|\b(?:disputes?|claims?|proceedings?)\b[^.;]{0,180}\b(?:courts?|jurisdiction|venue|forum)\b|\b(?:courts?|jurisdiction)\b[^.;]{0,180}\b(?:disputes?|claims?|proceedings?)\b/i.test(text);
      const severabilityCourt = /\b(?:invalid|illegal|unenforceable|severab)\b[^.;]{0,180}\bcourt of competent jurisdiction\b|\bcourt of competent jurisdiction\b[^.;]{0,180}\b(?:invalid|illegal|unenforceable|severab)\b/i.test(text);
      if ((arbitration || forumSelection) && !severabilityCourt && !/\bcourt of auditors?|audit court\b/i.test(text)) {
        const optional = /\b(?:at its option|may\b[^.;]{0,80}\belect|may\b[^.;]{0,80}\bchoose|sole(?:\s+and\s+absolute)? discretion|option to refer|if so chosen by)\b/i.test(text) && (arbitration || /\bcourts?|jurisdiction\b/i.test(text));
        add('disputeResolution', makeConceptEvidence('disputeResolution', clause, optional ? 'unilateral or multi-forum option' : arbitration ? 'arbitration forum' : 'court forum selection', text, optional ? 'unilateral-forum-option' : arbitration ? 'arbitration-forum' : 'court-forum', 'Strong', { facts: { arbitration, courtForum: forumSelection, optional } }));
      }

      const terminationAssertion=assessOperativeAssertion(text,{mention:/\bterminat(?:e|es|ed|ion)\b/i,operative:/\b(?:shall|must|may|will|is entitled to|has the right to)\b[^.;]{0,160}\bterminat(?:e|es|ed|ion)\b|\bterminat(?:e|es|ed|ion)\b[^.;]{0,160}\b(?:shall|must|may|will|right|entitled)\b/i});
      const termination = terminationAssertion.asserted;
      if (termination) {
        const convenience = /\b(?:at any time|without (?:cause|reason)|without assigning any reason|for convenience|upon notice)\b/i.test(text);
        const cause = /\b(?:breach|default|insolven|bankrupt|liquidat|ceases? business)\b/i.test(text);
        add('termination', makeConceptEvidence('termination', clause, convenience ? 'convenience/no-cause termination' : cause ? 'cause termination' : 'termination provision', text, convenience ? 'convenience-termination' : cause ? 'cause-termination' : 'termination', convenience || cause ? 'Strong' : 'Moderate', { facts: { convenience, cause, immediate: /\b(?:immediate(?:ly)?|with immediate effect)\b/i.test(text), cure: /\b(?:cure|remed(?:y|ied)|notice period)\b/i.test(text) } }));
      }
      const assignmentAssertion=assessOperativeAssertion(text,{mention:/\b(?:assign|assignment|transfer|change of control)\b/i,operative:/\b(?:shall|must|may|will|is entitled to|has the right to)\b[^.;]{0,160}\b(?:assign|transfer)\b|\b(?:assignment|change of control)\b[^.;]{0,160}\b(?:consent|permitted|prohibited|shall|must|may)\b/i});
      if (assignmentAssertion.asserted) add('assignment', makeConceptEvidence('assignment', clause, 'assignment/change-of-control restriction', text, 'assignment-control', 'Moderate'));
      if (/\b(?:set[- ]?off|withhold)\b/i.test(text)) add('setOff', makeConceptEvidence('setOff', clause, /\b(?:any|all|other agreement|affiliate)\b/i.test(text) ? 'broad or cross-agreement set-off' : 'set-off/withholding', text, 'set-off', 'Moderate'));
      const dataAssertion = assessOperativeAssertion(text, {
        heading: clause.heading,
        allowHeading: true,
        mention: /\b(?:personal data|data protection|data processor|data controller|processing|privacy)\b/i,
        operative: /\b(?:shall|must|agrees? to|undertakes? to|is required to|may not|will)\b[^.;]{0,180}\b(?:process|processing|protect|secure|delete|return|transfer|disclose|personal data|data protection|privacy)\b|\b(?:controller|processor)\b[^.;]{0,120}\b(?:shall|must|obligation|responsible|comply)\b/i
      });
      if (dataAssertion.asserted) add('dataProtection', makeConceptEvidence('dataProtection', clause, 'data-processing/privacy obligations', text, 'data-protection', 'Moderate', {assertionBasis:dataAssertion.basis}));
      const ipAssertion=assessOperativeAssertion(text,{mention:/\b(?:intellectual property|background ip|work product|ownership of deliverables|ip rights?)\b/i,operative:/\b(?:shall|must|may|will|assign|transfer|vest|own|retain|license)\b[^.;]{0,180}\b(?:intellectual property|background ip|work product|deliverables|ip rights?)\b|\b(?:intellectual property|background ip|work product|deliverables|ip rights?)\b[^.;]{0,180}\b(?:assign|transfer|vest|own|retain|license)\b/i});
      if (ipAssertion.asserted) add('intellectualProperty', makeConceptEvidence('intellectualProperty', clause, /\b(?:assign|transfer|vest)\b/i.test(text) ? 'IP ownership/transfer' : 'IP rights', text, 'intellectual-property', 'Moderate'));
      const slaAssertion=assessOperativeAssertion(text,{mention:/\b(?:service levels?|service credits?|uptime|availability percentage|response time|resolution time)\b/i,operative:/\b(?:shall|must|will|apply|provide|meet|maintain|pay|credit)\b[^.;]{0,180}\b(?:service levels?|service credits?|uptime|availability percentage|response time|resolution time)\b|\b(?:service levels?|service credits?|uptime|availability percentage|response time|resolution time)\b[^.;]{0,180}\b(?:shall|must|will|apply|payable|required)\b/i});
      if (slaAssertion.asserted) add('serviceLevels', makeConceptEvidence('serviceLevels', clause, 'service-level regime', text, 'service-levels', 'Moderate'));
      const confidentialityAssertion=assessOperativeAssertion(text,{mention:/\b(?:confidential information|confidentiality|non-disclosure)\b/i,operative:/\b(?:shall|must|will|agrees? to|undertakes? to)\b[^.;]{0,180}\b(?:confidential|confidentiality|non-disclosure|disclose|protect)\b|\b(?:confidential information|confidentiality)\b[^.;]{0,180}\b(?:shall|must|obligation|protect|disclose)\b/i});
      if (confidentialityAssertion.asserted) add('confidentiality', makeConceptEvidence('confidentiality', clause, 'confidentiality obligations', text, 'confidentiality', 'Moderate'));
      if (/\b(?:fees?|invoice|payment terms?|payable|charges|pricing)\b/i.test(text)) add('fees', makeConceptEvidence('fees', clause, 'fees/payment mechanics', text, 'fees-payment', 'Moderate'));
      const auditAssertion=assessOperativeAssertion(text,{mention:/\b(?:audit|inspection|inspect|books and records|access to records)\b/i,operative:/\b(?:shall|must|may|will|is entitled to|has the right to)\b[^.;]{0,180}\b(?:audit|inspect|inspection|books and records|access to records)\b|\b(?:audit|inspection|books and records|access to records)\b[^.;]{0,160}\b(?:right|permitted|shall|must|may)\b/i});
      if (auditAssertion.asserted) add('audit', makeConceptEvidence('audit', clause, 'audit/inspection rights', text, 'audit-rights', 'Moderate'));
    }
    const all = Object.values(byConcept).flat();
    return {
      byConcept,
      all,
      present: Object.fromEntries(Object.entries(byConcept).map(([key, items]) => [key, items.length > 0])),
      forClause(clauseId) { return all.filter(item => item.sourceClauseId === clauseId); }
    };
  }

  function extractObligationEvidence(clauses = [], source = '') {
    const principals = detectPrincipalParties(source);
    const partyNames = [...new Set([
      ...principals.flatMap(p => [p.alias, p.name]),
      'Supplier','Client','Customer','Vendor','Service Provider','Employee','Employer',
      'Disclosing Party','Receiving Party','Recipient','Buyer','Seller','Either Party','Each Party','Party','Parties'
    ].filter(Boolean))].sort((a,b)=>b.length-a.length);
    const partyPattern = partyNames.map(v=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
    const actorPattern = new RegExp(`\\b(${partyPattern})\\b`, 'gi');
    const actionPattern = /\b(shall not|must not|may not|agrees not to|is strictly prohibited from|shall|must|will|is required to|agrees to|undertakes to|is obliged to|covenants to|commits to|shall ensure|shall cause|is responsible for)\b/gi;
    const countdownPattern = /\b(within\s+(?:(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|thirty|forty-five|sixty|ninety|\d+(?:\s+\d+)?)(?:\s*\((?:\d+|[a-z]+(?:-[a-z]+)*)\))?\s+)(?:business|calendar)?\s*(?:days?|weeks?|months?|years?)(?:\s+(?:after|before|from|of|following)\s+[^.;,]+)?|(?:a\s+)?period\s+of\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:days?|weeks?|months?|years?)\s+(?:after|before|from|following)\s+[^.;,]+|not\s+less\s+than\s+(?:\w+(?:-\w+)?(?:\s*\(\d+\))?|\d+)\s+(?:business|calendar)?\s*(?:days?|weeks?|months?|years?)\s+prior|(?:\w+(?:-\w+)?(?:\s*\(\d+\))?|\d+)\s+(?:business|calendar)?\s*days?['’]?\s+notice|no later than\s+(?:\d+(?:\s*\((?:\d+|[a-z]+(?:-[a-z]+)*)\))?\s+)?(?:business|calendar)?\s*(?:days?|weeks?|months?|years?)(?:\s+(?:after|before|from|of)\s+[^.;,]+)?|on or before\s+[^.;,]+|by\s+[A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})\b/i;
    const recurringPattern = /\b(?:daily|weekly|monthly|quarterly|annually|each\s+(?:day|week|month|quarter|year)|every\s+\d+\s+(?:days?|weeks?|months?))\b/i;
    const promptnessPattern = /\b(promptly|immediately|without undue delay|as soon as reasonably practicable)\b/i;
    const interpretivePattern = /\b(?:shall (?:solely )?be governed|shall prevail|shall control|shall be construed|shall be deemed|shall mean|shall include|in case of (?:conflict|discrepancy)|order of precedence|governing law|contractual relationship)\b/i;
    const records=[];const seen=new Set();
    for(const clause of clauses||[]){
      const sentences=String(clause.body||'').replace(/\n+/g,' ').split(/(?<=[.!?;])\s+/).map(clean).filter(Boolean);
      for(const sentence of sentences){
        actionPattern.lastIndex=0;const actionMatch=actionPattern.exec(sentence);
        const riskAllocation=/\b(?:aggregate liability|liability cap|liable for|indemnif|hold harmless|shall not exceed|capped at|limitation of liability)\b/i.test(sentence);
        if(!actionMatch||interpretivePattern.test(sentence)||riskAllocation)continue;
        const prefix=sentence.slice(0,actionMatch.index);actorPattern.lastIndex=0;let actorMatch=null;let candidate;
        const prepositionBeforeActor=/\b(?:of|by|from|under|on behalf of|behalf of|supervision of|authority of|instructions? of|direction of)\s*$/i;
        while((candidate=actorPattern.exec(prefix))!==null){const before=prefix.slice(Math.max(0,candidate.index-28),candidate.index);if(prepositionBeforeActor.test(before))continue;actorMatch=candidate;}
        const pronoun=prefix.match(/\b(it|they|such party|that party)\b[^.!?;]{0,80}$/i)?.[1]||'';
        if(!actorMatch&&!pronoun)continue;
        const actor=actorMatch?canonicalizeObligationParty(actorMatch[1],source):'Uncertain actor';
        const verbTail=sentence.slice(actionMatch.index+actionMatch[0].length).trim();
        if(!verbTail||/^(?:be governed|prevail|control|be construed|mean|include)\b/i.test(verbTail))continue;
        const countdown=sentence.match(countdownPattern)?.[0]||'';
        const promptness=sentence.match(promptnessPattern)?.[0]||'';const recurring=sentence.match(recurringPattern)?.[0]||'';
        const condition=prefix.match(/\b(?:if|where|when|provided that|unless|should)\b[^.!?;]{0,260}$/i)?.[0]||'';
        const absoluteDate=/\b(?:on or before|by)\s+[A-Z][a-z]+\s+\d{1,2}/i.test(countdown);
        const trigger=countdown.match(/\b(?:after|before|from|of)\s+(.+)$/i)?.[1]||condition;
        const deadlineKind=countdown?(absoluteDate?'absolute-date':trigger?'event-triggered':'fixed-countdown'):recurring?'recurring':promptness?'promptness':'none';
        const key=`${clause.id}:${actor.toLowerCase()}:${clean(sentence).toLowerCase()}`;if(seen.has(key))continue;seen.add(key);
        records.push({
          id:`obl-${clause.id}-${records.length+1}`,clauseId:clause.id,clauseLabel:clause.number||clause.heading,
          party:actor,actorConfidence:actorMatch?'High':'Low',action:sentence,actionObject:excerpt(verbTail,220),deadline:countdown,
          condition:clean(condition),triggerDescription:clean(trigger),deadlineKind,relativeDeadline:!!countdown&&!absoluteDate,
          waitingForTrigger:!!countdown&&!absoluteDate, timingCharacterization:countdown?(absoluteDate?'calendar date':'duration awaiting trigger'):recurring||promptness,calendarable:!!absoluteDate,topic:clause.type||'General',
          confidence:actorMatch&&(countdown||/\b(?:must|is required to|undertakes to|shall|shall not)\b/i.test(actionMatch[0]))?'High':actorMatch?'Medium':'Low',
          sourceSentence:sentence,statementType:'actionable-duty',verificationStatus:'unverified'
        });
      }
    }
    return records;
  }

  function detectSubjectiveStandards(clauses = [], source = '') {
    const principalAliases=detectPrincipalParties(source).map(p=>p.alias).filter(Boolean);
    const named=principalAliases.length?principalAliases.map(v=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'):'(?:Customer|Client|Purchaser)';
    const patterns=[
      {rule:'satisfaction-standard',regex:new RegExp(`\\b(?:to|meeting|satisfy(?:ing)?)\\s+(?:the\\s+)?(?:${named})['’]?s?\\s+(?:reasonable\\s+)?satisfaction\\b`,'i'),tier:'material',severity:'Medium'},
      {rule:'counterparty-requirement',regex:new RegExp(`\\bas\\s+(?:reasonably\\s+)?required\\s+by\\s+(?:${named})\\b`,'i'),tier:'contextual',severity:'Low'},
      {rule:'subjective-discretion',regex:/\b(?:in|at)\s+(?:its|their|[A-Z][A-Za-z0-9&.'-]{2,60}['’]s)\s+(?:(?:reasonable|sole|absolute|unfettered)(?:\s*,?\s*(?:and\s+)?(?:reasonable|sole|absolute|unfettered))*\s+)?discretion\b/i,tier:'material',severity:'Medium'},
      {rule:'adequate-assurance',regex:/\badequate assurance\b/i,tier:'contextual',severity:'Low'},
      {rule:'opinion-determination',regex:new RegExp(`\\b(?:if|where)\\s+(?:${named})\\s+(?:reasonably\\s+)?(?:determines?|considers?|believes?|is satisfied)\\b`,'i'),tier:'material',severity:'Medium'}
    ];
    const out=[];
    for(const clause of clauses||[]){const text=clean(`${clause.heading}. ${clause.body}`);for(const p of patterns){const match=text.match(p.regex);if(!match)continue;const unilateral=/\b(?:sole|absolute|unfettered)\b/i.test(match[0]);out.push({id:`subjective:${clause.id}:${p.rule}`,clauseId:clause.id,clauseLabel:clause.number||clause.heading,rule:p.rule,tier:unilateral?'unilateral':p.tier,severity:unilateral?'High':p.severity,sourceExcerpt:excerpt(text.slice(Math.max(0,(match.index||0)-90),(match.index||0)+match[0].length+180),340),matchStrength:unilateral?'Strong':p.tier==='contextual'?'Possible':'Moderate',verificationStatus:'unverified'});}}
    return out;
  }

  function detectAsymmetries(clauses = [], source = '') {
    const parties=detectPrincipalParties(source).slice(0,4);if(parties.length<2)return[];
    const esc=v=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const rights=/\b(?:may|is entitled to|has the right to|can|at the option of|if so chosen by)\b/i;
    const categories=[
      {name:'forum election',pattern:/\b(?:court|jurisdiction|forum|venue|arbitrat)/i,materiality:'High'},
      {name:'termination',pattern:/\bterminat(?:e|ion)|cure period|remed(?:y|ied)\b/i,materiality:'High'},
      {name:'acceptance or rejection',pattern:/\baccept(?:ed|ance)|reject(?:ed|ion)\b/i,materiality:'High'},
      {name:'liability or remedy',pattern:/\bliabilit|remed(?:y|ies)|consequential|indirect loss\b/i,materiality:'High'},
      {name:'indemnity',pattern:/\bindemnif|hold harmless|defend\b/i,materiality:'High'},
      {name:'audit or access',pattern:/\baudit|inspect|access to (?:records|systems)\b/i,materiality:'Medium'},
      {name:'assignment',pattern:/\bassign|transfer|change of control\b/i,materiality:'Medium'},
      {name:'notice',pattern:/\bnotice|notify\b/i,materiality:'Medium'}
    ];
    const inherentlyDirectional=/\b(?:fees?|invoice|payment|compensation|charge|deliver(?:y|able)?|perform(?:ance)? of services|timesheet)\b/i;
    const out=[];
    for(const clause of clauses||[]){const text=clean(`${clause.heading}. ${clause.body}`);const category=categories.find(item=>item.pattern.test(text));if(!category||!rights.test(text)||inherentlyDirectional.test(text)&&!category.pattern.test(String(clause.heading||'')))continue;const explicitOption=parties.find(p=>new RegExp(`(?:at the option of|if so chosen by)\\s+(?:the\\s+)?${esc(p.alias)}\\b`,'i').test(text));const owner=explicitOption||parties.find(p=>new RegExp(`\\b${esc(p.alias)}\\b[^.;]{0,80}${rights.source}`,'i').test(text)||new RegExp(`${rights.source}[^.;]{0,60}\\b${esc(p.alias)}\\b`,'i').test(text));if(!owner)continue;const other=parties.find(p=>p.alias!==owner.alias);if(!other)continue;if(category.name==='liability or remedy'&&new RegExp(`\\b${esc(owner.alias)}\\b[^.;]{0,180}\\bcap\\b[^.;]{0,100}\\bmay\\s+apply\\s+only\\s+if\\b`,'i').test(text))continue;const reciprocalOwner=explicitOption?new RegExp(`(?:at the option of|if so chosen by)\\s+(?:the\\s+)?${esc(other.alias)}\\b`,'i').test(text):new RegExp(`\\b${esc(other.alias)}\\b[^.;]{0,80}${rights.source}`,'i').test(text);if(reciprocalOwner)continue;out.push({id:`asymmetry:${clause.id}:${category.name}:${owner.alias}`,clauseId:clause.id,clauseLabel:clause.number||clause.heading,category:category.name,materiality:category.materiality,beneficiary:owner.alias,missingReciprocalFor:other.alias,sourceExcerpt:excerpt(text,420),matchStrength:category.materiality==='High'?'Strong':'Moderate',verificationStatus:'unverified'});}
    return out;
  }

  function detectAsymmetriesV2(clauses = [], source = '', precomputedPropositions = null) {
    const parties=detectPrincipalParties(source).slice(0,8);if(parties.length<2)return[];
    const propositions=Array.isArray(precomputedPropositions)?precomputedPropositions:extractLegalPropositions(clauses,source);
    const propositionsByClause=new Map();propositions.forEach(item=>{const rows=propositionsByClause.get(item.clauseId)||[];rows.push(item);propositionsByClause.set(item.clauseId,rows);});
    const out=[];
    for(const clause of clauses||[]){
      const clauseItems=propositionsByClause.get(clause.id)||[];
      for(const category of [...new Set(clauseItems.map(item=>item.concept))]){
        const items=clauseItems.filter(item=>item.concept===category);
        const isRight=item=>/^(?:may|can|is entitled to|has the right to|option)$/.test(item.modality);
        const affirmative=parties.filter(p=>items.some(item=>item.actor===p.alias&&item.polarity==='affirmative'&&isRight(item)));
        if(affirmative.length!==1)continue;
        const owner=affirmative[0];const others=parties.filter(p=>p.alias!==owner.alias);if(!others.length)continue;
        const missing=others.filter(other=>!items.some(item=>item.actor===other.alias&&item.polarity==='affirmative'&&isRight(item)));if(!missing.length)continue;
        const denied=missing.filter(other=>items.some(item=>item.actor===other.alias&&item.polarity==='prohibited'));
        const evidence=items.find(item=>item.actor===owner.alias&&item.polarity==='affirmative'&&isRight(item));
        out.push({id:`asymmetry:${clause.id}:${category}:${owner.alias}`,clauseId:clause.id,clauseLabel:clause.number||clause.heading,category,materiality:evidence?.materiality||'Medium',beneficiary:owner.alias,missingReciprocalFor:missing.map(p=>p.alias).join(', '),expresslyProhibitedFor:denied.map(p=>p.alias).join(', '),sourceExcerpt:evidence?.sourceExcerpt||excerpt(`${clause.heading}. ${clause.body}`,420),matchStrength:(evidence?.materiality||'Medium')==='High'?'Strong':'Moderate',verificationStatus:'unverified',propositionIds:items.map(item=>item.id)});
      }
    }
    return out;
  }

  function canonicalizeObligationParty(value, source = '') {
    const raw = clean(value);
    if (!raw) return 'Unspecified';
    if (/^parties$/i.test(raw)) return 'Both parties';
    if (/^party$/i.test(raw)) return 'Either party';
    const principals = detectPrincipalParties(source);
    const exact = principals.find(p => p.alias.toLowerCase() === raw.toLowerCase() || p.name.toLowerCase() === raw.toLowerCase());
    if (exact) return exact.alias;
    const supplier = principals.find(p => /supplier|vendor|service provider/i.test(p.alias));
    if (supplier && /^(?:supplier|service provider|vendor|provider)$/i.test(raw)) return supplier.alias;
    if (/^supplier$/i.test(raw)) return 'Supplier';
    if (/^service provider$/i.test(raw)) return supplier?.alias || 'Supplier';
    return raw;
  }

  function isStrongNumberedClauseHeading(text, parsedNumber = '') {
    const line = clean(text);
    const number = clean(parsedNumber);
    return /^(?:(?:Article|Section|Clause)\s+[A-Z0-9.-]+|(?:Schedule|Annex(?:ure)?|Exhibit|Appendix)\s+[A-Z0-9.-]+|\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*(?:[.)])?)\s+/i.test(line)
      || /^(?:(?:Article|Section|Clause|Schedule|Annex(?:ure)?|Exhibit|Appendix)\b|\d+(?:\.\d+)*(?:[a-z])?(?:\([a-z0-9ivx]+\))*)/i.test(number);
  }

  function shouldStartStyledClause(text, parsedNumber = '', operative = false) {
    return !operative || isStrongNumberedClauseHeading(text, parsedNumber);
  }

  function classifyNumberedSourceIntegrity(paragraphRecords = [], clauses = []) {
    const numbered = paragraphRecords.filter(record => ['direct','style'].includes(record?.numberingSource));
    const strong = numbered.filter(record => {
      const value = clean(record.text);
      const number = clean(record.numberingPrefix || value.match(/^((?:Article|Section|Clause)\s+[A-Z0-9.-]+|\d+(?:\.\d+)*)/i)?.[1] || '');
      const level = Number(record.numberingLevel ?? 0);
      return Number(record.headingLevel || 0) > 0
        || /^(?:Article|Section|Clause|Schedule|Annex(?:ure)?|Exhibit|Appendix)\b/i.test(value)
        || (/^\d+(?:\.\d+)*\b/.test(number) && level <= 1);
    });
    const nested = numbered.filter(record => !strong.includes(record));
    const representedKeys = new Set((clauses || []).flatMap(clause => [
      clean(clause.number).toLowerCase(),
      String(clause.sourceOrder ?? '')
    ]).filter(Boolean));
    const representedStrong = strong.filter(record => {
      const prefix = clean(record.numberingPrefix || record.text?.match(/^((?:Article|Section|Clause)\s+[A-Z0-9.-]+|\d+(?:\.\d+)*)/i)?.[1] || '').toLowerCase();
      return representedKeys.has(prefix) || representedKeys.has(String(record.sourceOrder ?? ''));
    });
    const missingStrong = Math.max(0, strong.length - representedStrong.length);
    const noReviewable = strong.length > 0 && !(clauses || []).some(clause => clause.reviewable !== false && !clause.isDocumentTitle);
    return {
      status: missingStrong > 0 || noReviewable ? 'degraded' : 'normal',
      recoveredNumbered: numbered.length,
      strongBoundaryCandidates: strong.length,
      representedStrongBoundaries: representedStrong.length,
      nestedNumberedItems: nested.length,
      missingStrongBoundaries: missingStrong,
      requiresConfirmation: missingStrong > 0 || noReviewable
    };
  }

  function extractClauseLocalEvidence(clauses = []) {
    const concepts = detectLegalConcepts(clauses);
    const evidence = { indemnities: [], dispute: [] };
    const add = (bucket, clause, rule, excerptText, value, matchStrength = 'Strong') => {
      if (!clause || !excerptText) return;
      if (evidence[bucket].some(item => item.clauseId === clause.id && item.rule === rule)) return;
      evidence[bucket].push({
        value,
        sourceClauseId: clause.id || '',
        sourceLabel: clean(`${clause.number || ''} ${clause.heading || ''}`),
        sourceExcerpt: excerpt(excerptText, 360),
        rule,
        matchStrength,
        verificationStatus: 'unverified'
      });
    };
    concepts.byConcept.indemnity.forEach(item => {
      const clause=(clauses||[]).find(candidate=>candidate.id===item.sourceClauseId);
      if(!clause)return;
      const theme=/personal data|data protection/i.test(item.sourceExcerpt)?'Data-protection indemnity':/intellectual property|\bIP\b|infring/i.test(item.sourceExcerpt)?'IP indemnity':/tax(?:es)?|contributions?/i.test(item.sourceExcerpt)?'Tax and contributions indemnity':item.rule==='broad-general-indemnity'?'General/direct-loss indemnity':item.mechanism;
      add('indemnities',clause,item.rule,item.sourceExcerpt,theme,item.matchStrength);
      const last=evidence.indemnities[evidence.indemnities.length-1];if(last){last.evidenceType=item.evidenceType||'operative-grant';last.mechanism=item.mechanism;}
    });
    concepts.byConcept.disputeResolution.forEach(item=>{
      const clause=(clauses||[]).find(candidate=>candidate.id===item.sourceClauseId);if(!clause)return;
      add('dispute',clause,item.rule,item.sourceExcerpt,item.mechanism,item.matchStrength);
    });
    const rank={"operative-grant":0,"cap-treatment":1,"cross-reference":2,"heading-only":3};
    evidence.indemnities.sort((a,b)=>(rank[a.evidenceType]??9)-(rank[b.evidenceType]??9));
    return evidence;
  }

  function extractCommercialTermsSummary(source) {
    const raw = String(source || '');
    const text = clean(raw);
    const lower = text.toLowerCase();
    const parties = detectPrincipalParties(raw);
    const partyLabel = parties.length >= 2
      ? parties.slice(0, 8).map(p => p.name.toLowerCase() === p.alias.toLowerCase() ? p.alias : `${p.name} (${p.alias})`).join(' / ')
      : 'Not detected';
    const placeholder = pattern => raw.match(pattern)?.[1] || '';
    const effectivePlaceholder = placeholder(/(\[[^\]]*(?:starting|effective)[^\]]*(?:date|contract)[^\]]*\])/i);
    const terminationPlaceholder = placeholder(/(\[[^\]]*(?:end|termination)[^\]]*(?:date|contract)[^\]]*\])/i);
    const effectiveDate = effectivePlaceholder || raw.match(/(?:effective date|effective as of|dated as of|made on)\s*(?:is|of|:)?\s*([A-Z][a-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{4}|\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]+\s+\d{4}|\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\[[^\]]+\])/i)?.[1] || 'Not detected';
    const payment = raw.match(/(?:invoice|invoices|amounts? due)[^.\n]{0,140}?\b(?:within|payable within|due within)\s+((?:[a-z-]+\s*\(\d+\)|\d+)\s+days?)\b/i)?.[1]
      || raw.match(/payment\s+term[\s\S]{0,180}?\b((?:[a-z-]+\s*\()?\d+\)?\s+days?)\b/i)?.[1]
      || raw.match(/\b((?:[a-z]+\s*\()?\d+\)?\s+days?)\b[^.\n]{0,110}(?:invoice|payment|payable)/i)?.[1];
    const confidentiality = /effective date.{0,100}five\s*\(5\)\s*years\s+thereafter/i.test(text)
      ? 'Five (5) years from the Effective Date.'
      : excerpt(raw.match(/[^.\n]{0,120}(?:confidential|non-disclosure)[^.\n]{0,220}\b\d+\s+years?[^.\n]{0,100}/i)?.[0] || '') || 'Not detected';
    const expressCap = raw.match(/in no event shall\s+([A-Z][A-Za-z0-9 .&'\-]{1,100}?)\s+be liable[^.\n]{0,260}?(?:in excess of|exceed(?:ing)?)\s+([^.\n]{3,220})/i);
    const conditionalCap = raw.match(/(?:a\s+)?cap\s+to\s+the\s+liability\s+of\s+([A-Z][A-Za-z0-9 .&'\-]{1,100}?)(?:\s+under[^.\n]{0,80})?\s+may apply only if\s+([^.\n]{3,220})/i);
    const liability = expressCap&&conditionalCap
      ? `Asymmetric: ${clean(expressCap[1])} is capped at ${clean(expressCap[2])}; a ${clean(conditionalCap[1])} cap applies only if ${clean(conditionalCap[2])}.`
      : excerpt(raw.match(/[^.\n]{0,70}(?:liability|aggregate cap|financial liability)[^.\n]{0,260}(?:shall not exceed|limited to|capped at|maximum|percentage|%)[^.\n]{0,120}/i)?.[0] || '') || 'Not detected';
    const indemnitySignals = [];
    if (/indemnif(?:y|ication)[\s\S]{0,260}contributions|claims from any authority for payment of any contributions/i.test(lower)) indemnitySignals.push('taxes and contributions');
    if (/indemnif(?:y|ication)[\s\S]{0,320}third party[^.]{0,120}(?:ipr|intellectual property|infringe)/i.test(lower)) indemnitySignals.push('third-party IP infringement');
    if (/indemnif(?:y|ication)[\s\S]{0,220}(?:personal data|data protection|section 8)/i.test(lower)) indemnitySignals.push('data-protection breach');
    if (/indemnif(?:y|ication)[\s\S]{0,300}(?:acts, omissions|breach of express|negligence of supplier)/i.test(lower)) indemnitySignals.push('Supplier acts, omissions, warranty and contract breach');
    const indemnityScope = indemnitySignals.length ? `Detected indemnity themes: ${indemnitySignals.join(', ')}.` : excerpt(raw.match(/[^.\n]{0,50}(?:indemnify|indemnification|hold harmless)[^.\n]{0,260}/i)?.[0] || '') || 'Not detected';
    const deliverableOwner=raw.match(/ownership of any Intellectual Property Rights in such Deliverables shall be vested in\s+([A-Z][A-Za-z0-9 .&'\-]{1,100})/i)?.[1];
    const backgroundOwner=raw.match(/Intellectual Property Rights owned or controlled by\s+([A-Z][A-Za-z0-9 .&'\-]{1,100}?)\s+before[^.\n]{0,180}remain the ownership of/i)?.[1];
    const licenceRecipient=raw.match(/(?:worldwide[^.\n]{0,100}perpetual|perpetual[^.\n]{0,100}worldwide)\s+licen[cs]e[^.\n]{0,100}?\s+to\s+([A-Z][A-Za-z0-9 .&'\-]{1,100})/i)?.[1];
    const ipOwnership=deliverableOwner
      ? `Deliverable IP vests in ${clean(deliverableOwner)}${backgroundOwner?`; ${clean(backgroundOwner)} retains Background IP${licenceRecipient?` and grants ${clean(licenceRecipient)} a worldwide, perpetual licence`:''}`:''}.`
      : excerpt(raw.match(/[^.\n]{0,90}(?:intellectual property|background ip|deliverables)[^.\n]{0,260}(?:vest(?:ed)? in|retain(?:s|ed)?|own(?:s|ed)?|assign(?:s|ed)?)[^.\n]{0,100}/i)?.[0] || '') || 'Not detected';
    const partyTokens = parties.flatMap(p => [p.alias, p.name]).filter(Boolean).sort((a,b)=>b.length-a.length);
    const partyPattern = partyTokens.length ? partyTokens.map(value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') : '[A-Z][A-Za-z0-9 .&\'\\-]{1,80}';
    const processingParty = raw.match(new RegExp(`Where\\s+(${partyPattern})(?=[,;:.\\s])[^.\\n]{0,160}\\bProcesses?\\s+Personal Data`, 'i'))?.[1];
    const behalfParty = raw.match(/on behalf of(?:\s+and\s+for\s+the\s+benefit\s+of)?\s+([A-Z][A-Za-z0-9 .&'\-]{1,80}?)(?:\s*[,;(]|\s+and\s+\()/i)?.[1];
    const instructionParty = raw.match(/in accordance with\s+([A-Z][A-Za-z0-9 .&'\-]{1,80}?)[’']s\s+instructions/i)?.[1];
    const dataRole = processingParty&&(behalfParty||instructionParty)
      ? `${clean(processingParty)} processes Personal Data on behalf of and under ${clean(instructionParty||behalfParty)}'s instructions (processor-like role; labels are not explicit).`
      : excerpt(raw.match(/[^.\n]{0,90}(?:data processor|data controller|process(?:es|ing)? personal data on behalf of|documented instructions)[^.\n]{0,230}/i)?.[0] || '') || 'Not detected';
    const disputeArbitration=raw.match(/[^.\n]{0,180}(?:dispute|controversy|claim|courts?|jurisdiction|option)[\s\S]{0,900}(?:arbitration|SIAC|LCIA|ICC|DIAC)[^.\n]{0,320}/i)?.[0]||'';
    const courtForum=raw.match(/[^.\n]{0,120}(?:exclusive jurisdiction|courts? of|jurisdiction of)[^.\n]{0,300}/i)?.[0]||'';
    const arbitrationForum=/\bICC\b|International Chamber of Commerce/i.test(disputeArbitration)?'ICC arbitration':/\bSIAC\b/i.test(disputeArbitration)?'SIAC arbitration':/\bLCIA\b/i.test(disputeArbitration)?'LCIA arbitration':/\bDIAC\b/i.test(disputeArbitration)?'DIAC arbitration':'';
    const optionalForum=/\b(?:option|may elect|at its discretion)\b/i.test(`${courtForum} ${disputeArbitration}`)&&/\bcourts?\b/i.test(`${courtForum} ${disputeArbitration}`)&&/\b(?:arbitration|ICC|SIAC|LCIA|DIAC)\b/i.test(disputeArbitration);
    const dispute = disputeArbitration
      ? `${optionalForum?'Asymmetric forum option; ':''}${arbitrationForum?`${arbitrationForum}: `:''}${excerpt([courtForum,disputeArbitration].filter(Boolean).join(' · '),360)}`
      : excerpt(raw.match(/[^.\n]{0,90}(?:exclusive jurisdiction|courts? of(?!\s+Auditors))[^.\n]{0,260}/i)?.[0] || '') || 'Not detected';
    const governingFixed = clean(raw.match(/(?:governed by(?: and construed in accordance with)? the laws of|laws of)\s+([A-Za-z &]+)(?:[.,;\n]|\s+and)/i)?.[1] || '');
    const governingVariable = excerpt(raw.match(/[^.\n]{0,80}(?:governed by|applicable law)[^.\n]{0,260}(?:ordering|relevant|applicable)\s+(?:entity|party|customer)[^.\n]{0,100}/i)?.[0] || '');
    const governing = governingFixed || governingVariable || 'Not detected';
    const assignment = excerpt(raw.match(/[^.\n]{0,70}(?:shall not|may not|must not)[^.\n]{0,100}(?:assign|transfer|pledge)[^.\n]{0,190}(?:consent|approval)[^.\n]{0,90}/i)?.[0] || '') || 'Not detected';
    const initialTerm = /shall end by operation of law.{0,220}last of the services have been delivered.{0,120}accepted and paid/i.test(text)
      ? 'From the Effective Date until the last Service is delivered, accepted and paid; Annex 1 supplies the planned dates.'
      : excerpt(raw.match(/initial term[^.\n]{0,120}\b(?:(?:one|two|three|four|five|six|seven|eight|nine|ten)\s*\(\d+\)|\d+)\s+(?:months?|years?)/i)?.[0] || '') || 'Not detected';

    return {
      parties: partyLabel,
      effectiveDate: clean(effectiveDate),
      terminationDate: clean(terminationPlaceholder) || 'Not detected',
      initialTerm,
      renewal: excerpt(raw.match(/(?:auto(?:matic)? renewal|renew(?:al)? term|renews? automatically|mutual written agreement[^.\n]{0,60}renew)[^.\n]{0,120}/i)?.[0] || '') || 'Not detected',
      terminationNotice: excerpt(raw.match(/(?:terminate|termination)[^.\n]{0,100}\b(?:(?:one|two|three|four|five|six|seven|eight|nine|ten|fifteen|thirty|sixty|ninety)\s*\(\d+\)|\d+)\s+days?'?\s+(?:written\s+)?notice|\b(?:(?:one|two|three|four|five|six|seven|eight|nine|ten|fifteen|thirty|sixty|ninety)\s*\(\d+\)|\d+)\s+days?'?\s+(?:written\s+)?notice[^.\n]{0,80}terminate/i)?.[0] || '') || 'Not detected',
      confidentialityTerm: confidentiality,
      paymentTerms: payment ? clean(payment) : 'Not detected',
      liabilityCap: liability,
      indemnityScope,
      ipOwnership,
      dataProcessingRole: dataRole,
      governingLaw: governing,
      disputeResolution: dispute,
      assignmentRestriction: assignment,
      forceMajeure: /force majeure|act of god/i.test(text) ? 'Present' : 'Not detected'
    };
  }

  root.ContractCockpitAnalysis = Object.freeze({
    assessOperativeAssertion,
    assessDefinedTermCandidate,
    buildSourceBlocks,
    canonicalizeObligationParty,
    classifyNumberedSourceIntegrity,
    detectPrincipalParties,
    detectExecutionBoundary,
    excerpt,
    extractClauseLocalEvidence,
    extractObligationEvidence,
    extractCommercialTermsSummary,
    extractLegalPropositions,
    findDefinedTermCaseDrift,
    detectAsymmetries: detectAsymmetriesV2,
    detectSubjectiveStandards,
    detectLegalConcepts,
    isStrongNumberedClauseHeading,
    objectiveRiskFloor,
    resolveStyleNumbering,
    shouldStartStyledClause
  });
})(globalThis);
