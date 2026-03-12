import type { ApprovalRow } from "./types";

export const mockApprovals: ApprovalRow[] = [
  {
    id: "approval-001",
    agent_action_id: "agent-action-001",
    status: "pending",
    requested_by: "OutreachPilot",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-12T15:20:00.000Z",
    updated_at: "2026-03-12T15:20:00.000Z"
  },
  {
    id: "approval-002",
    agent_action_id: "agent-action-002",
    status: "pending",
    requested_by: "ScoreMaster",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-12T14:57:00.000Z",
    updated_at: "2026-03-12T14:57:00.000Z"
  },
  {
    id: "approval-003",
    agent_action_id: "agent-action-003",
    status: "pending",
    requested_by: "DataScout",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-12T13:52:00.000Z",
    updated_at: "2026-03-12T13:52:00.000Z"
  },
  {
    id: "approval-004",
    agent_action_id: "agent-action-004",
    status: "pending",
    requested_by: "BrandMatcher",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-12T12:31:00.000Z",
    updated_at: "2026-03-12T12:31:00.000Z"
  },
  {
    id: "approval-005",
    agent_action_id: "agent-action-005",
    status: "pending",
    requested_by: "QualityGuard",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "2026-03-12T11:44:00.000Z",
    updated_at: "2026-03-12T11:44:00.000Z"
  },
  {
    id: "approval-006",
    agent_action_id: "agent-action-006",
    status: "approved",
    requested_by: "OutreachPilot",
    reviewed_by: "profile-bonnie",
    reviewed_at: "2026-03-11T17:40:00.000Z",
    created_at: "2026-03-11T17:12:00.000Z",
    updated_at: "2026-03-11T17:40:00.000Z"
  }
];
