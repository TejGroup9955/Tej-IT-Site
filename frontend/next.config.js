

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      "http://localhost:3001",     // local
      "http://10.10.50.93:3001",  // LAN access
    ],
  },
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
};

module.exports = nextConfig;

