import { describe, expect, it } from "vitest";
import { loadSkill } from "@/lib/skills";
import { personas } from "@/lib/personas";

describe("skills", () => {
  it("returns skill content for each persona", async () => {
    for (const personaId of Object.keys(personas)) {
      const skill = await loadSkill(personaId as keyof typeof personas);
      expect(skill.length).toBeGreaterThan(100);
    }
  });
});