export type DossierStatus = "brouillon" | "en_preparation" | "finalise" | "envoye";
export type DossierActionPriority = "haute" | "moyenne" | "faible";
export type DossierTimelineKind = "analyse" | "contact" | "revue" | "generation" | "envoi";

export type DossierScoreBreakdownItem = {
  id: string;
  label: string;
  score: number;
  description: string;
};

export type DossierRecommendedTerm = {
  title: string;
  detail: string;
};

export type DossierRecommendedAction = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  due_label: string;
  priority: DossierActionPriority;
};

export type DossierTimelineEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
  kind: DossierTimelineKind;
};

export type DossierSalonSnapshot = {
  address: string;
  postal_code: string;
  website: string;
  team_size: number;
  google_rating: number;
  review_count: number;
  specialties: string[];
  owner_name: string;
  salon_status: string;
};

export type DossierContent = {
  executive_summary: string;
  brand_rationale: string;
  score_breakdown: DossierScoreBreakdownItem[];
  strengths: string[];
  watchpoints: string[];
  recommended_terms: DossierRecommendedTerm[];
  recommended_actions: DossierRecommendedAction[];
  timeline: DossierTimelineEvent[];
};

export type ClientDossierRecord = {
  id: string;
  salon_id: string;
  brand_id: string;
  status: DossierStatus;
  content: DossierContent | null;
  generated_at: string | null;
  created_at: string;
  salon_name: string;
  salon_city: string;
  brand_name: string;
  compatibility_score: number;
  salon_info: DossierSalonSnapshot;
};

