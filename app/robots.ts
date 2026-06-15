import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Hide admin/dashboard paths from search engines if any
    },
    sitemap: 'https://jbmgmc-nandurbar.edu.in/sitemap.xml',
  }
}
