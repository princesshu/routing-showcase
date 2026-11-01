// Module-level store for the /api/notes endpoints. It lives as long as the
// server process, so it resets on restart; good enough for a demo.

type Note = { id: string; text: string };

const notes = new Map<string, Note>([
  ['1', { id: '1', text: 'Endpoints export one function per HTTP method.' }],
]);
let nextId = 2;

export const listNotes = () => [...notes.values()];

export const getNote = (id: string | undefined) =>
  id === undefined ? undefined : notes.get(id);

export function addNote(text: string): Note {
  const note = { id: String(nextId++), text };
  notes.set(note.id, note);
  return note;
}

export const deleteNote = (id: string | undefined) =>
  id !== undefined && notes.delete(id);
