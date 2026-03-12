import {
  salonSchema,
  salonStatusValues,
  type EnrichmentStatus,
  type Salon,
  type SalonStatus
} from "@/app/dashboard/(auth)/salons/data/schema";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 2000;
const DEFAULT_SORT_BY = "created_at";
const FALLBACK_DATE = new Date(0).toISOString();
const ENRICHED_SOURCE_VALUES = new Set(["complete", "partial", "enriched"]);
const VALID_SORT_COLUMNS = new Set([
  "created_at",
  "updated_at",
  "score",
  "name",
  "city",
  "status",
  "google_rating",
  "google_reviews_count"
]);

const criterionLabels: Record<string, string> = {
  geographic_fit: "Zone géographique",
  google_rating: "Note Google",
  google_reviews: "Avis Google",
  has_facebook: "Facebook",
  has_instagram: "Instagram",
  has_planity: "Planity",
  has_website: "Site web",
  min_google_rating: "Note Google",
  min_google_reviews: "Avis Google",
  min_team_size: "Taille d'équipe",
  product_compatibility: "Compatibilité produit",
  recent_opening: "Ouverture récente",
  team_experience: "Expérience équipe",
  team_size: "Taille d'équipe",
  website_quality: "Qualité du site web"
};

const statusLabels: Record<SalonStatus, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  interesse: "Intéressé",
  rdv_planifie: "RDV planifié",
  negociation: "Négociation",
  gagne: "Gagné",
  perdu: "Perdu",
  client_actif: "Client actif"
};

type JsonRecord = Record<string, unknown>;

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

