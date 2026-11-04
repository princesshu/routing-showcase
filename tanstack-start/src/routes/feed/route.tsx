import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { photoIds } from '../../lib/data';
import styles from '../../styles/feed.module.css';

// The photo grid, plus an <Outlet /> for the child route feed/photo/$id,
// which shows one photo in a modal on top of the grid.
export const Route = createFileRoute('/feed')({
  head: () => ({
    meta: [{ title: 'Feed · TanStack Start Routing Showcase' }],
  }),
  component: Feed,
});

function Feed() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Feed</h1>
      <ul className={styles.grid}>
        {photoIds.map((id) => (
          <li key={id}>
            {/* Navigates to /feed/photo/$id, but the address bar and the
                history entry show /photo/$id. The mask lives only in browser
                history state, so a reload sends /photo/$id to the server;
                unmaskOnReload makes the client render that page too, instead
                of the modal, which would not match the server HTML. */}
            <Link
              to="/feed/photo/$id"
              params={{ id }}
              mask={{ to: '/photo/$id', params: { id }, unmaskOnReload: true }}
              className={styles.tile}
            >
              Photo {id}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
