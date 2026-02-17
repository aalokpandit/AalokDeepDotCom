/**
 * Next.js config for journal app.
 * - Dynamic routing via client components and Azure SWA routing
 * - images.unoptimized allows next/image without optimization
 * - remotePatterns allows Azure Blob Storage URLs for hero images
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
        source: '/blogs',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
