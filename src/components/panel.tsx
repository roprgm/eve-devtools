import { LucideProvider, PanelRightClose } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { Logo } from "@/components/logo";
import { Resizable } from "@/components/resizable";
import { ScrollArea } from "@/components/scroll-area";
import { Turn } from "@/components/turn";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTurns } from "@/hooks/use-turns";
import {
  canDock,
  defaultPanelWidth,
  maximumPanelWidth,
  minimumPanelWidth,
  panelWidth,
} from "@/panel-size";
import type { Trace } from "@/trace/trace";
import type { Turn as TurnData } from "@/trace/types";

function useViewportWidth(): number {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width;
}

function Header() {
  return (
    <header class="flex h-11 shrink-0 items-center gap-2 border-b border-line-1 bg-background px-3 sm:h-8">
      <Logo class="h-2.5" />
      <span class="text-xs font-medium uppercase tracking-wide text-foreground/70">
        eve-devtools
      </span>
    </header>
  );
}

function CollapseButton({ onCollapse }: { onCollapse: () => void }) {
  return (
    <button
      type="button"
      aria-label="Collapse eve devtools"
      class="launcher absolute z-10 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line-2 bg-background text-foreground shadow-launcher sm:size-8.5 [corner-shape:squircle]"
      onClick={onCollapse}
    >
      <PanelRightClose />
    </button>
  );
}

function Body({ turns }: { turns: TurnData[] }) {
  return (
    <ScrollArea>
      {turns.length === 0 && (
        <p class="px-3 py-6 text-center text-xs text-foreground/40">
          No agent activity yet.
        </p>
      )}
      {turns.map((turn, index) => (
        <Turn key={turn.id} turn={turn} index={index + 1} />
      ))}
    </ScrollArea>
  );
}

export function Panel({
  trace,
  onResize,
}: {
  trace: Trace;
  onResize: (width: number | null) => void;
}) {
  const turns = useTurns(trace);
  const [isOpen, setIsOpen] = useLocalStorage("open", false);
  const [storedWidth, setStoredWidth] = useLocalStorage(
    "width",
    defaultPanelWidth,
  );
  const viewportWidth = useViewportWidth();
  const isDocked = canDock(viewportWidth);
  const width = panelWidth(storedWidth, viewportWidth);

  useEffect(() => {
    if (isOpen && isDocked) {
      onResize(width);
      return;
    }
    onResize(null);
  }, [isDocked, isOpen, onResize, width]);

  if (!isOpen) {
    return (
      <LucideProvider size={14} strokeWidth={2} class="shrink-0">
        <button
          type="button"
          aria-label="Open eve devtools"
          class="launcher fixed z-2147483647 flex size-11 cursor-pointer items-center justify-center rounded-xl border border-line-2 bg-background text-foreground shadow-launcher sm:size-8.5 [corner-shape:squircle]"
          onClick={() => setIsOpen(true)}
        >
          <Logo class="h-2.5" />
        </button>
      </LucideProvider>
    );
  }

  return (
    <LucideProvider size={14} strokeWidth={2} class="shrink-0">
      <aside
        aria-label="Eve devtools"
        class="panel-enter fixed inset-y-0 right-0 z-2147483647 overflow-hidden bg-surface-1 text-foreground"
      >
        <Resizable
          width={width}
          minWidth={minimumPanelWidth}
          maxWidth={maximumPanelWidth(viewportWidth)}
          canResize={isDocked}
          onResize={setStoredWidth}
        >
          <div class="safe-area flex h-full min-h-0 flex-col overflow-hidden">
            <Header />
            <div class="flex min-h-0 flex-1">
              <Body turns={turns} />
            </div>
          </div>
          <CollapseButton onCollapse={() => setIsOpen(false)} />
        </Resizable>
      </aside>
    </LucideProvider>
  );
}
