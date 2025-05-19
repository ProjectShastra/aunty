import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, ArrowRight, Gift } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import AuntyMascot from "@/components/AuntyMascot";
import ProfileCardsList from "@/components/ProfileCardsList";
import ProfileCardsCarousel from "@/components/ProfileCardsCarousel";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [signups, setSignups] = useState(3182);
  const [showCarousel, setShowCarousel] = useState(false);
  const maxFreeUsers = 5000; // Total free slots available
  const remainingFreeSlots = Math.max(0, maxFreeUsers - signups);
  
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

            <div className="bg-[#faf3eb] bg-opacity-80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-md">
              <div className="flex items-center justify-center gap-2 text-[#6d4773] mb-1">
                <Gift className="h-4 w-4 text-[#6d4773]" />
                <p className="text-[#6d4773]">
                  Free for Life
                </p>
              </div>
              <p className="text-[#6d4773]">
                Only {remainingFreeSlots.toLocaleString()} spots left
              </p>
            </div>

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowIntro(false)}
                  size="lg" 
                  className="bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773] px-6 py-5 rounded-md font-semibold"
                >
                  How It Works
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
                    <h3 className="font-semibold text-xl mb-1 text-[#faf3eb]">Create Profile</h3>
                    <p className="text-[#faf3eb] opacity-90">Share your birth details & preferences.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#faf3eb] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#e45964]">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-[#faf3eb]">Vedic Match</h3>
                    <p className="text-[#faf3eb] opacity-90">Cosmic compatibility analysis.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#faf3eb] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#e45964]">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-[#faf3eb]">Connect</h3>
                    <p className="text-[#faf3eb] opacity-90">Meet your cosmic matches.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-[#faf3eb] bg-opacity-80 backdrop-blur-sm rounded-xl p-4 shadow-md text-[#6d4773]">
                <p>First {maxFreeUsers.toLocaleString()} users: Free for Life</p>
                <p className="text-sm mt-1">{remainingFreeSlots.toLocaleString()} spots left</p>
              </div>
              
              <Button 
                asChild 
                className="mt-4 bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773]"
              >
                <Link to="/signup">
                  Start Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-2">
                <Button 
                  variant="ghost" 
                  className={`px-3 py-2 ${!showCarousel ? "bg-[#faf3eb]/20" : ""}`}
                  onClick={() => setShowCarousel(false)}
                >
                  List View
                </Button>
                <Button 
                  variant="ghost"
                  className={`px-3 py-2 ${showCarousel ? "bg-[#faf3eb]/20" : ""}`}
                  onClick={() => setShowCarousel(true)}
                >
                  Carousel
                </Button>
              </div>
              
              {showCarousel ? (
                <ProfileCardsCarousel profiles={sampleProfiles} />
              ) : (
                <ProfileCardsList profiles={sampleProfiles} />
              )}
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#faf3eb]">Ready to meet your match?</h2>
            
            <div className="bg-[#faf3eb] bg-opacity-80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-md">
              <p className="text-[#6d4773]">
                {remainingFreeSlots.toLocaleString()} free spots left
              </p>
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-[#faf3eb] hover:bg-[#f5e9d7] text-[#6d4773] px-6 py-5 rounded-md"
            >
              <Link to="/signup">Create Free Profile</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
