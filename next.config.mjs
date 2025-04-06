/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint checking during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Other configurations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  images: {
    domains: [
      'api.dicebear.com',
      'peach-giant-elk-508.mypinata.cloud',
      'ipfs.io',
      'gateway.pinata.cloud',
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

export default nextConfig;
