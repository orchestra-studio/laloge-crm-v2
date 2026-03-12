import { notFound } from "next/navigation";

import { generateMeta } from "@/lib/utils";

import { DossierDetailClient } from "../components/dossier-detail-client";
import { getDossierById } from "../components/mock-dossiers";

type DossierDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: DossierDetailPageProps) {
  const { id } = await params;
  const dossier = getDossierById(id);

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
  const dossier = getDossierById(id);

  if (!dossier) {
    notFound();
  }

  return <DossierDetailClient dossier={dossier} />;
}
