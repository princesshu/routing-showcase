import type { Metadata } from 'next';
import Modal from '@/app/feed/_components/modal';

export async function generateMetadata({
  params,
}: PageProps<'/photo/[id]'>): Promise<Metadata> {
  const { id } = await params;
  return { title: `Photo ${id}` };
}

// An intercepting route renders the URL it intercepts, so it is typed with
// that route ('/photo/[id]'), not with its folder path.
export default async function PhotoModal({ params }: PageProps<'/photo/[id]'>) {
  const { id } = await params;
  return (
    <Modal title={`Photo ${id}`}>
      <p>
        Intercepted: <code>app/feed/@modal/(..)photo/[id]/page.tsx</code>{' '}
        rendered in the <code>@modal</code> slot, with the feed still behind it.
        Reload the page to get the full page instead.
      </p>
    </Modal>
  );
}
