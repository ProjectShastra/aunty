
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";

// Sample match data (would come from API/props in real app)
const matchData = {
  id: "1",
  name: "Priya",
  age: 28,
  location: "Mumbai",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  compatibilityTags: [
    { tag: "Spiritual Match", explanation: "Your Venus and Jupiter are in harmony, creating a profound spiritual connection" },
    { tag: "Emotional Chemistry", explanation: "Moon signs in friendly nakshatras promote deep emotional understanding" },
    { tag: "Dharma-Aligned", explanation: "Similar life paths and complementary Saturn placements" }
  ],
  auntysInsight: "Your Moon signs align for emotional trust. Her Jupiter aspects your Sun, bringing growth and prosperity to your union."
};

const MatchView = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block bg-[#faf3eb] px-3 py-1 rounded-full text-[#6d4773] text-xs font-medium mb-4">
          Powered by Ancient Vedic Astrology
        </div>
        <h1 className="text-2xl md:text-3xl font-light text-[#6d4773] mb-2">
          Your Cosmic Match
        </h1>
        <p className="text-[#6d4773]/70 max-w-md mx-auto">
          Aunty has found someone whose stars align with yours. This connection goes beyond the surface.
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm bg-white/90">
        <CardContent className="p-0">
          <div className="md:flex">
            <div className="md:w-1/3 bg-[#faf3eb]/50 p-6 flex flex-col items-center justify-center">
              <Avatar className="h-32 w-32 mb-4 border-2 border-[#faf3eb]">
                <AvatarImage src={matchData.imageUrl} alt={matchData.name} />
                <AvatarFallback className="bg-[#e45964]/10 text-[#6d4773]">
                  {matchData.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium text-[#6d4773]">{matchData.name}, {matchData.age}</h2>
              <p className="text-[#6d4773]/70 text-sm">{matchData.location}</p>
            </div>

            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {matchData.compatibilityTags.map((item, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <Badge 
                        className="bg-[#e5deff] hover:bg-[#e5deff]/80 text-[#6d4773] border-0 cursor-help"
                      >
                        {item.tag}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-white text-[#6d4773] border border-[#e45964]/10 w-64">
                      <p className="text-sm">{item.explanation}</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>

              <Separator className="my-4 bg-[#faf3eb]" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-[#6d4773]/20 text-[#6d4773] hover:bg-[#faf3eb]/50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    See Why Aunty Picked This Match
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white border-[#e45964]/10 p-4 w-72">
                  <div className="text-center">
                    <p className="text-[#6d4773] text-sm italic mb-2">
                      "{matchData.auntysInsight}"
                    </p>
                    <p className="text-[#6d4773]/70 text-xs">
                      — Aunty's Vedic Insight
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchView;
