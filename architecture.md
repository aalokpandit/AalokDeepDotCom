# Architecture Overview

## Overview
- Monorepo with npm workspaces for apps (`apps/*`) and shared packages (`packages/*`).
- UI stack: Next.js 14 App Router, Tailwind, shared RootLayout/Header/Footer from `@aalokdeep/ui`.
- Deployment: Azure Static Web Apps (one per app) with Azure Functions for APIs.
- **Dynamic Routing**: workbench and journal removed `output: 'export'` for runtime-fetched content (no prebuild constraints).

## Data Tier
- Cosmos DB (NoSQL)
  - Database `workbench-content`, container `projects` (project metadata, progress logs, hero images, future considerations)
  - Database `journal-content`, container `blogs` (blog metadata, Markdown body, tags, optional hero images)
- Seeding: `npm run seed:cosmos` creates both databases/containers and seeds sample data.

## API Tier (Azure Functions)
- Location: `apps/main-site/api/` (Node.js runtime)
- Shared utilities: `shared/cosmosClient.js`, `shared/httpHelpers.js`, `shared/auth.js`.
- Public endpoints (cached 1h):
  - `GET /api/projects` (list: id, title, description, heroImage)
  - `GET /api/projects/{id}` (detail: full project including progressLog, links, futureConsiderations)
  - `GET /api/blogs` (list: id, title, summary, tags, createdAt, heroImage)
  - `GET /api/blogs/{id}` (detail: full blog with Markdown body)
- Admin endpoints (auth via `x-ms-client-principal` header, requires `aalokpandit` GitHub handle):
  - `POST /api/projects` (create project)
  - `PATCH /api/projects/{id}` (update project)
  - `POST /api/projects/{id}/upload-image-token` (get SAS token for image upload)
- CORS: Dynamically allows `localhost:*`, `aalokdeep.com`, `www.aalokdeep.com`, `workbench.aalokdeep.com`, `journal.aalokdeep.com`.

## Storage Tier (Azure Blob)
- Account: `aalokdeepassets`
- Containers: `main-site`, `workbench`, `journal`, `gallery`
- Images: Public read access; uploads via SAS tokens. All images decoupled from codebase (`.gitignore` excludes `/public/images/`).
- Hero images: Rendered as square, centered, responsive (full-width mobile, 50% width desktop).

## UI Tier
- **main-site**: Static export (`output: 'export'`), static HTML to `out/`.
- **workbench**: Dynamic (no export). Client components with `useParams()` fetch projects at runtime. Hero images square/centered/responsive. Progress log dates parse locally to avoid timezone shifts. Optional "Future Considerations" section.
- **journal**: Dynamic (no export). Client components fetch blogs at runtime. Landing page lists posts with tag-based OR filtering. Detail pages render Markdown with optional square hero. Post dates parse locally. Cards styled to match workbench project tiles.
- Shared UI via `@aalokdeep/ui`: RootLayout, Header, Footer, ComingSoon, NotFound.
- Tailwind scans app and shared UI paths; all apps include remote image patterns for `*.blob.core.windows.net`.

## Routes & Redirects
- **workbench**: `/projects/[id]` (detail), `/` (landing with grid); `/projects` → `/` (301 redirect).
- **journal**: `/posts/[id]` (detail), `/` (landing with tag chips); `/posts` → `/` (301 redirect).
- **SWA**: Catch-all route with `statusCode: 404` serves custom 404.html instead of Azure default.

## CI/CD
- Workflows: `azure-static-web-apps-main-site.yml`, `azure-static-web-apps-workbench.yml`, `azure-static-web-apps-journal.yml`.
- Path-based triggers: Only rebuild affected app(s) when paths change.
- SWA tokens: `AZURE_STATIC_WEB_APPS_API_TOKEN_MAIN_SITE`, `..._WORKBENCH`, `..._JOURNAL` (GitHub secrets).
- Build env: `NEXT_PUBLIC_API_BASE=https://aalokdeep.com` set during build.
- Checks workflow (`ci-checks.yml`): Lint/build only touched apps using path filters.

## Local Development
- Install: `npm install`
- Dev: `npm run dev` (main-site), `npm run dev:workbench`, `npm run dev:journal`
- Build: `npm run build`, `npm run build:workbench`, `npm run build:journal`
- Lint: `npm run lint`, `npm run lint:workbench`, `npm run lint:journal`
- API: Runs at `http://localhost:7071` (Azure Functions emulator); set `NEXT_PUBLIC_API_BASE=http://localhost:7071` locally.
- Husky: Pre-push checks lint/build only affected workspaces.

## Key Design Decisions
1. **Dynamic routing**: workbench/journal fetch content at runtime, no prebuild constraints. New projects/posts appear instantly.
2. **Timezone-safe dates**: Progress log and blog post dates parse as local midnight to avoid off-by-one shifts.
3. **Hero image styling**: Square, centered, responsive (full-width mobile, 50% desktop) for consistency.
4. **CORS**: Dynamic allowlist includes localhost + all prod domains; no per-request config needed.
5. **Caching**: API endpoints cached 1h; UI respects `revalidate` hints for client-side fetches.
6. **404 handling**: SWA catch-all route ensures custom 404 pages serve instead of Azure defaults.
