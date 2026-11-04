import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import styles from '../../styles/frame.module.css';

// A pathless layout: "_auth" never appears in the URL, so /login and
// /register share this frame without an /auth prefix. Next.js gets the same
// result with a (group) folder and a layout.tsx inside it.
export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <div className={styles.frame}>
        <p className={styles.label}>src/routes/_auth/route.tsx</p>
        <Outlet />
        <p>
          <Link to="/login">Log in</Link> · <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
}
