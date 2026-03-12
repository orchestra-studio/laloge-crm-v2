import type {
  Brand,
  BrandCriterion,
  BrandSalon,
  BrandStats,
  ProposalSuccessPoint,
  SalonStatus,
  TopSalonPoint
} from "@/app/dashboard/(auth)/brands/components/types";
import { createClient } from "@/lib/supabase/server";

type JsonRecord = Record<string, unknown>;

interface BrandRow {
  id: string;
  name: string | null;
  logo_url: string | null;
  website: string | null;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  category: string | null;
  is_active: boolean | null;
  metadata: JsonRecord | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface BrandSalonRelation {
  id: string | null;
  name: string | null;
  city: string | null;
  postal_code: string | null;
  score: number | null;
  status: string | null;
  google_rating?: number | null;
  team_size?: number | null;
  phone?: string | null;
  email?: string | null;
}

interface BrandSalonScoreRow {
  id: string;
  brand_id: string;
  salon_id: string;
  compatibility_score: number | null;
  criteria_breakdown?: JsonRecord | null;
  last_calculated_at?: string | null;
  salons?: BrandSalonRelation | BrandSalonRelation[] | null;
}

const EMPTY_PROPOSAL_SERIES = buildProposalSeries();

const CRITERION_LABELS: Record<string, string> = {
  france_presence: "Présence en France",
  has_instagram: "Présence Instagram",
  has_website: "Site web actif",
  min_google_rating: "Note Google minimum",
  min_google_reviews: "Avis Google minimum",
  min_revenue_eur: "Chiffre d'affaires minimum",
  min_score: "Score minimum",
  min_team_size: "Équipe minimum",
  min_years_operating: "Ancienneté minimum",
  parent_company: "Groupe parent",
  positionning: "Positionnement",
  positioning: "Positionnement",
  preferred_regions: "Régions prioritaires",
  premium_positioning: "Positionnement premium",
  product_lines: "Lignes de produits",
  selection_criteria: "Critères de sélection",
  sources: "Sources",
  target_salons: "Salons ciblés",
  valued_specialties: "Spécialités valorisées",
  website: "Site web"
};

const BRAND_CATEGORY_LABELS: Record<string, string> = {
  coloration: "Coloration",
  distribution: "Distribution",
  franchise: "Franchise",
  independant: "Indépendante",
  independent: "Indépendante",
  professional: "Professionnelle",
  wellness: "Bien-être"
};

const SALON_STATUSES: SalonStatus[] = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
];

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();

  const [brandsResponse, scoresResponse] = await Promise.all([
    supabase.from("brands").select("*").order("name"),
    supabase
      .from("brand_salon_scores")
      .select("id, brand_id, salon_id, compatibility_score")
      .order("compatibility_score", { ascending: false })
  ]);

  if (brandsResponse.error) {
    console.error("Error fetching brands:", brandsResponse.error);
    return [];
  }

  if (scoresResponse.error) {
    console.error("Error fetching brand scores:", scoresResponse.error);
  }

  const scoresByBrandId = new Map<string, BrandSalonScoreRow[]>();

  for (const row of (scoresResponse.data as BrandSalonScoreRow[] | null) ?? []) {
    const current = scoresByBrandId.get(row.brand_id) ?? [];
    current.push(row);
    scoresByBrandId.set(row.brand_id, current);
  }

  return ((brandsResponse.data as BrandRow[] | null) ?? []).map((brand) =>
    mapBrandRowToBrand(brand, mapBrandSalons(scoresByBrandId.get(brand.id) ?? []))
  );
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = await createClient();

  const [brandResponse, matchesResponse] = await Promise.all([
    supabase.from("brands").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("brand_salon_scores")
      .select(
        "id, brand_id, salon_id, compatibility_score, criteria_breakdown, last_calculated_at, salons:salon_id(id, name, city, postal_code, score, status, google_rating, team_size, phone, email)"
      )
      .eq("brand_id", id)
      .order("compatibility_score", { ascending: false })
  ]);

  if (brandResponse.error) {
    console.error("Error fetching brand:", brandResponse.error);
    return null;
  }

  if (matchesResponse.error) {
    console.error("Error fetching brand salon matches:", matchesResponse.error);
  }

  if (!brandResponse.data) {
    return null;
  }

  const salons = mapBrandSalons((matchesResponse.data as BrandSalonScoreRow[] | null) ?? []);

  return mapBrandRowToBrand(brandResponse.data as BrandRow, salons);
}

export async function getBrandSalonMatches(brandId: string, limit = 20): Promise<BrandSalon[]> {
  const supabase = await createClient();

  let query = supabase
    .from("brand_salon_scores")
    .select(
      "id, brand_id, salon_id, compatibility_score, criteria_breakdown, last_calculated_at, salons:salon_id(id, name, city, postal_code, score, status, google_rating, team_size, phone, email)"
    )
    .eq("brand_id", brandId)
    .order("compatibility_score", { ascending: false });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching brand salon matches:", error);
    return [];
  }

  return mapBrandSalons((data as BrandSalonScoreRow[] | null) ?? []);
}