export const clientDossiers: ClientDossierRecord[] = [
  {
    id: "dos-maison-kintsugi-revlon",
    salon_id: "salon-maison-kintsugi",
    brand_id: "brand-revlon",
    status: "finalise",
    generated_at: "2026-03-11T18:10:00+01:00",
    created_at: "2026-03-09T09:20:00+01:00",
    salon_name: "Maison Kintsugi",
    salon_city: "Paris 8e",
    brand_name: "Revlon",
    compatibility_score: 92,
    salon_info: {
      address: "12 avenue Matignon",
      postal_code: "75008",
      website: "https://maisonkintsugi.fr",
      team_size: 11,
      google_rating: 4.8,
      review_count: 312,
      specialties: ["Balayage signature", "Gloss premium", "Rituel consultation"],
      owner_name: "Claire Dumas",
      salon_status: "negociation"
    },
    content: {
      executive_summary:
        "Maison Kintsugi présente un niveau d'image, de service et de fidélisation rare sur le segment premium parisien. Le salon coche les critères clés pour une marque qui cherche de la désirabilité, de la pédagogie et une exécution irréprochable en cabine.",
      brand_rationale:
        "Revlon bénéficie ici d'un terrain d'expression très cohérent : clientèle premium, forte culture de la consultation, capacité à valoriser l'image de marque et volonté explicite de monter en gamme sur la couleur." ,
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 95,
          description: "Univers visuel premium, expérience cohérente et désirabilité forte en ligne comme au salon."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 93,
          description: "Clientèle fidèle, panier élevé et pouvoir de recommandation important."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 88,
          description: "Très bonne note Google et contenu social premium, encore perfectible sur les formats expert."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 90,
          description: "Équipe stable, seniorisée et capable d'embarquer rapidement un protocole marque."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 92,
          description: "Capacité évidente à convertir une proposition marque en discours vendeur et expérience client."
        }
      ],
      strengths: [
        "Adresse premium avec pouvoir de prescription naturel.",
        "Très bon niveau de consultation et d'accompagnement personnalisé.",
        "Dirigeante réactive, structurée et sensible aux partenariats image.",
        "Équipe déjà habituée à valoriser les services couleur à forte marge."
      ],
      watchpoints: [
        "Exigence élevée sur les conditions de lancement et le niveau de support formation.",
        "Nécessité de formaliser un plan d'activation retail pour maximiser le potentiel panier."
      ],
      recommended_terms: [
        {
          title: "Phase pilote 90 jours",
          detail: "Lancement en test maîtrisé avec reporting hebdomadaire sur couleur, panier moyen et feedback équipe."
        },
        {
          title: "Formation initiale premium",
          detail: "Deux sessions dédiées diagnostic + coloration signature avant l'activation commerciale."
        },
        {
          title: "Kit d'image & retail",
          detail: "Support merchandising discret mais haut de gamme, aligné avec l'univers du salon."
        }
      ],
      recommended_actions: [
        {
          id: "mk-action-1",
          title: "Planifier un call tripartite",
          detail: "Aligner Bonnie, Claire Dumas et la trade team Revlon sur les objectifs du pilote.",
          owner: "Bonnie",
          due_label: "Sous 48h",
          priority: "haute"
        },
        {
          id: "mk-action-2",
          title: "Envoyer la version PDF exécutive",
          detail: "Partager une version courte destinée au management Revlon avec le score et les points business.",
          owner: "Marie-Pierre",
          due_label: "Cette semaine",
          priority: "moyenne"
        },
        {
          id: "mk-action-3",
          title: "Préparer le plan d'activation retail",
          detail: "Définir trois rituels de vente additionnelle compatibles avec le parcours client du salon.",
          owner: "Équipe marque",
          due_label: "Avant lancement",
          priority: "moyenne"
        }
      ],
      timeline: [
        {
          id: "mk-t-1",
          date: "2026-03-09T09:20:00+01:00",
          title: "Création du dossier",
          description: "Ouverture du dossier à la suite d'un score marque supérieur à 90.",
          actor: "ScoreMaster",
          kind: "analyse"
        },
        {
          id: "mk-t-2",
          date: "2026-03-09T15:40:00+01:00",
          title: "Qualification commerciale",
          description: "Bonnie confirme le niveau d'intérêt et la maturité du salon pour une offre premium.",
          actor: "Bonnie",
          kind: "revue"
        },
        {
          id: "mk-t-3",
          date: "2026-03-10T11:05:00+01:00",
          title: "Échange dirigeante",
          description: "Appel exploratoire avec Claire Dumas sur ses attentes image, formation et exclusivité.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "mk-t-4",
          date: "2026-03-11T14:30:00+01:00",
          title: "Version PDF générée",
          description: "Compilation du score, des insights et des termes recommandés pour la marque.",
          actor: "Dossier Engine",
          kind: "generation"
        },
        {
          id: "mk-t-5",
          date: "2026-03-11T18:10:00+01:00",
          title: "Validation interne",
          description: "Dossier relu et marqué comme finalisé pour transmission à Revlon.",
          actor: "Bonnie",
          kind: "revue"
        }
      ]
    }
  },
  {
    id: "dos-les-muses-wella",
    salon_id: "salon-les-muses-coloristes",
    brand_id: "brand-wella",
    status: "en_preparation",
    generated_at: null,
    created_at: "2026-03-08T14:45:00+01:00",
    salon_name: "Les Muses Coloristes",
    salon_city: "Lyon 2e",
    brand_name: "Wella",
    compatibility_score: 88,
    salon_info: {
      address: "24 rue Mercière",
      postal_code: "69002",
      website: "https://lesmusescoloristes.fr",
      team_size: 8,
      google_rating: 4.7,
      review_count: 186,
      specialties: ["Transformation couleur", "Blond sur-mesure", "Coaching routine"],
      owner_name: "Mélanie Roche",
      salon_status: "interesse"
    },
    content: {
      executive_summary:
        "Les Muses Coloristes affiche une dynamique de croissance saine, très orientée expertise couleur et désir d'accompagnement. Le salon est particulièrement compatible avec une marque qui apporte formation, méthode et visibilité métier.",
      brand_rationale:
        "Wella peut ici jouer un rôle d'accélérateur : montée en compétence de l'équipe, valorisation du savoir-faire couleur et soutien commercial pour structurer un salon déjà très apprécié localement.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 84,
          description: "Identité moderne et chaleureuse, forte lisibilité de l'expertise couleur."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 86,
          description: "Belle fidélité locale et clientèle engagée sur les prestations techniques."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 91,
          description: "Instagram performant avec contenu avant/après très convaincant."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 87,
          description: "Équipe en croissance avec forte appétence pour la formation."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 83,
          description: "Très bon potentiel si le discours marque est outillé et ritualisé."
        }
      ],
      strengths: [
        "Expertise couleur clairement perçue par les clientes.",
        "Dirigeante ouverte à un accompagnement structuré.",
        "Bon levier social pour amplifier le partenariat.",
        "Taille d'équipe idéale pour une activation rapide."
      ],
      watchpoints: [
        "Le salon attend des preuves très concrètes sur la valeur formation.",
        "La proposition doit rester pragmatique et simple à déployer au quotidien."
      ],
      recommended_terms: [
        {
          title: "Programme formation 60 jours",
          detail: "Cycle court axé consultation, protocoles couleur et montée en compétence de deux référentes."
        },
        {
          title: "Co-branding léger",
          detail: "Activer une communication simple autour de l'expertise sans surcharger l'identité du salon."
        },
        {
          title: "Suivi business mensuel",
          detail: "Mesurer revisite, satisfaction et évolution du panier sur les prestations couleur."
        }
      ],
      recommended_actions: [
        {
          id: "lm-action-1",
          title: "Compléter les données économiques",
          detail: "Récupérer les indicateurs panier moyen et revisite pour enrichir le dossier final.",
          owner: "CRM Data",
          due_label: "Sous 72h",
          priority: "haute"
        },
        {
          id: "lm-action-2",
          title: "Préparer un angle formation",
          detail: "Formaliser trois modules de formation Wella directement reliés aux besoins de l'équipe.",
          owner: "Marie-Pierre",
          due_label: "Cette semaine",
          priority: "moyenne"
        },
        {
          id: "lm-action-3",
          title: "Valider le storytelling dirigeante",
          detail: "Ajouter une citation de Mélanie Roche sur la vision du salon et la couleur.",
          owner: "Bonnie",
          due_label: "Avant finalisation",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "lm-t-1",
          date: "2026-03-08T14:45:00+01:00",
          title: "Création du dossier",
          description: "Ouverture du dossier après priorisation manuelle sur la verticale couleur.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "lm-t-2",
          date: "2026-03-09T10:10:00+01:00",
          title: "Analyse compatibilité Wella",
          description: "Lecture détaillée des critères formation, image et traction digitale.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "lm-t-3",
          date: "2026-03-10T16:25:00+01:00",
          title: "Premier échange salon",
          description: "Mélanie Roche confirme son intérêt pour un accompagnement couleur plus structuré.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "lm-t-4",
          date: "2026-03-11T12:00:00+01:00",
          title: "Dossier en préparation",
          description: "Collecte des éléments manquants avant génération PDF.",
          actor: "Dossier Engine",
          kind: "generation"
        }
      ]
    }
  },
  {
    id: "dos-studio-montaigne-schwarzkopf",
    salon_id: "salon-studio-montaigne",
    brand_id: "brand-schwarzkopf",
    status: "envoye",
    generated_at: "2026-03-10T17:35:00+01:00",
    created_at: "2026-03-06T08:15:00+01:00",
    salon_name: "Studio Montaigne",
    salon_city: "Paris 16e",
    brand_name: "Schwarzkopf",
    compatibility_score: 85,
    salon_info: {
      address: "8 rue de la Pompe",
      postal_code: "75116",
      website: "https://studiomontaigne.fr",
      team_size: 9,
      google_rating: 4.6,
      review_count: 241,
      specialties: ["Consultation image", "Gloss sur-mesure", "Coupe signature"],
      owner_name: "Laura Bernard",
      salon_status: "rdv_planifie"
    },
    content: {
      executive_summary:
        "Studio Montaigne combine une très belle qualité de service avec une fondatrice déjà structurée commercialement. Le dossier a été pensé pour démontrer l'intérêt d'un partenariat haut de gamme mais opérationnel, capable d'amplifier la visibilité sans dénaturer le salon.",
      brand_rationale:
        "Schwarzkopf apporte ici un mix crédible entre expertise technique, image et capacité d'accompagnement. Le salon a la maturité nécessaire pour activer un partenariat rapidement, avec une dirigeante habituée à piloter ses indicateurs.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 90,
          description: "Très forte cohérence esthétique et niveau d'accueil premium."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 84,
          description: "Clientèle stable, aisée et attentive au conseil expert."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 80,
          description: "Bonne visibilité organique, encore peu d'activation de preuves métier."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 83,
          description: "Équipe mature, avec relais internes déjà identifiés."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 88,
          description: "Capacité forte à transformer un partenariat en expérience client et ventes complémentaires."
        }
      ],
      strengths: [
        "Fondatrice déjà très structurée sur les arbitrages marque.",
        "Expérience client premium facilement valorisable côté marque.",
        "Potentiel d'ambassade local sur un quartier à forte visibilité.",
        "Dossier très lisible pour une décision rapide côté marque."
      ],
      watchpoints: [
        "Le salon ne souhaite pas de dispositif trop intrusif sur son espace de vente.",
        "Une proposition trop standardisée serait perçue comme peu différenciante."
      ],
      recommended_terms: [
        {
          title: "Lancement par capsule premium",
          detail: "Commencer par un dispositif limité, élégant et piloté autour de prestations signature."
        },
        {
          title: "Formation ambassadeur",
          detail: "Former deux référentes internes capables de porter le discours technique en autonomie."
        },
        {
          title: "Revue résultats à 45 jours",
          detail: "Point d'étape rapide avec lecture conversion, satisfaction et feedback équipe."
        }
      ],
      recommended_actions: [
        {
          id: "sm-action-1",
          title: "Relancer la direction marque",
          detail: "Obtenir un retour sur le dossier transmis et identifier le sponsor interne côté Schwarzkopf.",
          owner: "Bonnie",
          due_label: "Demain",
          priority: "haute"
        },
        {
          id: "sm-action-2",
          title: "Préparer un scénario d'activation discret",
          detail: "Proposer une présence marque low-profile compatible avec l'esthétique du salon.",
          owner: "Équipe marque",
          due_label: "Sous 5 jours",
          priority: "moyenne"
        },
        {
          id: "sm-action-3",
          title: "Mettre à jour les contacts",
          detail: "Vérifier les décideurs finaux avant la réunion de cadrage.",
          owner: "CRM Ops",
          due_label: "Aujourd'hui",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "sm-t-1",
          date: "2026-03-06T08:15:00+01:00",
          title: "Dossier initié",
          description: "Salon identifié comme cible premium multi-marques à prioriser.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "sm-t-2",
          date: "2026-03-07T11:00:00+01:00",
          title: "Audit compatibilité",
          description: "Lecture détaillée des critères image, ambition et fit opérationnel.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "sm-t-3",
          date: "2026-03-08T16:40:00+01:00",
          title: "Échange fondatrice",
          description: "Laura Bernard confirme son intérêt pour une marque technique avec support mesuré.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "sm-t-4",
          date: "2026-03-10T10:05:00+01:00",
          title: "Finalisation dossier",
          description: "Version PDF consolidée après arbitrage des termes recommandés.",
          actor: "Dossier Engine",
          kind: "generation"
        },
        {
          id: "sm-t-5",
          date: "2026-03-10T17:35:00+01:00",
          title: "Transmission marque",
          description: "Dossier envoyé à la direction partenariats Schwarzkopf.",
          actor: "Bonnie",
          kind: "envoi"
        }
      ]
    }
  },
  {
    id: "dos-maison-rive-gauche-provalliance",
    salon_id: "salon-maison-rive-gauche",
    brand_id: "brand-provalliance",
    status: "finalise",
    generated_at: "2026-03-11T09:30:00+01:00",
    created_at: "2026-03-07T13:05:00+01:00",
    salon_name: "Maison Rive Gauche",
    salon_city: "Boulogne-Billancourt",
    brand_name: "Provalliance",
    compatibility_score: 82,
    salon_info: {
      address: "41 boulevard Jean Jaurès",
      postal_code: "92100",
      website: "https://maisonrivegauche.fr",
      team_size: 7,
      google_rating: 4.5,
      review_count: 149,
      specialties: ["Gestion performante", "Coloration entretien", "Services express"],
      owner_name: "Sophie Martin",
      salon_status: "interesse"
    },
    content: {
      executive_summary:
        "Maison Rive Gauche est un salon solide, géré avec rigueur, qui répond bien à une lecture business orientée productivité, récurrence et potentiel de structuration. Le dossier met en avant une dirigeante attentive aux chiffres et à la qualité d'exécution.",
      brand_rationale:
        "Provalliance peut trouver ici une opportunité de développement crédible : salon déjà piloté comme une petite entreprise, capable d'intégrer process, support réseau et outils de performance à court terme.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 76,
          description: "Positionnement propre et rassurant, moins éditorial mais très clair pour la clientèle locale."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 81,
          description: "Base locale stable avec bonne fréquence de visite."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 72,
          description: "Présence digitale simple mais exploitable avec accompagnement."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 84,
          description: "Équipe resserrée et bien organisée, faible turnover."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 88,
          description: "Très bon niveau de pilotage, sensibilité forte aux gains d'efficacité et aux ventes additionnelles."
        }
      ],
      strengths: [
        "Dirigeante pilotée par les chiffres et le concret.",
        "Zone de chalandise dense et régulière.",
        "Équipe réactive aux process et aux rituels commerciaux.",
        "Potentiel d'optimisation rapide avec un accompagnement réseau."
      ],
      watchpoints: [
        "L'argumentaire doit rester centré ROI et simplicité opérationnelle.",
        "Le salon sera attentif au retour sur investissement avant tout engagement long."
      ],
      recommended_terms: [
        {
          title: "Onboarding process & KPI",
          detail: "Déploiement avec tableau de bord simple sur panier, fréquence et mix prestations."
        },
        {
          title: "Support manager mensuel",
          detail: "Un point d'animation par mois pour traduire les objectifs réseau en actions terrain."
        },
        {
          title: "Offre pilote locale",
          detail: "Tester une mécanique de services express à forte marge sur une zone de clientèle fidèle."
        }
      ],
      recommended_actions: [
        {
          id: "mrg-action-1",
          title: "Ajouter un benchmark réseau",
          detail: "Comparer le salon à trois profils Provalliance équivalents pour rassurer la marque.",
          owner: "CRM Data",
          due_label: "Sous 3 jours",
          priority: "moyenne"
        },
        {
          id: "mrg-action-2",
          title: "Préparer une synthèse ROI",
          detail: "Mettre en avant les gains potentiels de productivité et de revisite.",
          owner: "Bonnie",
          due_label: "Cette semaine",
          priority: "haute"
        },
        {
          id: "mrg-action-3",
          title: "Planifier la remise du dossier",
          detail: "Organiser un échange structuré avec Sophie Martin après lecture du PDF.",
          owner: "Marie-Pierre",
          due_label: "Avant lundi",
          priority: "moyenne"
        }
      ],
      timeline: [
        {
          id: "mrg-t-1",
          date: "2026-03-07T13:05:00+01:00",
          title: "Création du dossier",
          description: "Dossier ouvert après scoring et revue pipeline.",
          actor: "ScoreMaster",
          kind: "analyse"
        },
        {
          id: "mrg-t-2",
          date: "2026-03-08T09:25:00+01:00",
          title: "Lecture business",
          description: "Accent mis sur rentabilité, process et potentiel réseau.",
          actor: "Bonnie",
          kind: "revue"
        },
        {
          id: "mrg-t-3",
          date: "2026-03-09T17:15:00+01:00",
          title: "Contact salon",
          description: "Sophie Martin confirme son intérêt pour un échange autour d'un modèle plus structuré.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "mrg-t-4",
          date: "2026-03-11T09:30:00+01:00",
          title: "Version finalisée",
          description: "Dossier prêt pour présentation interne à Provalliance.",
          actor: "Dossier Engine",
          kind: "generation"
        }
      ]
    }
  },
  {
    id: "dos-atelier-rhone-wella",
    salon_id: "salon-atelier-rhone",
    brand_id: "brand-wella",
    status: "brouillon",
    generated_at: null,
    created_at: "2026-03-05T11:20:00+01:00",
    salon_name: "Atelier Rhône",
    salon_city: "Lyon 3e",
    brand_name: "Wella",
    compatibility_score: 79,
    salon_info: {
      address: "17 cours Lafayette",
      postal_code: "69003",
      website: "https://atelierrhone.fr",
      team_size: 7,
      google_rating: 4.6,
      review_count: 98,
      specialties: ["Technique couleur", "Cheveux texturés", "Diagnostic coupe"],
      owner_name: "Jérôme Perrin",
      salon_status: "contacte"
    },
    content: {
      executive_summary:
        "Atelier Rhône est un salon technique, moins démonstratif dans son image mais très crédible sur l'exécution. Le dossier est encore au stade brouillon car plusieurs données commerciales doivent être enrichies avant partage marque.",
      brand_rationale:
        "Wella peut y trouver un partenaire terrain solide, capable d'appropriation rapide des protocoles et formations, à condition d'accompagner la montée en visibilité et la formalisation du discours.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 70,
          description: "Positionnement discret, peu travaillé en surface mais cohérent."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 78,
          description: "Clientèle locale fidèle, portée par la qualité d'exécution."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 68,
          description: "Présence en ligne limitée, potentiel d'amélioration notable."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 85,
          description: "Équipe technique stable, très bonne culture métier."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 82,
          description: "Potentiel élevé si le salon est mieux outillé sur l'argumentaire et la mise en avant."
        }
      ],
      strengths: [
        "Très bonne qualité technique perçue par la clientèle.",
        "Équipe stable avec goût pour les protocoles rigoureux.",
        "Dirigeant ouvert à tester un nouveau partenaire.",
        "Bonne base pour construire un case study terrain."
      ],
      watchpoints: [
        "Le salon manque d'assets visuels et de preuves sociales fortes.",
        "La marque devra accompagner davantage la partie visibilité et storytelling."
      ],
      recommended_terms: [
        {
          title: "Audit terrain court",
          detail: "Visite terrain rapide pour confirmer les opportunités d'activation avant proposition finale."
        },
        {
          title: "Support contenu avant/après",
          detail: "Aider l'équipe à formaliser ses meilleures réalisations pour la partie dossier et social."
        },
        {
          title: "Formation protocole référente",
          detail: "Identifier une leader interne pour porter le changement avec Wella."
        }
      ],
      recommended_actions: [
        {
          id: "ar-action-1",
          title: "Collecter les visuels manquants",
          detail: "Rassembler quatre cas avant/après pour crédibiliser la preuve métier dans le dossier.",
          owner: "CRM Data",
          due_label: "Sous 5 jours",
          priority: "haute"
        },
        {
          id: "ar-action-2",
          title: "Programmer une visite terrain",
          detail: "Observer les rituels cabine et l'organisation de l'espace couleur.",
          owner: "Marie-Pierre",
          due_label: "La semaine prochaine",
          priority: "moyenne"
        },
        {
          id: "ar-action-3",
          title: "Compléter le benchmark local",
          detail: "Situer Atelier Rhône face à trois salons lyonnais comparables.",
          owner: "Bonnie",
          due_label: "Quand données prêtes",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "ar-t-1",
          date: "2026-03-05T11:20:00+01:00",
          title: "Brouillon créé",
          description: "Dossier ouvert pour un salon technique à potentiel régional.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "ar-t-2",
          date: "2026-03-06T09:00:00+01:00",
          title: "Audit initial",
          description: "Première lecture centrée sur exécution technique et potentiel formation.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "ar-t-3",
          date: "2026-03-07T15:10:00+01:00",
          title: "Contact dirigeant",
          description: "Jérôme Perrin se dit ouvert à recevoir une synthèse plus concrète.",
          actor: "Bonnie",
          kind: "contact"
        }
      ]
    }
  },
  {
    id: "dos-vestiaire-nuances-myspa",
    salon_id: "salon-vestiaire-des-nuances",
    brand_id: "brand-myspa",
    status: "en_preparation",
    generated_at: null,
    created_at: "2026-03-04T16:10:00+01:00",
    salon_name: "Le Vestiaire des Nuances",
    salon_city: "Bordeaux Centre",
    brand_name: "Myspa",
    compatibility_score: 74,
    salon_info: {
      address: "5 rue Huguerie",
      postal_code: "33000",
      website: "https://vestiairedesnuances.fr",
      team_size: 6,
      google_rating: 4.7,
      review_count: 123,
      specialties: ["Expérience sensorielle", "Rituel soin", "Coloration douce"],
      owner_name: "Anaïs Vial",
      salon_status: "interesse"
    },
    content: {
      executive_summary:
        "Le Vestiaire des Nuances est un salon à forte sensibilité expérience client, avec une atmosphère douce et un vrai potentiel pour des offres bien-être. Le dossier est en préparation pour consolider l'angle soin et l'opportunité business associée.",
      brand_rationale:
        "Myspa peut s'inscrire naturellement dans l'univers du salon si la proposition relie bien les bénéfices bien-être à une logique de panier additionnel et de fidélisation. L'alignement est davantage expérientiel que purement technique.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 83,
          description: "Univers très doux et sensoriel, cohérent avec le bien-être."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 76,
          description: "Clientèle attentive à l'expérience, avec potentiel sur l'offre soin."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 71,
          description: "Visibilité locale propre, faible mise en avant du soin actuellement."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 72,
          description: "Équipe compacte, disponible pour un test progressif."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 68,
          description: "Potentiel réel mais qui demande une scénarisation claire de l'offre et du discours."
        }
      ],
      strengths: [
        "Expérience en salon très cohérente avec un univers soin.",
        "Dirigeante sensible à la montée en valeur du parcours client.",
        "Clientèle ouverte à des rituels additionnels.",
        "Belle note Google et commentaires qualitatifs sur l'accueil."
      ],
      watchpoints: [
        "Nécessité de démontrer le potentiel économique du soin au-delà de l'image.",
        "L'équipe aura besoin d'un protocole simple et activable sans friction."
      ],
      recommended_terms: [
        {
          title: "Test soin 6 semaines",
          detail: "Lancer une offre courte sur un nombre limité de rituels pour mesurer l'appétence réelle."
        },
        {
          title: "Kit formation express",
          detail: "Former toute l'équipe sur un discours commun, simple et orienté bénéfices clients."
        },
        {
          title: "Mise en avant sensorielle",
          detail: "Prévoir un support discret en salon pour matérialiser l'offre sans lourdeur."
        }
      ],
      recommended_actions: [
        {
          id: "vn-action-1",
          title: "Qualifier le panier soin",
          detail: "Estimer la capacité du salon à vendre un rituel additionnel moyen à chaque visite.",
          owner: "Bonnie",
          due_label: "Sous 4 jours",
          priority: "haute"
        },
        {
          id: "vn-action-2",
          title: "Ajouter trois avis clients",
          detail: "Sélectionner des avis mettant en avant détente, ambiance et soin du détail.",
          owner: "CRM Data",
          due_label: "Cette semaine",
          priority: "moyenne"
        },
        {
          id: "vn-action-3",
          title: "Préparer une projection commerciale",
          detail: "Montrer l'impact possible sur panier moyen et fidélisation à 90 jours.",
          owner: "Marie-Pierre",
          due_label: "Avant finalisation",
          priority: "moyenne"
        }
      ],
      timeline: [
        {
          id: "vn-t-1",
          date: "2026-03-04T16:10:00+01:00",
          title: "Dossier ouvert",
          description: "Ciblage d'un salon à potentiel bien-être sur Bordeaux centre.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "vn-t-2",
          date: "2026-03-06T09:55:00+01:00",
          title: "Analyse expérience client",
          description: "Lecture des avis et de l'univers du salon pour l'angle Myspa.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "vn-t-3",
          date: "2026-03-07T14:35:00+01:00",
          title: "Contact dirigeante",
          description: "Anaïs Vial se montre intéressée par une proposition axée soin & fidélisation.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "vn-t-4",
          date: "2026-03-11T11:50:00+01:00",
          title: "Enrichissement en cours",
          description: "Ajout des hypothèses panier et plan de test avant génération PDF.",
          actor: "Dossier Engine",
          kind: "generation"
        }
      ]
    }
  },
  {
    id: "dos-maison-lumiere-saint-algue",
    salon_id: "salon-maison-lumiere",
    brand_id: "brand-saint-algue",
    status: "brouillon",
    generated_at: null,
    created_at: "2026-03-03T10:05:00+01:00",
    salon_name: "Maison Lumière",
    salon_city: "Lille Centre",
    brand_name: "Saint-Algue",
    compatibility_score: 71,
    salon_info: {
      address: "63 rue Esquermoise",
      postal_code: "59800",
      website: "https://maisonlumiere.co",
      team_size: 5,
      google_rating: 4.4,
      review_count: 74,
      specialties: ["Coupe & brushing", "Coloration naturelle", "Clientèle locale"],
      owner_name: "Pauline Mercier",
      salon_status: "nouveau"
    },
    content: {
      executive_summary:
        "Maison Lumière est un salon de quartier premium-accessible, avec une clientèle locale attachée à la qualité relationnelle. Le dossier reste au stade brouillon car plusieurs points doivent être consolidés avant d'en faire une vraie opportunité réseau.",
      brand_rationale:
        "Saint-Algue peut être pertinent si l'objectif est un maillage local et une montée en structure. L'alignement n'est pas immédiat sur l'image, mais crédible sur la proximité, l'accompagnement et la répétition de clientèle.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 69,
          description: "Image simple, rassurante et locale, peu différenciante à ce stade."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 75,
          description: "Bonne récurrence locale avec forte dimension relationnelle."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 62,
          description: "Présence digitale faible, peu d'éléments de preuve visibles."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 70,
          description: "Petite équipe engagée mais encore fragile sur l'absorption du changement."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 78,
          description: "Bon potentiel de récurrence si l'offre réseau apporte clarté et outils."
        }
      ],
      strengths: [
        "Clientèle régulière et attachement fort à la dirigeante.",
        "Salon bien situé sur un flux centre-ville.",
        "Bonne base pour un discours proximité et fidélisation.",
        "Équipe volontaire et appréciée localement."
      ],
      watchpoints: [
        "Structure encore légère pour absorber un projet réseau ambitieux.",
        "Niveau de preuve et de visibilité insuffisant pour partager le dossier tel quel."
      ],
      recommended_terms: [
        {
          title: "Qualification approfondie",
          detail: "Compléter les données business avant tout partage marque."
        },
        {
          title: "Diagnostic organisation",
          detail: "Vérifier capacité managériale et stabilité de l'équipe avant proposition réseau."
        },
        {
          title: "Angle proximité",
          detail: "Structurer le dossier autour de la fidélisation locale et du maillage."
        }
      ],
      recommended_actions: [
        {
          id: "ml-action-1",
          title: "Enrichir la fiche salon",
          detail: "Renseigner site, photos et informations complémentaires sur l'équipe.",
          owner: "CRM Data",
          due_label: "Dès que possible",
          priority: "haute"
        },
        {
          id: "ml-action-2",
          title: "Passer un appel exploratoire",
          detail: "Valider l'ambition de Pauline Mercier avant de poursuivre le dossier.",
          owner: "Bonnie",
          due_label: "Cette semaine",
          priority: "moyenne"
        },
        {
          id: "ml-action-3",
          title: "Préparer un angle réseau léger",
          detail: "Imaginer une première proposition sans engagement trop lourd.",
          owner: "Marie-Pierre",
          due_label: "Après appel",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "ml-t-1",
          date: "2026-03-03T10:05:00+01:00",
          title: "Création brouillon",
          description: "Dossier initié suite à une remontée terrain sur Lille centre.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "ml-t-2",
          date: "2026-03-04T13:40:00+01:00",
          title: "Premier scoring",
          description: "Lecture initiale du fit réseau et du potentiel de proximité.",
          actor: "ScoreMaster",
          kind: "analyse"
        },
        {
          id: "ml-t-3",
          date: "2026-03-05T17:00:00+01:00",
          title: "Données insuffisantes",
          description: "Le dossier reste en brouillon tant que les éléments business ne sont pas consolidés.",
          actor: "QualityGuard",
          kind: "revue"
        }
      ]
    }
  },
  {
    id: "dos-galerie-santal-revlon",
    salon_id: "salon-galerie-santal",
    brand_id: "brand-revlon",
    status: "finalise",
    generated_at: "2026-03-10T12:55:00+01:00",
    created_at: "2026-03-06T15:25:00+01:00",
    salon_name: "Galerie Santal",
    salon_city: "Marseille 6e",
    brand_name: "Revlon",
    compatibility_score: 86,
    salon_info: {
      address: "29 rue Edmond Rostand",
      postal_code: "13006",
      website: "https://galeriesantal.fr",
      team_size: 10,
      google_rating: 4.7,
      review_count: 205,
      specialties: ["Couleur lumineuse", "Coupe mode", "Service premium"],
      owner_name: "Salomé Navarro",
      salon_status: "negociation"
    },
    content: {
      executive_summary:
        "Galerie Santal se distingue par une vraie qualité d'accueil, une clientèle urbaine premium et un univers plus mode qu'institutionnel. Le dossier a été conçu pour démontrer qu'une marque premium peut s'y exprimer sans rigidité, dans un cadre très désirable.",
      brand_rationale:
        "Revlon est ici pertinent pour son pouvoir d'image, sa lecture premium accessible et sa capacité à nourrir un discours aspirationnel. Le salon a le niveau d'expérience et d'équipe pour porter ce récit auprès de ses clientes.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 91,
          description: "Très beau niveau de désirabilité, univers visuel différenciant et premium."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 85,
          description: "Clientèle urbaine à forte attente conseil et expérience."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 82,
          description: "Belle qualité de contenu, marge de progression sur les preuves expertise."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 87,
          description: "Équipe large et seniorisée, capable de porter un lancement rapidement."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 86,
          description: "Potentiel fort sur services premium et revente si le plan retail est bien calibré."
        }
      ],
      strengths: [
        "Univers mode et premium très compatible avec Revlon.",
        "Équipe nombreuse permettant une activation rapide.",
        "Très bon capital sympathie local et bouche-à-oreille.",
        "Capacité à mettre en scène une offre premium sans friction."
      ],
      watchpoints: [
        "Prévoir un cadre de lancement souple, non perçu comme trop institutionnel.",
        "L'équipe attend des outils simples et esthétiques pour vendre la proposition."
      ],
      recommended_terms: [
        {
          title: "Activation premium souple",
          detail: "Déployer un dispositif image et retail discret, adapté au ton créatif du salon."
        },
        {
          title: "Kit de vente visuel",
          detail: "Fournir des supports de consultation élégants et des fiches routine post-service."
        },
        {
          title: "Formation couleur avancée",
          detail: "Prévoir un module expert pour les coloristes seniors afin d'ancrer la crédibilité technique."
        }
      ],
      recommended_actions: [
        {
          id: "gs-action-1",
          title: "Programmer une présentation marque",
          detail: "Organiser un call court avec Salomé Navarro et le responsable trade Revlon.",
          owner: "Bonnie",
          due_label: "Sous 48h",
          priority: "haute"
        },
        {
          id: "gs-action-2",
          title: "Préparer le deck d'activation",
          detail: "Ajouter des mockups retail compatibles avec l'esthétique du salon.",
          owner: "Équipe marque",
          due_label: "Avant call",
          priority: "moyenne"
        },
        {
          id: "gs-action-3",
          title: "Ajouter une projection panier",
          detail: "Montrer l'impact potentiel sur les services premium et la revente routine.",
          owner: "CRM Data",
          due_label: "Cette semaine",
          priority: "moyenne"
        }
      ],
      timeline: [
        {
          id: "gs-t-1",
          date: "2026-03-06T15:25:00+01:00",
          title: "Dossier initié",
          description: "Priorisation du salon pour l'axe premium Marseille.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "gs-t-2",
          date: "2026-03-07T10:45:00+01:00",
          title: "Scoring premium",
          description: "Analyse détaillée du potentiel image et retail.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "gs-t-3",
          date: "2026-03-08T18:00:00+01:00",
          title: "Échange salon",
          description: "Salomé Navarro confirme son intérêt pour une marque premium plus visible.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "gs-t-4",
          date: "2026-03-10T12:55:00+01:00",
          title: "Version finale générée",
          description: "PDF prêt à être partagé à la direction marque.",
          actor: "Dossier Engine",
          kind: "generation"
        }
      ]
    }
  },
  {
    id: "dos-maison-opaline-schwarzkopf",
    salon_id: "salon-maison-opaline",
    brand_id: "brand-schwarzkopf",
    status: "envoye",
    generated_at: "2026-03-09T19:20:00+01:00",
    created_at: "2026-03-05T09:00:00+01:00",
    salon_name: "Maison Opaline",
    salon_city: "Nice Carré d'Or",
    brand_name: "Schwarzkopf",
    compatibility_score: 83,
    salon_info: {
      address: "18 rue Alphonse Karr",
      postal_code: "06000",
      website: "https://maisonopaline.fr",
      team_size: 8,
      google_rating: 4.6,
      review_count: 163,
      specialties: ["Coloration lumineuse", "Clientèle internationale", "Brushing premium"],
      owner_name: "Inès Dervaux",
      salon_status: "rdv_planifie"
    },
    content: {
      executive_summary:
        "Maison Opaline combine un bon niveau de sophistication, une clientèle à forte valeur et un contexte local très propice à une marque premium technique. Le dossier a déjà été transmis et sert désormais de base aux prochains arbitrages.",
      brand_rationale:
        "Schwarzkopf apparaît crédible par son ancrage technique et sa capacité à soutenir une équipe qui veut renforcer son expertise tout en gardant une identité salon élégante et lumineuse.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 87,
          description: "Univers élégant et lumineux, très lisible pour une clientèle premium."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 84,
          description: "Clientèle mixte locale et internationale, sensible à l'expertise."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 77,
          description: "Présence solide mais peu de preuves techniques détaillées."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 82,
          description: "Équipe équilibrée, disposant de deux profils leaders."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 85,
          description: "Très bon potentiel de ventes additionnelles et d'offres signatures."
        }
      ],
      strengths: [
        "Clientèle premium compatible avec une proposition technique haut de gamme.",
        "Emplacement et niveau de service très rassurants pour la marque.",
        "Équipe disposée à renforcer sa différenciation couleur.",
        "Bonne maturité pour un plan pilote rapide."
      ],
      watchpoints: [
        "Le dossier devra prouver davantage la différenciation technique concrète.",
        "Attention à ne pas surcharger l'identité douce et lumineuse du salon."
      ],
      recommended_terms: [
        {
          title: "Test signature couleur",
          detail: "Lancer une offre premium sur une sélection de prestations à forte valeur."
        },
        {
          title: "Coaching équipe leaders",
          detail: "Former deux référentes internes pour assurer le relais en continu."
        },
        {
          title: "Suivi satisfaction clientes",
          detail: "Mesurer rapidement l'adhésion aux nouvelles routines et au discours service."
        }
      ],
      recommended_actions: [
        {
          id: "mo-action-1",
          title: "Obtenir le retour marque",
          detail: "Suivre la lecture du dossier envoyé et identifier les objections restantes.",
          owner: "Bonnie",
          due_label: "Aujourd'hui",
          priority: "haute"
        },
        {
          id: "mo-action-2",
          title: "Préparer la réunion de cadrage",
          detail: "Consolider les données d'équipe et les attentes dirigeante avant le rendez-vous.",
          owner: "Marie-Pierre",
          due_label: "Avant vendredi",
          priority: "moyenne"
        },
        {
          id: "mo-action-3",
          title: "Ajouter un volet technique",
          detail: "Renforcer le dossier avec deux exemples de services couleur signés du salon.",
          owner: "CRM Data",
          due_label: "Sous 1 semaine",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "mo-t-1",
          date: "2026-03-05T09:00:00+01:00",
          title: "Dossier ouvert",
          description: "Salon ciblé pour la verticale premium Côte d'Azur.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "mo-t-2",
          date: "2026-03-06T12:30:00+01:00",
          title: "Audit technique",
          description: "Analyse croisée image, équipe et potentiel services signatures.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "mo-t-3",
          date: "2026-03-07T16:00:00+01:00",
          title: "Call salon",
          description: "Inès Dervaux valide l'intérêt pour un partenariat plus technique et premium.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "mo-t-4",
          date: "2026-03-09T14:10:00+01:00",
          title: "PDF généré",
          description: "Version exécutive prête pour envoi à la marque.",
          actor: "Dossier Engine",
          kind: "generation"
        },
        {
          id: "mo-t-5",
          date: "2026-03-09T19:20:00+01:00",
          title: "Envoi à la marque",
          description: "Dossier partagé à l'équipe partenariats Schwarzkopf.",
          actor: "Bonnie",
          kind: "envoi"
        }
      ]
    }
  },
  {
    id: "dos-atelier-camelia-provalliance",
    salon_id: "salon-atelier-camelia",
    brand_id: "brand-provalliance",
    status: "en_preparation",
    generated_at: null,
    created_at: "2026-03-02T09:40:00+01:00",
    salon_name: "Atelier Camélia",
    salon_city: "Nantes Graslin",
    brand_name: "Provalliance",
    compatibility_score: 76,
    salon_info: {
      address: "11 rue Crébillon",
      postal_code: "44000",
      website: "https://ateliercamelia.fr",
      team_size: 6,
      google_rating: 4.5,
      review_count: 111,
      specialties: ["Clientèle locale premium", "Coupe & couleur", "Exécution régulière"],
      owner_name: "Camille Aubert",
      salon_status: "contacte"
    },
    content: {
      executive_summary:
        "Atelier Camélia est un salon équilibré, bien tenu, avec une clientèle locale qualitative et une fondatrice ouverte à plus de structure. Le dossier est en préparation pour affiner l'angle réseau et confirmer les chiffres clés.",
      brand_rationale:
        "Provalliance peut aider Atelier Camélia à passer un cap d'organisation et de performance. Le fit est avant tout managérial et business, avec un enjeu de projection plus que d'image pure.",
      score_breakdown: [
        {
          id: "image",
          label: "Image & positionnement",
          score: 74,
          description: "Image sobre et qualitative, sans marqueur premium extrême."
        },
        {
          id: "clientele",
          label: "Qualité de clientèle",
          score: 78,
          description: "Bonne base locale avec récurrence intéressante."
        },
        {
          id: "digital",
          label: "Présence digitale",
          score: 70,
          description: "Visibilité digitale correcte mais peu exploitée commercialement."
        },
        {
          id: "team",
          label: "Solidité d'équipe",
          score: 77,
          description: "Équipe stable mais encore peu outillée sur le pilotage."
        },
        {
          id: "commercial",
          label: "Potentiel commercial",
          score: 81,
          description: "Levier réel si un cadre réseau apporte rituels et suivi managérial."
        }
      ],
      strengths: [
        "Salon sain, bien géré et apprécié localement.",
        "Fondatrice réceptive à une logique plus structurée.",
        "Potentiel clair sur récurrence et panier avec meilleur pilotage.",
        "Bonne compatibilité avec un discours réseau pragmatique."
      ],
      watchpoints: [
        "Nécessité d'objectiver davantage les chiffres avant finalisation.",
        "Le dossier doit montrer un avant/après concret pour convaincre la dirigeante."
      ],
      recommended_terms: [
        {
          title: "Projection business 90 jours",
          detail: "Montrer un scénario simple d'amélioration panier, fréquence et organisation."
        },
        {
          title: "Accompagnement manager",
          detail: "Proposer un support de pilotage léger pour sécuriser la prise en main."
        },
        {
          title: "Activation locale mesurée",
          detail: "Déployer une mécanique adaptée au bassin nantais sans complexité inutile."
        }
      ],
      recommended_actions: [
        {
          id: "ac-action-1",
          title: "Compléter les KPI salon",
          detail: "Confirmer panier moyen, taux de revisite et capacité de vente additionnelle.",
          owner: "CRM Data",
          due_label: "Sous 72h",
          priority: "haute"
        },
        {
          id: "ac-action-2",
          title: "Préparer l'argumentaire réseau",
          detail: "Traduire les bénéfices Provalliance en langage très concret pour Camille Aubert.",
          owner: "Bonnie",
          due_label: "Cette semaine",
          priority: "moyenne"
        },
        {
          id: "ac-action-3",
          title: "Ajouter un comparatif local",
          detail: "Positionner le salon face à deux concurrents directs sur Nantes centre.",
          owner: "Marie-Pierre",
          due_label: "Avant finalisation",
          priority: "faible"
        }
      ],
      timeline: [
        {
          id: "ac-t-1",
          date: "2026-03-02T09:40:00+01:00",
          title: "Dossier créé",
          description: "Ouverture d'un dossier pour un profil local à potentiel réseau.",
          actor: "Bonnie",
          kind: "analyse"
        },
        {
          id: "ac-t-2",
          date: "2026-03-03T16:15:00+01:00",
          title: "Scoring business",
          description: "Lecture des critères de structure, stabilité et potentiel de progression.",
          actor: "BrandMatcher",
          kind: "analyse"
        },
        {
          id: "ac-t-3",
          date: "2026-03-05T11:30:00+01:00",
          title: "Appel de découverte",
          description: "Camille Aubert se montre curieuse d'une logique plus structurée, sans se projeter encore.",
          actor: "Marie-Pierre",
          kind: "contact"
        },
        {
          id: "ac-t-4",
          date: "2026-03-11T08:20:00+01:00",
          title: "Préparation du dossier final",
          description: "Travail en cours sur la projection KPI et le benchmark local.",
          actor: "Dossier Engine",
          kind: "generation"
        }
      ]
    }
  }
];

export function getDossierById(id: string) {
  return clientDossiers.find((dossier) => dossier.id === id) ?? null;
}
