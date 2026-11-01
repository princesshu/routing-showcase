import styles from './analytics.module.css';

// Root-level parallel slot: matches only "/". After a client navigation away
// from "/", the slot keeps this page as its active state; after a reload of any
// other URL it renders default.tsx (null) instead.
export default function Analytics() {
  return (
    <aside aria-label="Analytics slot" className={styles.panel}>
      <code>@analytics</code> slot — rendered next to <code>children</code> by
      the root layout. Navigate away and it stays; reload elsewhere and it is
      gone.
    </aside>
  );
}