interface MapSalonOptions {
  profileMap?: Map<string, ProfileRow>;
  contacts?: JsonRecord[];
  brandScores?: JsonRecord[];
  brandMap?: Map<string, string>;
  outreach?: JsonRecord[];
  activity?: JsonRecord[];
  pipelineHistory?: JsonRecord[];
  dossiers?: JsonRecord[];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function asNullableString(value: unknown): string | null {
  const normalized = asString(value);
  return normalized.length > 0 ? normalized : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function asId(value: unknown, prefix = "tmp"): string {
  return asString(value) || `${prefix}-${crypto.randomUUID()}`;
}

function toInitials(value: string): string {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "—";

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function ensureAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value.replace(/^\/\//, "")}`;
}

function normalizeWebsite(value: unknown): string | null {
  const website = asNullableString(value);
  if (!website) return null;
  return ensureAbsoluteUrl(website);
}

function normalizeInstagram(value: unknown): string | null {
  const instagram = asNullableString(value);
  if (!instagram) return null;

  if (instagram.startsWith("@")) {
    return `https://www.instagram.com/${instagram.slice(1)}`;
  }

  if (instagram.includes("instagram.com")) {
    return ensureAbsoluteUrl(instagram);
  }

  return `https://www.instagram.com/${instagram.replace(/^@/, "")}`;
}

function normalizeFacebook(value: unknown): string | null {
  const facebook = asNullableString(value);
  if (!facebook) return null;
  return ensureAbsoluteUrl(facebook);
}

function normalizePlanity(value: unknown, website?: string | null): string | null {
  const direct = asNullableString(value);
  if (direct) return ensureAbsoluteUrl(direct);

  if (website?.includes("planity.")) return website;
  return null;
}

function buildGoogleMapsUrl(record: JsonRecord): string {
  const googlePlaceId = asNullableString(record.google_place_id);

  if (googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(googlePlaceId)}`;
  }

  const query = [record.name, record.address, record.postal_code, record.city]
    .map((value) => asNullableString(value))
    .filter((value): value is string => Boolean(value))
    .join(" ");

  if (query.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return "https://www.google.com/maps";
}

function normalizeStatus(value: unknown): SalonStatus {
  const status = asString(value);
  return salonStatusValues.includes(status as SalonStatus) ? (status as SalonStatus) : "nouveau";
}

function normalizeEnrichmentStatus(value: unknown): EnrichmentStatus {
  const status = asString(value).toLowerCase();

  if (status === "failed") return "failed";
  if (ENRICHED_SOURCE_VALUES.has(status)) return "enriched";

  return "pending";
}

function labelForCriterion(key: string): string {
  return criterionLabels[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelForStatus(status: unknown): string {
  return statusLabels[normalizeStatus(status)];
}

function buildAssignedProfile(
  value: unknown,
  profileMap: Map<string, ProfileRow> = new Map()
): Salon["assigned_to"] {
  if (!value) return null;

  if (isRecord(value)) {
    const id = asString(value.id);
    const fullName = asString(value.full_name, asString(value.name, "Assignation en cours"));

    return {
      id: id || fullName || "assigned",
      full_name: fullName || "Assignation en cours",
      avatar: asNullableString(value.avatar) ?? asNullableString(value.avatar_url),
      initials: toInitials(fullName || "Assignation")
    };
  }

  const profileId = asString(value);
  if (!profileId) return null;

  const profile = profileMap.get(profileId);
  const fullName = profile?.full_name?.trim() || "Assignation en cours";

  return {
    id: profileId,
    full_name: fullName,
    avatar: profile?.avatar_url ?? null,
    initials: toInitials(fullName)
  };
}

function buildScoreBreakdown(record: JsonRecord): Salon["score_breakdown"] {
  const metadata = isRecord(record.metadata) ? record.metadata : {};
  const scoringDetails = isRecord(metadata.scoring_details) ? metadata.scoring_details : null;
  const breakdown = scoringDetails && isRecord(scoringDetails.breakdown) ? scoringDetails.breakdown : null;

  if (breakdown) {
    const items = Object.entries(breakdown)
      .map(([key, value]) => {
        if (typeof value === "number") {
          return {
            criterion: labelForCriterion(key),
            points: Math.max(0, Math.round(value)),
            reason: "Critère pris en compte dans le scoring."
          };
        }

        if (!isRecord(value)) return null;

        const matched = value.matched === true || value.matched === undefined;
        const points = matched
          ? Math.max(0, Math.round(asNumber(value.points, asNumber(value.weight, 0))))
          : 0;
        const reason =
          asNullableString(value.reason) ??
          asNullableString(value.description) ??
          (matched ? "Critère validé." : "Critère non validé.");

        return {
          criterion: labelForCriterion(key),
          points,
          reason
        };
      })
      .filter((item): item is Salon["score_breakdown"][number] => Boolean(item))
      .sort((left, right) => right.points - left.points);

    if (items.length > 0) return items;
  }

  const fallbackItems: Salon["score_breakdown"] = [
    {
      criterion: "Score CRM",
      points: clamp(Math.round(asNumber(record.score, 0)), 0, 100),
      reason: "Score actuellement disponible dans la base salons."
    }
  ];

  const googleRating = asNumber(record.google_rating, 0);
  if (googleRating > 0) {
    fallbackItems.push({
      criterion: "Note Google",
      points: clamp(Math.round(googleRating * 5), 0, 25),
      reason: `${googleRating.toFixed(1)} / 5 côté Google.`
    });
  }

  const googleReviewsCount = Math.round(asNumber(record.google_reviews_count, 0));
  if (googleReviewsCount > 0) {
    fallbackItems.push({
      criterion: "Avis Google",
      points: clamp(Math.round(googleReviewsCount / 8), 0, 20),
      reason: `${googleReviewsCount} avis détectés.`
    });
  }

  if (asNullableString(record.website)) {
    fallbackItems.push({
      criterion: "Site web",
      points: 10,
      reason: "Le salon dispose d'un site web."
    });
  }

  if (asNullableString(record.instagram)) {
    fallbackItems.push({
      criterion: "Instagram",
      points: clamp(Math.round(asNumber(record.instagram_followers, 0) / 500), 5, 15),
      reason: "Présence Instagram détectée."
    });
  }

  return fallbackItems.sort((left, right) => right.points - left.points);
}

function buildContacts(records: JsonRecord[]): Salon["contacts"] {
  return records
    .map((record) => ({
      id: asId(record.id, "contact"),
      first_name: asString(record.first_name, "Contact"),
      last_name: asString(record.last_name),
      role: asString(record.role, "Contact"),
      phone: asString(record.phone, "—"),
      email: asString(record.email, "—"),
      is_decision_maker: Boolean(record.is_decision_maker),
      status: asString(record.status, "actif")
    }))
    .sort((left, right) => Number(right.is_decision_maker) - Number(left.is_decision_maker));
}

function buildBrandCriteriaBreakdown(value: unknown): Salon["brand_scores"][number]["criteria_breakdown"] {
  if (!isRecord(value)) return [];

  return Object.entries(value)
    .map(([key, item]) => {
      if (typeof item === "number") {
        return {
          criterion: labelForCriterion(key),
          points: Math.max(0, Math.round(item)),
          reason: "Critère pris en compte dans le calcul."
        };
      }

      if (!isRecord(item)) return null;

      const matched = item.matched === true || item.matched === undefined;
      const points = matched
        ? Math.max(0, Math.round(asNumber(item.points, asNumber(item.weight, 0))))
        : 0;
      const reason =
        asNullableString(item.reason) ??
        asNullableString(item.description) ??
        (matched ? "Critère validé." : "Critère non validé.");

      return {
        criterion: labelForCriterion(key),
        points,
        reason
      };
    })
    .filter((item): item is Salon["brand_scores"][number]["criteria_breakdown"][number] => Boolean(item))
    .sort((left, right) => right.points - left.points);
}

function getBrandActionLabel(score: number): string {
  if (score >= 80) return "Contacter la marque";
  if (score >= 60) return "Préparer un dossier";
  return "Surveiller";
}

function buildBrandScores(
  records: JsonRecord[],
  brandMap: Map<string, string> = new Map()
): Salon["brand_scores"] {
  return records
    .map((record) => {
      const compatibilityScore = clamp(Math.round(asNumber(record.compatibility_score, 0)), 0, 100);
      const brandId = asString(record.brand_id);
      const brandName = brandMap.get(brandId) ?? asString(record.brand_name, "Marque");

      return {
        brand: brandName,
        compatibility_score: compatibilityScore,
        action_label: getBrandActionLabel(compatibilityScore),
        criteria_breakdown: buildBrandCriteriaBreakdown(record.criteria_breakdown)
      };
    })
    .sort((left, right) => right.compatibility_score - left.compatibility_score);
}

function parseContent(value: unknown): JsonRecord | null {
  if (isRecord(value)) return value;
  if (typeof value !== "string") return null;

  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function contentPreview(content: unknown): string {
  if (typeof content === "string" && content.trim().length > 0 && !content.trim().startsWith("{")) {
    return content.trim().slice(0, 220);
  }

  const parsed = parseContent(content);
  if (!parsed) return "Contenu indisponible.";

  return (
    asNullableString(parsed.text) ??
    asNullableString(parsed.subject) ??
    asNullableString(parsed.html)?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 220) ??
    "Contenu indisponible."
  );
}

function buildOutreach(records: JsonRecord[], contacts: Salon["contacts"]): Salon["outreach"] {
  const contactsMap = new Map(contacts.map((contact) => [contact.id, contact]));

  return records
    .map((record) => {
      const linkedContact = contactsMap.get(asString(record.contact_id));
      const metadata = isRecord(record.metadata) ? record.metadata : {};
      const sequenceName =
        asNullableString(metadata.sequence_name) ??
        asNullableString(metadata.template) ??
        (typeof record.sequence_step === "number" ? `Séquence · étape ${record.sequence_step}` : null);

      return {
        id: asId(record.id, "outreach"),
        date: asString(record.sent_at, asString(record.scheduled_at, asString(record.created_at, FALLBACK_DATE))),
        type: asString(record.type, "message"),
        channel: asString(record.channel, "email"),
        status: asString(record.status, "planifié"),
        content_preview: contentPreview(record.content),
        response: asString(record.response_content, "Aucune réponse pour le moment."),
        sequence_name: sequenceName,
        contact_name:
          linkedContact && (linkedContact.first_name || linkedContact.last_name)
            ? `${linkedContact.first_name} ${linkedContact.last_name}`.trim()
            : "Contact salon"
      };
    })
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

function buildDossiers(records: JsonRecord[], brandMap: Map<string, string> = new Map()): Salon["dossiers"] {
  return records
    .map((record) => {
      const content = parseContent(record.content);
      const brandId = asString(record.brand_id);
      const brandName = brandMap.get(brandId);
      const explicitBrands = Array.isArray(content?.brands)
        ? content.brands.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        : brandName
          ? [brandName]
          : [];

      return {
        id: asId(record.id, "dossier"),
        title:
          asNullableString(content?.title) ??
          (brandName ? `Dossier ${brandName}` : "Dossier salon"),
        status: asString(record.status, "brouillon"),
        created_at: asString(record.generated_at, asString(record.created_at, FALLBACK_DATE)),
        brands: explicitBrands
      };
    })
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
}

function buildAuctions(record: JsonRecord): Salon["auctions"] {
  const metadata = isRecord(record.metadata) ? record.metadata : {};
  const auctions = Array.isArray(metadata.auctions) ? metadata.auctions : [];

  return auctions
    .map((item) => {
      if (!isRecord(item)) return null;

      const bids = Array.isArray(item.bids)
        ? item.bids
            .map((bid) => {
              if (!isRecord(bid)) return null;

              return {
                brand: asString(bid.brand, "Marque"),
                amount: Math.max(0, Math.round(asNumber(bid.amount, 0)))
              };
            })
            .filter((bid): bid is Salon["auctions"][number]["bids"][number] => Boolean(bid))
        : [];

      return {
        id: asId(item.id, "auction"),
        title: asString(item.title, "Enchère"),
        status: asString(item.status, "brouillon"),
        start_date: asString(item.start_date, FALLBACK_DATE),
        end_date: asString(item.end_date, FALLBACK_DATE),
        minimum_bid: Math.max(0, Math.round(asNumber(item.minimum_bid, 0))),
        winning_brand: asNullableString(item.winning_brand),
        bids
      };
    })
    .filter((item): item is Salon["auctions"][number] => Boolean(item));
}

function buildActivityTitle(action: string): string {
  const actionMap: Record<string, string> = {
    "salon.created": "Salon ajouté dans le CRM",
    "salon.enriched": "Fiche enrichie",
    "score.updated": "Score recalculé"
  };

  return actionMap[action] ?? action.replace(/[_\.]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildActivityDescription(record: JsonRecord): string {
  const metadata = isRecord(record.metadata) ? record.metadata : {};
  const newValue = isRecord(record.new_value) ? record.new_value : {};
  const action = asString(record.action);

  if (action === "salon.created") {
    const source = asNullableString(metadata.source);
    return source ? `Création automatique depuis ${source}.` : "Création d'une nouvelle fiche salon.";
  }

  if (action === "salon.enriched") {
    const source = asNullableString(metadata.source);
    return source ? `Enrichissement réalisé depuis ${source}.` : "Les données du salon ont été enrichies.";
  }

  if (action === "score.updated") {
    const score = asNullableNumber(newValue.score) ?? asNullableNumber(newValue.new_score);
    const tier = asNullableString(newValue.tier);

    if (score !== null && tier) {
      return `Nouveau score ${Math.round(score)}/100 · palier ${tier}.`;
    }

    if (score !== null) {
      return `Nouveau score ${Math.round(score)}/100.`;
    }
  }

  return (
    asNullableString(metadata.reasoning) ??
    asNullableString(metadata.breakdown) ??
    asNullableString(record.notes) ??
    "Activité enregistrée dans le CRM."
  );
}

function buildTimeline(
  salonRecord: JsonRecord,
  activity: JsonRecord[],
  pipelineHistory: JsonRecord[]
): Salon["timeline"] {
  const items: Salon["timeline"] = [];

  const notes = asNullableString(salonRecord.notes);
  if (notes) {
    items.push({
      id: `note-${asId(salonRecord.id, "salon")}`,
      type: "note",
      icon: "note",
      title: "Notes CRM",
      description: notes,
      actor: "CRM",
      created_at: asString(salonRecord.updated_at, asString(salonRecord.created_at, FALLBACK_DATE))
    });
  }

  for (const record of activity) {
    items.push({
      id: asId(record.id, "activity"),
      type: asString(record.action, "activity"),
      icon: "activity",
      title: buildActivityTitle(asString(record.action)),
      description: buildActivityDescription(record),
      actor: asString(record.actor_name, asString(record.actor_type, "Système")),
      created_at: asString(record.created_at, FALLBACK_DATE)
    });
  }

  for (const record of pipelineHistory) {
    const fromStatus = labelForStatus(record.from_status);
    const toStatus = labelForStatus(record.to_status);
    const notesValue = asNullableString(record.notes);

    items.push({
      id: asId(record.id, "pipeline"),
      type: "status",
      icon: "status",
      title: `Statut mis à jour · ${toStatus}`,
      description: notesValue
        ? `Passage de ${fromStatus} à ${toStatus}. ${notesValue}`
        : `Passage de ${fromStatus} à ${toStatus}.`,
      actor: asString(record.changed_by, "CRM"),
      created_at: asString(record.created_at, FALLBACK_DATE)
    });
  }

  return items.sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
}

function buildAudit(record: JsonRecord): Salon["audit"] {
  const googleRating = asNumber(record.google_rating, 0);
  const googleReviewsCount = Math.round(asNumber(record.google_reviews_count, 0));
  const digitalSignals = [record.website, record.instagram, record.facebook, record.planity_url].filter(Boolean).length;
  const completenessSignals = [
    record.address,
    record.city,
    record.postal_code,
    record.phone,
    record.email,
    record.website,
    record.instagram,
    record.google_rating,
    record.siret,
    record.owner_name,
    record.team_size
  ].filter((value) => value !== null && value !== undefined && value !== "").length;
  const reputationScore = googleRating > 0 ? clamp(Math.round((googleRating / 5) * 100), 0, 100) : 0;
  const digitalScore = clamp(digitalSignals * 25, 0, 100);
  const completenessScore = clamp(Math.round((completenessSignals / 11) * 100), 0, 100);
  const commercialScore = clamp(Math.round(asNumber(record.score, 0)), 0, 100);

  return [
    {
      dimension: "Réputation Google",
      score: reputationScore,
      note:
        googleReviewsCount > 0
          ? `${googleRating.toFixed(1)} / 5 sur ${googleReviewsCount} avis.`
          : "Aucun signal Google exploitable pour le moment."
    },
    {
      dimension: "Présence digitale",
      score: digitalScore,
      note:
        digitalSignals > 0
          ? `${digitalSignals} canal${digitalSignals > 1 ? "x" : ""} détecté${digitalSignals > 1 ? "s" : ""}.`
          : "Aucun canal digital renseigné."
    },
    {
      dimension: "Complétude fiche CRM",
      score: completenessScore,
      note: `${completenessSignals} champ${completenessSignals > 1 ? "s" : ""} clés renseigné${completenessSignals > 1 ? "s" : ""}.`
    },
    {
      dimension: "Potentiel commercial",
      score: commercialScore,
      note: `Score CRM actuellement estimé à ${commercialScore}/100.`
    }
  ];
}

function mapSalonRecord(record: JsonRecord, options: MapSalonOptions = {}): Salon {
  const website = normalizeWebsite(record.website);
  const assignedTo = buildAssignedProfile(record.assigned_to, options.profileMap);
  const contacts = buildContacts(options.contacts ?? []);
  const brandScores = buildBrandScores(options.brandScores ?? [], options.brandMap);
  const outreach = buildOutreach(options.outreach ?? [], contacts);

  return salonSchema.parse({
    id: asString(record.id),
    name: asString(record.name, "Salon sans nom"),
    address: asString(record.address, "Adresse non renseignée"),
    city: asString(record.city, "Ville inconnue"),
    postal_code: asString(record.postal_code, "—"),
    department: asString(record.department, "—"),
    region: asString(record.region, "Région inconnue"),
    phone: asNullableString(record.phone),
    email: asNullableString(record.email),
    website,
    instagram: normalizeInstagram(record.instagram),
    instagram_followers: asNullableNumber(record.instagram_followers),
    facebook: normalizeFacebook(record.facebook),
    planity_url: normalizePlanity(record.planity_url, website),
    google_place_id: asString(record.google_place_id),
    google_rating: clamp(asNumber(record.google_rating, 0), 0, 5),
    google_reviews_count: Math.max(0, Math.round(asNumber(record.google_reviews_count, 0))),
    google_maps_url: buildGoogleMapsUrl(record),
    siret: asString(record.siret, "Non renseigné"),
    naf_code: asString(record.naf_code, "Non renseigné"),
    legal_form: asString(record.legal_form, "Non renseignée"),
    owner_name: asString(record.owner_name, "Non renseigné"),
    team_size: Math.max(0, Math.round(asNumber(record.team_size, 0))),
    status: normalizeStatus(record.status),
    score: clamp(Math.round(asNumber(record.score, 0)), 0, 100),
    notes: asNullableString(record.notes),
    assigned_to: assignedTo,
    source: asString(record.source, "crm"),
    enrichment_status: normalizeEnrichmentStatus(record.enrichment_status),
    last_enriched_at: asNullableString(record.last_enriched_at),
    converted_at: asNullableString(record.converted_at),
    tags: asStringArray(record.tags),
    metadata: isRecord(record.metadata) ? record.metadata : {},
    created_at: asString(record.created_at, FALLBACK_DATE),
    updated_at: asString(record.updated_at, asString(record.created_at, FALLBACK_DATE)),
    latitude: asNullableNumber(record.latitude),
    longitude: asNullableNumber(record.longitude),
    franchise: record.franchise === null || record.franchise === undefined ? null : Boolean(record.franchise),
    franchise_name: asNullableString(record.franchise_name),
    score_breakdown: buildScoreBreakdown(record),
    timeline: buildTimeline(record, options.activity ?? [], options.pipelineHistory ?? []),
    contacts,
    brand_scores: brandScores,
    outreach,
    dossiers: buildDossiers(options.dossiers ?? [], options.brandMap),
    auctions: buildAuctions(record),
    audit: buildAudit(record)
  });
}

async function fetchProfilesMap(supabase: Awaited<ReturnType<typeof createClient>>, ids: string[]) {
  if (ids.length === 0) return new Map<string, ProfileRow>();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, email")
    .in("id", ids);

  if (error || !data) {
    if (error) console.error("Error fetching profiles:", error);
    return new Map<string, ProfileRow>();
  }

  return new Map(
    data
      .filter((profile): profile is ProfileRow => Boolean(profile?.id))
      .map((profile) => [profile.id, profile])
  );
}

async function fetchBrandMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  brandIds: string[]
): Promise<Map<string, string>> {
  if (brandIds.length === 0) return new Map<string, string>();

  const { data, error } = await supabase.from("brands").select("id, name").in("id", brandIds);

  if (error || !data) {
    if (error) console.error("Error fetching brands:", error);
    return new Map<string, string>();
  }

  return new Map(
    data
      .filter((brand): brand is { id: string; name: string | null } => Boolean(brand?.id))
      .map((brand) => [brand.id, brand.name?.trim() || "Marque"])
  );
}

export async function getSalons(options?: {
  limit?: number;
  offset?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}) {
  const supabase = await createClient();

  let query = supabase.from("salons").select("*", { count: "exact" }).is("deleted_at", null);

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  if (options?.search) {
    const search = options.search.trim().replace(/[,%'()]/g, " ");
    if (search.length > 0) {
      query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%`);
    }
  }

