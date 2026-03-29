import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";

function isENOENT(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}

const notesDir = path.join(process.cwd(), "content/notes");

export type NoteListItem = {
  slug: string;
  title?: string;
};

export type NoteDetail = NoteListItem & {
  content: string;
};

export function getAllNotes(): NoteListItem[] {
  const files = fs
    .readdirSync(notesDir)
    .filter((file) => file.endsWith(".md"));

  return files.map((file) => {
    const filePath = path.join(notesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const { data } = matter(content);

    return {
      ...data,
      slug: file.replace(".md", ""),
    } as NoteListItem;
  });
}

export async function getNote(slug: string): Promise<NoteDetail> {
  const filePath = path.join(notesDir, `${slug}.md`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    if (isENOENT(error)) notFound();
    throw error;
  }

  const { data, content: md } = matter(content);

  const processed = await remark().use(html).process(md);
  const htmlContent = processed.toString();

  return {
    ...data,
    slug,
    content: htmlContent,
  } as NoteDetail;
}
