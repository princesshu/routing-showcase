# Rest parameters

`[...path]` matches any number of segments, including none. It is Astro's catch-all, and it behaves like the optional catch-all `[[...slug]]` of Next.js: there is no form that requires at least one segment.

**In this repo:** `src/pages/files/[...path].astro` → `/files` and `/files/a/b/c`, `src/pages/guides/[...slug].astro` → `/guides` and `/guides/advanced/route-priority`.

## How it works

| Route                              | URL                               | `Astro.params`                        |
| ---------------------------------- | --------------------------------- | ------------------------------------- |
| `src/pages/files/[...path].astro`  | `/files`                          | `{ path: undefined }`                 |
| `src/pages/files/[...path].astro`  | `/files/a`                        | `{ path: 'a' }`                       |
| `src/pages/files/[...path].astro`  | `/files/a/b/c`                    | `{ path: 'a/b/c' }`                   |
| `src/pages/guides/[...slug].astro` | `/guides/advanced/route-priority` | `{ slug: 'advanced/route-priority' }` |

The value is one string with the slashes kept, not an array of segments as in Next.js. Split it yourself if you need the parts.

## Content collections

`src/content.config.ts` defines a `guides` collection from the Markdown files in `src/content/guides/`. Each entry's id is its path without the extension, so a rest parameter can take the id as it is:

```astro
---
// src/pages/guides/[...slug].astro
import { getCollection, render } from 'astro:content';

export const getStaticPaths = (async () => {
  const guides = await getCollection('guides');
  return guides.map((entry) => ({
    // The index entry gets an undefined rest parameter, so it serves /guides.
    params: { slug: entry.id === 'index' ? undefined : entry.id },
    props: { entry },
  }));
}) satisfies GetStaticPaths;

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<h1>{entry.data.title}</h1>
<Content />
```

Adding a Markdown file adds a page, and moving it into a subfolder changes its URL.

## Good to know

- **Prerendered:** return `undefined` for the rest parameter in `getStaticPaths()` to build the top-level page. **On demand:** the top-level URL simply arrives with the parameter `undefined`.
- **One rest parameter per route** when rendering on demand. `[locale]/[...slug]` is fine, `[...a]/[...b]` is not.
- When a rest parameter competes with other routes for the same URL, it loses to all of them. See [route priority](route-priority.md).

Reference: [Rest parameters](https://docs.astro.build/en/guides/routing/#rest-parameters), [Content collections](https://docs.astro.build/en/guides/content-collections/)