  const requestedSortBy = options?.sortBy ?? DEFAULT_SORT_BY;
  const sortBy = VALID_SORT_COLUMNS.has(requestedSortBy) ? requestedSortBy : DEFAULT_SORT_BY;
  query = query.order(sortBy, { ascending: options?.sortDir === "asc" });

  const limit = options?.limit ?? DEFAULT_LIMIT;
  const offset = options?.offset ?? 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    console.error("Error fetching salons:", error);
    return { salons: [], total: 0 };
  }

  try {
    const assignedIds = unique(
      data
        .map((record) => asString(record.assigned_to))
        .filter(Boolean)
    );
    const profileMap = await fetchProfilesMap(supabase, assignedIds);
    const salons = data.map((record) => mapSalonRecord(record, { profileMap }));

    return {
      salons,
      total: count ?? salons.length
    };
  } catch (parseError) {
    console.error("Error parsing salons:", parseError);
    return { salons: [], total: 0 };
  }
}

export async function getSalonById(id: string) {
  const supabase = await createClient();

  const { data: salonRecord, error } = await supabase
    .from("salons")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !salonRecord) {
    console.error("Error fetching salon:", error);
    return null;
  }

  const assignedId = asString(salonRecord.assigned_to);

  const [
    contactsResponse,
    brandScoresResponse,
    outreachResponse,
    activityResponse,
    pipelineHistoryResponse,
    dossiersResponse,
    profileMap
  ] = await Promise.all([
    supabase.from("contacts").select("*").eq("salon_id", id).is("deleted_at", null),
    supabase.from("brand_salon_scores").select("*").eq("salon_id", id),
    supabase.from("outreach").select("*").eq("salon_id", id).is("deleted_at", null),
    supabase
      .from("activity_log")
      .select("*")
      .eq("entity_type", "salon")
      .eq("entity_id", id),
    supabase.from("pipeline_history").select("*").eq("salon_id", id),
    supabase.from("client_dossiers").select("*").eq("salon_id", id),
    fetchProfilesMap(supabase, assignedId ? [assignedId] : [])
  ]);

  if (contactsResponse.error) console.error("Error fetching salon contacts:", contactsResponse.error);
  if (brandScoresResponse.error) console.error("Error fetching salon brand scores:", brandScoresResponse.error);
  if (outreachResponse.error) console.error("Error fetching salon outreach:", outreachResponse.error);
  if (activityResponse.error) console.error("Error fetching salon activity:", activityResponse.error);
  if (pipelineHistoryResponse.error) console.error("Error fetching salon pipeline history:", pipelineHistoryResponse.error);
  if (dossiersResponse.error) console.error("Error fetching salon dossiers:", dossiersResponse.error);

  try {
    const brandIds = unique([
      ...((brandScoresResponse.data ?? []).map((record) => asString(record.brand_id)).filter(Boolean) as string[]),
      ...((dossiersResponse.data ?? []).map((record) => asString(record.brand_id)).filter(Boolean) as string[])
    ]);
    const brandMap = await fetchBrandMap(supabase, brandIds);

    return mapSalonRecord(salonRecord, {
      profileMap,
      contacts: (contactsResponse.data ?? []) as JsonRecord[],
      brandScores: (brandScoresResponse.data ?? []) as JsonRecord[],
      brandMap,
      outreach: (outreachResponse.data ?? []) as JsonRecord[],
      activity: (activityResponse.data ?? []) as JsonRecord[],
      pipelineHistory: (pipelineHistoryResponse.data ?? []) as JsonRecord[],
      dossiers: (dossiersResponse.data ?? []) as JsonRecord[]
    });
  } catch (parseError) {
    console.error("Error parsing salon detail:", parseError);
    return null;
  }
}

export async function getSalonStats() {
  const supabase = await createClient();

  const [totalResponse, enrichedResponse, highScoreResponse, contactedResponse] = await Promise.all([
    supabase.from("salons").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("salons")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .in("enrichment_status", ["complete", "partial", "enriched"]),
    supabase.from("salons").select("*", { count: "exact", head: true }).is("deleted_at", null).gte("score", 40),
    supabase.from("salons").select("*", { count: "exact", head: true }).is("deleted_at", null).neq("status", "nouveau")
  ]);

  if (totalResponse.error) console.error("Error fetching total salons:", totalResponse.error);
  if (enrichedResponse.error) console.error("Error fetching enriched salons:", enrichedResponse.error);
  if (highScoreResponse.error) console.error("Error fetching high-score salons:", highScoreResponse.error);
  if (contactedResponse.error) console.error("Error fetching contacted salons:", contactedResponse.error);

  return {
    total: totalResponse.count ?? 0,
    enriched: enrichedResponse.count ?? 0,
    highScore: highScoreResponse.count ?? 0,
    contacted: contactedResponse.count ?? 0
  };
}
