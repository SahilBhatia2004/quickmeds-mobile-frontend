
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store, Users } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <PageHeader title="Admin Dashboard" />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Store className="mr-2 h-4 w-4" />
                Pharmacies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">568</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">156</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-3">
              <CardTitle className="text-sm flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold">1.2k</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-between flex items-center"
            onClick={() => navigate("/admin/pharmacies")}
          >
            <span>Manage Pharmacies</span>
            <span>→</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between flex items-center"
            onClick={() => navigate("/admin/products")}
          >
            <span>Manage Products</span>
            <span>→</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between flex items-center"
            onClick={() => navigate("/admin/orders")}
          >
            <span>View Orders</span>
            <span>→</span>
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AdminDashboard;
