# Copilot Instructions

## Quick Reference

For detailed architecture, data models, deployment, and design decisions, see [architecture.md](../../architecture.md).

## Development Guidelines

### File Organization & Imports
- Shared UI: Keep components in `packages/ui/` and re-export via [packages/ui/index.tsx](packages/ui/index.tsx). Apps import via `@aalokdeep/ui`.
- Shared types: Define in [packages/types/index.ts](packages/types/index.ts); all endpoints and UI use these.
- Tailwind: Ensure app `tailwind.config.ts` scans `packages/ui/**/*.{tsx,jsx}` so styles are included.

### Dynamic Data & API
- Project data: Fetch via `getAllProjects()` and `getProjectById(id)` from [apps/workbench/lib/projects.ts](apps/workbench/lib/projects.ts); 1h revalidate.
- Blog data: Fetch via `getAllBlogs()` and `getBlogById(id)` from [apps/journal/lib/blogs.ts](apps/journal/lib/blogs.ts); 1h revalidate.
- API base: Set `NEXT_PUBLIC_API_BASE` env var (prod: `https://aalokdeep.com`, local default: `http://localhost:7071`).
- Client components: Use `'use client'` + `useEffect` for runtime fetches; detail routes use `useParams()` for dynamic segments.

### UI Patterns
- Layout: Reuse `RootLayout` from `@aalokdeep/ui`; it centers content with cream background (#FDFBF7).
- 404/Coming Soon: Use `NotFound` and `ComingSoon` components from `@aalokdeep/ui` for consistent UX.
- Date formatting: Parse ISO date strings as local midnight (`new Date('YYYY-MM-DDTHH:mm:ss')`) to avoid timezone shifts; never use bare `new Date(dateStr)` for date-only strings.
- Hero images: Square, centered, responsive (`w-full sm:w-1/2 mx-auto aspect-square`).
- Cards: Match project tiles styling: full-height, hover:shadow-xl, hover:scale-105, with h-48 image containers.

### Cosmos DB & Content
- Progress log dates: Store as ISO strings `YYYY-MM-DD`; format locally to prevent UTC shifts.
- Hero images: Object `{ url: "https://...", alt: "text" }` (required).
- Future Considerations: Optional array of strings on projects; render as bulleted list in collapsible section.
- Seeding: Run `npm run seed:cosmos` to populate Cosmos with initial data.

### Image Management
- Storage: Azure Blob (`aalokdeepassets`), containers: `main-site`, `workbench`, `journal`.
- Codebase: `.gitignore` excludes `apps/*/public/images/` and `packages/assets/public/images/` to decouple images.
- Migration: Use `npm run migrate:images` to upload local images to Blob Storage.
- URLs: Set `NEXT_PUBLIC_HEADSHOT_URL` and blob container URLs via SWA environment.

### Admin & Auth
- POST/PATCH projects: Require `x-ms-client-principal` header with `aalokpandit` GitHub handle (set by SWA).
- Image upload tokens: `POST /api/projects/{id}/upload-image-token` returns `{ sasUrl, blobUrl }` for 1h SAS uploads.

### Testing & Validation
- No unit tests; validation via `npm run lint` + `npm run build` per app.
- Run pre-push checks locally: `npm run build` for main-site, `npm run build:workbench`, `npm run build:journal`.
- Husky pre-commit: Automatically lints/builds affected workspaces based on staged file paths.

### Deployment & Routing
- SWA static config: Catch-all route with `statusCode: 404` serves custom 404.html.
- Redirects: `/projects` → `/` (workbench), `/posts` → `/` (journal) via `next.config.mjs`.
- Path filters: Workflows trigger only on app + shared package changes; main-site also includes assets.

### Common Tasks

**Add a new project field:**
1. Update `Project` interface in [packages/types/index.ts](packages/types/index.ts).
2. Update API handlers in `apps/main-site/api/` to include/return the field.
3. Update Cosmos seed data in [scripts/seed-cosmos.js](scripts/seed-cosmos.js).
4. Update Workbench UI to display if needed.

**Add a new blog feature:**
1. Update `Blog` interface in [packages/types/index.ts](packages/types/index.ts).
2. Update API `GET /api/blogs/{id}` to return the field.
3. Update Journal UI to render the field.
4. Update seed data.

**Change hero image size/layout:**
- Modify the hero container className in component (e.g., `w-full sm:w-1/2 mx-auto aspect-square`).
- Changes apply to both workbench and journal if using consistent classes.

**Update CORS allowlist:**
- Edit `ALLOWED_ORIGINS` in [apps/main-site/api/shared/httpHelpers.js](apps/main-site/api/shared/httpHelpers.js).
- Redeploy main-site API Functions.

## See Also
- Full architecture details: [architecture.md](../../architecture.md)
- API endpoints & data models: [packages/types/index.ts](packages/types/index.ts)
- Local dev setup: [README.md](../../README.md)

