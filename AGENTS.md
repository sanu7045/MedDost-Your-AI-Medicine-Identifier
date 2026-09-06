# MedDost - AI Medicine Identifier

React + Vite + Tailwind CSS SPA with an Express backend proxy to the Google Gemini API.

## Commands

| Command              | Description                                        |
|----------------------|----------------------------------------------------|
| `npm install`        | Install dependencies                               |
| `npm run dev`        | Start Vite dev server (frontend only, port 5173)   |
| `npm run server`     | Start Express backend (API proxy, port 3001)       |
| `npm run dev:all`    | Start both frontend and backend concurrently       |
| `npm run build`      | Production build (`dist/`)                         |
| `npm run preview`    | Preview production build locally                   |
| `npm run lint`       | Run ESLint                                         |
| `npm test`           | Run Vitest test suite                              |

## Environment

The backend reads `GEMINI_API_KEY` from `.env` (see `.env.example`).
The Vite dev server proxies `/api/*` to `http://localhost:3001`.

## Notes

- The API key is used **server-side only** — it is never exposed to the browser.
- Never commit `.env` — it is covered by `.gitignore`.
