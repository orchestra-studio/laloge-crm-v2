import {
  BadgeCheckIcon,
  Clock3Icon,
  FileTextIcon,
  SendIcon,
  type LucideIcon
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type MinimalDossier = { status: string };

function StatCard({
  title,
  value,
  description,
  icon: Icon
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="border-[#C5A572]/12 bg-white/95 shadow-sm">
      <CardContent className="flex items-start justify-between px-6 py-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-2xl border border-[#C5A572]/15 bg-[#FBF7F1] p-3 text-[#8C6B2D]">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DossierStatsGrid({ dossiers }: { dossiers: MinimalDossier[] }) {
  const total = dossiers.length;
  const inPreparation = dossiers.filter((dossier) => dossier.status === "en_preparation").length;
  const finalized = dossiers.filter((dossier) => dossier.status === "finalise").length;
  const sent = dossiers.filter((dossier) => dossier.status === "envoye").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total dossiers"
        value={total.toString()}
        description="Bibliothèque active dossiers salons × marques"
        icon={FileTextIcon}
      />
      <StatCard
        title="En préparation"
        value={inPreparation.toString()}
        description="Dossiers en cours d'enrichissement avant PDF"
        icon={Clock3Icon}
      />
      <StatCard
        title="Finalisés"
        value={finalized.toString()}
        description="Prêts pour validation ou partage"
        icon={BadgeCheckIcon}
      />
      <StatCard
        title="Envoyés"
        value={sent.toString()}
        description="Déjà transmis aux équipes marques"
        icon={SendIcon}
      />
    </div>
  );
}
