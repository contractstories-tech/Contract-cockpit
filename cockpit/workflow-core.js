(function (global) {
  'use strict';

  const ADMIN_FIELD_RE = /^(?:name|phone|telephone|mobile|fax|e-?mail|contact(?:\s+person)?|address|registered\s+office|attention)\s*:/i;
  const SIGNATURE_RE = /^(?:signatures?|signed\s+by|for\s+and\s+on\s+behalf\s+of|authori[sz]ed\s+signator(?:y|ies))\s*:?$/i;
  const PARTY_CONTACT_RE = /^for\s+[^:]{1,80}:\s*for\s+/i;
  const DOCUMENT_TITLE_RE = /^(?:(?:mutual|bilateral|unilateral|master|framework|standard|form\s+of)\s+)*(?:services?|software\s+(?:as\s+a\s+service|subscription)|saas|non[- ]disclosure|confidentiality|data\s+(?:processing|protection)|employment|licen[cs]e|lease|statement\s+of\s+work|sow|consulting|supply|distribution|reseller|partnership|staff\s+augmentation|outsourcing|managed\s+services?)\s+agreement(?:\s+(?:template|draft|form))?$/i;

  function normalizedHeading(clause) {
    return String(clause?.heading || '').replace(/\s+/g, ' ').trim();
  }

  function classifyReviewability(clause) {
    if (!clause || !clause.id || clause.id === '__overview__') return { reviewable: false, requiresDecision: false, reason: 'system', confidence: 'high' };
    if (clause.reviewable === false) return { reviewable: false, requiresDecision: false, reason: 'marked-excluded', confidence: 'high' };
    const heading = normalizedHeading(clause);
    const body = String(clause.body || '').replace(/\s+/g, ' ').trim();
    if (!heading && !body) return { reviewable: false, requiresDecision: false, reason: 'empty', confidence: 'high' };
    if (ADMIN_FIELD_RE.test(heading) || PARTY_CONTACT_RE.test(heading)) return { reviewable: false, requiresDecision: false, reason: 'administrative-field', confidence: 'high' };
    if (SIGNATURE_RE.test(heading) || /^(?:signature\s+page|execution\s+page)$/i.test(heading)) return { reviewable: false, requiresDecision: false, reason: 'signature-block', confidence: 'high' };
    if (/^for\s+.{2,100}:?$/i.test(heading) && /\b(?:name|title|signature|date|authori[sz]ed signatory)\s*:/i.test(body)) return { reviewable: false, requiresDecision: false, reason: 'party-signature-block', confidence: 'high' };
    if (DOCUMENT_TITLE_RE.test(heading)) return { reviewable: false, requiresDecision: false, reason: 'document-title', confidence: 'high' };
    const firstSourceBlock = Number(clause.sourceOrder || 0) <= 1;
    const titleLanguage = /\b(?:agreement|addendum|contract|terms\s+and\s+conditions|statement\s+of\s+work|schedule)\b/i.test(heading);
    const titleShape = heading.length <= 120 && (!body || body.length <= 80) && (/^[A-Z0-9 &\-/(),.]+$/.test(heading) || titleLanguage);
    const operativeLanguage = /\b(?:shall|must|will|agrees?\s+to|undertakes?\s+to|means|includes?|is\s+required\s+to)\b/i.test(`${heading} ${body}`);
    if (firstSourceBlock && titleShape && !operativeLanguage) return { reviewable: false, requiresDecision: false, reason: 'document-title-positional', confidence: 'medium' };
    if (/^(?:page\s+\d+(?:\s+of\s+\d+)?|table\s+of\s+contents|contents)$/i.test(heading)) return { reviewable: false, requiresDecision: false, reason: 'document-navigation', confidence: 'high' };
    // A structural section heading (e.g. "12. Limitation of Liability") whose own operative text lives
    // entirely in child clauses (12.1, 12.2, ...) has either no body of its own, or a body that is just
    // an echo of its heading label (ingestion sometimes copies the heading text into body rather than
    // leaving it empty — the label is not itself extra operative content). Either way there is nothing
    // here for a lawyer to legally dispose of. It stays navigable and reviewable (it is a real source
    // anchor and can carry aggregated risk from its children) but does not require its own decision.
    // A long heading gets truncated with a trailing "… (number)" while body keeps the full text, so an
    // exact-equality check alone misses those; falling back to a prefix match catches "the heading is
    // just the start of the body, truncated" without weakening the operative-language guard below.
    const headingCore = heading.replace(/\s*\([^)]*\)\s*$/, '').replace(/[…]+$/, '').replace(/[.;:]+$/, '').trim().toLowerCase();
    const bodyNormalized = body.replace(/[.;:]+$/, '').trim().toLowerCase();
    const bodyIsBareHeadingEcho = !body || bodyNormalized === headingCore || (!!headingCore && bodyNormalized.startsWith(headingCore));
    // Only a top-level section number (e.g. "12", "Article 1") is treated as structural, never a
    // sub-numbered clause (e.g. "5.1", "12.1"): a dotted number is drafted as an individual operative
    // provision far too often to exclude it on a keyword-incomplete "no operative language" heuristic.
    const isTopLevelSectionNumber = !/\d\.\d/.test(String(clause.number || ''));
    if (bodyIsBareHeadingEcho && !operativeLanguage && isTopLevelSectionNumber) return { reviewable: true, requiresDecision: false, reason: 'structural-heading', confidence: 'high' };
    return { reviewable: true, requiresDecision: true, reason: 'operative-or-uncertain', confidence: body || clause.number ? 'high' : 'medium' };
  }

  function isReviewableClause(clause) {
    return classifyReviewability(clause).reviewable;
  }

  function getReviewableClauses(clauses) {
    return (Array.isArray(clauses) ? clauses : []).filter(isReviewableClause);
  }

  function clauseRequiresDecision(clause) {
    const classification = classifyReviewability(clause);
    return !!classification.reviewable && classification.requiresDecision !== false;
  }

  function getDecisionRequiredClauses(clauses) {
    return (Array.isArray(clauses) ? clauses : []).filter(clauseRequiresDecision);
  }

  function decisionNeeds(decision) {
    const d = decision || {};
    const type = d.type || '';
    if (!type) return ['decision'];
    const missing = [];
    if (type === 'accept-with-changes' && !String(d.rationale || '').trim()) missing.push('rationale');
    if (type === 'seek-amendment') {
      if (!String(d.fallback || '').trim()) missing.push('fallback');
      if (!String(d.route || '').trim()) missing.push('route');
    }
    if (type === 'reject' && !String(d.fallback || '').trim()) missing.push('fallback');
    if (type === 'escalate') {
      if (!String(d.owner || '').trim()) missing.push('owner');
      if (!String(d.route || '').trim()) missing.push('route');
      if (!String(d.rationale || '').trim()) missing.push('rationale');
    }
    if (type === 'need-input') {
      if (!String(d.question || '').trim()) missing.push('question');
      if (!String(d.route || '').trim()) missing.push('route');
    }
    return missing;
  }

  function shouldIncludeInNegotiationPack(decision) {
    const d = decision || {};
    return !!d.includeInPack || ['accept-with-changes', 'seek-amendment', 'reject'].includes(d.type);
  }

  function nextUndecidedClauseId(clauses, decisions, currentId, visibleIds) {
    const allowed = Array.isArray(visibleIds) && visibleIds.length ? new Set(visibleIds) : null;
    const ids = getReviewableClauses(clauses).map(clause => clause.id).filter(id => !allowed || allowed.has(id));
    if (!ids.length) return null;
    const isUndecided = id => !String(decisions?.[id]?.type || '').trim();
    const currentIndex = ids.indexOf(currentId);
    if (currentIndex < 0) return ids.find(isUndecided) || null;
    return ids.slice(currentIndex + 1).find(isUndecided)
      || ids.slice(0, currentIndex).find(isUndecided)
      || null;
  }

  function aggregateDocumentRisk(riskByClause, clauses) {
    const reviewable = getReviewableClauses(clauses);
    if (!reviewable.length) return 'Low';
    const values = reviewable.map(clause => riskByClause?.[clause.id] || 'Low');
    const high = values.filter(value => value === 'High').length;
    const medium = values.filter(value => value === 'Medium').length;
    const weightedAverage = values.reduce((sum, value) => sum + (value === 'High' ? 3 : value === 'Medium' ? 2 : 1), 0) / values.length;
    if (high >= 2 || high / values.length >= 0.15 || weightedAverage >= 2.25) return 'High';
    if (high || medium / values.length >= 0.2 || weightedAverage >= 1.45) return 'Medium';
    return 'Low';
  }

  function riskDistribution(riskByClause, clauses) {
    const result = { High: 0, Medium: 0, Low: 0, Unverified: 0, total: 0 };
    for (const clause of getReviewableClauses(clauses)) {
      const value = riskByClause?.[clause.id];
      if (value === 'High' || value === 'Medium' || value === 'Low') result[value] += 1;
      else result.Unverified += 1;
      result.total += 1;
    }
    return result;
  }

  function rankExecutiveItems(items) {
    const risk = { High: 3, Medium: 2, Low: 1 };
    const priority = { High: 3, Medium: 2, Low: 1 };
    return [...(Array.isArray(items) ? items : [])].sort((a, b) => {
      const aScore = (risk[a?.inherentRisk] || 0) * 100 + (priority[a?.reviewPriority] || 0) * 10 + (a?.decisionComplete ? 0 : 5);
      const bScore = (risk[b?.inherentRisk] || 0) * 100 + (priority[b?.reviewPriority] || 0) * 10 + (b?.decisionComplete ? 0 : 5);
      return bScore - aScore || Number(a?.sourceOrder || 0) - Number(b?.sourceOrder || 0);
    });
  }

  const AUDIENCE_POLICIES = Object.freeze({
    internalLegal: Object.freeze({ label: 'Internal Legal', external: false }),
    internalBusiness: Object.freeze({ label: 'Internal Business', external: false }),
    internalLeadership: Object.freeze({ label: 'Internal Leadership', external: false }),
    externalClient: Object.freeze({ label: 'External Client / Counterparty', external: true }),
    neutralRecord: Object.freeze({ label: 'Neutral Record', external: false })
  });

  function audiencePolicy(key) {
    return AUDIENCE_POLICIES[key] || AUDIENCE_POLICIES.internalLegal;
  }

  function shouldIncludeClauseForAudience(audience, source) {
    if (audience === 'externalClient') return source?.shareWithClient === true;
    return true;
  }

  function neutralizeSpreadsheetFormula(value) {
    const text = String(value ?? '');
    return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  }

  function projectClauseForReport(preset, source) {
    const item = source || {};
    const common = {
      number: String(item.number || ''),
      heading: String(item.heading || ''),
      position: String(item.position || ''),
      inherentRisk: String(item.inherentRisk || 'Low'),
      reviewPriority: String(item.reviewPriority || 'Low'),
      shareableSummary: String(item.shareableSummary || '')
    };
    if (preset === 'client') {
      return {
        number: common.number,
        heading: common.heading,
        position: String(item.clientPosition || 'Review required'),
        shareableSummary: common.shareableSummary
      };
    }
    if (preset === 'executive') return common;
    return {
      ...common,
      fallback: String(item.fallback || ''),
      internalNote: String(item.internalNote || ''),
      counterpartyPosition: String(item.counterpartyPosition || ''),
      nextStep: String(item.nextStep || '')
    };
  }

  global.ContractCockpitWorkflow = Object.freeze({
    audiencePolicy,
    classifyReviewability,
    isReviewableClause,
    getReviewableClauses,
    clauseRequiresDecision,
    getDecisionRequiredClauses,
    decisionNeeds,
    shouldIncludeInNegotiationPack,
    nextUndecidedClauseId,
    aggregateDocumentRisk,
    riskDistribution,
    rankExecutiveItems,
    shouldIncludeClauseForAudience,
    neutralizeSpreadsheetFormula,
    projectClauseForReport
  });
})(typeof globalThis !== 'undefined' ? globalThis : this);
