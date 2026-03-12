export type ContactStatus = "actif" | "inactif";

export interface ContactOutreachEntry {
  id: string;
  date: string;
  channel: "Email" | "Téléphone" | "WhatsApp";
  status: "Envoyé" | "Répondu" | "À relancer" | "Appel effectué";
  summary: string;
}

export interface ContactNote {
  id: string;
  date: string;
  content: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  salon_id: string;
  salon_name: string;
  salon_city: string;
  role: string;
  phone: string | null;
  email: string | null;
  is_decision_maker: boolean;
  status: ContactStatus;
  linkedin: string | null;
  instagram: string | null;
  last_contact: string;
  outreach_history: ContactOutreachEntry[];
  notes: ContactNote[];
}
