import { describe, expect, it } from "vitest";
import { assertModelEnv, extractDeltaFromLine } from "@/lib/model";

describe("assertModelEnv", () => {
  it("throws when the model api key is missing", () => {
    expect(() => assertModelEnv("")).toThrow("MODEL_API_KEY");
  });
});

describe("extractDeltaFromLine", () => {
  it("reads text deltas from sse lines", () => {
    const line = 'data: {"choices":[{"delta":{"content":"你好"}}]}';
    expect(extractDeltaFromLine(line)).toBe("你好");
  });
});
