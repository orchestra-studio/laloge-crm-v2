export type OutreachChannel = "email" | "phone" | "sms";
export type OutreachStatus =
  | "draft"
  | "scheduled"
  | "sent"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "active"
  | "paused"
  | "completed";

export type SequenceStep = {
  id: string;
  order: number;
  delayDays: number;
  channel: OutreachChannel;
  title: string;
  templateId: string;
  preview: string;
  goal: string;
  sent: number;
  opened: number;
  replied: number;
};

export type SequenceEnrollment = {
  id: string;
  salon: string;
  city: string;
  contact: string;
  owner: string;
  currentStep: number;
  status: "active" | "paused" | "completed" | "replied";
  lastTouchAt: string;
};

export type OutreachSequence = {
  id: string;
  name: string;
  description: string;
  objective: string;
  audience: string;
  brand: string;
  isActive: boolean;
  steps: SequenceStep[];
  enrolledCount: number;
  stats: {
    sent: number;
    opened: number;
    replied: number;
    meetings: number;
  };
  tags: string[];
  owner: string;
  updatedAt: string;
  enrollments: SequenceEnrollment[];
};

export type CampaignRecipient = {
  id: string;
  salon: string;
  city: string;
  contact: string;
  email: string;
  opened: boolean;
  clicked: boolean;
  replied: boolean;
  bounced: boolean;
};

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent";
  segment: string;
  templateId: string;
  audience: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  replies: number;
  scheduledFor: string;
  owner: string;
  notes: string;
  body: string;
  recipientsList: CampaignRecipient[];
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  category: string;
  preview: string;
  variables: string[];
  tone: string;
  usageCount: number;
  updatedAt: string;
  body: string;
};

export type OutreachRecord = {
  id: string;
  date: string;
  salon: string;
  city: string;
  contact: string;
  channel: OutreachChannel;
  type: "sequence" | "campaign" | "manual";
  status: OutreachStatus;
  contentPreview: string;
  content: string;
  sequenceId?: string;
  campaignId?: string;
};

