import { describe, expect, test } from "bun:test";
import { canDock, maximumPanelWidth, panelWidth } from "@/panel-size";

describe("panel sizing", () => {
  test("uses the full viewport on mobile", () => {
    expect(canDock(599)).toBe(false);
    expect(panelWidth(380, 599)).toBe(599);
  });

  test("preserves a minimum width for the page and panel", () => {
    expect(canDock(600)).toBe(true);
    expect(panelWidth(200, 600)).toBe(280);
    expect(panelWidth(500, 600)).toBe(280);
  });

  test("clamps the stored width on larger viewports", () => {
    expect(maximumPanelWidth(1280)).toBe(960);
    expect(panelWidth(200, 1280)).toBe(280);
    expect(panelWidth(380, 1280)).toBe(380);
    expect(panelWidth(1200, 1280)).toBe(960);
  });
});
