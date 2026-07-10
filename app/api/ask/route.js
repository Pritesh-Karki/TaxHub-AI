import { retrieve } from "../../../lib/knowledge";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the TaxHub Knowledge Assistant, a grounded Q&A tool for German tax law aimed at tax advisors and their staff.

Rules you must follow exactly:
1. Answer ONLY using the source excerpts provided below. Do not use outside knowledge, even if you believe you know the answer.
2. If the provided sources do not contain enough information to answer the question, say so plainly and explicitly. Do not guess, extrapolate, or fill gaps with general tax knowledge.
3. When you do answer, write in clear, plain English suitable for a tax advisor, and reference which source(s) you drew from inline (e.g. "under UStG §19...").
4. Never state a figure, threshold, date, or percentage that does not appear in the provided sources.
5. Keep answers concise: a short direct answer followed by the necessary detail, not an essay.
6. This tool does not give tax advice; if the question requires judgment about a specific client's situation beyond what the sources state, note that a qualified Steuerberater should confirm the application to the specific facts.`;

// Builds a plain answer directly from retrieved source excerpts, with no model
// call. This is intentionally not natural prose — it's meant to show exactly
// what got retrieved and why, as a stand-in until a real API key is added.
function buildDemoAnswer(question, sources) {
  const lines = [
    `Demo mode (no ANTHROPIC_API_KEY set): here's what the retrieval step found for "${question.trim()}", shown directly rather than rewritten by the model.`,
    "",
  ];
  sources.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.section} — ${s.title}`);
    lines.push(s.text);
    lines.push("");
  });
  lines.push(
    "Add a real ANTHROPIC_API_KEY to .env.local to get an actual synthesized, plain-English answer instead of this raw excerpt list."
  );
  return lines.join("\n");
}

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return Response.json({ error: "A question is required." }, { status: 400 });
    }

    const sources = retrieve(question);

    if (sources.length === 0) {
      return Response.json({
        answer:
          "This isn't covered by the current knowledge base. The 10 sources loaded here cover the Kleinunternehmerregelung, home office deductions, advance VAT returns, cash-basis accounting, invoice requirements, trade tax allowances, and record retention. Try rephrasing, or this question may need a source added to the knowledge base.",
        sources: [],
        grounded: false,
        mode: "demo",
      });
    }

    const sourceBlock = sources
      .map(
        (s, i) =>
          `[Source ${i + 1}] ${s.section} — ${s.title}\nURL: ${s.url}\n${s.text}`
      )
      .join("\n\n");

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Demo mode: no API key configured. Skip the live model call entirely and
    // return an answer assembled directly from the retrieved source text, so
    // the retrieval and grounding logic can be tried and reviewed without any
    // API key or cost. Clearly labeled as demo mode in the response and UI.
    if (!apiKey) {
      const demoAnswer = buildDemoAnswer(question, sources);
      return Response.json({
        answer: demoAnswer,
        sources: sources.map((s) => ({
          section: s.section,
          title: s.title,
          url: s.url,
          text: s.text,
        })),
        grounded: true,
        mode: "demo",
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Question: ${question}\n\nRetrieved sources:\n\n${sourceBlock}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json(
        { error: `Anthropic API error: ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({
      answer,
      sources: sources.map((s) => ({
        section: s.section,
        title: s.title,
        url: s.url,
        text: s.text,
      })),
      grounded: true,
      mode: "live",
    });
  } catch (err) {
    return Response.json(
      { error: `Unexpected server error: ${err.message}` },
      { status: 500 }
    );
  }
}
