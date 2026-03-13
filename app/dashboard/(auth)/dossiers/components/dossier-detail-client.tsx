import Link from "next/link";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  CalendarClockIcon,
  DownloadIcon,
  GlobeIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
  TriangleAlertIcon,
  Users2Icon
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { DossierScoreBreakdown } from "./dossier-score-breakdown";
import { DossierStatusBadge } from "./dossier-status-badge";
import { DossierTimeline } from "./dossier-timeline";
import type { DossierDetail as ClientDossierRecord, DossierContent } from "@/lib/supabase/queries/dossiers";

type DossierActionPriority = "haute" | "moyenne" | "faible";
type DossierRecommendedAction = DossierContent["recommended_actions"][number];
type DossierRecommendedTerm = DossierContent["recommended_terms"][number];

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris"
});

function formatDate(value: string | null) {
  if (!value) {
    return "En attente de génération";
  }

  return dateFormatter.format(new Date(value));
}

function formatPipelineStatus(status: string) {
  switch (status) {
    case "nouveau":
      return "Nouveau";
    case "contacte":
      return "Contacté";
    case "interesse":
      return "Intéressé";
    case "rdv_planifie":
      return "RDV planifié";
    case "negociation":
      return "Négociation";
    case "gagne":
      return "Gagné";
    case "perdu":
      return "Perdu";
    case "client_actif":
      return "Client actif";
    default:
      return status;
  }
}

function getPriorityBadge(priority: DossierActionPriority) {
  switch (priority) {
    case "haute":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "moyenne":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "faible":
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function RecommendedTermCard({ term }: { term: DossierRecommendedTerm }) {
  return (
    <div className="rounded-2xl border border-[#C5A572]/12 bg-[#FCFAF6] p-4 shadow-sm">
      <p className="text-sm font-semibold">{term.title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{term.detail}</p>
    </div>
  );
}

function RecommendedActionCard({ action }: { action: DossierRecommendedAction }) {
  return (
    <div className="rounded-2xl border border-[#C5A572]/12 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{action.title}</p>
          <p className="text-sm leading-6 text-muted-foreground">{action.detail}</p>
        </div>
        <Badge variant="outline" className={getPriorityBadge(action.priority)}>
          Priorité {action.priority}
        </Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span>{action.owner}</span>
        <span>{action.due_label}</span>
      </div>
    </div>
  );
}

export function DossierDetailClient({ dossier }: { dossier: ClientDossierRecord }) {
  const content = dossier.content;

  if (!content) {
    return null;
  }

  return (
    <div className="space-y-6 pb-8">
      <Button variant="ghost" size="sm" asChild className="-ml-3 w-fit">
        <Link prefetch={false} href="/dashboard/dossiers">
          <ArrowLeftIcon className="size-4" />
          Retour aux dossiers
        </Link>
      </Button>

      <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
              <SparklesIcon className="size-3.5" />
              Dossier client • {dossier.brand_name}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DossierStatusBadge status={dossier.status} />
              <Badge variant="outline" className="rounded-full border-[#C5A572]/20 bg-white text-[#8C6B2D]">
                {dossier.brand_name}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {formatPipelineStatus(dossier.salon_info.salon_status)}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">{dossier.salon_name}</h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">{content.executive_summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPinIcon className="size-4" />
                {dossier.salon_city} • {dossier.salon_info.address}
              </span>
              <a
                href={dossier.salon_info.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground">
                <GlobeIcon className="size-4" />
                {dossier.salon_info.website.replace(/^https?:\/\//, "")}
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {dossier.salon_info.specialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant="outline"
                  className="rounded-full border-[#C5A572]/20 bg-[#FBF7F1] text-[#8C6B2D]">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-[#C5A572]/15 bg-white/90 p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-2xl border border-[#C5A572]/12 bg-[#FCFAF6] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8C6B2D]">Compatibilité</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{dossier.compatibility_score}%</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Équipe</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{dossier.salon_info.team_size}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Note Google</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {dossier.salon_info.google_rating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">
                <DownloadIcon className="size-4" />
                Exporter PDF
              </Button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Créé le</span>
                <span className="font-medium">{formatDate(dossier.created_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Généré le</span>
                <span className="font-medium">{formatDate(dossier.generated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-[#C5A572]/12 bg-white shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Analyse du match marque</CardTitle>
              <CardDescription>
                Pourquoi ce salon mérite l'attention de {dossier.brand_name} et dans quelles conditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-6 py-6">
              <div className="rounded-2xl border border-[#C5A572]/15 bg-[#FCFAF6] p-5">
                <p className="text-sm leading-7 text-foreground">{content.brand_rationale}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <BadgeCheckIcon className="size-4" />
                    <p className="text-sm font-semibold">Points forts</p>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-950/90">
                    {content.strengths.map((strength) => (
                      <li key={strength} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                  <div className="flex items-center gap-2 text-amber-900">
                    <TriangleAlertIcon className="size-4" />
                    <p className="text-sm font-semibold">Points de vigilance</p>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-950/90">
                    {content.watchpoints.map((watchpoint) => (
                      <li key={watchpoint} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>{watchpoint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <DossierScoreBreakdown
            score={dossier.compatibility_score}
            breakdown={content.score_breakdown}
          />

          <Card className="border-[#C5A572]/12 bg-white shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Conditions recommandées</CardTitle>
              <CardDescription>
                Structure de partenariat suggérée pour sécuriser le lancement et l'adhésion terrain.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 py-6 lg:grid-cols-3">
              {content.recommended_terms.map((term) => (
                <RecommendedTermCard key={term.title} term={term} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#C5A572]/12 bg-white shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Fiche salon</CardTitle>
              <CardDescription>Données opérationnelles injectées dans le dossier client.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <Users2Icon className="size-4 text-[#8C6B2D]" />
                    Équipe
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{dossier.salon_info.team_size}</p>
                  <p className="mt-1 text-sm text-muted-foreground">collaborateurs actifs</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <StarIcon className="size-4 text-[#8C6B2D]" />
                    Avis Google
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{dossier.salon_info.review_count}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    note moyenne {dossier.salon_info.google_rating.toFixed(1)} / 5
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white p-4">
                <p className="text-sm font-semibold">Contact principal</p>
                <p className="mt-2 text-sm text-muted-foreground">{dossier.salon_info.owner_name}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarClockIcon className="size-4 text-[#8C6B2D]" />
                  Statut pipeline
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatPipelineStatus(dossier.salon_info.salon_status)} • suivi commercial La Loge
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C5A572]/12 bg-white shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-base">Actions recommandées</CardTitle>
              <CardDescription>Prochaines étapes proposées pour faire avancer le dossier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 py-6">
              {content.recommended_actions.map((action) => (
                <RecommendedActionCard key={action.id} action={action} />
              ))}
            </CardContent>
          </Card>

          <DossierTimeline events={content.timeline} />
        </div>
      </div>
    </div>
  );
}
