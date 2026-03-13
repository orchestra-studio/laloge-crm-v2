"use client";

import * as React from "react";
import { FilePlus2Icon, SparklesIcon, WandSparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type MinimalDossier = { salon_id: string; salon_name: string; brand_id: string; brand_name: string };

const dossierSignals = [
  "Fiche salon enrichie",
  "Score marque détaillé",
  "Historique d'interactions",
  "Recommandations commerciales"
];

export function DossiersGenerateDialog({ dossiers }: { dossiers: MinimalDossier[] }) {
  const salons = React.useMemo(
    () =>
      Array.from(
        new Map(dossiers.map((dossier) => [dossier.salon_id, { id: dossier.salon_id, name: dossier.salon_name }])).values()
      ).sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [dossiers]
  );

  const brands = React.useMemo(
    () =>
      Array.from(
        new Map(dossiers.map((dossier) => [dossier.brand_id, { id: dossier.brand_id, name: dossier.brand_name }])).values()
      ).sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [dossiers]
  );

  const [salonId, setSalonId] = React.useState(salons[0]?.id ?? "");
  const [brandId, setBrandId] = React.useState(brands[0]?.id ?? "");
  const [tone, setTone] = React.useState("executif");

  const selectedSalon = salons.find((salon) => salon.id === salonId);
  const selectedBrand = brands.find((brand) => brand.id === brandId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">
          <FilePlus2Icon className="size-4" />
          Générer un dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-[#C5A572]/15 p-0 sm:max-w-2xl">
        <div className="border-b border-[#C5A572]/12 bg-linear-to-br from-[#FCFAF6] via-white to-white px-6 py-5">
          <DialogHeader className="text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C5A572]/15 bg-[#FBF7F1] px-3 py-1 text-xs font-medium text-[#8C6B2D]">
              <SparklesIcon className="size-3.5" />
              Génération assistée
            </div>
            <DialogTitle className="pt-3 text-2xl font-semibold tracking-tight">
              Préparer un nouveau dossier client
            </DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-6">
              Lancez une synthèse salon × marque avec score détaillé, recommandations de partenariat
              et timeline des échanges. Prototype UI uniquement pour cette itération.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Salon</p>
              <Select value={salonId} onValueChange={setSalonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un salon" />
                </SelectTrigger>
                <SelectContent>
                  {salons.map((salon) => (
                    <SelectItem key={salon.id} value={salon.id}>
                      {salon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Marque ciblée</p>
              <Select value={brandId} onValueChange={setBrandId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une marque" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Angle de rendu</p>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un angle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executif">Exécutif marque</SelectItem>
                  <SelectItem value="commercial">Commercial terrain</SelectItem>
                  <SelectItem value="premium">Premium storytelling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-3xl border border-[#C5A572]/15 bg-[#FCFAF6] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-[#C5A572]/15 bg-white p-2.5 text-[#8C6B2D] shadow-sm">
                <WandSparklesIcon className="size-5" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#8C6B2D]">
                  Aperçu du brief
                </p>
                <h3 className="text-lg font-semibold tracking-tight">
                  {selectedSalon?.name ?? "Salon à sélectionner"} × {selectedBrand?.name ?? "Marque"}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Ton recommandé : <span className="font-medium text-foreground">
                    {tone === "executif"
                      ? "Exécutif marque"
                      : tone === "commercial"
                        ? "Commercial terrain"
                        : "Premium storytelling"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-sm font-medium">Le dossier intégrera :</p>
              <div className="flex flex-wrap gap-2">
                {dossierSignals.map((signal) => (
                  <Badge
                    key={signal}
                    variant="outline"
                    className="rounded-full border-[#C5A572]/20 bg-white text-[#8C6B2D]">
                    {signal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border/60 px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="bg-[#1F1A16] text-white hover:bg-[#2A241E]">Lancer la génération</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
