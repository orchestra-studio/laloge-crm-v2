import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";

type DossierTimelineKind = "analyse" | "contact" | "revue" | "generation" | "envoi";
type DossierTimelineEvent = { id: string; date: string; title: string; description: string; actor: string; kind: DossierTimelineKind };

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris"
});

function getKindMeta(kind: DossierTimelineKind) {
  switch (kind) {
    case "analyse":
      return {
        label: "Analyse",
        badgeClassName: "border-[#C5A572]/20 bg-[#FBF7F1] text-[#8C6B2D]",
        dotClassName: "bg-[#C5A572]"
      };
    case "contact":
      return {
        label: "Contact",
        badgeClassName: "border-blue-200 bg-blue-50 text-blue-800",
        dotClassName: "bg-blue-500"
      };
    case "revue":
      return {
        label: "Revue",
        badgeClassName: "border-violet-200 bg-violet-50 text-violet-800",
        dotClassName: "bg-violet-500"
      };
    case "generation":
      return {
        label: "Génération",
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
        dotClassName: "bg-emerald-500"
      };
    case "envoi":
      return {
        label: "Envoi",
        badgeClassName: "border-slate-200 bg-slate-100 text-slate-800",
        dotClassName: "bg-slate-700"
      };
  }
}

export function DossierTimeline({ events }: { events: DossierTimelineEvent[] }) {
  return (
    <Card className="border-[#C5A572]/12 bg-white shadow-sm">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-base">Timeline des interactions</CardTitle>
        <CardDescription>
          Historique des analyses, échanges et validations autour du dossier.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <Timeline defaultValue={events.length}>
          {events.map((event, index) => {
            const meta = getKindMeta(event.kind);

            return (
              <TimelineItem key={event.id} step={index + 1}>
                <TimelineIndicator className="border-transparent bg-transparent">
                  <span className={cn("block size-3 rounded-full", meta.dotClassName)} />
                </TimelineIndicator>
                <TimelineSeparator className="bg-border/80" />
                <TimelineHeader className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <TimelineDate>{timeFormatter.format(new Date(event.date))}</TimelineDate>
                    <Badge variant="outline" className={cn("rounded-full font-medium", meta.badgeClassName)}>
                      {meta.label}
                    </Badge>
                  </div>
                  <TimelineTitle className="text-sm font-semibold">{event.title}</TimelineTitle>
                </TimelineHeader>
                <TimelineContent className="space-y-2 leading-6">
                  <p>{event.description}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {event.actor}
                  </p>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
}
