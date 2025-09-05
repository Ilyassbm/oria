import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import oriaLogo from "@/assets/oria-logo.png";

const PublicSubscription = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    phone: ""
  });

  // Mock subscription details - would come from URL params in real app
  const subscription = {
    agencyName: "Mon Agence Digital",
    serviceName: "Marketing Digital Premium",
    monthlyPrice: 1500,
    description: "Service complet de marketing digital incluant SEO, publicités payantes, gestion des réseaux sociaux et reporting mensuel détaillé.",
    features: [
      "Optimisation SEO complète",
      "Gestion des campagnes publicitaires",
      "Création de contenu pour réseaux sociaux",
      "Rapport mensuel détaillé",
      "Support client prioritaire",
      "Stratégie marketing personnalisée"
    ]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate subscription process
    setTimeout(() => {
      toast({
        title: "Abonnement initié !",
        description: "Vous allez être redirigé vers le paiement sécurisé.",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={oriaLogo} alt="Oria" className="h-10 w-10" />
            <span className="text-2xl font-bold text-primary">Oria</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Abonnement chez {subscription.agencyName}
          </h1>
          <p className="text-muted-foreground">
            Rejoignez des centaines d'entreprises qui font confiance à nos services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card className="oria-card-elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">{subscription.serviceName}</CardTitle>
                <Badge className="bg-success-light text-success text-lg px-3 py-1">
                  {subscription.monthlyPrice}€/mois
                </Badge>
              </div>
              <CardDescription className="text-base">
                {subscription.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground mb-3">Ce qui est inclus :</h4>
                {subscription.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-light rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✨ Offre spéciale : Premier mois à -50% !
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Form */}
          <Card className="oria-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Commencer votre abonnement</CardTitle>
              <CardDescription>
                Remplissez vos informations pour démarrer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Votre Entreprise SAS"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isLoading ? "Préparation..." : `S'abonner pour ${subscription.monthlyPrice}€/mois`}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Paiement sécurisé via Stripe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Résiliable à tout moment • Facturation mensuelle
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Une question ? Contactez-nous :
          </p>
          <Button variant="secondary" size="sm">
            <Mail className="h-3 w-3 mr-2" />
            contact@{subscription.agencyName.toLowerCase().replace(' ', '')}.com
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicSubscription;