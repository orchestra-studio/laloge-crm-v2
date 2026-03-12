import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { BrandDetailPageClient } from "../components/brand-detail-page-client";
import { getBrandById } from "@/lib/supabase/queries/brands";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BrandDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { id } = await params;
  const brand = await getBrandById(id);

  if (!brand) {
    return (
      <div className="space-y-6 pb-8">
        <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Fiche marque</h1>
              <p className="text-muted-foreground max-w-2xl text-sm leading-6">
                La marque demandée est introuvable ou n&apos;est pas accessible pour cette session.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link prefetch={false} href="/dashboard/brands">
                <ArrowLeftIcon className="size-4" />
                Retour aux marques
              </Link>
            </Button>
          </div>
        </div>

        <Card className="border-[#C5A572]/12 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Marque indisponible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-6">
              Vérifiez l&apos;identifiant, la synchronisation Supabase ou les droits d&apos;accès à la table
              <span className="font-medium text-foreground"> brands</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <BrandDetailPageClient brand={brand} />;
}
