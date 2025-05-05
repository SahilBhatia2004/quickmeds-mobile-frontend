
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Stethoscope } from "lucide-react";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  
  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center h-[80vh] p-6">
        <h1 className="text-2xl font-bold mb-8">Welcome to QuickMeds</h1>
        <p className="text-center text-gray-500 mb-10">
          Please select how you want to use the app
        </p>
        
        <div className="space-y-6 w-full max-w-xs">
          <Button 
            variant="outline" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2"
            onClick={() => navigate("/user/login")}
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="font-medium">I want to buy medicines</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2 border-2"
            onClick={() => navigate("/vendor/login")}
          >
            <Stethoscope className="h-8 w-8" />
            <span className="font-medium">I'm a pharmacy owner</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default UserTypeSelection;
