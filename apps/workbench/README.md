# Workbench

A Next.js application showcasing projects, experiments, and portfolio work. Deployed at [workbench.aalokdeep.com](https://workbench.aalokdeep.com).

## Features

- **Projects Landing Page**: Display a curated list of projects with brief descriptions and preview images
- **Project Cards**: Each project shows a preview image, title, and description with a link to details
- **Detailed Project Pages**: Full project information with collapsible sections for:
  - Introduction and Motivation
  - Progress Log (dated accomplishments)
  - Live Demo Links
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Light Theme**: Consistent styling with main site using custom cream background (#FDFBF7)
- **Static Export**: Built as static HTML for deployment to Azure Static Web Apps

## Current Projects

1. **Personal Website** - The main aalokdeep.com site and monorepo architecture
2. **Classic Memory Game** - Interactive card matching game built with vanilla JavaScript

## Project Structure

```
app/
├── page.tsx              # Main workbench landing page
├── projects/
│   ├── page.tsx          # All projects listing
│   └── [id]/
│       └── page.tsx      # Individual project detail page (dynamic route)
├── layout.tsx            # Root layout with shared UI components
└── globals.css           # Global styles with layout overrides

components/
├── ProjectCard.tsx       # Card component for individual projects
├── ProjectList.tsx       # Grid component for displaying multiple projects
└── Collapsible.tsx       # Collapsible section component for project details

lib/
└── projects.ts           # Project data source with helper functions

public/
└── images/               # Project preview images
```

## Getting Started

### Installation

Install dependencies from the monorepo root:

```bash
npm install
```

### Development

Run the workbench development server:

```bash
npm run dev:workbench
```

The app will be available at `http://localhost:3000` (or the next available port).

### Building

Build the workbench for production:

```bash
npm run build:workbench
```

## Project Data Structure

Each project in `lib/projects.ts` has the following structure:

```typescript
interface ProjectData {
  id: string;                    // Unique identifier (used in URL)
  title: string;                 // Project name
  description: string;           // Short description for card display
  image: string;                 // Preview image path or URL
  imageAlt: string;             // Alt text for accessibility
  introduction: string;          // Detailed project description
  motivation: string;            // Why the project was created
  progressLog: ProgressEntry[]; // Timeline of accomplishments
  liveLink?: {                  // Optional live demo/site
    label: string;
    url: string;
  };
}

interface ProgressEntry {
  date: string;           // ISO date format (YYYY-MM-DD)
  accomplishment: string; // What was achieved
}
```

### Adding New Projects

1. Add project data to the `projects` array in `lib/projects.ts`
2. Add a preview image to `public/images/` (or use external URL)
3. The project will automatically appear on the landing page
4. Detail page will be available at `/projects/[your-project-id]`

## Deployment

The workbench is deployed via GitHub Actions to Azure Static Web Apps:

- **Workflow**: `.github/workflows/azure-static-web-apps-workbench.yml`
- **Triggers**: Changes to `apps/workbench/**`, `packages/ui/**`, or `packages/assets/**`
- **Domain**: [workbench.aalokdeep.com](https://workbench.aalokdeep.com)

The workflow builds the app and deploys the static output when changes are merged to `main`.

## Future Enhancements

- Database integration for storing project data
- CMS integration for managing projects
- Automated summary generation for project updates
- RSS feed for project updates
- Search and filtering capabilities
- Tags/categories for projects
- Comments or feedback system

## Technology Stack

- **Next.js 14**: React framework with App Router and static export
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for UI elements
- **React Server Components**: Default for better performance (client components where needed)

## Notes

- Uses shared UI components from `@aalokdeep/ui` package (Header, Footer, RootLayout)
- Images are optimized with Next.js Image component (unoptimized mode for static export)
- Project detail pages use `generateStaticParams()` for pre-rendering at build time
- CSS overrides in `globals.css` adjust the shared layout for proper content flow
