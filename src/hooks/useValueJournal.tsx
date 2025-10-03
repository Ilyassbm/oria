import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useValueJournal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const journalQuery = useQuery({
    queryKey: ["value-journal", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("value_journal")
        .select(`
          *,
          clients (
            id,
            name
          ),
          subscriptions (
            id,
            name
          )
        `)
        .order("intervention_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addEntryMutation = useMutation({
    mutationFn: async (entry: {
      client_id: string;
      subscription_id?: string;
      title: string;
      description: string;
      value_amount?: number;
      value_type?: string;
      intervention_date: string;
    }) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user!.id)
        .single();

      const { data, error } = await supabase
        .from("value_journal")
        .insert({
          ...entry,
          agency_id: profile!.agency_id,
          created_by: user!.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["value-journal"] });
      toast({
        title: "Entrée ajoutée",
        description: "L'intervention a été enregistrée",
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

  return {
    entries: journalQuery.data ?? [],
    isLoading: journalQuery.isLoading,
    addEntry: addEntryMutation.mutate,
  };
}
