import type { APIRoute } from 'astro';

// Prerendered like a page: written to the build output as a file.
export const GET: APIRoute = () =>
  new Response('User-agent: *\nDisallow: /api/\n');
