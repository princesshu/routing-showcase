'use client';

import { useEffect } from 'react';

// retry() (stable since Next.js 16.3) re-fetches and re-renders the segment;
// reset() only clears the error state without fetching again.
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong.</h1>
      <button onClick={() => retry()}>Try again</button>
    </main>
  );
}
