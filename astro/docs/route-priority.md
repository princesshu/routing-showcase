# Route priority

Several routes can match the same URL. Next.js refuses to build some of these overlaps; Astro allows them and picks a winner by a fixed list of rules.

**In this repo:** `src/pages/priority/` holds three routes that all match `/priority/<something>`.

| URL                  | Routes that match                                 | Winner            | Rule                        |
| -------------------- | ------------------------------------------------- | ----------------- | --------------------------- |
| `/priority/static`   | `static.astro`, `[name].astro`, `[...rest].astro` | `static.astro`    | static before dynamic       |
| `/priority/anything` | `[name].astro`, `[...rest].astro`                 | `[name].astro`    | named before rest parameter |
| `/priority/a/b`      | `[...rest].astro`                                 | `[...rest].astro` | the only match              |
| `/priority`          | `[...rest].astro`                                 | `[...rest].astro` | empty rest parameter        |

`/products/latest` is the same rule at work: the static `latest.astro` beats `[id].astro`, then [rewrites](redirects-and-rewrites.md#rewrites) to `/products/3`.

## The rules, in order

1. Astro's reserved routes: `/_astro/`, `/_server-islands/` and `/_actions/`.
2. Routes with more path segments before routes with fewer.
3. Static routes before dynamic routes.
4. Named parameters before rest parameters.
5. Prerendered dynamic routes before on-demand dynamic routes.
6. Endpoints before pages.
7. File-based routes before redirects from the config.
8. Otherwise, alphabetical order.

## Good to know

- **Rule 7 means a page shadows a redirect.** A `redirects` entry for a URL that also has a page never fires.
- **Reserved routes come first.** Server islands and actions are served from routes Astro adds itself. They appear in the [route map](../README.md#route-map) as built in, and no page can take their place.

Reference: [Route priority order](https://docs.astro.build/en/guides/routing/#route-priority-order)
