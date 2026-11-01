import { useEffect, useState } from 'preact/hooks';

type Props = { label: string };

// Renders as plain HTML on the server. The status text only switches to
// "interactive" once a client directive has hydrated this island.
export default function Counter({ label }: Props) {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        {label}: {count}
      </button>{' '}
      <small>{hydrated ? 'interactive' : 'static HTML'}</small>
    </p>
  );
}
