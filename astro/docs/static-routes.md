# Static routes

Every `.astro`, `.md`, `.mdx` or `.html` file under `src/pages/` becomes a page, and its path becomes the URL. No routing config is involved.

**In this repo:** `src/pages/about.astro` → `/about`, `src/pages/products/index.astro` → `/products`.

## How it works

```
src/pages/
├─ index.astro          → /
├─ about.astro          → /about
├─ products/
│  └─ index.astro       → /products
├─ robots.txt.ts        → /robots.txt (an endpoint, see endpoints.md)
├─ 404.astro            → custom 404 page
├─ 500.astro            → custom 500 page
└─ _drafts/
   └─ unpublished.astro → not a route
```

Pages are prerendered by default: `astro build` writes `about/index.html` and the server only sends the file. See [on-demand rendering](on-demand-rendering.md) for pages that render per request.

## Excluding files

A file or folder whose name starts with `_` is not a route and is left out of the build. `src/pages/_drafts/unpublished.astro` returns a 404. Use this to park a page or to keep helpers next to the pages that use them. Components and layouts usually live outside `src/pages/` altogether, as `src/components/` and `src/layouts/` do here.

## Error pages

- **`404.astro`** renders for any URL that matches no route, and for an on-demand page that returns `new Response(null, { status: 404 })`. It is prerendered to `404.html`, which most hosts pick up on their own.
- **`500.astro`** renders when an on-demand page throws. It receives the thrown value as the `error` prop, typed `unknown`. Don't print it: messages and stack traces can leak internals. `/crash` shows it. A prerendered page that throws fails the build instead, so it never needs this page.

## Good to know

- **No layout files.** Astro has no `layout` file convention. A layout is an ordinary component with a `<slot />`, imported by each page: `src/layouts/Base.astro` here. Unlike a Next.js layout, it does not stay mounted across navigation, because every navigation loads a new document. [View transitions](view-transitions.md) can change that.
- **No route groups.** There is no folder syntax that is left out of the URL, like Next.js `(group)` folders. Every folder under `src/pages/` is a URL segment.

Reference: [Routing](https://docs.astro.build/en/guides/routing/), [Pages](https://docs.astro.build/en/basics/astro-pages/)
