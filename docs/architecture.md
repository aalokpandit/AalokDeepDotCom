# Architecture Overview

This document explains the repository structure, data fetching strategy, styling philosophy, and the key routes/data flow.

## Directory Structure (High-Level)

```
/
├── apps/
│   ├── main-site/        # Static Next.js site for aalokdeep.com + Azure Functions API
│   └── workbench/        # Dynamic Next.js showcase that reads from API at runtime
├── packages/
│   ├── ui/               # Shared UI components (RootLayout, Header, Footer, ComingSoon, NotFound)
│   ├── types/            # Shared TypeScript types (Project, API responses)
│   └── assets/           # Shared static assets source (copied to main-site/public by script)
├── scripts/              # Operational scripts (copy-assets, seed-cosmos, migrate-images)
├── docs/                 # Documentation (this file)
└── .github/workflows/    # CI/CD workflows for each app
```

Notes:
- Images reside in Azure Blob Storage (public read). Local public/images/ is ignored.
- The API lives under apps/main-site/api and serves both apps.

## Data Fetching Strategy

- main-site (Next.js App Router):
  - Static export, mostly static content with minimal env-driven values (e.g., NEXT_PUBLIC_HEADSHOT_URL)
- workbench (Next.js App Router):
  - Client Components fetch from API via `useEffect` at runtime
  - Rationale: avoid build-time coupling to API, enable dynamic content and caching from Functions layer

API Endpoints (Azure Functions, Node.js):
- GET /api/projects → list for cards (cached 1h)
- GET /api/projects/{id} → full details (cached 1h)
- POST /api/projects (admin) → create
- PATCH /api/projects/{id} (admin) → update
- POST /api/projects/{id}/upload-image-token (admin) → SAS for Blob upload

## Styling Philosophy

- Utility-first with Tailwind CSS
- Shared layout chrome via `@aalokdeep/ui` RootLayout: cream background (#FDFBF7), slate text, Header/Footer
- Workbench overrides layout centering in app/globals.css to allow long, scrollable pages
- Consistent spacing, serif headings, accessible focus rings

## Route and Data Flow Map

- main-site:
  - / → static homepage with Headshot image URL (env or local fallback)
  - /coming-soon → client component reads feature query param via `useSearchParams`
  - /404 → NotFound component (shared)

- workbench:
  - / → client component fetches GET /api/projects, renders ProjectCard grid
  - /projects/[id] → client component fetches GET /api/projects/{id}, renders details with collapsible sections

Data Flow:
1) Browser → Next.js workbench page mounts
2) useEffect fetch → Azure Functions API (SWA)
3) API → Cosmos DB (read/write), returns JSON
4) Client renders cards/details; images served from Blob Storage

## Rationale

- Keep API centralized (apps/main-site/api) to simplify auth, CORS, and deployment
- Favor client-side fetching in workbench for dynamic content and to avoid CI build dependencies on API
- Use Blob Storage for images to decouple media from code, enable updates without redeploys
- Shared UI package ensures consistent look and easy global updates
