import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PersonaId } from "@/lib/personas";

type RetrievalRecord = {
  tags: string[];
  excerpt: string;
};

function getRetrievalPath(personaId: PersonaId) {
  return path.join(process.cwd(), "data", "retrieval", `${personaId}.json`);
}

export async function selectRetrievalContext(personaId: PersonaId, query: string) {
  if (personaId !== "huchenfeng") {
    return "";
  }

  const raw = await readFile(getRetrievalPath(personaId), "utf8");
  const records = JSON.parse(raw) as RetrievalRecord[];
  const lowered = query.toLowerCase();
  const matches = records.filter((record) =>
    record.tags.some((tag) => lowered.includes(tag.toLowerCase()))
  );

  return matches
    .slice(0, 3)
    .map((record, index) => `${index + 1}. ${record.excerpt}`)
    .join("\n");
}
