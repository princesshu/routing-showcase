import { Link, createFileRoute, notFound } from '@tanstack/react-router';

// Locales that appear in the URL. English is the default and has no prefix,
// so /greeting is English and /en/greeting is a 404, as in the Astro app.
const greetings = { de: 'Hallo' };
type Locale = keyof typeof greetings;

const isLocale = (value: string): value is Locale =>
  Object.hasOwn(greetings, value);

// "{-$locale}" is an optional segment: /greeting leaves it undefined, and
// /de/greeting sets it to "de". A locale the app doesn't have is a 404.
export const Route = createFileRoute('/{-$locale}/greeting')({
  beforeLoad: ({ params }) => {
    if (params.locale !== undefined && !isLocale(params.locale)) {
      throw notFound();
    }
  },
  component: Greeting,
});

function Greeting() {
  const { locale } = Route.useParams();

  return (
    <main>
      <p>
        <Link to="/">Home</Link>
      </p>
      <h1>
        {locale !== undefined && isLocale(locale) ? greetings[locale] : 'Hello'}
      </h1>
      <p>
        <code>params.locale</code> is{' '}
        <code>
          {locale === undefined ? 'undefined' : JSON.stringify(locale)}
        </code>
      </p>
      <p>
        <Link to="/{-$locale}/greeting" params={{ locale: undefined }}>
          /greeting
        </Link>
        {' · '}
        <Link to="/{-$locale}/greeting" params={{ locale: 'de' }}>
          /de/greeting
        </Link>
      </p>
    </main>
  );
}
