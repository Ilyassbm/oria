import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Subscriptions = () => {
  // Mock subscriptions data
  const subscriptions = [
    {
      id: 1,
      clientName: "TechCorp",
      service: "Marketing Digital",
      price: 1500,
      status: "active",
      nextBilling: "2024-02-15",
      publicUrl: "https://oria.app/subscribe/techcorp-marketing"
    },
    {
      id: 2,
      clientName: "DesignStudio",
      service: "SEO & Content",
      price: 800,
      status: "active",
      nextBilling: "2024-02-20",
      publicUrl: "https://oria.app/subscribe/designstudio-seo"
    },
    {
      id: 3,
      clientName: "StartupXYZ",
      service: "Social Media",
      price: 600,
      status: "pending",
      nextBilling: "2024-02-10",
      publicUrl: "https://oria.app/subscribe/startupxyz-social"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-light text-success">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-warning-light text-warning">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-destructive-light text-destructive">Annulé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div className="oria-section max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Abonnements</h1>
          <p className="text-muted-foreground">Gérez tous vos abonnements clients</p>
        </div>
        <Button asChild>
          <Link to="/create">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel abonnement
          </Link>
        </Button>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="oria-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold">{subscription.clientName}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {subscription.service}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(subscription.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="oria-metric-label">Prix mensuel</p>
                  <p className="oria-metric text-lg">{subscription.price}€</p>
                </div>
                <div>
                  <p className="oria-metric-label">Prochaine facture</p>
                  <p className="text-sm font-medium">{subscription.nextBilling}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="oria-metric-label">URL publique</p>
                  <p className="text-sm font-mono text-muted-foreground truncate">
                    {subscription.publicUrl}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-3 w-3 mr-2" />
                  Voir détails
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="h-3 w-3 mr-2" />
                  Modifier
                </Button>
                <Button variant="secondary" size="sm">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Page publique
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;