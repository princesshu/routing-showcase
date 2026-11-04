# Redirects and rewrites

A redirect sends the browser to another URL. A rewrite lets a route answer at a URL other than its own path.

**In this repo:** the `/admin` redirect in `src/start.ts`, `redirect()` in `src/routes/account.tsx`, and the `rewrite` option in `src/router.tsx`.

## Redirects

| URL                  | Where                                    | Response        |
| -------------------- | ---------------------------------------- | --------------- |
| `/admin`, `/admin/*` | request middleware, before routing       | 307 to `/`      |
| `/account`           | `redirect()` in the route's `beforeLoad` | 307 to `/login` |

`redirect()` is thrown from `beforeLoad` or a loader. Its `to` is typed like a link's, its status is 307 unless `statusCode` says otherwise, and in the browser it becomes a client-side navigation. For the request middleware version, see [request pipeline](request-pipeline.md#request-middleware).

## Rewrites

The router's `rewrite` option maps URLs in both directions. `input` turns the URL in the address bar into the route path before matching; `output` turns route paths back into public URLs, for every generated `href` and every navigation:

```tsx
// src/router.tsx
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
```

| URL              | Response                                                       |
| ---------------- | -------------------------------------------------------------- |
| `/team`          | 200, rendered by `src/routes/internal/team.tsx`; the URL stays |
| `/internal/team` | 307 to `/team`                                                 |

`<Link to="/internal/team">` renders `href="/team"`. Rewrites run on the server and in the browser alike.

## Good to know

- **An input-only rewrite becomes a redirect.** The server answers every URL in its public form, so mapping `/about-us` to `/about` on input alone gives a 307 to `/about`. To keep the old URL, add the output side.
- **`basepath` is a rewrite too.** When both are set, the base path is stripped before your `input` runs and added after your `output`.
- **Locale prefixes can be a rewrite.** TanStack's docs show `/en/about` mapped to `/about` with a rewrite. This repo uses an [optional segment](dynamic-routes.md#optional-segments) instead, which keeps the locale in the params.

Reference: [URL rewrites](https://tanstack.com/router/latest/docs/framework/react/guide/url-rewrites), [Navigation](https://tanstack.com/router/latest/docs/framework/react/guide/navigation)
