# Dynamic routes

A file or folder name in square brackets, such as `[id]`, matches one URL segment and exposes its value as `Astro.params.id`. How the values are known depends on whether the page is prerendered or rendered on demand.

**In this repo:** `src/pages/products/[id].astro` (prerendered), `src/pages/products/[id]/reviews/[reviewId].astro` (on demand), `src/pages/blog/[...page].astro` (pagination).

## Prerendered: getStaticPaths()

A prerendered dynamic page must export `getStaticPaths()`. It returns every set of params to build, plus optional props for each one.

```astro
---
// src/pages/products/[id].astro
import type { GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { products } from '../../data/catalog';

export const getStaticPaths = (() =>
  products.map((product) => ({
    params: { id: product.id },
    props: { product },
  }))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { product } = Astro.props;
---

<h1>{product.name}</h1>
```

The build writes `/products/1`, `/products/2` and `/products/3`, and nothing else: `/products/4` is a 404. Unlike Next.js with its default `dynamicParams = true`, a prerendered Astro page never falls back to rendering an unknown id on demand.

## On demand: Astro.params

With `export const prerender = false` there is no `getStaticPaths()`. The page runs for every matching URL and must handle unknown values itself.

```astro
---
// src/pages/products/[id]/reviews/[reviewId].astro
export const prerender = false;

const { id, reviewId } = Astro.params; // string | undefined
const product = getProduct(id);
const review = getReview(reviewId);

// A bodyless 404 makes Astro render src/pages/404.astro with that status.
if (!product || !review) return new Response(null, { status: 404 });
---
```

Each bracketed folder adds a parameter, so this page gets both `id` and `reviewId`. `/products/1/reviews/9` returns the 404 page.

## Pagination

`paginate()` is passed to `getStaticPaths()` and splits a list into pages:

```astro
---
// src/pages/blog/[...page].astro
export const getStaticPaths = (({ paginate }) =>
  paginate(posts, { pageSize: 2 })) satisfies GetStaticPaths;

const { page } = Astro.props; // page.data, page.currentPage, page.url.next, …
---
```

With a rest parameter the first page is `/blog` itself, followed by `/blog/2` and `/blog/3`. With `[page].astro` instead, the first page would be `/blog/1`. `page.url.prev` and `page.url.next` are `undefined` at the ends, which keeps the navigation links simple.

## Content collections

A collection can supply the paths. `src/pages/guides/[...slug].astro` builds one page per Markdown file in `src/content/guides/`; see [rest parameters](rest-parameters.md#content-collections).

## Good to know

- **Param values are strings**, not decoded. Use `decodeURI()` if a value can contain encoded characters.
- **Prerendered pages can't read the request.** `getStaticPaths()` runs at build time, so there are no cookies, headers or query string. Anything that depends on them needs `prerender = false`.

Reference: [Dynamic routes](https://docs.astro.build/en/guides/routing/#dynamic-routes), [Pagination](https://docs.astro.build/en/guides/routing/#pagination)
