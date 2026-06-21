import type { Metadata, Viewport } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden w-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
