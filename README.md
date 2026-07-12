# flyrank-frontend-ai-capstone

AI-assisted frontend capstone project for the [FlyRank Front-end AI Engineering](https://internship.flyrank.ai/tracks) track. This repository holds a responsive, portfolio-ready website built with React, Vite, and Tailwind CSS, using AI tools as a pair-programmer throughout development.

## Project Description

This capstone demonstrates modern front-end engineering skills through a client-ready web experience. The goal is to ship a polished, mobile-optimized site with clean layout, accessible markup, and maintainable component structure.

Typical capstone directions for this track include:

- A personal portfolio or marketing site
- An ecommerce-style storefront or product landing page
- A client-style responsive website with real-world layout constraints

The focus is on responsive execution, Tailwind-based styling, and clear ownership of the code you ship—not on framework complexity.

## Tech Stack

- **React** — component-based UI
- **Vite** — fast dev server and production build tooling
- **Tailwind CSS** — utility-first styling
- **AI-assisted workflow** — Cursor, Claude, or similar tools for planning, implementation, and iteration

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool | Minimum version | Notes |
|------|-----------------|-------|
| [Node.js](https://nodejs.org/) | 18.x or later | Includes npm |
| [Git](https://git-scm.com/) | Any recent version | For cloning and version control |

Helpful background (not required on day one):

- HTML, CSS, and JavaScript fundamentals
- Basic familiarity with React components and JSX
- Comfort using an AI coding assistant for iteration and review

Verify your setup:

```bash
node --version
npm --version
git --version
```

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rizwan-46/flyrank-frontend-ai-capstone.git
   cd flyrank-frontend-ai-capstone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables (if needed)**

   Copy the example env file when one is provided:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with any API keys or configuration values your project requires. Never commit secrets to the repository.

## Usage

### Development

Start the local dev server with hot module replacement:

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`) to view the app in your browser.

### Production build

Create an optimized production build:

```bash
npm run build
```

Built assets are output to the `dist/` directory.

### Preview production build

Serve the production build locally to verify the final output:

```bash
npm run preview
```

### Linting (if configured)

```bash
npm run lint
```

## Project Structure

Expected layout once the Vite app is scaffolded:

```text
flyrank-frontend-ai-capstone/
├── public/          # Static assets served as-is
├── src/
│   ├── assets/      # Images, fonts, and other imported files
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route-level or page components
│   ├── App.jsx      # Root application component
│   └── main.jsx     # Application entry point
├── index.html       # HTML shell
├── package.json     # Dependencies and scripts
├── tailwind.config.js
└── vite.config.js
```

Adjust this structure as the capstone evolves; keep components small, reusable, and easy to review.

## Development Workflow

1. Plan the page structure and responsive breakpoints before coding.
2. Build sections incrementally—hero, navigation, content blocks, footer.
3. Use AI tools to draft components, then review and refine the output yourself.
4. Test on mobile, tablet, and desktop viewports before submission.
5. Deploy the finished site to a public URL (for example, Vercel, Netlify, or GitHub Pages) for capstone review.

## License

This project is licensed under the [MIT License](LICENSE).
