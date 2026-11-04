# Rendering

Every route is rendered on the server for the first request and hydrated in the browser. After that, navigation happens in the browser, and loaders run there too; a server function they call still runs on the server. Two options change this: `ssr` per route, and prerendering at build time.

**In this repo:** `src/routes/rendering/client-only.tsx`, `src/routes/rendering/data-only.tsx` and the `prerender` and `pages` options in `vite.config.ts`.

## Selective SSR

| `ssr`            | Loader, first request | Component, first request | In this repo             |
| ---------------- | --------------------- | ------------------------ | ------------------------ |
| `true` (default) | server                | server                   | every other route        |
| `'data-only'`    | server                | browser                  | `/rendering/data-only`   |
| `false`          | browser               | browser                  | `/rendering/client-only` |

For the first route in a match that isn't fully rendered on the server, the server sends its `pendingComponent` instead ("Waiting for the browser…" on both demo routes). `/rendering/client-only` reads `navigator.userAgent` in its loader, which only exists in the browser. `/rendering/data-only` sends its loader result with the HTML; on a client navigation the same loader runs in the browser.

A child route can only make the setting stricter: under a `'data-only'` parent, `ssr: true` still means `'data-only'`. `ssr` can also be a function of the params and search, decided per request, and `defaultSsr` in `createStart()` changes the default for all routes.

## Prerendering

```ts
// vite.config.ts
tanstackStart({
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
```

`pnpm build` starts the built server, requests each listed path and writes the HTML to `dist/client`, for example `dist/client/products/1/index.html`. Loaders and server functions run then, at build time.

With the two discovery options left on, Start would prerender every route without params and follow the links it finds in the HTML. This repo lists the pages instead, because several routes are meant to answer on request (`/account`, `/crash`).

## Good to know

- **The files are for a static host.** The Start server, including `pnpm preview`, still renders `/about` on each request and serves the file only at `/about/index.html`. A static host or CDN in front of the server is what serves the prerendered pages at their clean URLs.
- **Params that aren't listed render on request.** `/products/4` is not prerendered; the server renders it and answers 404.
- **`ssr: false` is not a static page.** The server still sends the document with the head tags; only the route's own loader and component wait for the browser.

Reference: [Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr), [Static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering)
