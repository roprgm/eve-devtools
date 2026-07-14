import styles from "@/page.css?inline";

const pageAttribute = "data-eve-devtools-page";
const widthProperty = "--eve-devtools-panel-width";

type AttributeSnapshot = {
  isPresent: boolean;
  value: string;
};

type PropertySnapshot = {
  value: string;
  priority: string;
};

function readAttribute(element: Element, name: string): AttributeSnapshot {
  return {
    isPresent: element.hasAttribute(name),
    value: element.getAttribute(name) ?? "",
  };
}

function restoreAttribute(
  element: Element,
  name: string,
  snapshot: AttributeSnapshot,
) {
  if (snapshot.isPresent) {
    element.setAttribute(name, snapshot.value);
    return;
  }
  element.removeAttribute(name);
}

function readProperty(
  style: CSSStyleDeclaration,
  name: string,
): PropertySnapshot {
  return {
    value: style.getPropertyValue(name),
    priority: style.getPropertyPriority(name),
  };
}

function restoreProperty(
  style: CSSStyleDeclaration,
  name: string,
  snapshot: PropertySnapshot,
) {
  if (snapshot.value !== "") {
    style.setProperty(name, snapshot.value, snapshot.priority);
    return;
  }
  style.removeProperty(name);
}

function adoptStyles(document: Document): () => void {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(styles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

  return () => {
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (adopted) => adopted !== sheet,
    );
  };
}

export type PageLayout = {
  resize: (width: number | null) => void;
  restore: () => void;
};

export function createPageLayout(page: HTMLElement): PageLayout {
  const attribute = readAttribute(page, pageAttribute);
  const property = readProperty(page.style, widthProperty);
  const releaseStyles = adoptStyles(page.ownerDocument);

  function resize(width: number | null) {
    if (width === null) {
      restoreAttribute(page, pageAttribute, attribute);
      restoreProperty(page.style, widthProperty, property);
      return;
    }

    page.setAttribute(pageAttribute, "");
    page.style.setProperty(widthProperty, `${width}px`);
  }

  function restore() {
    resize(null);
    releaseStyles();
  }

  return { resize, restore };
}
