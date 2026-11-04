import { createFileRoute } from '@tanstack/react-router';

// A server route: HTTP handlers and no component. It lives in the same route
// tree as the pages, so the same file naming rules apply.
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
