/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,
  // Security: Disable x-powered-by header
  generateEtags: true,
  // Compression for static export
  compress: true,
}

module.exports = nextConfig
