
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
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-50 to-white">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-3xl bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-pink-100">
            <div className="mb-8 relative">
              <AuntyMascot />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Meet Your Matchmaker
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Your personal matchmaker powered by Vedic Astrology. <br />
              Find your perfect connection written in the stars.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => setShowIntro(false)}
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white px-8 py-6 rounded-xl shadow-md"
              >
                See How It Works
              </Button>
              <Button asChild variant="outline" size="lg" className="border-pink-300 hover:bg-pink-50 py-6 rounded-xl">
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
            className="mb-8"
          >
            ← Back
          </Button>
          
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-pink-100">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">How Aunty Works</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="bg-pink-100 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-inner border border-pink-200">
                    <span className="font-bold text-pink-500">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-purple-700">Create Your Profile</h3>
                    <p className="text-gray-600">Share your birth details, preferences, and what you're looking for in a partner.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="bg-pink-100 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-inner border border-pink-200">
                    <span className="font-bold text-pink-500">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-purple-700">Vedic Astrology Match</h3>
                    <p className="text-gray-600">Our prediction engine analyzes your cosmic compatibility with potential matches.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="bg-pink-100 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0 shadow-inner border border-pink-200">
                    <span className="font-bold text-pink-500">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-purple-700">Meet Your Matches</h3>
                    <p className="text-gray-600">Connect with your most compatible matches and start your journey together.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="mt-10 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-lg overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
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
              <CardFooter className="justify-center border-t border-pink-100 pt-4 pb-6">
                <Button variant="outline" className="w-full border-pink-300 hover:bg-pink-50">
                  <Users className="mr-2 h-4 w-4" />
                  View More Matches
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-pink-100">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">Ready to find your cosmic match?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of South Asians who found their perfect match with Aunty's wisdom.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 px-8 py-6 rounded-xl">
              <Link to="/signup">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
