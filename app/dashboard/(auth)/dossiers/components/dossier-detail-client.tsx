"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  FileTextIcon,
  PlusIcon,
  SaveIcon,
  Share2Icon,
  Trash2Icon
} from "lucide-react";

import { getDossierById, type ClientDossier, type DossierSection } from "./mock-dossiers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditorDemo } from "@/components/ui/custom/tiptap/rich-text-editor";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
});

function getStatusVariant(status: ClientDossier["status"]) {
  switch (status) {
    case "ready":
      return "info" as const;
    case "sent":
      return "success" as const;
    default:
      return "secondary" as const;
  }
}

function getStatusLabel(status: ClientDossier["status"]) {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "ready":
      return "Prêt";
    case "sent":
      return "Envoyé";
  }
}

function renderStructuredSection(section: DossierSection) {
  if (section.type === "text") {
    return <RichTextEditorDemo value={section.content} editable={false} className="max-h-[340px]" />;
  }

  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
    </div>
  );
}

export function DossierDetailClient({ id }: { id: string }) {
  const dossier = getDossierById(id);
  const [title, setTitle] = React.useState(dossier?.title ?? "");
  const [status, setStatus] = React.useState<ClientDossier["status"]>(dossier?.status ?? "draft");
  const [sections, setSections] = React.useState<DossierSection[]>(dossier?.sections ?? []);

  if (!dossier) {
    return null;
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      const [removed] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, removed);
      return copy;
    });
  };

  const updateSection = (idToUpdate: string, patch: Partial<DossierSection>) => {
    setSections((current) =>
      current.map((section) => (section.id === idToUpdate ? { ...section, ...patch } : section))
    );
  };

  const addSection = () => {
    setSections((current) => [
      ...current,
      {
        id: `section-${Date.now()}`,
        title: "Nouvelle section",
        type: "text",
        content: "<p>Ajoutez ici le contenu éditorial du dossier.</p>"
      }
    ]);
  };

  const removeSection = (idToRemove: string) => {
    setSections((current) => current.filter((section) => section.id !== idToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link prefetch={false} href="/dashboard/dossiers">
              <ArrowLeftIcon />
              Retour aux dossiers
            </Link>
          </Button>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
            <Badge variant="outline">{dossier.salon}</Badge>
            {dossier.brands.map((brand) => (
              <Badge key={brand} variant="outline">
                {brand}
              </Badge>
            ))}
          </div>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-3 h-auto border-none px-0 text-3xl font-semibold shadow-none focus-visible:ring-0"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {dossier.city} • créé le {dateFormatter.format(new Date(dossier.createdAt))} • owner {dossier.owner}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={status} onValueChange={(value) => setStatus(value as ClientDossier["status"])}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="ready">Prêt</SelectItem>
              <SelectItem value="sent">Envoyé</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Share2Icon />
            Partager avec marque
          </Button>
          <Button variant="outline" asChild>
            <Link prefetch={false} href={dossier.pdfUrl}>
              <FileTextIcon />
              Générer PDF
            </Link>
          </Button>
          <Button>
            <SaveIcon />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Sections du dossier</CardTitle>
                <CardDescription>
                  Sections réordonnables, éditables inline, prêtes pour export PDF.
                </CardDescription>
              </div>
              <Button size="sm" onClick={addSection}>
                <PlusIcon />
                Ajouter une section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id} className="rounded-2xl border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">Section {index + 1}</Badge>
                        <Badge variant="secondary">{section.type}</Badge>
                      </div>
                      <Input
                        value={section.title}
                        onChange={(event) =>
                          updateSection(section.id, {
                            title: event.target.value
                          })
                        }
                      />
                      <Select
                        value={section.type}
                        onValueChange={(value) =>
                          updateSection(section.id, {
                            type: value as DossierSection["type"]
                          })
                        }
                      >
                        <SelectTrigger className="max-w-[220px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texte</SelectItem>
                          <SelectItem value="stats">Stats</SelectItem>
                          <SelectItem value="photos">Photos</SelectItem>
                        </SelectContent>
                      </Select>
                      {section.type === "text" ? (
                        <RichTextEditorDemo
                          value={section.content}
                          onChange={(value) => updateSection(section.id, { content: String(value) })}
                          className="max-h-[380px]"
                        />
                      ) : (
                        <Textarea
                          value={section.content}
                          onChange={(event) =>
                            updateSection(section.id, {
                              content: event.target.value
                            })
                          }
                          className="min-h-32"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveSection(index, 1)}
                        disabled={index === sections.length - 1}
                      >
                        <ArrowDownIcon />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => removeSection(section.id)}>
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prévisualisation des sections</CardTitle>
              <CardDescription>Rendu rapide du contenu avant export PDF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section) => (
                <div key={`${section.id}-preview`} className="rounded-2xl border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="outline">{section.type}</Badge>
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  {renderStructuredSection(section)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compatibilité marque</CardTitle>
              <CardDescription>Lecture visuelle des scores et rationales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dossier.brandCompatibility.map((entry) => (
                <div key={entry.brand} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{entry.brand}</p>
                      <p className="text-sm text-muted-foreground">{entry.rationale}</p>
                    </div>
                    <Badge variant={entry.score >= 85 ? "success" : "info"}>{entry.score}/100</Badge>
                  </div>
                  <Progress value={entry.score} className="mt-4 h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats clés</CardTitle>
              <CardDescription>Indicateurs déjà injectés dans le dossier.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              {dossier.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.trend}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Galerie utilisée pour l’export PDF.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {dossier.photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-2xl border bg-muted/30">
                  <img src={photo.url} alt={photo.alt} className="h-36 w-full object-cover" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dossier.highlights.map((highlight) => (
                <div key={highlight} className="rounded-xl border px-3 py-2 text-sm">
                  {highlight}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propositions liées</CardTitle>
              <CardDescription>Suivi des transmissions marque autour du dossier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dossier.proposals.map((proposal) => (
                <div key={proposal.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{proposal.brand}</p>
                      <p className="text-sm text-muted-foreground">{proposal.contact}</p>
                    </div>
                    <Badge variant="outline">{proposal.status}</Badge>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="text-sm text-muted-foreground">
                Partagé avec : {dossier.sharedWithBrands.length > 0 ? dossier.sharedWithBrands.join(", ") : "aucune marque pour le moment"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
