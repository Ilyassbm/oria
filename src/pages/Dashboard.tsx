import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data - will be replaced with real data later
  const metrics = {
    totalRevenue: 15750,
    activeClients: 12,
    totalSubscriptions: 15,
    reportsThisWeek: 8
  };

  const recentActivities = [
    { client: "TechCorp", action: "Rapport envoyé", time: "Il y a 2h" },
    { client: "DesignStudio", action: "Journal mis à jour", time: "Il y a 5h" },
    { client: "StartupXYZ", action: "Nouvel abonnement", time: "Hier" },
  ];

  return (
    <div className="oria-section max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité agence</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="oria-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Récurrent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="oria-metric">{metrics.totalRevenue.toLocaleString()}€</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="oria-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="oria-metric">{metrics.activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalSubscriptions} abonnements
            </p>
          </CardContent>
        </Card>

        <Card className="oria-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Abonnements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="oria-metric">{metrics.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tous actifs
            </p>
          </CardContent>
        </Card>

        <Card className="oria-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rapports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="oria-metric">{metrics.reportsThisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="oria-card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/create">
                <Plus className="h-4 w-4 mr-2" />
                Créer un nouvel abonnement
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full justify-start">
              <Link to="/journal">
                <Calendar className="h-4 w-4 mr-2" />
                Ajouter une entrée au journal
              </Link>
            </Button>
            <Button variant="secondary" asChild className="w-full justify-start">
              <Link to="/clients">
                <Users className="h-4 w-4 mr-2" />
                Voir tous les clients
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="oria-card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Activité Récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.client}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;