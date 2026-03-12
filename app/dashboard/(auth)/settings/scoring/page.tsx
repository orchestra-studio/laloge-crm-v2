"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PencilIcon, PlusIcon, RefreshCcwIcon, Trash2Icon } from "lucide-react";

import { scoringRules, type ScoringRule } from "../components/mock-settings";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const ruleFormSchema = z.object({
  criteria: z.string().min(2, "Critère requis"),
  category: z.string().min(2, "Catégorie requise"),
  points: z.coerce.number(),
  description: z.string().min(4, "Description requise"),
  active: z.boolean()
});

type RuleFormValues = z.infer<typeof ruleFormSchema>;

const defaultValues: RuleFormValues = {
  criteria: "",
  category: "",
  points: 0,
  description: "",
  active: true
};

export default function SettingsScoringPage() {
  const [rules, setRules] = React.useState<ScoringRule[]>(scoringRules);
  const [open, setOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<ScoringRule | null>(null);

  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues
  });

  const activeRules = rules.filter((rule) => rule.active);
  const sampleScore = activeRules
    .filter((rule) => ["Téléphone détecté", "Website actif", "Google rating > 4.5", "Positionnement premium", "Déjà intéressé"].includes(rule.criteria))
    .reduce((sum, rule) => sum + rule.points, 0);

  const openCreate = () => {
    setEditingRule(null);
    form.reset(defaultValues);
    setOpen(true);
  };

  const openEdit = (rule: ScoringRule) => {
    setEditingRule(rule);
    form.reset({
      criteria: rule.criteria,
      category: rule.category,
      points: rule.points,
      description: rule.description,
      active: rule.active
    });
    setOpen(true);
  };

  const onSubmit = (data: RuleFormValues) => {
    if (editingRule) {
      setRules((current) =>
        current.map((rule) => (rule.id === editingRule.id ? { ...rule, ...data } : rule))
      );
      toast.success("Règle mise à jour");
    } else {
      setRules((current) => [
        {
          id: `rule-${Date.now()}`,
          ...data
        },
        ...current
      ]);
      toast.success("Règle ajoutée");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Règles actives</p>
            <p className="mt-1 text-3xl font-semibold">{activeRules.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Simulation salon premium</p>
            <p className="mt-1 text-3xl font-semibold">{sampleScore}/100</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-sm text-muted-foreground">Action globale</p>
              <p className="mt-1 font-medium">Relancer ScoreMaster sur toute la base</p>
            </div>
            <Button variant="outline">
              <RefreshCcwIcon />
              Recalculer tous les scores
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Règles de scoring</CardTitle>
            <CardDescription>
              CRUD des critères, catégories, points et activation des règles de calcul.
            </CardDescription>
          </div>
          <Button onClick={openCreate}>
            <PlusIcon />
            Nouvelle règle
          </Button>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-xl border p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Critère</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.criteria}</TableCell>
                  <TableCell>{rule.category}</TableCell>
                  <TableCell>{rule.points > 0 ? `+${rule.points}` : rule.points}</TableCell>
                  <TableCell className="max-w-[22rem] whitespace-normal text-muted-foreground">
                    {rule.description}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={(checked) =>
                        setRules((current) =>
                          current.map((entry) => (entry.id === rule.id ? { ...entry, active: checked } : entry))
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(rule)}>
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRules((current) => current.filter((entry) => entry.id !== rule.id))}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Modifier la règle" : "Nouvelle règle"}</DialogTitle>
            <DialogDescription>
              Définissez le critère, la catégorie et le nombre de points associés.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="criteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critère</FormLabel>
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
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <FormLabel>Règle active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
