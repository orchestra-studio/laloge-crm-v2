"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { agentAutoRules, agentKeys, type AgentKey } from "../components/mock-settings";
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

const agentSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  key: z.string().min(4, "Clé requise"),
  permissions: z.string().min(4, "Permissions requises"),
  active: z.boolean()
});

type AgentFormValues = z.infer<typeof agentSchema>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
});

export default function SettingsAgentsPage() {
  const [keys, setKeys] = React.useState<AgentKey[]>(agentKeys);
  const [open, setOpen] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<AgentKey | null>(null);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      key: "",
      permissions: "read:salons, write:outreach",
      active: true
    }
  });

  const openCreate = () => {
    setEditingAgent(null);
    form.reset({
      name: "",
      key: "",
      permissions: "read:salons, write:outreach",
      active: true
    });
    setOpen(true);
  };

  const openEdit = (agent: AgentKey) => {
    setEditingAgent(agent);
    form.reset({
      name: agent.name,
      key: agent.key,
      permissions: agent.permissions.join(", "),
      active: agent.active
    });
    setOpen(true);
  };

  const onSubmit = (data: AgentFormValues) => {
    const payload = {
      name: data.name,
      key: data.key,
      permissions: data.permissions.split(",").map((item) => item.trim()).filter(Boolean),
      active: data.active
    };

    if (editingAgent) {
      setKeys((current) =>
        current.map((agent) =>
          agent.id === editingAgent.id
            ? { ...agent, ...payload }
            : agent
        )
      );
      toast.success("Agent mis à jour");
    } else {
      setKeys((current) => [
        {
          id: `agent-${Date.now()}`,
          lastUsed: new Date().toISOString(),
          ...payload
        },
        ...current
      ]);
      toast.success("Nouvel agent ajouté");
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Clés agents IA</CardTitle>
            <CardDescription>
              Table des agents, permissions, dernière utilisation et activation.
            </CardDescription>
          </div>
          <Button onClick={openCreate}>
            <PlusIcon />
            Ajouter un agent
          </Button>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-xl border p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Clé</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Dernière utilisation</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.key}</TableCell>
                  <TableCell className="max-w-[18rem] whitespace-normal text-muted-foreground">
                    {agent.permissions.join(", ")}
                  </TableCell>
                  <TableCell>{dateFormatter.format(new Date(agent.lastUsed))}</TableCell>
                  <TableCell>
                    <Switch
                      checked={agent.active}
                      onCheckedChange={(checked) =>
                        setKeys((current) =>
                          current.map((entry) => (entry.id === agent.id ? { ...entry, active: checked } : entry))
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(agent)}>
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setKeys((current) => current.filter((entry) => entry.id !== agent.id))}
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

      <Card>
        <CardHeader>
          <CardTitle>Auto-rules</CardTitle>
          <CardDescription>Règles d’auto-approbation liées aux agents et workflows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {agentAutoRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between gap-4 rounded-2xl border p-4">
              <div>
                <p className="font-medium">{rule.rule}</p>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
              <Switch defaultChecked={rule.active} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingAgent ? "Modifier l’agent" : "Nouvel agent"}</DialogTitle>
            <DialogDescription>
              Configurez la clé, les permissions et l’état d’activation.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
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
                      <FormLabel>Agent actif</FormLabel>
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
