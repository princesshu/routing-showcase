import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { photoIds } from '../../lib/data';

// The page a masked /photo/$id URL resolves to once the mask is gone: a
// shared link, a new tab or a direct visit.
export const Route = createFileRoute('/photo/$id')({
  beforeLoad: ({ params }) => {
    if (!photoIds.includes(params.id)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [{ title: `Photo ${params.id} · TanStack Start Routing Showcase` }],
  }),
  component: PhotoPage,
});

function PhotoPage() {
  const { id } = Route.useParams();

  return (
    <main>
      <p>
        <Link to="/feed">Feed</Link>
      </p>
      <h1>Photo {id}</h1>
      <p>
        The full page from <code>src/routes/photo/$id.tsx</code>.
      </p>
    </main>
  );
}
