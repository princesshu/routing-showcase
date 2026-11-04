import {
  Link,
  createFileRoute,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

export const Route = createFileRoute('/crash')({
  loader: (): never => {
    throw new Error('Simulated failure in the /crash loader');
  },
  // Catches errors from this route's loader and component. Without it, the
  // error goes up to the nearest parent with an errorComponent, or to the
  // router's default.
  errorComponent: CrashError,
  component: () => null,
});

function CrashError({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Something went wrong</h1>
      <p>
        <code>{error instanceof Error ? error.message : String(error)}</code>
      </p>
      {/* invalidate() runs the loaders again and resets the boundary. */}
      <button type="button" onClick={() => router.invalidate()}>
        Try again
      </button>
    </main>
  );
}
