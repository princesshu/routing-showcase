import type { MetadataRoute } from 'next';

// app/robots.ts is served at /robots.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/account'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
