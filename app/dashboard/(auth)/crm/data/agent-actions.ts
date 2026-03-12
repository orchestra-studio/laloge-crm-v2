import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { AgentActionRow } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const FALLBACK_DATE = "1970-01-01T00:00:00.000Z";
const AGENT_ACTION_LIMIT = 50;

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function humanizeToken(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAgentName(agentId: string | null | undefined) {
  switch (agentId) {
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
      return agentId ? humanizeToken(agentId) : "Agent IA";
  }
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
    console.error("[crm/data/agent-actions] unable to create server supabase client:", error);
    return null;
  }
}

async function loadSalonNamesById(supabase: any, salonIds: string[]) {
  if (!salonIds.length) {
    return {} as Record<string, string>;
  }

  const { data, error } = await supabase.from("salons").select("id, name").in("id", salonIds);

  if (error) {
    console.error("[crm/data/agent-actions] salon name lookup failed:", error.message);
    return {} as Record<string, string>;
  }

  return Object.fromEntries(
    (data ?? []).map((row: Record<string, unknown>) => [getString(row.id), getString(row.name, "Salon")])
  ) as Record<string, string>;
}

function getEntityName(
  row: Record<string, unknown>,
  payload: Record<string, unknown> | null,
  salonNamesById: Record<string, string>
) {
  const targetId = getString(row.target_id);

  return (
    getNullableString(payload?.salon_name) ??
    getNullableString(payload?.brand_name) ??
    salonNamesById[targetId] ??
    (targetId ? `Salon ${targetId.slice(0, 8)}` : null)
  );
}

function getApprovalReason(payload: Record<string, unknown> | null) {
  return (
    getNullableString(payload?.reasoning) ??
    getNullableString(payload?.description) ??
    getNullableString(payload?.next_step) ??
    null
  );
}

function mapAgentAction(
  row: Record<string, unknown>,
  salonNamesById: Record<string, string>
): AgentActionRow {
  const payload = getRecord(row.payload);

  return {
    id: getString(row.id, getString(row.target_id, "agent-action-inconnue")),
    agent_name: formatAgentName(getNullableString(row.agent_id)),
    agent_id: getNullableString(row.agent_id) ?? undefined,
    agent_world_run_id: getNullableString(row.agent_world_run_id),
    action_type: getString(row.action_type, "draft_email"),
    entity_id: getNullableString(row.target_id) ?? undefined,
    entity_type: getNullableString(row.target_type) ?? undefined,
    entity_name: getEntityName(row, payload, salonNamesById),
    target_id: getNullableString(row.target_id) ?? undefined,
    target_type: getNullableString(row.target_type) ?? undefined,
    status: getString(row.status, "pending"),
    approval_reason: getApprovalReason(payload),
    payload,
    priority: getNumber(row.priority),
    approved_by: getNullableString(row.approved_by),
    approved_at: getNullableString(row.approved_at),
    rejected_reason: getNullableString(row.rejected_reason),
    created_at: getString(row.created_at, FALLBACK_DATE),
    updated_at: getString(row.updated_at, FALLBACK_DATE)
  };
}

async function loadAgentActions(): Promise<AgentActionRow[]> {
  try {
    const supabase = await getSupabaseClient();

    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("agent_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(AGENT_ACTION_LIMIT);

    if (error) {
      console.error("[crm/data/agent-actions] query failed:", error.message);
      return [];
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const salonIds = Array.from(
      new Set(rows.map((row) => getString(row.target_id)).filter(Boolean))
    );
    const salonNamesById = await loadSalonNamesById(supabase, salonIds);

    return rows.map((row) => mapAgentAction(row, salonNamesById));
  } catch (error) {
    console.error("[crm/data/agent-actions] unexpected failure:", error);
    return [];
  }
}

export const mockAgentActions: AgentActionRow[] = await loadAgentActions();
