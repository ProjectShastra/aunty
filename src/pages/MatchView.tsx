import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Heart, ChevronDown } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import AuntyMascot from "@/components/AuntyMascot";
import InfoTooltip from "@/components/InfoTooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "@/theme/ThemeContext";

// Sample match data (would come from API/props in real app)
const matchData = {
  id: "1",
  name: "Priya",
  age: 28,
  location: "Mumbai",
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  compatibilityTags: [
    { 
      tag: "Strong Communication", 
      explanation: "Your Venus and Jupiter are in harmony, creating a clear communication channel",
      icon: MessageCircle
    },
    { 
      tag: "Emotional Sync", 
      explanation: "Moon signs in friendly nakshatras promote deep emotional understanding",
      icon: Heart 
    },
    { 
      tag: "Shared Alignment", 
      explanation: "Similar life paths and complementary Saturn placements",
      icon: Star 
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
  ],
  conversationStarters: [
    "Your chart says you're a great listener — is that true?",
    "What's your love language — or do you just speak vibes?",
    "Would you rather talk astrology, art, or what you made for dinner?"
  ]
};

const MatchView = () => {
  const [showConversationStarters, setShowConversationStarters] = useState(false);
  const { currentTheme } = useTheme();
  const { colors } = currentTheme;

  const getThemedClasses = (baseClass: string) => {
    switch (currentTheme.name) {
      case 'earth':
        return baseClass.replace(/\[#[0-9a-fA-F]+\]/g, '');
      case 'mystical':
        return baseClass.replace(/\[#[0-9a-fA-F]+\]/g, '');
      default:
        return baseClass;
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6" 
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-3">
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.primary
            }}
          >
            Your Match Map
          </div>
          <ThemeSwitcher />
        </div>
        <h1 
          className={`text-2xl md:text-3xl font-light mb-2 ${currentTheme.typography === 'playful' ? 'font-sans' : 'font-serif'}`}
          style={{ color: colors.primary }}
        >
          Your Aligned Match
        </h1>
        <p style={{ color: colors.textMuted }}>
          Compatibility backed by 5,000 years of insight
        </p>
      </div>

      <Card className="overflow-hidden border-0 shadow-md rounded-2xl mb-6" 
        style={{ backgroundColor: `${colors.background}/90` }}
      >
        <CardContent className="p-0">
          <div className="flex flex-col">
            {/* Profile Image Section */}
            <div 
              className="p-6 flex flex-col items-center"
              style={{ backgroundColor: `${colors.cardBg}/50` }}
            >
              <div className="relative">
                <Avatar 
                  className="h-28 w-28 mb-4 border-2" 
                  style={{ borderColor: colors.highlight }}
                >
                  <AvatarImage src={matchData.imageUrl} alt={matchData.name} />
                  <AvatarFallback 
                    style={{ 
                      backgroundColor: `${colors.secondary}/10`, 
                      color: colors.primary 
                    }}
                  >
                    {matchData.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 right-0 bg-white p-1 rounded-full">
                  <InfoTooltip 
                    text="Based on your combined planetary positions and elements" 
                    className="h-5 w-5"
                    style={{ color: colors.primary }}
                  />
                </div>
              </div>
              <h2 
                className="text-xl font-medium"
                style={{ color: colors.primary }}
              >
                {matchData.name}, {matchData.age}
              </h2>
              <p style={{ color: colors.textMuted }} className="text-sm mb-3">{matchData.location}</p>
              
              {/* Astrological Highlights - Now more human focused */}
              <div className="mt-2 space-y-2 w-full">
                {matchData.astrologyHighlights.map((highlight, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-lg p-3 text-sm text-center"
                    style={{ 
                      backgroundColor: `${colors.background}/70`,
                      color: colors.primary 
                    }}
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Compatibility points with icons */}
              <h3 
                className="text-sm font-medium mb-3 flex items-center gap-2"
                style={{ color: colors.primary }}
              >
                Key Alignment Points
                <InfoTooltip text="These areas show your strongest compatibility potentials" />
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {matchData.compatibilityTags.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <Badge 
                          className="hover:bg-opacity-80 border-0 cursor-help flex items-center gap-1.5 py-1.5"
                          style={{ 
                            backgroundColor: colors.highlight,
                            color: colors.primary
                          }}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                          {item.tag}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent 
                        className="border w-64"
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.primary,
                          borderColor: `${colors.border}` 
                        }}
                      >
                        <p className="text-sm">{item.explanation}</p>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>

              <Separator className="my-5" style={{ backgroundColor: colors.cardBg }} />
              
              {/* Aunty's Insights Carousel */}
              <div className="flex items-center mb-4">
                <h3 
                  className="text-base font-medium"
                  style={{ color: colors.primary }}
                >
                  Compatibility Insights
                </h3>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {matchData.auntysInsights.map((insight, index) => (
                    <CarouselItem key={index}>
                      <div 
                        className="rounded-xl p-4 text-center relative"
                        style={{ backgroundColor: `${colors.cardBg}/60` }}
                      >
                        <div 
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 rounded-full p-1 shadow-sm"
                          style={{ backgroundColor: colors.background }}
                        >
                          <div 
                            className="h-6 w-6 rounded-full flex items-center justify-center font-medium"
                            style={{ 
                              backgroundColor: colors.highlight,
                              color: colors.primary
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <p 
                          className="text-sm mt-3"
                          style={{ color: colors.primary }}
                        >
                          "{insight}"
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious 
                  className="-left-3 h-7 w-7 border-none shadow-sm" 
                  style={{ 
                    backgroundColor: colors.background,
                    color: colors.primary 
                  }}
                />
                <CarouselNext 
                  className="-right-3 h-7 w-7 border-none shadow-sm" 
                  style={{ 
                    backgroundColor: colors.background,
                    color: colors.primary 
                  }}
                />
              </Carousel>
              
              {/* CTA Button */}
              <div className="mt-6 flex">
                <Button 
                  className="w-full mt-2 py-6 rounded-xl"
                  style={{ 
                    backgroundColor: colors.highlight,
                    color: colors.primary
                  }}
                >
                  <div className="flex items-center justify-center w-full gap-2">
                    <div className="h-8 w-8">
                      <AuntyMascot />
                    </div>
                    <span>See More Compatible Matches</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible for conversation starters */}
      <Collapsible 
        className="rounded-lg border shadow-sm mb-6"
        open={showConversationStarters}
        onOpenChange={setShowConversationStarters}
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.highlight
        }}
      >
        <CollapsibleTrigger 
          className="flex w-full items-center justify-between p-4"
          style={{ color: colors.primary }}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">Not sure how to start? Let Aunty suggest an opener</span>
          </div>
          <ChevronDown className={`h-5 w-5 transform transition-transform ${showConversationStarters ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {matchData.conversationStarters.map((starter, index) => (
              <div 
                key={index} 
                className="p-3 rounded-md cursor-pointer transition-colors hover:bg-opacity-80"
                style={{ 
                  backgroundColor: `${colors.cardBg}/50`,
                  color: colors.primary
                }}
              >
                {starter}
              </div>
            ))}
            <p 
              className="text-xs italic pt-2"
              style={{ color: colors.textMuted }}
            >
              "Start soft, stay curious. Cosmic chemistry begins with conversation."
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Conflict Window Warning */}
      <Alert 
        className="mb-4 border"
        style={{ 
          backgroundColor: `${colors.secondary}/10`,
          borderColor: `${colors.secondary}/20`
        }}
      >
        <AlertTitle 
          className="flex items-center gap-1.5"
          style={{ color: colors.secondary }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Heads up — energies might be intense this week
        </AlertTitle>
        <AlertDescription 
          className="text-sm"
          style={{ color: colors.primary }}
        >
          Mars is creating some tension. Take extra care with communication until May 25th.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MatchView;
