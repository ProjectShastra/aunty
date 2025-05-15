
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {showIntro ? (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="max-w-3xl">
            <div className="mb-6 relative">
              <AuntyMascot />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-800">
              Meet <span className="text-pink-600">Aunty</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700">
              Your personal matchmaker powered by Vedic Astrology. <br />
              Finding love is written in your stars!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowIntro(false)}
                size="lg" 
                className="bg-purple-700 hover:bg-purple-800 text-white px-8"
              >
                See How It Works
              </Button>
              <Button asChild variant="outline" size="lg" className="border-purple-300 hover:bg-purple-100">
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
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-purple-800">How Aunty Works</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-purple-100 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Create Your Profile</h3>
                    <p className="text-gray-600">Share your birth details, preferences, and what you're looking for.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-purple-100 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Vedic Astrology Match</h3>
                    <p className="text-gray-600">Our prediction engine analyzes your cosmic compatibility with potential matches.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-purple-100 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Meet Your Matches</h3>
                    <p className="text-gray-600">Connect with your most compatible matches and start your journey together.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="mt-8 bg-purple-700 hover:bg-purple-800">
                <Link to="/signup">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-800">
                  <div className="flex items-center gap-2">
                    <Heart className="text-pink-500" />
                    <span>Aunty's Top Picks</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  See how our Vedic Astrology matching works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleProfiles.map((profile, index) => (
                  <ProfileCard key={index} profile={profile} />
                ))}
              </CardContent>
              <CardFooter className="justify-center border-t border-purple-100 pt-4">
                <Button variant="outline" className="w-full border-purple-300 hover:bg-purple-100">
                  <Users className="mr-2 h-4 w-4" />
                  View More Matches
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-purple-800">Ready to find your cosmic match?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of South Asians who found their perfect match with Aunty's wisdom.
            </p>
            <Button asChild size="lg" className="bg-purple-700 hover:bg-purple-800">
              <Link to="/signup">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
