import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/help/[...slug]'>): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Help: ${slug.join('/')}` };
}

// Required catch-all: matches /help/a, /help/a/b, ... but not /help itself.
export default async function Help({ params }: PageProps<'/help/[...slug]'>) {
  const { slug } = await params;
  return (
    <main>
      <h1>Help path: {slug.join('/')}</h1>
    </main>
  );
}
