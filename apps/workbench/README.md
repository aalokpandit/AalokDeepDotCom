# Workbench

A Next.js application showcasing projects, experiments, and portfolio work.

## Features

- **Projects Landing Page**: Display a curated list of projects with brief descriptions
- **Project Cards**: Each project shows a preview image, title, and description with a link to details
- **Detailed Project Pages**: Full project information with collapsible sections for:
  - Introduction and Motivation
  - Progress Log (dated accomplishments)
  - Live Demo Links
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Dark Mode Support**: Built-in dark mode compatibility

## Project Structure

```
app/
├── page.tsx              # Main workbench landing page
├── projects/
│   ├── page.tsx          # All projects listing (optional)
│   └── [id]/
│       └── page.tsx      # Individual project detail page
├── layout.tsx            # Root layout with shared UI
└── globals.css           # Global styles

components/
├── ProjectCard.tsx       # Card component for individual projects
├── ProjectList.tsx       # Grid component for displaying multiple projects
└── Collapsible.tsx       # Collapsible section component for project details
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

Each project should have the following structure:

```typescript
interface ProjectDetail {
  id: string;
  title: string;
  introduction: string;
  motivation: string;
  progressLog: Array<{
    date: string;           // ISO date format (YYYY-MM-DD)
    accomplishment: string;
  }>;
  liveLink?: {
    label: string;
    url: string;
  };
}
```

## Future Enhancements

- Database integration for storing project data
- CMS integration for managing projects
- Automated summary generation for project updates
- RSS feed for project updates
- Search and filtering capabilities
- Tags/categories for projects
- Comments or feedback system

## Technology Stack

- **Next.js 14+**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hooks**: State management (useState, useContext)

## Notes

- Images should be optimized and placed in the `public/` directory
- The project detail page template uses sample data - replace with actual data fetching
- The workbench app uses static export (`output: 'export'` in next.config.mjs)
