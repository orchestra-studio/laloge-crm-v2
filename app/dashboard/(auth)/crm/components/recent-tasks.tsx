"use client";

import {
  CircleDot,
  Gauge,
  MessageSquarePlus,
  NotebookPen,
  Send,
  Sparkles,
  UserPlus,
  type LucideIcon
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  activityActionMeta,
  dashboardRecentActivity,
  formatRelativeDate
} from "@/app/dashboard/(auth)/crm/data";
import type { ActivityAction } from "@/app/dashboard/(auth)/crm/data/types";

const activityIcons: Partial<Record<ActivityAction, LucideIcon>> = {
  enriched: Sparkles,
  scored: Gauge,
  status_changed: CircleDot,
  outreach_sent: Send,
  note_added: NotebookPen,
  contact_added: UserPlus,
  "approval.approved": Sparkles,
  "approval.requested": MessageSquarePlus,
  "approval.rejected": CircleDot,
  "agent_action.approved": Sparkles,
  "agent_action.rejected": CircleDot,
  "agent_action.auto_approved": Sparkles,
  "outreach.draft_generated": Send,
  "salon.status_changed": CircleDot,
  "score.updated": Gauge
};

export function RecentTasks() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Les 10 derniers événements issus de activity_log.
            </CardDescription>
          </div>
          <Badge variant="outline">10 éléments</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[380px] pr-3">
          <div className="space-y-3">
            {dashboardRecentActivity.slice(0, 10).map((activity) => {
              const actionKey = activity.action as ActivityAction;
              const Icon = activityIcons[actionKey as keyof typeof activityIcons] ?? Sparkles;
              const actionMeta =
                activityActionMeta[actionKey as keyof typeof activityActionMeta] ??
                ({
                  label: activity.action,
                  icon_tone_class_name: "bg-slate-50 text-slate-700 border-slate-100"
                } as const);

              return (
                <div
                  key={activity.id}
                  className="rounded-xl border border-border/70 p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${actionMeta.icon_tone_class_name}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">{activity.actor_name}</span>
                        {activity.actor_type === "agent" ? (
                          <Badge variant="outline" className="text-[11px]">
                            IA
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm leading-6 text-balance">
                        <span className="text-muted-foreground">{actionMeta.label}</span>{" "}
                        <span className="font-medium">{activity.entity_name}</span>
                      </p>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <MessageSquarePlus className="size-3.5" />
                        <span>{formatRelativeDate(activity.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
