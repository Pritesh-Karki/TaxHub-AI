// lib/knowledge.js
//
// The knowledge base: 10 real German tax law sources, broken into 17 retrievable
// chunks. Each chunk is a self-contained unit an answer can be grounded in and cited
// back to. This intentionally uses keyword retrieval rather than embeddings: at 17
// chunks, a small embedding index adds complexity and an extra API dependency without
// improving match quality over well-tuned keyword scoring.

export const KB = [
  {
    id: "estg-4-5-6b-1",
    section: "EStG §4(5) no. 6b, 6c",
    title: "Home office deduction — dedicated room",
    url: "https://www.gesetze-im-internet.de/estg/__4.html",
    text: "Expenses for a home office and its furnishings are generally not deductible, unless no other workspace is available for the activity. In that case expenses are deductible up to EUR 1,260 per year, or without ceiling if the home office is the center of the taxpayer's entire professional and business activity.",
  },
  {
    id: "estg-4-5-6c-2",
    section: "EStG §4(5) no. 6c",
    title: "Home office deduction — daily flat rate (Tagespauschale)",
    url: "https://www.gesetze-im-internet.de/estg/__4.html",
    text: "A daily flat-rate home-office allowance of EUR 6 per calendar day worked predominantly from home is available, up to EUR 1,260 per year (210 days), from assessment periods 2023 onward, even without a dedicated home office room, provided no other permanent workplace was available that day.",
  },
  {
    id: "estg-4-5-note",
    section: "EStG §4(5) — practical note",
    title: "Home office deduction — combining the two reliefs",
    url: "https://www.gesetze-im-internet.de/estg/__4.html",
    text: "The daily flat rate and the dedicated-room deduction cannot both be claimed for the same days. Taxpayers should track which days were worked from home to substantiate the Tagespauschale claim if not maintaining a qualifying dedicated room.",
  },
  {
    id: "bmf-homeoffice-1",
    section: "BMF letter, home office flat rate",
    title: "Tagespauschale — eligibility conditions",
    url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2023-01-15-steuerliche-anerkennung-erwerbsbedingte-aufwendungen-homeoffice.html",
    text: "The Tagespauschale is available per calendar day worked predominantly (more than half the day's working time) at home, with no visit that day to a permanent first place of work. It is granted per person, not per household, so two people sharing a home office may each claim it independently.",
  },
  {
    id: "bmf-homeoffice-2",
    section: "BMF letter, home office flat rate",
    title: "Tagespauschale and dedicated-room deduction — same year, different days",
    url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2023-01-15-steuerliche-anerkennung-erwerbsbedingte-aufwendungen-homeoffice.html",
    text: "The BMF confirms the Tagespauschale and the actual-cost dedicated-room deduction are mutually exclusive for the same days, but a taxpayer may use the dedicated-room deduction for days meeting its stricter center-of-activity test and the Tagespauschale for other qualifying days in the same year.",
  },
  {
    id: "ustg-19-1",
    section: "UStG §19",
    title: "Kleinunternehmerregelung — thresholds",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__19.html",
    text: "VAT is not levied on resident entrepreneurs whose turnover did not exceed EUR 25,000 in the preceding calendar year and is not expected to exceed EUR 100,000 in the current calendar year (thresholds effective 1 January 2025; prior years used EUR 22,000 and EUR 50,000).",
  },
  {
    id: "ustg-19-2",
    section: "UStG §19",
    title: "Kleinunternehmerregelung — consequences and waiver",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__19.html",
    text: "An entrepreneur applying the Kleinunternehmerregelung may not deduct input VAT and may not separately state VAT on invoices. An entrepreneur may waive the regulation by declaration to the tax office; the waiver binds them for five calendar years.",
  },
  {
    id: "bmf-ku-eu-1",
    section: "BMF letter, cross-border small business scheme",
    title: "Kleinunternehmerregelung — EU cross-border extension from 2025",
    url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/2024-12-18-anwendungsfragen-kleinunternehmerregelung.html",
    text: "From 1 January 2025, entrepreneurs resident in another EU member state may apply the German Kleinunternehmerregelung for domestic German turnover if EU-wide annual turnover does not exceed EUR 100,000 and they hold a valid small-business identification number. German small businesses can similarly supply other EU states VAT-free via BZSt registration.",
  },
  {
    id: "bmf-ku-eu-2",
    section: "BMF letter, cross-border small business scheme",
    title: "EU-wide EUR 100,000 ceiling — immediate cut-off",
    url: "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Umsatzsteuer/2024-12-18-anwendungsfragen-kleinunternehmerregelung.html",
    text: "The EU-wide EUR 100,000 ceiling for the cross-border small business scheme is a hard cap: exceeding it during the year ends eligibility immediately, from the point the threshold is crossed, rather than at the following year-end as applies to the purely domestic provision.",
  },
  {
    id: "ustg-18-1",
    section: "UStG §18(2), (2a)",
    title: "Advance VAT returns — filing frequency",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__18.html",
    text: "The advance VAT return period is the calendar quarter, becoming monthly where the preceding year's tax owed exceeded EUR 7,500. Where the preceding year's tax did not exceed EUR 2,000, the tax office may release the entrepreneur from filing advance returns entirely.",
  },
  {
    id: "ustg-18-2",
    section: "UStG §18(2a)",
    title: "Advance VAT returns — new businesses and deadlines",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__18.html",
    text: "Newly commencing entrepreneurs must file monthly advance VAT returns for the current and following calendar year regardless of turnover, through 2027 under current transitional rules. Returns are due electronically by the 10th day after the period ends; a one-month Dauerfristverlängerung extension is available on application.",
  },
  {
    id: "estg-4-3-1",
    section: "EStG §4(3)",
    title: "Cash-basis accounting (Einnahmenüberschussrechnung)",
    url: "https://www.gesetze-im-internet.de/estg/__4.html",
    text: "Taxpayers not obligated to keep books may determine profit as the surplus of operating income over operating expenses (EÜR), generally recognized under the cash-received/cash-paid principle of Section 11. Depreciable fixed assets are an exception and must be capitalized and depreciated rather than deducted in full at payment.",
  },
  {
    id: "estg-4-3-2",
    section: "EStG §4(3)",
    title: "Cash-basis accounting — threshold to switch to double-entry bookkeeping",
    url: "https://www.gesetze-im-internet.de/estg/__4.html",
    text: "Businesses must switch from cash-basis accounting to double-entry bookkeeping where annual turnover exceeds EUR 800,000 or annual profit exceeds EUR 80,000, thresholds amended by the Wachstumschancengesetz for fiscal years beginning after 31 December 2023.",
  },
  {
    id: "ustg-14-1",
    section: "UStG §14(4)",
    title: "Mandatory invoice contents",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
    text: "An invoice must contain the supplier's and recipient's name and address, the supplier's tax number or VAT ID, the issue date, a unique sequential invoice number, the description and quantity of goods or services, the date of supply, the consideration by tax rate, and the applicable tax rate and amount or a reference to an exemption.",
  },
  {
    id: "ustg-14-2",
    section: "UStG §14(4) / E-Rechnung",
    title: "Mandatory e-invoicing for domestic B2B from 2025",
    url: "https://www.gesetze-im-internet.de/ustg_1980/__14.html",
    text: "From 1 January 2025, domestic B2B transactions between resident entrepreneurs generally require a structured electronic invoice (E-Rechnung) meeting the EN 16931 standard, subject to transitional rules through 2027 permitting other formats by mutual agreement.",
  },
  {
    id: "gewstg-11-1",
    section: "GewStG §11(1)",
    title: "Trade tax allowance for sole proprietors and partnerships",
    url: "https://www.gesetze-im-internet.de/gewstg/__11.html",
    text: "Sole proprietors and partnerships are assessed for trade tax on trade income reduced by an allowance of EUR 24,500 before the rate is applied. The allowance does not apply to corporations, which are subject to trade tax from the first euro. Freelancers under Section 18 EStG are generally not subject to trade tax at all.",
  },
  {
    id: "ao-147-1",
    section: "AO §147",
    title: "Retention periods for books, records, and invoices",
    url: "https://www.gesetze-im-internet.de/ao_1977/__147.html",
    text: "Books, inventories, and annual financial statements must be retained for ten years; business letters and other tax-relevant documents for six years. Retention for accounting records (invoices, receipts) was shortened to eight years for records created from 1 January 2025 onward, with transitional rules for earlier records.",
  },
];

