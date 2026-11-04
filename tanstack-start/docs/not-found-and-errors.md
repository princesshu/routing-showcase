# Not found and errors

A route renders `notFoundComponent` for a missing resource and `errorComponent` for a thrown error. Both work as boundaries: the nearest route that has one handles it, and the server sends the matching status code.

**In this repo:** the root `notFoundComponent` in `src/routes/__root.tsx`, `notFound()` in `src/routes/products/$id.tsx` and `src/routes/{-$locale}/greeting.tsx`, and `errorComponent` in `src/routes/crash.tsx`.

## Not found

| URL            | What happens                                                                                            | Status |
| -------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| `/missing`     | No route matches; the root `notFoundComponent` renders.                                                 | 404    |
| `/products/4`  | The loader throws `notFound()`; the route's own `notFoundComponent` renders inside the products layout. | 404    |
| `/fr/greeting` | `beforeLoad` throws `notFound()`; the route has no `notFoundComponent`, so the root's renders.          | 404    |

```tsx
// src/routes/products/$id.tsx
loader: async ({ params }) => {
  const product = await fetchProduct({ data: params.id });
  if (!product) throw notFound();
  return product;
},
notFoundComponent: ProductNotFound,
```

`notFoundComponent` has no loader data, because the loader did not finish. `ProductNotFound` reads the id from `Route.useParams()` instead.

## Errors

`/crash` throws in its loader, and the route's `errorComponent` renders with a 500 status. Its button calls `router.invalidate()`, which runs the loaders again and resets the boundary:

```tsx
<button type="button" onClick={() => router.invalidate()}>
  Try again
</button>
```

Without an `errorComponent` on the route, the error goes up to the nearest parent that has one, or to the router's default.

## Good to know

- **Error messages reach the HTML in production.** The `/crash` page shows the thrown message after a production build too. Show a generic text for unexpected errors.
- **Always give the root a `notFoundComponent`.** Without one, the router renders a deliberately minimal built-in page.

Reference: [Not found errors](https://tanstack.com/router/latest/docs/framework/react/guide/not-found-errors), [Error boundaries](https://tanstack.com/start/latest/docs/framework/react/guide/error-boundaries)
