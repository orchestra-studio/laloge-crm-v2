"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { CircleUserRoundIcon, Trash2Icon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis."),
  email: z.string().email("Email invalide."),
  phone: z.string().min(8, "Téléphone invalide."),
  role: z.string().min(2, "Le rôle est requis."),
  bio: z.string().min(10, "Ajoutez quelques informations sur le profil."),
  links: z.array(z.object({ value: z.string().url("URL invalide.") })).optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: ProfileFormValues = {
  fullName: "Ludovic Goutel",
  email: "ludovic@orchestraintelligence.fr",
  phone: "+33 6 12 34 56 78",
  role: "Admin & Strategy",
  bio: "Pilote La Loge, le dispositif CRM et les workflows commerciaux/agents pour les marques et salons.",
  links: [{ value: "https://orchestraintelligence.fr" }]
};

export default function SettingsProfilePage() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*"
  });
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const { fields, append } = useFieldArray({
    name: "links",
    control: form.control
  });

  function onSubmit(data: ProfileFormValues) {
    toast.success("Profil mis à jour", {
      description: `${data.fullName} — paramètres enregistrés localement.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
        <CardDescription>
          Identité visible dans le CRM, les emails et les partages de dossiers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Avatar className="size-20">
                <AvatarImage src={previewUrl ?? undefined} />
                <AvatarFallback>
                  <CircleUserRoundIcon className="opacity-45" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={openFileDialog}>
                  {fileName ? "Changer l’image" : "Téléverser une image"}
                </Button>
                <input
                  {...getInputProps()}
                  className="sr-only"
                  aria-label="Téléverser une image"
                  tabIndex={-1}
                />
                {fileName ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFile(files[0]?.id)}
                  >
                    <Trash2Icon />
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Nom visible dans le CRM et les emails.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Fonction affichée dans la sidebar et les partages.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio / signature</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-28" {...field} />
                  </FormControl>
                  <FormDescription>
                    Utilisée comme signature ou texte de présentation par défaut.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div>
                <FormLabel>Liens</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Site, LinkedIn, portfolio ou lien support utile.
                </p>
              </div>
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`links.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" onClick={() => append({ value: "https://" })}>
                Ajouter un lien
              </Button>
            </div>

            <Button type="submit">Mettre à jour le profil</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
