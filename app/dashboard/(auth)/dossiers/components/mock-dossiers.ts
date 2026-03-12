export type DossierSectionType = "text" | "stats" | "photos";

export type DossierSection = {
  id: string;
  title: string;
  type: DossierSectionType;
  content: string;
};

export type DossierBrandCompatibility = {
  brand: string;
  score: number;
  rationale: string;
};

export type DossierStat = {
  label: string;
  value: string;
  trend: string;
};

export type DossierPhoto = {
  id: string;
  url: string;
  alt: string;
};

export type BrandProposal = {
  id: string;
  brand: string;
  status: "draft" | "sent" | "accepted" | "pending";
  contact: string;
};

export type ClientDossier = {
  id: string;
  title: string;
  salon: string;
  city: string;
  brands: string[];
  status: "draft" | "ready" | "sent";
  createdAt: string;
  updatedAt: string;
  pdfUrl: string;
  owner: string;
  summary: string;
  highlights: string[];
  sections: DossierSection[];
  brandCompatibility: DossierBrandCompatibility[];
  stats: DossierStat[];
  photos: DossierPhoto[];
  sharedWithBrands: string[];
  proposals: BrandProposal[];
};

const photoBase = [
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"
];

export const clientDossiers: ClientDossier[] = [
  {
    id: "dos-maison-kintsugi",
    title: "Maison Kintsugi — dossier premium Revlon",
    salon: "Maison Kintsugi",
    city: "Paris 8e",
    brands: ["Revlon", "Wella"],
    status: "ready",
    createdAt: "2026-03-09T09:30:00",
    updatedAt: "2026-03-11T16:15:00",
    pdfUrl: "/mock/dossiers/maison-kintsugi.pdf",
    owner: "Bonnie",
    summary:
      "Dossier premium centré sur la désirabilité du salon, sa clientèle à forte valeur et sa capacité à porter une marque premium avec exigence d’exécution.",
    highlights: [
      "Google rating 4,8 / 5 avec 312 avis",
      "Clientèle premium internationale et régulière",
      "Positionnement couleur et image compatible Revlon",
      "Équipe stable de 11 personnes"
    ],
    sections: [
      {
        id: "mk-intro",
        title: "Narratif salon",
        type: "text",
        content:
          `<h2>Une adresse premium au service très incarné</h2><p>Maison Kintsugi s’est imposée comme une référence parisienne pour une clientèle sensible à la qualité d’accueil, à l’expertise technique et à l’image globale du salon.</p><p>Le salon combine une forte exigence esthétique avec une vraie culture du détail, ce qui le rend particulièrement pertinent pour des partenariats premium.</p>`
      },
      {
        id: "mk-business",
        title: "Points business clés",
        type: "stats",
        content:
          `<ul><li>Panier moyen élevé</li><li>Excellent taux de revisite</li><li>Visibilité digitale supérieure à la moyenne premium</li></ul>`
      },
      {
        id: "mk-photos",
        title: "Ambiance & univers visuel",
        type: "photos",
        content:
          `<p>Un univers très cohérent, premium et lumineux, avec des espaces consultation et couleur bien identifiés.</p>`
      }
    ],
    brandCompatibility: [
      {
        brand: "Revlon",
        score: 91,
        rationale: "Très forte cohérence image, clientèle et niveau de service."
      },
      {
        brand: "Wella",
        score: 78,
        rationale: "Compatible sur la partie expertise et formation, légèrement moins iconique côté marque."
      }
    ],
    stats: [
      { label: "Score global", value: "91/100", trend: "+6 pts" },
      { label: "Avis Google", value: "312", trend: "+18 ce mois" },
      { label: "Taux de réponse outreach", value: "42%", trend: "+11 pts" }
    ],
    photos: photoBase.slice(0, 3).map((url, index) => ({
      id: `mk-photo-${index}`,
      url,
      alt: `Maison Kintsugi photo ${index + 1}`
    })),
    sharedWithBrands: ["Revlon France"],
    proposals: [
      { id: "prop-mk-01", brand: "Revlon", status: "sent", contact: "Équipe trade Revlon" },
      { id: "prop-mk-02", brand: "Wella", status: "draft", contact: "Responsable régional Wella" }
    ]
  },
  {
    id: "dos-muses-coloristes",
    title: "Les Muses Coloristes — dossier croissance Wella",
    salon: "Les Muses Coloristes",
    city: "Lyon 2e",
    brands: ["Wella"],
    status: "draft",
    createdAt: "2026-03-05T14:00:00",
    updatedAt: "2026-03-11T10:50:00",
    pdfUrl: "/mock/dossiers/les-muses-coloristes.pdf",
    owner: "Marie-Pierre",
    summary:
      "Dossier orienté croissance équipe, montée en compétence et potentiel de partenariat formation avec Wella.",
    highlights: [
      "Salon en croissance avec 8 collaborateurs",
      "Forte appétence pour la formation couleur",
      "Bonne traction locale Instagram",
      "Dirigeante très ouverte à l’accompagnement"
    ],
    sections: [
      {
        id: "mc-intro",
        title: "Positionnement actuel",
        type: "text",
        content:
          `<p>Les Muses Coloristes se positionne comme une adresse moderne, très centrée sur l’expertise couleur et les transformations avant/après. L’équipe est encore en phase de structuration, ce qui crée une vraie opportunité de partenariat formation.</p>`
      },
      {
        id: "mc-stats",
        title: "Indicateurs de traction",
        type: "stats",
        content:
          `<ul><li>Instagram engagé</li><li>Excellente note Google</li><li>Forte croissance organique locale</li></ul>`
      },
      {
        id: "mc-photos",
        title: "Espaces du salon",
        type: "photos",
        content: `<p>Le salon dispose d’un espace couleur bien identifié et d’une esthétique contemporaine.</p>`
      }
    ],
    brandCompatibility: [
      { brand: "Wella", score: 88, rationale: "Très fort fit formation / croissance / expertise couleur." },
      { brand: "Schwarzkopf", score: 69, rationale: "Pertinent mais moins aligné sur la trajectoire actuelle." }
    ],
    stats: [
      { label: "Score global", value: "88/100", trend: "+4 pts" },
      { label: "Followers Insta", value: "8,4k", trend: "+9%" },
      { label: "Équipe", value: "8 pers.", trend: "+2 sur 12 mois" }
    ],
    photos: photoBase.slice(1, 4).map((url, index) => ({
      id: `mc-photo-${index}`,
      url,
      alt: `Les Muses photo ${index + 1}`
    })),
    sharedWithBrands: [],
    proposals: [{ id: "prop-mc-01", brand: "Wella", status: "pending", contact: "Manager éducation Wella" }]
  },
  {
    id: "dos-studio-montaigne",
    title: "Studio Montaigne — shortlist premium multi-marques",
    salon: "Studio Montaigne",
    city: "Paris 16e",
    brands: ["Revlon", "Provalliance", "Saint-Algue"],
    status: "sent",
    createdAt: "2026-03-02T08:40:00",
    updatedAt: "2026-03-10T17:20:00",
    pdfUrl: "/mock/dossiers/studio-montaigne.pdf",
    owner: "Bonnie",
    summary:
      "Dossier comparatif montrant les leviers de compatibilité avec plusieurs marques premium/réseau selon l’angle de développement recherché.",
    highlights: [
      "Très forte qualité perçue et service consultation",
      "Localisation premium avec clientèle stable",
      "Potentiel réseau à court terme",
      "Marque personnelle de la fondatrice déjà bien installée"
    ],
    sections: [
      {
        id: "sm-intro",
        title: "Positionnement & ambition",
        type: "text",
        content:
          `<p>Studio Montaigne est un salon mature, exigeant, qui peut entrer soit dans une logique premium image, soit dans une logique réseau structurée selon l’ambition de la fondatrice.</p>`
      },
      {
        id: "sm-comparison",
        title: "Comparatif de scénarios marque",
        type: "stats",
        content:
          `<ul><li>Option premium image : Revlon</li><li>Option structure réseau : Provalliance</li><li>Option développement local : Saint-Algue</li></ul>`
      },
      {
        id: "sm-photos",
        title: "Ambiance premium",
        type: "photos",
        content: `<p>Le salon propose une expérience très soignée, avec une ambiance claire et architecturée.</p>`
      }
    ],
    brandCompatibility: [
      { brand: "Revlon", score: 87, rationale: "Très fort alignement image et niveau de service." },
      { brand: "Provalliance", score: 79, rationale: "Bon potentiel si volonté d’accélération réseau." },
      { brand: "Saint-Algue", score: 71, rationale: "Option de maillage local crédible." }
    ],
    stats: [
      { label: "Score global", value: "87/100", trend: "+3 pts" },
      { label: "Taux de revisite estimé", value: "68%", trend: "stable" },
      { label: "Panier moyen", value: "€124", trend: "+7%" }
    ],
    photos: photoBase.slice(0, 4).map((url, index) => ({
      id: `sm-photo-${index}`,
      url,
      alt: `Studio Montaigne photo ${index + 1}`
    })),
    sharedWithBrands: ["Revlon France", "Provalliance"],
    proposals: [
      { id: "prop-sm-01", brand: "Revlon", status: "accepted", contact: "Directrice partenariat Revlon" },
      { id: "prop-sm-02", brand: "Provalliance", status: "sent", contact: "Responsable expansion" }
    ]
  },
  {
    id: "dos-maison-rive-gauche",
    title: "Maison Rive Gauche — dossier business case",
    salon: "Maison Rive Gauche",
    city: "Boulogne-Billancourt",
    brands: ["Provalliance", "Myspa"],
    status: "ready",
    createdAt: "2026-03-04T13:25:00",
    updatedAt: "2026-03-11T09:45:00",
    pdfUrl: "/mock/dossiers/maison-rive-gauche.pdf",
    owner: "Bonnie",
    summary:
      "Dossier orienté business case, potentiel de chiffre et capacité à porter une offre plus structurée ou adjacente bien-être.",
    highlights: [
      "Clientèle locale fidèle avec panier stable",
      "Dirigeante orientée performance et gestion",
      "Possibilité d’extension vers une proposition bien-être",
      "Zone de chalandise dense"
    ],
    sections: [
      {
        id: "mrg-intro",
        title: "Lecture business du salon",
        type: "text",
        content:
          `<p>Maison Rive Gauche est piloté de manière rigoureuse, avec une attention marquée à la productivité, au panier moyen et à la fidélisation. Le salon se prête bien à une argumentation business structurée.</p>`
      },
      {
        id: "mrg-stats",
        title: "KPI & potentiel",
        type: "stats",
        content:
          `<ul><li>Zone de chalandise dense</li><li>Bonne récurrence client</li><li>Capacité à porter une offre complémentaire</li></ul>`
      },
      {
        id: "mrg-photos",
        title: "Parcours client",
        type: "photos",
        content: `<p>Espaces efficaces, bien organisés, au service d’une exploitation fluide.</p>`
      }
    ],
    brandCompatibility: [
      { brand: "Provalliance", score: 82, rationale: "Très bon fit pour logique réseau / performance." },
      { brand: "Myspa", score: 75, rationale: "Intéressant si extension bien-être activée." }
    ],
    stats: [
      { label: "Score global", value: "82/100", trend: "+5 pts" },
      { label: "Panier moyen", value: "€93", trend: "+4%" },
      { label: "Potentiel dossier", value: "Élevé", trend: "confirmé" }
    ],
    photos: photoBase.slice(2, 5).map((url, index) => ({
      id: `mrg-photo-${index}`,
      url,
      alt: `Maison Rive Gauche photo ${index + 1}`
    })),
    sharedWithBrands: ["Provalliance"],
    proposals: [{ id: "prop-mrg-01", brand: "Provalliance", status: "pending", contact: "Directeur réseau" }]
  },
  {
    id: "dos-atelier-rhone",
    title: "Atelier Rhône — dossier régional scalable",
    salon: "Atelier Rhône",
    city: "Lyon 3e",
    brands: ["Wella", "Schwarzkopf"],
    status: "draft",
    createdAt: "2026-03-01T11:10:00",
    updatedAt: "2026-03-08T17:30:00",
    pdfUrl: "/mock/dossiers/atelier-rhone.pdf",
    owner: "Marie-Pierre",
    summary:
      "Dossier régional pour salon solide, très technique, pouvant évoluer vers un partenariat marque structurant à horizon 6-12 mois.",
    highlights: [
      "Base clientèle locale fidèle",
      "Excellent niveau technique de l’équipe",
      "Direction ouverte au changement de partenaire",
      "Bonne capacité de test et montée en compétence"
    ],
    sections: [
      {
        id: "ar-intro",
        title: "Lecture terrain",
        type: "text",
        content:
          `<p>Atelier Rhône n’est pas un salon de communication, mais un salon de qualité d’exécution. C’est précisément ce qui en fait un candidat intéressant pour une marque en recherche de crédibilité terrain.</p>`
      },
      {
        id: "ar-stats",
        title: "Indicateurs opérationnels",
        type: "stats",
        content: `<ul><li>Équipe technique solide</li><li>Récurrence élevée</li><li>Capacité d’appropriation des protocoles</li></ul>`
      },
      {
        id: "ar-photos",
        title: "Visuels de production",
        type: "photos",
        content: `<p>Le salon présente des zones de travail nettes et fonctionnelles, avec une vraie culture de l’exécution.</p>`
      }
    ],
    brandCompatibility: [
      { brand: "Wella", score: 81, rationale: "Très bon potentiel formation et déploiement protocole." },
      { brand: "Schwarzkopf", score: 77, rationale: "Très crédible techniquement, un peu moins en storytelling de marque." }
    ],
    stats: [
      { label: "Score global", value: "81/100", trend: "+2 pts" },
      { label: "Taux de réponse outreach", value: "25%", trend: "+6 pts" },
      { label: "Capacité équipe", value: "7 pers.", trend: "stable" }
    ],
    photos: photoBase.slice(0, 3).map((url, index) => ({
      id: `ar-photo-${index}`,
      url,
      alt: `Atelier Rhône photo ${index + 1}`
    })),
    sharedWithBrands: [],
    proposals: [{ id: "prop-ar-01", brand: "Wella", status: "draft", contact: "Trade manager AuRA" }]
  }
];

export function getDossierById(id: string) {
  return clientDossiers.find((dossier) => dossier.id === id) ?? null;
}
