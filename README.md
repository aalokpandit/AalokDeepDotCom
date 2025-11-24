# Aalok Deep Pandit - Personal Website

A personal website built with Next.js, designed for online branding and showcasing work, blog posts, and photography.

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Landing page
│   ├── under-construction/
│   │   └── [section]/       # Temporary holding page for hub links
│   ├── globals.css          # Global styles
│   ├── blog/                # Blog section (future)
│   ├── projects/            # Side projects portfolio (future)
│   └── photography/         # Photography showcase (future)
├── components/              # Reusable React components (future)
├── public/
│   └── images/              # Static images
└── .github/
    └── workflows/           # GitHub Actions for CI/CD
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AalokDeepDotCom
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

To create a static export for deployment:

```bash
npm run build
```

This will generate an `out` directory with all static files ready for deployment.

## Deployment to Azure Static Web Apps

### Initial Setup

1. **Create Azure Static Web App**:
   - Go to the Azure Portal
   - Create a new Static Web App resource
   - Choose your subscription, resource group, and region
   - Connect it to your GitHub repository
   - Azure will automatically create a GitHub Actions workflow

2. **Configure GitHub Secrets**:
   - Azure will automatically add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your repository
   - The workflow file (`.github/workflows/azure-static-web-apps.yml`) is already configured

3. **Build Settings**:
   - App location: `/`
   - Api location: (leave empty)
   - Output location: `out`

### Custom Domain Setup

1. In Azure Portal, go to your Static Web App
2. Navigate to "Custom domains"
3. Add your domain and follow the DNS configuration instructions
4. Azure will provide DNS records to add to your domain registrar

### Automated Deployment

Once connected to GitHub:
- Every push to the `main` branch will trigger a build and deployment
- Pull requests will create preview deployments
- The workflow is configured in `.github/workflows/azure-static-web-apps.yml`

## Current Features

- ✅ Static landing page with profile photo and introduction
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support (system preference)
- ✅ Optimized for static export

## Future Features

- [ ] Blog section for tech, parenting, and immigrant life posts
- [ ] Side projects portfolio with GitHub links and YouTube demos
- [ ] Photography showcase with Instagram and Google Photos integration
- [ ] Navigation menu
- [ ] Search functionality
- [ ] RSS feed for blog

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## Development

### Project Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server (for testing)
- `npm run lint` - Run ESLint

### Adding Content

1. **Update Landing Page**: Edit `app/page.tsx`
2. **Replace Profile Photo**: Replace `public/images/profile-placeholder.svg` with your photo
3. **Update Metadata**: Edit `app/layout.tsx` for SEO and page metadata

## License

Private project - All rights reserved

