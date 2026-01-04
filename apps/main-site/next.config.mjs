/**
 * Next.js config for static export.
 * - output: 'export' makes `next build` generate `out/`
 * - images.unoptimized allows next/image with static export
 * - remotePatterns allows Azure Blob Storage URLs
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
};

export default nextConfig;
