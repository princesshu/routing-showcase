import { Link, createFileRoute } from '@tanstack/react-router';

// Published as /team by the rewrite in src/router.tsx. Links still use the
// typed route path, /internal/team.
export const Route = createFileRoute('/internal/team')({
  head: () => ({
    meta: [{ title: 'Team · TanStack Start Routing Showcase' }],
  }),
  component: Team,
});

function Team() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Team</h1>
      <p>
        <code>src/routes/internal/team.tsx</code> has the route path{' '}
        <code>/internal/team</code>; the router&apos;s rewrite serves it at{' '}
        <code>/team</code>.
      </p>
    </main>
  );
}
