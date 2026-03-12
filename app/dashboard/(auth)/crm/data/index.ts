import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { mockProfiles as fallbackProfiles } from "./mock-profiles";
import { mockActivityLog } from "./activity-log";
import { mockAgentActions } from "./agent-actions";
import { mockApprovals } from "./approvals";
import { mockSalons } from "./salons";
import type {
  ActivityAction,
  AgentName,
  EnrichmentStatus,
  ProfileRow,
  SalonStatus
} from "./types";

export * from "./types";
export { mockSalons, mockActivityLog, mockAgentActions, mockApprovals };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CRM_GOLD = "#C5A572";
const FALLBACK_DATE = "1970-01-01T00:00:00.000Z";

const DASHBOARD_STATUS_ORDER: SalonStatus[] = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne"
];

const EMPTY_STATUS_COUNTS: Record<SalonStatus, number> = {
  nouveau: 0,
  contacte: 0,
  interesse: 0,
  rdv_planifie: 0,
  negociation: 0,
  gagne: 0,
  perdu: 0,
  client_actif: 0
};

const FALLBACK_CURRENT_USER: ProfileRow =
  fallbackProfiles.at(0) ?? {
    id: "fallback-user",
    full_name: "Ludovic Goutel",
    email: "ludovic@orchestraintelligence.fr",
    role: "admin",
    avatar_url: null,
    created_at: FALLBACK_DATE,
    updated_at: FALLBACK_DATE
  };

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  if (typeof window !== "undefined") {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, { isSingleton: true });
  }

  try {
    const runtimeImport = new Function("modulePath", "return import(modulePath);") as (
      modulePath: string
    ) => Promise<{ cookies: () => Promise<any> }>;

    const { cookies } = await runtimeImport("next/headers");
    const cookieStore = await cookies();

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        }
      }
    });
  } catch (error) {
    console.error("[crm/data/index] unable to create server supabase client:", error);
    return null;
  }
}

function normalizeProfile(row: Record<string, unknown>): ProfileRow {
  return {
    id: getString(row.id, getString(row.email, "profile-inconnu")),
    full_name: getString(row.full_name, "Utilisateur"),
    email: getString(row.email, ""),
    role: getNullableString(row.role),
    avatar_url: getNullableString(row.avatar_url),
    created_at: getString(row.created_at, FALLBACK_DATE),
    updated_at: getString(row.updated_at, getString(row.created_at, FALLBACK_DATE))
  };
}

async function getAverageSalonScore(supabase: any) {
  const pageSize = 1000;
  let from = 0;
  let total = 0;
  let count = 0;

  while (true) {
    const { data, error } = await supabase
      .from("salons")
      .select("score")
      .not("score", "is", null)
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error("[crm/data/index] average score query failed:", error.message);
      return 0;
    }

    if (!data?.length) {
      break;
    }

    for (const row of data as Array<Record<string, unknown>>) {
      const score = getNumber(row.score);

      if (score !== null) {
        total += score;
        count += 1;
      }
    }

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return count ? total / count : 0;
}