// Stopwords excluded from matching so generic words (e.g. "tax", "the", "how") don't
// cause false-positive matches across unrelated chunks.
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "to", "in", "on", "for", "and", "or", "as", "at", "by", "with",
  "from", "if", "it", "this", "that", "these", "those", "do", "does",
  "did", "can", "could", "should", "would", "will", "shall", "may",
  "must", "not", "no", "so", "what", "when", "where", "which", "who",
  "how", "why", "i", "my", "me", "you", "your", "we", "our", "german",
  "germany", "tax", "taxes", "taxation", "law", "about", "much", "many",
  "between", "into", "than", "also", "any", "all", "some", "other",
  "each", "such", "have", "has", "get", "give", "gets", "need",
  "needs", "there", "here", "person", "people", "someone",
]);

// Very light stemming: strips common suffixes so "invoicing"/"invoices" match
// "invoice", "deductible"/"deduction" cluster together, etc. Deliberately
// conservative to avoid over-collapsing distinct words.
function stem(word) {
  return word
    .toLowerCase()
    .replace(/(ing|ings)$/, "")
    .replace(/(ations?|ions?)$/, "")
    .replace(/(ies)$/, "y")
    .replace(/(es)$/, "")
    .replace(/(s)$/, "");
}

function tokenize(text) {
  return (text.match(/[a-zA-ZäöüÄÖÜß§0-9.]+/g) || [])
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/**
 * Retrieve the most relevant knowledge chunks for a question.
 * Scores each chunk by count of overlapping stemmed keyword tokens between
 * the query and the chunk's title + text + section, with a small bonus for
 * exact section/statute references (e.g. "§19", "UStG") since those are
 * high-signal, low-frequency terms.
 */
export function retrieve(query, { topK = 4, minScore = 2 } = {}) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const queryTokenSet = new Set(queryTokens);

  const scored = KB.map((chunk) => {
    const haystack = `${chunk.section} ${chunk.title} ${chunk.text}`;
    const chunkTokens = tokenize(haystack);
    let score = 0;

    for (const token of chunkTokens) {
      if (queryTokenSet.has(token)) score += 1;
    }

    // Bonus for direct statute/section references appearing verbatim
    // (case-insensitive), e.g. a query containing "§19" or "UStG".
    const rawQuery = query.toLowerCase();
    if (chunk.section && rawQuery.includes(chunk.section.split(" ")[0].toLowerCase())) {
      score += 2;
    }

    return { chunk, score };
  });

  return scored
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}
