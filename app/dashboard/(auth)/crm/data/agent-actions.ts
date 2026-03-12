import { mockAgentActionIds, mockSalonIds } from "./ids";
import type { AgentActionRow } from "./types";

export const mockAgentActions: AgentActionRow[] = [
  {
    id: mockAgentActionIds.draftEmailAtelierColoriste,
    agent_id: "outreachpilot",
    agent_world_run_id: "run_outreach_20260312_0840",
    action_type: "draft_email",
    target_type: "salon",
    target_id: mockSalonIds.atelierColoriste,
    payload: {
      salon_name: "Atelier Coloriste Montchat",
      channel: "email",
      subject: "Jeudi : 15 min pour parler Wella x Atelier Coloriste ?",
      preview_text: "Une proposition simple, calibrée pour votre salon et votre équipe.",
      body: "Bonjour Sarah, suite à notre échange, je vous partage une proposition courte et concrète pour structurer un partenariat Wella adapté à l’Atelier Coloriste.",
      reasoning: "Le salon a confirmé un RDV, le draft vise à préparer la suite immédiate après la visio.",
      next_step: "send_after_meeting"
    },
    status: "pending",
    priority: 9,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T08:41:00.000Z",
    updated_at: "2026-03-12T08:41:00.000Z"
  },
  {
    id: mockAgentActionIds.brandMatchMaisonTressee,
    agent_id: "brandmatcher",
    agent_world_run_id: "run_match_20260312_0810",
    action_type: "match_proposal",
    target_type: "salon",
    target_id: mockSalonIds.maisonTressee,
    payload: {
      salon_name: "Maison Tressée",
      brand_name: "Schwarzkopf",
      compatibility_score: 91,
      rationale: [
        "Equipe de 14 personnes",
        "Positionnement premium cohérent",
        "Excellente réputation Google",
        "Présence Instagram forte"
      ],
      dossier_recommended: true
    },
    status: "pending",
    priority: 8,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T08:12:00.000Z",
    updated_at: "2026-03-12T08:12:00.000Z"
  },
  {
    id: mockAgentActionIds.updateScoreMaisonNacree,
    agent_id: "scoremaster",
    agent_world_run_id: "run_score_20260312_0815",
    action_type: "update_score",
    target_type: "salon",
    target_id: mockSalonIds.maisonNacree,
    payload: {
      salon_name: "Maison Nacrée",
      previous_score: 44,
      new_score: 63,
      delta: 19,
      drivers: ["site_web_identifie", "email_valide", "google_reviews_positifs"]
    },
    status: "approved",
    priority: 6,
    approved_by: "Marie-Pierre",
    approved_at: "2026-03-12T08:18:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T08:16:00.000Z",
    updated_at: "2026-03-12T08:18:00.000Z"
  },
  {
    id: mockAgentActionIds.enrichAppartementCoiffure,
    agent_id: "enrichbot",
    agent_world_run_id: "run_enrich_20260311_1700",
    action_type: "enrich_data",
    target_type: "salon",
    target_id: mockSalonIds.appartementCoiffure,
    payload: {
      salon_name: "L’Appartement Coiffure",
      fields_updated: ["instagram_followers", "planity_url", "owner_name", "team_size"],
      confidence: 0.96,
      sources: ["website", "instagram", "planity"]
    },
    status: "auto_approved",
    priority: 5,
    approved_by: "system:auto-rules",
    approved_at: "2026-03-11T17:06:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-11T17:05:00.000Z",
    updated_at: "2026-03-11T17:06:00.000Z"
  },
  {
    id: mockAgentActionIds.discoverDuplicateAtelierDuLac,
    agent_id: "datascout-2026",
    agent_world_run_id: "run_discover_20260312_0635",
    action_type: "discover_salon",
    target_type: "salon",
    target_id: mockSalonIds.atelierDuLac,
    payload: {
      salon_name: "Atelier du Lac",
      source: "google",
      candidate_type: "duplicate",
      similarity_score: 0.81,
      city: "Annecy"
    },
    status: "rejected",
    priority: 3,
    approved_by: "Marie-Pierre",
    approved_at: "2026-03-12T07:10:00.000Z",
    rejected_reason: "Conserver en revue manuelle, score de similarité insuffisant pour fusion.",
    created_at: "2026-03-12T06:36:00.000Z",
    updated_at: "2026-03-12T07:10:00.000Z"
  },
  {
    id: mockAgentActionIds.statusChangeStudioBalmain,
    agent_id: "outreachpilot",
    agent_world_run_id: "run_outreach_20260312_0650",
    action_type: "status_change",
    target_type: "salon",
    target_id: mockSalonIds.studioBalmain,
    payload: {
      salon_name: "Studio Balmain Marseille",
      from_status: "contacte",
      to_status: "interesse",
      trigger: "positive_phone_response",
      confidence: 0.74
    },
    status: "pending",
    priority: 7,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T06:51:00.000Z",
    updated_at: "2026-03-12T06:51:00.000Z"
  },
  {
    id: mockAgentActionIds.contactAddAppartementCoiffure,
    agent_id: "contactbuilder",
    agent_world_run_id: "run_contact_20260311_1720",
    action_type: "contact_add",
    target_type: "salon",
    target_id: mockSalonIds.appartementCoiffure,
    payload: {
      salon_name: "L’Appartement Coiffure",
      contact: {
        first_name: "Mélanie",
        last_name: "Costa",
        role: "gérante",
        email: "melanie@appartementcoiffure.fr",
        phone: "0611223344",
        is_decision_maker: true
      }
    },
    status: "pending",
    priority: 6,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-11T17:22:00.000Z",
    updated_at: "2026-03-11T17:22:00.000Z"
  },
  {
    id: mockAgentActionIds.draftEmailMaisonTressee,
    agent_id: "outreachpilot",
    agent_world_run_id: "run_outreach_20260312_0838",
    action_type: "draft_email",
    target_type: "salon",
    target_id: mockSalonIds.maisonTressee,
    payload: {
      salon_name: "Maison Tressée",
      channel: "email",
      subject: "Maison Tressée × Schwarzkopf : proposition finale",
      preview_text: "Une version resserrée de la proposition avant validation de votre côté.",
      body: "Bonjour Camille, comme convenu, voici la version consolidée de la proposition Schwarzkopf, ajustée pour votre rythme d’équipe et votre volume couleur.",
      reasoning: "Le salon est en négociation avancée. Le draft sert de support à la closing sequence.",
      next_step: "send_today_if_approved"
    },
    status: "approved",
    priority: 10,
    approved_by: "Bonnie",
    approved_at: "2026-03-12T08:49:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T08:39:00.000Z",
    updated_at: "2026-03-12T08:49:00.000Z"
  }
] satisfies AgentActionRow[];
