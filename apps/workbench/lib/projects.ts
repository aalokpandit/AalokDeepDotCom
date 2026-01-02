export interface ProgressEntry {
  date: string;
  accomplishment: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  introduction: string;
  motivation: string;
  progressLog: ProgressEntry[];
  liveLink?: {
    label: string;
    url: string;
  };
}

export const projects: ProjectData[] = [
  {
    id: 'personal-website',
    title: 'Personal Website',
    description:
      'A modern monorepo-based personal website serving as a digital portfolio and creative hub, built with Next.js and styled with Tailwind CSS.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    imageAlt: 'Personal Website Preview',
    introduction:
      'This is a full-stack personal website project that serves as my digital presence and portfolio. It is built as a monorepo containing multiple applications, including a main site, a workbench for project showcasing, and shared UI components. The site is designed to be performant, accessible, and visually appealing while maintaining clean code architecture.',
    motivation:
      'I wanted to create a flexible platform that could grow with my career and interests. Rather than building a single-purpose portfolio, I designed a monorepo structure that allows for multiple sub-applications (main site, workbench, journal, gallery) to coexist and share common styling and components. This approach provides scalability for future features while keeping the codebase organized and maintainable. Additionally, I wanted to showcase my technical skills through the implementation itself, demonstrating knowledge of modern web development practices.',
    progressLog: [
      {
        date: '2024-11-01',
        accomplishment:
          'Initialized monorepo structure with root package.json and workspace configuration. Set up main-site app with Next.js 14 and Tailwind CSS.',
      },
      {
        date: '2024-11-15',
        accomplishment:
          'Created shared UI package with common components (Header, Footer, RootLayout). Implemented responsive navigation with mobile menu.',
      },
      {
        date: '2024-12-01',
        accomplishment:
          'Designed and implemented main landing page with hero section, feature highlights, and call-to-action buttons.',
      },
      {
        date: '2024-12-10',
        accomplishment:
          'Set up coming-soon page template and integrated with header navigation for unreleased features (Journal, Gallery).',
      },
      {
        date: '2024-12-20',
        accomplishment:
          'Created workbench app structure with project showcase system including ProjectCard, ProjectList, and Collapsible components.',
      },
      {
        date: '2025-01-01',
        accomplishment:
          'Implemented project detail pages with collapsible sections for introduction, progress logging, and live demo links.',
      },
    ],
    liveLink: {
      label: 'Visit Site',
      url: 'https://aalokdeep.com',
    },
  },
  {
    id: 'classic-memory-game',
    title: 'Classic Memory Game',
    description:
      'A fun and interactive memory card matching game with multiple difficulty levels, smooth animations, and a clean interface.',
    image: '/images/memory-game-preview.png',
    imageAlt: 'Classic Memory Game Preview',
    introduction:
      'A classic memory card matching game built with vanilla JavaScript, HTML, and CSS. Players flip cards to find matching pairs, with the goal of clearing the board in the fewest moves. Features multiple difficulty levels (Easy, Medium, Hard) and responsive design that works on both desktop and mobile devices.',
    motivation:
      'This project was created to practice DOM manipulation, event handling, and CSS animations without relying on frameworks. It demonstrates clean JavaScript fundamentals and game state management. I wanted to build something fun and interactive while focusing on code quality and user experience with pure web technologies.',
    progressLog: [
      {
        date: '2024-10-01',
        accomplishment: 'Initial commit: Project setup and basic HTML structure',
      },
      {
        date: '2024-10-05',
        accomplishment: 'Implemented card flip animation and matching logic with CSS transitions',
      },
      {
        date: '2024-10-08',
        accomplishment: 'Added difficulty levels (Easy: 8 cards, Medium: 12 cards, Hard: 16 cards)',
      },
      {
        date: '2024-10-12',
        accomplishment: 'Enhanced UI with CSS Grid layout and smooth card flip animations',
      },
      {
        date: '2024-10-15',
        accomplishment: 'Added move counter and timer functionality to track player performance',
      },
      {
        date: '2024-10-18',
        accomplishment: 'Implemented game reset functionality and win condition with celebration animation',
      },
      {
        date: '2024-10-20',
        accomplishment: 'Deployed to Azure Static Web Apps at https://memorygame.aalokdeep.com',
      },
    ],
    liveLink: {
      label: 'Play Game',
      url: 'https://memorygame.aalokdeep.com',
    },
  },
];

export function getProjectById(id: string): ProjectData | undefined {
  return projects.find((p) => p.id === id);
}

export function getAllProjects(): ProjectData[] {
  return projects;
}
