# Astro

The Astro part of [Routing Showcase](..): a small, runnable reference for file-based routing in Astro. Every pattern below has a working route in [`src/pages/`](src/pages) and a short explanation in [`docs/`](docs).

Built with Astro, the Node adapter, Preact for the client islands and strict TypeScript. Exact versions are pinned in [`package.json`](package.json); CI runs on the Node.js version set in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Contents

- [Getting started](#getting-started)
- [Route map](#route-map)
- [Patterns](#patterns)
- [Special files](#special-files)
- [Behavior worth knowing](#behavior-worth-knowing)
- [Type safety](#type-safety)
- [Deployment](#deployment)
- [License](#license)

## Getting started

```bash
pnpm install   # once, at the repository root
cd astro
pnpm dev
```

Open http://localhost:4321. The home page links to every pattern. Route caching only works on a production build: run `pnpm build && pnpm preview` to try `/cached`.

CI runs the same checks you can run locally in `astro/`:

```bash
pnpm lint
pnpm typecheck           # astro check
pnpm build
pnpm route-map --check   # README route map matches the build
```

Formatting is checked once for the whole repository, with `pnpm format:check` at the root.

## Route map

Every route in the app, collected during `astro build` by the [`integrations/route-map.ts`](integrations/route-map.ts) integration and written here by [`scripts/route-map.ts`](scripts/route-map.ts). After changing routes, run `pnpm build && pnpm route-map`; CI fails if this table is out of date.

<!-- route-map:start -->

| URL                                 | File                                               | Kind                               | Rendering             |
| ----------------------------------- | -------------------------------------------------- | ---------------------------------- | --------------------- |
| `/`                                 | `src/pages/index.astro`                            | page                               | prerendered           |
| `/_actions/[...path]`               | (built in)                                         | actions                            | on demand             |
| `/_image`                           | (built in)                                         | image endpoint                     | on demand             |
| `/_server-islands/[name]`           | (built in)                                         | server islands                     | on demand             |
| `/404`                              | `src/pages/404.astro`                              | 404 page                           | prerendered           |
| `/500`                              | `src/pages/500.astro`                              | 500 page                           | prerendered           |
| `/about`                            | `src/pages/about.astro`                            | page                               | prerendered           |
| `/account`                          | `src/pages/account.astro`                          | page                               | on demand             |
| `/api/notes`                        | `src/pages/api/notes/index.ts`                     | endpoint (GET, POST)               | on demand             |
| `/api/notes/[id]`                   | `src/pages/api/notes/[id].ts`                      | endpoint (GET, DELETE)             | on demand             |
| `/blog/[...page]`                   | `src/pages/blog/[...page].astro`                   | page                               | prerendered (3 paths) |
| `/cached`                           | `src/pages/cached.astro`                           | page                               | on demand             |
| `/catalog/[id]`                     | `astro.config.ts`                                  | redirect to `/products/[id]` (301) | on demand             |
| `/contact`                          | `src/pages/contact.astro`                          | page                               | on demand             |
| `/crash`                            | `src/pages/crash.astro`                            | page                               | on demand             |
| `/de/greeting`                      | `src/pages/de/greeting.astro`                      | page                               | prerendered           |
| `/farewell`                         | `src/pages/farewell.astro`                         | page                               | prerendered           |
| `/files/[...path]`                  | `src/pages/files/[...path].astro`                  | page                               | on demand             |
| `/greeting`                         | `src/pages/greeting.astro`                         | page                               | prerendered           |
| `/guides/[...slug]`                 | `src/pages/guides/[...slug].astro`                 | page                               | prerendered (3 paths) |
| `/islands/client`                   | `src/pages/islands/client.astro`                   | page                               | prerendered           |
| `/islands/server`                   | `src/pages/islands/server.astro`                   | page                               | prerendered           |
| `/moved-for-now`                    | `astro.config.ts`                                  | redirect to `/about` (307)         | on demand             |
| `/old-about`                        | `astro.config.ts`                                  | redirect to `/about` (301)         | on demand             |
| `/priority/[...rest]`               | `src/pages/priority/[...rest].astro`               | page                               | on demand             |
| `/priority/[name]`                  | `src/pages/priority/[name].astro`                  | page                               | on demand             |
| `/priority/static`                  | `src/pages/priority/static.astro`                  | page                               | prerendered           |
| `/products`                         | `src/pages/products/index.astro`                   | page                               | prerendered           |
| `/products/[id]`                    | `src/pages/products/[id].astro`                    | page                               | prerendered (3 paths) |
| `/products/[id]/reviews/[reviewId]` | `src/pages/products/[id]/reviews/[reviewId].astro` | page                               | on demand             |
| `/products/latest`                  | `src/pages/products/latest.astro`                  | page                               | prerendered           |
| `/robots.txt`                       | `src/pages/robots.txt.ts`                          | endpoint (GET)                     | prerendered           |
| `/transitions/[step]`               | `src/pages/transitions/[step].astro`               | page                               | prerendered (3 paths) |

<!-- route-map:end -->

Rendering, as reported by Astro: **prerendered** pages are HTML files written at build time, one per path for dynamic routes; **on demand** routes are rendered by the server for each request. The `/de/` fallbacks of the [i18n config](docs/i18n.md) are not listed.

## Patterns

| Pattern                   | In this repo                                                                           | Docs                                                              |
| ------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Static route              | `src/pages/about.astro` → `/about`                                                     | [static-routes](docs/static-routes.md)                            |
| Excluded files            | `src/pages/_drafts/` → never routable                                                  | [static-routes](docs/static-routes.md#excluding-files)            |
| Error pages               | `src/pages/404.astro`, `src/pages/500.astro` → `/crash`                                | [static-routes](docs/static-routes.md#error-pages)                |
| Dynamic route             | `src/pages/products/[id].astro` with `getStaticPaths()`                                | [dynamic-routes](docs/dynamic-routes.md)                          |
| Nested dynamic, on demand | `src/pages/products/[id]/reviews/[reviewId].astro`                                     | [dynamic-routes](docs/dynamic-routes.md#on-demand-astroparams)    |
| Pagination                | `paginate()` in `src/pages/blog/[...page].astro` → `/blog`, `/blog/2`                  | [dynamic-routes](docs/dynamic-routes.md#pagination)               |
| Rest parameter            | `src/pages/files/[...path].astro` → `/files` and `/files/a/b/c`                        | [rest-parameters](docs/rest-parameters.md)                        |
| Content collection        | `src/pages/guides/[...slug].astro` → one page per Markdown file                        | [rest-parameters](docs/rest-parameters.md#content-collections)    |
| Route priority            | `src/pages/priority/` → static, named and rest routes for the same URLs                | [route-priority](docs/route-priority.md)                          |
| Redirects                 | `redirects` in `astro.config.ts`, `Astro.redirect()` in `/contact`                     | [redirects-and-rewrites](docs/redirects-and-rewrites.md)          |
| Rewrites                  | `Astro.rewrite()` in `src/pages/products/latest.astro`                                 | [redirects-and-rewrites](docs/redirects-and-rewrites.md#rewrites) |
| Request entry point       | `src/fetch.ts` → `/healthz`, `/admin`                                                  | [request-pipeline](docs/request-pipeline.md)                      |
| Middleware                | `src/middleware.ts` → session for `/account`, `Server-Timing` header                   | [request-pipeline](docs/request-pipeline.md#srcmiddlewarets)      |
| Internationalization      | `src/pages/greeting.astro`, `src/pages/de/greeting.astro`, fallback for `/de/farewell` | [i18n](docs/i18n.md)                                              |
| Client islands            | `client:*` directives in `src/pages/islands/client.astro`                              | [islands](docs/islands.md)                                        |
| Server islands            | `server:defer` in `src/pages/islands/server.astro`                                     | [islands](docs/islands.md#server-islands)                         |
| View transitions          | `<ClientRouter />` and `transition:persist` in `/transitions/[step]`                   | [view-transitions](docs/view-transitions.md)                      |
| On-demand rendering       | `export const prerender = false`; status codes in `/account`                           | [on-demand-rendering](docs/on-demand-rendering.md)                |
| Actions                   | `src/actions/index.ts` → form on `/contact`                                            | [on-demand-rendering](docs/on-demand-rendering.md#actions)        |
| Route caching             | `Astro.cache.set()` in `src/pages/cached.astro`                                        | [on-demand-rendering](docs/on-demand-rendering.md#route-caching)  |
| Endpoints                 | `src/pages/api/notes/`, `src/pages/robots.txt.ts`                                      | [endpoints](docs/endpoints.md)                                    |

## Special files

| File                    | Role                                                                          |
| ----------------------- | ----------------------------------------------------------------------------- |
| `astro.config.ts`       | Adapter, integrations, `redirects`, `i18n` and the cache provider.            |
| `src/fetch.ts`          | Entry point for every request that reaches the server, before route matching. |
| `src/middleware.ts`     | Runs around each matched page and endpoint; exports `onRequest`.              |
| `src/actions/index.ts`  | Exports `server`, the actions that pages and forms can call.                  |
| `src/content.config.ts` | Defines content collections, here `guides`.                                   |
| `src/pages/404.astro`   | Page for unmatched URLs and bodyless 404 responses.                           |
| `src/pages/500.astro`   | Page for errors thrown while rendering on demand; receives `error`.           |
| `src/env.d.ts`          | Declares `App.Locals`, the type of `Astro.locals`.                            |

There is no layout, loading or error-boundary file convention. Layouts are components (`src/layouts/Base.astro`), and how routes nest is decided by imports, not folders.

## Behavior worth knowing

### A rest parameter also matches the folder itself

`[...path]` matches `/files` with `path` undefined, and its value is one string such as `a/b/c`, not an array. Astro has no rest parameter that requires a segment, so the Next.js trouble with a required and an optional catch-all in one folder cannot happen. When several routes match the same URL, [route priority](docs/route-priority.md) decides instead of a build error.

### Static output cannot send a status code

A prerendered file is sent with 200. That is why the i18n fallback `/de/farewell` is an HTML page with a meta refresh rather than a 3xx redirect, and why config redirects only become real 301 and 307 responses because the Node adapter serves them. Pages that must answer 401, 403 or 404 have to render on demand, like `/account`.

### An on-demand page cannot rewrite to a prerendered page

The prerendered page's component is not in the server bundle, so `Astro.rewrite('/404')` from an on-demand page fails with a 500. Return `new Response(null, { status: 404 })` instead; Astro then renders `404.astro`. See [redirects and rewrites](docs/redirects-and-rewrites.md#good-to-know).

### Middleware runs at build time too

For prerendered pages, `src/middleware.ts` runs once during the build, with no cookies or client headers, and never at request time. `context.isPrerendered` tells the cases apart. `src/fetch.ts` never sees prerendered pages at all, and config redirects skip middleware. See [request pipeline](docs/request-pipeline.md#good-to-know).

### A server island has its own URL

Inside a server island, `Astro.url` is `/_server-islands/<Name>`; the page URL is only in the `Referer` header. Props travel encrypted in the query string, with a key that changes on every build unless `ASTRO_KEY` is set. See [islands](docs/islands.md#good-to-know).

### Nothing survives navigation unless it opts in

Each navigation loads a new document, so layouts remount and island state is lost. `<ClientRouter />` with `transition:persist` keeps chosen islands alive. This is also why Astro has no parallel or intercepting routes. See [view transitions](docs/view-transitions.md).

## Type safety

`astro check` type-checks `.astro` files as well as TypeScript, with `strict` enabled. What it covers:

- `GetStaticPaths` and `InferGetStaticPropsType` type the props that `getStaticPaths()` passes to a page. `Page<T>` types a paginated page.
- `App.Locals` in `src/env.d.ts` types `Astro.locals` in pages and `context.locals` in middleware.
- Action input is validated and typed by its Zod schema, and `result.data` in `/contact` has the handler's return type.
- `Fetchable` checks the shape of `src/fetch.ts`.

What it does not cover: `href` values. Astro has no equivalent of Next.js `typedRoutes`, so a link to `/prodcts/1` type-checks; the route map and a link check in the browser are what catch it. On-demand params are typed `string | undefined` and are not tied to the folder names.

## Deployment

The app needs a Node.js server: on-demand pages, endpoints, server islands, actions and route caching all run there.

```bash
pnpm build
node dist/server/entry.mjs
```

Set `HOST` and `PORT` in the environment to choose where the server listens. With more than one instance, set the same `ASTRO_KEY` on all of them for server islands, and note that the memory cache is per instance. For other hosts, swap `@astrojs/node` for their adapter.

## License

MIT. See [LICENSE](../LICENSE).
