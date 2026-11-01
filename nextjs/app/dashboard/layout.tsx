import Breadcrumb from './_components/breadcrumb';
import styles from './dashboard.module.css';

// A CSS Module colocated with the layout: only page.tsx and route.ts make a
// segment public, so non-route files can live next to them safely.
export default function DashboardLayout({
  children,
  sidebar,
}: LayoutProps<'/dashboard'>) {
  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>{sidebar}</div>
      <div className={styles.content}>
        <Breadcrumb />
        {/* A section label, not a heading: each page's <h1> is the title. */}
        <p className={styles.section}>Dashboard</p>
        {children}
      </div>
    </div>
  );
}
