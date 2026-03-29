import { getNote } from "@/app/lib/post";

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{note.title ?? slug}</h1>

      <div
        className="mt-4 prose"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
}
