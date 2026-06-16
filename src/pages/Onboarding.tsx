import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  User, 
  Heart, 
  Calendar, 
  Clock, 
  MapPin,
  Sparkles,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { PhotoUpload } from '@/components/onboarding/PhotoUpload';
import { LocationPicker, LocationData } from '@/components/onboarding/LocationPicker';
import { AnalyzingScreen } from '@/components/onboarding/AnalyzingScreen';
import { OnboardingTimePicker } from '@/components/onboarding/OnboardingTimePicker';
import { OnboardingDatePicker } from '@/components/onboarding/OnboardingDatePicker';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { calculateProfile } from '@/lib/vedic-astrology';
import { getElementFromMoonSign } from '@/lib/element-calculator';
import { zoneOffsetHoursForWallTime } from '@/lib/timezone';

const TOTAL_STEPS = 7;

const stepConfig = [
  { 
    id: 'photos', 
    icon: Camera, 
    title: "Show Aunty that face! 📸",
    subtitle: "Upload your best pics so your matches can see the real you"
  },
  { 
    id: 'name', 
    icon: User, 
    title: "What should Aunty call you?",
    subtitle: "Your name is the first thing your matches will see"
  },
  { 
    id: 'bio', 
    icon: Sparkles, 
    title: "Spill the tea about yourself ☕",
    subtitle: "A little bio goes a long way"
  },
  { 
    id: 'identity', 
    icon: Heart, 
    title: "Tell Aunty who you are...",
    subtitle: "...and who you're looking for"
  },
  { 
    id: 'birthdate', 
    icon: Calendar, 
    title: "When did you enter this world? 🌟",
    subtitle: "Aunty needs your exact birth date for the stars"
  },
  { 
    id: 'birthtime', 
    icon: Clock, 
    title: "What time were you born? ⏰",
    subtitle: "Text your mom if you have to—Aunty needs precision!"
  },
  { 
    id: 'location', 
    icon: MapPin, 
    title: "Where were you born? 🌍",
    subtitle: "City of birth helps Aunty read your charts perfectly"
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [photos, setPhotos] = useState<(File | null)[]>([null, null]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [birthAmPm, setBirthAmPm] = useState('');
  const [birthLocation, setBirthLocation] = useState<LocationData | null>(null);

  // Load signup data if exists
  useEffect(() => {
    const signupData = sessionStorage.getItem('signupData');
    if (signupData) {
      const data = JSON.parse(signupData);
      if (data.firstName) {
        setName(`${data.firstName}${data.lastName ? ' ' + data.lastName : ''}`);
      }
    }
  }, []);

  const canProceed = () => {
    switch (stepConfig[currentStep].id) {
      case 'photos':
        return photos[0] !== null;
      case 'name':
        return name.trim().length >= 2;
      case 'bio':
        return true; // Bio is optional
      case 'identity':
        return gender !== '' && lookingFor !== '';
      case 'birthdate':
        return birthDate !== null;
      case 'birthtime':
        return birthHour !== '' && birthMinute !== '' && birthAmPm !== '';
      case 'location':
        return birthLocation !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const uploadPhoto = async (file: File, index: number): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/photo_${index + 1}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    if (!birthLocation || !birthDate) {
      toast.error('Missing required birth details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert time to 24-hour format
      let hour = parseInt(birthHour);
      if (birthAmPm === 'pm' && hour !== 12) hour += 12;
      if (birthAmPm === 'am' && hour === 12) hour = 0;
      const minute = parseInt(birthMinute, 10);
      const birthTime = `${hour.toString().padStart(2, '0')}:${birthMinute.padStart(2, '0')}`;

      // Resolve the DST-correct UTC offset for THIS birth date. A static city
      // offset is an hour wrong for any DST-region birth in the other season,
      // which can flip the ascendant a whole sign. Non-DST zones (ianaZone null)
      // keep their reliable static offset.
      const resolvedTzOffset = birthLocation.ianaZone
        ? zoneOffsetHoursForWallTime(
            birthDate.getFullYear(),
            birthDate.getMonth() + 1,
            birthDate.getDate(),
            hour,
            minute,
            birthLocation.ianaZone,
          )
        : birthLocation.timezone;

      // Calculate Vedic profile
      const vedicProfile = calculateProfile(
        birthDate,
        birthTime,
        birthLocation.latitude,
        birthLocation.longitude,
        resolvedTzOffset
      );

      // Show analyzing screen
      setIsAnalyzing(true);

      // Upload photos in parallel
      const [photo1Url, photo2Url] = await Promise.all([
        photos[0] ? uploadPhoto(photos[0], 0) : Promise.resolve(null),
        photos[1] ? uploadPhoto(photos[1], 1) : Promise.resolve(null),
      ]);

      // Calculate element from moon sign
      const element = getElementFromMoonSign(vedicProfile.moon.sign);

      // Check manglik cancellation
      const isManglik = vedicProfile.doshas.isManglik;
      const manglikCancelled = isManglik && vedicProfile.doshas.manglikSeverity === 'mild';

      // Prepare profile data
      const profileData = {
        user_id: user.id,
        name: name.trim(),
        bio: bio.trim() || null,
        gender,
        looking_for: lookingFor,
        date_of_birth: format(birthDate, 'yyyy-MM-dd'),
        birth_time: birthTime,
        birth_latitude: birthLocation.latitude,
        birth_longitude: birthLocation.longitude,
        birth_location: `${birthLocation.name}, ${birthLocation.country}`,
        birth_timezone: resolvedTzOffset,
        photo_1: photo1Url,
        photo_2: photo2Url,
        moon_nakshatra_index: vedicProfile.moon.nakshatra,
        moon_sign_index: vedicProfile.moon.sign,
        ascendant_sign_index: vedicProfile.lagna.sign,
        is_manglik: isManglik,
        manglik_cancelled: manglikCancelled,
        atmakaraka_planet: vedicProfile.karakas.atmakaraka,
        darakaraka_planet: vedicProfile.karakas.darakaraka,
        element,
        vedic_chart: JSON.parse(JSON.stringify(vedicProfile)),
        onboarding_complete: true,
      };

      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) {
        console.error('Profile insert error:', error);
        throw error;
      }

    } catch (error: unknown) {
      console.error('Onboarding error:', error);
      setIsAnalyzing(false);
      setIsSubmitting(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleAnalysisComplete = () => {
    toast.success('Your cosmic profile is ready! ✨');
    navigate('/browse');
  };

  if (isAnalyzing) {
    return <AnalyzingScreen onComplete={handleAnalysisComplete} />;
  }

  const StepIcon = stepConfig[currentStep].icon;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-aunty-pink/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aunty-purple/20 rounded-full blur-3xl" />
      
      {/* Progress bar */}
      <div className="relative z-10 p-4">
        <div className="flex gap-1 max-w-md mx-auto">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep 
                  ? 'progress-gradient' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-strong rounded-2xl p-6 sm:p-8"
            >
              {/* Step header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-aunty-pink to-aunty-purple mb-4"
                >
                  <StepIcon className="h-7 w-7 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {stepConfig[currentStep].title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {stepConfig[currentStep].subtitle}
                </p>
              </div>

              {/* Step content */}
              <div className="space-y-6">
                {stepConfig[currentStep].id === 'photos' && (
                  <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
                )}

                {stepConfig[currentStep].id === 'name' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground/80">Your Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What should we call you?"
                        className="bg-muted/50 border-border text-lg py-6 text-center"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {stepConfig[currentStep].id === 'bio' && (
                  <div className="space-y-4">
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell potential matches a little about yourself... hobbies, vibes, what makes you unique! ✨"
                      className="bg-muted/50 border-border min-h-[150px] resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {bio.length}/500
                    </p>
                  </div>
                )}

                {stepConfig[currentStep].id === 'identity' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-foreground/80">I am a...</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'male', label: 'Man' },
                          { value: 'female', label: 'Woman' },
                          { value: 'nonbinary', label: 'Non-binary' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setGender(option.value)}
                            className={`py-3 px-4 rounded-xl font-medium transition-all ${
                              gender === option.value
                                ? 'bg-gradient-to-r from-aunty-pink to-aunty-purple text-white glow-pink'
                                : 'bg-muted/50 text-foreground hover:bg-muted'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground/80">Looking for...</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'men', label: 'Men' },
                          { value: 'women', label: 'Women' },
                          { value: 'everyone', label: 'Everyone' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setLookingFor(option.value)}
                            className={`py-3 px-4 rounded-xl font-medium transition-all ${
                              lookingFor === option.value
                                ? 'bg-gradient-to-r from-aunty-pink to-aunty-purple text-white glow-pink'
                                : 'bg-muted/50 text-foreground hover:bg-muted'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {stepConfig[currentStep].id === 'birthdate' && (
                  <OnboardingDatePicker 
                    value={birthDate} 
                    onChange={setBirthDate} 
                  />
                )}

                {stepConfig[currentStep].id === 'birthtime' && (
                  <OnboardingTimePicker
                    hour={birthHour}
                    minute={birthMinute}
                    ampm={birthAmPm}
                    onHourChange={setBirthHour}
                    onMinuteChange={setBirthMinute}
                    onAmPmChange={setBirthAmPm}
                  />
                )}

                {stepConfig[currentStep].id === 'location' && (
                  <div className="space-y-4">
                    <LocationPicker
                      value={birthLocation}
                      onChange={setBirthLocation}
                      placeholder="Search for your birth city..."
                    />
                    {birthLocation && (
                      <div className="text-center text-sm text-muted-foreground">
                        📍 {birthLocation.name}, {birthLocation.country}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 py-6 border-border bg-muted/50 hover:bg-muted"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={`flex-1 py-6 font-semibold bg-gradient-to-r from-aunty-pink to-aunty-purple hover:opacity-90 transition-opacity ${
                    canProceed() ? 'glow-pink' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : currentStep === TOTAL_STEPS - 1 ? (
                    <>
                      Find My Matches ✨
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
