"use client";

import * as React from "react";
import { DownloadIcon, FileSpreadsheetIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  Line,
  LineChart,
  XAxis,
  YAxis
} from "recharts";

import {
  agentPerformance,
  brandMatching,
  enrichmentProgress,
  outreachPerformance,
  pipelineOverview,
  reportRanges,
  scoringDistribution
} from "./mock-reports";
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

const pipelineChartConfig = {
  value: { label: "Volume", color: "var(--chart-1)" },
  days: { label: "Jours", color: "var(--chart-2)" }
} satisfies ChartConfig;

const enrichmentChartConfig = {
  enriched: { label: "Enrichis", color: "var(--chart-1)" }
} satisfies ChartConfig;

const scoringChartConfig = {
  value: { label: "Salons", color: "var(--chart-3)" },
  score: { label: "Score moyen", color: "var(--chart-1)" }
} satisfies ChartConfig;

const outreachChartConfig = {
  openRate: { label: "Taux d’ouverture", color: "var(--chart-1)" },
  replyRate: { label: "Taux de réponse", color: "var(--chart-3)" },
  replies: { label: "Réponses", color: "var(--chart-2)" },
  rate: { label: "Taux", color: "var(--chart-4)" }
} satisfies ChartConfig;

const brandChartConfig = {
  score: { label: "Compatibilité", color: "var(--chart-1)" }
} satisfies ChartConfig;

const agentChartConfig = {
  DataScout: { label: "DataScout", color: "var(--chart-1)" },
  EnrichBot: { label: "EnrichBot", color: "var(--chart-2)" },
  ScoreMaster: { label: "ScoreMaster", color: "var(--chart-3)" },
  OutreachPilot: { label: "OutreachPilot", color: "var(--chart-4)" },
  BrandMatcher: { label: "BrandMatcher", color: "var(--chart-5)" }
} satisfies ChartConfig;

function ReportHeader({
  title,
  description,
  value,
  onChange
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
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
    </div>
  );
}

