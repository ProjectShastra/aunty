
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import CompatibilityBadge from "./CompatibilityBadge";

type Profile = {
  name: string;
  age: number;
  location: string;
  compatibility: number;
  imageUrl: string;
};

type ProfileCardsCarouselProps = {
  profiles: Profile[];
};

const ProfileCardsCarousel = ({ profiles }: ProfileCardsCarouselProps) => {
  return (
    <Card className="border-0 shadow-md overflow-hidden rounded-lg bg-white/90">
      <CardHeader className="bg-[#6d4773] text-[#faf3eb] py-3">
        <CardTitle className="text-base flex items-center gap-1.5">
          <Heart className="text-[#faf3eb] h-4 w-4" />
          <span>Potential Matches</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Carousel opts={{ loop: true }} className="mx-4 py-2">
          <CarouselContent>
            {profiles.map((profile, index) => (
              <CarouselItem key={index} className="p-1">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-[#faf3eb]/30">
                  <img 
                    src={profile.imageUrl} 
                    alt={profile.name} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-[#faf3eb] mb-3"
                  />
                  <h3 className="font-medium text-[#6d4773]">{profile.name}, {profile.age}</h3>
                  <p className="text-xs text-[#6d4773]/70 mb-2">{profile.location}</p>
                  <CompatibilityBadge percentMatch={profile.compatibility} showTooltip />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1 bg-white/80 hover:bg-white border-none" />
          <CarouselNext className="right-1 bg-white/80 hover:bg-white border-none" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default ProfileCardsCarousel;
