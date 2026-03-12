import type { ActivityLogRow } from "./types";

export const mockActivityLog: ActivityLogRow[] = [
  {
    id: "activity-001",
    actor_id: null,
    actor_name: "EnrichBot",
    actor_type: "agent",
    action: "enriched",
    entity_id: "salon-006",
    entity_type: "salon",
    entity_name: "Mademoiselle 27",
    metadata: {
      phone_found: true,
      website_found: true
    },
    created_at: "2026-03-12T15:36:00.000Z"
  },
  {
    id: "activity-002",
    actor_id: null,
    actor_name: "ScoreMaster",
    actor_type: "agent",
    action: "scored",
    entity_id: "salon-003",
    entity_type: "salon",
    entity_name: "Studio Auguste",
    metadata: {
      previous_score: 78,
      new_score: 82
    },
    created_at: "2026-03-12T15:10:00.000Z"
  },
  {
    id: "activity-003",
    actor_id: "profile-bonnie",
    actor_name: "Bonnie Martin",
    actor_type: "user",
    action: "status_changed",
    entity_id: "salon-005",
    entity_type: "salon",
    entity_name: "Le Cercle Beauté",
    metadata: {
      from_status: "nouveau",
      to_status: "contacte"
    },
    created_at: "2026-03-12T14:48:00.000Z"
  },
  {
    id: "activity-004",
    actor_id: null,
    actor_name: "OutreachPilot",
    actor_type: "agent",
    action: "outreach_sent",
    entity_id: "salon-001",
    entity_type: "salon",
    entity_name: "Maison Héritage",
    metadata: {
      sequence_name: "Wella relance premium"
    },
    created_at: "2026-03-12T14:06:00.000Z"
  },
  {
    id: "activity-005",
    actor_id: "profile-marie-pierre",
    actor_name: "Marie-Pierre Laurent",
    actor_type: "user",
    action: "note_added",
    entity_id: "salon-002",
    entity_type: "salon",
    entity_name: "Atelier Varenne",
    metadata: {
      note_excerpt: "Décideuse disponible vendredi 11h"
    },
    created_at: "2026-03-12T13:29:00.000Z"
  },
  {
    id: "activity-006",
    actor_id: null,
    actor_name: "DataScout",
    actor_type: "agent",
    action: "contact_added",
    entity_id: "salon-004",
    entity_type: "salon",
    entity_name: "L'Appartement Coiffure",
    metadata: {
      contact_name: "Claire Dupont"
    },
    created_at: "2026-03-12T12:42:00.000Z"
  },
  {
    id: "activity-007",
    actor_id: null,
    actor_name: "QualityGuard",
    actor_type: "agent",
    action: "status_changed",
    entity_id: "salon-008",
    entity_type: "salon",
    entity_name: "Galerie du Cheveu",
    metadata: {
      from_status: "contacte",
      to_status: "interesse"
    },
    created_at: "2026-03-12T11:58:00.000Z"
  },
  {
    id: "activity-008",
    actor_id: null,
    actor_name: "BrandMatcher",
    actor_type: "agent",
    action: "scored",
    entity_id: "salon-001",
    entity_type: "salon",
    entity_name: "Maison Héritage",
    metadata: {
      brand_name: "Wella"
    },
    created_at: "2026-03-12T10:37:00.000Z"
  },
  {
    id: "activity-009",
    actor_id: "profile-bonnie",
    actor_name: "Bonnie Martin",
    actor_type: "user",
    action: "contact_added",
    entity_id: "salon-003",
    entity_type: "salon",
    entity_name: "Studio Auguste",
    metadata: {
      contact_name: "Camille Roche"
    },
    created_at: "2026-03-12T09:51:00.000Z"
  },
  {
    id: "activity-010",
    actor_id: null,
    actor_name: "EnrichBot",
    actor_type: "agent",
    action: "enriched",
    entity_id: "salon-004",
    entity_type: "salon",
    entity_name: "L'Appartement Coiffure",
    metadata: {
      email_found: true,
      rating_found: true
    },
    created_at: "2026-03-12T08:24:00.000Z"
  }
];
