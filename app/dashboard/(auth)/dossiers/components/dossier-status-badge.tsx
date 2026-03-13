import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { DossierStatus } from "@/lib/supabase/queries/dossiers";

const dossierStatusMeta: Record<
  DossierStatus,
  {
    label: string;
    className: string;
  }
> = {
  brouillon: {
    label: "Brouillon",
    className: "border-border bg-muted/40 text-muted-foreground"
  },
  en_preparation: {
    label: "En préparation",
    className: "border-amber-300 bg-amber-50 text-amber-800"
  },
  finalise: {
    label: "Finalisé",
    className: "border-[#C5A572]/25 bg-[#FBF7F1] text-[#8C6B2D]"
  },
  envoye: {
    label: "Envoyé",
    className: "border-slate-300 bg-slate-100 text-slate-800"
  }
};

export function getDossierStatusLabel(status: DossierStatus) {
  return dossierStatusMeta[status].label;
}

export function DossierStatusBadge({ status, className }: { status: DossierStatus; className?: string }) {
  const meta = dossierStatusMeta[status];

  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}
