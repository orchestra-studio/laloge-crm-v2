import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RoutePlaceholder({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>TODO</CardTitle>
          <CardDescription>
            This route has been scaffolded for the La Loge CRM implementation.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Hook this page to Supabase data and the final CRM UI in the next implementation pass.
        </CardContent>
      </Card>
    </div>
  );
}
