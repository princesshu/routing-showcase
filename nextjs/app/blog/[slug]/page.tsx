import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, posts } from '@/lib/data';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? post.title : 'Post not found' };
}

export default async function Blog({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
}
