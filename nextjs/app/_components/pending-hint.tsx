'use client';

import { useLinkStatus } from 'next/link';
import styles from './pending-hint.module.css';

// Must render inside a <Link>: useLinkStatus reads the state of that link.
// It is always rendered at a fixed size and only fades in, so showing it
// causes no layout shift.
export default function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={pending ? `${styles.hint} ${styles.pending}` : styles.hint}
    />
  );
}
