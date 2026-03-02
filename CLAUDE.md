# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint (js/jsx files)
```

No test runner is configured in this project.

## Environment Variables

Copy `.env` and populate all `VITE_` prefixed keys before running:

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY` — used directly in `src/lib/ai/geminiClient.js` via REST (not the SDK)

## Architecture

**Stack:** React 19 + Vite, Tailwind CSS v4 (via `@tailwindcss/vite`), React Router v7, Firebase (Auth + Firestore), Gemini 2.0 Flash (direct REST API).

### Authentication & Routing

- `AuthContext` (`src/context/AuthContext.jsx`) wraps the app with Firebase `onAuthStateChanged`. It exposes `{ user }` and blocks rendering until the auth state resolves.
- `ProtectedRoute` redirects unauthenticated users to `/`.
- Routes are defined in `App.jsx`. The root `/` redirects logged-in users to `/home`, otherwise shows `AuthPage`.
- `Layout` (`src/components/layout/Layout.jsx`) conditionally renders `Header` and `Sidebar` only when the user is logged in.

### Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `AuthPage` | Login/signup entry point |
| `/home` | `Home` | Dashboard — shows 5 most recent searched words |
| `/search` | `Search` | Search an IT term → AI explanation → auto-saved to Firestore |
| `/quiz` | `Quiz` | Select a topic → generate 3 AI quiz questions |

### Data Layer

- **Writes:** `src/lib/userWordsRepository.js` — `saveUserWord({ userId, word, explanation })` writes to the `userWords` Firestore collection.
- **Reads:** `src/hooks/useUserWordHistories.jsx` — real-time `onSnapshot` listener on `userWords` filtered by `userId`, ordered by `createdAt` desc. Returns `{ histories, loading, error }`.

### AI Layer (`src/lib/ai/`)

- `geminiClient.js` — low-level `callGemini(prompt)` function hitting the Gemini REST endpoint directly.
- `wordExplanation.js` — builds a Japanese beginner-friendly explanation prompt and calls `callGemini`.
- `quizGenerator.js` — builds a 3-question Japanese multiple-choice quiz prompt for a given topic and calls `callGemini`.
- AI functions return error strings prefixed with `エラー:` on failure (not thrown exceptions); callers check for this prefix.

### UI Components

- `src/components/ui/` — shared primitives: `Button`, `Heading`, `HeadingDetail`, `ErrorMessage`, `HistoryListItem`.
- `src/components/layout/` — `Layout`, `Header`, `Sidebar`.
- `src/components/AuthForm.jsx` and `src/components/ProtectedRoute.jsx` — auth-specific components.

### Styling

Tailwind CSS v4 is integrated as a Vite plugin (no `tailwind.config.js`). Styles are applied via utility classes directly in JSX.
