
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { User, MapPin, Clock, Bell, CreditCard, Phone, ArrowRight, LogOut } from "lucide-react";

const AccountPage = () => {
  const navigate = useNavigate();
  const name = "John Doe";

  const menuItems = [
    { 
      icon: MapPin, 
      label: "Saved Addresses", 
      onClick: () => navigate('/addresses') 
    },
    { 
      icon: Clock, 
      label: "Order History", 
      onClick: () => navigate('/orders') 
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      onClick: () => navigate('/notifications'),
      badge: 2
    },
    { 
      icon: CreditCard, 
      label: "Payment Methods", 
      onClick: () => navigate('/payment-methods') 
    },
    { 
      icon: Phone, 
      label: "Help & Support", 
      onClick: () => navigate('/support') 
    }
  ];

  return (
    <MobileLayout>
      <PageHeader title="Account" />
      
      {/* Profile preview */}
      <div className="p-4 mb-4">
        <div className="flex items-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <User size={30} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <button 
              className="text-sm text-primary"
              onClick={() => navigate('/edit-profile')}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu items */}
      <div className="bg-gray-50 px-4 py-2">
        <div className="divide-y divide-gray-200">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center justify-between w-full py-4"
              onClick={item.onClick}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <item.icon size={16} className="text-gray-600" />
                </div>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <span className="mr-2 bg-primary text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            </button>
          ))}
          
          <button
            className="flex items-center w-full py-4 text-red-500"
            onClick={() => navigate('/login')}
          >
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
              <LogOut size={16} className="text-red-500" />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AccountPage;
