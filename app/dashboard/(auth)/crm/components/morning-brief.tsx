import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CRM_GOLD, dashboardMorningBrief } from "@/app/dashboard/(auth)/crm/data";

export function MorningBrief() {
  return (
    <Card className="overflow-hidden border-[#C5A572]/15 bg-linear-to-br from-[#C5A572]/10 via-background to-background shadow-xs">
      <CardContent className="px-6 py-6 lg:px-8 lg:py-7">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-[#C5A572]/25 bg-[#C5A572]/10 text-[#8B6C3D] hover:bg-[#C5A572]/10">
                <Sparkles className="size-3" style={{ color: CRM_GOLD }} />
                Morning brief IA
              </Badge>
              <Badge variant="outline">Vue d’ensemble du matin</Badge>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-tight lg:text-3xl">
                {dashboardMorningBrief.title}
              </h2>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6 lg:text-base">
                {dashboardMorningBrief.subtitle}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {dashboardMorningBrief.insights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-border/70 bg-background/80 p-4 shadow-xs backdrop-blur-sm">
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-5">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#C5A572]/20 bg-background/90 p-5 shadow-xs">
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
                {dashboardMorningBrief.focus_label}
              </p>
              <p className="text-lg leading-7 font-semibold">{dashboardMorningBrief.focus_value}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button
                type="button"
                className="justify-between border-0 text-white hover:opacity-95"
                style={{ backgroundColor: CRM_GOLD }}>
                Voir les approbations
                <ArrowRight className="size-4" />
              </Button>
              <Button type="button" variant="outline" className="justify-between">
                Ouvrir les salons chauds
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
