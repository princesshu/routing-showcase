import { useEffect, useId, useRef } from 'react';
import {
  Link,
  createFileRoute,
  notFound,
  useCanGoBack,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { photoIds } from '../../../lib/data';
import styles from '../../../styles/feed.module.css';

// A child of /feed, so it renders inside the feed's <Outlet />, over the
// grid. Links from the feed mask it as /photo/$id.
export const Route = createFileRoute('/feed/photo/$id')({
  beforeLoad: ({ params }) => {
    if (!photoIds.includes(params.id)) throw notFound();
  },
  component: PhotoModal,
});

function PhotoModal() {
  const { id } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  // Closing the dialog first returns focus to the photo link it was opened
  // from. Then back to that feed entry; after a direct load there is no such
  // entry, so navigate to /feed instead.
  const close = () => {
    dialogRef.current?.close();
    if (canGoBack) router.history.back();
    else void navigate({ to: '/feed' });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={styles.dialog}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          Photo {id}
        </h2>
        <p>
          Rendered by <code>src/routes/feed/photo/$id.tsx</code> over the feed.{' '}
          <Link to="/photo/$id" params={{ id }} reloadDocument>
            Open the full page
          </Link>
        </p>
        <button type="button" onClick={close}>
          Close
        </button>
      </div>
    </dialog>
  );
}
