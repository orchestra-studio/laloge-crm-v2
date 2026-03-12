"use client";

import * as React from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ActivityIcon,
  AlertTriangleIcon,
  BotIcon,
  Clock3Icon,
  FileTextIcon,
  HardHatIcon,
  LinkIcon,
  MailIcon,
  PlayIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
  ZapIcon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type AgentStatus = "active" | "idle" | "error";

type AgentCard = {
  id: string;
  name: string;
  icon: "Search" | "Bot" | "Zap" | "Target" | "Mail" | "Shield" | "Link" | "FileText" | "HardHat";
  status: AgentStatus;
  last_run_at: string;
  result_summary: string;
  primary_kpi_label: string;
  primary_kpi_value: string;
  secondary_kpi_label: string;
  secondary_kpi_value: string;
  logs: string[];
};

type ProspectingRun = {
  id: string;
  area: string;
  status: "completed" | "running" | "queued" | "failed";
  found_count: number;
  imported_count: number;
  enriched_count: number;
  scored_count: number;
  error_count: number;
  created_at: string;
  source: string;
};

type WorkItem = {
  id: string;
  type: string;
  target_name: string;
  target_href: string;
  priority: "haute" | "normale" | "basse";
  assigned_agent: string;
  created_at: string;
};

type AgentsData = {
  agents: AgentCard[];
  prospecting_runs: ProspectingRun[];
  work_items: WorkItem[];
};

const goldAccent = "#C5A572";

const iconMap = {
  Search: SearchIcon,
  Bot: BotIcon,
  Zap: ZapIcon,
  Target: TargetIcon,
  Mail: MailIcon,
  Shield: ShieldIcon,
  Link: LinkIcon,
  FileText: FileTextIcon,
  HardHat: HardHatIcon
} as const;

function getAgentStatusBadge(status: AgentStatus) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dotClass: "bg-emerald-500",
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700"
      };
    case "idle":
      return {
        label: "Idle",
        dotClass: "bg-amber-500",
        badgeClass: "border-amber-200 bg-amber-50 text-amber-700"
      };
    case "error":
      return {
        label: "Error",
        dotClass: "bg-rose-500",
        badgeClass: "border-rose-200 bg-rose-50 text-rose-700"
      };
  }
}

function getRunStatusBadge(status: ProspectingRun["status"]) {
  switch (status) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "running":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "queued":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "failed":
      return "border-rose-200 bg-rose-50 text-rose-700";
  }
}

function getPriorityBadgeClass(priority: WorkItem["priority"]) {
  switch (priority) {
    case "haute":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "normale":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "basse":
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "enrichment":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "outreach":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "brand_match":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "score_refresh":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "quality_review":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "prospecting":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "dossier_generation":
      return "border-stone-200 bg-stone-100 text-stone-700";
    case "contact_sync":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "travaux_signal":
      return "border-orange-200 bg-orange-50 text-orange-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function relativeDate(value: string) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: fr
  });
}

