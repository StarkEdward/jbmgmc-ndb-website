/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['react-markdown', 'remark-gfm'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // Wildcard remote patterns removed to prevent image-based SSRF
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['192.168.1.3'],
  async headers() {
    // These headers are STATIC (same value on every request) and safe to set here.
    //
    // Content-Security-Policy and Permissions-Policy are intentionally NOT set here —
    // they are generated in middleware.ts on a per-request basis so that:
    //   • CSP can include a unique cryptographic nonce (VULN-09 fix)
    //   • Permissions-Policy is applied consistently across all routes (VULN-08 fix)
    //
    // Strict-Transport-Security is kept here as a belt-and-suspenders measure since
    // Nginx also sends it, but it's harmless to have both.
    const staticSecurityHeaders = [
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
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
    ]

    return [
      {
        source: '/:path*',
        headers: staticSecurityHeaders,
      },
    ]
  },
}

export default nextConfig
