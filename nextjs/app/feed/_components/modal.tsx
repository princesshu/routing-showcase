'use client';

import { useEffect, useId, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './modal.module.css';

// Wraps the intercepted route in a native <dialog>. showModal() gives focus
// handling, Esc support and an inert page behind it. Every way of closing goes
// back in history: the URL returns to /feed and the @modal slot renders its
// default.tsx (null) again.
//
// The title is an <h2> that also names the dialog (aria-labelledby): the page
// behind it keeps the only <h1>.
export default function Modal({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={styles.dialog}
      // Esc fires `cancel` (removal from the DOM does not), so navigating
      // here can't trigger a second router.back().
      onCancel={(event) => {
        event.preventDefault();
        router.back();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) router.back();
      }}
    >
      <div className={styles.content}>
        <button
          type="button"
          className={styles.close}
          onClick={() => router.back()}
        >
          Close
        </button>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
