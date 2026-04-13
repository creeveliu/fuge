import { describe, expect, it } from "vitest";
import { personas } from "@/lib/personas";

describe("personas", () => {
  it("registers all personas", () => {
    const expectedIds = [
      "fengge",
      "huchenfeng",
      "zhangxuefeng",
      "guodegang",
      "tongjincheng",
      "buffett",
      "changshuanuo",
      "musk",
      "feynman",
      "marx",
      "karpathy",
      "mises",
      "mrbeast",
      "munger",
      "naval",
      "graham",
      "jobs",
      "taleb",
      "trump",
      "zhangyiming",
      "zizek"
    ];
    expect(Object.keys(personas)).toEqual(expectedIds);
  });

  it("fengge has voice configuration", () => {
    expect(personas.fengge.voice).toBeDefined();
    expect(personas.fengge.voice?.voiceId).toBe(
      "cosyvoice-v3.5-plus-bailian-812a621be1304cea9ef7460f772b393b"
    );
  });

  it("other personas do not have voice configuration", () => {
    const personaIdsWithoutVoice = [
      "huchenfeng", "zhangxuefeng", "guodegang", "tongjincheng",
      "buffett", "changshuanuo", "musk", "feynman", "marx",
      "karpathy", "mises", "mrbeast", "munger", "naval",
      "graham", "jobs", "taleb", "trump", "zhangyiming", "zizek"
    ];
    for (const id of personaIdsWithoutVoice) {
      expect(personas[id].voice).toBeUndefined();
    }
  });
});