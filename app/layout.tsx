import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather, Mukta } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { LiveDataProvider } from '@/components/providers/live-data-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
})

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mukta',
  display: 'swap'
})

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-merriweather',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Jannayak Birsa Munda Government Medical College, Nandurbar',
  description: 'Official website of Jannayak Birsa Munda Government Medical College and Hospital, Nandurbar - One of the premiere Medical Colleges in Maharashtra, providing excellent medical education and healthcare services.',
  keywords: ['GMC Nandurbar', 'Medical College', 'Maharashtra', 'MBBS', 'Medical Education', 'Hospital', 'JBMGMC', 'Nandurbar'],
  authors: [{ name: 'JBMGMC Nandurbar' }],
  openGraph: {
    title: 'Jannayak Birsa Munda Government Medical College, Nandurbar',
    description: 'One of the premiere Medical Colleges in Maharashtra',
    type: 'website',
    images: [
      {
        url: '/images/college-building.webp',
        width: 1200,
        height: 630,
        alt: 'Jannayak Birsa Munda Government Medical College Campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jannayak Birsa Munda Government Medical College, Nandurbar',
    description: 'One of the premiere Medical Colleges in Maharashtra',
    images: ['/images/college-building.webp'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Root layout — reads the CSP nonce injected by middleware.ts and threads it
 * through to the HTML so Next.js can apply it to its own generated <script> tags.
 *
 * VULN-09: The nonce is placed on the <html> element as a data attribute.
 * Next.js (14+) reads this attribute and applies it to inline <script> tags it generates
 * (e.g. the hydration bundle, __NEXT_DATA__, route prefetch scripts) so they pass the
 * nonce-based CSP check. Without this, Next.js's own scripts would be blocked by the CSP.
 *
 * The nonce value itself is generated fresh per-request in middleware.ts and is never
 * reused or predictable — making XSS script injection impossible to authenticate.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read the nonce that middleware.ts set on the incoming request headers.
  // This is a Server Component, so headers() works here.
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? ''
  
  // Read database directly on the server to pass initial state down
  const publicData = db.getOptimizedGlobalData()

  return (
    <html
      lang="en"
      className="scroll-smooth overflow-x-hidden"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      // The nonce attribute on <html> is read by Next.js to authenticate
      // its own inline scripts against the Content-Security-Policy.
      {...(nonce ? { nonce } : {})}
    >
      <head />
      <body className={`${inter.variable} ${merriweather.variable} ${mukta.variable} font-sans antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden w-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LiveDataProvider initialData={publicData}>
            {children}
          </LiveDataProvider>
        </ThemeProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
