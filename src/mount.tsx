import { render } from "preact";
import { Panel } from "@/components/panel";
import { createPageLayout } from "@/page-layout";
import styles from "@/styles.css?inline";
import { createTrace } from "@/trace/trace";

function isDocument(root: Element | Document): root is Document {
  return root.nodeType === Node.DOCUMENT_NODE;
}

function parentFor(root: Element | Document): Element {
  if (isDocument(root)) {
    return root.body;
  }
  return root;
}

function pageFor(root: Element | Document): HTMLElement {
  if (isDocument(root)) {
    return root.documentElement;
  }

  const HTMLElement = root.ownerDocument.defaultView?.HTMLElement;
  if (HTMLElement !== undefined && root instanceof HTMLElement) {
    return root as HTMLElement;
  }
  return root.ownerDocument.documentElement;
}

function documentFor(root: Element | Document): Document {
  if (isDocument(root)) {
    return root;
  }
  return root.ownerDocument;
}

function applyStyles(shadow: ShadowRoot): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  shadow.adoptedStyleSheets = [sheet];
  return sheet;
}

// @property rules (the defaults for Tailwind's --tw-* variables) are likewise
// ignored inside a shadow root: they only register from document-level
// stylesheets. They define no styles, so the host page is unaffected.
// Returns a function that releases them again.
function adoptPropertyRules(
  sheet: CSSStyleSheet,
  document: Document,
): () => void {
  const properties = new CSSStyleSheet();
  for (const rule of sheet.cssRules) {
    if (rule instanceof CSSPropertyRule) {
      properties.insertRule(rule.cssText);
    }
  }
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, properties];
  return () => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (adopted) => adopted !== properties,
    );
  };
}

export type EveDevtools = {
  // Pass as the agent's event callback: useEveAgent({ onEvent }).
  onEvent: (event: unknown) => void;
  unmount: () => void;
};

export function mount(root: Element | Document = document): EveDevtools {
  const trace = createTrace();
  const pageLayout = createPageLayout(pageFor(root));
  const ownerDocument = documentFor(root);
  const host = ownerDocument.createElement("div");
  parentFor(root).appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const sheet = applyStyles(shadow);
  const releaseProperties = adoptPropertyRules(sheet, ownerDocument);
  render(<Panel trace={trace} onResize={pageLayout.resize} />, shadow);

  return {
    onEvent: trace.push,
    unmount() {
      render(null, shadow);
      host.remove();
      releaseProperties();
      pageLayout.restore();
    },
  };
}
