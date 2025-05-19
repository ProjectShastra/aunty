
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const location = useLocation();
  
  return (
    <div className="bg-[#faf3eb] shadow-sm py-2">
      <div className="container mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center gap-1",
                    location.pathname === "/" && "bg-[#e5deff] text-[#6d4773]"
                  )}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/signup">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center gap-1",
                    location.pathname === "/signup" && "bg-[#e5deff] text-[#6d4773]"
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>Sign Up</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/profile">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center gap-1",
                    location.pathname === "/profile" && "bg-[#e5deff] text-[#6d4773]"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/match">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center gap-1",
                    location.pathname === "/match" && "bg-[#e5deff] text-[#6d4773]"
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>Match</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default MainNav;
