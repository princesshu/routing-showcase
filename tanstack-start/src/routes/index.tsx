import { Link, createFileRoute, linkOptions } from '@tanstack/react-router';
import styles from '../styles/home.module.css';

export const Route = createFileRoute('/')({
  component: Home,
});

// linkOptions() checks every target against the generated route tree: a
// wrong path, a missing param or an invalid search value is a type error.
// URLs outside the route tree use a plain href.
const groups = [
  {
    title: 'Static & dynamic',
    items: [
      {
        link: linkOptions({ to: '/about' }),
        label: '/about',
        note: 'static, prerendered',
      },
      {
        link: linkOptions({ to: '/products' }),
        label: '/products',
        note: 'layout route + index route',
      },
      {
        link: linkOptions({ to: '/products/$id', params: { id: '1' } }),
        label: '/products/$id',
        note: 'loader calls a server function; 1–3 prerendered',
      },
      {
        link: linkOptions({ to: '/products/$id', params: { id: '4' } }),
        label: '/products/4',
        note: 'notFound() from the loader',
      },
      {
        link: linkOptions({ to: '/products/$id/edit', params: { id: '1' } }),
        label: 'products_/$id/edit',
        note: 'outside the products layout',
      },
    ],
  },
  {
    title: 'Optional & splat',
    items: [
      {
        link: linkOptions({
          to: '/{-$locale}/greeting',
          params: { locale: undefined },
        }),
        label: '/greeting',
        note: '{-$locale} left out',
      },
      {
        link: linkOptions({
          to: '/{-$locale}/greeting',
          params: { locale: 'de' },
        }),
        label: '/de/greeting',
        note: '{-$locale} = de',
      },
      {
        link: linkOptions({
          to: '/files/$',
          params: { _splat: 'docs/guide/intro.md' },
        }),
        label: '/files/$',
        note: 'params._splat',
      },
    ],
  },
  {
    title: 'Search params',
    items: [
      {
        link: linkOptions({ to: '/products', search: { sort: 'price' } }),
        label: '/products?sort=price',
        note: 'validated, typed URL state',
      },
    ],
  },
  {
    title: 'Layouts & groups',
    items: [
      {
        link: linkOptions({ to: '/login' }),
        label: '_auth/login',
        note: 'pathless layout',
      },
      { link: linkOptions({ to: '/register' }), label: '_auth/register' },
      {
        link: linkOptions({ to: '/home' }),
        label: '(marketing)/home',
        note: 'route group',
      },
    ],
  },
  {
    title: 'Route masking',
    items: [
      {
        link: linkOptions({ to: '/feed' }),
        label: '/feed',
        note: 'open a photo in a modal',
      },
      {
        link: linkOptions({ to: '/photo/$id', params: { id: '1' } }),
        label: '/photo/$id',
        note: 'full page',
      },
    ],
  },
  {
    title: 'Errors & not found',
    items: [
      {
        link: linkOptions({ to: '/crash' }),
        label: '/crash',
        note: 'errorComponent, 500',
      },
      // Not in the route tree, so <Link to="/missing"> would not compile.
      {
        href: '/missing',
        label: '/missing',
        note: 'root notFoundComponent, 404',
      },
    ],
  },
  {
    title: 'Guards, redirects & rewrites',
    items: [
      {
        link: linkOptions({ to: '/account', search: { as: 'admin' } }),
        label: '/account?as=admin',
        note: 'beforeLoad passes',
      },
      {
        link: linkOptions({ to: '/account' }),
        label: '/account',
        note: 'beforeLoad redirects to /login',
      },
      { href: '/admin', label: '/admin', note: 'request middleware, 307 to /' },
      {
        link: linkOptions({ to: '/internal/team' }),
        label: '/team',
        note: 'rewrite of /internal/team',
      },
    ],
  },
  {
    title: 'Rendering',
    items: [
      {
        link: linkOptions({ to: '/rendering/client-only' }),
        label: '/rendering/client-only',
        note: 'ssr: false',
      },
      {
        link: linkOptions({ to: '/rendering/data-only' }),
        label: '/rendering/data-only',
        note: "ssr: 'data-only'",
      },
    ],
  },
  {
    title: 'Server routes',
    items: [
      // Full page loads: these routes have handlers but no component.
      {
        link: linkOptions({ to: '/api/hello', reloadDocument: true }),
        label: '/api/hello',
        note: 'GET and POST',
      },
      {
        link: linkOptions({ to: '/robots.txt', reloadDocument: true }),
        label: '/robots.txt',
        note: 'robots[.]txt.ts',
      },
    ],
  },
];

function Home() {
  return (
    <main>
      <h1>TanStack Start Routing Showcase</h1>
      <p className={styles.lead}>
        Every TanStack Start routing pattern in this app, one link each.
      </p>

      {groups.map((group) => (
        <section key={group.title}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item.label} className={styles.item}>
                {item.link ? (
                  <Link {...item.link} className={styles.route}>
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} className={styles.route}>
                    {item.label}
                  </a>
                )}
                {item.note && <span className={styles.note}>{item.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
