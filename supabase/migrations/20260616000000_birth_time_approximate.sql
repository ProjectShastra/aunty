-- Birth-time-unknown support.
-- When a user doesn't know their exact birth time, onboarding falls back to
-- noon and flags the chart as approximate. Moon-sign matching stays reliable;
-- ascendant/house-based features (Manglik, lagna, bhava) should be treated as
-- low-confidence for these profiles and can be downweighted by the matcher.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_time_approximate BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.birth_time_approximate IS
  'TRUE when the user did not know their birth time and noon was used as a placeholder. Ascendant/house features are unreliable for these profiles.';
