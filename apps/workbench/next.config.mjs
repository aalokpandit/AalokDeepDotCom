/**
 * Next.js config for workbench app.
 * - Dynamic routing via client components and Azure SWA routing
 * - Client-side useEffect calls fetch APIs dynamically for project data
 * - images.unoptimized allows next/image without optimization
 * - remotePatterns allows Azure Blob Storage URLs
 */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blob.core.windows.net',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/',
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;
