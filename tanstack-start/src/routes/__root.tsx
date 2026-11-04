import type { ReactNode } from 'react';
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import appCss from '../styles/app.css?url';

export const Route = createRootRoute({
  // Merged with the head() of every matched route; a child's title replaces
  // this one.
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start Routing Showcase' },
      {
        name: 'description',
        content: 'Runnable reference for file-based routing in TanStack Start',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Files in public/ are served as they are, from the site root.
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
    ],
  }),
  // The HTML document around every page. The root route has no component of
  // its own, so it renders its children through an implicit <Outlet />.
  shellComponent: RootDocument,
  // Rendered for URLs that match no route.
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main>
      <h1>Not found</h1>
      <p>
        There is nothing at this URL. <Link to="/">Back to the home page</Link>
      </p>
    </main>
  );
}
