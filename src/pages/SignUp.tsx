import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Mail,
  ChevronDown,
  Lock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import InfoTooltip from "@/components/InfoTooltip";
import AuntyMascot from "@/components/AuntyMascot";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [ampm, setAmpm] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    // Validate password length
    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered. Please log in instead.");
        } else if (error.message.includes("invalid email")) {
          toast.error("Please enter a valid email address");
        } else {
          toast.error(`Sign up failed: ${error.message}`);
        }
        return;
      }
      
      toast.success("Account created! Redirecting to complete your profile...");
      
      // Store form data for onboarding
      sessionStorage.setItem('signupData', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        selectedDate,
        hour,
        minute,
        ampm,
        gender,
        lookingFor
      }));
      
      // Redirect to onboarding after short delay
      setTimeout(() => {
        navigate("/onboarding");
      }, 1500);
      
    } catch (err: any) {
      toast.error(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          <div className="w-full md:w-1/3 flex justify-center md:sticky md:top-8">
            <AuntyMascot />
          </div>
          
          <div className="w-full md:w-2/3">
            <Link to="/" className="inline-flex items-center text-[#e45964] hover:text-[#d04854] mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-[#faf3eb] text-[#6d4773] rounded-full">
                Powered by Ancient Vedic Astrology
              </span>
            </div>
            
            <Card className="border-gray-100 shadow-sm bg-white">
              <CardHeader className="space-y-2 border-b border-gray-50 pb-5">
                <CardTitle className="text-2xl font-medium text-[#6d4773]">Begin Your Journey</CardTitle>
                <CardDescription className="text-[#6d4773]/70 text-base">
                  Aunty just needs your birth info to find your cosmic match — don't worry, she'll keep it private 😉
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <p className="text-sm text-center mb-2 text-[#6d4773]/80">
                  Accurate birth details = better compatibility scores
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="rounded-lg bg-[#faf9fc] p-5 border border-gray-100">
                    <div className="flex items-center mb-5">
                      <User className="h-5 w-5 text-[#6d4773] mr-2" />
                      <h3 className="text-base font-semibold text-[#6d4773]">Your Identity</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>
                    
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[#6d4773]/80 font-normal">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName", { required: "First name is required" })}
                            placeholder="First name"
                            className={errors.firstName ? "border-red-300" : "border-gray-100"}
                          />
                          {errors.firstName && (
                            <p className="text-xs text-red-500">{errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[#6d4773]/80 font-normal">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName", { required: "Last name is required" })}
                            placeholder="Last name"
                            className={errors.lastName ? "border-red-300" : "border-gray-100"}
                          />
                          {errors.lastName && (
                            <p className="text-xs text-red-500">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#6d4773]/80 font-normal flex items-center gap-1.5">
                          <span>Email</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          placeholder="Your email"
                          className={errors.email ? "border-red-300" : "border-gray-100"}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center text-xs text-[#6d4773]/60 mt-1 italic">
                            <Mail className="h-3 w-3 inline mr-1" />
                            <span>Email privacy note</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="text-xs text-[#6d4773]/60 mt-1 italic pl-4">
                              She won't spam you. She's not that kind of Aunty.
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-[#6d4773]/80 font-normal flex items-center gap-1.5">
                            <Lock className="h-3 w-3" />
                            <span>Password</span>
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            {...register("password", { 
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                              }
                            })}
                            placeholder="Create password"
                            className={errors.password ? "border-red-300" : "border-gray-100"}
                          />
                          {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-[#6d4773]/80 font-normal">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", { 
                              required: "Please confirm your password",
                              validate: value => value === password || "Passwords don't match"
                            })}
                            placeholder="Confirm password"
                            className={errors.confirmPassword ? "border-red-300" : "border-gray-100"}
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#faf9fc] p-5 border border-gray-100">
                    <div className="flex items-center mb-5">
                      <CalendarIcon className="h-5 w-5 text-[#6d4773] mr-2" />
                      <h3 className="text-base font-semibold text-[#6d4773]">Your Birth Details</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>
                    
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-[#6d4773]/80 font-normal">Birth Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-100 h-10",
                                !selectedDate && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : <span>Select your birth date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              className="bg-white pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6d4773]/80 font-normal flex items-center gap-1.5">
                          <span>Birth Time</span>
                          <InfoTooltip text="Used to calculate your cosmic blueprint (D-1, D-9) for more accurate matches" />
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <Input 
                            placeholder="Hour" 
                            type="number" 
                            min="1" 
                            max="12" 
                            className="border-gray-100" 
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                          />
                          <Input 
                            placeholder="Minute" 
                            type="number" 
                            min="0" 
                            max="59" 
                            className="border-gray-100" 
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                          />
                          <Select value={ampm} onValueChange={setAmpm}>
                            <SelectTrigger className="border-gray-100">
                              <SelectValue placeholder="AM/PM" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="am">AM</SelectItem>
                              <SelectItem value="pm">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center text-xs text-[#6d4773]/60 mt-1 italic">
                            <Clock className="h-3 w-3 inline mr-1" />
                            <span>Birth time tip</span>
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="text-xs text-[#6d4773]/60 mt-1 italic pl-4">
                              Don't guess — text your mom if you have to.
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6d4773]/80 font-normal flex items-center gap-1.5">
                          <span>Birth City</span>
                          <InfoTooltip text="Needed to determine planetary positions accurately for Vedic compatibility analysis" />
                        </Label>
                        <Input 
                          placeholder="Where were you born?" 
                          className="border-gray-100" 
                        />
                        <p className="text-xs text-[#6d4773]/60 mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          Type your city's name to search our database.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-[#faf9fc] p-5 border border-gray-100">
                    <div className="flex items-center mb-5">
                      <h3 className="text-base font-semibold text-[#6d4773]">Your Preferences</h3>
                      <Separator className="flex-grow ml-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div className="space-y-2">
                        <Label className="text-[#6d4773]/80 font-normal">I am</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="w-full border-gray-100">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Man</SelectItem>
                            <SelectItem value="female">Woman</SelectItem>
                            <SelectItem value="nonbinary">Non-binary</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#6d4773]/80 font-normal">Looking for</Label>
                        <Select value={lookingFor} onValueChange={setLookingFor}>
                          <SelectTrigger className="w-full border-gray-100">
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="everyone">Everyone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#e45964] hover:bg-[#d04854] text-white font-normal py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Continue to Next Step"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-gray-50 pt-5 pb-6">
                <p className="text-sm text-gray-500">
                  Already have an account? <Link to="/auth" className="text-[#e45964] hover:text-[#d04854]">Log in</Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
