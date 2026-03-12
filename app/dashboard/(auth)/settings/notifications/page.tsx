"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const notificationsFormSchema = z.object({
  cadence: z.enum(["all", "important", "none"], {
    required_error: "Choisissez une cadence."
  }),
  emailApprovals: z.boolean(),
  emailOutreach: z.boolean(),
  emailReports: z.boolean(),
  emailSecurity: z.boolean(),
  mobileOverride: z.boolean()
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const defaultValues: NotificationsFormValues = {
  cadence: "important",
  emailApprovals: true,
  emailOutreach: true,
  emailReports: false,
  emailSecurity: true,
  mobileOverride: false
};

export default function SettingsNotificationsPage() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues
  });

  function onSubmit(data: NotificationsFormValues) {
    toast.success("Notifications mises à jour", {
      description: `Cadence sélectionnée : ${data.cadence}.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choisissez ce qui remonte par email et ce qui reste uniquement dans le CRM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="cadence"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Me notifier à propos de…</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2">
                      <FormItem className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium">Tout</FormLabel>
                          <FormDescription>Nouveaux messages, outreach, approbations et agents.</FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <RadioGroupItem value="important" />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium">Important seulement</FormLabel>
                          <FormDescription>Approvals, réponses salons et alertes agents.</FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <div>
                          <FormLabel className="font-medium">Silencieux</FormLabel>
                          <FormDescription>Aucune notification hors sécurité.</FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emails</h3>
              {[
                {
                  name: "emailApprovals" as const,
                  title: "Approbations agents",
                  description: "Recevoir un email lorsqu’une validation humaine est requise."
                },
                {
                  name: "emailOutreach" as const,
                  title: "Réponses outreach",
                  description: "Recevoir un email lorsqu’un salon répond à une séquence ou campagne."
                },
                {
                  name: "emailReports" as const,
                  title: "Rapports hebdo",
                  description: "Recevoir le rapport hebdomadaire et les exports de performance."
                },
                {
                  name: "emailSecurity" as const,
                  title: "Sécurité",
                  description: "Toujours actif pour les alertes sensibles et connexions." 
                }
              ].map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{item.title}</FormLabel>
                        <FormDescription>{item.description}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name="mobileOverride"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-xl border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel>Utiliser des réglages mobiles différents</FormLabel>
                    <FormDescription>
                      Activez un comportement distinct pour les notifications sur mobile.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer les notifications</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
