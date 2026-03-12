import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardPipeline, formatInteger, pipelineTotals } from "@/app/dashboard/(auth)/crm/data";

export function SalesPipeline() {
  return (
    <Card className="h-full shadow-xs">
      <CardHeader>
        <CardTitle>Vue pipeline</CardTitle>
        <CardDescription>Lecture rapide des volumes et de la progression commerciale.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-muted-foreground text-xs">En cours</p>
            <p className="mt-1 text-2xl font-semibold">{formatInteger(pipelineTotals.total)}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-muted-foreground text-xs">Taux RDV</p>
            <p className="mt-1 text-2xl font-semibold">{pipelineTotals.rdv_rate}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-muted-foreground text-xs">Win rate</p>
            <p className="mt-1 flex items-center gap-1 text-2xl font-semibold">
              {pipelineTotals.win_rate}
              <ArrowUpRight className="size-4 text-emerald-600" />
            </p>
          </div>
        </div>

        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {dashboardPipeline.map((stage) => (
            <div
              key={stage.status}
              className={stage.bar_class_name}
              style={{ width: `${(stage.count / pipelineTotals.total) * 100}%` }}
            />
          ))}
        </div>

        <div className="space-y-4">
          {dashboardPipeline.map((stage) => {
            const percentage = (stage.count / pipelineTotals.total) * 100;

            return (
              <div key={stage.status} className="flex items-center gap-3">
                <div className={`size-2.5 rounded-full ${stage.bar_class_name}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{stage.label}</span>
                    <span className="text-muted-foreground">{formatInteger(stage.count)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Progress value={percentage} indicatorColor={stage.bar_class_name} className="h-1.5" />
                    <span className="text-muted-foreground w-12 text-right text-xs">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
