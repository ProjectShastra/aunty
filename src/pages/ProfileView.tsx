
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit, Calendar, Settings, HeartHandshake } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import InfoTooltip from "@/components/InfoTooltip";
import AuntyMascot from "@/components/AuntyMascot";

// Sample profile data (would come from API/state in real app)
const profileData = {
  id: "1",
  name: "Arjun",
  birthDate: "April 15, 1990",
  birthTime: "4:30 AM",
  birthPlace: "New Delhi, India",
  chartSummary: {
    d1: {
      lagna: "Taurus",
      lagnaLord: "Venus in 10th house",
      moon: "Scorpio - Jyeshtha Nakshatra"
    },
    d9: {
      lagna: "Capricorn",
      lagnaLord: "Saturn in 2nd house"
    }
  },
  compatibilityInfo: {
    nakshatra: "Jyeshtha",
    matchType: "Partners with strong Mercury or Jupiter influence"
  },
  auntysNotes: "You need a grounded partner, preferably from an earthy nakshatra. Your emotional depth requires someone who appreciates sensitivity but also brings light to your intense nature."
};

const ProfileView = () => {
  // Toggle state for "Open to Matches"
  const [openToMatches, setOpenToMatches] = React.useState(true);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#faf3eb] px-3 py-1 rounded-full text-[#6d4773] text-xs font-medium mb-3">
          Divine Insights Powered by Vedic Wisdom
        </div>
        <h1 className="text-2xl md:text-3xl font-light text-[#6d4773] mb-2">
          Aunty's Report
        </h1>
        <p className="text-[#6d4773]/70 max-w-md mx-auto">
          Your personal celestial blueprint and divine matchmaking insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Aunty's Personal Notes - Moved to top as highlight */}
        <Card className="bg-[#e5deff]/50 border-0 shadow-sm md:col-span-3 overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex items-stretch">
              <div className="md:w-1/4 bg-[#e5deff]/70 p-4 flex items-center justify-center">
                <AuntyMascot />
              </div>
              <div className="p-6 md:w-3/4 flex flex-col justify-center">
                <h2 className="text-lg font-medium text-[#6d4773] mb-3">
                  Aunty's Wisdom For You
                </h2>
                <p className="text-[#6d4773]/90 italic text-lg leading-relaxed">
                  "{profileData.auntysNotes}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-white/90 border-0 shadow-sm md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-[#6d4773]" />
              <span className="text-[#6d4773]">Personal Details</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#6d4773] hover:bg-[#faf3eb]/50"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="text-[#6d4773]/80 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Name</p>
                <p className="mt-1">{profileData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Date</p>
                <p className="mt-1">{profileData.birthDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Time</p>
                <p className="mt-1">{profileData.birthTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Place</p>
                <p className="mt-1">{profileData.birthPlace}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Birth Chart Summary - Renamed */}
        <Card className="bg-white/90 border-0 shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#6d4773]" />
              <span className="text-[#6d4773]">Your Cosmic Blueprint</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div>
              <h3 className="text-base font-medium text-[#6d4773] flex items-center gap-2 mb-3">
                Your Core Energy
                <InfoTooltip text="Your main birth chart (Rashi/D-1) showing planetary positions that define your core personality and life path" />
              </h3>
              <div className="mt-3 space-y-3 text-[#6d4773]/80 text-sm bg-[#faf3eb]/30 p-4 rounded-lg">
                <p><span className="font-medium">Rising Sign:</span> {profileData.chartSummary.d1.lagna}</p>
                <p><span className="font-medium">Ruling Planet:</span> {profileData.chartSummary.d1.lagnaLord}</p>
                <p><span className="font-medium">Moon Position:</span> {profileData.chartSummary.d1.moon}</p>
              </div>
            </div>

            <Separator className="my-2 bg-[#faf3eb]" />

            <div>
              <h3 className="text-base font-medium text-[#6d4773] flex items-center gap-2 mb-3">
                Your Soul Blueprint
                <InfoTooltip text="Your relationship and marriage compatibility chart (Navamsa/D-9) that reveals deeper spiritual patterns" />
              </h3>
              <div className="mt-3 space-y-3 text-[#6d4773]/80 text-sm bg-[#faf3eb]/30 p-4 rounded-lg">
                <p><span className="font-medium">Rising Sign:</span> {profileData.chartSummary.d9.lagna}</p>
                <p><span className="font-medium">Ruling Planet:</span> {profileData.chartSummary.d9.lagnaLord}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Info */}
        <Card className="bg-white/90 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-[#6d4773]" />
              <span className="text-[#6d4773]">Divine Matchmaking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-4">
            <div>
              <p className="text-sm font-medium text-[#6d4773]">Your Star Pattern</p>
              <Badge className="mt-2 bg-[#e5deff] text-[#6d4773] hover:bg-[#e5deff] border-0 px-3 py-1">
                {profileData.compatibilityInfo.nakshatra}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-[#6d4773]">Best Cosmic Connection With</p>
              <p className="text-sm text-[#6d4773]/80 mt-2 bg-[#faf3eb]/30 p-3 rounded-lg">
                {profileData.compatibilityInfo.matchType}
              </p>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between bg-[#faf3eb]/30 p-3 rounded-lg">
                <p className="text-sm font-medium text-[#6d4773]">Open to Matches</p>
                <Switch 
                  checked={openToMatches} 
                  onCheckedChange={setOpenToMatches} 
                  className="data-[state=checked]:bg-[#6d4773]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
