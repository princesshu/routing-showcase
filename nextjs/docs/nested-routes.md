# Nested dynamic segments

Dynamic folders can be nested. The page receives the params of every dynamic segment from the root down.

**In this repo:** `app/products/[id]/reviews/[reviewId]/page.tsx` → `/products/1/reviews/1`, and `app/products/[id]/specs/page.tsx` → `/products/1/specs`.

## How it works

```
app/
└─ products/
   └─ [id]/
      ├─ page.tsx              → /products/1
      ├─ reviews/
      │  └─ [reviewId]/
      │     ├─ loading.tsx     → shown while the page loads
      │     └─ page.tsx        → /products/1/reviews/1
      └─ specs/
         └─ page.tsx           → /products/1/specs (slow, no loading.tsx)
```

## Example

```tsx
// app/products/[id]/reviews/[reviewId]/page.tsx
import { getReview } from '@/lib/data';

export default async function Review({
  params,
}: PageProps<'/products/[id]/reviews/[reviewId]'>) {
  const { id, reviewId } = await params; // both strings
  const review = await getReview(id, reviewId);

  return <h1>{review.text}</h1>;
}
```

## Loading state

`getReview()` waits 800 ms to simulate a slow fetch. The `loading.tsx` next to the page wraps it in a Suspense boundary, so navigating from `/products/1` shows "Loading review…" at once and then streams in the review.

This is the only `loading.tsx` in the repo on purpose. A `loading.tsx` makes the response stream, and a streamed response keeps its 200 status even if `notFound()`, `forbidden()` or `unauthorized()` runs later. Placed at the root, it would cost `/account` its real 401 and 403 status codes. See [Streaming fixes the status code](../README.md#streaming-fixes-the-status-code).

## Pending state without loading.tsx

`/products/1/specs` is just as slow (`getSpecs()` waits 1.2 s) but has no `loading.tsx`. A client navigation to it waits for the server before the URL changes, and without feedback the click looks ignored. `useLinkStatus` from `next/link` reports that wait as `pending` on the clicked link:

```tsx
// app/_components/pending-hint.tsx
'use client';

import { useLinkStatus } from 'next/link';
import styles from './pending-hint.module.css';

export default function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={pending ? `${styles.hint} ${styles.pending}` : styles.hint}
    />
  );
}
```

```tsx
// app/products/[id]/page.tsx
<Link href={`/products/${id}/specs`} prefetch={false}>
  Specs
  <PendingHint />
</Link>
```

The product page links to both routes, so the two approaches can be compared side by side:

| Destination             | What the user sees after the click                                |
| ----------------------- | ----------------------------------------------------------------- |
| `/products/1/reviews/1` | URL changes at once, `loading.tsx` shows, then the review streams |
| `/products/1/specs`     | URL stays, the link shows a spinner, then the page appears        |

- `useLinkStatus` only works in a component rendered inside the `<Link>`.
- If the target was already prefetched, there is no pending phase. `prefetch={false}` makes the demo deterministic.
- The hint is always rendered at a fixed size and only fades in, so it causes no layout shift.
- Prefer `loading.tsx` or prefetching for slow routes. `useLinkStatus` is for subtle inline feedback where those don't apply. The home page uses the same hint on every link, and it only appears for the routes that actually wait.

Reference: [Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading), [useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status)
