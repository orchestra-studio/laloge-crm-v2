"use client";

import { Table } from "@tanstack/react-table";
import { ChevronDown, Download, Layers3, UserRoundCog, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { enrichmentConfig, salonStatusConfig, salonStatusOrder } from "@/lib/salon";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const departmentOptions = Array.from(table.getColumn("department")?.getFacetedUniqueValues().keys() ?? [])
    .map((department) => String(department))
    .sort((a, b) => a.localeCompare(b, "fr"))
    .map((department) => ({
      value: department,
      label: department
    }));

  const statusOptions = salonStatusOrder.map((status) => ({
    value: status,
    label: salonStatusConfig[status].label
  }));

  const enrichmentOptions = Object.entries(enrichmentConfig).map(([value, config]) => ({
    value,
    label: config.label
  }));

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Rechercher un salon…"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-9 w-full rounded-full bg-slate-50 md:max-w-xs"
          />
          {table.getColumn("status") ? (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Statut"
              options={statusOptions}
            />
          ) : null}
          {table.getColumn("department") ? (
            <DataTableFacetedFilter
              column={table.getColumn("department")}
              title="Département"
              options={departmentOptions}
            />
          ) : null}
          {table.getColumn("enrichment_status") ? (
            <DataTableFacetedFilter
              column={table.getColumn("enrichment_status")}
              title="Enrichissement"
              options={enrichmentOptions}
            />
          ) : null}
          {isFiltered ? (
            <Button variant="ghost" size="sm" className="h-8 rounded-full" onClick={() => table.resetColumnFilters()}>
              Réinitialiser
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedRowsCount > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full bg-white">
                  <Layers3 className="size-4" />
                  {selectedRowsCount} sélectionné(s)
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem>Changer statut</DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundCog className="size-4" />
                  Assigner à…
                </DropdownMenuItem>
                <DropdownMenuItem>Ajouter tags</DropdownMenuItem>
                <DropdownMenuItem>Ajouter à séquence</DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="size-4" />
                  Exporter sélection
                </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
