/**
 * Next.js config for workbench app.
 * - Removed 'output: export' to enable dynamic rendering with API calls
 * - Functions APIs are called at runtime from the pages
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
