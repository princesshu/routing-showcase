'use client';

import { catchError, type ErrorInfo } from 'next/error';
import styles from './widget.module.css';

// A component-level error boundary. error.tsx replaces a whole route segment;
// catchError only replaces what it wraps. Props given to the wrapper (title)
// are forwarded to this fallback as its first argument.
function WidgetError(
  { title }: { title: string },
  { error, retry }: ErrorInfo
) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    <section role="alert" className={`${styles.widget} ${styles.failed}`}>
      <h2>{title} failed</h2>
      <p>{message}</p>
      <button type="button" onClick={() => retry()}>
        Try again
      </button>
    </section>
  );
}

export default catchError(WidgetError);
