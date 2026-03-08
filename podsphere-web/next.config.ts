import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Cho đống ảnh giả lúc nãy
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // Cho cái link uit-coding.jpg mày vừa thêm
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;