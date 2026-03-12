"use client";

import * as React from "react";
import { ChevronRight, Search } from "lucide-react";
import { generateAvatarFallback } from "@/lib/utils";
import {
  dashboardLeadRows,
  enrichmentStatusMeta,
  formatRelativeDate,
  getProfileName,
  salonStatusMeta
} from "@/app/dashboard/(auth)/crm/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

function getScoreIndicatorColor(score: number | null) {
  if (!score) {
    return "bg-slate-300";
  }

  if (score >= 80) {
    return "bg-emerald-500";
  }

  if (score >= 60) {
    return "bg-amber-400";
  }

  return "bg-rose-400";
}

export function LeadsCard() {
  const [query, setQuery] = React.useState("");

  const filteredSalons = React.useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return dashboardLeadRows;
    }

    return dashboardLeadRows.filter((salon) => {
      return [salon.name, salon.city, getProfileName(salon.assigned_to)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query]);

  return (
    <Card className="shadow-xs">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Salons prioritaires</CardTitle>
            <CardDescription>
              Les profils à plus fort potentiel à traiter aujourd’hui.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm">
            Voir tous les salons
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un salon, une ville ou un assigné"
              className="pl-9"
            />
          </div>
          <Badge variant="outline">{filteredSalons.length} salons visibles</Badge>
        </div>

        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salon</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Enrichissement</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalons.length ? (
                filteredSalons.map((salon) => {
                  const assignedTo = getProfileName(salon.assigned_to);
                  const scoreValue = salon.score ?? 0;
                  const statusMeta = salonStatusMeta[salon.status as keyof typeof salonStatusMeta];
                  const enrichmentMeta =
                    enrichmentStatusMeta[salon.enrichment_status as keyof typeof enrichmentStatusMeta];

                  return (
                    <TableRow key={salon.id}>
                      <TableCell className="min-w-[220px]">
                        <div className="space-y-1">
                          <p className="font-medium">{salon.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {salon.city} · {salon.postal_code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusMeta.badge_class_name}>
                          {statusMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-medium">{scoreValue}/100</span>
                            <span className="text-muted-foreground">Google {salon.google_rating ?? "—"}</span>
                          </div>
                          <Progress
                            value={scoreValue}
                            indicatorColor={getScoreIndicatorColor(salon.score)}
                            className="h-1.5"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={enrichmentMeta.badge_class_name}>
                          {enrichmentMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback>{generateAvatarFallback(assignedTo)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatRelativeDate(salon.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button type="button" variant="ghost" size="sm">
                          Ouvrir
                          <ChevronRight className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun salon ne correspond à cette recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
