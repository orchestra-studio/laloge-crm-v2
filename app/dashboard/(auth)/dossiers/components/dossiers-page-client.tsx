"use client";

import * as React from "react";
import { SearchIcon, SparklesIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { DossierStatsGrid } from "./dossier-stats-grid";
import { DossiersGenerateDialog } from "./dossiers-generate-dialog";
import { DossiersTable } from "./dossiers-table";
import { clientDossiers, type DossierStatus } from "./mock-dossiers";

export function DossiersPageClient() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | DossierStatus>("all");

  const filteredDossiers = React.useMemo(() => {
    return [...clientDossiers]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .filter((dossier) => {
        const matchesSearch =
          search.length === 0 ||
          [dossier.salon_name, dossier.salon_city, dossier.brand_name]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || dossier.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
              <SparklesIcon className="size-3.5" />
              Dossiers salons × marques
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Dossiers Clients</h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Centralisez les dossiers générés pour chaque salon, suivez leur état de préparation et
                partagez rapidement les meilleures opportunités avec les marques partenaires.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <DossiersGenerateDialog dossiers={clientDossiers} />
          </div>
        </div>
      </div>

      <DossierStatsGrid dossiers={clientDossiers} />

      <div className="rounded-3xl border border-[#C5A572]/12 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un salon, une ville ou une marque..."
              className="pl-9"
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="en_preparation">En préparation</SelectItem>
                <SelectItem value="finalise">Finalisé</SelectItem>
                <SelectItem value="envoye">Envoyé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DossiersTable dossiers={filteredDossiers} />
    </div>
  );
}
