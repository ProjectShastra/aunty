
import React from "react";
import CompatibilityBadge from "./CompatibilityBadge";

type ProfileCardUpdatedProps = {
  profile: {
    name: string;
    age: number;
    location: string;
    compatibility: number;
    imageUrl: string;
  };
};

const ProfileCardUpdated = ({ profile }: ProfileCardUpdatedProps) => {
  const { name, age, location, compatibility, imageUrl } = profile;

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-[#faf3eb]/30 transition-colors rounded-md">
      <div className="flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={name} 
          className="h-12 w-12 rounded-full object-cover border border-[#faf3eb]/50"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#6d4773]">{name}, {age}</h3>
            <p className="text-xs text-[#6d4773]/70">{location}</p>
          </div>
          <div>
            <CompatibilityBadge percentMatch={compatibility} showTooltip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardUpdated;
