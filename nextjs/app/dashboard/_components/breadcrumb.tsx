'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './breadcrumb.module.css';

// A folder prefixed with "_" is a private folder: it is opted out of routing,
// so this component never becomes a URL segment. Client navigation hooks like
// usePathname require the "use client" directive.
export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <Link href="/">home</Link>
      {segments.map((segment, index) => {
        // Built at runtime from the current pathname, so typedRoutes can't
        // check it statically — non-literal hrefs need an explicit cast.
        const href = ('/' + segments.slice(0, index + 1).join('/')) as Route;
        return (
          <span key={href}>
            {' / '}
            <Link href={href}>{segment}</Link>
          </span>
        );
      })}
    </nav>
  );
}
