# Routing Showcase

Runnable references for file-system routing, one app per framework. In each app, every routing convention has a working page, a short doc and a row in a route map that is generated from the build, so the docs can't drift from the code.

| App                                        | Folder                              | Model                                                                                                                                              |
| ------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](nextjs/README.md)                | [`nextjs/`](nextjs)                 | App Router: React Server Components; client-side navigation with layouts that stay mounted                                                         |
| [Astro](astro/README.md)                   | [`astro/`](astro)                   | Multi-page; prerendered by default, on demand per page; client and server islands                                                                  |
| [TanStack Start](tanstack-start/README.md) | [`tanstack-start/`](tanstack-start) | TanStack Router with SSR: typed routes and search params; client-side navigation with layouts that stay mounted; server rendering chosen per route |

## Contents

- [Getting started](#getting-started)
- [Comparison](#comparison)
- [Repository layout](#repository-layout)
- [Checks](#checks)
- [Adding a framework](#adding-a-framework)
- [License](#license)

## Getting started

The repository is a pnpm workspace. Install once at the root, then start an app from its folder:

```bash
pnpm install
pnpm -C nextjs dev           # http://localhost:3000
pnpm -C astro dev            # http://localhost:4321
pnpm -C tanstack-start dev   # http://localhost:3001
```

All three apps can run at the same time, each in its own terminal. Each home page links to every pattern in that app.

## Comparison

The same routing problems, side by side. "None" means the framework has no convention for it; "not shown" means it exists but this repo has no demo yet.

| Pattern                              | Next.js                                                             | Astro                                                      | TanStack Start                                                               |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Static route                         | `app/about/page.tsx`                                                | `src/pages/about.astro`                                    | `src/routes/about.tsx`                                                       |
| Dynamic segment                      | `app/products/[id]/page.tsx`, `generateStaticParams`                | `src/pages/products/[id].astro`, `getStaticPaths()`        | `src/routes/products/$id.tsx`, `pages` in the Vite config                    |
| Unknown param on a prerendered route | rendered on demand (`dynamicParams`)                                | 404                                                        | rendered on request                                                          |
| Catch-all                            | `[...slug]` (one or more), `[[...slug]]` (zero or more), `string[]` | `[...slug]` (zero or more), one string                     | `$` (zero or more), one string                                               |
| Optional segment                     | none                                                                | none                                                       | `{-$locale}`                                                                 |
| Overlapping routes                   | some combinations fail the build                                    | resolved by [route priority](astro/docs/route-priority.md) | sorted by specificity: index, static, dynamic, optional, splat               |
| Route groups                         | `(marketing)/`, `(auth)/`                                           | none                                                       | `(marketing)/`                                                               |
| Excluded folders                     | `_components/`                                                      | `_drafts/`                                                 | `-components/`                                                               |
| Layouts                              | `layout.tsx`, nested by folder, stay mounted                        | components with `<slot />`, remount on every navigation    | `route.tsx`, pathless `_auth/`, stay mounted; `products_/` leaves the layout |
| Parallel routes                      | `@analytics/`, `@sidebar/`                                          | none                                                       | none                                                                         |
| Intercepting routes                  | `feed/@modal/(..)photo/[id]/`                                       | none                                                       | [route masking](tanstack-start/docs/route-masking.md)                        |
| Not found                            | `not-found.tsx`, `notFound()`                                       | `404.astro`, a bodyless 404 response                       | `notFoundComponent`, `notFound()`                                            |
| Errors                               | `error.tsx`, `global-error.tsx`, `catchError`                       | `500.astro`, for on-demand pages                           | `errorComponent`                                                             |
| 401 and 403                          | `unauthorized()`, `forbidden()` (experimental)                      | `Astro.response.status`                                    | `setResponseStatus()`, not shown; `redirect()` from `beforeLoad`             |
| Redirects                            | `redirect()`, in `proxy.ts`                                         | `redirects` in the config, `Astro.redirect()`              | `redirect()`, in request middleware                                          |
| Rewrites                             | not shown                                                           | `Astro.rewrite()`                                          | the router's `rewrite` option, in both directions                            |
| Code before routing                  | `proxy.ts`                                                          | `src/fetch.ts`                                             | request middleware in `src/start.ts`                                         |
| Code around a route                  | none                                                                | `src/middleware.ts`                                        | `server.middleware` on a route, not shown                                    |
| HTTP endpoints                       | `route.ts` route handlers                                           | `.ts` endpoints in `src/pages/`                            | `server.handlers` in a route file                                            |
| Form mutations                       | Server Actions                                                      | Actions                                                    | server functions, not shown                                                  |
| Pagination                           | none                                                                | `paginate()`                                               | none                                                                         |
| Locale routing                       | none                                                                | `i18n` config with fallbacks                               | optional segment, or a rewrite                                               |
| Dynamic parts of a static page       | Suspense and streaming                                              | server islands                                             | deferred loader data, not shown                                              |
| Rendering per route                  | decided by the build: static, SSG or dynamic                        | `export const prerender` per page                          | `ssr` option per route, `pages` to prerender                                 |
| Client-side navigation               | always on                                                           | opt-in with `<ClientRouter />`                             | always on; hover preloading with `defaultPreload`                            |
| Response caching                     | not shown                                                           | `Astro.cache.set()`                                        | not shown                                                                    |
| Typed links                          | `typedRoutes`                                                       | none                                                       | built in, with params and search                                             |
| Search params                        | `searchParams` prop, strings                                        | `Astro.url.searchParams`, strings                          | `validateSearch`, typed                                                      |
| Route map source                     | `.next` build manifests                                             | the `astro:routes:resolved` integration hook               | `routeTree.gen.ts` and `dist/client`                                         |

Each app's README explains its column in detail, including the less obvious behavior.

## Repository layout

```
.
├─ nextjs/                 Next.js App Router app
│  ├─ app/                 routes
│  ├─ docs/                one page per pattern
│  └─ scripts/route-map.mts
├─ astro/                  Astro app
│  ├─ src/pages/           routes
│  ├─ docs/                one page per pattern
│  ├─ integrations/route-map.ts
│  └─ scripts/route-map.ts
├─ tanstack-start/         TanStack Start app
│  ├─ src/routes/          routes
│  ├─ docs/                one page per pattern
│  └─ scripts/route-map.ts
├─ .github/workflows/ci.yml
├─ package.json            workspace scripts and Prettier
└─ pnpm-workspace.yaml
```

Each app has its own dependencies, ESLint config and TypeScript config, as its framework's templates expect. Prettier is shared and runs from the root.

## Checks

From the root:

```bash
pnpm lint            # every app
pnpm typecheck       # every app
pnpm build           # every app
pnpm format:check    # the whole repository
```

`pnpm route-map --check` runs inside an app folder after its build. CI runs all of these on Node.js 24, with one job per app.

## Adding a framework

1. Create a folder for the app and add it to `pnpm-workspace.yaml`.
2. Give it `lint`, `typecheck`, `build` and `route-map` scripts, where `route-map --check` fails when the README table is out of date.
3. Write a README with a route map and a `docs/` folder with one page per pattern.
4. Add the folder to the `app` matrix in `.github/workflows/ci.yml`.
5. Add a column to the comparison above.

## License

MIT. See [LICENSE](LICENSE).
