/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    // Wildcard remote patterns removed to prevent image-based SSRF (NEW 17)
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // unsafe-eval removed and http protocols stripped (NEW 16)
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://maps.google.com; object-src 'none'; base-uri 'self';",
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
