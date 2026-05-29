/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/gateway/sub/:path*",
        destination: process.env.API_URL_SUB + "/:path*",
      },
      {
        source: "/api/gateway/ror/:path*",
        destination: process.env.API_URL_STKPRO + "/:path*",
      },
      {
        source: "/api/gateway/ror-internal/:path*",
        destination: process.env.API_URL_ROR_INTERNAL + "/:path*",
      },
      {
        source: "/api/gateway/:account/:path*",
        destination: process.env.API_URL + "/:path*",
      },
    ];
  },
};

export default nextConfig;
