
import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/theme/ThemeContext";

interface InfoTooltipProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const InfoTooltip = ({ text, className, style }: InfoTooltipProps) => {
  const { currentTheme } = useTheme();
  const { colors } = currentTheme;
  
  const defaultStyle = {
    color: `${colors.primary}/70`,
  };
  
  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info 
            className={`h-4 w-4 cursor-help hover:text-opacity-100 transition-colors ${className}`}
            style={mergedStyle}
          />
        </TooltipTrigger>
        <TooltipContent 
          style={{
            backgroundColor: colors.background,
            color: colors.primary,
            borderColor: `${colors.border}`,
          }}
          className="max-w-xs shadow-sm"
        >
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
