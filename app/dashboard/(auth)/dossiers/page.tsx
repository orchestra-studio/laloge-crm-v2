import { generateMeta } from "@/lib/utils";

import { DossiersPageClient } from "./components/dossiers-page-client";

export async function generateMetadata() {
  return generateMeta({
    title: "Dossiers — La Loge",
    description: "Dossiers clients générés pour les salons et les marques partenaires.",
    canonical: "/dossiers"
  });
}

export default function DossiersPage() {
  return <DossiersPageClient />;
}
