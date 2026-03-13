import { generateMeta } from "@/lib/utils";
import { getDossiers } from "@/lib/supabase/queries/dossiers";

import { DossiersPageClient } from "./components/dossiers-page-client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return generateMeta({
    title: "Dossiers — La Loge",
    description: "Dossiers clients générés pour les salons et les marques partenaires.",
    canonical: "/dossiers"
  });
}

export default async function DossiersPage() {
  const { dossiers } = await getDossiers({ limit: 200 });

  return <DossiersPageClient initialDossiers={dossiers} />;
}
