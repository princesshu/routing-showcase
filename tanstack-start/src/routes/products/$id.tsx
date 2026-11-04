import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getProduct } from '../../lib/data';
import { Price } from './-components/price';

// A server function: its handler only runs on the server. During SSR the
// loader calls it directly; after hydration the same call becomes an HTTP
// request to the server.
const fetchProduct = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(({ data: id }) => getProduct(id) ?? null);

export const Route = createFileRoute('/products/$id')({
  loader: async ({ params }) => {
    const product = await fetchProduct({ data: params.id });
    // Renders notFoundComponent below, inside the products layout.
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.name ?? 'Not found'} · TanStack Start Routing Showcase`,
      },
    ],
  }),
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();

  return (
    <>
      <h2>{product.name}</h2>
      <p>
        <Price value={product.price} />
      </p>
      <p>
        <Link to="/products">All products</Link>
      </p>
    </>
  );
}

// Loader data is not available here, so the id comes from the params.
function ProductNotFound() {
  const { id } = Route.useParams();

  return (
    <>
      <h2>No product with id {id}</h2>
      <p>
        <Link to="/products">All products</Link>
      </p>
    </>
  );
}
