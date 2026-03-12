import { createAdminClient } from "@/lib/supabase/admin";

const agentCatalog = [
  { id: "datascout", name: "DataScout", icon: "Search" },
  { id: "datascout-2026", name: "DataScout 2026", icon: "Bot" },
  { id: "enrichbot", name: "EnrichBot", icon: "Zap" },
  { id: "scoremaster", name: "ScoreMaster", icon: "Target" },
  { id: "outreachpilot", name: "OutreachPilot", icon: "Mail" },
  { id: "qualityguard", name: "QualityGuard", icon: "Shield" },
  { id: "brandmatcher", name: "BrandMatcher", icon: "Link" },
  { id: "rapport-hebdo", name: "Rapport Hebdo", icon: "FileText" },
  { id: "datascout-travaux", name: "DataScout Travaux", icon: "HardHat" }
] as const;

export type AgentId = (typeof agentCatalog)[number]["id"];
export type AgentIcon = (typeof agentCatalog)[number]["icon"];
export type AgentStatus = "active" | "idle" | "error";

export type AgentStat = {
  id: AgentId;
  name: string;
  totalActions: number;
  pendingActions: number;
  approvedActions: number;
  errorActions: number;
  lastAction: string | null;
  status: AgentStatus;
};

export type AgentCardData = {
  id: AgentId;
  name: string;
  icon: AgentIcon;
  status: AgentStatus;
  lastRunAt: string | null;
  resultSummary: string;
  primaryKpiLabel: string;
  primaryKpiValue: string;
  secondaryKpiLabel: string;
  secondaryKpiValue: string;
  logs: string[];
};

export type RecentAgentAction = {
  id: string;
  agentId: string;
  agentName: string;
  actionType: string;
  status: string;
  targetName: string;
  targetHref: string;
  createdAt: string;
  description: string;
};

export type AgentQueueItem = {
  id: string;
  type: string;
  targetName: string;
  targetHref: string;
  priority: "haute" | "normale" | "basse";
  assignedAgent: string;
  createdAt: string;
  status: string;
};

export type AgentsPageData = {
  agents: AgentCardData[];
  recentActions: RecentAgentAction[];
  workItems: AgentQueueItem[];
};

type AgentActionRow = {
  id?: string;
  agent_id?: string | null;
  agent_name?: string | null;
  action_type?: string | null;
  status?: string | null;
  created_at?: string | null;
  salon_id?: string | null;
  description?: string | null;
  result?: string | null;
  metadata?: unknown;
};

type WorkItemRow = {
  id?: string;
  type?: string | null;
  action_type?: string | null;
  status?: string | null;
  priority?: string | null;
  assigned_agent?: string | null;
  agent_id?: string | null;
  salon_id?: string | null;
  title?: string | null;
  name?: string | null;
  target_href?: string | null;
  created_at?: string | null;
  metadata?: unknown;
};

type SalonLookupRow = {
  id: string;
  name: string | null;
};

const agentIds = agentCatalog.map((agent) => agent.id);
const agentDisplayNames: Record<AgentId, string> = agentCatalog.reduce(
  (accumulator, agent) => {
    accumulator[agent.id] = agent.name;
    return accumulator;
  },
  {} as Record<AgentId, string>
);

const agentIcons: Record<AgentId, AgentIcon> = agentCatalog.reduce(
  (accumulator, agent) => {
    accumulator[agent.id] = agent.icon;
    return accumulator;
  },
  {} as Record<AgentId, AgentIcon>
);

const agentAliases: Record<string, AgentId> = {
  datascout: "datascout",
  "data-scout": "datascout",
  "data-scout-2026": "datascout-2026",
  "data-scout-travaux": "datascout-travaux",
  datascout2026: "datascout-2026",
  "datascout-2026": "datascout-2026",
  datascouttravaux: "datascout-travaux",
  "datascout-travaux": "datascout-travaux",
  enrichbot: "enrichbot",
  scoremaster: "scoremaster",
  outreachpilot: "outreachpilot",
  qualityguard: "qualityguard",
  brandmatcher: "brandmatcher",
  rapporthebdo: "rapport-hebdo",
  "rapport-hebdo": "rapport-hebdo"
};

