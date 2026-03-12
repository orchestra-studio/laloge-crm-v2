import { BarChart3 } from "lucide-react";
import { dashboardKpis } from "@/app/dashboard/(auth)/crm/data";
import { KpiCard } from "./kpi-card";

export function TotalRevenueCard() {
  return <KpiCard icon={BarChart3} metric={dashboardKpis.score_moyen} />;
}
