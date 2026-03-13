import Link from "next/link";
import { DownloadIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { DossierStatusBadge } from "./dossier-status-badge";
import type { DossierStatus } from "@/lib/supabase/queries/dossiers";

type ClientDossierRecord = {
  id: string;
  salon_id: string;
  brand_id: string;
  status: DossierStatus;
  compatibility_score: number;
  created_at: string;
  salon_name: string;
  salon_city: string;
  brand_name: string;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Paris"
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function CompatibilityCell({ score }: { score: number }) {
  return (
    <div className="min-w-36 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{score}%</span>
        <span className="text-xs text-muted-foreground">Compatibilité</span>
      </div>
      <Progress value={score} className="h-2 bg-[#EDE3D2]" indicatorColor="bg-[#C5A572]" />
    </div>
  );
}

export function DossiersTable({ dossiers }: { dossiers: ClientDossierRecord[] }) {
  if (dossiers.length === 0) {
    return (
      <Card className="border-dashed border-[#C5A572]/20 bg-white/90 shadow-sm">
        <CardContent className="flex min-h-52 flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
            Aucun résultat
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold">Aucun dossier ne correspond aux filtres.</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Ajustez la recherche ou le filtre de statut pour retrouver les dossiers disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {dossiers.map((dossier) => (
          <Card key={dossier.id} className="border-[#C5A572]/12 bg-white shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold tracking-tight">{dossier.salon_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {dossier.salon_city} • {dossier.brand_name}
                  </p>
                </div>
                <DossierStatusBadge status={dossier.status} />
              </div>

              <CompatibilityCell score={dossier.compatibility_score} />

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Créé le</span>
                <span className="font-medium">{formatDate(dossier.created_at)}</span>
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1 bg-[#1F1A16] text-white hover:bg-[#2A241E]">
                  <Link prefetch={false} href={`/dashboard/dossiers/${dossier.id}`}>
                    <EyeIcon className="size-4" />
                    Voir
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#C5A572]/20 hover:bg-[#FBF7F1]">
                  <DownloadIcon className="size-4" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden border-[#C5A572]/12 bg-white shadow-sm md:block">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-base">Bibliothèque dossiers</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Salon</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Score de compatibilité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.map((dossier) => (
                <TableRow key={dossier.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 whitespace-normal">
                    <div className="space-y-1">
                      <Link
                        prefetch={false}
                        href={`/dashboard/dossiers/${dossier.id}`}
                        className="font-medium transition-colors hover:text-[#8C6B2D]">
                        {dossier.salon_name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{dossier.salon_city}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border border-[#C5A572]/20 bg-[#FBF7F1] px-2.5 py-1 text-xs font-medium text-[#8C6B2D]">
                      {dossier.brand_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CompatibilityCell score={dossier.compatibility_score} />
                  </TableCell>
                  <TableCell>
                    <DossierStatusBadge status={dossier.status} />
                  </TableCell>
                  <TableCell>{formatDate(dossier.created_at)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">
                        <Link prefetch={false} href={`/dashboard/dossiers/${dossier.id}`}>
                          <EyeIcon className="size-4" />
                          Voir
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#C5A572]/20 hover:bg-[#FBF7F1]">
                        <DownloadIcon className="size-4" />
                        Télécharger
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
