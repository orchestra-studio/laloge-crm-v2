"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CalendarClockIcon,
  ChevronRightIcon,
  MailPlusIcon,
  MessageSquareShareIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  UsersIcon
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Funnel, FunnelChart, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  campaigns,
  emailTemplates,
  outreachHistory,
  outreachSequences,
  outreachStats,
  type Campaign,
  type EmailTemplate,
  type OutreachRecord,
  type OutreachSequence
} from "../data/mock-outreach";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { RichTextEditorDemo } from "@/components/ui/custom/tiptap/rich-text-editor";
import { OutreachHistoryTable } from "./outreach-history-table";

type OutreachTab = "sequences" | "campaigns" | "templates" | "history";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
});

const chartConfig = {
  sent: { label: "Envoyés", color: "var(--chart-1)" },
  opened: { label: "Ouverts", color: "var(--chart-2)" },
  replied: { label: "Réponses", color: "var(--chart-3)" },
  clicked: { label: "Clics", color: "var(--chart-4)" }
} satisfies ChartConfig;

function getStatusVariant(status: string) {
  switch (status) {
    case "sent":
    case "active":
      return "default" as const;
    case "opened":
    case "clicked":
      return "info" as const;
    case "replied":
    case "completed":
      return "success" as const;
    case "paused":
    case "scheduled":
      return "secondary" as const;
    case "bounced":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "scheduled":
      return "Planifiée";
    case "sent":
      return "Envoyée";
    case "opened":
      return "Ouverte";
    case "clicked":
      return "Cliquée";
    case "replied":
      return "Réponse";
    case "bounced":
      return "Bounce";
    case "active":
      return "Active";
    case "paused":
      return "En pause";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
}

function getChannelLabel(channel: string) {
  switch (channel) {
    case "email":
      return "Email";
    case "phone":
      return "Appel";
    case "sms":
      return "SMS";
    default:
      return channel;
  }
}

function getTemplatePreview(template: EmailTemplate) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{template.category}</Badge>
            <Badge variant="secondary">{template.tone}</Badge>
          </div>
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.subject}</p>
          </div>
        </div>
        <Badge variant="outline">{template.usageCount} usages</Badge>
      </div>
      <Separator />
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Variables</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <Badge key={variable} variant="outline">
                {variable}
              </Badge>
            ))}
          </div>
        </div>
        <div className="rounded-xl border">
          <RichTextEditorDemo value={template.body} editable={false} className="max-h-[460px]" />
        </div>
      </div>
    </div>
  );
}

