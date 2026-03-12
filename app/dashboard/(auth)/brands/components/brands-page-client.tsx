"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2Icon,
  LayoutGridIcon,
  ListIcon,
  MailIcon,
  MoreHorizontal,
  PhoneIcon,
  PlusIcon,
  SparklesIcon,
  StoreIcon
} from "lucide-react";

import { BrandLogo } from "./brand-logo";
import { BrandActiveBadge, BrandCategoryBadge } from "./brand-badges";
import type { Brand } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BrandsPageClientProps {
  initialBrands: Brand[];
}

type ViewMode = "cards" | "table";

function StatCard({
  title,
  value,
  description,
  icon: Icon
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border-[#C5A572]/12 bg-white/95 shadow-sm">
      <CardContent className="flex items-start justify-between px-6 py-5">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
        <div className="rounded-2xl border border-[#C5A572]/15 bg-[#FBF7F1] p-3 text-[#8C6B2D]">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandsPageClient({ initialBrands }: BrandsPageClientProps) {
  const [brands, setBrands] = React.useState<Brand[]>(initialBrands);
  const [view, setView] = React.useState<ViewMode>("cards");

  const activeCount = brands.filter((brand) => brand.is_active).length;
  const compatibleTotal = brands.reduce((total, brand) => total + brand.compatible_salon_count, 0);
  const averageCompatibility = Math.round(
    brands.reduce((total, brand) => total + brand.average_compatibility, 0) / brands.length
  );

  const toggleBrandActive = React.useCallback((brandId: string, nextValue: boolean) => {
    setBrands((current) =>
      current.map((brand) => (brand.id === brandId ? { ...brand, is_active: nextValue } : brand))
    );
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
              <SparklesIcon className="size-3.5" />
              Compatibilité marques • vue opératrice
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Marques</h1>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                Suivez les 6 marques actives du réseau La Loge, identifiez les meilleurs matchs
                salons et pilotez les opportunités en un coup d'œil.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && setView(value as ViewMode)}
              variant="outline"
              className="rounded-xl border border-border bg-background p-1">
              <ToggleGroupItem value="cards" className="rounded-lg px-3">
                <LayoutGridIcon className="size-4" />
                Cartes
              </ToggleGroupItem>
              <ToggleGroupItem value="table" className="rounded-lg px-3">
                <ListIcon className="size-4" />
                Liste
              </ToggleGroupItem>
            </ToggleGroup>

            <Button className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">
              <PlusIcon className="size-4" />
              Ajouter marque
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Marques actives"
          value={`${activeCount}`}
          description="Suivi en temps réel du portefeuille"
          icon={Building2Icon}
        />
        <StatCard
          title="Total salons compatibles"
          value={compatibleTotal.toLocaleString("fr-FR")}
          description="Au-dessus du seuil de qualification"
          icon={StoreIcon}
        />
        <StatCard
          title="Compatibilité moyenne"
          value={`${averageCompatibility}/100`}
          description="Lecture instantanée du fit global"
          icon={SparklesIcon}
        />
        <StatCard
          title="Propositions en cours"
          value={brands.reduce((total, brand) => total + brand.total_proposals, 0).toString()}
          description="Draft + envoyées + acceptées"
          icon={ArrowUpRight}
        />
      </div>

      {view === "cards" ? (
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {brands.map((brand) => (
            <Card
              key={brand.id}
              className="overflow-hidden border-[#C5A572]/12 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#C5A572]/30">
              <CardHeader className="gap-4 border-b border-border/60 pb-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-4">
                    <BrandLogo name={brand.name} logoUrl={brand.logo_url} size="lg" />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg leading-none">{brand.name}</CardTitle>
                        <BrandCategoryBadge category={brand.category} />
                      </div>
                      <p className="text-muted-foreground line-clamp-2 max-w-md text-sm leading-6">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  <BrandActiveBadge isActive={brand.is_active} />
                </div>
              </CardHeader>

              <CardContent className="space-y-5 px-6 py-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Salons compatibles
                    </div>
                    <div className="mt-2 text-xl font-semibold">
                      {brand.compatible_salon_count.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">
                      Compatibilité moyenne
                    </div>
                    <div className="mt-2 text-xl font-semibold">{brand.average_compatibility}/100</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-[#FBF9F5] p-4">
                  <div className="text-muted-foreground mb-3 text-xs uppercase tracking-wide">
                    Contact principal
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{brand.contact_name}</p>
                    <div className="text-muted-foreground flex flex-col gap-2 text-sm">
                      <a
                        href={`mailto:${brand.contact_email}`}
                        className="inline-flex items-center gap-2 hover:text-foreground">
                        <MailIcon className="size-4" />
                        {brand.contact_email}
                      </a>
                      <a
                        href={`tel:${brand.contact_phone}`}
                        className="inline-flex items-center gap-2 hover:text-foreground">
                        <PhoneIcon className="size-4" />
                        {brand.contact_phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="justify-between gap-3 border-t border-border/60 bg-muted/20 py-4">
                <div className="text-muted-foreground text-sm">
                  {brand.total_proposals} propositions • {brand.acceptance_rate}% d'acceptation
                </div>
                <Button asChild variant="outline" className="border-[#C5A572]/20 bg-white hover:bg-[#FBF7F1]">
                  <Link prefetch={false} href={`/dashboard/brands/${brand.id}`}>
                    Voir la fiche
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[#C5A572]/12 bg-white shadow-sm">
          <CardHeader className="border-b border-border/60 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Liste des marques</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  Vision compacte du portefeuille et accès rapide aux fiches marque.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Logo</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Salons compatibles</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id} className="hover:bg-muted/30">
                    <TableCell className="pl-6">
                      <BrandLogo name={brand.name} logoUrl={brand.logo_url} size="sm" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Link prefetch={false}
                          href={`/dashboard/brands/${brand.id}`}
                          className="font-medium transition-colors hover:text-[#8C6B2D]">
                          {brand.name}
                        </Link>
                        <div className="text-muted-foreground text-xs">
                          {brand.average_compatibility}/100 de compatibilité moyenne
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BrandCategoryBadge category={brand.category} />
                    </TableCell>
                    <TableCell>{brand.contact_name}</TableCell>
                    <TableCell>
                      <a className="text-sm hover:text-foreground" href={`mailto:${brand.contact_email}`}>
                        {brand.contact_email}
                      </a>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {brand.compatible_salon_count.toLocaleString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Switch
                          checked={brand.is_active}
                          onCheckedChange={(checked) => toggleBrandActive(brand.id, checked)}
                          aria-label={`Activer ${brand.name}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="ml-auto">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Ouvrir le menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link prefetch={false} href={`/dashboard/brands/${brand.id}`}>Voir la fiche</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Éditer</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => toggleBrandActive(brand.id, !brand.is_active)}>
                            {brand.is_active ? "Passer inactive" : "Réactiver"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
