export type SalonStatus =
  | "nouveau"
  | "contacte"
  | "interesse"
  | "rdv_planifie"
  | "negociation"
  | "gagne"
  | "perdu"
  | "client_actif";

export type ProposalStatus = "Brouillon" | "Envoyée" | "Acceptée" | "Refusée";
export type AuctionStatus = "En cours" | "Terminée" | "Perdue";

export interface BrandCriterion {
  criterion: string;
  operator: string;
  value: string | number | boolean;
  weight: number;
}

export interface BrandSalon {
  id: string;
  name: string;
  city: string;
  department: string;
  status: SalonStatus;
  salon_score: number;
  compatibility_score: number;
}

export interface BrandProposal {
  id: string;
  salon_name: string;
  status: ProposalStatus;
  proposed_at: string;
  proposed_by: string;
  brand_response: string;
}

export interface BrandAuction {
  id: string;
  title: string;
  status: AuctionStatus;
  start_date: string;
  end_date: string;
  last_bid: string;
  result: string;
}

export interface CompatibilityDistributionPoint {
  bucket: string;
  count: number;
}

export interface ProposalSuccessPoint {
  month: string;
  proposed: number;
  accepted: number;
}

export interface TopSalonPoint {
  name: string;
  city: string;
  compatibility_score: number;
}

export interface BrandStats {
  thresholds: {
    gt50: number;
    gt70: number;
    gt90: number;
  };
  compatibility_distribution: CompatibilityDistributionPoint[];
  proposal_success: ProposalSuccessPoint[];
  top_salons: TopSalonPoint[];
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  logo_url: string;
  website: string;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  compatible_salon_count: number;
  average_compatibility: number;
  total_proposals: number;
  acceptance_rate: number;
  metadata: {
    criteria: Record<string, string | number | boolean>;
    criteria_table: BrandCriterion[];
  };
  salons: BrandSalon[];
  proposals: BrandProposal[];
  auctions: BrandAuction[];
  stats: BrandStats;
}
