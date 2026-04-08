/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow embed pages to be loaded in iframes from any origin
  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },

  // 🔥 VERY IMPORTANT: API PROXY (FIXES COOKIE + CORS ISSUE)
  // Note: Some routes are handled by Next.js API routes for proper cookie handling
  async rewrites() {
    return [
      {
        source: "/api/upload/:path*",
        destination: "/api/upload/:path*", // Next.js API route
      },
      {
        source: "/api/dimensions",
        destination: "/api/dimensions", // Next.js API route
      },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
