// A tiny in-memory dataset so the dynamic routes can demonstrate
// generateStaticParams (build-time SSG) and generateMetadata without a database.

export type Product = { id: string; name: string; price: number };
export type Post = { slug: string; title: string; body: string };

export const products: Product[] = [
  { id: '1', name: 'Quantum Keyboard', price: 129 },
  { id: '2', name: 'Nebula Mouse', price: 59 },
  { id: '3', name: 'Photon Monitor', price: 499 },
];

export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    body: 'The first post on the showcase blog.',
  },
  {
    slug: 'app-router-deep-dive',
    title: 'App Router Deep Dive',
    body: 'How file-based routing maps folders to URLs.',
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated network latency, so the reviews route's loading.tsx is visible.
export async function getReview(productId: string, reviewId: string) {
  await delay(800);
  return { productId, reviewId, text: 'Solid build, would buy again.' };
}

// Same latency on the specs route, which has no loading.tsx: navigation waits
// for the server, so the link's useLinkStatus hint has a pending state to show.
export async function getSpecs(productId: string) {
  await delay(1200);
  return { productId, warranty: '2 years', shipsIn: '1–2 business days' };
}
