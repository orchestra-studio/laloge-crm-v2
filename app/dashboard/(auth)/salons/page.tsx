import Link from "next/link";

import { SalonsWorkspace } from "@/app/dashboard/(auth)/salons/components/salons-workspace";
import { getSalons } from "@/app/dashboard/(auth)/salons/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SalonsPage() {
  const { salons, total } = await getSalons({ limit: 2000, sortBy: "updated_at", sortDir: "desc" });

  if (salons.length === 0) {
    return <SalonsEmptyState />;
  }

  return <SalonsWorkspace salons={salons} totalCount={total} />;
}

function SalonsEmptyState() {
  return (
    <Card className="rounded-[28px] border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle>Salons indisponibles</CardTitle>
        <CardDescription>
          Impossible de charger la liste des salons depuis Supabase pour le moment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Vérifiez la connexion Supabase, l’authentification ou réessayez dans quelques instants.
        </p>
        <Button asChild className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
          <Link href="/dashboard">Retour au dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