export const emailTemplates: EmailTemplate[] = [
  {
    id: "tpl-intro-premium",
    name: "Intro premium salon",
    subject: "{{salon_name}} × {{brand_name}} : une opportunité à explorer",
    category: "Prospection",
    preview:
      "Un premier contact élégant pour présenter La Loge et proposer un échange rapide autour du potentiel du salon.",
    variables: ["{{salon_name}}", "{{owner_name}}", "{{city}}", "{{brand_name}}"],
    tone: "Éditorial",
    usageCount: 41,
    updatedAt: "2026-03-11T09:10:00",
    body: `<h2>Bonjour {{owner_name}},</h2><p>Je me permets de vous écrire car <strong>{{salon_name}}</strong> fait partie des salons que nous suivons avec attention à <strong>{{city}}</strong>.</p><p>Chez La Loge, nous accompagnons des marques comme <strong>{{brand_name}}</strong> pour identifier des partenaires salons à fort potentiel et construire des opportunités réellement adaptées au terrain.</p><p>Si le sujet vous parle, je peux vous partager en 10 minutes les pistes que nous avons identifiées pour votre salon.</p><p>Bien à vous,<br />Bonnie — La Loge</p>`
  },
  {
    id: "tpl-follow-up-soft",
    name: "Relance douce J+3",
    subject: "Je reviens vers vous concernant {{brand_name}}",
    category: "Relance",
    preview:
      "Relance concise, non agressive, centrée sur la valeur du dossier et la compatibilité marque.",
    variables: ["{{owner_name}}", "{{brand_name}}", "{{salon_name}}"],
    tone: "Chaleureux",
    usageCount: 33,
    updatedAt: "2026-03-10T14:40:00",
    body: `<p>Bonjour {{owner_name}},</p><p>Je me permets une courte relance suite à mon précédent message au sujet de <strong>{{brand_name}}</strong>.</p><p>Nous avons préparé quelques éléments très concrets pour <strong>{{salon_name}}</strong> : positionnement, potentiel de compatibilité et premières opportunités activables.</p><p>Souhaitez-vous que je vous envoie un mini résumé ou que nous prenions un créneau rapide ?</p><p>Très belle journée,<br />Marie-Pierre</p>`
  },
  {
    id: "tpl-rdv-booking",
    name: "Proposition de rendez-vous",
    subject: "Deux créneaux pour échanger ?",
    category: "RDV",
    preview:
      "Template orienté prise de rendez-vous avec choix de créneaux et rappel de bénéfices.",
    variables: ["{{owner_name}}", "{{salon_name}}"],
    tone: "Direct",
    usageCount: 18,
    updatedAt: "2026-03-09T08:50:00",
    body: `<p>Bonjour {{owner_name}},</p><p>Pour avancer simplement, je peux vous proposer deux créneaux d’échange cette semaine afin de vous présenter le potentiel de <strong>{{salon_name}}</strong> et les marques pertinentes selon votre profil.</p><ul><li>Mardi 11h30</li><li>Jeudi 16h00</li></ul><p>Si aucun de ces horaires ne convient, je m’adapte volontiers.</p><p>À très vite,<br />Bonnie</p>`
  },
  {
    id: "tpl-revlon-match",
    name: "Match Revlon Paris",
    subject: "Votre compatibilité Revlon semble très prometteuse",
    category: "Matching marque",
    preview:
      "Approche sur-mesure pour les salons premium compatibles Revlon.",
    variables: ["{{salon_name}}", "{{city}}", "{{brand_name}}"],
    tone: "Premium",
    usageCount: 22,
    updatedAt: "2026-03-08T12:00:00",
    body: `<p>Bonjour,</p><p>En analysant le positionnement de <strong>{{salon_name}}</strong> à <strong>{{city}}</strong>, nous avons identifié une compatibilité particulièrement forte avec <strong>{{brand_name}}</strong>.</p><p>Je peux vous partager les critères qui ont motivé ce match ainsi qu’un aperçu du dossier préparé pour votre salon.</p><p>Souhaitez-vous le recevoir ?</p>`
  },
  {
    id: "tpl-wella-education",
    name: "Wella x formation",
    subject: "Formation, visibilité, accompagnement : parlons Wella",
    category: "Campagne",
    preview:
      "Mise en avant de la formation, de l’image et du support terrain pour les salons en croissance.",
    variables: ["{{salon_name}}", "{{owner_name}}"],
    tone: "Conseil",
    usageCount: 27,
    updatedAt: "2026-03-07T17:15:00",
    body: `<p>Bonjour {{owner_name}},</p><p>Nous échangeons actuellement avec plusieurs salons en développement qui recherchent davantage d’accompagnement formation et un vrai support de marque.</p><p>Dans cette logique, <strong>Wella</strong> ressort souvent comme une piste très solide pour <strong>{{salon_name}}</strong>.</p><p>Si vous le souhaitez, je peux vous adresser un mini dossier de synthèse.</p>`
  },
  {
    id: "tpl-no-answer-final",
    name: "Dernière relance élégante",
    subject: "Je clôture le dossier pour le moment ?",
    category: "Relance",
    preview:
      "Dernier message respectueux pour obtenir une réponse sans pression.",
    variables: ["{{owner_name}}", "{{brand_name}}"],
    tone: "Respectueux",
    usageCount: 12,
    updatedAt: "2026-03-05T10:20:00",
    body: `<p>Bonjour {{owner_name}},</p><p>Je vous écris une dernière fois afin de savoir si le sujet <strong>{{brand_name}}</strong> mérite d’être poursuivi ou si je préfère clôturer le dossier de mon côté pour le moment.</p><p>Un simple “oui”, “plus tard” ou “non” me suffit.</p><p>Merci d’avance,<br />Marie-Pierre</p>`
  },
  {
    id: "tpl-dossier-share",
    name: "Envoi de dossier PDF",
    subject: "Votre dossier La Loge est prêt",
    category: "Dossier",
    preview:
      "Message d’accompagnement lors de l’envoi d’un dossier PDF à une marque ou à un salon.",
    variables: ["{{salon_name}}", "{{brand_name}}"],
    tone: "Institutionnel",
    usageCount: 9,
    updatedAt: "2026-03-04T16:30:00",
    body: `<p>Bonjour,</p><p>Vous trouverez ci-joint le dossier préparé pour <strong>{{salon_name}}</strong>, avec les éléments de contexte, les indicateurs clés et les arguments de compatibilité avec <strong>{{brand_name}}</strong>.</p><p>Je reste disponible si vous souhaitez une version enrichie ou une synthèse exécutive.</p>`
  },
  {
    id: "tpl-sms-nudge",
    name: "SMS relance courte",
    subject: "SMS — prise de contact",
    category: "SMS",
    preview:
      "Message court pour réactiver une conversation après un email resté sans réponse.",
    variables: ["{{owner_name}}", "{{brand_name}}"],
    tone: "Court",
    usageCount: 14,
    updatedAt: "2026-03-03T11:45:00",
    body: `<p>Bonjour {{owner_name}}, ici Bonnie de La Loge. Je vous ai envoyé un email au sujet de {{brand_name}}. Si le sujet vous intéresse, répondez simplement à ce message et je vous rappelle.</p>`
  }
];

