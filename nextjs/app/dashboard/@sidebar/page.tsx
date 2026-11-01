import Link from 'next/link';
import styles from './sidebar.module.css';

export default function Sidebar() {
  return (
    <aside>
      <p className={styles.label}>Sidebar (parallel slot)</p>
      <nav className={styles.nav}>
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
    </aside>
  );
}
