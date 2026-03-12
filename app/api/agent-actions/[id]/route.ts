import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { action, reason, approvedBy } = body as {
    action: "approve" | "reject";
    reason?: string;
    approvedBy?: string;
  };

  if (!action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action must be approve or reject" }, { status: 400 });
  }

  if (action === "reject" && (!reason || reason.trim().length < 3)) {
    return NextResponse.json({ error: "reason required for reject" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const update =
    action === "approve"
      ? {
          status: "approved",
          approved_by: approvedBy ?? "Bonnie",
          approved_at: now,
          rejected_reason: null,
          updated_at: now
        }
      : {
          status: "rejected",
          approved_by: null,
          approved_at: null,
          rejected_reason: reason!.trim(),
          updated_at: now
        };

  const { data, error } = await supabase
    .from("agent_actions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[agent-actions PATCH]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
