import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — replace <project-ref> with your actual project ref
        // e.g. if your URL is https://abcdefgh.supabase.co then protocol=https, hostname=abcdefgh.supabase.co
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;