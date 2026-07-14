import {
  ArrowDownToLine,
  ArrowUpToLine,
  LucideProvider,
  PanelRightClose,
  Wrench,
} from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { Logo } from "@/components/logo";
import { Metric } from "@/components/metric";
import { Resizable } from "@/components/resizable";
import { ScrollArea } from "@/components/scroll-area";
import { Turn } from "@/components/turn";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useTurns } from "@/hooks/use-turns";
import { formatTokens } from "@/trace/format";
import { summarizeTurns } from "@/trace/summary";
import type { Trace } from "@/trace/trace";
import type { Turn as TurnData } from "@/trace/types";

const defaultWidth = 380;
const minPanelWidth = 280;
const minPageWidth = 320;
const minDockedWidth = minPanelWidth + minPageWidth;

function canDock(viewportWidth: number): boolean {
  return viewportWidth >= minDockedWidth;
}

function maximumPanelWidth(viewportWidth: number): number {
  return Math.max(minPanelWidth, viewportWidth - minPageWidth);
}

function panelWidth(storedWidth: number, viewportWidth: number): number {
  if (!canDock(viewportWidth)) {
    return viewportWidth;
  }
  const maximumWidth = maximumPanelWidth(viewportWidth);
  return Math.min(maximumWidth, Math.max(minPanelWidth, storedWidth));
}

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

function Header({ turns }: { turns: TurnData[] }) {
  const summary = summarizeTurns(turns);
  return (
    <header class="flex h-11 shrink-0 items-center gap-2 border-b border-line-1 bg-background px-3 sm:h-8">
      <Logo class="h-2.5" />
      <span class="text-xs font-medium uppercase tracking-wide text-foreground/70">
        eve-devtools
      </span>
      <div class="ml-auto flex items-center gap-3">
        <Metric icon={<Wrench />}>{summary.tools}</Metric>
        <Metric icon={<ArrowDownToLine />}>
          {formatTokens(summary.inputTokens)}
        </Metric>
        <Metric icon={<ArrowUpToLine />}>
          {formatTokens(summary.outputTokens)}
        </Metric>
      </div>
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
  const [storedWidth, setStoredWidth] = useLocalStorage("width", defaultWidth);
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
        class="fixed inset-y-0 right-0 z-2147483647 bg-surface-1 text-foreground"
      >
        <Resizable
          width={width}
          minWidth={minPanelWidth}
          maxWidth={maximumPanelWidth(viewportWidth)}
          canResize={isDocked}
          onResize={setStoredWidth}
        >
          <div class="safe-area flex h-full flex-col">
            <Header turns={turns} />
            <div class="min-h-0 flex-1">
              <Body turns={turns} />
            </div>
          </div>
          <CollapseButton onCollapse={() => setIsOpen(false)} />
        </Resizable>
      </aside>
    </LucideProvider>
  );
}
