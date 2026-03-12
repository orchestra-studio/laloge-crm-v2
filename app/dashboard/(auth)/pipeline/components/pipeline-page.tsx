"use client";

import * as React from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Building2Icon,
  GlobeIcon,
  GripVerticalIcon,
  MailIcon,
  MapPinIcon,
  NotebookPenIcon,
  PhoneIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as Kanban from "@/components/ui/kanban";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import type {
  PipelineColumn,
  PipelineSalon,
  PipelineStatus
} from "@/lib/supabase/queries/pipeline";
import { cn } from "@/lib/utils";

const pipelineStatuses: PipelineStatus[] = [
  "nouveau",
  "contacte",
  "interesse",
  "rdv_planifie",
  "negociation",
  "gagne",
  "perdu",
  "client_actif"
];

type StageConfig = {
  id: PipelineStatus;
  label: string;
  accent: string;
  surfaceClass: string;
  ringClass: string;
  dotClass: string;
  badgeClass: string;
  progressClass: string;
  avgDays: number;
  delta: string;
};

const stageConfig: StageConfig[] = [
  {
    id: "nouveau",
    label: "Nouveau",
    accent: "#94a3b8",
    surfaceClass: "from-slate-50 to-white",
    ringClass: "ring-slate-200/80",
    dotClass: "bg-slate-400",
    badgeClass: "border-slate-200 bg-slate-100 text-slate-700",
    progressClass: "bg-slate-400",
    avgDays: 2.1,
    delta: "+4%"
  },
  {
    id: "contacte",
    label: "Contacté",
    accent: "#3b82f6",
    surfaceClass: "from-blue-50 to-white",
    ringClass: "ring-blue-100",
    dotClass: "bg-blue-500",
    badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
    progressClass: "bg-blue-500",
    avgDays: 3.4,
    delta: "+7%"
  },
  {
    id: "interesse",
    label: "Intéressé",
    accent: "#eab308",
    surfaceClass: "from-amber-50 to-white",
    ringClass: "ring-amber-100",
    dotClass: "bg-amber-500",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    progressClass: "bg-amber-500",
    avgDays: 4.2,
    delta: "+10%"
  },
  {
    id: "rdv_planifie",
    label: "RDV planifié",
    accent: "#8b5cf6",
    surfaceClass: "from-violet-50 to-white",
    ringClass: "ring-violet-100",
    dotClass: "bg-violet-500",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-700",
    progressClass: "bg-violet-500",
    avgDays: 2.8,
    delta: "+5%"
  },
  {
    id: "negociation",
    label: "Négociation",
    accent: "#f97316",
    surfaceClass: "from-orange-50 to-white",
    ringClass: "ring-orange-100",
    dotClass: "bg-orange-500",
    badgeClass: "border-orange-200 bg-orange-50 text-orange-700",
    progressClass: "bg-orange-500",
    avgDays: 5.1,
    delta: "+3%"
  },
  {
    id: "gagne",
    label: "Gagné",
    accent: "#22c55e",
    surfaceClass: "from-emerald-50 to-white",
    ringClass: "ring-emerald-100",
    dotClass: "bg-emerald-500",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    progressClass: "bg-emerald-500",
    avgDays: 1.6,
    delta: "+12%"
  },
  {
    id: "perdu",
    label: "Perdu",
    accent: "#ef4444",
    surfaceClass: "from-rose-50 to-white",
    ringClass: "ring-rose-100",
    dotClass: "bg-rose-500",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
    progressClass: "bg-rose-500",
    avgDays: 1.2,
    delta: "-2%"
  },
  {
    id: "client_actif",
    label: "Client actif",
    accent: "#14b8a6",
    surfaceClass: "from-teal-50 to-white",
    ringClass: "ring-teal-100",
    dotClass: "bg-teal-500",
    badgeClass: "border-teal-200 bg-teal-50 text-teal-700",
    progressClass: "bg-teal-500",
    avgDays: 0.9,
    delta: "+6%"
  }
];

