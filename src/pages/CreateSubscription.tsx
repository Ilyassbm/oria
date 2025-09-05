import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    serviceName: "",
    monthlyPrice: "",
    description: "",
    billingDay: "1"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.clientName || !formData.clientEmail || !formData.serviceName || !formData.monthlyPrice) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Mock creation process
    toast({
      title: "Abonnement créé !",
      description: `L'abonnement pour ${formData.clientName} a été créé avec succès.`,
    });

    // Redirect after creation
    setTimeout(() => {
      navigate("/subscriptions");
    }, 1500);
  };

  return (
    <div className="oria-section max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="secondary" asChild className="mb-4">
          <Link to="/subscriptions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux abonnements
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Créer un abonnement</h1>
        <p className="text-muted-foreground">Configurez un nouvel abonnement récurrent pour votre client</p>
      </div>

      <Card className="oria-card-elevated">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Informations de l'abonnement</CardTitle>
          <CardDescription>
            Remplissez les détails pour créer un nouvel abonnement client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Informations Client</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom du client *</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Ex: TechCorp, StartupXYZ..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email du client *</Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="contact@client.com"
                    required
                  />
                </div>
              </div>

              {/* Service Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Détails du Service</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Nom du service *</Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    placeholder="Ex: Marketing Digital, SEO, Social Media..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">Prix mensuel (€) *</Label>
                  <Input
                    id="monthlyPrice"
                    name="monthlyPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyPrice}
                    onChange={handleInputChange}
                    placeholder="1500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingDay">Jour de facturation</Label>
                  <Input
                    id="billingDay"
                    name="billingDay"
                    type="number"
                    min="1"
                    max="28"
                    value={formData.billingDay}
                    onChange={handleInputChange}
                    placeholder="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Jour du mois pour la facturation (1-28)
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description du service</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez les services inclus dans cet abonnement..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Créer l'abonnement
              </Button>
              <Button variant="secondary" type="button" asChild>
                <Link to="/subscriptions">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSubscription;