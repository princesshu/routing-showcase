import { defineMiddleware, sequence } from 'astro:middleware';

// A stand-in session read from ?as=admin|user, used by /account.
const session = defineMiddleware((context, next) => {
  // Prerendered pages run middleware once, at build time. There is no real
  // request then, so there is nothing to authenticate.
  const as = context.isPrerendered ? null : context.url.searchParams.get('as');
  context.locals.user = as === 'admin' || as === 'user' ? { role: as } : null;
  return next();
});

// Runs after the page: measures how long rendering took.
const timing = defineMiddleware(async (context, next) => {
  const start = performance.now();
  const response = await next();
  if (!context.isPrerendered) {
    const ms = (performance.now() - start).toFixed(1);
    response.headers.set('Server-Timing', `render;dur=${ms}`);
  }
  return response;
});

export const onRequest = sequence(session, timing);
