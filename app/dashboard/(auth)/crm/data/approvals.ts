import { mockApprovalIds, mockAgentActionIds, mockProfileIds, mockSalonIds } from "./ids";
import type { ApprovalRow } from "./types";

export const mockApprovals: ApprovalRow[] = [
  {
    id: mockApprovalIds.bulkOutreachMarch12,
    type: "bulk_outreach",
    title: "Valider l’envoi de 18 emails — relance salons premium",
    description:
      "OutreachPilot propose d’envoyer une relance personnalisée aux salons scorés > 70 avec téléphone validé.",
    requester_type: "agent",
    requester_name: "outreachpilot",
    status: "pending",
    payload: {
      channel: "email",
      sequence_name: "Relance premium J+3",
      salon_ids: [mockSalonIds.maisonTressee, mockSalonIds.atelierColoriste, mockSalonIds.appartementCoiffure],
      agent_action_ids: [mockAgentActionIds.draftEmailMaisonTressee, mockAgentActionIds.draftEmailAtelierColoriste],
      estimated_send_count: 18,
      guardrails: {
        unsubscribe_link: true,
        max_daily_volume: 25,
        human_reviewed: false
      }
    },
    reviewer_id: null,
    reviewer_name: null,
    review_comment: null,
    reviewed_at: null,
    expires_at: "2026-03-14T08:44:00.000Z",
    executed: false,
    executed_at: null,
    execution_result: null,
    created_at: "2026-03-12T08:44:00.000Z",
    updated_at: "2026-03-12T08:44:00.000Z"
  },
  {
    id: mockApprovalIds.brandProposalMaisonTressee,
    type: "brand_proposal",
    title: "Partager le dossier Maison Tressée à Schwarzkopf",
    description:
      "BrandMatcher recommande un partage immédiat du dossier avec mise en avant expertise coloration et panier premium.",
    requester_type: "agent",
    requester_name: "brandmatcher",
    status: "approved",
    payload: {
      salon_id: mockSalonIds.maisonTressee,
      brand_name: "Schwarzkopf",
      dossier_status: "ready",
      expected_value_eur: 14500,
      rationale: "Fit très fort sur image premium, taille d’équipe et présence digitale."
    },
    reviewer_id: mockProfileIds.bonnie,
    reviewer_name: "Bonnie",
    review_comment: "OK pour envoi aujourd’hui, mais garder Wella en plan B.",
    reviewed_at: "2026-03-12T08:56:00.000Z",
    expires_at: "2026-03-14T08:15:00.000Z",
    executed: true,
    executed_at: "2026-03-12T09:02:00.000Z",
    execution_result: {
      proposal_status: "sent",
      notification_sent: true
    },
    created_at: "2026-03-12T08:15:00.000Z",
    updated_at: "2026-03-12T09:02:00.000Z"
  },
  {
    id: mockApprovalIds.leadMergeMaisonNacree,
    type: "lead_merge",
    title: "Fusionner un doublon détecté pour Maison Nacrée",
    description:
      "DataScout 2026 a repéré une fiche potentiellement dupliquée après import datagouv + Google.",
    requester_type: "agent",
    requester_name: "datascout-2026",
    status: "rejected",
    payload: {
      primary_salon_id: mockSalonIds.maisonNacree,
      duplicate_candidate: {
        external_name: "Maison Nacree Lille",
        city: "Lille",
        source: "google"
      },
      confidence: 0.81
    },
    reviewer_id: mockProfileIds.mariePierre,
    reviewer_name: "Marie-Pierre",
    review_comment: "Conserver les deux entrées pour contrôle manuel demain.",
    reviewed_at: "2026-03-12T07:10:00.000Z",
    expires_at: "2026-03-14T06:40:00.000Z",
    executed: false,
    executed_at: null,
    execution_result: null,
    created_at: "2026-03-12T06:40:00.000Z",
    updated_at: "2026-03-12T07:10:00.000Z"
  },
  {
    id: mockApprovalIds.campaignSendAudit,
    type: "campaign_send",
    title: "Déclencher la campagne “Audit digital offert”",
    description:
      "Séquence de réactivation destinée aux salons enrichis sans réponse depuis 14 jours.",
    requester_type: "user",
    requester_name: "Bonnie",
    status: "expired",
    payload: {
      audience_size: 42,
      channel: "email",
      campaign_name: "Audit digital offert",
      segment: "enriched_no_reply_14d"
    },
    reviewer_id: null,
    reviewer_name: null,
    review_comment: null,
    reviewed_at: null,
    expires_at: "2026-03-11T18:00:00.000Z",
    executed: false,
    executed_at: null,
    execution_result: null,
    created_at: "2026-03-09T18:00:00.000Z",
    updated_at: "2026-03-11T18:01:00.000Z"
  },
  {
    id: mockApprovalIds.pricingChangeSignature,
    type: "pricing_change",
    title: "Ajuster la commission de lancement — Salon Signature Nice",
    description:
      "Proposition d’ajustement temporaire pour faciliter la signature finale du package onboarding.",
    requester_type: "user",
    requester_name: "Marie-Pierre",
    status: "pending",
    payload: {
      salon_id: mockSalonIds.salonSignature,
      current_commission_percent: 18,
      proposed_commission_percent: 15,
      valid_until: "2026-03-15T23:59:00.000Z",
      reason: "Accélérer la mise en route du partenariat et capter la première commande trimestrielle."
    },
    reviewer_id: null,
    reviewer_name: null,
    review_comment: null,
    reviewed_at: null,
    expires_at: "2026-03-14T11:30:00.000Z",
    executed: false,
    executed_at: null,
    execution_result: null,
    created_at: "2026-03-12T11:30:00.000Z",
    updated_at: "2026-03-12T11:30:00.000Z"
  }
] satisfies ApprovalRow[];
