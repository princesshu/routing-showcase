# Search params

Search params are typed route state. A route declares their shape in `validateSearch`, and from then on links, hooks and loaders all use that shape.

**In this repo:** `src/routes/products/index.tsx`, sorted by name or price with `?sort=`.

## Validation

```tsx
validateSearch: (search: Record<string, unknown>): { sort?: Sort } => ({
  sort: isSort(search.sort) ? search.sort : undefined,
}),
```

| URL                        | `Route.useSearch()`   | Response           |
| -------------------------- | --------------------- | ------------------ |
| `/products`                | `{ sort: undefined }` | 200                |
| `/products?sort=price`     | `{ sort: 'price' }`   | 200                |
| `/products?sort=bogus`     | (never rendered)      | 307 to `/products` |
| `/products?sort=price&x=1` | `{ sort: 'price' }`   | 200, no redirect   |

The server answers with the URL that validation produced, so an invalid value is redirected away before anything renders. Keys the validator doesn't mention don't cause a redirect.

## Links

`search` on a link is checked against the same shape:

```tsx
<Link to="/products" search={{ sort: 'price' }}>
```

`search={{ sort: 'stock' }}` is a type error.

## Loaders

A loader doesn't read search params directly. `loaderDeps` picks the ones it depends on, and they become part of the loader's cache key:

```tsx
loaderDeps: ({ search }) => ({ sort: search.sort ?? 'name' }),
loader: ({ deps }) => [...products].sort(/* by deps.sort */),
```

Each sort order is a separate entry in the router's loader cache.

## Good to know

- **The validator can be a schema.** `validateSearch` also accepts a Zod, Valibot or ArkType schema. This repo uses a plain function to stay free of dependencies.
- **Next.js and Astro hand over strings.** There, `searchParams` and `Astro.url.searchParams` are untyped, and each page parses them itself.

Reference: [Search params](https://tanstack.com/router/latest/docs/framework/react/guide/search-params), [Data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
