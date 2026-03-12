import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { mockActivityLog } from "./mock-activity-log";
import { mockAgentActions } from "./mock-agent-actions";
import { mockProfiles } from "./mock-profiles";
import { mockSalons } from "./mock-salons";
import type {
  ActivityAction,
  AgentActionType,
  AgentName,
  EnrichmentStatus,
  ProfileRow,
  SalonStatus
} from "./types";

export const CRM_GOLD = "#C5A572";

export const currentUser = mockProfiles.at(0)!;

export const profilesById = Object.fromEntries(
  mockProfiles.map((profile) => [profile.id, profile])
) as Record<string, ProfileRow>;

export const salonStatusMeta: Record<
  SalonStatus,
  {
    label: string;
    badge_class_name: string;
    chart_color: string;
    dot_class_name: string;
    bar_class_name: string;
  }
> = {
  nouveau: {
    label: "Nouveau",
    badge_class_name: "border-slate-200 bg-slate-50 text-slate-700",
    chart_color: "#CBD5E1",
    dot_class_name: "bg-slate-400",
    bar_class_name: "bg-slate-300"
  },
  contacte: {
    label: "Contacté",
    badge_class_name: "border-sky-200 bg-sky-50 text-sky-700",
    chart_color: "#7DD3FC",
    dot_class_name: "bg-sky-500",
    bar_class_name: "bg-sky-400"
  },
  interesse: {
    label: "Intéressé",
    badge_class_name: "border-amber-200 bg-amber-50 text-amber-700",
    chart_color: "#FBBF24",
    dot_class_name: "bg-amber-500",
    bar_class_name: "bg-amber-400"
  },
  rdv_planifie: {
    label: "RDV planifié",
    badge_class_name: "border-violet-200 bg-violet-50 text-violet-700",
    chart_color: "#A78BFA",
    dot_class_name: "bg-violet-500",
    bar_class_name: "bg-violet-400"
  },
  negociation: {
    label: "Négociation",
    badge_class_name: "border-orange-200 bg-orange-50 text-orange-700",
    chart_color: "#FB923C",
    dot_class_name: "bg-orange-500",
    bar_class_name: "bg-orange-400"
  },
  gagne: {
    label: "Gagné",
    badge_class_name: "border-emerald-200 bg-emerald-50 text-emerald-700",
    chart_color: "#34D399",
    dot_class_name: "bg-emerald-500",
    bar_class_name: "bg-emerald-400"
  },
  perdu: {
    label: "Perdu",
    badge_class_name: "border-rose-200 bg-rose-50 text-rose-700",
    chart_color: "#FB7185",
    dot_class_name: "bg-rose-500",
    bar_class_name: "bg-rose-400"
  },
  client_actif: {
    label: "Client actif",
    badge_class_name: "border-[#C5A572]/30 bg-[#C5A572]/10 text-[#8B6C3D]",
    chart_color: CRM_GOLD,
    dot_class_name: "bg-[#C5A572]",
    bar_class_name: "bg-[#C5A572]"
  }
};

export const enrichmentStatusMeta: Record<
  EnrichmentStatus,
  { label: string; badge_class_name: string }
