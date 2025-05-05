
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Check, Home, Clock, MapPin } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleTrackOrder = () => {
    navigate('/track-order');
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <MobileLayout hideNavigation>
      <PageHeader title="Order Confirmed" />
      
      <div className="flex flex-col items-center p-6 text-center">
        {/* Success animation */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-pulse-light">
          <Check size={40} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">Your order has been confirmed</p>
        <p className="font-medium text-gray-800 mb-6">Order #{orderId}</p>
        
        {/* Estimated delivery */}
        <div className="w-full bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Clock size={20} className="text-primary mr-2" />
            <h2 className="font-semibold">Estimated delivery</h2>
          </div>
          <div className="text-xl font-bold">{formatTime(timeLeft)}</div>
          <p className="text-sm text-gray-600">Your medications are on the way</p>
        </div>
        
        {/* Delivery details */}
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex items-start mb-3">
            <MapPin size={18} className="text-gray-600 mr-2 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium text-sm">Delivery Address</h3>
              <p className="text-sm text-gray-600">123 Main St, Apt 4, New York, NY 10001</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock size={18} className="text-gray-600 mr-2 mt-0.5" />
            <div className="text-left">
              <h3 className="font-medium text-sm">Delivery Option</h3>
              <p className="text-sm text-gray-600">Express Delivery (10 minutes)</p>
            </div>
          </div>
        </div>
        
        <Button onClick={handleTrackOrder} className="w-full mb-3">
          Track Order
        </Button>
        
        <Button variant="outline" onClick={handleGoHome} className="w-full">
          <Home size={16} className="mr-2" />
          Back to Home
        </Button>
      </div>
    </MobileLayout>
  );
};

export default OrderConfirmation;
