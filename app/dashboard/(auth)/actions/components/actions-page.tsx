"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  FileTextIcon,
  HardHatIcon,
  LinkIcon,
  MailIcon,
  SearchIcon,
  ShieldIcon,
  TargetIcon,
  XIcon,
  ZapIcon
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/app/dashboard/(auth)/apps/tasks/components/data-table-column-header";
import { DataTableFacetedFilter } from "@/app/dashboard/(auth)/apps/tasks/components/data-table-faceted-filter";
import { DataTablePagination } from "@/app/dashboard/(auth)/apps/tasks/components/data-table-pagination";
import { DataTableViewOptions } from "@/app/dashboard/(auth)/apps/tasks/components/data-table-view-options";

type ActionStatus = "pending" | "approved" | "rejected";
type Priority = "haute" | "normale" | "basse";
type TabValue = ActionStatus | "all";

type AutoRule = {
  id: string;
  agent_id: string;
  action_type: string;
  description: string;
  scope: string;
  mode: string;
  enabled: boolean;
  success_rate: string;
  last_triggered_at: string;
};

type ActionHistory = {
  at: string;
  actor: string;
  label: string;
};

type AgentAction = {
  id: string;
  agent_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  target_name: string;
  target_href: string;
  priority: Priority;
  created_at: string;
  status: ActionStatus;
  summary: string;
  payload: Record<string, unknown>;
  history: ActionHistory[];
  reviewed_by?: string;
  reviewed_at?: string;
  review_note?: string;
};

type ActionsData = {
  auto_rules: AutoRule[];
  actions: AgentAction[];
};

const goldAccent = "#C5A572";

const agentVisuals = {
  DataScout: { icon: SearchIcon, className: "bg-slate-100 text-slate-700 border-slate-200" },
  "DataScout 2026": { icon: BotIcon, className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  EnrichBot: { icon: ZapIcon, className: "bg-amber-50 text-amber-700 border-amber-200" },
  ScoreMaster: { icon: TargetIcon, className: "bg-sky-50 text-sky-700 border-sky-200" },
  OutreachPilot: { icon: MailIcon, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  QualityGuard: { icon: ShieldIcon, className: "bg-rose-50 text-rose-700 border-rose-200" },
  BrandMatcher: { icon: LinkIcon, className: "bg-violet-50 text-violet-700 border-violet-200" },
  "Rapport Hebdo": { icon: FileTextIcon, className: "bg-stone-100 text-stone-700 border-stone-200" },
  "DataScout Travaux": { icon: HardHatIcon, className: "bg-orange-50 text-orange-700 border-orange-200" }
} as const;

function getStatusBadgeClass(status: ActionStatus) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
  }
}

function getPriorityBadgeClass(priority: Priority) {
  switch (priority) {
    case "haute":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "normale":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "basse":
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getActionTypeBadgeClass(type: string) {
  switch (type) {
    case "status_change":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "outreach":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "brand_match":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
    case "scoring":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "enrichment":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "dossier_generation":
      return "border-stone-200 bg-stone-100 text-stone-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getTargetTypeLabel(targetType: string) {
  switch (targetType) {
    case "salon":
      return "Salon";
    case "brand":
      return "Marque";
    case "contact":
      return "Contact";
    default:
      return targetType;
  }
}

function getStatusLabel(status: ActionStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
  }
}

function payloadPreview(payload: Record<string, unknown>) {
  const serialized = JSON.stringify(payload);
  return serialized.length > 92 ? `${serialized.slice(0, 92)}…` : serialized;
}

function relativeDate(value: string) {
  return formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: fr
  });
}

