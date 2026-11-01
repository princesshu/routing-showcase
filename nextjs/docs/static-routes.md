# Static routes

A folder inside `app/` becomes a URL segment once it contains a `page.tsx`. A folder without a `page.tsx` (or `route.ts`) is not routable.

**In this repo:** `app/page.tsx` → `/`, `app/about/page.tsx` → `/about`, `app/products/page.tsx` → `/products`.

## How it works

```
app/
├─ page.tsx          → /
├─ about/
│  └─ page.tsx       → /about
└─ products/
   └─ page.tsx       → /products
```

## Example

```tsx
// app/about/page.tsx
export default function About() {
  return (
    <main>
      <h1>About</h1>
    </main>
  );
}
```

## Good to know

- Pages are Server Components by default. A page that reads no request-time data (cookies, headers, `searchParams`) is prerendered at build time and shows up as **static** in the [route map](../README.md#route-map).
- Other files can live next to `page.tsx`: components, CSS Modules, tests. Only `page` and `route` files are publicly routable.

Reference: [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
