import { BrandsPageClient } from "./components/brands-page-client";
import { getBrands } from "@/lib/supabase/queries/brands";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BrandsPage() {
  const brands = await getBrands();

  if (brands.length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="rounded-[28px] border border-[#C5A572]/15 bg-linear-to-br from-[#FCFAF6] via-white to-white p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Marques</h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6">
              Les données marques sont momentanément indisponibles ou aucune marque n&apos;a encore
              été synchronisée depuis Supabase.
            </p>
          </div>
        </div>

        <Card className="border-[#C5A572]/12 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Aucune marque à afficher</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-6">
              Vérifiez la connexion Supabase, les droits de lecture ou le seed de la table
              <span className="font-medium text-foreground"> brands</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <BrandsPageClient initialBrands={brands} />;
}
