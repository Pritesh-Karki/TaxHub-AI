export const runtime = "nodejs";

const SYSTEM_PROMPT = `You draft short client emails for a tax advisory practice, based strictly on an already-verified, source-grounded answer that will be given to you.

Rules you must follow exactly:
1. Use ONLY the facts, figures, and sources given to you. Do not add any fact, threshold, date, or interpretation that is not already present in the provided answer and sources.
2. Write in a warm, professional, plain-English tone suitable for a client with no tax background. Avoid jargon where possible; where a statute section must be mentioned, explain what it means in a phrase.
3. Keep it short: a greeting, 2-4 sentences of substance, and a brief closing offering to discuss further. This is an email, not a memo.
4. Do not give new advice or make a recommendation beyond restating what the grounded answer already established.
5. End with a short line noting this is general information and their advisor should confirm how it applies to their specific situation.`;

export async function POST(req) {
  try {
    const { question, answer, sources } = await req.json();

    if (!answer || typeof answer !== "string") {
      return Response.json(
        { error: "A grounded answer is required to draft an email." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const sourceBlock = (sources || [])
      .map((s) => `${s.section} — ${s.title}: ${s.text}`)
      .join("\n");

    // Demo mode: no API key configured. Return a plain templated email built
    // directly from the grounded answer, rather than a natural-language draft
    // from the model, so the flow can be tried without an API key.
    if (!apiKey) {
      const demoEmail = [
        "Hi,",
        "",
        "Thanks for your question. Here's what applies based on the current guidance:",
        "",
        answer,
        "",
        "This is general information; please confirm with us how it applies to your specific situation.",
        "",
        "Best regards",
        "",
        "(Demo mode — no ANTHROPIC_API_KEY set, so this is a plain template rather than a model-drafted email.)",
      ].join("\n");
      return Response.json({ email: demoEmail, mode: "demo" });
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
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Client's original question: ${question || "(not provided)"}\n\nVerified grounded answer:\n${answer}\n\nUnderlying sources:\n${sourceBlock}\n\nDraft the client email now.`,
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
    const email = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({ email, mode: "live" });
  } catch (err) {
    return Response.json(
      { error: `Unexpected server error: ${err.message}` },
      { status: 500 }
    );
  }
}
