import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";

export type KpiData = {
  label: string;
  value: string;
  trend_value: string;
  trend_direction: "up" | "down";
  trend_tone: "positive" | "negative" | "neutral";
  trend_context: string;
  badge_label?: string;
  accent: "default" | "gold" | "danger";
};

type Props = { kpi: KpiData };

export function KpiCard({ kpi }: Props) {
  const TrendIcon = kpi.trend_direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-3 border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardDescription>{kpi.label}</CardDescription>
            {kpi.badge_label ? (
              <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
                {kpi.badge_label}
              </Badge>
            ) : null}
          </div>
          <CardAction>
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-full border",
                kpi.accent === "danger" && "border-red-200 bg-red-50 text-red-700",
                kpi.accent === "gold" && "border-[#C5A572]/20 bg-[#C5A572]/10",
                kpi.accent === "default" && "bg-muted text-foreground"
              )}
              style={kpi.accent === "gold" ? { color: "#C5A572" } : undefined}
            >
              <span className="text-sm font-bold">
                {kpi.accent === "danger" ? "⚡" : kpi.accent === "gold" ? "★" : "◎"}
              </span>
            </div>
          </CardAction>
        </div>
        <div className="space-y-2">
          <h4 className="font-display text-3xl tracking-tight">{kpi.value}</h4>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                kpi.trend_tone === "positive" && "text-emerald-700",
                kpi.trend_tone === "negative" && "text-red-700",
                kpi.trend_tone === "neutral" && "text-foreground"
              )}>
              <TrendIcon className="size-4" />
              {kpi.trend_value}
            </span>
            <span>{kpi.trend_context}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
