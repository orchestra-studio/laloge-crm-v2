import { Suspense } from "react";
import type { KpiData } from "@/components/ui/kpi-card";
import { generateMeta } from "@/lib/utils";
import {
  getDashboardStats,
  getRecentActivity,
  getRecentAgentActions,
  getSalonsByStatus,
  getAverageSalonScore
} from "@/lib/supabase/queries/dashboard";
import { KpiCard } from "@/components/ui/kpi-card";
import { SalesPipeline } from "@/app/dashboard/(auth)/crm/components";
import { MorningBrief } from "@/app/dashboard/(auth)/crm/components/morning-brief";
import { RecentTasks } from "@/app/dashboard/(auth)/crm/components/recent-tasks";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return generateMeta({
    title: "Tableau de bord — La Loge CRM",
    description: "Vue opératrice La Loge : salons, actions agents, pipeline.",
    canonical: "/"
  });
}

export default async function DashboardPage() {
  const [stats, avgScore] = await Promise.all([
    getDashboardStats(),
    getAverageSalonScore()
  ]);

  const kpis: KpiData[] = [
    {
      label: "Actions en attente",
      value: String(stats.pendingActions),
      trend_value: stats.pendingActions > 0 ? String(stats.pendingActions) : "0",
      trend_direction: stats.pendingActions > 0 ? ("up" as const) : ("down" as const),
      trend_tone: stats.pendingActions > 0 ? ("negative" as const) : ("positive" as const),
      trend_context: stats.pendingActions > 0 ? "validations IA à traiter" : "aucune validation en attente",
      badge_label: stats.pendingActions > 0 ? "Urgent" : undefined,
      accent: "danger" as const
    },
    {
      label: "Salons total",
      value: stats.totalSalons.toLocaleString("fr-FR"),
      trend_value:
        stats.totalSalons > 0
          ? `${((stats.contactedSalons / stats.totalSalons) * 100).toFixed(1)} %`
          : "0,0 %",
      trend_direction: stats.contactedSalons > 0 ? ("up" as const) : ("down" as const),
      trend_tone: stats.contactedSalons > 0 ? ("positive" as const) : ("neutral" as const),
      trend_context: "déjà contactés",
      accent: "default" as const
    },
    {
      label: "Salons enrichis",
      value: stats.enrichedSalons.toLocaleString("fr-FR"),
      trend_value:
        stats.totalSalons > 0
          ? `${((stats.enrichedSalons / stats.totalSalons) * 100).toFixed(1)} %`
          : "0,0 %",
      trend_direction: stats.enrichedSalons > 0 ? ("up" as const) : ("down" as const),
      trend_tone: stats.enrichedSalons > 0 ? ("positive" as const) : ("neutral" as const),
      trend_context: "base enrichie",
      accent: "default" as const
    },
    {
      label: "Score moyen",
      value: `${Math.round(avgScore)}/100`,
      trend_value: String(stats.highScoreSalons),
      trend_direction: stats.highScoreSalons > 0 ? ("up" as const) : ("down" as const),
      trend_tone: stats.highScoreSalons > 0 ? ("positive" as const) : ("neutral" as const),
      trend_context: "salons scorés 40+",
      accent: "gold" as const
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Tableau de bord</h2>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Sections secondaires */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <MorningBrief />
        </div>
        <div className="xl:col-span-1">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
            <RecentTasks />
          </Suspense>
        </div>
        <div className="xl:col-span-1">
          <SalesPipeline />
        </div>
      </div>
    </div>
  );
}
