"use client";

import { Row } from "@tanstack/react-table";
import {
  ClipboardList,
  Mail,
  MoreHorizontal,
  NotebookPen,
  Phone,
  Send,
  Trash2,
  UserRoundCog
} from "lucide-react";

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
import { salonStatusConfig, salonStatusOrder } from "@/lib/salon";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const salon = row.original as Salon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-full data-[state=open]:bg-slate-100">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {salon.phone ? (
          <DropdownMenuItem asChild>
            <a href={`tel:${salon.phone.replace(/\s+/g, "")}`}>
              <Phone className="size-4" />
              Appeler
            </a>
          </DropdownMenuItem>
        ) : null}
        {salon.email ? (
          <DropdownMenuItem asChild>
            <a href={`mailto:${salon.email}`}>
              <Mail className="size-4" />
              Envoyer un email
            </a>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem>
          <NotebookPen className="size-4" />
          Ajouter une note
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserRoundCog className="size-4" />
          Assigner à…
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Changer statut</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {salonStatusOrder.map((status) => (
              <DropdownMenuItem key={status}>{salonStatusConfig[status].label}</DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <Send className="size-4" />
          Ajouter à une séquence
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ClipboardList className="size-4" />
          Générer dossier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
          <Trash2 className="size-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
