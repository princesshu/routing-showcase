import type { Route } from 'next';
import Link from 'next/link';
import PendingHint from './_components/pending-hint';
import styles from './page.module.css';

// With typedRoutes, every href below is checked against the real route tree.
// Static literals check directly as Route; dynamic ones ('/products/1') only
// check when the literal type is inferred — route() does that, then widens.
const route = <T extends string>(href: Route<T>): Route => href as Route;

type Item = { href: Route; label: string; note?: string };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: 'Static & dynamic',
    items: [
      { href: '/about', label: '/about', note: 'static' },
      { href: '/products', label: '/products', note: 'static list' },
      {
        href: route('/products/1'),
        label: '/products/[id]',
        note: 'SSG via generateStaticParams',
      },
      {
        href: route('/products/1/reviews/1'),
        label: '/products/[id]/reviews/[reviewId]',
        note: 'nested dynamic + loading.tsx',
      },
      {
        href: route('/products/1/specs'),
        label: '/products/[id]/specs',
        note: 'no loading.tsx: useLinkStatus spinner',
      },
      {
        href: route('/blog/hello-world'),
        label: '/blog/[slug]',
        note: 'SSG',
      },
    ],
  },
  {
    title: 'Catch-all',
    items: [
      {
        href: route('/help/a/b/c'),
        label: '/help/[...slug]',
        note: 'required',
      },
      // The generated route types (checked on Next.js 16.2 and 16.4) only cover
      // /docs/<slug> for an optional catch-all, not the bare /docs URL.
      { href: '/docs' as Route, label: '/docs/[[...slug]]', note: 'optional' },
    ],
  },
  {
    title: 'Route groups',
    items: [
      { href: '/home', label: '(marketing)/home' },
      { href: '/contact', label: '(marketing)/contact', note: 'server action' },
      { href: '/login', label: '(auth)/login' },
      { href: '/register', label: '(auth)/register' },
    ],
  },
  {
    title: 'Layouts & parallel routes',
    items: [
      {
        href: '/dashboard',
        label: '/dashboard',
        note: '@sidebar slot, catchError widget',
      },
      { href: '/dashboard/settings', label: '/dashboard/settings' },
    ],
  },
  {
    title: 'Intercepting routes',
    items: [
      { href: '/feed', label: '/feed', note: 'open photo in a modal' },
      { href: route('/photo/1'), label: '/photo/[id]', note: 'full page' },
    ],
  },
  {
    title: 'Auth interrupts',
    items: [
      { href: '/account?as=admin', label: '/account?as=admin', note: 'ok' },
      { href: '/account?as=user', label: '/account?as=user', note: '403' },
      { href: '/account', label: '/account', note: '401' },
    ],
  },
  {
    title: 'API & metadata files',
    items: [
      { href: '/api/hello', label: '/api/hello' },
      { href: '/api/posts', label: '/api/posts' },
      { href: route('/api/posts/1'), label: '/api/posts/[id]' },
      // Metadata routes aren't part of the typed route list, so cast them.
      { href: '/sitemap.xml' as Route, label: '/sitemap.xml' },
      { href: '/robots.txt' as Route, label: '/robots.txt' },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <h1>Next.js Routing Showcase</h1>
      <p className={styles.lead}>
        Every major Next.js App Router pattern — click through to see each one.
      </p>

      {groups.map((group) => (
        <section key={group.title}>
          <h2 className={styles.groupTitle}>{group.title}</h2>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item.href} className={styles.item}>
                <Link href={item.href} className={styles.route}>
                  {item.label}
                  <PendingHint />
                </Link>
                {item.note && <span className={styles.note}>{item.note}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
