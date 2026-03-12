import { CheckCircle2 } from "lucide-react";
import { dashboardKpis } from "@/app/dashboard/(auth)/crm/data";
import { KpiCard } from "./kpi-card";

export function TotalDeals() {
  return <KpiCard icon={CheckCircle2} metric={dashboardKpis.salons_enrichis} />;
}
