/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.damaface.com.br',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'ia-minio.i4khe5.easypanel.host',
        pathname: '/damaface-blog/**',
      },
    ],
  },
  // Adicione se estiver tendo problemas com MDX
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
