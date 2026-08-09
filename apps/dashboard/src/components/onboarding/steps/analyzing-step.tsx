import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalyzingStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse en cours...</CardTitle>
        <CardDescription>
          Nous récupérons les informations publiques de votre site. Cela prend quelques
          secondes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-10">
          <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
