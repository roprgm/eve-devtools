import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createPageLayout } from "@/page-layout";

const pageAttribute = "data-eve-devtools-page";
const widthProperty = "--eve-devtools-panel-width";
const originalStyleSheet = globalThis.CSSStyleSheet;

class TestStyleSheet {
  replaceSync() {}
}

class TestStyle {
  private values = new Map<string, string>();
  private priorities = new Map<string, string>();

  getPropertyPriority(name: string): string {
    return this.priorities.get(name) ?? "";
  }

  getPropertyValue(name: string): string {
    return this.values.get(name) ?? "";
  }

  removeProperty(name: string) {
    this.values.delete(name);
    this.priorities.delete(name);
  }

  setProperty(name: string, value: string, priority = "") {
    this.values.set(name, value);
    this.priorities.set(name, priority);
  }
}

function createPage() {
  const attributes = new Map<string, string>();
  const style = new TestStyle();
  const ownerDocument = { adoptedStyleSheets: [] as CSSStyleSheet[] };
  const page = {
    ownerDocument,
    style,
    getAttribute(name: string) {
      return attributes.get(name) ?? null;
    },
    hasAttribute(name: string) {
      return attributes.has(name);
    },
    removeAttribute(name: string) {
      attributes.delete(name);
    },
    setAttribute(name: string, value: string) {
      attributes.set(name, value);
    },
  } as unknown as HTMLElement;
  return { attributes, ownerDocument, page, style };
}

beforeAll(() => {
  Object.defineProperty(globalThis, "CSSStyleSheet", {
    configurable: true,
    value: TestStyleSheet,
  });
});

afterAll(() => {
  if (originalStyleSheet === undefined) {
    Reflect.deleteProperty(globalThis, "CSSStyleSheet");
    return;
  }
  Object.defineProperty(globalThis, "CSSStyleSheet", {
    configurable: true,
    value: originalStyleSheet,
  });
});

describe("createPageLayout", () => {
  test("resizes and restores an untouched page", () => {
    const { attributes, ownerDocument, page, style } = createPage();
    const layout = createPageLayout(page);

    expect(ownerDocument.adoptedStyleSheets).toHaveLength(1);
    layout.resize(380);
    expect(attributes.get(pageAttribute)).toBe("");
    expect(style.getPropertyValue(widthProperty)).toBe("380px");

    layout.restore();
    expect(attributes.has(pageAttribute)).toBe(false);
    expect(style.getPropertyValue(widthProperty)).toBe("");
    expect(ownerDocument.adoptedStyleSheets).toHaveLength(0);
  });

  test("preserves existing host values", () => {
    const { attributes, page, style } = createPage();
    attributes.set(pageAttribute, "host-value");
    style.setProperty(widthProperty, "24px", "important");
    const layout = createPageLayout(page);

    layout.resize(420);
    layout.resize(null);

    expect(attributes.get(pageAttribute)).toBe("host-value");
    expect(style.getPropertyValue(widthProperty)).toBe("24px");
    expect(style.getPropertyPriority(widthProperty)).toBe("important");
    layout.restore();
  });
});
