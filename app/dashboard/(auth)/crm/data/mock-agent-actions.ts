import type { AgentActionRow } from "./types";

export const mockAgentActions: AgentActionRow[] = [
  {
    id: "agent-action-001",
    agent_name: "OutreachPilot",
    action_type: "launch_outreach",
    entity_id: "salon-001",
    entity_type: "salon",
    entity_name: "Maison Héritage",
    status: "pending",
    approval_reason: "Le score dépasse 90 et le contact email a été validé cette nuit.",
    payload: {
      sequence_name: "Wella - premium avril",
      channel: "email"
    },
    created_at: "2026-03-12T15:20:00.000Z",
    updated_at: "2026-03-12T15:20:00.000Z"
  },
  {
    id: "agent-action-002",
    agent_name: "ScoreMaster",
    action_type: "update_status",
    entity_id: "salon-003",
    entity_type: "salon",
    entity_name: "Studio Auguste",
    status: "pending",
    approval_reason: "Le salon dépasse maintenant le seuil de qualification Wella (score 82).",
    payload: {
      from_status: "contacte",
      to_status: "interesse"
    },
    created_at: "2026-03-12T14:57:00.000Z",
    updated_at: "2026-03-12T14:57:00.000Z"
  },
  {
    id: "agent-action-003",
    agent_name: "DataScout",
    action_type: "create_contact",
    entity_id: "salon-004",
    entity_type: "salon",
    entity_name: "L'Appartement Coiffure",
    status: "pending",
    approval_reason: "Un nouveau contact décisionnaire a été détecté sur LinkedIn et sur le site du salon.",
    payload: {
      contact_name: "Claire Dupont",
      role: "Directrice"
    },
    created_at: "2026-03-12T13:52:00.000Z",
    updated_at: "2026-03-12T13:52:00.000Z"
  },
  {
    id: "agent-action-004",
    agent_name: "BrandMatcher",
    action_type: "assign_brand",
    entity_id: "salon-002",
    entity_type: "salon",
    entity_name: "Atelier Varenne",
    status: "pending",
    approval_reason: "Correspondance forte avec le profil Schwarzkopf et intérêt confirmé en rendez-vous.",
    payload: {
      brand_name: "Schwarzkopf",
      confidence_score: 0.92
    },
    created_at: "2026-03-12T12:31:00.000Z",
    updated_at: "2026-03-12T12:31:00.000Z"
  },
  {
    id: "agent-action-005",
    agent_name: "QualityGuard",
    action_type: "schedule_followup",
    entity_id: "salon-005",
    entity_type: "salon",
    entity_name: "Le Cercle Beauté",
    status: "pending",
    approval_reason: "Aucune relance enregistrée depuis 6 jours malgré un intérêt détecté sur la séquence.",
    payload: {
      due_at: "2026-03-13T09:30:00.000Z",
      owner_id: "profile-bonnie"
    },
    created_at: "2026-03-12T11:44:00.000Z",
    updated_at: "2026-03-12T11:44:00.000Z"
  },
  {
    id: "agent-action-006",
    agent_name: "OutreachPilot",
    action_type: "launch_outreach",
    entity_id: "salon-008",
    entity_type: "salon",
    entity_name: "Galerie du Cheveu",
    status: "approved",
    approval_reason: "Prêt pour la relance de rattrapage Myspa.",
    payload: {
      sequence_name: "Myspa - relance douce"
    },
    created_at: "2026-03-11T17:12:00.000Z",
    updated_at: "2026-03-11T17:40:00.000Z"
  },
  {
    id: "agent-action-007",
    agent_name: "ScoreMaster",
    action_type: "generate_dossier",
    entity_id: "salon-007",
    entity_type: "salon",
    entity_name: "Maison Kintsugi",
    status: "executed",
    approval_reason: "Le salon est passé en gagné, dossier client prêt à être créé.",
    payload: {
      template: "pilot-brand"
    },
    created_at: "2026-03-11T10:04:00.000Z",
    updated_at: "2026-03-11T10:18:00.000Z"
  }
];