export const outreachSequences: OutreachSequence[] = [
  {
    id: "seq-revlon-premium-paris",
    name: "Revlon Premium Paris",
    description:
      "Séquence 4 touches pour salons premium parisiens à fort score de compatibilité Revlon.",
    objective: "Obtenir un premier rendez-vous de qualification sous 7 jours.",
    audience: "Salons premium Paris / score > 72",
    brand: "Revlon",
    isActive: true,
    steps: [
      {
        id: "seq-revlon-premium-paris-step-1",
        order: 1,
        delayDays: 0,
        channel: "email",
        title: "Premier contact éditorial",
        templateId: "tpl-intro-premium",
        preview: "Présentation de La Loge et du potentiel de match Revlon.",
        goal: "Créer l’intérêt",
        sent: 64,
        opened: 41,
        replied: 9
      },
      {
        id: "seq-revlon-premium-paris-step-2",
        order: 2,
        delayDays: 3,
        channel: "email",
        title: "Relance douce J+3",
        templateId: "tpl-follow-up-soft",
        preview: "Rappel court avec proposition de mini résumé.",
        goal: "Réactiver",
        sent: 48,
        opened: 23,
        replied: 6
      },
      {
        id: "seq-revlon-premium-paris-step-3",
        order: 3,
        delayDays: 5,
        channel: "phone",
        title: "Appel de qualification",
        templateId: "tpl-rdv-booking",
        preview: "Prise de contact directe avec Bonnie.",
        goal: "Booker un RDV",
        sent: 28,
        opened: 0,
        replied: 7
      },
      {
        id: "seq-revlon-premium-paris-step-4",
        order: 4,
        delayDays: 7,
        channel: "email",
        title: "Dernière relance élégante",
        templateId: "tpl-no-answer-final",
        preview: "Clôture respectueuse pour déclencher une réponse rapide.",
        goal: "Obtenir une décision",
        sent: 17,
        opened: 8,
        replied: 4
      }
    ],
    enrolledCount: 64,
    stats: {
      sent: 157,
      opened: 72,
      replied: 26,
      meetings: 11
    },
    tags: ["Premium", "Paris", "Revlon"],
    owner: "Bonnie",
    updatedAt: "2026-03-11T17:20:00",
    enrollments: [
      {
        id: "enr-001",
        salon: "Maison Kintsugi",
        city: "Paris 8e",
        contact: "Sarah Amsellem",
        owner: "Bonnie",
        currentStep: 2,
        status: "active",
        lastTouchAt: "2026-03-11T11:20:00"
      },
      {
        id: "enr-002",
        salon: "Studio Montaigne",
        city: "Paris 16e",
        contact: "Jade Naciri",
        owner: "Bonnie",
        currentStep: 3,
        status: "replied",
        lastTouchAt: "2026-03-10T16:45:00"
      },
      {
        id: "enr-003",
        salon: "Atelier Tuileries",
        city: "Paris 1er",
        contact: "Camille Renaud",
        owner: "Marie-Pierre",
        currentStep: 1,
        status: "active",
        lastTouchAt: "2026-03-09T09:30:00"
      },
      {
        id: "enr-004",
        salon: "Le Carré d’Or",
        city: "Neuilly-sur-Seine",
        contact: "Nina Haddad",
        owner: "Bonnie",
        currentStep: 4,
        status: "paused",
        lastTouchAt: "2026-03-07T14:00:00"
      },
      {
        id: "enr-005",
        salon: "Villa Coiffure Signature",
        city: "Paris 17e",
        contact: "Mélanie Jourdan",
        owner: "Marie-Pierre",
        currentStep: 4,
        status: "completed",
        lastTouchAt: "2026-03-06T10:15:00"
      }
    ]
  },
  {
    id: "seq-wella-croissance-lyon",
    name: "Wella Croissance Lyon",
    description:
      "Séquence axée formation et accompagnement pour salons lyonnais en croissance.",
    objective: "Positionner un rendez-vous de découverte et partager un dossier Wella.",
    audience: "Salons croissance Lyon / 6 à 15 collaborateurs",
    brand: "Wella",
    isActive: true,
    steps: [
      {
        id: "seq-wella-croissance-lyon-step-1",
        order: 1,
        delayDays: 0,
        channel: "email",
        title: "Intro Wella formation",
        templateId: "tpl-wella-education",
        preview: "Mise en avant de l’accompagnement formation.",
        goal: "Créer l’intérêt",
        sent: 52,
        opened: 31,
        replied: 7
      },
      {
        id: "seq-wella-croissance-lyon-step-2",
        order: 2,
        delayDays: 2,
        channel: "sms",
        title: "SMS de rappel",
        templateId: "tpl-sms-nudge",
        preview: "Rappel discret après le premier email.",
        goal: "Réactiver",
        sent: 37,
        opened: 0,
        replied: 5
      },
      {
        id: "seq-wella-croissance-lyon-step-3",
        order: 3,
        delayDays: 5,
        channel: "email",
        title: "Proposition de rendez-vous",
        templateId: "tpl-rdv-booking",
        preview: "Deux créneaux proposés pour échanger.",
        goal: "Obtenir un RDV",
        sent: 26,
        opened: 15,
        replied: 6
      }
    ],
    enrolledCount: 52,
    stats: {
      sent: 115,
      opened: 46,
      replied: 18,
      meetings: 8
    },
    tags: ["Lyon", "Croissance", "Wella"],
    owner: "Marie-Pierre",
    updatedAt: "2026-03-10T18:45:00",
    enrollments: [
      {
        id: "enr-101",
        salon: "Maison des Brotteaux",
        city: "Lyon 6e",
        contact: "Aude Richard",
        owner: "Marie-Pierre",
        currentStep: 2,
        status: "active",
        lastTouchAt: "2026-03-11T09:10:00"
      },
      {
        id: "enr-102",
        salon: "Les Muses Coloristes",
        city: "Lyon 2e",
        contact: "Claire Bernard",
        owner: "Bonnie",
        currentStep: 3,
        status: "replied",
        lastTouchAt: "2026-03-10T15:35:00"
      },
      {
        id: "enr-103",
        salon: "L’Adresse Lumière",
        city: "Villeurbanne",
        contact: "Marion Petit",
        owner: "Marie-Pierre",
        currentStep: 1,
        status: "active",
        lastTouchAt: "2026-03-09T12:00:00"
      },
      {
        id: "enr-104",
        salon: "Atelier Rhône",
        city: "Lyon 3e",
        contact: "Sonia Abecassis",
        owner: "Bonnie",
        currentStep: 3,
        status: "completed",
        lastTouchAt: "2026-03-07T17:05:00"
      }
    ]
  },
  {
    id: "seq-dossier-chaud-idf",
    name: "Dossier chaud Île-de-France",
    description:
      "Séquence courte pour salons ayant déjà manifesté un intérêt et prêts à recevoir un dossier PDF.",
    objective: "Transformer l’intérêt en dossier partagé puis rendez-vous marque.",
    audience: "Salons intéressés / IDF",
    brand: "Multi-marques",
    isActive: false,
    steps: [
      {
        id: "seq-dossier-chaud-idf-step-1",
        order: 1,
        delayDays: 0,
        channel: "email",
        title: "Envoi du dossier",
        templateId: "tpl-dossier-share",
        preview: "Partage d’un dossier complet prêt à être transmis aux marques.",
        goal: "Donner de la matière",
        sent: 19,
        opened: 14,
        replied: 6
      },
      {
        id: "seq-dossier-chaud-idf-step-2",
        order: 2,
        delayDays: 2,
        channel: "phone",
        title: "Appel de validation",
        templateId: "tpl-rdv-booking",
        preview: "Vérification des attentes et qualification de la priorité.",
        goal: "Qualifier le besoin",
        sent: 13,
        opened: 0,
        replied: 5
      }
    ],
    enrolledCount: 19,
    stats: {
      sent: 32,
      opened: 14,
      replied: 11,
      meetings: 7
    },
    tags: ["Dossiers", "IDF", "Hot lead"],
    owner: "Bonnie",
    updatedAt: "2026-03-08T15:10:00",
    enrollments: [
      {
        id: "enr-201",
        salon: "Studio Madeleine Prestige",
        city: "Paris 9e",
        contact: "Léa Meriem",
        owner: "Bonnie",
        currentStep: 2,
        status: "replied",
        lastTouchAt: "2026-03-09T10:40:00"
      },
      {
        id: "enr-202",
        salon: "Maison Rive Gauche",
        city: "Boulogne-Billancourt",
        contact: "Hélène Ortiz",
        owner: "Bonnie",
        currentStep: 1,
        status: "paused",
        lastTouchAt: "2026-03-08T18:20:00"
      },
      {
        id: "enr-203",
        salon: "Le 27 Faubourg",
        city: "Saint-Germain-en-Laye",
        contact: "Julie Kramer",
        owner: "Marie-Pierre",
        currentStep: 2,
        status: "completed",
        lastTouchAt: "2026-03-07T11:00:00"
      }
    ]
  }
];