> = {
  pending: {
    label: "En attente",
    badge_class_name: "border-slate-200 bg-slate-50 text-slate-700"
  },
  enriched: {
    label: "Enrichi",
    badge_class_name: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  failed: {
    label: "Échec",
    badge_class_name: "border-rose-200 bg-rose-50 text-rose-700"
  },
  complete: {
    label: "Complet",
    badge_class_name: "border-emerald-200 bg-emerald-50 text-emerald-700"
  }
};

export const activityActionMeta = {
  enriched: {
    label: "a enrichi",
    icon_tone_class_name: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  scored: {
    label: "a recalculé le score de",
    icon_tone_class_name: "bg-amber-50 text-amber-700 border-amber-100"
  },
  status_changed: {
    label: "a changé le statut de",
    icon_tone_class_name: "bg-violet-50 text-violet-700 border-violet-100"
  },
  outreach_sent: {
    label: "a lancé l’outreach pour",
    icon_tone_class_name: "bg-sky-50 text-sky-700 border-sky-100"
  },
  note_added: {
    label: "a ajouté une note à",
    icon_tone_class_name: "bg-slate-50 text-slate-700 border-slate-100"
  },
  contact_added: {
    label: "a ajouté un contact à",
    icon_tone_class_name: "bg-orange-50 text-orange-700 border-orange-100"
  }
};

export const agentActionTypeMeta = {
  update_status: {
    label: "Changer le statut"
  },
  launch_outreach: {
    label: "Lancer l’outreach"
  },
  create_contact: {
    label: "Créer un contact"
  },
  assign_brand: {
    label: "Assigner une marque"
  },
  schedule_followup: {
    label: "Planifier une relance"
  },
  generate_dossier: {
    label: "Générer un dossier"
  }
};

export type DashboardKpi = {
  label: string;
  value: string;
  trend_value: string;
  trend_direction: "up" | "down";
  trend_tone: "positive" | "negative" | "neutral";
  trend_context: string;
  badge_label?: string;
  accent: "default" | "gold" | "danger";
};

export const dashboardKpis: Record<
  "salons_total" | "salons_enrichis" | "score_moyen" | "actions_en_attente",
  DashboardKpi
> = {
  salons_total: {
    label: "Salons total",
    value: "1 707",
    trend_value: "+6,4 %",
    trend_direction: "up",
    trend_tone: "positive",
    trend_context: "vs mois dernier",
    accent: "default"
  },
  salons_enrichis: {
    label: "Salons enrichis",
    value: "513",
    trend_value: "+12,1 %",
    trend_direction: "up",
    trend_tone: "positive",
    trend_context: "vs 30 derniers jours",
    accent: "default"
  },
  score_moyen: {
    label: "Score moyen",
    value: "62/100",
    trend_value: "+4 pts",
    trend_direction: "up",
    trend_tone: "positive",
    trend_context: "vs semaine dernière",
    accent: "gold"
  },
  actions_en_attente: {
    label: "Actions en attente",
    value: String(
      mockAgentActions.filter((action) => action.status === "pending").length
    ),
    trend_value: "-16 %",
    trend_direction: "down",
    trend_tone: "positive",
    trend_context: "vs hier",
    badge_label: "Urgent",
    accent: "danger"
  }
};

export const dashboardPipeline = [
  {
    status: "nouveau",
    label: salonStatusMeta.nouveau.label,
    count: 438,
    color: salonStatusMeta.nouveau.chart_color,
    bar_class_name: salonStatusMeta.nouveau.bar_class_name
  },
  {
    status: "contacte",
    label: salonStatusMeta.contacte.label,
    count: 362,
    color: salonStatusMeta.contacte.chart_color,
    bar_class_name: salonStatusMeta.contacte.bar_class_name
  },
  {
    status: "interesse",
    label: salonStatusMeta.interesse.label,
    count: 217,
    color: salonStatusMeta.interesse.chart_color,
    bar_class_name: salonStatusMeta.interesse.bar_class_name
  },
  {
    status: "rdv_planifie",
    label: salonStatusMeta.rdv_planifie.label,
    count: 94,
    color: salonStatusMeta.rdv_planifie.chart_color,
    bar_class_name: salonStatusMeta.rdv_planifie.bar_class_name
  },
  {
    status: "negociation",
    label: salonStatusMeta.negociation.label,
    count: 39,
    color: salonStatusMeta.negociation.chart_color,
    bar_class_name: salonStatusMeta.negociation.bar_class_name
  },
  {
    status: "gagne",
    label: salonStatusMeta.gagne.label,
    count: 18,
    color: salonStatusMeta.gagne.chart_color,
    bar_class_name: salonStatusMeta.gagne.bar_class_name
  }
];

export const pipelineTotals = {
  total: dashboardPipeline.reduce((total, stage) => total + stage.count, 0),
  rdv_rate: "12,9 %",
  win_rate: "4,2 %"
};

export const dashboardMorningBrief = {
  user_name: currentUser.full_name.split(" ")[0],
  title: `Bonjour ${currentUser.full_name.split(" ")[0]}, voici votre journée`,
  subtitle:
    "Le pipeline est sain, mais les validations IA et les salons premium doivent rester vos priorités ce matin.",
  focus_label: "Priorité du jour",
  focus_value: "Valider 5 actions IA avant 11h pour débloquer l’outreach premium.",
  insights: [
    {
      id: "insight-1",
      title: "12 salons enrichis cette nuit",
      description: "EnrichBot a ajouté des téléphones ou sites web sur 12 fiches actives."
    },
    {
      id: "insight-2",
      title: `${dashboardKpis.actions_en_attente.value} approbations en attente`,
      description: "Les agents ont préparé des actions à fort potentiel sur les meilleurs salons."
    },
    {
      id: "insight-3",
      title: "Séquence Wella : 2 réponses reçues",
      description: "Maison Héritage et Studio Auguste ont montré des signaux d’intérêt depuis 24h."
    },
    {
      id: "insight-4",
      title: "Score moyen hebdo à 62",
      description: "Le niveau moyen progresse de 4 points grâce aux derniers enrichissements ciblés."
    }
  ]
};

export const dashboardLeadRows = [...mockSalons]
  .sort((salonA, salonB) => (salonB.score ?? 0) - (salonA.score ?? 0))
  .slice(0, 6);

export const dashboardRecentActivity = [...mockActivityLog].sort(
  (activityA, activityB) =>
    new Date(activityB.created_at).getTime() - new Date(activityA.created_at).getTime()
);

export const dashboardPendingApprovals = [...mockAgentActions]
  .filter((action) => action.status === "pending")
  .sort(
    (actionA, actionB) =>
      new Date(actionB.created_at).getTime() - new Date(actionA.created_at).getTime()
  )
  .slice(0, 5);

export type AgentRuntimeStatus = "active" | "warning" | "error";

export const dashboardAgentStatuses: Array<{
  agent_name: AgentName;
  status: AgentRuntimeStatus;
  last_run_at: string;
  items_processed_today: number;
}> = [
  {
    agent_name: "DataScout",
    status: "active",
    last_run_at: "2026-03-12T15:32:00.000Z",
    items_processed_today: 34
  },
  {
    agent_name: "EnrichBot",
    status: "active",
    last_run_at: "2026-03-12T15:24:00.000Z",
    items_processed_today: 18
  },
  {
    agent_name: "ScoreMaster",
    status: "active",
    last_run_at: "2026-03-12T15:17:00.000Z",
    items_processed_today: 42
  },
  {
    agent_name: "OutreachPilot",
    status: "warning",
    last_run_at: "2026-03-12T14:41:00.000Z",
    items_processed_today: 7
  },
  {
    agent_name: "QualityGuard",
    status: "active",
    last_run_at: "2026-03-12T15:38:00.000Z",
    items_processed_today: 56
  },
  {
    agent_name: "BrandMatcher",
    status: "error",
    last_run_at: "2026-03-12T13:04:00.000Z",
    items_processed_today: 0
  }
];

export function formatRelativeDate(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: fr
  }).replace(/^environ /, "");
}

export function getProfileName(profileId: string | null) {
  if (!profileId) {
    return "Non assigné";
  }

  return profilesById[profileId]?.full_name ?? "Non assigné";
}

export function formatInteger(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}
