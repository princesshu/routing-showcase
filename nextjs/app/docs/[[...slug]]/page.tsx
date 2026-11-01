import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug ? `Docs: ${slug.join('/')}` : 'Docs' };
}

// Optional catch-all: params.slug is typed as string[] | undefined.
export default async function DocsOptional({
  params,
}: PageProps<'/docs/[[...slug]]'>) {
  const { slug } = await params;
  return (
    <main>
      <h1>Optional Docs Path: {slug?.join('/') || 'index'}</h1>
    </main>
  );
}
