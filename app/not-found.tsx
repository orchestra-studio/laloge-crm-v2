import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0">
      <div className="text-center">
        <p className="text-muted-foreground text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-7xl">
          Page introuvable
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          Désolé, la page que vous cherchez n’existe pas.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button size="lg" asChild>
            <Link prefetch={false} href="/dashboard">Retour à l’accueil</Link>
          </Button>
          <Button size="lg" variant="ghost">
            Contacter le support <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block">
        <img
          src={`/404.svg`}
          width={300}
          height={400}
          className="w-full object-contain lg:max-w-2xl"
          alt="Illustration page introuvable"
        />
      </div>
    </div>
  );
}
