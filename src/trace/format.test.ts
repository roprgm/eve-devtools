import { describe, expect, test } from "bun:test";
import { formatDuration, formatTokens } from "@/trace/format";

describe("formatDuration", () => {
  test("keeps milliseconds compact", () => {
    expect(formatDuration(-1)).toBe("0ms");
    expect(formatDuration(1)).toBe("1ms");
    expect(formatDuration(12)).toBe("12ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  test("uses three significant digits for larger units", () => {
    expect(formatDuration(1000)).toBe("1.00s");
    expect(formatDuration(12_345)).toBe("12.3s");
    expect(formatDuration(60_000)).toBe("1.00m");
    expect(formatDuration(3_600_000)).toBe("1.00h");
  });

  test("promotes values that round across unit boundaries", () => {
    expect(formatDuration(59_950)).toBe("1.00m");
    expect(formatDuration(3_597_000)).toBe("1.00h");
  });
});

describe("formatTokens", () => {
  test("uses compact rounded units", () => {
    expect(formatTokens(999)).toBe("999");
    expect(formatTokens(1000)).toBe("1k");
    expect(formatTokens(7100)).toBe("7k");
    expect(formatTokens(999_499)).toBe("999k");
    expect(formatTokens(999_500)).toBe("1m");
  });
});
