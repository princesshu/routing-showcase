# Route handlers

A `route.ts` file turns a folder into an HTTP endpoint. It exports one function per HTTP method and returns a Web `Response`.

**In this repo:**

| File                          | URL            | Methods     |
| ----------------------------- | -------------- | ----------- |
| `app/api/hello/route.ts`      | `/api/hello`   | GET, POST   |
| `app/api/posts/route.ts`      | `/api/posts`   | GET, POST   |
| `app/api/posts/[id]/route.ts` | `/api/posts/1` | GET, DELETE |

## Example: a collection

```ts
// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { posts } from '@/lib/data';

export function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const post = await request.json();
  return NextResponse.json(post, { status: 201 });
}
```

## Example: a single item

```ts
// app/api/posts/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params; // id: string
  return NextResponse.json({ id, title: `Post ${id}` });
}
```

`RouteContext<'/api/posts/[id]'>` is a global type generated from the folder structure (Next.js 15.5+). As in pages, `params` is a Promise.

## Good to know

- **Supported methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` and `OPTIONS`. Other methods get a `405 Method Not Allowed`. If `OPTIONS` is not exported, Next.js answers it with the right `Allow` header.
- **Not cached by default.** That is why every `/api/*` entry in the [route map](../README.md#route-map) is dynamic. A `GET` handler can opt into caching, for example with `export const dynamic = 'force-static'`.
- **One or the other:** a folder can have a `page.tsx` or a `route.ts`, not both.
- **Forms in your own UI** are usually better served by a Server Action (see `app/(marketing)/contact/`). Route handlers fit webhooks, external clients and non-HTML responses.

Reference: [route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
