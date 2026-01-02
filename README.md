# Aalok Deep Pandit - Personal Monorepo

This monorepo contains the source code for the personal website and all related subdomains of Aalok Deep Pandit. It is built with Next.js and managed as a workspace using npm.

## Live Sites

- **Main Site**: [aalokdeep.com](https://aalokdeep.com)
- **Workbench**: [workbench.aalokdeep.com](https://workbench.aalokdeep.com) - Project portfolio and showcase

## Project Structure

This project is a monorepo, structured to manage multiple applications and shared packages in a single repository.

```
/
├── apps/
│   ├── main-site/      # Main website (aalokdeep.com)
│   ├── workbench/      # Project portfolio (workbench.aalokdeep.com)
│   └── ...             # Future apps (journal, gallery, etc.)
├── packages/
│   ├── ui/             # Shared React components (Header, Footer, RootLayout, etc.)
│   ├── assets/         # Shared static assets (images, fonts, etc.)
│   └── ...             # Future shared packages
├── scripts/
│   └── copy-assets.js  # Script to copy shared assets to apps during build
└── .github/
    └── workflows/      # GitHub Actions for CI/CD (separate workflow per app)
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd AalokDeepDotCom
    ```

2.  Install all dependencies for all workspaces:
    ```bash
    npm install
    ```

### Running the Development Server

To run a specific application's development server, use the root-level npm scripts.

**Run the main website:**
```bash
npm run dev
# or explicitly
npm run dev:main-site
```

**Run the workbench:**
```bash
npm run dev:workbench
```

Applications will start on [http://localhost:3000](http://localhost:3000) (or the next available port).

### Building for Production

**Build the main website:**
```bash
npm run build
# or explicitly
npm run build:main-site
```

**Build the workbench:**
```bash
npm run build:workbench
```

## Core Concepts

### Workspaces

This repository uses [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage the multiple projects. The `workspaces` are defined in the root `package.json`, allowing for linked dependencies and streamlined development.

### Shared Packages

-   **`@aalokdeep/ui`**: A package containing React components (e.g., `RootLayout`, `Header`, `Footer`) that are shared across all applications. This ensures a consistent look, feel, and structure.
-   **`@aalokdeep/assets`**: A package containing static assets like images and fonts.

### Asset Management
deployed as a separate Azure Static Web App with its own custom domain and GitHub Actions workflow.

### Deployed Applications

| App | Domain | Workflow | Azure Token Secret |
|-----|--------|----------|-------------------|
| main-site | aalokdeep.com | `azure-static-web-apps-main-site.yml` | `AZURE_STATIC_WEB_APPS_API_TOKEN_MAIN_SITE` |
| workbench | workbench.aalokdeep.com | `azure-static-web-apps-workbench.yml` | `AZURE_STATIC_WEB_APPS_API_TOKEN_WORKBENCH` |

### How It Works

1. **Path Filtering**: Each workflow only triggers on changes to its app or shared packages
2. **Independent Builds**: GitHub Actions builds the specific app when triggered
3. **Static Export**: Next.js apps use `output: 'export'` to generate static HTML
4. **Deployment**: The build output is uploaded to the respective Azure Static Web App

### Path Filters

Workflows trigger on changes to:
- App-specific files: `apps/[app-name]/**`
- Shared UI components: `packages/ui/**`
- Shared assets: `packages/assets/**`
- Workflow file itself: `.github/workflows/[workflow-name].yml`

This ensures efficient CI/CD - only affected apps are rebuilt and deploy
```js
// in apps/main-site/tailwind.config.ts
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}', // <-- Important!
  ],
  // ...
};
``` with Static Export)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Deployment**: Azure Static Web Apps
-   **CI/CD**: GitHub Actions
-   **Package Manager**: npm with Workspaces

## Deployment to Azure Static Web Apps

Each application in the `apps` directory is intended to be deployed as a separate Azure Static Web App.

### Build Settings for an App (e.g., `main-site`)

-   **App location**: `apps/main-site`
-   **Api location**: (leave empty)
-   **Output location**: `out` (or as configured in `next.config.js`)

The GitHub Actions workflows in `.github/workflows/` are configured to trigger deployments only when relevant files for a specific app or a shared package are changed.

## Technology Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Deployment**: Azure Static Web Apps
-   **CI/CD**: GitHub Actions
-   **Package Manager**: npm Workspaces

## Available Scripts

All scripts should be run from the **root** of the repository.

-   `npm run dev`: Starts the development server for the `main-site`.
-   `npm run build`: Builds the `main-site` for production.
-   `npm run start`: Starts the production server for the `main-site`.
-   `npm run lint`: Lints the `main-site` application.

*(As more apps are added, more scripts will be added to the root `package.json` to manage them.)*


