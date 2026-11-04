# Static routes

A file in `src/routes/` is a route, and its path is the URL. The router plugin reads the folder on every build and every change in dev, and writes the result to `src/routeTree.gen.ts`.

**In this repo:** `src/routes/about.tsx`, `src/routes/products/index.tsx`, `src/routes/products/-components/` and `src/routes/robots[.]txt.ts`.

## File to URL

| File                            | URL           |
| ------------------------------- | ------------- |
| `src/routes/index.tsx`          | `/`           |
| `src/routes/about.tsx`          | `/about`      |
| `src/routes/products/route.tsx` | `/products`   |
| `src/routes/products/index.tsx` | `/products`   |
| `src/routes/robots[.]txt.ts`    | `/robots.txt` |

Every route file exports `Route`, created with the path the file stands for:

```tsx
// src/routes/about.tsx
export const Route = createFileRoute('/about')({
  component: About,
});
```

The plugin keeps that path string in sync with the file's location, so a moved file does not keep a stale path.

Folders and dots are interchangeable: `products/index.tsx` and `products.index.tsx` build the same route. This repo uses folders throughout.

## Index routes

`products/route.tsx` is the route for the `/products` folder and everything below it, usually a [layout](layouts.md). `products/index.tsx` matches only `/products` itself and renders inside that layout's `<Outlet />`. Its path in `createFileRoute` ends with a slash: `'/products/'`.

## Excluded files

A `-` prefix keeps a file or folder out of the route tree. `products/-components/price.tsx` sits next to the routes that import it and never becomes a URL. Next.js and Astro use `_` for this; in TanStack Router, `_` starts a [pathless layout](layouts.md#pathless-layouts).

## Escaped characters

A dot in a file name separates route segments, so `robots.txt.ts` would be a `txt` route below `robots`. Square brackets escape it: `robots[.]txt.ts` serves `/robots.txt`.

## Good to know

- **The route tree is generated, and committed.** TanStack's own docs recommend committing `routeTree.gen.ts`: it is part of the app, not a build artifact. `pnpm build` regenerates it, and CI fails if that changed the file.
- **A route file can be a page, an endpoint or both.** `robots[.]txt.ts` has no component, only `server.handlers`; see [server routes](server-routes.md).

Reference: [File-based routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing), [File naming conventions](https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions)
