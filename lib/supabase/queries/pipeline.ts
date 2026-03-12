import { createClient } from "@/lib/supabase/server";

export const pipelineStatuses = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
] as const;

export type PipelineStatus = (typeof pipelineStatuses)[number];

export const statusLabels: Record<PipelineStatus, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  interesse: "Intéressé",
  rdv_planifie: "RDV planifié",
  negociation: "Négociation",
  gagne: "Gagné",
  perdu: "Perdu",
  client_actif: "Client actif"
};

export type PipelineEvent = {
  id: string;
  type: string;
  text: string;
  at: string;
};

export type PipelineSalon = {
  id: string;
  name: string;
  city: string;
  department: string;
  status: PipelineStatus;
  score: number;
  googleRating: number | null;
  teamSize: number | null;
  assignedTo: string;
  assignedAvatar: string | null;
  assignedInitials: string;
  lastActivityAt: string;
  updatedAt: string;
  kanbanOrder: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  tags: string[];
  timeline: PipelineEvent[];
};

export type PipelineColumn = {
  id: PipelineStatus;
  title: string;
  salons: PipelineSalon[];
};

type SalonRow = {
  id: string;
  name: string | null;
  city: string | null;
  postal_code: string | null;
  status: string | null;
  score: number | null;
  google_rating: number | null;
  team_size: number | null;
  assigned_to: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  updated_at: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type PipelineHistoryRow = {
  id: string;
  salon_id: string | null;
  from_status: string | null;
  to_status: string | null;
  changed_by: string | null;
  created_at: string | null;
};

function emptyColumns(): PipelineColumn[] {
  return pipelineStatuses.map((status) => ({
    id: status,
    title: statusLabels[status],
    salons: []
  }));
}

function isPipelineStatus(value: string | null | undefined): value is PipelineStatus {
  return pipelineStatuses.includes(value as PipelineStatus);
}

function getDepartment(postalCode: string | null | undefined) {
  if (!postalCode) return "—";

  const cleaned = postalCode.replace(/\s+/g, "");
  if (cleaned.startsWith("97") || cleaned.startsWith("98")) {
    return cleaned.slice(0, 3) || "—";
  }

  return cleaned.slice(0, 2) || "—";
}

function getInitials(name: string | null | undefined) {
  if (!name) return "—";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "—";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "—";
}

function humanizeAssignee(value: string | null | undefined) {
  if (!value) return "Non assigné";

  return value
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildTags(salon: SalonRow) {
  const tags: string[] = [];

  if (typeof salon.google_rating === "number") {
    tags.push(`Google ${salon.google_rating.toFixed(1)}`);
  }

  if (typeof salon.team_size === "number" && salon.team_size > 0) {
    tags.push(`${salon.team_size} collaborateurs`);
  }

  if (salon.phone) {
    tags.push("Téléphone disponible");
  }

  if (salon.email) {
    tags.push("Email disponible");
  }

  return tags.slice(0, 3);
}

function buildTimeline(historyRows: PipelineHistoryRow[], updatedAt: string | null) {
  const entries = historyRows
    .filter((row) => row.created_at)
    .slice(0, 5)
    .map<PipelineEvent>((row) => {
      const fromLabel = isPipelineStatus(row.from_status)
        ? statusLabels[row.from_status]
        : row.from_status ?? "statut inconnu";
      const toLabel = isPipelineStatus(row.to_status)
        ? statusLabels[row.to_status]
        : row.to_status ?? "statut inconnu";

      return {
        id: row.id,
        type: "status_change",
        text:
          row.from_status && row.to_status
            ? `Passage de ${fromLabel} à ${toLabel}${row.changed_by ? ` par ${row.changed_by}` : ""}.`
            : row.to_status
              ? `Statut mis à jour vers ${toLabel}${row.changed_by ? ` par ${row.changed_by}` : ""}.`
              : "Historique pipeline enregistré.",
        at: row.created_at ?? new Date().toISOString()
      };
    });

  if (entries.length > 0) {
    return entries;
  }

  return [
    {
      id: `fallback-${updatedAt ?? "unknown"}`,
      type: "activity",
      text: "Aucun changement de pipeline enregistré pour le moment.",
      at: updatedAt ?? new Date().toISOString()
    }
  ];
}

export async function getPipelineData(): Promise<PipelineColumn[]> {
  const supabase = await createClient();

  try {
    const { data: salonsData, error: salonsError } = await supabase
      .from("salons")
      .select(
        "id, name, city, postal_code, status, score, google_rating, team_size, assigned_to, phone, email, website, updated_at"
      )
      .in("status", [...pipelineStatuses])
      .order("updated_at", { ascending: false })
      .limit(200);

    if (salonsError) {
      console.error("[pipeline] Impossible de charger les salons du pipeline", salonsError);
      return emptyColumns();
    }

    const salons = (salonsData ?? []) as SalonRow[];
    const salonIds = salons.map((salon) => salon.id);
    const assignedIds = Array.from(
      new Set(
        salons
          .map((salon) => salon.assigned_to)
          .filter((value): value is string => typeof value === "string" && value.length > 0)
      )
    );

    const [profilesResult, historyResult] = await Promise.all([
      assignedIds.length > 0
        ? supabase.from("profiles").select("id, full_name, avatar_url").in("id", assignedIds)
        : Promise.resolve({ data: [] as ProfileRow[], error: null }),
      salonIds.length > 0
        ? supabase
            .from("pipeline_history")
            .select("id, salon_id, from_status, to_status, changed_by, created_at")
            .in("salon_id", salonIds)
            .order("created_at", { ascending: false })
            .limit(500)
        : Promise.resolve({ data: [] as PipelineHistoryRow[], error: null })
    ]);

    if (profilesResult.error) {
      console.error("[pipeline] Impossible de charger les profils assignés", profilesResult.error);
    }

    if (historyResult.error) {
      console.error("[pipeline] Impossible de charger l'historique pipeline", historyResult.error);
    }

    const profileById = new Map(
      ((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile])
    );

    const historyBySalon = new Map<string, PipelineHistoryRow[]>();
    for (const entry of (historyResult.data ?? []) as PipelineHistoryRow[]) {
      if (!entry.salon_id) continue;
      const rows = historyBySalon.get(entry.salon_id) ?? [];
      rows.push(entry);
      historyBySalon.set(entry.salon_id, rows);
    }

    const salonsByStatus = new Map<PipelineStatus, PipelineSalon[]>(
      pipelineStatuses.map((status) => [status, []])
    );

    for (const salon of salons) {
      const status = isPipelineStatus(salon.status) ? salon.status : "nouveau";
      const profile = salon.assigned_to ? profileById.get(salon.assigned_to) : undefined;
      const assignedTo = profile?.full_name ?? humanizeAssignee(salon.assigned_to);

      const mappedSalon: PipelineSalon = {
        id: salon.id,
        name: salon.name ?? "Salon sans nom",
        city: salon.city ?? "Ville inconnue",
        department: getDepartment(salon.postal_code),
        status,
        score: Math.max(0, Math.min(100, Math.round(Number(salon.score ?? 0)))),
        googleRating:
          typeof salon.google_rating === "number" ? Number(salon.google_rating) : null,
        teamSize: typeof salon.team_size === "number" ? Number(salon.team_size) : null,
        assignedTo,
        assignedAvatar: profile?.avatar_url ?? null,
        assignedInitials: getInitials(assignedTo),
        lastActivityAt: salon.updated_at ?? new Date().toISOString(),
        updatedAt: salon.updated_at ?? new Date().toISOString(),
        kanbanOrder: 0,
        phone: salon.phone,
        email: salon.email,
        website: salon.website,
        tags: buildTags(salon),
        timeline: buildTimeline(historyBySalon.get(salon.id) ?? [], salon.updated_at)
      };

      salonsByStatus.set(status, [...(salonsByStatus.get(status) ?? []), mappedSalon]);
    }

    return pipelineStatuses.map((status) => {
      const salonsForStatus = (salonsByStatus.get(status) ?? []).map((salon, index) => ({
        ...salon,
        kanbanOrder: index + 1
      }));

      return {
        id: status,
        title: statusLabels[status],
        salons: salonsForStatus
      };
    });
  } catch (error) {
    console.error("[pipeline] Erreur inattendue lors du chargement du pipeline", error);
    return emptyColumns();
  }
}

export async function getPipelineHistory(salonId?: string, limit = 20) {
  const supabase = await createClient();

  try {
    let query = supabase
      .from("pipeline_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (salonId) {
      query = query.eq("salon_id", salonId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[pipeline] Impossible de charger l'historique pipeline", error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[pipeline] Erreur inattendue lors du chargement de l'historique", error);
    return [];
  }
}
