import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Journal = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client: "",
    action: "",
    timeSpent: "",
    impact: ""
  });

  // Mock clients data
  const clients = ["TechCorp", "DesignStudio", "StartupXYZ"];

  // Mock journal entries
  const journalEntries = [
    {
      id: 1,
      date: "2024-01-25",
      client: "TechCorp",
      action: "Optimisation SEO des pages produits",
      timeSpent: "3h",
      impact: "Amélioration du ranking Google pour 5 mots-clés principaux"
    },
    {
      id: 2,
      date: "2024-01-24",
      client: "DesignStudio",
      action: "Création de contenu pour les réseaux sociaux",
      timeSpent: "2h",
      impact: "Publication de 5 posts, +15% d'engagement moyen"
    },
    {
      id: 3,
      date: "2024-01-24",
      client: "StartupXYZ",
      action: "Analyse des performances AdWords",
      timeSpent: "1.5h",
      impact: "Réduction du CPC de 20%, optimisation de 3 campagnes"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client || !formData.action || !formData.timeSpent) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entrée ajoutée !",
      description: `Nouvelle activité enregistrée pour ${formData.client}.`,
    });

    // Reset form
    setFormData({
      client: "",
      action: "",
      timeSpent: "",
      impact: ""
    });
  };

  return (
    <div className="oria-section max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Journal de Valeur</h1>
        <p className="text-muted-foreground">Documentez vos actions quotidiennes pour chaque client</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Entry */}
        <Card className="oria-card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Nouvelle entrée</CardTitle>
            <CardDescription>Qu'avez-vous fait aujourd'hui pour vos clients ?</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={formData.client} onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action réalisée *</Label>
                <Textarea
                  id="action"
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  placeholder="Décrivez l'action réalisée aujourd'hui..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSpent">Temps passé *</Label>
                <Input
                  id="timeSpent"
                  name="timeSpent"
                  value={formData.timeSpent}
                  onChange={handleInputChange}
                  placeholder="Ex: 2h, 30min, 1.5h..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact">Impact / Résultat</Label>
                <Textarea
                  id="impact"
                  name="impact"
                  value={formData.impact}
                  onChange={handleInputChange}
                  placeholder="Quel a été l'impact de cette action ?"
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'entrée
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="oria-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Entrées récentes</CardTitle>
            <CardDescription>Vos dernières activités documentées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{entry.client}</h4>
                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {entry.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.timeSpent}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{entry.action}</p>
                  {entry.impact && (
                    <p className="text-xs text-success flex items-start gap-1">
                      <Target className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {entry.impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Journal;