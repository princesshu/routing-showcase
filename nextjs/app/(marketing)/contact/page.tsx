import type { Metadata } from 'next';
import { submitContact } from './actions';
import styles from './contact.module.css';

export const metadata: Metadata = { title: 'Contact' };

// Route groups don't appear in the URL, so the route key is '/contact'.
export default async function Contact({ searchParams }: PageProps<'/contact'>) {
  const { sent } = await searchParams;

  return (
    <main>
      <h1>Contact</h1>
      {sent ? (
        <p role="status">Thanks — we&apos;ll be in touch.</p>
      ) : (
        <form action={submitContact} className={styles.form}>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            aria-label="Email"
          />
          <button type="submit">Send</button>
        </form>
      )}
    </main>
  );
}
