/**
 * Next.js config for static export.
 * - output: 'export' makes `next build` generate `out/`
 * - images.unoptimized allows next/image with static export
 */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
