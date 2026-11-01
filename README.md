# Routing Showcase

Runnable references for file-system routing, one app per framework. In each app, every routing convention has a working page, a short doc and a row in a route map that is generated from the build, so the docs can't drift from the code.

| App                         | Folder              | Model                                                                                      |
| --------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| [Next.js](nextjs/README.md) | [`nextjs/`](nextjs) | App Router: React Server Components; client-side navigation with layouts that stay mounted |
| [Astro](astro/README.md)    | [`astro/`](astro)   | Multi-page; prerendered by default, on demand per page; client and server islands          |

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
pnpm -C nextjs dev   # http://localhost:3000
pnpm -C astro dev    # http://localhost:4321
```

Both apps can run at the same time, each in its own terminal. Each home page links to every pattern in that app.

## Comparison

The same routing problems, side by side. "None" means the framework has no convention for it; "not shown" means it exists but this repo has no demo yet.

| Pattern                              | Next.js                                                             | Astro                                                      |
| ------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| Static route                         | `app/about/page.tsx`                                                | `src/pages/about.astro`                                    |
| Dynamic segment                      | `app/products/[id]/page.tsx`, `generateStaticParams`                | `src/pages/products/[id].astro`, `getStaticPaths()`        |
| Unknown param on a prerendered route | rendered on demand (`dynamicParams`)                                | 404                                                        |
| Catch-all                            | `[...slug]` (one or more), `[[...slug]]` (zero or more), `string[]` | `[...slug]` (zero or more), one string                     |
| Overlapping routes                   | some combinations fail the build                                    | resolved by [route priority](astro/docs/route-priority.md) |
| Route groups                         | `(marketing)/`, `(auth)/`                                           | none                                                       |
| Excluded folders                     | `_components/`                                                      | `_drafts/`                                                 |
| Layouts                              | `layout.tsx`, nested by folder, stay mounted                        | components with `<slot />`, remount on every navigation    |
| Parallel routes                      | `@analytics/`, `@sidebar/`                                          | none                                                       |
| Intercepting routes                  | `feed/@modal/(..)photo/[id]/`                                       | none                                                       |
| Not found                            | `not-found.tsx`, `notFound()`                                       | `404.astro`, a bodyless 404 response                       |
| Errors                               | `error.tsx`, `global-error.tsx`, `catchError`                       | `500.astro`, for on-demand pages                           |
| 401 and 403                          | `unauthorized()`, `forbidden()` (experimental)                      | `Astro.response.status`                                    |
| Redirects                            | `redirect()`, in `proxy.ts`                                         | `redirects` in the config, `Astro.redirect()`              |
| Rewrites                             | not shown                                                           | `Astro.rewrite()`                                          |
| Code before routing                  | `proxy.ts`                                                          | `src/fetch.ts`                                             |
| Code around a route                  | none                                                                | `src/middleware.ts`                                        |
| HTTP endpoints                       | `route.ts` route handlers                                           | `.ts` endpoints in `src/pages/`                            |
| Form mutations                       | Server Actions                                                      | Actions                                                    |
| Pagination                           | none                                                                | `paginate()`                                               |
| Locale routing                       | none                                                                | `i18n` config with fallbacks                               |
| Dynamic parts of a static page       | Suspense and streaming                                              | server islands                                             |
| Client-side navigation               | always on                                                           | opt-in with `<ClientRouter />`                             |
| Response caching                     | not shown                                                           | `Astro.cache.set()`                                        |
| Typed links                          | `typedRoutes`                                                       | none                                                       |
| Route map source                     | `.next` build manifests                                             | the `astro:routes:resolved` integration hook               |

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
