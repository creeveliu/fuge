import { describe, expect, it } from "vitest";
import { getSkillCachePath } from "@/lib/skills";

describe("skills", () => {
  it("maps persona ids to local markdown cache files", () => {
    expect(getSkillCachePath("fengge")).toContain("data/skills/fengge.md");
  });
});
