import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useSubscriptions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscriptionsQuery = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          clients (
            id,
            name,
            email,
            company
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addSubscriptionMutation = useMutation({
    mutationFn: async (subscription: {
      client_id: string;
      name: string;
      description?: string;
      amount: number;
      currency?: string;
      billing_cycle: string;
      start_date: string;
      next_billing_date: string;
      status?: string;
    }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user!.id)
        .single();

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          ...subscription,
          agency_id: profile!.agency_id,
          created_by: user!.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({
        title: "Abonnement créé",
        description: "L'abonnement a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<{
        name: string;
        description: string;
        amount: number;
        billing_cycle: string;
        status: string;
        next_billing_date: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({
        title: "Abonnement mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
  });

  return {
    subscriptions: subscriptionsQuery.data ?? [],
    isLoading: subscriptionsQuery.isLoading,
    addSubscription: addSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
  };
}