export function ActionsPage({ data }: { data: ActionsData }) {
  const [actions, setActions] = React.useState<AgentAction[]>(data.actions);
  const [statusTab, setStatusTab] = React.useState<TabValue>("pending");
  const [rulesOpen, setRulesOpen] = React.useState(true);
  const [selectedActionId, setSelectedActionId] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "created_at", desc: true }]);

  const counts = React.useMemo(
    () => ({
      pending: actions.filter((action) => action.status === "pending").length,
      approved: actions.filter((action) => action.status === "approved").length,
      rejected: actions.filter((action) => action.status === "rejected").length,
      all: actions.length
    }),
    [actions]
  );

  const filteredByTab = React.useMemo(() => {
    if (statusTab === "all") return actions;
    return actions.filter((action) => action.status === statusTab);
  }, [actions, statusTab]);

  const selectedAction = React.useMemo(
    () => actions.find((action) => action.id === selectedActionId) ?? null,
    [actions, selectedActionId]
  );

  const updateActionStatus = React.useCallback((id: string, status: ActionStatus, note?: string) => {
    setActions((previous) =>
      previous.map((action) => {
        if (action.id !== id) return action;

        const reviewer = status === "approved" ? "Bonnie" : "Marie-Pierre";
        return {
          ...action,
          status,
          reviewed_by: reviewer,
          reviewed_at: new Date().toISOString(),
          review_note:
            note ??
            (status === "approved"
              ? "Validation manuelle depuis le centre d’actions."
              : "Rejet manuel après revue du contexte."),
          history: [
            ...action.history,
            {
              at: new Date().toISOString(),
              actor: reviewer,
              label: status === "approved" ? "Action approuvée" : "Action rejetée"
            }
          ]
        };
      })
    );
  }, []);

  const columns = React.useMemo<ColumnDef<AgentAction>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
            onClick={(event) => event.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "agent_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" />,
        cell: ({ row }) => {
          const agentName = row.original.agent_id as keyof typeof agentVisuals;
          const visual = agentVisuals[agentName] ?? agentVisuals.DataScout;
          const Icon = visual.icon;

          return (
            <div className="flex min-w-[180px] items-center gap-3">
              <div className={cn("rounded-xl border p-2", visual.className)}>
                <Icon className="size-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">{row.original.agent_id}</div>
                <div className="text-xs text-slate-500">{row.original.id}</div>
              </div>
            </div>
          );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id))
      },
      {
        accessorKey: "action_type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => (
          <Badge className={cn("border", getActionTypeBadgeClass(row.original.action_type))}>
            {row.original.action_type}
          </Badge>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id))
      },
      {
        accessorKey: "target_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cible" />,
        cell: ({ row }) => (
          <div className="min-w-[180px] space-y-1">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
              {getTargetTypeLabel(row.original.target_type)}
            </div>
            <Link prefetch={false}
              href={row.original.target_href}
              className="text-sm font-medium text-slate-900 hover:underline"
              onClick={(event) => event.stopPropagation()}>
              {row.original.target_name}
            </Link>
          </div>
        ),
        filterFn: (row, _id, value) => {
          const search = String(value).toLowerCase();
          const action = row.original;
          return (
            action.target_name.toLowerCase().includes(search) ||
            action.agent_id.toLowerCase().includes(search) ||
            action.summary.toLowerCase().includes(search) ||
            action.action_type.toLowerCase().includes(search)
          );
        }
      },
      {
        id: "payload",
        accessorFn: (row) => JSON.stringify(row.payload),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payload" />,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedActionId(row.original.id);
            }}
            className="max-w-[280px] text-left text-xs leading-5 text-slate-500 transition hover:text-slate-900">
            {payloadPreview(row.original.payload)}
          </button>
        ),
        enableSorting: false
      },
      {
        accessorKey: "priority",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Priorité" />,
        cell: ({ row }) => (
          <Badge className={cn("border capitalize", getPriorityBadgeClass(row.original.priority))}>
            {row.original.priority}
          </Badge>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id))
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => (
          <div className="min-w-[120px] text-sm text-slate-600">
            {relativeDate(row.original.created_at)}
          </div>
        )
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => (
          <Badge className={cn("border", getStatusBadgeClass(row.original.status))}>
            {getStatusLabel(row.original.status)}
          </Badge>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id))
      },
      {
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {row.original.status === "pending" ? (
              <>
                <Button
                  size="sm"
                  className="h-8 bg-emerald-600 px-3 text-white hover:bg-emerald-700"
                  onClick={(event) => {
                    event.stopPropagation();
                    updateActionStatus(row.original.id, "approved");
                  }}>
                  <CheckIcon className="size-4" />
                  Approuver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-rose-200 text-rose-700 hover:bg-rose-50"
                  onClick={(event) => {
                    event.stopPropagation();
                    updateActionStatus(row.original.id, "rejected");
                  }}>
                  <XIcon className="size-4" />
                  Rejeter
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-slate-200 text-slate-700"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedActionId(row.original.id);
                }}>
                <EyeIcon className="size-4" />
                Détail
              </Button>
            )}
          </div>
        )
      }
    ],
    [updateActionStatus]
  );

  const table = useReactTable({
    data: filteredByTab,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  React.useEffect(() => {
    setRowSelection({});
  }, [statusTab]);

  const selectedPendingRows = table
    .getFilteredSelectedRowModel()
    .rows.filter((row) => row.original.status === "pending");

  const agentOptions = React.useMemo(
    () =>
      Object.entries(agentVisuals).map(([label, config]) => ({
        label,
        value: label,
        icon: config.icon
      })),
    []
  );

  const typeOptions = React.useMemo(
    () =>
      Array.from(new Set(actions.map((action) => action.action_type))).map((type) => ({
        label: type,
        value: type
      })),
    [actions]
  );

  const priorityOptions = React.useMemo(
    () => [
      { label: "Haute", value: "haute" },
      { label: "Normale", value: "normale" },
      { label: "Basse", value: "basse" }
    ],
    []
  );

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-[#eadfcf] bg-[linear-gradient(135deg,#ffffff_0%,#faf7f1_58%,#f5ede1_100%)] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d7bf] bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="size-2 rounded-full" style={{ backgroundColor: goldAccent }} />
              Agent actions & approvals
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Validez les décisions proposées par les agents IA
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 lg:text-[15px]">
                Une file propre, triable et actionnable pour approuver vite les bons moves et
                bloquer les actions risquées avant exécution.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="text-sm text-slate-500">En attente</div>
                <div className="mt-2 text-2xl font-semibold text-amber-700">{counts.pending}</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="text-sm text-slate-500">Approuvées</div>
                <div className="mt-2 text-2xl font-semibold text-emerald-700">{counts.approved}</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="text-sm text-slate-500">Rejetées</div>
                <div className="mt-2 text-2xl font-semibold text-rose-700">{counts.rejected}</div>
              </div>
            </div>
          </div>

          <Collapsible open={rulesOpen} onOpenChange={setRulesOpen}>
            <Card className="rounded-[24px] border-white/90 bg-white/85 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Auto-rules</div>
                    <div className="mt-1 text-sm text-slate-500">
                      Règles d’auto-approbation et guardrails actifs sur les propositions agents.
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="border-slate-200 text-slate-700">
                      {rulesOpen ? "Réduire" : "Afficher"}
                      <ChevronDownIcon
                        className={cn("size-4 transition-transform", rulesOpen && "rotate-180")}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4 space-y-3">
                  {data.auto_rules.map((rule) => {
                    const agent = agentVisuals[rule.agent_id as keyof typeof agentVisuals] ?? agentVisuals.DataScout;
                    const AgentIcon = agent.icon;

                    return (
                      <div
                        key={rule.id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={cn("rounded-xl border p-2", agent.className)}>
                              <AgentIcon className="size-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                {rule.agent_id} · {rule.action_type}
                              </div>
                              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                                {rule.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="border-slate-200 bg-white text-slate-700">
                              {rule.scope}
                            </Badge>
                            <Badge
                              className={cn(
                                "border capitalize",
                                rule.enabled
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-100 text-slate-700"
                              )}>
                              {rule.mode}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>Hit rate: {rule.success_rate}</span>
                          <span>Dernier trigger: {relativeDate(rule.last_triggered_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </CardContent>
            </Card>
          </Collapsible>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Tabs value={statusTab} onValueChange={(value) => setStatusTab(value as TabValue)}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            </TabsList>
          </Tabs>

          {selectedPendingRows.length > 0 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                  <CheckIcon className="size-4" />
                  Approuver {selectedPendingRows.length} actions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer l’approbation groupée ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedPendingRows.length} actions en attente seront marquées comme approuvées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      selectedPendingRows.forEach((row) =>
                        updateActionStatus(row.original.id, "approved", "Approbation groupée depuis la table.")
                      );
                      setRowSelection({});
                    }}>
                    Approuver maintenant
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              placeholder="Rechercher une cible, un agent ou un résumé..."
              value={(table.getColumn("target_name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("target_name")?.setFilterValue(event.target.value)}
              className="h-9 w-full md:w-[320px]"
            />
            {table.getColumn("agent_id") && (
              <DataTableFacetedFilter
                column={table.getColumn("agent_id")}
                title="Agent"
                options={agentOptions}
              />
            )}
            {table.getColumn("action_type") && (
              <DataTableFacetedFilter
                column={table.getColumn("action_type")}
                title="Type"
                options={typeOptions}
              />
            )}
            {table.getColumn("priority") && (
              <DataTableFacetedFilter
                column={table.getColumn("priority")}
                title="Priorité"
                options={priorityOptions}
              />
            )}
            {isFiltered ? (
              <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
                Reset
                <XIcon className="size-4" />
              </Button>
            ) : null}
          </div>
          <DataTableViewOptions table={table} />
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
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => setSelectedActionId(row.original.id)}
                    className={cn(
                      "cursor-pointer transition hover:bg-slate-50/80",
                      row.original.status === "pending" && "bg-amber-50/30"
                    )}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                    Aucune action ne correspond à ce filtre.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      </section>

      <Sheet open={Boolean(selectedAction)} onOpenChange={(open) => !open && setSelectedActionId(null)}>
        <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-2xl">
          {selectedAction ? (
            <>
              <SheetHeader className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f2_100%)] px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">
                      Action détaillée
                    </Badge>
                    <div>
                      <SheetTitle className="text-2xl tracking-tight text-slate-900">
                        {selectedAction.summary}
                      </SheetTitle>
                      <SheetDescription className="mt-2 text-sm text-slate-500">
                        {selectedAction.agent_id} · {getTargetTypeLabel(selectedAction.target_type)} ·{" "}
                        {relativeDate(selectedAction.created_at)}
                      </SheetDescription>
                    </div>
                  </div>
                  <Badge className={cn("border", getStatusBadgeClass(selectedAction.status))}>
                    {getStatusLabel(selectedAction.status)}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="space-y-6 px-6 py-6 text-slate-900">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Agent</div>
                    <div className="mt-2 text-sm font-semibold">{selectedAction.agent_id}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Type</div>
                    <div className="mt-2 text-sm font-semibold">{selectedAction.action_type}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Priorité</div>
                    <div className="mt-2 text-sm font-semibold capitalize">{selectedAction.priority}</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Cible</div>
                    <Link prefetch={false} href={selectedAction.target_href} className="mt-2 block text-sm font-semibold hover:underline">
                      {selectedAction.target_name}
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Payload complet</div>
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                    {JSON.stringify(selectedAction.payload, null, 2)}
                  </pre>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Historique</div>
                  <div className="mt-4 space-y-3">
                    {selectedAction.history.map((event) => (
                      <div key={`${selectedAction.id}-${event.at}`} className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3">
                        <div className="mt-1 size-2 rounded-full bg-slate-400" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-slate-900">{event.label}</div>
                            <div className="text-xs text-slate-500">
                              {format(new Date(event.at), "dd MMM • HH:mm", { locale: fr })}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-slate-500">{event.actor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedAction.review_note ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-sm font-semibold text-slate-900">Commentaire de revue</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedAction.review_note}</p>
                    {selectedAction.reviewed_at ? (
                      <div className="mt-2 text-xs text-slate-500">
                        {selectedAction.reviewed_by} · {relativeDate(selectedAction.reviewed_at)}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {selectedAction.status === "pending" ? (
                <SheetFooter className="border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={() => updateActionStatus(selectedAction.id, "rejected")}>
                    <XIcon className="size-4" />
                    Rejeter
                  </Button>
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => updateActionStatus(selectedAction.id, "approved")}>
                    <CheckIcon className="size-4" />
                    Approuver
                  </Button>
                </SheetFooter>
              ) : null}
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
