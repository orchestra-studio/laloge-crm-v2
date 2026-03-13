import { createAdminClient } from "@/lib/supabase/admin";

export type DossierStatus = "brouillon" | "en_preparation" | "finalise" | "envoye";

export type DossierScoreBreakdownItem = {
  id: string;
  label: string;
  score: number;
  description: string;
};

export type DossierTimelineKind = "analyse" | "contact" | "revue" | "generation" | "envoi";
export type DossierTimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
  kind: DossierTimelineKind;
};

export type DossierContent = {
  title?: string;
  executive_summary?: string;
  brand_rationale?: string;
  strengths: string[];
  watchpoints: string[];
  score_breakdown: DossierScoreBreakdownItem[];
  recommended_terms: { title: string; detail: string }[];
  recommended_actions: {
    id: string;
    title: string;
    detail: string;
    owner: string;
    due_label: string;
    priority: "haute" | "moyenne" | "faible";
  }[];
  timeline: DossierTimelineEvent[];
  [key: string]: unknown;
};

export type DossierListItem = {
  id: string;
  salon_id: string;
  brand_id: string;
  status: DossierStatus;
  generated_at: string | null;
  created_at: string;
  salon_name: string;
  salon_city: string;
  brand_name: string;
  compatibility_score: number;
};

type DossierRow = {
  id: string;
  salon_id: string | null;
  brand_id: string | null;
  status: string | null;
  generated_at: string | null;
  created_at: string | null;
  compatibility_score: number | null;
  content: DossierContent | null;
};

type SalonRow = { id: string; name: string | null; city: string | null };
type BrandRow = { id: string; name: string | null };

function normalizeStatus(value: string | null | undefined): DossierStatus {
  const valid: DossierStatus[] = ["brouillon", "en_preparation", "finalise", "envoye"];
  if (valid.includes(value as DossierStatus)) return value as DossierStatus;
  return "brouillon";
}

export async function getDossiers(options?: {
  limit?: number;
  offset?: number;
  status?: DossierStatus;
}): Promise<{ dossiers: DossierListItem[]; total: number }> {
  const supabase = createAdminClient();

  let query = supabase
    .from("client_dossiers")
    .select("id, salon_id, brand_id, status, generated_at, created_at, compatibility_score, content", {
      count: "exact"
    })
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const limit = options?.limit ?? 200;
  const offset = options?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    console.error("[dossiers] Error fetching dossiers:", error);
    return { dossiers: [], total: 0 };
  }

  const rows = data as unknown as DossierRow[];

  const salonIds = Array.from(new Set(rows.map((r) => r.salon_id).filter((id): id is string => Boolean(id))));
  const brandIds = Array.from(new Set(rows.map((r) => r.brand_id).filter((id): id is string => Boolean(id))));

  const [salonsRes, brandsRes] = await Promise.all([
    salonIds.length > 0
      ? supabase.from("salons").select("id, name, city").in("id", salonIds)
      : Promise.resolve({ data: [] as SalonRow[], error: null }),
    brandIds.length > 0
      ? supabase.from("brands").select("id, name").in("id", brandIds)
      : Promise.resolve({ data: [] as BrandRow[], error: null })
  ]);

  const salonMap = new Map(
    ((salonsRes.data ?? []) as SalonRow[]).map((s) => [s.id, s])
  );
  const brandMap = new Map(
    ((brandsRes.data ?? []) as BrandRow[]).map((b) => [b.id, b])
  );

  const dossiers: DossierListItem[] = rows.map((row) => {
    const salon = row.salon_id ? salonMap.get(row.salon_id) : undefined;
    const brand = row.brand_id ? brandMap.get(row.brand_id) : undefined;
    const content = row.content;
    const contentTitle =
      typeof content?.title === "string" && content.title.trim().length > 0
        ? content.title.trim()
        : undefined;

    return {
      id: row.id,
      salon_id: row.salon_id ?? "",
      brand_id: row.brand_id ?? "",
      status: normalizeStatus(row.status),
      generated_at: row.generated_at ?? null,
      created_at: row.created_at ?? new Date(0).toISOString(),
      salon_name: contentTitle ?? salon?.name ?? "Salon inconnu",
      salon_city: salon?.city ?? "—",
      brand_name: brand?.name ?? "Marque inconnue",
      compatibility_score: Math.round(Number(row.compatibility_score ?? 0))
    };
  });

  return { dossiers, total: count ?? dossiers.length };
}

export type DossierDetail = DossierListItem & {
  content: DossierContent | null;
  salon_info: {
    address: string;
    postal_code: string;
    website: string;
    team_size: number;
    google_rating: number;
    review_count: number;
    specialties: string[];
    owner_name: string;
    salon_status: string;
  };
};

export async function getDossierById(id: string): Promise<DossierDetail | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("client_dossiers")
    .select("id, salon_id, brand_id, status, generated_at, created_at, compatibility_score, content")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("[dossiers] Error fetching dossier by id:", error);
    return null;
  }

  const row = data as unknown as DossierRow;

  const [salonRes, brandRes] = await Promise.all([
    row.salon_id
      ? supabase
          .from("salons")
          .select("id, name, city, address, postal_code, website, team_size, google_rating, google_reviews_count, owner_name, status, tags")
          .eq("id", row.salon_id)
          .single()
      : Promise.resolve({ data: null, error: null }),
    row.brand_id
      ? supabase.from("brands").select("id, name").eq("id", row.brand_id).single()
      : Promise.resolve({ data: null, error: null })
  ]);

  const salon = salonRes.data as Record<string, unknown> | null;
  const brand = brandRes.data as { id: string; name: string | null } | null;

  const content = row.content;
  const contentTitle =
    typeof content?.title === "string" && content.title.trim().length > 0
      ? content.title.trim()
      : undefined;

  const tagsRaw = salon?.tags;
  const specialties = Array.isArray(tagsRaw)
    ? tagsRaw.filter((t): t is string => typeof t === "string").slice(0, 5)
    : [];

  return {
    id: row.id,
    salon_id: row.salon_id ?? "",
    brand_id: row.brand_id ?? "",
    status: normalizeStatus(row.status),
    generated_at: row.generated_at ?? null,
    created_at: row.created_at ?? new Date(0).toISOString(),
    salon_name: contentTitle ?? (typeof salon?.name === "string" ? salon.name : "Salon inconnu"),
    salon_city: typeof salon?.city === "string" ? salon.city : "—",
    brand_name: brand?.name ?? "Marque inconnue",
    compatibility_score: Math.round(Number(row.compatibility_score ?? 0)),
    content: (content as DossierContent | null) ?? null,
    salon_info: {
      address: typeof salon?.address === "string" ? salon.address : "Adresse non renseignée",
      postal_code: typeof salon?.postal_code === "string" ? salon.postal_code : "—",
      website: typeof salon?.website === "string" ? salon.website : "",
      team_size: Math.round(Number(salon?.team_size ?? 0)),
      google_rating: Number(salon?.google_rating ?? 0),
      review_count: Math.round(Number(salon?.google_reviews_count ?? 0)),
      specialties,
      owner_name: typeof salon?.owner_name === "string" ? salon.owner_name : "Non renseigné",
      salon_status: typeof salon?.status === "string" ? salon.status : "nouveau"
    }
  };
}
