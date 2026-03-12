import { mockAgentActionIds, mockApprovalIds, mockSalonIds } from "./ids";
import type { ActivityLogRow } from "./types";

export const mockActivityLog: ActivityLogRow[] = [
  {
    id: "dddd0001-0000-4000-8000-000000000001",
    actor_type: "user",
    actor_name: "Bonnie",
    action: "approval.approved",
    entity_type: "approval",
    entity_id: mockApprovalIds.brandProposalMaisonTressee,
    old_value: { status: "pending" },
    new_value: { status: "approved", reviewer_name: "Bonnie" },
    metadata: {
      approval_type: "brand_proposal",
      salon_id: mockSalonIds.maisonTressee,
      brand_name: "Schwarzkopf"
    },
    created_at: "2026-03-12T08:56:00.000Z"
  },
  {
    id: "dddd0002-0000-4000-8000-000000000002",
    actor_type: "user",
    actor_name: "Bonnie",
    action: "agent_action.approved",
    entity_type: "agent_action",
    entity_id: mockAgentActionIds.draftEmailMaisonTressee,
    old_value: { status: "pending" },
    new_value: { status: "approved", approved_by: "Bonnie" },
    metadata: {
      action_type: "draft_email",
      salon_id: mockSalonIds.maisonTressee
    },
    created_at: "2026-03-12T08:49:00.000Z"
  },
  {
    id: "dddd0003-0000-4000-8000-000000000003",
    actor_type: "agent",
    actor_name: "outreachpilot",
    action: "approval.requested",
    entity_type: "approval",
    entity_id: mockApprovalIds.bulkOutreachMarch12,
    old_value: null,
    new_value: { status: "pending", estimated_send_count: 18 },
    metadata: {
      approval_type: "bulk_outreach",
      channel: "email"
    },
    created_at: "2026-03-12T08:44:00.000Z"
  },
  {
    id: "dddd0004-0000-4000-8000-000000000004",
    actor_type: "agent",
    actor_name: "outreachpilot",
    action: "outreach.draft_generated",
    entity_type: "agent_action",
    entity_id: mockAgentActionIds.draftEmailAtelierColoriste,
    old_value: null,
    new_value: { status: "pending", subject: "Jeudi : 15 min pour parler Wella x Atelier Coloriste ?" },
    metadata: {
      salon_id: mockSalonIds.atelierColoriste,
      channel: "email"
    },
    created_at: "2026-03-12T08:41:00.000Z"
  },
  {
    id: "dddd0005-0000-4000-8000-000000000005",
    actor_type: "user",
    actor_name: "Marie-Pierre",
    action: "salon.status_changed",
    entity_type: "salon",
    entity_id: mockSalonIds.maisonTressee,
    old_value: { status: "interesse" },
    new_value: { status: "negociation" },
    metadata: {
      reason: "Le salon a validé la grille de conditions à discuter",
      source: "manual_review"
    },
    created_at: "2026-03-12T08:30:00.000Z"
  },
  {
    id: "dddd0006-0000-4000-8000-000000000006",
    actor_type: "user",
    actor_name: "Marie-Pierre",
    action: "agent_action.approved",
    entity_type: "agent_action",
    entity_id: mockAgentActionIds.updateScoreMaisonNacree,
    old_value: { status: "pending" },
    new_value: { status: "approved", approved_by: "Marie-Pierre" },
    metadata: {
      salon_id: mockSalonIds.maisonNacree,
      score_delta: 19
    },
    created_at: "2026-03-12T08:18:00.000Z"
  },
  {
    id: "dddd0007-0000-4000-8000-000000000007",
    actor_type: "agent",
    actor_name: "scoremaster",
    action: "score.updated",
    entity_type: "salon",
    entity_id: mockSalonIds.maisonNacree,
    old_value: { score: 44 },
    new_value: { score: 63 },
    metadata: {
      drivers: ["site_web_identifie", "email_valide", "google_reviews_positifs"]
    },
    created_at: "2026-03-12T08:16:00.000Z"
  },
  {
    id: "dddd0008-0000-4000-8000-000000000008",
    actor_type: "user",
    actor_name: "Marie-Pierre",
    action: "approval.rejected",
    entity_type: "approval",
    entity_id: mockApprovalIds.leadMergeMaisonNacree,
    old_value: { status: "pending" },
    new_value: { status: "rejected" },
    metadata: {
      approval_type: "lead_merge",
      reason: "revue manuelle demandée"
    },
    created_at: "2026-03-12T07:10:00.000Z"
  },
  {
    id: "dddd0009-0000-4000-8000-000000000009",
    actor_type: "user",
    actor_name: "Marie-Pierre",
    action: "agent_action.rejected",
    entity_type: "agent_action",
    entity_id: mockAgentActionIds.discoverDuplicateAtelierDuLac,
    old_value: { status: "pending" },
    new_value: { status: "rejected" },
    metadata: {
      salon_id: mockSalonIds.atelierDuLac,
      reason: "similarité insuffisante pour fusion"
    },
    created_at: "2026-03-12T07:10:00.000Z"
  },
  {
    id: "dddd0010-0000-4000-8000-000000000010",
    actor_type: "system",
    actor_name: "auto-rules",
    action: "agent_action.auto_approved",
    entity_type: "agent_action",
    entity_id: mockAgentActionIds.enrichAppartementCoiffure,
    old_value: { status: "pending" },
    new_value: { status: "auto_approved" },
    metadata: {
      salon_id: mockSalonIds.appartementCoiffure,
      rule: "safe_enrichment_fields_only"
    },
    created_at: "2026-03-11T17:06:00.000Z"
  }
] satisfies ActivityLogRow[];
