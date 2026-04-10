import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { personas, type PersonaId } from "@/lib/personas";

const SKILL_CACHE_DIR = path.join(process.cwd(), "data", "skills");
const SKILL_TTL_MS = 1000 * 60 * 60 * 12;

export function getSkillCachePath(personaId: PersonaId) {
  return path.join(SKILL_CACHE_DIR, `${personaId}.md`);
}

export async function loadSkill(personaId: PersonaId) {
  const persona = personas[personaId];
  const cachePath = getSkillCachePath(personaId);

  await mkdir(SKILL_CACHE_DIR, { recursive: true });

  try {
    const info = await stat(cachePath);
    if (Date.now() - info.mtimeMs < SKILL_TTL_MS) {
      return await readFile(cachePath, "utf8");
    }
  } catch {
    // Cache miss falls through to network fetch.
  }

  try {
    const response = await fetch(persona.rawSkillUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${persona.rawSkillUrl}`);
    }
    const text = await response.text();
    await writeFile(cachePath, text, "utf8");
    return text;
  } catch {
    return await readFile(cachePath, "utf8");
  }
}
