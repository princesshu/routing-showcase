'use client';

// Replaces the root layout when it throws, so it must render <html> and <body>.
// In production, error messages from Server Components are replaced with a
// generic one, so only the digest is safe to show.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest =
    error instanceof Error && 'digest' in error ? String(error.digest) : null;

  return (
    <html lang="en">
      <body>
        <h1>Something went wrong.</h1>
        {digest && <p>Error digest: {digest}</p>}
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  );
}
