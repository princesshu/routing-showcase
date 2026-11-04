import { Link, createFileRoute, redirect } from '@tanstack/react-router';

type Role = 'admin' | 'user';

const isRole = (value: unknown): value is Role =>
  value === 'admin' || value === 'user';

export const Route = createFileRoute('/account')({
  validateSearch: (search: Record<string, unknown>): { as?: Role } => ({
    as: isRole(search.as) ? search.as : undefined,
  }),
  // Runs before the loader and the component: on the server for the first
  // request, in the browser on client navigation. That makes it a routing
  // guard, not a security check; real authorization belongs on the server.
  beforeLoad: ({ search }) => {
    if (!search.as) throw redirect({ to: '/login' });
    // Merged into the route context for this route and its children.
    return { role: search.as };
  },
  head: () => ({
    meta: [{ title: 'Account · TanStack Start Routing Showcase' }],
  }),
  component: Account,
});

function Account() {
  const { role } = Route.useRouteContext();

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Account</h1>
      <p>
        Signed in as <code>{role}</code>.
      </p>
    </main>
  );
}
