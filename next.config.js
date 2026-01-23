/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    mdxRs: true,
  },
}

module.exports = nextConfig
