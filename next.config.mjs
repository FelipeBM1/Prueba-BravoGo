/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'dev.to',
      'res.cloudinary.com',
      'cdn.hashnode.com',
      'media.dev.to',
      'thepracticaldev.s3.amazonaws.com',
      'github.com',
      'avatars.githubusercontent.com',
      'www.genbeta.com',
      'i.blogs.es'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  swcMinify: true,
}

export default nextConfig