async function loadDashboardSnapshot() {
  try {
    const supabase = await getSupabaseClient();

    if (!supabase) {
      return {
        stats: {
          totalSalons: 0,
          enrichedSalons: 0,
          highScoreSalons: 0,
          contactedSalons: 0,
          activeBrands: 0,
          pendingActions: 0,
          totalOutreach: 0
        },
        averageScore: 0,
        profiles: fallbackProfiles,
        statusCounts: EMPTY_STATUS_COUNTS
      };
    }

    const [
      salonsRes,
      enrichedRes,
      highScoreRes,
      contactedRes,
      brandsRes,
      actionsRes,
      outreachRes,
      profilesRes,
      averageScore,
      statusResults
    ] = await Promise.all([
      supabase.from("salons").select("id", { count: "exact", head: true }),
      supabase
        .from("salons")
        .select("id", { count: "exact", head: true })
        .eq("enrichment_status", "complete"),
      supabase.from("salons").select("id", { count: "exact", head: true }).gte("score", 40),
      supabase.from("salons").select("id", { count: "exact", head: true }).neq("status", "nouveau"),
      supabase.from("brands").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase
        .from("agent_actions")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("outreach").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id, full_name, email, role, avatar_url, created_at, updated_at")
        .order("created_at", { ascending: true }),
      getAverageSalonScore(supabase),
      Promise.all(
        (Object.keys(EMPTY_STATUS_COUNTS) as SalonStatus[]).map((status) =>
          supabase.from("salons").select("id", { count: "exact", head: true }).eq("status", status)
        )
      )
    ]);

    const statusEntries = (Object.keys(EMPTY_STATUS_COUNTS) as SalonStatus[]).map((status, index) => [
      status,
      statusResults[index].error ? 0 : (statusResults[index].count ?? 0)
    ]);

    return {
      stats: {
        totalSalons: salonsRes.error ? 0 : (salonsRes.count ?? 0),
        enrichedSalons: enrichedRes.error ? 0 : (enrichedRes.count ?? 0),
        highScoreSalons: highScoreRes.error ? 0 : (highScoreRes.count ?? 0),
        contactedSalons: contactedRes.error ? 0 : (contactedRes.count ?? 0),
        activeBrands: brandsRes.error ? 0 : (brandsRes.count ?? 0),
        pendingActions: actionsRes.error ? 0 : (actionsRes.count ?? 0),
        totalOutreach: outreachRes.error ? 0 : (outreachRes.count ?? 0)
      },
      averageScore,
      profiles: profilesRes.error
        ? fallbackProfiles
        : ((profilesRes.data ?? []) as Array<Record<string, unknown>>).map((row) => normalizeProfile(row)),
      statusCounts: Object.fromEntries(statusEntries) as Record<SalonStatus, number>
    };
  } catch (error) {
    console.error("[crm/data/index] snapshot load failed:", error);

    return {
      stats: {
        totalSalons: 0,
        enrichedSalons: 0,
        highScoreSalons: 0,
        contactedSalons: 0,
        activeBrands: 0,
        pendingActions: 0,
        totalOutreach: 0
      },
      averageScore: 0,
      profiles: fallbackProfiles,
      statusCounts: EMPTY_STATUS_COUNTS
    };
  }
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(Number.isFinite(value) ? value : 0);
}

function formatScore(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: value >= 10 ? 0 : 1,
    maximumFractionDigits: 1
  }).format(Number.isFinite(value) ? value : 0);
}

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "Ludovic";
}

const dashboardSnapshot = await loadDashboardSnapshot();

export { CRM_GOLD };
export const mockProfiles: ProfileRow[] =
  dashboardSnapshot.profiles.length > 0 ? dashboardSnapshot.profiles : fallbackProfiles;

export const currentUser =
  mockProfiles.find((profile) => profile.role === "admin") ?? mockProfiles.at(0) ?? FALLBACK_CURRENT_USER;

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

export const activityActionMeta: Record<
  string,
  { label: string; icon_tone_class_name: string }
