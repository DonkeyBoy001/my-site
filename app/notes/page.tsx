import Link from "next/link";
import { getAllNotes } from "@/app/lib/post";

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Notes</h1>

      <ul className="mt-4">
        {notes.map((note) => (
          <li key={note.slug} className="mb-2">
            <Link href={`/notes/${note.slug}`}>
              {note.title ?? note.slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
