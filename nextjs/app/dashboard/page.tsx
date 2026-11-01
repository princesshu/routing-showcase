import type { Metadata } from 'next';
import FlakyWidget from './_components/flaky-widget';
import WidgetBoundary from './_components/widget-boundary';

export const metadata: Metadata = { title: 'Dashboard' };

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard Home</h1>
      <p>
        Break the widget below: only the widget is replaced, because{' '}
        <code>catchError</code> wraps a single component. The sidebar, the
        breadcrumb and this text keep working. <code>app/error.tsx</code> would
        have replaced everything below the root layout instead.
      </p>
      <WidgetBoundary title="Status widget">
        <FlakyWidget />
      </WidgetBoundary>
    </>
  );
}
