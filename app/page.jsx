"use client";

import { useState } from "react";

const EXAMPLE_QUESTIONS = [
  "Can I use the Kleinunternehmerregelung if I supply clients in other EU countries?",
  "How much can I deduct for a home office if I don't have a dedicated room?",
  "When do I need to file VAT returns monthly instead of quarterly?",
  "How much inheritance tax is owed between siblings?",
];

function SourceCard({ source, index }) {
  return (
    <div className="border border-line rounded bg-paper-raised p-4">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="font-mono text-xs text-teal tracking-wide">
          {source.section}
        </span>
        <span className="font-mono text-xs text-ink-soft">
          [{index + 1}]
        </span>
      </div>
      <h4 className="font-display text-base text-ink mb-1.5">
        {source.title}
      </h4>
      <p className="text-sm text-ink-soft leading-relaxed mb-2">
        {source.text}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-teal underline decoration-teal/40 underline-offset-2 hover:decoration-teal"
      >
        View source
      </a>
    </div>
  );
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { answer, sources, grounded }
  const [error, setError] = useState(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [emailOpen, setEmailOpen] = useState(false);

  async function handleAsk(q) {
    const finalQuestion = (q ?? question).trim();
    if (!finalQuestion || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setEmail(null);
    setEmailOpen(false);
    setSourcesOpen(false);
    setQuestion(finalQuestion);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: finalQuestion }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong asking that question.");
      } else {
        setResult(data);
        setSourcesOpen(data.grounded);
      }
    } catch (err) {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDraftEmail() {
    if (!result || emailLoading) return;
    setEmailLoading(true);
    setEmailOpen(true);

    try {
      const res = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer: result.answer,
          sources: result.sources,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setEmail({ error: data.error || "Could not draft the email." });
      } else {
        setEmail({ text: data.email });
      }
    } catch (err) {
      setEmail({ error: "Could not reach the server. Try again." });
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-14 sm:py-20">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="font-display text-3xl text-teal font-medium">
              TaxHub
            </h1>
            <span className="text-sm text-ink-soft tracking-wide">
              Knowledge Assistant
            </span>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
            Ask a question about German tax law. Every answer is grounded in
            the statute and guidance excerpts below it, or says plainly when
            the knowledge base doesn't cover it.
          </p>
        </header>

        {/* Ask box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="mb-8"
        >
          <div className="bg-paper-raised border border-line rounded-lg p-4 sm:p-5">
            <label
              htmlFor="question"
              className="block text-xs font-mono text-ink-soft mb-2 tracking-wide"
            >
              YOUR QUESTION
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              placeholder="e.g. How much can I deduct for working from home?"
              rows={3}
              className="w-full resize-none bg-transparent font-display text-lg text-ink placeholder:text-ink-soft/50 leading-snug focus:outline-none"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-ink-soft">
                Enter to ask &middot; Shift+Enter for a new line
              </span>
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-teal hover:bg-teal-dark disabled:bg-ink-soft/40 disabled:cursor-not-allowed text-paper text-sm font-medium px-5 py-2 rounded transition-colors"
              >
                {loading ? "Asking…" : "Ask"}
              </button>
            </div>
          </div>

          {!result && !loading && !error && (
            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAsk(q)}
                  className="text-xs text-ink-soft border border-line rounded-full px-3 py-1.5 hover:border-teal hover:text-teal transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Loading state */}
        {loading && (
          <div className="text-sm text-ink-soft font-mono mb-8">
            Retrieving sources and drafting an answer…
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="border border-clay/40 bg-clay-soft/40 rounded-lg p-4 mb-8 text-sm text-ink">
            {error}
          </div>
        )}

        {/* Answer */}
        {result && !loading && (
          <div className="mb-8">
            <div className="bg-paper-raised border border-line rounded-lg p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <h2 className="font-mono text-xs text-ink-soft tracking-wide">
                  ANSWER
                </h2>
                <div className="flex items-center gap-2">
                  {result.mode === "demo" && (
                    <span className="font-mono text-xs text-clay border border-clay/40 rounded-full px-2 py-0.5">
                      demo mode — no API key
                    </span>
                  )}
                  {result.grounded && (
                    <span className="font-mono text-xs text-teal">
                      grounded in {result.sources.length} source
                      {result.sources.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-display text-lg text-ink leading-relaxed whitespace-pre-wrap">
                {result.answer}
              </p>

              {result.grounded && (
                <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-3">
                  <button
                    onClick={() => setSourcesOpen((v) => !v)}
                    className="text-sm text-teal font-medium underline decoration-teal/30 underline-offset-4 hover:decoration-teal"
                  >
                    {sourcesOpen ? "Hide your work" : "Show your work"}
                  </button>
                  <button
                    onClick={handleDraftEmail}
                    disabled={emailLoading}
                    className="text-sm bg-clay hover:bg-clay/90 disabled:bg-ink-soft/40 text-paper font-medium px-4 py-1.5 rounded transition-colors ml-auto"
                  >
                    {emailLoading ? "Drafting…" : "Draft client email from this answer"}
                  </button>
                </div>
              )}
            </div>

            {/* Sources drawer */}
            {result.grounded && (
              <div className={`drawer-content ${sourcesOpen ? "open" : ""}`}>
                <div className="drawer-inner">
                  <div className="pt-4 space-y-3">
                    {result.sources.map((s, i) => (
                      <SourceCard key={s.url + i} source={s} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email drawer */}
            {emailOpen && (
              <div className="drawer-content open mt-2">
                <div className="drawer-inner">
                  <div className="pt-2">
                    <div className="border border-clay/30 bg-clay-soft/20 rounded-lg p-5">
                      <h3 className="font-mono text-xs text-ink-soft tracking-wide mb-3">
                        DRAFT CLIENT EMAIL
                      </h3>
                      {emailLoading && (
                        <p className="text-sm text-ink-soft font-mono">
                          Drafting from the verified answer above…
                        </p>
                      )}
                      {email?.error && (
                        <p className="text-sm text-ink">{email.error}</p>
                      )}
                      {email?.text && (
                        <p className="font-display text-base text-ink leading-relaxed whitespace-pre-wrap">
                          {email.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer disclaimer */}
        <footer className="pt-6 border-t border-line">
          <p className="text-xs text-ink-soft leading-relaxed">
            This tool provides general information grounded in the statute and
            guidance excerpts in its knowledge base. It is not tax advice and
            does not account for your specific circumstances. Confirm
            application to any individual case with a qualified Steuerberater.
          </p>
        </footer>
      </div>
    </main>
  );
}
