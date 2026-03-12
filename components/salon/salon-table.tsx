"use client";

import type { Salon } from "@/app/dashboard/(auth)/salons/data/schema";
import { columns } from "@/app/dashboard/(auth)/salons/components/columns";
import { DataTable } from "@/app/dashboard/(auth)/salons/components/data-table";

interface SalonTableProps {
  salons: Salon[];
}

export function SalonTable({ salons }: SalonTableProps) {
  return <DataTable columns={columns} data={salons} />;
}
