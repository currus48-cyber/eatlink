import { cn } from "@/lib/utils";

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  if (confidence <= 0) {
    return <span className="text-xs text-muted-foreground">Non détecté</span>;
  }

  const percent = Math.round(confidence * 100);
  const tone =
    percent >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : percent >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";

  return <span className={cn("text-xs font-medium tabular-nums", tone)}>{percent}%</span>;
}
