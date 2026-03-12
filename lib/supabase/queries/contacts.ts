import type {
  Contact,
  ContactNote,
  ContactOutreachEntry,
  ContactStatus
} from "@/app/dashboard/(auth)/contacts/components/types";
import { createAdminClient } from "@/lib/supabase/admin";

type OutreachChannelLabel = ContactOutreachEntry["channel"];
type OutreachStatusLabel = ContactOutreachEntry["status"];

interface SalonRelation {
  id: string | null;
  name: string | null;
  city: string | null;
}

interface ContactRow {
  id: string;
  salon_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  instagram: string | null;
  linkedin: string | null;
  notes: string | null;
  status: string | null;
  source?: string | null;
  is_decision_maker: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  salons?: SalonRelation | SalonRelation[] | null;
}

interface OutreachRow {
  id: string;
  contact_id: string | null;
  channel: string | null;
  type: string | null;
  content: string | null;
  status: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  response_content: string | null;
  responded_at: string | null;
  created_at: string | null;
}

export async function getContacts(options?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ contacts: Contact[]; total: number }> {
  const supabase = createAdminClient();

  let query = supabase
    .from("contacts")
    .select(
      "id, salon_id, first_name, last_name, email, phone, role, instagram, linkedin, notes, status, source, is_decision_maker, created_at, updated_at, deleted_at, salons:salon_id(id, name, city)",
      { count: "exact" }
    )
    .is("deleted_at", null);

  if (options?.search?.trim()) {
    const search = sanitizeSearchValue(options.search);
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  if (typeof options?.limit === "number" && typeof options?.offset === "number") {
    query = query.range(options.offset, options.offset + options.limit - 1);
  } else if (typeof options?.limit === "number") {
    query = query.limit(options.limit);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching contacts:", error);
    return { contacts: [], total: 0 };
  }

  const contactRows = ((data as ContactRow[] | null) ?? []).filter((contact) => {
    const salon = unwrapRelation<SalonRelation>(contact.salons);
    return Boolean(contact.id && contact.salon_id && salon?.id);
  });

  const outreachByContactId = await getOutreachByContactId(
    supabase,
    contactRows.map((contact) => contact.id)
  );

  const contacts = contactRows.map((contact) => {
    const salon = unwrapRelation<SalonRelation>(contact.salons);
    const outreachHistory = outreachByContactId.get(contact.id) ?? [];
    const lastContact =
      outreachHistory[0]?.date ??
      asIsoDate(contact.updated_at) ??
      asIsoDate(contact.created_at) ??
      new Date(0).toISOString();

    return {
      id: contact.id,
      first_name: asNonEmptyString(contact.first_name, "Sans prénom"),
      last_name: asNonEmptyString(contact.last_name, "Sans nom"),
      salon_id: asNonEmptyString(contact.salon_id),
      salon_name: asNonEmptyString(salon?.name, "Salon non renseigné"),
      salon_city: asNonEmptyString(salon?.city, "Ville inconnue"),
      role: asNonEmptyString(contact.role, "Contact"),
      phone: contact.phone,
      email: contact.email,
      is_decision_maker: Boolean(contact.is_decision_maker),
      status: normalizeContactStatus(contact.status),
      linkedin: contact.linkedin,
      instagram: contact.instagram,
      last_contact: lastContact,
      outreach_history: outreachHistory,
      notes: buildNotes(contact)
    } satisfies Contact;
  });

  return {
    contacts,
    total: count ?? contacts.length
  };
}

async function getOutreachByContactId(
  supabase: ReturnType<typeof createAdminClient>,
  contactIds: string[]
): Promise<Map<string, ContactOutreachEntry[]>> {
  const outreachByContactId = new Map<string, ContactOutreachEntry[]>();

  if (contactIds.length === 0) {
    return outreachByContactId;
  }

  const { data, error } = await supabase
    .from("outreach")
    .select(
      "id, contact_id, channel, type, content, status, scheduled_at, sent_at, response_content, responded_at, created_at"
    )
    .in("contact_id", contactIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching outreach history:", error);
    return outreachByContactId;
  }

  for (const row of (data as OutreachRow[] | null) ?? []) {
    if (!row.contact_id) {
      continue;
    }

    const current = outreachByContactId.get(row.contact_id) ?? [];
    current.push(mapOutreachRow(row));
    outreachByContactId.set(row.contact_id, current);
  }

  return outreachByContactId;
}

function mapOutreachRow(row: OutreachRow): ContactOutreachEntry {
  const date =
    asIsoDate(row.responded_at) ??
    asIsoDate(row.sent_at) ??
    asIsoDate(row.scheduled_at) ??
    asIsoDate(row.created_at) ??
    new Date(0).toISOString();

  return {
    id: row.id,
    date,
    channel: mapOutreachChannel(row.channel),
    status: mapOutreachStatus(row),
    summary: summarizeOutreach(row)
  };
}

function buildNotes(contact: ContactRow): ContactNote[] {
  if (!contact.notes) {
    return [];
  }

  return [
    {
      id: `note-${contact.id}`,
      date:
        asIsoDate(contact.updated_at) ??
        asIsoDate(contact.created_at) ??
        new Date(0).toISOString(),
      content: contact.notes
    }
  ];
}

function summarizeOutreach(row: OutreachRow): string {
  const response = cleanText(row.response_content);

  if (response) {
    return response;
  }

  const content = parseContentPayload(row.content);

  if (content) {
    return content;
  }

  if (row.type) {
    return `Interaction ${row.type.replaceAll("_", " ")} enregistrée.`;
  }

  return "Interaction enregistrée.";
}

function parseContentPayload(content: string | null): string | null {
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as unknown;

    if (typeof parsed === "string") {
      return cleanText(parsed);
    }

    if (parsed && typeof parsed === "object") {
      const payload = parsed as Record<string, unknown>;
      const subject = cleanText(asNullableString(payload.subject));
      const text = cleanText(asNullableString(payload.text));
      const html = cleanText(asNullableString(payload.html));
      const template = cleanText(asNullableString(payload.template));

      return subject ?? text ?? html ?? template ?? cleanText(JSON.stringify(payload));
    }
  } catch {}

  return cleanText(content);
}

function cleanText(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const withoutHtml = value.replace(/<[^>]+>/g, " ");
  const compact = withoutHtml.replace(/\s+/g, " ").trim();

  if (!compact) {
    return null;
  }

  return compact.length > 160 ? `${compact.slice(0, 157)}…` : compact;
}

function mapOutreachChannel(channel: string | null): OutreachChannelLabel {
  switch (channel) {
    case "phone":
    case "call":
      return "Téléphone";
    case "whatsapp":
    case "instagram_dm":
    case "sms":
      return "WhatsApp";
    default:
      return "Email";
  }
}

function mapOutreachStatus(row: OutreachRow): OutreachStatusLabel {
  if (row.responded_at) {
    return "Répondu";
  }

  if (row.channel === "phone" || row.channel === "call" || row.type === "call") {
    return "Appel effectué";
  }

  switch (row.status) {
    case "planned":
    case "scheduled":
    case "pending":
    case "draft":
      return "À relancer";
    case "sent":
    case "delivered":
    case "completed":
      return "Envoyé";
    default:
      return "Envoyé";
  }
}

function normalizeContactStatus(status: string | null): ContactStatus {
  return status === "inactif" ? "inactif" : "actif";
}

function sanitizeSearchValue(value: string): string {
  return value.trim().replaceAll(",", " ").replaceAll("%", "");
}

function unwrapRelation<T>(relation: T | T[] | null | undefined): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation ?? null;
}

function asNonEmptyString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asIsoDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
