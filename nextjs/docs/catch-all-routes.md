# Catch-all segments

`[...slug]` matches one or more URL segments. `[[...slug]]` (optional catch-all) also matches zero segments.

**In this repo:** `app/help/[...slug]/page.tsx` → `/help/a/b/c`, `app/docs/[[...slug]]/page.tsx` → `/docs` and `/docs/a/b`.

## How it works

| Route                           | URL           | `params`                    |
| ------------------------------- | ------------- | --------------------------- |
| `app/help/[...slug]/page.tsx`   | `/help`       | no match (404)              |
| `app/help/[...slug]/page.tsx`   | `/help/a`     | `{ slug: ['a'] }`           |
| `app/help/[...slug]/page.tsx`   | `/help/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |
| `app/docs/[[...slug]]/page.tsx` | `/docs`       | `{ slug: undefined }`       |
| `app/docs/[[...slug]]/page.tsx` | `/docs/a/b`   | `{ slug: ['a', 'b'] }`      |

## Example

```tsx
// app/docs/[[...slug]]/page.tsx
export default async function DocsOptional({
  params,
}: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await params; // string[] | undefined
  return <h1>Optional Docs Path: {slug?.join('/') || 'index'}</h1>;
}
```

## Good to know

- **A required and an optional catch-all cannot share a folder.** `help/[...slug]` and `help/[[...slug]]` side by side would both match every non-empty path. Next.js refuses to build that; in 16.2 and 16.4 the build stops with an internal `InvariantError` while collecting page data. That is why the two variants live under different parents here.
- **A catch-all must be the last segment** of the route. Nothing can follow it.
- **Typed routes and the bare optional URL:** the generated route types (checked on Next.js 16.2 and 16.4) cover `/docs/<slug>` but not the bare `/docs`, so the home page links to it with `'/docs' as Route`.

Reference: [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
