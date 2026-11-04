import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from '@tanstack/react-start';

// Runs for every request that reaches the server, before routing: pages,
// server routes and server functions. Prerendered pages served as static
// files never get here.
const adminRedirect = createMiddleware().server(({ request, next }) => {
  const { pathname } = new URL(request.url);

  // Same redirect as the Next.js proxy and Astro fetch demos.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new Response(null, { status: 307, headers: { Location: '/' } });
  }
  return next();
});

// Rejects cross-site calls to server functions. Start adds this check on its
// own only while src/start.ts does not exist; once it does, the check has to
// be listed here.
const csrf = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrf, adminRedirect],
}));
