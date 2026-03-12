export type SalonStatus =
  | "nouveau"
  | "contacte"
  | "interesse"
  | "rdv_planifie"
  | "negociation"
  | "gagne"
  | "perdu"
  | "client_actif";

export type EnrichmentStatus = "pending" | "enriched" | "failed" | "complete";

export type ActivityAction =
  | "enriched"
  | "scored"
  | "status_changed"
  | "outreach_sent"
  | "note_added"
  | "contact_added"
  | "approval.approved"
  | "approval.requested"
  | "approval.rejected"
  | "agent_action.approved"
  | "agent_action.rejected"
  | "agent_action.auto_approved"
  | "outreach.draft_generated"
  | "salon.status_changed"
  | "score.updated";

export type EntityType = "salon" | "brand" | "contact" | "outreach" | "approval" | "agent_action";

export type ActorType = "agent" | "user" | "system";

export type AgentName =
  | "DataScout"
  | "EnrichBot"
  | "ScoreMaster"
  | "OutreachPilot"
  | "QualityGuard"
  | "BrandMatcher";

export type AgentActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "auto_approved";

export type AgentActionType =
  | "update_status"
  | "launch_outreach"
  | "create_contact"
  | "assign_brand"
  | "schedule_followup"
  | "generate_dossier"
  | "draft_email"
  | "match_proposal"
  | "update_score"
  | "enrich_data"
  | "discover_salon"
  | "status_change"
  | "contact_add";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalonRow {
  id: string;
  name: string;
  city: string;
  postal_code: string | null;
  department: string | null;
  region: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  instagram?: string | null;
  instagram_followers?: number | null;
  facebook?: string | null;
  planity_url?: string | null;
  google_place_id?: string | null;
  status: SalonStatus;
  score: number | null;
  google_rating: number | null;
  google_reviews_count?: number | null;
  siret?: string | null;
  naf_code?: string | null;
  legal_form?: string | null;
  owner_name?: string | null;
  team_size?: number | null;
  notes?: string | null;
  source?: string | null;
  enrichment_status: EnrichmentStatus;
  last_enriched_at?: string | null;
  converted_at?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown> | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ActivityLogRow {
  id: string;
  actor_id?: string | null;
  actor_name: string;
  actor_type: ActorType;
  action: ActivityAction;
  entity_id: string;
  entity_type: EntityType;
  entity_name?: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AgentActionRow {
  id: string;
  agent_name?: AgentName | string;
  agent_id?: string;
  agent_world_run_id?: string | null;
  action_type: AgentActionType;
  entity_id?: string;
  entity_type?: EntityType;
  entity_name?: string;
  target_id?: string;
  target_type?: EntityType;
  status: AgentActionStatus;
  approval_reason?: string | null;
  payload: Record<string, unknown> | null;
  priority?: number | null;
  approved_by?: string | null;
  approved_at?: string | null;
  rejected_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApprovalRow {
  id: string;
  agent_action_id?: string;
  type?: string;
  title?: string;
  description?: string;
  requester_type?: "agent" | "user";
  requester_name?: string;
  requested_by?: AgentName;
  status: ApprovalStatus;
  payload?: Record<string, unknown> | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  reviewed_by_name?: string | null;
  reviewer_id?: string | null;
  reviewer_name?: string | null;
  review_comment?: string | null;
  expires_at?: string | null;
  executed?: boolean;
  executed_at?: string | null;
  execution_result?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
