# Architecture Overview

This document explains the repository structure, data fetching strategy, API/storage design, styling conventions, and route map for `AalokDeepDotCom`.

## Directory Structure

```text
/
├── apps/
│   ├── main-site/          # Static export Next.js 15 site (aalokdeep.com) + Azure Functions v4 API
│   │   └── api/            # Node.js Functions API serving main-site, workbench, and journal
│   ├── workbench/          # Hybrid/SSR Next.js 15 project portfolio (workbench.aalokdeep.com)
│   └── journal/            # Hybrid/SSR Next.js 15 markdown blog (journal.aalokdeep.com)
├── packages/
│   ├── ui/                 # Shared UI components (RootLayout, Header, Footer, ComingSoon, NotFound, SocialShare)
│   ├── types/              # Shared TypeScript interfaces (Project, Blog, API responses)
│   └── assets/             # Shared static assets copied into app public/ directories on predev/prebuild
├── scripts/                # Operational scripts (copy-assets.js, seed-cosmos.js, migrate-images-to-blob.js, keep-alive.sh)
├── docs/                   # Architecture documentation (this file)
└── .github/workflows/      # CI/CD workflows for each app + ci-pr-checks.yml
```

Notes:
- Most media assets reside in Azure Blob Storage (`aalokdeepassets`, public read); `apps/*/public/images/` and `packages/assets/public/images/` are gitignored (with 4 legacy images still tracked).
- `apps/main-site/api` has its own `package.json` and `package-lock.json` outside root npm workspaces and serves all apps.

## Data & Rendering Strategy

- **`apps/main-site` (Next.js App Router, `output: 'export'`):**
  - Static HTML export in `out/`, using optional `NEXT_PUBLIC_HEADSHOT_URL` (falls back to `/images/AalokPanditHeadshot.png`).
- **`apps/workbench` & `apps/journal` (Next.js App Router, Hybrid/SSR):**
  - Server Components export `export const dynamic = 'force-dynamic'` so Azure SWA's SSR runtime renders HTML per request (keeping content visible to crawlers/agents).
  - Data fetchers (`apps/workbench/lib/projects.ts`, `apps/journal/lib/blogs.ts`) call `API_BASE || NEXT_PUBLIC_API_BASE` (fallback `http://localhost:7071`) with `{ next: { revalidate: 3600 } }`, failing soft to `[]` or `null` on error.
  - Detail pages (`/projects/[id]`, `/blogs/[id]`) export `generateMetadata` to emit dynamic title, description, canonical URL, OpenGraph, and Twitter card tags at request time, deriving the origin from `x-forwarded-host`/`host` and `x-forwarded-proto` headers (falling back to `NEXT_PUBLIC_SITE_URL_WORKBENCH`/`NEXT_PUBLIC_SITE_URL_JOURNAL` → `NEXT_PUBLIC_SITE_URL` → `http://localhost:3000`).

## Data, API & Storage Tiers

- **Cosmos DB NoSQL (`apps/main-site/api/shared/cosmosClient.js`):**
  - `workbench-content` database → `projects` container (partition key `/id`)
  - `journal-content` database → `blogs` container (partition key `/id`)
  - Includes a `global.crypto` WebCrypto polyfill for Node runtimes that lack it.
- **API Endpoints (Azure Functions v4, Node.js):**
  - `GET /api/health` → runtime & env diagnostics (`Access-Control-Allow-Origin: *`, also used by `scripts/keep-alive.sh`)
  - `GET /api/projects` → project card list (cached 1h)
  - `GET /api/projects/{id}` → full project details (cached 1h)
  - `POST /api/projects` (admin) → create project
  - `PATCH /api/projects/{id}` (admin) → update project
  - `POST /api/projects/{id}/upload-image-token` (admin) → 1h SAS token for `workbench` Blob container
  - `GET /api/blogs` → blog card list ordered `createdAt DESC` (cached 1h)
  - `GET /api/blogs/{id}` → full blog post (cached 1h)
- **Auth & CORS:**
  - Admin writes require `authenticated` role in `apps/main-site/staticwebapp.config.json` and matching `userDetails` in `x-ms-client-principal` (`apps/main-site/api/shared/auth.js`).
  - CORS is handled in `apps/main-site/api/shared/httpHelpers.js`, which sets `Cache-Control: public, max-age=3600, s-maxage=3600` and `Vary: Origin, Accept-Encoding` on cacheable GET responses so CDN caches do not leak `Access-Control-Allow-Origin` headers across subdomains.

## Styling & Asset Pipeline

- Utility-first Tailwind CSS `^3.4.4`; each app's `tailwind.config.ts` includes `../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}`.
- Shared layout chrome via `@aalokdeep/ui` `RootLayout`: cream background (`#FDFBF7`), slate text, `Header`/`Footer`, and `SocialShare`.
- Both `apps/workbench/app/globals.css` and `apps/journal/app/globals.css` override `RootLayout`'s centered `<main>` (`body main` `!important`) for top-aligned scrollable pages.
- `scripts/copy-assets.js` copies `packages/assets/public` into `<cwd>/public` during each app's `predev`/`prebuild` hook (or `apps/main-site/public` when invoked from repo root).

## Route Map

- **`main-site`:**
  - `/` → static homepage
  - `/resume` → currently renders shared `<ComingSoon />`
  - `/coming-soon` → reads `feature` query param via `useSearchParams`
  - `/404` → shared `NotFound`
- **`workbench`:**
  - `/` → server-rendered `ProjectCard` grid (`/projects` redirects 301 → `/`)
  - `/projects/[id]` → server-rendered project detail page with dynamic OG/Twitter/canonical metadata, collapsible sections & `SocialShare`
- **`journal`:**
  - `/` → server-rendered `JournalHomeClient` with client-side OR tag filtering (`/blogs` redirects 301 → `/`)
  - `/blogs/[id]` → server-rendered detail page with dynamic OG/Twitter/canonical metadata; `PostDetailClient` converts markdown via `marked` and sanitizes via `isomorphic-dompurify` (`/posts/[id]` redirects → `/blogs/[id]`)

## Rationale

- Centralize API endpoints under `apps/main-site/api` to simplify auth, CORS, Cosmos/Blob access, and SWA Standard-tier deployment.
- Use `force-dynamic` SSR with 1-hour revalidation and API `Cache-Control` headers so `workbench` and `journal` stay decoupled from build-time API availability while serving full HTML to crawlers.
- Store media in Azure Blob Storage to decouple image updates from app rebuilds.
- Share UI chrome and TypeScript contracts via `@aalokdeep/ui` and `@aalokdeep/types`.
