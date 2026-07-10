# TaxHub — Knowledge Assistant

A grounded, source-cited Q&A assistant for German tax law, built as the "Knowledge/Wiki"
wedge of the TaxHub concept (see the investment memo and one-pager in this submission).

Ask a question in English about German tax law (Kleinunternehmerregelung, home office,
advance VAT returns, cash-basis accounting, invoice requirements, ...) and get an answer
grounded in real statute text and BMF/BZSt guidance — with the actual source excerpts shown
underneath, or an honest "not covered" if the knowledge base doesn't have the answer.

## What's real here

- **Real sources.** The 10 files in `/knowledge` are excerpts from the actual German Income
  Tax Act (EStG), VAT Act (UStG), two Federal Ministry of Finance (BMF) letters, and Federal
  Central Tax Office (BZSt) guidance — not placeholder text. Every answer traces back to a
  specific file, section, and URL.
- **Real retrieval.** `lib/knowledge.js` does keyword-based retrieval over the 10-source
  corpus (17 chunks) — no embeddings needed at this scale, tuned to catch related word forms
  without letting generic words cause false matches (see the comments in that file).
- **Real grounding.** The API route instructs the model to answer only from the retrieved
  chunks and to say so explicitly when a question falls outside the knowledge base — try
  "How much is inheritance tax between siblings?" to see the refusal path.
- **A real deploy path.** Unlike a client-only demo, the Anthropic API call happens
  server-side in `app/api/ask/route.js`, with the API key read from an environment variable
  — this is what actually lets you deploy it publicly without exposing a key in the browser.
- **A proactive output, not just Q&A.** After any grounded answer, "Draft client email from
  this answer" (`app/api/draft-email/route.js`) turns it into a short, source-grounded email
  a tax advisor could review and send — reusing the same verified answer and sources, never
  inventing new facts. This is the first step from the Knowledge layer toward the Workflow
  block described in the memo.

## Project structure

```
app/
  page.jsx               the UI (client component)
  layout.jsx             root layout
  globals.css            Tailwind entry point
  api/ask/route.js        server route: retrieval + the real Anthropic API call
  api/draft-email/route.js server route: turns a grounded answer into a client email
lib/
  knowledge.js           the 10-source knowledge base + retrieve() function
knowledge/
  01_...10_*.md          the source documents themselves, for transparency/review
```

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste a real key into .env.local
npm run dev
```

Open http://localhost:3000.

## Deploy it (Vercel, ~2 minutes)

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. In the project's Environment Variables, add `ANTHROPIC_API_KEY` with a real key from
   console.anthropic.com.
4. Deploy. That's it — no other configuration needed.

## Extending the knowledge base

Add a new markdown source to `/knowledge` for your own records, then add corresponding
chunk objects to the `KB` array in `lib/knowledge.js` (each needs `id`, `section`, `title`,
`url`, `text`). No other code changes needed — retrieval and the API route pick up new
chunks automatically.

## What this is not

This is the Knowledge/Wiki layer only — the first of the three blocks described in the
TaxHub memo (Communication Hub and Workflow are roadmap, not built here). It is not tax
advice; the disclaimer in the UI is not decorative.
