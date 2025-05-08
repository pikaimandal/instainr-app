/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint checking during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['world.org'], // Allow images from World domains
  },
  // For security, restrict frame-ancestors to World App domains
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' worldcoin.org world.org *.world.org *.worldcoin.org;"
          },
        ],
      },
    ]
  },
  // Explicitly allow the app to be embedded in an iframe
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

export default nextConfig