# Server routes and server functions

A server route answers HTTP requests at its URL. A server function is code the app calls from its own components and loaders, which always runs on the server.

**In this repo:** `src/routes/api/hello.ts`, `src/routes/robots[.]txt.ts` and `fetchProduct` in `src/routes/products/$id.tsx`.

## Server routes

A route file with `server.handlers` and no component is a server route. It follows the same file naming rules as pages:

```ts
// src/routes/api/hello.ts
export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () =>
        Response.json({ message: 'Hello from a TanStack Start server route' }),
      POST: async ({ request }) => {
        const body: unknown = await request.json().catch(() => null);
        return Response.json({ received: body }, { status: 201 });
      },
    },
  },
});
```

| Request           | Response                                  |
| ----------------- | ----------------------------------------- |
| `GET /api/hello`  | 200, JSON                                 |
| `POST /api/hello` | 201, the JSON body echoed back            |
| `GET /robots.txt` | 200, `text/plain`, from `robots[.]txt.ts` |

Handlers receive a standard `Request` and return a standard `Response`. A route can have both `server` and `component`, and `server.middleware` runs before all of its handlers, and before the server renders any page the route is part of.

## Server functions

`createServerFn` defines a function whose handler stays on the server:

```tsx
// src/routes/products/$id.tsx
const fetchProduct = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(({ data: id }) => getProduct(id) ?? null);
```

The product loader calls `fetchProduct({ data: params.id })`. During SSR that is a direct call; after hydration the same call is a request to `GET /_serverFn/<id>?payload=…`, which the browser sends on a client navigation to a product. The id stays the same across builds of the same code.

## Which one

Server routes are for clients outside the app: other services, crawlers, webhooks. Server functions are for the app's own calls: typed input and output, serialization handled for you, and the [CSRF check](request-pipeline.md#csrf) in front of them.

## Good to know

- **Types don't validate input.** `.validator()` is where a server function checks what it receives; a TypeScript annotation alone checks nothing at runtime.
- **Link to a server route with `reloadDocument`.** It is in the typed route tree, but it has no component, so the home page lets the browser load the response instead of navigating on the client.

Reference: [Server routes](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes), [Server functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
