# On-demand rendering

Astro prerenders every page unless the page exports `prerender = false`. On-demand pages render per request on the server, through the adapter; here that is `@astrojs/node`.

**In this repo:** the routes marked "on demand" in the [route map](../README.md#route-map): `/account` (status codes), `/contact` (an action), `/cached` (route caching), `/crash` (the 500 page), plus the review, files and priority pages.

## Choosing per page

```astro
---
export const prerender = false;
---
```

With `output: 'server'` in the config the default flips, and `prerender = true` opts single pages back into prerendering. The config here keeps the static default, so a page is on demand only where it says so.

## Status codes

```astro
---
// src/pages/account.astro
const { user } = Astro.locals;

if (!user) Astro.response.status = 401;
else if (user.role !== 'admin') Astro.response.status = 403;
---
```

`/account` returns 401, `/account?as=user` 403, `/account?as=admin` 200. The status and headers can only be set in the page's own frontmatter: Astro streams HTML, so by the time a component renders, the response line has been sent. Next.js has the same limit once a page streams. Astro has no special files for 401 or 403; the page renders its own message.

## Actions

An action is a typed server function. With `accept: 'form'` it takes an ordinary form POST, so `/contact` works without client JavaScript.

```ts
// src/actions/index.ts
export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      // An empty form field arrives as null, so the type error is the
      // "missing" message.
      name: z.string({ error: 'Enter your name.' }),
      message: z
        .string({ error: 'Write a message.' })
        .min(10, 'Write at least 10 characters.'),
    }),
    handler: async ({ name }) => ({ name }),
  }),
};
```

```astro
---
// src/pages/contact.astro
const result = Astro.getActionResult(actions.contact);

if (result && !result.error) {
  return Astro.redirect(
    `/contact?sent=${encodeURIComponent(result.data.name)}`,
    303
  );
}

const errors = isInputError(result?.error) ? result.error.fields : {};
---

<form method="POST" action={actions.contact}>
  …
</form>
```

`action={actions.contact}` becomes `?_action=contact`: the form posts to the page itself, Astro runs the action and then renders the page, which reads the result. Invalid input renders the form again with status 400 and the messages from the schema. The page must be on demand, because a prerendered page can't receive a POST.

## Route caching

```astro
---
// src/pages/cached.astro
Astro.cache.set({ maxAge: 10, swr: 20 });
---
```

The first request renders the page and stores it (`X-Astro-Cache: MISS`). For the next 10 seconds requests get the stored copy (`HIT`) and the timestamp on the page does not change. For 20 more seconds the stale copy is sent while a fresh one renders (`STALE`). The provider is set in the config:

```ts
// astro.config.ts
cache: { provider: memoryCache() },
```

`tags` on `cache.set()` and `cache.invalidate({ tags })` purge entries on demand. `routeRules` in the config sets the same options for many routes by pattern.

## Good to know

- **Caching is off in `astro dev`.** `cache.set()` does nothing there. Build and run `pnpm preview` to see it work.
- **The memory cache is per process.** With several instances, each keeps its own copy. Netlify, Vercel and Cloudflare have experimental providers that hand the work to their CDN.
- **`500.astro` only covers on-demand pages.** `/crash` throws on purpose; a prerendered page that throws fails the build instead.

Reference: [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [Actions](https://docs.astro.build/en/guides/actions/), [Route caching](https://docs.astro.build/en/guides/caching/)
