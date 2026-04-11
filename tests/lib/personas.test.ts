import { describe, expect, it } from "vitest";
import { personas } from "@/lib/personas";

describe("personas", () => {
  it("registers all launch personas", () => {
    expect(Object.keys(personas)).toEqual(["fengge", "huchenfeng", "zhangxuefeng", "guodegang"]);
  });
});
