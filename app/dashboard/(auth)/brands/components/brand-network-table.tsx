"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpRight, FilterIcon } from "lucide-react";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTablePagination } from "./data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { formatSalonStatus, SalonStatusBadge } from "./brand-badges";
import type { BrandSalon, SalonStatus } from "./types";

interface BrandNetworkTableProps {
  salons: BrandSalon[];
}

const MIN_SCORE_OPTIONS = ["0", "70", "80", "90"] as const;

function scoreTone(score: number) {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-[#C5A572]";
  return "bg-slate-500";
}

export function BrandNetworkTable({ salons }: BrandNetworkTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "compatibility_score",
      desc: true
    }
  ]);
  const [search, setSearch] = React.useState("");
  const [department, setDepartment] = React.useState("all");
  const [status, setStatus] = React.useState<SalonStatus | "all">("all");
  const [minScore, setMinScore] = React.useState<(typeof MIN_SCORE_OPTIONS)[number]>("0");

  const departments = React.useMemo(
    () => Array.from(new Set(salons.map((salon) => salon.department))).sort((a, b) => a.localeCompare(b)),
    [salons]
  );
  const statuses = React.useMemo(
    () => Array.from(new Set(salons.map((salon) => salon.status))),
    [salons]
  );

  const filteredSalons = React.useMemo(() => {
    return salons.filter((salon) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        salon.name.toLowerCase().includes(query) ||
        salon.city.toLowerCase().includes(query);
      const matchesDepartment = department === "all" || salon.department === department;
      const matchesStatus = status === "all" || salon.status === status;
      const matchesScore = salon.compatibility_score >= Number(minScore);

      return matchesSearch && matchesDepartment && matchesStatus && matchesScore;
    });
  }, [department, minScore, salons, search, status]);

  const columns = React.useMemo<ColumnDef<BrandSalon>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Salon" />,
        cell: ({ row }) => (
          <div className="space-y-1">
            <Link prefetch={false}
              href={`/dashboard/salons/${row.original.id}`}
              className="inline-flex items-center gap-2 font-medium hover:text-[#8C6B2D]">
              {row.original.name}
              <ArrowUpRight className="size-3.5" />
            </Link>
            <div className="text-muted-foreground text-xs">Département {row.original.department}</div>
          </div>
        )
      },
      {
        accessorKey: "city",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ville" />,
        cell: ({ row }) => <span>{row.original.city}</span>
      },
      {
        accessorKey: "salon_score",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Score salon" />,
        cell: ({ row }) => (
          <div className="space-y-2 min-w-32">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{row.original.salon_score}/100</span>
              <span className="text-muted-foreground text-xs">Global</span>
            </div>
            <Progress value={row.original.salon_score} indicatorColor={scoreTone(row.original.salon_score)} />
          </div>
        )
      },
      {
        accessorKey: "compatibility_score",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Compatibilité" />,
        cell: ({ row }) => (
          <div className="space-y-2 min-w-36">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#8C6B2D]">
                {row.original.compatibility_score}/100
              </span>
              <span className="text-muted-foreground text-xs">Marque</span>
            </div>
            <Progress
              value={row.original.compatibility_score}
              className="bg-[#C5A572]/15"
              indicatorColor="bg-[#C5A572]"
            />
          </div>
        )
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => <SalonStatusBadge status={row.original.status} />,
        sortingFn: (rowA, rowB) =>
          formatSalonStatus(rowA.original.status).localeCompare(formatSalonStatus(rowB.original.status))
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredSalons,
    columns,
    state: {
      sorting
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <Card className="border-[#C5A572]/12 shadow-sm">
      <CardHeader className="gap-4 border-b border-border/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base">Réseau salons compatible</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Filtrez les meilleurs profils avant de proposer la marque ou générer un dossier.
            </p>
          </div>
          <Button variant="outline" className="w-full lg:w-auto">
            <FilterIcon className="size-4" />
            Proposer à la marque
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.4fr_180px_180px_180px]">
          <Input
            placeholder="Rechercher un salon ou une ville"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={minScore} onValueChange={(value) => setMinScore(value as (typeof MIN_SCORE_OPTIONS)[number])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Score minimum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tous les scores</SelectItem>
              <SelectItem value="70">Score &gt; 70</SelectItem>
              <SelectItem value="80">Score &gt; 80</SelectItem>
              <SelectItem value="90">Score &gt; 90</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value as SalonStatus | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {formatSalonStatus(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0 pt-0">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                  Aucun salon ne correspond aux filtres actuels.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="px-6 pb-6">
          <DataTablePagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}
