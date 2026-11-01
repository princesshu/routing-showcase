import type { Metadata } from 'next';

// absolute: the root title template is applied for unmatched URLs but not
// when a page calls notFound(), so the full title is spelled out here.
export const metadata: Metadata = {
  title: { absolute: 'Page not found · Routing Showcase' },
};

export default function NotFound() {
  return (
    <main>
      <h1>404 – Not found</h1>
    </main>
  );
}
