import { Bot, Plus, Search, SendHorizontal } from "lucide-react";
import { CRM_GOLD } from "@/app/dashboard/(auth)/crm/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="sticky bottom-4 z-10 border-[#C5A572]/15 bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Les raccourcis à utiliser sans quitter le dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Button
            type="button"
            className="justify-between border-0 text-white hover:opacity-95"
            style={{ backgroundColor: CRM_GOLD }}>
            <span className="flex items-center gap-2">
              <Plus className="size-4" />
              Ajouter salon
            </span>
          </Button>
          <Button type="button" variant="outline" className="justify-between">
            <span className="flex items-center gap-2">
              <Search className="size-4" />
              Rechercher
            </span>
          </Button>
          <Button type="button" variant="outline" className="justify-between">
            <span className="flex items-center gap-2">
              <SendHorizontal className="size-4" />
              Lancer outreach
            </span>
          </Button>
          <Button type="button" variant="outline" className="justify-between">
            <span className="flex items-center gap-2">
              <Bot className="size-4" />
              Réveiller agent
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
