import Link from "next/link";

import { SalonDetailView } from "@/app/dashboard/(auth)/salons/components/salon-detail-view";
import { getSalonById } from "@/app/dashboard/(auth)/salons/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type SalonDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function SalonDetailPage({ params }: SalonDetailPageProps) {
  const resolvedParams = await params;
  const salon = await getSalonById(resolvedParams.id);

  if (!salon) {
    return <SalonNotFoundState />;
  }

  return <SalonDetailView salon={salon} />;
}

function SalonNotFoundState() {
  return (
    <Card className="rounded-[28px] border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle>Fiche salon introuvable</CardTitle>
        <CardDescription>
          Ce salon n’existe plus, n’est pas accessible, ou les données n’ont pas pu être chargées.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Retournez à la liste des salons pour relancer la navigation ou vérifier l’identifiant demandé.
        </p>
        <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
          <Link href="/dashboard/salons">Retour aux salons</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
