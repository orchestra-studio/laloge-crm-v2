import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { AgentOpsPage } from "./components/agent-ops-page";

export const dynamic = "force-dynamic";

export default async function ActionsPage() {
  const supabase = createAdminClient();

  const [actionsRes, activityRes] = await Promise.all([
    supabase
      .from("agent_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  // Fetch salon names for context
  const salonIds = Array.from(
    new Set(
      (actionsRes.data ?? [])
        .map((a: Record<string, unknown>) => a.target_id as string)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    )
  );

  const salonsRes =
    salonIds.length > 0
      ? await supabase.from("salons").select("id, name, city").in("id", salonIds)
      : { data: [] };

  const salonMap = new Map(
    ((salonsRes.data ?? []) as Array<{ id: string; name: string; city: string }>).map((s) => [
      s.id,
      { name: s.name, city: s.city },
    ])
  );

  return (
    <Suspense fallback={<div className="h-screen animate-pulse rounded-xl bg-muted/20" />}>
      <AgentOpsPage
        initialActions={(actionsRes.data ?? []) as Record<string, unknown>[]}
        activityLog={(activityRes.data ?? []) as Record<string, unknown>[]}
        salonMap={Object.fromEntries(salonMap)}
      />
    </Suspense>
  );
}
