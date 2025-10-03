import { useState, useMemo } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { AddSubscriptionDialog } from "@/components/subscriptions/AddSubscriptionDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Subscriptions() {
  const { subscriptions, isLoading } = useSubscriptions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        (sub.clients?.name &&
          sub.clients.name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success-light text-success">Actif</Badge>;
      case "paused":
        return <Badge className="bg-warning-light text-warning">En pause</Badge>;
      case "cancelled":
        return (
          <Badge className="bg-destructive-light text-destructive">Annulé</Badge>
        );
      case "at_risk":
        return (
          <Badge className="bg-warning-light text-warning">À risque</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case "monthly":
        return "Mensuel";
      case "quarterly":
        return "Trimestriel";
      case "annual":
        return "Annuel";
      default:
        return cycle;
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
          <h1 className="text-3xl font-bold tracking-tight">Abonnements</h1>
          <p className="text-muted-foreground mt-2">
            Gérez tous vos abonnements clients
          </p>
        </div>
        <AddSubscriptionDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
            <SelectItem value="at_risk">À risque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map((subscription) => (
          <Card
            key={subscription.id}
            className="hover-scale transition-all border-border/50 hover:shadow-md"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{subscription.name}</CardTitle>
                {getStatusBadge(subscription.status)}
              </div>
              {subscription.clients && (
                <p className="text-sm text-muted-foreground">
                  {subscription.clients.name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Montant</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {subscription.amount.toFixed(2)} {subscription.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getBillingCycleLabel(subscription.billing_cycle)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Prochaine facturation
                  </span>
                  <span className="font-medium">
                    {format(
                      new Date(subscription.next_billing_date),
                      "dd MMM yyyy",
                      { locale: fr }
                    )}
                  </span>
                </div>
              </div>

              {subscription.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t border-border/50">
                  {subscription.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground text-center">
              {search || statusFilter !== "all"
                ? "Aucun abonnement ne correspond à vos critères"
                : "Aucun abonnement pour le moment"}
            </p>
            {!search && statusFilter === "all" && (
              <p className="text-sm text-muted-foreground mt-2">
                Cliquez sur "Nouvel abonnement" pour commencer
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
