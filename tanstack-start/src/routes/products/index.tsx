import { Link, createFileRoute } from '@tanstack/react-router';
import { products } from '../../lib/data';
import { Price } from './-components/price';

type Sort = 'name' | 'price';

const isSort = (value: unknown): value is Sort =>
  value === 'name' || value === 'price';

export const Route = createFileRoute('/products/')({
  // Search params are typed route state. Invalid values are dropped here, and
  // every <Link> to this route is type-checked against this shape.
  validateSearch: (search: Record<string, unknown>): { sort?: Sort } => ({
    sort: isSort(search.sort) ? search.sort : undefined,
  }),
  // The loader's cache key: each sort order is loaded and cached separately.
  loaderDeps: ({ search }) => ({ sort: search.sort ?? 'name' }),
  // Runs on the server for the first request and in the browser on client
  // navigation, so it reads the in-memory data directly.
  loader: ({ deps }) =>
    [...products].sort((a, b) =>
      deps.sort === 'price' ? a.price - b.price : a.name.localeCompare(b.name)
    ),
  head: () => ({
    meta: [{ title: 'Products · TanStack Start Routing Showcase' }],
  }),
  component: ProductList,
});

function ProductList() {
  const list = Route.useLoaderData();
  const { sort = 'name' } = Route.useSearch();

  return (
    <>
      <p>
        Sort by{' '}
        <Link to="/products" search={{ sort: 'name' }}>
          name
        </Link>
        {' · '}
        <Link to="/products" search={{ sort: 'price' }}>
          price
        </Link>{' '}
        (now <code>{sort}</code>)
      </p>
      <ul>
        {list.map((product) => (
          <li key={product.id}>
            <Link to="/products/$id" params={{ id: product.id }}>
              {product.name}
            </Link>{' '}
            <Price value={product.price} />
          </li>
        ))}
      </ul>
    </>
  );
}
