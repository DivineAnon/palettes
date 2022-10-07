/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  images: {
    domains: ['res.cloudinary.com']
  }
}

module.exports = nextConfig
