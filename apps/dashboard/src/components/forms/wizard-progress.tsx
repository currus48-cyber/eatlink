import { Check } from "lucide-react";

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
    <ol className="flex items-center">
      {steps.map((entry, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={entry.key}
            className={cn("flex items-center", index < steps.length - 1 && "flex-1")}
          >
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                  isDone && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-accent",
                  !isDone && !isCurrent && "bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:inline",
                  isCurrent ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {entry.label}
              </span>
            </span>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  "mx-2 h-px flex-1 transition-colors",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
