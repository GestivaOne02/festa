/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },
  env: {
    GESTIVA_SUPABASE_URL: process.env.GESTIVA_SUPABASE_URL,
    GESTIVA_SUPABASE_ANON_KEY: process.env.GESTIVA_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