> = {
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
  },
  "salon.created": {
    label: "a créé",
    icon_tone_class_name: "bg-slate-50 text-slate-700 border-slate-100"
  },
  "salon.enriched": {
    label: "a enrichi",
    icon_tone_class_name: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  "score.updated": {
    label: "a mis à jour le score de",
    icon_tone_class_name: "bg-amber-50 text-amber-700 border-amber-100"
  },
  "outreach.sent": {
    label: "a envoyé un outreach à",
    icon_tone_class_name: "bg-sky-50 text-sky-700 border-sky-100"
  },
  "call.completed": {
    label: "a terminé un appel avec",
    icon_tone_class_name: "bg-violet-50 text-violet-700 border-violet-100"
  },
  "approval.approved": {
    label: "a approuvé",
    icon_tone_class_name: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  "approval.requested": {
    label: "a demandé une validation pour",
    icon_tone_class_name: "bg-sky-50 text-sky-700 border-sky-100"
  },
  "approval.rejected": {
    label: "a rejeté",
    icon_tone_class_name: "bg-rose-50 text-rose-700 border-rose-100"
  },
  "agent_action.approved": {
    label: "a approuvé l’action",
    icon_tone_class_name: "bg-emerald-50 text-emerald-700 border-emerald-100"
  },
  "agent_action.rejected": {
    label: "a rejeté l’action",
    icon_tone_class_name: "bg-rose-50 text-rose-700 border-rose-100"
  },
  "agent_action.auto_approved": {
    label: "a auto-validé l’action",
    icon_tone_class_name: "bg-sky-50 text-sky-700 border-sky-100"
  },
  "outreach.draft_generated": {
    label: "a généré un brouillon pour",
    icon_tone_class_name: "bg-sky-50 text-sky-700 border-sky-100"
  },
  "salon.status_changed": {
    label: "a changé le statut de",
    icon_tone_class_name: "bg-violet-50 text-violet-700 border-violet-100"
  }
};

export const agentActionTypeMeta: Record<string, { label: string }> = {
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
  },
  draft_email: {
    label: "Brouillon email"
  },
  match_proposal: {
    label: "Proposition marque"
  },
  update_score: {
    label: "Mettre à jour le score"
  },
  enrich_data: {
    label: "Enrichir la fiche"
  },
  discover_salon: {
    label: "Découvrir un salon"
  },
  status_change: {
    label: "Changer le statut"
  },
  contact_add: {
    label: "Ajouter un contact"
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
    value: formatInteger(dashboardSnapshot.stats.totalSalons),
    trend_value: formatPercent(
      dashboardSnapshot.stats.totalSalons > 0
        ? dashboardSnapshot.stats.contactedSalons / dashboardSnapshot.stats.totalSalons
        : 0
    ),
    trend_direction: dashboardSnapshot.stats.contactedSalons > 0 ? "up" : "down",
    trend_tone: dashboardSnapshot.stats.contactedSalons > 0 ? "positive" : "neutral",
    trend_context: "déjà contactés",
    accent: "default"
  },
  salons_enrichis: {
    label: "Salons enrichis",
    value: formatInteger(dashboardSnapshot.stats.enrichedSalons),
    trend_value: formatPercent(
      dashboardSnapshot.stats.totalSalons > 0
        ? dashboardSnapshot.stats.enrichedSalons / dashboardSnapshot.stats.totalSalons
        : 0
    ),
    trend_direction: dashboardSnapshot.stats.enrichedSalons > 0 ? "up" : "down",
    trend_tone: dashboardSnapshot.stats.enrichedSalons > 0 ? "positive" : "neutral",
    trend_context: "base enrichie",
    accent: "default"
  },
  score_moyen: {
    label: "Score moyen",
    value: `${formatScore(dashboardSnapshot.averageScore)}/100`,
    trend_value: formatInteger(dashboardSnapshot.stats.highScoreSalons),
    trend_direction: dashboardSnapshot.stats.highScoreSalons > 0 ? "up" : "down",
    trend_tone: dashboardSnapshot.stats.highScoreSalons > 0 ? "positive" : "neutral",
    trend_context: "salons scorés 40+",
    accent: "gold"
  },
  actions_en_attente: {
    label: "Actions en attente",
    value: formatInteger(dashboardSnapshot.stats.pendingActions),
    trend_value:
      dashboardSnapshot.stats.pendingActions > 0
        ? formatInteger(dashboardSnapshot.stats.pendingActions)
        : "0",
    trend_direction: dashboardSnapshot.stats.pendingActions > 0 ? "up" : "down",
    trend_tone: dashboardSnapshot.stats.pendingActions > 0 ? "negative" : "positive",
    trend_context:
      dashboardSnapshot.stats.pendingActions > 0
        ? "validations IA à traiter"
        : "aucune validation en attente",
    badge_label: dashboardSnapshot.stats.pendingActions > 0 ? "Urgent" : undefined,
    accent: "danger"
  }
};

export const dashboardPipeline = DASHBOARD_STATUS_ORDER.map((status) => ({
  status,
  label: salonStatusMeta[status].label,
  count: dashboardSnapshot.statusCounts[status] ?? 0,
  color: salonStatusMeta[status].chart_color,
  bar_class_name: salonStatusMeta[status].bar_class_name
}));

