
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";

// Mock inventory data - in a real app this would come from an API
const mockInventory = [
  { 
    id: "med1", 
    name: "Paracetamol 500mg", 
    price: 5.99, 
    stock: 120, 
    lowStock: false 
  },
  { 
    id: "med2", 
    name: "Ibuprofen 200mg", 
    price: 6.99, 
    stock: 85, 
    lowStock: false 
  },
  { 
    id: "med3", 
    name: "Cetirizine 10mg", 
    price: 8.49, 
    stock: 12, 
    lowStock: true 
  },
  { 
    id: "med4", 
    name: "Amoxicillin 250mg", 
    price: 12.99, 
    stock: 0, 
    lowStock: true 
  }
];

const VendorInventory = () => {
  const [inventory, setInventory] = React.useState(mockInventory);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStock = (productId: string, newStock: number) => {
    setInventory(inventory.map(item => 
      item.id === productId 
        ? { ...item, stock: newStock, lowStock: newStock < 15 } 
        : item
    ));
    
    toast.success("Inventory updated");
  };

  return (
    <MobileLayout>
      <PageHeader title="Inventory Management" showBackButton />
      <div className="p-4 space-y-4">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" className="ml-2" onClick={() => alert("Add new product")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found.
            </div>
          ) : (
            filteredInventory.map(item => (
              <div
                key={item.id}
                className="border rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                  <div className="flex gap-2 mt-1">
                    {item.stock === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : item.lowStock ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        Low Stock: {item.stock}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        In Stock: {item.stock}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (item.stock > 0) {
                        updateStock(item.id, item.stock - 1);
                      }
                    }}
                    disabled={item.stock <= 0}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{item.stock}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateStock(item.id, item.stock + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default VendorInventory;
