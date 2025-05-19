
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type CompatibilityLevel = "Soulmate Connection" | "High Affinity" | "Strong Compatibility" | "Moderate Alignment" | "Potential Match";

type CompatibilityBadgeProps = {
  percentMatch: number;
  showTooltip?: boolean;
};

const getCompatibilityLevel = (percentMatch: number): CompatibilityLevel => {
  if (percentMatch >= 90) return "Soulmate Connection";
  if (percentMatch >= 80) return "High Affinity";
  if (percentMatch >= 70) return "Strong Compatibility";
  if (percentMatch >= 60) return "Moderate Alignment";
  return "Potential Match";
};

const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ percentMatch, showTooltip = false }) => {
  const compatibilityLevel = getCompatibilityLevel(percentMatch);
  
  const badge = (
    <span className="text-xs font-medium text-[#6d4773] bg-[#faf3eb] px-2 py-1 rounded-md">
      {compatibilityLevel}
    </span>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="bg-white text-[#6d4773] border border-[#e45964]/20">
          <p className="text-xs">{percentMatch}% match based on Vedic compatibility</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompatibilityBadge;
