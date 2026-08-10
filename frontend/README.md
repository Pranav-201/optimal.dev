# CodeVault — DSA Practice Tracker

A production-ready frontend for tracking daily algorithmic practice: log solved problems, store multiple solution approaches (Brute Force → Better → Optimal) with complexity notes, time yourself, and generate spaced-repetition review summaries.

Built on the "Technical Precision System" design spec — a true-dark, developer-focused UI with Inter + JetBrains Mono typography and a teal/green/amber semantic palette.

## Stack

- **React 19** + **TypeScript**
- **Vite 8** — dev server & build
- **Tailwind CSS v4** (CSS-first `@theme`, via `@tailwindcss/vite`)
- **React Router v7**
- **lucide-react** for icons
- Local persistence via `localStorage` — no backend required

## Getting started

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Structure

```
src/
  components/   Sidebar, Topbar, Modal, DifficultyChip, MobileNav
  pages/        Dashboard, DayDetail, ProblemDetail, Revision
  lib/          types, seed data, VaultProvider (state + localStorage), utils
```

## Features

- **Dashboard** — total solved, streak, weekly breakdown by difficulty, recent day logs, add-day modal.
- **Day Detail** — per-day problem cards (difficulty, topic, time), add/delete problems.
- **Problem Detail** — tabbed Brute Force / Better / Optimal solutions with a code editor pane, live start/stop timer, time & space complexity fields, implementation notes, autosave.
- **Revision** — Daily/Weekly/Monthly range synthesis (generated locally from your logged data), mastered vs. needs-review patterns, activity overview, JSON report export, past summaries accordion.

All data is generated locally (no external API keys needed) and persisted to your browser's `localStorage`.
