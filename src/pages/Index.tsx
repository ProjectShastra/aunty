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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-aunty-violet via-background to-aunty-violet opacity-80" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-aunty-pink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-aunty-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {showIntro ? (
        <div className="container relative z-10 mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-2xl">
            <div className="mb-8">
              <AuntyMascot />
            </div>

            <div className="glass rounded-2xl p-6 mb-8 glow-border">
              <div className="flex items-center justify-center gap-2 text-aunty-glow mb-2">
                <Gift className="h-5 w-5 text-aunty-pink" />
                <p className="text-lg font-semibold gradient-text">
                  Free for Life
                </p>
              </div>
              <p className="text-muted-foreground">
                Only <span className="text-aunty-pink font-bold">{remainingFreeSlots.toLocaleString()}</span> spots left
              </p>
            </div>

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setShowIntro(false)}
                  size="lg" 
                  variant="outline"
                  className="border-aunty-purple/50 hover:bg-aunty-purple/20 text-foreground px-8 py-6 rounded-xl font-semibold backdrop-blur-sm"
                >
                  How It Works
                </Button>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-aunty-pink to-aunty-purple hover:opacity-90 text-white px-8 py-6 rounded-xl font-semibold glow-pink"
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
        <div className="container relative z-10 mx-auto px-4 py-16 text-foreground">
          <Button
            onClick={() => setShowIntro(true)}
            variant="ghost"
            className="mb-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
          >
            ← Back
          </Button>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-8 gradient-text">How Auntie Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4 glass rounded-xl p-4">
                  <div className="bg-gradient-to-br from-aunty-pink to-aunty-purple rounded-xl h-12 w-12 flex items-center justify-center flex-shrink-0 glow-pink">
                    <span className="font-bold text-white text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-foreground">Create Profile</h3>
                    <p className="text-muted-foreground">Share your birth details & preferences.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 glass rounded-xl p-4">
                  <div className="bg-gradient-to-br from-aunty-pink to-aunty-purple rounded-xl h-12 w-12 flex items-center justify-center flex-shrink-0 glow-pink">
                    <span className="font-bold text-white text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-foreground">Vedic Match</h3>
                    <p className="text-muted-foreground">Cosmic compatibility analysis.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 glass rounded-xl p-4">
                  <div className="bg-gradient-to-br from-aunty-pink to-aunty-purple rounded-xl h-12 w-12 flex items-center justify-center flex-shrink-0 glow-pink">
                    <span className="font-bold text-white text-lg">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1 text-foreground">Connect</h3>
                    <p className="text-muted-foreground">Meet your cosmic matches.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 glass rounded-2xl p-5 glow-border">
                <p className="text-foreground font-medium">First <span className="gradient-text">{maxFreeUsers.toLocaleString()}</span> users: Free for Life</p>
                <p className="text-sm mt-1 text-muted-foreground">{remainingFreeSlots.toLocaleString()} spots left</p>
              </div>
              
              <Button 
                asChild 
                className="mt-6 bg-gradient-to-r from-aunty-pink to-aunty-purple hover:opacity-90 text-white px-6 py-5 rounded-xl font-semibold glow-pink"
              >
                <Link to="/signup">
                  Start Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Button 
                  variant="ghost" 
                  className={`px-4 py-2 rounded-xl transition-all ${!showCarousel ? "glass glow-border text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setShowCarousel(false)}
                >
                  List View
                </Button>
                <Button 
                  variant="ghost"
                  className={`px-4 py-2 rounded-xl transition-all ${showCarousel ? "glass glow-border text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
            <h2 className="text-3xl font-bold mb-6 gradient-text">Ready to meet your match?</h2>
            
            <div className="glass rounded-2xl p-5 mb-8 glow-border">
              <p className="text-foreground">
                <span className="text-aunty-pink font-bold">{remainingFreeSlots.toLocaleString()}</span> free spots left
              </p>
            </div>
            
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-aunty-pink to-aunty-purple hover:opacity-90 text-white px-8 py-6 rounded-xl font-semibold glow-pink neon-pulse"
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
