import { NextResponse, NextRequest } from 'next/server';

// RouteContext<'/api/posts/[id]'> types the second handler argument.
export async function GET(
  _req: NextRequest,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params;
  return NextResponse.json({ id, title: `Post ${id}` });
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params;
  return NextResponse.json({ deleted: id });
}
