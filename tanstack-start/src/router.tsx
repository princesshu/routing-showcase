import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// Start calls getRouter() for every server request and once in the browser,
// so requests never share a router or its loader cache.
export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    // Hovering or focusing a <Link> loads the target route's code and runs
    // its loader, so the click usually renders without waiting.
    defaultPreload: 'intent',
    // The route file src/routes/internal/team.tsx is published as /team.
    // input maps the public URL to the route before routing, on the server
    // and in the browser; output maps it back for every generated href, so
    // <Link to="/internal/team"> renders href="/team". A request for
    // /internal/team gets a 307 to /team, because the server answers each
    // URL at its public form.
    rewrite: {
      input: ({ url }) => {
        if (url.pathname === '/team') url.pathname = '/internal/team';
        return url;
      },
      output: ({ url }) => {
        if (url.pathname === '/internal/team') url.pathname = '/team';
        return url;
      },
    },
  });
}
