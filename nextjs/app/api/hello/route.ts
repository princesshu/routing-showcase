import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'Hello API' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
