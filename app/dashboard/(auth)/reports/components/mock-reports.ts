export const reportRanges = [
  "Aujourd’hui",
  "7 jours",
  "30 jours",
  "90 jours",
  "Personnalisé"
] as const;

export const pipelineOverview = {
  kpis: {
    conversionGlobal: "18,4%",
    cycleMoyen: "12 jours",
    variation: "+3,1 pts vs mois dernier"
  },
  funnel: [
    { stage: "Nouveaux", value: 312 },
    { stage: "Contactés", value: 201 },
    { stage: "Intéressés", value: 108 },
    { stage: "RDV", value: 47 },
    { stage: "Négociation", value: 21 },
    { stage: "Gagnés", value: 14 }
  ],
  stageTimes: [
    { stage: "Nouveau → Contacté", days: 2.1 },
    { stage: "Contacté → Intéressé", days: 3.8 },
    { stage: "Intéressé → RDV", days: 2.7 },
    { stage: "RDV → Négociation", days: 1.9 },
    { stage: "Négociation → Gagné", days: 1.5 }
  ]
};

export const enrichmentProgress = {
  totalSalons: 1707,
  enrichedSalons: 513,
  quality: [
    { label: "Téléphone", value: 39 },
    { label: "Website", value: 24 },
    { label: "Email", value: 31 },
    { label: "Google rating", value: 67 }
  ],
  daily: [
    { day: "1 Mar", enriched: 12 },
    { day: "2 Mar", enriched: 18 },
    { day: "3 Mar", enriched: 15 },
    { day: "4 Mar", enriched: 21 },
    { day: "5 Mar", enriched: 17 },
    { day: "6 Mar", enriched: 25 },
    { day: "7 Mar", enriched: 19 },
    { day: "8 Mar", enriched: 22 },
    { day: "9 Mar", enriched: 20 },
    { day: "10 Mar", enriched: 26 },
    { day: "11 Mar", enriched: 28 },
    { day: "12 Mar", enriched: 23 }
  ],
  departments: [
    { department: "75", count: 86 },
    { department: "69", count: 54 },
    { department: "92", count: 42 },
    { department: "13", count: 31 }
  ]
};

export const scoringDistribution = {
  histogram: [
    { range: "0-10", value: 16 },
    { range: "10-20", value: 38 },
    { range: "20-30", value: 102 },
    { range: "30-40", value: 194 },
    { range: "40-50", value: 267 },
    { range: "50-60", value: 331 },
    { range: "60-70", value: 289 },
    { range: "70-80", value: 214 },
    { range: "80-90", value: 108 },
    { range: "90-100", value: 48 }
  ],
  averageTrend: [
    { period: "S1", score: 54 },
    { period: "S2", score: 55 },
    { period: "S3", score: 57 },
    { period: "S4", score: 58 },
    { period: "S5", score: 59 },
    { period: "S6", score: 62 }
  ],
  topSalons: [
    { salon: "Maison Kintsugi", score: 91 },
    { salon: "Studio Montaigne", score: 87 },
    { salon: "Les Muses Coloristes", score: 88 },
    { salon: "Maison Rive Gauche", score: 82 }
  ],
  departments: [
    { department: "75", score: 67 },
    { department: "92", score: 63 },
    { department: "69", score: 61 },
    { department: "13", score: 58 }
  ]
};

export const outreachPerformance = {
  funnel: [
    { stage: "Envoyés", value: 1248 },
    { stage: "Ouverts", value: 713 },
    { stage: "Réponses", value: 194 },
    { stage: "RDV", value: 63 }
  ],
  sequenceRates: [
    { name: "Revlon Premium Paris", openRate: 46, replyRate: 17 },
    { name: "Wella Croissance Lyon", openRate: 40, replyRate: 16 },
    { name: "Dossier chaud ÎDF", openRate: 44, replyRate: 34 }
  ],
  bestTemplates: [
    { template: "Intro premium salon", replies: 21 },
    { template: "Relance douce J+3", replies: 14 },
    { template: "Envoi de dossier PDF", replies: 11 }
  ],
  cities: [
    { city: "Paris", rate: 22 },
    { city: "Lyon", rate: 18 },
    { city: "Neuilly", rate: 16 },
    { city: "Boulogne", rate: 14 }
  ]
};

export const brandMatching = {
  brands: [
    { brand: "Revlon", score: 78 },
    { brand: "Wella", score: 74 },
    { brand: "Schwarzkopf", score: 69 },
    { brand: "Provalliance", score: 71 },
    { brand: "Myspa", score: 63 },
    { brand: "Saint-Algue", score: 66 }
  ],
  proposals: {
    sent: 42,
    accepted: 11,
    pending: 19,
    auctionOpen: 6,
    auctionClosed: 13,
    averageBid: "€4 200"
  }
};

export const agentPerformance = {
  stacked: [
    { day: "Lun", DataScout: 42, EnrichBot: 25, ScoreMaster: 19, OutreachPilot: 14, BrandMatcher: 9 },
    { day: "Mar", DataScout: 38, EnrichBot: 31, ScoreMaster: 21, OutreachPilot: 18, BrandMatcher: 11 },
    { day: "Mer", DataScout: 44, EnrichBot: 28, ScoreMaster: 24, OutreachPilot: 17, BrandMatcher: 10 },
    { day: "Jeu", DataScout: 36, EnrichBot: 34, ScoreMaster: 18, OutreachPilot: 16, BrandMatcher: 12 },
    { day: "Ven", DataScout: 47, EnrichBot: 29, ScoreMaster: 26, OutreachPilot: 21, BrandMatcher: 13 },
    { day: "Sam", DataScout: 28, EnrichBot: 14, ScoreMaster: 9, OutreachPilot: 8, BrandMatcher: 5 },
    { day: "Dim", DataScout: 18, EnrichBot: 11, ScoreMaster: 7, OutreachPilot: 5, BrandMatcher: 4 }
  ],
  approvals: [
    { agent: "DataScout", approvalRate: 94, avgProcessingHours: 1.2, errors: 2 },
    { agent: "EnrichBot", approvalRate: 91, avgProcessingHours: 1.8, errors: 4 },
    { agent: "ScoreMaster", approvalRate: 96, avgProcessingHours: 0.9, errors: 1 },
    { agent: "OutreachPilot", approvalRate: 89, avgProcessingHours: 2.4, errors: 5 },
    { agent: "BrandMatcher", approvalRate: 93, avgProcessingHours: 1.4, errors: 2 }
  ]
};
