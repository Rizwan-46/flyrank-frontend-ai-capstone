# Pet Care Management — Capstone Project

A web app for pet owners to keep track of their pets' vaccinations, medical history, and vet appointments — all in one place, with an AI assistant that can answer questions about your pets' health.

**Live site:** https://pet-care-flyrank-fe-capstone.netlify.app/
**Code:** https://github.com/Rizwan-46/flyrank-frontend-ai-capstone

---

## What this app does

- **Sign up / log in** — simple demo authentication, no real backend, data lives in the browser
- **Manage pets** — add, edit, delete, search
- **Vaccinations** — track them, see which are upcoming, due today, or overdue (calculated automatically from dates, never manually set)
- **Medical records** — a timeline of vet visits for each pet
- **Appointments** — schedule and manage upcoming and past vet visits
- **Dashboard** — one page showing what needs attention across all your pets
- **AI Assistant** — a chat you can ask things like "what vaccinations does Rocky need?" — it looks up your real pet data and shows the answer as a proper visual card, not just plain text

### Demo accounts

| Email | Password |
|---|---|
| sarah@example.com | Password123 |
| james@example.com | Password123 |
| emma@example.com | Password123 |

Or just sign up with any new email — it works the same way.

---

## Screenshots

<div align="center">

<p><strong>Dashboard Overview</strong></p>
<img src="https://github.com/user-attachments/assets/b8f5763e-e81f-4a6d-a74f-3396fe29bbf6"  alt="Dashboard" width="800" />


<p><strong>Pet Profile & Medical Records</strong></p>
<img src="https://github.com/user-attachments/assets/86c16d9b-dc2e-44ab-bbdd-bcff9098b3d8"  alt="Pet Profile" width="800" />


<p><strong>AI Assistant with a Health Summary Card</strong></p>
<img  src="https://github.com/user-attachments/assets/8bb495f3-7cbb-4d65-a88c-ea3f77be5e51"  alt="AI Assistant" width="800"  />


</div>

---

## How to run this yourself

### 1. Clone it
```bash
git clone https://github.com/Rizwan-46/flyrank-frontend-ai-capstone.git
cd flyrank-frontend-ai-capstone
```

### 2. Install everything
```bash
npm install
```

### 3. Add your own environment variables

Create a file called `.env.local` in the project's root folder, and add:
```
GEMINI_API_KEY=your_key_here
```
You can get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/apikey). See the table below for what each variable does.

### 4. Run it
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

### 5. Run the tests (optional)
```bash
npm run test        # component tests (Vitest + React Testing Library)
npm run test:e2e    # one end-to-end browser test (Playwright)
```

---

## Environment variables

| Variable | Required? | What it does |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your personal Gemini API key. Without this, the AI Assistant won't work — everything else in the app still works fine. |
| `GEMINI_MODEL` | No | Which Gemini model to use. Defaults to `gemini-2.5-flash` if you don't set this. Google changes which models are available fairly often — check [Google AI Studio](https://aistudio.google.com/) for the current recommended free model. |
| `ENABLE_AI_TEST_SENTINELS` | No | Set to `false` to turn off some special test phrases used to check error handling (see below). Defaults to on — leave it unset. |

---

## Architecture overview — how it's put together

This app has **no real backend or database**. All your pet data lives in the browser using **Zustand** (a small state library) with `localStorage`, so your data is saved between visits but only exists on your own device.

```text
src/
├── app/
│   ├── (public)/           → landing, about, contact (publicly accessible)
│   ├── (auth)/             → login, signup (unauthenticated flow)
│   ├── (protected)/        → dashboard, pets, pets/[id], appointments, medical-records, ai-assistant
│   ├── api/chat/           → edge/serverless route interfacing with Gemini
│   └── layout.jsx          → root layout (theme provider, base styling)
├── components/
│   ├── ai/                 → chat interface, message bubbles, health summary card
│   ├── dashboard/          → widgets, timeline, appointment/vaccine lists, filters
│   └── ui/                 → primitive shadcn/ui buttons, dialogs, inputs
├── store/                  → Zustand client stores (persisted via localStorage)
├── schemas/                → Zod form schemas (auth, pets, appointments, medical)
├── lib/                    → utils, AI rate-limiting, Gemini tool configurations
└── tests/                  → Vitest unit/component specs & Playwright E2E suites
```

### How the AI Assistant works

The chat streams its replies token-by-token, like ChatGPT. When you ask a health question, here's what actually happens:

