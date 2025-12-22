import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Clock, Sparkles, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

import { PhotoUpload } from '@/components/onboarding/PhotoUpload';
import { LocationPicker, LocationData } from '@/components/onboarding/LocationPicker';
import { AnalyzingScreen } from '@/components/onboarding/AnalyzingScreen';
import AuntyMascot from '@/components/AuntyMascot';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { calculateProfile } from '@/lib/vedic-astrology';
import { getElementFromMoonSign } from '@/lib/element-calculator';

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  gender: z.string().min(1, 'Please select your gender'),
  lookingFor: z.string().min(1, 'Please select who you are looking for'),
  birthDate: z.date({ required_error: 'Birth date is required' }),
  birthHour: z.string().min(1, 'Hour is required'),
  birthMinute: z.string().min(1, 'Minute is required'),
  birthAmPm: z.string().min(1, 'AM/PM is required'),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [photos, setPhotos] = useState<(File | null)[]>([null, null]);
  const [birthLocation, setBirthLocation] = useState<LocationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      birthHour: '',
      birthMinute: '',
      birthAmPm: '',
    }
  });

  const selectedDate = watch('birthDate');

  const uploadPhoto = async (file: File, index: number): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/photo_${index + 1}.${fileExt}`;
    
    const { error, data } = await supabase.storage
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

  const onSubmit = async (data: OnboardingForm) => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    if (!birthLocation) {
      toast.error('Please select your birth city');
      return;
    }

    if (!photos[0]) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert time to 24-hour format
      let hour = parseInt(data.birthHour);
      if (data.birthAmPm === 'pm' && hour !== 12) hour += 12;
      if (data.birthAmPm === 'am' && hour === 12) hour = 0;
      const birthTime = `${hour.toString().padStart(2, '0')}:${data.birthMinute.padStart(2, '0')}`;

      // Calculate Vedic profile
      const vedicProfile = calculateProfile(
        data.birthDate,
        birthTime,
        birthLocation.latitude,
        birthLocation.longitude,
        birthLocation.timezone
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

      // Check manglik cancellation - mild severity = effectively cancelled
      const isManglik = vedicProfile.doshas.isManglik;
      const manglikCancelled = isManglik && vedicProfile.doshas.manglikSeverity === 'mild';

      // Prepare profile data
      const profileData = {
        user_id: user.id,
        name: data.name,
        bio: data.bio || null,
        gender: data.gender,
        looking_for: data.lookingFor,
        date_of_birth: format(data.birthDate, 'yyyy-MM-dd'),
        birth_time: birthTime,
        birth_latitude: birthLocation.latitude,
        birth_longitude: birthLocation.longitude,
        birth_location: `${birthLocation.name}, ${birthLocation.country}`,
        birth_timezone: birthLocation.timezone,
        photo_1: photo1Url,
        photo_2: photo2Url,
        // Astrological Keys - karakas are already PlanetId strings
        moon_nakshatra_index: vedicProfile.moon.nakshatra,
        moon_sign_index: vedicProfile.moon.sign,
        ascendant_sign_index: vedicProfile.lagna.sign,
        is_manglik: isManglik,
        manglik_cancelled: manglikCancelled,
        atmakaraka_planet: vedicProfile.karakas.atmakaraka,
        darakaraka_planet: vedicProfile.karakas.darakaraka,
        element: element,
        vedic_chart: JSON.parse(JSON.stringify(vedicProfile)),
        onboarding_complete: true,
      };

      // Insert profile (wrap in array for Supabase insert)
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
    toast.success('Your cosmic profile is ready!');
    navigate('/browse');
  };

  if (isAnalyzing) {
    return <AnalyzingScreen onComplete={handleAnalysisComplete} />;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left side - Mascot */}
          <div className="w-full lg:w-1/3 flex justify-center lg:sticky lg:top-8">
            <div className="space-y-4 text-center">
              <AuntyMascot />
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                "Beta, tell Aunty everything! The more accurate your details, the better matches I can find!"
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-2/3">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                <Sparkles className="inline h-3 w-3 mr-1" />
                Powered by Vedic Astrology
              </span>
            </div>

            <Card className="border-border shadow-lg">
              <CardHeader className="border-b border-border pb-5">
                <CardTitle className="text-2xl font-medium text-secondary">Create Your Profile</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Aunty needs your birth details to find your cosmic match — don't worry, she'll keep it private 😉
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Photos Section */}
                  <div className="rounded-lg bg-muted/30 p-5 border border-border">
                    <div className="flex items-center mb-5">
                      <User className="h-5 w-5 text-secondary mr-2" />
                      <h3 className="text-base font-semibold text-secondary">Your Photos</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>
                    <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
                  </div>

                  {/* Identity Section */}
                  <div className="rounded-lg bg-muted/30 p-5 border border-border">
                    <div className="flex items-center mb-5">
                      <User className="h-5 w-5 text-secondary mr-2" />
                      <h3 className="text-base font-semibold text-secondary">About You</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-muted-foreground font-normal">Your Name</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="What should we call you?"
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-muted-foreground font-normal">Bio</Label>
                        <Textarea
                          id="bio"
                          {...register('bio')}
                          placeholder="Tell potential matches a little about yourself..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-muted-foreground font-normal">I am</Label>
                          <Select onValueChange={(v) => setValue('gender', v)}>
                            <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Man</SelectItem>
                              <SelectItem value="female">Woman</SelectItem>
                              <SelectItem value="nonbinary">Non-binary</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className="text-xs text-destructive">{errors.gender.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-muted-foreground font-normal">Looking for</Label>
                          <Select onValueChange={(v) => setValue('lookingFor', v)}>
                            <SelectTrigger className={errors.lookingFor ? 'border-destructive' : ''}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="men">Men</SelectItem>
                              <SelectItem value="women">Women</SelectItem>
                              <SelectItem value="everyone">Everyone</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.lookingFor && (
                            <p className="text-xs text-destructive">{errors.lookingFor.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Birth Details Section */}
                  <div className="rounded-lg bg-muted/30 p-5 border border-border">
                    <div className="flex items-center mb-5">
                      <CalendarIcon className="h-5 w-5 text-secondary mr-2" />
                      <h3 className="text-base font-semibold text-secondary">Birth Details</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>

                    <div className="space-y-5">
                      {/* Birth Date */}
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-normal">Birth Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground",
                                errors.birthDate && "border-destructive"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : 'Select your birth date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setValue('birthDate', date)}
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1940}
                              toYear={2010}
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.birthDate && (
                          <p className="text-xs text-destructive">{errors.birthDate.message}</p>
                        )}
                      </div>

                      {/* Birth Time */}
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-normal flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          Birth Time
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            placeholder="Hour"
                            {...register('birthHour')}
                            className={errors.birthHour ? 'border-destructive' : ''}
                          />
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            placeholder="Min"
                            {...register('birthMinute')}
                            className={errors.birthMinute ? 'border-destructive' : ''}
                          />
                          <Select onValueChange={(v) => setValue('birthAmPm', v)}>
                            <SelectTrigger className={errors.birthAmPm ? 'border-destructive' : ''}>
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="am">AM</SelectItem>
                              <SelectItem value="pm">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Don't guess — text your mom if you have to! 😄
                        </p>
                      </div>

                      {/* Birth Location */}
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-normal">Birth City</Label>
                        <LocationPicker
                          value={birthLocation}
                          onChange={setBirthLocation}
                        />
                        <p className="text-xs text-muted-foreground">
                          Accurate location = better cosmic matches!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
                  >
                    {isSubmitting ? (
                      <>Finding Your Stars...</>
                    ) : (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Let Aunty Analyze Your Stars
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Your birth details are used only for compatibility matching and are kept private.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