export function ReportsDashboard() {
  const [globalRange, setGlobalRange] = React.useState<(typeof reportRanges)[number]>("30 jours");
  const [ranges, setRanges] = React.useState<Record<string, string>>({
    pipeline: "30 jours",
    enrichment: "30 jours",
    scoring: "30 jours",
    outreach: "30 jours",
    brand: "30 jours",
    agent: "30 jours"
  });

  const setRange = (key: string, value: string) => {
    setRanges((current) => ({ ...current, [key]: value }));
  };

  const enrichPercent = Math.round(
    (enrichmentProgress.enrichedSalons / enrichmentProgress.totalSalons) * 100
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Analytics management pour La Loge CRM</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Rapports</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Six rapports prêts à l’emploi pour piloter le pipeline, l’enrichissement, le scoring,
            l’outreach, le matching marques et la performance agentique.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={globalRange} onValueChange={(value) => setGlobalRange(value as (typeof reportRanges)[number])}>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Pipeline Overview"
              description="Funnel de conversion par étape et temps moyen par transition."
              value={ranges.pipeline}
              onChange={(value) => setRange("pipeline", value)}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Conversion globale</p>
                <p className="mt-1 text-2xl font-semibold">{pipelineOverview.kpis.conversionGlobal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cycle moyen</p>
                <p className="mt-1 text-2xl font-semibold">{pipelineOverview.kpis.cycleMoyen}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comparaison</p>
                <p className="mt-1 text-sm font-medium">{pipelineOverview.kpis.variation}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[220px] w-full" config={pipelineChartConfig}>
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Funnel data={pipelineOverview.funnel} dataKey="value" nameKey="stage" isAnimationActive />
              </FunnelChart>
            </ChartContainer>
            <div className="rounded-2xl border p-4">
              <p className="mb-3 text-sm font-medium">Temps moyen par étape</p>
              <ChartContainer className="h-[180px] w-full" config={pipelineChartConfig}>
                <BarChart data={pipelineOverview.stageTimes} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="stage" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="days" fill="var(--color-days)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Enrichment Progress"
              description="Suivi du volume enrichi, du rythme quotidien et de la qualité de données."
              value={ranges.enrichment}
              onChange={(value) => setRange("enrichment", value)}
            />
            <div className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progression globale</span>
                <span className="font-medium">
                  {enrichmentProgress.enrichedSalons} / {enrichmentProgress.totalSalons}
                </span>
              </div>
              <Progress value={enrichPercent} className="h-2" />
              <p className="text-sm text-muted-foreground">{enrichPercent}% des salons ont été enrichis.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[220px] w-full" config={enrichmentChartConfig}>
              <BarChart data={enrichmentProgress.daily} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="enriched" fill="var(--color-enriched)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="grid gap-3 sm:grid-cols-2">
              {enrichmentProgress.quality.map((item) => (
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

        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Scoring Distribution"
              description="Histogramme des scores, évolution moyenne et salons les plus prometteurs."
              value={ranges.scoring}
              onChange={(value) => setRange("scoring", value)}
            />
            <div className="flex flex-wrap gap-2">
              {scoringDistribution.topSalons.map((item) => (
                <Badge key={item.salon} variant="outline">
                  {item.salon} · {item.score}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[220px] w-full" config={scoringChartConfig}>
              <BarChart data={scoringDistribution.histogram} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="rounded-2xl border p-4">
              <p className="mb-3 text-sm font-medium">Évolution du score moyen</p>
              <ChartContainer className="h-[180px] w-full" config={scoringChartConfig}>
                <LineChart data={scoringDistribution.averageTrend} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="period" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="score" type="monotone" stroke="var(--color-score)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Outreach Performance"
              description="Sent → opened → replied, séquences fortes et meilleurs templates."
              value={ranges.outreach}
              onChange={(value) => setRange("outreach", value)}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {outreachPerformance.bestTemplates.map((item) => (
                <div key={item.template} className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Template</p>
                  <p className="mt-1 font-medium">{item.template}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.replies}</p>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[220px] w-full" config={outreachChartConfig}>
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Funnel data={outreachPerformance.funnel} dataKey="value" nameKey="stage" isAnimationActive />
              </FunnelChart>
            </ChartContainer>
            <div className="rounded-2xl border p-4">
              <p className="mb-3 text-sm font-medium">Taux par séquence</p>
              <ChartContainer className="h-[190px] w-full" config={outreachChartConfig}>
                <BarChart data={outreachPerformance.sequenceRates} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="openRate" fill="var(--color-openRate)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="replyRate" fill="var(--color-replyRate)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Brand Matching"
              description="Compatibilité moyenne par marque et état des propositions."
              value={ranges.brand}
              onChange={(value) => setRange("brand", value)}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Propositions envoyées</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.sent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acceptées</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.accepted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Montant moyen enchère</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.averageBid}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[240px] w-full" config={brandChartConfig}>
              <BarChart data={brandMatching.brands} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="brand" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-score)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.pending}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Enchères ouvertes</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.auctionOpen}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm text-muted-foreground">Enchères clôturées</p>
                <p className="mt-1 text-2xl font-semibold">{brandMatching.proposals.auctionClosed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <ReportHeader
              title="Agent Performance"
              description="Actions par agent / jour, taux d’approbation et erreurs."
              value={ranges.agent}
              onChange={(value) => setRange("agent", value)}
            />
            <div className="flex flex-wrap gap-2">
              {agentPerformance.approvals.map((entry) => (
                <Badge key={entry.agent} variant="outline">
                  {entry.agent} · {entry.approvalRate}% approbation
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartContainer className="h-[240px] w-full" config={agentChartConfig}>
              <BarChart data={agentPerformance.stacked} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="DataScout" stackId="agents" fill="var(--color-DataScout)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="EnrichBot" stackId="agents" fill="var(--color-EnrichBot)" />
                <Bar dataKey="ScoreMaster" stackId="agents" fill="var(--color-ScoreMaster)" />
                <Bar dataKey="OutreachPilot" stackId="agents" fill="var(--color-OutreachPilot)" />
                <Bar dataKey="BrandMatcher" stackId="agents" fill="var(--color-BrandMatcher)" />
              </BarChart>
            </ChartContainer>
            <div className="rounded-2xl border p-4">
              <p className="mb-3 text-sm font-medium">Temps moyen de traitement</p>
              <ChartContainer className="h-[180px] w-full" config={agentChartConfig}>
                <AreaChart data={agentPerformance.approvals} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="agent" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area dataKey="avgProcessingHours" fill="var(--color-DataScout)" stroke="var(--color-DataScout)" />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
