import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, DollarSign, FileText } from "lucide-react";

const Clients = () => {
  // Mock clients data
  const clients = [
    {
      id: 1,
      name: "TechCorp",
      email: "contact@techcorp.com",
      avatar: "",
      totalSubscriptions: 2,
      monthlyRevenue: 2100,
      status: "active",
      lastReport: "2024-01-25",
      joinDate: "2023-08-15"
    },
    {
      id: 2,
      name: "DesignStudio",
      email: "hello@designstudio.fr",
      avatar: "",
      totalSubscriptions: 1,
      monthlyRevenue: 800,
      status: "active",
      lastReport: "2024-01-24",
      joinDate: "2023-11-02"
    },
    {
      id: 3,
      name: "StartupXYZ",
      email: "team@startupxyz.io",
      avatar: "",
      totalSubscriptions: 1,
      monthlyRevenue: 600,
      status: "pending",
      lastReport: "2024-01-20",
      joinDate: "2024-01-05"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-light text-success">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-warning-light text-warning">En attente</Badge>;
      case 'inactive':
        return <Badge className="bg-destructive-light text-destructive">Inactif</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="oria-section max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Clients</h1>
        <p className="text-muted-foreground">Gérez vos relations clients et leurs abonnements</p>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="oria-card-elevated">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold">{client.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(client.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="oria-metric-label">Revenue mensuel</p>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {client.monthlyRevenue}€
                    </p>
                  </div>
                  <div>
                    <p className="oria-metric-label">Abonnements</p>
                    <p className="text-lg font-semibold text-foreground">
                      {client.totalSubscriptions}
                    </p>
                  </div>
                </div>

                {/* Timeline info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Dernier rapport
                    </span>
                    <span className="font-medium">{client.lastReport}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Client depuis
                    </span>
                    <span className="font-medium">{client.joinDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Envoyer rapport
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;