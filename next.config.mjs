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
      allowedOrigins: ['*'],
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/gateway/sub/:path*',
        destination: 'http://103.91.191.172:8000/:path*',
      },
      {
        source: '/api/gateway/ror/:path*',
        destination: 'https://api.strikeprofx.com/:path*',
      },
      {
        source: '/api/gateway/ror-internal/:path*',
        destination: 'http://123.253.62.147:8000/:path*',
      },
      {
        source: '/api/gateway/:account/:path*',
        destination: 'http://103.91.191.171:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
