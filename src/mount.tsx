import { render } from "preact";
import { Panel } from "@/components/panel";
import styles from "@/styles.css?inline";
import { createTrace } from "@/trace/trace";

function parentFor(root: Element | Document): Element {
  if (root instanceof Document) {
    return root.body;
  }
  return root;
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
function adoptPropertyRules(sheet: CSSStyleSheet): () => void {
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
  const host = document.createElement("div");
  parentFor(root).appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const sheet = applyStyles(shadow);
  const releaseProperties = adoptPropertyRules(sheet);
  render(<Panel trace={trace} />, shadow);

  return {
    onEvent: trace.push,
    unmount() {
      render(null, shadow);
      host.remove();
      releaseProperties();
    },
  };
}
