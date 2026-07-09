import { render } from "preact";
import { Panel } from "@/components/panel";
import styles from "@/styles.css?inline";
import { createTrace } from "@/trace/trace";

const fontHref =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&display=swap";

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

// @font-face does not apply inside a shadow root, so Geist is loaded once at the
// document level; the panel inherits it across the shadow boundary.
function ensureFont() {
  const id = "eve-devtools-font";
  if (document.getElementById(id)) {
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = fontHref;
  document.head.appendChild(link);
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
  ensureFont();
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
