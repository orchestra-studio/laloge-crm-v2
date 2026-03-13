import { notFound } from "next/navigation";

import { generateMeta } from "@/lib/utils";
import { getDossierById } from "@/lib/supabase/queries/dossiers";

import { DossierDetailClient } from "../components/dossier-detail-client";

export const dynamic = "force-dynamic";

type DossierDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: DossierDetailPageProps) {
  const { id } = await params;
  const dossier = await getDossierById(id);

  return generateMeta({
    title: dossier ? `${dossier.salon_name} — ${dossier.brand_name}` : "Dossier client — La Loge",
    description:
      dossier
        ? `Dossier client ${dossier.salon_name} × ${dossier.brand_name} avec score de compatibilité et recommandations.`
        : "Détail d'un dossier client La Loge.",
    canonical: `/dossiers/${id}`
  });
}

export default async function DossierDetailPage({ params }: DossierDetailPageProps) {
  const { id } = await params;
  const dossier = await getDossierById(id);

  if (!dossier) {
    notFound();
  }

  return <DossierDetailClient dossier={dossier} />;
}
