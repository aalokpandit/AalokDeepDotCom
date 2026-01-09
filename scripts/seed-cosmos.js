#!/usr/bin/env node

/**
 * Cosmos DB Seeding Script
 * Creates database, containers, and seeds initial project data
 * 
 * Usage: node scripts/seed-cosmos.js
 * Environment: Requires COSMOS_CONNECTION_STRING env var
 */

const fs = require('fs');
const path = require('path');
const { CosmosClient } = require('@azure/cosmos');

// Read connection string from local.settings.json
const localSettingsPath = path.join(__dirname, '../apps/main-site/api/local.settings.json');
let CONNECTION_STRING;

try {
  const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));
  CONNECTION_STRING = localSettings.Values?.COSMOS_CONNECTION_STRING;
} catch (error) {
  console.error('❌ Error: Could not read local.settings.json');
  console.error('   File path:', localSettingsPath);
  process.exit(1);
}

if (!CONNECTION_STRING) {
  console.error('❌ Error: COSMOS_CONNECTION_STRING not found in local.settings.json');
  process.exit(1);
}

const WORKBENCH_DATABASE_ID = 'workbench-content';
const PROJECTS_CONTAINER_ID = 'projects';
const JOURNAL_DATABASE_ID = 'journal-content';
const BLOGS_CONTAINER_ID = 'blogs';

/**
 * Project data migrated from apps/workbench/lib/projects.ts
 * Transformed to match @aalokdeep/types Project interface
 */
const projectsData = [
  {
    id: 'personal-website',
    title: 'Personal Website',
    description:
      'A modern monorepo-based personal website serving as a digital portfolio and creative hub, built with Next.js and styled with Tailwind CSS.',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      alt: 'Personal Website Preview',
    },
    detailedDescription:
      'This is a full-stack personal website project that serves as my digital presence and portfolio. It is built as a monorepo containing multiple applications, including a main site, a workbench for project showcasing, and shared UI components. The site is designed to be performant, accessible, and visually appealing while maintaining clean code architecture. I wanted to create a flexible platform that could grow with my career and interests. Rather than building a single-purpose portfolio, I designed a monorepo structure that allows for multiple sub-applications (main site, workbench, journal, gallery) to coexist and share common styling and components. This approach provides scalability for future features while keeping the codebase organized and maintainable. Additionally, I wanted to showcase my technical skills through the implementation itself, demonstrating knowledge of modern web development practices.',
    progressLog: [
      {
        date: '2024-11-01',
        description:
          'Initialized monorepo structure with root package.json and workspace configuration. Set up main-site app with Next.js 14 and Tailwind CSS.',
      },
      {
        date: '2024-11-15',
        description:
          'Created shared UI package with common components (Header, Footer, RootLayout). Implemented responsive navigation with mobile menu.',
      },
      {
        date: '2024-12-01',
        description:
          'Designed and implemented main landing page with hero section, feature highlights, and call-to-action buttons.',
      },
      {
        date: '2024-12-10',
        description:
          'Set up coming-soon page template and integrated with header navigation for unreleased features (Journal, Gallery).',
      },
      {
        date: '2024-12-20',
        description:
          'Created workbench app structure with project showcase system including ProjectCard, ProjectList, and Collapsible components.',
      },
      {
        date: '2025-01-01',
        description:
          'Implemented project detail pages with collapsible sections for introduction, progress logging, and live demo links.',
      },
    ],
    links: [
      {
        title: 'Visit Site',
        url: 'https://aalokdeep.com',
      },
    ],
  },
  {
    id: 'classic-memory-game',
    title: 'Classic Memory Game',
    description:
      'A fun and interactive memory card matching game with multiple difficulty levels, smooth animations, and a clean interface.',
    heroImage: {
      url: '/images/memory-game-preview.png',
      alt: 'Classic Memory Game Preview',
    },
    detailedDescription:
      'A classic memory card matching game built with vanilla JavaScript, HTML, and CSS. Players flip cards to find matching pairs, with the goal of clearing the board in the fewest moves. Features multiple difficulty levels (Easy, Medium, Hard) and responsive design that works on both desktop and mobile devices. This project was created to practice DOM manipulation, event handling, and CSS animations without relying on frameworks. It demonstrates clean JavaScript fundamentals and game state management. I wanted to build something fun and interactive while focusing on code quality and user experience with pure web technologies.',
    progressLog: [
      {
        date: '2024-10-01',
        description: 'Initial commit: Project setup and basic HTML structure',
      },
      {
        date: '2024-10-05',
        description: 'Implemented card flip animation and matching logic with CSS transitions',
      },
      {
        date: '2024-10-08',
        description: 'Added difficulty levels (Easy: 8 cards, Medium: 12 cards, Hard: 16 cards)',
      },
      {
        date: '2024-10-12',
        description: 'Enhanced UI with CSS Grid layout and smooth card flip animations',
      },
      {
        date: '2024-10-15',
        description: 'Added move counter and timer functionality to track player performance',
      },
      {
        date: '2024-10-18',
        description: 'Implemented game reset functionality and win condition with celebration animation',
      },
      {
        date: '2024-10-20',
        description: 'Deployed to Azure Static Web Apps at https://memorygame.aalokdeep.com',
      },
    ],
    links: [
      {
        title: 'Play Game',
        url: 'https://memorygame.aalokdeep.com',
      },
    ],
  },
];

