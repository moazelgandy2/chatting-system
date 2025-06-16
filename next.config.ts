const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.chatting.marketopiateam.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "media.marketopiateam.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "3072mb",
    },
  },
};

module.exports = withNextIntl(nextConfig);
