import Link from "next/link";
import type { NoteListItem } from "@/app/lib/post";

export function NotesTimeline({ notes }: { notes: NoteListItem[] }) {
  if (notes.length === 0) {
    return <p className="mt-6 text-sm text-zinc-500">No notes yet.</p>;
  }

  return (
    <ol className="mt-8 space-y-0 border-l border-zinc-200 pl-6 dark:border-zinc-700">
      {notes.map((note) => (
        <li key={note.slug} className="relative pb-8 last:pb-0">
          <span
            className="absolute -left-[25px] top-2 h-2 w-2 rounded-full bg-zinc-400 ring-4 ring-white dark:bg-zinc-500 dark:ring-zinc-950"
            aria-hidden
          />
          <time
            dateTime={note.createdAt}
            className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400"
          >
            {note.createdAt}
          </time>
          <Link
            href={`/notes/${note.slug}`}
            className="mt-1 block text-base font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            {note.title ?? note.slug}
          </Link>
        </li>
      ))}
    </ol>
  );
}
