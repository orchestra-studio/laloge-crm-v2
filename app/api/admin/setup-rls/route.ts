import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * One-time endpoint to apply RLS policies via individual table queries.
 * This uses the PostgREST admin endpoint to verify access.
 * 
 * The actual SQL policies need to be applied in Supabase Dashboard SQL editor.
 * This endpoint generates the SQL and verifies current access state.
 * 
 * DELETE this file after use.
 * 
 * POST /api/admin/setup-rls?secret=laloge-setup-2026
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("secret") !== "laloge-setup-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tables = [
    "salons",
    "brands",
    "contacts",
    "agent_actions",
    "activity_log",
    "outreach",
    "outreach_sequences",
    "notifications",
    "brand_salon_scores",
    "scoring_rules",
    "pipeline_history",
    "approvals",
    "client_dossiers",
    "campaigns",
    "work_items",
    "agent_wakeup_requests",
  ] as const;

  const supabase = createAdminClient();
  const results: Record<string, number | string> = {};

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    results[table] = error ? `ERROR: ${error.message}` : (count ?? 0);
  }

  // Generate the SQL to run in Supabase Dashboard
  const sqlPolicies = tables
    .flatMap((table) => [
      `DROP POLICY IF EXISTS "authenticated_select_${table}" ON ${table};`,
      `CREATE POLICY "authenticated_select_${table}" ON ${table} FOR SELECT TO authenticated USING (true);`,
    ])
    .join("\n");

  return NextResponse.json({
    message: "Service role access verified. Run the SQL in Supabase Dashboard.",
    admin_access: results,
    sql_to_run: sqlPolicies,
  });
}
