"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Sélectionnez un thème."
  }),
  density: z.enum(["comfortable", "compact"], {
    required_error: "Choisissez une densité."
  }),
  font: z.enum(["system", "manrope", "inter"], {
    required_error: "Choisissez une police."
  })
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: AppearanceFormValues = {
  theme: "light",
  density: "comfortable",
  font: "system"
};

export default function SettingsAppearancePage() {
  const { setTheme } = useTheme();
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues
  });

  function onSubmit(data: AppearanceFormValues) {
    setTheme(data.theme);
    toast.success("Préférences visuelles enregistrées", {
      description: `Thème ${data.theme === "light" ? "clair" : "sombre"}, densité ${data.density}.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
        <CardDescription>
          Le CRM est conçu pour un rendu clair et propre, avec possibilité de personnalisation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="font"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Police de l’interface</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="manrope">Manrope</SelectItem>
                      <SelectItem value="inter">Inter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Police principale utilisée dans les vues dashboard.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="density"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Densité</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une densité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="comfortable">Confortable</SelectItem>
                      <SelectItem value="compact">Compacte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Impacte le rythme visuel des listes, cartes et tables.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Thème</FormLabel>
                  <FormDescription>
                    Le mode clair reste recommandé pour les opératrices La Loge.
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid gap-4 md:grid-cols-2"
                    >
                      <label className="cursor-pointer">
                        <RadioGroupItem value="light" className="sr-only" />
                        <div className="rounded-2xl border p-3 [&:has([data-state=checked])]:border-primary">
                          <div className="space-y-2 rounded-xl bg-neutral-100 p-3">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                              <div className="h-2 w-24 rounded-full bg-neutral-200" />
                              <div className="mt-2 h-2 w-36 rounded-full bg-neutral-200" />
                            </div>
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                              <div className="h-2 w-28 rounded-full bg-neutral-200" />
                            </div>
                          </div>
                          <p className="mt-3 text-sm font-medium">Clair</p>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <RadioGroupItem value="dark" className="sr-only" />
                        <div className="rounded-2xl border p-3 [&:has([data-state=checked])]:border-primary">
                          <div className="space-y-2 rounded-xl bg-neutral-900 p-3">
                            <div className="rounded-lg bg-neutral-800 p-3">
                              <div className="h-2 w-24 rounded-full bg-neutral-500" />
                              <div className="mt-2 h-2 w-36 rounded-full bg-neutral-500" />
                            </div>
                            <div className="rounded-lg bg-neutral-800 p-3">
                              <div className="h-2 w-28 rounded-full bg-neutral-500" />
                            </div>
                          </div>
                          <p className="mt-3 text-sm font-medium">Sombre</p>
                        </div>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Enregistrer l’apparence</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
