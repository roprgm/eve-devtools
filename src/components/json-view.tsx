import { stringifyJson } from "@/trace/format";

export function JsonView({ value }: { value: unknown }) {
  return (
    <pre class="scroll overflow-x-auto rounded-md border border-line-1 bg-background p-2 font-mono text-xs leading-5 text-foreground/70">
      {stringifyJson(value)}
    </pre>
  );
}
