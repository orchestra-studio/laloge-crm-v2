"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  CalendarClock,
  ExternalLink,
  FileText,
  Mail,
  MapPinned,
  MessageSquareText,
  NotebookPen,
  Phone,
  RefreshCcw,
  Sparkles,
  Trophy,
  UserRound,
  WandSparkles
} from "lucide-react";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from "@/components/ui/timeline";
import { SalonDetailHeader } from "@/components/salon/salon-detail-header";
import { ScoreBar } from "@/components/salon/score-bar";
import { StarsRating } from "@/components/salon/stars-rating";
import { StatusBadge } from "@/components/salon/status-badge";
import {
  enrichmentConfig,
  formatCompactNumber,
  formatCurrency,
  formatDateTime,
  formatRelativeDate,
  formatShortDate,
  getScoreIndicatorClass
} from "@/lib/salon";

const timelineFilterOptions = ["Tout", "Notes", "Outreach", "Statut", "Enrichissement", "Agent"] as const;

interface SalonDetailViewProps {
  salon: Salon;
}

type TimelineFilter = (typeof timelineFilterOptions)[number];

export function SalonDetailView({ salon }: SalonDetailViewProps) {
  const [timelineFilter, setTimelineFilter] = React.useState<TimelineFilter>("Tout");

  const overviewFacts = [
    ["Adresse", salon.address],
    ["Ville", salon.city],
    ["Code postal", salon.postal_code],
    ["Département", salon.department],
    ["Région", salon.region],
    ["Téléphone", salon.phone ?? "—"],
    ["Email", salon.email ?? "—"],
    ["Site web", salon.website ?? "—"],
    ["SIRET", salon.siret],
    ["NAF", salon.naf_code],
    ["Forme juridique", salon.legal_form],
    ["Propriétaire", salon.owner_name],
    ["Taille équipe", `${salon.team_size} personnes`],
    ["Source", salon.source]
  ] as const;

  const socialFacts = [
    ["Instagram", salon.instagram],
    ["Facebook", salon.facebook],
    ["Planity", salon.planity_url],
    ["Google Maps", salon.google_maps_url]
  ] as const;

  const timelineItems = React.useMemo(() => {
    const merged = [
      ...salon.timeline.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        actor: item.actor,
        created_at: item.created_at,
        kind:
          item.type === "outreach"
            ? "Outreach"
            : item.type === "status"
              ? "Statut"
              : item.type === "enrichment"
                ? "Enrichissement"
                : item.actor.toLowerCase().includes("agent") || item.actor.toLowerCase().includes("bot")
                  ? "Agent"
                  : "Notes",
        icon: item.icon
      })),
      ...salon.outreach.map((item) => ({
        id: item.id,
        title: `Outreach ${item.channel}`,
        description: item.content_preview,
        actor: item.contact_name,
        created_at: item.date,
        kind: "Outreach",
        icon: "send"
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return merged.filter((item) => timelineFilter === "Tout" || item.kind === timelineFilter);
  }, [salon.timeline, salon.outreach, timelineFilter]);

  const auditAverage = Math.round(
    salon.audit.reduce((sum, item) => sum + item.score, 0) / Math.max(salon.audit.length, 1)
  );

  const microStats = [
    {
      label: "Google",
      value: `${salon.google_rating.toFixed(1)} / 5`,
      hint: `${formatCompactNumber(salon.google_reviews_count)} avis`,
      icon: Sparkles
    },
    {
      label: "Équipe",
      value: `${salon.team_size}`,
      hint: "personnes estimées",
      icon: UserRound
    },
    {
      label: "Dossiers",
      value: `${salon.dossiers.length}`,
      hint: "actifs ou envoyés",
      icon: FileText
    },
    {
      label: "Audit",
      value: `${auditAverage}/100`,
      hint: "niveau moyen",
      icon: Trophy
    }
  ];

  return (
    <div className="space-y-5">
      <SalonDetailHeader salon={salon} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {microStats.map((stat) => (
          <Card key={stat.label} className="gap-3 rounded-2xl py-4 shadow-sm">
            <CardContent className="flex items-center justify-between gap-3 px-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.hint}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100">
                <stat.icon className="size-5 text-slate-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="apercu" className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex min-w-max rounded-full bg-white p-1 shadow-sm">
            <TabsTrigger value="apercu" className="rounded-full px-4">Aperçu</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-full px-4">Timeline</TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-full px-4">Contacts</TabsTrigger>
            <TabsTrigger value="scores" className="rounded-full px-4">Scores Marques</TabsTrigger>
            <TabsTrigger value="outreach" className="rounded-full px-4">Outreach</TabsTrigger>
            <TabsTrigger value="dossiers" className="rounded-full px-4">Dossiers</TabsTrigger>
            <TabsTrigger value="encheres" className="rounded-full px-4">Enchères</TabsTrigger>
            <TabsTrigger value="audit" className="rounded-full px-4">Audit</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
            <div className="space-y-4">
              <Card className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 py-5 sm:grid-cols-2">
                  {overviewFacts.map(([label, value]) => (
                    <FactBlock key={label} label={label} value={value} />
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <CardTitle>Réseaux sociaux</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 py-5 sm:grid-cols-2">
                  {socialFacts.map(([label, value]) => (
                    <FactBlock
                      key={label}
                      label={label}
                      value={
                        value ? (
                          <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-800 hover:underline">
                            {label}
                            <ExternalLink className="size-3.5 text-slate-400" />
                          </a>
                        ) : (
                          "—"
                        )
                      }
                    />
                  ))}
                  <FactBlock
                    label="Followers Instagram"
                    value={salon.instagram_followers ? formatCompactNumber(salon.instagram_followers) : "—"}
                  />
                  <FactBlock label="Google Place ID" value={salon.google_place_id} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <CardTitle>Google Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold text-slate-950">{salon.google_rating.toFixed(1)}</p>
                      <p className="text-sm text-slate-500">sur 5</p>
                    </div>
                    <StarsRating rating={salon.google_rating} reviewsCount={salon.google_reviews_count} size="md" />
                  </div>
                  <Button asChild variant="outline" className="w-full rounded-full">
                    <a href={salon.google_maps_url} target="_blank" rel="noreferrer">
                      <MapPinned className="size-4" />
                      Ouvrir sur Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <CardTitle>Enrichissement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Statut</p>
                      <Badge variant="outline" className={`mt-2 rounded-full px-2.5 py-1 ${enrichmentConfig[salon.enrichment_status].badgeClassName}`}>
                        {enrichmentConfig[salon.enrichment_status].label}
                      </Badge>
                    </div>
                    <Button variant="outline" className="rounded-full">
                      <WandSparkles className="size-4" />
                      Relancer
                    </Button>
                  </div>
                  <InfoStrip icon={CalendarClock} label="Dernière mise à jour" value={salon.last_enriched_at ? formatDateTime(salon.last_enriched_at) : "En attente"} />
                </CardContent>
              </Card>

              <Card className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                      <span>Score global</span>
                      <span>{salon.score}/100</span>
                    </div>
                    <ScoreBar score={salon.score} className="w-full" />
                  </div>
                  <div className="space-y-3">
                    {salon.score_breakdown.map((item) => (
                      <div key={item.criterion} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{item.criterion}</p>
                            <p className="mt-1 text-sm text-slate-500">{item.reason}</p>
                          </div>
                          <Badge variant="outline" className="rounded-full bg-white text-slate-600">
                            +{item.points}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full rounded-full">
                    <RefreshCcw className="size-4" />
                    Recalculer le score
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="rounded-[24px] py-0 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 py-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <CardTitle>Timeline / Activité</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Historique consolidé CRM, outreach, pipeline et agents.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {timelineFilterOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTimelineFilter(item)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${timelineFilter === item ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 py-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <NotebookPen className="size-4" />
                  Ajouter une note
                </div>
                <Textarea placeholder="Ex. Bon accueil au téléphone, intéressé par un rendez-vous découverte en avril…" className="min-h-28 rounded-2xl bg-white" />
                <div className="mt-3 flex justify-end">
                  <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Ajouter à la timeline</Button>
                </div>
              </div>

              <Timeline defaultValue={timelineItems.length} className="pl-2">
                {timelineItems.map((item, index) => (
                  <TimelineItem key={item.id} step={timelineItems.length - index}>
                    <TimelineSeparator />
                    <TimelineIndicator className={`border-white ${getScoreIndicatorClass(salon.score)}`} />
                    <TimelineDate>{formatDateTime(item.created_at)}</TimelineDate>
                    <TimelineHeader>
                      <TimelineTitle>{item.title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineContent>
                      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-500">{item.kind}</Badge>
                          <span>·</span>
                          <span>{item.actor}</span>
                          <span>·</span>
                          <span>{formatRelativeDate(item.created_at)}</span>
                        </div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="rounded-[24px] py-0 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Contacts liés au salon</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Décisionnaires et relais opérationnels.</p>
                </div>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">+ Ajouter contact</Button>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Décisionnaire</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.first_name}</TableCell>
                      <TableCell>{contact.last_name}</TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>
                        <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-slate-700 hover:underline">
                          <Phone className="size-4 text-slate-400" />
                          {contact.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 text-slate-700 hover:underline">
                          <Mail className="size-4 text-slate-400" />
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell>{contact.is_decision_maker ? "⭐ Oui" : "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600">
                          {contact.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <Card className="rounded-[24px] py-0 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Scores Marques</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Compatibilité détaillée par marque et critères associés.</p>
                </div>
                <Button variant="outline" className="rounded-full">
                  <RefreshCcw className="size-4" />
                  Recalculer scores
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marque</TableHead>
                    <TableHead>Score compatibilité</TableHead>
                    <TableHead>Détail critères</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.brand_scores.map((brand) => (
                    <React.Fragment key={brand.brand}>
                      <TableRow>
                        <TableCell className="font-medium">{brand.brand}</TableCell>
                        <TableCell>
                          <div className="w-44">
                            <ScoreBar score={brand.compatibility_score} compact className="w-full" />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[380px] whitespace-normal text-sm text-slate-600">
                          {brand.criteria_breakdown.map((criterion) => criterion.criterion).join(" · ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                              {brand.action_label}
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full">
                              Voir dossier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="bg-slate-50/70 py-4">
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {brand.criteria_breakdown.map((criterion) => (
                              <div key={criterion.criterion} className="rounded-2xl border border-slate-200 bg-white p-3">
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-slate-900">{criterion.criterion}</p>
                                  <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600">
                                    +{criterion.points}
                                  </Badge>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-500">{criterion.reason}</p>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outreach" className="space-y-4">
          <Card className="rounded-[24px] py-0 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Historique Outreach</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Emails, appels, SMS et réponses reçues.</p>
                </div>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">+ Nouvel outreach</Button>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Contenu</TableHead>
                    <TableHead>Réponse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.outreach.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatShortDate(item.date)}</TableCell>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell className="capitalize">{item.channel}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[320px] whitespace-normal text-sm text-slate-600">
                        {item.content_preview}
                      </TableCell>
                      <TableCell className="max-w-[280px] whitespace-normal text-sm text-slate-600">
                        {item.response}
                        {item.sequence_name ? (
                          <div className="mt-2 text-xs text-slate-400">Séquence : {item.sequence_name}</div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dossiers" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {salon.dossiers.map((dossier) => (
              <Card key={dossier.id} className="rounded-[24px] py-0 shadow-sm">
                <CardHeader className="border-b border-slate-200/80 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base leading-snug">{dossier.title}</CardTitle>
                      <p className="mt-2 text-sm text-slate-500">Créé le {formatShortDate(dossier.created_at)}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600">
                      {dossier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 py-5">
                  <div className="flex flex-wrap gap-2">
                    {dossier.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="rounded-full bg-white text-slate-600">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full rounded-full">
                    <FileText className="size-4" />
                    Ouvrir le dossier
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Card className="rounded-[24px] border-dashed py-0 shadow-sm">
              <CardContent className="flex h-full min-h-56 flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                  <FileText className="size-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Générer un nouveau dossier</p>
                  <p className="mt-1 text-sm text-slate-500">Pré-remplir les données du salon et sélectionner une marque.</p>
                </div>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Nouveau dossier</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="encheres" className="space-y-4">
          <Card className="rounded-[24px] py-0 shadow-sm">
            <CardHeader className="border-b border-slate-200/80 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Enchères marques</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">Appels d'offres actifs et historique des bids.</p>
                </div>
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">Créer une enchère</Button>
              </div>
            </CardHeader>
            <CardContent className="py-5">
              {salon.auctions.length > 0 ? (
                <div className="space-y-4">
                  {salon.auctions.map((auction) => (
                    <div key={auction.id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{auction.title}</h3>
                            <Badge variant="outline" className="rounded-full bg-white text-slate-600">
                              {auction.status}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">
                            Du {formatShortDate(auction.start_date)} au {formatShortDate(auction.end_date)} · enchère min {formatCurrency(auction.minimum_bid)}
                          </p>
                          {auction.winning_brand ? (
                            <p className="mt-2 text-sm text-slate-600">Marque gagnante : {auction.winning_brand}</p>
                          ) : null}
                        </div>
                        <Button variant="outline" className="rounded-full">
                          Voir le détail
                        </Button>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid gap-3 md:grid-cols-2">
                        {auction.bids.map((bid) => (
                          <div key={`${auction.id}-${bid.brand}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-slate-900">{bid.brand}</p>
                              <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600">
                                {formatCurrency(bid.amount)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Aucune enchère" description="Créez une enchère pour solliciter plusieurs marques sur ce salon." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[24px] py-0 shadow-sm">
              <CardHeader className="border-b border-slate-200/80 py-5">
                <CardTitle>Résultat global audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 py-5">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Score moyen</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">{auditAverage}</p>
                  <p className="mt-2 text-sm text-slate-500">Niveau visuel consolidé du salon</p>
                </div>
                <Button className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800">
                  Lancer un audit
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] py-0 shadow-sm">
              <CardHeader className="border-b border-slate-200/80 py-5">
                <CardTitle>Dimensions analysées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 py-5">
                {salon.audit.map((item) => (
                  <div key={item.dimension} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.dimension}</p>
                        <p className="text-sm text-slate-500">{item.note}</p>
                      </div>
                      <Badge variant="outline" className="rounded-full bg-white text-slate-600">
                        {item.score}/100
                      </Badge>
                    </div>
                    <Progress value={item.score} indicatorColor={getScoreIndicatorClass(item.score)} className="h-2.5 bg-white" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FactBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}

function InfoStrip({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex size-9 items-center justify-center rounded-xl bg-white">
        <Icon className="size-4 text-slate-600" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-xs">
        <Bot className="size-5 text-slate-600" />
      </div>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
