import { describe, expect, it } from "vitest";
import { personas } from "@/lib/personas";

describe("personas", () => {
  it("registers the three launch personas", () => {
    expect(Object.keys(personas)).toEqual(["fengge", "huchenfeng", "zhangxuefeng"]);
  });
});
