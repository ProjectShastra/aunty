
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, ArrowRight } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import AuntyMascot from "@/components/AuntyMascot";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  
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
    <div className="min-h-screen bg-white">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-2xl">
            <div className="mb-8 relative">
              <AuntyMascot />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#9B6BFB]">
              Meet Your Matchmaker
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              Your personal matchmaker powered by Vedic Astrology. <br />
              Find your perfect connection written in the stars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowIntro(false)}
                size="lg" 
                className="bg-[#9B6BFB] hover:bg-[#8A5CF5] text-white px-6 py-5 rounded-md"
              >
                See How It Works
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#9B6BFB] text-[#9B6BFB] hover:bg-[#F5F2FF] py-5 rounded-md">
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <Button
            onClick={() => setShowIntro(true)}
            variant="ghost"
            className="mb-8 text-[#9B6BFB]"
          >
            ← Back
          </Button>
          
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#9B6BFB]">How Aunty Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-[#F5F2FF] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#9B6BFB]">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">Create Your Profile</h3>
                    <p className="text-gray-600">Share your birth details, preferences, and what you're looking for in a partner.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#F5F2FF] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#9B6BFB]">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">Vedic Astrology Match</h3>
                    <p className="text-gray-600">Our prediction engine analyzes your cosmic compatibility with potential matches.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-[#F5F2FF] rounded-md h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[#9B6BFB]">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">Meet Your Matches</h3>
                    <p className="text-gray-600">Connect with your most compatible matches and start your journey together.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="mt-8 bg-[#9B6BFB] hover:bg-[#8A5CF5] text-white">
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Card className="border border-gray-200 shadow-sm overflow-hidden rounded-lg">
              <CardHeader className="bg-[#9B6BFB] text-white">
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Heart className="text-white" />
                    <span>Aunty's Top Picks</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-white/90">
                  See how our Vedic Astrology matching works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {sampleProfiles.map((profile, index) => (
                  <ProfileCard key={index} profile={profile} />
                ))}
              </CardContent>
              <CardFooter className="justify-center border-t border-gray-100 pt-4 pb-6">
                <Button variant="outline" className="w-full border-[#9B6BFB] text-[#9B6BFB] hover:bg-[#F5F2FF]">
                  <Users className="mr-2 h-4 w-4" />
                  View More Matches
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#9B6BFB]">Ready to find your cosmic match?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of South Asians who found their perfect match with Aunty's wisdom.
            </p>
            <Button asChild size="lg" className="bg-[#9B6BFB] hover:bg-[#8A5CF5] text-white px-6 py-5 rounded-md">
              <Link to="/signup">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