function mapBrandRowToBrand(row: BrandRow, salons: BrandSalon[]): Brand {
  const metadata = toRecord(row.metadata);
  const criteria = extractCriteria(metadata);
  const criteriaTable = buildCriteriaTable(criteria);
  const stats = buildBrandStats(salons);
  const qualifiedSalons = salons.filter((salon) => salon.compatibility_score >= 50);
  const averageBase = qualifiedSalons.length > 0 ? qualifiedSalons : salons;
  const averageCompatibility =
    averageBase.length > 0
      ? Math.round(
          averageBase.reduce((total, salon) => total + salon.compatibility_score, 0) /
            averageBase.length
        )
      : 0;

  return {
    id: row.id,
    name: asNonEmptyString(row.name, "Marque sans nom"),
    category: formatBrandCategory(row.category),
    logo_url: asNonEmptyString(row.logo_url),
    website: asNonEmptyString(
      row.website,
      asNonEmptyString(metadata.website, "#")
    ),
    description: asNonEmptyString(
      row.description,
      "Description indisponible pour cette marque."
    ),
    contact_name: asNonEmptyString(row.contact_name, "Contact non renseigné"),
    contact_email: asNonEmptyString(row.contact_email, "Non renseigné"),
    contact_phone: asNonEmptyString(row.contact_phone, "Non renseigné"),
    is_active: Boolean(row.is_active),
    compatible_salon_count: qualifiedSalons.length,
    average_compatibility: averageCompatibility,
    total_proposals: 0,
    acceptance_rate: 0,
    metadata: {
      criteria,
      criteria_table: criteriaTable
    },
    salons,
    proposals: [],
    auctions: [],
    stats
  };
}

function mapBrandSalons(rows: BrandSalonScoreRow[]): BrandSalon[] {
  return rows
    .map((row) => {
      const salon = unwrapRelation<BrandSalonRelation>(row.salons);

      if (!salon?.id) {
        return null;
      }

      return {
        id: salon.id,
        name: asNonEmptyString(salon.name, "Salon sans nom"),
        city: asNonEmptyString(salon.city, "Ville inconnue"),
        department: getDepartmentCode(salon.postal_code),
        status: normalizeSalonStatus(salon.status),
        salon_score: asNumber(salon.score),
        compatibility_score: asNumber(row.compatibility_score)
      } satisfies BrandSalon;
    })
    .filter((salon): salon is BrandSalon => salon !== null);
}

function buildBrandStats(salons: BrandSalon[]): BrandStats {
  const scores = salons.map((salon) => salon.compatibility_score);
  const sortedSalons = [...salons].sort(
    (left, right) => right.compatibility_score - left.compatibility_score
  );

  return {
    thresholds: {
      gt50: scores.filter((score) => score > 50).length,
      gt70: scores.filter((score) => score > 70).length,
      gt90: scores.filter((score) => score > 90).length
    },
    compatibility_distribution: [
      { bucket: "0-50", count: scores.filter((score) => score <= 50).length },
      {
        bucket: "51-70",
        count: scores.filter((score) => score >= 51 && score <= 70).length
      },
      {
        bucket: "71-85",
        count: scores.filter((score) => score >= 71 && score <= 85).length
      },
      {
        bucket: "86-100",
        count: scores.filter((score) => score >= 86 && score <= 100).length
      }
    ],
    proposal_success: EMPTY_PROPOSAL_SERIES,
    top_salons: sortedSalons.slice(0, 5).map(
      (salon) =>
        ({
          name: salon.name,
          city: salon.city,
          compatibility_score: salon.compatibility_score
        }) satisfies TopSalonPoint
    )
  };
}

function buildCriteriaTable(criteria: Record<string, string | number | boolean>): BrandCriterion[] {
  const entries = Object.entries(criteria);

  if (entries.length === 0) {
    return [];
  }

  const weight = Math.max(5, Math.round(100 / entries.length));

  return entries.map(([key, value]) => ({
    criterion: labelCriterion(key),
    operator: getCriterionOperator(key, value),
    value,
    weight
  }));
}

function extractCriteria(metadata: JsonRecord): Record<string, string | number | boolean> {
  const scoringCriteria = toRecord(metadata.scoring_criteria);
  const selectionCriteria = toRecord(metadata.selection_criteria);
  const metadataCriteria = toRecord(metadata.criteria);

  const source =
    Object.keys(scoringCriteria).length > 0
      ? scoringCriteria
      : Object.keys(selectionCriteria).length > 0
        ? selectionCriteria
        : Object.keys(metadataCriteria).length > 0
          ? metadataCriteria
          : metadata;

  return Object.fromEntries(
    Object.entries(source)
      .filter(([key]) => key !== "scoring_criteria" && key !== "selection_criteria")
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, stringifyCriterionValue(value)])
  );
}

function stringifyCriterionValue(value: unknown): string | number | boolean {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyDisplayValue(item)).join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return "";
}

function stringifyDisplayValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return "";
}

function labelCriterion(key: string): string {
  if (CRITERION_LABELS[key]) {
    return CRITERION_LABELS[key];
  }

  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getCriterionOperator(
  key: string,
  value: string | number | boolean
): BrandCriterion["operator"] {
  if (key.startsWith("min_")) {
    return ">=";
  }

  if (key.startsWith("max_")) {
    return "<=";
  }

  if (typeof value === "string" && value.includes(",")) {
    return "inclut";
  }

  return "=";
}

function formatBrandCategory(category: string | null): string {
  if (!category) {
    return "Catégorie non renseignée";
  }

  return (
    BRAND_CATEGORY_LABELS[category.toLowerCase()] ??
    category.replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

function normalizeSalonStatus(status: string | null): SalonStatus {
  return SALON_STATUSES.includes(status as SalonStatus)
    ? (status as SalonStatus)
    : "nouveau";
}

function getDepartmentCode(postalCode: string | null): string {
  if (!postalCode) {
    return "—";
  }

  return postalCode.slice(0, 2) || "—";
}

function buildProposalSeries(): ProposalSuccessPoint[] {
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = formatter
      .format(date)
      .replace(".", "")
      .replace(/\b\w/g, (character) => character.toUpperCase());

    return {
      month,
      proposed: 0,
      accepted: 0
    } satisfies ProposalSuccessPoint;
  });
}

function unwrapRelation<T>(relation: T | T[] | null | undefined): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

function toRecord(value: unknown): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as JsonRecord;
}

function asNonEmptyString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
