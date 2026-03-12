import { z } from "zod";

export const salonStatusValues = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
] as const;

export const enrichmentStatusValues = ["pending", "enriched", "failed"] as const;

const jsonRecordSchema = z.record(z.string(), z.unknown());

const assignedProfileSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar: z.string().nullable(),
  initials: z.string()
});

const scoreBreakdownSchema = z.object({
  criterion: z.string(),
  points: z.number(),
  reason: z.string()
});

const timelineEntrySchema = z.object({
  id: z.string(),
  type: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  actor: z.string(),
  created_at: z.string()
});

const contactSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.string(),
  phone: z.string(),
  email: z.string(),
  is_decision_maker: z.boolean(),
  status: z.string()
});

const criteriaBreakdownSchema = z.object({
  criterion: z.string(),
  points: z.number(),
  reason: z.string()
});

const brandScoreSchema = z.object({
  brand: z.string(),
  compatibility_score: z.number(),
  action_label: z.string(),
  criteria_breakdown: z.array(criteriaBreakdownSchema)
});

const outreachSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.string(),
  channel: z.string(),
  status: z.string(),
  content_preview: z.string(),
  response: z.string(),
  sequence_name: z.string().nullable(),
  contact_name: z.string()
});

const dossierSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  created_at: z.string(),
  brands: z.array(z.string())
});

const bidSchema = z.object({
  brand: z.string(),
  amount: z.number()
});

const auctionSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  minimum_bid: z.number(),
  winning_brand: z.string().nullable(),
  bids: z.array(bidSchema)
});

const auditDimensionSchema = z.object({
  dimension: z.string(),
  score: z.number(),
  note: z.string()
});

export const salonSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    department: z.string(),
    region: z.string(),
    address: z.string(),
    postal_code: z.string(),
    status: z.enum(salonStatusValues),
    score: z.number().min(0).max(100),
    phone: z.string().nullable(),
    email: z.string().nullable(),
    website: z.string().nullable(),
    siret: z.string(),
    naf_code: z.string(),
    legal_form: z.string(),
    owner_name: z.string(),
    team_size: z.number().int().nonnegative(),
    source: z.string(),
    enrichment_status: z.enum(enrichmentStatusValues),
    google_rating: z.number().min(0).max(5),
    google_reviews_count: z.number().int().nonnegative(),
    google_place_id: z.string(),
    google_maps_url: z.string(),
    instagram: z.string().nullable(),
    instagram_followers: z.number().int().nonnegative().nullable(),
    facebook: z.string().nullable(),
    planity_url: z.string().nullable(),
    assigned_to: assignedProfileSchema.nullable(),
    tags: z.array(z.string()),
    metadata: jsonRecordSchema,
    notes: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    last_enriched_at: z.string().nullable(),
    converted_at: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    franchise: z.boolean().nullable(),
    franchise_name: z.string().nullable(),
    score_breakdown: z.array(scoreBreakdownSchema),
    timeline: z.array(timelineEntrySchema),
    contacts: z.array(contactSchema),
    brand_scores: z.array(brandScoreSchema),
    outreach: z.array(outreachSchema),
    dossiers: z.array(dossierSchema),
    auctions: z.array(auctionSchema),
    audit: z.array(auditDimensionSchema)
  })
  .passthrough();

export type Salon = z.infer<typeof salonSchema>;
export type SalonStatus = (typeof salonStatusValues)[number];
export type EnrichmentStatus = (typeof enrichmentStatusValues)[number];
