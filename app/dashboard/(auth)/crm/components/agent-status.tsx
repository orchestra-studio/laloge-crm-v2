"use client";

import { Bot, CircleAlert, CircleCheckBig, Clock3 } from "lucide-react";
import { dashboardAgentStatuses, formatRelativeDate } from "@/app/dashboard/(auth)/crm/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function getAgentStatusMeta(status: "active" | "warning" | "error") {
  if (status === "active") {
    return {
      label: "Actif",
      dotClassName: "bg-emerald-500",
      icon: CircleCheckBig,
      iconClassName: "text-emerald-600"
    };
  }

  if (status === "warning") {
    return {
      label: "Surveillance",
      dotClassName: "bg-amber-500",
      icon: Clock3,
      iconClassName: "text-amber-600"
    };
  }

  return {
    label: "Erreur",
    dotClassName: "bg-rose-500",
    icon: CircleAlert,
    iconClassName: "text-rose-600"
  };
}

export function AgentStatusSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Statut des agents</h2>
        <p className="text-muted-foreground text-sm">
          Dernière exécution et volume traité aujourd’hui.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardAgentStatuses.map((agent) => {
          const statusMeta = getAgentStatusMeta(agent.status);
          const StatusIcon = statusMeta.icon;

          return (
            <Card key={agent.agent_name} className="gap-3 py-4 shadow-xs">
              <CardHeader className="px-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-full border bg-muted">
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{agent.agent_name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                        <span className={cn("size-2 rounded-full", statusMeta.dotClassName)} />
                        {statusMeta.label}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[11px]">
                    IA
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-4">
                <div className="flex items-center gap-2 text-sm">
                  <StatusIcon className={cn("size-4", statusMeta.iconClassName)} />
                  <span>{formatRelativeDate(agent.last_run_at)}</span>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Éléments traités</p>
                  <p className="mt-1 text-2xl font-semibold">{agent.items_processed_today}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
