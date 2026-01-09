/**
 * Next.js config for journal app.
 * - output: 'export' generates static HTML for SWA deployment
 * - images.unoptimized allows next/image without optimization
 * - remotePatterns allows Azure Blob Storage URLs for hero images
 */
const nextConfig = {
  output: 'export',
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
        source: '/posts',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
