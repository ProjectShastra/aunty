-- Create profiles table with astrological keys
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic profile info
  name TEXT NOT NULL,
  bio TEXT,
  gender TEXT,
  date_of_birth DATE NOT NULL,
  birth_time TEXT NOT NULL,
  birth_latitude DOUBLE PRECISION NOT NULL,
  birth_longitude DOUBLE PRECISION NOT NULL,
  birth_location TEXT NOT NULL,
  birth_timezone DOUBLE PRECISION NOT NULL DEFAULT 0,
  
  -- Preferences
  looking_for TEXT,
  age_range_min INTEGER DEFAULT 18,
  age_range_max INTEGER DEFAULT 99,
  location_preference TEXT,
  
  -- Photos (URLs from storage)
  photo_1 TEXT,
  photo_2 TEXT,
  
  -- Astrological Keys (calculated from birth data)
  moon_nakshatra_index INTEGER CHECK (moon_nakshatra_index >= 1 AND moon_nakshatra_index <= 27),
  moon_sign_index INTEGER CHECK (moon_sign_index >= 1 AND moon_sign_index <= 12),
  ascendant_sign_index INTEGER CHECK (ascendant_sign_index >= 1 AND ascendant_sign_index <= 12),
  is_manglik BOOLEAN DEFAULT FALSE,
  manglik_cancelled BOOLEAN DEFAULT FALSE,
  atmakaraka_planet TEXT,
  darakaraka_planet TEXT,
  element TEXT CHECK (element IN ('Fire', 'Water', 'Air', 'Earth')),
  
  -- Full chart data (stored as JSON for matching engine)
  vedic_chart JSONB,
  
  -- Profile status
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (for browsing matches)
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);