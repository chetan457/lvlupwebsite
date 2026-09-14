/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // one stylesheet for a four-page site is small enough to inline;
  // shipping it in the document removes the only render-blocking request
  experimental: { inlineCss: true },
  poweredByHeader: false,
  images: {
    // Placeholder photography only. Swap for local /public assets once the
    // venue's own shots land — see content/images.ts.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
