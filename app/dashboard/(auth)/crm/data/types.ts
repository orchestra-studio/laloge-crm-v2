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

export type ActivityAction = string;
export type EntityType = string;
export type ActorType = "agent" | "user" | "system" | string;
export type AgentName = string;

export type AgentActionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "auto_approved"
  | string;

export type AgentActionType = string;
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | string;

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
  entity_name?: string | null;
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
  entity_name?: string | null;
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
  requester_type?: "agent" | "user" | string;
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
