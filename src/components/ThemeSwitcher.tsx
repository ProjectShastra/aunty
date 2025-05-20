
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/ThemeContext";
import { Check, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themes, ThemeName } from "@/theme/themeConfig";

const ThemeSwitcher = () => {
  const { setTheme, themeName } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(themes) as ThemeName[]).map((name) => (
          <DropdownMenuItem
            key={name}
            onClick={() => setTheme(name)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full border" 
                style={{ backgroundColor: themes[name].colors.primary }}
              />
              <span className="capitalize">{name}</span>
            </div>
            {themeName === name && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
