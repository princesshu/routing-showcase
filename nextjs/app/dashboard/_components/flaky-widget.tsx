'use client';

import { useState } from 'react';
import styles from './widget.module.css';

// Error boundaries only catch errors thrown while rendering, not in event
// handlers. So the button only flips state, and the next render throws.
export default function FlakyWidget() {
  const [broken, setBroken] = useState(false);

  if (broken) throw new Error('Simulated render error in the status widget.');

  return (
    <section className={styles.widget}>
      <h2>Status widget</h2>
      <p>All systems normal.</p>
      <button type="button" onClick={() => setBroken(true)}>
        Simulate a render error
      </button>
    </section>
  );
}
