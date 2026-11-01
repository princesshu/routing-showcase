# Endpoints

A `.ts` or `.js` file under `src/pages/` that exports functions named after HTTP methods is an endpoint. Each function receives the request context and returns a `Response`.

**In this repo:** `src/pages/api/notes/index.ts` (`GET`, `POST`), `src/pages/api/notes/[id].ts` (`GET`, `DELETE`), `src/pages/robots.txt.ts` (`GET`, prerendered).

## On demand

```ts
// src/pages/api/notes/[id].ts
import type { APIRoute } from 'astro';
import { deleteNote, getNote } from '../../../data/notes';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const note = getNote(params.id);
  return note
    ? Response.json(note)
    : Response.json({ error: 'Not found' }, { status: 404 });
};

export const DELETE: APIRoute = ({ params }) =>
  deleteNote(params.id)
    ? new Response(null, { status: 204 })
    : Response.json({ error: 'Not found' }, { status: 404 });
```

```bash
curl localhost:4321/api/notes
curl -X POST -H 'content-type: application/json' -d '{"text":"hi"}' localhost:4321/api/notes
curl -X DELETE localhost:4321/api/notes/2
```

`POST` validates the body and answers 400 when it is not `{ "text": string }`, or 201 with a `Location` header when it is. A method that the file does not export gets a 404, not the 405 that Next.js route handlers send.

## Prerendered

An endpoint without `prerender = false` runs once, at build time, and its response is written to a file. The file name comes from the route, so `robots.txt.ts` produces `/robots.txt`:

```ts
// src/pages/robots.txt.ts
export const GET: APIRoute = () =>
  new Response('User-agent: *\nDisallow: /api/\n');
```

This is how Astro builds the files that Next.js generates from `robots.ts`, `sitemap.ts` and similar metadata files. A dynamic prerendered endpoint, such as `[id].json.ts`, uses `getStaticPaths()` like a page.

## Good to know

- **The notes live in memory.** `src/data/notes.ts` keeps them in a module-level `Map`, so they reset when the server restarts.
- **Endpoints run middleware** like pages do, and win over a page with the same URL ([route priority](route-priority.md)).
- **`ALL`** handles any method that has no function of its own. Export it to answer unsupported methods with a proper 405.

Reference: [Endpoints](https://docs.astro.build/en/guides/endpoints/)
