import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
