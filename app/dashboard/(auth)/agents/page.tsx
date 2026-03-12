import { AgentsPage } from "./components/agents-page";
import { getAgentsPageData } from "@/lib/supabase/queries/agents";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Agents IA La Loge",
    description: "Dashboard de monitoring connecté à Supabase pour superviser les agents IA La Loge.",
    canonical: "/agents"
  });
}

export default async function Page() {
  const data = await getAgentsPageData();

  return <AgentsPage data={data} />;
}