const goldAccent = "#C5A572";

function flattenColumns(columns: PipelineColumn[]) {
  return columns.flatMap((column) => column.salons);
}

function getScoreBadgeClass(score: number) {
  if (score >= 85) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (score >= 70) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getStageMeta(status: PipelineStatus) {
  return stageConfig.find((stage) => stage.id === status) ?? stageConfig[0];
}

function getEventLabel(type: string) {
  switch (type) {
    case "enrichment":
      return "Enrichissement";
    case "score":
      return "Scoring";
    case "outreach":
      return "Outreach";
    case "status_change":
      return "Changement de statut";
    case "brand_match":
      return "Matching marque";
    case "meeting":
      return "Rendez-vous";
    case "proposal":
      return "Proposition";
    case "closing":
      return "Closing";
    default:
      return "Activité";
  }
}

function formatRelative(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return format(date, "dd MMM • HH:mm", { locale: fr });
}

function normalizeWebsiteHref(website: string | null | undefined) {
  if (!website) return null;
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website;
  }
  return `https://${website}`;
}

function sortSalons(items: PipelineSalon[]) {
  return [...items].sort((a, b) => a.kanbanOrder - b.kanbanOrder);
}

export function PipelinePage({ initialColumns }: { initialColumns: PipelineColumn[] }) {
  const [salons, setSalons] = React.useState<PipelineSalon[]>(() =>
    sortSalons(flattenColumns(initialColumns))
  );
  const [assignedTo, setAssignedTo] = React.useState<string>("all");
  const [city, setCity] = React.useState<string>("all");
  const [scoreRange, setScoreRange] = React.useState<[number, number]>([40, 100]);
  const [selectedSalonId, setSelectedSalonId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSalons(sortSalons(flattenColumns(initialColumns)));
  }, [initialColumns]);

  const assignees = React.useMemo(
    () =>
      Array.from(
        new Set(
          salons
            .map((salon) => salon.assignedTo)
            .filter((value) => value && value !== "Non assigné")
        )
      ).sort((a, b) => a.localeCompare(b, "fr")),
    [salons]
  );

  const cities = React.useMemo(
    () => Array.from(new Set(salons.map((salon) => salon.city))).sort((a, b) => a.localeCompare(b, "fr")),
    [salons]
  );

  const filteredSalons = React.useMemo(() => {
    return salons.filter((salon) => {
      const assigneeMatch = assignedTo === "all" || salon.assignedTo === assignedTo;
      const cityMatch = city === "all" || salon.city === city;
      const scoreMatch = salon.score >= scoreRange[0] && salon.score <= scoreRange[1];

      return assigneeMatch && cityMatch && scoreMatch;
    });
  }, [assignedTo, city, scoreRange, salons]);

  const columns = React.useMemo<Record<PipelineStatus, PipelineSalon[]>>(() => {
    return pipelineStatuses.reduce((accumulator, status) => {
      accumulator[status] = sortSalons(filteredSalons.filter((salon) => salon.status === status));
      return accumulator;
    }, {} as Record<PipelineStatus, PipelineSalon[]>);
  }, [filteredSalons]);

  const countsByStage = React.useMemo(() => {
    return pipelineStatuses.reduce((accumulator, status) => {
      accumulator[status] = columns[status]?.length ?? 0;
      return accumulator;
    }, {} as Record<PipelineStatus, number>);
  }, [columns]);

  const visibleTotal = filteredSalons.length;
  const conversionBase = countsByStage.nouveau > 0 ? countsByStage.nouveau : Math.max(visibleTotal, 1);

  const selectedSalon = React.useMemo(
    () => salons.find((salon) => salon.id === selectedSalonId) ?? null,
    [salons, selectedSalonId]
  );

  const handleBoardChange = React.useCallback((nextColumns: Record<string, PipelineSalon[]>) => {
    const nextPlacement = new Map<string, { status: PipelineStatus; kanbanOrder: number }>();

    stageConfig.forEach((stage) => {
      const items = nextColumns[stage.id] ?? [];
      items.forEach((item, index) => {
        nextPlacement.set(item.id, {
          status: stage.id,
          kanbanOrder: index + 1
        });
      });
    });

    setSalons((previous) =>
      previous.map((salon) => {
        const placement = nextPlacement.get(salon.id);
        if (!placement) return salon;

        return {
          ...salon,
          status: placement.status,
          kanbanOrder: placement.kanbanOrder
        };
      })
    );
  }, []);

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-[28px] border border-[#eadfcf] bg-[linear-gradient(135deg,#ffffff_0%,#faf7f1_58%,#f5ede1_100%)] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d7bf] bg-white/90 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="size-2 rounded-full" style={{ backgroundColor: goldAccent }} />
              Pipeline commercial La Loge
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                Suivez chaque salon jusqu’au closing
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 lg:text-[15px]">
                Vue Kanban branchée sur Supabase pour piloter les statuts réels, filtrer les comptes
                les plus chauds et ouvrir une fiche rapide sans quitter la page.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                <div className="text-sm text-slate-500">Salons visibles</div>
                <div className="mt-2 text-2xl font-semibold">{visibleTotal}</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                <div className="text-sm text-slate-500">Taux vers RDV</div>
                <div className="mt-2 text-2xl font-semibold">
                  {Math.round((countsByStage.rdv_planifie / Math.max(conversionBase, 1)) * 100)}%
                </div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                <div className="text-sm text-slate-500">Deals gagnés</div>
                <div className="mt-2 text-2xl font-semibold text-emerald-700">
                  {countsByStage.gagne}
                </div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
                <div className="text-sm text-slate-500">Clients actifs</div>
                <div className="mt-2 text-2xl font-semibold text-teal-700">
                  {countsByStage.client_actif}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/90 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Funnel de conversion</p>
                <p className="text-xs text-slate-500">
                  Basé sur les salons affichés et les filtres actuellement appliqués
                </p>
              </div>
              <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">
                Données live
              </Badge>
            </div>

            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
              {stageConfig.map((stage) => {
                const width = visibleTotal === 0 ? 0 : (countsByStage[stage.id] / visibleTotal) * 100;
                return (
                  <div
                    key={stage.id}
                    className="h-full min-w-0 transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: stage.accent
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stageConfig.map((stage) => {
                const count = countsByStage[stage.id];
                const rate = Math.round((count / Math.max(conversionBase, 1)) * 100);
                return (
                  <div key={stage.id} className="rounded-2xl border border-slate-200/80 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("size-2.5 rounded-full", stage.dotClass)} />
                        <span className="text-sm font-medium text-slate-700">{stage.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{count}</span>
                    </div>
                    <Progress
                      value={Math.min(rate, 100)}
                      className="mt-3 bg-slate-100"
                      indicatorColor={stage.progressClass}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{rate}% du funnel</span>
                      <span>{stage.avgDays} j / étape</span>
                    </div>
                    <div className="mt-1 text-xs font-medium" style={{ color: stage.accent }}>
                      {stage.delta} vs semaine précédente
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold">Filtres</h2>
            <p className="text-sm text-slate-500">
              Assignee, ville et score pour concentrer la prospection sur les salons les plus chauds.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700"
            onClick={() => {
              setAssignedTo("all");
              setCity("all");
              setScoreRange([40, 100]);
            }}>
            Réinitialiser
          </Button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Assigné à
            </label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-900">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {assignees.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Ville
            </label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-900">
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((cityItem) => (
                  <SelectItem key={cityItem} value={cityItem}>
                    {cityItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Score
                </div>
                <div className="mt-1 text-sm text-slate-900">
                  Entre {scoreRange[0]} et {scoreRange[1]}
                </div>
              </div>
              <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">
                Priorité chaude
              </Badge>
            </div>
            <Slider
              value={scoreRange}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setScoreRange(value as [number, number])}
              className="py-2"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Board pipeline</h2>
            <p className="text-sm text-slate-500">
              Glissez un salon d’une colonne à l’autre pour prévisualiser l’évolution du pipeline.
            </p>
          </div>
          <Badge className="border-slate-200 bg-slate-100 text-slate-700">
            {visibleTotal} salons affichés
          </Badge>
        </div>

        <Kanban.Root value={columns} onValueChange={handleBoardChange} getItemValue={(item) => item.id}>
          <Kanban.Board className="flex gap-4 overflow-x-auto pb-4">
            {stageConfig.map((stage) => {
              const items = columns[stage.id] ?? [];

              return (
                <Kanban.Column
                  key={stage.id}
                  value={stage.id}
                  className={cn(
                    "w-[320px] min-w-[320px] shrink-0 rounded-[28px] border bg-gradient-to-b p-3 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.55)] ring-1",
                    stage.surfaceClass,
                    stage.ringClass
                  )}>
                  <div className="flex items-center justify-between gap-3 px-1 py-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2.5 rounded-full", stage.dotClass)} />
                      <span className="text-sm font-semibold text-slate-900">{stage.label}</span>
                    </div>
                    <Badge className={cn("border", stage.badgeClass)}>{items.length}</Badge>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    {items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                        Aucun salon pour ce statut
                      </div>
                    ) : (
                      items.map((salon) => (
                        <Kanban.Item key={salon.id} value={salon.id} asChild>
                          <Card
                            className="group cursor-pointer rounded-[24px] border-slate-200/80 bg-white/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            onClick={() => setSelectedSalonId(salon.id)}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 space-y-1">
                                  <Link
                                    prefetch={false}
                                    href={`/dashboard/salons/${salon.id}`}
                                    className="block truncate text-sm font-semibold text-slate-900 hover:underline"
                                    onClick={(event) => event.stopPropagation()}>
                                    {salon.name}
                                  </Link>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <MapPinIcon className="size-3.5" />
                                    <span>
                                      {salon.city} • {salon.department}
                                    </span>
                                  </div>
                                </div>

                                <Kanban.ItemHandle asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                    onClick={(event) => event.stopPropagation()}>
                                    <GripVerticalIcon className="size-4" />
                                  </Button>
                                </Kanban.ItemHandle>
                              </div>

                              <div className="mt-4 flex items-center justify-between gap-3">
                                <Badge className={cn("border", getScoreBadgeClass(salon.score))}>
                                  Score {salon.score}
                                </Badge>
                                <Avatar className="size-8 border border-slate-200">
                                  <AvatarImage src={salon.assignedAvatar ?? undefined} alt={salon.assignedTo} />
                                  <AvatarFallback className="bg-slate-100 text-[11px] text-slate-700">
                                    {salon.assignedInitials}
                                  </AvatarFallback>
                                </Avatar>
                              </div>

                              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                <span>Dernière activité</span>
                                <span className="font-medium text-slate-700">
                                  {formatRelative(salon.lastActivityAt)}
                                </span>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {salon.tags.length > 0 ? (
                                  salon.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                    Profil à enrichir
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Kanban.Item>
                      ))
                    )}
                  </div>
                </Kanban.Column>
              );
            })}
          </Kanban.Board>
          <Kanban.Overlay>
            <div className="h-full rounded-[28px] border border-slate-200 bg-white/90 shadow-2xl" />
          </Kanban.Overlay>
        </Kanban.Root>
      </section>

      <Sheet open={Boolean(selectedSalon)} onOpenChange={(open) => !open && setSelectedSalonId(null)}>
        <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl">
          {selectedSalon && (
            <>
              <SheetHeader className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f2_100%)] px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge className="border-[#e6d7bf] bg-[#f7f1e7] text-[#8b6f3d]">
                      Vue rapide salon
                    </Badge>
                    <div>
                      <SheetTitle className="text-2xl tracking-tight text-slate-900">
                        {selectedSalon.name}
                      </SheetTitle>
                      <SheetDescription className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <MapPinIcon className="size-4" />
                        {selectedSalon.city} • {selectedSalon.department}
                      </SheetDescription>
                    </div>
                  </div>
                  <Badge className={cn("border", getScoreBadgeClass(selectedSalon.score))}>
                    Score {selectedSalon.score}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="space-y-6 px-6 py-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Contact disponible
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                      {selectedSalon.email || "Aucun email renseigné"}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {selectedSalon.phone || "Aucun téléphone renseigné"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      Assigné à
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Avatar className="size-9 border border-slate-200">
                        <AvatarImage src={selectedSalon.assignedAvatar ?? undefined} alt={selectedSalon.assignedTo} />
                        <AvatarFallback className="bg-slate-100 text-[11px] text-slate-700">
                          {selectedSalon.assignedInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {selectedSalon.assignedTo}
                        </div>
                        <div className="text-sm text-slate-500">
                          Dernière activité {formatRelative(selectedSalon.lastActivityAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="size-4 text-[#8b6f3d]" />
                    <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSalon.phone ? (
                      <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                        <a href={`tel:${selectedSalon.phone.replace(/\s+/g, "")}`}>
                          <PhoneIcon className="size-4" />
                          Appeler
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-slate-200 text-slate-400" disabled>
                        <PhoneIcon className="size-4" />
                        Appeler
                      </Button>
                    )}
                    {selectedSalon.email ? (
                      <Button asChild variant="outline" className="border-slate-200 text-slate-700">
                        <a href={`mailto:${selectedSalon.email}`}>
                          <MailIcon className="size-4" />
                          Envoyer un email
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="border-slate-200 text-slate-400" disabled>
                        <MailIcon className="size-4" />
                        Envoyer un email
                      </Button>
                    )}
                    <Button variant="outline" className="border-slate-200 text-slate-700">
                      <NotebookPenIcon className="size-4" />
                      Ajouter une note
                    </Button>
                    <Button asChild className="bg-slate-900 text-white hover:bg-slate-800">
                      <Link prefetch={false} href={`/dashboard/salons/${selectedSalon.id}`}>
                        Voir fiche complète
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <StarIcon className="size-4 text-slate-500" />
                      Rating Google
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {selectedSalon.googleRating ? `${selectedSalon.googleRating.toFixed(1)} / 5` : "Non renseigné"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <UsersIcon className="size-4 text-slate-500" />
                      Taille équipe
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {selectedSalon.teamSize ? `${selectedSalon.teamSize} personnes` : "Non renseigné"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <PhoneIcon className="size-4 text-slate-500" />
                      Téléphone
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      {selectedSalon.phone || "Aucun numéro renseigné"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <GlobeIcon className="size-4 text-slate-500" />
                      Site web
                    </div>
                    {normalizeWebsiteHref(selectedSalon.website) ? (
                      <Link
                        prefetch={false}
                        href={normalizeWebsiteHref(selectedSalon.website) ?? "#"}
                        target="_blank"
                        className="mt-2 block truncate text-sm text-slate-700 hover:underline">
                        {selectedSalon.website}
                      </Link>
                    ) : (
                      <div className="mt-2 text-sm text-slate-700">Aucun site web renseigné</div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Building2Icon className="size-4 text-slate-500" />
                    Résumé commercial
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className={cn("border", getStageMeta(selectedSalon.status).badgeClass)}>
                      {getStageMeta(selectedSalon.status).label}
                    </Badge>
                    {selectedSalon.tags.length > 0 ? (
                      selectedSalon.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#e6d7bf] bg-[#fbf6ed] px-2.5 py-1 text-xs font-medium text-[#8b6f3d]">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Aucun signal enrichi pour le moment.</span>
                    )}
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedSalon.timeline.map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3">
                        <div className="mt-1 size-2 rounded-full bg-slate-400" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-slate-900">
                              {getEventLabel(event.type)}
                            </div>
                            <div className="text-xs text-slate-500">{formatDateTime(event.at)}</div>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{event.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
