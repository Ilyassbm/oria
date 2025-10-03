import { useState, useMemo } from "react";
import { useValueJournal } from "@/hooks/useValueJournal";
import { AddJournalEntryDialog } from "@/components/journal/AddJournalEntryDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Journal() {
  const { entries, isLoading } = useValueJournal();
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        (entry.clients?.name &&
          entry.clients.name.toLowerCase().includes(search.toLowerCase()));

      return matchesSearch;
    });
  }, [entries, search]);

  const getValueTypeBadge = (type?: string) => {
    if (!type) return null;

    switch (type) {
      case "time_saved":
        return (
          <Badge className="bg-primary-light text-primary">Temps économisé</Badge>
        );
      case "revenue_generated":
        return <Badge className="bg-success-light text-success">Revenu généré</Badge>;
      case "cost_reduced":
        return <Badge className="bg-warning-light text-warning">Coût réduit</Badge>;
      case "other":
        return <Badge variant="secondary">Autre</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal de valeur</h1>
          <p className="text-muted-foreground mt-2">
            Enregistrez et suivez chaque intervention client
          </p>
        </div>
        <AddJournalEntryDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre, description ou client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card
            key={entry.id}
            className="hover-scale transition-all border-border/50 hover:shadow-md"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{entry.title}</h3>
                    {entry.value_type && getValueTypeBadge(entry.value_type)}
                  </div>
                  {entry.clients && (
                    <p className="text-sm text-muted-foreground">
                      {entry.clients.name}
                      {entry.subscriptions && ` • ${entry.subscriptions.name}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(entry.intervention_date), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                  {entry.value_amount && entry.value_amount > 0 && (
                    <div className="flex items-center gap-1 text-success font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      {entry.value_amount.toFixed(2)} €
                    </div>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {entry.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              {search
                ? "Aucune entrée ne correspond à vos critères"
                : "Aucune entrée dans le journal pour le moment"}
            </p>
            {!search && (
              <p className="text-sm text-muted-foreground mt-2">
                Cliquez sur "Nouvelle entrée" pour commencer
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
