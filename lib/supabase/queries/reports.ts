import { createAdminClient } from "@/lib/supabase/admin";

const statusOrder = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
] as const;

const statusLabels: Record<(typeof statusOrder)[number], string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  interesse: "Intéressé",
  rdv_planifie: "RDV planifié",
  negociation: "Négociation",
  gagne: "Gagné",
  perdu: "Perdu",
  client_actif: "Client actif"
};

export type ReportAction = {
  id: string;
  agentId: string;
  agentName: string;
  actionType: string;
  status: string;
  createdAt: string;
  description: string;
};

export type StatusDistributionItem = {
  status: string;
  label: string;
  count: number;
};

export type QualityMetric = {
  label: string;
  value: number;
};

export type ScoreBucket = {
  range: string;
  value: number;
};

export type DailyActionPoint = {
  date: string;
  day: string;
  value: number;
};

export type AgentBreakdownItem = {
  agent: string;
  count: number;
};

export type OutreachStatusItem = {
  label: string;
  count: number;
};

export type ReportData = {
  totalSalons: number;
  enriched: number;
  highScore: number;
  contacted: number;
  outreachSent: number;
  recentActions: ReportAction[];
  statusDistribution: StatusDistributionItem[];
  enrichmentQuality: QualityMetric[];
  scoreBuckets: ScoreBucket[];
  outreachByStatus: OutreachStatusItem[];
  agentBreakdown: AgentBreakdownItem[];
  dailyActions: DailyActionPoint[];
};

type SalonMetricRow = {
  status: string | null;
  score: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_rating: number | null;
  enrichment_status: string | null;
};

type AgentActionRow = {
  id?: string;
  agent_id?: string | null;
  agent_name?: string | null;
  action_type?: string | null;
  status?: string | null;
  created_at?: string | null;
  description?: string | null;
  result?: string | null;
};

type OutreachRow = {
  status: string | null;
};

