/**
 * Next.js config for workbench app.
 * - No 'output: export': pages are server-rendered per request on Azure SWA's hybrid Next.js runtime
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
