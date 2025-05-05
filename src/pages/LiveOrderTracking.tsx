
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import DeliveryMap from "@/components/maps/DeliveryMap";
import { useOrderTracking, startOrderSimulation } from "@/hooks/use-order-tracking";
import { CheckCircle2, Clock, Truck, ChefHat, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const LiveOrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { activeOrders, pastOrders } = useOrderTracking();
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  
  // Find the order in either active or past orders
  const allOrders = [...activeOrders, ...pastOrders];
  const order = allOrders.find(o => o.id === orderId);
  
  // Start simulation when component mounts
  useEffect(() => {
    if (order && order.status === 'pending') {
      const stopSimulation = startOrderSimulation(order.id);
      return () => {
        if (stopSimulation) stopSimulation();
      };
    }
  }, [order]);
  
  // Set up periodic refreshing for active orders
  useEffect(() => {
    if (order && ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)) {
      const interval = window.setInterval(() => {
        // This would normally fetch updated order status from the backend
        console.log("Refreshing order status...");
      }, 15000);
      
      setRefreshInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [order]);
  
  if (!order) {
    return (
      <MobileLayout>
        <PageHeader title="Order Tracking" showBackButton />
        <div className="p-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
          <h2 className="text-xl font-semibold">Order Not Found</h2>
          <p className="text-gray-500 mt-2">We couldn't find the order you're looking for</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/account')}
          >
            View Your Orders
          </Button>
        </div>
      </MobileLayout>
    );
  }
  
  const getProgressPercentage = () => {
    switch (order.status) {
      case 'pending': return 10;
      case 'confirmed': return 30;
      case 'preparing': return 50;
      case 'out_for_delivery': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };
  
  const getStatusText = () => {
    switch (order.status) {
      case 'pending': return "Waiting for pharmacy to confirm";
      case 'confirmed': return "Order confirmed, preparing your items";
      case 'preparing': return "Pharmacy is preparing your items";
      case 'out_for_delivery': return "Your order is on its way";
      case 'delivered': return "Order delivered successfully";
      case 'cancelled': return "Order was cancelled";
      default: return "Unknown status";
    }
  };
  
  return (
    <MobileLayout>
      <PageHeader title="Order Tracking" showBackButton />
      
      <div className="p-4 space-y-4">
        <div className="rounded-lg overflow-hidden border">
          <div className="bg-primary-50 p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{order.id.substring(6, 12)}</h3>
                <p className="text-sm text-gray-500">
                  {order.pharmacyName}
                </p>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status.replace('_', ' ')}
              </div>
            </div>
            
            {order.status !== 'cancelled' && (
              <div className="mt-3">
                <Progress value={getProgressPercentage()} className="h-2" />
                <p className="text-xs text-gray-600 mt-1">{getStatusText()}</p>
              </div>
            )}
          </div>
          
          <div className="p-3">
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.status !== 'pending' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="w-[2px] h-6 bg-gray-200 my-1"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Clock className="h-5 w-5" />
                </div>
                <div className="w-[2px] h-6 bg-gray-200 my-1"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['preparing', 'out_for_delivery', 'delivered'].includes(order.status) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <ChefHat className="h-5 w-5" />
                </div>
                <div className="w-[2px] h-6 bg-gray-200 my-1"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ['out_for_delivery', 'delivered'].includes(order.status) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Truck className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex flex-col justify-between pt-1">
                <div className="h-8 flex items-center">
                  <span className={order.status !== 'pending' ? 'font-medium' : 'text-gray-500'}>
                    Order Received
                  </span>
                </div>
                <div className="h-8 flex items-center">
                  <span className={['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(order.status) ? 'font-medium' : 'text-gray-500'}>
                    Order Confirmed
                  </span>
                </div>
                <div className="h-8 flex items-center">
                  <span className={['preparing', 'out_for_delivery', 'delivered'].includes(order.status) ? 'font-medium' : 'text-gray-500'}>
                    Preparing Order
                  </span>
                </div>
                <div className="h-8 flex items-center">
                  <span className={['out_for_delivery', 'delivered'].includes(order.status) ? 'font-medium' : 'text-gray-500'}>
                    Out For Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[35vh] rounded-lg overflow-hidden border">
          <DeliveryMap
            pharmacyLocation={order.pharmacyLocation}
            customerLocation={order.deliveryLocation}
            deliveryPersonLocation={order.deliveryPerson?.currentLocation}
            height="100%"
          />
        </div>
        
        {order.deliveryPerson && (
          <div className="border rounded-lg p-3">
            <h3 className="font-medium mb-2">Delivery Partner</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{order.deliveryPerson.name}</p>
                <p className="text-sm text-gray-500">{order.deliveryPerson.phone}</p>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  // In a real app, this would use the device's phone capabilities
                  toast.success(`Calling ${order.deliveryPerson.name}...`);
                }}
              >
                Call
              </Button>
            </div>
          </div>
        )}
        
        <Separator />
        
        <div>
          <h3 className="font-medium mb-3">Order Items</h3>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between py-1">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">{item.quantity}x</span>
                <span>{item.name}</span>
              </div>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="flex justify-between font-medium mt-3 pt-3 border-t">
            <span>Total</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default LiveOrderTracking;
