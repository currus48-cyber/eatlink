import { cn } from "@/lib/utils";

export interface WizardStepConfig {
  key: string;
  label: string;
}

export function WizardProgress({
  steps,
  currentKey,
}: {
  steps: WizardStepConfig[];
  currentKey: string;
}) {
  const currentIndex = steps.findIndex((entry) => entry.key === currentKey);

  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      {steps.map((entry, index) => (
        <li key={entry.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full border text-[10px] font-medium",
              index <= currentIndex
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground",
            )}
          >
            {index + 1}
          </span>
          <span className={index === currentIndex ? "font-medium text-foreground" : undefined}>
            {entry.label}
          </span>
          {index < steps.length - 1 && <span className="mx-1 h-px w-4 bg-border" />}
        </li>
      ))}
    </ol>
  );
}
