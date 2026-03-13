import { createAdminClient } from "@/lib/supabase/admin";
import type {
  OutreachSequence,
  OutreachRecord,
  Campaign,
  EmailTemplate
} from "@/app/dashboard/(auth)/outreach/data/mock-outreach";

// Re-export types for convenience
export type { OutreachSequence, OutreachRecord, Campaign, EmailTemplate };

export type OutreachStats = {
  pendingActions: number;
  activeSequences: number;
  campaignsSentThisMonth: number;
  replyRate: number;
};

export type OutreachData = {
  sequences: OutreachSequence[];
  history: OutreachRecord[];
  stats: OutreachStats;
};

type RawOutreach = {
  id: string;
  channel: string | null;
  type: string | null;
  status: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  sequence_id: string | null;
  content: unknown;
  created_at: string | null;
  salons: { name: string | null; city: string | null } | null;
};

type RawSequence = {
  id: string;
  name: string | null;
  description: string | null;
  steps: unknown;
  is_active: boolean | null;
  updated_at: string | null;
};

function normalizeOutreachStatus(status: string | null): OutreachRecord["status"] {
  switch (status) {
    case "sent": return "sent";
    case "replied": return "replied";
    case "bounced": return "bounced";
    case "opened": return "opened";
    case "clicked": return "clicked";
    case "planned":
    case "scheduled": return "scheduled";
    default: return "draft";
  }
}

function extractContentPreview(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const c = content as Record<string, unknown>;
  const text = typeof c.text === "string" ? c.text : "";
  return text.slice(0, 120).replace(/\n/g, " ") + (text.length > 120 ? "…" : "");
}

function extractContentBody(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const c = content as Record<string, unknown>;
  return typeof c.html === "string" ? c.html : typeof c.text === "string" ? c.text : "";
}

export async function getOutreachData(): Promise<OutreachData> {
  const supabase = createAdminClient();

  const [outreachRes, sequencesRes] = await Promise.all([
    supabase
      .from("outreach")
      .select("id, channel, type, status, scheduled_at, sent_at, sequence_id, content, created_at, salons(name, city)")
      .is("deleted_at", null)
      .order("scheduled_at", { ascending: false })
      .limit(200),
    supabase
      .from("outreach_sequences")
      .select("id, name, description, steps, is_active, updated_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
  ]);

  const rawRecords = (outreachRes.data ?? []) as unknown as RawOutreach[];
  const rawSequences = (sequencesRes.data ?? []) as unknown as RawSequence[];

  // Build sequence enrollment counts
  const enrollmentCounts = new Map<string, number>();
  for (const r of rawRecords) {
    if (r.sequence_id) {
      enrollmentCounts.set(r.sequence_id, (enrollmentCounts.get(r.sequence_id) ?? 0) + 1);
    }
  }

  // Map sequences
  const sequences: OutreachSequence[] = rawSequences.map((seq) => {
    const steps = Array.isArray(seq.steps) ? seq.steps : [];
    const mapped = steps.map((step: Record<string, unknown>, i: number) => ({
      id: `${seq.id}-step-${i}`,
      order: i + 1,
      delayDays: typeof step.day === "number" ? step.day : i * 3,
      channel: (step.channel as OutreachRecord["channel"]) ?? "email",
      title: typeof step.template === "string" ? step.template : `Étape ${i + 1}`,
      templateId: `tpl-step-${i}`,
      preview: typeof step.template === "string" ? step.template : "",
      goal: typeof step.type === "string" ? step.type : "contact",
      sent: 0,
      opened: 0,
      replied: 0
    }));

    const seqRecords = rawRecords.filter((r) => r.sequence_id === seq.id);
    const sent = seqRecords.filter((r) => r.status === "sent" || r.status === "replied").length;
    const replied = seqRecords.filter((r) => r.status === "replied").length;

    return {
      id: seq.id,
      name: seq.name ?? "Séquence",
      description: seq.description ?? "",
      objective: seq.description ?? "",
      audience: "Salons prospectés",
      brand: "La Loge",
      isActive: seq.is_active ?? false,
      steps: mapped,
      enrolledCount: enrollmentCounts.get(seq.id) ?? 0,
      stats: { sent, opened: 0, replied, meetings: 0 },
      tags: [],
      owner: "OutreachPilot",
      updatedAt: seq.updated_at ?? new Date().toISOString(),
      enrollments: []
    };
  });

  // Map history records
  const history: OutreachRecord[] = rawRecords.map((r) => ({
    id: r.id,
    date: r.scheduled_at ?? r.created_at ?? new Date().toISOString(),
    salon: r.salons?.name ?? "—",
    city: r.salons?.city ?? "—",
    contact: "—",
    channel: (r.channel as OutreachRecord["channel"]) ?? "email",
    type: r.sequence_id ? "sequence" : "manual",
    status: normalizeOutreachStatus(r.status),
    contentPreview: extractContentPreview(r.content),
    content: extractContentBody(r.content),
    sequenceId: r.sequence_id ?? undefined
  }));

  // Compute stats
  const activeSequences = sequences.filter((s) => s.isActive).length;
  const totalSent = rawRecords.filter((r) => r.status === "sent" || r.status === "replied").length;
  const totalReplied = rawRecords.filter((r) => r.status === "replied").length;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100 * 10) / 10 : 0;
  const pendingActions = rawRecords.filter((r) => r.status === "planned").length;

  const stats: OutreachStats = {
    pendingActions,
    activeSequences,
    campaignsSentThisMonth: 0, // no campaigns yet
    replyRate
  };

  return { sequences, history, stats };
}
