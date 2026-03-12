import { Badge } from "@/components/ui/badge";
import { type Brand, type ProposalStatus, type SalonStatus } from "./types";

const categoryTone: Record<string, string> = {
  Coloration: "border-[#C5A572]/20 bg-[#C5A572]/10 text-[#8C6B2D]",
  "Soins & Coloration": "border-sky-200 bg-sky-50 text-sky-700",
  "Coloration & Styling": "border-violet-200 bg-violet-50 text-violet-700",
  Distribution: "border-stone-200 bg-stone-50 text-stone-700",
  "Bien-être": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Franchise: "border-rose-200 bg-rose-50 text-rose-700"
};

const salonStatusTone: Record<SalonStatus, string> = {
  nouveau: "border-stone-200 bg-stone-50 text-stone-700",
  contacte: "border-sky-200 bg-sky-50 text-sky-700",
  interesse: "border-amber-200 bg-amber-50 text-amber-700",
  rdv_planifie: "border-violet-200 bg-violet-50 text-violet-700",
  negociation: "border-orange-200 bg-orange-50 text-orange-700",
  gagne: "border-emerald-200 bg-emerald-50 text-emerald-700",
  perdu: "border-rose-200 bg-rose-50 text-rose-700",
  client_actif: "border-[#C5A572]/20 bg-[#C5A572]/10 text-[#8C6B2D]"
};

const proposalTone: Record<ProposalStatus, string> = {
  Brouillon: "border-stone-200 bg-stone-50 text-stone-700",
  Envoyée: "border-sky-200 bg-sky-50 text-sky-700",
  Acceptée: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Refusée: "border-rose-200 bg-rose-50 text-rose-700"
};

export function BrandCategoryBadge({ category }: { category: Brand["category"] }) {
  return (
    <Badge variant="outline" className={categoryTone[category] ?? "border-border bg-muted text-muted-foreground"}>
      {category}
    </Badge>
  );
}

export function BrandActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-stone-200 bg-stone-50 text-stone-700"
      }>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

export function SalonStatusBadge({ status }: { status: SalonStatus }) {
  return (
    <Badge variant="outline" className={salonStatusTone[status]}>
      {formatSalonStatus(status)}
    </Badge>
  );
}

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <Badge variant="outline" className={proposalTone[status]}>
      {status}
    </Badge>
  );
}

export function formatSalonStatus(status: SalonStatus) {
  const map: Record<SalonStatus, string> = {
    nouveau: "Nouveau",
    contacte: "Contacté",
    interesse: "Intéressé",
    rdv_planifie: "RDV planifié",
    negociation: "Négociation",
    gagne: "Gagné",
    perdu: "Perdu",
    client_actif: "Client actif"
  };

  return map[status];
}
