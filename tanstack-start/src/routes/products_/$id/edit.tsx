import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { getProduct } from '../../../lib/data';

// "products_" opts out of nesting: the URL starts with /products, but the
// page renders without the products layout (src/routes/products/route.tsx).
export const Route = createFileRoute('/products_/$id/edit')({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Edit ${loaderData?.name ?? 'product'} · TanStack Start Routing Showcase`,
      },
    ],
  }),
  component: EditProduct,
});

function EditProduct() {
  const product = Route.useLoaderData();

  return (
    <main>
      <p>
        <Link to="/products/$id" params={{ id: product.id }}>
          Back to {product.name}
        </Link>
      </p>
      <h1>Edit {product.name}</h1>
      <p>
        <code>src/routes/products_/$id/edit.tsx</code> maps to{' '}
        <code>/products/{product.id}/edit</code>, outside the products layout.
      </p>
    </main>
  );
}
