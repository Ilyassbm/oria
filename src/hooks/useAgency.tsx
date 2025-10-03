import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useAgency() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["agency", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("agency_id")
        .eq("id", user.id)
        .single();

      if (!profile) return null;

      const { data: agency } = await supabase
        .from("agencies")
        .select("*")
        .eq("id", profile.agency_id)
        .single();

      return agency;
    },
    enabled: !!user,
  });
}
