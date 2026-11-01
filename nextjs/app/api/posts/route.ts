import { NextResponse } from 'next/server';
import { posts } from '@/lib/data';

// Collection endpoint next to app/api/posts/[id]/route.ts (single item).
export function GET() {
  return NextResponse.json(posts);
}

// Echoes the new post back with 201. Nothing is persisted: the dataset is an
// in-memory constant. For forms in your own UI, prefer a Server Action.
export async function POST(request: Request) {
  const post = await request.json();
  return NextResponse.json(post, { status: 201 });
}
