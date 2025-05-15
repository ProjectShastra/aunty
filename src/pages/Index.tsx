
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, ArrowRight, Flame, Sparkles, BadgePercent, Gift } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import AuntyMascot from "@/components/AuntyMascot";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [signups, setSignups] = useState(3182);
  const maxFreeUsers = 5000; // Total free slots available
  const remainingFreeSlots = Math.max(0, maxFreeUsers - signups);
  const freePercentage = Math.round((remainingFreeSlots / maxFreeUsers) * 100);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSignups((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const sampleProfiles = [
    {
      name: "Priya",
      age: 28,
      location: "Mumbai",
      compatibility: 87,
      imageUrl: "/placeholder.svg"
    },
    {
      name: "Raj",
      age: 30,
      location: "Delhi",
      compatibility: 92,
      imageUrl: "/placeholder.svg"
    },
    {
      name: "Ananya",
      age: 26,
      location: "Bangalore",
      compatibility: 78,
      imageUrl: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#e45964]">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-2xl">
            <div className="mb-8">
              <AuntyMascot />
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg animate-pulse">
              <p className="text-xl font-semibold text-[#faf3eb]">
                <Flame className="inline-block mr-2 h-5 w-5 text-[#faf3eb]" />
                <span className="font-bold">{signups.toLocaleString()}</span> people have already found their cosmic match!
              </p>
              <p className="text-[#faf3eb] text-sm mt-1">Limited spots available. Don't miss your perfect match!</p>
            </div>

            <div className="bg-[#FDE1D3] bg-opacity-90 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-lg border-2 border-[#F97316] border-dashed">
              <div className="flex items-center justify-center gap-2 text-[#6d4773] mb-2">
                <Gift className="h-5 w-5" />
                <p className="text-lg font-bold">
                  Special Launch Offer
                </p>
                <Gift className="h-5 w-5" />
              </div>
              <p className="text-[#6d4773] font-semibold">
                Only <span className="text-[#F97316] font-bold text-xl">{remainingFreeSlots.toLocaleString()}</span> lifetime free memberships remaining!
              </p>
              <p className="text-sm text-[#6d4773] mt-1">
                Find your soulmate before you need a subscription 
                <span className="italic">(but you won't need it anyway, right?)</span> 😉
              </p>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5 mt-3">
                <div 
                  className="bg-[#F97316] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${freePercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-[#6d4773] mt-1 font-medium">{freePercentage}% of free slots remaining</p>
            </div>

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowIntro(false)}
                  size="lg" 
                  className="bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773] px-6 py-5 rounded-md font-semibold"
                >
                  See How It Works
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773] px-6 py-5 rounded-md font-semibold"
                >
                  <Link to="/signup">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 text-[#faf3eb]">
          <Button
            onClick={() => setShowIntro(true)}
            variant="ghost"
            className="mb-8 text-[#faf3eb] hover:bg-[#eb6a74]"
          >
            ← Back
          </Button>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#faf3eb]">How Auntie Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-[#faf3eb] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#e45964]">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-[#faf3eb]">Create Your Profile</h3>
                    <p className="text-[#faf3eb] opacity-90">Share your birth details, preferences, and what you're looking for in a partner.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#faf3eb] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#e45964]">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-[#faf3eb]">Vedic Astrology Match</h3>
                    <p className="text-[#faf3eb] opacity-90">Our prediction engine analyzes your cosmic compatibility with potential matches.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#faf3eb] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#e45964]">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-[#faf3eb]">Meet Your Matches</h3>
                    <p className="text-[#faf3eb] opacity-90">Connect with your most compatible matches and start your journey together.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-[#FDE1D3] bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-[#F97316] border-dashed text-[#6d4773]">
                <div className="flex items-center gap-2 mb-2">
                  <BadgePercent className="h-6 w-6 text-[#F97316]" />
                  <h3 className="font-bold text-lg">Early Bird Special</h3>
                </div>
                <p className="font-semibold">First {maxFreeUsers.toLocaleString()} users get <span className="underline">lifetime free access</span></p>
                <p className="text-sm mt-1">Only <span className="font-bold text-[#F97316]">{remainingFreeSlots.toLocaleString()}</span> spots left!</p>
                <p className="text-xs italic mt-2">But you'll find your soulmate so fast, you won't need it for long anyway! 😉</p>
              </div>
              
              <Button 
                asChild 
                className="mt-4 bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773]"
              >
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Card className="border-0 shadow-lg overflow-hidden rounded-lg bg-[#faf3eb]">
              <CardHeader className="bg-[#6d4773] text-[#faf3eb]">
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Heart className="text-[#faf3eb]" />
                    <span>Auntie's Top Picks</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-[#faf3eb] opacity-90">
                  See how our Vedic Astrology matching works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {sampleProfiles.map((profile, index) => (
                  <ProfileCard key={index} profile={profile} />
                ))}
              </CardContent>
              <CardFooter className="justify-center border-t border-gray-100 pt-4 pb-6">
                <Button 
                  variant="outline" 
                  className="w-full border-[#6d4773] text-[#6d4773] hover:bg-[#f5e9d7]"
                >
                  <Users className="mr-2 h-4 w-4" />
                  View More Matches
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#faf3eb]">Ready to find your cosmic match?</h2>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-[#faf3eb]" />
                <p className="text-lg font-semibold text-[#faf3eb]">
                  <span className="font-bold">{signups.toLocaleString()}</span> people already waiting for their match!
                </p>
                <Sparkles className="h-5 w-5 text-[#faf3eb]" />
              </div>
              <p className="text-sm text-[#faf3eb] opacity-90">Early access is limited — Claim your spot before they're gone!</p>
            </div>
            
            <div className="bg-[#FDE1D3] bg-opacity-90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg border-2 border-[#F97316] border-dashed">
              <p className="font-bold text-[#6d4773]">
                Only <span className="text-2xl text-[#F97316]">{remainingFreeSlots.toLocaleString()}</span> lifetime free memberships remaining!
              </p>
              <p className="text-sm text-[#6d4773] italic mt-1">
                Find your perfect match and you won't need a subscription anyway! 💞
              </p>
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773] px-6 py-5 rounded-md"
            >
              <Link to="/signup">Create Your Free Profile Now</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
