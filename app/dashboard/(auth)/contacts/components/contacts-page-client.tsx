"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  ArrowUpRight,
  DownloadIcon,
  MailIcon,
  MoreHorizontal,
  PhoneIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  Users2Icon
} from "lucide-react";

import { DataTableColumnHeader } from "@/app/dashboard/(auth)/brands/components/data-table-column-header";
import { DataTablePagination } from "@/app/dashboard/(auth)/brands/components/data-table-pagination";
import { DataTableViewOptions } from "@/app/dashboard/(auth)/brands/components/data-table-view-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ContactDetailSheet } from "./contact-detail-sheet";
import { ContactStatusBadge } from "./contact-status-badge";
import type { Contact } from "./types";

interface ContactsPageClientProps {
  initialContacts: Contact[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function StatCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card className="border-[#C5A572]/12 shadow-sm">
      <CardContent className="space-y-1 px-6 py-5">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ContactsPageClient({ initialContacts }: ContactsPageClientProps) {
  const [contacts] = React.useState(initialContacts);
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "last_contact",
      desc: true
    }
  ]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [salonFilter, setSalonFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "actif" | "inactif">("all");
  const [decisionMakersOnly, setDecisionMakersOnly] = React.useState(false);
  const [hasPhone, setHasPhone] = React.useState(false);
  const [hasEmail, setHasEmail] = React.useState(false);

  const salonOptions = React.useMemo(
    () => Array.from(new Set(contacts.map((contact) => contact.salon_name))).sort((a, b) => a.localeCompare(b)),
    [contacts]
  );
  const roleOptions = React.useMemo(
    () => Array.from(new Set(contacts.map((contact) => contact.role))).sort((a, b) => a.localeCompare(b)),
    [contacts]
  );

  const filteredContacts = React.useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSalon = salonFilter === "all" || contact.salon_name === salonFilter;
      const matchesRole = roleFilter === "all" || contact.role === roleFilter;
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      const matchesDecisionMaker = !decisionMakersOnly || contact.is_decision_maker;
      const matchesPhone = !hasPhone || Boolean(contact.phone);
      const matchesEmail = !hasEmail || Boolean(contact.email);

      return (
        matchesSalon &&
        matchesRole &&
        matchesStatus &&
        matchesDecisionMaker &&
        matchesPhone &&
        matchesEmail
      );
    });
  }, [contacts, decisionMakersOnly, hasEmail, hasPhone, roleFilter, salonFilter, statusFilter]);

  const openContactDetail = React.useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setDetailOpen(true);
  }, []);

  const columns = React.useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Sélectionner tous les contacts"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Sélectionner ${row.original.first_name} ${row.original.last_name}`}
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: "first_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Prénom" />,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openContactDetail(row.original)}
            className="font-medium hover:text-[#8C6B2D]">
            {row.original.first_name}
          </button>
        )
      },
      {
        accessorKey: "last_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
        cell: ({ row }) => <span>{row.original.last_name}</span>
      },
      {
        accessorKey: "salon_name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Salon" />,
        cell: ({ row }) => (
          <Link prefetch={false}
            href={`/dashboard/salons/${row.original.salon_id}`}
            className="inline-flex items-center gap-2 hover:text-[#8C6B2D]">
            {row.original.salon_name}
            <ArrowUpRight className="size-3.5" />
          </Link>
        )
      },
      {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
        cell: ({ row }) => <span>{row.original.role}</span>
      },
      {
        accessorKey: "phone",
        header: "Téléphone",
        cell: ({ row }) =>
          row.original.phone ? (
            <a href={`tel:${row.original.phone}`} className="inline-flex items-center gap-2 hover:text-foreground">
              <PhoneIcon className="size-4 text-[#8C6B2D]" />
              {row.original.phone}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) =>
          row.original.email ? (
            <a href={`mailto:${row.original.email}`} className="inline-flex items-center gap-2 hover:text-foreground">
              <MailIcon className="size-4 text-[#8C6B2D]" />
              {row.original.email}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
      },
      {
        accessorKey: "is_decision_maker",
        header: "Décisionnaire",
        cell: ({ row }) =>
          row.original.is_decision_maker ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C5A572]/20 bg-[#C5A572]/10 px-2 py-1 text-xs font-medium text-[#8C6B2D]">
              <StarIcon className="size-3.5 fill-current" />
              Oui
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">Non</span>
          )
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
        cell: ({ row }) => <ContactStatusBadge status={row.original.status} />
      },
      {
        accessorKey: "linkedin",
        header: "LinkedIn",
        cell: ({ row }) =>
          row.original.linkedin ? (
            <Button asChild variant="ghost" size="sm" className="h-auto px-0 text-[#8C6B2D] hover:bg-transparent">
              <a href={row.original.linkedin} target="_blank" rel="noreferrer">
                Ouvrir
              </a>
            </Button>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
      },
      {
        accessorKey: "instagram",
        header: "Instagram",
        cell: ({ row }) =>
          row.original.instagram ? (
            <Button asChild variant="ghost" size="sm" className="h-auto px-0 text-[#8C6B2D] hover:bg-transparent">
              <a href={row.original.instagram} target="_blank" rel="noreferrer">
                Ouvrir
              </a>
            </Button>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
      },
      {
        accessorKey: "last_contact",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dernier contact" />,
        cell: ({ row }) => formatDate(row.original.last_contact)
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="ml-auto">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Ouvrir les actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={() => openContactDetail(row.original)}>
                Voir la fiche
              </DropdownMenuItem>
              <DropdownMenuItem>Ajouter une note</DropdownMenuItem>
              <DropdownMenuItem>Envoyer un email</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [openContactDetail]
  );

  const table = useReactTable({
    data: filteredContacts,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility
    },
    initialState: {
      pagination: {
        pageSize: 25
      }
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
              <SparklesIcon className="size-3.5" />
              Réseau contacts • vue relationnelle
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                Tous les interlocuteurs salons centralisés avec rôle, statut, canaux et historique
                d'approche dans une table de travail unique.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
            <Button className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">
              <PlusIcon className="size-4" />
              Ajouter contact
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Contacts total"
          value={contacts.length.toString()}
          description="Base active La Loge"
        />
        <StatCard
          title="Décisionnaires"
          value={contacts.filter((contact) => contact.is_decision_maker).length.toString()}
          description="À prioriser dans les séquences"
        />
        <StatCard
          title="Avec téléphone"
          value={contacts.filter((contact) => Boolean(contact.phone)).length.toString()}
          description="Prêts pour call ou WhatsApp"
        />
      </div>

      <Card className="border-[#C5A572]/12 shadow-sm">
        <CardHeader className="gap-4 border-b border-border/60">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">Table des contacts</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {filteredContacts.length} contact{filteredContacts.length > 1 ? "s" : ""} correspondant
                aux filtres.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DataTableViewOptions table={table} />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto_auto_auto]">
            <Select value={salonFilter} onValueChange={setSalonFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Salon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les salons</SelectItem>
                {salonOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {roleOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm">
              <span>Décisionnaire</span>
              <Switch checked={decisionMakersOnly} onCheckedChange={setDecisionMakersOnly} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm">
              <span>Avec téléphone</span>
              <Switch checked={hasPhone} onCheckedChange={setHasPhone} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm">
              <span>Avec email</span>
              <Switch checked={hasEmail} onCheckedChange={setHasEmail} />
            </div>
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                    Aucun contact ne correspond à ces filtres.
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

      <ContactDetailSheet contact={selectedContact} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
