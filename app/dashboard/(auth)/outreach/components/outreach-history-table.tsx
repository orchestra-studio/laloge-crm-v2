"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, SearchIcon } from "lucide-react";

import { OutreachRecord } from "../data/mock-outreach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
});

function getStatusVariant(status: OutreachRecord["status"]) {
  switch (status) {
    case "replied":
      return "success" as const;
    case "clicked":
    case "opened":
      return "info" as const;
    case "bounced":
      return "destructive" as const;
    case "scheduled":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

function getChannelLabel(channel: OutreachRecord["channel"]) {
  switch (channel) {
    case "email":
      return "Email";
    case "phone":
      return "Appel";
    case "sms":
      return "SMS";
  }
}

function getTypeLabel(type: OutreachRecord["type"]) {
  switch (type) {
    case "campaign":
      return "Campagne";
    case "manual":
      return "Manuel";
    case "sequence":
      return "Séquence";
  }
}

export function OutreachHistoryTable({
  data,
  selectedId,
  onSelect
}: {
  data: OutreachRecord[];
  selectedId?: string;
  onSelect?: (record: OutreachRecord) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "date",
      desc: true
    }
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [channelFilter, setChannelFilter] = React.useState<string>("all");

  const filteredData = React.useMemo(() => {
    return data.filter((record) => {
      const matchesSearch =
        globalFilter.length === 0 ||
        [record.salon, record.city, record.contact, record.contentPreview]
          .join(" ")
          .toLowerCase()
          .includes(globalFilter.toLowerCase());

      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesChannel = channelFilter === "all" || record.channel === channelFilter;

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [channelFilter, data, globalFilter, statusFilter]);

  const columns = React.useMemo<ColumnDef<OutreachRecord>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="-ml-3"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="size-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="min-w-32 text-xs text-muted-foreground">
            {formatter.format(new Date(row.original.date))}
          </div>
        )
      },
      {
        accessorKey: "salon",
        header: "Salon",
        cell: ({ row }) => (
          <div className="min-w-40">
            <div className="font-medium">{row.original.salon}</div>
            <div className="text-xs text-muted-foreground">{row.original.city}</div>
          </div>
        )
      },
      {
        accessorKey: "contact",
        header: "Contact",
        cell: ({ row }) => row.original.contact
      },
      {
        accessorKey: "channel",
        header: "Canal",
        cell: ({ row }) => <Badge variant="outline">{getChannelLabel(row.original.channel)}</Badge>
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <span className="text-sm">{getTypeLabel(row.original.type)}</span>
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
            {row.original.status.replace("_", " ")}
          </Badge>
        )
      },
      {
        id: "preview",
        header: "Aperçu",
        cell: ({ row }) => (
          <div className="max-w-[28rem] min-w-56">
            <p className="line-clamp-2 text-sm text-muted-foreground">{row.original.contentPreview}</p>
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting
    },
    initialState: {
      pagination: {
        pageSize: 8
      }
    }
  });

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex flex-col gap-3 border-b pb-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Rechercher un salon, contact ou contenu"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous canaux</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Appel</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="scheduled">Planifié</SelectItem>
              <SelectItem value="sent">Envoyé</SelectItem>
              <SelectItem value="opened">Ouvert</SelectItem>
              <SelectItem value="clicked">Cliqué</SelectItem>
              <SelectItem value="replied">Répondu</SelectItem>
              <SelectItem value="bounced">Bounce</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="min-h-0 flex-1 rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "cursor-pointer align-top",
                    row.original.id === selectedId && "bg-muted/60 hover:bg-muted/60"
                  )}
                  onClick={() => onSelect?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 align-top whitespace-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  Aucun outreach ne correspond aux filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          {filteredData.length} envoi{filteredData.length > 1 ? "s" : ""} trouvé
          {filteredData.length > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
