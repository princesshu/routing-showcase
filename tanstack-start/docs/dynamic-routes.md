# Dynamic routes

A segment that starts with `$` matches any value at its place in the URL and passes it to the route as a param.

**In this repo:** `src/routes/products/$id.tsx`, `src/routes/{-$locale}/greeting.tsx` and `src/routes/files/$.tsx`.

## Params

| File                      | URL              | Params                  |
| ------------------------- | ---------------- | ----------------------- |
| `products/$id.tsx`        | `/products/1`    | `{ id: '1' }`           |
| `{-$locale}/greeting.tsx` | `/greeting`      | `{ locale: undefined }` |
| `{-$locale}/greeting.tsx` | `/de/greeting`   | `{ locale: 'de' }`      |
| `files/$.tsx`             | `/files/a/b.txt` | `{ _splat: 'a/b.txt' }` |
| `files/$.tsx`             | `/files`         | `{ _splat: '' }`        |

The router does not check what a param contains. Each route validates its own: `products/$id` throws `notFound()` for an unknown id, and the greeting route for a locale the app doesn't have:

```tsx
// src/routes/{-$locale}/greeting.tsx
beforeLoad: ({ params }) => {
  if (params.locale !== undefined && !isLocale(params.locale)) {
    throw notFound();
  }
},
```

## Optional segments

`{-$locale}` may be there or not, so one file serves `/greeting` and `/de/greeting`. English has no prefix, so `/en/greeting` is a 404, as in the Astro app. A link sets the segment, or leaves it out with `undefined`:

```tsx
<Link to="/{-$locale}/greeting" params={{ locale: 'de' }}>
<Link to="/{-$locale}/greeting" params={{ locale: undefined }}>
```

The first link is `/de/greeting`, the second `/greeting`. Static and dynamic segments at the same place win over an optional segment.

## Splat routes

A bare `$` as the last segment matches the rest of the path, slashes included, as `params._splat`. It also matches the folder itself: `/files` renders `files/$.tsx`. A splat can only be the last segment.

## Loaders

`products/$id` loads its data in `loader`, which receives the parsed params. The loader runs on the server for the first request and in the browser on client navigation. Here it calls a [server function](server-routes.md#server-functions), so the data access itself always happens on the server:

```tsx
loader: async ({ params }) => {
  const product = await fetchProduct({ data: params.id });
  if (!product) throw notFound();
  return product;
},
```

`/products/1` to `/products/3` are also [prerendered](rendering.md#prerendering) at build time; every other id is rendered on request.

## Good to know

- **Params are always strings.** Convert or validate them in `beforeLoad` or the loader, or with the route's `params.parse` option.
- **A pathless layout name can't hold a param.** `_$id/` is not a valid folder; use `$id/` with a pathless layout inside it.

Reference: [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts), [Path params](https://tanstack.com/router/latest/docs/framework/react/guide/path-params)
