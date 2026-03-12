import { createBrowserClient } from "@supabase/ssr";
import type { EnrichmentStatus, SalonRow, SalonStatus } from "./types";

const FALLBACK_DATE = "1970-01-01T00:00:00.000Z";
const DASHBOARD_SALON_LIMIT = 24;

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

function isSalonStatus(value: unknown): value is SalonStatus {
  return (
    value === "nouveau" ||
    value === "contacte" ||
    value === "interesse" ||
    value === "rdv_planifie" ||
    value === "negociation" ||
    value === "gagne" ||
    value === "perdu" ||
    value === "client_actif"
  );
}

function isEnrichmentStatus(value: unknown): value is EnrichmentStatus {
  return value === "pending" || value === "enriched" || value === "failed" || value === "complete";
}

function getString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
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

function mapSalon(row: Record<string, unknown>): SalonRow {
  return {
    id: getString(row.id, getString(row.name, "salon-inconnu")),
    name: getString(row.name, "Salon sans nom"),
    city: getString(row.city, "—"),
    postal_code: getNullableString(row.postal_code),
    department: getNullableString(row.department),
    region: getNullableString(row.region),
    address: getNullableString(row.address),
    phone: getNullableString(row.phone),
    email: getNullableString(row.email),
    website: getNullableString(row.website),
    instagram: getNullableString(row.instagram),
    instagram_followers: getNumber(row.instagram_followers),
    facebook: getNullableString(row.facebook),
    planity_url: getNullableString(row.planity_url),
    google_place_id: getNullableString(row.google_place_id),
    status: isSalonStatus(row.status) ? row.status : "nouveau",
    score: getNumber(row.score),
    google_rating: getNumber(row.google_rating),
    google_reviews_count: getNumber(row.google_reviews_count),
    siret: getNullableString(row.siret),
    naf_code: getNullableString(row.naf_code),
    legal_form: getNullableString(row.legal_form),
    owner_name: getNullableString(row.owner_name),
    team_size: getNumber(row.team_size),
    notes: getNullableString(row.notes),
    source: getNullableString(row.source),
    enrichment_status: isEnrichmentStatus(row.enrichment_status)
      ? row.enrichment_status
      : "pending",
    last_enriched_at: getNullableString(row.last_enriched_at),
    converted_at: getNullableString(row.converted_at),
    tags: getStringArray(row.tags),
    metadata: getRecord(row.metadata),
    assigned_to: getNullableString(row.assigned_to),
    created_at: getString(row.created_at, FALLBACK_DATE),
    updated_at: getString(row.updated_at, FALLBACK_DATE),
    deleted_at: getNullableString(row.deleted_at)
  };
}

async function loadSalons(): Promise<SalonRow[]> {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from("salons")
      .select(DASHBOARD_SALON_SELECT)
      .order("score", { ascending: false })
      .limit(DASHBOARD_SALON_LIMIT);

    if (error) {
      console.error("[crm/data/salons] query failed:", error.message);
      return [];
    }

    return (data ?? []).map((row: Record<string, unknown>) => mapSalon(row));
  } catch (error) {
    console.error("[crm/data/salons] unexpected failure:", error);
    return [];
  }
}

export const mockSalons: SalonRow[] = await loadSalons();
