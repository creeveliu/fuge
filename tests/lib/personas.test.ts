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
      "qwen-tts-vc-bailian-voice-20260413125802994-9041"
    );
  });

  it("huchenfeng has voice configuration", () => {
    expect(personas.huchenfeng.voice).toBeDefined();
    expect(personas.huchenfeng.voice?.voiceId).toBe(
      "qwen-tts-vc-bailian-voice-20260413125648166-49e0"
    );
  });

  it("other personas do not have voice configuration", () => {
    const personaIdsWithoutVoice = [
      "zhangxuefeng", "guodegang", "tongjincheng",
      "buffett", "changshuanuo", "musk", "feynman", "marx",
      "karpathy", "mises", "mrbeast", "munger", "naval",
      "graham", "jobs", "taleb", "trump", "zhangyiming", "zizek"
    ];
    for (const id of personaIdsWithoutVoice) {
      expect(personas[id].voice).toBeUndefined();
    }
  });
});