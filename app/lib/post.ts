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

function formatYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Frontmatter `date` or file mtime, for sorting and timeline labels */
function resolveCreatedAt(
  filePath: string,
  data: Record<string, unknown>,
): { sort: number; label: string } {
  const raw = data.date;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return { sort: raw.getTime(), label: formatYMD(raw) };
  }
  if (typeof raw === "string") {
    const t = Date.parse(raw);
    if (!Number.isNaN(t)) {
      return { sort: t, label: formatYMD(new Date(t)) };
    }
  }
  const mtime = fs.statSync(filePath).mtimeMs;
  return { sort: mtime, label: formatYMD(new Date(mtime)) };
}

export type NoteListItem = {
  slug: string;
  title?: string;
  /** YYYY-MM-DD for timeline (from frontmatter `date` or file mtime) */
  createdAt: string;
};

export type NoteDetail = NoteListItem & {
  content: string;
};

export function getAllNotes(): NoteListItem[] {
  const files = fs
    .readdirSync(notesDir)
    .filter((file) => file.endsWith(".md"));

  const rows = files.map((file) => {
    const filePath = path.join(notesDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const { data } = matter(content);
    const dataObj = data as Record<string, unknown>;
    const { sort, label } = resolveCreatedAt(filePath, dataObj);

    return {
      item: {
        ...dataObj,
        slug: file.replace(".md", ""),
        createdAt: label,
      } as NoteListItem,
      sort,
    };
  });

  rows.sort((a, b) => b.sort - a.sort);

  return rows.map((r) => r.item);
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
  const dataObj = data as Record<string, unknown>;
  const { label: createdAt } = resolveCreatedAt(filePath, dataObj);

  const processed = await remark().use(html).process(md);
  const htmlContent = processed.toString();

  return {
    ...data,
    slug,
    createdAt,
    content: htmlContent,
  } as NoteDetail;
}