export const campaigns: Campaign[] = [
  {
    id: "camp-wella-spring-2026",
    name: "Spring Education 2026",
    subject: "Boostez la montée en gamme de votre salon avec Wella",
    status: "sent",
    segment: "Salons croissance AuRA",
    templateId: "tpl-wella-education",
    audience: "146 contacts qualifiés",
    recipients: 146,
    sent: 146,
    opened: 82,
    clicked: 31,
    bounced: 5,
    replies: 18,
    scheduledFor: "2026-03-04T10:00:00",
    owner: "Marie-Pierre",
    notes: "Très bon démarrage sur Lyon et Annecy.",
    body: `<h2>Formation, image, accompagnement</h2><p>Nous avons identifié une vraie fenêtre d’opportunité pour les salons en croissance qui souhaitent renforcer leur proposition couleur, leur accompagnement équipe et leur visibilité terrain.</p><p>Wella ressort particulièrement bien sur ces trois dimensions.</p>`,
    recipientsList: [
      {
        id: "camp-rec-001",
        salon: "Les Muses Coloristes",
        city: "Lyon",
        contact: "Claire Bernard",
        email: "claire@lesmuses.fr",
        opened: true,
        clicked: true,
        replied: true,
        bounced: false
      },
      {
        id: "camp-rec-002",
        salon: "Maison des Brotteaux",
        city: "Lyon",
        contact: "Aude Richard",
        email: "aude@brotteaux.fr",
        opened: true,
        clicked: false,
        replied: false,
        bounced: false
      },
      {
        id: "camp-rec-003",
        salon: "Atelier Rhône",
        city: "Lyon",
        contact: "Sonia Abecassis",
        email: "sonia@atelierrhone.fr",
        opened: false,
        clicked: false,
        replied: false,
        bounced: false
      },
      {
        id: "camp-rec-004",
        salon: "Studio Nacre",
        city: "Annecy",
        contact: "Maud Sorel",
        email: "maud@studionacre.fr",
        opened: true,
        clicked: true,
        replied: false,
        bounced: false
      }
    ]
  },
  {
    id: "camp-revlon-q1-premium",
    name: "Q1 Premium Match",
    subject: "Votre compatibilité Revlon mérite un échange",
    status: "sent",
    segment: "Top scores Île-de-France",
    templateId: "tpl-revlon-match",
    audience: "89 contacts premium",
    recipients: 89,
    sent: 89,
    opened: 57,
    clicked: 24,
    bounced: 2,
    replies: 14,
    scheduledFor: "2026-02-26T14:30:00",
    owner: "Bonnie",
    notes: "Les meilleurs taux proviennent des salons ayant déjà un bon score Google.",
    body: `<p>Nous avons repéré plusieurs salons premium à fort potentiel pour <strong>Revlon</strong> et votre établissement fait partie des plus prometteurs.</p>`,
    recipientsList: [
      {
        id: "camp-rec-101",
        salon: "Maison Kintsugi",
        city: "Paris",
        contact: "Sarah Amsellem",
        email: "sarah@maisonkintsugi.fr",
        opened: true,
        clicked: true,
        replied: true,
        bounced: false
      },
      {
        id: "camp-rec-102",
        salon: "Studio Montaigne",
        city: "Paris",
        contact: "Jade Naciri",
        email: "jade@studiomontaigne.fr",
        opened: true,
        clicked: true,
        replied: false,
        bounced: false
      },
      {
        id: "camp-rec-103",
        salon: "Villa Coiffure Signature",
        city: "Paris",
        contact: "Mélanie Jourdan",
        email: "melanie@villasignature.fr",
        opened: false,
        clicked: false,
        replied: false,
        bounced: false
      }
    ]
  },
  {
    id: "camp-provalliance-nurture",
    name: "Nurture Provalliance",
    subject: "Un brief rapide sur les opportunités réseau ?",
    status: "scheduled",
    segment: "Salons multi-marques / Île-de-France",
    templateId: "tpl-intro-premium",
    audience: "124 contacts segmentés",
    recipients: 124,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    replies: 0,
    scheduledFor: "2026-03-15T09:00:00",
    owner: "Bonnie",
    notes: "Campagne planifiée après nettoyage des doublons.",
    body: `<p>Campagne à venir pour réengager les salons multi-marques sur une logique réseau et performance.</p>`,
    recipientsList: [
      {
        id: "camp-rec-201",
        salon: "Maison Rive Gauche",
        city: "Boulogne-Billancourt",
        contact: "Hélène Ortiz",
        email: "helene@rivergauche.fr",
        opened: false,
        clicked: false,
        replied: false,
        bounced: false
      }
    ]
  },
  {
    id: "camp-myspa-wellness",
    name: "Myspa Wellness",
    subject: "Une piste premium bien-être pour votre clientèle",
    status: "draft",
    segment: "Salons premium avec cabine ou espace soin",
    templateId: "tpl-intro-premium",
    audience: "58 contacts",
    recipients: 58,
    sent: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    replies: 0,
    scheduledFor: "2026-03-19T11:00:00",
    owner: "Marie-Pierre",
    notes: "En attente de validation du wording marque.",
    body: `<p>Version de travail pour salons ayant une logique bien-être complémentaire.</p>`,
    recipientsList: []
  },
  {
    id: "camp-saint-algue-regional",
    name: "Saint-Algue Régional",
    subject: "Développer votre visibilité locale avec un partenaire structuré",
    status: "sent",
    segment: "Salons province / capillarité réseau",
    templateId: "tpl-follow-up-soft",
    audience: "97 contacts province",
    recipients: 97,
    sent: 97,
    opened: 49,
    clicked: 16,
    bounced: 4,
    replies: 9,
    scheduledFor: "2026-03-01T15:15:00",
    owner: "Marie-Pierre",
    notes: "Bons résultats sur les villes moyennes.",
    body: `<p>Campagne de visibilité réseau adaptée aux salons en recherche de structure et notoriété locale.</p>`,
    recipientsList: [
      {
        id: "camp-rec-301",
        salon: "Le Salon des Arcades",
        city: "Reims",
        contact: "Nora Sellami",
        email: "nora@arcades.fr",
        opened: true,
        clicked: false,
        replied: true,
        bounced: false
      }
    ]
  }
];

