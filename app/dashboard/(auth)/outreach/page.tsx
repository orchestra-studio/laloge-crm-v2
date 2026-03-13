import { generateMeta } from "@/lib/utils";
import { getOutreachData } from "@/lib/supabase/queries/outreach";

import { OutreachWorkspace } from "./components/outreach-workspace";

export async function generateMetadata() {
  return generateMeta({
    title: "Outreach — La Loge",
    description: "Séquences de prospection et campagnes outreach.",
    canonical: "/outreach"
  });
}

export default async function OutreachPage() {
  const data = await getOutreachData();
  return <OutreachWorkspace initialData={data} />;
}
