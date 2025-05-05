
import React, { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import PageHeader from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Save, X } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MedicineItem, useInventoryStore } from "@/hooks/use-inventory";
import { useAuth } from "@/hooks/use-auth";

const VendorInventory = () => {
  const { user } = useAuth();
  const { items, loading, fetchInventory, addMedicine, updateMedicine, updateStock } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MedicineItem | null>(null);
  
  // New or edited medicine form state
  const [medicineForm, setMedicineForm] = useState({
    id: "",
    name: "",
    price: 0,
    stock: 0,
    description: "",
    category: "",
    requiresPrescription: false
  });

  // Fetch inventory when component mounts
  useEffect(() => {
    if (user?.id && user.isVendor) {
      fetchInventory(user.id);
    }
  }, [user, fetchInventory]);

  const filteredInventory = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpdateStock = async (productId: string, newStock: number) => {
    if (newStock >= 0) {
      await updateStock(productId, newStock);
    }
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setMedicineForm({
      id: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      category: "",
      requiresPrescription: false
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MedicineItem) => {
    setEditingItem(item);
    setMedicineForm({
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      description: item.description || "",
      category: item.category || "",
      requiresPrescription: item.requiresPrescription
    });
    setDialogOpen(true);
  };

  const handleMedicineFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicineForm({
      ...medicineForm,
      [name]: name === "price" ? parseFloat(value) : 
              name === "stock" ? parseInt(value) : 
              value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicineForm({
      ...medicineForm,
      [e.target.name]: e.target.checked
    });
  };

  const saveMedicine = async () => {
    if (!medicineForm.name || medicineForm.price <= 0) {
      toast.error("Please provide a name and valid price");
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        await updateMedicine(editingItem.id, {
          name: medicineForm.name,
          price: medicineForm.price,
          stock: medicineForm.stock,
          description: medicineForm.description,
          category: medicineForm.category,
          requiresPrescription: medicineForm.requiresPrescription,
          vendorId: user!.id
        });
      } else {
        // Add new item
        if (!user || !user.isVendor) {
          toast.error("You must be logged in as a vendor to add medicines");
          return;
        }
        
        await addMedicine({
          name: medicineForm.name,
          price: medicineForm.price,
          stock: medicineForm.stock,
          description: medicineForm.description,
          category: medicineForm.category,
          requiresPrescription: medicineForm.requiresPrescription,
          vendorId: user.id
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
      toast.error("Failed to save medicine. Please try again.");
    }
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
          <Button size="icon" className="ml-2" onClick={openAddDialog}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {loading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="border rounded-md p-3 flex justify-between items-center"
              >
                <div className="w-2/3">
                  <div className="h-5 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="w-1/4">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery 
                ? "No products match your search." 
                : "No products in inventory. Add some medicines!"}
            </div>
          ) : (
            filteredInventory.map(item => (
              <div
                key={item.id}
                className="border rounded-md p-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">₹{item.price.toFixed(2)}</div>
                    {item.category && (
                      <div className="text-xs text-gray-400 mt-1">{item.category}</div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => openEditDialog(item)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div className="flex gap-2">
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
                    
                    {item.requiresPrescription && (
                      <Badge variant="secondary">Prescription</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        if (item.stock > 0) {
                          handleUpdateStock(item.id, item.stock - 1);
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
                      onClick={() => handleUpdateStock(item.id, item.stock + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Medicine" : "Add New Medicine"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={medicineForm.name}
                  onChange={handleMedicineFormChange}
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={medicineForm.price}
                    onChange={handleMedicineFormChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={medicineForm.stock}
                    onChange={handleMedicineFormChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={medicineForm.category}
                  onChange={handleMedicineFormChange}
                  placeholder="e.g., Pain Relief, Antibiotics"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={medicineForm.description}
                  onChange={handleMedicineFormChange}
                  placeholder="Brief description of the medicine"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="requiresPrescription"
                  name="requiresPrescription"
                  checked={medicineForm.requiresPrescription}
                  onChange={handleCheckboxChange}
                  className="rounded text-primary focus:ring-primary"
                />
                <Label htmlFor="requiresPrescription" className="cursor-pointer">
                  Requires Prescription
                </Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveMedicine}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
};

export default VendorInventory;