const pipelineTrackedTotal = dashboardPipeline.reduce((total, stage) => total + stage.count, 0);
const pipelineSafeTotal = pipelineTrackedTotal || 1;
const meetingStagesTotal =
  (dashboardSnapshot.statusCounts.rdv_planifie ?? 0) +
  (dashboardSnapshot.statusCounts.negociation ?? 0) +
  (dashboardSnapshot.statusCounts.gagne ?? 0);

export const pipelineTotals = {
  total: pipelineSafeTotal,
  rdv_rate: formatPercent(meetingStagesTotal / pipelineSafeTotal),
  win_rate: formatPercent((dashboardSnapshot.statusCounts.gagne ?? 0) / pipelineSafeTotal)
};

const currentUserFirstName = getFirstName(currentUser.full_name);

export const dashboardMorningBrief = {
  user_name: currentUserFirstName,
  title: `Bonjour ${currentUserFirstName}, voici votre journée`,
  subtitle:
    dashboardSnapshot.stats.pendingActions > 0
      ? "Les validations IA sont le principal levier pour débloquer le pipeline ce matin."
      : "Le dashboard est synchronisé avec Supabase et le pipeline est à jour.",
  focus_label: "Priorité du jour",
  focus_value:
    dashboardSnapshot.stats.pendingActions > 0
      ? `Valider ${formatInteger(dashboardSnapshot.stats.pendingActions)} actions IA pour débloquer l’outreach en attente.`
      : "Aucune validation urgente : concentrez-vous sur les salons les mieux scorés.",
  insights: [
    {
      id: "insight-1",
      title: `${formatInteger(dashboardSnapshot.stats.enrichedSalons)} salons enrichis`,
      description: "Fiches avec enrichissement complet synchronisées depuis Supabase."
    },
    {
      id: "insight-2",
      title: `${formatInteger(dashboardSnapshot.stats.pendingActions)} actions IA en attente`,
      description: "Les propositions prêtes à valider remontent directement depuis agent_actions."
    },
    {
      id: "insight-3",
      title: `${formatInteger(dashboardSnapshot.stats.highScoreSalons)} salons à score ≥ 40`,
      description: "Le vivier prioritaire à traiter aujourd’hui pour le pipeline commercial."
    },
    {
      id: "insight-4",
      title: `${formatInteger(dashboardSnapshot.stats.totalOutreach)} outreach planifiés`,
      description: "Volume total d’outreach actuellement stocké dans la base de production."
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

const AGENT_CATALOG: Array<{ agent_id: string; agent_name: AgentName }> = [
  { agent_id: "datascout", agent_name: "DataScout" },
  { agent_id: "enrichbot", agent_name: "EnrichBot" },
  { agent_id: "scoremaster", agent_name: "ScoreMaster" },
  { agent_id: "outreachpilot", agent_name: "OutreachPilot" },
  { agent_id: "qualityguard", agent_name: "QualityGuard" },
  { agent_id: "brandmatcher", agent_name: "BrandMatcher" }
];

function normalizeAgentId(value: string | undefined) {
  if (!value) {
    return "";
  }

  if (value.startsWith("datascout")) {
    return "datascout";
  }

  return value;
}

function getRuntimeStatus(lastRunAt: string | null): AgentRuntimeStatus {
  if (!lastRunAt) {
    return "error";
  }

  const lastRunMs = new Date(lastRunAt).getTime();
  const ageHours = (Date.now() - lastRunMs) / (1000 * 60 * 60);

  if (ageHours <= 24) {
    return "active";
  }

  if (ageHours <= 72) {
    return "warning";
  }

  return "error";
}

const todayKey = new Date().toISOString().slice(0, 10);

export const dashboardAgentStatuses = AGENT_CATALOG.map((catalogItem) => {
  const relatedActions = mockAgentActions.filter(
    (action) => normalizeAgentId(action.agent_id) === catalogItem.agent_id
  );
  const lastRunAt =
    relatedActions
      .map((action) => action.created_at)
      .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] ?? null;

  return {
    agent_name: catalogItem.agent_name,
    status: getRuntimeStatus(lastRunAt),
    last_run_at: lastRunAt ?? FALLBACK_DATE,
    items_processed_today: relatedActions.filter((action) => action.created_at.slice(0, 10) === todayKey)
      .length
  };
});

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
