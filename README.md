# Aalok Deep Pandit — Personal Monorepo

Personal website monorepo containing the main landing/resume site, dynamic engineering journal, project portfolio workbench, shared UI/types/asset packages, and a centralized Azure Functions API. Built with Next.js 15 and managed with npm workspaces.

**Requirements:** Node.js >= 18 (CI/CD workflows use Node 20)

## Live Sites

- **Main Site**: [aalokdeep.com](https://aalokdeep.com) (`apps/main-site`)
- **Workbench**: [workbench.aalokdeep.com](https://workbench.aalokdeep.com) (`apps/workbench`) — dynamic project portfolio
- **Journal**: [journal.aalokdeep.com](https://journal.aalokdeep.com) (`apps/journal`) — dynamic markdown blog

## Project Structure

```text
/
├── apps/
│   ├── main-site/              # Static Next.js site (aalokdeep.com) + /resume, /coming-soon
│   │   └── api/                # Azure Functions v4 (Node.js) API serving all apps (separate npm lockfile)
│   ├── workbench/              # Hybrid/SSR Next.js portfolio (workbench.aalokdeep.com)
│   └── journal/                # Hybrid/SSR Next.js blog (journal.aalokdeep.com)
├── packages/
│   ├── ui/                     # @aalokdeep/ui: RootLayout, Header, Footer, ComingSoon, NotFound, SocialShare
│   ├── types/                  # @aalokdeep/types: Project, Blog, and API request/response TypeScript types
│   └── assets/                 # @aalokdeep/assets: Shared static assets copied into app public folders
├── scripts/
│   ├── copy-assets.js          # Copies packages/assets/public into app public/ (runs in predev/prebuild)
│   ├── seed-cosmos.js          # Seeds workbench-content/projects from api/local.settings.json
│   ├── migrate-images-to-blob.js # Uploads local images to Azure Blob Storage using api/local.settings.json
│   └── keep-alive.sh           # Linux cron script hitting GET /api/health to reduce cold starts
├── docs/
│   └── architecture.md         # Architecture overview, data flow, and styling notes
└── .github/
    ├── dependabot.yml          # Security-only Dependabot config (root + apps/main-site/api)
    └── workflows/              # Per-app Azure SWA deploy workflows + ci-pr-checks.yml
```

## Technology Stack

- **Web Apps:** Next.js `^15.5.29` (App Router), React `^18.3.1`, TypeScript `^5.5.3`, Tailwind CSS `^3.4.4`, `lucide-react` `^0.554.0`
- **Journal Extras:** `marked` `^12.0.2`, `isomorphic-dompurify` `^2.14.0`, `@tailwindcss/typography` `^0.5.15`
- **API (`apps/main-site/api`):** Azure Functions `@azure/functions` `^4.0.0`, `@azure/cosmos` `^4.1.1`, `@azure/storage-blob` `^12.17.0`
- **Package Manager:** npm Workspaces (`apps/*`, `packages/*`; note `apps/main-site/api` is installed separately)
- **Hosting & CI/CD:** Azure Static Web Apps + GitHub Actions

## Getting Started

### Prerequisites

- Node.js >= 18 and npm (Node 20 recommended to match CI)
- Git
- Azure Functions Core Tools (optional, for running the local API via `npm start` inside `apps/main-site/api`)

### Installation

```bash
git clone https://github.com/aalokpandit/AalokDeepDotCom.git
cd AalokDeepDotCom
npm install
```

To install the Azure Functions API dependencies separately:

```bash
cd apps/main-site/api && npm ci
```

### Environment Variables

No `.env.example` or `local.settings.json.example` files are checked into the repo. The source code reads the following environment variables:

| Variable | Scope | Purpose / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_HEADSHOT_URL` | `apps/main-site` | Optional headshot image URL; defaults to `/images/AalokPanditHeadshot.png` |
| `API_BASE` | `apps/workbench`, `apps/journal` | Optional server-side API base URL override; checked before `NEXT_PUBLIC_API_BASE` |
| `NEXT_PUBLIC_API_BASE` | `apps/workbench`, `apps/journal` | Optional API base URL; defaults to `http://localhost:7071` |
| `NEXT_PUBLIC_SITE_URL_WORKBENCH` / `NEXT_PUBLIC_SITE_URL_JOURNAL` / `NEXT_PUBLIC_SITE_URL` | `apps/workbench`, `apps/journal` | Optional canonical/OG site origin fallbacks when request `host` header is absent (default `http://localhost:3000`) |
| `COSMOS_CONNECTION_STRING` | `apps/main-site/api` | Required Cosmos DB connection string (in `local.settings.json` locally) |
| `AZURE_STORAGE_CONNECTION_STRING` | `apps/main-site/api` | Required Azure Storage connection string for Blob uploads |
| `AZURE_STORAGE_ACCOUNT_NAME` | `apps/main-site/api` | Required Azure Storage account name for SAS URL generation |
| `ALLOWED_ADMIN_GITHUB_HANDLE` | `apps/main-site/api` | Optional GitHub handle for admin endpoints; defaults to `aalokpandit` |
| `NEXT_DISABLE_ESLINT` | Build/CI | Set to `1` in `verify:*` scripts and `ci-pr-checks.yml` |
| `STAGING_API_BASE` | GitHub Actions secret | Optional PR build override for `NEXT_PUBLIC_API_BASE` (defaults to `https://aalokdeep.com`) |

## Available Scripts

Run all root scripts from the repository root (`/`):

- **Dev servers:**
  - `npm run dev` — starts `apps/main-site`
  - `npm run dev:workbench` — starts `apps/workbench`
  - `npm run dev:journal` — starts `apps/journal`
- **Production builds:**
  - `npm run build` — builds static export for `apps/main-site` (`out/`)
  - `npm run build:workbench` — builds `apps/workbench`
  - `npm run build:journal` — builds `apps/journal`
- **Production start:** `npm run start`, `npm run start:workbench`, `npm run start:journal`
- **Lint:** `npm run lint` (lints `apps/main-site` only; `packages/ui` also has `lint` / `lint:fix`)
- **Verification:**
  - `npm run verify:ci` — clean install (`npm ci`)
  - `npm run verify:main` — builds `main-site` with `NEXT_DISABLE_ESLINT=1`
  - `npm run verify:api` — runs `npm ci` inside `apps/main-site/api`
  - `npm run verify:workbench` — builds `workbench` against `https://aalokdeep.com` (`NEXT_DISABLE_ESLINT=1`)
  - `npm run verify:journal` — builds `journal` against `https://aalokdeep.com` (`NEXT_DISABLE_ESLINT=1`)
  - `npm run verify:prod` — runs `verify:ci`, `verify:main`, `verify:api`, `verify:workbench`, and `verify:journal` sequentially
- **Operations:**
  - `npm run prepare` — runs `husky install`
  - `npm run seed:cosmos` — runs `scripts/seed-cosmos.js` (reads `apps/main-site/api/local.settings.json`)
  - `npm run migrate:images` — runs `scripts/migrate-images-to-blob.js` (reads `apps/main-site/api/local.settings.json`)

> **Husky pre-push hook:** `.husky/pre-push` runs the `verify:prod` equivalent checks (`npm ci`, builds all 3 apps, and installs API dependencies) before allowing a push.

## Architecture

### Data Tier: Azure Cosmos DB NoSQL
- **Databases & Containers:**
  - `workbench-content` → container `projects` (partition key `/id`)
  - `journal-content` → container `blogs` (partition key `/id`)
- **Seeding:** `npm run seed:cosmos` reads `COSMOS_CONNECTION_STRING` directly from `apps/main-site/api/local.settings.json` and seeds initial project records into `workbench-content/projects` (does not seed `journal-content/blogs`).

### API Tier: Azure Functions v4 (Node.js)
- **Location:** `apps/main-site/api/` (separate `package.json` outside root npm workspaces)
- **Endpoints:**
  - `GET /api/health` — runtime diagnostics (`COSMOS_CONNECTION_STRING` presence/length, storage config flags, Node version, SDK checks; `Access-Control-Allow-Origin: *`)
  - `GET /api/projects` — list project summary fields (cached 1h)
  - `GET /api/projects/{id}` — get full project details (cached 1h)
  - `POST /api/projects` — create project (admin auth required)
  - `PATCH /api/projects/{id}` — update project (admin auth required)
  - `POST /api/projects/{id}/upload-image-token` — generate 1h Blob SAS token for `workbench` container (`projects/{id}/{filename}`, `.jpg`/`.jpeg`/`.png`/`.gif`/`.webp`, `racwd` permissions; admin auth required)
  - `GET /api/blogs` — list blog summary fields ordered `createdAt DESC` (cached 1h)
  - `GET /api/blogs/{id}` — get full blog post (cached 1h)
- **Admin Auth:** Enforced in two layers — `apps/main-site/staticwebapp.config.json` requires `authenticated` role on write routes, and `apps/main-site/api/shared/auth.js` decodes `x-ms-client-principal` to verify `userDetails` matches `ALLOWED_ADMIN_GITHUB_HANDLE` (default `aalokpandit`).
- **CORS & Cache Headers:** Controlled in `apps/main-site/api/shared/httpHelpers.js` (not `staticwebapp.config.json`). Echoes `http://localhost:*`, `*.azurestaticapps.net`, `aalokdeep.com`, `www.aalokdeep.com`, `workbench.aalokdeep.com`, `journal.aalokdeep.com`, `localhost:3000`, and `localhost:4280` (fallback `https://aalokdeep.com`). Cacheable GET responses emit `Cache-Control: public, max-age=3600, s-maxage=3600` and `Vary: Origin, Accept-Encoding` to avoid CDN CORS cache collisions across subdomains.

### Storage & Asset Management: Azure Blob Storage
- **Account:** `aalokdeepassets` (containers such as `main-site` and `workbench`)
- **Shared Assets:** Each app's `predev` and `prebuild` scripts run `node ../../scripts/copy-assets.js`, copying `packages/assets/public` into `<cwd>/public` (or `apps/main-site/public` when run from the repo root).
- **Favicons:** `main-site` uses `/images/favicon.png`, while `workbench` and `journal` point to `https://aalokdeepassets.blob.core.windows.net/main-site/favicon.png`.
- **Gitignore Note:** `.gitignore` ignores `apps/{main-site,workbench,journal}/public/images/` and `packages/assets/public/images/`, though four legacy tracked images remain in git history.

### UI Tier: Next.js 15 Apps
- **`apps/main-site`:** Uses `output: 'export'` (`next.config.mjs`) to generate static HTML in `out/`. `/resume` currently renders `<ComingSoon />`.
- **`apps/workbench` & `apps/journal`:** Do **not** use `output: 'export'`, `generateStaticParams`, or `useEffect` data fetching. Both deploy on Azure SWA's hybrid/SSR Next.js runtime with `export const dynamic = 'force-dynamic'` on list and detail pages so Server Components render HTML per request (ensuring crawler/agent visibility) while caching API fetches via `{ next: { revalidate: 3600 } }`. List fetchers fail-soft to `[]` and detail fetchers fail-soft to `null` on API errors. Detail routes (`/projects/[id]` and `/blogs/[id]`) also export `generateMetadata` to emit per-entry `<title>`, description, `canonical`, OpenGraph, and Twitter card metadata using the live API response and incoming request host headers.
- **Journal Rendering:** `apps/journal/app/blogs/[id]/PostDetailClient.tsx` normalizes literal `\\n` sequences, parses markdown with `marked`, strips a redundant leading heading matching `post.title`, and sanitizes HTML with `isomorphic-dompurify` before rendering with `@tailwindcss/typography` (`prose`).
- **Routes & Redirects:** `workbench` redirects `/projects` → `/`; `journal` redirects `/blogs` → `/` and `/posts/[id]` → `/blogs/[id]`.
- **Styling & Shared Packages:** All three `tailwind.config.ts` files include `../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}` (excluding `node_modules`). `apps/workbench` and `apps/journal` override `RootLayout`'s centered `<main>` via `body main` rules in `globals.css` for top-aligned scrolling. Workspace apps import `@aalokdeep/ui` and `@aalokdeep/types` via root npm workspace hoisting.

## CI/CD & Deployment (Azure Static Web Apps)

| App | Domain | Workflow | Azure Token Secret | SWA Build Config |
| :--- | :--- | :--- | :--- | :--- |
| `main-site` + `api` | `aalokdeep.com` | `.github/workflows/azure-static-web-apps-main-site.yml` | `AZURE_STATIC_WEB_APPS_API_TOKEN_MAIN_SITE` | `app_location: "apps/main-site/out"`, `api_location: "apps/main-site/api"`, `skip_app_build: true` |
| `workbench` | `workbench.aalokdeep.com` | `.github/workflows/azure-static-web-apps-workbench.yml` | `AZURE_STATIC_WEB_APPS_API_TOKEN_WORKBENCH` | `app_location: "apps/workbench"`, `skip_app_build: false`, `NEXT_PUBLIC_API_BASE: https://aalokdeep.com` |
| `journal` | `journal.aalokdeep.com` | `.github/workflows/azure-static-web-apps-journal.yml` | `AZURE_STATIC_WEB_APPS_API_TOKEN_JOURNAL` | `app_location: "apps/journal"`, `skip_app_build: false`, `NEXT_PUBLIC_API_BASE: https://aalokdeep.com` |

- **Path Triggers:** Deploy workflows run on pushes to `main` matching `apps/<app>/**`, `packages/ui/**`, `packages/assets/**`, or the workflow file itself (note: changes only in `packages/types/**`, `scripts/**`, or root `package.json` do not trigger deploys).
- **PR Checks:** `.github/workflows/ci-pr-checks.yml` runs on PRs targeting `main` or `develop`, sets `NEXT_DISABLE_ESLINT=1`, builds all three Next.js apps using `secrets.STAGING_API_BASE || 'https://aalokdeep.com'`, and installs `apps/main-site/api` dependencies (`npm ci`). Azure SWA workflows also create ephemeral PR preview environments when secrets are available.
- **Dependabot:** `.github/dependabot.yml` enables security updates (`open-pull-requests-limit: 0`) for both `/` and `/apps/main-site/api`.

## Implementation Notes & Known Quirks

- **Date-Only Timezone Safety:** `ProjectDetailClient.tsx`, `PostCard.tsx`, and `PostDetailClient.tsx` append `T00:00:00` when formatting `YYYY-MM-DD` dates so negative-UTC timezones do not shift dates back by a day.
- **Keep-Alive Script:** `scripts/keep-alive.sh` is designed for a Linux cron job (`*/15 * * * *`) hitting `https://aalokdeep.com/api/health` with 500-line log rotation in `~/.local/share/aalokdeep-keepalive/keep-alive.log`.
- **Admin 401 CORS Header Gap:** `unauthorizedResponse()` in `apps/main-site/api/shared/auth.js` returns HTTP 401 without CORS headers (unlike `errorResponse()` in `httpHelpers.js`).
- **Blob SAS Helper Parameter:** `apps/main-site/api/shared/blobClient.js` passes `CONNECTION_STRING` as the second argument to `generateBlobSASQueryParameters` instead of a `StorageSharedKeyCredential` instance.
- **Header Subdomain Link:** `packages/ui/components/Header.tsx` links **Gallery** to relative `/coming-soon?feature=The+Gallery`, which only exists on `apps/main-site`.
- **Legacy / Misnamed Files:** `apps/journal/app/posts/[id]/PostDetailClient.tsx` is an unused client-fetching remnant (the route redirects to `/blogs/[id]`). `apps/workbench/app/projects/[id]/ProjectDetailClient.tsx` is actually a Server Component (no `'use client'` directive).
- **Testing & Linting:** Each app's `.eslintrc.*` sets `root: true` to avoid circular config resolution errors. There is currently no automated test suite in the monorepo.
