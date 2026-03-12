export type ScoringRule = {
  id: string;
  criteria: string;
  category: string;
  points: number;
  description: string;
  active: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales" | "Ops" | "Analyst";
  lastLogin: string;
  active: boolean;
};

export type AgentKey = {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string;
  active: boolean;
};

export const scoringRules: ScoringRule[] = [
  {
    id: "rule-01",
    criteria: "Téléphone détecté",
    category: "Complétude",
    points: 8,
    description: "Présence d’un numéro exploitable pour appel ou WhatsApp.",
    active: true
  },
  {
    id: "rule-02",
    criteria: "Website actif",
    category: "Complétude",
    points: 7,
    description: "Site web fonctionnel avec informations à jour.",
    active: true
  },
  {
    id: "rule-03",
    criteria: "Email vérifié",
    category: "Complétude",
    points: 9,
    description: "Adresse email directe ou générique vérifiée.",
    active: true
  },
  {
    id: "rule-04",
    criteria: "Google rating > 4.5",
    category: "Réputation",
    points: 12,
    description: "Excellence perçue via la note Google.",
    active: true
  },
  {
    id: "rule-05",
    criteria: "50+ avis Google",
    category: "Réputation",
    points: 10,
    description: "Preuve de traction et volume d’avis suffisant.",
    active: true
  },
  {
    id: "rule-06",
    criteria: "Instagram actif",
    category: "Digital",
    points: 6,
    description: "Compte avec contenu récent et univers cohérent.",
    active: true
  },
  {
    id: "rule-07",
    criteria: "Positionnement premium",
    category: "Brand fit",
    points: 14,
    description: "Signaux premium via offre, localisation et image.",
    active: true
  },
  {
    id: "rule-08",
    criteria: "Taille équipe > 6",
    category: "Business",
    points: 8,
    description: "Capacité opérationnelle suffisante pour absorber une marque.",
    active: true
  },
  {
    id: "rule-09",
    criteria: "Ville prioritaire",
    category: "Market",
    points: 9,
    description: "Salon situé dans une zone à forte priorité commerciale.",
    active: true
  },
  {
    id: "rule-10",
    criteria: "Déjà intéressé",
    category: "Intent",
    points: 15,
    description: "Signal explicite d’intérêt ou réponse positive à un outreach.",
    active: true
  },
  {
    id: "rule-11",
    criteria: "Sans doublon CRM",
    category: "Qualité data",
    points: 4,
    description: "Aucun doublon détecté dans la base salons.",
    active: true
  },
  {
    id: "rule-12",
    criteria: "Blacklist franchise",
    category: "Exclusion",
    points: -30,
    description: "Pénalité si le salon appartient à une franchise blacklistée.",
    active: true
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "team-01",
    name: "Bonnie Martin",
    email: "bonnie@laloge.fr",
    role: "Sales",
    lastLogin: "2026-03-12T08:15:00",
    active: true
  },
  {
    id: "team-02",
    name: "Marie-Pierre Laurent",
    email: "mp@laloge.fr",
    role: "Sales",
    lastLogin: "2026-03-12T09:05:00",
    active: true
  },
  {
    id: "team-03",
    name: "Ludovic Goutel",
    email: "ludovic@orchestraintelligence.fr",
    role: "Admin",
    lastLogin: "2026-03-12T17:40:00",
    active: true
  },
  {
    id: "team-04",
    name: "Camille Data",
    email: "camille@laloge.fr",
    role: "Analyst",
    lastLogin: "2026-03-11T18:10:00",
    active: true
  },
  {
    id: "team-05",
    name: "Amina Ops",
    email: "amina@laloge.fr",
    role: "Ops",
    lastLogin: "2026-03-09T11:30:00",
    active: false
  }
];

export const agentKeys: AgentKey[] = [
  {
    id: "agent-01",
    name: "DataScout",
    key: "lg_ds_5f4c…91a2",
    permissions: ["read:salons", "write:prospecting_runs"],
    lastUsed: "2026-03-12T17:25:00",
    active: true
  },
  {
    id: "agent-02",
    name: "EnrichBot",
    key: "lg_en_18be…eac4",
    permissions: ["read:salons", "write:contacts", "write:activity_log"],
    lastUsed: "2026-03-12T16:58:00",
    active: true
  },
  {
    id: "agent-03",
    name: "ScoreMaster",
    key: "lg_sm_98ca…c102",
    permissions: ["read:salons", "write:brand_salon_scores"],
    lastUsed: "2026-03-12T15:40:00",
    active: true
  },
  {
    id: "agent-04",
    name: "OutreachPilot",
    key: "lg_op_0baf…7721",
    permissions: ["read:contacts", "write:outreach", "write:campaigns"],
    lastUsed: "2026-03-12T14:18:00",
    active: true
  },
  {
    id: "agent-05",
    name: "BrandMatcher",
    key: "lg_bm_aa71…4e33",
    permissions: ["read:brands", "write:brand_salon_scores", "read:salons"],
    lastUsed: "2026-03-11T22:15:00",
    active: false
  }
];

export const agentAutoRules = [
  {
    id: "auto-01",
    rule: "EnrichBot enrich_basic",
    description: "Auto-approve les enrichissements basiques sans conflit.",
    active: true
  },
  {
    id: "auto-02",
    rule: "ScoreMaster recompute_single",
    description: "Auto-approve les recalculs unitaires lancés depuis une fiche salon.",
    active: true
  },
  {
    id: "auto-03",
    rule: "OutreachPilot draft_template_preview",
    description: "Auto-approve les prévisualisations sans envoi réel.",
    active: false
  }
];
