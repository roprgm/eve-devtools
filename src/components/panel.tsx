import {
  ArrowDownToLine,
  ArrowUpToLine,
  LucideProvider,
  Wrench,
} from "lucide-preact";
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

const defaultSize = { width: 380, height: 480 };
const minSize = { width: 280, height: 132 };

function turnsLabel(count: number): string {
  if (count === 1) {
    return "1 turn";
  }
  return `${count} turns`;
}

function Footer({ turns }: { turns: TurnData[] }) {
  const summary = summarizeTurns(turns);
  return (
    <footer class="flex h-8 items-center border-t border-line-1 bg-background px-3">
      <span class="text-xs text-foreground/50">{turnsLabel(turns.length)}</span>
      <div class="ml-auto flex items-center gap-3">
        <Metric icon={<Wrench />}>{summary.tools}</Metric>
        <Metric icon={<ArrowDownToLine />}>
          {formatTokens(summary.inputTokens)}
        </Metric>
        <Metric icon={<ArrowUpToLine />}>
          {formatTokens(summary.outputTokens)}
        </Metric>
      </div>
    </footer>
  );
}

function Body({ turns }: { turns: TurnData[] }) {
  return (
    <div class="flex h-full flex-col">
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
      <Footer turns={turns} />
    </div>
  );
}

export function Panel({ trace }: { trace: Trace }) {
  const turns = useTurns(trace);
  const [isOpen, setIsOpen] = useLocalStorage("open", false);
  const [size, setSize] = useLocalStorage("size", defaultSize);

  return (
    <LucideProvider size={14} strokeWidth={2} class="shrink-0">
      <details
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
        class="group fixed right-3 bottom-3 z-2147483647 size-8.5 overflow-hidden rounded-xl border border-line-2 bg-background text-foreground shadow-panel transition-all duration-300 ease-in-out [corner-shape:squircle] [interpolate-size:allow-keywords] open:size-auto open:rounded-2xl open:bg-surface-1 open:shadow-panel-open"
      >
        <summary class="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <header class="flex items-center justify-between whitespace-nowrap bg-background px-4 h-8 font-semibold opacity-0 transition-opacity duration-150 ease-in-out group-open:opacity-100 group-open:delay-100">
            <span class="pl-3">eve-devtools</span>
            <span class="text-foreground/80">×</span>
          </header>
          <Logo class="absolute top-4 left-4 h-2.5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out" />
        </summary>
        <Resizable size={size} minSize={minSize} onResize={setSize}>
          <Body turns={turns} />
        </Resizable>
      </details>
    </LucideProvider>
  );
}
