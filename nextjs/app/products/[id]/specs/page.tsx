import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getSpecs } from '@/lib/data';

// The title only needs the product name, so it skips the slow getSpecs().
export async function generateMetadata({
  params,
}: PageProps<'/products/[id]/specs'>): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? `${product.name} specs` : 'Product not found' };
}

// No loading.tsx here on purpose. This dynamic route renders on each request,
// so a client navigation waits for the server before the URL changes: that
// wait is what useLinkStatus reports as `pending` on the clicked link.
export default async function Specs({
  params,
}: PageProps<'/products/[id]/specs'>) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) notFound();

  const specs = await getSpecs(id);

  return (
    <main>
      <h1>{product.name} · Specs</h1>
      <dl>
        <dt>Warranty</dt>
        <dd>{specs.warranty}</dd>
        <dt>Ships in</dt>
        <dd>{specs.shipsIn}</dd>
      </dl>
    </main>
  );
}
