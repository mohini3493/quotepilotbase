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

  // 🔥 VERY IMPORTANT: API PROXY (FIXES COOKIE + CORS ISSUE)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://quotepilotbase.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
