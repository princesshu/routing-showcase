import type { MetadataRoute } from 'next';
import { products, posts } from '@/lib/data';

const baseUrl = 'https://example.com';

// app/sitemap.ts is served at /sitemap.xml — a file-based routing convention.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/products', '/feed'].map((path) => ({
    url: `${baseUrl}${path}`,
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