function SequencePreview({ sequence }: { sequence: OutreachSequence }) {
  const sequenceChartData = sequence.steps.map((step) => ({
    step: `J+${step.delayDays}`,
    sent: step.sent,
    opened: step.opened,
    replied: step.replied
  }));

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={sequence.isActive ? "default" : "secondary"}>
                {sequence.isActive ? "Active" : "En pause"}
              </Badge>
              <Badge variant="outline">{sequence.brand}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{sequence.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{sequence.description}</p>
          </div>
          <Button asChild size="sm">
            <Link prefetch={false} href={`/dashboard/outreach/${sequence.id}`}>
              Voir le détail
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Inscrits</p>
              <p className="mt-1 text-2xl font-semibold">{sequence.enrolledCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Taux de réponse</p>
              <p className="mt-1 text-2xl font-semibold">
                {Math.round((sequence.stats.replied / Math.max(sequence.stats.sent, 1)) * 100)}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Workflow</CardTitle>
            <CardDescription>{sequence.objective}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sequence.steps.map((step) => (
              <div key={step.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Étape {step.order}</Badge>
                      <Badge variant="secondary">{getChannelLabel(step.channel)}</Badge>
                      <Badge variant="outline">J+{step.delayDays}</Badge>
                    </div>
                    <p className="mt-2 font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.preview}</p>
                  </div>
                  <ChevronRightIcon className="text-muted-foreground size-4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance par étape</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[210px] w-full" config={chartConfig}>
              <BarChart data={sequenceChartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="step" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar radius={[6, 6, 0, 0]} dataKey="sent" fill="var(--color-sent)" />
                <Bar radius={[6, 6, 0, 0]} dataKey="opened" fill="var(--color-opened)" />
                <Bar radius={[6, 6, 0, 0]} dataKey="replied" fill="var(--color-replied)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CampaignPreview({ campaign }: { campaign: Campaign }) {
  const performanceData = [
    { stage: "Envoyés", value: campaign.sent || campaign.recipients },
    { stage: "Ouverts", value: campaign.opened },
    { stage: "Clics", value: campaign.clicked },
    { stage: "Réponses", value: campaign.replies }
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(campaign.status)}>{getStatusLabel(campaign.status)}</Badge>
              <Badge variant="outline">{campaign.segment}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{campaign.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{campaign.subject}</p>
          </div>
          <Button asChild size="sm">
            <Link prefetch={false} href={`/dashboard/outreach/${campaign.id}`}>
              Ouvrir
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Destinataires</p>
              <p className="mt-1 text-2xl font-semibold">{campaign.recipients}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Ouvertures</p>
              <p className="mt-1 text-2xl font-semibold">{campaign.opened}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Clics</p>
              <p className="mt-1 text-2xl font-semibold">{campaign.clicked}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Réponses</p>
              <p className="mt-1 text-2xl font-semibold">{campaign.replies}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Funnel campagne</CardTitle>
            <CardDescription>{campaign.audience}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[220px] w-full" config={chartConfig}>
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="stage" labelKey="stage" />} />
                <Funnel dataKey="value" data={performanceData} isAnimationActive>
                  {performanceData.map((entry) => (
                    <CellLike key={entry.stage} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aperçu du message</CardTitle>
            <CardDescription>
              Programmée le {dateFormatter.format(new Date(campaign.scheduledFor))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border">
              <RichTextEditorDemo value={campaign.body} editable={false} className="max-h-[320px]" />
            </div>
            <div className="rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Salon</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.recipientsList.slice(0, 4).map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <div className="font-medium">{recipient.contact}</div>
                        <div className="text-xs text-muted-foreground">{recipient.email}</div>
                      </TableCell>
                      <TableCell>
                        {recipient.salon}
                        <div className="text-xs text-muted-foreground">{recipient.city}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {recipient.replied ? (
                            <Badge variant="success">Réponse</Badge>
                          ) : recipient.clicked ? (
                            <Badge variant="info">Cliqué</Badge>
                          ) : recipient.opened ? (
                            <Badge variant="secondary">Ouvert</Badge>
                          ) : recipient.bounced ? (
                            <Badge variant="destructive">Bounce</Badge>
                          ) : (
                            <Badge variant="outline">Envoyé</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HistoryPreview({ record }: { record: OutreachRecord }) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getChannelLabel(record.channel)}</Badge>
              <Badge variant={getStatusVariant(record.status)}>{getStatusLabel(record.status)}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-semibold">{record.salon}</h3>
            <p className="text-sm text-muted-foreground">
              {record.contact} • {record.city}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{dateFormatter.format(new Date(record.date))}</p>
        </div>
      </div>
      <Separator />
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aperçu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{record.contentPreview}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: record.content }}
            />
          </CardContent>
        </Card>

        {(record.sequenceId || record.campaignId) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Liens utiles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {record.sequenceId ? (
                <Button variant="outline" asChild>
                  <Link prefetch={false} href={`/dashboard/outreach/${record.sequenceId}`}>Voir la séquence</Link>
                </Button>
              ) : null}
              {record.campaignId ? (
                <Button variant="outline" asChild>
                  <Link prefetch={false} href={`/dashboard/outreach/${record.campaignId}`}>Voir la campagne</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MobileOutreachLayout({
  currentTab,
  setCurrentTab,
  selectedSequence,
  setSelectedSequenceId,
  selectedCampaign,
  setSelectedCampaignId,
  selectedTemplate,
  setSelectedTemplateId,
  selectedHistory,
  setSelectedHistoryId,
  search,
  setSearch,
  sequences,
  filteredCampaigns,
  filteredTemplates
}: {
  currentTab: OutreachTab;
  setCurrentTab: (value: OutreachTab) => void;
  selectedSequence: OutreachSequence;
  setSelectedSequenceId: (value: string) => void;
  selectedCampaign: Campaign;
  setSelectedCampaignId: (value: string) => void;
  selectedTemplate: EmailTemplate;
  setSelectedTemplateId: (value: string) => void;
  selectedHistory: OutreachRecord;
  setSelectedHistoryId: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  sequences: OutreachSequence[];
  filteredCampaigns: Campaign[];
  filteredTemplates: EmailTemplate[];
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-background p-4">
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OutreachTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sequences">Séquences</TabsTrigger>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
      </Tabs>

      {currentTab !== "history" ? (
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher"
            className="pl-9"
          />
        </div>
      ) : null}

      {currentTab === "sequences" && (
        <div className="space-y-3">
          {sequences.map((sequence) => (
            <button
              key={sequence.id}
              type="button"
              onClick={() => setSelectedSequenceId(sequence.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left",
                selectedSequence.id === sequence.id && "bg-muted/60"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{sequence.name}</p>
                  <p className="text-sm text-muted-foreground">{sequence.description}</p>
                </div>
                <Badge variant={sequence.isActive ? "default" : "secondary"}>
                  {sequence.isActive ? "Active" : "Pause"}
                </Badge>
              </div>
            </button>
          ))}
          <SequencePreview sequence={selectedSequence} />
        </div>
      )}

      {currentTab === "campaigns" && (
        <div className="space-y-3">
          {filteredCampaigns.map((campaign) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => setSelectedCampaignId(campaign.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left",
                selectedCampaign.id === campaign.id && "bg-muted/60"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                </div>
                <Badge variant={getStatusVariant(campaign.status)}>{getStatusLabel(campaign.status)}</Badge>
              </div>
            </button>
          ))}
          <CampaignPreview campaign={selectedCampaign} />
        </div>
      )}

      {currentTab === "templates" && (
        <div className="space-y-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedTemplateId(template.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left",
                selectedTemplate.id === template.id && "bg-muted/60"
              )}
            >
              <p className="font-medium">{template.name}</p>
              <p className="text-sm text-muted-foreground">{template.subject}</p>
            </button>
          ))}
          {getTemplatePreview(selectedTemplate)}
        </div>
      )}

      {currentTab === "history" && (
        <div className="space-y-4">
          <OutreachHistoryTable
            data={outreachHistory}
            selectedId={selectedHistory.id}
            onSelect={(record) => setSelectedHistoryId(record.id)}
          />
          <HistoryPreview record={selectedHistory} />
        </div>
      )}
    </div>
  );
}

function CellLike() {
  return null;
}

export function OutreachWorkspace() {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = React.useState<OutreachTab>("sequences");
  const [search, setSearch] = React.useState("");
  const [selectedSequenceId, setSelectedSequenceId] = React.useState(outreachSequences[0]?.id ?? "");
  const [selectedCampaignId, setSelectedCampaignId] = React.useState(campaigns[0]?.id ?? "");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(emailTemplates[0]?.id ?? "");
  const [selectedHistoryId, setSelectedHistoryId] = React.useState(outreachHistory[0]?.id ?? "");
  const [activeStates, setActiveStates] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(outreachSequences.map((sequence) => [sequence.id, sequence.isActive]))
  );

  const sequences = React.useMemo(() => {
    return outreachSequences
      .map((sequence) => ({
        ...sequence,
        isActive: activeStates[sequence.id] ?? sequence.isActive
      }))
      .filter((sequence) => {
        if (!search) return true;
        return [sequence.name, sequence.description, sequence.brand, sequence.audience]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      });
  }, [activeStates, search]);

  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter((campaign) => {
      if (!search) return true;
      return [campaign.name, campaign.subject, campaign.segment, campaign.audience]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [search]);

  const filteredTemplates = React.useMemo(() => {
    return emailTemplates.filter((template) => {
      if (!search) return true;
      return [template.name, template.subject, template.category, template.preview]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [search]);

  const selectedSequence =
    sequences.find((sequence) => sequence.id === selectedSequenceId) ??
    outreachSequences.find((sequence) => sequence.id === selectedSequenceId) ??
    outreachSequences[0];
  const selectedCampaign =
    filteredCampaigns.find((campaign) => campaign.id === selectedCampaignId) ??
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ??
    campaigns[0];
  const selectedTemplate =
    filteredTemplates.find((template) => template.id === selectedTemplateId) ??
    emailTemplates.find((template) => template.id === selectedTemplateId) ??
    emailTemplates[0];
  const selectedHistory =
    outreachHistory.find((record) => record.id === selectedHistoryId) ?? outreachHistory[0];

  const funnelData = [
    { stage: "Envoyés", value: 404 },
    { stage: "Ouverts", value: 231 },
    { stage: "Réponses", value: 72 },
    { stage: "RDV", value: 26 }
  ];

  if (!selectedSequence || !selectedCampaign || !selectedTemplate || !selectedHistory) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SparklesIcon className="size-4" />
            Outreach piloté par séquences, campagnes et templates réutilisables
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Outreach</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Une vue opératrice inspirée du client mail : listes au centre, aperçu à droite, création
            rapide pour piloter les séquences et campagnes de La Loge.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <MailPlusIcon />
            Nouveau template
          </Button>
          <Button variant="outline">
            <CalendarClockIcon />
            Nouvelle campagne
          </Button>
          <Button>
            <SendIcon />
            Nouvelle séquence
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Séquences actives</p>
                <p className="mt-1 text-2xl font-semibold">{outreachStats.activeSequences}</p>
              </div>
              <MessageSquareShareIcon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campagnes envoyées</p>
                <p className="mt-1 text-2xl font-semibold">{outreachStats.campaignsSentThisMonth}</p>
              </div>
              <SendIcon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Réponse moyenne</p>
                <p className="mt-1 text-2xl font-semibold">{outreachStats.replyRate}%</p>
              </div>
              <BarChart3Icon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actions à traiter</p>
                <p className="mt-1 text-2xl font-semibold">{outreachStats.pendingActions}</p>
              </div>
              <UsersIcon className="text-muted-foreground size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-none">
        <CardContent className="rounded-2xl border bg-background p-0">
          {isMobile ? (
            <MobileOutreachLayout
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              selectedSequence={selectedSequence}
              setSelectedSequenceId={setSelectedSequenceId}
              selectedCampaign={selectedCampaign}
              setSelectedCampaignId={setSelectedCampaignId}
              selectedTemplate={selectedTemplate}
              setSelectedTemplateId={setSelectedTemplateId}
              selectedHistory={selectedHistory}
              setSelectedHistoryId={setSelectedHistoryId}
              search={search}
              setSearch={setSearch}
              sequences={sequences}
              filteredCampaigns={filteredCampaigns}
              filteredTemplates={filteredTemplates}
            />
          ) : (
            <ResizablePanelGroup orientation="horizontal" className="h-[860px]">
              <ResizablePanel defaultSize={18} minSize={14}>
                <div className="flex h-full flex-col">
                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Workspace
                      </p>
                      <h2 className="mt-2 text-lg font-semibold">Pilotage outreach</h2>
                    </div>
                    <div className="grid gap-2">
                      {[
                        {
                          key: "sequences",
                          label: "Séquences",
                          value: `${outreachSequences.length}`
                        },
                        {
                          key: "campaigns",
                          label: "Campagnes",
                          value: `${campaigns.length}`
                        },
                        {
                          key: "templates",
                          label: "Templates",
                          value: `${emailTemplates.length}`
                        },
                        {
                          key: "history",
                          label: "Historique",
                          value: `${outreachHistory.length}`
                        }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCurrentTab(item.key as OutreachTab)}
                          className={cn(
                            "flex items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors",
                            currentTab === item.key ? "bg-muted/70" : "hover:bg-muted/40"
                          )}
                        >
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">Vue opératrice</p>
                          </div>
                          <Badge variant={currentTab === item.key ? "default" : "outline"}>
                            {item.value}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        Funnel global
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Envoyés, ouverts, réponses et rendez-vous du mois.
                      </p>
                    </div>
                    <ChartContainer className="h-[220px] w-full" config={chartConfig}>
                      <FunnelChart>
                        <ChartTooltip content={<ChartTooltipContent labelKey="stage" nameKey="stage" />} />
                        <Funnel dataKey="value" data={funnelData} isAnimationActive />
                      </FunnelChart>
                    </ChartContainer>
                    <div className="rounded-xl border p-3">
                      <p className="text-sm font-medium">Taux d’ouverture</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={57} className="h-2" />
                        <span className="text-sm font-medium">57%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={42} minSize={32}>
                <div className="flex h-full flex-col">
                  <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OutreachTab)}>
                    <div className="flex items-center gap-3 border-b p-4">
                      <div>
                        <h2 className="text-lg font-semibold">Outreach Hub</h2>
                        <p className="text-sm text-muted-foreground">
                          Séquences, campagnes, templates et historique centralisés
                        </p>
                      </div>
                      <TabsList className="ml-auto">
                        <TabsTrigger value="sequences">Séquences</TabsTrigger>
                        <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
                        <TabsTrigger value="templates">Templates</TabsTrigger>
                        <TabsTrigger value="history">Historique</TabsTrigger>
                      </TabsList>
                    </div>
                  </Tabs>

                  {currentTab !== "history" ? (
                    <div className="border-b p-4">
                      <div className="relative">
                        <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                        <Input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Rechercher un nom, un sujet, une catégorie…"
                          className="pl-9"
                        />
                      </div>
                    </div>
                  ) : null}

                  {currentTab === "sequences" ? (
                    <ScrollArea className="min-h-0 flex-1">
                      <div className="grid gap-3 p-4">
                        {sequences.map((sequence) => {
                          const replyRate = Math.round(
                            (sequence.stats.replied / Math.max(sequence.stats.sent, 1)) * 100
                          );

                          return (
                            <button
                              key={sequence.id}
                              type="button"
                              onClick={() => setSelectedSequenceId(sequence.id)}
                              className={cn(
                                "rounded-2xl border p-4 text-left transition-colors hover:bg-muted/40",
                                selectedSequence.id === sequence.id && "bg-muted/70"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{sequence.brand}</Badge>
                                    <Badge variant={sequence.isActive ? "default" : "secondary"}>
                                      {sequence.isActive ? "Active" : "En pause"}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="font-semibold">{sequence.name}</p>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                      {sequence.description}
                                    </p>
                                  </div>
                                </div>
                                <Switch
                                  checked={sequence.isActive}
                                  onClick={(event) => event.stopPropagation()}
                                  onCheckedChange={(checked) =>
                                    setActiveStates((current) => ({
                                      ...current,
                                      [sequence.id]: checked
                                    }))
                                  }
                                />
                              </div>
                              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
                                <div>
                                  <p className="text-muted-foreground">Étapes</p>
                                  <p className="font-medium">{sequence.steps.length}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Inscrits</p>
                                  <p className="font-medium">{sequence.enrolledCount}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Envoyés</p>
                                  <p className="font-medium">{sequence.stats.sent}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Réponse</p>
                                  <p className="font-medium">{replyRate}%</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  ) : null}

                  {currentTab === "campaigns" ? (
                    <div className="min-h-0 flex-1 p-4">
                      <div className="overflow-hidden rounded-2xl border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nom</TableHead>
                              <TableHead>Sujet</TableHead>
                              <TableHead>Statut</TableHead>
                              <TableHead>Destinataires</TableHead>
                              <TableHead>Envoyés</TableHead>
                              <TableHead>Ouverts</TableHead>
                              <TableHead>Clics</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCampaigns.map((campaign) => (
                              <TableRow
                                key={campaign.id}
                                className={cn(
                                  "cursor-pointer",
                                  selectedCampaign.id === campaign.id && "bg-muted/60"
                                )}
                                onClick={() => setSelectedCampaignId(campaign.id)}
                              >
                                <TableCell>
                                  <div className="font-medium">{campaign.name}</div>
                                  <div className="text-xs text-muted-foreground">{campaign.segment}</div>
                                </TableCell>
                                <TableCell className="max-w-[18rem] whitespace-normal text-muted-foreground">
                                  {campaign.subject}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusVariant(campaign.status)}>
                                    {getStatusLabel(campaign.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{campaign.recipients}</TableCell>
                                <TableCell>{campaign.sent}</TableCell>
                                <TableCell>{campaign.opened}</TableCell>
                                <TableCell>{campaign.clicked}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : null}

                  {currentTab === "templates" ? (
                    <ScrollArea className="min-h-0 flex-1">
                      <div className="grid gap-3 p-4">
                        {filteredTemplates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => setSelectedTemplateId(template.id)}
                            className={cn(
                              "rounded-2xl border p-4 text-left transition-colors hover:bg-muted/40",
                              selectedTemplate.id === template.id && "bg-muted/70"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{template.category}</Badge>
                                  <Badge variant="secondary">{template.tone}</Badge>
                                </div>
                                <p className="mt-3 font-semibold">{template.name}</p>
                                <p className="text-sm text-muted-foreground">{template.subject}</p>
                                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                  {template.preview}
                                </p>
                              </div>
                              <Badge variant="outline">{template.usageCount}</Badge>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="outline">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : null}

                  {currentTab === "history" ? (
                    <OutreachHistoryTable
                      data={outreachHistory}
                      selectedId={selectedHistory.id}
                      onSelect={(record) => setSelectedHistoryId(record.id)}
                    />
                  ) : null}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={28}>
                <div className="h-full overflow-y-auto">
                  {currentTab === "sequences" ? <SequencePreview sequence={selectedSequence} /> : null}
                  {currentTab === "campaigns" ? <CampaignPreview campaign={selectedCampaign} /> : null}
                  {currentTab === "templates" ? getTemplatePreview(selectedTemplate) : null}
                  {currentTab === "history" ? <HistoryPreview record={selectedHistory} /> : null}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
