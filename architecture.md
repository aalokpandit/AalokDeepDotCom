# Architecture Overview

## Overview
- Monorepo with npm workspaces for apps (`apps/*`) and shared packages (`packages/*`).
- UI stack: Next.js 14 App Router, Tailwind, shared RootLayout/Header/Footer from `@aalokdeep/ui`.
- Deployment: Azure Static Web Apps (one per app) with Functions for APIs.

## Data Tier
- Cosmos DB
  - Database `workbench-content`, container `projects` (project cards + detail data)
  - Database `journal-content`, container `blogs` (blog titles/summaries/tags + Markdown body + optional hero)
- Seeding: `npm run seed:cosmos` creates both databases/containers and seeds sample projects/blogs.

## API Tier (Azure Functions)
- Location: `apps/main-site/api/` (Node.js)
- Shared utilities: `shared/cosmosClient.js`, `shared/httpHelpers.js`, `shared/auth.js`, `shared/blobClient.js`.
- Endpoints (public GET cached 1h):
  - `GET /api/projects` (card fields)
  - `GET /api/projects/{id}` (full project)
  - `GET /api/blogs` (list fields only)
  - `GET /api/blogs/{id}` (full blog with Markdown body)
- Admin endpoints (auth via `x-ms-client-principal` GitHub handle `aalokpandit`): POST/PATCH projects, upload-image-token.
- CORS: aalokdeep.com, www, workbench.aalokdeep.com, journal.aalokdeep.com, localhost (dynamic allowance for dev ports).

## Storage Tier (Azure Blob)
- Account: `aalokdeepassets`
- Containers: `main-site`, `workbench`, `journal`, `gallery`
- Images are public read; uploads use SAS (projects upload token). Journal uses hero images from `journal` container (no placeholder; alt text on error).

## UI Tier
- Main Site (`apps/main-site`): static export (`out/`), uses shared UI, hosts Functions.
- Workbench (`apps/workbench`): static export; client-side fetching of projects; remotePatterns allow `*.blob.core.windows.net`.
- Journal (`apps/journal`): static export; client-side fetching of blogs; landing page shows title+summary with tag chips (OR filter); detail at `/posts/[id]` renders Markdown with optional square hero.
- Shared styling via Tailwind; RootLayout centers content unless overridden in app `globals.css`.

## CI/CD
- Deploy workflows: `azure-static-web-apps-main-site.yml`, `azure-static-web-apps-workbench.yml`, `azure-static-web-apps-journal.yml`.
- Checks workflow: `ci-checks.yml` uses path filters to lint/build only touched apps (shared changes trigger multiple).
- SWA tokens: `AZURE_STATIC_WEB_APPS_API_TOKEN_MAIN_SITE`, `..._WORKBENCH`, `..._JOURNAL`.

## Local Development
- Install: `npm install`
- Dev: `npm run dev` | `npm run dev:workbench` | `npm run dev:journal`
- Build: `npm run build` | `npm run build:workbench` | `npm run build:journal`
- Lint: `npm run lint` | `npm run lint:workbench` | `npm run lint:journal`
- API base: `NEXT_PUBLIC_API_BASE` (default `http://localhost:7071`, prod `https://aalokdeep.com`).

## Husky
- `.husky/pre-commit` runs `scripts/husky-checks.js` to lint/build only impacted apps based on staged paths. Shared package changes trigger all apps.
