# Redirects and rewrites

A redirect sends the browser to another URL. A rewrite serves another route's content while the URL in the address bar stays the same.

**In this repo:** the `redirects` option in `astro.config.ts`, `Astro.redirect()` in `src/pages/contact.astro`, and `Astro.rewrite()` in `src/pages/products/latest.astro`.

## Redirects in the config

```ts
// astro.config.ts
redirects: {
  '/old-about': '/about',
  // Dynamic redirects work when both sides use the same parameters.
  '/catalog/[id]': '/products/[id]',
  '/moved-for-now': { status: 307, destination: '/about' },
},
```

| URL              | Response             |
| ---------------- | -------------------- |
| `/old-about`     | 301 to `/about`      |
| `/catalog/2`     | 301 to `/products/2` |
| `/moved-for-now` | 307 to `/about`      |

A plain string redirects with 301. The object form sets another status.

## Redirects in a page

`Astro.redirect(url, status)` returns a redirect response from the page's frontmatter. `/contact` uses it after a successful form submission, so reloading the confirmation does not submit the form again:

```astro
---
if (result && !result.error) {
  return Astro.redirect(
    `/contact?sent=${encodeURIComponent(result.data.name)}`,
    303
  );
}
---
```

## Rewrites

`Astro.rewrite(path)` renders another route in place of the current one. The URL does not change, and the target's middleware runs again.

```astro
---
// src/pages/products/latest.astro
return Astro.rewrite('/products/3');
---
```

`/products/latest` shows the Photon Monitor page. The page is prerendered, so the rewrite happens once, at build time.

## Good to know

- **Static output can't send a status code.** Without an adapter, a config redirect is written as an HTML page with a `<meta http-equiv="refresh">` tag, served with 200. The Node adapter used here answers it with a real 301 or 307, and adapters for other hosts write the redirects into the host's own config.
- **A dynamic redirect does not check its target.** `/catalog/9` redirects to `/products/9`, which is a 404.
- **An on-demand page can't rewrite to a prerendered one.** The prerendered page's component is not in the server bundle, so `Astro.rewrite('/404')` from an on-demand page fails with a 500. To show the 404 page from an on-demand page, return `new Response(null, { status: 404 })`, as `src/pages/products/[id]/reviews/[reviewId].astro` does.
- **Redirect at the page level, not in a component.** Once the page starts streaming HTML, the status and headers have already been sent.
- **A page with the same URL wins.** File-based routes take [priority](route-priority.md) over config redirects.

Reference: [Redirects](https://docs.astro.build/en/guides/routing/#redirects), [Rewrites](https://docs.astro.build/en/guides/routing/#rewrites)
