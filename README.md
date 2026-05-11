# Susync (Next.js demo)

Philippine's first all-in-one property platform prototype — migrated from static HTML in [`final/`](final/) to a Next.js (JavaScript) app with **local file-based SQLite**.

## Local development

```bash
npm install
npm run db:init      # creates ./data/susync.db from db/schema.sql + db/seed.sql
npm run db:bundle    # copies DB to ./public/susync-demo.sqlite (also runs before `npm run build`)
npm run dev
```

- **UI**: Preprocessed HTML/CSS lives under [`import-data/`](import-data/) (regenerate with `node scripts/extract-final.mjs` after editing files in `final/`).
- **API**: `GET /api/properties`, `POST /api/contact` (and `GET /api/contact` for quick inspection).
- **Vercel WASM**: `prebuild` copies `sql-wasm.wasm` into `public/` so `sql.js` can open the bundled SQLite file in serverless.

## SQLite: local vs Vercel (demo)

| Environment | Reads | Writes (e.g. contact form `INSERT`) |
|-------------|-------|-------------------------------------|
| **Your machine** | `better-sqlite3` → `./data/susync.db` | Persisted in `./data/susync.db` |
| **Vercel** | `sql.js` → bundled `public/susync-demo.sqlite` (read-only in memory) | **Not persisted** — API responds with `demoReadonly: true` |

There is **no** Turso, Postgres, Supabase, or Firebase — only SQLite files and in-process `sql.js` on the serverless host.

## Terms of Service source

[`final/07_terms_of_service.html`](final/07_terms_of_service.html) was empty in the repo; content was added to match the Privacy Policy layout and Cebu contact address pattern used elsewhere.

## License / product

See static marketing copy in the app. Demo data is Cebu-only.
