import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // The Next.js app uses 3000, so both can run at the same time.
  server: { port: 3001 },
  preview: { port: 3001 },
  plugins: [
    // Generates src/routeTree.gen.ts from src/routes and builds the server
    // and client bundles, keeping server function handlers on the server.
    tanstackStart({
      // Writes these pages to dist/client as HTML at build time. Only the
      // listed paths: no discovery of static routes, no link crawling.
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
      },
      pages: [
        { path: '/about' },
        { path: '/products/1' },
        { path: '/products/2' },
        { path: '/products/3' },
      ],
    }),
    // Must come after tanstackStart().
    viteReact(),
  ],
});
