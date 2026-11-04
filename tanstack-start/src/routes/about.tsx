import { Link, createFileRoute } from '@tanstack/react-router';

// A static route: src/routes/about.tsx maps to /about.
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [{ title: 'About · TanStack Start Routing Showcase' }],
  }),
  component: About,
});

function About() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>About</h1>
      <p>
        <code>src/routes/about.tsx</code> maps to <code>/about</code>. The route
        has no loader, so a client navigation renders it right away.
      </p>
    </main>
  );
}
