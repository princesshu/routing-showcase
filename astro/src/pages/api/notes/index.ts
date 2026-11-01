import type { APIRoute } from 'astro';
import { addNote, listNotes } from '../../../data/notes';

export const prerender = false;

export const GET: APIRoute = () => Response.json(listNotes());

export const POST: APIRoute = async ({ request }) => {
  const body: unknown = await request.json().catch(() => null);
  if (
    typeof body !== 'object' ||
    body === null ||
    !('text' in body) ||
    typeof body.text !== 'string'
  ) {
    return Response.json(
      { error: 'Expected { "text": string }' },
      { status: 400 }
    );
  }
  const note = addNote(body.text);
  return Response.json(note, {
    status: 201,
    headers: { Location: `/api/notes/${note.id}` },
  });
};
