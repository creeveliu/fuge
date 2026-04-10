import { personas, type PersonaId } from "@/lib/personas";

export async function loadSkill(personaId: PersonaId) {
  const persona = personas[personaId];

  const response = await fetch(persona.rawSkillUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch skill for ${personaId}`);
  }
  return await response.text();
}