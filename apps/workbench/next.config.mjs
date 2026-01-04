/**
 * Next.js config for workbench app.
 * - Removed 'output: export' to enable dynamic rendering with API calls
 * - Functions APIs are called at runtime from the pages
 * - images.unoptimized allows next/image without optimization
 */
const nextConfig = {
  images: {
    unoptimized: true,
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
