/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:4000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key-change-this-in-production',
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig