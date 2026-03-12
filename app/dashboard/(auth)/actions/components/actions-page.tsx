"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock3Icon,
  DatabaseIcon,
  LinkIcon,
  SearchIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  XIcon
} from "lucide-react";

import { DataTableColumnHeader } from "@/app/dashboard/(auth)/salons/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { mockAgentActions, type AgentAction } from "./mock-agent-actions";

const agentConfig = {
  datascout: {
    label: "DataScout",
    icon: SearchIcon,
    className: "border-slate-200 bg-slate-50 text-slate-700"
  },
  "datascout-2026": {
    label: "DataScout 2026",
    icon: SearchIcon,
    className: "border-slate-200 bg-slate-50 text-slate-700"
  },
  enrichbot: {
    label: "EnrichBot",
    icon: DatabaseIcon,
    className: "border-blue-200 bg-blue-50 text-blue-700"
  },
  scoremaster: {
    label: "ScoreMaster",
    icon: TrendingUpIcon,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  brandmatcher: {
    label: "BrandMatcher",
    icon: LinkIcon,
    className: "border-violet-200 bg-violet-50 text-violet-700"
  },
  outreachpilot: {
    label: "OutreachPilot",
    icon: SendIcon,
    className: "border-sky-200 bg-sky-50 text-sky-700"
  },
  qualityguard: {
    label: "QualityGuard",
    icon: ShieldCheckIcon,
    className: "border-rose-200 bg-rose-50 text-rose-700"
  }
} as const;

const actionTypeConfig = {
  discover_salon: {
    label: "Découverte salon",
    className: "border-slate-200 bg-slate-100 text-slate-700"
  },
  enrich_salon: {
    label: "Enrichissement",
    className: "border-blue-200 bg-blue-50 text-blue-700"
  },
  score_salon: {
    label: "Scoring",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  match_brand: {
    label: "Match marque",
    className: "border-violet-200 bg-violet-50 text-violet-700"
  },
  send_outreach: {
    label: "Outreach",
    className: "border-sky-200 bg-sky-50 text-sky-700"
  }
} as const;

const statusConfig = {
  pending: {
    label: "En attente",
    className: "border-amber-200 bg-amber-50 text-amber-700"
  },
  approved: {
    label: "Approuvée",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700"
  },
  rejected: {
    label: "Rejetée",
    className: "border-rose-200 bg-rose-50 text-rose-700"
  },
  auto_approved: {
    label: "Auto-approuvée",
    className: "border-[#C5A572]/25 bg-[#C5A572]/10 text-[#8B6C3D]"
  }
} as const;

const priorityConfig = {
  1: {
    label: "Basse",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    dotClassName: "bg-slate-400"
  },
  2: {
    label: "Modérée",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    dotClassName: "bg-blue-500"
  },
  3: {
    label: "Normale",
    className: "border-[#C5A572]/25 bg-[#C5A572]/10 text-[#8B6C3D]",
    dotClassName: "bg-[#C5A572]"
  },
  4: {
    label: "Haute",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClassName: "bg-amber-500"
  },
  5: {
    label: "Critique",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    dotClassName: "bg-rose-500"
  }
} as const satisfies Record<number, { label: string; className: string; dotClassName: string }>;

const filterTabs = [
  { value: "all", label: "Tout" },
  { value: "pending", label: "En attente" },
  { value: "approved", label: "Approuvées" },
  { value: "rejected", label: "Rejetées" },
  { value: "auto_approved", label: "Auto-approuvées" }
] as const;

type FilterTab = (typeof filterTabs)[number]["value"];

export function ActionsPage() {
  const [actions, setActions] = React.useState<AgentAction[]>(mockAgentActions);
  const [activeTab, setActiveTab] = React.useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "created_at", desc: true }]);
  const [rejectingAction, setRejectingAction] = React.useState<AgentAction | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const counts = React.useMemo(
    () => ({
      all: actions.length,
      pending: actions.filter((action) => action.status === "pending").length,
      approved: actions.filter((action) => action.status === "approved").length,
      rejected: actions.filter((action) => action.status === "rejected").length,
      auto_approved: actions.filter((action) => action.status === "auto_approved").length
    }),
    [actions]
  );

  const filteredActions = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return actions.filter((action) => {
      const matchesTab = activeTab === "all" || action.status === activeTab;

      if (!normalizedQuery) return matchesTab;

      const haystack = [
        action.agent_id,
        actionTypeConfig[action.action_type].label,
        action.action_type,
        getTargetName(action),
        action.payload.city ?? "",
        action.payload.reasoning,
        action.payload.brand_name ?? "",
        action.payload.salon_name ?? ""
      ]
        .join(" ")
        .toLowerCase();

      return matchesTab && haystack.includes(normalizedQuery);
    });
  }, [actions, activeTab, searchQuery]);

  const handleApprove = React.useCallback((actionId: string) => {
    const reviewedAt = new Date().toISOString();

    setActions((previous) =>
      previous.map((action) =>
        action.id === actionId
          ? {
              ...action,
              status: "approved",
              approved_by: "Bonnie",
              approved_at: reviewedAt,
              rejected_reason: null,
              updated_at: reviewedAt
            }
          : action
      )
    );
  }, []);

  const openRejectDialog = React.useCallback((action: AgentAction) => {
    setRejectingAction(action);
    setRejectionReason(action.rejected_reason ?? "");
  }, []);

  const closeRejectDialog = React.useCallback(() => {
    setRejectingAction(null);
    setRejectionReason("");
  }, []);

  const confirmReject = React.useCallback(() => {
    if (!rejectingAction) return;

    const reason = rejectionReason.trim();
    if (!reason) return;

    const reviewedAt = new Date().toISOString();

    setActions((previous) =>
      previous.map((action) =>
        action.id === rejectingAction.id
          ? {
              ...action,
              status: "rejected",
              approved_by: null,
              approved_at: null,
              rejected_reason: reason,
              updated_at: reviewedAt
            }
          : action
      )
    );

    closeRejectDialog();
  }, [closeRejectDialog, rejectionReason, rejectingAction]);

  const columns = React.useMemo<ColumnDef<AgentAction>[]>(
    () => [
      {
        accessorKey: "agent_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" />,
        cell: ({ row }) => {
          const meta = agentConfig[row.original.agent_id];
          const Icon = meta.icon;

          return (
            <div className="flex min-w-[180px] items-center gap-3">
              <div className={cn("rounded-2xl border p-2.5", meta.className)}>
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">{meta.label}</div>
                <div className="text-xs text-slate-500">{row.original.agent_id}</div>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "action_type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type d’action" />,
        cell: ({ row }) => {
          const meta = actionTypeConfig[row.original.action_type];

          return (
            <div className="min-w-[170px] space-y-1">
              <Badge className={cn("border", meta.className)}>{meta.label}</Badge>
              <div className="text-xs text-slate-400">{row.original.action_type}</div>
            </div>
          );
        }
      },
      {
        id: "target",
        accessorFn: (row) => getTargetName(row),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cible" />,
        cell: ({ row }) => (
          <div className="min-w-[200px] space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{getTargetName(row.original)}</span>
              <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-500">
                {row.original.target_type === "salon" ? "Salon" : "Marque"}
              </Badge>
            </div>
            <div className="text-xs text-slate-500">{getTargetContext(row.original)}</div>
          </div>
        )
      },
      {
        id: "description",
        accessorFn: (row) => row.payload.reasoning,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => (
          <div className="max-w-[360px] whitespace-normal text-sm leading-6 text-slate-600">
            {row.original.payload.reasoning}
          </div>
        )
      },
      {
        accessorKey: "priority",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Priorité" />,
        cell: ({ row }) => {
          const meta = priorityConfig[row.original.priority as keyof typeof priorityConfig];

          return (
            <div className="min-w-[112px] space-y-1">
              <Badge className={cn("border px-2.5 py-1", meta.className)}>
                <span className={cn("size-1.5 rounded-full", meta.dotClassName)} />
                P{row.original.priority}
              </Badge>
              <div className="text-xs text-slate-500">{meta.label}</div>
            </div>
          );
        }
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => {
          const meta = statusConfig[row.original.status];

          return <Badge className={cn("border", meta.className)}>{meta.label}</Badge>;
        }
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => (
          <div className="min-w-[150px] space-y-1">
            <div className="text-sm font-medium text-slate-700">{formatActionDate(row.original.created_at)}</div>
            <div className="text-xs text-slate-500">{formatRelativeDate(row.original.created_at)}</div>
          </div>
        )
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => {
          const action = row.original;

          if (action.status === "pending") {
            return (
              <div className="flex min-w-[200px] items-center justify-end gap-2">
                <Button
                  size="sm"
                  className="h-8 bg-emerald-600 px-3 text-white hover:bg-emerald-700"
                  onClick={() => handleApprove(action.id)}>
                  <CheckIcon className="size-4" />
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50"
                  onClick={() => openRejectDialog(action)}>
                  <XIcon className="size-4" />
                  Rejeter
                </Button>
              </div>
            );
          }

          if (action.status === "rejected") {
            return (
              <div className="max-w-[260px] whitespace-normal text-right">
                <div className="text-sm font-medium text-rose-700">Raison du rejet</div>
                <div className="mt-1 text-xs leading-5 text-rose-600/90">{action.rejected_reason}</div>
              </div>
            );
          }

          return (
            <div className="min-w-[180px] text-right">
              <div className="text-sm font-medium text-slate-700">
                {action.status === "auto_approved" ? action.approved_by ?? "Règle auto" : action.approved_by}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {action.approved_at ? formatRelativeDate(action.approved_at) : "—"}
              </div>
            </div>
          );
        }
      }
    ],
    [handleApprove, openRejectDialog]
  );

  const table = useReactTable({
    data: filteredActions,
    columns,
    state: {
      sorting
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [table, activeTab, searchQuery]);

  return (
    <div className="space-y-5 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
        <div
          className="border-b border-slate-200/80 px-5 py-6 sm:px-6"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(197,165,114,0.16), rgba(255,255,255,0.97) 34%, rgba(248,250,252,0.98) 100%)"
          }}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-[#C5A572]/30 bg-[#C5A572]/12 text-[#7D643C]">
                  Validation humaine
                </Badge>
                <Badge variant="outline" className="rounded-full bg-white/85 text-slate-600">
                  {counts.all} actions mock chargées
                </Badge>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Actions
                </h1>
                <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
                  Actions proposées par les agents IA
                </p>
              </div>
            </div>

            <div className="max-w-md rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Human in the loop
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-slate-950">{counts.pending}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    propositions attendent encore une décision manuelle avant exécution.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#C5A572]/20 bg-[#C5A572]/10 p-3 text-[#8B6C3D]">
                  <SparklesIcon className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FilterTab)}>
            <TabsList className="h-auto w-full flex-wrap justify-start rounded-2xl bg-[#F8F4EE] p-1">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-xl px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#7D643C] data-[state=active]:shadow-sm">
                  {tab.label}
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[11px] data-[state=active]:bg-[#C5A572]/12">
                    {counts[tab.value]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="En attente"
          value={counts.pending}
          hint="Décision humaine requise"
          icon={Clock3Icon}
          className="border-amber-200 bg-amber-50/60"
          iconWrapClassName="bg-amber-100 text-amber-700"
        />
        <KpiCard
          label="Approuvées"
          value={counts.approved}
          hint="Validées manuellement"
          icon={CheckIcon}
          className="border-emerald-200 bg-emerald-50/60"
          iconWrapClassName="bg-emerald-100 text-emerald-700"
        />
        <KpiCard
          label="Rejetées"
          value={counts.rejected}
          hint="Bloquées après revue"
          icon={XIcon}
          className="border-rose-200 bg-rose-50/60"
          iconWrapClassName="bg-rose-100 text-rose-700"
        />
        <KpiCard
          label="Auto-approuvées"
          value={counts.auto_approved}
          hint="Règles automatiques actives"
          icon={SparklesIcon}
          className="border-[#C5A572]/25 bg-[#C5A572]/10"
          iconWrapClassName="bg-[#C5A572]/15 text-[#8B6C3D]"
        />
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Rechercher un agent, une cible ou une raison…"
              className="h-10 rounded-full bg-slate-50 pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full bg-white text-slate-600">
              {filteredActions.length} résultat{filteredActions.length > 1 ? "s" : ""}
            </Badge>
            {activeTab === "pending" || counts.pending > 0 ? (
              <Badge className="rounded-full border-[#C5A572]/25 bg-[#C5A572]/10 text-[#8B6C3D]">
                {counts.pending} en attente de validation
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80">
          <Table>
            <TableHeader className="bg-slate-50/80">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(
                      row.original.status === "pending" && "bg-amber-50/30 hover:bg-amber-50/50"
                    )}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === "description" && "whitespace-normal",
                          cell.column.id === "actions" && "whitespace-normal"
                        )}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                    Aucune action ne correspond aux filtres actifs.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <ActionsTablePagination table={table} />
        </div>
      </section>

      <Dialog open={Boolean(rejectingAction)} onOpenChange={(open) => !open && closeRejectDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter l’action</DialogTitle>
            <DialogDescription>
              Ajoutez une raison claire pour documenter ce rejet et guider le prochain passage de
              l’agent.
            </DialogDescription>
          </DialogHeader>

          {rejectingAction ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-sm font-semibold text-slate-900">{getTargetName(rejectingAction)}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {agentConfig[rejectingAction.agent_id].label} · {actionTypeConfig[rejectingAction.action_type].label}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {rejectingAction.payload.reasoning}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="rejection-reason" className="text-sm font-medium text-slate-700">
                  Raison du rejet
                </label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Ex. signal trop faible, message trop agressif, données à revérifier…"
                  className="min-h-28 bg-white"
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeRejectDialog}>
              Annuler
            </Button>
            <Button
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={confirmReject}
              disabled={rejectionReason.trim().length < 6}>
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getTargetName(action: AgentAction) {
  if (action.target_type === "brand") {
    return action.payload.brand_name ?? action.target_id;
  }

  return action.payload.salon_name ?? action.target_id;
}

function getTargetContext(action: AgentAction) {
  if (action.target_type === "brand") {
    return [action.payload.city, action.payload.salon_name ? `pour ${action.payload.salon_name}` : null]
      .filter(Boolean)
      .join(" · ");
  }

  return [action.payload.city, action.payload.source ?? null].filter(Boolean).join(" · ");
}

function formatActionDate(value: string) {
  return format(new Date(value), "dd MMM yyyy · HH:mm", { locale: fr });
}

function formatRelativeDate(value: string) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: fr
  });
}

function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
  iconWrapClassName
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  iconWrapClassName: string;
}) {
  return (
    <Card className={cn("rounded-[24px] border shadow-sm", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>
        <div className={cn("rounded-2xl p-3", iconWrapClassName)}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ActionsTablePagination<TData>({ table }: { table: TanstackTable<TData> }) {
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const start = filteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, filteredRows);

  return (
    <div className="flex flex-col gap-3 px-1 pt-1 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-sm text-slate-500">
        Affichage {start}-{end} sur {filteredRows}
      </div>

      <div className="flex flex-wrap items-center gap-3 lg:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-slate-600">Lignes</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger className="h-8 w-[84px] rounded-full bg-white">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-28 text-center text-sm font-medium text-slate-700">
          Page {pageIndex + 1} / {table.getPageCount() || 1}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden rounded-full lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Première page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <span className="sr-only">Page précédente</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Page suivante</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden rounded-full lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <span className="sr-only">Dernière page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
