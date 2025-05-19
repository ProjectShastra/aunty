
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileCardUpdated from "./ProfileCardUpdated";
import { Heart } from "lucide-react";

type Profile = {
  name: string;
  age: number;
  location: string;
  compatibility: number;
  imageUrl: string;
};

type ProfileCardsListProps = {
  profiles: Profile[];
};

const ProfileCardsList = ({ profiles }: ProfileCardsListProps) => {
  return (
    <Card className="border-0 shadow-md overflow-hidden rounded-lg bg-white/90">
      <CardHeader className="bg-[#6d4773] text-[#faf3eb] py-3">
        <CardTitle className="text-base flex items-center gap-1.5">
          <Heart className="text-[#faf3eb] h-4 w-4" />
          <span>Potential Matches</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-1 divide-y divide-[#faf3eb]/30">
        {profiles.map((profile, index) => (
          <div key={index} className={index > 0 ? "pt-1" : ""}>
            <ProfileCardUpdated profile={profile} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProfileCardsList;
