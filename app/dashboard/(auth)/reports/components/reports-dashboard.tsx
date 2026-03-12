"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { DownloadIcon, FileSpreadsheetIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis
} from "recharts";

import type { ReportAction, ReportData } from "@/lib/supabase/queries/reports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { reportRanges } from "./mock-reports";
import { cn } from "@/lib/utils";

const statusChartConfig = {
  count: { label: "Salons", color: "var(--chart-1)" }
} satisfies ChartConfig;

const scoreChartConfig = {
  value: { label: "Salons", color: "var(--chart-3)" }
} satisfies ChartConfig;

const activityChartConfig = {
  value: { label: "Actions", color: "var(--chart-1)" },
  count: { label: "Volume", color: "var(--chart-2)" }
} satisfies ChartConfig;

const outreachChartConfig = {
  count: { label: "Outreach", color: "var(--chart-4)" }
} satisfies ChartConfig;

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function normalizeValue(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function translateActionType(value: string) {
  switch (normalizeValue(value)) {
    case "enrichment":
      return "Enrichissement";
    case "outreach":
      return "Outreach";
    case "brand-match":
    case "brand_match":
      return "Matching marque";
    case "score-refresh":
    case "score_refresh":
    case "score":
      return "Scoring";
    case "quality-review":
    case "quality_review":
      return "Contrôle qualité";
    case "prospecting":
      return "Prospection";
    case "dossier-generation":
    case "dossier_generation":
      return "Dossier";
    case "contact-sync":
    case "contact_sync":
      return "Sync contact";
    case "travaux-signal":
    case "travaux_signal":
      return "Signal travaux";
    default:
      return value
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function translateStatus(value: string) {
  switch (normalizeValue(value)) {
    case "approved":
    case "auto-approved":
    case "auto_approved":
      return "Approuvée";
    case "completed":
    case "done":
    case "success":
      return "Terminée";
    case "pending":
      return "En attente";
    case "queued":
      return "En file";
    case "requested":
      return "Demandée";
    case "error":
      return "Erreur";
    case "failed":
      return "Échouée";
    case "rejected":
      return "Rejetée";
    default:
      return value
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function getStatusBadgeClass(status: string) {
  switch (normalizeValue(status)) {
    case "approved":
    case "auto-approved":
    case "auto_approved":
    case "completed":
    case "done":
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "pending":
    case "queued":
    case "requested":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "error":
    case "failed":
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getActionBadgeClass(type: string) {
  switch (normalizeValue(type)) {
    case "enrichment":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "outreach":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "brand-match":
    case "brand_match":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "score-refresh":
    case "score_refresh":
    case "score":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "quality-review":
    case "quality_review":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function relativeDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date inconnue";

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: fr
  });
}

function getRangeDays(value: (typeof reportRanges)[number]) {
  switch (value) {
    case "Aujourd’hui":
      return 1;
    case "7 jours":
      return 7;
    case "30 jours":
      return 30;
    case "90 jours":
      return 90;
    default:
      return null;
  }
}

function filterActionsByRange(actions: ReportAction[], range: (typeof reportRanges)[number]) {
  const days = getRangeDays(range);
  if (!days) return actions;

  const boundary = new Date();
  boundary.setHours(0, 0, 0, 0);
  boundary.setDate(boundary.getDate() - (days - 1));

  return actions.filter((action) => {
    const createdAt = new Date(action.createdAt);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= boundary;
  });
}

function filterDailyActionsByRange(
  points: ReportData["dailyActions"],
  range: (typeof reportRanges)[number]
) {
  const days = getRangeDays(range);
  if (!days) return points;
  return points.slice(-days);
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed text-center text-sm text-muted-foreground">
      <p className="max-w-sm">{message}</p>
    </div>
  );
}

export function ReportsDashboard({ data }: { data: ReportData }) {
  const [globalRange, setGlobalRange] = React.useState<(typeof reportRanges)[number]>("30 jours");

  const visibleActions = React.useMemo(
    () => filterActionsByRange(data.recentActions, globalRange),
    [data.recentActions, globalRange]
  );

  const visibleDailyActions = React.useMemo(
    () => filterDailyActionsByRange(data.dailyActions, globalRange),
    [data.dailyActions, globalRange]
  );

  const enrichPercent = Math.round((data.enriched / Math.max(data.totalSalons, 1)) * 100);
  const contactedPercent = Math.round((data.contacted / Math.max(data.totalSalons, 1)) * 100);
  const outreachRate = Math.round((data.outreachSent / Math.max(data.contacted, 1)) * 100);
  const topStatus =
    [...data.statusDistribution].sort((a, b) => b.count - a.count)[0] ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Analytics management pour La Loge CRM</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Rapports</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Rapports branchés sur Supabase pour piloter le pipeline, la qualité des données,
            l’activité agentique et l’outreach depuis une seule vue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={globalRange}
            onValueChange={(value) => setGlobalRange(value as (typeof reportRanges)[number])}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reportRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileSpreadsheetIcon />
            Export CSV
          </Button>
          <Button>
            <DownloadIcon />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Salons total</CardDescription>
            <CardTitle className="text-3xl">{formatCount(data.totalSalons)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Base CRM globale synchronisée avec Supabase.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Enrichis</CardDescription>
            <CardTitle className="text-3xl">{formatCount(data.enriched)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={enrichPercent} className="h-2" />
            <p className="text-sm text-muted-foreground">{enrichPercent}% de la base est enrichie.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Score &gt; 40</CardDescription>
            <CardTitle className="text-3xl">{formatCount(data.highScore)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Volume de salons considérés comme exploitables commercialement.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contactés</CardDescription>
            <CardTitle className="text-3xl">{formatCount(data.contacted)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {contactedPercent}% de la base a quitté le statut Nouveau.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outreach envoyés</CardDescription>
            <CardTitle className="text-3xl">{formatCount(data.outreachSent)}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {outreachRate}% vs salons déjà contactés.
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Distribution pipeline</CardTitle>
                <CardDescription>
                  Répartition des salons par statut dans le CRM.
                </CardDescription>
              </div>
              {topStatus ? <Badge variant="outline">Statut majoritaire · {topStatus.label}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.statusDistribution.some((item) => item.count > 0) ? (
              <>
                <ChartContainer className="h-[260px] w-full" config={statusChartConfig}>
                  <BarChart data={data.statusDistribution} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} hide />
                    <YAxis tickLine={false} axisLine={false} width={34} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.statusDistribution.map((item) => (
                    <div key={item.status} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-semibold">{formatCount(item.count)}</span>
                      </div>
                      <Progress
                        value={Math.round((item.count / Math.max(data.totalSalons, 1)) * 100)}
                        className="mt-3 h-2"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState message="Aucune donnée pipeline disponible pour le moment." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qualité de la donnée</CardTitle>
            <CardDescription>
              Couverture actuelle des champs clés pour l’équipe commerciale.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression enrichissement</span>
                <span className="font-medium">
                  {formatCount(data.enriched)} / {formatCount(data.totalSalons)}
                </span>
              </div>
              <Progress value={enrichPercent} className="mt-3 h-2" />
              <p className="mt-3 text-sm text-muted-foreground">
                {enrichPercent}% des salons disposent d’un niveau d’enrichissement validé.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {data.enrichmentQuality.map((item) => (
                <div key={item.label} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="mt-3 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des scores</CardTitle>
            <CardDescription>
              Répartition des scores des salons sur l’ensemble de la base.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.scoreBuckets.some((item) => item.value > 0) ? (
              <ChartContainer className="h-[300px] w-full" config={scoreChartConfig}>
                <BarChart data={data.scoreBuckets} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="range" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyState message="Aucune donnée de scoring disponible." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité agentique</CardTitle>
            <CardDescription>
              Volume d’actions récentes filtré sur la période sélectionnée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visibleDailyActions.some((item) => item.value > 0) ? (
              <ChartContainer className="h-[220px] w-full" config={activityChartConfig}>
                <AreaChart data={visibleDailyActions} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="value"
                    type="monotone"
                    fill="var(--color-value)"
                    fillOpacity={0.18}
                    stroke="var(--color-value)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyState message="Aucune action agentique visible sur cette période." />
            )}

            <div className="rounded-2xl border p-4">
              <p className="mb-3 text-sm font-medium">Répartition par agent</p>
              {data.agentBreakdown.length > 0 ? (
                <>
                  <ChartContainer className="h-[180px] w-full" config={activityChartConfig}>
                    <LineChart data={data.agentBreakdown} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="agent" tickLine={false} axisLine={false} hide />
                      <YAxis tickLine={false} axisLine={false} width={34} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line dataKey="count" type="monotone" stroke="var(--color-count)" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {data.agentBreakdown.map((item) => (
                      <Badge key={item.agent} variant="outline">
                        {item.agent} · {item.count}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun breakdown agent disponible pour le moment.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Statuts outreach</CardTitle>
            <CardDescription>
              Vue synthétique des statuts remontés depuis la table outreach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.outreachByStatus.length > 0 ? (
              <>
                <ChartContainer className="h-[260px] w-full" config={outreachChartConfig}>
                  <BarChart data={data.outreachByStatus} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} hide />
                    <YAxis tickLine={false} axisLine={false} width={34} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {data.outreachByStatus.map((item) => (
                    <div key={item.label} className="rounded-2xl border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-semibold">{formatCount(item.count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState message="Aucun outreach historisé pour le moment." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Actions récentes</CardTitle>
                <CardDescription>
                  Dernières actions agents visibles sur la période sélectionnée.
                </CardDescription>
              </div>
              <Badge variant="outline">{visibleActions.length} visibles</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {visibleActions.length > 0 ? (
              <div className="space-y-3">
                {visibleActions.slice(0, 10).map((action) => (
                  <div key={action.id} className="rounded-2xl border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("border", getActionBadgeClass(action.actionType))}>
                        {translateActionType(action.actionType)}
                      </Badge>
                      <Badge className={cn("border", getStatusBadgeClass(action.status))}>
                        {translateStatus(action.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{relativeDate(action.createdAt)}</span>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{action.agentName}</div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Aucune action récente sur cette période." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
