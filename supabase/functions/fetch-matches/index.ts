import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Nadi (pulse) group for compatibility checking
 * Each nakshatra belongs to one of 3 Nadis: Aadi, Madhya, Antya
 */
const NAKSHATRA_TO_NADI: Record<number, string> = {
  1: 'Aadi', 2: 'Madhya', 3: 'Antya',    // Ashwini, Bharani, Krittika
  4: 'Antya', 5: 'Madhya', 6: 'Aadi',    // Rohini, Mrigashira, Ardra
  7: 'Aadi', 8: 'Madhya', 9: 'Antya',    // Punarvasu, Pushya, Ashlesha
  10: 'Aadi', 11: 'Madhya', 12: 'Antya', // Magha, Purva Phalguni, Uttara Phalguni
  13: 'Antya', 14: 'Madhya', 15: 'Aadi', // Hasta, Chitra, Swati
  16: 'Aadi', 17: 'Madhya', 18: 'Antya', // Vishakha, Anuradha, Jyeshtha
  19: 'Aadi', 20: 'Madhya', 21: 'Antya', // Mula, Purva Ashadha, Uttara Ashadha
  22: 'Antya', 23: 'Madhya', 24: 'Aadi', // Shravana, Dhanishta, Shatabhisha
  25: 'Aadi', 26: 'Madhya', 27: 'Antya', // Purva Bhadrapada, Uttara Bhadrapada, Revati
};

/**
 * Get Nakshatra Pada (quarter) from moon longitude in vedic chart
 */
function getPadaFromChart(vedicChart: any): number {
  if (!vedicChart?.moon?.nakshatraPada) {
    return 1; // Default to pada 1 if not available
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
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

    // Get current user's profile
    const { data: currentProfile, error: profileError } = await supabase
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

    // Determine gender filter based on looking_for preference
    let genderFilter: string[] = [];
    if (currentProfile.looking_for === 'men') {
      genderFilter = ['male'];
    } else if (currentProfile.looking_for === 'women') {
      genderFilter = ['female'];
    } else {
      genderFilter = ['male', 'female', 'nonbinary'];
    }

    // Fetch all other completed profiles
    let query = supabase
      .from("profiles")
      .select("*")
      .neq("user_id", user.id)
      .eq("onboarding_complete", true);

    // Apply gender filter
    if (genderFilter.length > 0) {
      query = query.in("gender", genderFilter);
    }

    const { data: allProfiles, error: fetchError } = await query;

    if (fetchError) {
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
    let filteredProfiles = (allProfiles || []).filter((profile: Profile) => {
      if (!profile.moon_nakshatra_index || !currentNadi) return true;
      
      const candidateNadi = NAKSHATRA_TO_NADI[profile.moon_nakshatra_index];
      const candidatePada = getPadaFromChart(profile.vedic_chart);
      
      // If same Nadi but different Pada, it's acceptable (Nadi Dosha cancelled)
      if (candidateNadi === currentNadi) {
        // Same Nadi AND same Pada = Nadi Dosha = Remove
        if (candidatePada === currentPada) {
          return false;
        }
        // Same Nadi but different Pada = OK (exception)
        return true;
      }
      
      return true;
    });

    // FILTER 2: Manglik Safety - Categorize profiles
    type ProfileWithPriority = Profile & { manglikPriority: number; isSoulmate: boolean };
    
    const profilesWithPriority: ProfileWithPriority[] = filteredProfiles.map((profile: Profile) => {
      const candidateIsManglik = profile.is_manglik && !profile.manglik_cancelled;
      let manglikPriority = 1; // Default: normal priority
      
      if (currentIsManglik) {
        // Current user is Manglik - prioritize other Mangliks
        if (candidateIsManglik) {
          manglikPriority = 0; // High priority (show first)
        } else {
          manglikPriority = 2; // Lower priority
        }
      } else {
        // Current user is Non-Manglik - deprioritize active Mangliks
        if (candidateIsManglik) {
          manglikPriority = 2; // Lower priority
        } else {
          manglikPriority = 0; // High priority (non-manglik with non-manglik)
        }
      }
      
      // Check for Soulmate connection (AK-DK match)
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

    // Sort by manglik priority (soulmates will be boosted on client-side after Guna Milan)
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
