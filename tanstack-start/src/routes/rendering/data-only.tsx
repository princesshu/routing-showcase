import { Link, createFileRoute } from '@tanstack/react-router';

// ssr: 'data-only' runs the loader on the server and sends its result with
// the document, but renders the component only in the browser.
export const Route = createFileRoute('/rendering/data-only')({
  ssr: 'data-only',
  loader: () => ({
    loadedAt: new Date().toISOString(),
    // 'server' for the first request, 'browser' on client navigation.
    loadedIn: typeof window === 'undefined' ? 'server' : 'browser',
  }),
  head: () => ({
    meta: [{ title: 'Data only · TanStack Start Routing Showcase' }],
  }),
  pendingComponent: () => <main>Waiting for the browser…</main>,
  component: DataOnly,
});

function DataOnly() {
  const { loadedAt, loadedIn } = Route.useLoaderData();

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Rendered in the browser</h1>
      <p>
        Loader ran in the <code>{loadedIn}</code>
      </p>
      <p>
        Loaded at <code>{loadedAt}</code>
      </p>
    </main>
  );
}
