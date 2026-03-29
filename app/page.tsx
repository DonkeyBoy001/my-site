import { getAllNotes } from "@/app/lib/post";
import { NotesTimeline } from "@/app/components/notes-timeline";

export default function Home() {
  const notes = getAllNotes();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Notes</h1>
      <NotesTimeline notes={notes} />
    </div>
  );
}
