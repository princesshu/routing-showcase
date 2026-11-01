// A tiny in-memory dataset so the dynamic routes can demonstrate
// getStaticPaths, paginate() and on-demand rendering without a database.

type Product = { id: string; name: string; price: number };

export const products: Product[] = [
  { id: '1', name: 'Quantum Keyboard', price: 129 },
  { id: '2', name: 'Nebula Mouse', price: 59 },
  { id: '3', name: 'Photon Monitor', price: 499 },
];

// Post titles for the paginated /blog.
export const posts = [
  'Hello World',
  'File-Based Routing',
  'Islands, Briefly',
  'Prerendered or On Demand',
  'When Two Routes Match',
];

const reviews: Record<string, string> = {
  '1': 'Solid build, would buy again.',
  '2': 'Does what it says.',
};

export const getProduct = (id: string | undefined) =>
  products.find((p) => p.id === id);

export const getReview = (id: string | undefined) =>
  id === undefined ? undefined : reviews[id];
