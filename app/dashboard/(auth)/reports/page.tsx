import { generateMeta } from "@/lib/utils";

import { ReportsDashboard } from "./components/reports-dashboard";

export async function generateMetadata() {
  return generateMeta({
    title: "Rapports La Loge",
    description: "Six rapports analytics et management pour piloter La Loge CRM.",
    canonical: "/reports"
  });
}

export default function ReportsPage() {
  return <ReportsDashboard />;
}
