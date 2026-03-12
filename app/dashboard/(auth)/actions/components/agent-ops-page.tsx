"use client";

import * as React from "react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckIcon,
  XIcon,
  ClockIcon,
  SparklesIcon,
  ZapIcon,
  SearchIcon,
  TargetIcon,
  SendIcon,
  ShieldIcon,
  LinkIcon,
  ActivityIcon,
  BotIcon,
  FilterIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

type SalonInfo = { name: string; city: string };

type AgentAction = {
  id: string;
  agent_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "auto_approved" | "rejected";
  priority: number;
  approved_by: string | null;
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
};

type ActivityEntry = {
  id: string;
  actor_type: string;
  actor_name: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type Props = {
  initialActions: Record<string, unknown>[];
  activityLog: Record<string, unknown>[];
  salonMap: Record<string, SalonInfo>;
};

// ─── Config ──────────────────────────────────────────────────────────────────

const AGENT_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  outreachpilot: {
    label: "OutreachPilot",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/20",
    Icon: SendIcon,
  },
  brandmatcher: {
    label: "BrandMatcher",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    Icon: LinkIcon,
  },
  scoremaster: {
    label: "ScoreMaster",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    Icon: TargetIcon,
  },
  enrichbot: {
    label: "EnrichBot",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    Icon: ZapIcon,
  },
  "datascout-2026": {
    label: "DataScout",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    Icon: SearchIcon,
  },
  qualityguard: {
    label: "QualityGuard",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    Icon: ShieldIcon,
  },
};

const ACTION_LABELS: Record<string, string> = {
  draft_email: "Brouillon email",
  match_proposal: "Proposition marque",
  update_score: "Mise à jour score",
  enrich_data: "Enrichissement",
  discover_salon: "Découverte salon",
};

const PRIORITY_CONFIG = {
  5: { label: "CRITIQUE", dot: "bg-red-500", text: "text-red-400", pulse: true },
  4: { label: "HAUTE", dot: "bg-amber-400", text: "text-amber-400", pulse: false },
  3: { label: "NORMALE", dot: "bg-[#C5A572]", text: "text-[#C5A572]", pulse: false },
  2: { label: "MODÉRÉE", dot: "bg-blue-400", text: "text-blue-400", pulse: false },
  1: { label: "BASSE", dot: "bg-slate-500", text: "text-slate-400", pulse: false },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function asAction(row: Record<string, unknown>): AgentAction {
  return row as unknown as AgentAction;
}

function asActivity(row: Record<string, unknown>): ActivityEntry {
  return row as unknown as ActivityEntry;
}

function getAgentCfg(agentId: string) {
  return (
    AGENT_CONFIG[agentId] ?? {
      label: agentId,
      color: "text-slate-400",
      bg: "bg-slate-400/10",
      border: "border-slate-400/20",
      Icon: BotIcon,
    }
  );
}

function getSalonLabel(action: AgentAction, salonMap: Record<string, SalonInfo>) {
  const payload = action.payload ?? {};
  const fromPayload = (payload.salon_name ?? payload.name) as string | undefined;
  const fromMap = salonMap[action.target_id]?.name;
  return fromMap ?? fromPayload ?? "Salon inconnu";
}

function getSalonCity(action: AgentAction, salonMap: Record<string, SalonInfo>) {
  const payload = action.payload ?? {};
  const fromPayload = payload.city as string | undefined;
  const fromMap = salonMap[action.target_id]?.city;
  return fromMap ?? fromPayload ?? null;
}

function reltime(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr });
}

function shorttime(iso: string) {
  return format(new Date(iso), "HH:mm", { locale: fr });
}

function getReasoning(action: AgentAction): string {
  const p = action.payload ?? {};
  return (p.reasoning as string) ?? (p.result as string) ?? "";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AgentPill({ agentId }: { agentId: string }) {
  const cfg = getAgentCfg(agentId);
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        cfg.bg,
        cfg.border,
        cfg.color
      )}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: AgentAction["status"] }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
        <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
        En attente
      </span>
    );
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
        <CheckIcon className="size-3" />
        Approuvée
      </span>
    );
  if (status === "auto_approved")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A572]/25 bg-[#C5A572]/10 px-2.5 py-1 text-xs font-semibold text-[#C5A572]">
        <SparklesIcon className="size-3" />
        Auto
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-xs font-semibold text-red-300">
        <XIcon className="size-3" />
        Rejetée
      </span>
    );
  return null;
}

