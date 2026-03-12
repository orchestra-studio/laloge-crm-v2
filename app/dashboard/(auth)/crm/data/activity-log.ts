import { createBrowserClient } from "@supabase/ssr";
import type { ActivityLogRow } from "./types";

const FALLBACK_DATE = "1970-01-01T00:00:00.000Z";
const ACTIVITY_LOG_LIMIT = 25;

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function humanizeToken(value: string) {
  return value
    .split(/[-_\.\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAgentName(actorName: string) {
  switch (actorName) {
    case "datascout":
    case "datascout-2026":
      return "DataScout";
    case "enrichbot":
      return "EnrichBot";
    case "scoremaster":
      return "ScoreMaster";
    case "outreachpilot":
      return "OutreachPilot";
    case "qualityguard":
      return "QualityGuard";
    case "brandmatcher":
      return "BrandMatcher";
    case "contactbuilder":
      return "ContactBuilder";
    default:
      return humanizeToken(actorName);
  }
}

function formatActorName(actorType: unknown, actorName: unknown) {
  const rawName = getString(actorName, "Système");

  if (actorType === "agent") {
    return formatAgentName(rawName);
  }

  return humanizeToken(rawName);
}

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function loadSalonNamesById(supabase: any, salonIds: string[]) {
  if (!salonIds.length) {
    return {} as Record<string, string>;
  }

  const { data, error } = await supabase.from("salons").select("id, name").in("id", salonIds);

  if (error) {
    console.error("[crm/data/activity-log] salon name lookup failed:", error.message);
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    (data ?? []).map((row: Record<string, unknown>) => [getString(row.id), getString(row.name, "Salon")])
  ) as Record<string, string>;
}

async function loadAgentActionNamesById(supabase: any, agentActionIds: string[]) {
  if (!agentActionIds.length) {
    return {} as Record<string, string>;
  }

  const { data, error } = await supabase
    .from("agent_actions")
    .select("id, payload, action_type")
    .in("id", agentActionIds);

  if (error) {
    console.error("[crm/data/activity-log] agent action lookup failed:", error.message);
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    (data ?? []).map((row: Record<string, unknown>) => {
      const payload = getRecord(row.payload);
      const entityName =
        getNullableString(payload?.salon_name) ??
        getNullableString(payload?.brand_name) ??
        humanizeToken(getString(row.action_type, "action"));

      return [getString(row.id), entityName];
    })
  ) as Record<string, string>;
}

function extractEntityName(
  row: Record<string, unknown>,
  salonNamesById: Record<string, string>,
  agentActionNamesById: Record<string, string>
) {
  const entityType = getString(row.entity_type);
  const entityId = getString(row.entity_id);
  const metadata = getRecord(row.metadata);
  const newValue = getRecord(row.new_value);

  if (entityType === "salon") {
    return (
      salonNamesById[entityId] ??
      getNullableString(newValue?.name) ??
      getNullableString(newValue?.salon_name) ??
      getNullableString(metadata?.salon_name) ??
      null
    );
  }

  if (entityType === "agent_action") {
    return (
      agentActionNamesById[entityId] ??
      getNullableString(newValue?.subject) ??
      getNullableString(metadata?.subject) ??
      humanizeToken(getString(row.action, "action"))
    );
  }

  if (entityType === "approval") {
    return getNullableString(metadata?.approval_type) ?? getNullableString(newValue?.status) ?? "Approval";
  }

  if (entityType === "outreach") {
    return getNullableString(metadata?.subject) ?? getNullableString(newValue?.subject) ?? "Outreach";
  }

  return getNullableString(newValue?.name) ?? null;
}

function mapActivityLog(
  row: Record<string, unknown>,
  salonNamesById: Record<string, string>,
  agentActionNamesById: Record<string, string>
): ActivityLogRow {
  return {
    id: getString(row.id, `${getString(row.entity_id, "activity")}:${getString(row.action, "unknown")}`),
    actor_name: formatActorName(row.actor_type, row.actor_name),
    actor_type: getString(row.actor_type, "system"),
    action: getString(row.action, "activity.unknown"),
    entity_id: getString(row.entity_id),
    entity_type: getString(row.entity_type, "salon"),
    entity_name: extractEntityName(row, salonNamesById, agentActionNamesById),
    old_value: getRecord(row.old_value),
    new_value: getRecord(row.new_value),
    metadata: getRecord(row.metadata),
    created_at: getString(row.created_at, FALLBACK_DATE)
  };
}

async function loadActivityLog(): Promise<ActivityLogRow[]> {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LOG_LIMIT);

    if (error) {
      console.error("[crm/data/activity-log] query failed:", error.message);
      return [];
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const salonIds = Array.from(
      new Set(
        rows
          .filter((row) => getString(row.entity_type) === "salon")
          .map((row) => getString(row.entity_id))
          .filter(Boolean)
      )
    );
    const agentActionIds = Array.from(
      new Set(
        rows
          .filter((row) => getString(row.entity_type) === "agent_action")
          .map((row) => getString(row.entity_id))
          .filter(Boolean)
      )
    );

    const [salonNamesById, agentActionNamesById] = await Promise.all([
      loadSalonNamesById(supabase, salonIds),
      loadAgentActionNamesById(supabase, agentActionIds)
    ]);

    return rows.map((row) => mapActivityLog(row, salonNamesById, agentActionNamesById));
  } catch (error) {
    console.error("[crm/data/activity-log] unexpected failure:", error);
    return [];
  }
}

export const mockActivityLog: ActivityLogRow[] = await loadActivityLog();
