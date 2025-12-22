import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Nadi (pulse) group for compatibility checking
 */
const NAKSHATRA_TO_NADI: Record<number, string> = {
  1: 'Aadi', 2: 'Madhya', 3: 'Antya',
  4: 'Antya', 5: 'Madhya', 6: 'Aadi',
  7: 'Aadi', 8: 'Madhya', 9: 'Antya',
  10: 'Aadi', 11: 'Madhya', 12: 'Antya',
  13: 'Antya', 14: 'Madhya', 15: 'Aadi',
  16: 'Aadi', 17: 'Madhya', 18: 'Antya',
  19: 'Aadi', 20: 'Madhya', 21: 'Antya',
  22: 'Antya', 23: 'Madhya', 24: 'Aadi',
  25: 'Aadi', 26: 'Madhya', 27: 'Antya',
};

function getPadaFromChart(vedicChart: any): number {
  if (!vedicChart?.moon?.nakshatraPada) {
    return 1;
  }
  return vedicChart.moon.nakshatraPada;
}

interface Profile {
  id: string;
  user_id: string;
  name: string;
  moon_nakshatra_index: number | null;
  moon_sign_index: number | null;
  is_manglik: boolean | null;
  manglik_cancelled: boolean | null;
  atmakaraka_planet: string | null;
  darakaraka_planet: string | null;
  vedic_chart: any;
  looking_for: string | null;
  gender: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Create admin client for secure operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to verify auth
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current user's profile using admin client
    const { data: currentProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !currentProfile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the secure discovery function to get profiles
    const { data: discoveryProfiles, error: discoveryError } = await adminClient
      .rpc('get_discovery_profiles', {
        p_user_id: user.id,
        p_looking_for: currentProfile.looking_for,
        p_limit: 50
      });

    if (discoveryError) {
      console.error("Discovery function error:", discoveryError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profiles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentNakshatra = currentProfile.moon_nakshatra_index;
    const currentNadi = currentNakshatra ? NAKSHATRA_TO_NADI[currentNakshatra] : null;
    const currentPada = getPadaFromChart(currentProfile.vedic_chart);
    const currentIsManglik = currentProfile.is_manglik && !currentProfile.manglik_cancelled;
    const currentAtmakaraka = currentProfile.atmakaraka_planet;

    // FILTER 1: Remove Nadi Dosha matches (same Nadi, same Pada)
    let filteredProfiles = (discoveryProfiles || []).filter((profile: Profile) => {
      if (!profile.moon_nakshatra_index || !currentNadi) return true;
      
      const candidateNadi = NAKSHATRA_TO_NADI[profile.moon_nakshatra_index];
      const candidatePada = getPadaFromChart(profile.vedic_chart);
      
      if (candidateNadi === currentNadi && candidatePada === currentPada) {
        return false;
      }
      
      return true;
    });

    // FILTER 2 & Soulmate Detection
    type ProfileWithPriority = Profile & { manglikPriority: number; isSoulmate: boolean };
    
    const profilesWithPriority: ProfileWithPriority[] = filteredProfiles.map((profile: Profile) => {
      const candidateIsManglik = profile.is_manglik && !profile.manglik_cancelled;
      let manglikPriority = 1;
      
      if (currentIsManglik) {
        if (candidateIsManglik) {
          manglikPriority = 0;
        } else {
          manglikPriority = 2;
        }
      } else {
        if (candidateIsManglik) {
          manglikPriority = 2;
        } else {
          manglikPriority = 0;
        }
      }
      
      const isSoulmate = 
        currentAtmakaraka && 
        profile.darakaraka_planet && 
        currentAtmakaraka === profile.darakaraka_planet;
      
      return {
        ...profile,
        manglikPriority,
        isSoulmate: !!isSoulmate,
      };
    });

    profilesWithPriority.sort((a, b) => a.manglikPriority - b.manglikPriority);

    return new Response(
      JSON.stringify({
        profiles: profilesWithPriority,
        currentProfile: {
          id: currentProfile.id,
          moon_nakshatra_index: currentProfile.moon_nakshatra_index,
          moon_sign_index: currentProfile.moon_sign_index,
          is_manglik: currentIsManglik,
          atmakaraka_planet: currentProfile.atmakaraka_planet,
          darakaraka_planet: currentProfile.darakaraka_planet,
          vedic_chart: currentProfile.vedic_chart,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in fetch-matches:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
