
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const MobileLayout = ({ children, hideNavigation = false }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { icon: User, label: "Account", path: "/account" },
  ];

  if (!isMobile) {
    return (
      <div className="max-w-md mx-auto border-x border-gray-200 min-h-screen flex flex-col">
        {children}
        {!hideNavigation && (
          <div className="mt-auto border-t border-gray-200 bg-white">
            <nav className="flex justify-around items-center h-16">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full",
                    location.pathname === item.path ? "text-primary" : "text-gray-500"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {children}
      {!hideNavigation && (
        <div className="mt-auto border-t border-gray-200 bg-white safe-area-bottom">
          <nav className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full",
                  location.pathname === item.path ? "text-primary" : "text-gray-500"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileLayout;
