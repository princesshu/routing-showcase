# Layouts

A route with child routes renders them through `<Outlet />`. On client navigation between its children, the layout stays mounted and only the outlet changes.

**In this repo:** `src/routes/__root.tsx`, `src/routes/products/route.tsx`, `src/routes/_auth/route.tsx`, `src/routes/products_/$id/edit.tsx` and `src/routes/(marketing)/home.tsx`.

## Structure

```
src/routes/
├─ __root.tsx               ← the HTML document, around every route
├─ products/
│  ├─ route.tsx             ← layout for /products and below
│  ├─ index.tsx             → /products
│  └─ $id.tsx               → /products/1
├─ products_/
│  └─ $id/
│     └─ edit.tsx           → /products/1/edit, without the products layout
├─ _auth/
│  ├─ route.tsx             ← pathless layout: no URL segment
│  ├─ login.tsx             → /login
│  └─ register.tsx          → /register
└─ (marketing)/
   └─ home.tsx              → /home
```

## Layout routes

`products/route.tsx` renders the heading and a dashed frame with an `<Outlet />` inside. Moving from `/products` to `/products/1` and back re-renders only the outlet; the frame's DOM stays in place.

## Pathless layouts

A folder or file name that starts with `_` is a layout without a URL segment. `_auth/route.tsx` wraps `/login` and `/register`, and `/auth` does not exist. It is a route of its own, so it can also have a loader, `beforeLoad` or an error component for everything inside.

## Leaving a layout

A trailing `_` on a segment keeps the URL but drops the layout. `products_/$id/edit.tsx` answers `/products/1/edit`, yet renders without `products/route.tsx`.

## Route groups

A folder name in parentheses organizes files and leaves no trace: `(marketing)/home.tsx` is `/home`. Unlike `_auth`, a group adds no route, so it has no layout of its own.

| Folder         | URL segment | Route of its own |
| -------------- | ----------- | ---------------- |
| `products/`    | yes         | yes              |
| `_auth/`       | no          | yes              |
| `(marketing)/` | no          | no               |

## The root route

`__root.tsx` is always matched and always rendered. Its `shellComponent` is the HTML document with `<HeadContent />` in `<head>` and `<Scripts />` at the end of `<body>`. It has no `component`, so it renders its children through an implicit `<Outlet />`.

## Good to know

- **Next.js does this with a group plus a layout file.** A shared layout without a URL segment is `(auth)/layout.tsx` in Next.js and `_auth/route.tsx` here.
- **Leaving a layout has no Next.js file convention.** There, the page would move into a different route group with a different layout.

Reference: [Routing concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts), [Outlets](https://tanstack.com/router/latest/docs/framework/react/guide/outlets)
