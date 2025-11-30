# Aalok Deep Pandit - Personal Monorepo

This monorepo contains the source code for the personal website and all related subdomains of Aalok Deep Pandit. It is built with Next.js and managed as a workspace using npm.

## Project Structure

This project is a monorepo, structured to manage multiple applications and shared packages in a single repository.

```
/
├── apps/
│   ├── main-site/      # Source code for the main website (aalokdeep.com)
│   └── ...             # Future apps for subdomains (blog, projects, etc.)
├── packages/
│   ├── ui/             # Shared React components (Layouts, Buttons, etc.)
│   ├── assets/         # Shared static assets (images, fonts, etc.)
│   └── ...             # Future shared packages (e.g., tsconfig, tailwind-config)
├── scripts/
│   └── copy-assets.js  # Script to copy shared assets to apps during build
└── .github/
    └── workflows/      # GitHub Actions for CI/CD
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
```
This will start the `main-site` application on [http://localhost:3000](http://localhost:3000).

## Core Concepts

### Workspaces

This repository uses [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage the multiple projects. The `workspaces` are defined in the root `package.json`, allowing for linked dependencies and streamlined development.

### Shared Packages

-   **`@aalokdeep/ui`**: A package containing React components (e.g., `RootLayout`, `Header`, `Footer`) that are shared across all applications. This ensures a consistent look, feel, and structure.
-   **`@aalokdeep/assets`**: A package containing static assets like images and fonts.

### Asset Management

Next.js applications can only serve static files from their own `public` directory. To share assets across all apps, we use a custom script:
-   The `scripts/copy-assets.js` script automatically copies all files from `packages/assets/public` into each application's `public` folder.
-   This script is triggered by the `predev` and `prebuild` hooks in each application's `package.json`.

### Note on Tailwind CSS

For Tailwind CSS to correctly generate stylesheets, the `tailwind.config.ts` file in **each app** must be configured to scan the shared UI package for class names. The `content` array should include a path to the UI package, like this:

```js
// in apps/main-site/tailwind.config.ts
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}', // <-- Important!
  ],
  // ...
};
```

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


