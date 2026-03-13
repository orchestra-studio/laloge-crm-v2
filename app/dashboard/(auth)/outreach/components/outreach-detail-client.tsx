"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarClockIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  emailTemplates,
  getOutreachItemById,
  type Campaign,
  type OutreachSequence,
  type SequenceStep
} from "../data/mock-outreach";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const chartConfig = {
  sent: { label: "Envoyés", color: "var(--chart-1)" },
  opened: { label: "Ouverts", color: "var(--chart-2)" },
  replied: { label: "Réponses", color: "var(--chart-3)" }
} satisfies ChartConfig;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
});

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

function getStatusVariant(status: string) {
  switch (status) {
    case "sent":
      return "default" as const;
    case "scheduled":
      return "secondary" as const;
    case "draft":
      return "outline" as const;
    default:
      return "info" as const;
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
    default:
      return status;
  }
}

function SequenceEditor({ sequence }: { sequence: OutreachSequence }) {
  const [name, setName] = React.useState(sequence.name);
  const [description, setDescription] = React.useState(sequence.description);
  const [isActive, setIsActive] = React.useState(sequence.isActive);
  const [steps, setSteps] = React.useState<SequenceStep[]>(sequence.steps);

  const performanceData = steps.map((step) => ({
    step: `Étape ${step.order}`,
    sent: step.sent,
    opened: step.opened,
    replied: step.replied
  }));

  const moveStep = (index: number, direction: -1 | 1) => {
    setSteps((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      const [removed] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, removed);
      return copy.map((step, stepIndex) => ({ ...step, order: stepIndex + 1 }));
    });
  };

  const updateStep = (id: string, patch: Partial<SequenceStep>) => {
    setSteps((current) => current.map((step) => (step.id === id ? { ...step, ...patch } : step)));
  };

  const removeStep = (id: string) => {
    setSteps((current) =>
      current
        .filter((step) => step.id !== id)
        .map((step, index) => ({
          ...step,
          order: index + 1
        }))
    );
  };

  const addStep = () => {
    setSteps((current) => [
      ...current,
      {
        id: `step-${Date.now()}`,
        order: current.length + 1,
        delayDays: current.length + 1,
        channel: "email",
        title: "Nouvelle étape",
        templateId: emailTemplates[0]?.id ?? "",
        preview: "Rédigez le contenu de cette étape.",
        goal: "Créer de l’intérêt",
        sent: 0,
        opened: 0,
        replied: 0
      }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" asChild className="-ml-3">
              <Link prefetch={false} href="/dashboard/outreach">
                <ArrowLeftIcon />
                Retour à Outreach
              </Link>
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "En pause"}</Badge>
            <Badge variant="outline">{sequence.brand}</Badge>
          </div>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-3 h-auto border-none px-0 text-3xl font-semibold shadow-none focus-visible:ring-0"
          />
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-3 min-h-24 max-w-3xl"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
            <span className="text-sm text-muted-foreground">Active</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <Button variant="outline">
            <CalendarClockIcon />
            Programmer
          </Button>
          <Button>
            <SaveIcon />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Inscrits</p>
            <p className="mt-1 text-3xl font-semibold">{sequence.enrolledCount}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Réponses</p>
            <p className="mt-1 text-3xl font-semibold">{sequence.stats.replied}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">RDV générés</p>
            <p className="mt-1 text-3xl font-semibold">{sequence.stats.meetings}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Workflow visuel</CardTitle>
              <CardDescription>CRUD complet des étapes avec réordonnancement.</CardDescription>
            </div>
            <Button size="sm" onClick={addStep}>
              <PlusIcon />
              Ajouter une étape
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="rounded-2xl border p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Étape {step.order}</Badge>
                      <Badge variant="secondary">{getChannelLabel(step.channel)}</Badge>
                      <Badge variant="outline">J+{step.delayDays}</Badge>
                    </div>
                    <Input
                      value={step.title}
                      onChange={(event) => updateStep(step.id, { title: event.target.value })}
                      placeholder="Titre de l’étape"
                    />
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <p className="mb-2 text-sm font-medium">Canal</p>
                        <Select
                          value={step.channel}
                          onValueChange={(value) =>
                            updateStep(step.id, {
                              channel: value as SequenceStep["channel"]
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Appel</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">Template</p>
                        <Select
                          value={step.templateId}
                          onValueChange={(value) => updateStep(step.id, { templateId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {emailTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium">Délai (jours)</p>
                        <Input
                          type="number"
                          value={step.delayDays}
                          onChange={(event) =>
                            updateStep(step.id, {
                              delayDays: Number(event.target.value)
                            })
                          }
                        />
                      </div>
                    </div>
                    <Textarea
                      value={step.preview}
                      onChange={(event) => updateStep(step.id, { preview: event.target.value })}
                      className="min-h-24"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveStep(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveStep(index, 1)}
                      disabled={index === steps.length - 1}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => removeStep(step.id)}>
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par étape</CardTitle>
              <CardDescription>Ouvertures, réponses et efficacité par touchpoint.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[260px] w-full" config={chartConfig}>
                <BarChart data={performanceData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="step" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sent" fill="var(--color-sent)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="opened" fill="var(--color-opened)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="replied" fill="var(--color-replied)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrollments</CardTitle>
              <CardDescription>Salons inscrits et statut courant par étape.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-xl border p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salon</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Étape</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sequence.enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div className="font-medium">{enrollment.salon}</div>
                        <div className="text-xs text-muted-foreground">{enrollment.city}</div>
                      </TableCell>
                      <TableCell>
                        <div>{enrollment.contact}</div>
                        <div className="text-xs text-muted-foreground">{enrollment.owner}</div>
                      </TableCell>
                      <TableCell>Étape {enrollment.currentStep}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{enrollment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CampaignEditor({ campaign }: { campaign: Campaign }) {
  const [name, setName] = React.useState(campaign.name);
  const [subject, setSubject] = React.useState(campaign.subject);
  const [status, setStatus] = React.useState<Campaign["status"]>(campaign.status);
  const [body, setBody] = React.useState(campaign.body);

  const performanceData = [
    { metric: "Envoyés", value: campaign.sent || campaign.recipients },
    { metric: "Ouverts", value: campaign.opened },
    { metric: "Clics", value: campaign.clicked },
    { metric: "Réponses", value: campaign.replies }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link prefetch={false} href="/dashboard/outreach">
              <ArrowLeftIcon />
              Retour à Outreach
            </Link>
          </Button>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
            <Badge variant="outline">{campaign.segment}</Badge>
          </div>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-3 h-auto border-none px-0 text-3xl font-semibold shadow-none focus-visible:ring-0"
          />
          <Input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="mt-3 max-w-3xl"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={status} onValueChange={(value) => setStatus(value as Campaign["status"])}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="scheduled">Planifiée</SelectItem>
              <SelectItem value="sent">Envoyée</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <CalendarClockIcon />
            Programmer
          </Button>
          <Button>
            <SaveIcon />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Destinataires</p>
            <p className="mt-1 text-3xl font-semibold">{campaign.recipients}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Ouvertures</p>
            <p className="mt-1 text-3xl font-semibold">{campaign.opened}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Clics</p>
            <p className="mt-1 text-3xl font-semibold">{campaign.clicked}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Réponses</p>
            <p className="mt-1 text-3xl font-semibold">{campaign.replies}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Éditeur campagne</CardTitle>
            <CardDescription>
              Contenu éditable avec prévisualisation, prêt pour envoi ou programmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[300px] max-h-[640px]" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>
                Planifiée le {dateFormatter.format(new Date(campaign.scheduledFor))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[250px] w-full" config={chartConfig}>
                <BarChart data={performanceData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="metric" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-sent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destinataires</CardTitle>
              <CardDescription>Vue compacte des premiers contacts touchés.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-xl border p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Salon</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.recipientsList.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell>
                        <div className="font-medium">{recipient.contact}</div>
                        <div className="text-xs text-muted-foreground">{recipient.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{recipient.salon}</div>
                        <div className="text-xs text-muted-foreground">{recipient.city}</div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OutreachDetailClient({ id }: { id: string }) {
  const item = getOutreachItemById(id);

  if (!item) {
    return null;
  }

  return item.kind === "sequence" ? (
    <SequenceEditor sequence={item.data} />
  ) : (
    <CampaignEditor campaign={item.data} />
  );
}
