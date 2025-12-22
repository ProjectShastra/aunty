-- Create matches table to track connections between users
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user1_liked BOOLEAN DEFAULT FALSE,
  user2_liked BOOLEAN DEFAULT FALSE,
  is_mutual BOOLEAN GENERATED ALWAYS AS (user1_liked AND user2_liked) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique pairs (no duplicate matches)
  CONSTRAINT unique_match_pair UNIQUE (user1_id, user2_id),
  -- Prevent self-matching
  CONSTRAINT no_self_match CHECK (user1_id != user2_id)
);

-- Enable RLS on matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Users can view matches they're part of
CREATE POLICY "Users can view their own matches"
ON public.matches
FOR SELECT
TO authenticated
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create matches where they are user1
CREATE POLICY "Users can create matches"
ON public.matches
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user1_id);

-- Users can update matches they're part of (to record their like)
CREATE POLICY "Users can update their match status"
ON public.matches
FOR UPDATE
TO authenticated
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create trigger for matches updated_at
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_matches_mutual ON public.matches(is_mutual) WHERE is_mutual = true;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create security definer function for discovery (returns limited data)
CREATE OR REPLACE FUNCTION public.get_discovery_profiles(
  p_user_id UUID,
  p_looking_for TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  bio TEXT,
  gender TEXT,
  photo_1 TEXT,
  photo_2 TEXT,
  birth_location TEXT,
  date_of_birth DATE,
  moon_sign_index INTEGER,
  moon_nakshatra_index INTEGER,
  ascendant_sign_index INTEGER,
  is_manglik BOOLEAN,
  manglik_cancelled BOOLEAN,
  atmakaraka_planet TEXT,
  darakaraka_planet TEXT,
  element TEXT,
  vedic_chart JSONB,
  looking_for TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.name,
    p.bio,
    p.gender,
    p.photo_1,
    p.photo_2,
    -- Return only city name, not full location with coordinates
    split_part(p.birth_location, ',', 1) as birth_location,
    p.date_of_birth,
    p.moon_sign_index,
    p.moon_nakshatra_index,
    p.ascendant_sign_index,
    p.is_manglik,
    p.manglik_cancelled,
    p.atmakaraka_planet,
    p.darakaraka_planet,
    p.element,
    p.vedic_chart,
    p.looking_for
  FROM public.profiles p
  WHERE p.user_id != p_user_id
    AND p.onboarding_complete = true
    -- Filter by gender preference if specified
    AND (
      p_looking_for IS NULL 
      OR p_looking_for = 'everyone'
      OR (p_looking_for = 'men' AND p.gender = 'male')
      OR (p_looking_for = 'women' AND p.gender = 'female')
    )
    -- Exclude users already swiped on
    AND NOT EXISTS (
      SELECT 1 FROM public.matches m
      WHERE (m.user1_id = p_user_id AND m.user2_id = p.user_id)
         OR (m.user2_id = p_user_id AND m.user1_id = p.user_id AND m.user2_liked = true)
    )
  ORDER BY p.created_at DESC
  LIMIT p_limit;
END;
$$;

-- New policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- New policy: Users can view profiles of mutual matches
CREATE POLICY "Users can view matched profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.is_mutual = true
      AND (
        (m.user1_id = auth.uid() AND m.user2_id = profiles.user_id)
        OR (m.user2_id = auth.uid() AND m.user1_id = profiles.user_id)
      )
  )
);