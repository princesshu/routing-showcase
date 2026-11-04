import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/login')({
  head: () => ({
    meta: [{ title: 'Log in · TanStack Start Routing Showcase' }],
  }),
  component: Login,
});

function Login() {
  return (
    <>
      <h1>Log in</h1>
      <p>
        <code>src/routes/_auth/login.tsx</code> maps to <code>/login</code>.
      </p>
    </>
  );
}
