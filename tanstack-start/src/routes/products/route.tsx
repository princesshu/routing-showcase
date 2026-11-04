import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import styles from '../../styles/frame.module.css';

// The layout for /products and every route below it. Moving between the list
// and a product re-renders only the <Outlet />; this frame stays mounted.
export const Route = createFileRoute('/products')({
  component: ProductsLayout,
});

function ProductsLayout() {
  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>Products</h1>
      <div className={styles.frame}>
        <p className={styles.label}>src/routes/products/route.tsx</p>
        <Outlet />
      </div>
    </main>
  );
}