export function AgentsPage({ data }: { data: AgentsData }) {
  const [agents, setAgents] = React.useState<AgentCard[]>(data.agents);
  const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(null);

  const selectedAgent = React.useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [agents, selectedAgentId]
  );

  const statusCounts = React.useMemo(
    () => ({
      active: agents.filter((agent) => agent.status === "active").length,
      idle: agents.filter((agent) => agent.status === "idle").length,
      error: agents.filter((agent) => agent.status === "error").length
    }),
    [agents]
  );

  const queueByAgent = React.useMemo(() => {
    return data.work_items.reduce<Record<string, number>>((accumulator, item) => {
      accumulator[item.assigned_agent] = (accumulator[item.assigned_agent] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [data.work_items]);

  const handleWakeAgent = React.useCallback((agentId: string) => {
    setAgents((previous) =>
      previous.map((agent) => {
        if (agent.id !== agentId) return agent;

        return {
          ...agent,
          status: "active",
          last_run_at: new Date().toISOString(),
          result_summary: "Réveil manuel demandé — reprise de la queue et vérification des jobs en cours.",
          logs: [
            `${format(new Date(), "HH:mm")} — Wakeup manuel reçu, redémarrage du worker.`,
            ...agent.logs
          ].slice(0, 4)
        };
      })
    );
  }, []);

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-[#eadfcf] bg-[linear-gradient(135deg,#ffffff_0%,#faf7f1_58%,#f5ede1_100%)] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d7bf] bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="size-2 rounded-full" style={{ backgroundColor: goldAccent }} />
              Agents IA La Loge
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Supervisez les 9 agents Middleman en un coup d’œil
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 lg:text-[15px]">
                Monitoring premium des workers de prospection, enrichissement, scoring et outreach,
                avec wakeup manuel, logs récents et tables d’exécution juste en dessous.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <div className="text-sm text-slate-500">Actifs</div>
              <div className="mt-2 text-2xl font-semibold text-emerald-700">{statusCounts.active}</div>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <div className="text-sm text-slate-500">Idle</div>
              <div className="mt-2 text-2xl font-semibold text-amber-700">{statusCounts.idle}</div>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
              <div className="text-sm text-slate-500">Erreurs</div>
              <div className="mt-2 text-2xl font-semibold text-rose-700">{statusCounts.error}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Cartes agents</h2>
          <p className="text-sm text-slate-500">
            Lecture rapide du statut, du dernier run et du KPI le plus utile par agent.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon];
            const status = getAgentStatusBadge(agent.status);

            return (
              <Card
                key={agent.id}
                className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-60px_rgba(15,23,42,0.5)]">
                <div className="h-1.5 w-full" style={{ backgroundColor: status.badgeClass.includes("emerald") ? "#22c55e" : status.badgeClass.includes("amber") ? "#f59e0b" : "#ef4444" }} />
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <Icon className="size-5 text-slate-700" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{agent.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <span className={cn("size-2 rounded-full", status.dotClass)} />
                          {status.label}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn("border", status.badgeClass)}>{status.label}</Badge>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Dernier run</div>
                    <div className="mt-2 text-sm font-medium text-slate-900">
                      {relativeDate(agent.last_run_at)}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{agent.result_summary}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {agent.primary_kpi_label}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">
                        {agent.primary_kpi_value}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {agent.secondary_kpi_label}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">
                        {agent.secondary_kpi_value}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      className="bg-slate-900 text-white hover:bg-slate-800"
                      onClick={() => handleWakeAgent(agent.id)}>
                      <PlayIcon className="size-4" />
                      Réveiller
                    </Button>
                    <Button
                      variant="link"
                      className="px-0 text-slate-600"
                      onClick={() => setSelectedAgentId(agent.id)}>
                      Voir logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Prospecting Runs</h2>
                <p className="text-sm text-slate-500">
                  Historique des batchs de prospection, import et scoring par zone.
                </p>
              </div>
              <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">
                {data.prospecting_runs.length} runs
              </Badge>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Trouvés</TableHead>
                    <TableHead>Importés</TableHead>
                    <TableHead>Enrichis</TableHead>
                    <TableHead>Scorés</TableHead>
                    <TableHead>Erreurs</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.prospecting_runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">{run.area}</div>
                          <div className="text-xs text-slate-500">{run.source}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border capitalize", getRunStatusBadge(run.status))}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.found_count}</TableCell>
                      <TableCell>{run.imported_count}</TableCell>
                      <TableCell>{run.enriched_count}</TableCell>
                      <TableCell>{run.scored_count}</TableCell>
                      <TableCell>{run.error_count}</TableCell>
                      <TableCell className="text-sm text-slate-500">{relativeDate(run.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Work Queue</h2>
                <p className="text-sm text-slate-500">
                  File pending issue des agents et des demandes de wakeup.
                </p>
              </div>
              <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                {data.work_items.length} items
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(queueByAgent).map(([agent, count]) => (
                <Badge key={agent} className="border-slate-200 bg-white text-slate-700">
                  {agent} · {count}
                </Badge>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.work_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge className={cn("border", getTypeBadgeClass(item.type))}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link prefetch={false} href={item.target_href} className="font-medium text-slate-900 hover:underline">
                          {item.target_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border capitalize", getPriorityBadgeClass(item.priority))}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{item.assigned_agent}</TableCell>
                      <TableCell className="text-sm text-slate-500">{relativeDate(item.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <Sheet open={Boolean(selectedAgent)} onOpenChange={(open) => !open && setSelectedAgentId(null)}>
        <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl">
          {selectedAgent ? (
            <>
              <SheetHeader className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f2_100%)] px-6 py-6">
                <div className="space-y-3">
                  <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">Logs agent</Badge>
                  <div>
                    <SheetTitle className="text-2xl tracking-tight text-slate-900">
                      {selectedAgent.name}
                    </SheetTitle>
                    <SheetDescription className="mt-1 text-sm text-slate-500">
                      Dernière exécution {relativeDate(selectedAgent.last_run_at)}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 px-6 py-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Statut</div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <span className={cn("size-2 rounded-full", getAgentStatusBadge(selectedAgent.status).dotClass)} />
                      {getAgentStatusBadge(selectedAgent.status).label}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">KPI principal</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {selectedAgent.primary_kpi_value}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Queue agent</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {queueByAgent[selectedAgent.name] ?? 0} items
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <ActivityIcon className="size-4 text-slate-500" />
                    Résumé du dernier run
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{selectedAgent.result_summary}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Clock3Icon className="size-4 text-slate-500" />
                    Logs récents
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedAgent.logs.map((log, index) => (
                      <div key={`${selectedAgent.id}-${index}`} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-sm leading-6 text-slate-600">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAgent.status === "error" ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangleIcon className="size-4" />
                      Attention requise
                    </div>
                    <p className="mt-2 text-sm leading-6">
                      Ce worker est en erreur. Un wakeup manuel peut être tenté, mais une revue des
                      logs détaillés est recommandée avant de relancer en production.
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
