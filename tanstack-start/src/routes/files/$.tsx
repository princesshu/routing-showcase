import { Link, createFileRoute } from '@tanstack/react-router';

// A splat route: "$" as the last segment matches the rest of the path,
// slashes included, and exposes it as params._splat.
export const Route = createFileRoute('/files/$')({
  component: FilePath,
});

function FilePath() {
  const { _splat = '' } = Route.useParams();
  const segments = _splat.split('/').filter(Boolean);

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Files</h1>
      <p>
        <code>params._splat</code> is <code>{JSON.stringify(_splat)}</code>
      </p>
      <ol>
        {segments.map((segment, index) => (
          <li key={index}>
            <code>{segment}</code>
          </li>
        ))}
      </ol>
    </main>
  );
}
