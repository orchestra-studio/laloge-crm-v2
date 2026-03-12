"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, FilePlus2Icon, SearchIcon } from "lucide-react";

import { clientDossiers } from "./mock-dossiers";
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

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium"
});

function getStatusVariant(status: string) {
  switch (status) {
    case "ready":
      return "info" as const;
    case "sent":
      return "success" as const;
    default:
      return "secondary" as const;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "ready":
      return "Prêt";
    case "sent":
      return "Envoyé";
    default:
      return status;
  }
}

export function DossiersPageClient() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [brandFilter, setBrandFilter] = React.useState("all");

  const brands = React.useMemo(
    () => Array.from(new Set(clientDossiers.flatMap((dossier) => dossier.brands))).sort(),
    []
  );

  const filteredDossiers = React.useMemo(() => {
    return clientDossiers.filter((dossier) => {
      const matchesSearch =
        search.length === 0 ||
        [dossier.title, dossier.salon, dossier.city, dossier.summary]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || dossier.status === statusFilter;
      const matchesBrand = brandFilter === "all" || dossier.brands.includes(brandFilter);
      return matchesSearch && matchesStatus && matchesBrand;
    });
  }, [brandFilter, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Dossiers de présentation salon pour les marques</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Dossiers clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Une bibliothèque claire de dossiers prêts à partager, enrichis par brand compatibility,
            KPI et storytelling salon.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <DownloadIcon />
            Exporter la liste
          </Button>
          <Button>
            <FilePlus2Icon />
            Nouveau dossier
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un salon, un titre, une ville..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="ready">Prêt</SelectItem>
                <SelectItem value="sent">Envoyé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes marques</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredDossiers.map((dossier) => (
          <Card key={dossier.id} className="overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Badge variant={getStatusVariant(dossier.status)}>{getStatusLabel(dossier.status)}</Badge>
                <span className="text-xs text-muted-foreground">
                  Mis à jour le {dateFormatter.format(new Date(dossier.updatedAt))}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">{dossier.title}</CardTitle>
                <CardDescription className="mt-1">
                  {dossier.salon} • {dossier.city}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {dossier.brands.map((brand) => (
                  <Badge key={brand} variant="outline">
                    {brand}
                  </Badge>
                ))}
              </div>
              <p className="line-clamp-3 text-sm text-muted-foreground">{dossier.summary}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Highlights</p>
                  <p className="mt-1 text-lg font-semibold">{dossier.highlights.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sections</p>
                  <p className="mt-1 text-lg font-semibold">{dossier.sections.length}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Owner</p>
                  <p className="mt-1 text-lg font-semibold">{dossier.owner}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link prefetch={false} href={`/dashboard/dossiers/${dossier.id}`}>Ouvrir le dossier</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link prefetch={false} href={dossier.pdfUrl}>PDF</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
