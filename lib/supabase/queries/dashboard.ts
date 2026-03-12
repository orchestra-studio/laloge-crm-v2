import { createClient } from "@/lib/supabase/server";

const DASHBOARD_SALON_STATUSES = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
] as const;

const DASHBOARD_SALON_SELECT = `
  id,
  name,
  address,
  city,
  postal_code,
  department,
  region,
  phone,
  email,
  website,
  instagram,
  instagram_followers,
  facebook,
  planity_url,
  google_place_id,
  google_rating,
  google_reviews_count,
  siret,
  naf_code,
  legal_form,
  owner_name,
  team_size,
  status,
  score,
  notes,
  assigned_to,
  source,
  enrichment_status,
  last_enriched_at,
  converted_at,
  tags,
  metadata,
  created_at,
  updated_at,
  deleted_at
`;

function getSafeCount(result: { count: number | null; error: { message: string } | null }) {
  if (result.error) {
    console.error("[dashboard queries] count error:", result.error.message);
    return 0;
  }

  return result.count ?? 0;
}

export async function getDashboardStats() {
  try {
    const supabase = await createClient();

    const [
      salonsRes,
      enrichedRes,
      highScoreRes,
      contactedRes,
      brandsRes,
      actionsRes,
      outreachRes
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
      supabase.from("outreach").select("id", { count: "exact", head: true })
    ]);

    return {
      totalSalons: getSafeCount(salonsRes),
      enrichedSalons: getSafeCount(enrichedRes),
      highScoreSalons: getSafeCount(highScoreRes),
      contactedSalons: getSafeCount(contactedRes),
      activeBrands: getSafeCount(brandsRes),
      pendingActions: getSafeCount(actionsRes),
      totalOutreach: getSafeCount(outreachRes)
    };
  } catch (error) {
    console.error("[dashboard queries] getDashboardStats failed:", error);

    return {
      totalSalons: 0,
      enrichedSalons: 0,
      highScoreSalons: 0,
      contactedSalons: 0,
      activeBrands: 0,
      pendingActions: 0,
      totalOutreach: 0
    };
  }
}

export async function getRecentActivity(limit = 10) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getRecentActivity failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getRecentActivity crashed:", error);
    return [];
  }
}

export async function getRecentAgentActions(limit = 10) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getRecentAgentActions failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getRecentAgentActions crashed:", error);
    return [];
  }
}

export async function getPendingApprovals(limit = 20) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_actions")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getPendingApprovals failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getPendingApprovals crashed:", error);
    return [];
  }
}

export async function getSalonsByStatus() {
  try {
    const supabase = await createClient();

    const results = await Promise.all(
      DASHBOARD_SALON_STATUSES.map((status) =>
        supabase.from("salons").select("id", { count: "exact", head: true }).eq("status", status)
      )
    );

    return DASHBOARD_SALON_STATUSES.map((status, index) => ({
      status,
      count: getSafeCount(results[index])
    }));
  } catch (error) {
    console.error("[dashboard queries] getSalonsByStatus crashed:", error);

    return DASHBOARD_SALON_STATUSES.map((status) => ({
      status,
      count: 0
    }));
  }
}

export async function getTopSalons(limit = 5) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("salons")
      .select("id, name, city, score, status, google_rating, team_size")
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getTopSalons failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getTopSalons crashed:", error);
    return [];
  }
}

export async function getDashboardSalons(limit = 12) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("salons")
      .select(DASHBOARD_SALON_SELECT)
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getDashboardSalons failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getDashboardSalons crashed:", error);
    return [];
  }
}

export async function getProfiles(limit = 25) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, avatar_url, created_at, updated_at")
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("[dashboard queries] getProfiles failed:", error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error("[dashboard queries] getProfiles crashed:", error);
    return [];
  }
}

export async function getAverageSalonScore() {
  try {
    const supabase = await createClient();
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
        console.error("[dashboard queries] getAverageSalonScore failed:", error.message);
        return 0;
      }

      if (!data?.length) {
        break;
      }

      for (const row of data) {
        if (typeof row.score === "number") {
          total += row.score;
          count += 1;
        }
      }

      if (data.length < pageSize) {
        break;
      }

      from += pageSize;
    }

    return count ? total / count : 0;
  } catch (error) {
    console.error("[dashboard queries] getAverageSalonScore crashed:", error);
    return 0;
  }
}
