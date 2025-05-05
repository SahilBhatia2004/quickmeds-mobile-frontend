
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, MapPin, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState({
    products: 76,
    orders: 12,
    pendingOrders: 3
  });
  
  // Pharmacy info - in a real app this would come from an API
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: "Metro Pharmacy",
    address: "123 Main Street, City",
    deliveryRadius: 3
  });

  const toggleStoreStatus = () => {
    // In a real app, this would update the backend
    setIsOpen(!isOpen);
    
    toast.success(isOpen 
      ? "Store has been closed. You will not receive new orders." 
      : "Store is now open. You will receive orders in your delivery area."
    );
  };

  // In a real app, this would fetch real-time data
  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update numbers to simulate real-time changes
      if (Math.random() > 0.7) {
        setStats(prevStats => ({
          ...prevStats,
          orders: prevStats.orders + Math.floor(Math.random() * 2),
          pendingOrders: Math.max(1, Math.floor(Math.random() * 5))
        }));
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <MobileLayout>
      <PageHeader title="Pharmacy Dashboard" />
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{pharmacyInfo.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <p className="text-sm text-gray-500">{pharmacyInfo.address}</p>
            </div>
            
            <div className="flex items-center mt-3 justify-between">
              <div className="flex items-center space-x-4">
                <div className={`bg-${isOpen ? 'green' : 'red'}-100 text-${isOpen ? 'green' : 'red'}-800 text-xs rounded-full px-2 py-1`}>
                  {isOpen ? 'Open' : 'Closed'}
                </div>
                <div className="flex items-center text-xs text-gray-700">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Delivery: {pharmacyInfo.deliveryRadius} km radius</span>
                </div>
              </div>
              
              <Switch 
                checked={isOpen} 
                onCheckedChange={toggleStoreStatus}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">{stats.products}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Truck className="mr-2 h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">{stats.orders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-between flex items-center"
            onClick={() => navigate("/vendor/inventory")}
          >
            <span>Manage Inventory</span>
            <span>→</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between flex items-center"
            onClick={() => navigate("/vendor/active-orders")}
          >
            <span>Active Orders ({stats.pendingOrders})</span>
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {stats.pendingOrders}
            </span>
          </Button>
          <Button 
            variant={isOpen ? "destructive" : "default"}
            className="w-full mt-4"
            onClick={toggleStoreStatus}
          >
            {isOpen ? "Close Store" : "Open Store"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default VendorDashboard;
