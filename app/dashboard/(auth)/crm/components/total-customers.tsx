import { Building2 } from "lucide-react";
import { dashboardKpis } from "@/app/dashboard/(auth)/crm/data";
import { KpiCard } from "./kpi-card";

export function TotalCustomersCard() {
  return <KpiCard icon={Building2} metric={dashboardKpis.salons_total} />;
}
