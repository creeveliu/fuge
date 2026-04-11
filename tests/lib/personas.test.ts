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
});