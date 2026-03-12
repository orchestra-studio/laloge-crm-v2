"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Mail, Phone } from "lucide-react";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StarsRating } from "@/components/salon/stars-rating";
import { ScoreBar } from "@/components/salon/score-bar";
import { StatusBadge } from "@/components/salon/status-badge";
import { enrichmentConfig, formatRelativeDate } from "@/lib/salon";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Salon>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 36
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
    cell: ({ row }) => (
      <div className="min-w-[220px] space-y-0.5">
        <Link prefetch={false} href={`/dashboard/salons/${row.original.id}`} className="font-semibold text-slate-900 hover:underline">
          {row.original.name}
        </Link>
        <div className="text-xs text-slate-500">{row.original.owner_name}</div>
      </div>
    ),
    enableHiding: false
  },
  {
    accessorKey: "city",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ville" />,
    cell: ({ row }) => <div className="font-medium text-slate-700">{row.original.city}</div>
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dept" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full bg-slate-50 px-2.5 py-1 text-slate-600">
        {row.original.department}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    cell: ({ row }) => <ScoreBar score={row.original.score} compact className="w-[132px]" />
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) =>
      row.original.phone ? (
        <a
          href={`tel:${row.original.phone.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <Phone className="size-4 text-slate-400" />
          {row.original.phone}
        </a>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
    enableSorting: false
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) =>
      row.original.email ? (
        <a
          href={`mailto:${row.original.email}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <Mail className="size-4 text-slate-400" />
          <span className="max-w-[180px] truncate">{row.original.email}</span>
        </a>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
    enableSorting: false
  },
  {
    accessorKey: "enrichment_status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Enrichissement" />,
    cell: ({ row }) => {
      const config = enrichmentConfig[row.original.enrichment_status];
      return (
        <Badge variant="outline" className={`rounded-full px-2.5 py-1 ${config.badgeClassName}`}>
          {config.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: "google_rating",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Google Rating" />,
    cell: ({ row }) => <StarsRating rating={row.original.google_rating} showValue={false} />
  },
  {
    id: "assigned_to_name",
    accessorFn: (row) => row.assigned_to?.full_name ?? "Non assigné",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigné à" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src={row.original.assigned_to?.avatar ?? undefined} alt={row.original.assigned_to?.full_name ?? "Non assigné"} />
          <AvatarFallback>{row.original.assigned_to?.initials ?? "—"}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-slate-600">{row.original.assigned_to?.full_name ?? "Non assigné"}</span>
      </div>
    )
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dernière activité" />,
    cell: ({ row }) => <span className="text-sm text-slate-500">{formatRelativeDate(row.original.updated_at)}</span>
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <ButtonLink href={`/dashboard/salons/${row.original.id}`} />
        <DataTableRowActions row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  }
];

function ButtonLink({ href }: { href: string }) {
  return (
    <Link prefetch={false}
      href={href}
      className="inline-flex size-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700">
      <ExternalLink className="size-4" />
      <span className="sr-only">Ouvrir la fiche</span>
    </Link>
  );
}
