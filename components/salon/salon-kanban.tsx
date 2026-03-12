"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, GripVertical, MapPin, Phone, PlusCircle } from "lucide-react";

import * as Kanban from "@/components/ui/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { salonStatusConfig, salonStatusOrder, formatRelativeDate } from "@/lib/salon";
import { cn } from "@/lib/utils";
import { ScoreBar } from "./score-bar";
import { StatusBadge } from "./status-badge";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";

const kanbanOrder = salonStatusOrder;

type SalonColumns = Record<(typeof kanbanOrder)[number], Salon[]>;

function buildColumns(salons: Salon[]): SalonColumns {
  return kanbanOrder.reduce((acc, status) => {
    acc[status] = salons.filter((salon) => salon.status === status);
    return acc;
  }, {} as SalonColumns);
}

function hydrateStatuses(columns: SalonColumns) {
  return kanbanOrder.reduce((acc, status) => {
    acc[status] = columns[status].map((salon) => ({ ...salon, status }));
    return acc;
  }, {} as SalonColumns);
}

interface SalonKanbanProps {
  salons: Salon[];
}

export function SalonKanban({ salons }: SalonKanbanProps) {
  const [columns, setColumns] = React.useState<SalonColumns>(() => buildColumns(salons));

  React.useEffect(() => {
    setColumns(buildColumns(salons));
  }, [salons]);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm backdrop-blur-sm">
      <Kanban.Root
        value={columns}
        getItemValue={(item) => item.id}
        onValueChange={(nextValue) => setColumns(hydrateStatuses(nextValue as SalonColumns))}>
        <Kanban.Board className="w-full gap-4 overflow-x-auto pb-3">
          {kanbanOrder.map((status) => {
            const config = salonStatusConfig[status];
            const items = columns[status] ?? [];

            return (
              <Kanban.Column
                key={status}
                value={status}
                className="w-[320px] min-w-[320px] rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", config.dotClassName)} />
                    <span className="text-sm font-semibold text-slate-900">{config.label}</span>
                    <Badge variant="outline" className="rounded-full bg-white text-slate-600">
                      {items.length}
                    </Badge>
                  </div>
                  <Kanban.ColumnHandle asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-full text-slate-500">
                      <GripVertical className="size-4" />
                    </Button>
                  </Kanban.ColumnHandle>
                </div>

                <div className="space-y-3">
                  {items.length > 0 ? (
                    items.map((salon) => (
                      <Kanban.Item key={salon.id} value={salon.id} asHandle asChild>
                        <Card className="gap-4 rounded-2xl border border-white bg-white py-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                          <CardHeader className="space-y-3 px-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <CardTitle className="text-base leading-tight font-semibold text-slate-900">
                                  <Link prefetch={false} href={`/dashboard/salons/${salon.id}`} className="hover:text-slate-700">
                                    {salon.name}
                                  </Link>
                                </CardTitle>
                                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                  <MapPin className="size-3.5" />
                                  {salon.city} · {salon.department}
                                </div>
                              </div>
                              <StatusBadge status={salon.status} className="shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 px-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                              <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-[0.12em]">
                                <span>Score</span>
                                <span>{salon.score}/100</span>
                              </div>
                              <ScoreBar score={salon.score} showValue={false} compact />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                {salon.assigned_to ? (
                                  <Avatar size="sm" className="ring-background ring-2">
                                    <AvatarImage src={salon.assigned_to.avatar ?? undefined} alt={salon.assigned_to.full_name} />
                                    <AvatarFallback>{salon.assigned_to.initials}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar size="sm" className="ring-background ring-2">
                                    <AvatarFallback>—</AvatarFallback>
                                  </Avatar>
                                )}
                                <span className="text-xs text-slate-600">
                                  {salon.assigned_to?.full_name ?? "Non assigné"}
                                </span>
                              </div>
                              {salon.phone ? (
                                <Button asChild variant="ghost" size="icon-xs" className="rounded-full text-slate-500">
                                  <a href={`tel:${salon.phone.replace(/\s+/g, "")}`}>
                                    <Phone className="size-3.5" />
                                    <span className="sr-only">Appeler {salon.name}</span>
                                  </a>
                                </Button>
                              ) : null}
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{formatRelativeDate(salon.updated_at)}</span>
                              <Button asChild variant="ghost" size="xs" className="h-7 rounded-full px-2 text-slate-600">
                                <Link prefetch={false} href={`/dashboard/salons/${salon.id}`}>
                                  Ouvrir
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Kanban.Item>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center">
                      <p className="text-sm font-medium text-slate-700">Aucun salon</p>
                      <p className="mt-1 text-xs text-slate-500">Glissez un salon ici ou ajoutez-en un nouveau.</p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-full">
                        <PlusCircle className="size-4" />
                        Nouveau
                      </Button>
                    </div>
                  )}
                </div>
              </Kanban.Column>
            );
          })}
        </Kanban.Board>
        <Kanban.Overlay>
          <div className="h-full w-full rounded-2xl border border-dashed border-slate-300 bg-slate-100/80" />
        </Kanban.Overlay>
      </Kanban.Root>
    </div>
  );
}