const pendingStatuses = new Set(["pending", "queued", "requested", "waiting", "todo"]);
const approvedStatuses = new Set([
  "approved",
  "auto-approved",
  "auto_approved",
  "completed",
  "success",
  "done"
]);
const errorStatuses = new Set(["error", "failed", "rejected", "cancelled"]);

function normalizeValue(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function resolveAgentId(rawValue: string | null | undefined): AgentId | null {
  const normalized = normalizeValue(rawValue);
  if (!normalized) return null;
  if (agentAliases[normalized]) return agentAliases[normalized];
  if (agentIds.includes(normalized as AgentId)) return normalized as AgentId;
  return null;
}

function humanizeLabel(value: string | null | undefined) {
  if (!value) return "Non renseigné";

  return value
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeStatus(value: string | null | undefined) {
  return normalizeValue(value);
}

function isRecent(value: string | null, maxHours = 24) {
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return Date.now() - date.getTime() <= maxHours * 60 * 60 * 1000;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "--:--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function translateStatus(value: string | null | undefined) {
  switch (normalizeStatus(value)) {
    case "approved":
    case "auto-approved":
    case "auto_approved":
      return "Approuvée";
    case "completed":
    case "done":
    case "success":
      return "Terminée";
    case "pending":
      return "En attente";
    case "queued":
      return "En file";
    case "requested":
      return "Demandée";
    case "error":
      return "Erreur";
    case "failed":
      return "Échouée";
    case "rejected":
      return "Rejetée";
    default:
      return value ? humanizeLabel(value) : "Inconnu";
  }
}

function translateActionType(value: string | null | undefined) {
  switch (normalizeValue(value)) {
    case "enrichment":
      return "Enrichissement";
    case "outreach":
      return "Outreach";
    case "brand-match":
    case "brand-matcher":
    case "brand-match-score":
    case "brand-match-refresh":
    case "brand-match-request":
    case "brand-match-run":
    case "brand-match-calculation":
    case "brand-match-calc":
    case "brand-match-job":
    case "brand-match-result":
    case "brand-match-update":
    case "brand-match-check":
    case "brand-match-sync":
    case "brand-match-generated":
    case "brand-match-created":
    case "brand-match-scoring":
    case "brand-match-suggestion":
    case "brand-match-score-refresh":
    case "brand-match-score-update":
    case "brand-match-score-generated":
    case "brand-match-score-created":
    case "brand-match-score-sync":
    case "brand-match-score-run":
    case "brand-match-score-job":
    case "brand-match-score-check":
    case "brand-match-score-result":
    case "brand-match-score-calculation":
    case "brand-match-score-calc":
    case "brand-match-score-request":
    case "brand-match-score-suggestion":
    case "brand-match-score-approval":
    case "brand-match-score-proposal":
    case "brand-match-score-assign":
    case "brand-match-score-match":
    case "brand-match-score-recompute":
    case "brand-match-score-refresh-run":
    case "brand-match-score-sync-run":
    case "brand-match-score-analysis":
    case "brand-match-score-batch":
    case "brand-match-score-audit":
    case "brand-match-score-queue":
    case "brand-match-score-process":
    case "brand-match-score-evaluate":
    case "brand-match":
    case "brand-match-scoreing":
    case "brand-match-score-master":
    case "brand_match":
      return "Matching marque";
    case "score-refresh":
    case "score-refresh-run":
    case "score":
    case "score-refresh-job":
    case "score_refresh":
      return "Scoring";
    case "quality-review":
    case "quality_review":
      return "Contrôle qualité";
    case "prospecting":
      return "Prospection";
    case "contact-sync":
    case "contact_sync":
      return "Synchronisation contact";
    case "dossier-generation":
    case "dossier_generation":
      return "Génération de dossier";
    case "travaux-signal":
    case "travaux_signal":
      return "Signal travaux";
    default:
      return value ? humanizeLabel(value) : "Action";
  }
}

function getActionDescription(action: AgentActionRow) {
  const result = typeof action.result === "string" ? action.result.trim() : "";
  if (result) return result;

  const description = typeof action.description === "string" ? action.description.trim() : "";
  if (description) return description;

  return `${translateActionType(action.action_type)} · ${translateStatus(action.status)}`;
}

function mapPriority(value: string | null | undefined): AgentQueueItem["priority"] {
  switch (normalizeValue(value)) {
    case "high":
    case "haute":
      return "haute";
    case "low":
    case "basse":
      return "basse";
    default:
      return "normale";
  }
}

async function fetchAgentMonitoringData() {
  const supabase = createAdminClient();

  try {
    const [actionsResult, workItemsResult] = await Promise.all([
      supabase.from("agent_actions").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("work_items").select("*").order("created_at", { ascending: false }).limit(100)
    ]);

    if (actionsResult.error) {
      console.error("[agents] Impossible de charger agent_actions", actionsResult.error);
    }

    if (workItemsResult.error) {
      console.error("[agents] Impossible de charger work_items", workItemsResult.error);
    }

    const actions = (actionsResult.data ?? []) as AgentActionRow[];
    const workItems = (workItemsResult.data ?? []) as WorkItemRow[];

    const salonIds = Array.from(
      new Set(
        [...actions.map((item) => item.salon_id), ...workItems.map((item) => item.salon_id)].filter(
          (value): value is string => typeof value === "string" && value.length > 0
        )
      )
    );

    const salonResult = salonIds.length
      ? await supabase.from("salons").select("id, name").in("id", salonIds)
      : { data: [] as SalonLookupRow[], error: null };

    if (salonResult.error) {
      console.error("[agents] Impossible de charger les salons liés", salonResult.error);
    }

    const salonById = new Map(
      ((salonResult.data ?? []) as SalonLookupRow[]).map((salon) => [salon.id, salon.name ?? "Salon"]) 
    );

    return { actions, workItems, salonById };
  } catch (error) {
    console.error("[agents] Erreur inattendue lors du chargement des données agents", error);
    return {
      actions: [] as AgentActionRow[],
      workItems: [] as WorkItemRow[],
      salonById: new Map<string, string>()
    };
  }
}

function buildAgentStats(actions: AgentActionRow[]): AgentStat[] {
  return agentCatalog.map((agent) => {
    const agentActions = actions.filter(
      (action) => resolveAgentId(action.agent_id ?? action.agent_name) === agent.id
    );

    const pendingActions = agentActions.filter((action) =>
      pendingStatuses.has(normalizeStatus(action.status))
    ).length;
    const approvedActions = agentActions.filter((action) =>
      approvedStatuses.has(normalizeStatus(action.status))
    ).length;
    const errorActions = agentActions.filter((action) =>
      errorStatuses.has(normalizeStatus(action.status))
    ).length;

    const lastAction = agentActions[0]?.created_at ?? null;
    const latestStatus = normalizeStatus(agentActions[0]?.status);

    let status: AgentStatus = "idle";
    if (errorStatuses.has(latestStatus)) {
      status = "error";
    } else if (pendingActions > 0 || isRecent(lastAction, 24)) {
      status = "active";
    }

    return {
      id: agent.id,
      name: agent.name,
      totalActions: agentActions.length,
      pendingActions,
      approvedActions,
      errorActions,
      lastAction,
      status
    };
  });
}

export async function getAgentStats() {
  const { actions } = await fetchAgentMonitoringData();
  return buildAgentStats(actions);
}

function buildAgentCards(stats: AgentStat[], actions: AgentActionRow[]): AgentCardData[] {
  return stats.map((stat) => {
    const agentActions = actions.filter(
      (action) => resolveAgentId(action.agent_id ?? action.agent_name) === stat.id
    );

    const latestAction = agentActions[0];
    const logs =
      agentActions.slice(0, 4).map((action) => {
        return `${formatTime(action.created_at)} — ${translateActionType(action.action_type)} · ${translateStatus(action.status)}`;
      }) || [];

    const resultSummary = latestAction
      ? getActionDescription(latestAction)
      : "Aucune action historisée pour le moment.";

    return {
      id: stat.id,
      name: stat.name,
      icon: agentIcons[stat.id],
      status: stat.status,
      lastRunAt: stat.lastAction,
      resultSummary,
      primaryKpiLabel: "Actions totales",
      primaryKpiValue: String(stat.totalActions),
      secondaryKpiLabel:
        stat.errorActions > 0 ? "Erreurs" : stat.pendingActions > 0 ? "En attente" : "Approuvées",
      secondaryKpiValue: String(
        stat.errorActions > 0
          ? stat.errorActions
          : stat.pendingActions > 0
            ? stat.pendingActions
            : stat.approvedActions
      ),
      logs: logs.length > 0 ? logs : ["Aucune action récente disponible."]
    };
  });
}

function buildRecentActions(
  actions: AgentActionRow[],
  salonById: Map<string, string>
): RecentAgentAction[] {
  return actions.slice(0, 20).map((action, index) => {
    const resolvedAgentId = resolveAgentId(action.agent_id ?? action.agent_name);
    const metadata = toRecord(action.metadata);
    const targetName =
      salonById.get(action.salon_id ?? "") ??
      (typeof metadata.salon_name === "string" ? metadata.salon_name : null) ??
      (typeof metadata.area === "string" ? metadata.area : null) ??
      "Cible non renseignée";

    return {
      id: action.id ?? `recent-action-${index}`,
      agentId:
        resolvedAgentId ?? (normalizeValue(action.agent_id ?? action.agent_name) || "agent"),
      agentName:
        (resolvedAgentId ? agentDisplayNames[resolvedAgentId] : null) ??
        humanizeLabel(action.agent_name ?? action.agent_id),
      actionType: action.action_type ?? "action",
      status: action.status ?? "unknown",
      targetName,
      targetHref: action.salon_id ? `/dashboard/salons/${action.salon_id}` : "/dashboard/agents",
      createdAt: action.created_at ?? new Date().toISOString(),
      description: getActionDescription(action)
    };
  });
}

function buildWorkItems(
  workItems: WorkItemRow[],
  recentActions: RecentAgentAction[],
  salonById: Map<string, string>
): AgentQueueItem[] {
  const liveWorkItems = workItems.map((item, index) => {
    const metadata = toRecord(item.metadata);
    const resolvedAgentId = resolveAgentId(item.assigned_agent ?? item.agent_id);
    const targetName =
      salonById.get(item.salon_id ?? "") ??
      (typeof item.title === "string" && item.title.trim() ? item.title : null) ??
      (typeof item.name === "string" && item.name.trim() ? item.name : null) ??
      (typeof metadata.target_name === "string" ? metadata.target_name : null) ??
      "Cible non renseignée";

    return {
      id: item.id ?? `work-item-${index}`,
      type: item.type ?? item.action_type ?? "task",
      targetName,
      targetHref:
        item.target_href ?? (item.salon_id ? `/dashboard/salons/${item.salon_id}` : "/dashboard/agents"),
      priority: mapPriority(item.priority),
      assignedAgent:
        (resolvedAgentId ? agentDisplayNames[resolvedAgentId] : null) ??
        humanizeLabel(item.assigned_agent ?? item.agent_id),
      createdAt: item.created_at ?? new Date().toISOString(),
      status: item.status ?? "pending"
    } satisfies AgentQueueItem;
  });

  if (liveWorkItems.length > 0) {
    return liveWorkItems;
  }

  return recentActions
    .filter((action) => pendingStatuses.has(normalizeStatus(action.status)))
    .slice(0, 12)
    .map((action) => ({
      id: `fallback-${action.id}`,
      type: action.actionType,
      targetName: action.targetName,
      targetHref: action.targetHref,
      priority: "normale",
      assignedAgent: action.agentName,
      createdAt: action.createdAt,
      status: action.status
    }));
}

export async function getAgentsPageData(): Promise<AgentsPageData> {
  const { actions, workItems, salonById } = await fetchAgentMonitoringData();
  const stats = buildAgentStats(actions);
  const recentActions = buildRecentActions(actions, salonById);

  return {
    agents: buildAgentCards(stats, actions),
    recentActions,
    workItems: buildWorkItems(workItems, recentActions, salonById)
  };
}