function PriorityDot({ priority }: { priority: number }) {
  const cfg = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG[3];
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", cfg.dot, cfg.pulse && "animate-pulse")} />
      <span className={cn("text-xs font-semibold tracking-widest", cfg.text)}>P{priority}</span>
    </span>
  );
}

// ─── Agent Status Strip ──────────────────────────────────────────────────────

function AgentStatusStrip({ actions }: { actions: AgentAction[] }) {
  const agentIds = Object.keys(AGENT_CONFIG);

  return (
    <div className="flex flex-wrap gap-2">
      {agentIds.map((agentId) => {
        const agentActions = actions.filter((a) => a.agent_id === agentId);
        const pending = agentActions.filter((a) => a.status === "pending").length;
        const total = agentActions.length;
        const cfg = getAgentCfg(agentId);
        const Icon = cfg.Icon;
        const isActive = total > 0;

        return (
          <div
            key={agentId}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border px-3 py-2",
              isActive
                ? cn(cfg.bg, cfg.border)
                : "border-white/5 bg-white/[0.03]"
            )}
          >
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-xl",
                isActive ? cn(cfg.bg, cfg.color) : "bg-white/5 text-slate-600"
              )}
            >
              <Icon className="size-3.5" />
            </div>
            <div>
              <div className={cn("text-xs font-semibold", isActive ? cfg.color : "text-slate-600")}>
                {cfg.label}
              </div>
              <div className="text-[11px] text-slate-500">
                {total > 0 ? (
                  <span>
                    {total} action{total > 1 ? "s" : ""}
                    {pending > 0 && (
                      <span className="ml-1 text-amber-400">· {pending} en attente</span>
                    )}
                  </span>
                ) : (
                  "inactif"
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Activity Log ────────────────────────────────────────────────────────────

function ActivityFeed({ log }: { log: ActivityEntry[] }) {
  const actionLabels: Record<string, string> = {
    "outreach.batch_drafted": "a préparé un lot d'emails",
    "salon.batch_enriched": "a enrichi un lot de salons",
    "salon.batch_discovered": "a découvert de nouveaux salons",
    "brand.scores_computed": "a calculé les scores marques",
    "score.batch_updated": "a mis à jour les scores",
  };

  return (
    <div className="space-y-0">
      {log.slice(0, 12).map((entry, i) => {
        const cfg = getAgentCfg(entry.actor_name);
        const Icon = cfg.Icon;
        const label =
          actionLabels[entry.action] ??
          entry.action.replace(/[._]/g, " ");
        const meta = entry.metadata ?? {};
        const count = meta.count as number | undefined;

        return (
          <div
            key={entry.id}
            className="group flex gap-3 border-b border-white/[0.04] py-3 first:pt-0 last:border-0"
          >
            {/* timeline line */}
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-lg",
                  cfg.bg,
                  cfg.color
                )}
              >
                <Icon className="size-3" />
              </div>
              {i < log.slice(0, 12).length - 1 && (
                <div className="w-px flex-1 bg-white/[0.06]" />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <p className="text-sm leading-snug text-white/80">
                <span className={cn("font-semibold", cfg.color)}>{cfg.label}</span>{" "}
                {label}
                {count != null && (
                  <span className="ml-1 text-white/40">({count})</span>
                )}
              </p>
              <p className="mt-0.5 text-[11px] text-white/30">{reltime(entry.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────

function ActionCard({
  action,
  salonMap,
  onApprove,
  onReject,
  isProcessing,
}: {
  action: AgentAction;
  salonMap: Record<string, SalonInfo>;
  onApprove: (id: string) => void;
  onReject: (action: AgentAction) => void;
  isProcessing: boolean;
}) {
  const salonName = getSalonLabel(action, salonMap);
  const city = getSalonCity(action, salonMap);
  const reasoning = getReasoning(action);
  const agentCfg = getAgentCfg(action.agent_id);
  const actionLabel = ACTION_LABELS[action.action_type] ?? action.action_type;
  const isPending = action.status === "pending";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        isPending
          ? "border-amber-400/15 bg-gradient-to-br from-amber-400/5 via-[#0A1628]/80 to-[#0A1628]/60 hover:border-amber-400/30"
          : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
      )}
    >
      {/* Priority stripe */}
      {isPending && (
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-0.5",
            PRIORITY_CONFIG[action.priority as keyof typeof PRIORITY_CONFIG]?.dot ?? "bg-[#C5A572]"
          )}
        />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AgentPill agentId={action.agent_id} />
            <span className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/50">
              {actionLabel}
            </span>
            <PriorityDot priority={action.priority} />
          </div>
          <StatusBadge status={action.status} />
        </div>

        {/* Target */}
        <div className="mt-3">
          <p className="text-base font-semibold text-white">{salonName}</p>
          {city && <p className="text-sm text-white/40">{city}</p>}
        </div>

        {/* Reasoning */}
        {reasoning && (
          <p className="mt-2 text-sm leading-relaxed text-white/55">{reasoning}</p>
        )}

        {/* Score chip */}
        {action.payload?.score != null && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#C5A572]/20 bg-[#C5A572]/10 px-2 py-0.5">
            <span className="text-[11px] font-semibold text-[#C5A572]">
              Score {action.payload.score as number}
            </span>
          </div>
        )}

        {/* Template chip */}
        {action.payload?.template != null && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 ml-1.5">
            <span className="text-[11px] font-medium text-sky-400">
              {action.payload.template as string}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-white/25">
            <ClockIcon className="size-3" />
            {reltime(action.created_at)}
            <span className="text-white/15">·</span>
            {shorttime(action.created_at)}
          </div>

          {/* Actions */}
          {isPending && (
            <div className="flex items-center gap-2">
              <button
                disabled={isProcessing}
                onClick={() => onReject(action)}
                className="flex items-center gap-1.5 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-400/20 disabled:opacity-50"
              >
                <XIcon className="size-3.5" />
                Rejeter
              </button>
              <button
                disabled={isProcessing}
                onClick={() => onApprove(action.id)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-400 disabled:opacity-50"
              >
                <CheckIcon className="size-3.5" />
                Approuver
              </button>
            </div>
          )}

          {action.status === "approved" && action.approved_by && (
            <span className="text-[11px] text-emerald-400/60">
              ✓ par {action.approved_by}
            </span>
          )}

          {action.status === "rejected" && action.rejected_reason && (
            <span className="max-w-[200px] truncate text-[11px] text-red-400/60">
              ✗ {action.rejected_reason}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reject Modal ────────────────────────────────────────────────────────────

function RejectModal({
  action,
  onConfirm,
  onCancel,
}: {
  action: AgentAction;
  onConfirm: (id: string, reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = React.useState(action.rejected_reason ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0A1628] shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
              <AlertTriangleIcon className="size-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Rejeter cette action</h3>
              <p className="text-sm text-white/40">Documentez la raison pour guider l'agent</p>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <AgentPill agentId={action.agent_id} />
              <span className="text-xs text-white/30">·</span>
              <span className="text-xs text-white/40">
                {ACTION_LABELS[action.action_type] ?? action.action_type}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-white">
              {getSalonLabel(action, {})}
            </p>
            {getReasoning(action) && (
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                {getReasoning(action)}
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pt-4 pb-6">
          <label className="mb-2 block text-sm font-medium text-white/70">
            Raison du rejet
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: signal trop faible, données à vérifier, mauvais timing…"
            rows={3}
            className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/20 focus:bg-white/[0.06] resize-none"
          />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-white/[0.08] px-4 py-3 text-sm font-semibold text-white/60 transition-all hover:bg-white/[0.04]"
            >
              Annuler
            </button>
            <button
              disabled={reason.trim().length < 5}
              onClick={() => onConfirm(action.id, reason.trim())}
              className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:opacity-40"
            >
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

type FilterStatus = "all" | "pending" | "approved" | "auto_approved" | "rejected";

export function AgentOpsPage({
  initialActions,
  activityLog,
  salonMap,
}: Props) {
  const [actions, setActions] = React.useState<AgentAction[]>(
    initialActions.map(asAction)
  );
  const log = activityLog.map(asActivity);

  const [filter, setFilter] = React.useState<FilterStatus>("all");
  const [search, setSearch] = React.useState("");
  const [agentFilter, setAgentFilter] = React.useState<string>("all");
  const [rejectTarget, setRejectTarget] = React.useState<AgentAction | null>(null);
  const [processing, setProcessing] = React.useState<Set<string>>(new Set());
  const [showActivity, setShowActivity] = React.useState(false);

  // Counts
  const counts = React.useMemo(
    () => ({
      all: actions.length,
      pending: actions.filter((a) => a.status === "pending").length,
      approved: actions.filter((a) => a.status === "approved").length,
      auto_approved: actions.filter((a) => a.status === "auto_approved").length,
      rejected: actions.filter((a) => a.status === "rejected").length,
    }),
    [actions]
  );

  // Filtered
  const filtered = React.useMemo(() => {
    return actions.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (agentFilter !== "all" && a.agent_id !== agentFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const salonName = getSalonLabel(a, salonMap).toLowerCase();
        const city = getSalonCity(a, salonMap)?.toLowerCase() ?? "";
        const reasoning = getReasoning(a).toLowerCase();
        if (!salonName.includes(q) && !city.includes(q) && !reasoning.includes(q)) return false;
      }
      return true;
    });
  }, [actions, filter, agentFilter, search, salonMap]);

  // Approve
  const handleApprove = React.useCallback(async (id: string) => {
    setProcessing((p) => new Set(p).add(id));
    try {
      const res = await fetch(`/api/agent-actions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", approvedBy: "Bonnie" }),
      });
      if (res.ok) {
        const now = new Date().toISOString();
        setActions((prev) =>
          prev.map((a) =>
            a.id === id
              ? { ...a, status: "approved", approved_by: "Bonnie", approved_at: now }
              : a
          )
        );
      }
    } finally {
      setProcessing((p) => {
        const next = new Set(p);
        next.delete(id);
        return next;
      });
    }
  }, []);

  // Reject
  const handleReject = React.useCallback(
    async (id: string, reason: string) => {
      setProcessing((p) => new Set(p).add(id));
      setRejectTarget(null);
      try {
        const res = await fetch(`/api/agent-actions/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reject", reason }),
        });
        if (res.ok) {
          const now = new Date().toISOString();
          setActions((prev) =>
            prev.map((a) =>
              a.id === id
                ? { ...a, status: "rejected", rejected_reason: reason, updated_at: now }
                : a
            )
          );
        }
      } finally {
        setProcessing((p) => {
          const next = new Set(p);
          next.delete(id);
          return next;
        });
      }
    },
    []
  );

  const activeAgents = Array.from(new Set(actions.map((a) => a.agent_id)));

  const filterTabs: Array<{ key: FilterStatus; label: string; count: number }> = [
    { key: "all", label: "Tout", count: counts.all },
    { key: "pending", label: "En attente", count: counts.pending },
    { key: "approved", label: "Approuvées", count: counts.approved },
    { key: "auto_approved", label: "Auto", count: counts.auto_approved },
    { key: "rejected", label: "Rejetées", count: counts.rejected },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="mb-6">
        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A572]/25 bg-[#C5A572]/10 px-3 py-1 text-xs font-semibold text-[#C5A572]">
                <SparklesIcon className="size-3" />
                Supervision IA
              </span>
              {counts.pending > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
                  {counts.pending} en attente
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Actions agents
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Ce que vos agents IA ont fait, proposé, et attendent de vous
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/70"
          >
            <RefreshCwIcon className="size-4" />
            Actualiser
          </button>
        </div>

        {/* Agent status strip */}
        <div className="mt-5">
          <AgentStatusStrip actions={actions} />
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "En attente",
            value: counts.pending,
            accent: "border-amber-400/15 bg-amber-400/5",
            valueClass: "text-amber-300",
            sub: "validation requise",
          },
          {
            label: "Approuvées",
            value: counts.approved,
            accent: "border-emerald-400/15 bg-emerald-400/5",
            valueClass: "text-emerald-300",
            sub: "validées manuellement",
          },
          {
            label: "Auto-validées",
            value: counts.auto_approved,
            accent: "border-[#C5A572]/15 bg-[#C5A572]/5",
            valueClass: "text-[#C5A572]",
            sub: "règles automatiques",
          },
          {
            label: "Rejetées",
            value: counts.rejected,
            accent: "border-red-400/15 bg-red-400/5",
            valueClass: "text-red-300",
            sub: "bloquées après revue",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "rounded-2xl border p-4 transition-all",
              kpi.accent
            )}
          >
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
              {kpi.label}
            </p>
            <p className={cn("mt-2 text-4xl font-bold tabular-nums", kpi.valueClass)}>
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-white/30">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">

        {/* Left: Actions feed */}
        <div className="space-y-4">
          {/* Filters bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    filter === tab.key
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/60"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                      filter === tab.key
                        ? "bg-white/10 text-white/70"
                        : "bg-white/[0.04] text-white/20"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Agent filter */}
            <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1">
              <button
                onClick={() => setAgentFilter("all")}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                  agentFilter === "all" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                )}
              >
                Tous
              </button>
              {activeAgents.map((agentId) => {
                const cfg = getAgentCfg(agentId);
                const Icon = cfg.Icon;
                return (
                  <button
                    key={agentId}
                    onClick={() => setAgentFilter(agentFilter === agentId ? "all" : agentId)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                      agentFilter === agentId
                        ? cn(cfg.bg, cfg.color)
                        : "text-white/30 hover:text-white/60"
                    )}
                  >
                    <Icon className="size-3" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-white/20" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher un salon, une ville…"
                className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] py-2 pl-8 pr-4 text-sm text-white/70 placeholder-white/20 outline-none transition-all focus:border-white/15 focus:bg-white/[0.05]"
              />
            </div>

            <span className="text-xs text-white/20">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Actions list */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.05] bg-white/[0.02] py-20 text-center">
              <BotIcon className="size-10 text-white/10" />
              <p className="mt-4 text-sm text-white/30">Aucune action correspondante</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pending first */}
              {filter === "all" && counts.pending > 0 && (
                <div className="mb-1 flex items-center gap-2">
                  <span className="size-1.5 animate-pulse rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/60">
                    Validation requise
                  </span>
                </div>
              )}

              {filtered
                .slice()
                .sort((a, b) => {
                  // pending first, then by priority desc, then by date desc
                  if (a.status === "pending" && b.status !== "pending") return -1;
                  if (a.status !== "pending" && b.status === "pending") return 1;
                  if (b.priority !== a.priority) return b.priority - a.priority;
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                })
                .map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    salonMap={salonMap}
                    onApprove={handleApprove}
                    onReject={setRejectTarget}
                    isProcessing={processing.has(action.id)}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Right: Activity log + Agent summary */}
        <div className="space-y-4">
          {/* Activity log */}
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ActivityIcon className="size-4 text-[#C5A572]" />
                <h3 className="text-sm font-semibold text-white">Journal d'activité</h3>
              </div>
              <span className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[11px] text-white/30">
                {log.length} entrées
              </span>
            </div>
            <ActivityFeed log={log} />
          </div>

          {/* Quick stats per agent */}
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center gap-2">
              <BotIcon className="size-4 text-[#C5A572]" />
              <h3 className="text-sm font-semibold text-white">Résumé par agent</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(AGENT_CONFIG)
                .map(([agentId, cfg]) => {
                  const agentActions = actions.filter((a) => a.agent_id === agentId);
                  if (agentActions.length === 0) return null;
                  const pending = agentActions.filter((a) => a.status === "pending").length;
                  const approved = agentActions.filter(
                    (a) => a.status === "approved" || a.status === "auto_approved"
                  ).length;
                  const Icon = cfg.Icon;

                  return (
                    <div
                      key={agentId}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.04] p-3"
                    >
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-xl",
                          cfg.bg,
                          cfg.color
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-semibold", cfg.color)}>{cfg.label}</p>
                        <p className="text-xs text-white/30">
                          {agentActions.length} action{agentActions.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        {pending > 0 && (
                          <span className="text-xs font-semibold text-amber-400">{pending} att.</span>
                        )}
                        {approved > 0 && (
                          <span className="text-xs text-emerald-400/60">{approved} ✓</span>
                        )}
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)}
            </div>
          </div>

          {/* Human in the loop cta */}
          {counts.pending > 0 && (
            <div className="rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-400/8 to-transparent p-5">
              <div className="mb-3 flex items-center gap-2">
                <SparklesIcon className="size-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/70">
                  Human in the loop
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-300">{counts.pending}</p>
              <p className="mt-1 text-sm text-white/40">
                proposition{counts.pending > 1 ? "s" : ""} attend{counts.pending > 1 ? "ent" : ""} votre validation
              </p>
              <button
                onClick={() => setFilter("pending")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400/15 px-4 py-2.5 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-400/25"
              >
                Voir les actions en attente
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Reject modal ── */}
      {rejectTarget && (
        <RejectModal
          action={rejectTarget}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
