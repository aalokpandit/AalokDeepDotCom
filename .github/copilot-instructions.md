# Copilot Instructions

## Architecture Overview (3-Tier Dynamic)

**Data Tier**: Azure Cosmos DB (workbench-content database, projects container, 1000 RU/s provisioned throughput, free tier)

**API Tier**: Azure Functions Node.js runtime in `apps/main-site/api/` with endpoints:
- `GET /api/projects` (all projects, card fields, 1h cache)
- `GET /api/projects/{id}` (full details, 1h cache)
- `POST /api/projects` (admin auth: aalokpandit)
- `PATCH /api/projects/{id}` (admin auth)
- `POST /api/projects/{id}/upload-image-token` (admin auth, generates 1h SAS token for Blob upload)

**Storage Tier**: Azure Blob Storage (aalokdeepassets account, containers: main-site, workbench, journal, gallery; images are public read, SAS tokens for uploads)

**UI Tier**: Next.js 14 App Router, workbench removed `output: 'export'` for dynamic rendering, main-site uses `NEXT_PUBLIC_HEADSHOT_URL` env var (falls back to /public/images/ locally)

## Monorepo & Development

- Monorepo managed with npm workspaces; apps live in apps/ and shared packages in packages/ per [README.md](README.md).
- Primary apps: main-site (aalokdeep.com, also hosts API Functions) and workbench (workbench.aalokdeep.com, dynamic project showcase).
- main-site: Next.js 14 App Router with remotePatterns for blob.core.windows.net per [apps/main-site/next.config.mjs](apps/main-site/next.config.mjs).
- workbench: Next.js 14 App Router (removed `output: 'export'`), fetches projects dynamically from API, also has remotePatterns for blobs per [apps/workbench/next.config.mjs](apps/workbench/next.config.mjs).
- Run commands from repo root: `npm run dev`/`npm run build` target main-site; `npm run dev:workbench`/`npm run build:workbench` target workbench; scripts delegate to workspace packages in [package.json](package.json).
- Each app has predev/prebuild hooks that run [scripts/copy-assets.js](scripts/copy-assets.js) to copy shared assets from packages/assets/public into apps/main-site/public (note: destinations are fixed to main-site; adjust script if assets should reach other apps).
- Shared UI comes from @aalokdeep/ui: [packages/ui/RootLayout.tsx](packages/ui/RootLayout.tsx) wraps pages with Header/Footer, cream background (#FDFBF7) and centered main; Header includes mobile nav toggle and external links, Footer renders contact/social links with current year.
- Exported UI helpers in [packages/ui/index.tsx](packages/ui/index.tsx) include RootLayout, Header, Footer, ComingSoon, and NotFound; apps consume these instead of redefining layout chrome.
- Shared types in [packages/types/index.ts](packages/types/index.ts) define Project, ProgressLogEntry, ProjectLink, HeroImage, API response envelopes; imported by API handlers and UI pages.
- Tailwind scans app and shared UI paths per [apps/main-site/tailwind.config.ts](apps/main-site/tailwind.config.ts) and [apps/workbench/tailwind.config.ts](apps/workbench/tailwind.config.ts); keep shared component file extensions under those globs to avoid unstyled output.
- Main-site layout simply proxies to the shared RootLayout and sets metadata in [apps/main-site/app/layout.tsx](apps/main-site/app/layout.tsx); homepage content lives in [apps/main-site/app/page.tsx](apps/main-site/app/page.tsx) with hero, hub links, and Next Image headshot (uses NEXT_PUBLIC_HEADSHOT_URL env var, falls back to /images/AalokPanditHeadshot.png).
- Coming soon routing uses query param feature names via [apps/main-site/app/coming-soon/page.tsx](apps/main-site/app/coming-soon/page.tsx) and [packages/ui/ComingSoon.tsx](packages/ui/ComingSoon.tsx); preserve the Suspense wrapper when modifying.
- 404 handling reuses [packages/ui/NotFound.tsx](packages/ui/NotFound.tsx) from [apps/main-site/app/not-found.tsx](apps/main-site/app/not-found.tsx); pass children for CTA buttons.
- Workbench shares the same RootLayout via [apps/workbench/app/layout.tsx](apps/workbench/app/layout.tsx); global styles in app/globals.css override layout spacing (notably main flex centering from UI RootLayout).
- Project data is now fetched dynamically from Cosmos via API at runtime; [apps/workbench/lib/projects.ts](apps/workbench/lib/projects.ts) exports async functions getAllProjects() and getProjectById(id) with 1h caching via Next.js revalidate.
- Workbench pages are client components using useEffect to fetch projects: [apps/workbench/app/page.tsx](apps/workbench/app/page.tsx) (landing) and [apps/workbench/app/projects/[id]/page.tsx](apps/workbench/app/projects/[id]/page.tsx) (detail); no generateStaticParams needed anymore.
- Project listing grids use [apps/workbench/components/ProjectList.tsx](apps/workbench/components/ProjectList.tsx) and cards in [apps/workbench/components/ProjectCard.tsx](apps/workbench/components/ProjectCard.tsx); cards link to /projects/[id] and expect heroImage.url and heroImage.alt from API response.
- Collapsible sections for project details are implemented in [apps/workbench/components/Collapsible.tsx](apps/workbench/components/Collapsible.tsx) (client component with ChevronDown); reuse it for accordion-style content.
- Landing page copy for Workbench lives in [apps/workbench/app/page.tsx](apps/workbench/app/page.tsx); removed redundant /projects listing (301 redirect from /projects to / per next.config).
- Both apps support remote images via remotePatterns for blob.core.windows.net; images unoptimized per static export behavior.
- API output is under out/ for main-site deployments (Azure Static Web Apps); workbench is fully dynamic. Workflows trigger per-app based on path filters noted in [README.md](README.md).
- Styling conventions: utility-first Tailwind, serif headings and slate text; body background set on html by RootLayout, so avoid overriding without intent.
- No tests are present; validation relies on next build/lint from each workspace. Prefer running lint/build for the affected workspace before committing.
- When adding shared assets, place them in packages/assets/public so predev/prebuild copies them; if another app needs different destinations, extend the copy script accordingly. Images should be uploaded to Blob Storage via migrate:images script instead.
- Keep new shared components in packages/ui and re-export through index.tsx so both apps can import via @aalokdeep/ui without deep paths.
- Metadata (title/description/icons) is defined per app in app/layout.tsx files; update there rather than inside pages.
- Avoid introducing server-only APIs; API functions are Node.js serverless, not server-side rendering. main-site is exported static HTML; workbench is client-side hydrated (uses useEffect).
- Ensure new routes/components remain App Router compatible (use 'use client' directive only when hooks are needed).
- Prefer consistent CTA styling with the slate/blue palette seen in Header/Footer and Workbench links.
- If modifying navigation links, update navLinks array in [packages/ui/components/Header.tsx](packages/ui/components/Header.tsx) so all apps stay in sync.
- Keep globals.css files aligned with shared layout padding/margins; RootLayout centers children vertically, so page components often wrap content in their own main to control spacing.
- Image migration: Use `npm run migrate:images` to upload local images from apps/*/public/images/ to Blob Storage; images are .gitignore'd to keep them out of repo. Update URLs in Cosmos via PATCH /api/projects/{id} for dynamic image changes without rebuilds.
- Database seeding: Use `npm run seed:cosmos` to populate Cosmos from hardcoded seed data (useful for fresh Cosmos or local dev setup).
- API development: Handlers in apps/main-site/api/ read COSMOS_CONNECTION_STRING, AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_ACCOUNT_NAME from local.settings.json or SWA environment.
- Auth for POST/PATCH/admin endpoints: Checks x-ms-client-principal header (injected by SWA) for ALLOWED_ADMIN_GITHUB_HANDLE=aalokpandit.
- Data additions to Cosmos should use ISO date strings for progressLog entries to keep date formatting working. HeroImage requires { url, alt }; ProjectImage optionally includes caption and type.
- For 404 or coming-soon flows in new apps, reuse NotFound and ComingSoon from @aalokdeep/ui to maintain consistent UX.
- Deployment secrets and Azure Static Web App mapping are documented in [README.md](README.md); follow existing patterns when adding new apps/workflows.
- Environment variables: COSMOS_CONNECTION_STRING, AZURE_STORAGE_CONNECTION_STRING, AZURE_STORAGE_ACCOUNT_NAME, NEXT_PUBLIC_HEADSHOT_URL (main-site), API_BASE (workbench, defaults to local Functions URL).

## Maintenance & Scaling Notes

- Cosmos DB: Currently using 1000 RU/s provisioned throughput on free tier. Aggressive caching (1h) on GET endpoints reduces request volume. Monitor RU/s usage if scaling beyond 2-3 projects.
- Functions: Deployed via SWA (Standard tier required for Functions support beyond 12.5MB build limit). Cold starts may add 5-10s latency on Consumption plan; consider Premium if needed.
- Blob Storage: Public read access on containers; SAS tokens required for writes. CORS configured for localhost + production domains.
- Next.js exports: main-site exports static HTML to out/; workbench is dynamic (no export setting). Both use unoptimized images for Blob Storage compatibility.
- Git: .gitignore excludes apps/*/public/images/ and packages/assets/public/images/ to decouple images from codebase. Use migrate:images script for Blob uploads.

