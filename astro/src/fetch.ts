import type { Fetchable } from 'astro';
import { FetchState, astro } from 'astro/fetch';

// The server's entry point. It sees every request that reaches the server,
// before Astro matches a route. Prerendered pages are served as static files
// and never get here.
export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Answered here, so no route, middleware or page is involved.
    if (pathname === '/healthz') return new Response('ok');

    // Same redirect as the Next.js proxy demo, decided before routing starts.
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return new Response(null, { status: 307, headers: { Location: '/' } });
    }

    // Everything else goes through Astro's full pipeline.
    return astro(new FetchState(request));
  },
} satisfies Fetchable;
