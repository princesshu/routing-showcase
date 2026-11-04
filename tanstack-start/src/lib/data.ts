// The same in-memory products as the Next.js app, so the two apps can be
// compared route by route without a database.

export type Product = { id: string; name: string; price: number };

export const products: Product[] = [
  { id: '1', name: 'Quantum Keyboard', price: 129 },
  { id: '2', name: 'Nebula Mouse', price: 59 },
  { id: '3', name: 'Photon Monitor', price: 499 },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

// The photos on /feed; any other id is a 404.
export const photoIds = ['1', '2', '3'];
