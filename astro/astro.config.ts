import node from '@astrojs/node';
import preact from '@astrojs/preact';
import { defineConfig, memoryCache } from 'astro/config';
import routeMap from './integrations/route-map.ts';

export default defineConfig({
  site: 'https://example.com',
  // Pages are prerendered unless they export `prerender = false`. The adapter
  // serves everything else: on-demand pages, endpoints, server islands and
  // actions.
  adapter: node({ mode: 'standalone' }),
  integrations: [preact(), routeMap()],
  redirects: {
    '/old-about': '/about',
    // Dynamic redirects work when both sides use the same parameters.
    '/catalog/[id]': '/products/[id]',
    '/moved-for-now': { status: 307, destination: '/about' },
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false, fallbackType: 'redirect' },
    // A page missing under /de/ redirects to its English version instead of
    // returning a 404.
    fallback: { de: 'en' },
  },
  // In-memory response cache for on-demand routes that call Astro.cache.set().
  cache: { provider: memoryCache() },
});
