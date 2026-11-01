import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Feed' };

// Clicking these links is a client-side navigation, so the (..)photo
// intercepting route renders the photo inside the @modal slot (overlay).
// Refreshing /photo/1 directly bypasses the interception and shows the full page.
export default function Feed() {
  return (
    <main>
      <h1>Feed</h1>
      <ul>
        {[1, 2, 3].map((id) => (
          <li key={id}>
            <Link href={`/photo/${id}`}>Open photo {id} (modal)</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
