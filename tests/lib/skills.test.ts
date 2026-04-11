import { describe, expect, it } from "vitest";
import { loadSkill } from "@/lib/skills";

describe("skills", () => {
  it("returns skill content for each persona", async () => {
    const fenggeSkill = await loadSkill("fengge");
    expect(fenggeSkill).toContain("峰哥亡命天涯视角");

    const huchenfengSkill = await loadSkill("huchenfeng");
    expect(huchenfengSkill).toContain("户晨风视角");

    const zhangxuefengSkill = await loadSkill("zhangxuefeng");
    expect(zhangxuefengSkill).toContain("张雪峰");

    const guodegangSkill = await loadSkill("guodegang");
    expect(guodegangSkill).toContain("郭德纲");
  });
});
