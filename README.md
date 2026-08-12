## FlyRank AI Capstone: Pet Care Management

This repository contains the Phase 1 pure JavaScript Next.js application for our Pet Care Management platform, developed as part of the FlyRank Frontend Engineering Capstone.

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** JavaScript (Pure JS, stripped of TypeScript)
* **Styling:** Tailwind CSS

## 🛠️ Project Setup & Git Recovery Log

This project underwent a complex repository migration to preserve the official capstone tracking history while safely integrating a locally built Next.js codebase.

**Key milestones achieved:**

* **Git History Preservation:** Successfully force-rewound the remote repository to the official template commit (`1a10d07`) to save the required `AGENTS.md`, `CLAUDE.md`, and `WORKFLOW.md` timelines.
* **Merge Conflict Resolution:** Resolved critical Netlify build crashes and `EJSONPARSE` errors in `package.json` caused by stray Git conflict markers (`<<<<<<< HEAD`).
* **Codebase Migration:** Manually ported the pure JavaScript local development files into the official tracked directory without overwriting the hidden `.git` folder.
* **TypeScript Purge:** Safely deleted all auto-generated Next.js TypeScript configurations (`tsconfig.json`, `next.config.ts`, `next-env.d.ts`) and `.tsx` file duplicates to enforce a strict JavaScript environment.

## 💻 Getting Started

To run the development server locally:

```bash
npm install
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
