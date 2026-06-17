import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Real Vedic matching engine — single source of truth in
// src/lib/vedic-astrology/matching, bundled for Deno by `npm run build:edge`.
// (Replaces the former shallow inline Nadi/Manglik approximation.)
import { evaluateMatch } from "../_shared/matching.bundle.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DiscoveryProfile {
  id: string;
  user_id: string;
  name: string;
  gender: string | null;
  darakaraka_planet: string | null;
  atmakaraka_planet: string | null;
  vedic_chart: unknown;
  // ...plus the rest of the columns returned by get_discovery_profiles
  [key: string]: unknown;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const { data: discoveryProfiles, error: discoveryError } = await adminClient
      .rpc("get_discovery_profiles", {
        p_user_id: user.id,
        p_looking_for: currentProfile.looking_for,
        p_limit: 100,
      });

    if (discoveryError) {
      console.error("Discovery function error:", discoveryError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profiles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const candidates = (discoveryProfiles || []) as DiscoveryProfile[];
    console.log(`Found ${candidates.length} discovery profiles`);

    // Authoritative, server-side scoring using the full engine: Ashtakoota
    // (order-independent via genders), Manglik with cancellations, and Jaimini
    // soulmate. Profiles without a computed chart fall through unscored.
    const scored = candidates.map((profile) => {
      if (!currentProfile.vedic_chart || !profile.vedic_chart) {
        return { ...profile, matchScore: null };
      }
      try {
        const result = evaluateMatch(
          currentProfile.vedic_chart,
          profile.vedic_chart,
          { a: currentProfile.gender, b: profile.gender },
        );
        return {
          ...profile,
          matchScore: {
            score: result.score,
            gunaScore: result.gunaMilan.totalScore,
            percentage: result.percentage,
            verdict: result.verdict,
            matchStatus: result.matchStatus,
            breakdown: result.scoreBreakdown,
            badges: result.badges,
            isSoulmate: result.soulmate.akDkMatch,
            nadiDosha: result.nadiDosha,
            bhakootDosha: result.bhakootDosha,
          },
        };
      } catch (err) {
        console.error(`evaluateMatch failed for ${profile.id}:`, err);
        return { ...profile, matchScore: null };
      }
    });

    // Rank: soulmates first, then by total score (with bonuses) descending.
    // Unscored profiles sink to the bottom.
    const ranked = scored.sort((a, b) => {
      const sa = a.matchScore, sb = b.matchScore;
      if (!sa && !sb) return 0;
      if (!sa) return 1;
      if (!sb) return -1;
      if (sa.isSoulmate !== sb.isSoulmate) return sa.isSoulmate ? -1 : 1;
      return sb.score - sa.score;
    });

    console.log(
      `Scored ${ranked.filter((p) => p.matchScore).length}, ` +
      `soulmates ${ranked.filter((p) => p.matchScore?.isSoulmate).length}`
    );

    return new Response(
      JSON.stringify({
        profiles: ranked,
        currentProfile: {
          id: currentProfile.id,
          moon_nakshatra_index: currentProfile.moon_nakshatra_index,
          moon_sign_index: currentProfile.moon_sign_index,
          is_manglik: currentProfile.is_manglik && !currentProfile.manglik_cancelled,
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
