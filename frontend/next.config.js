/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.50.93",
        port: "3001",
        pathname: "/icons/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/icons/**",
      },
      {
        protocol: "http",
        hostname: "10.10.50.93",
        port: "5000",
        pathname: "/static/uploads/**",
      },
    ],
  },
  outputFileTracingRoot: '/var/www/html/Tej-IT-Site/frontend',
  eslint: {
    ignoreDuringBuilds: true, // Temporary workaround for ESLint conflict
  },
};

module.exports = nextConfig;