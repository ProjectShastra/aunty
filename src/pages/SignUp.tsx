
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
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import InfoTooltip from "@/components/InfoTooltip";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedDate, setSelectedDate] = useState<Date>();

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
        
        <Card className="border-gray-100 shadow-sm bg-white">
          <CardHeader className="space-y-1 border-b border-gray-50 pb-4">
            <CardTitle className="text-2xl font-medium text-center text-[#6d4773]">Begin Your Journey</CardTitle>
            <CardDescription className="text-center text-[#6d4773]/70">
              Share your cosmic details for perfect matchmaking
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-sm font-medium text-[#6d4773]">Personal Details</h3>
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
                  <Label htmlFor="email" className="text-[#6d4773]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: true })}
                    placeholder="Your email"
                    className={errors.email ? "border-red-300" : "border-gray-100"}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>I am</span>
                    <Select>
                      <SelectTrigger className="w-full max-w-[180px] border-gray-100">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Man</SelectItem>
                        <SelectItem value="female">Woman</SelectItem>
                        <SelectItem value="nonbinary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>Looking for</span>
                    <Select>
                      <SelectTrigger className="w-full max-w-[180px] border-gray-100">
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="everyone">Everyone</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-sm font-medium text-[#6d4773]">Birth Details</h3>
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
                    <InfoTooltip text="Your birth time helps create accurate Vedic astrological charts for better matchmaking" />
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="Hour" type="number" min="0" max="23" className="border-gray-100" />
                    <Input placeholder="Minute" type="number" min="0" max="59" className="border-gray-100" />
                    <Select>
                      <SelectTrigger className="border-gray-100">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="am">AM</SelectItem>
                        <SelectItem value="pm">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#6d4773] flex items-center gap-1.5">
                    <span>Birth City</span>
                    <InfoTooltip text="Your birth location influences planetary positions in your birth chart, essential for Vedic compatibility analysis" />
                  </Label>
                  <Input placeholder="Where were you born?" className="border-gray-100" />
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
