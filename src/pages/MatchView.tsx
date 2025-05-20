
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import AuntyMascot from "@/components/AuntyMascot";

// Sample match data (would come from API/props in real app)
const matchData = {
  id: "1",
  name: "Priya",
  age: 28,
  location: "Mumbai",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  compatibilityTags: [
    { 
      tag: "Spiritual Match", 
      explanation: "Your Venus and Jupiter are in harmony, creating a profound spiritual connection",
      icon: Star
    },
    { 
      tag: "Emotional Chemistry", 
      explanation: "Moon signs in friendly nakshatras promote deep emotional understanding",
      icon: Heart 
    },
    { 
      tag: "Dharma-Aligned", 
      explanation: "Similar life paths and complementary Saturn placements",
      icon: MessageCircle 
    }
  ],
  astrologyHighlights: [
    "Your Venus aligns with their Moon = smooth communication",
    "Jupiter-Jupiter connection brings growth and expansion"
  ],
  auntysInsights: [
    "Your Moon signs align for emotional trust. Her Jupiter aspects your Sun, bringing growth and prosperity to your union.",
    "The Venus-Moon connection I see here creates a foundation of mutual care and appreciation for beauty.",
    "Both of your 7th house rulers are friendly to each other - this is a match that grows stronger with time."
  ]
};

const MatchView = () => {
  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="inline-block bg-[#faf3eb] px-3 py-1 rounded-full text-[#6d4773] text-xs font-medium mb-3">
          Celestial Connection
        </div>
        <h1 className="text-2xl md:text-3xl font-light text-[#6d4773] mb-2">
          Your Divine Match
        </h1>
        <p className="text-[#6d4773]/70 max-w-md mx-auto">
          Aunty has found someone whose stars align beautifully with yours
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-md bg-white/90 rounded-2xl">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="bg-[#faf3eb]/50 p-6 flex flex-col items-center">
              <Avatar className="h-28 w-28 mb-4 border-2 border-[#e5deff]">
                <AvatarImage src={matchData.imageUrl} alt={matchData.name} />
                <AvatarFallback className="bg-[#e45964]/10 text-[#6d4773]">
                  {matchData.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium text-[#6d4773]">{matchData.name}, {matchData.age}</h2>
              <p className="text-[#6d4773]/70 text-sm">{matchData.location}</p>
              
              <div className="mt-4 space-y-2 w-full">
                {matchData.astrologyHighlights.map((highlight, idx) => (
                  <div key={idx} className="bg-white/70 rounded-lg p-3 text-sm text-[#6d4773] text-center">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-medium text-[#6d4773] mb-3">Cosmic Connection Points</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {matchData.compatibilityTags.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <Badge 
                          className="bg-[#e5deff] hover:bg-[#e5deff]/80 text-[#6d4773] border-0 cursor-help flex items-center gap-1.5 py-1.5"
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                          {item.tag}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-white text-[#6d4773] border border-[#e45964]/10 w-64">
                        <p className="text-sm">{item.explanation}</p>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>

              <Separator className="my-5 bg-[#faf3eb]" />
              
              <div className="flex items-center mb-4">
                <h3 className="text-base font-medium text-[#6d4773]">Aunty's Wisdom Cards</h3>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {matchData.auntysInsights.map((insight, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-[#faf3eb]/60 rounded-xl p-4 text-center relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm">
                          <div className="h-6 w-6 rounded-full bg-[#e5deff] flex items-center justify-center text-[#6d4773] font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <p className="text-[#6d4773] text-sm italic mt-3">
                          "{insight}"
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3 h-7 w-7 bg-white hover:bg-gray-100 border-none shadow-sm" />
                <CarouselNext className="-right-3 h-7 w-7 bg-white hover:bg-gray-100 border-none shadow-sm" />
              </Carousel>
              
              <div className="mt-6 flex">
                <Button 
                  className="w-full bg-[#e5deff] hover:bg-[#e5deff]/80 text-[#6d4773] mt-2 py-6 rounded-xl"
                >
                  <div className="flex items-center justify-center w-full gap-2">
                    <div className="h-8 w-8">
                      <AuntyMascot />
                    </div>
                    <span>See More Matches from Aunty</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchView;
