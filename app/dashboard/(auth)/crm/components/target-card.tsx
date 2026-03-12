import { AlertCircle } from "lucide-react";
import { dashboardKpis } from "@/app/dashboard/(auth)/crm/data";
import { KpiCard } from "./kpi-card";

export function TargetCard() {
  return <KpiCard icon={AlertCircle} metric={dashboardKpis.actions_en_attente} />;
}
