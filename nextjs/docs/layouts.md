# Layouts and templates

A `layout.tsx` wraps its segment and every route below it. On navigation between those routes, the layout stays mounted: its state is kept and it does not re-render.

**In this repo:** `app/layout.tsx` (root layout, title template, `@analytics` slot) and `app/dashboard/layout.tsx` (sidebar slot and breadcrumb for `/dashboard/*`).

## How it works

```
app/
├─ layout.tsx            → wraps every route (required)
├─ template.tsx          → remounts when the first segment changes
└─ dashboard/
   ├─ layout.tsx         → wraps /dashboard and /dashboard/settings
   ├─ page.tsx           → /dashboard
   └─ settings/
      └─ page.tsx        → /dashboard/settings
```

On `/dashboard/settings`, the root layout wraps the dashboard layout, which wraps the settings page.

## Example

The root layout is required and must render `<html>` and `<body>`:

```tsx
// app/layout.tsx
export default function RootLayout({ children, analytics }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        {children}
        {analytics}
      </body>
    </html>
  );
}
```

A nested layout only wraps its own subtree:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  sidebar,
}: LayoutProps<'/dashboard'>) {
  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

`LayoutProps<'/route'>` is a global type generated from the route tree (Next.js 15.5+). It types `children`, the async `params`, and every parallel slot of that layout.

## Templates

A `template.tsx` wraps the same subtree as a layout, but is remounted instead of kept. It remounts when its own segment, including dynamic params, changes. Navigating within deeper segments does not remount it, and neither do search params. Client Components inside it lose their state and effects run again.

`app/template.tsx` therefore remounts when you move from `/about` to `/dashboard`, but not from `/dashboard` to `/dashboard/settings`.

## Component hierarchy

Within one segment, the special files nest in this order. A child segment's chain takes the place of the page inside its parent's chain.

```mermaid
flowchart TD
  L["layout.tsx"] --> T["template.tsx"]
  T --> E["error.tsx (error boundary)"]
  E --> S["loading.tsx (Suspense boundary)"]
  S --> N["not-found.tsx (not-found boundary)"]
  N --> P["page.tsx, or the child segment's layout.tsx"]
```

So `error.tsx` catches errors from the page and from `loading.tsx`, but not from the layout or template of its own segment, which sit above it. Those are handled by the parent segment's `error.tsx`, or by `global-error.tsx` at the root.

## Component-level error boundaries

`error.tsx` always covers a whole segment. To contain an error to one part of a page, wrap that part with a boundary created by `catchError` from `next/error` (stable since Next.js 16.3).

**In this repo:** `/dashboard` has a status widget that throws a render error on demand. Only the widget is replaced by its fallback; the sidebar, the breadcrumb and the rest of the page keep working. Without the boundary, the error would reach `app/error.tsx` and replace everything below the root layout.

```tsx
// app/dashboard/_components/widget-boundary.tsx
'use client';

import { catchError, type ErrorInfo } from 'next/error';

function WidgetError(
  { title }: { title: string },
  { error, retry }: ErrorInfo
) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <section role="alert">
      <h2>{title} failed</h2>
      <p>{message}</p>
      <button onClick={() => retry()}>Try again</button>
    </section>
  );
}

export default catchError(WidgetError);
```

```tsx
// app/dashboard/page.tsx
<WidgetBoundary title="Status widget">
  <FlakyWidget />
</WidgetBoundary>
```

- The fallback receives the wrapper's props (here `title`) first, and `{ error, retry, reset }` second. It must live in a `'use client'` module.
- `retry()` re-fetches and re-renders the wrapped part; `reset()` only clears the error state.
- Unlike a hand-written React error boundary, it lets `redirect()` and `notFound()` through, and clears itself on client navigation to another route.
- Error boundaries only catch errors thrown while rendering. The widget's button therefore only sets state, and the next render throws.

## Good to know

- **Don't put authorization checks in a layout.** Layouts don't re-render on navigation, so the check would not run again on every route change. Check close to the data instead.
- **Layouts can't read `searchParams`.** They would go stale, since layouts don't re-render. Use the page's `searchParams` prop or `useSearchParams()` in a Client Component.

Reference: [layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template), [Component hierarchy](https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy), [catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)
