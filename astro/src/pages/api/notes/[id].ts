import type { APIRoute } from 'astro';
import { deleteNote, getNote } from '../../../data/notes';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const note = getNote(params.id);
  return note
    ? Response.json(note)
    : Response.json({ error: 'Not found' }, { status: 404 });
};

export const DELETE: APIRoute = ({ params }) =>
  deleteNote(params.id)
    ? new Response(null, { status: 204 })
    : Response.json({ error: 'Not found' }, { status: 404 });
