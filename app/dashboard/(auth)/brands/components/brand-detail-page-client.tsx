"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis
} from "recharts";
import {
  BadgeCheckIcon,
  BracesIcon,
  ExternalLinkIcon,
  GavelIcon,
  GlobeIcon,
  MailIcon,
  PencilLineIcon,
  PhoneIcon,
  Trash2Icon,
  TrendingUpIcon,
  Users2Icon
} from "lucide-react";

import { BrandLogo } from "./brand-logo";
import {
  BrandActiveBadge,
  BrandCategoryBadge,
  ProposalStatusBadge
} from "./brand-badges";
import { BrandNetworkTable } from "./brand-network-table";
import type { Brand } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface BrandDetailPageClientProps {
  brand: Brand;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function OverviewStat({
  title,
  value,
  description,
  icon: Icon
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-[#C5A572]/12 shadow-sm">
      <CardContent className="flex items-start justify-between px-6 py-5">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <div className="rounded-2xl border border-[#C5A572]/15 bg-[#FBF7F1] p-3 text-[#8C6B2D]">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandDetailPageClient({ brand }: BrandDetailPageClientProps) {
  const [isActive, setIsActive] = React.useState(brand.is_active);
  const [metadataJson, setMetadataJson] = React.useState(
    JSON.stringify(brand.metadata.criteria, null, 2)
  );
  const salonIdByName = React.useMemo(
    () => new Map(brand.salons.map((salon) => [salon.name, salon.id])),
    [brand.salons]
  );

  const compatibilityChartConfig = {
    count: {
      label: "Salons",
      color: "#C5A572"
    }
  } satisfies ChartConfig;

  const proposalChartConfig = {
    proposed: {
      label: "Proposées",
      color: "#E7DBC5"
    },
    accepted: {
      label: "Acceptées",
      color: "#A98545"
    }
  } satisfies ChartConfig;

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <BrandLogo name={brand.name} logoUrl={brand.logo_url} size="lg" className="size-16" />
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{brand.name}</h1>
                <BrandCategoryBadge category={brand.category} />
                <BrandActiveBadge isActive={isActive} />
              </div>
              <p className="text-muted-foreground max-w-3xl text-sm leading-6">
                {brand.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <GlobeIcon className="size-4" />
                  {brand.website.replace(/^https?:\/\//, "")}
                  <ExternalLinkIcon className="size-3.5" />
                </a>
                <a
                  href={`mailto:${brand.contact_email}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <MailIcon className="size-4" />
                  {brand.contact_email}
                </a>
                <a
                  href={`tel:${brand.contact_phone}`}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <PhoneIcon className="size-4" />
                  {brand.contact_phone}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Statut de la marque</p>
                <p className="text-muted-foreground text-xs">Mode local • sans persistance</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Activer la marque" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <PencilLineIcon className="size-4" />
                Éditer
              </Button>
              <Button variant="destructive">
                <Trash2Icon className="size-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewStat
          title="Salons compatibles"
          value={brand.compatible_salon_count.toLocaleString("fr-FR")}
          description="Seuil &gt; 50 validé"
          icon={Users2Icon}
        />
        <OverviewStat
          title="Compatibilité moyenne"
          value={`${brand.average_compatibility}/100`}
          description="Sur le portefeuille qualifié"
          icon={TrendingUpIcon}
        />
        <OverviewStat
          title="Propositions"
          value={`${brand.total_proposals}`}
          description="Toutes étapes confondues"
          icon={BadgeCheckIcon}
        />
        <OverviewStat
          title="Taux d'acceptation"
          value={`${brand.acceptance_rate}%`}
          description="Mesure d'efficacité commerciale"
          icon={GavelIcon}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto border-b bg-transparent px-0 py-0">
          <TabsTrigger value="overview" className="px-4 py-3 data-[state=active]:text-[#8C6B2D]">
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="network" className="px-4 py-3 data-[state=active]:text-[#8C6B2D]">
            Réseau Salons
          </TabsTrigger>
          <TabsTrigger value="proposals" className="px-4 py-3 data-[state=active]:text-[#8C6B2D]">
            Propositions
          </TabsTrigger>
          <TabsTrigger value="auctions" className="px-4 py-3 data-[state=active]:text-[#8C6B2D]">
            Enchères
          </TabsTrigger>
          <TabsTrigger value="stats" className="px-4 py-3 data-[state=active]:text-[#8C6B2D]">
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base">Informations marque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Description
                    </div>
                    <p className="mt-2 text-sm leading-6">{brand.description}</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Contact principal
                    </div>
                    <div className="mt-2 space-y-2 text-sm">
                      <p className="font-medium">{brand.contact_name}</p>
                      <a href={`mailto:${brand.contact_email}`} className="block hover:text-foreground">
                        {brand.contact_email}
                      </a>
                      <a href={`tel:${brand.contact_phone}`} className="block hover:text-foreground">
                        {brand.contact_phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <BracesIcon className="size-4 text-[#8C6B2D]" />
                    Éditeur JSON metadata
                  </div>
                  <Textarea
                    value={metadataJson}
                    onChange={(event) => setMetadataJson(event.target.value)}
                    className="min-h-52 font-mono text-xs leading-6"
                  />
                  <p className="text-muted-foreground mt-2 text-xs">
                    Édition locale uniquement pour la démo front. Aucun enregistrement backend.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base">Critères de matching</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Critère</TableHead>
                      <TableHead>Opérateur</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead className="pr-6 text-right">Poids</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brand.metadata.criteria_table.map((criterion) => (
                      <TableRow key={criterion.criterion}>
                        <TableCell className="pl-6 font-medium">{criterion.criterion}</TableCell>
                        <TableCell>{criterion.operator}</TableCell>
                        <TableCell>{String(criterion.value)}</TableCell>
                        <TableCell className="pr-6 text-right">{criterion.weight}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end px-6 pb-6 pt-4">
                  <Button variant="outline">Recalculer tous les scores</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network">
          <BrandNetworkTable salons={brand.salons} />
        </TabsContent>

        <TabsContent value="proposals">
          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">Historique des propositions</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Salon</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Proposé par</TableHead>
                    <TableHead className="pr-6">Réponse marque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brand.proposals.map((proposal) => (
                    <TableRow key={proposal.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 font-medium">{proposal.salon_name}</TableCell>
                      <TableCell>
                        <ProposalStatusBadge status={proposal.status} />
                      </TableCell>
                      <TableCell>{formatDate(proposal.proposed_at)}</TableCell>
                      <TableCell>{proposal.proposed_by}</TableCell>
                      <TableCell className="pr-6 text-muted-foreground max-w-[420px] text-sm leading-6">
                        {proposal.brand_response}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auctions">
          <Card className="border-[#C5A572]/12 shadow-sm">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base">Participation aux enchères</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Dernière enchère</TableHead>
                    <TableHead className="pr-6">Résultat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brand.auctions.map((auction) => (
                    <TableRow key={auction.id} className="hover:bg-muted/20">
                      <TableCell className="pl-6 font-medium">{auction.title}</TableCell>
                      <TableCell>{auction.status}</TableCell>
                      <TableCell>
                        {formatDate(auction.start_date)} → {formatDate(auction.end_date)}
                      </TableCell>
                      <TableCell>{auction.last_bid}</TableCell>
                      <TableCell className="pr-6 text-muted-foreground">{auction.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Distribution des compatibilités</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={compatibilityChartConfig} className="h-[280px] w-full">
                  <BarChart accessibilityLayer data={brand.stats.compatibility_distribution} margin={{ left: 0, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="bucket" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="var(--color-count)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Succès des propositions</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={proposalChartConfig} className="h-[280px] w-full">
                  <LineChart accessibilityLayer data={brand.stats.proposal_success} margin={{ left: 0, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} cursor={false} />
                    <Line
                      dataKey="proposed"
                      type="monotone"
                      stroke="var(--color-proposed)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      dataKey="accepted"
                      type="monotone"
                      stroke="var(--color-accepted)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base">Seuils de compatibilité</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">Score &gt; 50</div>
                  <div className="mt-3 text-2xl font-semibold">{brand.stats.thresholds.gt50}</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">Score &gt; 70</div>
                  <div className="mt-3 text-2xl font-semibold">{brand.stats.thresholds.gt70}</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                  <div className="text-muted-foreground text-xs uppercase tracking-wide">Score &gt; 90</div>
                  <div className="mt-3 text-2xl font-semibold">{brand.stats.thresholds.gt90}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C5A572]/12 shadow-sm">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base">Top salons compatibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {brand.stats.top_salons.map((salon, index) => {
                  const salonId = salonIdByName.get(salon.name);

                  return (
                    <div
                      key={salon.name}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-white p-4">
                      <div>
                        <div className="text-sm font-medium">
                          {index + 1}. {salon.name}
                        </div>
                        <div className="text-muted-foreground text-xs">{salon.city}</div>
                      </div>
                      {salonId ? (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-auto px-0 text-[#8C6B2D] hover:bg-transparent">
                          <Link prefetch={false} href={`/dashboard/salons/${salonId}`}>{salon.compatibility_score}/100</Link>
                        </Button>
                      ) : (
                        <span className="text-sm font-medium text-[#8C6B2D]">
                          {salon.compatibility_score}/100
                        </span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
