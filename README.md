# Watchlist

A generic watchlist app. It is a TypeScript monorepo: an Express JSON API, a Vite React UI, and shared entity types.

Requires Node 20 or newer.

## Setup

```bash
npm install
npm run seed
npm run dev
```

Then open the UI at http://localhost:5173. The API runs at http://127.0.0.1:3001 and is proxied through Vite as `/api`.

## Scripts

- `npm run dev` — start API and UI together
- `npm run seed` — reset SQLite and insert two sample watchlists
- `npm run build` — compile shared types, server, and client

SQLite is created at `server/data/watchlist.sqlite` on first run.

## Layout

- `shared/` — WatchList, WatchListItem, and Link types
- `server/` — Express CRUD at `/api/watchlists`
- `client/` — React pages at `/watchlists` and `/watchlists/:id`
