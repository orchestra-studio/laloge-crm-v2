import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const GOLD_ACCENT = "#C5A572";

export const salonStatusOrder = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "client_actif",
  "perdu"
] as const;

export const salonStatusConfig = {
  nouveau: {
    label: "Nouveau",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700",
    softClassName: "bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-400"
  },
  contacte: {
    label: "Contacté",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
    softClassName: "bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500"
  },
  interesse: {
    label: "Intéressé",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    softClassName: "bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500"
  },
  rdv_planifie: {
    label: "RDV planifié",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
    softClassName: "bg-violet-50 text-violet-700",
    dotClassName: "bg-violet-500"
  },
  negociation: {
    label: "Négociation",
    badgeClassName: "border-orange-200 bg-orange-50 text-orange-700",
    softClassName: "bg-orange-50 text-orange-700",
    dotClassName: "bg-orange-500"
  },
  gagne: {
    label: "Gagné",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    softClassName: "bg-emerald-50 text-emerald-700",
    dotClassName: "bg-emerald-500"
  },
  perdu: {
    label: "Perdu",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
    softClassName: "bg-rose-50 text-rose-700",
    dotClassName: "bg-rose-500"
  },
  client_actif: {
    label: "Client actif",
    badgeClassName:
      "border-[#C5A572]/30 bg-[#C5A572]/12 text-[#7D643C] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
    softClassName: "bg-[#C5A572]/12 text-[#7D643C]",
    dotClassName: "bg-[#C5A572]"
  }
} as const;

export const enrichmentConfig = {
  pending: {
    label: "En attente",
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700"
  },
  enriched: {
    label: "Enrichi",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  failed: {
    label: "Échec",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700"
  }
} as const;

export function getStatusLabel(status: keyof typeof salonStatusConfig) {
  return salonStatusConfig[status].label;
}

export function getEnrichmentLabel(status: keyof typeof enrichmentConfig) {
  return enrichmentConfig[status].label;
}

export function getScoreIndicatorClass(score: number) {
  if (score < 30) return "bg-rose-500";
  if (score < 60) return "bg-amber-500";
  return "bg-emerald-500";
}

export function getScoreTextClass(score: number) {
  if (score < 30) return "text-rose-700";
  if (score < 60) return "text-amber-700";
  return "text-emerald-700";
}

export function formatRelativeDate(value: string) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: fr
  });
}

export function formatShortDate(value: string) {
  return format(new Date(value), "d MMM yyyy", { locale: fr });
}

export function formatDateTime(value: string) {
  return format(new Date(value), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

export function createMailto(email: string) {
  return `mailto:${email}`;
}

export function createTel(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
