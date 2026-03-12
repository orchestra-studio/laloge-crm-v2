import { notFound } from "next/navigation";

import { generateMeta } from "@/lib/utils";

import { OutreachDetailClient } from "../components/outreach-detail-client";
import { getOutreachItemById } from "../data/mock-outreach";

type OutreachDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OutreachDetailPageProps) {
  const { id } = await params;
  const item = getOutreachItemById(id);

  return generateMeta({
    title: item ? `${item.data.name} — Outreach` : "Détail outreach — La Loge",
    description:
      item?.kind === "sequence"
        ? "Détail d'une séquence de prospection La Loge."
        : "Détail d'une campagne outreach La Loge.",
    canonical: `/outreach/${id}`
  });
}

export default async function OutreachDetailPage({ params }: OutreachDetailPageProps) {
  const { id } = await params;

  if (!getOutreachItemById(id)) {
    notFound();
  }

  return <OutreachDetailClient id={id} />;
}
