import { mockProfileIds, mockSalonIds } from "./ids";
import type { SalonRow } from "./types";

export const mockSalons: SalonRow[] = [
  {
    id: mockSalonIds.maisonTressee,
    name: "Maison Tressée",
    address: "14 rue des Petits-Champs",
    city: "Paris",
    postal_code: "75002",
    department: "75",
    region: "Île-de-France",
    phone: "0142801122",
    email: "contact@maisontressee.fr",
    website: "https://maisontressee.fr",
    instagram: "https://instagram.com/maisontressee",
    instagram_followers: 12800,
    facebook: null,
    planity_url: "https://www.planity.com/maison-tressee-75002-paris",
    google_place_id: "ChIJ-maison-tressee-75002",
    google_rating: 4.8,
    google_reviews_count: 214,
    siret: "81234567800017",
    naf_code: "96.02A",
    legal_form: "SAS",
    owner_name: "Camille Rocher",
    team_size: 14,
    status: "negociation",
    score: 82,
    notes: "Salon premium, échange très positif. Bonnie attend le retour final sur les conditions Schwarzkopf.",
    assigned_to: mockProfileIds.bonnie,
    source: "sirene",
    enrichment_status: "enriched",
    last_enriched_at: "2026-03-11T08:22:00.000Z",
    converted_at: null,
    tags: ["premium", "coloration", "paris-centre"],
    metadata: {
      scoring_details: {
        total: 82,
        scored_at: "2026-03-11T08:22:00.000Z",
        components: {
          google_presence: 18,
          digital_maturity: 16,
          team_size: 14,
          positioning: 20,
          website_quality: 14
        },
        best_brand_match: {
          brand_name: "Schwarzkopf",
          compatibility_score: 91
        },
        brand_scores: {
          Schwarzkopf: { compatibility_score: 91 },
          Wella: { compatibility_score: 88 },
          Revlon: { compatibility_score: 67 }
        }
      },
      enrichment: {
        source_stack: ["sirene", "google", "instagram", "planity"],
        completeness: 0.94,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-02-28T09:14:00.000Z",
    updated_at: "2026-03-12T08:30:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.atelierColoriste,
    name: "Atelier Coloriste Montchat",
    address: "82 cours Docteur Long",
    city: "Lyon",
    postal_code: "69003",
    department: "69",
    region: "Auvergne-Rhône-Alpes",
    phone: "0478624410",
    email: "hello@ateliercoloriste.fr",
    website: "https://ateliercoloriste.fr",
    instagram: "https://instagram.com/ateliercoloriste.montchat",
    instagram_followers: 7400,
    facebook: "https://facebook.com/ateliercoloriste.montchat",
    planity_url: "https://www.planity.com/atelier-coloriste-montchat-69003-lyon",
    google_place_id: "ChIJ-atelier-coloriste-69003",
    google_rating: 4.7,
    google_reviews_count: 133,
    siret: "83456790100026",
    naf_code: "96.02A",
    legal_form: "SARL",
    owner_name: "Sarah Benali",
    team_size: 9,
    status: "rdv_planifie",
    score: 76,
    notes: "RDV visio confirmé pour jeudi 14h. Intérêt prioritaire pour Wella et accompagnement retail.",
    assigned_to: mockProfileIds.mariePierre,
    source: "google",
    enrichment_status: "enriched",
    last_enriched_at: "2026-03-10T14:40:00.000Z",
    converted_at: null,
    tags: ["color-expert", "lyon", "rdv-chaud"],
    metadata: {
      scoring_details: {
        total: 76,
        scored_at: "2026-03-10T14:40:00.000Z",
        best_brand_match: {
          brand_name: "Wella",
          compatibility_score: 89
        }
      },
      enrichment: {
        source_stack: ["google", "instagram", "website"],
        completeness: 0.89,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-03-01T11:05:00.000Z",
    updated_at: "2026-03-12T07:45:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.studioBalmain,
    name: "Studio Balmain Marseille",
    address: "19 boulevard Vauban",
    city: "Marseille",
    postal_code: "13006",
    department: "13",
    region: "Provence-Alpes-Côte d’Azur",
    phone: "0491332290",
    email: null,
    website: "https://studiobalmain-marseille.fr",
    instagram: "https://instagram.com/studiobalmain.marseille",
    instagram_followers: 5300,
    facebook: null,
    planity_url: null,
    google_place_id: "ChIJ-studio-balmain-13006",
    google_rating: 4.5,
    google_reviews_count: 92,
    siret: "84567891200031",
    naf_code: "96.02A",
    legal_form: "SASU",
    owner_name: "Laurent Vial",
    team_size: 7,
    status: "contacte",
    score: 58,
    notes: "Premier contact effectué. Le gérant souhaite un rappel après la semaine des congés scolaires.",
    assigned_to: mockProfileIds.bonnie,
    source: "sirene",
    enrichment_status: "pending",
    last_enriched_at: "2026-03-09T16:20:00.000Z",
    converted_at: null,
    tags: ["sud", "callback", "premium-local"],
    metadata: {
      scoring_details: {
        total: 58,
        scored_at: "2026-03-09T16:20:00.000Z"
      },
      enrichment: {
        source_stack: ["sirene", "google", "instagram"],
        completeness: 0.71,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-03-03T13:30:00.000Z",
    updated_at: "2026-03-12T06:50:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.maisonNacree,
    name: "Maison Nacrée",
    address: "5 rue de la Monnaie",
    city: "Lille",
    postal_code: "59800",
    department: "59",
    region: "Hauts-de-France",
    phone: null,
    email: "bonjour@maisonnacree.fr",
    website: "https://maisonnacree.fr",
    instagram: "https://instagram.com/maison.nacree",
    instagram_followers: 2100,
    facebook: null,
    planity_url: null,
    google_place_id: "ChIJ-maison-nacree-59800",
    google_rating: 4.4,
    google_reviews_count: 41,
    siret: "85678912300022",
    naf_code: "96.02A",
    legal_form: "SARL",
    owner_name: "Clémence Dervaux",
    team_size: 4,
    status: "nouveau",
    score: 63,
    notes: "Fiche fraîchement scorée. Il manque le téléphone direct et le contact décideur.",
    assigned_to: mockProfileIds.mariePierre,
    source: "datagouv",
    enrichment_status: "pending",
    last_enriched_at: "2026-03-12T08:16:00.000Z",
    converted_at: null,
    tags: ["à-enrichir", "lille", "digital-clean"],
    metadata: {
      scoring_details: {
        total: 63,
        previous_total: 44,
        scored_at: "2026-03-12T08:16:00.000Z"
      },
      enrichment: {
        source_stack: ["sirene", "website"],
        completeness: 0.62,
        enriched_by: "scoremaster"
      }
    },
    created_at: "2026-03-08T10:02:00.000Z",
    updated_at: "2026-03-12T08:16:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.appartementCoiffure,
    name: "L’Appartement Coiffure",
    address: "11 rue du Palais Gallien",
    city: "Bordeaux",
    postal_code: "33000",
    department: "33",
    region: "Nouvelle-Aquitaine",
    phone: "0556129841",
    email: "team@appartementcoiffure.fr",
    website: "https://appartementcoiffure.fr",
    instagram: "https://instagram.com/appartement.coiffure",
    instagram_followers: 9600,
    facebook: "https://facebook.com/appartement.coiffure",
    planity_url: "https://www.planity.com/lappartement-coiffure-33000-bordeaux",
    google_place_id: "ChIJ-appartement-coiffure-33000",
    google_rating: 4.9,
    google_reviews_count: 188,
    siret: "86789123400014",
    naf_code: "96.02A",
    legal_form: "SAS",
    owner_name: "Mélanie Costa",
    team_size: 11,
    status: "interesse",
    score: 79,
    notes: "Très bon fit pour Revlon et Myspa. Besoin de support merchandising et de formation équipe.",
    assigned_to: mockProfileIds.bonnie,
    source: "manual",
    enrichment_status: "enriched",
    last_enriched_at: "2026-03-11T17:05:00.000Z",
    converted_at: null,
    tags: ["formation", "retail", "high-intent"],
    metadata: {
      scoring_details: {
        total: 79,
        scored_at: "2026-03-11T17:05:00.000Z",
        best_brand_match: {
          brand_name: "Revlon",
          compatibility_score: 87
        }
      },
      enrichment: {
        source_stack: ["manual", "google", "instagram", "planity"],
        completeness: 0.97,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-02-26T15:50:00.000Z",
    updated_at: "2026-03-11T17:05:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.salonSignature,
    name: "Salon Signature Nice",
    address: "27 rue Pastorelli",
    city: "Nice",
    postal_code: "06000",
    department: "06",
    region: "Provence-Alpes-Côte d’Azur",
    phone: "0493884401",
    email: "direction@salonsignature.fr",
    website: "https://salonsignature.fr",
    instagram: "https://instagram.com/salon.signature.nice",
    instagram_followers: 11200,
    facebook: null,
    planity_url: "https://www.planity.com/salon-signature-06000-nice",
    google_place_id: "ChIJ-salon-signature-06000",
    google_rating: 4.9,
    google_reviews_count: 236,
    siret: "87891234500019",
    naf_code: "96.02A",
    legal_form: "SARL",
    owner_name: "Julie Ferrand",
    team_size: 13,
    status: "gagne",
    score: 91,
    notes: "Deal signé. Mise en place onboarding marque prévue lundi avec Saint-Algue.",
    assigned_to: mockProfileIds.mariePierre,
    source: "referral",
    enrichment_status: "enriched",
    last_enriched_at: "2026-03-06T12:10:00.000Z",
    converted_at: "2026-03-10T18:20:00.000Z",
    tags: ["won", "onboarding", "cote-dazur"],
    metadata: {
      scoring_details: {
        total: 91,
        scored_at: "2026-03-06T12:10:00.000Z",
        best_brand_match: {
          brand_name: "Saint-Algue",
          compatibility_score: 93
        }
      },
      enrichment: {
        source_stack: ["referral", "google", "instagram", "website"],
        completeness: 0.98,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-02-22T09:25:00.000Z",
    updated_at: "2026-03-10T18:20:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.espaceNuance,
    name: "Espace Nuance",
    address: "48 quai de la Fosse",
    city: "Nantes",
    postal_code: "44000",
    department: "44",
    region: "Pays de la Loire",
    phone: "0240845109",
    email: "contact@espacenuance.fr",
    website: "https://espacenuance.fr",
    instagram: "https://instagram.com/espace.nuance",
    instagram_followers: 6800,
    facebook: null,
    planity_url: null,
    google_place_id: "ChIJ-espace-nuance-44000",
    google_rating: 4.6,
    google_reviews_count: 118,
    siret: "88912345600021",
    naf_code: "96.02A",
    legal_form: "SAS",
    owner_name: "Pauline Renaud",
    team_size: 8,
    status: "client_actif",
    score: 88,
    notes: "Client actif depuis janvier. Demande régulière de support lancement produits et opérations retail.",
    assigned_to: mockProfileIds.bonnie,
    source: "manual",
    enrichment_status: "enriched",
    last_enriched_at: "2026-03-05T09:45:00.000Z",
    converted_at: "2026-01-18T11:10:00.000Z",
    tags: ["client-actif", "upsell", "formation"],
    metadata: {
      scoring_details: {
        total: 88,
        scored_at: "2026-03-05T09:45:00.000Z"
      },
      enrichment: {
        source_stack: ["manual", "google", "website"],
        completeness: 0.95,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2025-12-12T10:20:00.000Z",
    updated_at: "2026-03-11T15:12:00.000Z",
    deleted_at: null
  },
  {
    id: mockSalonIds.atelierDuLac,
    name: "Atelier du Lac",
    address: "3 avenue d’Albigny",
    city: "Annecy",
    postal_code: "74000",
    department: "74",
    region: "Auvergne-Rhône-Alpes",
    phone: "0450661904",
    email: "bonjour@atelierdulac.fr",
    website: null,
    instagram: "https://instagram.com/atelier.du.lac",
    instagram_followers: 1600,
    facebook: null,
    planity_url: null,
    google_place_id: "ChIJ-atelier-du-lac-74000",
    google_rating: 4.1,
    google_reviews_count: 26,
    siret: "89023456700028",
    naf_code: "96.02A",
    legal_form: "EI",
    owner_name: "Élise Martin",
    team_size: 3,
    status: "perdu",
    score: 37,
    notes: "Le salon a confirmé être déjà engagé avec une centrale d’achat concurrente pour 18 mois.",
    assigned_to: mockProfileIds.mariePierre,
    source: "sirene",
    enrichment_status: "pending",
    last_enriched_at: "2026-03-07T10:05:00.000Z",
    converted_at: null,
    tags: ["perdu", "petite-structure"],
    metadata: {
      scoring_details: {
        total: 37,
        scored_at: "2026-03-07T10:05:00.000Z"
      },
      enrichment: {
        source_stack: ["sirene", "google"],
        completeness: 0.54,
        enriched_by: "enrichbot"
      }
    },
    created_at: "2026-03-04T08:40:00.000Z",
    updated_at: "2026-03-10T09:10:00.000Z",
    deleted_at: null
  }
] satisfies SalonRow[];
