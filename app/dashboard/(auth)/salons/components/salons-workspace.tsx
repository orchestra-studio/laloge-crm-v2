"use client";

import * as React from "react";
import {
  Download,
  Filter,
  KanbanSquare,
  List,
  Mail,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Phone,
  Star
} from "lucide-react";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SalonKanban } from "@/components/salon/salon-kanban";
import { SalonTable } from "@/components/salon/salon-table";
import { GOLD_ACCENT, formatCompactNumber, salonStatusConfig, salonStatusOrder } from "@/lib/salon";
import { cn } from "@/lib/utils";

const defaultAdvancedFilters = {
  statuses: [] as string[],
  scoreRange: [0, 100] as [number, number],
  city: "",
  department: "all",
  region: "all",
  enrichment: [] as string[],
  assignedTo: "all",
  tags: [] as string[],
  createdSince: "all",
  hasPhone: false,
  hasEmail: false,
  hasWebsite: false
};

type QuickFilter = "all" | "new" | "enriched" | "score50" | "score80" | "withPhone" | "withoutEmail";
type ViewMode = "list" | "kanban";

type AdvancedFilters = typeof defaultAdvancedFilters;

interface SalonsWorkspaceProps {
  salons: Salon[];
  totalCount?: number;
}

export function SalonsWorkspace({ salons, totalCount = salons.length }: SalonsWorkspaceProps) {
  const [view, setView] = React.useState<ViewMode>("list");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFilters>(defaultAdvancedFilters);
  const [activeSavedView, setActiveSavedView] = React.useState<string | null>(null);

  const regions = React.useMemo(
    () => Array.from(new Set(salons.map((salon) => salon.region))).sort((a, b) => a.localeCompare(b, "fr")),
    [salons]
  );
  const departments = React.useMemo(
    () => Array.from(new Set(salons.map((salon) => salon.department))).sort((a, b) => a.localeCompare(b, "fr")),
    [salons]
  );
  const assignedProfiles = React.useMemo(
    () =>
      Array.from(
        new Map(
          salons
            .filter((salon) => salon.assigned_to)
            .map((salon) => [salon.assigned_to!.id, salon.assigned_to!])
        ).values()
      ),
    [salons]
  );
  const tags = React.useMemo(
    () => Array.from(new Set(salons.flatMap((salon) => salon.tags))).sort((a, b) => a.localeCompare(b, "fr")),
    [salons]
  );

  const filteredSalons = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return salons.filter((salon) => {
      const searchableText = [
        salon.name,
        salon.city,
        salon.owner_name,
        salon.email ?? "",
        salon.phone ?? "",
        salon.tags.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);

      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "new" && salon.status === "nouveau") ||
        (quickFilter === "enriched" && salon.enrichment_status === "enriched") ||
        (quickFilter === "score50" && salon.score > 50) ||
        (quickFilter === "score80" && salon.score > 80) ||
        (quickFilter === "withPhone" && Boolean(salon.phone)) ||
        (quickFilter === "withoutEmail" && !salon.email);

      const createdAt = new Date(salon.created_at);
      const daysSinceCreated = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const createdSinceMatch =
        advancedFilters.createdSince === "all" ||
        (advancedFilters.createdSince === "30" && daysSinceCreated <= 30) ||
        (advancedFilters.createdSince === "90" && daysSinceCreated <= 90);

      const matchesAdvanced =
        (advancedFilters.statuses.length === 0 || advancedFilters.statuses.includes(salon.status)) &&
        salon.score >= advancedFilters.scoreRange[0] &&
        salon.score <= advancedFilters.scoreRange[1] &&
        (!advancedFilters.city || salon.city.toLowerCase().includes(advancedFilters.city.toLowerCase())) &&
        (advancedFilters.department === "all" || salon.department === advancedFilters.department) &&
        (advancedFilters.region === "all" || salon.region === advancedFilters.region) &&
        (advancedFilters.enrichment.length === 0 ||
          advancedFilters.enrichment.includes(salon.enrichment_status)) &&
        (advancedFilters.assignedTo === "all" || salon.assigned_to?.id === advancedFilters.assignedTo) &&
        (advancedFilters.tags.length === 0 || advancedFilters.tags.every((tag) => salon.tags.includes(tag))) &&
        (!advancedFilters.hasPhone || Boolean(salon.phone)) &&
        (!advancedFilters.hasEmail || Boolean(salon.email)) &&
        (!advancedFilters.hasWebsite || Boolean(salon.website)) &&
        createdSinceMatch;

      return matchesSearch && matchesQuickFilter && matchesAdvanced;
    });
  }, [salons, searchQuery, quickFilter, advancedFilters]);

  const quickFilterCounts = React.useMemo(
    () => ({
      all: salons.length,
      new: salons.filter((salon) => salon.status === "nouveau").length,
      enriched: salons.filter((salon) => salon.enrichment_status === "enriched").length,
      score50: salons.filter((salon) => salon.score > 50).length,
      score80: salons.filter((salon) => salon.score > 80).length,
      withPhone: salons.filter((salon) => Boolean(salon.phone)).length,
      withoutEmail: salons.filter((salon) => !salon.email).length
    }),
    [salons]
  );

  const advancedFilterCount = [
    advancedFilters.statuses.length > 0,
    advancedFilters.scoreRange[0] !== 0 || advancedFilters.scoreRange[1] !== 100,
    advancedFilters.city !== "",
    advancedFilters.department !== "all",
    advancedFilters.region !== "all",
    advancedFilters.enrichment.length > 0,
    advancedFilters.assignedTo !== "all",
    advancedFilters.tags.length > 0,
    advancedFilters.createdSince !== "all",
    advancedFilters.hasPhone,
    advancedFilters.hasEmail,
    advancedFilters.hasWebsite
  ].filter(Boolean).length;

  const summary = React.useMemo(
    () => [
      {
        label: "Visibles",
        value: filteredSalons.length,
        hint: `${formatCompactNumber(totalCount)} en production`,
        icon: List,
        accent: "gold"
      },
      {
        label: "Top score > 80",
        value: filteredSalons.filter((salon) => salon.score > 80).length,
        hint: "priorité marques",
        icon: Star,
        accent: "green"
      },
      {
        label: "Avec téléphone",
        value: filteredSalons.filter((salon) => Boolean(salon.phone)).length,
        hint: "appels rapides",
        icon: Phone,
        accent: "blue"
      },
      {
        label: "Sans email",
        value: filteredSalons.filter((salon) => !salon.email).length,
        hint: "enrichissement à faire",
        icon: Mail,
        accent: "slate"
      }
    ],
    [filteredSalons, totalCount]
  );

  const savedViews = [
    {
      id: "paris-premium",
      label: "Mes prospects Paris",
      apply: () => {
        setSearchQuery("");
        setQuickFilter("all");
        setAdvancedFilters({
          ...defaultAdvancedFilters,
          city: "Paris",
          scoreRange: [70, 100],
          hasPhone: true
        });
      }
    },
    {
      id: "idf-top-scores",
      label: "Top scores IDF",
      apply: () => {
        setSearchQuery("");
        setQuickFilter("all");
        setAdvancedFilters({
          ...defaultAdvancedFilters,
          region: "Île-de-France",
          scoreRange: [80, 100],
          enrichment: ["enriched"]
        });
      }
    },
    {
      id: "clients-actifs",
      label: "Clients actifs",
      apply: () => {
        setSearchQuery("");
        setQuickFilter("all");
        setAdvancedFilters({
          ...defaultAdvancedFilters,
          statuses: ["client_actif"]
        });
      }
    }
  ];

  function resetAllFilters() {
    setQuickFilter("all");
    setSearchQuery("");
    setAdvancedFilters(defaultAdvancedFilters);
    setActiveSavedView(null);
  }

  function exportCsv() {
    const header = [
      "id",
      "name",
      "city",
      "department",
      "status",
      "score",
      "phone",
      "email",
      "enrichment_status",
      "google_rating"
    ];

    const rows = filteredSalons.map((salon) => [
      salon.id,
      salon.name,
      salon.city,
      salon.department,
      salon.status,
      salon.score,
      salon.phone ?? "",
      salon.email ?? "",
      salon.enrichment_status,
      salon.google_rating
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "salons-laloge.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
        <div
          className="border-b border-slate-200/80 px-5 py-5 sm:px-6"
          style={{
            backgroundImage:
              "linear-gradient(130deg, rgba(197,165,114,0.14), rgba(255,255,255,0.96) 34%, rgba(248,250,252,0.96) 100%)"
          }}>
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full border-[#C5A572]/30 bg-[#C5A572]/12 text-[#7D643C]">
                  Vue opérateur premium
                </Badge>
                <Badge variant="outline" className="rounded-full bg-white/80 text-slate-600">
                  70% du temps métier ici
                </Badge>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Salons <span className="text-slate-400">{formatCompactNumber(totalCount)}</span>
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Centre de pilotage principal pour qualifier, contacter et convertir les salons.
                  <span className="ml-2 text-slate-400">{salons.length} fiches mock chargées.</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => {
                  if (value === "list" || value === "kanban") setView(value);
                }}
                variant="outline"
                className="rounded-full border border-slate-200 bg-white/90 p-1">
                <ToggleGroupItem value="list" className="rounded-full px-3 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
                  <List className="size-4" />
                  Liste
                </ToggleGroupItem>
                <ToggleGroupItem value="kanban" className="rounded-full px-3 data-[state=on]:bg-slate-900 data-[state=on]:text-white">
                  <KanbanSquare className="size-4" />
                  Kanban
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" className="rounded-full bg-white/90" onClick={exportCsv}>
                <Download className="size-4" />
                Export CSV
              </Button>
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="size-4" />
                Nouveau salon
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-2xl border p-4 shadow-xs",
                item.accent === "gold" && "border-[#C5A572]/25 bg-[#C5A572]/8",
                item.accent === "green" && "border-emerald-200 bg-emerald-50/60",
                item.accent === "blue" && "border-blue-200 bg-blue-50/60",
                item.accent === "slate" && "border-slate-200 bg-slate-50/80"
              )}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCompactNumber(item.value)}</p>
                </div>
                <div
                  className="flex size-11 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: item.accent === "gold" ? "rgba(197,165,114,0.16)" : undefined }}>
                  <item.icon className="size-5 text-slate-700" style={item.accent === "gold" ? { color: GOLD_ACCENT } : undefined} />
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-500">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setActiveSavedView(null);
                }}
                placeholder="Rechercher par nom, ville, tag, téléphone…"
                className="h-10 rounded-full bg-slate-50 pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white">
                    <Filter className="size-4" />
                    Filtres avancés
                    {advancedFilterCount > 0 ? (
                      <Badge variant="secondary" className="rounded-full px-2 text-[11px]">
                        {advancedFilterCount}
                      </Badge>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[360px] rounded-[24px] p-0">
                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Filtres avancés</p>
                      <p className="text-xs text-slate-500">Affinez la prospection selon le potentiel et la complétude des fiches.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FilterGroup title="Statuts">
                        <div className="grid gap-2">
                          {salonStatusOrder.map((status) => (
                            <label key={status} className="flex items-center gap-2 text-sm text-slate-600">
                              <Checkbox
                                checked={advancedFilters.statuses.includes(status)}
                                onCheckedChange={(checked) => {
                                  setAdvancedFilters((current) => ({
                                    ...current,
                                    statuses: checked
                                      ? [...current.statuses, status]
                                      : current.statuses.filter((item) => item !== status)
                                  }));
                                  setActiveSavedView(null);
                                }}
                              />
                              {salonStatusConfig[status].label}
                            </label>
                          ))}
                        </div>
                      </FilterGroup>

                      <FilterGroup title="Enrichissement">
                        <div className="grid gap-2">
                          {[
                            ["pending", "En attente"],
                            ["enriched", "Enrichi"],
                            ["failed", "Échec"]
                          ].map(([value, label]) => (
                            <label key={value} className="flex items-center gap-2 text-sm text-slate-600">
                              <Checkbox
                                checked={advancedFilters.enrichment.includes(value)}
                                onCheckedChange={(checked) => {
                                  setAdvancedFilters((current) => ({
                                    ...current,
                                    enrichment: checked
                                      ? [...current.enrichment, value]
                                      : current.enrichment.filter((item) => item !== value)
                                  }));
                                  setActiveSavedView(null);
                                }}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </FilterGroup>
                    </div>

                    <FilterGroup title="Score range">
                      <div className="space-y-3">
                        <Slider
                          value={advancedFilters.scoreRange}
                          onValueChange={(value) => {
                            setAdvancedFilters((current) => ({
                              ...current,
                              scoreRange: [value[0] ?? 0, value[1] ?? 100]
                            }));
                            setActiveSavedView(null);
                          }}
                          min={0}
                          max={100}
                          step={1}
                        />
                        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{advancedFilters.scoreRange[0]}</span>
                          <span>{advancedFilters.scoreRange[1]}</span>
                        </div>
                      </div>
                    </FilterGroup>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FilterGroup title="Ville">
                        <Input
                          value={advancedFilters.city}
                          onChange={(event) => {
                            setAdvancedFilters((current) => ({ ...current, city: event.target.value }));
                            setActiveSavedView(null);
                          }}
                          placeholder="Ex. Paris"
                          className="rounded-xl bg-slate-50"
                        />
                      </FilterGroup>
                      <FilterGroup title="Département">
                        <Select
                          value={advancedFilters.department}
                          onValueChange={(value) => {
                            setAdvancedFilters((current) => ({ ...current, department: value }));
                            setActiveSavedView(null);
                          }}>
                          <SelectTrigger className="w-full rounded-xl bg-slate-50">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            {departments.map((department) => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FilterGroup>
                      <FilterGroup title="Région">
                        <Select
                          value={advancedFilters.region}
                          onValueChange={(value) => {
                            setAdvancedFilters((current) => ({ ...current, region: value }));
                            setActiveSavedView(null);
                          }}>
                          <SelectTrigger className="w-full rounded-xl bg-slate-50">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FilterGroup>
                      <FilterGroup title="Assigné à">
                        <Select
                          value={advancedFilters.assignedTo}
                          onValueChange={(value) => {
                            setAdvancedFilters((current) => ({ ...current, assignedTo: value }));
                            setActiveSavedView(null);
                          }}>
                          <SelectTrigger className="w-full rounded-xl bg-slate-50">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            {assignedProfiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FilterGroup>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FilterGroup title="Tags">
                        <div className="grid max-h-32 gap-2 overflow-y-auto pr-1">
                          {tags.map((tag) => (
                            <label key={tag} className="flex items-center gap-2 text-sm text-slate-600">
                              <Checkbox
                                checked={advancedFilters.tags.includes(tag)}
                                onCheckedChange={(checked) => {
                                  setAdvancedFilters((current) => ({
                                    ...current,
                                    tags: checked
                                      ? [...current.tags, tag]
                                      : current.tags.filter((item) => item !== tag)
                                  }));
                                  setActiveSavedView(null);
                                }}
                              />
                              {tag}
                            </label>
                          ))}
                        </div>
                      </FilterGroup>
                      <FilterGroup title="Création">
                        <Select
                          value={advancedFilters.createdSince}
                          onValueChange={(value) => {
                            setAdvancedFilters((current) => ({ ...current, createdSince: value }));
                            setActiveSavedView(null);
                          }}>
                          <SelectTrigger className="w-full rounded-xl bg-slate-50">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            <SelectItem value="30">30 derniers jours</SelectItem>
                            <SelectItem value="90">90 derniers jours</SelectItem>
                          </SelectContent>
                        </Select>
                      </FilterGroup>
                    </div>

                    <FilterGroup title="Disponibilité des données">
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          ["hasPhone", "Téléphone"],
                          ["hasEmail", "Email"],
                          ["hasWebsite", "Site web"]
                        ].map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 text-sm text-slate-600">
                            <Checkbox
                              checked={advancedFilters[key as keyof AdvancedFilters] as boolean}
                              onCheckedChange={(checked) => {
                                setAdvancedFilters((current) => ({
                                  ...current,
                                  [key]: Boolean(checked)
                                }));
                                setActiveSavedView(null);
                              }}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </FilterGroup>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
                      <Button variant="ghost" size="sm" className="rounded-full" onClick={resetAllFilters}>
                        <RotateCcw className="size-4" />
                        Réinitialiser
                      </Button>
                      <Button size="sm" className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" className="rounded-full" onClick={resetAllFilters}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["all", "Tous"],
                ["new", "Nouveaux"],
                ["enriched", "Enrichis"],
                ["score50", "Score > 50"],
                ["score80", "Score > 80"],
                ["withPhone", "Avec téléphone"],
                ["withoutEmail", "Sans email"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setQuickFilter(value as QuickFilter);
                    setActiveSavedView(null);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                    quickFilter === value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                  )}>
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px]",
                      quickFilter === value ? "bg-white/15 text-white" : "bg-white text-slate-500"
                    )}>
                    {formatCompactNumber(quickFilterCounts[value as keyof typeof quickFilterCounts])}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Saved views</span>
              {savedViews.map((viewItem) => (
                <button
                  key={viewItem.id}
                  type="button"
                  onClick={() => {
                    viewItem.apply();
                    setActiveSavedView(viewItem.id);
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    activeSavedView === viewItem.id
                      ? "border-[#C5A572]/30 bg-[#C5A572]/12 text-[#7D643C]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  )}>
                  <Sparkles className="size-3.5" />
                  {viewItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {view === "list" ? <SalonTable salons={filteredSalons} /> : <SalonKanban salons={filteredSalons} />}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{title}</p>
      {children}
    </div>
  );
}
