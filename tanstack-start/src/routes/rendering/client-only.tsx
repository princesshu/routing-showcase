import { Link, createFileRoute } from '@tanstack/react-router';

// ssr: false keeps this route off the server: the server sends the document
// with the pending component in its place, and the browser runs the loader
// and renders the route after hydration. For code that needs the browser.
export const Route = createFileRoute('/rendering/client-only')({
  ssr: false,
  loader: () => ({ userAgent: navigator.userAgent }),
  head: () => ({
    meta: [{ title: 'Client only · TanStack Start Routing Showcase' }],
  }),
  pendingComponent: () => <main>Waiting for the browser…</main>,
  component: ClientOnly,
});

function ClientOnly() {
  const { userAgent } = Route.useLoaderData();

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Rendered in the browser</h1>
      <p>
        The loader read <code>navigator.userAgent</code>, which does not exist
        on the server: <code>{userAgent}</code>
      </p>
    </main>
  );
}
