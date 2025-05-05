
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { MapPin, Check, User, ShoppingCart } from "lucide-react";

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const [currentStep, setCurrentStep] = useState(2); // 0: confirmed, 1: preparing, 2: out for delivery, 3: delivered
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // When time reaches 0, complete delivery
          setCurrentStep(3);
          return 0;
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const deliverySteps = [
    {
      id: 0,
      title: "Order Confirmed",
      description: "Your order has been confirmed",
      icon: Check,
      time: "2:00 PM",
    },
    {
      id: 1,
      title: "Preparing Your Order",
      description: "Your medications are being prepared",
      icon: ShoppingCart,
      time: "2:03 PM",
    },
    {
      id: 2,
      title: "Out for Delivery",
      description: "Your order is on the way",
      icon: MapPin,
      time: "2:05 PM",
    },
    {
      id: 3,
      title: "Delivered",
      description: "Your order has been delivered",
      icon: User,
      time: "",
    },
  ];
  
  // Handle animating delivery progress
  const progressPercentage = Math.min(
    ((currentStep + 1) / deliverySteps.length) * 100,
    99
  );
  
  return (
    <MobileLayout>
      <PageHeader title="Track Order" showBackButton />
      
      <div className="p-4">
        {/* Order info */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-600">Order #{orderId}</p>
            <h2 className="text-lg font-semibold">3 items</h2>
          </div>
          
          {timeLeft > 0 ? (
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated arrival in</p>
              <span className="text-lg font-semibold text-primary">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-lg font-semibold text-green-600">Delivered</span>
            </div>
          )}
        </div>
        
        {/* Delivery person */}
        <div className="bg-blue-50/70 rounded-lg p-4 mb-6 border border-blue-100">
          <div className="flex items-center">
            <div className="h-14 w-14 bg-gray-200 rounded-full overflow-hidden mr-3">
              {/* Delivery person image */}
              <div className="h-full w-full flex items-center justify-center bg-primary text-white font-bold">
                JD
              </div>
            </div>
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-sm text-gray-600">Your delivery partner</p>
            </div>
          </div>
        </div>
        
        {/* Progress tracker */}
        <div className="mb-6 relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
          
          {deliverySteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isActive = index === currentStep;
            
            return (
              <div key={step.id} className="flex mb-5 relative">
                <div 
                  className={`rounded-full w-8 h-8 flex items-center justify-center mr-4 ${
                    isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                  } ${isActive ? 'animate-pulse' : ''}`}
                >
                  <step.icon size={16} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className={`font-medium ${isCompleted ? 'text-primary' : 'text-gray-600'}`}>
                      {step.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {index === 3 && currentStep === 3 
                        ? "2:15 PM" 
                        : step.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order summary */}
        <div>
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3 divide-y divide-gray-200">
              <div className="flex justify-between">
                <span className="text-sm">Paracetamol 500mg (x1)</span>
                <span className="text-sm font-medium">$5.99</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-sm">Vitamin C 1000mg (x1)</span>
                <span className="text-sm font-medium">$12.99</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-sm">Hand Sanitizer Gel (x1)</span>
                <span className="text-sm font-medium">$3.99</span>
              </div>
              <div className="pt-3">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">$22.97</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">Delivery Fee</span>
                  <span className="text-sm font-medium">$2.99</span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">$25.96</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default TrackOrderPage;
