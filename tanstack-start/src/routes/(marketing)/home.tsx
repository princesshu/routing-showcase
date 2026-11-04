import { Link, createFileRoute } from '@tanstack/react-router';

// "(marketing)" is a route group: it organizes files and never appears in
// the URL. Unlike a pathless "_" layout, it adds no route of its own.
export const Route = createFileRoute('/(marketing)/home')({
  head: () => ({
    meta: [{ title: 'Home · TanStack Start Routing Showcase' }],
  }),
  component: MarketingHome,
});

function MarketingHome() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Marketing home</h1>
      <p>
        <code>src/routes/(marketing)/home.tsx</code> maps to <code>/home</code>.
      </p>
    </main>
  );
}