function normalizeValue(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function buildStatusDistribution(rows: SalonMetricRow[]): StatusDistributionItem[] {
  const counts = rows.reduce<Record<string, number>>((accumulator, row) => {
    const key = normalizeValue(row.status) || "nouveau";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return statusOrder.map((status) => ({
    status,
    label: statusLabels[status],
    count: counts[status] ?? 0
  }));
}

function buildQualityMetrics(rows: SalonMetricRow[], totalSalons: number): QualityMetric[] {
  const denominator = Math.max(totalSalons, 1);

  return [
    {
      label: "Téléphone",
      value: Math.round((rows.filter((row) => Boolean(row.phone)).length / denominator) * 100)
    },
    {
      label: "Email",
      value: Math.round((rows.filter((row) => Boolean(row.email)).length / denominator) * 100)
    },
    {
      label: "Site web",
      value: Math.round((rows.filter((row) => Boolean(row.website)).length / denominator) * 100)
    },
    {
      label: "Google rating",
      value: Math.round(
        (rows.filter((row) => typeof row.google_rating === "number").length / denominator) * 100
      )
    }
  ];
}

function buildScoreBuckets(rows: SalonMetricRow[]): ScoreBucket[] {
  const buckets = Array.from({ length: 10 }, (_, index) => ({
    range: `${index * 10}-${index === 9 ? 100 : index * 10 + 10}`,
    value: 0
  }));

  for (const row of rows) {
    const score = Number(row.score ?? 0);
    const clamped = Math.max(0, Math.min(100, score));
    const bucketIndex = Math.min(9, Math.floor(clamped / 10));
    buckets[bucketIndex].value += 1;
  }

  return buckets;
}

function buildOutreachByStatus(rows: OutreachRow[]): OutreachStatusItem[] {
  const counts = rows.reduce<Record<string, number>>((accumulator, row) => {
    const key = normalizeValue(row.status) || "non-renseigne";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([status, count]) => ({
      label: humanizeLabel(status),
      count
    }));
}

function buildAgentBreakdown(rows: AgentActionRow[]): AgentBreakdownItem[] {
  const counts = rows.reduce<Record<string, number>>((accumulator, row) => {
    const key = row.agent_name ?? row.agent_id ?? "Agent inconnu";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([agent, count]) => ({
      agent: humanizeLabel(agent),
      count
    }));
}

function buildDailyActions(rows: AgentActionRow[], days = 30): DailyActionPoint[] {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short"
  });

  const points: DailyActionPoint[] = [];
  const counts = new Map<string, number>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    const key = date.toISOString().slice(0, 10);
    points.push({
      date: key,
      day: formatter.format(date),
      value: 0
    });
    counts.set(key, 0);
  }

  for (const row of rows) {
    if (!row.created_at) continue;
    const key = row.created_at.slice(0, 10);
    if (!counts.has(key)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return points.map((point) => ({
    ...point,
    value: counts.get(point.date) ?? 0
  }));
}

function buildRecentActions(rows: AgentActionRow[]): ReportAction[] {
  return rows.slice(0, 50).map((row, index) => ({
    id: row.id ?? `report-action-${index}`,
    agentId: normalizeValue(row.agent_id ?? row.agent_name) || "agent",
    agentName: humanizeLabel(row.agent_name ?? row.agent_id),
    actionType: row.action_type ?? "action",
    status: row.status ?? "unknown",
    createdAt: row.created_at ?? new Date().toISOString(),
    description:
      (typeof row.result === "string" && row.result.trim()) ||
      (typeof row.description === "string" && row.description.trim()) ||
      humanizeLabel(row.action_type)
  }));
}

function emptyReportData(): ReportData {
  return {
    totalSalons: 0,
    enriched: 0,
    highScore: 0,
    contacted: 0,
    outreachSent: 0,
    recentActions: [],
    statusDistribution: buildStatusDistribution([]),
    enrichmentQuality: buildQualityMetrics([], 0),
    scoreBuckets: buildScoreBuckets([]),
    outreachByStatus: [],
    agentBreakdown: [],
    dailyActions: buildDailyActions([])
  };
}

export async function getReportData(): Promise<ReportData> {
  const supabase = createAdminClient();

  try {
    const [
      totalSalonsResult,
      enrichedResult,
      highScoreResult,
      contactedResult,
      outreachSentResult,
      recentActionsResult,
      salonsMetricsResult,
      outreachStatusResult
    ] = await Promise.all([
      supabase.from("salons").select("*", { count: "exact", head: true }),
      supabase
        .from("salons")
        .select("*", { count: "exact", head: true })
        .or("enrichment_status.eq.complete,enrichment_status.eq.enriched"),
      supabase.from("salons").select("*", { count: "exact", head: true }).gte("score", 40),
      supabase.from("salons").select("*", { count: "exact", head: true }).neq("status", "nouveau"),
      supabase.from("outreach").select("*", { count: "exact", head: true }),
      supabase.from("agent_actions").select("*").order("created_at", { ascending: false }).limit(200),
      supabase
        .from("salons")
        .select("status, score, phone, email, website, google_rating, enrichment_status"),
      supabase.from("outreach").select("status")
    ]);

    if (totalSalonsResult.error) {
      console.error("[reports] Impossible de compter les salons", totalSalonsResult.error);
    }
    if (enrichedResult.error) {
      console.error("[reports] Impossible de compter les salons enrichis", enrichedResult.error);
    }
    if (highScoreResult.error) {
      console.error("[reports] Impossible de compter les scores élevés", highScoreResult.error);
    }
    if (contactedResult.error) {
      console.error("[reports] Impossible de compter les salons contactés", contactedResult.error);
    }
    if (outreachSentResult.error) {
      console.error("[reports] Impossible de compter les outreachs", outreachSentResult.error);
    }
    if (recentActionsResult.error) {
      console.error("[reports] Impossible de charger les actions récentes", recentActionsResult.error);
    }
    if (salonsMetricsResult.error) {
      console.error("[reports] Impossible de charger les métriques salons", salonsMetricsResult.error);
    }
    if (outreachStatusResult.error) {
      console.error("[reports] Impossible de charger les statuts outreach", outreachStatusResult.error);
    }

    const salonMetrics = (salonsMetricsResult.data ?? []) as SalonMetricRow[];
    const recentActionsRows = (recentActionsResult.data ?? []) as AgentActionRow[];
    const outreachRows = (outreachStatusResult.data ?? []) as OutreachRow[];

    return {
      totalSalons: totalSalonsResult.count ?? 0,
      enriched: enrichedResult.count ?? 0,
      highScore: highScoreResult.count ?? 0,
      contacted: contactedResult.count ?? 0,
      outreachSent: outreachSentResult.count ?? 0,
      recentActions: buildRecentActions(recentActionsRows),
      statusDistribution: buildStatusDistribution(salonMetrics),
      enrichmentQuality: buildQualityMetrics(salonMetrics, totalSalonsResult.count ?? 0),
      scoreBuckets: buildScoreBuckets(salonMetrics),
      outreachByStatus: buildOutreachByStatus(outreachRows),
      agentBreakdown: buildAgentBreakdown(recentActionsRows),
      dailyActions: buildDailyActions(recentActionsRows)
    };
  } catch (error) {
    console.error("[reports] Erreur inattendue lors du chargement des rapports", error);
    return emptyReportData();
  }
}
