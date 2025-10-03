import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useValueJournal } from "@/hooks/useValueJournal";
import { useClients } from "@/hooks/useClients";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const entrySchema = z.object({
  client_id: z.string().min(1, "Le client est requis"),
  subscription_id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis").max(100),
  description: z.string().min(1, "La description est requise").max(1000),
  value_amount: z.coerce.number().min(0).optional(),
  value_type: z
    .enum(["time_saved", "revenue_generated", "cost_reduced", "other"])
    .optional(),
  intervention_date: z.string().min(1, "La date est requise"),
});

type EntryFormData = z.infer<typeof entrySchema>;

export function AddJournalEntryDialog() {
  const [open, setOpen] = useState(false);
  const { addEntry } = useValueJournal();
  const { clients } = useClients();
  const { subscriptions } = useSubscriptions();

  const form = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      client_id: "",
      subscription_id: "",
      title: "",
      description: "",
      value_amount: 0,
      value_type: undefined,
      intervention_date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedClientId = form.watch("client_id");
  const clientSubscriptions = subscriptions.filter(
    (sub) => sub.client_id === selectedClientId
  );

  const onSubmit = (data: EntryFormData) => {
    addEntry({
      client_id: data.client_id,
      subscription_id: data.subscription_id || undefined,
      title: data.title,
      description: data.description,
      value_amount: data.value_amount,
      value_type: data.value_type,
      intervention_date: data.intervention_date,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle entrée
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une intervention</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle entrée dans le journal de valeur
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedClientId && clientSubscriptions.length > 0 && (
              <FormField
                control={form.control}
                name="subscription_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abonnement (optionnel)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un abonnement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientSubscriptions.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optimisation des performances"
                      {...field}
                    />
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'intervention et son impact..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de valeur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="time_saved">Temps économisé</SelectItem>
                        <SelectItem value="revenue_generated">
                          Revenu généré
                        </SelectItem>
                        <SelectItem value="cost_reduced">Coût réduit</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="intervention_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'intervention *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