export const outreachHistory: OutreachRecord[] = [
  {
    id: "hist-001",
    date: "2026-03-11T11:20:00",
    salon: "Maison Kintsugi",
    city: "Paris 8e",
    contact: "Sarah Amsellem",
    channel: "email",
    type: "sequence",
    status: "opened",
    contentPreview: "Je me permets de vous écrire car Maison Kintsugi fait partie des salons que nous suivons…",
    content: emailTemplates[0].body,
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-002",
    date: "2026-03-11T10:05:00",
    salon: "Les Muses Coloristes",
    city: "Lyon 2e",
    contact: "Claire Bernard",
    channel: "sms",
    type: "sequence",
    status: "replied",
    contentPreview: "Bonjour Claire, ici Bonnie de La Loge. Je vous ai envoyé un email…",
    content: emailTemplates[7].body,
    sequenceId: "seq-wella-croissance-lyon"
  },
  {
    id: "hist-003",
    date: "2026-03-10T16:45:00",
    salon: "Studio Montaigne",
    city: "Paris 16e",
    contact: "Jade Naciri",
    channel: "phone",
    type: "sequence",
    status: "replied",
    contentPreview: "Appel de qualification mené par Bonnie — intérêt confirmé pour un échange Revlon.",
    content: "Appel de qualification mené par Bonnie. Jade confirme un intérêt pour recevoir un dossier court et planifier un rendez-vous la semaine prochaine.",
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-004",
    date: "2026-03-10T15:35:00",
    salon: "Maison des Brotteaux",
    city: "Lyon 6e",
    contact: "Aude Richard",
    channel: "email",
    type: "campaign",
    status: "clicked",
    contentPreview: "Boostez la montée en gamme de votre salon avec Wella…",
    content: campaigns[0].body,
    campaignId: "camp-wella-spring-2026"
  },
  {
    id: "hist-005",
    date: "2026-03-10T14:20:00",
    salon: "Atelier Tuileries",
    city: "Paris 1er",
    contact: "Camille Renaud",
    channel: "email",
    type: "sequence",
    status: "sent",
    contentPreview: "Je me permets de vous écrire car Atelier Tuileries fait partie des salons…",
    content: emailTemplates[0].body,
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-006",
    date: "2026-03-10T11:55:00",
    salon: "Le Carré d’Or",
    city: "Neuilly-sur-Seine",
    contact: "Nina Haddad",
    channel: "email",
    type: "sequence",
    status: "bounced",
    contentPreview: "Je reviens vers vous concernant Revlon…",
    content: emailTemplates[1].body,
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-007",
    date: "2026-03-09T18:15:00",
    salon: "L’Adresse Lumière",
    city: "Villeurbanne",
    contact: "Marion Petit",
    channel: "email",
    type: "sequence",
    status: "opened",
    contentPreview: "Nous échangeons actuellement avec plusieurs salons en développement…",
    content: emailTemplates[4].body,
    sequenceId: "seq-wella-croissance-lyon"
  },
  {
    id: "hist-008",
    date: "2026-03-09T16:00:00",
    salon: "Studio Nacre",
    city: "Annecy",
    contact: "Maud Sorel",
    channel: "email",
    type: "campaign",
    status: "opened",
    contentPreview: "Boostez la montée en gamme de votre salon avec Wella…",
    content: campaigns[0].body,
    campaignId: "camp-wella-spring-2026"
  },
  {
    id: "hist-009",
    date: "2026-03-09T10:40:00",
    salon: "Studio Madeleine Prestige",
    city: "Paris 9e",
    contact: "Léa Meriem",
    channel: "email",
    type: "sequence",
    status: "replied",
    contentPreview: "Votre dossier La Loge est prêt…",
    content: emailTemplates[6].body,
    sequenceId: "seq-dossier-chaud-idf"
  },
  {
    id: "hist-010",
    date: "2026-03-08T18:20:00",
    salon: "Maison Rive Gauche",
    city: "Boulogne-Billancourt",
    contact: "Hélène Ortiz",
    channel: "email",
    type: "sequence",
    status: "opened",
    contentPreview: "Votre dossier La Loge est prêt…",
    content: emailTemplates[6].body,
    sequenceId: "seq-dossier-chaud-idf"
  },
  {
    id: "hist-011",
    date: "2026-03-08T15:15:00",
    salon: "Le Salon des Arcades",
    city: "Reims",
    contact: "Nora Sellami",
    channel: "email",
    type: "campaign",
    status: "replied",
    contentPreview: "Développer votre visibilité locale avec un partenaire structuré…",
    content: campaigns[4].body,
    campaignId: "camp-saint-algue-regional"
  },
  {
    id: "hist-012",
    date: "2026-03-08T11:25:00",
    salon: "Le 27 Faubourg",
    city: "Saint-Germain-en-Laye",
    contact: "Julie Kramer",
    channel: "phone",
    type: "sequence",
    status: "replied",
    contentPreview: "Appel de validation réalisé — dossier partagé à la marque.",
    content: "Appel de validation réalisé. Le salon valide le partage du dossier avec deux marques cibles.",
    sequenceId: "seq-dossier-chaud-idf"
  },
  {
    id: "hist-013",
    date: "2026-03-07T17:05:00",
    salon: "Atelier Rhône",
    city: "Lyon 3e",
    contact: "Sonia Abecassis",
    channel: "email",
    type: "sequence",
    status: "clicked",
    contentPreview: "Deux créneaux pour échanger ?",
    content: emailTemplates[2].body,
    sequenceId: "seq-wella-croissance-lyon"
  },
  {
    id: "hist-014",
    date: "2026-03-07T14:00:00",
    salon: "Le Carré d’Or",
    city: "Neuilly-sur-Seine",
    contact: "Nina Haddad",
    channel: "email",
    type: "sequence",
    status: "scheduled",
    contentPreview: "Je clôture le dossier pour le moment ?",
    content: emailTemplates[5].body,
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-015",
    date: "2026-03-07T11:00:00",
    salon: "Le 27 Faubourg",
    city: "Saint-Germain-en-Laye",
    contact: "Julie Kramer",
    channel: "email",
    type: "sequence",
    status: "opened",
    contentPreview: "Votre dossier La Loge est prêt…",
    content: emailTemplates[6].body,
    sequenceId: "seq-dossier-chaud-idf"
  },
  {
    id: "hist-016",
    date: "2026-03-06T16:30:00",
    salon: "Villa Coiffure Signature",
    city: "Paris 17e",
    contact: "Mélanie Jourdan",
    channel: "email",
    type: "campaign",
    status: "opened",
    contentPreview: "Votre compatibilité Revlon mérite un échange…",
    content: campaigns[1].body,
    campaignId: "camp-revlon-q1-premium"
  },
  {
    id: "hist-017",
    date: "2026-03-06T10:15:00",
    salon: "Villa Coiffure Signature",
    city: "Paris 17e",
    contact: "Mélanie Jourdan",
    channel: "email",
    type: "sequence",
    status: "replied",
    contentPreview: "Je clôture le dossier pour le moment ?",
    content: emailTemplates[5].body,
    sequenceId: "seq-revlon-premium-paris"
  },
  {
    id: "hist-018",
    date: "2026-03-05T15:05:00",
    salon: "Maison Kintsugi",
    city: "Paris 8e",
    contact: "Sarah Amsellem",
    channel: "email",
    type: "campaign",
    status: "replied",
    contentPreview: "Votre compatibilité Revlon mérite un échange…",
    content: campaigns[1].body,
    campaignId: "camp-revlon-q1-premium"
  },
  {
    id: "hist-019",
    date: "2026-03-05T11:20:00",
    salon: "Atelier Mirabeau",
    city: "Aix-en-Provence",
    contact: "Sabrina Giraud",
    channel: "email",
    type: "campaign",
    status: "sent",
    contentPreview: "Développer votre visibilité locale avec un partenaire structuré…",
    content: campaigns[4].body,
    campaignId: "camp-saint-algue-regional"
  },
  {
    id: "hist-020",
    date: "2026-03-05T09:30:00",
    salon: "Studio Montaigne",
    city: "Paris 16e",
    contact: "Jade Naciri",
    channel: "email",
    type: "campaign",
    status: "clicked",
    contentPreview: "Votre compatibilité Revlon mérite un échange…",
    content: campaigns[1].body,
    campaignId: "camp-revlon-q1-premium"
  },
  {
    id: "hist-021",
    date: "2026-03-04T14:10:00",
    salon: "Maison des Brotteaux",
    city: "Lyon 6e",
    contact: "Aude Richard",
    channel: "email",
    type: "campaign",
    status: "opened",
    contentPreview: "Boostez la montée en gamme de votre salon avec Wella…",
    content: campaigns[0].body,
    campaignId: "camp-wella-spring-2026"
  },
  {
    id: "hist-022",
    date: "2026-03-04T10:00:00",
    salon: "Studio Nacre",
    city: "Annecy",
    contact: "Maud Sorel",
    channel: "email",
    type: "campaign",
    status: "sent",
    contentPreview: "Boostez la montée en gamme de votre salon avec Wella…",
    content: campaigns[0].body,
    campaignId: "camp-wella-spring-2026"
  },
  {
    id: "hist-023",
    date: "2026-03-03T17:30:00",
    salon: "Maison Rive Gauche",
    city: "Boulogne-Billancourt",
    contact: "Hélène Ortiz",
    channel: "phone",
    type: "manual",
    status: "replied",
    contentPreview: "Appel manuel de qualification suite à ouverture multiple des emails.",
    content: "Appel manuel réalisé par Bonnie. Le salon souhaite recevoir un dossier plus orienté business case.",
    sequenceId: "seq-dossier-chaud-idf"
  },
  {
    id: "hist-024",
    date: "2026-03-03T11:10:00",
    salon: "L’Adresse Lumière",
    city: "Villeurbanne",
    contact: "Marion Petit",
    channel: "sms",
    type: "sequence",
    status: "sent",
    contentPreview: "Bonjour Marion, ici Bonnie de La Loge…",
    content: emailTemplates[7].body,
    sequenceId: "seq-wella-croissance-lyon"
  }
];

export const outreachStats = {
  pendingActions: 14,
  activeSequences: outreachSequences.filter((sequence) => sequence.isActive).length,
  campaignsSentThisMonth: campaigns.filter((campaign) => campaign.status === "sent").length,
  replyRate: 17.8
};

export function getSequenceById(id: string) {
  return outreachSequences.find((sequence) => sequence.id === id) ?? null;
}

export function getCampaignById(id: string) {
  return campaigns.find((campaign) => campaign.id === id) ?? null;
}

export function getTemplateById(id: string) {
  return emailTemplates.find((template) => template.id === id) ?? null;
}

export function getOutreachRecordById(id: string) {
  return outreachHistory.find((item) => item.id === id) ?? null;
}

export function getOutreachItemById(id: string) {
  const sequence = getSequenceById(id);
  if (sequence) {
    return { kind: "sequence" as const, data: sequence };
  }

  const campaign = getCampaignById(id);
  if (campaign) {
    return { kind: "campaign" as const, data: campaign };
  }

  return null;
}
