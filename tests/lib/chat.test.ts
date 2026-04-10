import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "@/lib/chat";
import { consumeTypewriterFrame } from "@/lib/typewriter";

describe("buildSystemPrompt", () => {
  it("keeps the skill text as the main prompt body", () => {
    const result = buildSystemPrompt({ skillText: "SKILL BODY" });
    expect(result).toContain("SKILL BODY");
    expect(result).toContain("不要提到 skill");
  });
});

describe("consumeTypewriterFrame", () => {
  it("returns one visible chunk at a time", () => {
    expect(consumeTypewriterFrame("你好")).toEqual({
      chunk: "你",
      rest: "好",
    });
  });
});
