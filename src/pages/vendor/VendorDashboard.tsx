
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TruckFront } from "lucide-react";

const VendorDashboard = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <PageHeader title="Pharmacy Dashboard" />
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Metro Pharmacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">123 Main Street, City</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-1">
                Open
              </div>
              <div className="text-xs">Delivery: 2-3 km radius</div>
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
              <p className="text-2xl font-bold">76</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <TruckFront className="mr-2 h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">12</p>
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
            <span>Active Orders (3)</span>
            <span>→</span>
          </Button>
          <Button 
            variant="default" 
            className="w-full mt-4"
            onClick={() => {
              const isOpen = true; // This would be a state toggle in real app
              // In real app, this would update status in the backend
              alert(isOpen ? "Store closed" : "Store opened");
            }}
          >
            Close Store
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default VendorDashboard;
