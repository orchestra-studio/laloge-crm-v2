"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  Mail,
  MoreHorizontal,
  NotebookPen,
  Phone,
  Send,
  Sparkles
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { GOLD_ACCENT, salonStatusConfig, salonStatusOrder } from "@/lib/salon";
import { cn } from "@/lib/utils";
import { ScoreBar } from "./score-bar";
import { StatusBadge } from "./status-badge";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";

interface SalonDetailHeaderProps {
  salon: Salon;
}

export function SalonDetailHeader({ salon }: SalonDetailHeaderProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
      <div
        className="border-b border-slate-200/80 px-5 py-5 sm:px-6"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(197,165,114,0.12), rgba(255,255,255,0.9) 35%, rgba(248,250,252,0.92) 100%)"
        }}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-full bg-white/80">
                <Link prefetch={false} href="/dashboard/salons">
                  <ArrowLeft className="size-4" />
                  Retour à la liste
                </Link>
              </Button>
              <Badge variant="outline" className="rounded-full bg-white/80 text-slate-600">
                {salon.city} · {salon.department}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-[#C5A572]/30 bg-[#C5A572]/10 font-medium text-[#7D643C]">
                La Loge Match Engine
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                {salon.name}
              </h1>
              <p className="text-sm text-slate-600">
                {salon.address}, {salon.postal_code} {salon.city} · Propriétaire : {salon.owner_name}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-white/90">
                    <StatusBadge status={salon.status} className="border-0 bg-transparent p-0 shadow-none" />
                    <ChevronDown className="size-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  {salonStatusOrder.map((status) => (
                    <DropdownMenuItem key={status} className="gap-2">
                      <span className={cn("size-2 rounded-full", salonStatusConfig[status].dotClassName)} />
                      {salonStatusConfig[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-left shadow-xs transition-colors hover:border-slate-300">
                    <span
                      className="inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ backgroundColor: "rgba(197,165,114,0.14)", color: GOLD_ACCENT }}>
                      {salon.score}
                    </span>
                    <span>
                      <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                        Score La Loge
                      </span>
                      <span className="block text-sm font-medium text-slate-900">Cliquez pour le détail</span>
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 rounded-2xl p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Breakdown du score</p>
                      <p className="text-xs text-slate-500">Détails des critères utilisés pour prioriser ce salon.</p>
                    </div>
                    <ScoreBar score={salon.score} className="w-full" />
                    <div className="space-y-2">
                      {salon.score_breakdown.map((item) => (
                        <div key={item.criterion} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-slate-900">{item.criterion}</span>
                            <Badge variant="outline" className="rounded-full bg-white text-slate-600">
                              +{item.points}
                            </Badge>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-500">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-xs transition-colors hover:border-slate-300">
                    <Avatar size="sm">
                      <AvatarImage
                        src={salon.assigned_to?.avatar ?? undefined}
                        alt={salon.assigned_to?.full_name ?? "Non assigné"}
                      />
                      <AvatarFallback>{salon.assigned_to?.initials ?? "—"}</AvatarFallback>
                    </Avatar>
                    <span className="text-left">
                      <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                        Assigné à
                      </span>
                      <span className="block text-sm font-medium text-slate-900">
                        {salon.assigned_to?.full_name ?? "Non assigné"}
                      </span>
                    </span>
                    <ChevronDown className="size-4 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuItem>Bonnie Laurent</DropdownMenuItem>
                  <DropdownMenuItem>Marie-Pierre Garnier</DropdownMenuItem>
                  <DropdownMenuItem>Clara Besson</DropdownMenuItem>
                  <DropdownMenuItem>Thomas Rigaud</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              {salon.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full bg-white/80 px-2.5 py-1 text-slate-600">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:max-w-[460px] xl:justify-end">
            {salon.phone ? (
              <Button asChild variant="outline" className="rounded-full bg-white/90">
                <a href={`tel:${salon.phone.replace(/\s+/g, "")}`}>
                  <Phone className="size-4" />
                  Appeler
                </a>
              </Button>
            ) : null}
            {salon.email ? (
              <Button asChild variant="outline" className="rounded-full bg-white/90">
                <a href={`mailto:${salon.email}`}>
                  <Mail className="size-4" />
                  Email
                </a>
              </Button>
            ) : null}
            <Button variant="outline" className="rounded-full bg-white/90">
              <NotebookPen className="size-4" />
              Note
            </Button>
            <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
              <Send className="size-4" />
              Outreach
            </Button>
            <Button variant="outline" className="rounded-full bg-white/90">
              <FileText className="size-4" />
              Dossier
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-white/90">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Plus d'actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem>
                  <Sparkles className="size-4" />
                  Relancer enrichissement
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Changer statut</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {salonStatusOrder.map((status) => (
                      <DropdownMenuItem key={status}>{salonStatusConfig[status].label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Archiver</DropdownMenuItem>
                <DropdownMenuItem>Fusionner</DropdownMenuItem>
                <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
