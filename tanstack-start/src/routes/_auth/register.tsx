import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/register')({
  head: () => ({
    meta: [{ title: 'Register · TanStack Start Routing Showcase' }],
  }),
  component: Register,
});

function Register() {
  return (
    <>
      <h1>Register</h1>
      <p>
        <code>src/routes/_auth/register.tsx</code> maps to{' '}
        <code>/register</code>.
      </p>
    </>
  );
}
