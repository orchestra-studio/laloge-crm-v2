export type AgentId =
  | "datascout"
  | "datascout-2026"
  | "enrichbot"
  | "scoremaster"
  | "brandmatcher"
  | "outreachpilot"
  | "qualityguard";

export type AgentActionType =
  | "discover_salon"
  | "enrich_salon"
  | "score_salon"
  | "match_brand"
  | "send_outreach";

export type AgentActionStatus = "pending" | "approved" | "rejected" | "auto_approved";

export type AgentActionPayload = {
  salon_name?: string;
  brand_name?: string;
  city?: string;
  reasoning: string;
  source?: string;
  channel?: "email" | "whatsapp" | "phone";
  template_name?: string;
  fields_detected?: string[];
  previous_score?: number;
  new_score?: number;
  compatibility_score?: number;
  confidence?: number;
  notes?: string;
};

export type AgentAction = {
  id: string;
  agent_id: AgentId;
  action_type: AgentActionType;
  target_type: "salon" | "brand";
  target_id: string;
  payload: AgentActionPayload;
  status: AgentActionStatus;
  priority: number;
  approved_by: string | null;
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
};

export const mockAgentActions: AgentAction[] = [
  {
    id: "action_001",
    agent_id: "datascout-2026",
    action_type: "discover_salon",
    target_type: "salon",
    target_id: "salon_maison_aurore",
    payload: {
      salon_name: "Maison Aurore",
      city: "Paris",
      source: "Google Maps + Instagram",
      confidence: 0.93,
      reasoning:
        "Salon indépendant premium détecté dans le 11e avec 4,9/5 sur Google, un Instagram actif et aucune franchise identifiée. Le profil mérite une entrée immédiate dans le pipe commercial.",
      notes: "Positionnement couleur premium, équipe estimée à 7 personnes."
    },
    status: "pending",
    priority: 5,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T16:24:00.000Z",
    updated_at: "2026-03-12T16:24:00.000Z"
  },
  {
    id: "action_002",
    agent_id: "enrichbot",
    action_type: "enrich_salon",
    target_type: "salon",
    target_id: "salon_studio_nacre",
    payload: {
      salon_name: "Studio Nacré",
      city: "Lyon",
      source: "Google Business + Planity",
      confidence: 0.91,
      fields_detected: ["phone", "website", "owner_name"],
      reasoning:
        "Le téléphone direct, le site officiel et le nom de la gérante ont été recoupés sur deux sources fiables. L’enrichissement augmente fortement la qualité de contact de la fiche.",
      notes: "Téléphone mobile préféré pour prise de contact rapide."
    },
    status: "pending",
    priority: 4,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T15:48:00.000Z",
    updated_at: "2026-03-12T15:48:00.000Z"
  },
  {
    id: "action_003",
    agent_id: "scoremaster",
    action_type: "score_salon",
    target_type: "salon",
    target_id: "salon_atelier_opaline",
    payload: {
      salon_name: "Atelier Opaline",
      city: "Bordeaux",
      previous_score: 61,
      new_score: 73,
      confidence: 0.9,
      reasoning:
        "Le score augmente grâce à la hausse du volume d’avis Google, à une offre retail plus visible et à un contenu social mieux aligné avec des marques premium.",
      notes: "Le salon passe dans le top des opportunités régionales."
    },
    status: "approved",
    priority: 3,
    approved_by: "Bonnie",
    approved_at: "2026-03-12T14:40:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T14:18:00.000Z",
    updated_at: "2026-03-12T14:40:00.000Z"
  },
  {
    id: "action_004",
    agent_id: "brandmatcher",
    action_type: "match_brand",
    target_type: "brand",
    target_id: "brand_wella",
    payload: {
      brand_name: "Wella",
      salon_name: "Maison Dahlia",
      city: "Nice",
      compatibility_score: 87,
      confidence: 0.88,
      reasoning:
        "Maison Dahlia coche les critères coloration premium, présence digitale solide et espace cabine. Un rapprochement avec Wella semble prioritaire pour un pilote haut de gamme.",
      notes: "Le salon a déjà une clientèle premium et un bon panier moyen."
    },
    status: "pending",
    priority: 4,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T14:05:00.000Z",
    updated_at: "2026-03-12T14:05:00.000Z"
  },
  {
    id: "action_005",
    agent_id: "outreachpilot",
    action_type: "send_outreach",
    target_type: "salon",
    target_id: "salon_vendome",
    payload: {
      salon_name: "Salon Vendôme",
      city: "Paris",
      channel: "email",
      template_name: "premium_social_proof_v2",
      confidence: 0.86,
      reasoning:
        "Le salon a ouvert trois emails sans répondre. Une relance courte avec preuve sociale, bénéfice clair et CTA unique mérite une validation humaine avant envoi.",
      notes: "Inclut une étude de cas Revlon et une proposition de call de 15 minutes."
    },
    status: "pending",
    priority: 5,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T13:36:00.000Z",
    updated_at: "2026-03-12T13:36:00.000Z"
  },
  {
    id: "action_006",
    agent_id: "qualityguard",
    action_type: "send_outreach",
    target_type: "salon",
    target_id: "salon_studio_epure",
    payload: {
      salon_name: "Studio Épure",
      city: "Paris",
      channel: "email",
      template_name: "promo_push_v1",
      confidence: 0.79,
      reasoning:
        "Le draft d’email pousse une remise trop agressive pour le positionnement premium du salon. Je recommande de bloquer l’envoi en l’état.",
      notes: "Risque de dégrader la perception haut de gamme de La Loge."
    },
    status: "rejected",
    priority: 4,
    approved_by: null,
    approved_at: null,
    rejected_reason:
      "Le message casse le positionnement premium et doit être réécrit avec un angle conseil plutôt que promotion.",
    created_at: "2026-03-12T12:32:00.000Z",
    updated_at: "2026-03-12T12:47:00.000Z"
  },
  {
    id: "action_007",
    agent_id: "datascout",
    action_type: "discover_salon",
    target_type: "salon",
    target_id: "salon_atelier_mirette",
    payload: {
      salon_name: "Atelier Mirette",
      city: "Lille",
      source: "PagesJaunes + site officiel",
      confidence: 0.95,
      reasoning:
        "Nouveau salon indépendant identifié avec téléphone, site, email et réseaux sociaux déjà consolidés. Le niveau de complétude active la règle d’auto-approbation.",
      notes: "Très bon candidat pour de la prospection froide structurée."
    },
    status: "auto_approved",
    priority: 2,
    approved_by: "Règle auto · fiche complète",
    approved_at: "2026-03-12T11:58:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T11:54:00.000Z",
    updated_at: "2026-03-12T11:58:00.000Z"
  },
  {
    id: "action_008",
    agent_id: "enrichbot",
    action_type: "enrich_salon",
    target_type: "salon",
    target_id: "salon_maison_tuileries",
    payload: {
      salon_name: "Maison Tuileries",
      city: "Paris",
      source: "Instagram + mentions légales",
      confidence: 0.89,
      fields_detected: ["team_size", "instagram", "owner_name"],
      reasoning:
        "La taille d’équipe, le compte Instagram vérifié et le nom de la fondatrice sont maintenant confirmés. L’enrichissement rend la fiche prête pour une action commerciale.",
      notes: "Le salon semble très sensible au storytelling de marque."
    },
    status: "approved",
    priority: 2,
    approved_by: "Marie-Pierre",
    approved_at: "2026-03-12T11:32:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T11:10:00.000Z",
    updated_at: "2026-03-12T11:32:00.000Z"
  },
  {
    id: "action_009",
    agent_id: "scoremaster",
    action_type: "score_salon",
    target_type: "salon",
    target_id: "salon_cercle_coiffure",
    payload: {
      salon_name: "Le Cercle Coiffure",
      city: "Nantes",
      previous_score: 82,
      new_score: 84,
      confidence: 0.96,
      reasoning:
        "Ajustement mineur du score après deux nouveaux avis Google et une meilleure fréquence de publication Instagram. Le delta faible autorise une auto-approbation.",
      notes: "Le salon reste dans la short-list haut potentiel."
    },
    status: "auto_approved",
    priority: 1,
    approved_by: "Règle auto · variation mineure",
    approved_at: "2026-03-12T10:42:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T10:40:00.000Z",
    updated_at: "2026-03-12T10:42:00.000Z"
  },
  {
    id: "action_010",
    agent_id: "brandmatcher",
    action_type: "match_brand",
    target_type: "brand",
    target_id: "brand_myspa",
    payload: {
      brand_name: "Myspa",
      salon_name: "Maison Dahlia",
      city: "Nice",
      compatibility_score: 91,
      confidence: 0.92,
      reasoning:
        "Le salon dispose d’un espace bien-être crédible, d’un panier moyen élevé et d’une clientèle premium. Myspa est un match évident à activer rapidement.",
      notes: "Dossier pilote recommandé en priorité."
    },
    status: "approved",
    priority: 3,
    approved_by: "Bonnie",
    approved_at: "2026-03-12T10:08:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T09:44:00.000Z",
    updated_at: "2026-03-12T10:08:00.000Z"
  },
  {
    id: "action_011",
    agent_id: "outreachpilot",
    action_type: "send_outreach",
    target_type: "salon",
    target_id: "salon_nuance_bastille",
    payload: {
      salon_name: "Nuance Bastille",
      city: "Paris",
      channel: "email",
      template_name: "roi_claim_v1",
      confidence: 0.81,
      reasoning:
        "Le mail de relance annonce un gain ROI trop affirmatif sans preuve suffisante. La séquence doit être bloquée avant envoi et repositionnée sur la valeur perçue.",
      notes: "Le salon est sensible aux arguments rationnels, pas aux promesses trop directes."
    },
    status: "rejected",
    priority: 5,
    approved_by: null,
    approved_at: null,
    rejected_reason:
      "La promesse commerciale est trop forte pour un premier message et nécessite un rewrite plus crédible.",
    created_at: "2026-03-12T09:18:00.000Z",
    updated_at: "2026-03-12T09:29:00.000Z"
  },
  {
    id: "action_012",
    agent_id: "datascout-2026",
    action_type: "discover_salon",
    target_type: "salon",
    target_id: "salon_studio_heritage",
    payload: {
      salon_name: "Studio Héritage",
      city: "Marseille",
      source: "Google Maps + annuaire local",
      confidence: 0.84,
      reasoning:
        "Salon multiservices récemment rénové, bonne densité d’avis positifs et aucun signal franchise. La découverte semble suffisamment solide pour entrer en revue manuelle.",
      notes: "Le salon pourrait être intéressant pour Schwarzkopf et Wella."
    },
    status: "pending",
    priority: 3,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T08:54:00.000Z",
    updated_at: "2026-03-12T08:54:00.000Z"
  },
  {
    id: "action_013",
    agent_id: "enrichbot",
    action_type: "enrich_salon",
    target_type: "salon",
    target_id: "salon_maison_leonie",
    payload: {
      salon_name: "Maison Léonie",
      city: "Toulouse",
      source: "Google Business + site officiel",
      confidence: 0.97,
      fields_detected: ["phone", "email", "website"],
      reasoning:
        "Téléphone, site et email principal ont été confirmés sur des sources croisées fiables. L’enrichissement est basique mais complet, donc auto-approuvable.",
      notes: "Prête pour une première séquence outreach."
    },
    status: "auto_approved",
    priority: 3,
    approved_by: "Règle auto · enrichissement basique",
    approved_at: "2026-03-12T08:12:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-12T08:06:00.000Z",
    updated_at: "2026-03-12T08:12:00.000Z"
  },
  {
    id: "action_014",
    agent_id: "scoremaster",
    action_type: "score_salon",
    target_type: "salon",
    target_id: "salon_rive_gauche_coiffure",
    payload: {
      salon_name: "Rive Gauche Coiffure",
      city: "Paris",
      previous_score: 76,
      new_score: 71,
      confidence: 0.87,
      reasoning:
        "Le score doit légèrement baisser car le site n’est plus accessible et le compte Instagram n’a pas publié depuis plusieurs mois. Le signal digital se dégrade.",
      notes: "À surveiller avant de lancer un outreach premium."
    },
    status: "pending",
    priority: 2,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-12T07:46:00.000Z",
    updated_at: "2026-03-12T07:46:00.000Z"
  },
  {
    id: "action_015",
    agent_id: "brandmatcher",
    action_type: "match_brand",
    target_type: "brand",
    target_id: "brand_saint_algue",
    payload: {
      brand_name: "Saint-Algue",
      salon_name: "Maison Alba",
      city: "Montpellier",
      compatibility_score: 42,
      confidence: 0.75,
      reasoning:
        "Le match est faible : le salon travaille déjà avec un concurrent direct, n’a quasiment pas de retail et le positionnement perçu colle mal à la marque ciblée.",
      notes: "Le dossier marque ne créerait pas assez de valeur à court terme."
    },
    status: "rejected",
    priority: 2,
    approved_by: null,
    approved_at: null,
    rejected_reason:
      "Compatibilité trop faible pour créer un dossier marque et mobiliser l’équipe commerciale.",
    created_at: "2026-03-11T18:42:00.000Z",
    updated_at: "2026-03-11T18:58:00.000Z"
  },
  {
    id: "action_016",
    agent_id: "outreachpilot",
    action_type: "send_outreach",
    target_type: "salon",
    target_id: "salon_atelier_lumiere",
    payload: {
      salon_name: "Atelier Lumière",
      city: "Bordeaux",
      channel: "email",
      template_name: "revlon_case_study_v3",
      confidence: 0.9,
      reasoning:
        "Un message très ciblé avec étude de cas Revlon, bénéfice marge et proposition de call semble aligné avec l’historique d’engagement du salon.",
      notes: "Le CTA vise un créneau de 15 minutes avec Bonnie."
    },
    status: "approved",
    priority: 4,
    approved_by: "Marie-Pierre",
    approved_at: "2026-03-11T17:34:00.000Z",
    rejected_reason: null,
    created_at: "2026-03-11T17:06:00.000Z",
    updated_at: "2026-03-11T17:34:00.000Z"
  },
  {
    id: "action_017",
    agent_id: "qualityguard",
    action_type: "send_outreach",
    target_type: "salon",
    target_id: "salon_maison_azur",
    payload: {
      salon_name: "Maison Azur",
      city: "Cannes",
      channel: "email",
      template_name: "exclusive_invitation_v2",
      confidence: 0.83,
      reasoning:
        "Le message respecte globalement la charte, mais contient une notion d’exclusivité à valider humainement avant envoi pour éviter tout sur-claim commercial.",
      notes: "Validation juridique légère recommandée."
    },
    status: "pending",
    priority: 4,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-11T16:18:00.000Z",
    updated_at: "2026-03-11T16:18:00.000Z"
  },
  {
    id: "action_018",
    agent_id: "brandmatcher",
    action_type: "match_brand",
    target_type: "brand",
    target_id: "brand_schwarzkopf",
    payload: {
      brand_name: "Schwarzkopf",
      salon_name: "Atelier Velours",
      city: "Lyon",
      compatibility_score: 88,
      confidence: 0.9,
      reasoning:
        "Atelier Velours coche les critères coloration technique, volume d’équipe supérieur à six et forte présence digitale. Le match Schwarzkopf doit être revu rapidement.",
      notes: "Le salon est en expansion et ouvert à de nouveaux partenariats."
    },
    status: "pending",
    priority: 5,
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: "2026-03-11T15:04:00.000Z",
    updated_at: "2026-03-11T15:04:00.000Z"
  }
];
