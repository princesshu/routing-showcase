import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: PageProps<'/photo/[id]'>): Promise<Metadata> {
  const { id } = await params;
  return { title: `Photo ${id}` };
}

export default async function Photo({ params }: PageProps<'/photo/[id]'>) {
  const { id } = await params;
  return (
    <main>
      <h1>Photo {id}</h1>
      <p>
        Full page: <code>app/photo/[id]/page.tsx</code>. A direct load or a
        reload is a hard navigation, so the intercepting route is skipped.
      </p>
    </main>
  );
}
