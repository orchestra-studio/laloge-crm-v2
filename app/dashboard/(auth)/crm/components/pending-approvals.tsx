"use client";

import * as React from "react";
import { Check, Clock3, X } from "lucide-react";
import {
  agentActionTypeMeta,
  dashboardPendingApprovals,
  formatRelativeDate
} from "@/app/dashboard/(auth)/crm/data";
import type { AgentActionRow } from "@/app/dashboard/(auth)/crm/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getPayloadPreview(action: AgentActionRow) {
  if (!action.payload) {
    return null;
  }

  switch (action.action_type) {
    case "launch_outreach":
      return `Séquence ${(action.payload.sequence_name as string | undefined) ?? "premium"}`;
    case "update_status":
      return `Vers ${(action.payload.to_status as string | undefined) ?? "interesse"}`;
    case "create_contact":
      return `Contact ${(action.payload.contact_name as string | undefined) ?? "nouveau"}`;
    case "assign_brand":
      return `Marque ${(action.payload.brand_name as string | undefined) ?? "à confirmer"}`;
    case "schedule_followup":
      return `Échéance ${(action.payload.due_at as string | undefined) ?? "à planifier"}`;
    case "generate_dossier":
      return `Template ${(action.payload.template as string | undefined) ?? "standard"}`;
    default:
      return null;
  }
}

export function PendingApprovalsCard() {
  const [items, setItems] = React.useState(dashboardPendingApprovals);

  const handleDecision = React.useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Approvals en attente</CardTitle>
            <CardDescription>
              Actions proposées par les agents depuis agent_actions.
            </CardDescription>
          </div>
          <Badge variant="destructive">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="space-y-3">
            {items.map((action) => {
              const payloadPreview = getPayloadPreview(action);
              const actionMeta = agentActionTypeMeta[action.action_type as keyof typeof agentActionTypeMeta];

              return (
                <div key={action.id} className="rounded-xl border border-border/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{action.agent_name}</p>
                        <Badge variant="outline">{actionMeta?.label ?? action.action_type}</Badge>
                      </div>
                      <p className="text-sm leading-6 text-balance">
                        <span className="font-medium">{action.entity_name}</span>
                        {payloadPreview ? (
                          <span className="text-muted-foreground"> · {payloadPreview}</span>
                        ) : null}
                      </p>
                      {action.approval_reason ? (
                        <p className="text-muted-foreground text-sm leading-5">
                          {action.approval_reason}
                        </p>
                      ) : null}
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <Clock3 className="size-3.5" />
                        {formatRelativeDate(action.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="xs"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      onClick={() => handleDecision(action.id)}>
                      <Check className="size-3.5" />
                      Approuver
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDecision(action.id)}>
                      <X className="size-3.5" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed text-center">
            <div className="space-y-2">
              <p className="font-medium">Aucune approval en attente</p>
              <p className="text-muted-foreground text-sm">
                Les nouvelles propositions d’agents apparaîtront ici.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
