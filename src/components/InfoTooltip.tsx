
import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

const InfoTooltip = ({ text, className }: InfoTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={`h-4 w-4 text-[#6d4773]/70 cursor-help hover:text-[#6d4773] transition-colors ${className}`} />
        </TooltipTrigger>
        <TooltipContent className="bg-white text-[#6d4773] border border-[#e45964]/20 max-w-xs shadow-sm">
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
