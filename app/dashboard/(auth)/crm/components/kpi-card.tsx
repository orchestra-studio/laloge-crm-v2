import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "@/components/ui/card";
import { CRM_GOLD, type DashboardKpi } from "@/app/dashboard/(auth)/crm/data";

type KpiCardProps = {
  icon: LucideIcon;
  metric: DashboardKpi;
};

export function KpiCard({ icon: Icon, metric }: KpiCardProps) {
  const TrendIcon = metric.trend_direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="gap-3 border-border/80 shadow-xs">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardDescription>{metric.label}</CardDescription>
            {metric.badge_label ? (
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
                {metric.badge_label}
              </Badge>
            ) : null}
          </div>
          <CardAction>
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-full border",
                metric.accent === "danger" && "border-red-200 bg-red-50 text-red-700",
                metric.accent === "gold" && "border-[#C5A572]/20 bg-[#C5A572]/10 text-[#8B6C3D]",
                metric.accent === "default" && "bg-muted text-foreground"
              )}
              style={metric.accent === "gold" ? { color: CRM_GOLD } : undefined}>
              <Icon className="size-5" />
            </div>
          </CardAction>
        </div>
        <div className="space-y-2">
          <h4 className="font-display text-3xl tracking-tight">{metric.value}</h4>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                metric.trend_tone === "positive" && "text-emerald-700",
                metric.trend_tone === "negative" && "text-red-700",
                metric.trend_tone === "neutral" && "text-foreground"
              )}>
              <TrendIcon className="size-4" />
              {metric.trend_value}
            </span>
            <span>{metric.trend_context}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
