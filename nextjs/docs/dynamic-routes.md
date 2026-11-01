# Dynamic segments

A folder name in square brackets, such as `[id]`, matches any single URL segment and passes its value to the page as `params`.

**In this repo:** `app/products/[id]/page.tsx` → `/products/1`, `app/blog/[slug]/page.tsx` → `/blog/hello-world`.

## How it works

```
app/
├─ products/
│  └─ [id]/
│     └─ page.tsx    → /products/1, /products/abc
└─ blog/
   └─ [slug]/
      └─ page.tsx    → /blog/hello-world
```

## Example

```tsx
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/data';

export default async function Product({ params }: PageProps<'/products/[id]'>) {
  const { id } = await params; // id: string
  const product = getProduct(id);

  if (!product) notFound();

  return <h1>{product.name}</h1>;
}
```

- `params` is a Promise since Next.js 15. Await it in Server Components, or read it with React's `use()` in Client Components.
- `PageProps<'/products/[id]'>` is a global type generated from the folder structure (Next.js 15.5+), so the param types cannot drift from the folder names. See [Type-safe routing](../README.md#type-safe-routing).

## Static generation

```tsx
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}
```

`/products/1`, `/products/2` and `/products/3` are prerendered at build time (**SSG** in the [route map](../README.md#route-map)). Other ids are still rendered on demand, because `dynamicParams` defaults to `true`: `/products/999` runs the page, reaches `notFound()` and returns a 404. Export `const dynamicParams = false` to return a 404 for every unlisted id without running the page.

`generateMetadata` receives the same `params`, so each product gets its own `<title>`. The root layout's title template turns `Quantum Keyboard` into `Quantum Keyboard · Routing Showcase`.

## Good to know

- Param values are always strings (`string[]` for catch-all segments). Validate them before use.
- With `typedRoutes` enabled, ``<Link href={`/products/${id}`}>`` is type-checked against this route.

Reference: [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
