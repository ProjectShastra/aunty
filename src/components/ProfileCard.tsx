
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProfileCardProps = {
  profile: {
    name: string;
    age: number;
    location: string;
    compatibility: number;
    imageUrl: string;
  };
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { name, age, location, compatibility, imageUrl } = profile;

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-purple-50 transition-colors">
      <div className="flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={name} 
          className="h-16 w-16 rounded-full object-cover border-2 border-purple-200"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{name}, {age}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-purple-700">{compatibility}%</span>
            <div className="w-20">
              <Progress value={compatibility} className="h-1.5 bg-gray-100" indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
