
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Mail 
} from "lucide-react";
import { cn } from "@/lib/utils";
import InfoTooltip from "@/components/InfoTooltip";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [ampm, setAmpm] = useState<string>("");

  const onSubmit = (data: any) => {
    console.log(data);
    // Here we would integrate with the prediction engine
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="container mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center text-[#e45964] hover:text-[#d04854] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="mb-4 text-center">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-[#faf3eb] text-[#6d4773] rounded-full">
            Powered by Ancient Vedic Astrology
          </span>
        </div>
        
        <Card className="border-gray-100 shadow-sm bg-white">
          <CardHeader className="space-y-1 border-b border-gray-50 pb-4">
            <CardTitle className="text-2xl font-medium text-center text-[#6d4773]">Begin Your Journey</CardTitle>
            <CardDescription className="text-center text-[#6d4773]/70">
              Aunty just needs your birth info to find your cosmic match — don't worry, she'll keep it private 😉
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-center mb-6 text-[#6d4773]/80">
              Accurate birth details = better compatibility scores
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <User className="h-4 w-4 text-[#6d4773]/70 mr-2" />
                  <h3 className="text-sm font-medium text-[#6d4773]">Your Identity</h3>
                  <Separator className="flex-grow ml-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[#6d4773]">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: true })}
                      placeholder="First name"
                      className={errors.firstName ? "border-red-300" : "border-gray-100"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[#6d4773]">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: true })}
                      placeholder="Last name"
                      className={errors.lastName ? "border-red-300" : "border-gray-100"}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="email" className="text-[#6d4773] flex items-center gap-1.5">
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Your email"
                    className={errors.email ? "border-red-300" : "border-gray-100"}
                  />
                  <p className="text-xs text-[#6d4773]/60 mt-1 italic">
                    <Mail className="h-3 w-3 inline mr-1" />
                    She won't spam you. She's not that kind of Aunty.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-4 w-4 text-[#6d4773]/70 mr-2" />
                  <h3 className="text-sm font-medium text-[#6d4773]">Your Birth Details</h3>
                  <Separator className="flex-grow ml-3" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label className="text-[#6d4773]">Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-100",
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

                <div className="space-y-2 mb-4">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>Birth Time</span>
                    <InfoTooltip text="Used to calculate your cosmic blueprint (D-1, D-9) for more accurate matches" />
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input 
                      placeholder="Hour" 
                      type="number" 
                      min="0" 
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
                  <p className="text-xs text-[#6d4773]/60 mt-1 italic">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Don't guess — text your mom if you have to.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
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
              
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-sm font-medium text-[#6d4773]">Your Preferences</h3>
                  <Separator className="flex-grow ml-3" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>I am</span>
                  </Label>
                  <Select>
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

                <div className="space-y-2 mt-4">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>Looking for</span>
                  </Label>
                  <Select>
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
              
              <Button type="submit" className="w-full bg-[#e45964] hover:bg-[#d04854] text-white font-normal">
                Continue to Next Step
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-50 pt-4">
            <p className="text-sm text-gray-500">
              Already have an account? <Link to="/login" className="text-[#e45964] hover:text-[#d04854]">Log in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
