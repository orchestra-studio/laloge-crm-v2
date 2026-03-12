import { createBrowserClient } from "@supabase/ssr";
import type { ApprovalRow } from "./types";

const FALLBACK_DATE = "1970-01-01T00:00:00.000Z";
const APPROVAL_LIMIT = 20;

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
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

function mapApproval(row: Record<string, unknown>): ApprovalRow {
  const payload = getRecord(row.payload) ?? getRecord(row.metadata);

  return {
    id: getString(row.id, getString(row.agent_action_id, "approval-inconnue")),
    agent_action_id: getNullableString(row.agent_action_id) ?? undefined,
    type: getNullableString(row.type) ?? undefined,
    title:
      getNullableString(row.title) ??
      (getNullableString(row.agent_action_id)
        ? `Validation ${getString(row.agent_action_id).slice(0, 8)}`
        : "Validation"),
    description: getNullableString(row.description) ?? getNullableString(row.comment) ?? undefined,
    requester_type: getNullableString(row.requester_type) ?? undefined,
    requester_name: getNullableString(row.requester_name) ?? undefined,
    requested_by: getNullableString(row.requested_by) ?? undefined,
    status: getString(row.status, "pending"),
    payload,
    reviewed_by: getNullableString(row.reviewed_by),
    reviewed_at: getNullableString(row.reviewed_at),
    reviewed_by_name: getNullableString(row.reviewed_by_name),
    reviewer_id: getNullableString(row.reviewer_id),
    reviewer_name: getNullableString(row.reviewer_name),
    review_comment: getNullableString(row.review_comment) ?? getNullableString(row.comment),
    expires_at: getNullableString(row.expires_at),
    executed: getBoolean(row.executed, false),
    executed_at: getNullableString(row.executed_at),
    execution_result: getRecord(row.execution_result),
    created_at: getString(row.created_at, FALLBACK_DATE),
    updated_at: getString(row.updated_at ?? row.created_at, FALLBACK_DATE)
  };
}

async function loadApprovals(): Promise<ApprovalRow[]> {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("approvals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(APPROVAL_LIMIT);

    if (error) {
      console.error("[crm/data/approvals] query failed:", error.message);
      return [];
    }

    return ((data ?? []) as Array<Record<string, unknown>>).map((row) => mapApproval(row));
  } catch (error) {
    console.error("[crm/data/approvals] unexpected failure:", error);
    return [];
  }
}

export const mockApprovals: ApprovalRow[] = await loadApprovals();
