import { generateMeta } from "@/lib/utils";

import { OutreachWorkspace } from "./components/outreach-workspace";

export async function generateMetadata() {
  return generateMeta({
    title: "Outreach — La Loge",
    description: "Séquences de prospection et campagnes outreach.",
    canonical: "/outreach"
  });
}

export default function OutreachPage() {
  return <OutreachWorkspace />;
}
