# Parallel routes

A folder starting with `@` defines a slot: a second (or third) page that the layout at the same level receives as a prop and renders next to `children`. Slots are not URL segments.

**In this repo:** `app/@analytics/` (rendered by `app/layout.tsx`) and `app/dashboard/@sidebar/` (rendered by `app/dashboard/layout.tsx`). Open `/dashboard`.

## How it works

```
app/
├─ layout.tsx            ← receives `analytics`
├─ page.tsx              → /
├─ @analytics/
│  ├─ page.tsx           → slot content for /
│  └─ default.tsx        → null for any other URL on a full page load
└─ dashboard/
   ├─ layout.tsx         ← receives `sidebar`
   ├─ page.tsx           → /dashboard
   ├─ settings/
   │  └─ page.tsx        → /dashboard/settings
   └─ @sidebar/
      ├─ page.tsx        → slot content for /dashboard
      └─ default.tsx     → reuses page.tsx for /dashboard/settings
```

A slot only appears where its layout places it. Files in an `@folder` whose layout ignores the prop are never rendered.

## Example

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

`LayoutProps<'/dashboard'>` is generated from the route tree and already includes `sidebar`, so a misspelled slot name is a type error. It does not check that the slot is rendered: leaving `{sidebar}` out of the JSX still compiles.

## Which page a slot shows

| Navigation                                   | Slot has a page for the URL | Slot has no page for the URL |
| -------------------------------------------- | --------------------------- | ---------------------------- |
| Client navigation (`<Link>`, `router.push`)  | that page                   | its last active page         |
| Full page load (direct URL, reload, new tab) | that page                   | `default.tsx`                |

Try it with `@analytics`: open `/`, follow any link, and the panel stays. Reload the new page, and the slot renders its `default.tsx`, which returns `null`.

## default.tsx

- **Required since Next.js 16 when the slot's segment has child routes.** `@sidebar` needs one because `/dashboard/settings` exists; without it the build fails with `Missing required default.js file for parallel route at /dashboard/@sidebar`.
- **Pick the fallback deliberately:** return `null`, call `notFound()`, or reuse the page. `app/dashboard/@sidebar/default.tsx` re-exports the sidebar page, so the sidebar looks the same after a reload of `/dashboard/settings`.
- **`children` is a slot too.** If another slot has pages that `children` lacks, `children` can need a `default.tsx` of its own.

## Good to know

- **Slots at one level render together.** If one slot is dynamic, all slots at that level are rendered dynamically.
- **Hidden slots still run.** A layout that shows `admin` or `user` depending on a role still renders both slots on the server, including their data fetches. Authorize inside each slot, not only in the layout's condition.

Reference: [Parallel Routes](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes), [default.js](https://nextjs.org/docs/app/api-reference/file-conventions/default)
