import { describe, expect, it } from "vitest";
import { selectRetrievalContext } from "@/lib/retrieval";

describe("selectRetrievalContext", () => {
  it("returns matching excerpts for phone and city prompts", async () => {
    const result = await selectRetrievalContext("huchenfeng", "我想换手机也想换城市");
    expect(result).toContain("手机");
  });
});
