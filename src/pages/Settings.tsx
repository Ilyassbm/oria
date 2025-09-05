import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Mail, Bell, User, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="oria-section max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Configurez votre plateforme Oria</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="oria-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Agence
            </CardTitle>
            <CardDescription>Informations de votre agence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agencyName">Nom de l'agence</Label>
                <Input id="agencyName" defaultValue="Mon Agence Digital" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyEmail">Email principal</Label>
                <Input id="agencyEmail" type="email" defaultValue="hello@agence.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencyDescription">Description</Label>
              <Textarea 
                id="agencyDescription" 
                placeholder="Décrivez votre agence..."
                defaultValue="Agence spécialisée in marketing digital et SEO"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="oria-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuration Email
            </CardTitle>
            <CardDescription>Paramètres pour l'envoi automatique des rapports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Nom expéditeur</Label>
                <Input id="senderName" defaultValue="Mon Agence Digital" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Email expéditeur</Label>
                <Input id="senderEmail" type="email" defaultValue="rapports@agence.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailSignature">Signature email</Label>
              <Textarea 
                id="emailSignature" 
                placeholder="Votre signature..."
                defaultValue="Cordialement,\nL'équipe Mon Agence Digital"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="oria-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Gérez vos préférences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports" className="text-sm font-medium">
                  Rapports hebdomadaires automatiques
                </Label>
                <p className="text-sm text-muted-foreground">
                  Envoyer automatiquement les rapports chaque semaine
                </p>
              </div>
              <Switch id="weekly-reports" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-notifications" className="text-sm font-medium">
                  Notifications de paiement
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir une notification lors des paiements clients
                </p>
              </div>
              <Switch id="payment-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reminders" className="text-sm font-medium">
                  Rappels quotidiens
                </Label>
                <p className="text-sm text-muted-foreground">
                  Rappel pour remplir le journal de valeur
                </p>
              </div>
              <Switch id="daily-reminders" />
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card className="oria-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Facturation
            </CardTitle>
            <CardDescription>Paramètres de facturation et paiements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium mb-2">Intégration Stripe requise</p>
              <p className="text-sm text-muted-foreground mb-3">
                Connectez votre compte Stripe pour activer les paiements automatiques
              </p>
              <Button variant="secondary" size="sm">
                Configurer Stripe
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input id="currency" defaultValue="EUR (€)" disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Taux de TVA (%)</Label>
              <Input id="taxRate" type="number" defaultValue="20" />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            <SettingsIcon className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;