const blogsData = [
  {
    id: 'welcome-to-the-journal',
    title: 'Welcome to the Journal',
    summary: 'Why I am building a dedicated journal alongside the workbench, and what to expect from upcoming posts.',
    body: `# Welcome to the Journal

This space will house longer-form writing about the build journey, design choices, and lessons learned. Expect:

- Architecture notes and trade-offs
- Ship logs for new features
- Occasional deep dives into tools that worked (and those that did not)

Thanks for reading and following along!`,
    tags: ['updates', 'roadmap'],
    createdAt: '2025-01-08',
    heroImage: {
      url: 'https://aalokdeepassets.blob.core.windows.net/journal/welcome-cover.png',
      alt: 'Soft gradient background with journal title',
    },
  },
  {
    id: 'workbench-retrospective',
    title: 'Workbench Retrospective',
    summary: 'A short retrospective on shipping the workbench app, covering what went well and what will change for the journal.',
    body: `# Workbench Retrospective

Building the workbench clarified a few things:

1. Shared UI components saved time—Header, Footer, and RootLayout carry over here.
2. Static export plus dynamic data via Functions kept deployments lean.
3. Image handling with Blob Storage worked smoothly; we will reuse it for hero images.

Next up, the journal will prioritize readability: summaries on the landing page, Markdown for content, and simple tag filters.`,
    tags: ['retrospective', 'architecture'],
    createdAt: '2025-01-07',
  },
];

async function ensureDatabase(client, id) {
  console.log(`📦 Creating database "${id}"...`);
  const { database } = await client.databases.createIfNotExists({ id });
  console.log(`✓ Database "${id}" ready\n`);
  return database;
}

async function ensureContainer(database, id) {
  console.log(`📦 Creating container "${id}"...`);
  const { container } = await database.containers.createIfNotExists({
    id,
    partitionKey: { paths: ['/id'] },
  });
  console.log(`✓ Container "${id}" ready\n`);
  return container;
}

async function seedItems(container, items, label, skipIfExists = false) {
  console.log(`📝 Seeding ${items.length} ${label}...`);
  for (const item of items) {
    try {
      // If skipIfExists is true, check if item already exists before seeding
      if (skipIfExists) {
        try {
          await container.item(item.id).read();
          console.log(`  ⊘ Skipped: ${item.title || item.id} (already exists)`);
          continue;
        } catch (err) {
          // Item doesn't exist, proceed with seeding
          if (err.code !== 404) throw err;
        }
      }
      await container.items.upsert(item);
      console.log(`  ✓ Seeded: ${item.title || item.id}`);
    } catch (error) {
      console.error(`  ✗ Failed to seed ${item.title || item.id}:`, error.message);
    }
  }
}

async function seedCosmos() {
  const client = new CosmosClient({ connectionString: CONNECTION_STRING });

  try {
    console.log('🌱 Starting Cosmos DB seeding...\n');

    // Workbench database + container (skip seeding if projects already exist)
    const workbenchDb = await ensureDatabase(client, WORKBENCH_DATABASE_ID);
    const projectsContainer = await ensureContainer(workbenchDb, PROJECTS_CONTAINER_ID);
    await seedItems(projectsContainer, projectsData, 'projects', true);

    // Journal database + container (skip seeding if blogs already exist)
    const journalDb = await ensureDatabase(client, JOURNAL_DATABASE_ID);
    const blogsContainer = await ensureContainer(journalDb, BLOGS_CONTAINER_ID);
    await seedItems(blogsContainer, blogsData, 'blogs', true);

    console.log('\n✅ Cosmos DB seeding complete!');
    console.log(`📊 Databases: ${WORKBENCH_DATABASE_ID}, ${JOURNAL_DATABASE_ID}`);
    console.log(`📊 Containers: ${PROJECTS_CONTAINER_ID}, ${BLOGS_CONTAINER_ID}`);
    console.log(`📊 Documents seeded: ${projectsData.length + blogsData.length}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('- Verify COSMOS_CONNECTION_STRING is set correctly');
    console.error('- Check that your Cosmos DB account is accessible');
    console.error('- Ensure your IP is whitelisted in Cosmos DB firewall settings');
    process.exit(1);
  }
}

seedCosmos();
