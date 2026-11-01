import type { Metadata } from 'next';
import { getProduct, getReview } from '@/lib/data';

// The title only needs the product name, so it skips the slow getReview().
export async function generateMetadata({
  params,
}: PageProps<'/products/[id]/reviews/[reviewId]'>): Promise<Metadata> {
  const { id, reviewId } = await params;
  const product = getProduct(id);
  return {
    title: product
      ? `Review ${reviewId} of ${product.name}`
      : `Review ${reviewId}`,
  };
}

export default async function Review({
  params,
}: PageProps<'/products/[id]/reviews/[reviewId]'>) {
  const { id, reviewId } = await params;
  const review = await getReview(id, reviewId);

  return (
    <main>
      <h1>
        Product {review.productId} · Review {review.reviewId}
      </h1>
      <p>{review.text}</p>
    </main>
  );
}
