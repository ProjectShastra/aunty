
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit, Calendar, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/InfoTooltip";

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
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-[#faf3eb] px-3 py-1 rounded-full text-[#6d4773] text-xs font-medium mb-4">
          Powered by Ancient Vedic Astrology
        </div>
        <h1 className="text-2xl md:text-3xl font-light text-[#6d4773] mb-2">
          My Cosmic Profile
        </h1>
        <p className="text-[#6d4773]/70 max-w-md mx-auto">
          Your astrological blueprint and compatibility insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <CardContent className="text-[#6d4773]/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Name</p>
                <p>{profileData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Date</p>
                <p>{profileData.birthDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Time</p>
                <p>{profileData.birthTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Birth Place</p>
                <p>{profileData.birthPlace}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Birth Chart Summary */}
        <Card className="bg-white/90 border-0 shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#6d4773]" />
              <span className="text-[#6d4773]">Birth Chart Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#6d4773] flex items-center gap-2">
                  Rashi Chart (D-1)
                  <InfoTooltip text="Your main birth chart showing planetary positions at birth" />
                </h3>
                <div className="mt-2 space-y-1 text-[#6d4773]/80 text-sm">
                  <p><span className="font-medium">Lagna (Ascendant):</span> {profileData.chartSummary.d1.lagna}</p>
                  <p><span className="font-medium">Lagna Lord:</span> {profileData.chartSummary.d1.lagnaLord}</p>
                  <p><span className="font-medium">Moon Sign:</span> {profileData.chartSummary.d1.moon}</p>
                </div>
              </div>

              <Separator className="my-2 bg-[#faf3eb]" />

              <div>
                <h3 className="text-sm font-medium text-[#6d4773] flex items-center gap-2">
                  Navamsa Chart (D-9)
                  <InfoTooltip text="Your marriage compatibility chart used for relationship analysis" />
                </h3>
                <div className="mt-2 space-y-1 text-[#6d4773]/80 text-sm">
                  <p><span className="font-medium">Lagna (Ascendant):</span> {profileData.chartSummary.d9.lagna}</p>
                  <p><span className="font-medium">Lagna Lord:</span> {profileData.chartSummary.d9.lagnaLord}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Info */}
        <Card className="bg-white/90 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#6d4773]" />
              <span className="text-[#6d4773]">Compatibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Nakshatra</p>
                <Badge className="mt-1 bg-[#e5deff] text-[#6d4773] hover:bg-[#e5deff] border-0">
                  {profileData.compatibilityInfo.nakshatra}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6d4773]">Most Compatible With</p>
                <p className="text-sm text-[#6d4773]/80 mt-1">
                  {profileData.compatibilityInfo.matchType}
                </p>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#6d4773]">Open to Matches</p>
                  <Switch 
                    checked={openToMatches} 
                    onCheckedChange={setOpenToMatches} 
                    className="data-[state=checked]:bg-[#6d4773]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aunty's Notes */}
        <Card className="bg-[#faf3eb]/50 border-0 shadow-sm md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#6d4773]">
              Aunty's Personal Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#6d4773]/90 italic">
              "{profileData.auntysNotes}"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
