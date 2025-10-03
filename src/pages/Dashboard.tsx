import { useClients } from "@/hooks/useClients";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertTriangle, UserPlus } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { clients, isLoading: clientsLoading } = useClients();
  const { subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();

  const stats = useMemo(() => {
    // MRR (Monthly Recurring Revenue)
    const mrr = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => {
        let monthlyAmount = s.amount;
        if (s.billing_cycle === "quarterly") monthlyAmount = s.amount / 3;
        if (s.billing_cycle === "annual") monthlyAmount = s.amount / 12;
        return sum + monthlyAmount;
      }, 0);

    // Clients actifs
    const activeClients = clients.filter((c) => c.status === "active").length;

    // Abonnements à risque
    const atRiskSubscriptions = subscriptions.filter(
      (s) => s.status === "at_risk"
    ).length;

    // Nouveaux clients ce mois
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newClientsThisMonth = clients.filter(
      (c) => new Date(c.created_at) >= startOfMonth
    ).length;

    return {
      mrr,
      activeClients,
      atRiskSubscriptions,
      newClientsThisMonth,
    };
  }, [clients, subscriptions]);

  const isLoading = clientsLoading || subscriptionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre activité
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale transition-all border-border/50 shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MRR
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.mrr.toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Revenu mensuel récurrent
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all border-border/50 shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients actifs
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.activeClients}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clients avec abonnements actifs
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all border-border/50 shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              À risque
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.atRiskSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Abonnements nécessitant attention
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale transition-all border-border/50 shadow-sm hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nouveaux ce mois
            </CardTitle>
            <UserPlus className="h-5 w-5 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.newClientsThisMonth}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clients ajoutés ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Abonnements récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.clients?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {sub.amount.toFixed(2)} {sub.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sub.billing_cycle === "monthly" && "Mensuel"}
                      {sub.billing_cycle === "quarterly" && "Trimestriel"}
                      {sub.billing_cycle === "annual" && "Annuel"}
                    </p>
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun abonnement pour le moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Clients récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        client.status === "active"
                          ? "bg-success-light text-success-foreground"
                          : client.status === "inactive"
                          ? "bg-destructive-light text-destructive-foreground"
                          : "bg-warning-light text-warning-foreground"
                      }`}
                    >
                      {client.status === "active" && "Actif"}
                      {client.status === "inactive" && "Inactif"}
                      {client.status === "lead" && "Lead"}
                    </span>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucun client pour le moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
