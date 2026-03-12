"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";

import { emailTemplates } from "../../outreach/data/mock-outreach";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichTextEditorDemo } from "@/components/ui/custom/tiptap/rich-text-editor";

const templateSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  subject: z.string().min(4, "Sujet requis"),
  category: z.string().min(2, "Catégorie requise"),
  variables: z.string().min(2, "Variables requises"),
  body: z.string().min(10, "Contenu requis")
});

type TemplateValues = z.infer<typeof templateSchema>;

type TemplateItem = (typeof emailTemplates)[number];

export default function SettingsTemplatesPage() {
  const [templates, setTemplates] = React.useState<TemplateItem[]>(emailTemplates);
  const [selectedId, setSelectedId] = React.useState(emailTemplates[0]?.id ?? "");

  const selectedTemplate =
    templates.find((template) => template.id === selectedId) ?? templates[0];

  const form = useForm<TemplateValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: selectedTemplate?.name ?? "",
      subject: selectedTemplate?.subject ?? "",
      category: selectedTemplate?.category ?? "",
      variables: selectedTemplate?.variables.join(", ") ?? "",
      body: selectedTemplate?.body ?? ""
    }
  });

  React.useEffect(() => {
    if (!selectedTemplate) return;
    form.reset({
      name: selectedTemplate.name,
      subject: selectedTemplate.subject,
      category: selectedTemplate.category,
      variables: selectedTemplate.variables.join(", "),
      body: selectedTemplate.body
    });
  }, [form, selectedTemplate]);

  const addTemplate = () => {
    const newTemplate: TemplateItem = {
      id: `tpl-${Date.now()}`,
      name: "Nouveau template",
      subject: "Nouveau sujet",
      category: "Prospection",
      preview: "Template en cours de rédaction.",
      variables: ["{{salon_name}}"],
      tone: "Neutre",
      usageCount: 0,
      updatedAt: new Date().toISOString(),
      body: "<p>Rédigez votre template ici.</p>"
    };
    setTemplates((current) => [newTemplate, ...current]);
    setSelectedId(newTemplate.id);
  };

  const removeCurrent = () => {
    if (!selectedTemplate) return;
    const remaining = templates.filter((template) => template.id !== selectedTemplate.id);
    setTemplates(remaining);
    setSelectedId(remaining[0]?.id ?? "");
  };

  const onSubmit = (data: TemplateValues) => {
    if (!selectedTemplate) return;
    setTemplates((current) =>
      current.map((template) =>
        template.id === selectedTemplate.id
          ? {
              ...template,
              name: data.name,
              subject: data.subject,
              category: data.category,
              variables: data.variables.split(",").map((item) => item.trim()).filter(Boolean),
              body: data.body,
              preview: data.body.replace(/<[^>]+>/g, " ").trim().slice(0, 140),
              updatedAt: new Date().toISOString()
            }
          : template
      )
    );
    toast.success("Template enregistré");
  };

  if (!selectedTemplate) {
    return (
      <Card>
        <CardContent className="flex min-h-60 items-center justify-center">
          <Button onClick={addTemplate}>
            <PlusIcon />
            Créer le premier template
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Templates email</CardTitle>
            <CardDescription>Bibliothèque partagée avec Outreach.</CardDescription>
          </div>
          <Button size="icon" onClick={addTemplate}>
            <PlusIcon />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[720px]">
            <div className="space-y-2 p-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedId(template.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                    selectedId === template.id ? "bg-muted/70" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{template.preview}</p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Éditeur template</CardTitle>
            <CardDescription>Nom, sujet, variables et contenu riche TipTap.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={removeCurrent}>
              <Trash2Icon />
              Supprimer
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <SaveIcon />
              Enregistrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sujet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="variables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variables</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu</FormLabel>
                    <FormControl>
                      <RichTextEditorDemo
                        value={field.value}
                        onChange={(value) => field.onChange(String(value))}
                        className="max-h-[520px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