1. Your browser sends a snapshot of just **your own** pets' vaccination, medical, and appointment data along with your message.
2. The server hands this to Gemini, along with a tool called `getPetHealthSummary` that Gemini can choose to use.
3. If Gemini uses it, the server looks up the real numbers (vaccination counts, next appointment, recent records) and sends them back as structured data.
4. Your browser turns that into the visual health-summary card you see — not just plain text.

Since there's no database, this snapshot is sent fresh with every message and never stored on the server.

---

## Key decisions and why

- **No backend/database** — a deliberate constraint from the start. Everything uses starter data plus `localStorage`, kept simple on purpose.
- **Gemini instead of another AI provider** — free tier available, and the Vercel AI SDK made it easy to plug in.
- **Netlify instead of Vercel** — deployed here first and it worked, so no reason to switch. The AI route's `maxDuration` is set to 30 seconds, comfortably under Netlify's real 60-second limit for streaming responses.
- **Simple in-memory rate limiting** — since there's no database, this can't be a "real" distributed rate limiter. Instead, messages are capped at 2000 characters, and each visitor's IP is limited to 15 AI requests per minute. This resets if the server restarts — an honest limitation, not a claim of bulletproof protection.

### A known limitation worth being upfront about

This app uses a **personal, free-tier Gemini API key**. Google's free tier has a small daily request limit (as low as 20 requests/day depending on the model). Since this is a public demo, if several people try the AI Assistant around the same time, it's possible to hit that limit. You'll see a clear "daily AI quota reached" message if this happens — the app won't crash or fail silently, but it also can't magically create more free requests than Google allows.

---

## Testing the AI's error handling

The AI route has a few hidden test phrases (only active in this demo, not something a real attacker could easily guess or abuse) that let you see how the app handles failure, without wasting real AI usage:

- Send **`TEST_NETWORK_ERROR`** — simulates the request failing before any response starts. Shows the error banner and a working "Try Again" button.
- Send **`TEST_RATE_LIMIT`** — simulates hitting a rate limit. Shows a "too many requests" message.
- Send **`TEST_MIDSTREAM_ERROR`** — simulates the connection dropping partway through a response. The partial text that already arrived stays visible, and "Try Again" recovers cleanly.

Each of these fails once, then succeeds the next time you send it — so you can test both the failure and the recovery.

You can also click **Stop** while the AI is replying to test cancelling a response mid-stream.

---

## How AI tools built this

I built this project working conversationally with Claude (Anthropic's AI), across many focused sessions — phase by phase (auth, then pets, then vaccinations, then appointments, then the AI Assistant, then testing, then production polish), testing each part before moving to the next.

Some specific, real examples of how this went, including the mistakes:

- **Claude wrote nearly all the initial code** for each feature — Zustand stores, Zod schemas, forms, dialogs, the dashboard, and the whole AI Assistant chat interface — based on a detailed spec I gave it upfront.
- **Real bugs came up constantly, and we debugged them using actual error messages**, not guesses:
  - A UI library mismatch (the `asChild` prop, which is a different library's convention than the one this project actually uses) caused buttons to silently stop working. We found and fixed every instance by searching the codebase for it.
  - The AI SDK version installed didn't match what some older-style code assumed — this caused a hydration mismatch, a crash from a Promise not being awaited, and later a broken Send button from a mismatched prop name (`onSend` vs `onSubmit`). Each time, we checked the real installed package version instead of guessing.
  - After deploying, the app hit a real Gemini quota-exhaustion error. Claude read the actual server error logs to find the true cause, rather than assuming it was a code bug.
- **I pushed back on AI-generated suggestions myself** — at one point another AI tool suggested a "fix" that Claude disagreed with, explained clearly why the diagnosis was probably wrong (based on tests we'd already written proving the original code was correct), and I went with that reasoning instead of blindly applying the suggested change.
- **Testing was AI-assisted too** — Claude set up Vitest, React Testing Library, and Playwright, wrote the test files, and when tests failed in CI (a Node.js version mismatch, a config collision between the two test tools), it diagnosed each failure from the real CI logs I pasted back.
- **I made the actual decisions** — what to build and in what order, when to say no to a UI idea I didn't like (I asked for calmer animations more than once until they felt right), and which trade-offs to accept (like the free-tier AI quota limitation above).

In short: Claude wrote and debugged the code, but the scope, priorities, and every "is this actually done" call were mine.

---

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4
- **UI components:** Base UI (via shadcn CLI)
- **State:** Zustand, saved to `localStorage`
- **Validation:** Zod
- **AI:** Vercel AI SDK v5 + Google Gemini
- **Testing:** Vitest, React Testing Library, Playwright
- **CI:** GitHub Actions (runs the full test suite on every push)
- **Hosting:** Netlify
