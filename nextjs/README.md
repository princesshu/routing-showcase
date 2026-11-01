# Next.js App Router

The Next.js part of [Routing Showcase](..): a small, runnable reference for file-system routing in the Next.js App Router. Every convention below has a working route in [`app/`](app) and a short explanation in [`docs/`](docs).

Built with Next.js, React, strict TypeScript (typed routes) and CSS Modules. Exact versions are pinned in [`package.json`](package.json); CI runs on the Node.js version set in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Contents

- [Getting started](#getting-started)
- [Route map](#route-map)
- [Patterns](#patterns)
- [Special files](#special-files)
- [Behavior worth knowing](#behavior-worth-knowing)
- [Type-safe routing](#type-safe-routing)
- [Deployment](#deployment)
- [License](#license)

## Getting started

```bash
pnpm install   # once, at the repository root
cd nextjs
pnpm dev
```

Open http://localhost:3000. The home page links to every pattern.

CI runs the same checks you can run locally in `nextjs/`:

```bash
pnpm lint
pnpm typecheck           # next typegen && tsc --noEmit
pnpm build
pnpm route-map --check   # README route map matches the build
```

Formatting is checked once for the whole repository, with `pnpm format:check` at the root.

## Route map

Every route in the app, generated from the `next build` output by [`scripts/route-map.mts`](scripts/route-map.mts). After changing routes, run `pnpm build && pnpm route-map`; CI fails if this table is out of date.

<!-- route-map:start -->

| URL                                 | File                                            | Kind                                                | Rendering     |
| ----------------------------------- | ----------------------------------------------- | --------------------------------------------------- | ------------- |
| `/`                                 | `app/page.tsx`                                  | page                                                | static        |
| `/`                                 | `app/@analytics/page.tsx`                       | parallel slot `@analytics`                          | static        |
| `/about`                            | `app/about/page.tsx`                            | page                                                | static        |
| `/account`                          | `app/account/page.tsx`                          | page                                                | dynamic       |
| `/api/hello`                        | `app/api/hello/route.ts`                        | route handler (GET, POST)                           | dynamic       |
| `/api/posts`                        | `app/api/posts/route.ts`                        | route handler (GET, POST)                           | dynamic       |
| `/api/posts/[id]`                   | `app/api/posts/[id]/route.ts`                   | route handler (GET, DELETE)                         | dynamic       |
| `/blog/[slug]`                      | `app/blog/[slug]/page.tsx`                      | page                                                | SSG (2 paths) |
| `/contact`                          | `app/(marketing)/contact/page.tsx`              | page                                                | dynamic       |
| `/dashboard`                        | `app/dashboard/page.tsx`                        | page                                                | static        |
| `/dashboard`                        | `app/dashboard/@sidebar/page.tsx`               | parallel slot `@sidebar`                            | static        |
| `/dashboard/settings`               | `app/dashboard/settings/page.tsx`               | page                                                | static        |
| `/docs/[[...slug]]`                 | `app/docs/[[...slug]]/page.tsx`                 | page                                                | dynamic       |
| `/feed`                             | `app/feed/page.tsx`                             | page                                                | static        |
| `/help/[...slug]`                   | `app/help/[...slug]/page.tsx`                   | page                                                | dynamic       |
| `/home`                             | `app/(marketing)/home/page.tsx`                 | page                                                | static        |
| `/icon.svg`                         | `app/icon.svg`                                  | metadata route                                      | static        |
| `/login`                            | `app/(auth)/login/page.tsx`                     | page                                                | static        |
| `/manifest.webmanifest`             | `app/manifest.ts`                               | metadata route                                      | static        |
| `/photo/[id]`                       | `app/photo/[id]/page.tsx`                       | page                                                | dynamic       |
| `/photo/[id]`                       | `app/feed/@modal/(..)photo/[id]/page.tsx`       | intercepting route (client navigation from `/feed`) | dynamic       |
| `/products`                         | `app/products/page.tsx`                         | page                                                | static        |
| `/products/[id]`                    | `app/products/[id]/page.tsx`                    | page                                                | SSG (3 paths) |
| `/products/[id]/reviews/[reviewId]` | `app/products/[id]/reviews/[reviewId]/page.tsx` | page                                                | dynamic       |
| `/products/[id]/specs`              | `app/products/[id]/specs/page.tsx`              | page                                                | dynamic       |
| `/register`                         | `app/(auth)/register/page.tsx`                  | page                                                | static        |
| `/robots.txt`                       | `app/robots.ts`                                 | metadata route                                      | static        |
| `/sitemap.xml`                      | `app/sitemap.ts`                                | metadata route                                      | static        |

<!-- route-map:end -->

Rendering, as reported by `next build`: **static** is prerendered at build time, **SSG** is prerendered once per `generateStaticParams` entry, **dynamic** is rendered on each request.

## Patterns

| Pattern                  | In this repo                                                                                                                                       | Docs                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Static route             | `app/about/page.tsx` → `/about`                                                                                                                    | [static-routes](docs/static-routes.md)                                  |
| Dynamic segment          | `app/products/[id]/page.tsx` → `/products/1`                                                                                                       | [dynamic-routes](docs/dynamic-routes.md)                                |
| Nested dynamic segments  | `app/products/[id]/reviews/[reviewId]/page.tsx`                                                                                                    | [nested-routes](docs/nested-routes.md)                                  |
| Pending link state       | `useLinkStatus` in `app/_components/pending-hint.tsx` → link to `/products/1/specs`                                                                | [nested-routes](docs/nested-routes.md#pending-state-without-loadingtsx) |
| Catch-all                | `app/help/[...slug]/page.tsx` → `/help/a/b/c`, but not `/help`                                                                                     | [catch-all-routes](docs/catch-all-routes.md)                            |
| Optional catch-all       | `app/docs/[[...slug]]/page.tsx` → `/docs` and `/docs/a/b`                                                                                          | [catch-all-routes](docs/catch-all-routes.md)                            |
| Route groups             | `app/(marketing)/`, `app/(auth)/` → not part of the URL                                                                                            | [route-groups](docs/route-groups.md)                                    |
| Private folders          | `app/_components/`, `app/dashboard/_components/` → never routable                                                                                  | [route-groups](docs/route-groups.md#private-folders)                    |
| Layouts and templates    | `app/layout.tsx`, `app/dashboard/layout.tsx`, `app/template.tsx`                                                                                   | [layouts](docs/layouts.md)                                              |
| Component error boundary | `catchError` in `app/dashboard/_components/widget-boundary.tsx` → `/dashboard` widget                                                              | [layouts](docs/layouts.md#component-level-error-boundaries)             |
| Parallel routes          | `app/@analytics/`, `app/dashboard/@sidebar/`                                                                                                       | [parallel-routes](docs/parallel-routes.md)                              |
| Intercepting routes      | `app/feed/@modal/(..)photo/[id]/` → `/photo/1` as a modal                                                                                          | [intercepting-routes](docs/intercepting-routes.md)                      |
| Proxy                    | `proxy.ts` → redirects `/admin` to `/`                                                                                                             | [proxy](docs/proxy.md)                                                  |
| Route handlers           | `app/api/hello/`, `app/api/posts/`, `app/api/posts/[id]/`                                                                                          | [api-routes](docs/api-routes.md)                                        |
| Static generation        | `generateStaticParams` in `products/[id]` and `blog/[slug]`                                                                                        | [dynamic-routes](docs/dynamic-routes.md#static-generation)              |
| Metadata                 | A unique title on every page (`metadata` or `generateMetadata` plus the root title template); `sitemap.ts`, `robots.ts`, `manifest.ts`, `icon.svg` | [dynamic-routes](docs/dynamic-routes.md#static-generation)              |
| Server Actions           | `app/(marketing)/contact/actions.ts` → `<form action>` and `redirect()`                                                                            | —                                                                       |
| Auth interrupts          | `app/account/page.tsx` → `unauthorized()`, `forbidden()`                                                                                           | [Behavior](#streaming-fixes-the-status-code)                            |

## Special files

| File               | Role                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------- |
| `layout.tsx`       | Shared UI for a segment and everything below it. Keeps its state across navigation.     |
| `template.tsx`     | Like a layout, but remounts when its own segment (including dynamic params) changes.    |
| `loading.tsx`      | Suspense fallback for the segment. Makes the response stream; see below.                |
| `error.tsx`        | Error boundary for the segment. `retry()` re-fetches and re-renders it (Next.js 16.3+). |
| `global-error.tsx` | Replaces the root layout when it throws, so it renders its own `<html>` and `<body>`.   |
| `not-found.tsx`    | UI for `notFound()` and for URLs that match no route.                                   |
| `forbidden.tsx`    | UI for `forbidden()` (403). Experimental, enabled with `experimental.authInterrupts`.   |
| `unauthorized.tsx` | UI for `unauthorized()` (401). Experimental, same flag.                                 |
| `default.tsx`      | Fallback for a parallel slot that has no match on a full page load.                     |

How these nest inside each other is shown in [docs/layouts.md](docs/layouts.md#component-hierarchy).

## Behavior worth knowing

### Parallel slots keep their state on client navigation

A slot is a prop of the layout at the same level, and only renders where that layout places it. On client navigation an unmatched slot keeps its last active page; on a full page load it renders `default.tsx`. Try it: open `/`, follow a link, and the `@analytics` panel stays; reload, and it is gone.

Since Next.js 16 a slot without `default.tsx` fails the build when its layout has child routes. `app/dashboard/@sidebar/default.tsx` re-exports the sidebar page, so `/dashboard/settings` shows the same sidebar after a reload.

### Interception only happens on client navigation

Clicking a photo on `/feed` renders `app/feed/@modal/(..)photo/[id]` inside a `<dialog>`, with the feed still behind it. Esc, a backdrop click or the Close button call `router.back()`. Loading `/photo/1` directly or reloading renders the full page in `app/photo/[id]`. That canonical page is required: since Next.js 16.4 the build fails if an interception route has none.

### Streaming fixes the status code

`/account` returns a real 401, `/account?as=user` a 403. That only works because no `loading.tsx` sits above `/account`. A `loading.tsx` makes the page stream, and once streaming has started the status is already 200: `notFound()`, `forbidden()` and `unauthorized()` then only swap the UI and add a `noindex` tag. This is why the only `loading.tsx` in the repo lives on the reviews route, where `getReview()` simulates a slow fetch.

### A required and an optional catch-all can't share a folder

`help/[...slug]` and `help/[[...slug]]` side by side would both match every non-empty path. Next.js refuses to build that (in 16.2 and 16.4 with an internal `InvariantError` while collecting page data), so the two variants live under different parents here.

### Proxy is not an authorization layer

`proxy.ts` replaced `middleware.ts`, which still works but is deprecated. Proxy runs on the Node.js runtime and suits redirects, rewrites, headers and optimistic checks. Server Actions are POST requests to the page that uses them, so a matcher change can silently stop covering them: check authorization where data is read or changed.

## Type-safe routing

`next typegen` (also run by `next dev` and `next build`) turns the route tree into global types, so no `params` type is written by hand:

- `PageProps<'/blog/[slug]'>` for pages and `generateMetadata`
- `LayoutProps<'/dashboard'>` for layouts, including their slots (`sidebar`)
- `RouteContext<'/api/posts/[id]'>` for route handlers

With `typedRoutes: true` in `next.config.ts`, every literal `<Link href>` is checked against the same tree, so a typo such as `/prodcts/1` fails type-checking. Hrefs built at runtime, like the breadcrumb's, need an explicit `as Route` cast. The `typecheck` script runs `next typegen` first, so it works on a fresh checkout without a build.

## Deployment

The app needs a Node.js server or a platform such as Vercel. It uses Proxy, Server Actions, route handlers and request-time rendering, so a static export (`output: 'export'`) is not an option.

```bash
pnpm build
pnpm start
```

On Vercel, set the project's Root Directory to `nextjs`. For containers and other hosts, see the official [self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting).

## License

MIT. See [LICENSE](../LICENSE).
